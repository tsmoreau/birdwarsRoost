import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return unauthorizedResponse('Device authentication required');
    }

    await connectToDatabase();

    const { deviceId } = auth;

    const battles = await Battle.find({
      status: 'active',
      $or: [
        { player1DeviceId: deviceId, currentPlayerIndex: 0 },
        { player2DeviceId: deviceId, currentPlayerIndex: 1 }
      ]
    }).select('battleId -_id');

    const battleIds = battles.map(b => b.battleId);

    return NextResponse.json({
      success: true,
      count: battleIds.length,
      battles: battleIds,
    });
  } catch (error) {
    console.error('Fetch active turns error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch active turns',
    }, { status: 500 });
  }
}
