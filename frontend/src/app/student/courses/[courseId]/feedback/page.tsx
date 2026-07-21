'use client';

import { MessageSquare } from 'lucide-react';
import { sessions } from '@/lib/mock-data';

export default function SessionFeedbackPage() {
  const completedSessions = sessions.filter(s => s.status === 'completed' && s.studentId === 's1');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Session Feedback</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          View feedback from your lecturers. Summaries are also sent to parents via WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        {completedSessions.length > 0 ? completedSessions.map(session => (
          <div key={session.id} className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{session.subject}</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                  {new Date(session.startsAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                Lecturer: {session.lecturerName}
              </p>
              
              <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg border border-[hsl(var(--border))]">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[hsl(var(--primary))]" /> Lecturer Notes
                </h4>
                <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed italic">
                  "Excellent pronunciation during today's session. Keep practicing the Harakaat sounds. We will focus on Murakkabat in the next class."
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 text-[hsl(var(--muted-foreground))]">
            No completed sessions with feedback yet.
          </div>
        )}
      </div>
    </div>
  );
}
