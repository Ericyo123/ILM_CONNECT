'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSubscriptionPlans } from '@/lib/subscription-plans';
import { billingMonthNow, currencyAmount, type TuitionQuote } from '@/components/pricing/monthly-tuition-calculator';
import styles from '@/components/pricing/monthly-pricing.module.css';

interface Student { id: string; email: string; status: string; studentProfile: { fullName: string; country: string; assignedLecturerId?: string; assignedLecturer: { userId: string; fullName: string } | null } | null }
interface InternalQuote extends TuitionQuote { feePerStudentLkr: number; totalLkr: number; payoutPerStudentLkr: number; payoutTotalLkr: number; remainingLkr: number; fxRate: number; rateDate: string | null; students: { id: string; name: string; lecturerName: string }[] }

export function MonthlyTuitionPanel() {
  const client = useQueryClient();
  const [studentIds, setStudentIds] = useState(['']);
  const [planId, setPlanId] = useState('');
  const [billingMonth, setBillingMonth] = useState(billingMonthNow);
  const [reference, setReference] = useState('');
  const students = useQuery<Student[]>({ queryKey: ['billingStudents'], queryFn: () => apiFetch('/admin/users?role=STUDENT&status=ACTIVE') });
  const plans = useSubscriptionPlans(false);
  const input = { studentIds, planId: planId || plans.data?.[0]?.id, billingMonth };
  const ready = !!input.planId && studentIds.every(Boolean) && new Set(studentIds).size === studentIds.length;
  const quote = useQuery<InternalQuote>({
    queryKey: ['monthlyPaymentQuote', input],
    queryFn: () => apiFetch('/subscriptions/monthly-payments/quote', { method: 'POST', body: JSON.stringify(input) }),
    enabled: ready,
    retry: false,
  });
  const save = useMutation({
    mutationFn: () => apiFetch('/subscriptions/monthly-payments', { method: 'POST', body: JSON.stringify({ ...input, reference, expectedTotalLkr: quote.data?.totalLkr }) }),
    onSuccess: async () => {
      setReference('');
      setStudentIds(['']);
      await Promise.all(['adminFinance', 'adminStats', 'lecturerBalance', 'studentSubscription', 'studentPayments', 'adminHistory'].map(key => client.invalidateQueries({ queryKey: [key] })));
    },
  });
  const resetMessage = () => save.reset();
  return <section className={styles.panel} aria-labelledby="monthly-payment-title">
    <h2 id="monthly-payment-title">Record monthly tuition</h2>
    <p className={styles.help}>Record a payment already received outside ILMBIT. This activates the selected month and adds each student’s monthly lecturer earnings. No money is charged here.</p>
    <p className={styles.help}>Use this flow for new monthly records. Earlier payments remain in history and are not recalculated.</p>
    {students.isPending || plans.isPending ? <p role="status" className={styles.help}>Loading students and plans…</p> : students.isError || plans.isError ? <p role="alert" className={styles.error}>Unable to load billing options. <button className={styles.button} onClick={() => { students.refetch(); plans.refetch(); }}>Retry billing options</button></p> : !plans.data?.length || !students.data?.length ? <p className={styles.help}>An active student and a configured plan are needed to record tuition.</p> : <form onSubmit={event => { event.preventDefault(); if (quote.data && !quote.isFetching) save.mutate(); }}>
      <fieldset disabled={save.isPending} className={styles.split}>
        <div>
          <div className={styles.fields}>
            <label className={styles.field}>Billing month (Sri Lanka)<input type="month" required min="2020-01" max={billingMonthNow()} value={billingMonth} className={styles.control} onChange={event => { setBillingMonth(event.target.value); resetMessage(); }} /></label>
            <label className={styles.field}>Tuition package<select value={studentIds.length} className={styles.control} onChange={event => { const count = Number(event.target.value); setStudentIds(Array.from({ length: count }, (_, i) => studentIds[i] ?? '')); resetMessage(); }}><option value={1}>Solo · 1 student</option><option value={2}>Duo · 2 students · 10% off</option><option value={3}>Trio · 3 students · 15% off</option></select></label>
            <label className={styles.field}>Course and pace<select value={input.planId} className={styles.control} onChange={event => { setPlanId(event.target.value); resetMessage(); }}>{plans.data.map(plan => <option key={plan.id} value={plan.id}>{plan.course} · {plan.tier}</option>)}</select></label>
            {studentIds.map((id, index) => <label key={index} className={styles.field}>Student {index + 1}<select required value={id} className={styles.control} onChange={event => { setStudentIds(studentIds.map((value, i) => i === index ? event.target.value : value)); resetMessage(); }}><option value="">Choose a student</option>{students.data?.filter(student => student.studentProfile?.assignedLecturer).map(student => <option key={student.id} value={student.id} disabled={studentIds.includes(student.id) && studentIds[index] !== student.id}>{student.studentProfile?.fullName} · {student.studentProfile?.country} · {student.email}</option>)}</select></label>)}
          </div>
          <p className={styles.help}>Only students assigned to a lecturer appear here. All package members must use the same course, pace and pricing region.</p>
          <label className={`${styles.field} mt-5`}>External payment reference<input required maxLength={120} value={reference} className={styles.control} onChange={event => { setReference(event.target.value); resetMessage(); }} placeholder="Bank transfer or receipt reference" /></label>
        </div>
        <div aria-live="polite" aria-busy={quote.isFetching}>
          {!ready && <p className={styles.notice}>Choose the student or package members to calculate tuition and lecturer payouts.</p>}
          {ready && quote.isPending && <p role="status" className={styles.help}>Calculating monthly amounts…</p>}
          {ready && quote.isError && <p role="alert" className={styles.error}>{quote.error.message} <button type="button" className={styles.button} onClick={() => quote.refetch()}>Retry quote</button></p>}
          {ready && quote.data && <>
            <dl className={styles.rows}>
              <div className={styles.row}><dt>Base fee per student</dt><dd>{currencyAmount(quote.data.baseFee, quote.data.currency)}</dd></div>
              <div className={styles.row}><dt>Discount per student ({quote.data.discountPercent}%)</dt><dd>{currencyAmount(quote.data.discountPerStudent, quote.data.currency)}</dd></div>
              <div className={styles.row}><dt>Tuition per student after discount</dt><dd>{currencyAmount(quote.data.feePerStudent, quote.data.currency)}</dd></div>
              <div className={`${styles.row} ${styles.total}`}><dt>Payment received · {studentIds.length} {studentIds.length === 1 ? 'student' : 'students'}</dt><dd>{currencyAmount(quote.data.total, quote.data.currency)}</dd></div>
              <div className={styles.row}><dt>Recorded tuition in LKR</dt><dd>{currencyAmount(quote.data.totalLkr)}</dd></div>
              <div className={styles.row}><dt>Lecturer earnings · {currencyAmount(quote.data.payoutPerStudentLkr)} each</dt><dd>{currencyAmount(quote.data.payoutTotalLkr)}</dd></div>
              <div className={styles.row}><dt>ILMBIT remainder before operating expenses</dt><dd>{currencyAmount(quote.data.remainingLkr)}</dd></div>
            </dl>
            {quote.data.currency === 'USD' && <p className={styles.help}>Reference conversion: USD 1 = {currencyAmount(quote.data.fxRate)} · rate date {quote.data.rateDate}. Actual bank proceeds and operating costs may differ.</p>}
            <p className={styles.help}>Lecturer payouts do not decrease with package discounts. Earnings become payable after this billing month ends.</p>
            <ul className={styles.list}>{quote.data.students.map(student => <li key={student.id} className={styles.item}><p className="text-sm font-semibold">{student.name}</p><p className={styles.help}>Lecturer: {student.lecturerName} · {currencyAmount(quote.data!.payoutPerStudentLkr)} for this month</p></li>)}</ul>
          </>}
        </div>
      </fieldset>
      <div className={styles.actions}><button className={`${styles.button} ${styles.primary}`} disabled={!ready || !quote.data || quote.isFetching || quote.isError || !reference.trim() || save.isPending}>{save.isPending ? 'Recording tuition…' : 'Record received payment'}</button></div>
      {save.isError && <p role="alert" className={styles.error}>{save.error.message}</p>}
      {save.isSuccess && <p role="status" className={styles.success}>Tuition recorded. Student access and monthly lecturer earnings have been saved.</p>}
    </form>}
  </section>;
}
