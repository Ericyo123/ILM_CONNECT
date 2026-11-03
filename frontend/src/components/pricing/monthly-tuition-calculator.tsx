'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSubscriptionPlans } from '@/lib/subscription-plans';
import styles from './monthly-pricing.module.css';
import { TuitionSelect } from '@/components/ui/tuition-select';

export interface TuitionQuote {
  currency: string; packageSize: number; baseFee: number; discountPercent: number;
  feePerStudent: number; discountPerStudent: number; total: number;
}
export const currencyAmount = (value: number, currency = 'LKR') => new Intl.NumberFormat('en-LK', { style: 'currency', currency, currencyDisplay: 'code' }).format(value);
export const billingMonthNow = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 7);

export default function MonthlyTuitionCalculator({ pricingRegion, onRegionChange }: { pricingRegion?: string; onRegionChange?: (region: string) => void } = {}) {
  const { data: plans = [], isPending, isError, refetch } = useSubscriptionPlans(false);
  const [ownRegion, setOwnRegion] = useState('LK');
  const region = pricingRegion ?? ownRegion;
  const setRegion = onRegionChange ?? setOwnRegion;
  const [planId, setPlanId] = useState('');
  const [packageSize, setPackageSize] = useState(1);
  const available = plans.filter(plan => region !== 'LK' || plan.tier === 'Standard');
  const selected = available.find(plan => plan.id === planId) ?? available[0];
  const quote = useQuery<TuitionQuote>({
    queryKey: ['tuitionQuote', selected?.id, region, packageSize],
    queryFn: () => apiFetch('/subscriptions/quote', { method: 'POST', body: JSON.stringify({ planId: selected?.id, region, packageSize }) }),
    enabled: !!selected,
  });
  return <section className={`${styles.panel} ${styles.calculator}`} aria-labelledby="tuition-calculator-title">
    <div className={styles.calculatorHeading}>
      <h2 id="tuition-calculator-title">Your monthly tuition</h2>
      <p>Choose your location, package and course. Each student has private, one-to-one lessons.</p>
    </div>
    <div className={styles.split}>
      <div>
        {isPending ? <p role="status" className={styles.help}>Loading plans…</p> : isError ? <p role="alert" className={styles.error}>Unable to load plans. <button className={styles.button} onClick={() => refetch()}>Retry plans</button></p> : !plans.length ? <p className={styles.help}>No tuition plans are configured yet.</p> : <div className={styles.calculatorFields}>
          <TuitionSelect label="Student location" value={region} onValueChange={setRegion} options={[
            { value: 'LK', label: 'Sri Lanka', description: 'Monthly tuition in LKR' },
            { value: 'INTERNATIONAL', label: 'International', description: 'Monthly tuition in USD' },
          ]} />
          <TuitionSelect label="Tuition package" value={String(packageSize)} onValueChange={value => setPackageSize(Number(value))} options={[
            { value: '1', label: 'Solo', description: '1 student · No package discount' },
            { value: '2', label: 'Duo', description: '2 students · Save 10%' },
            { value: '3', label: 'Trio', description: '3 students · Save 15%' },
          ]} />
          <TuitionSelect label="Course and pace" value={selected?.id ?? ''} onValueChange={setPlanId} fullWidth options={available.map(plan => ({ value: plan.id, label: `${plan.course} · ${plan.tier}`, description: `${plan.sessions / 4} private sessions per week` }))} />
        </div>}
        <p className={`${styles.help} ${styles.packageNote}`}>Duo and Trio include separate private lessons for each student, with no group classes.</p>
        <p className={styles.help}>Sri Lankan tuition: LKR 5,500 per student/month. International: USD 49 for Noorani Qaida, Tajweed or Hifz. International Fast Track: USD 69, with 3 sessions/week.</p>
      </div>
      <div className={styles.calculation} aria-live="polite" aria-busy={quote.isFetching}>
        <h3>Monthly breakdown</h3>
        {!!selected && quote.isPending && <p role="status" className={styles.help}>Calculating tuition…</p>}
        {quote.isError && <p role="alert" className={styles.error}>Unable to calculate tuition. <button className={styles.button} onClick={() => quote.refetch()}>Retry calculation</button></p>}
        {quote.data && <>
          <dl className={styles.rows}>
            <div className={styles.row}><dt>Monthly fee per student</dt><dd>{currencyAmount(quote.data.baseFee, quote.data.currency)}</dd></div>
            <div className={styles.row}><dt>Package discount per student ({quote.data.discountPercent}%)</dt><dd>{currencyAmount(quote.data.discountPerStudent, quote.data.currency)}</dd></div>
            <div className={styles.row}><dt>Each student pays</dt><dd>{currencyAmount(quote.data.feePerStudent, quote.data.currency)}</dd></div>
            <div className={`${styles.row} ${styles.total}`}><dt>Total per month · {packageSize} {packageSize === 1 ? 'student' : 'students'}</dt><dd>{currencyAmount(quote.data.total, quote.data.currency)}</dd></div>
          </dl>
          <p className={styles.help}>All students in a package use the same plan and pricing region. Each has their own one-to-one lessons.</p>
        </>}
      </div>
    </div>
  </section>;
}
