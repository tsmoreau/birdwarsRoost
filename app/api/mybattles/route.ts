import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle, IBattleDocument } from '@/models/Battle';
import { Device } from '@/models/Device';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';

interface PlayerInfo {
  displayName: string;
  avatar: string;
}

async function getPlayerInfo(deviceIds: (string | null)[]): Promise<Map<string, PlayerInfo>> {
  const validIds = deviceIds.filter((id): id is string => id !== null);
  if (validIds.length === 0) return new Map();
  
  const devices = await Device.find({ deviceId: { $in: validIds } });
  const map = new Map<string, PlayerInfo>();
  
  for (const device of devices) {
    map.set(device.deviceId, {
      displayName: device.displayName || 'Unknown Player',
      avatar: device.avatar || 'BIRD1'
    });
  }
  
  return map;
}

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

    const allPlayerIds = updatedBattles.flatMap(b => [b.player1DeviceId, b.player2DeviceId]);
    const playerInfoMap = await getPlayerInfo(allPlayerIds);

    const battlesWithPlayerInfo = updatedBattles.map(battle => {
      const battleObj = battle.toObject();
      const p1Info = playerInfoMap.get(battle.player1DeviceId);
      const p2Info = battle.player2DeviceId ? playerInfoMap.get(battle.player2DeviceId) : null;
      
      return {
        _id: battleObj._id,
        battleId: battleObj.battleId,
        displayName: battleObj.displayName,
        player1DeviceId: battleObj.player1DeviceId,
        player1DisplayName: p1Info?.displayName || 'Unknown Player',
        player1Avatar: p1Info?.avatar || 'BIRD1',
        player2DeviceId: battleObj.player2DeviceId,
        player2DisplayName: p2Info?.displayName || null,
        player2Avatar: p2Info?.avatar || null,
        status: battleObj.status,
        currentTurn: battleObj.currentTurn,
        currentPlayerIndex: battleObj.currentPlayerIndex,
        winnerId: battleObj.winnerId,
        endReason: battleObj.endReason,
        lastTurnAt: battleObj.lastTurnAt,
        createdAt: battleObj.createdAt,
        updatedAt: battleObj.updatedAt,
        isPrivate: battleObj.isPrivate,
      };
    });

    return NextResponse.json({
      success: true,
      battles: battlesWithPlayerInfo,
      count: battlesWithPlayerInfo.length,
    });
  } catch (error) {
    console.error('Fetch my battles error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch battles',
    }, { status: 500 });
  }
}
