import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';
import { AdminModule } from './admin/admin.module';
import { MessageModule } from './message/message.module';
import { FeedbackModule } from './feedback/feedback.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MaterialModule } from './material/material.module';
import { NotificationModule } from './notification/notification.module';
import { PayoutModule } from './payout/payout.module';
import { SupportModule } from './support/support.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ProgressModule } from './progress/progress.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    AvailabilityModule,
    BookingModule,
    AdminModule,
    MessageModule,
    FeedbackModule,
    SubscriptionModule,
    MaterialModule,
    NotificationModule,
    PayoutModule,
    SupportModule,
    CurriculumModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
