'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Swords, 
  Users, 
  Gamepad2, 
  Activity, 
  Clock, 
  Trophy,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Nav from '@/components/Nav';

interface Battle {
  battleId: string;
  player1DeviceId: string;
  player2DeviceId: string | null;
  status: 'pending' | 'active' | 'completed' | 'abandoned';
  currentTurn: number;
  createdAt: string;
  updatedAt: string;
}

interface Device {
  deviceId: string;
  displayName: string;
  registeredAt: string;
  lastSeen: string;
}

export default function DashboardPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [battlesRes, devicesRes] = await Promise.all([
          fetch('/api/battles'),
          fetch('/api/register')
        ]);

        const battlesData = await battlesRes.json();
        const devicesData = await devicesRes.json();

        if (battlesData.success) setBattles(battlesData.battles);
        if (devicesData.success) setDevices(devicesData.devices);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const activeBattles = battles.filter(b => b.status === 'active').length;
  const pendingBattles = battles.filter(b => b.status === 'pending').length;
  const completedBattles = battles.filter(b => b.status === 'completed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" data-testid="badge-status-active">Active</Badge>;
      case 'pending':
        return <Badge variant="warning" data-testid="badge-status-pending">Waiting</Badge>;
      case 'completed':
        return <Badge variant="secondary" data-testid="badge-status-completed">Completed</Badge>;
      default:
        return <Badge variant="outline" data-testid="badge-status-other">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your Bird Wars battles and devices</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" data-testid="loading-spinner" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Battles</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-active-battles">{activeBattles}</div>
                  <p className="text-xs text-muted-foreground">Currently in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Battles</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-pending-battles">{pendingBattles}</div>
                  <p className="text-xs text-muted-foreground">Waiting for opponent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-completed-battles">{completedBattles}</div>
                  <p className="text-xs text-muted-foreground">Finished battles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Devices</CardTitle>
                  <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="stat-devices">{devices.length}</div>
                  <p className="text-xs text-muted-foreground">Registered Playdates</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Recent Battles</CardTitle>
                      <CardDescription>Latest battle activity</CardDescription>
                    </div>
                    <Link href="/battles">
                      <Button variant="outline" size="sm" data-testid="button-view-all-battles">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {battles.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Swords className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No battles yet</p>
                      <p className="text-sm">Start a battle from your Playdate!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {battles.slice(0, 5).map((battle) => (
                        <Link
                          key={battle.battleId}
                          href={`/battles/${battle.battleId}`}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                          data-testid={`battle-row-${battle.battleId}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Swords className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Battle #{battle.battleId.substring(0, 8)}</p>
                              <p className="text-xs text-muted-foreground">
                                Turn {battle.currentTurn} • {formatRelativeTime(battle.updatedAt)}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(battle.status)}
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Registered Devices</CardTitle>
                      <CardDescription>Connected Playdate devices</CardDescription>
                    </div>
                    <Link href="/devices">
                      <Button variant="outline" size="sm" data-testid="button-view-all-devices">
                        Manage
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {devices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No devices registered</p>
                      <p className="text-sm">Register a device via the API</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {devices.slice(0, 5).map((device) => (
                        <div
                          key={device.deviceId}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                          data-testid={`device-row-${device.deviceId}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{device.displayName}</p>
                              <p className="text-xs text-muted-foreground">
                                Last seen {formatRelativeTime(device.lastSeen)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
