import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Swords, 
  Gamepad2, 
  Activity, 
  Clock, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Nav from '@/components/Nav';
import BattlesList from '@/components/BattlesList';
import { getBattles } from '@/app/actions/battles';
import { getDevices } from '@/app/actions/devices';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [battles, devices] = await Promise.all([
    getBattles({ limit: 10 }),
    getDevices({ limit: 5 })
  ]);

  const activeBattles = battles.filter(b => b.status === 'active').length;
  const pendingBattles = battles.filter(b => b.status === 'pending').length;
  const completedBattles = battles.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your Bird Wars battles and devices</p>
        </div>

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
              <BattlesList 
                battles={battles.slice(0, 5)} 
                showFilters={false}
                showCreatedDate={false}
                emptyMessage="Start a battle from your Playdate!"
              />
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
                  {devices.map((device) => (
                    <Link
                      key={device.deviceId}
                      href={`/player/${encodeURIComponent(device.displayName)}`}
                      className="block group"
                    >
                      <div
                        className="flex items-center justify-between p-3 rounded-lg border border-border transition-all active:scale-[0.98]"
                        data-testid={`device-row-${device.deviceId}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center transition-colors">
                            <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase tracking-tight">{device.displayName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">
                              Last seen {formatRelativeTime(device.lastSeen)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
