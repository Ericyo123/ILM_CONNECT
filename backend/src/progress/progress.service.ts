import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentProgress(studentId: string) {
    const progress = await this.prisma.studentProgress.findUnique({
      where: { studentId },
      include: {
        currentLearningPath: true,
        currentModule: true,
        currentLesson: true,
      },
    });
    if (!progress) throw new NotFoundException('Student progress not found');
    return progress;
  }

  async advanceProgress(studentId: string) {
    // In a real app, this would figure out the NEXT lesson and update progress.
    // For now, we'll just return the progress.
    return this.getStudentProgress(studentId);
  }

  async getCertificates(studentId: string) {
    return this.prisma.certificate.findMany({
      where: { studentId },
      include: { learningPath: true },
    });
  }
}
