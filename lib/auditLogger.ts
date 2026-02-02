import { connectToDatabase } from './mongodb';
import { AuditLog, AuditEventType } from '@/models/AuditLog';

interface AuditLogParams {
  eventType: AuditEventType;
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

export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  try {
    await connectToDatabase();
    
    const log = new AuditLog({
      ...params,
      timestamp: new Date(),
    });
    
    await log.save();
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (/^[\d.:a-fA-F]+$/.test(firstIp)) {
      return firstIp;
    }
  }
  
  const realIp = headers.get('x-real-ip');
  if (realIp && /^[\d.:a-fA-F]+$/.test(realIp)) {
    return realIp;
  }
  
  return 'unknown';
}

export function getUserAgent(headers: Headers): string {
  return headers.get('user-agent') || 'unknown';
}
