export const PRICING_REGIONS = [
  { code: 'LKR', region: 'Sri Lanka' },
  { code: 'USD', region: 'United States / International' },
  { code: 'GBP', region: 'United Kingdom' },
  { code: 'EUR', region: 'Euro area' },
  { code: 'AUD', region: 'Australia' },
] as const;

export type PricingCurrencyCode = typeof PRICING_REGIONS[number]['code'];

export function isPricingCurrency(value: unknown): value is PricingCurrencyCode {
  return PRICING_REGIONS.some(region => region.code === value);
}

const euroCountries = new Set(['eu', 'europe', 'at', 'austria', 'be', 'belgium', 'bg', 'bulgaria', 'hr', 'croatia', 'cy', 'cyprus', 'ee', 'estonia', 'fi', 'finland', 'fr', 'france', 'de', 'germany', 'gr', 'greece', 'ie', 'ireland', 'it', 'italy', 'lv', 'latvia', 'lt', 'lithuania', 'lu', 'luxembourg', 'mt', 'malta', 'nl', 'netherlands', 'pt', 'portugal', 'sk', 'slovakia', 'si', 'slovenia', 'es', 'spain']);

export function currencyForCountry(value: string): PricingCurrencyCode {
  const country = value.trim().toLowerCase();
  if (['lk', 'lka', 'sri lanka'].includes(country)) return 'LKR';
  if (['uk', 'gb', 'gbr', 'united kingdom', 'great britain'].includes(country)) return 'GBP';
  if (['au', 'aus', 'australia'].includes(country)) return 'AUD';
  return euroCountries.has(country) ? 'EUR' : 'USD';
}

