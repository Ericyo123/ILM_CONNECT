'use client';

import Link from 'next/link';
import { Star, Search, Filter, Globe, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { lecturers } from '@/lib/mock-data';
import { useState } from 'react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const allSpecs = ['All', 'Quran Recitation', 'Tajweed', 'Hifz', 'Hadith', 'Fiqh', 'Arabic Language', 'Aqeedah', 'Islamic Law', 'Islamic History'];

export default function LecturersPage() {
  const [search, setSearch] = useState('');
  const [activeSpec, setActiveSpec] = useState('All');

  const filtered = lecturers.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSpec = activeSpec === 'All' || l.specializations.includes(activeSpec);
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Scholars</h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">Every lecturer is personally vetted, holds recognized qualifications, and brings years of teaching experience</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <input type="text" placeholder="Search by name or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {allSpecs.map((s) => (
              <button key={s} onClick={() => setActiveSpec(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSpec === s ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((l, i) => (
            <motion.div key={l.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }}>
              <Link href={`/lecturers/${l.id}`} className="block p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)] hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {l.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg">{l.name}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{l.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 text-[hsl(var(--accent))] fill-current" />
                      <span className="text-sm font-medium">{l.rating}</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">({l.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 line-clamp-2">{l.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {l.specializations.map((s) => (
                    <span key={s} className="px-2 py-0.5 text-xs font-medium rounded-full bg-[hsl(var(--primary-light))] text-[hsl(var(--primary))]">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))] pt-4 border-t border-[hsl(var(--border))]">
                  <div className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {l.languages.join(', ')}</div>
                  <div>{l.studentsCount} students</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))] mb-4" />
            <p className="text-lg font-medium mb-2">No scholars found</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
