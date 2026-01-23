import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle, IBattleDocument } from '@/models/Battle';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';

const FORFEIT_TIMEOUT_DAYS = 7;

async function checkAndProcessForfeits(
  battles: IBattleDocument[],
  callerDeviceId: string
): Promise<void> {
  const now = new Date();
  const timeoutMs = FORFEIT_TIMEOUT_DAYS * 24 * 60 * 60 * 1000;

  for (const battle of battles) {
    if (battle.status !== 'active') continue;
    if (!battle.player1DeviceId || !battle.player2DeviceId) continue;

    const lastActivity = battle.lastTurnAt || battle.updatedAt;
    const timeSinceLastTurn = now.getTime() - new Date(lastActivity).getTime();

    if (timeSinceLastTurn < timeoutMs) continue;

    const players = [battle.player1DeviceId, battle.player2DeviceId];
    const currentTurnPlayer = players[battle.currentPlayerIndex];

    if (currentTurnPlayer) {
      const winner = currentTurnPlayer === battle.player1DeviceId 
        ? battle.player2DeviceId 
        : battle.player1DeviceId;

      battle.status = 'completed';
      battle.winnerId = winner;
      battle.endReason = 'forfeit';
      battle.updatedAt = now;
      await battle.save();
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return unauthorizedResponse('Device authentication required');
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const query: Record<string, unknown> = {
      $or: [
        { player1DeviceId: auth.deviceId },
        { player2DeviceId: auth.deviceId }
      ]
    };

    if (statusFilter && ['pending', 'active', 'completed', 'abandoned'].includes(statusFilter)) {
      query.status = statusFilter;
    }

    const battles = await Battle.find(query)
      .sort({ updatedAt: -1 })
      .limit(100);

    await checkAndProcessForfeits(battles, auth.deviceId);

    const updatedBattles = await Battle.find(query)
      .sort({ updatedAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      battles: updatedBattles,
      count: updatedBattles.length,
    });
  } catch (error) {
    console.error('Fetch my battles error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch battles',
    }, { status: 500 });
  }
}
