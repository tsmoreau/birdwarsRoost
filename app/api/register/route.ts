import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Device } from '@/models/Device';
import { generateDeviceSecret, generateSecureToken, hashToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
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

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (/^[\d.:a-fA-F]+$/.test(firstIp)) {
      return firstIp;
    }
  }
  return 'unknown';
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
  try {
    const body = await request.json().catch(() => ({}));
    
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
        details: parsed.error.issues,
      }, { status: 400 });
    }

    const { displayName } = parsed.data;

    const existingDevice = await findDeviceByToken(request);
    
    if (existingDevice) {
      let updated = false;
      
      if (displayName && displayName !== existingDevice.displayName) {
        existingDevice.displayName = displayName;
        updated = true;
      }
      
      existingDevice.lastSeen = new Date();
      await existingDevice.save();

      return NextResponse.json({
        success: true,
        registered: true,
        deviceId: existingDevice.deviceId,
        displayName: existingDevice.displayName,
        registeredAt: existingDevice.registeredAt,
        message: updated 
          ? 'Device verified and display name updated.' 
          : 'Device already registered.',
      }, { status: 200 });
    }

    const ip = getClientIp(request);
    
    const rateLimitData = await getRateLimitData(ip);
    if (!rateLimitData.canProceed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Try again later.',
      }, { status: 429 });
    }

    const deviceId = generateSecureToken();
    const secretToken = generateDeviceSecret();
    
    let tokenHash: string;
    try {
      tokenHash = hashToken(secretToken);
    } catch (error) {
      console.error('Token hashing failed - SESSION_SECRET not configured:', error);
      return NextResponse.json({
        success: false,
        error: 'Server configuration error',
      }, { status: 500 });
    }

    const device = new Device({
      deviceId,
      tokenHash,
      displayName: displayName || 'Playdate Device',
      registeredAt: new Date(),
      lastSeen: new Date(),
      isActive: true,
    });

    await device.save();

    return NextResponse.json({
      success: true,
      registered: false,
      deviceId,
      secretToken,
      displayName: device.displayName,
      message: 'Device registered successfully. Store this token securely - it cannot be retrieved again.',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
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
