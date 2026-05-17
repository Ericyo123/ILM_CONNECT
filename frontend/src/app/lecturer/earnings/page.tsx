'use client';

import { DollarSign, TrendingUp, Clock, ArrowUpRight, Download } from 'lucide-react';
import { payouts } from '@/lib/mock-data';

const monthlyEarnings = [
  { month: 'Nov', amount: 22500 },
  { month: 'Dec', amount: 25000 },
  { month: 'Jan', amount: 27500 },
  { month: 'Feb', amount: 25000 },
  { month: 'Mar', amount: 30000 },
  { month: 'Apr', amount: 32500 },
];

export default function EarningsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <DollarSign className="h-5 w-5 text-[hsl(var(--primary))] mb-2" />
          <div className="text-2xl font-bold">Rs. 32,500</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">This month&apos;s earnings</div>
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--success))] mt-1"><TrendingUp className="h-3 w-3" /> +8.3%</div>
        </div>
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <Clock className="h-5 w-5 text-[hsl(var(--accent))] mb-2" />
          <div className="text-2xl font-bold">Rs. 12,500</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">Pending payout</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">5 session blocks</div>
        </div>
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <DollarSign className="h-5 w-5 text-[hsl(var(--success))] mb-2" />
          <div className="text-2xl font-bold">Rs. 162,500</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">Total earned (all time)</div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <h2 className="font-semibold mb-4">Monthly Earnings</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyEarnings.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-medium">Rs. {(m.amount / 1000).toFixed(0)}K</div>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-[hsl(168,80%,26%)] to-[hsl(168,60%,40%)] transition-all" style={{ height: `${(m.amount / 35000) * 100}%` }} />
              <div className="text-xs text-[hsl(var(--muted-foreground))]">{m.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout History */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Payout History</h2>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-5 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
            <span>Date</span><span>Sessions</span><span>Amount</span><span>Status</span>
          </div>
          {payouts.map((p) => (
            <div key={p.id} className="grid grid-cols-4 gap-4 px-5 py-3.5 text-sm border-b border-[hsl(var(--border))] last:border-0">
              <span>{new Date(p.initiatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>{p.sessionsCount} sessions</span>
              <span className="font-medium">Rs. {p.amountLKR.toLocaleString()}</span>
              <span className={`inline-flex items-center w-fit px-2 py-0.5 text-xs font-medium rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : p.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
