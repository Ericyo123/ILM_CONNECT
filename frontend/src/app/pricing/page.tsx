'use client';

import Link from 'next/link';
import { Check, ChevronRight, Sparkles, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { courseOfferings } from '@/lib/mock-data';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function PricingPage() {
  return (
    <div className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">Every plan includes 8 sessions per month (2 per week), each 45 minutes of personalized 1:1 instruction. Premium adds recordings and progress reports for just $5 more.</p>
        </div>

        {/* Course Cards */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {courseOfferings.filter(c => !c.comingSoon).map((course, i) => (
            <motion.div key={course.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--primary-light))] to-transparent">
                  <h2 className="text-2xl font-bold">{course.name}</h2>
                  <p className="text-[hsl(var(--muted-foreground))] mt-1">{course.description}</p>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic */}
                    <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                      <div className="text-sm font-semibold text-[hsl(var(--muted-foreground))] mb-2">Basic</div>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">${course.basicPriceUSD}</span>
                        <span className="text-[hsl(var(--muted-foreground))]"> / month</span>
                      </div>
                      <ul className="space-y-2.5 mb-6">
                        {course.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/auth/signup" className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                        Get Started <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                    {/* Premium */}
                    <div className="p-6 rounded-xl border-2 border-[hsl(var(--primary))] bg-[hsl(var(--background))] relative">
                      <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[hsl(var(--primary))] text-white text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Premium
                      </div>
                      <div className="text-sm font-semibold text-[hsl(var(--primary))] mb-2">Premium</div>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">${course.premiumPriceUSD}</span>
                        <span className="text-[hsl(var(--muted-foreground))]"> / month</span>
                      </div>
                      <ul className="space-y-2.5 mb-4">
                        {course.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-3 rounded-lg bg-[hsl(var(--accent-light))] border border-[hsl(var(--accent)/0.2)] mb-6">
                        <div className="text-xs font-semibold text-[hsl(var(--accent))] mb-1.5">Plus premium features:</div>
                        {course.premiumExtras.map(e => (
                          <div key={e} className="flex items-center gap-1.5 text-xs">
                            <Sparkles className="h-3 w-3 text-[hsl(var(--accent))] flex-shrink-0" /> {e}
                          </div>
                        ))}
                      </div>
                      <Link href="/auth/signup" className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] text-white hover:shadow-lg transition-all">
                        Get Started <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Fiqh Coming Soon */}
          {courseOfferings.filter(c => c.comingSoon).map((course) => (
            <motion.div key={course.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center opacity-80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] text-sm font-semibold mb-4">
                  <Clock className="h-4 w-4" /> Coming Soon
                </div>
                <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                <p className="text-[hsl(var(--muted-foreground))] mb-4 max-w-lg mx-auto">{course.description}</p>
                <div className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <Users className="h-4 w-4" /> Group Classes
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {course.features.map(f => (
                    <span key={f} className="px-3 py-1 rounded-full text-xs bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{f}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I try before subscribing?', a: 'Yes! Every new student gets a free 30-minute trial session with one of our scholars. No payment information required.' },
              { q: 'What is the difference between Basic and Premium?', a: 'Premium is simply an upgrade of the Basic course (+$5/month) that adds session recordings and a detailed end-of-month progress report. All other features are identical.' },
              { q: 'How are sessions conducted?', a: 'All sessions are conducted via Zoom in a private, one-on-one setting. You\'ll receive a unique meeting link before each session.' },
              { q: 'Can I change my lecturer?', a: 'Yes! You can request a lecturer change at any time. You\'ll get a trial session with a new lecturer before confirming the switch.' },
              { q: 'What is the cancellation policy?', a: 'Sessions can be rescheduled for free up to 12 hours before the start time. Cancellations within 12 hours count as a used session.' },
              { q: 'How do payments work?', a: 'We accept international cards via Stripe and local Sri Lankan payments via PayHere. All prices are displayed in your local currency.' },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm font-medium">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-4 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
