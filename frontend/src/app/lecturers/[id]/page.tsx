'use client';

import Link from 'next/link';
import { Star, Globe, Clock, Users, Award, ChevronRight, Calendar, BookOpen } from 'lucide-react';
import { lecturers } from '@/lib/mock-data';
import { useParams } from 'next/navigation';

export default function LecturerProfilePage() {
  const { id } = useParams();
  const lecturer = lecturers.find((l) => l.id === id) || lecturers[0];

  const reviews = [
    { name: 'Aisha K.', rating: 5, text: 'Sheikh is incredibly patient and knowledgeable. My Tajweed has improved so much in just a few months.', date: '2 weeks ago' },
    { name: 'Omar M.', rating: 5, text: 'Excellent teaching methodology. Every session is well-structured and engaging.', date: '1 month ago' },
    { name: 'Fatima H.', rating: 4, text: 'Very good teacher. Sometimes sessions run a bit short but the quality is always high.', date: '2 months ago' },
  ];

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-8">
          <Link href="/lecturers" className="hover:text-[hsl(var(--primary))]">Scholars</Link>
          <span>/</span>
          <span className="text-[hsl(var(--foreground))]">{lecturer.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile header */}
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {lecturer.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">{lecturer.name}</h1>
                <p className="text-[hsl(var(--muted-foreground))]">{lecturer.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-[hsl(var(--accent))]">
                    <Star className="h-4 w-4 fill-current" /> {lecturer.rating}
                    <span className="text-[hsl(var(--muted-foreground))] text-sm">({lecturer.reviewCount})</span>
                  </div>
                  <span className="text-[hsl(var(--border))]">·</span>
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">{lecturer.yearsExperience} years experience</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="font-semibold text-lg mb-3">About</h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{lecturer.bio}</p>
            </div>

            {/* Specializations */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {lecturer.specializations.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[hsl(var(--primary-light))] text-[hsl(var(--primary))]">{s}</span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Student Reviews</h2>
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-xs font-bold">{r.name[0]}</div>
                        <span className="font-medium text-sm">{r.name}</span>
                      </div>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 text-[hsl(var(--accent))] fill-current" />)}
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] sticky top-20">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span>{lecturer.studentsCount} active students</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span>{lecturer.sessionsCompleted} sessions completed</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span>{lecturer.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="h-4 w-4 text-[hsl(var(--primary))]" />
                  <span>{lecturer.yearsExperience} years experience</span>
                </div>
              </div>
              <Link href="/auth/signup" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg transition-all mb-3">
                <Calendar className="h-4 w-4" /> Book a Session
              </Link>
              <Link href="/auth/signup" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                Book Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
