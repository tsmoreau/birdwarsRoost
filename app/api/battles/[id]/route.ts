import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle, IUnit, IBlockedTile } from '@/models/Battle';
import { Device } from '@/models/Device';
import { Turn } from '@/models/Turn';
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

function initializeCurrentStateFromMapData(
  mapData: Record<string, unknown>,
  player1DeviceId: string,
  player2DeviceId: string
): { units: IUnit[]; blockedTiles: IBlockedTile[] } {
  const units: IUnit[] = [];
  const blockedTiles: IBlockedTile[] = [];

  const unitPlacements = mapData.unitPlacement as Array<{
    birdType: string;
    gridX: number;
    gridZ: number;
    player?: number;
  }> | undefined;

  if (unitPlacements && Array.isArray(unitPlacements)) {
    unitPlacements.forEach((placement, index) => {
      const owner = placement.player === 2 ? player2DeviceId : player1DeviceId;
      units.push({
        unitId: `${owner}_u${index}`,
        type: placement.birdType || 'BIRD1',
        x: placement.gridX,
        y: placement.gridZ,
        hp: 10,
        owner
      });
    });
  }

  const itemPlacements = mapData.itemPlacement as Array<{
    itemType: string;
    gridX: number;
    gridZ: number;
    canMoveOn?: boolean;
  }> | undefined;

  if (itemPlacements && Array.isArray(itemPlacements)) {
    itemPlacements.forEach((item) => {
      if (item.canMoveOn === false) {
        blockedTiles.push({
          x: item.gridX,
          y: item.gridZ,
          itemType: item.itemType
        });
      }
    });
  }

  return { units, blockedTiles };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const battle = await Battle.findOne({ battleId: id });

    if (!battle) {
      return NextResponse.json({
        success: false,
        error: 'Battle not found',
      }, { status: 404 });
    }

    const [turns, playerInfoMap] = await Promise.all([
      Turn.find({ battleId: id }).sort({ turnNumber: 1 }),
      getPlayerInfo([battle.player1DeviceId, battle.player2DeviceId])
    ]);

    const p1Info = playerInfoMap.get(battle.player1DeviceId);
    const p2Info = battle.player2DeviceId ? playerInfoMap.get(battle.player2DeviceId) : null;
    const battleObj = battle.toObject();

    const battleWithPlayerInfo = {
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
      mapData: battleObj.mapData,
      currentState: battleObj.currentState,
    };

    return NextResponse.json({
      success: true,
      battle: battleWithPlayerInfo,
      turns,
    });
  } catch (error) {
    console.error('Fetch battle error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch battle',
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return unauthorizedResponse('Device authentication required');
    }

    const { id } = await params;
    await connectToDatabase();

    const battle = await Battle.findOne({ battleId: id });

    if (!battle) {
      return NextResponse.json({
        success: false,
        error: 'Battle not found',
      }, { status: 404 });
    }

    if (battle.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Battle is not in pending state',
      }, { status: 400 });
    }

    if (battle.player1DeviceId === auth.deviceId) {
      return NextResponse.json({
        success: false,
        error: 'Cannot join your own battle',
      }, { status: 400 });
    }

    battle.player2DeviceId = auth.deviceId;
    battle.status = 'active';
    battle.updatedAt = new Date();
    battle.lastTurnAt = new Date();

    const initialState = initializeCurrentStateFromMapData(
      battle.mapData,
      battle.player1DeviceId,
      auth.deviceId
    );
    battle.currentState = initialState;

    await battle.save();

    return NextResponse.json({
      success: true,
      battle: {
        battleId: battle.battleId,
        status: battle.status,
        currentTurn: battle.currentTurn,
        player1DeviceId: battle.player1DeviceId,
        player2DeviceId: battle.player2DeviceId,
        currentState: battle.currentState,
      },
      message: 'Joined battle successfully. Battle is now active.',
    });

  } catch (error) {
    console.error('Join battle error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to join battle',
    }, { status: 500 });
  }
}
