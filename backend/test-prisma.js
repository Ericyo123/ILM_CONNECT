const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

async function main() {
  console.log("Connecting to:", process.env.DATABASE_URL);
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    console.log("Prisma instantiated, finding user...");
    const count = await prisma.user.count();
    const user = await prisma.user.findUnique({
      where: { email: 'superadmin@ilmconnect.com' }
    });
    console.log(`Success! Total users: ${count}. Found superadmin: ${user?.email}`);
  } catch (e) {
    console.error("Prisma Error:", e);
  }
}
main();
