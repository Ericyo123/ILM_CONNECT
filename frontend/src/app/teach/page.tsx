'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Wallet,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicPageHero from '@/components/public-page-hero';
import CountryPhoneInput from '@/components/country-phone-input';
import {
  formatInternationalPhone,
  getCountryCallingCode,
  type CountryCallingCode,
} from '@/lib/country-calling-codes';
import { apiFetch } from '@/lib/api';

const specializationsList = [
  'Noorani Qaida & Arabic Phonetics',
  'Tajweed & Quran Recitation',
  'Hifz-ul-Quran (Memorization)',
  'Islamic Studies (Fiqh, Aqeedah, Seerah)',
  'Arabic Language & Grammar',
  'Supplications & Daily Duas',
];

const whyTeachCards = [
  {
    title: 'Global Student Reach',
    desc: 'Teach motivated students across the UK, Australia, US, Europe, and Sri Lankan diaspora communities from your home or study.',
    image: '/images/about-scholar-teaching-main.jpg',
    imageAlt: 'Islamic scholar conducting a live Quran teaching session',
  },
  {
    title: 'Complete Flexibility',
    desc: 'Select the exact daily time blocks that suit your personal schedule. Manage lessons effortlessly with automated calendars.',
    image: '/images/about-home-learning.jpg',
    imageAlt: 'Comfortable home study setting for online Quran lessons',
  },
  {
    title: 'Bi-Weekly Direct Payouts',
    desc: 'Earn competitive session compensation with guaranteed, transparent bi-weekly deposits to your bank or Wise account.',
    image: '/images/about/pillar-amanah.jpg',
    imageAlt: 'Quran on wooden stand representing trust and financial transparency',
  },
  {
    title: 'Dedicated Virtual Classroom',
    desc: 'Integrated 1:1 HD video, interactive digital Mushaf, crystal-clear audio, and student progress notes built specifically for Quran learning.',
    image: '/images/quran-class-screen.png',
    imageAlt: 'Ilmbit 1:1 virtual Quran classroom with digital Mushaf',
  },
];

const onboardingSteps = [
  {
    step: '01',
    title: 'Submit Application',
    desc: 'Fill out the 3-minute form below with your academic qualifications, Ijazah certificates, and teaching experience.',
  },
  {
    step: '02',
    title: 'Sanad & Recitation Review',
    desc: 'Participate in a friendly 15-minute virtual conversation with our academic board to review your Tajweed rules and articulation.',
  },
  {
    step: '03',
    title: 'Platform Orientation',
    desc: 'Receive a quick walkthrough of our 1:1 virtual classroom, interactive digital Mushaf, and student progress notes.',
  },
  {
    step: '04',
    title: 'Welcome Students',
    desc: 'Begin matching with diaspora students during your chosen time slots, with direct bi-weekly payouts to your bank.',
  },
];

const faqs = [
  {
    q: 'What qualifications do I need to teach on Ilmbit?',
    a: 'We welcome certified Maulavis, Alim/Alimah graduates, Hafiz-ul-Quran certificate holders, and scholars with verified Sanad or Ijazah in Tajweed from accredited Islamic institutions and Madrassas in Sri Lanka and abroad.',
  },
  {
    q: 'How does the class scheduling work?',
    a: 'You have complete freedom over your teaching routine. You set your daily available hours and session slots. Lessons are booked as private 1:1 sessions matching your confirmed availability.',
  },
  {
    q: 'How and when are tutor payouts processed?',
    a: 'Payouts are calculated per completed session and transferred directly to your Sri Lankan bank account or international account (Wise / direct bank transfer) bi-weekly with transparent statements.',
  },
  {
    q: 'What equipment and setup is required?',
    a: 'A stable high-speed internet connection, a laptop or computer with a working webcam, and a clear headset/microphone in a quiet, distraction-free environment.',
  },
  {
    q: 'How long does the verification process take?',
    a: 'Our academic board reviews applications within 2 to 3 business days. Shortlisted candidates are invited for a brief virtual evaluation and recitation assessment.',
  },
];

export default function TeachPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<CountryCallingCode>(() =>
    getCountryCallingCode('LK')
  );
  const [country, setCountry] = useState('Sri Lanka');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('Maulavi / Alim Graduate');
  const [institution, setInstitution] = useState('');
  const [experience, setExperience] = useState('1-2 years');
  const [specializations, setSpecializations] = useState<string[]>([
    'Noorani Qaida & Arabic Phonetics',
    'Tajweed & Quran Recitation',
  ]);
  const [dailyAvailability, setDailyAvailability] = useState('2-3 Sessions / Day (~2 hours)');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleSpecialization = (item: string) => {
    setSpecializations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (specializations.length === 0) {
      setError('Please select at least one teaching specialization.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const formattedPhone = formatInternationalPhone(phone, phoneCountry);
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: cleanEmail,
          password,
          role: 'LECTURER',
          fullName: fullName.trim(),
          phone: formattedPhone || phone.trim(),
          country: phoneCountry.name || country.trim() || 'Sri Lanka',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          bio: `${institution ? `Institution: ${institution}. ` : ''}Daily Availability: ${dailyAvailability}. ${bio.trim()}`,
          qualifications: `${qualification}${experience ? ` • ${experience} experience` : ''}`,
          specializations,
          languages: ['English'],
        }),
      });

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (
        msg.includes('Failed to fetch') ||
        msg.includes('NetworkError') ||
        msg.includes('fetch failed')
      ) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(msg || 'An error occurred while submitting your application. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf8] text-stone-900 selection:bg-[#095F46] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION — Clean Headline Only Matching Other Pages                */}
      {/* ========================================================================= */}
      <PublicPageHero
        title="Teach the Holy Quran"
        subtitle="Empower Students Worldwide"
        image="/images/teach-hero-scholar.jpg"
        imageAlt="Islamic scholar library with classical Islamic texts"
        imageClassName="object-cover object-[center_35%] opacity-85"
        overlay={
          <>
            <div className="absolute inset-0 bg-stone-950/60" />
            <div className="absolute inset-0 bg-[#095F46]/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/40 to-[#031e18]/95" />
          </>
        }
      />

      {/* ========================================================================= */}
      {/* SECTION 1 (WHITE): WHY SCHOLARS CHOOSE TO TEACH ON ILMBIT                  */}
      {/* ========================================================================= */}
      <section id="why-teach" className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-white border-b border-stone-200/70 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
              Why Scholars Choose to Teach on <span className="text-[#095F46]">Ilmbit</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl mx-auto font-normal">
              A respectful, modern platform built to support and honor teachers of the Holy Quran.
            </p>
          </div>

          <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {whyTeachCards.map((card, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-stone-200/90 bg-[#fafbf9] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-[#095F46]/30 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 bg-stone-100 border border-stone-200/60">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl sm:text-[21px] font-bold text-stone-950 font-bricolage tracking-tight leading-[1.2] mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-[14.5px] text-stone-600 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 (GREEN): SIMPLE 4-STEP ONBOARDING PATHWAY                       */}
      {/* ========================================================================= */}
      <section
        id="onboarding"
        className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-[#063529] via-[#083f33] to-[#04281e] text-white border-b border-emerald-950/60 scroll-mt-16 select-none relative overflow-hidden"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#EAD08A]/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-emerald-400/8 blur-[130px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
            {/* Left Column: Picture of Actual Dashboard on Laptop */}
            <div className="relative lg:col-span-6 flex items-center justify-center order-2 lg:order-1">
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
                      alt="Actual Ilmbit verified scholar teaching dashboard and session scheduler"
                      fill
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
            </div>

            {/* Right Column: Title + Vertical Timeline Pathway */}
            <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
              <div className="mb-8 sm:mb-10 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] mb-3 font-bricolage">
                  Simple 4-Step Onboarding
                </h2>
                <p className="text-emerald-100/80 font-normal text-sm sm:text-base lg:text-[17px] leading-relaxed">
                  From online application to your first live lesson in less than a week
                </p>
              </div>

              {/* Editorial Vertical Timeline */}
              <div className="relative w-full pt-1">
                {/* Continuous Vertical Timeline Line */}
                <div
                  aria-hidden="true"
                  className="absolute left-[15px] sm:left-[21px] top-3.5 bottom-6 w-[2px] bg-gradient-to-b from-[#EAD08A] via-emerald-400/40 to-emerald-500/10 pointer-events-none"
                />

                <div className="space-y-8 sm:space-y-10 lg:space-y-11">
                  {onboardingSteps.map((item) => (
                    <div
                      key={item.step}
                      className="group relative flex items-start gap-4 sm:gap-5"
                    >
                      {/* Dot Node on Line */}
                      <div
                        aria-hidden="true"
                        className="relative z-10 flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#052d23] border-2 border-[#EAD08A]/80 shadow-[0_0_15px_rgba(234,208,138,0.28)] group-hover:border-[#EAD08A] group-hover:scale-105 transition-all duration-300"
                      >
                        <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#EAD08A] group-hover:bg-white transition-colors" />
                      </div>

                      {/* Step Number + Content */}
                      <div className="flex-1 pt-0.5 sm:pt-1">
                        <div className="flex items-baseline gap-2.5 sm:gap-3">
                          <span className="font-bricolage text-sm sm:text-base font-bold tracking-wider text-[#EAD08A] drop-shadow-sm">
                            {item.step}
                          </span>
                          <h3 className="font-bricolage text-base sm:text-lg lg:text-[21px] font-bold text-white tracking-tight leading-snug group-hover:text-emerald-100 transition-colors">
                            {item.title}
                          </h3>
                        </div>

                        <p className="mt-2 text-xs sm:text-sm lg:text-[14.5px] text-emerald-100/80 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 (WHITE): TUTOR APPLICATION FORM                                 */}
      {/* ========================================================================= */}
      <section id="apply-form" className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-[#fbfcfb] border-b border-stone-200/70 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full rounded-3xl border border-emerald-200 bg-white p-8 sm:p-14 text-center shadow-xl shadow-emerald-950/5"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#095F46]">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#0B8663]">
                  Alhamdulillah
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
                  Application Received Successfully
                </h2>
                <p className="mt-4 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
                  JazakAllah Khair for applying to teach with Ilmbit. Our academic evaluation board will review your credentials and contact you via WhatsApp and email within <strong>2 to 3 business days</strong> to schedule an onboarding interview.
                </p>

                <div className="mt-8 pt-8 border-t border-stone-200/80 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="brand-button brand-button-primary px-8 py-3 text-xs tracking-wider uppercase !font-light"
                  >
                    Return to Home
                  </Link>
                  <Link
                    href="/about"
                    className="brand-button brand-button-inverse px-8 py-3 text-xs tracking-wider uppercase !font-light"
                  >
                    Learn More About Ilmbit
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="w-full rounded-3xl border border-stone-200/90 bg-white shadow-xl shadow-black/5 overflow-hidden">
                {/* Form Top Header Band */}
                <div className="border-b border-stone-200/80 bg-gradient-to-r from-[#095F46]/10 via-[#095F46]/5 to-transparent p-7 sm:p-10 lg:p-12">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#095F46]">
                    <UserCheck className="w-4 h-4" />
                    Scholar Registration
                  </div>
                  <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
                    Tutor Application Form
                  </h2>
                  <p className="mt-2.5 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
                    Please provide your authentic credentials. Verified scholars maintain trusted profiles for 1:1 student matching.
                  </p>
                </div>

                <div className="p-7 sm:p-10 lg:p-14">
                  {error ? (
                    <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Step 1: Personal Details */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2 pb-3 border-b border-stone-100 font-bricolage">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#095F46] text-white text-[11px] font-sans">
                          1
                        </span>
                        Personal &amp; Contact Details
                      </h3>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            required
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Maulavi Mohamed Ismail"
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Email Address *
                          </label>
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="scholar@example.com"
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>

                        {/* Country Phone Input with Flag Selector */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            WhatsApp / Phone Number *
                          </label>
                          <CountryPhoneInput
                            value={phone}
                            onChange={setPhone}
                            selectedIso={phoneCountry.iso2}
                            onCountryChange={setPhoneCountry}
                            placeholder="77 123 4567"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Country of Residence *
                          </label>
                          <input
                            required
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Sri Lanka"
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            City / Town
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Colombo, Kandy, Galle"
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Create Portal Password *
                          </label>
                          <div className="relative">
                            <input
                              required
                              type={showPassword ? 'text' : 'password'}
                              minLength={6}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Minimum 6 characters"
                              className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 pl-3.5 pr-10 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Scholarly Credentials */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2 pb-3 border-b border-stone-100 font-bricolage">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#095F46] text-white text-[11px] font-sans">
                          2
                        </span>
                        Qualifications &amp; Islamic Background
                      </h3>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Primary Qualification *
                          </label>
                          <select
                            value={qualification}
                            onChange={(e) => setQualification(e.target.value)}
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          >
                            <option value="Maulavi / Alim Graduate">Maulavi / Alim Graduate</option>
                            <option value="Hafiz-ul-Quran (Certified)">Hafiz-ul-Quran (Certified)</option>
                            <option value="Sanad / Ijazah Holder in Tajweed">Sanad / Ijazah Holder in Tajweed</option>
                            <option value="Alimah / Islamic Scholar">Alimah / Female Islamic Scholar</option>
                            <option value="Islamic Studies Degree / Diploma">Islamic Studies Degree / Diploma</option>
                            <option value="Other Traditional Madrasah Sanad">Other Traditional Madrasah Sanad</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Madrasah / Institute / University Attended
                          </label>
                          <input
                            type="text"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            placeholder="e.g. Jamiah Naleemiah, Ghaffooriyyah, etc."
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Teaching Experience *
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['1-2 years', '3-5 years', '5-10 years', '10+ years'].map((exp) => (
                              <button
                                key={exp}
                                type="button"
                                onClick={() => setExperience(exp)}
                                className={`h-11 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                  experience === exp
                                    ? 'border-[#095F46] bg-[#095F46] text-white shadow-sm'
                                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                                }`}
                              >
                                {exp}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Specializations */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2 font-bricolage">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#095F46] text-white text-[11px] font-sans">
                            3
                          </span>
                          Teaching Subjects
                        </h3>
                        <span className="text-xs text-stone-500 font-medium">
                          Medium of Instruction: English
                        </span>
                      </div>

                      <div className="mt-5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-3">
                          Subjects You Are Qualified to Teach *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {specializationsList.map((spec) => {
                            const isSelected = specializations.includes(spec);
                            return (
                              <button
                                key={spec}
                                type="button"
                                onClick={() => toggleSpecialization(spec)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                                  isSelected
                                    ? 'border-[#095F46] bg-[#095F46]/5 text-[#095F46] font-semibold'
                                    : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:border-stone-300'
                                }`}
                              >
                                <div
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                    isSelected
                                      ? 'border-[#095F46] bg-[#095F46] text-white'
                                      : 'border-stone-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                                <span>{spec}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Availability & Bio */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2 pb-3 border-b border-stone-100 font-bricolage">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#095F46] text-white text-[11px] font-sans">
                          4
                        </span>
                        Daily Availability &amp; Brief Introduction
                      </h3>

                      <div className="mt-5 space-y-5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-2">
                            Daily Teaching Availability
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              '2-3 Sessions / Day (~2 hours)',
                              '4-5 Sessions / Day (~3-4 hours)',
                              '6+ Sessions / Day (Full-Time)',
                            ].map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setDailyAvailability(slot)}
                                className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                                  dailyAvailability === slot
                                    ? 'border-[#095F46] bg-[#095F46] text-white shadow-sm'
                                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-700 mb-1.5">
                            Brief Teaching Bio &amp; Approach
                          </label>
                          <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Share a short summary of your teaching style, patience with children or adult learners, and memorization methods..."
                            className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3.5 text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-6 border-t border-stone-200">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="brand-button brand-button-primary w-full py-4 text-sm font-semibold tracking-wider uppercase transition-all shadow-md shadow-emerald-950/10 hover:shadow-lg disabled:opacity-60"
                      >
                        {isLoading ? 'Submitting Application...' : 'Submit Tutor Application'}
                      </button>
                      <p className="mt-3 text-center text-xs text-stone-500">
                        By applying, you confirm the accuracy of your academic credentials and consent to evaluation by our academic board. Your information is kept strictly confidential.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 (GREEN): SCHOLAR VOICES & FREQUENTLY ASKED QUESTIONS            */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-[#06261e] text-white relative overflow-hidden select-none border-t border-[#04241B]">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* Scholar Community Dignity Spotlight */}
          <div className="text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-[#EAD08A] border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              Teacher Community
            </span>

            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bricolage font-bold leading-relaxed text-emerald-50/95 max-w-3xl mx-auto">
              &ldquo;Teaching diaspora children who live thousands of miles away while sitting in Sri Lanka has been deeply rewarding. The platform handles scheduling and payments with complete dignity and respect.&rdquo;
            </blockquote>

            <div className="pt-2">
              <p className="font-bold text-white text-base sm:text-lg">
                Maulavi A. R. Mohamed
              </p>
              <p className="text-xs sm:text-sm text-emerald-200/75 mt-0.5">
                Jamiah Naleemiah Graduate · Senior Tajweed Scholar on Ilmbit
              </p>
            </div>

            <div className="pt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-emerald-100/75 border-t border-white/10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#EAD08A]" />
                Verified Sanad Community
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-[#EAD08A]" />
                Automated Scheduling
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#EAD08A]" />
                Guaranteed Bi-Weekly Payouts
              </span>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="pt-8 sm:pt-12 border-t border-white/10">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white font-bricolage leading-[1.12]">
                Frequently Asked Questions by <span className="text-[#EAD08A]">Scholars</span>
              </h2>
              <p className="text-emerald-100/80 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl mx-auto font-normal">
                Everything you need to know about teaching, onboarding, and payouts on Ilmbit.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-emerald-500/20 bg-[#08352b]/80 overflow-hidden transition-all duration-200 hover:border-[#EAD08A]/40 shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-6 sm:p-7 text-left text-base sm:text-lg font-bold text-white font-bricolage tracking-tight"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-emerald-300 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#EAD08A]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-sm sm:text-[15.5px] text-emerald-100/85 leading-relaxed font-normal border-t border-emerald-500/20 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Help & WhatsApp Contact Banner */}
            <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#042019] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-bricolage font-bold text-lg text-white">
                  Have questions before applying?
                </p>
                <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
                  Our academic onboarding coordinator is available on WhatsApp to guide you through the process.
                </p>
              </div>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-button brand-button-primary shrink-0 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
