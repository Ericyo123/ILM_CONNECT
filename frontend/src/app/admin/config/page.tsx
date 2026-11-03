'use client';
import { useSubscriptionPlans } from '@/lib/subscription-plans';
import MonthlyTuitionCalculator from '@/components/pricing/monthly-tuition-calculator';

export default function AdminConfigPage() {
  const { data: plans = [], isPending, isError, refetch } = useSubscriptionPlans(false);
  if (isPending) return <p role="status">Loading configuration…</p>;
  if (isError) return <p role="alert">Unable to load configuration. <button onClick={() => refetch()} className="underline">Retry</button></p>;
  if (!plans.length) return <p>No subscription plans have been configured.</p>;
  return <div className="w-full space-y-5">
    <MonthlyTuitionCalculator />
    <section className="rounded-xl border border-[#d6e0db] bg-white p-5 text-[#202823]"><h2 className="font-semibold">Internal lecturer payout policy</h2><p className="mt-2 text-sm leading-6 text-[#56635c]">Each paid student earns their lecturer LKR 1,500 per month for Sri Lanka, or LKR 3,000 per month for international students, including Fast Track. Duo and Trio tuition discounts do not reduce lecturer earnings. Trials do not earn payouts. Record received tuition and prepare monthly payouts in Finance.</p><p className="mt-2 text-sm leading-6 text-[#56635c]">Prices follow the ILMBIT policy shown above. International Fast Track has no Sri Lankan price.</p></section>
    <p className="text-sm text-[#56635c]">Exchange rates update automatically in the backend. View the rate, its date and converted amounts in Finance.</p>
    <section className="rounded-xl border border-[#d6e0db] bg-white p-5"><h2 className="font-semibold">Session & scheduling rules</h2><dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">{[['Session duration', '40 minutes'], ['Standard sessions', '8 per month'], ['Fast Track sessions', '12 per month'], ['Booking notice', '12 hours'], ['Free rescheduling notice', '12 hours']].map(([label, value]) => <div key={label}><dt className="text-sm text-[#56635c]">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl></section>
  </div>;
}
