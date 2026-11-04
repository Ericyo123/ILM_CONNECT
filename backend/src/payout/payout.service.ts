import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { colomboMonth, monthPeriod } from '../pricing/monthly-pricing';

@Injectable()
export class PayoutService {
  constructor(private prisma: PrismaService) {}

  async getMyPayouts(lecturerId: string) {
    return this.prisma.payout.findMany({
      where: { lecturerId },
      include: { monthlyEarnings: { select: { id: true, periodMonth: true, region: true, amountLkr: true, student: { select: { fullName: true } } } } },
      orderBy: { initiatedAt: 'desc' },
    });
  }

  async getBalance(lecturerId: string) {
    const earnings = await this.prisma.monthlyLecturerEarning.findMany({
      where: { lecturerId },
      include: { student: { select: { fullName: true } }, payout: { select: { status: true } } },
      orderBy: [{ periodMonth: 'desc' }, { createdAt: 'asc' }],
    });
    const currentMonth = colomboMonth();
    return {
      currentMonth,
      availableLkr: earnings.filter(row => !row.payoutId && row.periodMonth < currentMonth).reduce((sum, row) => sum + row.amountLkr, 0),
      currentMonthLkr: earnings.filter(row => row.periodMonth === currentMonth).reduce((sum, row) => sum + row.amountLkr, 0),
      earnings,
    };
  }

  private async reserveMonth(tx: Prisma.TransactionClient, lecturerId: string, periodMonth: string, method: string, amountLkr?: number) {
    monthPeriod(periodMonth);
    if (periodMonth >= colomboMonth()) throw new BadRequestException('Monthly payouts become available after the billing month ends in Sri Lanka');
    if (!['wise', 'bank_transfer', 'wise_lkr'].includes(method)) throw new BadRequestException('Choose a supported payout method');
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lecturerId}))::text`;
    const earnings = await tx.monthlyLecturerEarning.findMany({ where: { lecturerId, periodMonth, payoutId: null }, include: { student: { select: { fullName: true } } }, orderBy: { createdAt: 'asc' } });
    const total = earnings.reduce((sum, row) => sum + row.amountLkr, 0);
    if (!total) throw new BadRequestException('No unpaid student earnings for this month');
    if (amountLkr !== undefined && (!Number.isSafeInteger(amountLkr) || amountLkr !== total)) throw new BadRequestException('Request the full unpaid balance for this month');
    const payout = await tx.payout.create({ data: { lecturerId, periodMonth, amountLkr: total, method, status: 'PENDING', sessionBlocksIncluded: [], earningsSnapshot: earnings.map(row => ({ studentId: row.studentId, name: row.student.fullName, region: row.region, amountLkr: row.amountLkr })) } });
    const reserved = await tx.monthlyLecturerEarning.updateMany({ where: { id: { in: earnings.map(row => row.id) }, payoutId: null }, data: { payoutId: payout.id } });
    if (reserved.count !== earnings.length) throw new BadRequestException('Earnings changed while preparing this payout. Retry');
    return payout;
  }

  async requestPayout(lecturerId: string, amountLkr: number, method: string, periodMonth: string) {
    if (!Number.isSafeInteger(amountLkr) || amountLkr <= 0) throw new BadRequestException('Choose a positive monthly balance');
    return this.prisma.$transaction(tx => this.reserveMonth(tx, lecturerId, periodMonth, method, amountLkr));
  }

  async prepareMonthlyPayouts(periodMonth: string, actorId: string) {
    monthPeriod(periodMonth);
    if (periodMonth >= colomboMonth()) throw new BadRequestException('Choose a completed billing month');
    return this.prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`payout-month:${periodMonth}`}))::text`;
      const rows = await tx.monthlyLecturerEarning.findMany({ where: { periodMonth, payoutId: null }, include: { lecturer: { select: { payoutMethod: true } } }, orderBy: { lecturerId: 'asc' } });
      const lecturers = new Map(rows.map(row => [row.lecturerId, row.lecturer.payoutMethod]));
      const payouts = [];
      for (const [lecturerId, method] of lecturers) {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lecturerId}))::text`;
        if (!await tx.monthlyLecturerEarning.count({ where: { lecturerId, periodMonth, payoutId: null } })) continue;
        payouts.push(await this.reserveMonth(tx, lecturerId, periodMonth, method));
      }
      await tx.auditLog.create({ data: { actorId, action: 'MONTHLY_PAYOUTS_PREPARED', entity: 'PAYOUT', entityId: periodMonth, details: { payoutIds: payouts.map(row => row.id), amountLkr: payouts.reduce((sum, row) => sum + row.amountLkr, 0) } } });
      return payouts;
    }, { maxWait: 10000, timeout: 30000 });
  }
}
