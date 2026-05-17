'use client';

import Link from 'next/link';
import { Calendar, Clock, BookOpen, Star, Video, CreditCard, TrendingUp, ChevronRight, Play, RefreshCw, User, AlertTriangle } from 'lucide-react';
import { sessions, lecturers } from '@/lib/mock-data';
import { useState, useEffect, useCallback } from 'react';

const upcomingSessions = sessions.filter(s => s.status === 'scheduled').slice(0, 3);
const assignedLecturer = lecturers[0]; // Auto-assigned lecturer

const progressData = [
  { subject: 'Tajweed', progress: 78 },
  { subject: 'Surah Memorization', progress: 45 },
  { subject: 'Arabic Reading', progress: 62 },
];

export default function StudentDashboard() {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeRequested, setChangeRequested] = useState(false);

  const closeModal = useCallback(() => setShowChangeModal(false), []);

  // Lock body scroll and handle ESC key when modal is open
  useEffect(() => {
    if (!showChangeModal) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [showChangeModal, closeModal]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Assalamu Alaikum, Aisha!</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Your next session is in 2 hours</p>
        </div>
        <Link href="/student/book" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg transition-all">
          <Calendar className="h-4 w-4" /> Book Session
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sessions This Month', value: '6/8', icon: Clock, color: 'text-[hsl(var(--primary))]' },
          { label: 'Hours Learned', value: '4.5h', icon: BookOpen, color: 'text-[hsl(var(--accent))]' },
          { label: 'Current Streak', value: '12 weeks', icon: TrendingUp, color: 'text-[hsl(var(--success))]' },
          { label: 'Avg Rating Given', value: '4.9', icon: Star, color: 'text-[hsl(var(--accent))]' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions + Assigned Lecturer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Lecturer Card */}
          <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Your Assigned Lecturer</h2>
              <button onClick={() => setShowChangeModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary)/0.05)] transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Request Lecturer Change
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {assignedLecturer.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{assignedLecturer.name}</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">{assignedLecturer.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-3.5 w-3.5 text-[hsl(var(--accent))] fill-current" />
                  <span className="text-sm font-medium">{assignedLecturer.rating}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">· {assignedLecturer.yearsExperience} yrs exp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Upcoming Sessions</h2>
              <Link href="/student/sessions" className="text-sm text-[hsl(var(--primary))] hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)] transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-[hsl(var(--primary-light))] flex items-center justify-center flex-shrink-0">
                    <Video className="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{s.subject}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">with {s.lecturerName}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{new Date(s.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} — {new Date(s.endsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-md transition-all flex items-center gap-1.5">
                    <Play className="h-3 w-3" /> Join
                  </button>
                </div>
              ))}
              {upcomingSessions.length === 0 && (
                <div className="p-8 rounded-xl border border-dashed border-[hsl(var(--border))] text-center">
                  <Calendar className="h-10 w-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
                  <p className="font-medium mb-1">No upcoming sessions</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">Book your next session to continue learning</p>
                  <Link href="/student/book" className="text-sm text-[hsl(var(--primary))] font-medium hover:underline">Book Now →</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress & Subscription */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Learning Progress</h2>
          <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-5">
            {progressData.map((p) => (
              <div key={p.subject}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{p.subject}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--muted))]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,40%)] transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Subscription */}
          <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-[hsl(var(--primary))]" />
              <span className="font-medium text-sm">Subscription</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-lg font-bold">Tajweed Premium</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]">Active</span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Renews May 1, 2025 · $55/month</p>
            <Link href="/student/billing" className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] font-medium mt-3 hover:underline">
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Policy note */}
          <div className="p-4 rounded-xl bg-[hsl(var(--muted))] text-xs text-[hsl(var(--muted-foreground))]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Cancellation Policy:</strong> Sessions can be cancelled or rescheduled up to <strong>12 hours</strong> before start time at no penalty. Within 12 hours, the session counts as used.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecturer Change Modal — clean overlay, no blur distortion */}
      {showChangeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeModal}>
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-2xl max-w-md w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Request Lecturer Change</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
              We&apos;ll schedule a trial session with a different lecturer. If you&apos;re happy, we&apos;ll make the switch permanent. You can repeat this process until you find the right match.
            </p>
            <div className="p-3 rounded-lg bg-[hsl(var(--muted))] text-xs text-[hsl(var(--muted-foreground))] mb-4">
              <strong>Trial sessions used:</strong> 0 of 3 free trials<br />
              Beyond 3 trials, admin approval is required.
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Reason for change (optional)</label>
              <textarea rows={3} placeholder="e.g., Scheduling conflict, teaching style preference..." className="w-full px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">Cancel</button>
              <button onClick={() => { setChangeRequested(true); closeModal(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
                Request Trial Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Requested Toast */}
      {changeRequested && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in">
          <div className="px-5 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg flex items-center gap-2 text-sm font-medium">
            <RefreshCw className="h-4 w-4 text-[hsl(var(--primary))]" />
            Trial session request submitted! We&apos;ll contact you shortly.
          </div>
        </div>
      )}
    </div>
  );
}
