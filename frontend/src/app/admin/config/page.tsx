'use client';

import { Save } from 'lucide-react';

export default function AdminConfigPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configuration</h1>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>

      {/* Pricing — Tajweed */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <h2 className="font-semibold mb-4">Tajweed Pricing (USD/month)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Basic</label>
            <input type="number" defaultValue={50} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Premium</label>
            <input type="number" defaultValue={55} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
        </div>
      </div>

      {/* Pricing — Hifz */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <h2 className="font-semibold mb-4">Hifz Pricing (USD/month)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Basic</label>
            <input type="number" defaultValue={60} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Premium</label>
            <input type="number" defaultValue={65} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
        </div>
      </div>

      {/* Session Rules */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <h2 className="font-semibold mb-4">Session Rules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Session Duration (minutes)</label>
            <input type="number" defaultValue={45} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Sessions per Month</label>
            <input type="number" defaultValue={8} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Min Gap Between Sessions (days)</label>
            <input type="number" defaultValue={3} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Free Reschedule Window (hours)</label>
            <input type="number" defaultValue={12} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Min Booking Lead Time (hours)</label>
            <input type="number" defaultValue={12} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Lecturer Rate per Session (LKR)</label>
            <input type="number" defaultValue={1250} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Payout Cycle</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]">
              <option>Bi-weekly</option><option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Payment Processing Fee (%)</label>
            <input type="number" defaultValue={3} step={0.1} className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
        </div>
      </div>
    </div>
  );
}
