'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Swords, 
  Gamepad2,
  Loader2,
  Plus,
  Clock,
  Check,
  Copy,
  Shield
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '@/lib/utils';

interface Device {
  deviceId: string;
  displayName: string;
  registeredAt: string;
  lastSeen: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [newDevice, setNewDevice] = useState<{ deviceId: string; secretToken: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    try {
      const res = await fetch('/api/register');
      const data = await res.json();
      if (data.success) setDevices(data.devices);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  }

  async function registerDevice() {
    setRegistering(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: `Playdate Device ${devices.length + 1}` }),
      });
      const data = await res.json();
      if (data.success) {
        setNewDevice({ deviceId: data.deviceId, secretToken: data.secretToken });
        fetchDevices();
      }
    } catch (error) {
      console.error('Failed to register device:', error);
    } finally {
      setRegistering(false);
    }
  }

  async function copyToken() {
    if (newDevice) {
      await navigator.clipboard.writeText(newDevice.secretToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <img src="/birb001.png" alt="Bird Wars" className="w-10 h-10 rounded-lg object-cover -mt-2" />
              <span className="text-xl font-bold">Bird Wars Roost</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-dashboard"
              >
                Dashboard
              </Link>
              <Link 
                href="/battles" 
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-battles"
              >
                Battles
              </Link>
              <Link 
                href="/devices" 
                className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-foreground"
                data-testid="link-devices-active"
              >
                Devices
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Devices</h1>
            <p className="text-muted-foreground">Manage registered Playdate devices</p>
          </div>
          <Button 
            onClick={registerDevice} 
            disabled={registering}
            data-testid="button-register-device"
          >
            {registering ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Register Device
          </Button>
        </div>

        {newDevice && (
          <Card className="mb-6 border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                Device Registered Successfully
              </CardTitle>
              <CardDescription>
                Save this secret token securely. It cannot be retrieved again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Device ID</label>
                  <p className="font-mono text-sm bg-secondary p-2 rounded mt-1" data-testid="text-new-device-id">
                    {newDevice.deviceId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secret Token</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 font-mono text-sm bg-secondary p-2 rounded break-all" data-testid="text-secret-token">
                      {newDevice.secretToken}
                    </code>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copyToken}
                      data-testid="button-copy-token"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setNewDevice(null)}
                    data-testid="button-dismiss-new-device"
                  >
                    I've saved my token
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loading-spinner" />
          </div>
        ) : devices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Gamepad2 className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No devices registered</h3>
              <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
                Register a Playdate device to start creating and joining battles.
              </p>
              <Button onClick={registerDevice} disabled={registering} data-testid="button-register-first-device">
                <Plus className="w-4 h-4 mr-2" />
                Register Your First Device
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card key={device.deviceId} data-testid={`device-card-${device.deviceId}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{device.displayName}</h3>
                  <p className="text-xs text-muted-foreground font-mono mb-4">
                    {device.deviceId.substring(0, 20)}...
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Registered
                      </span>
                      <span>{formatDate(device.registeredAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Last seen</span>
                      <span>{formatRelativeTime(device.lastSeen)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>How to authenticate your Playdate device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Register Device</h4>
                <pre className="bg-secondary p-3 rounded-lg text-sm overflow-x-auto">
{`POST /api/register
Content-Type: application/json

{ "displayName": "My Playdate" }`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Use Token in Requests</h4>
                <pre className="bg-secondary p-3 rounded-lg text-sm overflow-x-auto">
{`POST /api/battles
Authorization: Bearer <your-secret-token>
Content-Type: application/json

{ "mapData": {...} }`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Submit Turns</h4>
                <pre className="bg-secondary p-3 rounded-lg text-sm overflow-x-auto">
{`POST /api/turns
Authorization: Bearer <your-secret-token>
Content-Type: application/json

{
  "battleId": "abc123",
  "actions": [
    { "type": "move", "unitId": "u1", "from": {"x":1,"y":2}, "to": {"x":3,"y":2} },
    { "type": "attack", "unitId": "u1", "targetId": "enemy1" },
    { "type": "end_turn" }
  ],
  "gameState": { ... }
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
