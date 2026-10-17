'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export const publicPageFadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

interface PublicPageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imageAlt: string;
  imageClassName: string;
  overlay: ReactNode;
  scrollTarget?: string;
  scrollLabel?: string;
  className?: string;
}

export default function PublicPageHero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  imageClassName,
  overlay,
  className,
}: PublicPageHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={`relative min-h-[48vh] sm:min-h-[52vh] lg:min-h-[56vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none py-20 sm:py-24 lg:py-28 ${className || ''}`}>
      <div className="absolute inset-0 z-0">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={imageClassName} />
        {overlay}
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : 'hidden'}
        animate="visible"
        variants={publicPageFadeUp}
        className="relative z-20 w-full px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center"
      >
        <div className="relative mx-auto max-w-4xl w-full">
          <h1 className="text-3xl sm:text-4xl lg:text-[50px] xl:text-[56px] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] drop-shadow-md max-w-3xl mx-auto font-heading">
            <span className="block text-white">{title}</span>
            {subtitle && (
              <span className="block text-[#EAD08A] font-serif italic text-2xl sm:text-3xl lg:text-[38px] xl:text-[44px] font-normal mt-1 sm:mt-1.5 leading-[1.12] sm:leading-[1.14] lg:leading-[1.15] drop-shadow-sm">
                {subtitle}
              </span>
            )}
          </h1>

          {description && (
            <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-[18px] text-stone-200/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
