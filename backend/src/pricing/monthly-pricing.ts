import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const MONTHLY_POLICY = {
  localFeeLkr: 5500,
  standardFeeUsd: 49,
  fastTrackFeeUsd: 69,
  localPayoutLkr: 1500,
  internationalPayoutLkr: 3000,
  discounts: [0, 0, 10, 15],
} as const;

export function studentRegion(country: string): 'LK' | 'INTERNATIONAL' {
  if (!country?.trim()) throw new BadRequestException('Set the student country before recording tuition');
  return ['lk', 'lka', 'sri lanka'].includes(country.trim().toLowerCase()) ? 'LK' : 'INTERNATIONAL';
}

export function money(value: Prisma.Decimal.Value) {
  return new Prisma.Decimal(value).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP).toNumber();
}

export function monthlyQuote(tier: string, region: string, packageSize: number) {
  if (!['Standard', 'Fast Track'].includes(tier)) throw new BadRequestException('Choose a Standard or Fast Track plan');
  if (!['LK', 'INTERNATIONAL'].includes(region)) throw new BadRequestException('Choose Sri Lanka or International');
  if (![1, 2, 3].includes(packageSize)) throw new BadRequestException('Packages must contain one, two, or three students');
  if (region === 'LK' && tier === 'Fast Track') throw new BadRequestException('Fast Track is available for international students only');
  const baseFee = region === 'LK' ? MONTHLY_POLICY.localFeeLkr : tier === 'Fast Track' ? MONTHLY_POLICY.fastTrackFeeUsd : MONTHLY_POLICY.standardFeeUsd;
  const discountPercent = MONTHLY_POLICY.discounts[packageSize];
  const feePerStudent = money(new Prisma.Decimal(baseFee).mul(100 - discountPercent).div(100));
  return {
    currency: region === 'LK' ? 'LKR' : 'USD',
    packageSize,
    baseFee,
    discountPercent,
    discountPerStudent: money(new Prisma.Decimal(baseFee).minus(feePerStudent)),
    feePerStudent,
    total: money(new Prisma.Decimal(feePerStudent).mul(packageSize)),
  };
}

export function colomboMonth(now = new Date()) {
  return new Date(now.getTime() + 330 * 60000).toISOString().slice(0, 7);
}

export function monthPeriod(month: string) {
  if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || month < '2020-01' || month > '2100-12') throw new BadRequestException('Choose a valid billing month (YYYY-MM)');
  const [year, number] = month.split('-').map(Number);
  return {
    start: new Date(Date.UTC(year, number - 1, 1) - 330 * 60000),
    end: new Date(Date.UTC(year, number, 1) - 330 * 60000),
  };
}
