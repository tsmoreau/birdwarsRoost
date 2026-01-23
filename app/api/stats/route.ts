import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Turn } from '@/models/Turn';
import { Device } from '@/models/Device';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return unauthorizedResponse('Device authentication required');
    }

    await connectToDatabase();

    const deviceId = auth.deviceId;

    const [
      device,
      totalBattles,
      wins,
      losses,
      draws,
      activeBattles,
      pendingBattles,
      totalTurns
    ] = await Promise.all([
      Device.findOne({ deviceId }).select('displayName registeredAt'),
      
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

    return NextResponse.json({
      success: true,
      stats: {
        deviceId,
        displayName: device?.displayName || 'Unknown Device',
        memberSince: device?.registeredAt?.toISOString() || null,
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
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stats',
    }, { status: 500 });
  }
}
