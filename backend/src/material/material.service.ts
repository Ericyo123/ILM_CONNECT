import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async getMaterials(userRole: Role, userId: string) {
    if (userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN) {
      return this.prisma.material.findMany({ orderBy: { title: 'asc' } });
    }

    if (userRole === Role.LECTURER) {
      // Lecturer sees materials they uploaded
      return this.prisma.material.findMany({
        where: { uploaderId: userId },
        orderBy: { title: 'asc' },
      });
    }

    // Student sees materials from their sessions
    const studentSessions = await this.prisma.session.findMany({
      where: { studentId: userId },
      select: { id: true },
    });
    const sessionIds = studentSessions.map((s: any) => s.id);

    return this.prisma.material.findMany({
      where: { sessionId: { in: sessionIds } },
      orderBy: { title: 'asc' },
    });
  }

  async createUploadIntent(
    uploaderId: string,
    title: string,
    fileType: string,
    fileSize: number,
    sessionId?: string,
  ) {
    // Placeholder for S3 presigned URL generation
    const fakePresignedUrl = `https://s3.placeholder.com/upload/${Math.random().toString(36).substring(7)}`;

    const material = await this.prisma.material.create({
      data: {
        uploaderId,
        sessionId,
        title,
        fileType,
        fileSize,
        fileUrl: fakePresignedUrl, // Initially pointing to the upload link or final destination
        virusScanStatus: 'PENDING',
      },
    });

    return {
      uploadUrl: fakePresignedUrl,
      materialId: material.id,
    };
  }
}
