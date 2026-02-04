import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { DeviceRecovery } from '@/models/DeviceRecovery';
import { Device } from '@/models/Device';
import { generateSecureToken, hashToken } from '@/lib/auth';
import { logAuditEvent, getClientIp, getUserAgent } from '@/lib/auditLogger';

async function authenticateDevice(request: NextRequest): Promise<{ deviceId: string } | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  if (!token) {
    return null;
  }

  await connectToDatabase();
  
  try {
    const tokenHash = hashToken(token);
    const device = await Device.findOne({ 
      tokenHash: tokenHash,
      isActive: true 
    });
    
    if (!device) {
      return null;
    }
    
    return { deviceId: device.deviceId };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const userAgent = getUserAgent(request.headers);

  try {
    const auth = await authenticateDevice(request);
    
    if (!auth) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required. Provide Bearer token for the new device.',
      }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { targetDeviceId } = body;

    if (!targetDeviceId) {
      return NextResponse.json({
        success: false,
        error: 'targetDeviceId is required',
      }, { status: 400 });
    }

    await connectToDatabase();

    const recovery = await DeviceRecovery.findOne({
      oldDeviceId: targetDeviceId,
      newDeviceId: auth.deviceId,
      status: 'pending',
    });

    if (!recovery) {
      return NextResponse.json({
        success: false,
        error: 'No pending recovery found for this device combination',
      }, { status: 404 });
    }

    const [oldDevice, newDevice] = await Promise.all([
      Device.findOne({ deviceId: targetDeviceId }),
      Device.findOne({ deviceId: auth.deviceId }),
    ]);

    if (!oldDevice) {
      return NextResponse.json({
        success: false,
        error: 'Original device not found',
      }, { status: 404 });
    }

    const newSecretToken = generateSecureToken();
    const newTokenHash = hashToken(newSecretToken);
    
    oldDevice.tokenHash = newTokenHash;
    oldDevice.lastSeen = new Date();
    await oldDevice.save();

    if (newDevice) {
      newDevice.isActive = false;
      await newDevice.save();
    }

    recovery.status = 'completed';
    recovery.completedAt = new Date();
    await recovery.save();

    await logAuditEvent({
      eventType: 'device_recover',
      ip,
      userAgent,
      deviceId: targetDeviceId,
      endpoint: '/api/recover',
      method: 'POST',
      success: true,
      details: `Account recovery completed: ${auth.deviceId} -> ${targetDeviceId}. New device deactivated.`,
    });

    return NextResponse.json({
      success: true,
      message: 'Account recovery completed successfully',
      deviceId: targetDeviceId,
      secretToken: newSecretToken,
      displayName: oldDevice.displayName,
      avatar: oldDevice.avatar,
    });

  } catch (error) {
    console.error('Recovery error:', error);

    await logAuditEvent({
      eventType: 'device_recover',
      ip,
      userAgent,
      endpoint: '/api/recover',
      method: 'POST',
      success: false,
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    return NextResponse.json({
      success: false,
      error: 'Failed to complete recovery',
    }, { status: 500 });
  }
}
