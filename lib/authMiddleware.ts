import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from './mongodb';
import { Device } from '@/models/Device';
import { hashToken, verifyToken } from './auth';
import { logAuditEvent, getClientIp, getUserAgent } from './auditLogger';

export interface AuthenticatedRequest extends NextRequest {
  deviceId?: string;
}

export async function authenticateDevice(
  request: NextRequest,
  options?: { endpoint?: string; method?: string; skipMissingAuthLog?: boolean }
): Promise<{ deviceId: string } | null> {
  const authHeader = request.headers.get('authorization');
  const ip = getClientIp(request.headers);
  const userAgent = getUserAgent(request.headers);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (!options?.skipMissingAuthLog) {
      await logAuditEvent({
        eventType: 'device_api_access',
        ip,
        userAgent,
        endpoint: options?.endpoint,
        method: options?.method,
        success: false,
        details: 'Missing or invalid authorization header',
      });
    }
    return null;
  }

  const token = authHeader.substring(7);
  
  if (!token) {
    return null;
  }

  await connectToDatabase();
  
  const tokenHash = hashToken(token);
  
  const device = await Device.findOne({ 
    tokenHash: tokenHash,
    isActive: true 
  });

  if (!device) {
    await logAuditEvent({
      eventType: 'device_api_access',
      ip,
      userAgent,
      endpoint: options?.endpoint,
      method: options?.method,
      success: false,
      details: 'Invalid or inactive token',
    });
    return null;
  }

  // Use updateOne to avoid triggering full document validation
  // (handles legacy devices that may be missing newer required fields)
  await Device.updateOne(
    { _id: device._id },
    { $set: { lastSeen: new Date() } }
  );

  await logAuditEvent({
    eventType: 'device_api_access',
    ip,
    userAgent,
    deviceId: device.deviceId,
    serialNumber: device.serialNumber,
    endpoint: options?.endpoint,
    method: options?.method,
    success: true,
  });

  return { deviceId: device.deviceId };
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 401 });
}
