import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Swords, 
  Activity, 
  Clock, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import Nav from '@/components/Nav';
import BattlesList from '@/components/BattlesList';
import { getBattles } from '@/app/actions/battles';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const battles = await getBattles({ limit: 10 });

  const activeBattles = battles.filter(b => b.status === 'active').length;
  const pendingBattles = battles.filter(b => b.status === 'pending').length;
  const completedBattles = battles.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 dither-pattern p-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-wide">Bird Wars Roost</h1>
          <p className="text-muted-foreground">Public battle activity and stats</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Recent Battles</CardTitle>
                <CardDescription>Latest public battle activity</CardDescription>
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
              emptyMessage="No battles yet. Start one from your Playdate!"
            />
          </CardContent>
        </Card>
      </main>

      <footer className="border-t-2 border-border py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p className="uppercase tracking-wide font-medium">Bird Wars Async Battle Server</p>
        </div>
      </footer>
    </div>
  );
}
