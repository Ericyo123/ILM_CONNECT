import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Welcome to IlmConnect API Services!';
  }

  async getHealth() {
    let dbStatus = 'OFFLINE';
    try {
      // Quick ping query to verify database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'ONLINE';
    } catch (e) {
      dbStatus = 'UNCONFIGURED / OFFLINE (Check DATABASE_URL in .env)';
    }

    return {
      status: 'ACTIVE',
      timestamp: new Date().toISOString(),
      services: {
        api: 'ONLINE',
        database: dbStatus,
        cache: 'STANDALONE_FALLBACK (Redis un-reachable or optional)',
      },
    };
  }
}
