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
              href={`/battle/${encodeURIComponent(battle.displayName)}`}
              data-testid={`battle-card-${battle.battleId}`}
              className="block group"
            >
              <Card className="hover:border-primary/50 transition-all cursor-pointer active:scale-[0.99]">
                <CardContent className="flex items-center justify-between gap-4 p-3 px-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-8 h-8 overflow-hidden">
                        <img 
                          src={`/birb${battle.player1Avatar?.replace('BIRD', '').padStart(3, '0') || '001'}.png`} 
                          alt={battle.player1Avatar || 'BIRD1'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {battle.player2Avatar && (
                        <div className="w-8 h-8 overflow-hidden">
                          <img 
                            src={`/birb${battle.player2Avatar.replace('BIRD', '').padStart(3, '0')}.png`} 
                            alt={battle.player2Avatar}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold uppercase text-sm truncate" data-testid={`battle-name-${battle.battleId}`}>
                          {battle.displayName || generateBattleName(battle.battleId)}
                        </h3>
                        {getStatusBadge(battle.status)}
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground flex items-center gap-1.5">
                        <span>{battle.player1DisplayName}</span>
                        <span className="text-[9px] opacity-40">VS</span>
                        <span>{battle.player2DisplayName || 'WAITING...'}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground uppercase font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(battle.updatedAt)}
                        </span>
                        <span>TURN {battle.currentTurn}</span>
                        <span>{battle.mapName || 'Standard'}</span>
                      </div>
                    </div>
                  </div>
                  {showCreatedDate && (
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-[10px] text-muted-foreground uppercase">Created</p>
                      <p className="text-[10px] font-bold uppercase">{formatDate(battle.createdAt)}</p>
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
