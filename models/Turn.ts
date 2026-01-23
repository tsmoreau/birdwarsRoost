import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITurnAction {
  type: 'move' | 'attack' | 'build' | 'capture' | 'wait' | 'end_turn';
  unitId?: string;
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  targetId?: string;
  data?: Record<string, unknown>;
}

export interface ITurn {
  turnId: string;
  battleId: string;
  deviceId: string;
  turnNumber: number;
  actions: ITurnAction[];
  timestamp: Date;
  isValid: boolean;
  validationErrors: string[];
  gameState: Record<string, unknown>;
}

export interface ITurnDocument extends ITurn, Document {}

const TurnActionSchema = new Schema({
  type: { 
    type: String, 
    enum: ['move', 'attack', 'build', 'capture', 'wait', 'end_turn'],
    required: true 
  },
  unitId: String,
  from: {
    x: Number,
    y: Number
  },
  to: {
    x: Number,
    y: Number
  },
  targetId: String,
  data: Schema.Types.Mixed
}, { _id: false });

const TurnSchema = new Schema<ITurnDocument>({
  turnId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  battleId: { 
    type: String, 
    required: true,
    index: true 
  },
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  turnNumber: { 
    type: Number, 
    required: true 
  },
  actions: [TurnActionSchema],
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  isValid: { 
    type: Boolean, 
    default: true 
  },
  validationErrors: [String],
  gameState: { 
    type: Schema.Types.Mixed, 
    default: {} 
  }
});

TurnSchema.index({ battleId: 1, turnNumber: 1 });

export const Turn: Model<ITurnDocument> = mongoose.models.Turn || mongoose.model<ITurnDocument>('Turn', TurnSchema);
