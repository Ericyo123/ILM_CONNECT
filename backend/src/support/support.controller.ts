import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('request')
  async createTicket(@Req() req: any, @Body() body: { type: string; reason?: string }) {
    return this.supportService.createSupportTicket(req.user.id, body.type, body.reason);
  }

  @Get('my-tickets')
  async getMyTickets(@Req() req: any) {
    return this.supportService.getMyTickets(req.user.id);
  }

  @Get('tickets')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getAllTickets() {
    return this.supportService.getAllTickets();
  }

  @Patch('tickets/:id/status')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async updateTicketStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.supportService.updateTicketStatus(id, body.status);
  }
}
