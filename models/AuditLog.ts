import mongoose, { Schema, Document, Model } from 'mongoose';

export const AUDIT_EVENT_TYPES = [
  'admin_login',
  'admin_login_failed',
  'device_register',
  'device_recover',
  'device_api_access',
  'admin_action',
] as const;

export type AuditEventType = typeof AUDIT_EVENT_TYPES[number];

export interface IAuditLog {
  eventType: AuditEventType;
  timestamp: Date;
  ip: string;
  userAgent?: string;
  userId?: string;
  userEmail?: string;
  deviceId?: string;
  serialNumber?: string;
  endpoint?: string;
  method?: string;
  success: boolean;
  details?: string;
}

export interface IAuditLogDocument extends IAuditLog, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>({
  eventType: {
    type: String,
    enum: AUDIT_EVENT_TYPES,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ip: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    default: null,
    index: true
  },
  userEmail: {
    type: String,
    default: null
  },
  deviceId: {
    type: String,
    default: null,
    index: true
  },
  serialNumber: {
    type: String,
    default: null
  },
  endpoint: {
    type: String,
    default: null
  },
  method: {
    type: String,
    default: null
  },
  success: {
    type: Boolean,
    required: true,
    index: true
  },
  details: {
    type: String,
    default: null
  }
});

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ eventType: 1, timestamp: -1 });
AuditLogSchema.index({ ip: 1, timestamp: -1 });

export const AuditLog: Model<IAuditLogDocument> = mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
