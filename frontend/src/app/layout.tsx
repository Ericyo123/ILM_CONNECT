import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
