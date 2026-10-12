'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Award,
  Sparkles,
  GraduationCap,
  Users,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import CountryPhoneInput from '@/components/country-phone-input';
import {
  formatInternationalPhone,
  getCountryCallingCode,
  type CountryCallingCode,
} from '@/lib/country-calling-codes';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ---------------------------------------------------------------------------
// Flag SVGs & Regions Data (UK, Europe, Australia, US)
// ---------------------------------------------------------------------------
const learningRegions = [
  { label: 'UK', flag: 'uk' },
  { label: 'Europe', flag: 'eu' },
  { label: 'Australia', flag: 'au' },
  { label: 'US', flag: 'us' },
] as const;

const EU_FLAG_STARS = [
  { cx: 14, cy: 4 },
  { cx: 16.5, cy: 4.67 },
  { cx: 18.33, cy: 6.5 },
  { cx: 19, cy: 9 },
  { cx: 18.33, cy: 11.5 },
  { cx: 16.5, cy: 13.33 },
  { cx: 14, cy: 14 },
  { cx: 11.5, cy: 13.33 },
  { cx: 9.67, cy: 11.5 },
  { cx: 9, cy: 9 },
  { cx: 9.67, cy: 6.5 },
  { cx: 11.5, cy: 4.67 },
];

function RegionFlag({
  region,
  className = 'h-3.5 w-[22px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/25',
}: {
  region: (typeof learningRegions)[number]['flag'];
  className?: string;
}) {
  const sharedClassName = className;

  if (region === 'uk') {
    return (
      <svg aria-hidden="true" viewBox="0 0 28 18" className={sharedClassName}>
        <rect width="28" height="18" fill="#17365D" />
        <path d="M0 0 28 18M28 0 0 18" stroke="#fff" strokeWidth="5" />
        <path d="M0 0 28 18M28 0 0 18" stroke="#C8102E" strokeWidth="2" />
        <path d="M14 0v18M0 9h28" stroke="#fff" strokeWidth="6" />
        <path d="M14 0v18M0 9h28" stroke="#C8102E" strokeWidth="3.2" />
      </svg>
    );
  }

  if (region === 'eu') {
    return (
      <svg aria-hidden="true" viewBox="0 0 28 18" className={sharedClassName}>
        <rect width="28" height="18" fill="#003399" />
        {EU_FLAG_STARS.map((star, i) => (
          <circle key={i} cx={star.cx} cy={star.cy} r="0.75" fill="#FFCC00" />
        ))}
      </svg>
    );
  }

  if (region === 'au') {
    return (
      <svg aria-hidden="true" viewBox="0 0 28 18" className={sharedClassName}>
        <rect width="28" height="18" fill="#012169" />
        <path d="M0 0 12 8M12 0 0 8" stroke="#fff" strokeWidth="2.8" />
        <path d="M0 0 12 8M12 0 0 8" stroke="#C8102E" strokeWidth="1.2" />
        <path d="M6 0v8M0 4h12" stroke="#fff" strokeWidth="3" />
        <path d="M6 0v8M0 4h12" stroke="#C8102E" strokeWidth="1.5" />
        <circle cx="7" cy="13" r="1.25" fill="#fff" />
        <circle cx="20" cy="4" r="1" fill="#fff" />
        <circle cx="24" cy="8" r="0.9" fill="#fff" />
        <circle cx="20" cy="14" r="1" fill="#fff" />
        <circle cx="16" cy="9" r="0.8" fill="#fff" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 28 18" className={sharedClassName}>
      <rect width="28" height="18" fill="#fff" />
      {[0, 2.76, 5.52, 8.28, 11.04, 13.8, 16.56].map((y) => (
        <rect key={y} y={y} width="28" height="1.38" fill="#B22234" />
      ))}
      <rect width="12" height="9.7" fill="#3C3B6E" />
      {[2, 6, 10].flatMap((x) => [2, 5, 8].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#fff" />))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Data: The Three Sacred Pillars (Arkan al-Ilm)
// ---------------------------------------------------------------------------
const pillars = [
  {
    number: '01',
    title: 'Talaqqi with Sanad',
    arabic: 'التلقي والمشافهة',
    subtitle: 'Living Oral Transmission',
    desc: 'The Quran has always been taught mouth-to-ear, heart-to-heart. Direct recitation correction connected through unbroken chains tracing back to the Messenger of Allah ﷺ.',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Adab Before Ilm',
    arabic: 'الأدب قبل العلم',
    subtitle: 'Nurturing with Gentle Character',
    desc: 'Knowledge without character is barren. Our scholars teach with prophetic patience, encouragement, and warmth—ensuring a student never feels fear, anxiety, or shame.',
    icon: HeartHandshake,
  },
  {
    number: '03',
    title: 'Amanah & Ihsan',
    arabic: 'الأمانة والإحسان',
    subtitle: 'Sacred Trust & Professionalism',
    desc: 'We treat your family’s learning as a sacred trust. Strict child safeguarding, vetted educators, reliable scheduling, and transparent milestone tracking for parents.',
    icon: ShieldCheck,
  },
];

// ---------------------------------------------------------------------------
// Data: 4-Tier Scholar Accreditation Protocol
// ---------------------------------------------------------------------------
const vettingTiers = [
  {
    step: '01',
    title: 'Sanad & Degree Audit',
    subtitle: 'Classical Authorization',
    desc: 'Formal university degrees from Al-Azhar, Islamic University of Madinah, and verified Darul Ulooms, along with accredited Ijazah certificates.',
    icon: GraduationCap,
  },
  {
    step: '02',
    title: 'Tajweed Oral Exam',
    subtitle: 'Rigorous Board Review',
    desc: 'Live examination of theoretical rules, precision articulation points (Makharij), and melodic recitation cadence before our Senior Academic Board.',
    icon: Award,
  },
  {
    step: '03',
    title: 'Diaspora Pedagogy',
    subtitle: 'English & Cultural Fluency',
    desc: 'Evaluated for English articulation and cross-cultural empathy to connect naturally with children and youth raised in the UK, US, Europe & Australia.',
    icon: Users,
  },
  {
    step: '04',
    title: 'Safeguarding & Adab',
    subtitle: 'Positive Reinforcement',
    desc: 'Comprehensive identity verification, international background checks, and certification in gentle, child-centred positive pedagogy.',
    icon: ShieldCheck,
  },
];

// ---------------------------------------------------------------------------
// Data: 4 Milestones of Our Pedagogy (How We Teach)
// ---------------------------------------------------------------------------
const pedagogyMilestones = [
  {
    phase: 'Phase 1',
    title: 'Al-Asaas (Foundations)',
    subtitle: 'Noorani Qaida',
    desc: 'Gentle phonics and letter recognition. Building early phonetic confidence without tears or frustration.',
  },
  {
    phase: 'Phase 2',
    title: 'At-Tilawah (Fluency)',
    subtitle: 'Tajweed Mastery',
    desc: 'Melodic pronunciation, mastering Madd, Ghunnah, and pause rules with personalized, live oral correction.',
  },
  {
    phase: 'Phase 3',
    title: 'Al-Hifz (Preservation)',
    subtitle: 'Systematic Retention',
    desc: 'Structured memorization coupled with proven retention systems (Muraja’ah) and age-appropriate reflection.',
  },
  {
    phase: 'Phase 4',
    title: 'Al-Akhlaq (Living the Deen)',
    subtitle: 'Character & Sunnah',
    desc: 'Daily prophetic du’as, authentic manners, and building an unshakeable, joyful pride in Muslim identity.',
  },
];

// ---------------------------------------------------------------------------
// Data: The Parent Promise (Peace of Mind)
// ---------------------------------------------------------------------------
const parentPromises = [
  {
    title: 'Dedicated 1:1 Scholar',
    desc: 'Your child learns with the same trusted scholar every week—fostering genuine mentorship, familiarity, and emotional comfort.',
    icon: Users,
  },
  {
    title: 'Continuous Visibility',
    desc: 'Direct audio recordings of milestone recitations and clear term reports delivered directly to your parent dashboard.',
    icon: Sparkles,
  },
  {
    title: 'Adaptive Family Scheduling',
    desc: 'Designed around school runs, weekend sports, and international time zones. Reschedule smoothly when life happens.',
    icon: Clock,
  },
];

export default function AboutPage() {
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
      <section className="relative min-h-[50vh] sm:min-h-[54vh] lg:min-h-[58vh] flex flex-col justify-between overflow-hidden bg-stone-950 text-white select-none">
        {/* Background Visual with Signature Multi-Layer Ambient Lighting */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-hero-scholar-monochrome.jpg"
            alt="Islamic scholar reading the Quran in a mosque courtyard"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[55%_48%] opacity-90"
          />
          <div className="absolute inset-0 bg-[#095F46]/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#031e18]/85 via-[#095F46]/20 to-[#031e18]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,30,24,0.65)_100%)]" />
        </div>

        {/* Top spacer for fixed header alignment */}
        <div className="w-full h-16 sm:h-20 pointer-events-none" aria-hidden="true" />

        {/* Center Hero Content: Headline wording only */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="relative z-20 mt-auto pb-8 sm:pb-12 pt-6 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
        >
          <div className="relative mx-auto max-w-4xl w-full">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-snug drop-shadow-md max-w-3xl mx-auto font-bricolage">
              <span className="block">A Trusted Bridge Between</span>
              <span className="block text-[#EAD08A] font-semibold text-xl sm:text-3xl lg:text-[34px] mt-1.5">
                Scholars &amp; Students Worldwide
              </span>
            </h1>

            {/* Subtle Down Arrow */}
            <a
              href="#story"
              aria-label="Scroll down to our story"
              className="mt-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </a>
          </div>
        </motion.div>

        {/* Subtle Bottom Ambient Spacer */}
        <div className="relative z-20 pb-2" />
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR STORY — Why We Started Ilmbit (The Dilemma & The Mission) */}
      {/* ========================================================================= */}
      <section id="story" className="relative z-10 py-16 sm:py-20 lg:py-24 border-b border-stone-200/60 scroll-mt-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 font-bricolage">
              Why We Started Ilmbit
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Living in the West, finding authentic Islamic education for our children felt fraught with compromise. We built Ilmbit to eliminate those compromises forever.
            </p>
          </div>

          {/* Clean 2-Column Comparison Cards (No Tags) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            
            {/* Left Card: The Common Struggles */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="rounded-3xl border border-stone-200 bg-white p-7 sm:p-9 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-stone-950 font-bricolage mb-5">
                  The Dilemma of Finding Great Quran Teachers
                </h3>
                <ul className="space-y-4 text-stone-600 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span>
                      <strong className="text-stone-900 font-semibold">Overcrowded Local Madrasahs:</strong> Exhausting weekday commutes followed by large classrooms where individual pronunciation mistakes often go unnoticed.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span>
                      <strong className="text-stone-900 font-semibold">Unvetted Online Freelancers:</strong> High tutor turnover, unpredictable attendance, language barriers, and zero child safeguarding standards.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span>
                      <strong className="text-stone-900 font-semibold">Cold, Gamified Apps:</strong> Impersonal software exercises that cannot replicate the heart-to-heart warmth of living oral transmission.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 text-xs text-stone-500 italic">
                “Sacred knowledge was never meant to be cold, punitive, or transactional.”
              </div>
            </motion.div>

            {/* Right Card: The Ilmbit Sanctuary */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl bg-[#083f33] p-7 sm:p-9 text-white shadow-[0_16px_40px_rgba(8,63,51,0.18)] flex flex-col justify-between"
            >
              <div className="absolute inset-0 z-0 opacity-15">
                <Image
                  src="/images/about-standards-quran.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#052d23] via-[#083f33]/90 to-[#083f33]/80 z-0" />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold tracking-tight text-white font-bricolage mb-5">
                  The Sacred Sanctuary in Your Home
                </h3>
                <ul className="space-y-4 text-emerald-50/90 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-stone-950 text-xs font-bold">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white font-semibold">Living Talaqqi:</strong> Dedicated 1:1 sessions with verified Sanad-certified scholars from historic centres of Islamic learning.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-stone-950 text-xs font-bold">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white font-semibold">Encouragement &amp; Adab:</strong> A patient, shame-free space where children feel safe, respected, and eager to return every week.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-stone-950 text-xs font-bold">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-white font-semibold">Frictionless Modern Portal:</strong> Consistent scheduling tailored to UK, US, EU &amp; Australian time zones with direct parent visibility.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-white/15 text-xs text-emerald-200/90 font-medium">
                Bridging centuries of classical excellence with today&apos;s family schedules.
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE PHILOSOPHY & BENTO GRID — Verified Scholars, Personal Attention, Global */}
      {/* ========================================================================= */}
      <section id="philosophy" className="relative z-10 py-14 sm:py-16 lg:py-20 bg-[#f8faf8] border-b border-stone-200/60 select-none scroll-mt-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7 sm:space-y-8">
          
          {/* Top Row: Left Title vs Right Concise Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left: Heading with Brand Green Accent */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="lg:col-span-7"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 leading-[1.15] font-bricolage">
                Make Serious Islamic Education{' '}
                <span className="text-[#095F46]">Easier To Access,</span> And Easier To Stay With!
              </h2>
            </motion.div>

            {/* Right: Minimal, clean explanatory text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="lg:col-span-5 text-stone-600 text-xs sm:text-sm leading-relaxed"
            >
              <p>
                Ilmbit bridges authentic traditional scholarship with modern 1:1 virtual classrooms and flexible scheduling designed specifically for diaspora families.
              </p>
            </motion.div>
          </div>

          {/* Learning principles bento grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2"
          >
            {/* Verified Scholars Big Card */}
            <article className="group relative min-h-[390px] overflow-hidden rounded-3xl bg-stone-900 lg:col-span-7 lg:row-span-2 lg:min-h-[500px]">
              <Image
                src="/images/about-verified-scholar.jpg"
                alt="Quran teacher seated beside an open copy of the Holy Quran"
                fill
                className="object-cover object-[center_54%] transition-transform duration-700 group-hover:scale-[1.025]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052d23]/95 via-[#052d23]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <h3 className="max-w-md text-3xl font-bold tracking-[-0.035em] sm:text-4xl font-bricolage">
                  Verified Scholars
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-emerald-50/85 sm:text-base">
                  Sanad-certified educators selected for Islamic depth and teaching adab.
                </p>
              </div>
            </article>

            {/* Personal Attention Card */}
            <article className="group relative min-h-[270px] overflow-hidden rounded-3xl bg-stone-900 lg:col-span-5 lg:min-h-0">
              <Image
                src="/images/about-personal-attention-online.jpg"
                alt="Student receiving personal online Quran instruction"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <h3 className="text-2xl font-bold tracking-tight font-bricolage">Personal Attention</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-200">
                  Private sessions paced around the student, with direct Tajweed correction.
                </p>
              </div>
            </article>

            {/* Built Around You (Countries Flags) */}
            <article className="group relative flex min-h-[230px] flex-col justify-center overflow-hidden rounded-3xl border border-[#095F46]/12 bg-white lg:col-span-5 lg:min-h-0">
              <div className="relative p-6 text-stone-950 sm:p-7">
                <h3 className="text-2xl font-bold tracking-tight font-bricolage">Built Around You</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-600">
                  Flexible scheduling designed around international time zones.
                </p>
                <div
                  className="mt-5 flex items-center justify-center gap-3 sm:justify-start"
                  aria-label="Available across the United Kingdom, Europe, Australia, and the United States"
                >
                  {learningRegions.map((region) => (
                    <RegionFlag
                      key={region.flag}
                      region={region.flag}
                      className="h-auto w-10 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-stone-900/10 sm:w-11"
                    />
                  ))}
                </div>
              </div>
            </article>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE THREE SACRED PILLARS — Arkan al-Ilm (No Tags) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 border-b border-stone-200/70">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 font-bricolage">
              Three Sacred Pillars of Every Lesson
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Knowledge without character is empty. We anchor every minute of instruction in traditional adab and authentic transmission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  className="rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#095F46] text-white shadow-md shadow-[#095F46]/20">
                        <IconComponent className="h-6 w-6 stroke-[2]" />
                      </div>
                      <span className="text-3xl font-black text-stone-200 font-bricolage">
                        {pillar.number}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider font-arabic mb-1">
                      {pillar.arabic}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-stone-950 font-bricolage mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#095F46] mb-3">
                      {pillar.subtitle}
                    </p>
                    <p className="text-stone-600 text-sm leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-stone-700">
                    <Check className="h-4 w-4 text-[#095F46]" /> Non-negotiable standard
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE SANAD GUARANTEE — 4-Tier Scholar Accreditation Protocol (No Tags) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 bg-[#f8faf8] border-b border-stone-200/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 font-bricolage">
              How We Vet &amp; Verify Every Scholar
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Only the top 3% of scholarly applicants teach on Ilmbit. We verify lineage, pedagogy, and character before anyone enters a classroom.
            </p>
          </div>

          {/* 4-Step Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vettingTiers.map((tier) => {
              const IconComp = tier.icon;
              return (
                <motion.div
                  key={tier.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white text-xs font-bold font-bricolage">
                        {tier.step}
                      </span>
                      <IconComp className="h-5 w-5 text-[#095F46]" />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-stone-950 font-bricolage mb-1">
                      {tier.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#095F46] mb-3">
                      {tier.subtitle}
                    </p>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
                    <Check className="h-3.5 w-3.5 text-[#095F46]" /> Mandatory clearance
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Institutional Heritage Callout */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#095F46]/10 text-[#095F46]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900 font-bricolage">
                  Scholars certified through historic centres of learning
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Graduates from Al-Azhar University, Islamic University of Madinah, and renowned traditional Darul Ulooms.
                </p>
              </div>
            </div>
            <a
              href="#waitlist"
              className="brand-button brand-button-primary px-6 py-2 text-xs font-bold shrink-0"
            >
              Request Scholar Match
            </a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. OUR PEDAGOGY — 4 Milestones of Learning (No Tags) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 border-b border-stone-200/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 font-bricolage">
              A Gentle Pathway from First Letters to Fluency
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Every student progresses at their own pace with tailored 1:1 guidance designed to foster confidence and love for the Quran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pedagogyMilestones.map((milestone, idx) => (
              <motion.div
                key={milestone.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#095F46]">
                      {milestone.phase}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {milestone.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-stone-950 font-bricolage mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 text-[11px] font-medium text-stone-400">
                  Step 0{idx + 1} of 04
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THE PARENT PROMISE — Peace of Mind for Families (No Tags) */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 bg-[#f8faf8] border-b border-stone-200/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 font-bricolage">
              Complete Peace of Mind for Parents
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              We know how much trust it takes to hand your child’s religious education to an online school. Here is our ongoing commitment to your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {parentPromises.map((promise) => {
              const Icon = promise.icon;
              return (
                <motion.div
                  key={promise.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#095F46]/10 text-[#095F46]">
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-stone-950 font-bricolage mb-2">
                      {promise.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {promise.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs font-medium text-[#095F46]">
                    <Check className="h-4 w-4" /> Guaranteed standard
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRIORITY WAITLIST REGISTRATION FORM SECTION (PRESERVED AS IS) */}
      {/* ========================================================================= */}
      <section id="waitlist" className="relative z-10 scroll-mt-24 sm:scroll-mt-28 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="relative grid w-full max-w-6xl mx-auto overflow-hidden rounded-2xl sm:rounded-[2rem] border border-stone-200 bg-[#f7f7f3] shadow-[0_22px_70px_rgba(20,32,27,0.10)] lg:grid-cols-[0.82fr_1.18fr]"
          >
            {/* Left Waitlist Banner */}
            <div className="relative flex min-h-[280px] sm:min-h-[320px] flex-col justify-between overflow-hidden bg-[#083f33] p-6 sm:p-9 lg:min-h-0 lg:p-10 text-white">
              <Image
                src="/images/about-waitlist-quran.jpg"
                alt=""
                fill
                aria-hidden="true"
                className="pointer-events-none select-none object-cover object-[center_58%] opacity-70"
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
                <h2 className="max-w-md text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.15] tracking-tight text-white font-bricolage">
                  Begin Your Sacred Journey of Knowledge
                </h2>
                <p className="mt-4 sm:mt-5 max-w-sm text-sm leading-relaxed text-emerald-50/75 sm:text-base">
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
            <div className="relative bg-[#fcfcf9] p-5 sm:p-8 lg:p-10">
              <div className="mb-6 sm:mb-7 flex items-end justify-between gap-4 border-b border-stone-200/60 pb-4 sm:pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#095F46]">Join the waitlist</p>
                  <h3 className="mt-1 text-2xl font-black tracking-tight text-stone-950 sm:text-[26px]">
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
                      className="brand-button brand-button-primary justify-center w-full sm:w-auto px-8 py-3 text-base sm:text-sm font-bold shadow-md shadow-[#095F46]/15 hover:shadow-lg transition-all min-h-[46px]"
                    >
                      <span>{isWaitlistSubmitting ? 'Joining Waitlist...' : 'Join the Priority Waitlist'}</span>
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
