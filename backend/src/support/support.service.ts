import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createSupportTicket(userId: string, type: string, reason?: string) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        type,
        reason,
        status: 'PENDING',
      },
    });
  }

  async getMyTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllTickets(status?: string) {
    return this.prisma.supportTicket.findMany({
      where: status ? { status } : undefined,
      include: {
        user: { select: { email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTicketStatus(id: string, status: string) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.supportTicket.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' ? new Date() : undefined,
      },
    });
  }
}
