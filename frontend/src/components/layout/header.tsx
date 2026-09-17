'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  BookOpen,
  Menu,
  X,
  LogIn,
} from 'lucide-react';

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

  // On home page, hide default header while at top so the hero's navigation is showcased
  const isHome = pathname === '/';
  if (isHome && !scrolled) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[linear-gradient(120deg,rgba(240,250,246,0.85),rgba(226,241,236,0.78),rgba(249,247,240,0.8))] backdrop-blur-2xl shadow-[0_10px_34px_rgba(15,76,68,0.06)] transition-all duration-300 animate-fade-in supports-[backdrop-filter]:bg-[linear-gradient(120deg,rgba(240,250,246,0.78),rgba(226,241,236,0.68),rgba(249,247,240,0.7))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 shadow-xs transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-stone-950">Ilm</span>
              <span className="text-emerald-700">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors ${
                  pathname === link.href
                    ? 'text-emerald-700 font-bold'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Sign In (No Icon) + Pill Get Started Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-950 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 rounded-full text-xs uppercase tracking-wider font-bold text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-600 hover:from-[hsl(var(--primary-hover))] hover:to-emerald-700 shadow-[0_2px_12px_rgba(15,118,110,0.22)] hover:scale-105 active:scale-100 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-800 hover:bg-white/55"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-emerald-900/10 bg-white/75 backdrop-blur-2xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[hsl(var(--primary))] bg-emerald-50'
                    : 'text-stone-600 hover:bg-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-emerald-900/10 flex gap-2">
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 text-center rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2.5 text-center rounded-full text-xs font-bold text-white bg-gradient-to-r from-[hsl(var(--primary))] to-emerald-600 shadow-md uppercase tracking-wider"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
