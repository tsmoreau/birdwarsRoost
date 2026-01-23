import mongoose, { Schema, Document, Model } from 'mongoose';

export type BattleStatus = 'pending' | 'active' | 'completed' | 'abandoned';

export interface IBattle {
  battleId: string;
  player1DeviceId: string;
  player2DeviceId: string | null;
  status: BattleStatus;
  currentTurn: number;
  currentPlayerIndex: number;
  createdAt: Date;
  updatedAt: Date;
  winnerId: string | null;
  mapData: Record<string, unknown>;
}

export interface IBattleDocument extends IBattle, Document {}

const BattleSchema = new Schema<IBattleDocument>({
  battleId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  player1DeviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  player2DeviceId: { 
    type: String, 
    default: null,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'abandoned'],
    default: 'pending' 
  },
  currentTurn: { 
    type: Number, 
    default: 0 
  },
  currentPlayerIndex: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  winnerId: { 
    type: String, 
    default: null 
  },
  mapData: { 
    type: Schema.Types.Mixed, 
    default: {} 
  }
});

export const Battle: Model<IBattleDocument> = mongoose.models.Battle || mongoose.model<IBattleDocument>('Battle', BattleSchema);
