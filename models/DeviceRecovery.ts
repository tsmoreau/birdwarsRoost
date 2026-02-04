import mongoose, { Schema, Document, Model } from 'mongoose';

export type RecoveryStatus = 'pending' | 'completed' | 'cancelled';

export interface IDeviceRecovery {
  oldDeviceId: string;
  newDeviceId: string;
  status: RecoveryStatus;
  createdAt: Date;
  completedAt?: Date;
  adminNotes?: string;
}

export interface IDeviceRecoveryDocument extends IDeviceRecovery, Document {}

const DeviceRecoverySchema = new Schema<IDeviceRecoveryDocument>({
  oldDeviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  newDeviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  completedAt: { 
    type: Date, 
    default: null 
  },
  adminNotes: {
    type: String,
    default: null
  }
});

DeviceRecoverySchema.index({ newDeviceId: 1, status: 1 });

export const DeviceRecovery: Model<IDeviceRecoveryDocument> = 
  mongoose.models.DeviceRecovery || 
  mongoose.model<IDeviceRecoveryDocument>('DeviceRecovery', DeviceRecoverySchema);
