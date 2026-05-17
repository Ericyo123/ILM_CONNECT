'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import { Bell, Sun, Moon, BookOpen, LogOut, Inbox } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function DashboardTopbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  let pageTitle = 'Dashboard';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    pageTitle = segments[segments.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const handleLogout = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setShowLogoutToast(true);
    setTimeout(() => { router.push('/'); }, 1500);
  };

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 lg:px-6 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))/0.9] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
              <BookOpen className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <Bell className="h-5 w-5" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                  <span className="font-semibold text-sm">Notifications</span>
                </div>
                <div className="py-8 px-4 flex flex-col items-center text-center">
                  <Inbox className="h-10 w-10 text-[hsl(var(--muted-foreground)/0.4)] mb-3" />
                  <p className="text-sm font-medium mb-1">No notifications yet</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">You&apos;ll see updates about your sessions and account here.</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {showLogoutToast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in">
          <div className="px-5 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg flex items-center gap-2 text-sm font-medium">
            <LogOut className="h-4 w-4 text-[hsl(var(--success))]" />
            You have been logged out
          </div>
        </div>
      )}
    </>
  );
}
