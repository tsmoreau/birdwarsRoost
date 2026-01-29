import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Turn } from '@/models/Turn';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id: turnId } = await params;

    if (!turnId) {
      return NextResponse.json({
        success: false,
        error: 'Turn ID is required',
      }, { status: 400 });
    }

    const turn = await Turn.findOne({ turnId });

    if (!turn) {
      return NextResponse.json({
        success: false,
        error: 'Turn not found',
      }, { status: 404 });
    }

    const battle = await Battle.findOne({ battleId: turn.battleId });

    return NextResponse.json({
      success: true,
      turn: {
        turnId: turn.turnId,
        battleId: turn.battleId,
        deviceId: turn.deviceId,
        turnNumber: turn.turnNumber,
        actions: turn.actions,
        timestamp: turn.timestamp,
        isValid: turn.isValid,
        validationErrors: turn.validationErrors,
        gameState: turn.gameState,
      },
      battle: battle ? {
        battleId: battle.battleId,
        displayName: battle.displayName,
        player1DeviceId: battle.player1DeviceId,
        player1DisplayName: battle.player1DisplayName,
        player1Avatar: battle.player1Avatar,
        player2DeviceId: battle.player2DeviceId,
        player2DisplayName: battle.player2DisplayName,
        player2Avatar: battle.player2Avatar,
        status: battle.status,
        currentTurn: battle.currentTurn,
      } : null,
    });
  } catch (error) {
    console.error('Fetch turn error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch turn',
    }, { status: 500 });
  }
}
