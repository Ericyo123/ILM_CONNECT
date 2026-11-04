import assert from 'node:assert/strict';
import { test } from 'node:test';
import { currencyForCountry, isPricingCurrency } from '../src/lib/pricing-regions.ts';

test('recognizes supported countries from profile names and country codes', () => {
  for (const [countries, expected] of [
    [['LK', 'lka', ' Sri Lanka '], 'LKR'],
    [['GB', 'UK', 'gbr', 'United Kingdom', 'Great Britain'], 'GBP'],
    [['AU', 'aus', 'Australia'], 'AUD'],
    [['DE', 'Germany', 'France', 'IE', 'Spain', 'Europe'], 'EUR'],
    [['US', 'United States', 'Canada', 'Switzerland', 'Sweden', 'India', ''], 'USD'],
  ]) {
    for (const country of countries) assert.equal(currencyForCountry(country), expected, country);
  }
});

test('rejects unsupported and corrupted saved currencies', () => {
  for (const value of ['LKR', 'USD', 'GBP', 'EUR', 'AUD']) assert.equal(isPricingCurrency(value), true);
  for (const value of ['CAD', 'usd', '', null, undefined, {}, 1]) assert.equal(isPricingCurrency(value), false);
});
