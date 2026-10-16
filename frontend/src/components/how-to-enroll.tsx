'use client';

import { motion } from 'framer-motion';

interface EnrollStep {
  step: string;
  title: string;
  desc: string;
}

const enrollSteps: EnrollStep[] = [
  {
    step: '01',
    title: 'Create Student Profile',
    desc: 'Register in 2 minutes. Specify your Arabic literacy level, learning goals, and weekly preferred schedule.',
  },
  {
    step: '02',
    title: 'Select Course Plan',
    desc: 'Choose from Noorani Qaida phonetics, Tajweed Quran recitation, or intensive Hifz memorization.',
  },
  {
    step: '03',
    title: 'Match With a Verified Scholar',
    desc: 'Our academic team pairs you with a Sanad-certified Islamic scholar tailored to your timezone and personal pace.',
  },
  {
    step: '04',
    title: 'Begin Live 1:1 Guided Lessons',
    desc: 'Attend interactive video classes in your private virtual classroom with Tajweed correction and progress tracking.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HowToEnroll() {
  return (
    <div className="relative w-full">
      {/* Editorial Timeline Container inspired by user reference */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative w-full pt-1"
      >
        {/* Continuous Vertical Timeline Line */}
        <div
          aria-hidden="true"
          className="absolute left-[15px] sm:left-[21px] top-3.5 bottom-6 w-[2px] bg-gradient-to-b from-[#EAD08A] via-emerald-400/40 to-emerald-500/10 pointer-events-none"
        />

        <div className="space-y-7 sm:space-y-9">
          {enrollSteps.map((item) => (
            <motion.div
              key={item.step}
              variants={itemVariants}
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
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#EAD08A] drop-shadow-sm">
                    {item.step}
                  </span>
                  <h3 className="text-base sm:text-lg lg:text-[21px] font-bold text-white tracking-tight leading-snug group-hover:text-emerald-100 transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-1 text-xs sm:text-sm lg:text-[14.5px] text-emerald-100/75 leading-relaxed font-normal italic font-serif">
                  ( {item.desc} )
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
