import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Synchronizing sessions to match assigned lecturers...');
  
  const students = await prisma.studentProfile.findMany();
  let updatedCount = 0;
  
  for (const student of students) {
    if (student.assignedLecturerId) {
      const res = await prisma.session.updateMany({
        where: { studentId: student.userId },
        data: { lecturerId: student.assignedLecturerId }
      });
      updatedCount += res.count;
    }
  }
  console.log(`✅ Successfully synchronized ${updatedCount} sessions to match students' assigned lecturers!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
