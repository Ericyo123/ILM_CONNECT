import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('curriculum')
@UseGuards(JwtAuthGuard)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('paths')
  async getAllPaths() {
    return this.curriculumService.getAllPaths();
  }

  @Get('paths/:id')
  async getPath(@Param('id') id: string) {
    return this.curriculumService.getPath(id);
  }
}
