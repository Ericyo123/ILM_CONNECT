import { PrismaClient, Role, UserStatus, SessionStatus, SubscriptionStatus, SlotStatus, PaymentStatus, BlockStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  // 2. Hash default password for all mock accounts
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('ilmconnect123', saltRounds);

  // 3. Create Admins
  console.log('🔑 Creating Admin users...');
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@ilmconnect.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ilmconnect.com',
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  // 4. Create 5 Maulavis (Lecturers)
  console.log('👳 Creating 5 Lecturer (Maulavi) accounts...');
  const lecturersData = [
    {
      email: 'ahmed.raza@ilmconnect.com',
      fullName: 'Maulavi Ahmed Raza',
      bio: 'Graduated from Al-Azhar University, with 12+ years of experience teaching Quran recitation and Tajweed rules to international students.',
      qualifications: 'B.A. in Islamic Studies (Al-Azhar), Certified Hafiz-al-Quran',
      specializations: ['Tajweed', 'Quran Recitation', 'Arabic Language'],
      languages: ['English', 'Arabic', 'Tamil'],
      payoutMethod: 'wise',
      payoutDetails: 'wise:ahmedraza@wise.com',
      ratingAvg: 4.9,
    },
    {
      email: 'ismail.khan@ilmconnect.com',
      fullName: 'Maulavi Ismail Khan',
      bio: 'Specialist in Hadith studies and Islamic jurisprudence (Fiqh). Focuses on practical application of Sunnah for youth in Western countries.',
      qualifications: 'Degree in Shariah from Islamic University of Madinah',
      specializations: ['Hadith', 'Fiqh (Jurisprudence)', 'Aqeedah'],
      languages: ['English', 'Urdu', 'Arabic'],
      payoutMethod: 'bank_transfer',
      payoutDetails: 'bank:Commercial Bank LKR - Acc 1092837492',
      ratingAvg: 4.8,
    },
    {
      email: 'fatima.mohamed@ilmconnect.com',
      fullName: 'Ustadha Fatima Mohamed',
      bio: 'Dedicated scholar focusing on Islamic jurisprudence and Aqeedah for female students and kids. Custom lesson planner.',
      qualifications: 'Sanad in Quran Memorization, B.A. in Shariah',
      specializations: ['Hifz (Memorization)', 'Aqeedah', 'Fiqh for Sisters'],
      languages: ['English', 'Sinhala', 'Arabic'],
      payoutMethod: 'wise',
      payoutDetails: 'wise:fatima@wise.com',
      ratingAvg: 4.95,
    },
    {
      email: 'yousef.abdullah@ilmconnect.com',
      fullName: 'Maulavi Yousef Abdullah',
      bio: 'Expert in Quranic exegesis (Tafsir) and Arabic grammar. Helps students connect deeply with the meaning of the verses.',
      qualifications: 'M.A. in Quranic Sciences, University of Madinah',
      specializations: ['Tafsir', 'Quranic Arabic', 'Tajweed'],
      languages: ['English', 'Arabic'],
      payoutMethod: 'wise',
      payoutDetails: 'wise:yousef@wise.com',
      ratingAvg: 4.7,
    },
    {
      email: 'muhammad.siddiq@ilmconnect.com',
      fullName: 'Maulavi Muhammad Siddiq',
      bio: 'Hafiz since age 9. Specializes in intensive Hifz (memorization) pathways with rigorous revision systems.',
      qualifications: 'Hifz Certificate (Madrasah Hashimiah), 8 years teaching',
      specializations: ['Hifz (Memorization)', 'Tajweed', 'Islamic History'],
      languages: ['English', 'Urdu'],
      payoutMethod: 'bank_transfer',
      payoutDetails: 'bank:Sampath Bank LKR - Acc 8273948374',
      ratingAvg: 4.85,
    },
  ];

  const lecturers: any[] = [];
  for (const item of lecturersData) {
    const user = await prisma.user.create({
      data: {
        email: item.email,
        passwordHash,
        role: Role.LECTURER,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const profile = await prisma.lecturerProfile.create({
      data: {
        userId: user.id,
        fullName: item.fullName,
        bio: item.bio,
        qualifications: item.qualifications,
        specializations: item.specializations,
        languages: item.languages,
        hourlyAvailabilityJson: {
          monday: ['09:00-12:00', '14:00-18:00'],
          tuesday: ['09:00-12:00', '14:00-18:00'],
          wednesday: ['09:00-12:00', '14:00-18:00'],
          thursday: ['09:00-12:00', '14:00-18:00'],
          friday: ['09:00-12:00'],
          saturday: ['10:00-15:00'],
        },
        payoutMethod: item.payoutMethod,
        payoutDetails: item.payoutDetails,
        ratingAvg: item.ratingAvg,
        ratingCount: 15,
        status: UserStatus.ACTIVE,
      },
    });
    lecturers.push(profile);
  }

  // 5. Create 10 Students in Diaspora
  console.log('👦 Creating 10 Student accounts in global timezones...');
  const studentsData = [
    { email: 'omar.london@gmail.com', fullName: 'Omar Farooq', country: 'United Kingdom', timezone: 'Europe/London', goals: 'Learn Quran Tajweed from scratch', tier: 'Quran Basic', amount: 15000 },
    { email: 'sarah.nyc@gmail.com', fullName: 'Sarah Ahmed', country: 'United States', timezone: 'America/New_York', goals: 'Start Hifz of Juz Amma', tier: 'Quran Premium', amount: 18000 },
    { email: 'zayd.sydney@yahoo.com', fullName: 'Zayd Al-Faisal', country: 'Australia', timezone: 'Australia/Sydney', goals: 'Hadith and daily Sunnah practices', tier: 'Hadith / Fiqh / Islamic Law', amount: 20000 },
    { email: 'amina.melbourne@gmail.com', fullName: 'Amina Mansoor', country: 'Australia', timezone: 'Australia/Melbourne', goals: 'Advanced Quran recitation with Tafsir', tier: 'Quran Premium', amount: 18000 },
    { email: 'hamza.toronto@gmail.com', fullName: 'Hamza Malik', country: 'Canada', timezone: 'America/Toronto', goals: 'Basic Islamic Fiqh and Aqeedah studies', tier: 'Hadith / Fiqh / Islamic Law', amount: 20000 },
    { email: 'yasmine.dubai@gmail.com', fullName: 'Yasmine Al-Sayed', country: 'United Arab Emirates', timezone: 'Asia/Dubai', goals: 'Quran memorization and Arabic language', tier: 'Quran Premium', amount: 18000 },
    { email: 'bilal.chicago@gmail.com', fullName: 'Bilal Hussain', country: 'United States', timezone: 'America/Chicago', goals: 'Learn basic Quran reading (Noorani Qaida)', tier: 'Quran Basic', amount: 15000 },
    { email: 'maryam.paris@gmail.com', fullName: 'Maryam Dubois', country: 'France', timezone: 'Europe/Paris', goals: 'Quran Tajweed and sister Fiqh classes', tier: 'Quran Basic', amount: 15000 },
    { email: 'tareq.riyadh@gmail.com', fullName: 'Tareq Al-Sulaiman', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', goals: 'Fiqh jurisprudence and Aqeedah', tier: 'Hadith / Fiqh / Islamic Law', amount: 20000 },
    { email: 'zainab.perth@gmail.com', fullName: 'Zainab Qazi', country: 'Australia', timezone: 'Australia/Perth', goals: 'Intensive Hifz (memorization) pathways', tier: 'Quran Premium', amount: 18000 },
  ];

  const students: any[] = [];
  for (const item of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: item.email,
        passwordHash,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        fullName: item.fullName,
        phone: '+447911123456',
        country: item.country,
        timezone: item.timezone,
        preferredLanguage: 'English',
        learningGoals: item.goals,
        currentTier: item.tier,
      },
    });

    // Create Subscription
    const start = new Date();
    start.setDate(start.getDate() - 15); // Started 15 days ago
    const end = new Date(start);
    end.setDate(end.getDate() + 30); // Valid for 30 days

    const sub = await prisma.subscription.create({
      data: {
        studentId: profile.userId,
        tier: item.tier,
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: `sub_test_${Math.random().toString(36).substr(2, 9)}`,
        currentPeriodStart: start,
        currentPeriodEnd: end,
        lkrAmount: item.amount,
        fxRateApplied: 0.0033, // 1 LKR = 0.0033 USD approx
      },
    });

    // Create a historical payment
    await prisma.payment.create({
      data: {
        subscriptionId: sub.id,
        amountLkr: item.amount,
        fxRate: 0.0033,
        gateway: 'stripe',
        gatewayChargeId: `ch_test_${Math.random().toString(36).substr(2, 9)}`,
        status: PaymentStatus.SUCCESSFUL,
        processedAt: start,
      },
    });

    students.push(profile);
  }

  // 6. Generate 50 Sessions (Historical and Upcoming)
  console.log('📅 Generating 50 high-fidelity 1:1 sessions (past and future)...');
  
  const statuses = [
    SessionStatus.COMPLETED,
    SessionStatus.SCHEDULED,
    SessionStatus.NO_SHOW_STUDENT,
    SessionStatus.CANCELED,
  ];

  // Helper to get dates relative to now
  const addHours = (date: Date, h: number) => new Date(date.getTime() + h * 60 * 60 * 1000);
  const addDays = (date: Date, d: number) => new Date(date.getTime() + d * 24 * 60 * 60 * 1000);

  let sessionCount = 0;
  const baseDate = new Date(); // Today

  // Generate 50 sessions
  for (let i = 0; i < 50; i++) {
    const student = students[i % students.length];
    const lecturer = lecturers[i % lecturers.length];

    // Distribute half in the past, half in the future
    const isPast = i < 30; 
    const offsetDays = isPast ? -(30 - i) * 1.5 : (i - 29) * 1.5;
    
    // Pick an hour (e.g. 10:00 or 15:00)
    const hour = i % 2 === 0 ? 10 : 15;
    let startsAt = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    startsAt = addDays(startsAt, offsetDays);
    startsAt.setHours(hour, 0, 0, 0);

    const endsAt = addHours(startsAt, 0.75); // 45 minutes

    const status = isPast 
      ? (i % 8 === 0 ? SessionStatus.NO_SHOW_STUDENT : (i % 12 === 0 ? SessionStatus.CANCELED : SessionStatus.COMPLETED))
      : SessionStatus.SCHEDULED;

    const session = await prisma.session.create({
      data: {
        studentId: student.userId,
        lecturerId: lecturer.userId,
        startsAt,
        endsAt,
        status,
        zoomMeetingId: `zoom_${Math.floor(100000000 + Math.random() * 900000000)}`,
        zoomJoinUrl: 'https://zoom.us/j/mockmeeting',
        zoomPassword: 'mock_password_123',
        recordingUrl: status === SessionStatus.COMPLETED && i % 3 === 0 ? 'https://s3.amazonaws.com/ilmconnect-recordings/test.mp4' : null,
      },
    });

    sessionCount++;

    // Add Session Notes & Ratings for Completed Sessions
    if (status === SessionStatus.COMPLETED) {
      const notes = await prisma.sessionNotes.create({
        data: {
          sessionId: session.id,
          lecturerId: lecturer.userId,
          topicsCovered: 'Reviewed verses 1-15 of Surah Al-Mulk. Practiced heavy and light letters, focusing on proper articulation.',
          homework: 'Memorize verses 16-20 of Surah Al-Mulk, practice heavy letter rules in daily prayer recitation.',
          studentProgressRating: 4, // 4 out of 5
          internalNotes: 'Student did very well today but gets distracted towards the end. Needs mild encouragement.',
          sharedNotes: 'Excellent effort today. Focus on light/heavy letter separation for next class!',
        },
      });

      // Create a 2-session completion block to show payout engine
      if (i % 2 === 0) {
        await prisma.sessionBlock.create({
          data: {
            studentId: student.userId,
            lecturerId: lecturer.userId,
            session1Id: session.id,
            status: BlockStatus.COMPLETED,
            payoutAmountLkr: 2500.0,
            completedAt: startsAt,
          },
        });
      }

      // Add Rating from Student
      if (i % 3 === 0) {
        await prisma.rating.create({
          data: {
            sessionId: session.id,
            studentId: student.userId,
            lecturerId: lecturer.userId,
            score: 5,
            comment: 'Alhamdulillah, excellent session! The Maulavi explains Tajweed rules with so much patience and clarity.',
            createdAt: addHours(startsAt, 2),
          },
        });
      }
    }
  }

  // 7. Generate Availability slots
  console.log('📅 Generating availability slots for lecturers...');
  for (const lec of lecturers) {
    const slots = [1, 2, 3, 4, 5];
    for (const offset of slots) {
      let slotTime = addDays(baseDate, offset);
      slotTime.setHours(9, 0, 0, 0); // 9:00 AM

      await prisma.availabilitySlot.create({
        data: {
          lecturerId: lec.userId,
          startsAt: slotTime,
          endsAt: addHours(slotTime, 1),
          status: SlotStatus.OPEN,
        },
      });
    }
  }

  // 8. Generate some mock System Audit Logs
  console.log('🛡️ Creating system audit log entries...');
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_BOOTSTRAP',
      resourceType: 'SYSTEM',
      resourceId: 'seeder',
      ip: '127.0.0.1',
      userAgent: 'NestJS CLI Seeder',
    },
  });

  console.log(`✅ Seeding complete! Generated:`);
  console.log(`   - 2 Admins`);
  console.log(`   - 5 Active Lecturers (Maulavis)`);
  console.log(`   - 10 Active Diaspora Students with Tiers & Subscriptions`);
  console.log(`   - ${sessionCount} historical/upcoming 1:1 sessions`);
  console.log(`   - Associated Payments, Ratings, Notes, and Availability Slots.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
