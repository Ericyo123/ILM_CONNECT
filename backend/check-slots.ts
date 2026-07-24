import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const lecturers = await prisma.lecturerProfile.findMany();
  console.log("Lecturers:", lecturers.map(l => l.userId));
  
  const slots = await prisma.availabilitySlot.findMany({
    take: 5
  });
  console.log("First 5 slots:", slots);
  
  const students = await prisma.studentProfile.findMany({
     take: 1,
     include: {
        sessions: {
           include: {
              lecturer: true
           }
        }
     }
  });
  console.log("First student sessions:", students[0]?.sessions.length);
  console.log("First student upcoming sessions:", students[0]?.sessions.filter(s => new Date(s.startsAt) > new Date()).length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
