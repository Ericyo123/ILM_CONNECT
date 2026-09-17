'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Courses', href: '/#courses' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Free Trial', href: '/auth/signup' },
  ],

  Support: [
    { label: 'About Us', href: '/about' },
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const shouldHide =
    pathname.startsWith('/student') ||
    pathname.startsWith('/lecturer') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth');

  if (shouldHide) return null;
  return (
    <footer className="bg-gradient-to-br from-[#071412] via-[#0c211e] to-[#112f2a] border-t border-emerald-300/15 text-white select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#095F46] shadow-xs">
                <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                <span className="text-gradient-primary">Ilm</span>
                <span>Connect</span>
              </span>
            </Link>
            <p className="text-sm text-emerald-50/68 max-w-sm mb-6 leading-relaxed">
              Connecting qualified Islamic scholars with students worldwide. 
              Structured, professional, one-on-one Islamic education from the comfort of your home.
            </p>
            <div className="space-y-2 text-sm text-emerald-50/72">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-300/80" />
                <span>support@ilmconnect.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-300/80" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-4 text-white">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-emerald-50/62 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-emerald-50/45" suppressHydrationWarning>
            © {new Date().getFullYear()} IlmConnect. All rights reserved.
          </p>
          <p className="text-xs text-emerald-50/45 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </footer>
  );
}
