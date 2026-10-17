'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  Globe,
  Clock,
  Video,
  Wallet,
  ChevronDown,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  CalendarCheck,
  Eye,
  EyeOff,
  MessageCircle,
  FileText,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicPageHero, { publicPageFadeUp as fadeUp } from '@/components/public-page-hero';
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

const onboardingSteps = [
  {
    step: '01',
    title: 'Submit Application',
    desc: 'Fill out the 3-minute form below with your academic qualifications, Ijazah certificates, and teaching experience.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Sanad & Recitation Review',
    desc: 'Participate in a friendly 15-minute virtual conversation with our academic board to review your Tajweed rules and articulation.',
    icon: Award,
  },
  {
    step: '03',
    title: 'Platform Orientation',
    desc: 'Receive a quick walkthrough of our 1:1 virtual classroom, interactive digital Mushaf, and student progress notes.',
    icon: CalendarCheck,
  },
  {
    step: '04',
    title: 'Welcome Students',
    desc: 'Begin matching with diaspora students during your chosen time slots, with direct bi-weekly payouts to your bank.',
    icon: BookOpen,
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
      {/* 1. HERO SECTION — Elevated with Subtitle & Direct Action Button           */}
      {/* ========================================================================= */}
      <PublicPageHero
        title="Teach the Holy Quran"
        subtitle="Empower Students Worldwide"
        description="Join an esteemed community of verified Maulavis and Aalimaat. Conduct structured 1:1 online sessions with diaspora families across the UK, US, Europe, and Australia."
        image="/images/teach-hero-scholar.jpg"
        imageAlt="Islamic scholar library with classical Islamic texts"
        imageClassName="object-cover object-[center_35%] opacity-85"
        className="min-h-[52vh] sm:min-h-[58vh] lg:min-h-[64vh] py-24 sm:py-28 lg:py-32 xl:py-36"
        overlay={
          <>
            <div className="absolute inset-0 bg-stone-950/60" />
            <div className="absolute inset-0 bg-[#095F46]/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/40 to-[#031e18]/95" />
          </>
        }
      />

      {/* ========================================================================= */}
      {/* 2. QUICK METRICS BAR ("The Counter")                                      */}
      {/* ========================================================================= */}
      <section className="border-b border-stone-200/80 bg-white py-10 sm:py-14 lg:py-16 shadow-xs relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            <div className="px-3 sm:px-4">
              <p className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#095F46] font-bricolage tracking-tight leading-none mb-2">
                100%
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900">
                Remote Flexibility
              </p>
              <p className="text-xs text-stone-500 font-normal mt-1 hidden sm:block">
                Teach from the comfort of home
              </p>
            </div>
            <div className="px-3 sm:px-4 pt-4 sm:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#095F46] font-bricolage tracking-tight leading-none mb-2">
                1:1 Format
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900">
                Private Classroom
              </p>
              <p className="text-xs text-stone-500 font-normal mt-1 hidden sm:block">
                Dedicated student attention &amp; adab
              </p>
            </div>
            <div className="px-3 sm:px-4 pt-4 sm:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#095F46] font-bricolage tracking-tight leading-none mb-2">
                Flexible
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900">
                Daily Time Slots
              </p>
              <p className="text-xs text-stone-500 font-normal mt-1 hidden sm:block">
                Set and adjust your own routine
              </p>
            </div>
            <div className="px-3 sm:px-4 pt-4 sm:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#095F46] font-bricolage tracking-tight leading-none mb-2">
                Bi-Weekly
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900">
                Direct Payouts
              </p>
              <p className="text-xs text-stone-500 font-normal mt-1 hidden sm:block">
                Direct bank or Wise deposit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY SCHOLARS CHOOSE TO TEACH ON ILMBIT                                  */}
      {/* ========================================================================= */}
      <section id="why-teach" className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-gradient-to-b from-white via-[#f4f8f5] to-white border-b border-stone-200/70 scroll-mt-20">
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
            {[
              {
                icon: Globe,
                title: 'Global Student Reach',
                desc: 'Teach motivated students across the UK, Australia, US, Europe, and Sri Lankan diaspora communities.',
              },
              {
                icon: Clock,
                title: 'Complete Flexibility',
                desc: 'Select the exact daily time blocks that suit your personal schedule. Manage lessons effortlessly.',
              },
              {
                icon: Wallet,
                title: 'Bi-Weekly Direct Payouts',
                desc: 'Earn competitive session compensation with guaranteed bi-weekly deposits to your bank or Wise account.',
              },
              {
                icon: Video,
                title: 'Dedicated Virtual Classroom',
                desc: 'Integrated 1:1 HD video, high-resolution digital Mushaf, crystal-clear audio, and student progress logs.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl border border-[#095F46]/15 bg-gradient-to-br from-white via-[#f7fbf9] to-[#edf7f3] p-8 sm:p-9 min-h-[340px] sm:min-h-[360px] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#095F46]/40 hover:shadow-xl hover:shadow-[#095F46]/10 overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative Soft Corner Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#095F46]/10 to-transparent blur-2xl group-hover:from-[#095F46]/20 transition-all pointer-events-none" />

                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#095F46] to-[#043E2E] text-[#EAD08A] shadow-md shadow-[#095F46]/25 group-hover:scale-105 transition-transform mb-6">
                    <card.icon className="h-6 w-6 stroke-[1.9]" />
                  </div>
                  <h3 className="text-xl sm:text-[22px] font-bold text-stone-900 font-bricolage tracking-tight group-hover:text-[#095F46] transition-colors mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-[14.5px] text-stone-600 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#095F46]/10 flex items-center gap-1.5 text-xs font-semibold text-[#095F46]">
                  <span>Verified Standard</span>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SIMPLE 4-STEP ONBOARDING JOURNEY                                       */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-white border-b border-stone-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
              Simple 4-Step <span className="text-[#095F46]">Onboarding</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl mx-auto font-normal">
              From online application to your first 1:1 teaching session in less than a week.
            </p>
          </div>

          <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
            {onboardingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative rounded-3xl border border-stone-200/90 bg-[#fafbf9] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#095F46]/40 hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#095F46] border border-emerald-100">
                        <Icon className="h-6 w-6 stroke-[2]" />
                      </div>
                      <span className="font-bricolage font-bold text-3xl sm:text-4xl text-stone-300">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-stone-950 font-bricolage tracking-tight mb-2.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center gap-1.5 text-xs font-semibold text-[#095F46]">
                    <span>Step {step.step}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SCHOLAR VOICES & COMMUNITY DIGNITY BANNER                              */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 lg:py-28 bg-[#06261e] text-white relative overflow-hidden select-none border-b border-[#04241B]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
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
      </section>

      {/* ========================================================================= */}
      {/* 6. APPLICATION FORM SECTION                                               */}
      {/* ========================================================================= */}
      <section id="apply-form" className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-[#f4f7f5] scroll-mt-20">
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
      {/* 7. TUTOR FAQS                                                             */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-white border-t border-stone-200/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
              Frequently Asked Questions by <span className="text-[#095F46]">Scholars</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl mx-auto font-normal">
              Everything you need to know about teaching, onboarding, and payouts on Ilmbit.
            </p>
          </div>

          <div className="mt-12 sm:mt-14 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200/90 bg-[#fafbf9] overflow-hidden transition-all duration-200 hover:border-[#095F46]/30 shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 sm:p-7 text-left text-base sm:text-lg font-bold text-stone-900 font-bricolage tracking-tight"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#095F46]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-sm sm:text-[15.5px] text-stone-600 leading-relaxed font-normal border-t border-stone-200/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Help & WhatsApp Contact Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#f4f7f5] border border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-bricolage font-bold text-lg text-stone-950">
                Have questions before applying?
              </p>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
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
      </section>
    </div>
  );
}
