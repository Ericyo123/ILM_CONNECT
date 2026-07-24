import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MaterialService } from './material.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  getMaterials(@Request() req: any) {
    return this.materialService.getMaterials(req.user.role, req.user.id);
  }

  @Post('upload')
  @Roles(Role.LECTURER, Role.ADMIN)
  createUploadIntent(
    @Request() req: any,
    @Body('title') title: string,
    @Body('fileType') fileType: string,
    @Body('fileSize') fileSize: number,
    @Body('sessionId') sessionId?: string,
  ) {
    return this.materialService.createUploadIntent(req.user.id, title, fileType, fileSize, sessionId);
  }
}
