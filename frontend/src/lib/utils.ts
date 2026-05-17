import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'LKR'): string {
  const formats: Record<string, { locale: string; currency: string }> = {
    LKR: { locale: 'en-LK', currency: 'LKR' },
    USD: { locale: 'en-US', currency: 'USD' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    AUD: { locale: 'en-AU', currency: 'AUD' },
    SAR: { locale: 'ar-SA', currency: 'SAR' },
    AED: { locale: 'ar-AE', currency: 'AED' },
  };
  const fmt = formats[currency] || formats.LKR;
  return new Intl.NumberFormat(fmt.locale, {
    style: 'currency',
    currency: fmt.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}
