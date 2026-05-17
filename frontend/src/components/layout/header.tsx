'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import {
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogIn,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboard =
    pathname.startsWith('/student') ||
    pathname.startsWith('/lecturer') ||
    pathname.startsWith('/admin');

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 glass">
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
                    ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary-light))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
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
            className="md:hidden p-2 rounded-lg text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary-light))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-[hsl(var(--border))] flex flex-col gap-2">
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
