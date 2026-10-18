'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  AudioLines,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './about-refinement.module.css';
import PublicPageHero, { publicPageFadeUp as fadeUp } from '@/components/public-page-hero';
import CountryPhoneInput from '@/components/country-phone-input';
import {
  formatInternationalPhone,
  getCountryCallingCode,
  type CountryCallingCode,
} from '@/lib/country-calling-codes';

// ---------------------------------------------------------------------------
// Global World Globe Illustration (Embedded in Built Around You Card)
// ---------------------------------------------------------------------------
function EmbeddedGlobeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="globeAtmosphere" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#095F46" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#095F46" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#095F46" stopOpacity="0.0" />
        </radialGradient>
        <linearGradient id="globeStroke" x1="0" y1="0" x2="360" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#095F46" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#EAD08A" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#095F46" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="orbitGrad" x1="40" y1="80" x2="320" y2="280">
          <stop stopColor="#EAD08A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#095F46" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Outer ambient glow */}
      <circle cx="180" cy="180" r="150" fill="url(#globeAtmosphere)" />

      {/* Main Globe Sphere Boundary */}
      <circle
        cx="180"
        cy="180"
        r="140"
        fill="#f4f8f5"
        fillOpacity="0.85"
        stroke="url(#globeStroke)"
        strokeWidth="1.75"
      />

      {/* Parallels (Latitude Lines) */}
      <g stroke="#095F46" strokeOpacity="0.18" strokeWidth="1.2" fill="none">
        <ellipse cx="180" cy="180" rx="140" ry="46" transform="rotate(-15 180 180)" strokeWidth="1.5" strokeOpacity="0.28" />
        <ellipse cx="180" cy="130" rx="128" ry="36" transform="rotate(-15 180 130)" />
        <ellipse cx="180" cy="85" rx="98" ry="24" transform="rotate(-15 180 85)" strokeDasharray="3 3" />
        <ellipse cx="180" cy="230" rx="128" ry="36" transform="rotate(-15 180 230)" />
        <ellipse cx="180" cy="275" rx="98" ry="24" transform="rotate(-15 180 275)" strokeDasharray="3 3" />
      </g>

      {/* Meridians (Longitude Lines) */}
      <g stroke="#095F46" strokeOpacity="0.18" strokeWidth="1.2" fill="none" transform="rotate(-15 180 180)">
        <ellipse cx="180" cy="180" rx="42" ry="140" strokeWidth="1.5" strokeOpacity="0.25" />
        <ellipse cx="180" cy="180" rx="90" ry="140" />
        <ellipse cx="180" cy="180" rx="125" ry="140" strokeDasharray="4 3" />
        <line x1="180" y1="40" x2="180" y2="320" stroke="#095F46" strokeOpacity="0.28" strokeWidth="1.5" />
      </g>

      {/* Stylized Continents / Landmass Silhouettes */}
      <g fill="#095F46" fillOpacity="0.14" transform="rotate(-15 180 180)">
        <path d="M165 95 C175 92 195 90 205 98 C215 105 218 120 210 130 C202 140 185 145 172 140 C162 135 155 125 158 112 Z" />
        <path d="M168 142 C182 142 196 150 198 165 C200 180 190 205 180 215 C172 222 165 210 162 195 C158 178 155 160 168 142 Z" />
        <path d="M205 118 C220 115 240 120 248 135 C252 145 245 158 232 160 C220 162 212 150 208 138 Z" />
        <path d="M236 150 C242 148 250 152 254 160 C256 168 250 178 244 184 C240 188 235 182 234 172 Z" />
        <circle cx="247" cy="190" r="3.5" fill="#EAD08A" fillOpacity="0.95" />
        <path d="M255 125 C270 122 285 130 292 145 C295 155 285 168 275 168 C265 168 255 155 252 140 Z" />
        <path d="M260 210 C272 208 288 215 292 228 C294 238 285 248 272 248 C260 248 254 235 256 222 Z" />
        <path d="M72 110 C82 105 95 112 98 125 C100 138 92 155 82 160 C74 150 68 130 72 110 Z" />
        <path d="M88 175 C98 175 110 188 112 205 C114 220 102 238 92 245 C84 235 80 210 84 190 Z" />
      </g>

      {/* Network Nodes (Global Diaspora Student Hubs) */}
      <circle cx="178" cy="112" r="3" fill="#095F46" />
      <circle cx="178" cy="112" r="7" stroke="#095F46" strokeOpacity="0.4" strokeWidth="1" />

      <circle cx="86" cy="132" r="3" fill="#095F46" />
      <circle cx="86" cy="132" r="7" stroke="#095F46" strokeOpacity="0.35" strokeWidth="1" />

      <circle cx="218" cy="148" r="3" fill="#095F46" />
      <circle cx="218" cy="148" r="6" stroke="#095F46" strokeOpacity="0.4" strokeWidth="1" />

      <circle cx="238" cy="182" r="4" fill="#095F46" />
      <circle cx="238" cy="182" r="8" stroke="#EAD08A" strokeOpacity="0.8" strokeWidth="1.5" />
      <circle cx="238" cy="182" r="14" stroke="#EAD08A" strokeOpacity="0.35" strokeWidth="1" />

      <circle cx="275" cy="225" r="3" fill="#095F46" />
      <circle cx="275" cy="225" r="6.5" stroke="#095F46" strokeOpacity="0.35" strokeWidth="1" />

      {/* Connection Arcs */}
      <path d="M238 182 Q 210 140 178 112" stroke="#EAD08A" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.75" fill="none" />
      <path d="M238 182 Q 228 160 218 148" stroke="#EAD08A" strokeWidth="1.2" strokeDasharray="2.5 2.5" strokeOpacity="0.65" fill="none" />
      <path d="M178 112 Q 130 110 86 132" stroke="#095F46" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.45" fill="none" />
      <path d="M238 182 Q 260 200 275 225" stroke="#EAD08A" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.65" fill="none" />

      {/* Subtle Orbital Axis Ring */}
      <ellipse cx="180" cy="180" rx="165" ry="65" transform="rotate(-28 180 180)" stroke="url(#orbitGrad)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Data: The Three Foundational Pillars (Arkan al-Ilm)
// ---------------------------------------------------------------------------
const pillars = [
  {
    number: '01',
    title: 'Talaqqi with Sanad',
    arabic: 'التلقي بالسند',
    subtitle: 'Living Oral Transmission',
    image: '/images/about/pillar-arches.jpg',
    imageAlt: 'Islamic architectural arches reflecting sacred scholarship heritage',
    desc: 'Students recite to their scholar, who listens and corrects pronunciation, preserving the living tradition of Quran learning.',
  },
  {
    number: '02',
    title: 'Adab Before Ilm',
    arabic: 'الأدب قبل العلم',
    subtitle: 'Nurturing with Gentle Character',
    image: '/images/about/pillar-mosque.jpg',
    imageAlt: 'Tranquil mosque courtyard nurturing student adab and character',
    desc: 'Patient teaching gives students room to ask questions, make mistakes, and try again. Good manners come before knowledge.',
  },
  {
    number: '03',
    title: 'Amanah & Ihsan',
    arabic: 'الأمانة والإحسان',
    subtitle: 'Trust & Moral Responsibility',
    image: '/images/about/pillar-quran.jpg',
    imageAlt: 'Holy Quran text on wooden stand embodying amanah and ihsan',
    desc: 'Careful preparation, reliable scheduling, and clear communication honour our responsibility to each student and their family.',
  },
];

// ---------------------------------------------------------------------------
// Data: 4-Tier Scholar Accreditation Protocol
// ---------------------------------------------------------------------------
const vettingTiers = [
  {
    step: '01',
    icon: GraduationCap,
    title: 'Sanad & Degree Audit',
    subtitle: 'Classical Authorization',
    desc: 'Review of formal qualifications, Ijazah certificates, and the scholar’s chain of transmission.',
  },
  {
    step: '02',
    icon: AudioLines,
    title: 'Tajweed Oral Exam',
    subtitle: 'Rigorous Board Review',
    desc: 'Live recitation assessment covering Tajweed rules, articulation points (Makharij), and pronunciation.',
  },
  {
    step: '03',
    icon: MessagesSquare,
    title: 'Teaching Families Abroad',
    subtitle: 'Clear English & Student Connection',
    desc: 'Review of patient, clear communication in English, ensuring scholars connect warmly with children living in the UK, US, Europe, and Australia.',
  },
  {
    step: '04',
    icon: ShieldCheck,
    title: 'Safeguarding & Adab',
    subtitle: 'Positive Reinforcement',
    desc: 'Review of identity, safeguarding, and the scholar’s approach to patient, age-appropriate teaching.',
  },
];

// ---------------------------------------------------------------------------
// Data: 4 Milestones of Learning (Alternating Green & White Two-Tone Theme)
// ---------------------------------------------------------------------------
const pedagogyMilestones = [
  {
    step: '01',
    phase: 'Phase 01',
    title: 'Foundations & Qaida',
    subtitle: 'Letter Recognition & Articulation',
    desc: 'Master Arabic letters, articulation points (Makharij), and how letter sounds join through patient, guided oral repetition.',
    image: '/images/pricing-qaida-v2.jpg',
    imageAlt: 'Open Noorani Qaida primer for Arabic letter foundations',
    cardBg: 'bg-[#06261e] border-emerald-950/80 shadow-[0_24px_50px_rgba(4,38,30,0.35)]',
    badgeBg: 'bg-white/15 text-white border-white/20 backdrop-blur-md',
    titleColor: 'text-white',
    subtitleColor: 'text-emerald-200/80',
    descColor: 'text-emerald-100/80',
    offsetClass: 'lg:translate-y-0 lg:-rotate-[1deg]',
  },
  {
    step: '02',
    phase: 'Phase 02',
    title: 'Fluency & Tajweed',
    subtitle: 'Recitation & Tajweed Mastery',
    desc: 'Practise Madd, Ghunnah, and pause rules with immediate, gentle pronunciation feedback from your dedicated scholar.',
    image: '/images/about-standards-quran.jpg',
    imageAlt: 'Recitation of the Holy Quran on carved wooden rehal',
    cardBg: 'bg-white border-stone-200 shadow-[0_20px_45px_rgba(0,0,0,0.06)]',
    badgeBg: 'bg-stone-100 text-stone-900 border-stone-200',
    titleColor: 'text-stone-950',
    subtitleColor: 'text-stone-500',
    descColor: 'text-stone-600',
    offsetClass: 'lg:translate-y-7 xl:translate-y-9 lg:rotate-[1.25deg]',
  },
  {
    step: '03',
    phase: 'Phase 03',
    title: 'Preservation & Hifz',
    subtitle: 'Memorisation & Revision Cycles',
    desc: 'Build memorisation gradually, with structured revision cycles alongside new passages for lifelong retention.',
    image: '/images/about-pedagogy-hifz-wazir.jpg',
    imageAlt: 'Students reciting and memorising the Holy Quran in historic mosque halaqah',
    cardBg: 'bg-[#06261e] border-emerald-950/80 shadow-[0_24px_50px_rgba(4,38,30,0.35)]',
    badgeBg: 'bg-white/15 text-white border-white/20 backdrop-blur-md',
    titleColor: 'text-white',
    subtitleColor: 'text-emerald-200/80',
    descColor: 'text-emerald-100/80',
    offsetClass: 'lg:translate-y-14 xl:translate-y-18 lg:-rotate-[1.25deg]',
  },
  {
    step: '04',
    phase: 'Phase 04',
    title: 'Character & Sunnah',
    subtitle: 'Prophetic Manners & Daily Deen',
    desc: 'Bring Quranic learning into daily life through prophetic prayers, Islamic adab, good manners, and moral reflection.',
    image: '/images/about/pillar-character.jpg',
    imageAlt: 'Islamic adab, character, and prophetic manners',
    cardBg: 'bg-white border-stone-200 shadow-[0_20px_45px_rgba(0,0,0,0.06)]',
    badgeBg: 'bg-stone-100 text-stone-900 border-stone-200',
    titleColor: 'text-stone-950',
    subtitleColor: 'text-stone-500',
    descColor: 'text-stone-600',
    offsetClass: 'lg:translate-y-6 xl:translate-y-8 lg:rotate-[1deg]',
  },
];

// ---------------------------------------------------------------------------
// Data: The Parent Promise (Interactive 3D Flip Cards with Circular Image)
// ---------------------------------------------------------------------------
const parentPromises = [
  {
    titleLine1: 'Dedicated',
    titleLine2: 'Scholar',
    fullTitle: 'Dedicated Scholar',
    image: '/images/about/pillar-talaqqi.jpg',
    imageAlt: 'Dedicated scholar guiding a student through Quranic recitation',
    desc: 'The same familiar scholar each week who builds genuine rapport with your child, adapts to their learning pace, and nurtures their recitation with patient Adab.',
  },
  {
    titleLine1: 'Continuous',
    titleLine2: 'Visibility',
    fullTitle: 'Continuous Visibility',
    image: '/images/about-parent-continuous-visibility.jpg',
    imageAlt: 'Young student engaged in online Quran lesson on laptop with parent dashboard tracking',
    desc: 'Follow your child’s journey through replayable class recordings, monthly Tajweed milestones, and direct communication in your parent dashboard.',
  },
  {
    titleLine1: 'Adaptive',
    titleLine2: 'Scheduling',
    fullTitle: 'Adaptive Family Scheduling',
    image: '/images/about/pillar-adab.jpg',
    imageAlt: 'Flexible Quran lesson scheduling designed around family routines',
    desc: 'Plan lessons seamlessly around school, weekend routines, and diaspora time zones, with free 12-hour rescheduling whenever family plans change.',
  },
];

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleCardFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [waitlistPhoneCountry, setWaitlistPhoneCountry] = useState<CountryCallingCode>(() =>
    getCountryCallingCode('LK')
  );
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
      const formattedPhone = formatInternationalPhone(waitlistPhone, waitlistPhoneCountry);
      const waitlistEntry = {
        fullName: waitlistName,
        email: waitlistEmail,
        phone: formattedPhone,
        rawPhone: waitlistPhone,
        phoneCountry: waitlistPhoneCountry.name,
        phoneCountryCode: waitlistPhoneCountry.iso2,
        phoneDialCode: waitlistPhoneCountry.dialCode,
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
    <div className="relative overflow-hidden bg-[#fbfbf9] text-stone-900 select-none">
      {/* Ambient background glows */}
      <div className="absolute top-16 -right-24 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] -left-28 h-[32rem] w-[32rem] rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — Clean Headline Only, No Tags, No Paragraph, Subtle Arrow */}
      {/* ========================================================================= */}
      <PublicPageHero
        title="A Trusted Bridge Between"
        subtitle="Scholars & Students Worldwide"
        image="/images/about-hero-scholar-monochrome.jpg"
        imageAlt="Islamic scholar reading the Quran in a mosque courtyard"
        imageClassName="object-cover object-[55%_48%] opacity-90"
        className="min-h-[52vh] sm:min-h-[58vh] lg:min-h-[64vh] py-24 sm:py-28 lg:py-32 xl:py-36"
        overlay={<>
          <div className="absolute inset-0 bg-[#095F46]/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031e18]/85 via-[#095F46]/20 to-[#031e18]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,30,24,0.65)_100%)]" />
        </>}
      />

      {/* ========================================================================= */}
      {/* 2. OUR STORY — Why We Started Ilmbit (Who We Are & The Gap We Fill)      */}
      {/* ========================================================================= */}
      <section id="story" className={`relative z-10 py-20 sm:py-24 lg:py-32 xl:py-36 bg-white border-b border-stone-200/60 scroll-mt-20 ${styles.whiteSection} ${styles.patternBackground}`}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
            
            {/* Left: Narrative — Who We Are & Why We Started Ilmbit */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
                  Why We Started <span className="text-[#095F46]">Ilmbit</span>
                </h2>
              </div>

              <div className="space-y-4 text-stone-600 text-sm sm:text-base lg:text-[17px] xl:text-[17.5px] leading-relaxed font-normal">
                <p>
                  We are a group of Sri Lankan Muslim parents, educators, and community members living across the UK, Europe, Australia, and North America. Like thousands of diaspora families raising children abroad, our deepest hope is to pass down the sacred beauty of the Holy Quran, accurate Tajweed, and living Islamic adab to our next generation.
                </p>
                <p>
                  Between busy school routines, travel, and diaspora time zones, finding regular one-to-one time with qualified scholars can be challenging. We wanted a supportive way for children to learn directly from teachers who understand their language and culture, with patient encouragement in every lesson.
                </p>
                <p>
                  We founded Ilmbit to provide that bridge. By connecting families directly with vetted Maulavis and Aalimaat from esteemed Sri Lankan Islamic institutions, we bring authentic oral recitation with verified chains of transmission directly into your home. It gives children a calm space where they can ask questions, improve their recitation, and build a lasting love for the Quran.
                </p>
              </div>
            </motion.div>

            {/* Right: Authentic Photograph of Recitation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-[0_20px_50px_rgba(4,38,30,0.12)] aspect-[4/5] sm:aspect-[3/3.8] lg:aspect-[4/4.8]">
                <Image
                  src="/images/about/pillar-recitation.jpg"
                  alt="Hands carefully holding an open Quran for recitation"
                  fill
                  className="object-cover object-[center_35%]"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE PHILOSOPHY & BENTO GRID — Verified Scholars, Personal Attention, Global */}
      {/* ========================================================================= */}
      <section id="philosophy" className="relative z-10 py-20 sm:py-24 lg:py-32 xl:py-36 bg-gradient-to-br from-[#04241B] via-[#07382B] to-[#031d16] text-white border-b border-[#04241B] select-none scroll-mt-20 overflow-hidden">
        {/* Ambient lighting glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 lg:space-y-14">
          
          {/* Top Row: Left Title vs Right Concise Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left: Heading with Brand Gold Accent */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="lg:col-span-7"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] font-bricolage">
                Make Islamic Education<br />
                <span className="text-[#EAD08A]">Easier To Access</span>
              </h2>
            </motion.div>

            {/* Right: Minimal, clean explanatory text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="lg:col-span-5 text-emerald-100/85 text-sm sm:text-base lg:text-[17px] xl:text-[18px] leading-relaxed font-normal"
            >
              <p>
                Ilmbit bridges authentic traditional scholarship with modern 1:1 virtual classrooms and flexible scheduling designed specifically for Sri Lankan families living abroad.
              </p>
            </motion.div>
          </div>

          {/* Learning principles bento grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-2"
          >
            {/* Verified Scholars Big Card */}
            <article className="group relative min-h-[440px] sm:min-h-[490px] lg:min-h-[570px] xl:min-h-[610px] overflow-hidden rounded-3xl bg-stone-900 lg:col-span-7 lg:row-span-2 border border-white/10 shadow-lg">
              <Image
                src="/images/about-verified-scholar.jpg"
                alt="Quran teacher seated beside an open copy of the Holy Quran"
                fill
                className="object-cover object-[center_54%] transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021812]/95 via-[#021812]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10 lg:p-11 xl:p-12">
                <h3 className="max-w-md text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold tracking-[-0.035em] font-bricolage">
                  Verified Scholars
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-emerald-50/85 sm:text-base lg:text-[17px] xl:text-[18px]">
                  Sanad-certified educators selected for Islamic depth and teaching adab.
                </p>
              </div>
            </article>

            {/* Personal Attention Card */}
            <article className="group relative min-h-[295px] sm:min-h-[315px] lg:min-h-[273px] xl:min-h-[293px] overflow-hidden rounded-3xl bg-stone-900 lg:col-span-5 border border-white/10 shadow-lg">
              <Image
                src="/images/about-personal-attention-online.jpg"
                alt="Student receiving personal online Quran instruction"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021812]/90 via-[#021812]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-8 lg:p-8 xl:p-9">
                <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight font-bricolage">Personal Attention</h3>
                <p className="mt-2 max-w-lg text-sm sm:text-base lg:text-[16px] leading-relaxed text-stone-200">
                  Private sessions paced around the student, with direct Tajweed correction.
                </p>
              </div>
            </article>

            {/* Built Around You (Global Diaspora) - High Contrast White Card with Embedded Globe */}
            <article className="group relative flex min-h-[265px] sm:min-h-[285px] lg:min-h-[273px] xl:min-h-[293px] flex-col justify-center overflow-hidden rounded-3xl bg-white p-7 sm:p-8 lg:p-8 xl:p-9 text-stone-950 shadow-[0_16px_40px_rgba(0,0,0,0.25)] border border-white/90 lg:col-span-5">
              {/* Half-Globe embedded in background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -right-20 sm:-bottom-16 sm:-right-16 lg:-bottom-14 lg:-right-12 h-52 w-52 sm:h-72 sm:w-72 lg:h-80 lg:w-80 select-none opacity-40 sm:opacity-75 lg:opacity-85 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-2"
              >
                <EmbeddedGlobeIllustration className="h-full w-full" />
              </div>

              <div className="relative z-10 max-w-sm sm:max-w-md">
                <h3 className="text-2xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight font-bricolage text-stone-950">
                  Built Around You
                </h3>
                <p className="mt-3 text-sm sm:text-base lg:text-[16px] leading-relaxed text-stone-600 font-normal">
                  Flexible 1:1 scheduling designed around families in any timezone worldwide, whenever learning works best for your home.
                </p>
              </div>
            </article>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE THREE FOUNDATIONAL PILLARS — Arkan al-Ilm (White Background) */}
      {/* ========================================================================= */}
      <section className={`${styles.section} ${styles.whiteSection} ${styles.pillarsSection} ${styles.patternBackground} py-24 sm:py-28 lg:py-36 xl:py-40`} aria-labelledby="pillars-heading">
        <div className={`relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${styles.pillarsContainer}`}>
          
          <div className={styles.pillarsIntro}>
            <h2 id="pillars-heading" className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
              Three Pillars<br />
              of Every Lesson
            </h2>
            <p className={styles.intro}>
              How we teach matters as much as what we teach. Oral transmission, good character, and responsibility guide every lesson.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className={styles.pillar}
                >
                    <div className={styles.pillarPhoto}>
                      <Image
                        src={pillar.image}
                        alt={pillar.imageAlt}
                        fill
                        sizes="184px"
                        className={styles.pillarImage}
                      />
                      <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                    </div>
                    <p className={styles.pillarArabic} lang="ar" dir="rtl">{pillar.arabic}</p>
                    <p className={styles.pillarDescription}>
                      {pillar.desc}
                    </p>
                </article>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE SANAD GUARANTEE — 4-Tier Scholar Accreditation Protocol (Green Background) */}
      {/* ========================================================================= */}
      <section className={`${styles.section} ${styles.greenSection} ${styles.vettingSection} py-28 sm:py-32 lg:py-40 xl:py-48 relative overflow-hidden select-none`} aria-labelledby="vetting-heading">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className={`relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${styles.vettingContainer}`}>
          
          <div className={styles.centerIntro}>
            <h2 id="vetting-heading" className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-white font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] text-center">
              How We Verify Every Scholar
            </h2>
            <p className="text-emerald-100/85 text-sm sm:text-base lg:text-[18px] leading-normal max-w-3xl mx-auto text-center font-normal mt-3">
              Qualifications are one part of the review. Recitation, communication, and care for students matter too.
            </p>
          </div>

          <div className={styles.vettingGrid}>
            <svg className={styles.vettingCurve} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
              <path className={styles.vettingCurveShadow} d="M0 240 C80 265 105 270 150 270 C300 270 300 90 450 90 C600 90 600 270 750 270 C900 270 900 90 1050 90 C1120 90 1160 105 1200 115" />
              <path d="M0 240 C80 265 105 270 150 270 C300 270 300 90 450 90 C600 90 600 270 750 270 C900 270 900 90 1050 90 C1120 90 1160 105 1200 115" />
            </svg>
            {vettingTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <article
                  key={tier.step}
                  className={styles.vettingItem}
                >
                  <svg className={styles.vettingMobileCurve} viewBox="0 0 64 240" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M32 0 C0 40 0 80 32 120 C64 160 64 200 32 240" />
                  </svg>
                  <div className={styles.vettingMarker} aria-hidden="true">
                    <div className={styles.vettingMarkerFace}>
                      {Icon ? <Icon /> : null}
                    </div>
                  </div>
                  <div className={styles.vettingContent}>
                    <span aria-hidden="true" className={styles.vettingNumber}>{Number(tier.step)}</span>
                    <h3 className={styles.vettingHeading}>
                      {tier.title}
                    </h3>
                    <p className={styles.vettingDescription}>
                      {tier.desc}
                    </p>
                  </div>

                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. OUR PEDAGOGY — 4 Milestones of Learning (Reference Layout - Staggered Cards) */}
      {/* ========================================================================= */}
      <section
        id="pathway"
        className={`${styles.section} ${styles.whiteSection} ${styles.pathwaySection} ${styles.patternBackground} relative overflow-hidden select-none pb-16 sm:pb-24 lg:pb-60 xl:pb-72 pt-16 sm:pt-20 lg:pt-28`}
        aria-labelledby="pathway-heading"
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-3xl space-y-3 mb-12 sm:mb-16 lg:mb-20">
            <h2
              id="pathway-heading"
              className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]"
            >
              A Gentle Pathway from First Letters to <span className="text-[#095F46]">Fluency</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl font-normal pt-1">
              A structured progression through foundations, recitation, memorisation, and living character — adapted by your scholar to your child&apos;s unique pace.
            </p>
          </div>

          {/* 4 Staggered & Dynamic Tilted Cards with Photography Header */}
          <motion.div
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 xl:gap-6 items-stretch"
          >
            {pedagogyMilestones?.map((milestone) => (
              <article
                key={milestone.title}
                className={`group relative flex flex-col justify-between rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 min-h-[400px] sm:min-h-[440px] lg:min-h-[520px] xl:min-h-[540px] border transition-all duration-500 ease-out hover:z-20 hover:scale-[1.03] hover:!rotate-0 hover:!translate-y-[-6px] hover:shadow-2xl ${milestone.cardBg} ${milestone.offsetClass}`}
              >
                <div>
                  {/* Card Top: Image with overlay number badge (No arrows) */}
                  <div className="relative w-full h-44 sm:h-48 lg:h-52 rounded-2xl overflow-hidden mb-5 sm:mb-6 shadow-sm">
                    <Image
                      src={milestone.image}
                      alt={milestone.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />
                    <div
                      className={`absolute top-3 left-3 h-10 w-10 sm:h-11 sm:w-11 rounded-full border flex items-center justify-center font-bricolage font-bold text-xs sm:text-sm tracking-tight shadow-md backdrop-blur-md ${milestone.badgeBg}`}
                    >
                      {milestone.step}
                    </div>
                  </div>

                  {/* Card Body: Title, Subtitle, & Description (No Arabic terms) */}
                  <div>
                    <h3 className={`font-bricolage text-2xl sm:text-[25px] font-bold tracking-tight leading-[1.15] mb-2 ${milestone.titleColor}`}>
                      {milestone.title}
                    </h3>
                    <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 ${milestone.subtitleColor || 'opacity-75'}`}>
                      {milestone.subtitle}
                    </p>
                    <p className={`text-sm sm:text-[14.5px] leading-relaxed ${milestone.descColor}`}>
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THE PARENT PROMISE — Peace of Mind for Families (Generous Height - Plain Cards) */}
      {/* ========================================================================= */}
      <section
        id="parents"
        className="relative overflow-hidden select-none py-14 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-[#04241B] via-[#07382B] to-[#031d16] text-white border-b border-[#04241B]"
        aria-labelledby="parents-heading"
      >
        {/* Ambient lighting glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 lg:space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 id="parents-heading" className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-white font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] text-center">
              Complete Peace of Mind <span className="text-[#EAD08A]">for Parents</span>
            </h2>
            <p className="text-emerald-100/85 text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl mx-auto font-normal">
              A familiar teacher, a clear view of progress, and lesson times that work for your family.
            </p>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch"
          >
            {parentPromises.map((promise, idx) => {
              const isFlipped = !!flippedCards[idx];
              return (
                <div
                  key={promise.fullTitle}
                  className={`w-full min-h-[380px] sm:min-h-[400px] lg:min-h-[430px] ${styles.flipCardContainer}`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isFlipped}
                    aria-label={`${promise.fullTitle}. Click or tap to ${isFlipped ? 'flip back' : 'reveal details'}.`}
                    onClick={() => toggleCardFlip(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCardFlip(idx);
                      }
                    }}
                    className={`group w-full h-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAD08A] rounded-[28px] sm:rounded-[32px] ${styles.flipCardInner} ${
                      isFlipped ? styles.flipCardInnerFlipped : ''
                    }`}
                  >
                    {/* FRONT OF CARD */}
                    <div
                      className={`flex flex-col items-center justify-between text-center bg-white p-5 sm:p-6 lg:p-6 xl:p-7 text-stone-900 shadow-[0_16px_40px_rgba(0,0,0,0.22)] border border-white/95 group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.30)] transition-shadow duration-300 ${styles.flipCardFace}`}
                    >
                      <div className="w-full flex items-center justify-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#095F46]">
                          Promise {idx + 1}
                        </span>
                      </div>

                      {/* Circle Image and 2-Line Heading */}
                      <div className="my-auto flex flex-col items-center py-1">
                        <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-[4px] border-stone-100 shadow-md ring-2 ring-[#095F46]/15 group-hover:scale-105 transition-transform duration-500 ease-out mb-3.5">
                          <Image
                            src={promise.image}
                            alt={promise.imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 176px"
                          />
                        </div>

                        {/* Title in 2 lines */}
                        <h3 className="text-xl sm:text-[22px] lg:text-[24px] font-bold text-stone-950 font-bricolage tracking-tight leading-[1.14]">
                          <span className="block">{promise.titleLine1}</span>
                          <span className="block text-[#095F46]">{promise.titleLine2}</span>
                        </h3>
                      </div>

                      {/* Subtle ash color text hint (no heavy tags) */}
                      <p className="text-xs text-stone-400 font-medium">
                        Press to flip
                      </p>
                    </div>

                    {/* BACK OF CARD (REVEALED ON TOUCH/PRESS) */}
                    <div
                      className={`flex flex-col justify-between text-left bg-white p-5 sm:p-6 lg:p-6 xl:p-7 text-stone-900 shadow-[0_20px_45px_rgba(0,0,0,0.25)] border border-white/95 ${styles.flipCardFace} ${styles.flipCardBack}`}
                    >
                      <div>
                        {/* Header bar */}
                        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-stone-100">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#095F46]">
                            Promise {idx + 1}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            Press to flip
                          </span>
                        </div>

                        {/* Full Title */}
                        <h3 className="text-xl sm:text-[22px] font-bold text-stone-950 font-bricolage tracking-tight mb-3 leading-snug">
                          {promise.fullTitle}
                        </h3>

                        {/* Content text */}
                        <p className="text-stone-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed font-normal">
                          {promise.desc}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                        <span className="font-semibold text-[#095F46]">Ilmbit Guarantee</span>
                        <span>Press to flip</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRIORITY WAITLIST REGISTRATION FORM SECTION (PRESERVED AS IS) */}
      {/* ========================================================================= */}
      <section id="waitlist" className="relative z-10 scroll-mt-24 sm:scroll-mt-28 py-20 sm:py-24 lg:py-32 xl:py-36">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="relative grid w-full overflow-hidden rounded-2xl sm:rounded-[2rem] border border-stone-200 bg-[#f7f7f3] shadow-[0_22px_70px_rgba(20,32,27,0.10)] lg:grid-cols-[0.82fr_1.18fr]"
          >
            {/* Left Waitlist Banner */}
            <div className="relative flex min-h-[320px] sm:min-h-[360px] flex-col justify-between overflow-hidden bg-[#083f33] p-7 sm:p-10 lg:min-h-0 lg:p-12 xl:p-14 text-white">
              <Image
                src="/images/about-learning-journey.jpg"
                alt=""
                fill
                aria-hidden="true"
                className="pointer-events-none select-none object-cover object-center opacity-70"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#052d23]/70 via-[#052d23]/80 to-[#031e18]/95" />
              <Image
                src="/images/ilmbit-mark-white.png"
                alt=""
                width={360}
                height={360}
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 select-none object-contain opacity-[0.075] sm:h-80 sm:w-80 lg:-bottom-20 lg:-right-24"
              />
              <div className="relative z-10">
                <h2 className="max-w-md text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] tracking-tight text-white font-bricolage">
                  Begin Your Journey with Verified Scholars
                </h2>
                <p className="mt-4 sm:mt-5 max-w-sm text-sm leading-relaxed text-emerald-50/85 sm:text-base lg:text-[17px]">
                  Tell us what you want to learn. We will use it to prepare the right scholar match and schedule.
                </p>
              </div>

              <div className="relative z-10 mt-8 sm:mt-12 border-t border-white/20 pt-4 sm:pt-5">
                <p className="text-sm font-semibold text-white">Priority matching</p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-50/65">
                  No credit card required. We will contact you when a suitable scholar schedule opens.
                </p>
              </div>
            </div>

            {/* Right Waitlist Form */}
            <div className="relative bg-[#fcfcf9] p-5 sm:p-9 lg:p-11 xl:p-12">
              <div className="mb-6 sm:mb-7 flex items-end justify-between gap-4 border-b border-stone-200/60 pb-4 sm:pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#095F46]">Join the waitlist</p>
                  <h3 className="mt-1 text-2xl font-black tracking-tight text-stone-950 sm:text-[26px] lg:text-[28px]">
                    Your learning preferences
                  </h3>
                </div>
              </div>

              {!isWaitlistSubmitted ? (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4 sm:space-y-5 text-left">
                  {/* Form Fields: Full Name & Email */}
                  <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Full name <span className="text-[#095F46]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        placeholder="e.g. Sarah Ahmed"
                        className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#095F46]/15 transition-all min-h-[46px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Email address <span className="text-[#095F46]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#095F46]/15 transition-all min-h-[46px]"
                      />
                    </div>

                    {/* Form Field: Phone or WhatsApp */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Phone or WhatsApp <span className="text-[#095F46]">*</span>
                      </label>
                      <CountryPhoneInput
                        value={waitlistPhone}
                        onChange={setWaitlistPhone}
                        selectedIso={waitlistPhoneCountry.iso2}
                        onCountryChange={setWaitlistPhoneCountry}
                      />
                    </div>

                    {/* Form Field: Discipline of Interest Dropdown */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Discipline of interest
                      </label>
                      <div className="relative">
                        <select
                          value={waitlistCourse}
                          onChange={(e) => setWaitlistCourse(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-stone-200 bg-white pl-3.5 pr-10 py-3 sm:py-2.5 text-base sm:text-sm font-semibold text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#095F46]/15 transition-all cursor-pointer min-h-[46px]"
                        >
                          <option value="Noorani Qaida">Noorani Qaida (Beginner)</option>
                          <option value="Tajweed Quran Recitation">Tajweed Quran Recitation</option>
                          <option value="Hifz Memorization">Hifz Memorization (Advanced)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400">
                          <ChevronDown className="h-4 w-4 stroke-[2]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Field: Preferred Learning Pace */}
                  <fieldset className="pt-1">
                    <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                      Preferred learning pace
                    </legend>
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 rounded-2xl border border-stone-200/90 bg-stone-100/60 p-1.5">
                      <button
                        type="button"
                        aria-pressed={waitlistPace === 'standard'}
                        onClick={() => setWaitlistPace('standard')}
                        className={`rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all ${
                          waitlistPace === 'standard'
                            ? 'bg-[#095F46] text-white shadow-md shadow-[#095F46]/20'
                            : 'bg-white text-stone-800 hover:bg-stone-50 border border-stone-200/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-bold">Standard</span>
                          {waitlistPace === 'standard' && <span className="h-2 w-2 rounded-full bg-emerald-300" />}
                        </div>
                        <span className={`mt-0.5 block text-[11px] ${waitlistPace === 'standard' ? 'text-emerald-50/80 font-medium' : 'text-stone-500'}`}>
                          2 sessions / wk · $59/mo
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-pressed={waitlistPace === 'fast-track'}
                        onClick={() => setWaitlistPace('fast-track')}
                        className={`rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all ${
                          waitlistPace === 'fast-track'
                            ? 'bg-[#095F46] text-white shadow-md shadow-[#095F46]/20'
                            : 'bg-white text-stone-800 hover:bg-stone-50 border border-stone-200/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="block text-xs font-bold">Fast Track</span>
                          {waitlistPace === 'fast-track' && <span className="h-2 w-2 rounded-full bg-emerald-300" />}
                        </div>
                        <span className={`mt-0.5 block text-[11px] ${waitlistPace === 'fast-track' ? 'text-emerald-50/80 font-medium' : 'text-stone-500'}`}>
                          3 sessions / wk · $89/mo
                        </span>
                      </button>
                    </div>
                  </fieldset>

                  {/* Form Field: Notes or Goals */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Notes or goals <span className="font-normal text-stone-400 normal-case">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={waitlistNotes}
                      onChange={(e) => setWaitlistNotes(e.target.value)}
                      placeholder="Schedule preferences, student age, or learning goals"
                      className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#095F46]/15 transition-all resize-none min-h-[68px]"
                    />
                  </div>

                  {/* Form Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isWaitlistSubmitting}
                      className="brand-button brand-button-primary justify-center w-full sm:w-auto px-8 py-3.5 sm:py-3 lg:px-9 lg:py-3.5 text-xs sm:text-sm lg:text-[14px] !font-light uppercase tracking-[0.05em] shadow-md shadow-[#095F46]/15 hover:shadow-lg transition-all min-h-[48px] lg:min-h-[50px]"
                    >
                      <span>{isWaitlistSubmitting ? 'JOINING WAITLIST...' : 'JOIN THE PRIORITY WAITLIST'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Confirmation State */
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f0ea] text-[#095F46] ring-1 ring-[#cce1d8]">
                    <Check className="h-7 w-7 stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-950 font-bricolage">
                    Alhamdulillah, You&apos;re on the Waitlist!
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
                    We have reserved your priority place for <span className="font-bold text-stone-900">{waitlistCourse}</span> ({waitlistPace === 'fast-track' ? 'Fast Track · 3 sessions/wk' : 'Standard · 2 sessions/wk'}). We will reach out to <span className="font-bold text-[#095F46]">{waitlistEmail}</span> as soon as your matching scholar schedule opens up.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
