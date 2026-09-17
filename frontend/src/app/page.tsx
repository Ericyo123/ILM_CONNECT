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
  UserCheck,
  UserPlus,
  Compass,
  Video,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import WaitlistModal from '@/components/waitlist-modal';

const sectionReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

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
  },
  {
    target: 150,
    suffix: '+',
    decimals: 0,
    label: 'Active Students',
  },
  {
    target: 4.85,
    suffix: '',
    decimals: 2,
    label: 'Average Rating',
  },
  {
    target: 10000,
    suffix: '+',
    decimals: 0,
    label: 'Teaching Hours Completed',
  },
];


const missionPoints = [
  {
    category: 'Scholar Faculty',
    line1: 'Learn directly',
    highlight: 'from verified scholars',
    line3: 'with Sanad heritage.',
    desc: 'Hand-vetted teachers rooted in traditional Islamic institutions, carrying authentic Sanad lineage.',
    tag: 'Authentic Sanad',
    icon: GraduationCap,
  },
  {
    category: 'Parent Visibility',
    line1: 'Track milestones',
    highlight: 'with live reports',
    line3: 'and lesson feedback.',
    desc: 'Transparent session summaries, attendance logs, and Tajweed milestones delivered after every class.',
    tag: 'Live Reports',
    icon: ShieldCheck,
  },
  {
    category: 'Global Scheduling',
    line1: 'Coordinate classes',
    highlight: 'across any time zone',
    line3: 'for diaspora families.',
    desc: 'Flexible 1-on-1 scheduling coordinated across UK, US, Canada, Australia, and Middle East time zones.',
    tag: 'Global 24/7',
    icon: Globe,
  },
  {
    category: '1:1 Articulation',
    line1: 'Master Makharij',
    highlight: 'with direct correction',
    line3: 'and fluent recitation.',
    desc: 'Personalized vocal correction with real-time video feedback so students recite with true Tajweed excellence.',
    tag: 'Makharij Precision',
    icon: UserCheck,
  },
];


const howItWorksSteps = [
  {
    num: '1',
    badge: 'STEP 01',
    title: 'Create Your Account',
    desc: 'Register in under 2 minutes, personalize your student profile, and begin your Islamic learning journey.',
    image: '/images/how-it-works-step-1-v3.jpg',
    imageAlt: 'IlmConnect student account registration on laptop screen',
    buttonText: 'Get Started',
    buttonLink: '/auth/signup',
  },
  {
    num: '2',
    badge: 'STEP 02',
    title: 'Choose Course Plan',
    desc: 'Select your learning path from beginner Qaida to Tajweed, with flexible Standard or Fast Track 1:1 plans.',
    image: '/images/how-it-works-step-2-v3.jpg',
    imageAlt: 'IlmConnect course plans and pricing on laptop screen',
    buttonText: 'View Plans',
    buttonLink: '#courses',
  },
  {
    num: '3',
    badge: 'STEP 03',
    title: 'Get Matched With Scholar',
    desc: 'Our academic team reviews your goals to pair you with an ideal verified, Sanad-certified Islamic scholar.',
    image: '/images/how-it-works-step-3-v4.jpg',
    imageAlt: 'Academic team matches student with verified Islamic scholar on IlmConnect laptop screen',
    buttonText: 'How Matching Works',
    buttonLink: '/about',
  },
  {
    num: '4',
    badge: 'STEP 04',
    title: 'Start 1:1 Learning',
    desc: 'Attend interactive 1:1 online sessions with your scholar, practicing Quran recitation with Tajweed correction.',
    image: '/images/how-it-works-step-4-v4.jpg',
    imageAlt: 'Student actively learning Quran 1:1 online with certified scholar on laptop screen',
    buttonText: 'Join Classroom',
    buttonLink: '/auth/signup',
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedStory, setSelectedStory] = useState<TestimonialStory | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

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
          {/* Light black overlay across the entire picture for higher text visibility */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Top gradient for header contrast and bottom gradient for hero text and CTA */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-transparent to-stone-950/85" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/15 to-stone-950/75 pointer-events-none" />
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
        {/* Bottom-Center Hero Content */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-20 mt-auto pb-10 sm:pb-14 pt-8 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="relative mx-auto max-w-4xl w-full">
            {/* Concise 2-Line Headline */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug drop-shadow-md max-w-2xl mx-auto">
              <span className="block">Learn Quran &amp; Islamic Studies</span>
              <span className="block text-stone-200 font-medium text-base sm:text-2xl lg:text-[28px] mt-1">
                from Qualified Scholars Worldwide
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed drop-shadow-md font-normal">
              Personalized 1:1 online Tajweed and Islamic studies with verified Sanad-certified scholars, tailored for diaspora families.
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="#courses"
                className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-md transition-all duration-200"
              >
                View Courses
              </Link>
              <Link
                href="/auth/signup"
                className="px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-[#095F46] hover:bg-[#074c38] shadow-[0_4px_20px_rgba(9,95,70,0.4)] hover:shadow-[0_6px_28px_rgba(9,95,70,0.6)] hover:scale-105 active:scale-100 transition-all duration-200"
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
        {/* WHY ILMCONNECT SECTION — Editorial Split Showcase Matching Reference */}
        {/* ========================================================================= */}
        <section
          id="mission"
          className="relative z-20 py-16 sm:py-24 border-b border-stone-200/60 select-none overflow-hidden"
        >
          {/* Subtle decorative curved arrow bottom right */}
          <svg
            className="absolute bottom-6 right-6 sm:right-16 w-20 h-20 text-stone-300 pointer-events-none hidden sm:block opacity-60"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M 30 85 C 42 45, 68 28, 82 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
            <path
              d="M 72 18 L 82 14 L 86 25"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Left Column: Overlapping Organic Shaped Photo Composition */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={sectionReveal}
                className="lg:col-span-6 relative pb-10 sm:pb-12 pl-4 sm:pl-8 pr-2"
              >
                {/* Subtle top-left decorative flourish arrow */}
                <svg
                  className="absolute -top-10 left-0 w-16 h-16 text-stone-300 pointer-events-none hidden sm:block opacity-60 -rotate-12"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <path
                    d="M 20 20 C 50 15, 68 38, 58 72"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 48 68 L 58 74 L 66 64"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Main Scholar Photo Frame */}
                <div className="relative w-full max-w-[490px] mx-auto aspect-[4/3] rounded-t-[36px] sm:rounded-t-[44px] rounded-br-[110px] sm:rounded-br-[150px] rounded-bl-[36px] overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.09)] border border-stone-200/80 bg-stone-100">
                  <Image
                    src="/images/why-ilm-scholar.jpg"
                    alt="Islamic scholar teaching Quran online via laptop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 490px"
                  />
                  {/* Soft inner vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Small Lime Accent Dot on Right Outer Border */}
                <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#84cc16] shadow-sm z-20" />

                {/* Overlapping Inset Student Hands / Quran Photo at Bottom-Left */}
                <div className="absolute bottom-0 left-0 sm:left-2 w-44 sm:w-56 md:w-60 aspect-[4/3] rounded-[28px] sm:rounded-[36px] border-[6px] sm:border-[8px] border-white shadow-[0_20px_45px_rgba(0,0,0,0.16)] overflow-hidden bg-stone-100 z-10">
                  <Image
                    src="/images/why-ilm-quran-hands.jpg"
                    alt="Student following Holy Quran recitation with wooden pointer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 176px, 240px"
                  />
                </div>
              </motion.div>

              {/* Right Column: Narrative, Value Proposition & Checklist */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={sectionReveal}
                className="lg:col-span-6 flex flex-col justify-center lg:pl-4"
              >
                {/* High-Impact Heading with Brand Green Accent */}
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black tracking-tight text-stone-950 leading-[1.16] mb-5">
                  Grow In Sacred Knowledge So You Can{' '}
                  <span className="text-[#095F46] block sm:inline">Live With Purpose &amp; Iman</span>
                </h2>

                {/* Narrative Paragraph */}
                <p className="text-stone-500 font-normal text-sm sm:text-base leading-relaxed mb-7 max-w-xl">
                  Finding verified, authentic Islamic teachers who can guide your family with patience and consistency shouldn&apos;t be difficult. IlmConnect bridges you directly with qualified scholars for structured 1-on-1 online learning tailored to your timezone and personal pace.
                </p>

                {/* Clean Feature Checklist with Brand Green Checkmarks */}
                <div className="space-y-3.5 mb-9">
                  {[
                    'Flexible 1-on-1 training programs',
                    'Experienced scholars & certified teachers',
                    'Free incoming trial lesson',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#095F46] bg-[#095F46]/10 shrink-0">
                        <svg
                          className="w-3.5 h-3.5 stroke-[2.5]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="font-semibold text-stone-800 text-sm sm:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button — Redirects to /about with Brand Green #095F46 */}
                <div className="flex items-center">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-9 py-3.5 rounded-full bg-[#095F46] hover:bg-[#074c38] text-white font-bold text-sm sm:text-base shadow-[0_4px_16px_rgba(9,95,70,0.25)] hover:shadow-[0_8px_24px_rgba(9,95,70,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PLATFORM STATS STRIP — Compact 4 Metrics Directly Below Why IlmConnect */}
        {/* ========================================================================= */}
        <section
          id="stats"
          className="relative z-20 py-8 sm:py-10 border-b border-stone-200/60 select-none bg-[#f8faf8]"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={sectionReveal}
              className="grid grid-cols-2 md:grid-cols-4 items-center"
            >
              {platformStats.map((stat, idx) => {
                const isLastDesktop = idx === 3;
                const hasRightBorderMobile = idx % 2 === 0;
                const hasBottomBorderMobile = idx < 2;
                return (
                  <div
                    key={stat.label}
                    className={`text-center py-3 sm:py-4 px-2 sm:px-6 
                      ${!isLastDesktop ? 'md:border-r md:border-stone-300/70' : 'md:border-r-0'} 
                      ${hasRightBorderMobile ? 'border-r border-stone-300/70' : ''} 
                      ${hasBottomBorderMobile ? 'border-b border-stone-300/70 pb-6 md:border-b-0 md:pb-4' : 'pt-6 md:pt-4'}
                    `}
                  >
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#095F46] tracking-tight mb-1.5">
                      <AnimatedCounter
                        target={stat.target}
                        decimals={stat.decimals}
                        suffix={stat.suffix}
                        duration={2000}
                      />
                    </div>
                    <div className="text-stone-700 text-xs sm:text-sm lg:text-[15px] font-semibold tracking-tight">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS SECTION — Alternating Horizontal Timeline (Reference Inspired) */}
        {/* ========================================================================= */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 lg:py-24 bg-[#f6f8f6] text-stone-900 border-b border-stone-200/60 scroll-mt-16 select-none relative overflow-hidden"
        >
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={sectionReveal}
              className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 mb-3 sm:mb-4">
                How It Works
              </h2>
              <p className="text-stone-600 font-normal text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Start learning in minutes — our streamlined process connects you with certified scholars seamlessly.
              </p>
            </motion.div>

            {/* =================================================================== */}
            {/* DESKTOP TIMELINE: 4-Column Staggered Layout Matching Reference Image */}
            {/* =================================================================== */}
            <div className="hidden lg:block relative py-6">
              {/* Continuous Horizontal Background Axis Line across all 4 columns */}
              <div className="absolute top-[48%] left-8 right-8 h-[2px] bg-stone-300 -translate-y-1/2 z-0" />

              {/* 4 Staggered Columns */}
              <div className="grid grid-cols-4 gap-6 xl:gap-8 relative z-10 items-start">
                {/* ----------------- STEP 1 (High / Top aligned) ----------------- */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={sectionReveal}
                    className="w-full bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(9,95,70,0.12)] hover:border-[#095F46]/50 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-100 mb-4 bg-stone-50">
                      <Image
                        src={howItWorksSteps[0].image}
                        alt={howItWorksSteps[0].imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1200px) 25vw, 320px"
                      />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#095F46] uppercase tracking-wider mb-1.5">
                      {howItWorksSteps[0].badge}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 tracking-tight group-hover:text-[#095F46] transition-colors leading-snug">
                      {howItWorksSteps[0].title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-3.5">
                      {howItWorksSteps[0].desc}
                    </p>
                    <Link
                      href={howItWorksSteps[0].buttonLink}
                      className="inline-flex items-center text-sm font-bold text-[#095F46] hover:text-[#074c38] gap-1.5 group-hover:translate-x-1.5 transition-all"
                    >
                      {howItWorksSteps[0].buttonText}
                      <span>→</span>
                    </Link>
                  </motion.div>
                  {/* Vertical connector line down from Card 1 */}
                  <div className="w-[2px] h-8 bg-stone-300" />
                  {/* Badge 1 Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#095F46] text-white font-black text-sm flex items-center justify-center shadow-md ring-4 ring-[#f6f8f6]">
                    1
                  </div>
                </div>

                {/* ----------------- STEP 2 (Shifted Down / Staggered) ----------------- */}
                <div className="flex flex-col items-center pt-20">
                  {/* Badge 2 Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#095F46] text-white font-black text-sm flex items-center justify-center shadow-md ring-4 ring-[#f6f8f6]">
                    2
                  </div>
                  {/* Vertical connector line down to Card 2 */}
                  <div className="w-[2px] h-8 bg-stone-300" />
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={sectionReveal}
                    className="w-full bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(9,95,70,0.12)] hover:border-[#095F46]/50 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-100 mb-4 bg-stone-50">
                      <Image
                        src={howItWorksSteps[1].image}
                        alt={howItWorksSteps[1].imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1200px) 25vw, 320px"
                      />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#095F46] uppercase tracking-wider mb-1.5">
                      {howItWorksSteps[1].badge}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 tracking-tight group-hover:text-[#095F46] transition-colors leading-snug">
                      {howItWorksSteps[1].title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-3.5">
                      {howItWorksSteps[1].desc}
                    </p>
                    <Link
                      href={howItWorksSteps[1].buttonLink}
                      className="inline-flex items-center text-sm font-bold text-[#095F46] hover:text-[#074c38] gap-1.5 group-hover:translate-x-1.5 transition-all"
                    >
                      {howItWorksSteps[1].buttonText}
                      <span>→</span>
                    </Link>
                  </motion.div>
                </div>

                {/* ----------------- STEP 3 (High / Top aligned) ----------------- */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={sectionReveal}
                    className="w-full bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(9,95,70,0.12)] hover:border-[#095F46]/50 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-100 mb-4 bg-stone-50">
                      <Image
                        src={howItWorksSteps[2].image}
                        alt={howItWorksSteps[2].imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1200px) 25vw, 320px"
                      />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#095F46] uppercase tracking-wider mb-1.5">
                      {howItWorksSteps[2].badge}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 tracking-tight group-hover:text-[#095F46] transition-colors leading-snug">
                      {howItWorksSteps[2].title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-3.5">
                      {howItWorksSteps[2].desc}
                    </p>
                    <Link
                      href={howItWorksSteps[2].buttonLink}
                      className="inline-flex items-center text-sm font-bold text-[#095F46] hover:text-[#074c38] gap-1.5 group-hover:translate-x-1.5 transition-all"
                    >
                      {howItWorksSteps[2].buttonText}
                      <span>→</span>
                    </Link>
                  </motion.div>
                  {/* Vertical connector line down from Card 3 */}
                  <div className="w-[2px] h-8 bg-stone-300" />
                  {/* Badge 3 Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#095F46] text-white font-black text-sm flex items-center justify-center shadow-md ring-4 ring-[#f6f8f6]">
                    3
                  </div>
                </div>

                {/* ----------------- STEP 4 (Shifted Down / Staggered) ----------------- */}
                <div className="flex flex-col items-center pt-20">
                  {/* Badge 4 Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#095F46] text-white font-black text-sm flex items-center justify-center shadow-md ring-4 ring-[#f6f8f6]">
                    4
                  </div>
                  {/* Vertical connector line down to Card 4 */}
                  <div className="w-[2px] h-8 bg-stone-300" />
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={sectionReveal}
                    className="w-full bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(9,95,70,0.12)] hover:border-[#095F46]/50 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-100 mb-4 bg-stone-50">
                      <Image
                        src={howItWorksSteps[3].image}
                        alt={howItWorksSteps[3].imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1200px) 25vw, 320px"
                      />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#095F46] uppercase tracking-wider mb-1.5">
                      {howItWorksSteps[3].badge}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 tracking-tight group-hover:text-[#095F46] transition-colors leading-snug">
                      {howItWorksSteps[3].title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-3.5">
                      {howItWorksSteps[3].desc}
                    </p>
                    <Link
                      href={howItWorksSteps[3].buttonLink}
                      className="inline-flex items-center text-sm font-bold text-[#095F46] hover:text-[#074c38] gap-1.5 group-hover:translate-x-1.5 transition-all"
                    >
                      {howItWorksSteps[3].buttonText}
                      <span>→</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* MOBILE / TABLET TIMELINE: Responsive Vertical Axis (< lg) */}
            {/* =================================================================== */}
            <div className="lg:hidden relative pl-8 sm:pl-10 space-y-8 max-w-xl mx-auto">
              {/* Vertical Axis Line */}
              <div className="absolute top-4 bottom-4 left-3.5 sm:left-4 w-[2px] bg-stone-300" />
              <div className="absolute top-2 left-2.5 sm:left-3 w-2 h-2 rounded-full bg-[#095F46]" />
              <div className="absolute bottom-2 left-2.5 sm:left-3 w-2 h-2 rounded-full bg-[#095F46]" />

              {howItWorksSteps.map((step) => (
                <div key={step.num} className="relative">
                  {/* Numbered Node on the vertical axis */}
                  <div className="absolute -left-8 sm:-left-10 top-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#095F46] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md ring-4 ring-[#f8fafc] z-10">
                    {step.num}
                  </div>

                  {/* Mobile Card */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    variants={sectionReveal}
                    className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex flex-col"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-100 mb-4 bg-stone-50">
                      <Image
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 400px"
                      />
                    </div>
                    <div className="text-xs font-mono font-bold text-[#095F46] uppercase tracking-wider mb-1.5">
                      {step.badge}
                    </div>
                    <h3 className="text-lg font-bold text-stone-950 mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed mb-3.5">
                      {step.desc}
                    </p>
                    <Link
                      href={step.buttonLink}
                      className="inline-flex items-center text-sm font-bold text-[#095F46] hover:text-[#074c38] gap-1.5"
                    >
                      {step.buttonText}
                      <span>→</span>
                    </Link>
                  </motion.div>
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
          className="py-14 sm:py-18 lg:py-20 bg-transparent text-stone-900 scroll-mt-16 relative overflow-hidden border-b border-stone-200/60 select-none"
        >
          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Header matching user voice instructions & Reference */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={sectionReveal}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 mb-3">
                Our Courses
              </h2>
              <p className="text-stone-500 font-normal text-xs sm:text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
                Choose the right course for your Islamic education journey
              </p>
            </motion.div>

            {/* 3 Pricing & Course Cards Grid matching Reference Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={cardStagger}
              className="grid md:grid-cols-3 gap-4 lg:gap-6 items-stretch"
            >
              {/* CARD 1: Beginner Plan (Noorani Qaida) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
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

                  {/* Fast Track Hook Box */}
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100/90 p-3 sm:p-3.5 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#095F46] text-white text-[10px] font-extrabold uppercase tracking-wider">
                          <Zap className="w-2.5 h-2.5 fill-current" /> Fast Track Plan
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-stone-800 font-bold leading-snug">
                        Want your child to start reading the Holy Quran twice as fast with 3 weekly sessions?
                      </p>
                      <Link
                        href="/pricing#fast-track-plans"
                        className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl bg-white hover:bg-[#095F46] text-[#095F46] hover:text-white border border-[#095F46]/25 hover:border-[#095F46] text-xs font-bold transition-all shadow-2xs group"
                      >
                        <span>Explore Fast Track Plan</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: Intermediate Plan (Tajweed Mastery) — Matching Card Style */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight mb-2">
                    Tajweed Mastery
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed mb-5">
                    Master the science of Tajweed, rules of elongation, stops, and beautiful melodic recitation with Sanad scholars.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950">
                      $59
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
                      <span>Comprehensive Tajweed theoretical rules</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Melodic recitation &amp; Waqf guidance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Monthly progress evaluation</span>
                    </li>
                  </ul>

                  {/* Fast Track Hook Box */}
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100/90 p-3 sm:p-3.5 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#095F46] text-white text-[10px] font-extrabold uppercase tracking-wider">
                          <Zap className="w-2.5 h-2.5 fill-current" /> Fast Track Plan
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-stone-800 font-bold leading-snug">
                        Master melodic Tajweed faster with 12 monthly sessions and recorded scholar feedback.
                      </p>
                      <Link
                        href="/pricing#fast-track-plans"
                        className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl bg-white hover:bg-[#095F46] text-[#095F46] hover:text-white border border-[#095F46]/25 hover:border-[#095F46] text-xs font-bold transition-all shadow-2xs group"
                      >
                        <span>Explore Fast Track Plan</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: Intensive Memorization (Hifz) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
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

                  {/* Fast Track Hook Box */}
                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100/90 p-3 sm:p-3.5 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#095F46] text-white text-[10px] font-extrabold uppercase tracking-wider">
                          <Zap className="w-2.5 h-2.5 fill-current" /> Fast Track Plan
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-stone-800 font-bold leading-snug">
                        Accelerate your Quran memorization with intensive 3x/week coaching and daily revision.
                      </p>
                      <Link
                        href="/pricing#fast-track-plans"
                        className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl bg-white hover:bg-[#095F46] text-[#095F46] hover:text-white border border-[#095F46]/25 hover:border-[#095F46] text-xs font-bold transition-all shadow-2xs group"
                      >
                        <span>Explore Fast Track Plan</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TESTIMONIALS SECTION — Reference Layout with Rating Summary & Horizontal Stories */}
        {/* ========================================================================= */}
        <section id="testimonials" className="py-14 sm:py-18 lg:py-20 bg-transparent scroll-mt-16 text-stone-900 border-b border-stone-200/60 select-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Attractive Testimonials Section Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={sectionReveal}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 mb-3">
                What Our Community Says
              </h2>
              <p className="text-stone-500 font-normal text-xs sm:text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
                Trusted by families, scholars, and students across the globe for authentic, transformative Islamic education.
              </p>
            </motion.div>

            {/* Main Card Container */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={sectionReveal}
              className="rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white/90 backdrop-blur-md overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col md:flex-row"
            >
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
            </motion.div>

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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={sectionReveal}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1618] via-[#0f2321] to-[#0a1b19] text-white p-10 sm:p-14 lg:p-16 shadow-[0_20px_60px_rgba(5,35,30,0.18)] border border-stone-800/80 text-center"
            >
              {/* Ambient lighting inside card */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-wide text-white">
                  Begin Your Sacred Journey of Knowledge
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-stone-300 mb-8 leading-relaxed max-w-xl mx-auto">
                  Join our priority waitlist for personalized 1:1 sessions with certified Sri Lankan scholars. Reserve early matching with a complimentary 30-minute trial session.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWaitlistOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-500 text-white hover:from-emerald-800 hover:to-emerald-600 shadow-[0_0_28px_rgba(16,185,129,0.34)] hover:shadow-[0_0_38px_rgba(16,185,129,0.52)] transition-all hover:scale-105 active:scale-100 cursor-pointer"
                >
                  <span>Join the Waitlist</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Priority Waitlist Pop-up Modal */}
        <WaitlistModal
          isOpen={isWaitlistOpen}
          onClose={() => setIsWaitlistOpen(false)}
        />
      </div>
    </>
  );
}
