'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import type { AuditLogEntry } from '@/app/actions/admin';

interface AuditLogsProps {
  logs: AuditLogEntry[];
}

const EVENT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  admin_login: { label: 'Admin Login', color: 'bg-blue-500' },
  admin_login_failed: { label: 'Login Failed', color: 'bg-red-500' },
  device_register: { label: 'Device Register', color: 'bg-green-500' },
  device_recover: { label: 'Device Recover', color: 'bg-yellow-500' },
  device_api_access: { label: 'API Access', color: 'bg-gray-500' },
  admin_action: { label: 'Admin Action', color: 'bg-purple-500' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function truncateUserAgent(userAgent?: string): string {
  if (!userAgent) return '-';
  if (userAgent.length <= 50) return userAgent;
  return userAgent.substring(0, 47) + '...';
}

export default function AuditLogs({ logs: initialLogs }: AuditLogsProps) {
  const [logs] = useState<AuditLogEntry[]>(initialLogs);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterIp, setFilterIp] = useState<string>('');
  const [filterSuccess, setFilterSuccess] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    if (filterType !== 'all' && log.eventType !== filterType) return false;
    if (filterIp && !log.ip.toLowerCase().includes(filterIp.toLowerCase())) return false;
    if (filterSuccess === 'success' && !log.success) return false;
    if (filterSuccess === 'failed' && log.success) return false;
    return true;
  });

  const uniqueIps = [...new Set(logs.map(log => log.ip))];
  const ipCounts = uniqueIps.reduce((acc, ip) => {
    acc[ip] = logs.filter(log => log.ip === ip).length;
    return acc;
  }, {} as Record<string, number>);

  const suspiciousIps = uniqueIps.filter(ip => {
    const ipLogs = logs.filter(log => log.ip === ip);
    const failedCount = ipLogs.filter(log => !log.success).length;
    return failedCount > 3 || ipLogs.length > 20;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase">TOTAL EVENTS</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-events">{logs.length}</div>
            <p className="text-xs text-muted-foreground">Last 100 events shown</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase">UNIQUE IPS</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-unique-ips">{uniqueIps.length}</div>
            <p className="text-xs text-muted-foreground">Distinct IP addresses</p>
          </CardContent>
        </Card>

        <Card className={suspiciousIps.length > 0 ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase">SUSPICIOUS</CardTitle>
            <AlertCircle className={`h-4 w-4 ${suspiciousIps.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-suspicious-ips">{suspiciousIps.length}</div>
            <p className="text-xs text-muted-foreground">IPs with unusual activity</p>
          </CardContent>
        </Card>
      </div>

      {suspiciousIps.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-sm font-medium uppercase flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              SUSPICIOUS IP ADDRESSES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suspiciousIps.map(ip => (
                <Badge 
                  key={ip} 
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => setFilterIp(ip)}
                  data-testid={`badge-suspicious-ip-${ip}`}
                >
                  {ip} ({ipCounts[ip]} events)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="uppercase">AUDIT LOG</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-type">
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="admin_login">Admin Login</SelectItem>
                  <SelectItem value="admin_login_failed">Login Failed</SelectItem>
                  <SelectItem value="device_register">Device Register</SelectItem>
                  <SelectItem value="device_recover">Device Recover</SelectItem>
                  <SelectItem value="device_api_access">API Access</SelectItem>
                  <SelectItem value="admin_action">Admin Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select value={filterSuccess} onValueChange={setFilterSuccess}>
                <SelectTrigger className="w-[140px]" data-testid="select-filter-status">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">IP:</span>
              <Input
                placeholder="Filter by IP..."
                value={filterIp}
                onChange={(e) => setFilterIp(e.target.value)}
                className="w-[160px]"
                data-testid="input-filter-ip"
              />
              {filterIp && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setFilterIp('')}
                  data-testid="button-clear-ip-filter"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="uppercase">TIME</TableHead>
                  <TableHead className="uppercase">TYPE</TableHead>
                  <TableHead className="uppercase">IP</TableHead>
                  <TableHead className="uppercase">STATUS</TableHead>
                  <TableHead className="uppercase">USER/DEVICE</TableHead>
                  <TableHead className="uppercase">DETAILS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const eventInfo = EVENT_TYPE_LABELS[log.eventType] || { label: log.eventType, color: 'bg-gray-500' };
                    return (
                      <TableRow key={log.id} data-testid={`row-audit-${log.id}`}>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs uppercase">
                            {eventInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <button
                            className="hover:underline cursor-pointer"
                            onClick={() => setFilterIp(log.ip)}
                            data-testid={`button-filter-ip-${log.id}`}
                          >
                            {log.ip}
                          </button>
                        </TableCell>
                        <TableCell>
                          {log.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {log.userEmail && <div className="text-muted-foreground">{log.userEmail}</div>}
                          {log.deviceId && <div className="font-mono text-muted-foreground">{log.deviceId.substring(0, 8)}...</div>}
                          {!log.userEmail && !log.deviceId && <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {log.details || log.endpoint || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
