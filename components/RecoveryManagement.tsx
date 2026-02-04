'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  RefreshCw,
  Plus,
  X,
  ArrowRight,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import {
  createRecoveryLink,
  cancelRecovery,
  AdminRecoveryDetails,
} from '@/app/actions/admin';

interface RecoveryManagementProps {
  recoveries: AdminRecoveryDetails[];
}

export default function RecoveryManagement({ recoveries }: RecoveryManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedRecovery, setSelectedRecovery] = useState<AdminRecoveryDetails | null>(null);
  
  const [oldDeviceId, setOldDeviceId] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const handleCreateRecovery = () => {
    if (!oldDeviceId.trim() || !newDeviceId.trim()) {
      toast({
        title: 'Error',
        description: 'Both device IDs are required',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await createRecoveryLink(
        oldDeviceId.trim(),
        newDeviceId.trim(),
        adminNotes.trim() || undefined
      );

      if (!result.success) {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create recovery link',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Recovery link created successfully',
      });

      setShowCreateDialog(false);
      setOldDeviceId('');
      setNewDeviceId('');
      setAdminNotes('');
    });
  };

  const handleCancelRecovery = (recovery: AdminRecoveryDetails) => {
    setSelectedRecovery(recovery);
    setShowCancelDialog(true);
  };

  const confirmCancelRecovery = () => {
    if (!selectedRecovery) return;

    startTransition(async () => {
      const result = await cancelRecovery(selectedRecovery.id);

      if (!result.success) {
        toast({
          title: 'Error',
          description: result.error || 'Failed to cancel recovery',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Recovery cancelled successfully',
      });

      setShowCancelDialog(false);
      setSelectedRecovery(null);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">PENDING</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">COMPLETED</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  const pendingCount = recoveries.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="uppercase">ACCOUNT RECOVERY</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {pendingCount} pending {pendingCount === 1 ? 'recovery' : 'recoveries'}
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-recovery">
                <Plus className="w-4 h-4 mr-2" />
                CREATE RECOVERY LINK
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="uppercase">CREATE RECOVERY LINK</DialogTitle>
                <DialogDescription>
                  Link an old device ID to a new device ID for account recovery.
                  The user will be prompted to recover on their next login.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="oldDeviceId">Original Device ID (from QR code)</Label>
                  <Input
                    id="oldDeviceId"
                    placeholder="Enter the device ID from the QR code"
                    value={oldDeviceId}
                    onChange={(e) => setOldDeviceId(e.target.value)}
                    data-testid="input-old-device-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newDeviceId">New Device ID (user's current device)</Label>
                  <Input
                    id="newDeviceId"
                    placeholder="Enter the user's new device ID"
                    value={newDeviceId}
                    onChange={(e) => setNewDeviceId(e.target.value)}
                    data-testid="input-new-device-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes (optional)</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Any notes about this recovery..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    data-testid="input-admin-notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  CANCEL
                </Button>
                <Button
                  onClick={handleCreateRecovery}
                  disabled={isPending}
                  data-testid="button-confirm-create-recovery"
                >
                  {isPending ? 'CREATING...' : 'CREATE LINK'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {recoveries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recovery links created yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recoveries.map((recovery) => (
                <div
                  key={recovery.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                  data-testid={`recovery-item-${recovery.id}`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{recovery.oldDisplayName}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {recovery.oldDeviceId.substring(0, 16)}...
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{recovery.newDisplayName}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {recovery.newDeviceId.substring(0, 16)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {getStatusBadge(recovery.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(recovery.createdAt)}
                      </span>
                    </div>
                  </div>
                  {recovery.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancelRecovery(recovery)}
                      disabled={isPending}
                      data-testid={`button-cancel-recovery-${recovery.id}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase">CANCEL RECOVERY?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the pending recovery link. The user will not be
              prompted to recover their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>KEEP</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelRecovery}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              CANCEL RECOVERY
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
