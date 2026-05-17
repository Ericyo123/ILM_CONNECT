'use client';

import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Shield, UserX, Key, Eye } from 'lucide-react';
import { students, lecturers } from '@/lib/mock-data';

const allUsers = [
  ...students.map(s => ({ ...s, role: 'student' as const })),
  ...lecturers.map(l => ({ id: l.id, name: l.name, email: `${l.name.split(' ').pop()?.toLowerCase()}@scholar.com`, role: 'lecturer' as const, status: l.status, country: 'Sri Lanka', tier: undefined })),
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">User Management</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
        <div className="flex gap-2">
          {['all', 'student', 'lecturer'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${roleFilter === r ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]'}`}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">User</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Role</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)]">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{u.name}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${u.role === 'student' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" title="View"><Eye className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" title="Reset Password"><Key className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]" title="Suspend"><UserX className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
