import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Device } from '@/models/Device';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';
import { generateSecureToken } from '@/lib/auth';
import { generateBattleName } from '@/lib/battleNames';
import { z } from 'zod';

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

const createBattleSchema = z.object({
  mapData: z.record(z.unknown()).optional(),
  isPrivate: z.boolean().optional(),
});

export async function GET() {
  try {
    await connectToDatabase();

    const battles = await Battle.find({ isPrivate: { $ne: true } })
      .sort({ updatedAt: -1 })
      .limit(50);

    const allPlayerIds = battles.flatMap(b => [b.player1DeviceId, b.player2DeviceId]);
    const playerInfoMap = await getPlayerInfo(allPlayerIds);

    const battlesWithPlayerInfo = battles.map(battle => {
      const battleObj = battle.toObject();
      const p1Info = playerInfoMap.get(battle.player1DeviceId);
      const p2Info = battle.player2DeviceId ? playerInfoMap.get(battle.player2DeviceId) : null;
      
      return {
        battleId: battleObj.battleId,
        displayName: battleObj.displayName,
        player1DeviceId: battleObj.player1DeviceId,
        player2DeviceId: battleObj.player2DeviceId,
        player1DisplayName: p1Info?.displayName || 'Unknown Player',
        player1Avatar: p1Info?.avatar || 'BIRD1',
        player2DisplayName: p2Info?.displayName || null,
        player2Avatar: p2Info?.avatar || null,
        status: battleObj.status,
        currentTurn: battleObj.currentTurn,
        currentPlayerIndex: battleObj.currentPlayerIndex,
        isPrivate: battleObj.isPrivate,
        lastTurnAt: battleObj.lastTurnAt,
        mapName: battleObj.mapData?.selection || 'Unknown Map',
      };
    });

    return NextResponse.json({
      success: true,
      battles: battlesWithPlayerInfo,
    });
  } catch (error) {
    console.error('Fetch battles error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch battles',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return unauthorizedResponse('Device authentication required');
    }

    await connectToDatabase();

    const body = await request.json().catch(() => ({}));
    
    const parsed = createBattleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
        details: parsed.error.issues,
      }, { status: 400 });
    }

    const { mapData, isPrivate } = parsed.data;

    const battleId = generateSecureToken().substring(0, 16);
    const displayName = generateBattleName(battleId);

    const battle = new Battle({
      battleId,
      displayName,
      player1DeviceId: auth.deviceId,
      player2DeviceId: null,
      status: 'pending',
      currentTurn: 0,
      currentPlayerIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      winnerId: null,
      mapData: mapData || {},
      isPrivate: isPrivate || false,
    });

    await battle.save();

    return NextResponse.json({
      success: true,
      battle: {
        battleId: battle.battleId,
        displayName: battle.displayName,
        status: battle.status,
        currentTurn: battle.currentTurn,
        isPrivate: battle.isPrivate,
      },
      message: battle.isPrivate 
        ? 'Private battle created. Share the battleId with your opponent to join.'
        : 'Battle created. Waiting for opponent to join.',
    }, { status: 201 });

  } catch (error) {
    console.error('Create battle error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create battle',
    }, { status: 500 });
  }
}
