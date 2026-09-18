'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldHideHeader =
    pathname.startsWith('/student') ||
    pathname.startsWith('/lecturer') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth');

  if (shouldHideHeader) return null;

  // On home page, hide default header while at top so the hero's transparent navigation is showcased
  const isHome = pathname === '/';
  if (isHome && !scrolled) return null;

  return (
    <div className="fixed top-4 sm:top-5 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 lg:px-12 pointer-events-none">
      {/* Floating Liquid Glass Pill Navbar (max-w-7xl to match hero navbar) */}
      <header
        style={{
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
        }}
        className="pointer-events-auto w-full max-w-7xl rounded-full border border-white/90 shadow-[0_12px_36px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_1.5px_rgba(255,255,255,1)] px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-[box-shadow,border-color] duration-200"
      >
        {/* Left: Brand Identity with unified brand green */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#095F46] p-1.5 shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
            <Image
              src="/images/ilmbit-icon-white.png"
              alt="Ilmbit Logo"
              width={30}
              height={30}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            <span className="text-stone-950">Ilm</span>
            <span className="text-[#095F46]">bit</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-wider transition-colors ${
                pathname === link.href
                  ? 'text-stone-950 font-extrabold'
                  : 'text-stone-700 hover:text-stone-950 font-bold'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Soft Pill Sign In + Solid Brand Green Pill Get Started) */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/auth/signin"
            className="px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-bold text-stone-900 bg-stone-100/95 hover:bg-stone-200 border border-stone-200/80 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 sm:px-6 py-2 rounded-full text-xs uppercase tracking-wider font-bold text-white bg-[#095F46] hover:bg-[#074c38] shadow-sm hover:scale-105 active:scale-100 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-full text-stone-800 hover:bg-stone-100/80 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Dropdown Menu with Liquid Glass Effect */}
      {mobileOpen && (
        <div
          style={{
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
          }}
          className="pointer-events-auto w-full max-w-7xl mt-2 rounded-2xl border border-white/90 shadow-xl p-4 md:hidden"
        >
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? 'text-stone-950 bg-stone-200/60 font-bold'
                    : 'text-stone-700 hover:bg-stone-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-stone-200/60 flex gap-2">
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 text-center rounded-full text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 text-center rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#095F46] hover:bg-[#074c38] shadow-sm transition-all"
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
