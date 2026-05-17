import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'How It Works', href: '/about' },
    { label: 'Our Scholars', href: '/lecturers' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Free Trial', href: '/auth/signup' },
  ],
  Subjects: [
    { label: 'Quran Recitation', href: '/lecturers?subject=quran' },
    { label: 'Quran Memorization', href: '/lecturers?subject=hifz' },
    { label: 'Hadith Studies', href: '/lecturers?subject=hadith' },
    { label: 'Fiqh & Islamic Law', href: '/lecturers?subject=fiqh' },
    { label: 'Arabic Language', href: '/lecturers?subject=arabic' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
                <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gradient-primary">Ilm</span>
                <span>Connect</span>
              </span>
            </Link>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6 leading-relaxed">
              Connecting qualified Islamic scholars with students worldwide. 
              Structured, professional, one-on-one Islamic education from the comfort of your home.
            </p>
            <div className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@ilmconnect.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
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
        <div className="mt-12 pt-8 border-t border-[hsl(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            © {new Date().getFullYear()} IlmConnect. All rights reserved.
          </p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </footer>
  );
}
