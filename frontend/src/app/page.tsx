'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Check,
  Quote,
  ArrowLeft,
  ArrowRight,
  X,
} from 'lucide-react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import WaitlistModal from '@/components/waitlist-modal';
import HowToEnroll from '@/components/how-to-enroll';

function AnimatedCounter({
  target,
  duration = 2000,
  decimals = 0,
  suffix = '',
  start = false,
}: {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  start?: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!start || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    let animationStart: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const step = (timestamp: number) => {
      if (animationStart === null) animationStart = timestamp;
      const elapsed = timestamp - animationStart;
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
  }, [start, target, duration]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString('en-US');

  return (
    <span className="tabular-nums" suppressHydrationWarning>
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

interface TestimonialStory {
  name: string;
  role: string;
  location: string;
  quote: string;
  fullStory: string;
  course: string;
}

const diasporaTestimonials: TestimonialStory[] = [
  {
    name: 'Sarah Ahmed',
    role: 'Parent of 2',
    location: 'London, UK',
    quote: 'Ilmbit has boosted our children’s Quran fluency astronomically, transforming how they engage with the Holy Quran.',
    fullStory: 'Ilmbit has boosted our children’s Quran fluency astronomically, transforming how they engage with the Holy Quran. Finding punctual, gentle teachers in London with high Tajweed standards was always a challenge. Now my 8-year-old and 11-year-old look forward to their classes with Maulavi Ismail.',
    course: '1:1 Tajweed Recitation',
  },
  {
    name: 'Dr. Tariq Mansoor',
    role: 'Father & Physician',
    location: 'Toronto, Canada',
    quote: 'Ilmbit is more essential to our family routine than our local weekend school. It’s a powerful solution to diaspora education.',
    fullStory: 'Ilmbit is more essential to our family routine than our local weekend school. It’s a powerful solution to diaspora education. With my unpredictable hospital shifts, being able to reschedule and get reliable 1:1 attention for my sons has been an absolute game changer.',
    course: 'Hifz Memorization',
  },
  {
    name: 'Muhammad Rashid',
    role: 'Adult Revert Student',
    location: 'Sydney, Australia',
    quote: 'Finding patient, authentic Sri Lankan scholars was nearly impossible until Ilmbit. My recitation confidence has reached a whole new level.',
    fullStory: 'Finding patient, authentic Sri Lankan scholars was nearly impossible until Ilmbit. As a revert learning Arabic phonetics from scratch, Sheikh Ahmed’s patience and encouragement gave me the confidence to recite accurately in daily prayers without hesitation.',
    course: 'Noorani Qaida & Tajweed',
  },
  {
    name: 'Amina Diallo',
    role: 'Mother of 9yo student',
    location: 'Paris, France',
    quote: 'The 1:1 Tajweed coaching from Maulavi Ismail is exceptional. My daughter eagerly prepares for her live sessions twice every week.',
    fullStory: 'The 1:1 Tajweed coaching from Maulavi Ismail is exceptional. My daughter eagerly prepares for her live sessions twice every week. Her pronunciation and rhythm have blossomed in just three months, and the progress feedback keeps our whole family motivated.',
    course: 'Tajweed Recitation',
  },
  {
    name: 'Fatima Zahra',
    role: 'Parent & Educator',
    location: 'Dallas, USA',
    quote: 'The structured progress reports and authentic scholar discipline gave our home the exact spiritual grounding we were searching for.',
    fullStory: 'The structured progress reports and authentic scholar discipline gave our home the exact spiritual grounding and recitation excellence we were searching for. You get traditional madrasa quality with modern LMS scheduling and recording.',
    course: '1:1 Tajweed Recitation',
  },
  {
    name: 'Zayd Al-Husseini',
    role: 'Hifz Student',
    location: 'Dubai, UAE',
    quote: 'Completed my Hifz revision with Sheikh Ahmed. His gentle correction and deep mastery of Hafs recitation is something you rarely find online.',
    fullStory: 'Completed my Hifz revision with Sheikh Ahmed. His gentle correction and deep mastery of Hafs recitation is something you rarely find online. The virtual classroom tools and audio clarity made reviewing five Juz a week seamless.',
    course: 'Advanced Hifz Revision',
  },
];

const TESTIMONIAL_ROTATION_MS = 6500;



const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const revealViewport = {
  once: true,
  amount: 0.22,
  margin: '0px 0px -12% 0px',
} as const;

export default function HomePage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<TestimonialStory | null>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialRef, { once: true, amount: 0.2 });

  const statsRef = useRef<HTMLDivElement>(null);
  const statsActive = useInView(statsRef, {
    once: true,
    amount: 0.35,
    margin: '0px 0px -10% 0px',
  });

  const changeTestimonial = (direction: 'previous' | 'next') => {
    setTestimonialIndex((current) => {
      if (direction === 'previous') {
        return (current - 1 + diasporaTestimonials.length) % diasporaTestimonials.length;
      }
      return (current + 1) % diasporaTestimonials.length;
    });
  };

  useEffect(() => {
    if (!testimonialsInView || selectedStory) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTestimonialIndex((current) => (current + 1) % diasporaTestimonials.length);
    }, TESTIMONIAL_ROTATION_MS);

    return () => window.clearTimeout(timer);
  }, [testimonialIndex, testimonialsInView, selectedStory]);

  const activeTestimonial = diasporaTestimonials[testimonialIndex];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — Single Image with Left-Aligned Typography & Logo Alignment */}
      {/* ========================================================================= */}
      <section className="home-hero-section relative flex flex-col justify-between overflow-hidden bg-stone-950 text-white select-none">
        {/* Background Single Image — Student Reciting Holy Quran */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950">
          <Image
            src="/home images/test56.png"
            alt="Student reciting Holy Quran in mosque"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_center] sm:object-center"
          />

          {/* Angelic aesthetic warm golden filter & divine atmospheric radiance */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-75"
            style={{
              background:
                'linear-gradient(135deg, rgba(245, 222, 160, 0.45) 0%, rgba(220, 180, 85, 0.25) 45%, rgba(180, 135, 45, 0.35) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-35"
            style={{
              background:
                'radial-gradient(ellipse 85% 55% at 50% 12%, rgba(255, 248, 220, 0.55) 0%, rgba(234, 208, 138, 0.25) 50%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color opacity-20"
            style={{ backgroundColor: '#D4AF37' }}
          />

          {/* Cinematic Black Vignette Effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.50) 65%, rgba(0, 0, 0, 0.90) 100%)',
            }}
          />
          {/* Left-side dark gradient for enhanced contrast & readability of left-aligned typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/45 to-transparent pointer-events-none" />
          {/* Subtle top & bottom edge darkening for clean cinematic framing & navbar / marquee contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-transparent to-stone-950/80 pointer-events-none" />
        </div>

        {/* Top spacer for fixed header alignment */}
        <div className="w-full h-14 sm:h-16 lg:h-20 shrink-0 pointer-events-none" aria-hidden="true" />

        {/* Left-Aligned Hero Content — Exactly aligned to Header Logo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 my-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col items-center py-2 sm:py-4"
        >
          <div className="w-full max-w-7xl xl:max-w-[1440px] px-5 sm:px-7 lg:px-8 xl:px-9">
            <div className="max-w-2xl lg:max-w-3xl xl:max-w-5xl flex flex-col items-start text-left">
              {/* 3-Line Triangle Format Headline (Scaled to match 125% visual appearance) */}
              <h1 className="text-[32px] sm:text-[40px] md:text-[50px] lg:text-[62px] xl:text-[72px] 2xl:text-[76px] font-bold tracking-tight text-white leading-[1.02] sm:leading-[1.03] drop-shadow-[0_2px_10px_rgba(0,0,0,0.40)] font-bricolage text-left">
                <span className="block text-white">Learn Quran</span>
                <span className="block text-white mt-0.5 sm:mt-1">&amp; Islamic Studies</span>
                <span className="block text-[#EAD08A] mt-1.5 sm:mt-2 lg:mt-2.5 text-[18px] sm:text-[24px] md:text-[28px] lg:text-[36px] xl:text-[42px] font-semibold tracking-tight whitespace-nowrap">
                  from Qualified Scholars Worldwide
                </span>
              </h1>

              {/* Dual Pill CTA Buttons with scaled proportions */}
              <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-wrap items-center justify-start gap-4 sm:gap-5">
                <Link
                  href="#courses"
                  className="brand-button brand-button-inverse px-8 py-3 lg:px-10 lg:py-4 xl:px-11 xl:py-4.5 text-sm sm:text-base lg:text-[17px] xl:text-[18px] lg:min-h-[56px] xl:min-h-[58px] !font-light tracking-wide shadow-lg shadow-black/40"
                >
                  View Courses
                </Link>
                <Link
                  href="/about#waitlist"
                  className="brand-button brand-button-primary px-8 py-3 lg:px-10 lg:py-4 xl:px-11 xl:py-4.5 text-sm sm:text-base lg:text-[17px] xl:text-[18px] lg:min-h-[56px] xl:min-h-[58px] !font-light tracking-wide shadow-lg shadow-black/40"
                >
                  Join the Waitlist
                </Link>
              </div>

              {/* Description Content — Clear summary of Ilmbit for Sri Lankans abroad */}
              <p className="mt-6 sm:mt-7 lg:mt-8 max-w-xl lg:max-w-2xl xl:max-w-3xl text-sm sm:text-[15px] lg:text-[18px] xl:text-[19px] text-stone-200/90 leading-relaxed lg:leading-[1.65] drop-shadow-sm font-normal">
                Connecting Sri Lankan families living abroad directly with verified scholars for a personalized Quran recitation and Islamic learning experience, suited to your<br className="hidden sm:inline" />time and personal pace.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* Bottom Green Fat Line Marquee — Infinite Seamless Scroll to Waitlist */}
        {/* ========================================================================= */}
        <Link
          href="/about#waitlist"
          className="hero-bottom-marquee group relative z-30 w-full !rounded-none rounded-none bg-[#095F46] hover:bg-[#074D38] border-t border-emerald-400/30 text-white py-[18px] sm:py-[22px] lg:py-[26px] overflow-hidden flex items-center transition-colors duration-200 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          aria-label="Join the waitlist and get 20% off"
        >
          <div className="flex w-full overflow-hidden select-none">
            <div className="animate-hero-marquee flex items-center whitespace-nowrap shrink-0">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-7 sm:gap-9 mx-5 sm:mx-7 shrink-0">
                  <span className="text-sm sm:text-base lg:text-[16.5px] font-bold tracking-wider uppercase text-white drop-shadow-sm flex items-center gap-2.5">
                    <span>Join The Waitlist &amp; Get 20% Off</span>
                    <span className="text-emerald-200 group-hover:translate-x-1 transition-transform text-sm sm:text-base">→</span>
                  </span>
                  <span className="text-[#EAD08A] text-sm sm:text-base" aria-hidden="true">✦</span>
                  <span className="text-sm sm:text-base lg:text-[16px] font-medium tracking-wide uppercase text-emerald-100/95">
                    Limited Early Access Offer
                  </span>
                  <span className="text-[#EAD08A] text-sm sm:text-base" aria-hidden="true">✦</span>
                </div>
              ))}
            </div>
            <div className="animate-hero-marquee flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-7 sm:gap-9 mx-5 sm:mx-7 shrink-0">
                  <span className="text-sm sm:text-base lg:text-[16.5px] font-bold tracking-wider uppercase text-white drop-shadow-sm flex items-center gap-2.5">
                    <span>Join The Waitlist &amp; Get 20% Off</span>
                    <span className="text-emerald-200 group-hover:translate-x-1 transition-transform text-sm sm:text-base">→</span>
                  </span>
                  <span className="text-[#EAD08A] text-sm sm:text-base" aria-hidden="true">✦</span>
                  <span className="text-sm sm:text-base lg:text-[16px] font-medium tracking-wide uppercase text-emerald-100/95">
                    Limited Early Access Offer
                  </span>
                  <span className="text-[#EAD08A] text-sm sm:text-base" aria-hidden="true">✦</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </section>

      {/* ========================================================================= */}
      {/* LIGHT-THEMED SANCTUARY CONTAINER (Animated Gradient & Ambient Glow) */}
      {/* ========================================================================= */}
      <div className="relative bg-sanctuary-light overflow-hidden text-stone-900 select-none">
        {/* Ambient floating glow orbs matching green + aesthetic warm yellowish sanctuary palette */}
        <div className="absolute top-[3%] -right-[15%] w-[650px] h-[650px] rounded-full bg-[#095F46]/10 blur-[140px] animate-ambient-orb-1 pointer-events-none" />
        <div className="absolute top-[26%] -left-[15%] w-[600px] h-[600px] rounded-full bg-[#EAD08A]/15 blur-[130px] animate-ambient-orb-2 pointer-events-none" />
        <div className="absolute top-[50%] -right-[12%] w-[700px] h-[700px] rounded-full bg-[#EAD08A]/12 blur-[140px] animate-ambient-orb-1 pointer-events-none" />
        <div className="absolute top-[75%] -left-[14%] w-[650px] h-[650px] rounded-full bg-[#095F46]/10 blur-[130px] animate-ambient-orb-2 pointer-events-none" />

        {/* ========================================================================= */}
        {/* 2. WHY ILMBIT / MISSION SECTION — Reference-Style Content & Stats */}
        {/* ========================================================================= */}
        <section
          id="mission"
          suppressHydrationWarning
          className="relative z-20 overflow-hidden bg-white border-b border-stone-200/60 py-16 sm:py-20 lg:py-24 select-none"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Mission & Core Value */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                variants={sectionReveal}
                className="flex flex-col lg:col-span-6"
              >
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-tight text-stone-950 leading-[1.22] font-bricolage" suppressHydrationWarning>
                    Grow Your Knowledge,<br />
                    <span className="text-[#095F46]">Live With Purpose &amp; Iman</span>
                  </h2>

                  <p className="mt-5 text-base sm:text-lg lg:text-[18px] font-normal leading-relaxed text-stone-600">
                    Finding patient, verified Islamic teachers shouldn&apos;t be difficult. Ilmbit connects students in Sri Lanka and Sri Lankan families living abroad directly with qualified scholars for structured 1:1 online lessons suited to your schedule and personal pace.
                  </p>

                  <div className="mt-6 space-y-3.5 lg:space-y-4">
                    {[
                      { title: 'Personalized 1:1 Learning Paths', desc: 'From foundational Noorani Qaida to advanced Sanad Tajweed' },
                      { title: 'Verified Scholars & Certified Maulavis', desc: 'Carefully vetted teachers with authentic Sanad and clear guidance' },
                      { title: 'For Students in Sri Lanka & Abroad', desc: 'Flexible 1:1 session scheduling across local and overseas timezones' },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#095F46]/10 text-[#095F46] mt-0.5">
                          <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-[17px] lg:text-[18px] font-bold tracking-tight text-stone-900">
                            {feature.title}
                          </h3>
                          <p className="text-sm sm:text-[15px] lg:text-[16px] text-stone-500 font-normal">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    className="brand-button brand-button-primary px-8 py-3.5 lg:px-9 lg:py-4 text-xs lg:text-sm tracking-wider uppercase !font-light inline-flex items-center gap-2 group"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Right Column: Scholar Teaching Visual matching height of left text from heading to Learn More button */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                variants={sectionReveal}
                className="relative lg:col-span-6 flex items-center justify-center w-full"
              >
                <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] xl:h-[520px]">
                  {/* Subtle warm golden background glow */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#095F46]/10 via-[#EAD08A]/20 to-transparent rounded-[36px] blur-2xl -z-10" />

                  {/* Main Image Frame */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden border border-stone-200/90 shadow-[0_20px_50px_rgba(9,95,70,0.08)] bg-stone-100">
                    <Image
                      src="/images/grow-in-sacred-scholar.jpg"
                      alt="Qualified Islamic scholar teaching Quran"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top sm:object-center"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. HOW TO ENROLL SECTION — 2-Column: Laptop Dashboard + Timeline */}
        {/* ========================================================================= */}
        <section
          id="how-to-enroll"
          className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#063529] via-[#083f33] to-[#04281e] text-white border-b border-emerald-950/60 scroll-mt-16 select-none relative overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#EAD08A]/10 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-emerald-400/8 blur-[130px] pointer-events-none" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
              
              {/* Left Column: Picture of Actual Dashboard on Laptop */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                variants={sectionReveal}
                className="relative lg:col-span-6 flex items-center justify-center order-2 lg:order-1"
              >
                <div className="relative w-full max-w-[580px] lg:max-w-none">
                  {/* Subtle warm glow around the laptop */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#EAD08A]/15 via-emerald-400/10 to-transparent rounded-[32px] blur-2xl -z-10" />

                  {/* Laptop Screen Display Lid */}
                  <div className="relative mx-auto w-full rounded-t-[18px] sm:rounded-t-[22px] bg-[#1a1b1e] p-2.5 sm:p-3 lg:p-3.5 pt-3 sm:pt-3.5 lg:pt-4 border border-zinc-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
                    {/* Top Center Camera Dot */}
                    <div className="flex items-center justify-center mb-1.5 sm:mb-2">
                      <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                        <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-emerald-950/70" />
                      </div>
                    </div>

                    {/* Actual Dashboard Screenshot Display */}
                    <div className="relative w-full aspect-[1440/900] rounded-sm sm:rounded-md overflow-hidden bg-stone-900 border border-zinc-800">
                      <Image
                        src="/images/actual-dashboard-screenshot.png"
                        alt="Actual Ilmbit student learning dashboard with real courses, upcoming live sessions, and scholar profile"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top select-none pointer-events-none"
                      />
                      {/* Subtle Glass Reflection */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-transparent" />
                    </div>
                  </div>

                  {/* Laptop Bottom Aluminum Base & Keyboard Deck */}
                  <div className="relative mx-auto w-[102%] -ml-[1%]">
                    {/* Aluminum Hinge & Notch */}
                    <div className="h-3 sm:h-4 bg-gradient-to-b from-[#2a2c30] via-[#202226] to-[#151619] rounded-b-md sm:rounded-b-lg border-t border-zinc-600/40 relative shadow-md">
                      {/* Center Opening Notch */}
                      <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-[#0e0f11] rounded-b-md mx-auto" />
                    </div>
                    {/* Laptop Bottom Lip */}
                    <div className="w-[104%] -ml-[2%] h-1 sm:h-1.5 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-b-xl shadow-[0_12px_30px_rgba(0,0,0,0.65)]" />
                  </div>

                  {/* Under-Laptop Soft Ambient Floor Shadow */}
                  <div className="mx-auto w-[92%] h-4 sm:h-6 bg-black/60 blur-xl -mt-1 rounded-full" />
                </div>
              </motion.div>

              {/* Right Column: How to Enroll Title + Vertical Timeline */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                variants={sectionReveal}
                className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2"
              >
                <div className="mb-7 sm:mb-9 text-left">
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-tight text-white leading-[1.14] mb-2.5 sm:mb-3 font-bricolage">
                    How to Enroll
                  </h2>
                  <p className="text-emerald-100/80 font-normal text-sm sm:text-base lg:text-[17px] leading-relaxed">
                    Simple step-by-step pathway from registration to your first live lesson
                  </p>
                </div>

                <HowToEnroll />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. COURSES & PRICING SECTION — Minimalist 3-Card Grid */}
        {/* ========================================================================= */}
        <section
          id="courses"
          className="py-16 sm:py-20 lg:py-24 bg-white text-stone-900 scroll-mt-16 relative overflow-hidden border-b border-stone-200/60 select-none"
        >
          <div className="relative mx-auto w-full max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header matching user voice instructions & Reference */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={sectionReveal}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.16] mb-3">
                Our Courses
              </h2>
              <p className="text-stone-500 font-normal text-sm sm:text-base lg:text-[18px] max-w-2xl mx-auto leading-relaxed">
                Choose the right course for your Islamic education journey
              </p>
            </motion.div>

            {/* 3 Pricing & Course Cards Grid matching Reference Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={cardStagger}
              className="grid md:grid-cols-3 gap-4 lg:gap-6 items-stretch"
            >
              {/* CARD 1: Beginner Plan (Noorani Qaida) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-black text-stone-950 tracking-tight mb-2.5">
                    Noorani Qaida
                  </h3>
                  <p className="text-stone-500 text-sm sm:text-[14px] lg:text-[15px] leading-relaxed mb-6">
                    For beginners and children learning Quranic Arabic letters, correct pronunciation, and basic reading rules.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-4xl sm:text-[44px] lg:text-[48px] font-black tracking-tight text-stone-950">
                      $49
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/about#waitlist"
                    className="brand-button brand-button-primary mb-6 w-full py-3.5 lg:py-4 text-xs lg:text-sm tracking-wider uppercase"
                  >
                    Select Plan
                  </Link>

                  <div className="text-xs lg:text-[12px] font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm lg:text-[14px] text-stone-600 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Letter pronunciation &amp; Makharij</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Session recordings &amp; notes</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* CARD 2: Intermediate Plan (Tajweed Mastery) — Matching Card Style */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-black text-stone-950 tracking-tight mb-2.5">
                    Tajweed Mastery
                  </h3>
                  <p className="text-stone-500 text-sm sm:text-[14px] lg:text-[15px] leading-relaxed mb-6">
                    Master the science of Tajweed, rules of elongation, stops, and beautiful melodic recitation with Sanad scholars.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-4xl sm:text-[44px] lg:text-[48px] font-black tracking-tight text-stone-950">
                      $59
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/about#waitlist"
                    className="brand-button brand-button-primary mb-6 w-full py-3.5 lg:py-4 text-xs lg:text-sm tracking-wider uppercase"
                  >
                    Select Plan
                  </Link>

                  <div className="text-xs lg:text-[12px] font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm lg:text-[14px] text-stone-600 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Comprehensive Tajweed theoretical rules</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Melodic recitation &amp; Waqf guidance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Monthly progress evaluation</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* CARD 3: Intensive Memorization (Hifz) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-black text-stone-950 tracking-tight mb-2.5">
                    Hifz Program
                  </h3>
                  <p className="text-stone-500 text-sm sm:text-[14px] lg:text-[15px] leading-relaxed mb-6">
                    Structured Quran memorization with dedicated daily revision, retention strategies, and individual Sanad pathway.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-4xl sm:text-[44px] lg:text-[48px] font-black tracking-tight text-stone-950">
                      $79
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/about#waitlist"
                    className="brand-button brand-button-primary mb-6 w-full py-3.5 lg:py-4 text-xs lg:text-sm tracking-wider uppercase"
                  >
                    Select Plan
                  </Link>

                  <div className="text-xs lg:text-[12px] font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm lg:text-[14px] text-stone-600 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Dedicated Hifz coach</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Structured memorization schedule</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-stone-900 shrink-0 stroke-[2.5]" />
                      <span>Revision tracking &amp; lecturer messaging</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. TESTIMONIALS SECTION (Hidden until launch) */}
        {/* ========================================================================= */}
        {/*
        <section id="testimonials" className="py-14 sm:py-18 lg:py-20 bg-transparent scroll-mt-16 text-stone-900 border-b border-stone-200/60 select-none">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={sectionReveal}
              className="mx-auto mb-9 max-w-2xl text-center sm:mb-11"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 leading-[1.15] mb-3">
                What Our Community Says
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-stone-500 sm:text-base">
                From families and students learning with Ilmbit around the world.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm">
                <span className="tracking-[0.12em] text-[#a66b13]" aria-label="Five out of five stars">★★★★★</span>
                <span className="font-bold text-stone-800">4.8</span>
                <span className="text-stone-400">from 500+ family reviews</span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={sectionReveal}
              ref={testimonialRef}
              className="relative mx-auto max-w-3xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.985 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-[28px] border border-stone-200/90 bg-white/95 backdrop-blur-sm text-stone-950 shadow-[0_20px_50px_rgba(9,95,70,0.06)] sm:rounded-[32px] p-6 sm:p-9 lg:p-10"
                  aria-live="polite"
                >
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Quote className="h-9 w-9 fill-[#095f46]/10 text-[#095f46]" aria-hidden="true" />
                        <span className="inline-flex items-center rounded-full bg-[#095f46]/10 px-3 py-1 text-xs font-bold text-[#095f46]">
                          {activeTestimonial.course}
                        </span>
                      </div>
                      <p className="text-xl font-semibold leading-[1.4] tracking-tight text-stone-950 sm:text-2xl lg:text-[26px]">
                        &ldquo;{activeTestimonial.quote}&rdquo;
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-base font-black text-stone-950 sm:text-lg">{activeTestimonial.name}</p>
                        <p className="mt-0.5 text-xs font-medium text-stone-500 sm:text-sm">
                          {activeTestimonial.role} · {activeTestimonial.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStory(activeTestimonial)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#095f46] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#074c38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#095f46] focus-visible:ring-offset-2 self-start sm:self-auto cursor-pointer"
                      >
                        Read full story
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex items-center justify-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={() => changeTestimonial('previous')}
                  aria-label="Previous testimonial"
                  className="brand-icon-button h-10 w-10 flex-none border border-stone-200 bg-white text-stone-700 shadow-sm hover:border-[#095f46] hover:bg-[#095f46] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#095f46] focus-visible:ring-offset-2 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5" aria-label={`Testimonial ${testimonialIndex + 1} of ${diasporaTestimonials.length}`}>
                  {diasporaTestimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.name}
                      type="button"
                      onClick={() => setTestimonialIndex(index)}
                      aria-label={`Show ${testimonial.name}'s testimonial`}
                      aria-current={index === testimonialIndex ? 'true' : undefined}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === testimonialIndex ? 'w-8 bg-[#095f46]' : 'w-2.5 bg-stone-300 hover:bg-stone-400'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => changeTestimonial('next')}
                  aria-label="Next testimonial"
                  className="brand-icon-button h-10 w-10 flex-none border border-stone-200 bg-white text-stone-700 shadow-sm hover:border-[#095f46] hover:bg-[#095f46] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#095f46] focus-visible:ring-offset-2 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {selectedStory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="testimonial-dialog-title"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-100"
                >
                  <button
                    onClick={() => setSelectedStory(null)}
                    aria-label="Close story"
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-6 border-b border-stone-200 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#095f46]">Community story</p>
                    <h3 id="testimonial-dialog-title" className="mt-3 text-xl font-bold tracking-tight text-stone-950">{selectedStory.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{selectedStory.role} · {selectedStory.location}</p>
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
        */}
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CALL TO ACTION / WAITLIST LUXURY SANCTUARY CARD */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#f8faf8] py-12 sm:py-16 lg:py-20 text-stone-900 select-none border-t border-stone-200/60">
        <div className="relative z-10 mx-auto w-full max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={sectionReveal}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-br from-[#052b21] via-[#083F33] to-[#04241B] text-white p-6 sm:p-9 lg:p-12 xl:p-14 border border-[#EAD08A]/35 shadow-[0_20px_50px_rgba(6,53,41,0.22)]"
          >
            {/* Atmospheric Background Glows */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#EAD08A]/18 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/12 blur-3xl pointer-events-none" />

            {/* Background Texture Overlay */}
            <Image
              src="/images/home-cta-quran.jpg"
              alt=""
              fill
              aria-hidden="true"
              className="object-cover object-[center_52%] opacity-[0.08] mix-blend-overlay pointer-events-none"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />

            {/* Elegant Brand Watermark */}
            <Image
              src="/images/ilmbit-mark-white.png"
              alt=""
              width={420}
              height={420}
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -bottom-12 w-64 select-none object-contain opacity-[0.07] sm:w-80 lg:right-4 lg:bottom-0 lg:w-[420px]"
            />

            <div className="relative z-10 max-w-3xl">
              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] xl:text-[44px] font-bold tracking-tight text-white leading-[1.2] mb-3.5 sm:mb-4 font-bricolage">
                Begin Your Journey{' '}
                <span className="block sm:inline text-[#EAD08A] font-bricolage font-bold">
                  with Certified Islamic Scholars
                </span>
              </h2>

              <p className="max-w-2xl text-sm sm:text-base lg:text-[17px] leading-relaxed text-emerald-100/90 font-normal mb-6 sm:mb-8">
                Tell us what you want to learn. We will pair you with a patient, qualified scholar and prepare a schedule that fits your daily routine seamlessly.
              </p>

              {/* Trust Perks Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-7 sm:mb-9 text-xs sm:text-sm text-emerald-100/85">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-[#EAD08A]/20 text-[#EAD08A] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Free 30-Min Trial Session</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-[#EAD08A]/20 text-[#EAD08A] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Verified Lecturers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-[#EAD08A]/20 text-[#EAD08A] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Flexible Global Timezones</span>
                </div>
              </div>

              {/* CTA Action Area */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => setIsWaitlistOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#EAD08A] px-7 sm:px-8 py-3.5 sm:py-4 text-stone-950 font-bold text-sm sm:text-base hover:bg-[#F2DEAA] transition-all duration-300 shadow-[0_10px_25px_rgba(234,208,138,0.25)] hover:shadow-[0_14px_30px_rgba(234,208,138,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                >
                  <span>Join the Waitlist</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <span className="text-xs sm:text-sm text-emerald-200/70 font-normal">
                  Takes 2 minutes · No payment required today
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. WAITLIST MODAL POPUP COMPONENT */}
      {/* ========================================================================= */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}
