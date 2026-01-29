import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Swords,
  Activity,
  Clock,
  Trophy,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import Nav from "@/components/Nav";
import BattlesList from "@/components/BattlesList";
import { getBattles } from "@/app/actions/battles";
import { getDevices } from "@/app/actions/devices";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [battles, devices] = await Promise.all([
    getBattles({ limit: 10 }),
    getDevices({ limit: 5 }),
  ]);

  const activeBattles = battles.filter((b) => b.status === "active").length;
  const pendingBattles = battles.filter((b) => b.status === "pending").length;
  const completedBattles = battles.filter(
    (b) => b.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Battles
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                data-testid="stat-active-battles"
              >
                {activeBattles}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Battles
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                data-testid="stat-pending-battles"
              >
                {pendingBattles}
              </div>
              <p className="text-xs text-muted-foreground">
                Waiting for opponent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold"
                data-testid="stat-completed-battles"
              >
                {completedBattles}
              </div>
              <p className="text-xs text-muted-foreground">Finished battles</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Recent Battles</CardTitle>
                  <CardDescription>
                    Latest public battle activity
                  </CardDescription>
                </div>
                <Link href="/battles">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="button-view-all-battles"
                  >
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
                emptyMessage="No battles yet. Start one from your Playdate!"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Registered Players</CardTitle>
                  <CardDescription>Connected Playdate players</CardDescription>
                </div>
                <Link href="/devices">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="button-view-all-devices"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No players registered</p>
                  <p className="text-sm">Register via the API</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div
                      key={device.deviceId}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                      data-testid={`device-row-${device.deviceId}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {device.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last seen {formatRelativeTime(device.lastSeen)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">Online</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p className="uppercase tracking-wide font-medium">
            Bird Wars Async Battle Server
          </p>
        </div>
      </footer>
    </div>
  );
}
