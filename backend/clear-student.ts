import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function clearSessions() {
  try {
    const deleted = await prisma.session.deleteMany();
    console.log(`Successfully deleted ${deleted.count} existing seed sessions for all students.`);
  } catch (error) {
    console.error("Error clearing sessions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearSessions();
