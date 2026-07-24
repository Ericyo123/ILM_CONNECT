import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getUsers(@Query('role') role?: string, @Query('status') status?: string) {
    return this.adminService.getUsers(role, status);
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('sessions')
  getSessions() {
    return this.adminService.getSessions();
  }

  @Get('finance')
  getFinanceOverview() {
    return this.adminService.getFinanceOverview();
  }

  @Get('audit-logs')
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }

  @Patch('payouts/:id/status')
  updatePayoutStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updatePayoutStatus(id, status);
  }
}
