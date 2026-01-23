import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle, IUnit, IBlockedTile } from '@/models/Battle';
import { Turn } from '@/models/Turn';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';

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

    const turns = await Turn.find({ battleId: id })
      .sort({ turnNumber: 1 });

    return NextResponse.json({
      success: true,
      battle,
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
