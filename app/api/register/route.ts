import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Device, VALID_AVATARS } from '@/models/Device';
import { generateDeterministicToken, generateSecureToken, hashToken } from '@/lib/auth';
import { logAuditEvent, getClientIp, getUserAgent } from '@/lib/auditLogger';
import { z } from 'zod';

const MIN_CLIENT_VERSION = process.env.MIN_CLIENT_VERSION || '0.0.1';

// Schema for new registrations - serialNumber required
const newRegistrationSchema = z.object({
  serialNumber: z.string().min(1).max(100),
  displayName: z.string().min(1).max(100).optional(),
  avatar: z.enum(VALID_AVATARS).optional(),
  isSimulator: z.boolean().optional(),
  deviceId: z.string().min(1).max(100).optional(),
});

// Schema for authenticated users - serialNumber optional (they already have one)
const authenticatedUpdateSchema = z.object({
  serialNumber: z.string().min(1).max(100).optional(),
  displayName: z.string().min(1).max(100).optional(),
  avatar: z.enum(VALID_AVATARS).optional(),
  isSimulator: z.boolean().optional(),
  deviceId: z.string().min(1).max(100).optional(),
});

async function getRateLimitData(ip: string): Promise<{ count: number; canProceed: boolean }> {
  await connectToDatabase();
  
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const recentDevices = await Device.countDocuments({
    registeredAt: { $gte: oneMinuteAgo }
  });
  
  return {
    count: recentDevices,
    canProceed: recentDevices < 10
  };
}

async function findDeviceByToken(request: NextRequest): Promise<typeof Device.prototype | null> {
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
    return device;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const userAgent = getUserAgent(request.headers);
  
  try {
    const body = await request.json().catch(() => ({}));
    
    // Check for authentication FIRST before validating schema
    const existingDeviceByToken = await findDeviceByToken(request);
    
    // Use different schema based on whether user is authenticated
    const schema = existingDeviceByToken ? authenticatedUpdateSchema : newRegistrationSchema;
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
        details: parsed.error.issues,
      }, { status: 400 });
    }

    const { serialNumber, displayName, avatar, isSimulator, deviceId } = parsed.data;
    
    if (existingDeviceByToken) {
      // Build update object for changed fields
      const updateFields: Record<string, unknown> = { lastSeen: new Date() };
      let updated = false;
      
      if (displayName && displayName !== existingDeviceByToken.displayName) {
        updateFields.displayName = displayName;
        updated = true;
      }
      
      if (avatar && avatar !== existingDeviceByToken.avatar) {
        updateFields.avatar = avatar;
        updated = true;
      }
      
      if (isSimulator !== undefined && isSimulator !== existingDeviceByToken.isSimulator) {
        updateFields.isSimulator = isSimulator;
        updated = true;
      }
      
      // Use updateOne to avoid triggering full document validation
      // (handles legacy devices that may be missing newer required fields)
      await Device.updateOne(
        { _id: existingDeviceByToken._id },
        { $set: updateFields }
      );

      await logAuditEvent({
        eventType: 'device_api_access',
        ip,
        userAgent,
        deviceId: existingDeviceByToken.deviceId,
        serialNumber: existingDeviceByToken.serialNumber,
        endpoint: '/api/register',
        method: 'POST',
        success: true,
        details: updated ? 'Profile update via token' : 'Token verification',
      });

      // Return the updated values (from updateFields if changed, otherwise from original document)
      return NextResponse.json({
        success: true,
        registered: true,
        deviceId: existingDeviceByToken.deviceId,
        displayName: (updateFields.displayName as string) || existingDeviceByToken.displayName,
        avatar: (updateFields.avatar as string) || existingDeviceByToken.avatar,
        isSimulator: updateFields.isSimulator !== undefined 
          ? updateFields.isSimulator 
          : existingDeviceByToken.isSimulator,
        registeredAt: existingDeviceByToken.registeredAt,
        minClientVersion: MIN_CLIENT_VERSION,
        message: updated 
          ? 'Device verified and profile updated.' 
          : 'Device already registered.',
      }, { status: 200 });
    }

    await connectToDatabase();
    
    // At this point, serialNumber is guaranteed to exist because:
    // - If user was authenticated, we already returned above
    // - If not authenticated, newRegistrationSchema requires serialNumber
    if (!serialNumber) {
      return NextResponse.json({
        success: false,
        error: 'Serial number is required for new registrations',
      }, { status: 400 });
    }
    
    // Step 1: Check deviceId first (if provided)
    let existingDevice = null;
    if (deviceId) {
      existingDevice = await Device.findOne({ 
        deviceId: deviceId,
        isActive: true 
      });
    }
    
    // Step 2: Fall back to serialNumber lookup
    if (!existingDevice) {
      existingDevice = await Device.findOne({ 
        serialNumber: serialNumber,
        isActive: true 
      });
    }

    if (existingDevice) {
      // Generate token from existing device's stored serial
      let secretToken: string;
      try {
        secretToken = generateDeterministicToken(existingDevice.serialNumber);
      } catch (error) {
        console.error('Token generation failed - SESSION_SECRET not configured:', error);
        return NextResponse.json({
          success: false,
          error: 'Server configuration error',
        }, { status: 500 });
      }
      let updated = false;
      
      if (displayName && displayName !== existingDevice.displayName) {
        existingDevice.displayName = displayName;
        updated = true;
      }
      
      if (avatar && avatar !== existingDevice.avatar) {
        existingDevice.avatar = avatar;
        updated = true;
      }
      
      if (isSimulator !== undefined && isSimulator !== existingDevice.isSimulator) {
        existingDevice.isSimulator = isSimulator;
        updated = true;
      }
      
      existingDevice.lastSeen = new Date();
      await existingDevice.save();

      await logAuditEvent({
        eventType: 'device_recover',
        ip,
        userAgent,
        deviceId: existingDevice.deviceId,
        serialNumber: existingDevice.serialNumber,
        endpoint: '/api/register',
        method: 'POST',
        success: true,
        details: updated ? 'Account recovery with profile update' : 'Account recovery',
      });

      return NextResponse.json({
        success: true,
        registered: true,
        deviceId: existingDevice.deviceId,
        secretToken,
        displayName: existingDevice.displayName,
        avatar: existingDevice.avatar,
        isSimulator: existingDevice.isSimulator,
        registeredAt: existingDevice.registeredAt,
        minClientVersion: MIN_CLIENT_VERSION,
        message: updated 
          ? 'Device recovered and profile updated.' 
          : 'Device recovered successfully.',
      }, { status: 200 });
    }

    const rateLimitData = await getRateLimitData(ip);
    if (!rateLimitData.canProceed) {
      await logAuditEvent({
        eventType: 'device_register',
        ip,
        userAgent,
        serialNumber,
        endpoint: '/api/register',
        method: 'POST',
        success: false,
        details: 'Rate limit exceeded',
      });

      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Try again later.',
      }, { status: 429 });
    }

    const newDeviceId = generateSecureToken();
    
    // For simulators, generate unique serial to prevent account sharing
    const effectiveSerialNumber = isSimulator 
      ? `SIMULATOR-${generateSecureToken().substring(0, 8)}`
      : serialNumber;
    
    // Generate token based on effective serial
    let newSecretToken: string;
    try {
      newSecretToken = generateDeterministicToken(effectiveSerialNumber);
    } catch (error) {
      console.error('Token generation failed - SESSION_SECRET not configured:', error);
      return NextResponse.json({
        success: false,
        error: 'Server configuration error',
      }, { status: 500 });
    }
    
    const tokenHash = hashToken(newSecretToken);

    const effectiveDisplayName = displayName || 'Playdate Device';
    const effectiveAvatar = avatar || 'BIRD1';
    const effectiveIsSimulator = isSimulator || false;
    
    const device = new Device({
      deviceId: newDeviceId,
      serialNumber: effectiveSerialNumber,
      tokenHash,
      displayName: effectiveDisplayName,
      avatar: effectiveAvatar,
      isSimulator: effectiveIsSimulator,
      registeredAt: new Date(),
      lastSeen: new Date(),
      isActive: true,
      registrationIp: ip,
    });

    await device.save();

    await logAuditEvent({
      eventType: 'device_register',
      ip,
      userAgent,
      deviceId: newDeviceId,
      serialNumber: effectiveSerialNumber,
      endpoint: '/api/register',
      method: 'POST',
      success: true,
      details: `New device registered: ${effectiveDisplayName}`,
    });

    return NextResponse.json({
      success: true,
      registered: false,
      deviceId: newDeviceId,
      secretToken: newSecretToken,
      displayName: effectiveDisplayName,
      avatar: effectiveAvatar,
      isSimulator: effectiveIsSimulator,
      minClientVersion: MIN_CLIENT_VERSION,
      message: 'Device registered successfully.',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    await logAuditEvent({
      eventType: 'device_register',
      ip,
      userAgent,
      endpoint: '/api/register',
      method: 'POST',
      success: false,
      details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    return NextResponse.json({
      success: false,
      error: 'Failed to register device',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    
    const devices = await Device.find({ isActive: true })
      .select('deviceId displayName registeredAt lastSeen')
      .sort({ registeredAt: -1 });

    return NextResponse.json({
      success: true,
      devices,
    });
  } catch (error) {
    console.error('Fetch devices error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch devices',
    }, { status: 500 });
  }
}
