'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Device } from '@/models/Device';

interface PlayerInfo {
  displayName: string;
  avatar: string;
}

export interface BattleWithDetails {
  battleId: string;
  displayName: string;
  player1DeviceId: string;
  player2DeviceId: string | null;
  player1DisplayName: string;
  player1Avatar: string;
  player2DisplayName: string | null;
  player2Avatar: string | null;
  status: 'pending' | 'active' | 'completed' | 'abandoned';
  currentTurn: number;
  currentPlayerIndex: number;
  isPrivate: boolean;
  lastTurnAt: string | null;
  mapName: string;
  createdAt: string;
  updatedAt: string;
  winnerId: string | null;
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

export async function getBattles(options?: { includePrivate?: boolean; limit?: number }): Promise<BattleWithDetails[]> {
  await connectToDatabase();
  
  const query = options?.includePrivate ? {} : { isPrivate: { $ne: true } };
  const limit = options?.limit ?? 50;

  const battles = await Battle.find(query)
    .sort({ updatedAt: -1 })
    .limit(limit);

  const allPlayerIds = battles.flatMap(b => [b.player1DeviceId, b.player2DeviceId]);
  const playerInfoMap = await getPlayerInfo(allPlayerIds);

  return battles.map(battle => {
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
      lastTurnAt: battleObj.lastTurnAt?.toISOString() || null,
      mapName: (battleObj.mapData?.selection as string) || 'Unknown Map',
      createdAt: battleObj.createdAt.toISOString(),
      updatedAt: battleObj.updatedAt.toISOString(),
      winnerId: battleObj.winnerId,
    };
  });
}
