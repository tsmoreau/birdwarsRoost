'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Swords, 
  Clock, 
  Trophy,
  Users,
  Filter
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { generateBattleName } from '@/lib/battleNames';
import type { BattleWithDetails } from '@/app/actions/battles';

interface BattlesListProps {
  battles: BattleWithDetails[];
  showFilters?: boolean;
  showCreatedDate?: boolean;
  emptyMessage?: string;
}

export default function BattlesList({ 
  battles, 
  showFilters = true,
  showCreatedDate = true,
  emptyMessage = 'No battles found'
}: BattlesListProps) {
  const [filter, setFilter] = useState<string>('all');

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
    <div>
      {showFilters && (
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2 flex-wrap">
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
      )}

      {filteredBattles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Swords className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No battles found</h3>
            <p className="text-muted-foreground text-sm text-center max-w-md">
              {filter === 'all' 
                ? emptyMessage
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
                <CardContent className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      {getStatusIcon(battle.status)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-col gap-1 mb-1">
                        <h3 className="font-semibold truncate" data-testid={`battle-name-${battle.battleId}`}>
                          {battle.displayName || generateBattleName(battle.battleId)}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {battle.player1DisplayName} <span className="text-muted-foreground/60 font-normal mx-0.5 tracking-tighter">VS</span> {battle.player2DisplayName || 'OPEN SLOT'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {battle.player2DeviceId ? '2 players' : '1 player (waiting)'}
                          </span>
                          <span>Turn {battle.currentTurn}</span>
                          <span>Updated {formatRelativeTime(battle.updatedAt)}</span>
                        </div>
                        <div className="pt-1">
                          {getStatusBadge(battle.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {showCreatedDate && (
                    <div className="text-right shrink-0">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{formatDate(battle.createdAt)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
