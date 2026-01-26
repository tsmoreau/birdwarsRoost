'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Swords, 
  Clock, 
  Trophy,
  Users,
  ArrowLeft,
  Loader2,
  Filter
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { generateBattleName } from '@/lib/battleNames';
import Nav from '@/components/Nav';

interface Battle {
  battleId: string;
  displayName: string;
  player1DeviceId: string;
  player2DeviceId: string | null;
  status: 'pending' | 'active' | 'completed' | 'abandoned';
  currentTurn: number;
  createdAt: string;
  updatedAt: string;
  winnerId: string | null;
}

export default function BattlesPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchBattles() {
      try {
        const res = await fetch('/api/battles');
        const data = await res.json();
        if (data.success) setBattles(data.battles);
      } catch (error) {
        console.error('Failed to fetch battles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBattles();
  }, []);

  const filteredBattles = filter === 'all' 
    ? battles 
    : battles.filter(b => b.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" data-testid="badge-status-active">Active</Badge>;
      case 'pending':
        return <Badge variant="warning" data-testid="badge-status-pending">Waiting</Badge>;
      case 'completed':
        return <Badge variant="secondary" data-testid="badge-status-completed">Completed</Badge>;
      case 'abandoned':
        return <Badge variant="destructive" data-testid="badge-status-abandoned">Abandoned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Swords className="w-5 h-5 text-muted-foreground" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-muted-foreground" />;
      case 'completed':
        return <Trophy className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Swords className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Battles</h1>
            <p className="text-muted-foreground">View and manage all battle sessions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'completed'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                data-testid={`filter-${status}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" data-testid="loading-spinner" />
          </div>
        ) : filteredBattles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Swords className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No battles found</h3>
              <p className="text-muted-foreground text-sm text-center max-w-md">
                {filter === 'all' 
                  ? 'Start a new battle from your Playdate device to see it here.'
                  : `No ${filter} battles at the moment.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredBattles.map((battle) => (
              <Link
                key={battle.battleId}
                href={`/battles/${battle.battleId}`}
                data-testid={`battle-card-${battle.battleId}`}
              >
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        {getStatusIcon(battle.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold" data-testid={`battle-name-${battle.battleId}`}>{battle.displayName || generateBattleName(battle.battleId)}</h3>
                          {getStatusBadge(battle.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {battle.player2DeviceId ? '2 players' : '1 player (waiting)'}
                          </span>
                          <span>Turn {battle.currentTurn}</span>
                          <span>Updated {formatRelativeTime(battle.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{formatDate(battle.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
