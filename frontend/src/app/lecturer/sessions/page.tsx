'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
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

export default function LecturerSessionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['lecturerBookings'],
    queryFn: () => apiFetch('/bookings/lecturer'),
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [notesModal, setNotesModal] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filtered = bookings.filter((s: any) => {
    const studentName = s.student?.fullName || 'Unknown Student';
    const subject = s.tier || 'Session';
    const matchSearch = studentName.toLowerCase().includes(search.toLowerCase()) || subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSaveNotes = async () => {
    if (!notesModal) return;
    setIsSaving(true);
    try {
      await apiFetch(`/bookings/${notesModal.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ notes: noteText }),
      });
      queryClient.invalidateQueries({ queryKey: ['lecturerBookings'] });
      setNotesModal(null);
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };


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
        {isLoading && <div className="p-8 text-center text-[hsl(var(--muted-foreground))]">Loading sessions...</div>}
        {!isLoading && filtered.map((s: any) => {
          const cfg = statusConfig[s.status.toLowerCase()] || statusConfig.scheduled;
          const studentName = s.student?.fullName || 'Unknown Student';
          const subject = s.tier || 'Session';
          return (
            <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div className="h-11 w-11 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[hsl(var(--primary))]">
                {studentName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{studentName}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{subject}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                  {mounted ? (
                    `${new Date(s.startsAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${new Date(s.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                  ) : (
                    <span>Loading date...</span>
                  )}
                </div>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${cfg.color} whitespace-nowrap`}>{cfg.label}</span>
              {s.status === 'COMPLETED' && (
                <button onClick={() => { setNotesModal(s); setNoteText(s.notes || ''); }} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" title="View/Add Notes">
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
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">{notesModal.tier || 'Session'} — {notesModal.student?.fullName}</p>
            <textarea rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add your notes about this session..." className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setNotesModal(null)} disabled={isSaving} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] disabled:opacity-50">Cancel</button>
              <button onClick={handleSaveNotes} disabled={isSaving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
