'use client';

import { Clock, Users, DollarSign, Star, Video, Calendar, TrendingUp, ChevronRight, Play, Wallet } from 'lucide-react';
import { sessions } from '@/lib/mock-data';
import Link from 'next/link';
import { useState } from 'react';

const todaySessions = sessions.filter(s => s.status === 'scheduled').slice(0, 4);

export default function LecturerDashboard() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assalamu Alaikum, Sheikh Ahmed!</h1>
          <p className="text-[hsl(var(--muted-foreground))]">You have 4 sessions today</p>
        </div>
        <Link href="/lecturer/availability" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
          <Calendar className="h-4 w-4" /> Manage Availability
        </Link>
      </div>

      {/* Earnings Summary — Bi-Weekly (Change request 4.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] relative overflow-hidden">
          <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[hsl(var(--primary)/0.1)] to-transparent rounded-bl-[80px]" />
          <DollarSign className="h-5 w-5 text-[hsl(var(--accent))] mb-2" />
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Pending Earnings (This Cycle)</div>
          <div className="text-2xl font-bold text-gradient-primary">Rs. 12,500</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">5 session blocks completed</div>
          <button onClick={() => setShowWithdrawModal(true)} className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-md transition-all">
            <Wallet className="h-3.5 w-3.5" /> Withdraw
          </button>
        </div>
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <DollarSign className="h-5 w-5 text-[hsl(var(--success))] mb-2" />
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Total Earnings (Lifetime)</div>
          <div className="text-2xl font-bold">Rs. 162,500</div>
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--success))] mt-1"><TrendingUp className="h-3 w-3" /> +15% from last cycle</div>
        </div>
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <Clock className="h-5 w-5 text-[hsl(var(--primary))] mb-2" />
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Sessions Completed (This Cycle)</div>
          <div className="text-2xl font-bold">10</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Bi-weekly payout cycle · 5 blocks of 2</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sessions This Week', value: '12', icon: Clock, color: 'text-[hsl(var(--primary))]' },
          { label: 'Active Students', value: '45', icon: Users, color: 'text-blue-500' },
          { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-amber-500' },
          { label: 'Payout Cycle', value: 'Bi-weekly', icon: Calendar, color: 'text-purple-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <Icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Today's Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Today&apos;s Sessions</h2>
          <Link href="/lecturer/sessions" className="text-sm text-[hsl(var(--primary))] hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {todaySessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div className="h-11 w-11 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[hsl(var(--primary))]">
                {s.studentName.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{s.studentName}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.subject}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(s.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <button className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] flex items-center gap-1.5">
                <Play className="h-3 w-3" /> Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-xl max-w-sm w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold mb-2">Withdraw Earnings</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Withdraw your pending earnings of Rs. 12,500 (5 blocks × Rs. 2,500).</p>
            <div className="p-3 rounded-lg bg-[hsl(var(--muted))] text-xs text-[hsl(var(--muted-foreground))] mb-4">
              <strong>Rate:</strong> Rs. 1,250 per 45-min session<br />
              <strong>Block:</strong> 2 sessions = Rs. 2,500<br />
              <strong>Payout method:</strong> Bank transfer (configured in Settings)
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">Cancel</button>
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">Confirm Withdrawal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
