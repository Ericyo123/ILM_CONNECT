import 'dotenv/config';
import { PrismaClient, Role, UserStatus, SessionStatus, SlotStatus, BlockStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as crypto from 'crypto';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting simplified database seeding...');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning old database records...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.message.deleteMany();
  await prisma.progressReport.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.material.deleteMany();
  await prisma.sessionNotes.deleteMany();
  await prisma.sessionBlock.deleteMany();
  await prisma.session.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.lecturerProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('ilmconnect123', saltRounds);

  // 3. Create Super Admin
  console.log('🔑 Creating Super Admin...');
  await prisma.user.create({
    data: {
      email: 'superadmin@ilmconnect.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  // 4. Create Admin
  console.log('🔑 Creating Admin...');
  await prisma.user.create({
    data: {
      email: 'admin@ilmconnect.com',
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  // 5. Create 1 Lecturer
  console.log('👳 Creating 1 Lecturer...');
  const lecturer = await prisma.user.create({
    data: {
      email: 'ahmed.raza@ilmconnect.com',
      passwordHash,
      role: Role.LECTURER,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      lecturerProfile: {
        create: {
          fullName: 'Maulavi Ahmed Raza',
          bio: 'Graduated from Al-Azhar University, with 12+ years of experience teaching Quran recitation and Tajweed rules.',
          qualifications: 'B.A. in Islamic Studies (Al-Azhar), Certified Hafiz-al-Quran',
          specializations: ['Tajweed', 'Quran Recitation'],
          languages: ['English', 'Arabic'],
          hourlyAvailabilityJson: [],
          payoutMethod: 'wise',
          payoutDetails: 'wise:ahmedraza@wise.com',
          ratingAvg: 4.9,
        }
      }
    },
    include: { lecturerProfile: true }
  });

  // 6. Create 3 Students
  console.log('🎓 Creating 3 Students...');
  const students = [];
  for (let i = 1; i <= 3; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@ilmconnect.com`,
        passwordHash,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        studentProfile: {
          create: {
            fullName: `Student ${i}`,
            phone: '+1234567890',
            country: 'US',
            timezone: 'Asia/Colombo',
            preferredLanguage: 'English',
            learningGoals: 'Memorize Juz Amma',
          }
        }
      }
    });
    students.push(student);
  }

  // 7. Generate simplified availability slots for the lecturer
  console.log('📅 Creating availability slots...');
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    // Add slots at 10 AM and 4 PM
    const hours = [10, 16];
    for (const hour of hours) {
      const startsAt = new Date(date);
      startsAt.setHours(hour, 0, 0, 0);
      const endsAt = new Date(startsAt);
      endsAt.setMinutes(45);
      
      if (startsAt > new Date()) {
        await prisma.availabilitySlot.create({
          data: {
            lecturerId: lecturer.id,
            startsAt,
            endsAt,
            status: SlotStatus.OPEN,
          }
        });
      }
    }
  }

  // 8. Create basic sessions
  console.log('📚 Creating basic sessions...');
  
  // Give Student 1 a session today
  const session1Id = crypto.randomUUID();
  const s1Start = new Date();
  s1Start.setHours(s1Start.getHours() + 1);
  const s1End = new Date(s1Start);
  s1End.setMinutes(s1End.getMinutes() + 45);

  await prisma.session.create({
    data: {
      id: session1Id,
      studentId: students[0].id,
      lecturerId: lecturer.id,
      startsAt: s1Start,
      endsAt: s1End,
      status: SessionStatus.SCHEDULED,
      livekitRoomName: `ilm-session-${session1Id}`
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
