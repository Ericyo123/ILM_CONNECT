import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async submitFeedback(studentId: string, sessionId: string, lecturerId: string, score: number, comment: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');

    const rating = await this.prisma.rating.create({
      data: {
        studentId,
        sessionId,
        lecturerId,
        score,
        comment,
      },
    });

    // Optionally update lecturer's aggregate rating here
    const allRatings = await this.prisma.rating.aggregate({
      where: { lecturerId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.lecturerProfile.update({
      where: { userId: lecturerId },
      data: {
        ratingAvg: allRatings._avg.score || 0,
        ratingCount: allRatings._count.score || 0,
      },
    });

    return rating;
  }

  async getAllFeedbacks() {
    return this.prisma.rating.findMany({
      include: {
        student: { select: { userId: true, fullName: true } },
        lecturer: { select: { userId: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLecturerFeedbacks(lecturerId: string) {
    return this.prisma.rating.findMany({
      where: { lecturerId },
      select: {
        id: true,
        score: true,
        comment: true,
        createdAt: true,
        // Anonymized: NOT returning student details here
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
