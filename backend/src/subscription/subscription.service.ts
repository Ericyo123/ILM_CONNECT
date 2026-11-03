import { Injectable, NotFoundException, BadRequestException, NotImplementedException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ExchangeRateService } from '../pricing/exchange-rate.service';
import { MONTHLY_POLICY, colomboMonth, monthPeriod, money, monthlyQuote, studentRegion } from '../pricing/monthly-pricing';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService, private exchange?: ExchangeRateService) {}

  async getCurrencies() {
    return this.exchange!.snapshot();
  }

  async getPlans() {
    const stored = await this.prisma.subscriptionPlan.findMany({ orderBy: [{ courseId: 'asc' }, { sessions: 'asc' }] });
    const plans = stored.map(plan => ({ ...plan, monthlyUsd: plan.tier === 'Fast Track' ? MONTHLY_POLICY.fastTrackFeeUsd : MONTHLY_POLICY.standardFeeUsd, monthlyLkr: plan.tier === 'Fast Track' ? null : MONTHLY_POLICY.localFeeLkr }));
    if (!this.exchange) return plans;
    const rates = await this.exchange.snapshot();
    const usd = rates.find(row => row.code === 'USD');
    return plans.map(plan => {
      const prices: Record<string, number | null> = { LKR: plan.monthlyLkr, USD: plan.monthlyUsd };
      for (const code of ['GBP', 'EUR', 'AUD']) {
        const rate = rates.find(row => row.code === code);
        prices[code] = usd?.available && !usd.stale && rate?.available && !rate.stale
          ? Math.round(plan.monthlyUsd * usd.lkrPerUnit / rate.lkrPerUnit * 100) / 100 : null;
      }
      return { ...plan, prices, internationalLkr: usd?.available && !usd.stale ? Math.round(plan.monthlyUsd * usd.lkrPerUnit * 100) / 100 : null };
    });
  }

  async updatePlans(input: unknown, actorId: string) {
    throw new BadRequestException('Monthly prices are fixed by the ILMBIT pricing policy');
  }

  async getQuote(planId: string, region: string, packageSize: number) {
    if (typeof planId !== 'string') throw new BadRequestException('Choose a plan');
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    return monthlyQuote(plan.tier, region, packageSize);
  }

  private validateMonthlyInput(input: { studentIds?: unknown; planId?: unknown; billingMonth?: unknown; reference?: unknown }) {
    if (!input || !Array.isArray(input.studentIds) || ![1, 2, 3].includes(input.studentIds.length) || input.studentIds.some(id => typeof id !== 'string' || !id.trim()) || new Set(input.studentIds).size !== input.studentIds.length) throw new BadRequestException('Choose one, two, or three different students');
    if (typeof input.planId !== 'string' || !input.planId) throw new BadRequestException('Choose a plan');
    if (typeof input.billingMonth !== 'string') throw new BadRequestException('Choose a billing month');
    monthPeriod(input.billingMonth);
    if (input.billingMonth > colomboMonth()) throw new BadRequestException('Future tuition cannot be recorded yet');
    return { studentIds: input.studentIds as string[], planId: input.planId, billingMonth: input.billingMonth };
  }

  async quoteMonthlyPayment(input: { studentIds?: unknown; planId?: unknown; billingMonth?: unknown }, db: Prisma.TransactionClient = this.prisma, conversion?: { region: string; fxRate: number; rateDate: string | null }) {
    const { studentIds, planId, billingMonth } = this.validateMonthlyInput(input);
    const [students, plan] = await Promise.all([
      db.studentProfile.findMany({ where: { userId: { in: studentIds } }, include: { user: true, assignedLecturer: { include: { user: true } } } }),
      db.subscriptionPlan.findUnique({ where: { id: planId } }),
    ]);
    if (!plan) throw new NotFoundException('Plan not found');
    if (students.length !== studentIds.length) throw new BadRequestException('One or more students could not be found');
    if (students.some(student => student.user.status !== 'ACTIVE' || student.user.deletedAt || !student.assignedLecturer || student.assignedLecturer.status !== 'ACTIVE' || student.assignedLecturer.user.status !== 'ACTIVE' || student.assignedLecturer.user.deletedAt)) throw new BadRequestException('Every student must be active and assigned to an active lecturer');
    const region = studentRegion(students[0].country);
    if (students.some(student => studentRegion(student.country) !== region)) throw new BadRequestException('Choose students from the same pricing region for a package');
    const quote = monthlyQuote(plan.tier, region, students.length);
    if (conversion && conversion.region !== region) throw new ConflictException('The student pricing region changed. Refresh the calculation before recording payment');
    const rates = region === 'LK' || conversion ? [] : await this.exchange?.snapshot() ?? [];
    const usd = rates.find(rate => rate.code === 'USD');
    if (region !== 'LK' && !conversion && (!usd?.available || usd.stale)) throw new BadRequestException('A current USD exchange rate is required. Refresh exchange rates and retry');
    const fxRate = region === 'LK' ? 1 : conversion?.fxRate ?? usd!.lkrPerUnit;
    const feePerStudentLkr = money(new Prisma.Decimal(quote.feePerStudent).mul(fxRate));
    const totalLkr = money(new Prisma.Decimal(feePerStudentLkr).mul(students.length));
    const payoutPerStudentLkr = region === 'LK' ? MONTHLY_POLICY.localPayoutLkr : MONTHLY_POLICY.internationalPayoutLkr;
    const payoutTotalLkr = payoutPerStudentLkr * students.length;
    return {
      ...quote, planId, tier: plan.tier, billingMonth, region, fxRate, rateDate: conversion?.rateDate ?? usd?.rateDate ?? null,
      feePerStudentLkr, totalLkr, payoutPerStudentLkr, payoutTotalLkr,
      remainingLkr: money(new Prisma.Decimal(totalLkr).minus(payoutTotalLkr)),
      students: students.map(student => ({ id: student.userId, name: student.fullName, lecturerId: student.assignedLecturerId!, lecturerName: student.assignedLecturer!.fullName })),
    };
  }

  async recordMonthlyPayment(input: { studentIds?: unknown; planId?: unknown; billingMonth?: unknown; reference?: unknown; expectedTotalLkr?: unknown }, actorId: string) {
    const validated = this.validateMonthlyInput(input);
    if (typeof input.reference !== 'string' || !input.reference.trim() || input.reference.trim().length > 120) throw new BadRequestException('Enter an external payment reference (up to 120 characters)');
    const reference = input.reference.trim();
    // A provider refresh must finish before the tuition transaction holds student locks.
    const preview = await this.quoteMonthlyPayment(input);
    if (input.expectedTotalLkr !== preview.totalLkr) throw new ConflictException('The quote changed. Refresh the calculation and check the amount before recording payment');
    try {
      return await this.prisma.$transaction(async tx => {
        // Sorted student locks serialize overlapping packages without deadlocks.
        for (const id of [...validated.studentIds].sort()) await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`tuition:${id}`}))::text`;
        const existing = await tx.subscription.count({ where: { studentId: { in: validated.studentIds }, billingMonth: validated.billingMonth } });
        if (existing) throw new ConflictException('Tuition is already recorded for a selected student in this month');
        const quote = await this.quoteMonthlyPayment(input, tx, preview);
        if (input.expectedTotalLkr !== quote.totalLkr) throw new ConflictException('The quote changed. Refresh the calculation and check the amount before recording payment');
        const period = monthPeriod(quote.billingMonth);
        for (const student of quote.students) {
          const subscription = await tx.subscription.create({ data: {
            studentId: student.id, tier: quote.tier,
            status: 'ACTIVE', billingMonth: quote.billingMonth,
            currentPeriodStart: period.start, currentPeriodEnd: period.end,
            lkrAmount: quote.feePerStudentLkr, fxRateApplied: quote.fxRate,
            pricingSnapshot: { planId: quote.planId, currency: quote.currency, baseFee: quote.baseFee, discountPercent: quote.discountPercent, packageSize: quote.packageSize, feePerStudent: quote.feePerStudent, fxRate: quote.fxRate, rateDate: quote.rateDate, reference },
          } });
          await tx.payment.create({ data: { subscriptionId: subscription.id, amountLkr: quote.feePerStudentLkr, fxRate: quote.fxRate, gateway: 'external_record', gatewayChargeId: reference, status: 'SUCCESSFUL', processedAt: new Date() } });
          await tx.monthlyLecturerEarning.create({ data: { studentId: student.id, lecturerId: student.lecturerId, subscriptionId: subscription.id, periodMonth: quote.billingMonth, region: quote.region, amountLkr: quote.payoutPerStudentLkr } });
          if (quote.billingMonth === colomboMonth()) await tx.studentProfile.update({ where: { userId: student.id }, data: { currentTier: subscription.tier } });
        }
        await tx.auditLog.create({ data: { actorId, action: 'MONTHLY_TUITION_RECORDED', entity: 'MONTHLY_TUITION', entityId: quote.billingMonth, details: { ...quote, reference } } });
        return quote;
      }, { maxWait: 10000, timeout: 30000 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('Tuition or earnings are already recorded for a selected student in this month');
      throw error;
    }
  }

  async getAccess(studentId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { studentId },
      select: { tier: true, status: true, currentPeriodStart: true, currentPeriodEnd: true },
    });
    const now = new Date();
    const active = subscriptions.some(subscription => subscription.status === 'ACTIVE' && subscription.currentPeriodStart <= now && subscription.currentPeriodEnd > now);
    return { requiresSubscription: subscriptions.length > 0 && !active };
  }

  async getMySubscription(studentId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { studentId, status: 'ACTIVE' },
      orderBy: { currentPeriodEnd: 'desc' },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    return subscription;
  }

  async getPaymentHistory(studentId: string) {
    return this.prisma.payment.findMany({ where: { subscription: { studentId } }, include: { subscription: { select: { tier: true } } }, orderBy: { processedAt: 'desc' } });
  }

  async createSubscriptionIntent(studentId: string, tier: string, lkrAmount: number) {
    throw new NotImplementedException('Payment checkout will be available when the payment gateway is connected.');
  }

  async createTrialSubscription(studentId: string) {
    return this.prisma.$transaction(async tx => {
    // Database locking keeps claims single-use across API instances.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`trial:${studentId}`}))::text`;
    const existing = await tx.subscription.findFirst({
      where: { studentId, tier: { equals: 'Trial', mode: 'insensitive' } },
    });

    if (existing) {
      throw new BadRequestException('You have already claimed a free trial.');
    }

    const subscription = await tx.subscription.create({
      data: {
        studentId,
        tier: 'Trial',
        status: 'ACTIVE', 
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
        lkrAmount: 0,
        fxRateApplied: 1.0,
      },
    });

    return subscription;
    }, { maxWait: 10000, timeout: 15000 });
  }

  async handleWebhook(payload: any, signature: string) {
    throw new NotImplementedException('Payment gateway is not connected.');
  }

  // Called only by a future gateway adapter AFTER signature verification and
  // provider confirmation. Never expose this as a client/admin approval route.
  async recordVerifiedGatewayPayment(confirmation: {
    paymentId: string; gateway: string; gatewayChargeId: string;
    currency: string; amountLkr: number; status: 'SUCCESSFUL' | 'FAILED';
  }) {
    if (confirmation.currency !== 'LKR' || !Number.isFinite(confirmation.amountLkr) || confirmation.amountLkr <= 0 || !['SUCCESSFUL', 'FAILED'].includes(confirmation.status)) {
      throw new BadRequestException('Invalid gateway payment confirmation');
    }
    return this.prisma.$transaction(async tx => {
      const payment = await tx.payment.findUnique({ where: { id: confirmation.paymentId }, include: { subscription: true } });
      if (!payment) throw new NotFoundException('Payment not found');
      if (payment.gateway !== confirmation.gateway || payment.gatewayChargeId !== confirmation.gatewayChargeId || Math.round(payment.amountLkr * 100) !== Math.round(confirmation.amountLkr * 100)) {
        throw new BadRequestException('Gateway confirmation does not match the recorded payment');
      }
      // Duplicate notifications are acknowledged without extending the term again.
      if (payment.status === confirmation.status) return { paymentId: payment.id, status: payment.status };
      if (payment.status !== 'PENDING' || payment.subscription.tier.toLowerCase() === 'trial') throw new BadRequestException('Payment is not awaiting confirmation');
      const changed = await tx.payment.updateMany({ where: { id: payment.id, status: 'PENDING' }, data: { status: confirmation.status, processedAt: new Date() } });
      if (changed.count !== 1) throw new BadRequestException('Payment confirmation is already being processed; retry');
      if (confirmation.status === 'SUCCESSFUL') {
        const subscription = payment.subscription;
        if (subscription.currentPeriodEnd <= subscription.currentPeriodStart || subscription.currentPeriodEnd <= new Date()) throw new BadRequestException('Invalid subscription period');
        await tx.subscription.update({ where: { id: subscription.id }, data: { status: 'ACTIVE' } });
      }
      return { paymentId: payment.id, status: confirmation.status };
    });
  }
}
