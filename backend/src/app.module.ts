import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [PrismaModule, AuthModule, ProfileModule, AvailabilityModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
