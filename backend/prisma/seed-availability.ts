import 'dotenv/config';
import { PrismaClient, SlotStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Fetching lecturers...');
  const lecturers = await prisma.lecturerProfile.findMany();
  
  if (lecturers.length === 0) {
    console.log('No lecturers found. Run the main seed first.');
    return;
  }

  console.log(`Found ${lecturers.length} lecturers. Generating slots...`);
  
  const today = new Date();
  
  let slotsCreated = 0;
  
  // First, delete existing slots to avoid duplicates
  await prisma.availabilitySlot.deleteMany({});
  console.log('Cleared existing slots.');
  
  for (const lecturer of lecturers) {
    for (let dayOffset = 0; dayOffset < 28; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      
      const hours = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20];
      
      for (const hour of hours) {
        const hash = (lecturer.userId + hour + dayOffset).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const isAvailable = Math.sin(hash) > -0.3; 
        
        if (isAvailable) {
          const startsAt = new Date(date);
          startsAt.setHours(hour, 0, 0, 0);
          
          const endsAt = new Date(startsAt);
          endsAt.setMinutes(45);
          
          if (startsAt > new Date()) {
            await prisma.availabilitySlot.create({
              data: {
                lecturerId: lecturer.userId,
                startsAt,
                endsAt,
                status: SlotStatus.OPEN,
              }
            });
            slotsCreated++;
          }
        }
      }
    }
  }
  
  console.log(`Successfully created ${slotsCreated} availability slots for the next 4 weeks!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
