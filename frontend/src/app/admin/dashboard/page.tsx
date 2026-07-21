'use client';

import Link from 'next/link';
import { Users, DollarSign, TrendingUp, Clock, AlertTriangle, UserPlus, Lock } from 'lucide-react';
import { adminStats } from '@/lib/mock-data';
import { useRole } from '@/lib/role-context';

export default function AdminDashboard() {
  let adminRole = 'owner';
  try {
    const context = useRole();
    adminRole = context.role;
  } catch(e) {}

  const profitMargin = ((adminStats.profitThisMonth / adminStats.revenueThisMonth) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ...(adminRole === 'owner' ? [{ label: 'Monthly Revenue', value: `Rs. ${(adminStats.mrrLKR / 1000).toFixed(0)}K`, sub: `$${(adminStats.mrrUSD / 1000).toFixed(1)}K USD`, icon: DollarSign, color: 'text-[hsl(var(--primary))]' }] : []),
          { label: 'Active Students', value: adminStats.activeStudents, sub: `${adminStats.totalStudents} total`, icon: Users, color: 'text-blue-500' },
          { label: 'Active Lecturers', value: adminStats.activeLecturers, sub: `${adminStats.pendingApplications} pending`, icon: UserPlus, color: 'text-purple-500' },
          { label: 'Sessions Today', value: adminStats.sessionsToday, sub: `${adminStats.sessionsThisWeek} this week`, icon: Clock, color: 'text-[hsl(var(--accent))]' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{stat.label}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      <div className={`grid ${adminRole === 'owner' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Financial Overview */}
        {adminRole === 'owner' ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <h2 className="font-semibold mb-4">Financial Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Revenue</div>
                  <div className="text-xl font-bold text-[hsl(var(--primary))]">Rs. {(adminStats.revenueThisMonth / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Payouts</div>
                  <div className="text-xl font-bold text-[hsl(var(--accent))]">Rs. {(adminStats.payoutsThisMonth / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Profit</div>
                  <div className="text-xl font-bold text-[hsl(var(--success))]">Rs. {(adminStats.profitThisMonth / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-[hsl(var(--success))]">{profitMargin}% margin</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Alerts & Metrics */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="font-semibold mb-3">Alerts</h3>
            <div className="space-y-3">
              <Link href="/admin/requests" className="flex items-start gap-3 text-sm p-2 -mx-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{adminStats.unassignedStudents} students need assignment</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">New enrollments awaiting a lecturer</div>
                </div>
              </Link>
              <Link href="/admin/requests" className="flex items-start gap-3 text-sm p-2 -mx-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{adminStats.lecturerChangeRequests} lecturer change requests</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">From existing students</div>
                </div>
              </Link>
              <div className="flex items-start gap-3 text-sm p-2 -mx-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{adminStats.pendingApplications} pending lecturer applications</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">Require review</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm p-2 -mx-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{adminStats.paymentFailures} payment failures</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">This week</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <h3 className="font-semibold mb-3">Platform Metrics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Churn Rate</span><span className="font-medium">{adminStats.churnRate}%</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Avg Rating</span><span className="font-medium">{adminStats.avgRating} ⭐</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Payout Cycle</span><span className="font-medium">Bi-weekly</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
