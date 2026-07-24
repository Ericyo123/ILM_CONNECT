'use client';

import { useState } from 'react';
import { Search, Eye, GraduationCap, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export default function LecturerStudentsPage() {
  const [search, setSearch] = useState('');
  const [sel, setSel] = useState<any | null>(null);

  // Fetch all bookings for this lecturer
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['lecturerBookings'],
    queryFn: () => apiFetch('/bookings/lecturer'),
  });

  // Group bookings by unique student
  const studentsMap = new Map();
  bookings.forEach((b: any) => {
    if (!b.student) return;
    if (!studentsMap.has(b.studentId)) {
      studentsMap.set(b.studentId, {
        id: b.studentId,
        name: b.student.fullName || 'Unknown Student',
        country: b.student.country || 'Unknown',
        course: b.tier || 'Session',
        courseTier: b.tier || 'Basic',
        sessionsCompleted: 0,
        nextSession: null,
        lastNote: null,
        allBookings: [],
      });
    }
    const s = studentsMap.get(b.studentId);
    s.allBookings.push(b);
    if (b.status === 'COMPLETED') s.sessionsCompleted++;
    if (b.notes) s.lastNote = b.notes;
  });

  const myStudents = Array.from(studentsMap.values()).map(s => {
    // Find next session
    const upcoming = s.allBookings
      .filter((b: any) => b.status === 'SCHEDULED' && new Date(b.startsAt) > new Date())
      .sort((a: any, b: any) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];
    
    if (upcoming) {
      s.nextSession = `${new Date(upcoming.startsAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${new Date(upcoming.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      s.nextSession = 'None scheduled';
    }
    return s;
  });

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
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[hsl(var(--muted-foreground))]">Loading students...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <GraduationCap className="h-10 w-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
                  <p className="font-medium">No students found</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">You don't have any students assigned yet.</p>
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)]">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))]">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {s.course}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-xs font-medium">{s.courseTier}</td>
                  <td className="py-3 px-5 text-sm">{s.sessionsCompleted} completed</td>
                  <td className="py-3 px-5 text-right">
                    <button onClick={() => setSel(s)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setSel(null)}>
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-xl max-w-sm w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">{sel.name}</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Course</span><span className="font-medium">{sel.course} ({sel.courseTier})</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Completed Sessions</span><span className="font-medium">{sel.sessionsCompleted}</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Country</span><span className="font-medium">{sel.country}</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Next Session</span><span className="font-medium">{sel.nextSession}</span></div>
            </div>
            {sel.lastNote && (
              <div className="p-3 rounded-xl bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))] text-sm mb-4">
                <div className="font-semibold text-xs text-[hsl(var(--muted-foreground))] mb-1">Latest Note</div>
                {sel.lastNote}
              </div>
            )}
            <button onClick={() => setSel(null)} className="w-full py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
