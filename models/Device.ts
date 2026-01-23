import mongoose, { Schema, Document, Model } from 'mongoose';

export const VALID_AVATARS = [
  'BIRD1', 'BIRD2', 'BIRD3', 'BIRD4', 'BIRD5', 'BIRD6',
  'BIRD7', 'BIRD8', 'BIRD9', 'BIRD10', 'BIRD11', 'BIRD12'
] as const;

export type BirdAvatar = typeof VALID_AVATARS[number];

export interface IDevice {
  deviceId: string;
  tokenHash: string;
  displayName: string;
  avatar: BirdAvatar;
  registeredAt: Date;
  lastSeen: Date;
  isActive: boolean;
}

export interface IDeviceDocument extends IDevice, Document {}

const DeviceSchema = new Schema<IDeviceDocument>({
  deviceId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  tokenHash: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String, 
    default: 'Unnamed Device' 
  },
  avatar: {
    type: String,
    enum: ['BIRD1', 'BIRD2', 'BIRD3', 'BIRD4', 'BIRD5', 'BIRD6', 'BIRD7', 'BIRD8', 'BIRD9', 'BIRD10', 'BIRD11', 'BIRD12'],
    default: 'BIRD1'
  },
  registeredAt: { 
    type: Date, 
    default: Date.now 
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

export const Device: Model<IDeviceDocument> = mongoose.models.Device || mongoose.model<IDeviceDocument>('Device', DeviceSchema);
