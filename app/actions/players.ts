'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { Device } from '@/models/Device';
import { Battle } from '@/models/Battle';
import { Turn } from '@/models/Turn';

export interface PlayerProfile {
  deviceId: string;
  displayName: string;
  avatar: string;
  registeredAt: string;
  lastSeen: string;
  isActive: boolean;
  stats: {
    totalBattles: number;
    completedBattles: number;
    activeBattles: number;
    pendingBattles: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: string;
    totalTurnsSubmitted: number;
  };
}

export interface BattleWithOpponent {
  battleId: string;
  displayName: string;
  status: string;
  opponentName: string | null;
  opponentDeviceId: string | null;
  isPlayer1: boolean;
  winnerId: string | null;
  endReason: string | null;
  currentTurn: number;
  createdAt: string;
  updatedAt: string;
}

export async function getPlayerByDisplayName(displayName: string): Promise<PlayerProfile | null> {
  await connectToDatabase();
  
  const device = await Device.findOne({ 
    displayName: { $regex: new RegExp(`^${displayName}$`, 'i') }
  });
  
  if (!device) {
    return null;
  }

  const deviceId = device.deviceId;

  const [
    totalBattles,
    wins,
    losses,
    draws,
    activeBattles,
    pendingBattles,
    totalTurns
  ] = await Promise.all([
    Battle.countDocuments({
      $or: [
        { player1DeviceId: deviceId },
        { player2DeviceId: deviceId }
      ]
    }),
    
    Battle.countDocuments({
      status: 'completed',
      winnerId: deviceId,
      $or: [
        { player1DeviceId: deviceId },
        { player2DeviceId: deviceId }
      ]
    }),
    
    Battle.countDocuments({
      status: 'completed',
      winnerId: { $nin: [deviceId, null] },
      $or: [
        { player1DeviceId: deviceId },
        { player2DeviceId: deviceId }
      ]
    }),
    
    Battle.countDocuments({
      status: 'completed',
      winnerId: null,
      $or: [
        { player1DeviceId: deviceId },
        { player2DeviceId: deviceId }
      ]
    }),
    
    Battle.countDocuments({
      status: 'active',
      $or: [
        { player1DeviceId: deviceId },
        { player2DeviceId: deviceId }
      ]
    }),
    
    Battle.countDocuments({
      status: 'pending',
      $or: [
        { player1DeviceId: deviceId },
        { player2DeviceId: deviceId }
      ]
    }),
    
    Turn.countDocuments({ deviceId })
  ]);

  const completedBattles = wins + losses + draws;
  const winRate = completedBattles > 0 
    ? ((wins / completedBattles) * 100).toFixed(1) 
    : '0.0';

  const deviceObj = device.toObject();

  return {
    deviceId: deviceObj.deviceId,
    displayName: deviceObj.displayName || 'Unknown Player',
    avatar: deviceObj.avatar || 'BIRD1',
    registeredAt: deviceObj.registeredAt.toISOString(),
    lastSeen: deviceObj.lastSeen.toISOString(),
    isActive: deviceObj.isActive,
    stats: {
      totalBattles,
      completedBattles,
      activeBattles,
      pendingBattles,
      wins,
      losses,
      draws,
      winRate: `${winRate}%`,
      totalTurnsSubmitted: totalTurns
    }
  };
}

export async function getPlayerBattles(deviceId: string, limit: number = 10): Promise<BattleWithOpponent[]> {
  await connectToDatabase();
  
  const battles = await Battle.find({
    $or: [
      { player1DeviceId: deviceId },
      { player2DeviceId: deviceId }
    ]
  })
    .sort({ updatedAt: -1 })
    .limit(limit);

  const opponentDeviceIds = battles.map(b => {
    const battleObj = b.toObject();
    return battleObj.player1DeviceId === deviceId 
      ? battleObj.player2DeviceId 
      : battleObj.player1DeviceId;
  }).filter(Boolean) as string[];

  const opponents = await Device.find({
    deviceId: { $in: opponentDeviceIds }
  }).select('deviceId displayName');

  const opponentMap = new Map(
    opponents.map(d => [d.deviceId, d.displayName])
  );

  return battles.map(battle => {
    const battleObj = battle.toObject();
    const isPlayer1 = battleObj.player1DeviceId === deviceId;
    const opponentDeviceId = isPlayer1 ? battleObj.player2DeviceId : battleObj.player1DeviceId;
    
    return {
      battleId: battleObj.battleId,
      displayName: battleObj.displayName || 'Unnamed Battle',
      status: battleObj.status,
      opponentName: opponentDeviceId ? (opponentMap.get(opponentDeviceId) || 'Unknown') : null,
      opponentDeviceId: opponentDeviceId,
      isPlayer1,
      winnerId: battleObj.winnerId,
      endReason: battleObj.endReason,
      currentTurn: battleObj.currentTurn,
      createdAt: battleObj.createdAt.toISOString(),
      updatedAt: battleObj.updatedAt.toISOString()
    };
  });
}
