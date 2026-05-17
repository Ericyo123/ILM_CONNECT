'use client';

import { useState } from 'react';
import { Search, Eye, GraduationCap } from 'lucide-react';
import { students } from '@/lib/mock-data';

const myStudents = students.slice(0, 7).map((s, i) => ({
  ...s,
  course: i % 2 === 0 ? 'Tajweed' : 'Hifz',
  courseTier: s.tier === 'premium' ? 'Premium' : 'Basic',
  nextSession: 'Wed, May 7 · 2:00 PM',
  lastNote: i === 0 ? 'Great progress on Noon Sakinah rules' : i === 1 ? 'Needs to revise Juz 4' : '',
}));

export default function LecturerStudentsPage() {
  const [search, setSearch] = useState('');
  const [sel, setSel] = useState<typeof myStudents[0] | null>(null);

  const filtered = myStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">My Students</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
      </div>
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Student</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Course</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Tier</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Sessions</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)]">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white text-xs font-bold">{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                    <div><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-[hsl(var(--muted-foreground))]">{s.country}</div></div>
                  </div>
                </td>
                <td className="py-3 px-5"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${s.course === 'Tajweed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>{s.course}</span></td>
                <td className="py-3 px-5 text-xs font-medium">{s.courseTier}</td>
                <td className="py-3 px-5 text-sm">{s.sessionsCompleted}</td>
                <td className="py-3 px-5 text-right"><button onClick={() => setSel(s)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))]"><Eye className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setSel(null)}>
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-xl max-w-sm w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">{sel.name}</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Course</span><span>{sel.course} ({sel.courseTier})</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Sessions</span><span>{sel.sessionsCompleted}</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Country</span><span>{sel.country}</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Next Session</span><span>{sel.nextSession}</span></div>
            </div>
            {sel.lastNote && <div className="p-3 rounded-lg bg-[hsl(var(--muted))] text-sm mb-4"><strong>Note:</strong> {sel.lastNote}</div>}
            <button onClick={() => setSel(null)} className="w-full py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
