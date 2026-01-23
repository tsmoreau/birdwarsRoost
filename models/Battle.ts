import mongoose, { Schema, Document, Model } from 'mongoose';

export type BattleStatus = 'pending' | 'active' | 'completed' | 'abandoned';
export type EndReason = 'victory' | 'forfeit' | 'draw' | null;

export interface IUnit {
  unitId: string;
  type: string;
  x: number;
  y: number;
  hp: number;
  owner: string;
}

export interface IBlockedTile {
  x: number;
  y: number;
  itemType: string;
}

export interface ICurrentState {
  units: IUnit[];
  blockedTiles: IBlockedTile[];
}

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
  endReason: EndReason;
  mapData: Record<string, unknown>;
  isPrivate: boolean;
  currentState: ICurrentState;
  lastTurnAt: Date | null;
}

export interface IBattleDocument extends IBattle, Document {}

const UnitSchema = new Schema({
  unitId: { type: String, required: true },
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  hp: { type: Number, required: true },
  owner: { type: String, required: true }
}, { _id: false });

const BlockedTileSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  itemType: { type: String, required: true }
}, { _id: false });

const CurrentStateSchema = new Schema({
  units: { type: [UnitSchema], default: [] },
  blockedTiles: { type: [BlockedTileSchema], default: [] }
}, { _id: false });

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
  endReason: {
    type: String,
    enum: ['victory', 'forfeit', 'draw', null],
    default: null
  },
  lastTurnAt: {
    type: Date,
    default: null
  },
  mapData: { 
    type: Schema.Types.Mixed, 
    default: {} 
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  currentState: {
    type: CurrentStateSchema,
    default: () => ({ units: [], blockedTiles: [] })
  }
});

export const Battle: Model<IBattleDocument> = mongoose.models.Battle || mongoose.model<IBattleDocument>('Battle', BattleSchema);
