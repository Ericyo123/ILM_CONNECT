'use client';

import { useState } from 'react';
import { Search, Filter, Shield } from 'lucide-react';
import { auditLogs } from '@/lib/mock-data';

const actionColors: Record<string, string> = {
  USER_APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  SESSION_BOOKED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PAYOUT_INITIATED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  SUBSCRIPTION_UPDATED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  AVAILABILITY_UPDATED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  USER_SUSPENDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  PASSWORD_CHANGED: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  SESSION_NOTES_ADDED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
};

export default function AuditLogPage() {
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(l => l.actorName.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Audit Log</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <input type="text" placeholder="Search by actor or action..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
      </div>

      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Timestamp</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Actor</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Action</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Resource</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)]">
                <td className="py-3 px-5 text-xs text-[hsl(var(--muted-foreground))]">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="py-3 px-5 text-sm font-medium">{log.actorName}</td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-5 text-xs text-[hsl(var(--muted-foreground))]">{log.resourceType}/{log.resourceId}</td>
                <td className="py-3 px-5 text-xs text-[hsl(var(--muted-foreground))] font-mono">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
