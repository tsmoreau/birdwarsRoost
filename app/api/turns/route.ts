import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Turn } from '@/models/Turn';
import { authenticateDevice, unauthorizedResponse } from '@/lib/authMiddleware';
import { generateSecureToken } from '@/lib/auth';
import { z } from 'zod';

const MAX_ACTIONS_PER_TURN = 100;
const MAX_GAME_STATE_SIZE = 50000;

const positionSchema = z.object({ 
  x: z.number().int().min(-1000).max(1000), 
  y: z.number().int().min(-1000).max(1000) 
});

const turnActionSchema = z.object({
  type: z.enum(['move', 'attack', 'build', 'capture', 'wait', 'end_turn']),
  unitId: z.string().max(50).optional(),
  from: positionSchema.optional(),
  to: positionSchema.optional(),
  targetId: z.string().max(50).optional(),
  data: z.record(z.unknown()).optional().refine(
    (data) => !data || JSON.stringify(data).length < 1000,
    { message: 'Action data too large' }
  ),
});

const submitTurnSchema = z.object({
  battleId: z.string().min(1).max(50),
  actions: z.array(turnActionSchema).min(1).max(MAX_ACTIONS_PER_TURN),
  gameState: z.record(z.unknown()).optional().refine(
    (state) => !state || JSON.stringify(state).length < MAX_GAME_STATE_SIZE,
    { message: 'Game state too large' }
  ),
});

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 100000) {
      return NextResponse.json({
        success: false,
        error: 'Request payload too large',
      }, { status: 413 });
    }

    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return unauthorizedResponse('Device authentication required');
    }

    await connectToDatabase();

    const body = await request.json().catch(() => ({}));
    
    const parsed = submitTurnSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
        details: parsed.error.issues.slice(0, 5),
      }, { status: 400 });
    }

    const { battleId, actions, gameState } = parsed.data;

    const battle = await Battle.findOne({ battleId });

    if (!battle) {
      return NextResponse.json({
        success: false,
        error: 'Battle not found',
      }, { status: 404 });
    }

    if (battle.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: `Battle is not active. Current status: ${battle.status}`,
      }, { status: 400 });
    }

    const players = [battle.player1DeviceId, battle.player2DeviceId];
    
    if (!players.includes(auth.deviceId)) {
      return NextResponse.json({
        success: false,
        error: 'You are not a participant in this battle',
      }, { status: 403 });
    }

    const currentPlayer = players[battle.currentPlayerIndex];

    if (currentPlayer !== auth.deviceId) {
      return NextResponse.json({
        success: false,
        error: 'It is not your turn',
      }, { status: 403 });
    }

    const expectedTurnNumber = battle.currentTurn + 1;
    
    const existingTurn = await Turn.findOne({ 
      battleId, 
      turnNumber: expectedTurnNumber 
    });
    
    if (existingTurn) {
      return NextResponse.json({
        success: false,
        error: 'Turn already submitted',
      }, { status: 409 });
    }

    const validationErrors: string[] = [];
    
    const hasEndTurn = actions.some(a => a.type === 'end_turn');
    if (!hasEndTurn) {
      validationErrors.push('Turn must include end_turn action');
    }

    const isValid = validationErrors.length === 0;

    const turnId = generateSecureToken().substring(0, 16);

    const turn = new Turn({
      turnId,
      battleId,
      deviceId: auth.deviceId,
      turnNumber: expectedTurnNumber,
      actions,
      timestamp: new Date(),
      isValid,
      validationErrors,
      gameState: gameState || {},
    });

    await turn.save();

    if (isValid) {
      battle.currentTurn = expectedTurnNumber;
      battle.currentPlayerIndex = (battle.currentPlayerIndex + 1) % 2;
      battle.updatedAt = new Date();

      if (gameState?.winner) {
        battle.status = 'completed';
        battle.winnerId = String(gameState.winner);
      }

      await battle.save();
    }

    return NextResponse.json({
      success: true,
      turn: {
        turnId: turn.turnId,
        turnNumber: turn.turnNumber,
        isValid: turn.isValid,
        validationErrors: turn.validationErrors,
      },
      battle: {
        battleId: battle.battleId,
        currentTurn: battle.currentTurn,
        currentPlayerIndex: battle.currentPlayerIndex,
        status: battle.status,
      },
      message: isValid ? 'Turn submitted successfully' : 'Turn submitted but contains validation errors',
    }, { status: 201 });

  } catch (error) {
    console.error('Submit turn error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit turn',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const battleId = searchParams.get('battleId');

    if (!battleId) {
      return NextResponse.json({
        success: false,
        error: 'Battle ID is required',
      }, { status: 400 });
    }

    const turns = await Turn.find({ battleId })
      .sort({ turnNumber: 1 })
      .limit(200);

    return NextResponse.json({
      success: true,
      turns,
    });
  } catch (error) {
    console.error('Fetch turns error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch turns',
    }, { status: 500 });
  }
}
