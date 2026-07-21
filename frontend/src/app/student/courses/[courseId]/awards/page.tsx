'use client';

import { Award, Star, Flame, Trophy } from 'lucide-react';

export default function AwardsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Awards & Badges</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Keep up the great work! Earn badges by completing courses and maintaining streaks.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold mb-1">3 Day Streak</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Attended 3 sessions in a row</p>
        </div>

        <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold mb-1">Fast Learner</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Completed 5 quizzes</p>
        </div>

        <div className="p-6 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] flex flex-col items-center text-center opacity-75">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-bold mb-1 text-gray-500">Qaida Master</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Complete Noorani Qaida</p>
        </div>

        <div className="p-6 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] flex flex-col items-center text-center opacity-75">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-bold mb-1 text-gray-500">Perfect Score</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Get 100% on any assessment</p>
        </div>
      </div>
    </div>
  );
}
