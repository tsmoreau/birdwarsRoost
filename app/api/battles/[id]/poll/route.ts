import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Battle } from '@/models/Battle';
import { Turn } from '@/models/Turn';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sinceParam = searchParams.get('since');
    const since = sinceParam ? parseInt(sinceParam, 10) : 0;

    await connectToDatabase();

    const battle = await Battle.findOne({ battleId: id });

    if (!battle) {
      return NextResponse.json({
        success: false,
        error: 'Battle not found',
      }, { status: 404 });
    }

    const turns = await Turn.find({
      battleId: id,
      turnNumber: { $gt: since }
    }).sort({ turnNumber: 1 });

    const formattedTurns = turns.map(turn => ({
      turnNumber: turn.turnNumber,
      deviceId: turn.deviceId,
      actions: turn.actions,
    }));

    return NextResponse.json({
      success: true,
      battleId: battle.battleId,
      currentTurn: battle.currentTurn,
      currentPlayerIndex: battle.currentPlayerIndex,
      status: battle.status,
      turns: formattedTurns,
    });
  } catch (error) {
    console.error('Poll battle error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
    }, { status: 500 });
  }
}
