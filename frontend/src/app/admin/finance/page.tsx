'use client';

import { DollarSign, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { adminStats, payouts } from '@/lib/mock-data';

export default function AdminFinancePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `Rs. ${(adminStats.revenueThisMonth/1000)}K`, trend: '+12%', up: true },
          { label: 'Lecturer Payouts', value: `Rs. ${(adminStats.payoutsThisMonth/1000)}K`, trend: '+8%', up: true },
          { label: 'Net Profit', value: `Rs. ${(adminStats.profitThisMonth/1000).toFixed(0)}K`, trend: '+18%', up: true },
          { label: 'Payment Processing', value: `Rs. ${(adminStats.revenueThisMonth*0.03/1000).toFixed(0)}K`, trend: '3%', up: false },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{m.label}</div>
            <div className="text-xl font-bold">{m.value}</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${m.up ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
              {m.up ? <TrendingUp className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />} {m.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown chart */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <h2 className="font-semibold mb-4">Revenue by Tier</h2>
        <div className="space-y-4">
          {[
            { tier: 'Quran Basic', students: 65, revenue: 975000, color: 'from-blue-500 to-blue-400' },
            { tier: 'Quran Premium', students: 52, revenue: 936000, color: 'from-[hsl(168,80%,26%)] to-[hsl(168,60%,40%)]' },
            { tier: 'Hadith & Fiqh', students: 25, revenue: 500000, color: 'from-[hsl(var(--accent))] to-amber-400' },
          ].map((t) => (
            <div key={t.tier}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{t.tier} <span className="text-[hsl(var(--muted-foreground))] font-normal">({t.students} students)</span></span>
                <span className="font-medium">Rs. {(t.revenue/1000).toFixed(0)}K</span>
              </div>
              <div className="h-3 rounded-full bg-[hsl(var(--muted))]">
                <div className={`h-full rounded-full bg-gradient-to-r ${t.color}`} style={{ width: `${(t.revenue / 1000000) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lecturer payouts */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Recent Payouts</h2>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          {payouts.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between px-5 py-3.5 text-sm ${i > 0 ? 'border-t border-[hsl(var(--border))]' : ''}`}>
              <span className="font-medium">Lecturer {p.lecturerId}</span>
              <span className="text-[hsl(var(--muted-foreground))]">{p.sessionsCount} sessions</span>
              <span className="font-medium">Rs. {p.amountLKR.toLocaleString()}</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : p.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
