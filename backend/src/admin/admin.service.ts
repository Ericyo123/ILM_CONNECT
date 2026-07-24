import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalStudents = await this.prisma.user.count({ where: { role: 'STUDENT' } });
    const activeStudents = await this.prisma.user.count({ where: { role: 'STUDENT', status: 'ACTIVE' } });
    
    const activeLecturers = await this.prisma.user.count({ where: { role: 'LECTURER', status: 'ACTIVE' } });
    const pendingApplications = await this.prisma.user.count({ where: { role: 'LECTURER', status: 'PENDING' } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setDate(today.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const sessionsToday = await this.prisma.session.count({
      where: { startsAt: { gte: today, lt: endOfToday } },
    });

    const sessionsThisWeek = await this.prisma.session.count({
      where: { startsAt: { gte: startOfWeek } },
    });

    const mrrRes = await this.prisma.subscription.aggregate({
      _sum: { lkrAmount: true },
      where: { status: 'ACTIVE' },
    });
    const mrrLKR = mrrRes._sum.lkrAmount || 0;
    const mrrUSD = mrrLKR * 0.0033; // Mock FX rate

    const revenueRes = await this.prisma.payment.aggregate({
      _sum: { amountLkr: true },
      where: { status: 'SUCCESSFUL', processedAt: { gte: startOfMonth } },
    });
    const revenueThisMonth = revenueRes._sum.amountLkr || 0;

    const payoutsRes = await this.prisma.payout.aggregate({
      _sum: { amountLkr: true },
      where: { status: 'SUCCESSFUL', initiatedAt: { gte: startOfMonth } },
    });
    const payoutsThisMonth = payoutsRes._sum.amountLkr || 0;

    const ratingRes = await this.prisma.rating.aggregate({
      _avg: { score: true },
    });
    const avgRating = ratingRes._avg.score ? Number(ratingRes._avg.score.toFixed(1)) : 0;

    const paymentFailures = await this.prisma.payment.count({
      where: { status: 'FAILED', processedAt: { gte: startOfWeek } },
    });

    return {
      revenueThisMonth,
      mrrLKR,
      mrrUSD,
      activeStudents,
      totalStudents,
      activeLecturers,
      pendingApplications,
      sessionsToday,
      sessionsThisWeek,
      payoutsThisMonth,
      profitThisMonth: revenueThisMonth - payoutsThisMonth,
      unassignedStudents: 0,
      lecturerChangeRequests: await this.prisma.supportTicket.count({ where: { type: 'LECTURER_CHANGE', status: 'PENDING' } }),
      paymentFailures,
      churnRate: 2.1,
      avgRating,
    };
  }

  async getUsers(role?: string, status?: string) {
    return this.prisma.user.findMany({
      where: {
        ...(role && { role: role as any }),
        ...(status && { status: status as any }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async updateUserStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async getSessions() {
    return this.prisma.session.findMany({
      include: {
        student: true,
        lecturer: true,
      },
      orderBy: { startsAt: 'desc' },
      take: 50,
    });
  }

  async getFinanceOverview() {
    const payments = await this.prisma.payment.findMany({
      where: { status: 'SUCCESSFUL' },
      orderBy: { processedAt: 'desc' },
      take: 50,
    });

    const payouts = await this.prisma.payout.findMany({
      orderBy: { initiatedAt: 'desc' },
      take: 50,
    });

    return { payments, payouts };
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      include: { actor: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async updatePayoutStatus(id: string, status: string) {
    const payout = await this.prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new NotFoundException('Payout not found');

    return this.prisma.payout.update({
      where: { id },
      data: {
        status: status as any,
        completedAt: status === 'SUCCESSFUL' ? new Date() : undefined,
      },
    });
  }
}
