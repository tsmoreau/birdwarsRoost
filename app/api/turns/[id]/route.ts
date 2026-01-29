import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Turn } from '@/models/Turn';
import { Device } from '@/models/Device';

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

    if (!battle) {
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
        battle: null,
      });
    }

    const playerInfoMap = await getPlayerInfo([battle.player1DeviceId, battle.player2DeviceId]);
    const p1Info = playerInfoMap.get(battle.player1DeviceId);
    const p2Info = battle.player2DeviceId ? playerInfoMap.get(battle.player2DeviceId) : null;

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
      battle: {
        battleId: battle.battleId,
        displayName: battle.displayName || null,
        player1DeviceId: battle.player1DeviceId,
        player1DisplayName: p1Info?.displayName || 'Unknown Player',
        player1Avatar: p1Info?.avatar || 'BIRD1',
        player2DeviceId: battle.player2DeviceId || null,
        player2DisplayName: p2Info?.displayName || null,
        player2Avatar: p2Info?.avatar || null,
        status: battle.status,
        currentTurn: battle.currentTurn,
      },
    });
  } catch (error) {
    console.error('Fetch turn error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch turn',
    }, { status: 500 });
  }
}
