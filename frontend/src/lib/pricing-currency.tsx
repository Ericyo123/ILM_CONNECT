'use client';
import { FormSelect } from '@/components/ui/form-select';
import { useSyncExternalStore } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './api';
import { useAuth } from './auth-context';
import type { SubscriptionPlan } from './subscription-plans';
import { PRICING_REGIONS, currencyForCountry, isPricingCurrency, type PricingCurrencyCode } from './pricing-regions';
import { MobileCurrencySelector } from '@/components/mobile-currency-selector';

export interface PricingCurrency { code: string; region: string; lkrPerUnit: number; rateDate: string; source: string | null; fetchedAt: string | null; available: boolean; stale: boolean; }
export function usePricingCurrencies() {
  return useQuery<PricingCurrency[]>({ queryKey: ['pricingCurrencies'], queryFn: () => apiFetch('/subscriptions/currencies'), staleTime: 0, refetchOnWindowFocus: 'always', refetchInterval: 30000 });
}
const selections = new Map<string, PricingCurrencyCode>();
function readSelection(key: string) {
  const saved = selections.get(key);
  if (saved) return saved;
  try {
    const value = localStorage.getItem(key);
    return isPricingCurrency(value) ? value : null;
  } catch {
    return null;
  }
}
const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key) selections.delete(event.key);
    else selections.clear();
    callback();
  };
  window.addEventListener('ilm-currency', callback);
  window.addEventListener('storage', onStorage);
  return () => { window.removeEventListener('ilm-currency', callback); window.removeEventListener('storage', onStorage); };
};
export function usePricingCurrency() {
  const { user } = useAuth();
  const key = `ilm_currency_${user?.id || 'visitor'}`;
  const chosen = useSyncExternalStore(subscribe, () => readSelection(key), () => null);
  const visitor = useSyncExternalStore(subscribe, () => readSelection('ilm_currency_visitor'), () => null);
  const { data: profile } = useQuery<{ country?: string | null }>({ queryKey: ['studentProfile', user?.id], queryFn: () => apiFetch('/profile/student'), enabled: user?.role === 'STUDENT' });
  const { data: location } = useQuery<{ country: string | null }>({
    queryKey: ['pricingCountry'],
    queryFn: async () => {
      const response = await fetch('/api/geo', { cache: 'no-store' });
      if (!response.ok) throw new Error('Country detection unavailable');
      const data = await response.json();
      return { country: typeof data?.country === 'string' ? data.country : null };
    },
    enabled: !chosen && !visitor && !profile?.country,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
  const code = chosen ?? (profile?.country?.trim() ? currencyForCountry(profile.country) : visitor ?? currencyForCountry(location?.country ?? ''));
  const { data: currencies = [], isPending, isError } = usePricingCurrencies();
  const currency = currencies.find(item => item.code === code);
  const needsConversion = code !== 'LKR' && code !== 'USD';
  const amount = (plan: SubscriptionPlan) => {
    if (needsConversion && (isError || !currency?.available || currency.stale)) return null;
    return plan.prices?.[code] ?? null;
  };
  const formatAmount = (value: number | null) => {
    if (needsConversion && isPending) return 'Loading prices…';
    if (value === null) return 'Price unavailable';
    return new Intl.NumberFormat('en', { style: 'currency', currency: code, currencyDisplay: 'symbol' }).format(value);
  };
  const format = (plan: SubscriptionPlan) => formatAmount(amount(plan));
  const difference = (higher: SubscriptionPlan, lower: SubscriptionPlan) => {
    const high = amount(higher), low = amount(lower);
    return formatAmount(high === null || low === null ? null : Math.round((high - low) * 100) / 100);
  };
  const select = (value: string) => {
    if (!isPricingCurrency(value)) return;
    selections.set(key, value);
    try { localStorage.setItem(key, value); } catch { /* Keep the selection for this visit when storage is blocked. */ }
    window.dispatchEvent(new Event('ilm-currency'));
  };
  return { code, currency, currencies, format, amount, difference, select, isPending, isError };
}
export function CurrencySelector({ mobileMenu = false }: { mobileMenu?: boolean } = {}) {
  const { code, currency, select, isPending, isError } = usePricingCurrency();
  const queryClient = useQueryClient();
  const needsConversion = code !== 'LKR' && code !== 'USD';
  const unavailable = needsConversion && !isPending && (isError || !currency?.available || currency.stale);
  const retry = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ['pricingCurrencies'] }),
    queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] }),
  ]);
  return <div className={`inline-flex max-w-full flex-col gap-2 text-left text-sm ${mobileMenu ? 'w-full sm:w-auto' : ''}`}>
    {mobileMenu && <MobileCurrencySelector code={code} onSelect={select} />}
    <label className={`${mobileMenu ? 'hidden sm:flex' : 'flex'} max-w-full flex-wrap items-center gap-2 font-medium text-[#095F46]`}>
      Country / currency
      <FormSelect aria-label="Country and pricing currency" value={code} onChange={event => select(event.target.value)} className="min-h-11 min-w-0 max-w-full rounded-lg border border-[#d6e0db] bg-white px-3 text-base text-[#202823] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#095F46]">
        {PRICING_REGIONS.map(item => <option key={item.code} value={item.code}>{item.region} · {item.code}</option>)}
      </FormSelect>
    </label>
    {needsConversion && isPending && <p role="status" className="text-[#56635c]">Loading exchange rates…</p>}
    {unavailable && <div role="alert" className="text-[#56635c]">
      <p>Current exchange rates are unavailable. Choose USD to view international prices, or try again.</p>
      <button type="button" onClick={retry} className="min-h-11 font-semibold text-[#095F46] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#095F46]">Retry prices</button>
    </div>}
  </div>;
}
