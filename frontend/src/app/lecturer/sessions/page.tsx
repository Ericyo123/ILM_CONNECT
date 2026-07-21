'use client';

import { useState, useEffect } from 'react';
import { sessions } from '@/lib/mock-data';
import { Video, Search, Filter, CheckCircle, XCircle, Calendar, Clock, AlertTriangle, FileText, ChevronDown } from 'lucide-react';

type StatusFilter = 'all' | 'scheduled' | 'completed' | 'no_show_student' | 'no_show_lecturer' | 'canceled';

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  canceled: { label: 'Canceled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  no_show_student: { label: 'No-Show (Student)', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  no_show_lecturer: { label: 'No-Show (Lecturer)', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

// Extend sessions with notes for demo
const allSessions = [
  ...sessions,
  { id: 'ss7', studentId: 's7', lecturerId: 'l1', studentName: 'Zainab Patel', lecturerName: 'Sheikh Ahmed Al-Farsi', subject: 'Hifz — Juz 3 Revision', startsAt: new Date(Date.now() - 86400000).toISOString(), endsAt: new Date(Date.now() - 86400000 + 2700000).toISOString(), status: 'completed' as const, zoomLink: '', notes: 'Excellent revision. Zainab has memorized Juz 3 solidly.' },
  { id: 'ss8', studentId: 's9', lecturerId: 'l1', studentName: 'Khadija Osman', lecturerName: 'Sheikh Ahmed Al-Farsi', subject: 'Tajweed — Makhaarij Al-Huroof', startsAt: new Date(Date.now() - 172800000).toISOString(), endsAt: new Date(Date.now() - 172800000 + 2700000).toISOString(), status: 'completed' as const, zoomLink: '', notes: 'Worked on letter pronunciation from خ and غ. Needs more practice.' },
  { id: 'ss9', studentId: 's2', lecturerId: 'l1', studentName: 'Omar Malik', lecturerName: 'Sheikh Ahmed Al-Farsi', subject: 'Hifz — Juz 5', startsAt: new Date(Date.now() - 259200000).toISOString(), endsAt: new Date(Date.now() - 259200000 + 2700000).toISOString(), status: 'no_show_student' as const, zoomLink: '' },
];

export default function LecturerSessionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [notesModal, setNotesModal] = useState<typeof allSessions[0] | null>(null);
  const [noteText, setNoteText] = useState('');

  const filtered = allSessions.filter(s => {
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) || s.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Sessions</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Search by student or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'scheduled', 'completed', 'no_show_student', 'canceled'] as StatusFilter[]).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${statusFilter === s ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]'}`}>
              {s === 'all' ? 'All' : s === 'no_show_student' ? 'No-Show' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {filtered.map((s) => {
          const cfg = statusConfig[s.status] || statusConfig.scheduled;
          return (
            <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div className="h-11 w-11 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[hsl(var(--primary))]">
                {s.studentName.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{s.studentName}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{s.subject}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                  {mounted ? (
                    `${new Date(s.startsAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${new Date(s.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                  ) : (
                    <span>Loading date...</span>
                  )}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${cfg.color} whitespace-nowrap`}>{cfg.label}</span>
              {s.status === 'completed' && (
                <button onClick={() => { setNotesModal(s); setNoteText((s as any).notes || ''); }} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" title="View/Add Notes">
                  <FileText className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 rounded-xl border border-dashed border-[hsl(var(--border))] text-center">
            <Clock className="h-10 w-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
            <p className="font-medium">No sessions found</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setNotesModal(null)}>
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-xl max-w-md w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">Session Notes</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">{notesModal.subject} — {notesModal.studentName}</p>
            <textarea rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add your notes about this session..." className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setNotesModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">Cancel</button>
              <button onClick={() => setNotesModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
