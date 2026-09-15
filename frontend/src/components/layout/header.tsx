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
  { href: '/about', label: 'About' },
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
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[linear-gradient(120deg,rgba(240,250,246,0.82),rgba(226,241,236,0.72),rgba(249,247,240,0.76))] backdrop-blur-2xl shadow-[0_10px_34px_rgba(15,76,68,0.08)] transition-all duration-300 animate-fade-in supports-[backdrop-filter]:bg-[linear-gradient(120deg,rgba(240,250,246,0.72),rgba(226,241,236,0.58),rgba(249,247,240,0.62))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] shadow-md transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient-primary">Ilm</span>
              <span className="text-[hsl(var(--foreground))]">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[hsl(var(--primary))] bg-white/65 shadow-sm'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-white/45'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-950 hover:bg-white/45 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:from-[hsl(168,80%,22%)] hover:to-[hsl(168,60%,30%)] shadow-md hover:shadow-lg transition-all"
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
            <div className="pt-3 mt-3 border-t border-emerald-900/10 flex flex-col gap-2">
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-center text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]"
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
