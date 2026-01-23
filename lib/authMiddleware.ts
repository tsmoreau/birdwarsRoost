import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from './mongodb';
import { Device } from '@/models/Device';
import { hashToken, verifyToken } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  deviceId?: string;
}

export async function authenticateDevice(request: NextRequest): Promise<{ deviceId: string } | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
    return null;
  }

  device.lastSeen = new Date();
  await device.save();

  return { deviceId: device.deviceId };
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({
    success: false,
    error: message,
  }, { status: 401 });
}
