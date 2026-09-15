'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Star,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  Menu,
  X,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function AnimatedCounter({
  target,
  duration = 2000,
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
  const inView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (!inView) return;

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

const statsData = [
  {
    target: 12,
    suffix: '+',
    label: 'Qualified Scholars',
  },
  {
    target: 150,
    suffix: '+',
    label: 'Active Students',
  },
  {
    target: 4.85,
    decimals: 2,
    suffix: '',
    label: 'Average Rating',
  },
  {
    target: 10000,
    suffix: '+',
    label: 'Sessions Completed',
  },
];

function ProcessStepIcon({ type, active }: { type: string; active?: boolean }) {
  const iconClassName = active ? 'w-5 h-5' : 'w-5 h-5 opacity-80';

  if (type === 'circle-dot') {
    return (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="10" cy="11" r="5.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    );
  }
  if (type === 'corners') {
    return (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3.5" y="3.5" width="4" height="4" rx="0.75" fill="currentColor" />
        <rect x="16.5" y="3.5" width="4" height="4" rx="0.75" fill="currentColor" />
        <rect x="3.5" y="16.5" width="4" height="4" rx="0.75" fill="currentColor" />
        <rect x="16.5" y="16.5" width="4" height="4" rx="0.75" fill="currentColor" />
        <line x1="7.5" y1="5.5" x2="16.5" y2="5.5" />
        <line x1="7.5" y1="18.5" x2="16.5" y2="18.5" />
        <line x1="5.5" y1="7.5" x2="5.5" y2="16.5" />
        <line x1="18.5" y1="7.5" x2="18.5" y2="16.5" />
      </svg>
    );
  }
  if (type === 'gear') {
    return (
      <svg className={iconClassName} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58z" />
      </svg>
    );
  }
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7a5 5 0 0 1 5 5" />
      <path d="M12 10a2 2 0 0 1 2 2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

const howItWorksSteps = [
  {
    num: '01',
    title: 'Sign Up',
    desc: 'Create your account in minutes and tell us about your learning goals.',
    iconType: 'circle-dot',
    href: '/auth/signup',
  },
  {
    num: '02',
    title: 'Choose Your Course',
    desc: 'Select Tajweed for Quran recitation or Hifz for memorization.',
    iconType: 'corners',
    href: '#courses',
  },
  {
    num: '03',
    title: 'Get Matched with a Maulavi',
    desc: 'We assign a qualified scholar based on your needs and schedule.',
    iconType: 'gear',
    href: '/auth/signup',
  },
  {
    num: '04',
    title: 'Start Learning',
    desc: 'Join 1:1 live sessions twice a week and track your progress.',
    iconType: 'gauge',
    href: '/auth/signup',
  },
];

interface TestimonialStory {
  name: string;
  role: string;
  location: string;
  quote: string;
  fullStory: string;
  course: string;
  avatar: string;
}

const diasporaTestimonials: TestimonialStory[] = [
  {
    name: 'Sarah Ahmed',
    role: 'Parent of 2',
    location: 'London, UK',
    quote: 'IlmConnect has boosted our children’s Quran fluency astronomically, transforming how they engage with the Holy Quran.',
    fullStory: 'IlmConnect has boosted our children’s Quran fluency astronomically, transforming how they engage with the Holy Quran. Finding punctual, gentle teachers in London with high Tajweed standards was always a challenge. Now my 8-year-old and 11-year-old look forward to their classes with Maulavi Ismail.',
    course: '1:1 Tajweed Recitation',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Dr. Tariq Mansoor',
    role: 'Father & Physician',
    location: 'Toronto, Canada',
    quote: 'IlmConnect is more essential to our family routine than our local weekend school. It’s a powerful solution to diaspora education.',
    fullStory: 'IlmConnect is more essential to our family routine than our local weekend school. It’s a powerful solution to diaspora education. With my unpredictable hospital shifts, being able to reschedule and get reliable one-on-one attention for my sons has been an absolute game changer.',
    course: 'Hifz Memorization',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Muhammad Rashid',
    role: 'Adult Revert Student',
    location: 'Sydney, Australia',
    quote: 'Finding patient, authentic Sri Lankan scholars was nearly impossible until IlmConnect. My recitation confidence has reached a whole new level.',
    fullStory: 'Finding patient, authentic Sri Lankan scholars was nearly impossible until IlmConnect. As a revert learning Arabic phonetics from scratch, Sheikh Ahmed’s patience and encouragement gave me the confidence to recite accurately in daily prayers without hesitation.',
    course: 'Noorani Qaida & Tajweed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Amina Diallo',
    role: 'Mother of 9yo student',
    location: 'Paris, France',
    quote: 'The one-on-one Tajweed coaching from Maulavi Ismail is exceptional. My daughter eagerly prepares for her live sessions twice every week.',
    fullStory: 'The one-on-one Tajweed coaching from Maulavi Ismail is exceptional. My daughter eagerly prepares for her live sessions twice every week. Her pronunciation and rhythm have blossomed in just three months, and the progress feedback keeps our whole family motivated.',
    course: 'Tajweed Recitation',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Fatima Zahra',
    role: 'Parent & Educator',
    location: 'Dallas, USA',
    quote: 'The structured progress reports and authentic scholar discipline gave our home the exact spiritual grounding we were searching for.',
    fullStory: 'The structured progress reports and authentic scholar discipline gave our home the exact spiritual grounding and recitation excellence we were searching for. You get traditional madrasa quality with modern LMS scheduling and recording.',
    course: '1:1 Tajweed Recitation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Zayd Al-Husseini',
    role: 'Hifz Student',
    location: 'Dubai, UAE',
    quote: 'Completed my Hifz revision with Sheikh Ahmed. His gentle correction and deep mastery of Hafs recitation is something you rarely find online.',
    fullStory: 'Completed my Hifz revision with Sheikh Ahmed. His gentle correction and deep mastery of Hafs recitation is something you rarely find online. The virtual classroom tools and audio clarity made reviewing five Juz a week seamless.',
    course: 'Advanced Hifz Revision',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face',
  },
];

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedStory, setSelectedStory] = useState<TestimonialStory | null>(null);

  const checkScrollButtons = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 380;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* HERO SECTION — Ultra-Modern Minimal Glassmorphic Layout Matching Reference */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] sm:min-h-[96vh] lg:min-h-[100vh] flex flex-col justify-between overflow-hidden bg-stone-950 text-white select-none">
        {/* Background Image: Dignified male scholar with students centered with bottom emerald blur wave */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-male-scholar.jpg"
            alt="Dignified Islamic scholar and young students reciting the Holy Quran in a modern educational sanctuary"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_32%] sm:object-[center_28%] brightness-[0.96] contrast-[1.04]"
          />
          {/* Top gradient for header contrast, clear middle for scholar/students, dark gradient at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-transparent to-stone-950/95" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/15 to-stone-950/85 pointer-events-none" />
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* Top Header & Navigation Bar */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-30 w-full pt-5 sm:pt-7 px-4 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md backdrop-blur-sm transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Ilm</span>
                <span className="text-emerald-400">Connect</span>
              </span>
            </Link>

            {/* Center: Home, About, Pricing */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-xs uppercase tracking-widest font-semibold text-emerald-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-xs uppercase tracking-widest font-semibold text-stone-300 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                className="text-xs uppercase tracking-widest font-semibold text-stone-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* Right: Sign In + Top Pill Button */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-xs uppercase tracking-widest font-semibold text-stone-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2 rounded-full text-xs uppercase tracking-wider font-bold bg-white text-stone-950 hover:bg-stone-100 shadow-[0_2px_12px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-100 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileNavOpen && (
            <div className="md:hidden mx-auto max-w-7xl mt-2 p-4 rounded-xl bg-stone-950/95 border border-stone-800 backdrop-blur-xl animate-fade-in flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-950/80"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-stone-300 hover:text-white"
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-stone-300 hover:text-white"
              >
                Pricing
              </Link>
              <div className="pt-2 mt-1 border-t border-stone-800 flex gap-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex-1 py-2 text-center rounded-lg text-xs font-medium text-stone-300 bg-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex-1 py-2 text-center rounded-full text-xs font-bold text-stone-950 bg-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* Bottom-Center Hero Content with Floating Frosted Badges */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-20 mt-auto pb-10 sm:pb-14 pt-8 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="relative mx-auto max-w-4xl w-full">
            {/* Floating Badge 1 — Top Left: 1:1 Live Tajweed (Cyan glow) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-14 sm:-top-16 left-0 sm:left-4 lg:left-8 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/60 border border-white/15 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-cyan-400/40 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
                <BookOpen className="h-3 w-3" />
              </span>
              <span className="text-xs font-medium text-stone-200 tracking-wide">1:1 Tajweed</span>
            </motion.div>

            {/* Floating Badge 2 — Top Right: Certified Scholars (Emerald glow, positioned high to avoid text mixing) */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute -top-14 sm:-top-16 right-0 sm:right-4 lg:right-8 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/60 border border-white/15 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-emerald-400/40 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                <GraduationCap className="h-3 w-3" />
              </span>
              <span className="text-xs font-medium text-stone-200 tracking-wide">Certified Scholars</span>
            </motion.div>

            {/* Floating Badge 3 — Middle Left: Global Diaspora (Emerald glow) */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
              className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 lg:-left-20 z-20 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/60 border border-white/15 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-emerald-400/40 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                <Globe className="h-3 w-3" />
              </span>
              <span className="text-xs font-medium text-stone-200 tracking-wide">Global Diaspora</span>
            </motion.div>

            {/* Floating Badge 4 — Middle Right: Structured Hifz (Rose glow) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
              className="absolute top-1/3 -right-4 sm:-right-12 lg:-right-20 z-20 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-950/60 border border-white/15 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-rose-400/40 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/20 text-rose-300">
                <ShieldCheck className="h-3 w-3" />
              </span>
              <span className="text-xs font-medium text-stone-200 tracking-wide">Structured Hifz</span>
            </motion.div>

            {/* Mobile Badges Row (Clean, responsive fallback on small devices) */}
            <div className="sm:hidden flex flex-wrap justify-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/70 border border-white/15 text-[11px] text-cyan-300 backdrop-blur-sm">
                <BookOpen className="h-3 w-3" /> 1:1 Tajweed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/70 border border-white/15 text-[11px] text-emerald-300 backdrop-blur-sm">
                <GraduationCap className="h-3 w-3" /> Certified Scholars
              </span>
            </div>

            {/* Strictly 2-Line Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18] sm:leading-[1.15] drop-shadow-lg max-w-3xl sm:max-w-4xl mx-auto">
              <span className="block">Learn Islam from Qualified Scholars</span>
              <span className="block">Anywhere in the World</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-normal">
              Personalized 1:1 online Tajweed and Hifz sessions with certified Sri Lankan Islamic scholars. Structured, professional, and designed for the Muslim diaspora.
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <Link
                href="#courses"
                className="px-7 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-md transition-all duration-200"
              >
                View Courses
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-600 hover:from-[hsl(var(--primary-hover))] hover:to-emerald-700 shadow-[0_0_28px_rgba(15,118,110,0.42)] hover:shadow-[0_0_38px_rgba(15,118,110,0.62)] hover:scale-105 active:scale-100 transition-all duration-200"
              >
                Book Free Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Ambient Spacer */}
        <div className="relative z-20 pb-2" />
      </section>

      {/* ========================================================================= */}
      {/* LIGHT-THEMED SANCTUARY CONTAINER (Animated Gradient & Ambient Glow) */}
      {/* ========================================================================= */}
      <div className="relative bg-sanctuary-light overflow-hidden text-stone-900 select-none">
        {/* Ambient floating glow orbs matching hero sanctuary palette */}
        <div className="absolute top-[3%] -right-[15%] w-[650px] h-[650px] rounded-full bg-emerald-200/35 blur-[140px] animate-ambient-orb-1 pointer-events-none" />
        <div className="absolute top-[26%] -left-[15%] w-[600px] h-[600px] rounded-full bg-teal-100/45 blur-[130px] animate-ambient-orb-2 pointer-events-none" />
        <div className="absolute top-[50%] -right-[12%] w-[700px] h-[700px] rounded-full bg-teal-200/30 blur-[140px] animate-ambient-orb-1 pointer-events-none" />
        <div className="absolute top-[75%] -left-[14%] w-[650px] h-[650px] rounded-full bg-emerald-200/25 blur-[130px] animate-ambient-orb-2 pointer-events-none" />

        {/* ========================================================================= */}
        {/* STATS SECTION — Clean & Simple Real-Time Counters */}
        {/* ========================================================================= */}
        <section className="relative z-20 py-10 sm:py-14 bg-white/40 backdrop-blur-xs border-b border-stone-200/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/70">
              {statsData.map((s, idx) => (
                <div
                  key={s.label}
                  className={`flex flex-col items-center justify-center text-center ${
                    idx > 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''
                  }`}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gradient-primary">
                    <AnimatedCounter
                      target={s.target}
                      decimals={s.decimals}
                      suffix={s.suffix}
                      duration={2000}
                    />
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-stone-600 mt-1.5 tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COURSES SECTION — Reference Minimalist 3-Card Layout Fitting In One Screen */}
        {/* ========================================================================= */}
        <section
          id="courses"
          className="py-10 lg:py-14 bg-transparent text-stone-900 scroll-mt-16 relative overflow-hidden lg:min-h-[85vh] lg:max-h-[920px] flex flex-col justify-center select-none"
        >
          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Header matching user voice instructions & Reference */}
            <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 mb-2">
                Our Courses
              </h2>
              <p className="text-stone-500 font-normal text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Choose the right course for your Islamic education journey
              </p>
            </div>

            {/* 3 Pricing & Course Cards Grid matching Reference Image */}
            <div className="grid md:grid-cols-3 gap-4 lg:gap-6 items-stretch">
              {/* CARD 1: Beginner Plan (Noorani Qaida) */}
              <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight mb-2">
                    Noorani Qaida
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed mb-5">
                    For beginners and children learning Quranic Arabic letters, correct pronunciation, and basic reading rules.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950">
                      $49
                    </span>
                    <span className="text-xs font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/auth/signup"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-600 hover:from-[hsl(var(--primary-hover))] hover:to-emerald-700 shadow-[0_10px_24px_rgba(15,118,110,0.22)] active:scale-[0.99] transition-all block mb-6 uppercase tracking-wider"
                  >
                    Select Plan
                  </Link>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Letter pronunciation &amp; Makharij</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Session recordings &amp; notes</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CARD 2: Pro Plan (Tajweed Mastery) — Featured Center Card with Emerald Accent */}
              <div className="rounded-3xl bg-[#0f1416] border border-stone-800 p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative lg:-translate-y-1.5 transition-all">
                {/* Popular Pill */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-emerald-400 text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                    Tajweed Mastery
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-[13px] leading-relaxed mb-5">
                    Master the science of Tajweed, rules of elongation, stops, and beautiful melodic recitation with Sanad scholars.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-stone-800/80">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                      $59
                    </span>
                    <span className="text-xs font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/auth/signup"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-center text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 shadow-[0_0_24px_rgba(16,185,129,0.34)] active:scale-[0.99] transition-all block mb-6 uppercase tracking-wider"
                  >
                    Select Plan
                  </Link>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-2.5 text-xs text-stone-300 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 stroke-[2.5]" />
                      <span>Comprehensive Tajweed theoretical rules</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 stroke-[2.5]" />
                      <span>Melodic recitation &amp; Waqf guidance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 stroke-[2.5]" />
                      <span>Monthly progress evaluation</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CARD 3: Intensive Memorization (Hifz) */}
              <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight mb-2">
                    Hifz Program
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed mb-5">
                    Structured Quran memorization with dedicated daily revision, retention strategies, and individual Sanad pathway.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950">
                      $79
                    </span>
                    <span className="text-xs font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/auth/signup"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-600 hover:from-[hsl(var(--primary-hover))] hover:to-emerald-700 shadow-[0_10px_24px_rgba(15,118,110,0.22)] active:scale-[0.99] transition-all block mb-6 uppercase tracking-wider"
                  >
                    Select Plan
                  </Link>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Dedicated Hifz coach</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Structured memorization schedule</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Revision tracking &amp; lecturer messaging</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS SECTION — Modern Process Timeline & Front-Facing Laptop Preview */}
        {/* ========================================================================= */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-white/35 backdrop-blur-xs text-stone-900 border-y border-stone-200/60 scroll-mt-16 select-none"
        >
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header: Centered Pill, Title, and Subtitle */}
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 mb-3">
                How It Works
              </h2>
              <p className="text-stone-500 font-normal text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Start learning in minutes — our streamlined process connects you with certified scholars seamlessly.
              </p>
            </div>

            {/* DESKTOP VIEW: Left Timeline Steps & Right Front-Facing Laptop */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 items-center">
              {/* Left Column: Process Steps with Connected Spine */}
              <div className="lg:col-span-6 xl:col-span-6">
                <div className="relative flex flex-col space-y-3">
                  {/* Continuous Vertical Timeline Line */}
                  <div className="absolute left-[138px] top-6 bottom-6 w-[2px] bg-stone-200/90 pointer-events-none z-0" />

                  {howItWorksSteps.map((step, idx) => {
                    const isActive = activeProcessStep === idx;
                    return (
                      <div
                        key={step.num}
                        onClick={() => setActiveProcessStep(idx)}
                        onMouseEnter={() => setActiveProcessStep(idx)}
                        className={`group relative z-10 flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-[26px] cursor-pointer transition-all duration-300 ${
                          isActive
                            ? 'bg-white/95 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md'
                            : 'bg-transparent hover:bg-white/60 border border-transparent'
                        }`}
                      >
                        {/* Left: Squircle Icon & Number Badge */}
                        <div className="flex items-center gap-2.5 shrink-0 w-[84px]">
                          <div
                            className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 shrink-0 ${
                              isActive
                                ? 'bg-[#18181b] text-white shadow-md'
                                : 'bg-[#f2f2f4] text-stone-700 group-hover:bg-stone-200/80'
                            }`}
                          >
                            <ProcessStepIcon type={step.iconType} active={isActive} />
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200/90 text-[10px] font-mono font-bold text-stone-600 shadow-2xs shrink-0">
                            {step.num}
                          </span>
                        </div>

                        {/* Center: Connector Line Segment & Node */}
                        <div className="relative flex items-center justify-center shrink-0 w-8">
                          <div className="w-full h-[1.5px] bg-stone-200/90" />
                          {isActive ? (
                            <div className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-pink-400 to-amber-300 p-[2px] shadow-[0_0_12px_rgba(236,72,153,0.4)] flex items-center justify-center">
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                              </div>
                            </div>
                          ) : (
                            <div className="absolute w-3.5 h-3.5 rounded-full border-2 border-stone-300 bg-white group-hover:border-stone-400 transition-colors" />
                          )}
                        </div>

                        {/* Right: Step Title and Description */}
                        <div className="flex-1 min-w-0 pl-1">
                          <h3 className="text-[15px] sm:text-base font-extrabold text-stone-950 tracking-tight mb-1">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-[13px] text-stone-500 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Front-Facing Laptop Preview */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[560px] xl:max-w-[620px]">
                  {/* Subtle soft backdrop glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-stone-100/70 blur-[50px] pointer-events-none -z-10" />

                  <div className="relative w-full">
                    <Image
                      src="/images/how-it-works-front-laptop.jpg"
                      alt="Online Quran lesson on front-facing laptop held in hand"
                      width={1376}
                      height={768}
                      className="w-full h-auto object-contain select-none pointer-events-none"
                      priority
                    />
                    {/* White smoke blurred effect at base of hand & wrist */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none backdrop-blur-[1px]" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[320px] h-[60px] rounded-full bg-white/95 blur-[16px] pointer-events-none" />
                  </div>

                  {/* Subtitle tag beneath the laptop */}
                  <div className="text-center mt-3">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-[11px] font-medium text-stone-600 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Noor Academy Quran Recitation Classroom</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE & TABLET VIEW: Responsive Stack */}
            <div className="block lg:hidden">
              {/* Center Front-Facing Laptop */}
              <div className="relative w-full max-w-[380px] mx-auto mb-8">
                <div className="relative">
                  <Image
                    src="/images/how-it-works-front-laptop.jpg"
                    alt="Online Quran lesson on front-facing laptop held in hand"
                    width={1376}
                    height={768}
                    className="relative z-10 w-full h-auto object-contain"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Steps Timeline Stack */}
              <div className="space-y-3 max-w-lg mx-auto">
                {howItWorksSteps.map((step, idx) => {
                  const isActive = activeProcessStep === idx;
                  return (
                    <div
                      key={step.num}
                      onClick={() => setActiveProcessStep(idx)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-white border-stone-200 shadow-xs'
                          : 'bg-white/80 border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-[#18181b] text-white shadow-sm' : 'bg-[#f2f2f4] text-stone-700'
                        }`}
                      >
                        <ProcessStepIcon type={step.iconType} active={isActive} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.2 rounded-full bg-stone-100 text-[10px] font-mono font-bold text-stone-500">
                            {step.num}
                          </span>
                          <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TESTIMONIALS SECTION — Reference Layout with Rating Summary & Horizontal Stories */}
        {/* ========================================================================= */}
        <section id="testimonials" className="py-20 lg:py-28 bg-transparent scroll-mt-16 text-stone-900 select-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Main Card Container */}
            <div className="rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white/90 backdrop-blur-md overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col md:flex-row">
              {/* Left Column: Rating Block */}
              <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 p-8 sm:p-10 flex flex-col items-center justify-center text-center bg-white/90 border-b md:border-b-0 md:border-r border-stone-200/80">
                <span className="text-6xl sm:text-7xl font-bold tracking-tight text-stone-950 mb-3">
                  4.8
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-950 mb-1">
                  500+ reviews
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Across G2, Capterra and TrustPilot
                </span>
              </div>

              {/* Right Part: Testimonial Cards Carousel Track */}
              <div
                ref={sliderRef}
                onScroll={checkScrollButtons}
                className="flex-1 flex overflow-x-auto scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {diasporaTestimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[300px] sm:w-[350px] lg:w-[390px] shrink-0 p-7 sm:p-9 flex flex-col justify-between border-r border-stone-200/80 bg-white/85"
                  >
                    <p className="text-base sm:text-[17px] font-bold text-stone-950 leading-snug mb-8">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-stone-950 truncate">
                            {t.name}
                          </h4>
                          <p className="text-xs text-stone-500 truncate">
                            {t.role}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedStory(t)}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-900 transition-colors inline-block cursor-pointer"
                      >
                        Read Story
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows Below the Box (Bottom-Left) */}
            <div className="mt-5 flex items-center gap-2.5">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-xl bg-white hover:bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-800 transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-xl bg-white hover:bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-800 transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Read Story Modal Dialog */}
          <AnimatePresence>
            {selectedStory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-100"
                >
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                      <Image
                        src={selectedStory.avatar}
                        alt={selectedStory.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-950">{selectedStory.name}</h3>
                      <p className="text-xs text-stone-500">{selectedStory.role} · {selectedStory.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-stone-800 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    &ldquo;{selectedStory.fullStory}&rdquo;
                  </p>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-semibold text-stone-900">Enrolled In: {selectedStory.course}</span>
                    <span className="text-emerald-700 font-bold">Verified Diaspora Family</span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CALL TO ACTION — Floating Sanctuary Card */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 lg:py-24 relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1618] via-[#0f2321] to-[#0a1b19] text-white p-10 sm:p-14 lg:p-16 shadow-[0_20px_60px_rgba(5,35,30,0.18)] border border-stone-800/80 text-center">
              {/* Ambient lighting inside card */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-wide text-white">
                  Begin Your Sacred Journey of Knowledge
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-stone-300 mb-8 leading-relaxed max-w-xl mx-auto">
                  Book a complimentary 30-minute 1:1 trial session with one of our certified Sri Lankan scholars. No credit card required.
                </p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-500 text-white hover:from-emerald-800 hover:to-emerald-600 shadow-[0_0_28px_rgba(16,185,129,0.34)] hover:shadow-[0_0_38px_rgba(16,185,129,0.52)] transition-all hover:scale-105 active:scale-100"
                >
                  Start Free Trial Today <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
