import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getThreads(userId: string) {
    // This gives us messages where the user is either sender or recipient
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['threadId'],
      include: {
        sender: { select: { id: true, email: true } },
        recipient: { select: { id: true, email: true } },
      },
    });

    return messages;
  }

  async getMessagesInThread(userId: string, threadId: string) {
    const messages = await this.prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });

    // Check if the user is part of this thread
    if (messages.length > 0) {
      const isParticipant = messages.some(
        (m: any) => m.senderId === userId || m.recipientId === userId
      );
      if (!isParticipant) {
        throw new ForbiddenException('You are not a participant in this thread');
      }
    }

    return messages;
  }

  async sendMessage(senderId: string, recipientId: string, content: string, threadId?: string) {
    // Generate threadId if not provided (e.g. hash of both user ids sorted)
    const newThreadId = threadId || [senderId, recipientId].sort().join('_');

    return this.prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
        threadId: newThreadId,
      },
    });
  }
}
