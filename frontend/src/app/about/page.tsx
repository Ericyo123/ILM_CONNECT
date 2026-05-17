'use client';

import Link from 'next/link';
import { BookOpen, ShieldCheck, Globe, Video, Award, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const values = [
  { icon: ShieldCheck, title: 'Verified Scholars', desc: 'Every lecturer is personally vetted, interviewed, and holds recognized qualifications in Islamic sciences.' },
  { icon: Video, title: 'Live 1:1 Sessions', desc: '45-minute private Zoom sessions twice weekly. No group dilution — your learning, your pace.' },
  { icon: Globe, title: 'Global Access', desc: 'Serving the Muslim diaspora across UK, Europe, Australia, Middle East, and North America.' },
  { icon: Award, title: 'Structured Curriculum', desc: 'Progress tracking, homework, monthly reports, and certificate of completion for advanced courses.' },
  { icon: Users, title: 'Family Friendly', desc: 'Safe, professional platform with safeguarding policies. Parents can track progress and access recordings.' },
  { icon: BookOpen, title: 'Multiple Disciplines', desc: 'From Quran recitation to Fiqh, Arabic to Hadith sciences — all under one platform.' },
];

export default function AboutPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Bridging Scholars & Students Across the World</h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
            IlmConnect was founded to solve a simple but pressing problem: Muslim families in the diaspora struggle to find qualified, trustworthy Islamic educators for their children. We connect certified Sri Lankan scholars with students worldwide through a professional, technology-driven platform.
          </p>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="h-11 w-11 rounded-xl bg-[hsl(var(--primary-light))] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* How it works flow */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold mb-10">Your Learning Journey</h2>
          <div className="space-y-8">
            {[
              { step: 1, title: 'Sign Up & Choose Your Subject', desc: 'Create your account, select your learning goals, and pick a subscription tier that fits your needs.' },
              { step: 2, title: 'Get Matched with a Scholar', desc: 'Browse our directory of qualified lecturers, read reviews, and select a scholar — or let our system match you based on your preferences.' },
              { step: 3, title: 'Schedule Your Sessions', desc: 'Pick two weekly time slots that work with your timezone. Our smart scheduler enforces quality spacing between sessions.' },
              { step: 4, title: 'Learn & Grow', desc: 'Join your private Zoom sessions, receive personalized feedback, track your progress, and achieve your learning goals.' },
            ].map((s) => (
              <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex gap-6 text-left">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] shadow-lg hover:shadow-xl transition-all">
            Start Your Free Trial <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
