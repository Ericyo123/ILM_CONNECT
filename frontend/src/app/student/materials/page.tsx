'use client';

import { FileText, Download, BookOpen, Search } from 'lucide-react';

const materials = [
  { id: 1, title: 'Tajweed Rules - Noon Sakinah & Tanween', type: 'PDF', size: '2.4 MB', lecturer: 'Sheikh Ahmed Al-Farsi', date: 'Apr 28, 2025' },
  { id: 2, title: 'Surah Al-Baqarah - Verses 1-20 Audio', type: 'Audio', size: '12 MB', lecturer: 'Sheikh Ahmed Al-Farsi', date: 'Apr 25, 2025' },
  { id: 3, title: 'Arabic Grammar Basics - Worksheet', type: 'PDF', size: '1.8 MB', lecturer: 'Ustadha Fatima Noor', date: 'Apr 22, 2025' },
  { id: 4, title: 'Hifz Revision Schedule Template', type: 'PDF', size: '0.5 MB', lecturer: 'Maulavi Yusuf Kareem', date: 'Apr 20, 2025' },
  { id: 5, title: 'Session Recording - Tajweed Lesson 14', type: 'Video', size: '145 MB', lecturer: 'Sheikh Ahmed Al-Farsi', date: 'Apr 18, 2025' },
];

export default function MaterialsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Materials Library</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
      </div>
      <div className="space-y-3">
        {materials.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)] transition-colors">
            <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent-light))] flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-[hsl(var(--accent))]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{m.title}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">{m.lecturer} · {m.date} · {m.size}</div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{m.type}</span>
            <button className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
