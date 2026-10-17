'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Check,
  ArrowRight,
  Clock,
  ShieldCheck,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import WaitlistModal from '@/components/waitlist-modal';
import faqStyles from './pricing/pricing.module.css';
import HowToEnroll from '@/components/how-to-enroll';

const audienceTracks = [
  {
    title: 'Children & Young Starters',
    image: '/images/pricing-noorani-qaida.jpg',
    imageAlt: 'Open Noorani Qaida book showing colorful Arabic letters for children',
    desc: 'Gentle, interactive foundational lessons tailored for young attention spans, cultivating genuine love and fluency for Allah’s words.',
    highlights: [
      'Noorani Qaida & Arabic letter phonetics (Makharij)',
      'Patient, child-friendly verified teachers',
      'Gentle memorization of daily Duas and short Surahs',
      'Regular feedback and progress updates for parents',
    ],
  },
  {
    title: 'Teens & Aspiring Huffaz',
    image: '/images/about-personal-attention-online.jpg',
    imageAlt: 'Teen student wearing headphones reciting Quran 1:1 on laptop with scholar',
    desc: 'Structured Quran memorization, rigorous Tajweed rules, and character-building mentorship for growing minds.',
    highlights: [
      'Detailed rules of Noon Sakinah, Meem & Madd',
      'Personalized daily Hifz target & revision log',
      'Direct guidance from certified Sanad holders',
      'Flexible scheduling around school exams',
    ],
  },
  {
    title: 'Adult Learners & Reverts',
    image: '/images/why-ilm-quran-hands.jpg',
    imageAlt: 'Adult student reading the Holy Quran with wooden pointer in traditional talaqqi',
    desc: 'Private, judgment-free 1:1 lessons whether starting from foundational Arabic letters or perfecting your recitation rhythm and understanding.',
    highlights: [
      'Dedicated male & female scholars for brothers and sisters',
      'Supportive, patient pace for new Muslims & adult starters',
      'Practical Tajweed application in daily Salah',
      'Evening & weekend slots across global timezones',
    ],
  },
];

const faqs = [
  {
    question: 'Can sisters and young girls learn with dedicated female scholars?',
    answer:
      'Yes. Sisters and young girls can request a qualified female scholar (Aalimah) during registration for complete comfort, privacy, and focused 1:1 mentorship.',
  },
  {
    question: 'How do global timezones and lesson scheduling work?',
    answer:
      'Our scholars teach students in Sri Lanka and Sri Lankan families abroad, including the UK, Europe, North America, the Gulf, and Australia. During registration, you choose your available days and preferred local time slots, and we match you with a scholar whose schedule fits.',
  },
  {
    question: 'What is the rescheduling and cancellation policy?',
    answer:
      'Sessions can be rescheduled for free up to 12 hours before the start time. Subscriptions can be cancelled anytime, with no long-term contracts.',
  },
  {
    question: 'Is the 30-minute trial session completely free?',
    answer:
      'Yes. The 30-minute trial is free, with no payment required. It is a chance to meet your scholar, assess your current level, explore the live classroom, and decide whether Ilmbit is right for you.',
  },
  {
    question: 'What equipment or devices do I need to attend live classes?',
    answer:
      'A stable internet connection and a laptop, desktop, tablet, or smartphone with a working microphone and camera. Lessons run in our built-in live classroom, so there is no extra software to install.',
  },
  {
    question: 'Can I change my lecturer or customize the curriculum later?',
    answer:
      'Yes. You can request a lecturer switch at any time and will receive a trial session with the new lecturer before confirming. Your scholar can also adjust the pace and focus of your lessons as you progress.',
  },
];

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

const heroBackgroundImages = [
  {
    src: '/home images/hero-student-yasin.jpg',
    alt: 'Young student reading Surah Ya-Sin from open Holy Quran',
    objectPosition: 'object-[65%_center] sm:object-center',
  },
  {
    src: '/home images/hero-quran-rehal.jpg',
    alt: 'Holy Quran on carved wooden rehal stand upon green carpet',
    objectPosition: 'object-[60%_center] sm:object-center',
  },
  {
    src: '/home images/hero-mosque-prayer.jpg',
    alt: 'Congregation seated in prayer inside historic mosque under chandelier',
    objectPosition: 'object-[30%_center] sm:object-center',
  },
  {
    src: '/home images/test56.png',
    alt: 'Student reciting Holy Quran in mosque',
    objectPosition: 'object-[75%_center] sm:object-center',
  },
];

export default function HomePage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroBackgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — Rotating Cinematic Images with Fade-In Effect */}
      {/* ========================================================================= */}
      <section className="home-hero-section relative flex flex-col justify-between overflow-hidden bg-stone-950 text-white select-none">
        {/* Background Rotating Images with Cinematic Fade-In / Crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950">
          {heroBackgroundImages.map((img, idx) => (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeHeroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={idx !== activeHeroIndex}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover ${img.objectPosition}`}
              />
            </div>
          ))}

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

        {/* Subtle Slide Indicators */}
        <div
          className="relative z-20 mx-auto w-full max-w-7xl xl:max-w-[1440px] px-5 sm:px-7 lg:px-8 xl:px-9 pb-3 sm:pb-4 flex items-center justify-start gap-2"
          aria-label="Hero background slideshow indicators"
        >
          {heroBackgroundImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAD08A] cursor-pointer ${
                i === activeHeroIndex
                  ? 'w-8 bg-[#EAD08A] shadow-[0_0_8px_rgba(234,208,138,0.5)]'
                  : 'w-2 bg-white/40 hover:bg-white/75'
              }`}
              aria-label={`Switch to background image ${i + 1}`}
              aria-current={i === activeHeroIndex ? 'true' : undefined}
            />
          ))}
        </div>

        {/* ========================================================================= */}
        {/* Bottom Green Fat Line Marquee — Infinite Seamless Scroll to Waitlist */}
        {/* ========================================================================= */}
        <Link
          href="/about#waitlist"
          className="hero-bottom-marquee group relative z-30 w-full !rounded-none rounded-none bg-[#095F46] hover:bg-[#074D38] border-t border-emerald-400/25 text-white py-3 sm:py-3.5 lg:py-4 overflow-hidden flex items-center transition-colors duration-200 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] cursor-pointer shrink-0"
          aria-label="Join the waitlist and get 20% off"
        >
          <div className="flex w-full overflow-hidden select-none">
            <div className="animate-hero-marquee flex items-center whitespace-nowrap shrink-0">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6 shrink-0">
                  <span className="text-xs sm:text-sm lg:text-[14.5px] font-bold tracking-wider uppercase text-white drop-shadow-sm flex items-center gap-2">
                    <span>Join The Waitlist &amp; Get 20% Off</span>
                    <span className="text-emerald-200 group-hover:translate-x-1 transition-transform text-xs sm:text-sm">→</span>
                  </span>
                  <span className="text-[#EAD08A] text-xs sm:text-sm" aria-hidden="true">✦</span>
                  <span className="text-xs sm:text-sm lg:text-[14px] font-medium tracking-wide uppercase text-emerald-100/90">
                    Limited Early Access Offer
                  </span>
                  <span className="text-[#EAD08A] text-xs sm:text-sm" aria-hidden="true">✦</span>
                </div>
              ))}
            </div>
            <div className="animate-hero-marquee flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6 shrink-0">
                  <span className="text-xs sm:text-sm lg:text-[14.5px] font-bold tracking-wider uppercase text-white drop-shadow-sm flex items-center gap-2">
                    <span>Join The Waitlist &amp; Get 20% Off</span>
                    <span className="text-emerald-200 group-hover:translate-x-1 transition-transform text-xs sm:text-sm">→</span>
                  </span>
                  <span className="text-[#EAD08A] text-xs sm:text-sm" aria-hidden="true">✦</span>
                  <span className="text-xs sm:text-sm lg:text-[14px] font-medium tracking-wide uppercase text-emerald-100/90">
                    Limited Early Access Offer
                  </span>
                  <span className="text-[#EAD08A] text-xs sm:text-sm" aria-hidden="true">✦</span>
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
          className="relative z-20 overflow-hidden bg-white border-b border-stone-200/60 py-20 sm:py-24 lg:py-28 select-none"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
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

                  <p className="mt-6 sm:mt-7 text-base sm:text-lg lg:text-[18px] font-normal leading-relaxed text-stone-600">
                    Finding patient, verified Islamic teachers shouldn&apos;t be difficult. Ilmbit connects students in Sri Lanka and Sri Lankan families living abroad directly with qualified scholars for structured 1:1 online lessons suited to your schedule and personal pace.
                  </p>

                  <div className="mt-8 sm:mt-9 space-y-5 sm:space-y-6">
                    {[
                      { title: 'Personalized 1:1 Learning Paths', desc: 'From foundational Noorani Qaida to advanced Sanad Tajweed' },
                      { title: 'Verified Scholars & Certified Maulavis', desc: 'Carefully vetted teachers with authentic Sanad and clear guidance' },
                      { title: 'For Students in Sri Lanka & Abroad', desc: 'Flexible 1:1 session scheduling across local and overseas timezones' },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#095F46]/10 text-[#095F46] mt-0.5">
                          <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-[17px] lg:text-[18px] font-bold tracking-tight text-stone-900">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-sm sm:text-[15px] lg:text-[16px] text-stone-500 font-normal leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-9 sm:mt-10 flex flex-wrap items-center gap-4">
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
                <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] xl:h-[640px]">
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
          className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-[#063529] via-[#083f33] to-[#04281e] text-white border-b border-emerald-950/60 scroll-mt-16 select-none relative overflow-hidden"
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
                <div className="relative w-full max-w-[620px] lg:max-w-none">
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
                <div className="mb-8 sm:mb-10 text-left">
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-tight text-white leading-[1.14] mb-3 font-bricolage">
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
        {/* AUDIENCE PATHWAYS SECTION — Tailored Learning for Children, Teens & Adults */}
        {/* ========================================================================= */}
        <section
          id="pathways"
          className="py-16 sm:py-20 lg:py-24 bg-[#fbfcfb] text-stone-900 scroll-mt-16 relative overflow-hidden border-b border-stone-200/60 select-none"
        >
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={sectionReveal}
              className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 lg:mb-14"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.18] mb-3 sm:mb-4">
                Islamic Education Designed for{' '}
                <span className="text-[#095F46]">Every Stage of Life</span>
              </h2>
              <p className="text-stone-600 text-sm sm:text-base lg:text-[17px] leading-relaxed">
                Whether introducing your young child to Arabic phonetics or refining your own Tajweed as an adult, our verified scholars customize each lesson to your family’s individual pace.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={cardStagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            >
              {audienceTracks.map((track, idx) => (
                <motion.div
                  key={idx}
                  variants={cardItem}
                  className="relative rounded-3xl bg-white border border-stone-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col hover:shadow-xl hover:border-[#095F46]/40 transition-all duration-300 group overflow-hidden"
                >
                  {/* Top Image Banner with Hover Zoom */}
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-stone-900">
                    <Image
                      src={track.image}
                      alt={track.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/15 to-transparent" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 lg:p-8 flex flex-col flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight mb-2.5 font-bricolage">
                      {track.title}
                    </h3>
                    <p className="text-stone-500 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                      {track.desc}
                    </p>

                    <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                      Key Learning Focus
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-stone-600 font-medium">
                      {track.highlights.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#095F46] shrink-0 mt-0.5 stroke-[2.5]" />
                          <span className="leading-snug">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. COURSES & PRICING SECTION — Minimalist 3-Card Grid (Green Sanctuary) */}
        {/* ========================================================================= */}
        <section
          id="courses"
          className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#04241B] via-[#07382B] to-[#031d16] text-white scroll-mt-16 relative overflow-hidden border-b border-[#04241B] select-none"
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-[#EAD08A]/10 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full bg-emerald-400/10 blur-[140px] pointer-events-none" />

          <div className="relative z-10 mx-auto w-full max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={sectionReveal}
              className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[48px] xl:text-[54px] font-bold tracking-tight text-white font-bricolage leading-[1.16] mb-3">
                Our Courses
              </h2>
              <p className="text-emerald-100/80 font-normal text-sm sm:text-base lg:text-[18px] max-w-2xl mx-auto leading-relaxed">
                Choose the right course for your Islamic education journey
              </p>
            </motion.div>

            {/* 3 Pricing & Course Cards Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={cardStagger}
              className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            >
              {/* CARD 1: Beginner Plan (Noorani Qaida) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white border border-stone-200/90 text-stone-900 p-6 sm:p-7 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:shadow-[0_24px_50px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div>
                  <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold text-stone-950 tracking-tight mb-2.5 font-bricolage">
                    Noorani Qaida
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-[14px] lg:text-[15px] leading-relaxed mb-6 font-normal">
                    For beginners and children learning Quranic Arabic letters, correct pronunciation, and basic reading rules.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-4xl sm:text-[44px] lg:text-[48px] font-black tracking-tight text-stone-950 font-bricolage">
                      $49
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/about#waitlist"
                    className="brand-button brand-button-primary w-full py-3.5 lg:py-4 text-xs lg:text-sm tracking-wider uppercase !font-bold mb-6 cursor-pointer shadow-md shadow-[#095F46]/20 hover:shadow-lg transition-all"
                  >
                    Select Plan
                  </Link>

                  <div className="text-xs lg:text-[12px] font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm lg:text-[14px] text-stone-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Letter pronunciation &amp; Makharij</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Session recordings &amp; notes</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* CARD 2: Intermediate Plan (Tajweed Mastery) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white border border-stone-200/90 text-stone-900 p-6 sm:p-7 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:shadow-[0_24px_50px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 transition-all duration-300 group relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold text-stone-950 tracking-tight font-bricolage">
                      Tajweed Mastery
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-[#095F46]/10 text-[#095F46] border border-[#095F46]/20 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 shrink-0">
                      Popular
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm sm:text-[14px] lg:text-[15px] leading-relaxed mb-6 font-normal">
                    Master the science of Tajweed, rules of elongation, stops, and beautiful melodic recitation with Sanad scholars.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-4xl sm:text-[44px] lg:text-[48px] font-black tracking-tight text-stone-950 font-bricolage">
                      $59
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/about#waitlist"
                    className="brand-button brand-button-primary w-full py-3.5 lg:py-4 text-xs lg:text-sm tracking-wider uppercase !font-bold mb-6 cursor-pointer shadow-md shadow-[#095F46]/25 hover:shadow-lg transition-all"
                  >
                    Select Plan
                  </Link>

                  <div className="text-xs lg:text-[12px] font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm lg:text-[14px] text-stone-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Comprehensive Tajweed theoretical rules</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Melodic recitation &amp; Waqf guidance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Monthly progress evaluation</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* CARD 3: Intensive Memorization (Hifz) */}
              <motion.div
                variants={cardItem}
                className="rounded-3xl bg-white border border-stone-200/90 text-stone-900 p-6 sm:p-7 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:shadow-[0_24px_50px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div>
                  <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold text-stone-950 tracking-tight mb-2.5 font-bricolage">
                    Hifz Program
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-[14px] lg:text-[15px] leading-relaxed mb-6 font-normal">
                    Structured Quran memorization with dedicated daily revision, retention strategies, and individual Sanad pathway.
                  </p>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-6 pb-5 border-b border-stone-100">
                    <span className="text-4xl sm:text-[44px] lg:text-[48px] font-black tracking-tight text-stone-950 font-bricolage">
                      $79
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-stone-400">
                      / month
                    </span>
                  </div>

                  <Link
                    href="/about#waitlist"
                    className="brand-button brand-button-primary w-full py-3.5 lg:py-4 text-xs lg:text-sm tracking-wider uppercase !font-bold mb-6 cursor-pointer shadow-md shadow-[#095F46]/20 hover:shadow-lg transition-all"
                  >
                    Select Plan
                  </Link>

                  <div className="text-xs lg:text-[12px] font-bold uppercase tracking-wider text-stone-400 mb-3.5">
                    What&apos;s Included
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm lg:text-[14px] text-stone-700 font-medium">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>8 sessions per month (2/week)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>45-minute 1:1 live sessions</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Dedicated Hifz coach</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Structured memorization schedule</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#095F46] shrink-0 stroke-[2.5]" />
                      <span>Revision tracking &amp; lecturer messaging</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAQ ACCORDION SECTION */}
        {/* ========================================================================= */}
        <section
          id="faq"
          className="pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 lg:pb-14 bg-[#fbfcfb] text-stone-900 scroll-mt-16 relative overflow-hidden select-none"
        >
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              variants={sectionReveal}
              className="text-left mb-10"
            >
              <h2 id="home-faq-heading" className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 leading-[1.15]">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="space-y-3.5" aria-labelledby="home-faq-heading">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <motion.div
                    key={faq.question}
                    initial="hidden"
                    whileInView="visible"
                    viewport={revealViewport}
                    variants={sectionReveal}
                    className={`${faqStyles.faqItem} ${isOpen ? faqStyles.open : ''}`}
                  >
                    <button
                      type="button"
                      id={`home-faq-question-${idx}`}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-controls={`home-faq-answer-${idx}`}
                      className={faqStyles.question}
                    >
                      <span className={faqStyles.questionText}>{faq.question}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`${faqStyles.chevron} ${isOpen ? faqStyles.expandedChevron : ''}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`home-faq-answer-${idx}`}
                          role="region"
                          aria-labelledby={`home-faq-question-${idx}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className={faqStyles.answerPanel}
                        >
                          <p className={faqStyles.answer}>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CALL TO ACTION / WAITLIST LUXURY SANCTUARY CARD */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#fbfcfb] pt-0 pb-16 sm:pb-20 lg:pb-24 text-stone-900 select-none">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={sectionReveal}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-br from-[#031d16] via-[#052b21] to-[#021711] text-white p-8 sm:p-12 lg:p-16 xl:p-20 border border-[#EAD08A]/35 shadow-[0_24px_60px_rgba(6,53,41,0.28)]"
          >
            {/* Atmospheric Background Glows */}
            <div className="absolute -top-32 -right-32 h-[450px] w-[450px] rounded-full bg-[#EAD08A]/16 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full bg-emerald-400/12 blur-3xl pointer-events-none" />

            {/* Background Image Blending with Dark Emerald Sanctuaries */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <Image
                src="/images/home-cta-quran.jpg"
                alt=""
                fill
                aria-hidden="true"
                className="object-cover object-[center_50%] opacity-25 mix-blend-luminosity"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#031d16] via-[#052b21]/90 to-[#031d16]/75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021711] via-transparent to-[#031d16]/60" />
            </div>

            {/* Elegant Brand Watermark */}
            <Image
              src="/images/ilmbit-mark-white.png"
              alt=""
              width={460}
              height={460}
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -bottom-12 w-64 select-none object-contain opacity-[0.06] sm:w-80 lg:right-4 lg:bottom-0 lg:w-[460px]"
            />

            <div className="relative z-10 max-w-4xl">
              {/* Headline with Calibrated Tight Line-Height */}
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] mb-4 sm:mb-5 font-bricolage">
                Begin Your Journey{' '}
                <span className="text-[#EAD08A] font-bricolage font-bold">
                  with<br className="hidden sm:inline" /> Certified Islamic Scholars
                </span>
              </h2>

              <p className="max-w-2xl text-base sm:text-lg lg:text-[18px] leading-relaxed text-emerald-100/90 font-normal mb-8 sm:mb-10">
                Tell us what you want to learn. We will pair you with a patient, qualified scholar and prepare a schedule that fits your daily routine seamlessly.
              </p>

              {/* Trust Perks Row — plain white icons, no boxes */}
              <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-x-10 sm:gap-y-4 mb-9 sm:mb-11">
                {[
                  { icon: Clock, label: 'Free 30-Min Trial' },
                  { icon: ShieldCheck, label: 'Verified Lecturers' },
                  { icon: Globe, label: 'Global Timezones' },
                ].map(({ icon: PerkIcon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <PerkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[1.75] shrink-0" aria-hidden="true" />
                    <span className="text-sm sm:text-base font-medium text-white">{label}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Action Area */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => setIsWaitlistOpen(true)}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EAD08A] px-8 sm:px-10 py-4 sm:py-[18px] text-stone-950 font-bold text-base sm:text-lg hover:bg-[#F2DEAA] transition-all duration-300 shadow-[0_10px_25px_rgba(234,208,138,0.25)] hover:shadow-[0_14px_30px_rgba(234,208,138,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                >
                  <span>Join the Waitlist</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <span className="text-xs sm:text-sm text-emerald-200/80 font-normal">
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
