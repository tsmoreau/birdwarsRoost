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

    const battles = await Battle.find({
      $or: [
        { player1DeviceId: auth.deviceId },
        { player2DeviceId: auth.deviceId }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      battles,
      count: battles.length,
    });
  } catch (error) {
    console.error('Fetch my battles error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch battles',
    }, { status: 500 });
  }
}
