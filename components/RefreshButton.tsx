'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
      className="gap-2 uppercase font-bold text-xs"
      data-testid="button-refresh-dashboard"
    >
      <RefreshCw className={cn("w-4 h-4", isPending && "animate-spin")} />
      {isPending ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}
