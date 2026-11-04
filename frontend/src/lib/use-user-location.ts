'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth-context';
import { apiFetch } from './api';

export interface UserLocation {
  country: string;
  region: 'LK' | 'INTERNATIONAL';
  isSriLanka: boolean;
  currency: 'LKR' | 'USD';
  vpnDetected: boolean;
  isLoading: boolean;
  formatPrice: (lkr: number | null | undefined, usd: number | null | undefined) => string;
}

export function useUserLocation(): UserLocation {
  const { user } = useAuth();

  // If authenticated student, retrieve profile country
  const { data: profile } = useQuery<{ country?: string | null }>({
    queryKey: ['studentProfileCountry', user?.id],
    queryFn: () => apiFetch('/profile/student'),
    enabled: user?.role === 'STUDENT',
    staleTime: 10 * 60 * 1000,
  });

  // Client hints: Timezone and locale
  let clientTz = '';
  let clientLocale = '';
  if (typeof window !== 'undefined') {
    try {
      clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      clientLocale = navigator.language || '';
    } catch {
      // Fallback
    }
  }

  const { data: geoData, isLoading } = useQuery({
    queryKey: ['userGeoLocation', clientTz, clientLocale],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (clientTz) params.set('tz', clientTz);
      if (clientLocale) params.set('loc', clientLocale);
      const res = await fetch(`/api/geo?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Geo detection failed');
      return (await res.json()) as {
        country: string;
        region: 'LK' | 'INTERNATIONAL';
        isSriLanka: boolean;
        currency: 'LKR' | 'USD';
        vpnDetected: boolean;
      };
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });

  // Determine final country and region
  const profileCountry = profile?.country?.trim().toLowerCase();
  const profileIsLk = profileCountry ? ['lk', 'lka', 'sri lanka'].includes(profileCountry) : null;

  const isSriLanka = profileIsLk !== null ? profileIsLk : (geoData?.isSriLanka ?? (clientTz.includes('Colombo')));
  const region: 'LK' | 'INTERNATIONAL' = isSriLanka ? 'LK' : 'INTERNATIONAL';
  const currency: 'LKR' | 'USD' = isSriLanka ? 'LKR' : 'USD';
  const country = profile?.country || geoData?.country || (isSriLanka ? 'LK' : 'US');
  const vpnDetected = geoData?.vpnDetected ?? false;

  const formatPrice = (lkr: number | null | undefined, usd: number | null | undefined): string => {
    if (isSriLanka) {
      if (lkr == null) return 'Not available';
      return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0,
      }).format(lkr);
    } else {
      if (usd == null) return 'Not available';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(usd);
    }
  };

  return {
    country,
    region,
    isSriLanka,
    currency,
    vpnDetected,
    isLoading,
    formatPrice,
  };
}
