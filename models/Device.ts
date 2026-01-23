import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDevice {
  deviceId: string;
  tokenHash: string;
  displayName: string;
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
