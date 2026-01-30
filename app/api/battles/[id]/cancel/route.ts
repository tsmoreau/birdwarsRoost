import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';

export async function POST(
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

    if (battle.player1DeviceId !== auth.deviceId) {
      return NextResponse.json({
        success: false,
        error: 'Only the battle creator can cancel this battle',
      }, { status: 403 });
    }

    if (battle.status !== 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Battle is not pending (already active or completed)',
      }, { status: 400 });
    }

    battle.status = 'abandoned';
    battle.endReason = 'cancelled';
    battle.updatedAt = new Date();
    await battle.save();

    return NextResponse.json({
      success: true,
      message: 'Battle cancelled',
    });

  } catch (error) {
    console.error('Cancel battle error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to cancel battle',
    }, { status: 500 });
  }
}
