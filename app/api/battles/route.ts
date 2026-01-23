import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';
import { generateSecureToken } from '@/lib/auth';
import { z } from 'zod';

const createBattleSchema = z.object({
  mapData: z.record(z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateDevice(request);
    
    await connectToDatabase();

    let query = {};
    
    if (auth) {
      query = {
        $or: [
          { player1DeviceId: auth.deviceId },
          { player2DeviceId: auth.deviceId }
        ]
      };
    }

    const battles = await Battle.find(query)
      .sort({ updatedAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      battles,
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

    const { mapData } = parsed.data;

    const battleId = generateSecureToken().substring(0, 16);

    const battle = new Battle({
      battleId,
      player1DeviceId: auth.deviceId,
      player2DeviceId: null,
      status: 'pending',
      currentTurn: 0,
      currentPlayerIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      winnerId: null,
      mapData: mapData || {},
    });

    await battle.save();

    return NextResponse.json({
      success: true,
      battle: {
        battleId: battle.battleId,
        status: battle.status,
        currentTurn: battle.currentTurn,
      },
      message: 'Battle created. Waiting for opponent to join.',
    }, { status: 201 });

  } catch (error) {
    console.error('Create battle error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create battle',
    }, { status: 500 });
  }
}
