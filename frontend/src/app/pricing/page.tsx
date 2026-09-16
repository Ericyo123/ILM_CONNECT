'use client';

import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { courseOfferings } from '@/lib/mock-data';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function PricingPage() {
  return (
    <div className="py-20 lg:py-28 min-h-screen text-stone-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight text-stone-950">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto">
            Every learning path offers two paces: the Standard 8-session plan (2 per week) or the Fast Track 12-session plan (3 per week) to accelerate your progress.
          </p>
        </motion.div>

        {/* Course Cards */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {courseOfferings.filter(c => !c.comingSoon).map((course, i) => (
            <motion.div
              key={course.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="rounded-3xl border border-stone-200/90 bg-white/90 backdrop-blur-md p-6 sm:p-8 shadow-xl">
                <div className="mb-6 pb-5 border-b border-stone-100">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">{course.name}</h2>
                  <p className="text-stone-500 mt-1.5 text-sm">{course.description}</p>
                </div>
                <div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Standard Plan */}
                    <div className="p-7 rounded-2xl border border-stone-200/90 bg-stone-50/60 flex flex-col justify-between relative overflow-hidden transition-all hover:border-stone-300">
                      <div>
                        <div className="flex items-center gap-3.5 mb-5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white border border-stone-200 text-stone-900 shadow-xs font-extrabold text-base">
                            S
                          </div>
                          <div>
                            <div className="text-xl font-bold text-stone-950 tracking-tight">Standard Plan</div>
                            <div className="text-xs text-stone-500 font-medium">8 sessions/month · 2 per week</div>
                          </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                          {course.features.map((f) => (
                            <li key={f} className="flex items-start gap-3 text-sm">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white mt-0.5">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                              <span className="text-stone-700 text-sm font-medium">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-stone-200/70 mt-auto">
                        <div className="my-5 text-center">
                          <div className="inline-flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">${course.basicPriceUSD}</span>
                            <span className="text-sm font-medium text-stone-500">/Month</span>
                          </div>
                        </div>
                        <Link
                          href="/auth/signup"
                          className="w-full py-3.5 px-6 rounded-2xl text-center text-sm font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 active:scale-[0.99] transition-all block"
                        >
                          Subscribe
                        </Link>
                      </div>
                    </div>

                    {/* Fast Track Plan (Popular) */}
                    <div className="p-7 rounded-2xl border border-stone-800 bg-[#0f1416] text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all">
                      {/* Diagonal Popular Ribbon */}
                      <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
                        <div className="absolute top-5 right-[-35px] w-36 bg-emerald-400 text-stone-950 text-[11px] font-extrabold uppercase tracking-wider text-center py-1 rotate-45 shadow-md">
                          Popular
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-3.5 mb-5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-900 border border-stone-800 text-emerald-300 shadow-inner font-extrabold text-base">
                            F
                          </div>
                          <div>
                            <div className="text-xl font-bold text-white tracking-tight">Fast Track Plan</div>
                            <div className="text-xs text-stone-400 font-medium">12 sessions/month · 3 per week</div>
                          </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                          {course.features.filter(f => !f.includes('Standard')).map((f) => (
                            <li key={f} className="flex items-start gap-3 text-sm">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-stone-950 mt-0.5">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                              <span className="text-stone-300 text-sm font-medium">{f}</span>
                            </li>
                          ))}
                          {course.premiumExtras.map((e) => (
                            <li key={e} className="flex items-start gap-3 text-sm">
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-stone-950 mt-0.5">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                              <span className="text-stone-300 text-sm font-medium">{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-stone-800/60 mt-auto">
                        <div className="my-5 text-center">
                          <div className="inline-flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">${course.premiumPriceUSD}</span>
                            <span className="text-sm font-medium text-stone-400">/Month</span>
                          </div>
                        </div>
                        <Link
                          href="/auth/signup"
                          className="w-full py-3.5 px-6 rounded-2xl text-center text-sm font-bold text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-500 hover:from-emerald-800 hover:to-emerald-600 shadow-[0_0_24px_rgba(16,185,129,0.34)] hover:shadow-[0_0_32px_rgba(16,185,129,0.5)] active:scale-[0.99] transition-all block"
                        >
                          Subscribe
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold text-center mb-10 text-stone-950"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: 'Can I try before subscribing?', a: 'Yes! Every new student gets a free 30-minute trial session with one of our scholars. No payment information required.' },
              { q: 'What is the difference between Standard and Fast Track?', a: 'Standard gives you 8 sessions per month (2 sessions a week). Fast Track accelerates your learning with 12 sessions per month (3 sessions a week), plus session recordings.' },
              { q: 'How are sessions conducted?', a: 'All sessions are conducted via our built-in live video platform in a private, one-on-one setting. Simply click "Join" when your session starts.' },
              { q: 'Can I change my lecturer?', a: 'Yes! You can request a lecturer change at any time. You\'ll get a trial session with a new lecturer before confirming the switch.' },
              { q: 'What is the cancellation policy?', a: 'Sessions can be rescheduled for free up to 12 hours before the start time. Cancellations within 12 hours count as a used session.' },
              { q: 'How do payments work?', a: 'We accept international cards via Stripe and local Sri Lankan payments via PayHere. All prices are displayed in your local currency.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
              >
                <details className="group rounded-2xl border border-stone-200/90 bg-white/90 backdrop-blur-sm overflow-hidden shadow-2xs">
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm font-semibold text-stone-900 hover:text-stone-950">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-stone-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">{faq.a}</div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
