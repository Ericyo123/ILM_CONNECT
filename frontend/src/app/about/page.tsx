'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Globe,
  GraduationCap,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function AnimatedCounter({
  target,
  duration = 1800,
  decimals = 0,
  suffix = '',
}: {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: '-20px' });

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    let start: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);

      setCount(eased * target);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, target, duration]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString('en-US');

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}{suffix}
    </span>
  );
}

const platformStats = [
  {
    target: 12,
    suffix: '+',
    decimals: 0,
    label: 'Qualified Scholars',
    icon: GraduationCap,
  },
  {
    target: 150,
    suffix: '+',
    decimals: 0,
    label: 'Active Students',
    icon: Users,
  },
  {
    target: 4.85,
    suffix: '',
    decimals: 2,
    label: 'Average Rating',
    icon: Star,
  },
  {
    target: 10000,
    suffix: '+',
    decimals: 0,
    label: 'Teaching Hours Completed',
    icon: Clock,
  },
];

const values = [
  {
    title: 'Verified Scholars',
    desc: 'Personally vetted for authentic Sanad lineage and teaching adab.',
  },
  {
    title: 'Live 1:1 Sessions',
    desc: 'Private recitation correction focused and gently paced.',
  },
  {
    title: 'Built for Diaspora',
    desc: 'Flexible scheduling adapted for UK, US, Europe & Australia.',
  },
  {
    title: 'Structured Progress',
    desc: 'Milestone reports from foundational Qaida to advanced Tajweed.',
  },
  {
    title: 'Parent Confidence',
    desc: 'Direct communication, consistent scheduling, and safe environment.',
  },
  {
    title: 'Rooted Curriculum',
    desc: 'Classical Islamic disciplines with visible progress tracking.',
  },
];

const journey = [
  {
    title: 'Share Goals & Level',
    desc: 'Share the student’s goals and current level',
    icon: Compass,
  },
  {
    title: 'Choose Learning Path',
    desc: 'Choose a learning path or request guidance',
    icon: BookOpen,
  },
  {
    title: 'Scholar Matching',
    desc: 'Get matched with a qualified scholar',
    icon: Users,
  },
  {
    title: 'Steady Progress',
    desc: 'Begin weekly sessions with tracked progress',
    icon: TrendingUp,
  },
];

export default function AboutPage() {
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [waitlistCourse, setWaitlistCourse] = useState('Tajweed Quran Recitation');
  const [waitlistPace, setWaitlistPace] = useState<'standard' | 'fast-track'>('standard');
  const [waitlistNotes, setWaitlistNotes] = useState('');
  const [isWaitlistSubmitting, setIsWaitlistSubmitting] = useState(false);
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName || !waitlistEmail) return;
    setIsWaitlistSubmitting(true);
    try {
      const waitlistEntry = {
        fullName: waitlistName,
        email: waitlistEmail,
        phone: waitlistPhone,
        course: waitlistCourse,
        pace: waitlistPace,
        notes: waitlistNotes,
        submittedAt: new Date().toISOString(),
        source: 'about_page',
      };
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('ilm_waitlist_entries') || '[]');
        existing.push(waitlistEntry);
        localStorage.setItem('ilm_waitlist_entries', JSON.stringify(existing));
      }
      await new Promise((res) => setTimeout(res, 600));
      setIsWaitlistSubmitted(true);
    } finally {
      setIsWaitlistSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-sanctuary-light text-stone-900 select-none">
      <div className="absolute top-16 -right-24 h-96 w-96 rounded-full bg-emerald-200/45 blur-3xl pointer-events-none" />
      <div className="absolute top-[42%] -left-28 h-[32rem] w-[32rem] rounded-full bg-teal-100/60 blur-3xl pointer-events-none" />

      <section className="relative overflow-hidden bg-stone-950 text-white py-16 sm:py-20 lg:py-24 min-h-[38vh] sm:min-h-[42vh] flex items-center justify-center">
        <Image
          src="/images/about-hero-scholar.jpg"
          alt="Islamic scholar in traditional academy library"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/30 to-stone-950/70" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col items-center">
            {/* Hooking center-aligned headline (smaller font size) */}
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-black leading-[1.2] tracking-tight text-white mb-3 max-w-2xl">
              A Trusted Bridge Between{' '}
              <span className="text-[#095F46] text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-[#095F46]">
                Scholars &amp; Students
              </span>{' '}
              Worldwide
            </h1>

            {/* Centered concise description with smaller font */}
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-stone-200/90 leading-relaxed font-normal">
              IlmConnect exists for Muslim families who want authentic, structured Islamic learning without losing the warmth and discipline of traditional scholarship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTRODUCTION SECTION — Replicating Reference Image Layout (Fits in 1 Page) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-14 sm:py-16 lg:py-20 bg-[#f8faf8] border-b border-stone-200/60 select-none">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7 sm:space-y-8">
          
          {/* Top Row: Left Title vs Right Concise Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left: Heading with Brand Green Accent (consistent font size) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="lg:col-span-7"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-stone-950 leading-[1.2]">
                Make Serious Islamic Education{' '}
                <span className="text-[#095F46]">Easier To Access,</span> And Easier To Stay With!
              </h2>
            </motion.div>

            {/* Right: Minimal, clean explanatory text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="lg:col-span-5 text-stone-600 text-xs sm:text-sm leading-relaxed"
            >
              <p>
                IlmConnect bridges authentic traditional scholarship with modern 1-on-1 virtual classrooms and flexible scheduling designed specifically for diaspora families.
              </p>
            </motion.div>
          </div>

          {/* Middle Row: 3 Feature Pill Cards (Compact, as in reference image) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4"
          >
            {/* Feature 1: Verified Sanad Scholars */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(9,95,70,0.08)] hover:border-[#095F46]/40 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#095F46] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-stone-900 mb-0.5 tracking-tight truncate">
                  Verified Scholars
                </h3>
                <p className="text-xs text-stone-500 leading-snug line-clamp-2">
                  Sanad-certified educators vetted for Islamic depth &amp; teaching adab.
                </p>
              </div>
            </div>

            {/* Feature 2: 1:1 Personalized Learning */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(9,95,70,0.08)] hover:border-[#095F46]/40 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-stone-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Video className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-stone-900 mb-0.5 tracking-tight truncate">
                  1-on-1 Focused Care
                </h3>
                <p className="text-xs text-stone-500 leading-snug line-clamp-2">
                  Private live sessions paced with direct Tajweed recitation correction.
                </p>
              </div>
            </div>

            {/* Feature 3: Global Time-Zone Ease */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(9,95,70,0.08)] hover:border-[#095F46]/40 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#095F46] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-stone-900 mb-0.5 tracking-tight truncate">
                  Global Availability
                </h3>
                <p className="text-xs text-stone-500 leading-snug line-clamp-2">
                  Seamless scheduling across UK, Europe, Australia, and US time zones.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Row: Two Connected Overlapping Photos (Male Scholar & Male Student on Laptop) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="relative pt-2 pb-5 sm:pb-7 max-w-5xl mx-auto"
          >
            {/* Main Image (Left / Base): Male Scholar teaching live 1:1 on laptop */}
            <div className="relative w-full lg:w-[75%] h-[240px] sm:h-[300px] lg:h-[330px] rounded-2xl sm:rounded-3xl overflow-hidden border-4 sm:border-6 border-white shadow-[0_12px_36px_rgba(0,0,0,0.1)] bg-stone-100">
              <Image
                src="/images/about-scholar-male-laptop.jpg"
                alt="Sanad-certified male Islamic scholar teaching online live on laptop with Holy Quran"
                fill
                className="object-cover object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 760px"
              />
            </div>

            {/* Overlapping Inset Image (Right): Male Student attending live 1:1 lesson on laptop */}
            <div className="absolute -bottom-2 sm:-bottom-4 right-0 sm:right-2 lg:right-0 w-[55%] sm:w-[44%] lg:w-[40%] h-[180px] sm:h-[225px] lg:h-[245px] rounded-xl sm:rounded-2xl overflow-hidden border-4 sm:border-6 border-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] bg-stone-100 z-10 hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/about-student-male-laptop.jpg"
                alt="Young male student engaged in live 1-on-1 online Quran session with male scholar on laptop"
                fill
                className="object-cover object-[center_15%]"
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 360px, 440px"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* THE PLATFORM STANDARDS — Replicating Reference Layout with Stats Row */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-y border-stone-200/70 bg-white/50 py-14 sm:py-16 lg:py-20 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          
          {/* Top Row: Left Image with Badge vs Right Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Image with Custom Rounded Corner & Floating Badge (matching reference) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="lg:col-span-5 relative"
            >
              {/* Floating Circular Badge in Top-Left */}
              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-stone-100 flex flex-col items-center justify-center p-2 text-center z-20">
                <span className="text-lg sm:text-xl font-black text-[#095F46] tracking-tight leading-none">100%</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-stone-600 uppercase tracking-wider mt-0.5 leading-tight text-center">Sanad Verified</span>
              </div>

              {/* Main Image with custom corner rounding */}
              <div className="relative w-full aspect-[4/3] rounded-3xl rounded-bl-[50px] sm:rounded-bl-[72px] overflow-hidden border-4 sm:border-6 border-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-stone-100">
                <Image
                  src="/images/about-platform-standards-scholar.jpg"
                  alt="Sanad-certified Islamic scholar conducting online 1-on-1 Quran recitation session"
                  fill
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </motion.div>

            {/* Right Column: Title, Minimal Description, 6 Points Grid, and Button */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Small category kicker in brand green */}
              <div className="text-xs font-bold uppercase tracking-wider text-[#095F46] mb-1.5 font-mono">
                The Platform Standards
              </div>

              {/* Bold Main Heading - font size matched to Section 2 */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-stone-950 leading-[1.2] mb-3">
                Elevating Islamic Education With Uncompromising Standards
              </h2>

              {/* Minimal Introductory Description Paragraph */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                Every class, curriculum module, and scholar relationship is held to the highest benchmarks of authentic Islamic guidance.
              </p>

              {/* 6 Points in 2-Column Checklist Form (Compact & breathable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 mb-6">
                {values.map((val) => (
                  <div key={val.title} className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-[#095F46] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-[13px] font-bold text-stone-900 leading-snug">
                        {val.title}
                      </div>
                      <p className="text-[11px] sm:text-xs text-stone-500 leading-snug mt-0.5">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#095F46] hover:bg-[#074c38] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(9,95,70,0.25)] hover:shadow-[0_8px_24px_rgba(9,95,70,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  Start Free Trial →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom Part: Platform Stats Row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="pt-8 sm:pt-10 border-t border-stone-200/80"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center">
              {platformStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-4 group">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#095F46]/10 text-[#095F46] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-950 tracking-tight">
                        <AnimatedCounter
                          target={stat.target}
                          decimals={stat.decimals}
                          suffix={stat.suffix}
                          duration={2000}
                        />
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-stone-500 tracking-tight mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </section>

      <section className="relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <span className="font-serif italic text-sm sm:text-base text-[#095F46] font-semibold tracking-wide">
              The Learning Journey
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-stone-950 leading-[1.2]">
              A calmer path from signup to steady learning.
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-600 max-w-md">
              The experience is intentionally simple: remove the friction, keep the scholar relationship strong, and make every next step obvious.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#095F46] hover:bg-[#074c38] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(9,95,70,0.25)] transition-all hover:scale-105"
              >
                Get Started <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {journey.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    variants={fadeUp}
                    transition={{ delay: i * 0.08 }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-b-4 border-b-[#095F46] hover:shadow-[0_12px_30px_rgba(9,95,70,0.1)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#095F46] group-hover:bg-[#095F46] group-hover:text-white transition-colors duration-300">
                        <IconComponent className="h-5 w-5 stroke-[2.2]" />
                      </div>
                      <h3 className="text-base font-bold text-stone-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-stone-800/80 bg-gradient-to-br from-[#0c1618] via-[#0f2321] to-[#0a1b19] p-8 sm:p-12 lg:p-14 text-center text-white shadow-[0_20px_60px_rgba(5,35,30,0.18)]"
        >
          {/* Ambient lighting inside card matching homepage */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-wide text-white">
              Begin Your Sacred Journey of Knowledge
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-stone-300 mb-8 leading-relaxed max-w-xl mx-auto">
              Join our priority waitlist for personalized 1:1 sessions with certified Sri Lankan scholars. Reserve early matching with priority cohort placement.
            </p>

            {/* Embedded Priority Waitlist Form inside the card */}
            {!isWaitlistSubmitted ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4 text-left max-w-xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      placeholder="e.g. Sarah Ahmed"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-700/80 bg-stone-900/80 text-sm text-white placeholder:text-stone-500 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                      Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-700/80 bg-stone-900/80 text-sm text-white placeholder:text-stone-500 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                      Discipline of Interest
                    </label>
                    <select
                      value={waitlistCourse}
                      onChange={(e) => setWaitlistCourse(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700/80 bg-stone-900/80 text-sm text-white focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Noorani Qaida">Noorani Qaida (Beginner)</option>
                      <option value="Tajweed Quran Recitation">Tajweed Quran Recitation</option>
                      <option value="Hifz Memorization">Hifz Memorization (Advanced)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={waitlistPhone}
                      onChange={(e) => setWaitlistPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-700/80 bg-stone-900/80 text-sm text-white placeholder:text-stone-500 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Preferred Learning Pace */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2 font-mono">
                    Preferred Learning Pace
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setWaitlistPace('standard')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        waitlistPace === 'standard'
                          ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/30'
                          : 'border-stone-700/80 bg-stone-900/60 hover:bg-stone-900 text-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Standard Plan</div>
                      <div className="text-[11px] text-stone-400">2 sessions / wk · $59/mo</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaitlistPace('fast-track')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        waitlistPace === 'fast-track'
                          ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/30'
                          : 'border-stone-700/80 bg-stone-900/60 hover:bg-stone-900 text-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">Fast Track Plan</div>
                      <div className="text-[11px] text-stone-400">3 sessions / wk · $89/mo</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                    Notes / Goals (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={waitlistNotes}
                    onChange={(e) => setWaitlistNotes(e.target.value)}
                    placeholder="e.g. Schedule preferences, student age, or learning goals"
                    className="w-full px-4 py-2 rounded-xl border border-stone-700/80 bg-stone-900/80 text-sm text-white placeholder:text-stone-500 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={isWaitlistSubmitting}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-500 text-white hover:from-emerald-800 hover:to-emerald-600 shadow-[0_0_28px_rgba(16,185,129,0.34)] hover:shadow-[0_0_38px_rgba(16,185,129,0.52)] transition-all hover:scale-105 active:scale-100 disabled:opacity-70 cursor-pointer"
                  >
                    <span>{isWaitlistSubmitting ? 'Joining Waitlist...' : 'Join the Priority Waitlist'}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="text-[11px] text-stone-400 mt-2">
                    Priority cohort placement when matching scholars open up. No credit card required.
                  </div>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner">
                  <Check className="h-7 w-7 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Alhamdulillah, You&apos;re on the Waitlist!
                </h3>
                <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  We have reserved your priority place for <span className="font-bold text-white">{waitlistCourse}</span> ({waitlistPace === 'fast-track' ? 'Fast Track · 3 sessions/wk' : 'Standard · 2 sessions/wk'}). We will reach out to <span className="font-bold text-emerald-400">{waitlistEmail}</span> as soon as your matching scholar schedule opens up.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
