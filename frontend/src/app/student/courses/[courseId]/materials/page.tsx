'use client';

import { FileText, Lock, PlayCircle, Download } from 'lucide-react';

const mockSlides = [
  { id: 1, title: 'Introduction to Noorani Qaida', unlocked: true, type: 'presentation' },
  { id: 2, title: 'Arabic Alphabets - Part 1', unlocked: true, type: 'presentation' },
  { id: 3, title: 'Arabic Alphabets - Part 2', unlocked: true, type: 'presentation' },
  { id: 4, title: 'Joint Letters (Murakkabat)', unlocked: false, type: 'presentation' },
  { id: 5, title: 'The Harakaat (Vowels)', unlocked: false, type: 'presentation' },
  { id: 6, title: 'Tanween (Double Vowels)', unlocked: false, type: 'presentation' },
  { id: 7, title: 'Letters of Maddah', unlocked: false, type: 'presentation' },
  { id: 8, title: 'Letters of Leen', unlocked: false, type: 'presentation' },
  { id: 9, title: 'Sukoon (Jazm)', unlocked: false, type: 'presentation' },
  { id: 10, title: 'Tashdeed', unlocked: false, type: 'presentation' },
];

export default function CourseMaterialsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Course Materials</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Access your presentation slides and learning resources. New materials are unlocked by your lecturer as you progress.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSlides.map((slide) => (
          <div
            key={slide.id}
            className={`relative p-5 rounded-xl border ${
              slide.unlocked
                ? 'bg-[hsl(var(--card))] border-[hsl(var(--border))] hover:shadow-md transition-shadow cursor-pointer'
                : 'bg-[hsl(var(--muted)/0.5)] border-[hsl(var(--border))] opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${slide.unlocked ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                <FileText className="h-6 w-6" />
              </div>
              {!slide.unlocked && (
                <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                  <Lock className="h-3 w-3" /> Locked
                </div>
              )}
            </div>
            
            <h3 className={`font-semibold mb-1 ${!slide.unlocked ? 'text-[hsl(var(--muted-foreground))]' : ''}`}>
              Slide {slide.id}: {slide.title}
            </h3>
            
            {slide.unlocked ? (
              <div className="mt-4 flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                  <PlayCircle className="h-4 w-4" /> View
                </button>
                <button className="p-2 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                  <Download className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                </button>
              </div>
            ) : (
              <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
                Complete previous lessons to unlock this material.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
