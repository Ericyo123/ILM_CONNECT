'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Globe,
  GraduationCap,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified Scholars',
    desc: 'Every lecturer is personally vetted, interviewed, and reviewed for Islamic knowledge, teaching temperament, and platform professionalism.',
  },
  {
    icon: Video,
    title: 'Live 1:1 Sessions',
    desc: 'Private sessions keep recitation correction focused, gentle, and paced around each student instead of a crowded group timetable.',
  },
  {
    icon: Globe,
    title: 'Built for Diaspora Families',
    desc: 'Families across the UK, Europe, Australia, the Middle East, and North America can learn with Sri Lankan scholars across time zones.',
  },
  {
    icon: Award,
    title: 'Structured Progress',
    desc: 'Courses include session notes, homework, monthly reporting, and clear milestones from beginner reading to advanced Hifz revision.',
  },
  {
    icon: Users,
    title: 'Parent Confidence',
    desc: 'Parents can follow progress, communicate with support, and trust a consistent learning environment for children and adults.',
  },
  {
    icon: BookOpen,
    title: 'Rooted Curriculum',
    desc: 'The learning experience balances traditional Islamic disciplines with a modern LMS flow that keeps schedules and progress visible.',
  },
];

const journey = [
  'Share the student’s goals and current level',
  'Choose a learning path or request guidance',
  'Get matched with a qualified scholar',
  'Begin weekly sessions with tracked progress',
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-sanctuary-light text-stone-900 select-none">
      <div className="absolute top-16 -right-24 h-96 w-96 rounded-full bg-emerald-200/45 blur-3xl pointer-events-none" />
      <div className="absolute top-[42%] -left-28 h-[32rem] w-[32rem] rounded-full bg-teal-100/60 blur-3xl pointer-events-none" />

      <section className="relative min-h-[72vh] overflow-hidden bg-stone-950 text-white">
        <Image
          src="/images/hero-male-scholar.jpg"
          alt="Islamic scholar teaching students"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/35 to-stone-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(12,20,18,0.24)_38%,rgba(12,20,18,0.88)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              A trusted bridge between scholars and students worldwide
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-200 sm:text-base">
              IlmConnect exists for Muslim families who want authentic, structured Islamic learning without losing the warmth and discipline of traditional scholarship.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-5">
            <h2 className="text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
              Make serious Islamic education easier to access, and easier to stay with.
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-7">
            <div className="rounded-3xl border border-stone-200/80 bg-white/78 p-6 shadow-xl backdrop-blur-md sm:p-8">
              <p className="text-base leading-relaxed text-stone-600">
                We started with a simple problem: families in the diaspora often struggle to find qualified, trustworthy Islamic educators who can teach consistently online. IlmConnect brings verified Sri Lankan scholars, structured courses, scheduling, live classes, and progress visibility into one professional platform.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {['Scholar-led learning', 'Parent-visible progress', 'Global time-zone support', 'One-on-one correction'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-900">
                    <Check className="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 border-y border-stone-200/70 bg-white/35 py-16 backdrop-blur-sm sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">The platform standards</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-3xl border border-stone-200/80 bg-white/80 p-6 shadow-[0_10px_34px_rgba(15,76,68,0.06)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[hsl(var(--primary))]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-black text-stone-950">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-stone-600">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 p-7 text-white shadow-2xl">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl" />
              <GraduationCap className="relative z-10 h-10 w-10 text-emerald-300" />
              <h2 className="relative z-10 mt-8 text-3xl font-black tracking-tight sm:text-4xl">A calmer path from signup to steady learning.</h2>
              <p className="relative z-10 mt-4 text-sm leading-relaxed text-stone-300">
                The experience is intentionally simple: remove the friction, keep the scholar relationship strong, and make every next step obvious.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4">
              {journey.map((item, i) => (
                <motion.div
                  key={item}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 rounded-3xl border border-stone-200/80 bg-white/78 p-4 shadow-sm backdrop-blur-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-emerald-500 text-sm font-black text-white shadow-lg shadow-emerald-900/15">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-bold text-stone-900">{item}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-stone-800/80 bg-gradient-to-br from-[#0c1618] via-[#0f2321] to-[#0a1b19] p-9 text-center text-white shadow-[0_20px_60px_rgba(5,35,30,0.18)] sm:p-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Ready to meet the scholar who fits your learning goals?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Start with a complimentary trial session and see how focused, scholar-led learning feels inside IlmConnect.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_28px_rgba(16,185,129,0.34)] transition-all hover:scale-105 hover:from-emerald-800 hover:to-emerald-600"
          >
            Start Free Trial <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
