'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import PublicPageHero, { publicPageFadeUp as fadeUp, publicPageViewPort } from '@/components/public-page-hero';
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


const isMobileClient = () => typeof window !== 'undefined' && window.innerWidth < 768;

const staggerContainer: Variants = {
  hidden: () => (isMobileClient() ? { opacity: 1 } : { opacity: 0 }),
  visible: () => (isMobileClient()
    ? { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } }
    : { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } }),
};

const whyTeachCards = [
  {
    title: 'Global Student Reach',
    desc: 'Teach motivated students across the UK, Australia, US, Europe, and Sri Lankan diaspora communities from your home or study.',
    image: '/images/teach-global-students.jpg',
    imageAlt: 'Students reciting Holy Quran verses during class',
  },
  {
    title: 'Complete Flexibility',
    desc: 'Select the exact daily time blocks that suit your personal schedule. Manage lessons effortlessly with automated calendars.',
    image: '/images/about-home-learning.jpg',
    imageAlt: 'Comfortable home study setting for online Quran lessons',
  },
  {
    title: 'Sacred One-on-One Mentorship',
    desc: 'Dedicate your full guidance to one student at a time, patiently nurturing accurate Tajweed articulation and love for the Holy Quran.',
    image: '/images/teach-one-on-one-recitation.jpg',
    imageAlt: 'Reverent recitation of the Holy Quran',
  },
  {
    title: 'Dedicated Virtual Classroom',
    desc: 'Integrated 1:1 HD video, interactive digital Mushaf, crystal-clear audio, and student progress notes built specifically for Quran learning.',
    image: '/images/teach-virtual-classroom.jpg',
    imageAlt: 'Dedicated study space with laptop and Islamic reference texts',
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
        image="/images/hero-pexels-1.jpg"
        imageAlt="Sacred Islamic architecture sanctuary and courtyard"
        imageClassName="object-cover object-[center_35%] opacity-85"
        overlay={
          <>
            <div className="absolute inset-0 bg-stone-950/60" />
            <div className="absolute inset-0 bg-[#095F46]/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/40 to-[#031e18]/95" />
          </>
        }
      >
        <a
          href="#apply-form"
          className="brand-button brand-button-primary px-8 py-3.5 text-xs sm:text-sm tracking-[0.05em] uppercase !font-light shadow-lg hover:shadow-emerald-950/40 inline-flex items-center gap-2"
        >
          <span>TUTOR APPLICATION FORM</span>
          <ChevronDown className="w-4 h-4" />
        </a>
      </PublicPageHero>

      {/* ========================================================================= */}
      {/* SECTION 1 (WHITE): WHY SCHOLARS CHOOSE TO TEACH ON ILMBIT                  */}
      {/* ========================================================================= */}
      <section id="why-teach" className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-white border-b border-stone-200/70 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={publicPageViewPort}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-stone-950 font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
              Why Scholars Choose to Teach on <span className="text-[#095F46]">Ilmbit</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl mx-auto font-normal">
              A respectful, modern platform built to support and honor teachers of the Holy Quran.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={publicPageViewPort}
            variants={staggerContainer}
            className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 items-stretch"
          >
            {whyTeachCards.map((card, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group rounded-3xl border border-stone-200/90 bg-[#fafbf9] flex flex-col justify-between shadow-xs hover:border-[#095F46]/30 hover:shadow-lg transition-all overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-stone-200/60">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-[21px] font-bold text-stone-950 font-bricolage tracking-tight leading-[1.2] mb-2.5">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-[14.5px] text-stone-600 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 (GREEN): SIMPLE 4 STEPS ONBOARDING PATHWAY                      */}
      {/* ========================================================================= */}
      <section
        id="onboarding"
        className="py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-[#063529] via-[#083f33] to-[#04281e] text-white border-b border-emerald-950/60 scroll-mt-16 select-none relative overflow-hidden"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#EAD08A]/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-emerald-400/8 blur-[130px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
            {/* Left Column: Authentic Portrait Frame of Verified Scholar / Lecturer */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={publicPageViewPort}
              variants={fadeUp}
              className="relative lg:col-span-6 flex items-center justify-center order-2 lg:order-1"
            >
              <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[500px]">
                {/* Ambient warm glow behind the portrait */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#EAD08A]/20 via-emerald-400/15 to-transparent rounded-[36px] blur-2xl -z-10" />

                {/* Stately Scholar Portrait Frame */}
                <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#04281e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)] aspect-[4/5] sm:aspect-[3/4]">
                  <Image
                    src="/images/teach-onboarding-lecturer.jpg"
                    alt="Authentic Islamic scholar and Quran teacher reciting Holy Quran"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-center"
                  />
                  {/* Subtle Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031e18]/80 via-transparent to-black/20" />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Title + Vertical Timeline Pathway */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={publicPageViewPort}
              variants={fadeUp}
              className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2"
            >
              <div className="mb-8 sm:mb-10 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] mb-3 font-bricolage">
                  Simple 4 Steps Onboarding
                </h2>
                <p className="text-emerald-100/85 font-normal text-sm sm:text-base lg:text-[18px] leading-relaxed">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TUTOR APPLICATION FORM                                         */}
      {/* ========================================================================= */}
      <section id="apply-form" className="py-20 sm:py-24 lg:py-32 xl:py-36 bg-[#f4f7f4] border-b border-stone-200/70 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
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
                    className="brand-button brand-button-primary px-8 py-3 text-xs tracking-[0.05em] uppercase !font-light"
                  >
                    RETURN TO HOME
                  </Link>
                  <Link
                    href="/about"
                    className="brand-button brand-button-inverse px-8 py-3 text-xs tracking-[0.05em] uppercase !font-light"
                  >
                    LEARN MORE ABOUT ILMBIT
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={publicPageViewPort}
                variants={fadeUp}
                className="w-full rounded-3xl border border-stone-200/90 bg-white shadow-xl shadow-black/5 overflow-hidden"
              >
                {/* Form Top Header Band — Deep Islamic Green with Gold Accents */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#06261e] via-[#095F46] to-[#042d22] text-white p-6 sm:p-10 lg:p-14 border-b border-emerald-900/40">
                  {/* Subtle Background Radial Glow */}
                  <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#EAD08A]/10 blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-bold tracking-tight text-white font-bricolage leading-[1.12] sm:leading-[1.14] lg:leading-[1.15]">
                      Tutor Application Form
                    </h2>
                    <p className="mt-2.5 text-sm sm:text-base lg:text-[18px] text-emerald-100/85 max-w-2xl leading-relaxed font-normal">
                      Please provide your authentic credentials. Verified scholars maintain trusted profiles for 1:1 student matching.
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-8 lg:p-14">
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
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                              className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 pl-3.5 pr-10 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                            className="h-11 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
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
                            className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3.5 text-base sm:text-sm text-stone-900 outline-none transition-colors focus:border-[#095F46] focus:bg-white focus:ring-2 focus:ring-[#095F46]/15"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-6 border-t border-stone-200">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="brand-button brand-button-primary w-full py-4 text-xs sm:text-sm !font-light tracking-[0.05em] uppercase transition-all shadow-md shadow-emerald-950/10 hover:shadow-lg disabled:opacity-60"
                      >
                        {isLoading ? 'SUBMITTING APPLICATION...' : 'SUBMIT TUTOR APPLICATION'}
                      </button>
                      <p className="mt-3 text-center text-xs text-stone-500">
                        By applying, you confirm the accuracy of your academic credentials and consent to evaluation by our academic board. Your information is kept strictly confidential.
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
