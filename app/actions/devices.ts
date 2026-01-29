'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { Device } from '@/models/Device';

export interface DeviceWithDetails {
  deviceId: string;
  displayName: string;
  avatar: string;
  registeredAt: string;
  lastSeen: string;
  isActive: boolean;
}

export async function getDevices(options?: { limit?: number }): Promise<DeviceWithDetails[]> {
  await connectToDatabase();
  
  const limit = options?.limit ?? 50;

  const devices = await Device.find({ isActive: true })
    .sort({ lastSeen: -1 })
    .limit(limit);

  return devices.map(device => {
    const deviceObj = device.toObject();
    return {
      deviceId: deviceObj.deviceId,
      displayName: deviceObj.displayName || 'Unnamed Device',
      avatar: deviceObj.avatar || 'BIRD1',
      registeredAt: deviceObj.registeredAt.toISOString(),
      lastSeen: deviceObj.lastSeen.toISOString(),
      isActive: deviceObj.isActive,
    };
  });
}
