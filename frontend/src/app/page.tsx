'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Star, ChevronRight, GraduationCap, ShieldCheck, Clock, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { courseOfferings, testimonials } from '@/lib/mock-data';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { num: '1', title: 'Sign Up', desc: 'Create your account in minutes and tell us about your learning goals', icon: '📝' },
  { num: '2', title: 'Choose Your Course', desc: 'Select Tajweed for Quran recitation or Hifz for memorization', icon: '📖' },
  { num: '3', title: 'Get Matched with a Maulavi', desc: 'We assign a qualified scholar based on your needs and schedule', icon: '🤝' },
  { num: '4', title: 'Start Learning', desc: 'Join 1:1 Zoom sessions twice a week and track your progress', icon: '🎓' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — Two-Block Split Layout */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch min-h-[600px] lg:min-h-[700px]">
            {/* Left block — Content */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="flex-1 flex flex-col justify-center py-16 lg:py-24 lg:pr-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-sm font-medium mb-6 w-fit">
                <ShieldCheck className="h-4 w-4" /> Trusted by 150+ families worldwide
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Learn Islam from{' '}
                <span className="text-gradient-primary">Qualified Scholars</span>
                <br />
                <span className="text-[hsl(var(--accent))]">Anywhere in the World</span>
              </h1>
              <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] max-w-xl mb-8 leading-relaxed">
                Personalized 1:1 online Tajweed and Hifz sessions with certified Sri Lankan Islamic scholars. Structured, professional, and designed for the Muslim diaspora.
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:from-[hsl(168,80%,22%)] hover:to-[hsl(168,60%,30%)] shadow-lg hover:shadow-xl transition-all pulse-glow">
                  Start Learning <ChevronRight className="h-5 w-5" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                  How It Works
                </Link>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { val: '12+', label: 'Qualified Scholars' },
                  { val: '150+', label: 'Active Students' },
                  { val: '4.85', label: 'Average Rating' },
                  { val: '10K+', label: 'Sessions Completed' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-[hsl(var(--card))] shadow-sm border border-[hsl(var(--border))]">
                    <div className="text-xl lg:text-2xl font-bold text-gradient-primary">{s.val}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right block — Image */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block w-1/2 relative rounded-2xl overflow-hidden my-8">
              <Image src="/images/hero-split.png" alt="Islamic calligraphy and study scene" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[hsl(var(--background))/0.1]" />
            </motion.div>
            {/* Mobile image */}
            <div className="lg:hidden w-full h-64 relative rounded-2xl overflow-hidden mb-8">
              <Image src="/images/hero-split.png" alt="Islamic calligraphy and study scene" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 lg:py-28 bg-[hsl(var(--card))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Courses</h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">Choose the right course for your Islamic education journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {courseOfferings.map((course, i) => (
              <motion.div key={course.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className={`relative rounded-2xl border p-8 flex flex-col ${course.comingSoon ? 'border-dashed border-[hsl(var(--border))] opacity-80' : i === 0 ? 'border-[hsl(var(--primary))] shadow-xl bg-[hsl(var(--card))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'}`}>
                {course.comingSoon && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[hsl(var(--accent))] text-white text-xs font-semibold whitespace-nowrap">
                    Coming Soon
                  </div>
                )}
                {i === 0 && !course.comingSoon && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">{course.description}</p>
                {course.isGroup && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 mb-4 w-fit">
                    <Users className="h-3 w-3" /> Group Classes
                  </div>
                )}

                {!course.comingSoon ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-[hsl(var(--muted))]">
                      <div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] mb-0.5">Basic</div>
                        <div className="text-2xl font-bold">${course.basicPriceUSD}<span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">/mo</span></div>
                      </div>
                      <div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] mb-0.5 flex items-center gap-1">Premium <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" /></div>
                        <div className="text-2xl font-bold">${course.premiumPriceUSD}<span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">/mo</span></div>
                      </div>
                    </div>
                    {course.premiumExtras.length > 0 && (
                      <div className="mb-4 p-3 rounded-lg bg-[hsl(var(--accent-light))] border border-[hsl(var(--accent)/0.2)]">
                        <div className="text-xs font-semibold text-[hsl(var(--accent))] mb-1.5">Premium adds:</div>
                        {course.premiumExtras.map(e => (
                          <div key={e} className="flex items-center gap-1.5 text-xs text-[hsl(var(--foreground))]">
                            <Sparkles className="h-3 w-3 text-[hsl(var(--accent))] flex-shrink-0" /> {e}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-5 p-4 rounded-xl bg-[hsl(var(--muted))] text-center">
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">Pricing to be announced</div>
                  </div>
                )}

                <ul className="space-y-2 mb-6 flex-1">
                  {course.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={course.comingSoon ? '#' : '/auth/signup'} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${course.comingSoon ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed' : 'bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] text-white hover:shadow-lg'}`}>
                  {course.comingSoon ? 'Coming Soon' : 'Get Started'}
                  {!course.comingSoon && <ChevronRight className="h-4 w-4" />}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Redesigned */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/islamic-pattern.png" alt="" fill className="object-cover opacity-5 dark:opacity-[0.03]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto">Start learning in minutes — our streamlined process gets you from sign-up to your first session seamlessly</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-[hsl(var(--primary)/0.3)] to-[hsl(var(--primary)/0.1)]" />
                )}
                <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary-light))] to-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm mb-5 mx-auto text-3xl">
                  {s.icon}
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[hsl(var(--primary))] text-white text-xs font-bold flex items-center justify-center">{s.num}</div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Image src="/images/how-it-works.png" alt="Student learning online with a laptop and Quran" width={800} height={400} className="rounded-2xl shadow-lg border border-[hsl(var(--border))] mx-auto max-w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-[hsl(var(--card))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Families Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 text-[hsl(var(--accent))] fill-current" />)}
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{t.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,20%)] text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Begin Your Journey of Knowledge</h2>
          <p className="text-lg text-white/80 mb-8">Book a free 30-minute trial session with one of our qualified scholars. No commitment required.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-white text-[hsl(168,80%,26%)] hover:bg-white/90 shadow-xl transition-all">
            Start Free Trial <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
