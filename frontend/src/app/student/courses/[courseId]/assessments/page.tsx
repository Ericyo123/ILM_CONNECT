'use client';

import { ClipboardList, CheckCircle2, Clock, BookOpen } from 'lucide-react';

export default function AssessmentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Assessments</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Track your progress through quizzes and evaluations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Alphabet Recognition Quiz</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                 <Clock className="h-3 w-3" /> Pending - Due in 3 days
              </p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-lg font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] transition-colors">
            Start Assessment
          </button>
        </div>

        <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Introduction Quiz</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Completed • Score: 95%</p>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-lg font-semibold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--foreground))]">
            Review Answers
          </button>
        </div>
      </div>

      <div className="pt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Lesson Recaps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)] transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Makharij Review (Throat Letters)</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">Oct 14, 2024</p>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2">
              Reviewed the articulation points of throat letters (Hamza, Haa, Ain, Haa, Ghain, Khaa). Focus on differentiating between the empty and full sounds.
            </p>
            <button className="text-sm text-[hsl(var(--primary))] font-semibold hover:underline">Read Full Recap</button>
          </div>
        </div>
      </div>
    </div>
  );
}
