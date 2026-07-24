import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('student')
  @Roles(Role.STUDENT)
  async getStudentProgress(@Req() req: any) {
    return this.progressService.getStudentProgress(req.user.id);
  }

  @Post('advance')
  @Roles(Role.LECTURER, Role.ADMIN)
  async advanceProgress(@Req() req: any, studentId: string) {
    return this.progressService.advanceProgress(studentId);
  }

  @Get('certificates')
  @Roles(Role.STUDENT)
  async getCertificates(@Req() req: any) {
    return this.progressService.getCertificates(req.user.id);
  }
}
