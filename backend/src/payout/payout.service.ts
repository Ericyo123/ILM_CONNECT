import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutService {
  constructor(private prisma: PrismaService) {}

  async getMyPayouts(lecturerId: string) {
    return this.prisma.payout.findMany({
      where: { lecturerId },
      orderBy: { initiatedAt: 'desc' },
    });
  }

  async requestPayout(lecturerId: string, amountLkr: number, method: string) {
    // Basic validation: Check if lecturer has enough completed session blocks
    const completedBlocks = await this.prisma.sessionBlock.findMany({
      where: { lecturerId, status: 'COMPLETED' },
    });

    const totalAvailable = completedBlocks.reduce((sum: number, block: any) => sum + block.payoutAmountLkr, 0);

    if (amountLkr > totalAvailable) {
      throw new BadRequestException('Requested amount exceeds available payout balance');
    }

    if (amountLkr <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    // Determine how many blocks are being paid out (simplified logic)
    let accumulated = 0;
    const blocksToInclude = [];
    for (const block of completedBlocks) {
      if (accumulated >= amountLkr) break;
      accumulated += block.payoutAmountLkr;
      blocksToInclude.push(block.id);
    }

    // Create payout request
    const payout = await this.prisma.payout.create({
      data: {
        lecturerId,
        amountLkr,
        method,
        status: 'PENDING',
        sessionBlocksIncluded: blocksToInclude,
      },
    });

    // Mark those blocks as PAID_OUT or PENDING payout (depending on business logic)
    await this.prisma.sessionBlock.updateMany({
      where: { id: { in: blocksToInclude } },
      data: { status: 'PAID_OUT' }, // Or intermediate state
    });

    return payout;
  }
}
