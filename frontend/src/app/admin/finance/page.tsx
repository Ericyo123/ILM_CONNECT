'use client';

import { Download, CheckCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { downloadCsv } from '@/lib/download';
import { toast } from '@/components/ui/toast';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ExchangeRatesPanel } from '@/components/admin/exchange-rates-panel';
import { useState } from 'react';
import { MonthlyTuitionPanel } from '@/components/admin/monthly-tuition-panel';
import { currencyAmount } from '@/components/pricing/monthly-tuition-calculator';
import pricingStyles from '@/components/pricing/monthly-pricing.module.css';

export default function AdminFinancePage() {
  const queryClient = useQueryClient();
  const [busyPayout, setBusyPayout] = useState<string | null>(null);
  const [month, setMonth] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [payoutMessage, setPayoutMessage] = useState('');
  const [payoutError, setPayoutError] = useState('');
  const { data: finance, isLoading, isError: financeError } = useQuery({
    queryKey: ['adminFinance'],
    queryFn: () => apiFetch('/admin/finance'),
    refetchInterval: 30000,
  });

  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => apiFetch('/admin/stats'),
  });

  const handleProcessPayout = async (id: string, status: 'SUCCESSFUL' | 'FAILED') => {
    setBusyPayout(id);
    setPayoutError('');
    try {
      await apiFetch(`/admin/payouts/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await queryClient.invalidateQueries({ queryKey: ['adminFinance'] });
      await queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success(status === 'SUCCESSFUL' ? 'Payout recorded' : 'Payout marked failed', status === 'SUCCESSFUL' ? 'This records an external payment; no money is transferred by this app.' : 'The monthly earnings are available for another payout attempt.');
    } catch (err: unknown) {
      toast.error('Payout Failed', err instanceof Error ? err.message : 'Failed to process payout');
      setPayoutError(err instanceof Error ? err.message : 'Unable to update payout');
    } finally {
      setBusyPayout(null);
    }
  };

  const preparePayouts = async () => {
    setPreparing(true); setPayoutMessage(''); setPayoutError('');
    try {
      const result = await apiFetch('/admin/payouts/monthly', { method: 'POST', body: JSON.stringify({ periodMonth: month || finance?.unpaidMonths?.[0] }) });
      setPayoutMessage(result.length ? `${result.length} monthly payout requests prepared. Complete the transfers externally, then mark them paid below.` : 'No unpaid student earnings remain for this month.');
      await queryClient.invalidateQueries({ queryKey: ['adminFinance'] });
      setMonth('');
    } catch (error) { setPayoutError(error instanceof Error ? error.message : 'Unable to prepare payouts'); }
    finally { setPreparing(false); }
  };

  if (financeError || statsError) return <p role="alert">Unable to load financial data. Please refresh to retry.</p>;

  if (isLoading || statsLoading || !finance || !stats) {
    return <LoadingScreen message="Loading Financial Data..." subtitle="Calculating revenues, profit margins, and payouts" fullScreen />;
  }

  if (
    !Array.isArray(finance.revenueByPlan) ||
    !Array.isArray(finance.payouts) ||
    ![stats.revenueThisMonth, stats.payoutsThisMonth, stats.profitThisMonth].every(
      (value) => typeof value === 'number' && Number.isFinite(value),
    )
  ) {
    return <p role="alert">Financial data is incompatible with this dashboard. Check that the frontend API URL points to the matching backend deployment.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => downloadCsv([['Monthly summary', 'Amount LKR'], ['Revenue', stats.revenueThisMonth], ['Payouts', stats.payoutsThisMonth], ['Net before fees', stats.profitThisMonth], [], ['Plan', 'Paying students', 'Revenue LKR'], ...finance.revenueByPlan.map((row: { tier: string; students: number; revenue: number }) => [row.tier, row.students, row.revenue]), [], ['Payout ID', 'Lecturer ID', 'Date', 'Amount LKR', 'Status'], ...finance.payouts.map((p: { id: string; lecturerId: string; initiatedAt: string; amountLkr: number; status: string }) => [p.id, p.lecturerId, p.initiatedAt, p.amountLkr, p.status])], 'finance-summary.csv')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Payments collected this month', value: currencyAmount(stats.revenueThisMonth) },
          { label: 'Lecturer payouts paid this month', value: currencyAmount(stats.payoutsThisMonth) },
          { label: 'Cash remainder before operating expenses', value: currencyAmount(stats.profitThisMonth) },
        ].map((m) => (
          <div key={m.label} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{m.label}</div>
            <div className="text-xl font-bold">{m.value}</div>

          </div>
        ))}
      </div>

      {finance.monthlySummary && <section className={pricingStyles.panel} aria-labelledby="monthly-margin-title">
        <h2 id="monthly-margin-title">Monthly student revenue · {finance.monthlySummary.month}</h2>
        <p className={pricingStyles.help}>{finance.monthlySummary.students} paid {finance.monthlySummary.students === 1 ? 'student' : 'students'} recorded through monthly tuition. Lecturer earnings are included whether paid yet or still due.</p>
        <dl className={pricingStyles.rows}>
          <div className={pricingStyles.row}><dt>Tuition after package discounts</dt><dd>{currencyAmount(finance.monthlySummary.tuitionLkr)}</dd></div>
          <div className={pricingStyles.row}><dt>Monthly lecturer earnings</dt><dd>{currencyAmount(finance.monthlySummary.lecturerLkr)}</dd></div>
          <div className={`${pricingStyles.row} ${pricingStyles.total}`}><dt>ILMBIT remainder before operating expenses</dt><dd>{currencyAmount(finance.monthlySummary.remainingLkr)}</dd></div>
        </dl>
        <p className={pricingStyles.help}>Sri Lanka: LKR 5,500 tuition less LKR 1,500 payout = LKR 4,000 before discounts and operating expenses. International: USD 49 (Fast Track USD 69) less LKR 3,000 per student, using the recorded exchange rate.</p>
      </section>}

      <MonthlyTuitionPanel />

      <ExchangeRatesPanel rates={finance.exchangeRates ?? []} plans={finance.pricing ?? []} />

      {/* Revenue breakdown chart */}
      <div className="p-6 rounded-xl border border-stone-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-stone-950">Revenue by Plan</h2>
          <span className="text-xs text-stone-500 font-medium">Successful payments this month</span>
        </div>
        <div className="space-y-4">
          {finance.revenueByPlan.length === 0 && <p className="text-sm text-stone-500">No successful payments this month. Revenue: Rs. 0.</p>}
          {finance.revenueByPlan.map((t: { tier: string; students: number; revenue: number }) => (
            <div key={t.tier}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-semibold text-stone-900">{t.tier} <span className="text-stone-500 font-normal">({t.students} students)</span></span>
                <span className="font-bold text-stone-950">Rs. {t.revenue.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-[#095F46]" style={{ width: `${stats.revenueThisMonth > 0 ? Math.min(100, t.revenue / stats.revenueThisMonth * 100) : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lecturer payouts */}
      <div>
        <section className={`${pricingStyles.panel} mb-5`}>
          <h2>Monthly lecturer payouts</h2>
          <p className={pricingStyles.help}>LKR 1,500 per Sri Lankan student; LKR 3,000 per international student, including Fast Track. One earning per paid student per month. Package discounts do not change these amounts.</p>
          {finance.unpaidMonths?.length ? <div className={pricingStyles.actions}>
            <label className={pricingStyles.field}>Completed billing month<select value={month || finance.unpaidMonths[0]} onChange={event => setMonth(event.target.value)} className={pricingStyles.control}>{finance.unpaidMonths.map((value: string) => <option key={value} value={value}>{value}</option>)}</select></label>
            <button className={`${pricingStyles.button} ${pricingStyles.primary}`} onClick={preparePayouts} disabled={preparing}>{preparing ? 'Preparing payouts…' : 'Prepare monthly payouts'}</button>
          </div> : <p className={pricingStyles.notice}>No completed months have unpaid earnings. Current-month earnings become payable after month end in Sri Lanka.</p>}
          {payoutMessage && <p role="status" className={pricingStyles.success}>{payoutMessage}</p>}
          {payoutError && <p role="alert" className={pricingStyles.error}>{payoutError}</p>}
        </section>
        <h2 className="font-semibold text-lg mb-4">Payout history</h2>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
          {finance.payouts.map((p: { id: string; lecturerId: string; lecturer?: { fullName: string }; periodMonth?: string; earningsSnapshot?: { studentId: string; name: string; region: string; amountLkr: number }[]; monthlyEarnings?: { studentId: string }[]; method: string; initiatedAt: string; amountLkr: number; status: string }, i: number) => (
            <article aria-label={`Payout ${p.id}`} key={p.id} className={`flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 text-sm ${i > 0 ? 'border-t border-[hsl(var(--border))]' : ''}`}>
              <div className="flex flex-col">
                <span className="font-medium break-all">{p.lecturer?.fullName ?? `Lecturer ${p.lecturerId.substring(0, 8)}`}</span>
                <span className="text-sm text-[#56635c]">{p.periodMonth ? `${p.periodMonth} · ${p.earningsSnapshot?.length ?? p.monthlyEarnings?.length ?? 0} students` : 'Historical session-based payout'}</span>
                <span className="text-[hsl(var(--muted-foreground))] text-xs">{p.method} • {new Date(p.initiatedAt).toLocaleDateString()}</span>
                {Array.isArray(p.earningsSnapshot) && p.earningsSnapshot.length > 0 && <details className="mt-2"><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-[#095F46] focus-visible:outline-2 focus-visible:outline-[#095F46]">Included students</summary><ul className="space-y-2">{p.earningsSnapshot.map((student, index) => <li key={index} className="text-sm text-[#56635c]">{student.name} · {student.region === 'LK' ? 'Sri Lanka' : 'International'} · {currencyAmount(student.amountLkr)}</li>)}</ul></details>}
              </div>
              <span className="font-medium">Rs. {p.amountLkr.toLocaleString()}</span>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${p.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : p.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{p.status}</span>
                {p.status === 'PENDING' && (
                  <div className="flex flex-wrap gap-2">
                    <button disabled={busyPayout !== null} onClick={() => handleProcessPayout(p.id, 'SUCCESSFUL')} className={pricingStyles.button}><CheckCircle aria-hidden="true" className="mr-1 inline h-4 w-4" />{busyPayout === p.id ? 'Saving…' : 'Mark paid externally'}</button>
                    <button disabled={busyPayout !== null} onClick={() => handleProcessPayout(p.id, 'FAILED')} className={pricingStyles.button}>Mark failed</button>
                  </div>
                )}
              </div>
            </article>
          ))}
          {finance.payouts.length === 0 && <div className="p-4 text-center text-sm text-[hsl(var(--muted-foreground))]">No payouts found</div>}
        </div>
      </div>
    </div>
  );
}
