import 'dotenv/config';
import { PrismaClient, SessionStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as crypto from 'crypto';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const lecturer = await prisma.user.findFirst({
    where: { email: 'ahmed.raza@ilmconnect.com' }
  });
  
  const student = await prisma.user.findFirst({
    where: { role: 'STUDENT' }
  });

  if (!lecturer || !student) {
    console.error('Could not find users');
    return;
  }

  const sessionId = crypto.randomUUID();
  const startsAt = new Date();
  const endsAt = new Date(startsAt.getTime() + 45 * 60 * 1000); // +45 mins

  await prisma.session.create({
    data: {
      id: sessionId,
      studentId: student.id,
      lecturerId: lecturer.id,
      startsAt,
      endsAt,
      status: SessionStatus.SCHEDULED,
      livekitRoomName: `ilm-session-${sessionId}`,
    }
  });

  console.log(`✅ Created test session for right now!`);
  console.log(`Lecturer: ahmed.raza@ilmconnect.com`);
  console.log(`Student: ${student.email}`);
  console.log(`Password for both: password123`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
