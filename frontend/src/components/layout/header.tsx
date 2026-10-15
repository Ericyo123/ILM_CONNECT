'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/pricing', label: 'PRICING' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  const isDarkHero =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/pricing' ||
    pathname === '/teach';

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const nextScrolled = scrolledRef.current
          ? window.scrollY > 12
          : window.scrollY > 48;

        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
      });
    };

    scrolledRef.current = window.scrollY > 48;
    setScrolled(scrolledRef.current);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const shouldHideHeader =
    pathname.startsWith('/student') ||
    pathname.startsWith('/lecturer') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth');

  if (shouldHideHeader) return null;

  // When not scrolled, pages with dark hero (Home & About) use white text/logo, while light pages use green/dark styling
  const showWhiteNav = !scrolled && isDarkHero;

  return (
    <div className="fixed top-4 sm:top-5 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 lg:px-12 pointer-events-none">
      {/* Floating Liquid Glass Pill Navbar (Transparent at top, rounded white pill on scroll across all pages) */}
      <header
        style={
          scrolled
            ? {
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }
            : {
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                backgroundColor: 'transparent',
              }
        }
        className={`pointer-events-auto flex w-full max-w-7xl xl:max-w-[1440px] items-center justify-between rounded-full px-5 transition-all duration-300 sm:px-7 lg:px-8 xl:px-9 ${
          scrolled
            ? 'min-h-[62px] border border-white/90 shadow-[0_12px_36px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1.5px_rgba(255,255,255,1)] sm:min-h-[64px] lg:min-h-[72px] xl:min-h-[74px]'
            : 'min-h-[66px] border border-transparent shadow-none sm:min-h-[68px] lg:min-h-[76px] xl:min-h-[80px]'
        }`}
      >
        <Link href="/" className="flex items-center" aria-label="ILMBIT home">
          <span className="relative block h-[52px] w-[40px] sm:h-[56px] sm:w-[42px] lg:h-[66px] lg:w-[50px] xl:h-[70px] xl:w-[53px]">
            <Image
              src="/images/ilmbit-logo-white.png"
              alt="ILMBIT"
              width={70}
              height={94}
              className={`absolute inset-0 h-full w-auto object-contain transition-[height,opacity] duration-300 ${
                showWhiteNav ? 'opacity-100' : 'opacity-0'
              } ${scrolled ? 'h-[44px] sm:h-[48px] lg:h-[56px] xl:h-[60px]' : 'h-[52px] sm:h-[56px] lg:h-[66px] xl:h-[70px]'}`}
              loading="eager"
              priority
            />
            <Image
              src="/images/ilmbit-logo-green.png"
              alt=""
              aria-hidden="true"
              width={70}
              height={94}
              className={`absolute inset-0 h-full w-auto object-contain transition-[height,opacity] duration-300 ${
                showWhiteNav ? 'opacity-0' : 'opacity-100'
              } ${scrolled ? 'h-[44px] sm:h-[48px] lg:h-[56px] xl:h-[60px]' : 'h-[52px] sm:h-[56px] lg:h-[66px] xl:h-[70px]'}`}
              loading="eager"
              priority
            />
          </span>
        </Link>

        {/* Right side: Desktop Links right-aligned with blended action buttons */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
          <nav className="flex h-11 lg:h-[52px] xl:h-[54px] items-center gap-6 lg:gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              let linkColorClass = '';
              if (showWhiteNav) {
                linkColorClass = isActive
                  ? '!font-light text-[#EAD08A]'
                  : '!font-light text-white/80 hover:text-white';
              } else if (scrolled) {
                linkColorClass = isActive
                  ? '!font-normal text-[#095F46]'
                  : '!font-light text-stone-600 hover:text-stone-950';
              } else {
                linkColorClass = isActive
                  ? '!font-normal text-[#095F46]'
                  : '!font-light text-stone-700 hover:text-stone-950';
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex h-full items-center text-xs lg:text-[15px] xl:text-[16px] tracking-[0.08em] uppercase transition-colors ${linkColorClass}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Blended Dual Action: White "Become a Tutor" with green text + Green "Get Started" with white text */}
          <div
            className={`group/cta flex h-11 lg:h-[52px] xl:h-[54px] items-stretch rounded-full border transition-all duration-200 shadow-sm ${
              showWhiteNav
                ? 'border-white bg-white'
                : 'border-[#095F46] bg-white'
            }`}
          >
            <Link
              href="/teach"
              className={`flex items-center rounded-l-full pl-4 sm:pl-5 lg:pl-6 xl:pl-7 pr-2.5 lg:pr-3.5 text-xs lg:text-[14px] xl:text-[15px] uppercase tracking-[0.02em] font-normal transition-colors duration-200 ${
                showWhiteNav
                  ? pathname === '/teach'
                    ? 'text-[#095F46]'
                    : 'text-[#095F46] hover:text-[#043f2e]'
                  : pathname === '/teach'
                  ? 'text-[#095F46]'
                  : 'text-[#095F46] hover:text-[#043f2e]'
              }`}
            >
              Become a Tutor
            </Link>

            <Link
              href="/about#waitlist"
              className={`-my-px -mr-px flex items-center rounded-full bg-[#095F46] px-5 lg:px-7 xl:px-8 text-xs lg:text-[14px] xl:text-[15px] font-normal uppercase tracking-[0.02em] text-white transition-colors duration-200 hover:bg-[#043f2e] shadow-sm ${
                showWhiteNav ? 'border border-white' : 'border border-[#095F46]'
              }`}
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className={`brand-icon-button transition-colors md:hidden ${
            showWhiteNav
              ? 'text-white/80 hover:bg-white/10 hover:text-white'
              : 'text-stone-800 hover:bg-stone-100/80'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Dropdown Menu with Glass Effect */}
      {mobileOpen && (
        <div
          style={
            showWhiteNav
              ? {
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  backgroundColor: 'rgba(12, 16, 15, 0.95)',
                }
              : {
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                }
          }
          className={`pointer-events-auto w-full max-w-7xl mt-2 rounded-2xl border shadow-xl p-4 md:hidden animate-fade-in ${
            showWhiteNav ? 'border-stone-800 text-white' : 'border-white/90 text-stone-900'
          }`}
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              let itemClass = '';
              if (showWhiteNav) {
                itemClass = isActive
                  ? 'text-[#EAD08A] bg-white/10 !font-light'
                  : 'text-stone-300 hover:text-white hover:bg-white/10 !font-light';
              } else {
                itemClass = isActive
                  ? 'text-stone-950 bg-stone-200/60 !font-normal'
                  : 'text-stone-700 hover:bg-stone-100/70 !font-light';
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-xs tracking-[0.08em] uppercase transition-colors ${itemClass}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div
              className={`pt-3 mt-2 border-t space-y-2 ${
                showWhiteNav ? 'border-stone-800' : 'border-stone-200/60'
              }`}
            >
              <Link
                href="/teach"
                onClick={() => setMobileOpen(false)}
                className={`block w-full py-2.5 px-4 rounded-xl text-center text-xs tracking-[0.02em] uppercase transition-colors border ${
                  showWhiteNav
                    ? 'border-white bg-white text-[#095F46] font-normal hover:bg-stone-50'
                    : 'border-[#095F46] bg-white text-[#095F46] font-normal hover:bg-stone-50'
                }`}
              >
                Become a Tutor
              </Link>
              <Link
                href="/about#waitlist"
                onClick={() => setMobileOpen(false)}
                className="brand-button brand-button-primary w-full text-xs tracking-[0.02em] uppercase !font-normal"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

