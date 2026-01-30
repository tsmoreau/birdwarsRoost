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
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor');

    const isPaginated = limitParam !== null || cursor !== null;
    const limit = isPaginated 
      ? Math.min(Math.max(1, parseInt(limitParam || '9', 10)), 50)
      : null;

    const baseQuery: Record<string, unknown> = {
      $or: [
        { player1DeviceId: auth.deviceId },
        { player2DeviceId: auth.deviceId }
      ]
    };

    if (statusFilter && ['pending', 'active', 'completed', 'abandoned'].includes(statusFilter)) {
      baseQuery.status = statusFilter;
    }

    const allActiveBattles = await Battle.find({
      ...baseQuery,
      status: 'active',
    });
    await checkAndProcessForfeits(allActiveBattles, auth.deviceId);

    const paginatedQuery = { ...baseQuery };

    if (cursor) {
      try {
        const { lastId } = JSON.parse(Buffer.from(cursor, 'base64').toString());
        const mongoose = await import('mongoose');
        paginatedQuery._id = { $lt: new mongoose.Types.ObjectId(lastId) };
      } catch {
        return NextResponse.json({
          success: false,
          error: 'Invalid cursor',
        }, { status: 400 });
      }
    }

    const total = await Battle.countDocuments(baseQuery);

    let battlesQuery = Battle.find(paginatedQuery).sort({ _id: -1 });
    if (limit !== null) {
      battlesQuery = battlesQuery.limit(limit);
    }
    const battles = await battlesQuery;

    const allPlayerIds = battles.flatMap(b => [b.player1DeviceId, b.player2DeviceId]);
    const playerInfoMap = await getPlayerInfo(allPlayerIds);

    const battlesWithPlayerInfo = battles.map(battle => {
      const battleObj = battle.toObject();
      const p1Info = playerInfoMap.get(battle.player1DeviceId);
      const p2Info = battle.player2DeviceId ? playerInfoMap.get(battle.player2DeviceId) : null;
      
      const myPlayerIndex = battle.player1DeviceId === auth.deviceId ? 0 : 1;
      const isMyTurn = battleObj.currentPlayerIndex === myPlayerIndex;
      
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
        myPlayerIndex,
        isMyTurn,
        isPrivate: battleObj.isPrivate,
        lastTurnAt: battleObj.lastTurnAt,
        mapName: battleObj.mapData?.selection || 'Unknown Map',
      };
    });

    const hasMore = isPaginated && limit !== null && battles.length === limit;
    const lastBattle = battles[battles.length - 1];
    const nextCursor = hasMore && lastBattle
      ? Buffer.from(JSON.stringify({ lastId: lastBattle._id.toString() })).toString('base64')
      : null;

    return NextResponse.json({
      success: true,
      battles: battlesWithPlayerInfo,
      pagination: {
        hasMore,
        nextCursor,
        total,
      },
    });
  } catch (error) {
    console.error('Fetch my battles error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch battles',
    }, { status: 500 });
  }
}
