'use client';

import { useState } from 'react';
import { Search, Star, AlertTriangle } from 'lucide-react';
import { mockFeedbacks } from '@/lib/mock-data';

export default function AdminFeedbackPage() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const filtered = mockFeedbacks.filter(fb => {
    const matchSearch = fb.studentName.toLowerCase().includes(search.toLowerCase()) || fb.lecturerName.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 'all' || fb.rating === ratingFilter;
    return matchSearch && matchRating;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Session Feedback</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Monitor session quality and student satisfaction across the platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Search by student or lecturer name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
        <div className="flex gap-2">
          {['all', 5, 4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => setRatingFilter(r as any)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${ratingFilter === r ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]'}`}>
              {r === 'all' ? 'All Ratings' : <><Star className="h-3 w-3 fill-current" /> {r} Stars</>}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Date</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Student</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Lecturer</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Rating</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))] w-[40%]">Feedback</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((fb) => (
              <tr key={fb.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)]">
                <td className="py-4 px-5 text-sm text-[hsl(var(--muted-foreground))]">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-5">
                  <span className="text-sm font-medium">{fb.studentName}</span>
                </td>
                <td className="py-4 px-5">
                  <span className="text-sm">{fb.lecturerName}</span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-[hsl(var(--border))]'}`} />
                    ))}
                  </div>
                </td>
                <td className="py-4 px-5">
                  <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">{fb.comment}</p>
                </td>
                <td className="py-4 px-5 text-right">
                  {fb.rating <= 3 && (
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-[hsl(var(--destructive))] border border-[hsl(var(--destructive)/0.3)] hover:bg-[hsl(var(--destructive)/0.05)] transition-colors inline-flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Follow Up
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[hsl(var(--muted-foreground))] text-sm">
                  No feedback found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
