'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { downloadCsv } from '@/lib/download';
import { currencyAmount } from '@/components/pricing/monthly-tuition-calculator';
import styles from '@/components/pricing/monthly-pricing.module.css';

interface Earning { id: string; periodMonth: string; region: string; amountLkr: number; payoutId: string | null; student: { fullName: string }; payout: { status: string } | null }
interface Payout { id: string; status: string; amountLkr: number; initiatedAt: string; periodMonth: string | null; earningsSnapshot?: { name: string; region: string; amountLkr: number }[] | null; sessionBlocksIncluded: unknown }
interface Balance { currentMonth: string; currentMonthLkr: number; availableLkr: number; earnings: Earning[] }

export default function EarningsPage() {
  const client = useQueryClient();
  const [month, setMonth] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const payouts = useQuery<Payout[]>({ queryKey: ['lecturerPayouts'], queryFn: () => apiFetch('/payouts/me') });
  const balance = useQuery<Balance>({ queryKey: ['lecturerBalance'], queryFn: () => apiFetch('/payouts/balance') });
  const earnings = balance.data?.earnings ?? [];
  const available = earnings.filter(row => !row.payoutId && row.periodMonth < (balance.data?.currentMonth ?? ''));
  const months = [...new Set(available.map(row => row.periodMonth))].sort().reverse();
  const selectedMonth = months.includes(month) ? month : months[0] ?? '';
  const selectedAmount = available.filter(row => row.periodMonth === selectedMonth).reduce((sum, row) => sum + row.amountLkr, 0);
  const request = useMutation({
    mutationFn: () => apiFetch('/payouts/request', { method: 'POST', body: JSON.stringify({ periodMonth: selectedMonth, amountLkr: selectedAmount, method }) }),
    onSuccess: async () => { await Promise.all(['lecturerPayouts', 'lecturerBalance'].map(key => client.invalidateQueries({ queryKey: [key] }))); },
  });
  const totalPaid = (payouts.data ?? []).filter(row => row.status === 'SUCCESSFUL').reduce((sum, row) => sum + row.amountLkr, 0);
  const pending = (payouts.data ?? []).filter(row => row.status === 'PENDING').reduce((sum, row) => sum + row.amountLkr, 0);

  if (payouts.isPending || balance.isPending) return <p role="status">Loading monthly earnings and payout history…</p>;
  if (payouts.isError || balance.isError) return <div role="alert" className={styles.panel}>Unable to load earnings. <button className={styles.button} onClick={() => { payouts.refetch(); balance.refetch(); }}>Retry earnings</button></div>;

  return <div className="space-y-6">
    <section className={styles.panel} aria-labelledby="monthly-earnings-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="monthly-earnings-title">Monthly student earnings</h2><p className={styles.help}>LKR 1,500 per Sri Lankan student; LKR 3,000 per international student, including Fast Track. Duo and Trio discounts do not reduce your earnings.</p></div>
        <button className={styles.button} disabled={!earnings.length && !payouts.data?.length} onClick={() => downloadCsv([
          ['Billing month', 'Student', 'Pricing region', 'Earnings LKR', 'Payout status'],
          ...earnings.map(row => [row.periodMonth, row.student.fullName, row.region === 'LK' ? 'Sri Lanka' : 'International', row.amountLkr, row.payout?.status ?? (row.periodMonth < balance.data!.currentMonth ? 'AVAILABLE' : 'ACCRUING')]),
          [], ['Payout ID', 'Billing month', 'Initiated', 'Amount LKR', 'Status'],
          ...(payouts.data ?? []).map(row => [row.id, row.periodMonth ?? 'Historical session payout', row.initiatedAt, row.amountLkr, row.status]),
        ], 'monthly-lecturer-earnings.csv')}>Export earnings</button>
      </div>
      <dl className={styles.rows}>
        <div className={styles.row}><dt>Accruing · {balance.data?.currentMonth}</dt><dd>{currencyAmount(balance.data?.currentMonthLkr ?? 0)}</dd></div>
        <div className={`${styles.row} ${styles.total}`}><dt>Available from completed months</dt><dd>{currencyAmount(balance.data?.availableLkr ?? 0)}</dd></div>
        <div className={styles.row}><dt>Pending payout requests</dt><dd>{currencyAmount(pending)}</dd></div>
        <div className={styles.row}><dt>Paid to date, including historical payouts</dt><dd>{currencyAmount(totalPaid)}</dd></div>
      </dl>
      <p className={styles.help}>Earnings are recorded when monthly tuition is received. Trials are excluded. Current-month earnings become payable after month end in Sri Lanka.</p>
    </section>

    <section className={styles.panel} aria-labelledby="request-monthly-payout">
      <h2 id="request-monthly-payout">Request a monthly payout</h2>
      {months.length ? <form onSubmit={event => { event.preventDefault(); request.mutate(); }}>
        <fieldset disabled={request.isPending} className={styles.fields}>
          <label className={styles.field}>Billing month<select className={styles.control} value={selectedMonth} onChange={event => { setMonth(event.target.value); request.reset(); }}>{months.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
          <label className={styles.field}>Payout method<select className={styles.control} value={method} onChange={event => { setMethod(event.target.value); request.reset(); }}><option value="bank_transfer">Bank transfer</option><option value="wise">Wise</option><option value="wise_lkr">Wise in LKR</option></select></label>
        </fieldset>
        <p className={styles.notice}>Full unpaid balance for {selectedMonth}: <strong>{currencyAmount(selectedAmount)}</strong>. This creates a request for ILMBIT to pay externally.</p>
        <div className={styles.actions}><button disabled={request.isPending || !selectedAmount} className={`${styles.button} ${styles.primary}`}>{request.isPending ? 'Requesting payout…' : 'Request monthly payout'}</button></div>
      </form> : <p className={styles.notice}>No unpaid earnings from completed months. A pending request already reserves its students’ earnings.</p>}
      {request.isError && <p role="alert" className={styles.error}>{request.error.message}</p>}
      {request.isSuccess && <p role="status" className={styles.success}>Monthly payout requested. Your earnings are reserved while ILMBIT processes the transfer.</p>}
    </section>

    <section className={styles.panel} aria-labelledby="student-earning-breakdown">
      <h2 id="student-earning-breakdown">Earnings by student</h2>
      {!earnings.length ? <p className={styles.help}>No monthly tuition has been recorded for your students yet. Monthly earnings will appear here after ILMBIT records received tuition.</p> : <ul className={styles.list}>{earnings.map(row => <li className={styles.item} key={row.id}>
        <div className="flex flex-wrap justify-between gap-2"><span className="font-semibold">{row.student.fullName}</span><span className="font-semibold tabular-nums">{currencyAmount(row.amountLkr)}</span></div>
        <p className={styles.help}>{row.periodMonth} · {row.region === 'LK' ? 'Sri Lanka' : 'International'} · {row.payout?.status === 'SUCCESSFUL' ? 'Paid' : row.payoutId ? 'Payout pending' : row.periodMonth < balance.data!.currentMonth ? 'Available for payout' : 'Accruing until month end'}</p>
      </li>)}</ul>}
    </section>

    <section className={styles.panel} aria-labelledby="payout-history">
      <h2 id="payout-history">Payout history</h2>
      {!payouts.data?.length ? <p className={styles.help}>No payouts have been requested yet.</p> : <ul className={styles.list}>{payouts.data.map(row => <li className={styles.item} key={row.id}>
        <div className="flex flex-wrap justify-between gap-2"><span className="font-semibold">{row.periodMonth ?? 'Historical session payout'}</span><span className="font-semibold tabular-nums">{currencyAmount(row.amountLkr)}</span></div>
        <p className={styles.help}>{new Date(row.initiatedAt).toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' })} · {row.status === 'SUCCESSFUL' ? 'Paid' : row.status === 'FAILED' ? 'Failed, earnings released for retry' : 'Pending external payment'}</p>
        {Array.isArray(row.earningsSnapshot) && row.earningsSnapshot.length > 0 && <details><summary>Included students · {row.earningsSnapshot.length}</summary><ul>{row.earningsSnapshot.map((student, i) => <li className={styles.row} key={i}>{student.name}<span>{currencyAmount(student.amountLkr)}</span></li>)}</ul></details>}
      </li>)}</ul>}
    </section>
  </div>;
}
