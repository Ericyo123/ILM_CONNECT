'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import {
  BookOpen,
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Clock,
  FileText,
  CreditCard,
  Settings,
  Users,
  BarChart3,
  Shield,
  Sliders,
  ClipboardList,
  DollarSign,
  CalendarClock,
  Star,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const studentNav: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/book', label: 'Book Session', icon: Calendar },
  { href: '/student/sessions', label: 'My Sessions', icon: Clock },
  { href: '/student/billing', label: 'Billing', icon: CreditCard },
  { href: '/student/settings', label: 'Settings', icon: Settings },
];

const lecturerNav: NavItem[] = [
  { href: '/lecturer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lecturer/availability', label: 'Availability', icon: CalendarClock },
  { href: '/lecturer/sessions', label: 'Sessions', icon: Clock },
  { href: '/lecturer/students', label: 'My Students', icon: GraduationCap },
  { href: '/lecturer/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/lecturer/settings', label: 'Settings', icon: Settings },
];

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users, badge: '3' },
  { href: '/admin/sessions', label: 'Sessions', icon: Clock },
  { href: '/admin/finance', label: 'Finance', icon: BarChart3 },
  { href: '/admin/config', label: 'Configuration', icon: Sliders },
  { href: '/admin/audit', label: 'Audit Log', icon: Shield },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  let navItems: NavItem[] = [];
  let roleName = '';
  let userName = '';

  if (pathname.startsWith('/student')) {
    navItems = studentNav;
    roleName = 'Student';
    userName = 'Aisha Khan';
  } else if (pathname.startsWith('/lecturer')) {
    navItems = lecturerNav;
    roleName = 'Lecturer';
    userName = 'Sheikh Ahmed Al-Farsi';
  } else if (pathname.startsWith('/admin')) {
    navItems = adminNav;
    roleName = 'Administrator';
    userName = 'Super Admin';
  }

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(168,65%,45%)] to-[hsl(168,50%,55%)] flex-shrink-0">
          <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-[hsl(var(--sidebar-foreground))] tracking-tight">
            IlmConnect
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]'
                  : 'text-[hsl(var(--sidebar-foreground)/0.7)] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent)/0.5)]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-2 space-y-1">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[hsl(var(--sidebar-foreground)/0.7)] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent)/0.5)] transition-colors"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 flex-shrink-0" />
          )}
          {!collapsed && <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User info */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))] text-xs font-bold flex-shrink-0">
              {userName.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] truncate">{userName}</p>
              <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.5)]">{roleName}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[hsl(var(--sidebar-foreground)/0.5)] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent)/0.5)] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
