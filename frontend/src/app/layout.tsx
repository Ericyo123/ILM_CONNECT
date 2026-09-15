import type { Metadata } from 'next';
import { Inter, Cinzel, Amiri } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IlmConnect — Online Islamic Education Platform',
    template: '%s | IlmConnect',
  },
  description:
    'Connect with qualified Islamic scholars for personalized 1:1 Quran, Hadith, Fiqh, and Arabic lessons. Structured learning from the comfort of your home.',
  keywords: [
    'Islamic education',
    'online Quran classes',
    'Quran teacher',
    'Hadith studies',
    'Fiqh',
    'Arabic language',
    'Islamic tutor',
    'Hifz program',
    'Tajweed',
    'Muslim education',
  ],
  authors: [{ name: 'IlmConnect' }],
  openGraph: {
    title: 'IlmConnect — Online Islamic Education Platform',
    description: 'Connect with qualified Islamic scholars for personalized 1:1 lessons.',
    siteName: 'IlmConnect',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} ${amiri.variable} font-sans antialiased bg-sanctuary-light text-stone-900 min-h-screen`} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
