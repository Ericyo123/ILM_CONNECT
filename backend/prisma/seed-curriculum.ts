import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: true });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedCurriculum() {
  console.log('🌱 Starting curriculum seeding...');

  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.learningPath.deleteMany();

  console.log('Creating Learning Path 1: Noorani Qaida...');
  const qaida = await prisma.learningPath.create({
    data: {
      title: 'Noorani Qaida',
      level: 'Foundation',
      difficulty: 'Beginner',
      description: 'Designed for complete beginners, Noorani Qaida teaches students the Arabic alphabet, pronunciation, vowels, letter connections, and the foundational reading skills required before beginning Quran recitation.',
      targetAudience: 'Children beginning Quran education, Complete beginners, Reverts with no Arabic reading experience, Students unable to read Arabic independently',
      objectives: 'Recognize every Arabic letter, Pronounce every letter correctly, Understand Makharij, Apply Harakat, Join letters correctly, Read simple Quranic words, Read short verses confidently',
    }
  });

  const qaidaModules = [
    { title: 'Arabic Alphabet', lessons: ['Alif to Khaa', 'Daal to Dhaad', 'Taa to Yaa', 'Alphabet Review'] },
    { title: 'Letter Pronunciation', lessons: ['Makharij Basics', 'Throat Letters', 'Tongue Letters', 'Lip Letters'] },
    { title: 'Harakat', lessons: ['Fatha (Short A)', 'Kasra (Short I)', 'Dhamma (Short U)', 'Harakat Practice'] },
    { title: 'Sukoon & Tanween', lessons: ['Understanding Sukoon', 'Fathatain', 'Kasratain', 'Dhammatain'] },
    { title: 'Madd Rules', lessons: ['Madd Asli', 'Madd Muttasil', 'Madd Munfasil', 'Madd Practice'] },
    { title: 'Joining Letters', lessons: ['Two Letter Words', 'Three Letter Words', 'Four Letter Words', 'Complex Words'] },
    { title: 'Word Reading', lessons: ['Basic Quranic Words', 'Intermediate Quranic Words', 'Advanced Quranic Words', 'Fluency Drill'] },
    { title: 'Short Surahs', lessons: ['Surah Al-Ikhlas', 'Surah Al-Falaq', 'Surah An-Nas', 'Surah Al-Fatiha'] },
  ];

  for (let mIdx = 0; mIdx < qaidaModules.length; mIdx++) {
    const mod = await prisma.module.create({
      data: {
        learningPathId: qaida.id,
        title: qaidaModules[mIdx].title,
        orderIndex: mIdx + 1,
      }
    });

    for (let lIdx = 0; lIdx < qaidaModules[mIdx].lessons.length; lIdx++) {
      await prisma.lesson.create({
        data: {
          moduleId: mod.id,
          title: qaidaModules[mIdx].lessons[lIdx],
          objectives: `Master ${qaidaModules[mIdx].lessons[lIdx]}`,
          durationMinutes: 45,
          orderIndex: lIdx + 1,
        }
      });
    }
  }

  console.log('Creating Learning Path 2: Quran Recitation...');
  const recitation = await prisma.learningPath.create({
    data: {
      title: 'Quran Recitation',
      level: 'Fluency',
      difficulty: 'Intermediate',
      description: 'Focuses on developing fluent Quran recitation while applying Tajweed rules correctly through structured practice and teacher guidance.',
      targetAudience: 'Students who completed Noorani Qaida, Can already read Arabic, Need fluency improvement',
      objectives: 'Read the Quran fluently, Apply Tajweed naturally, Improve pronunciation, Increase confidence, Read independently',
    }
  });

  const recitationModules = [
    { title: 'Introduction to Tajweed', lessons: ['Importance of Tajweed', 'Basic Principles'] },
    { title: 'Makharij Review', lessons: ['Refining Pronunciation', 'Common Mistakes'] },
    { title: 'Noon Sakinah', lessons: ['Izhaar', 'Idghaam', 'Iqlaab', 'Ikhfaa'] },
    { title: 'Meem Sakinah', lessons: ['Ikhfaa Shafawi', 'Idghaam Shafawi', 'Izhaar Shafawi'] },
    { title: 'Qalqalah', lessons: ['Minor Qalqalah', 'Major Qalqalah'] },
    { title: 'Madd', lessons: ['Review of Madd', 'Advanced Madd Rules'] },
    { title: 'Stopping Rules', lessons: ['Waqf', 'Saktah', 'How to Stop'] },
    { title: 'Continuous Reading', lessons: ['Juz 30 Practice', 'Fluency Development'] },
  ];

  for (let mIdx = 0; mIdx < recitationModules.length; mIdx++) {
    const mod = await prisma.module.create({
      data: {
        learningPathId: recitation.id,
        title: recitationModules[mIdx].title,
        orderIndex: mIdx + 1,
      }
    });

    for (let lIdx = 0; lIdx < recitationModules[mIdx].lessons.length; lIdx++) {
      await prisma.lesson.create({
        data: {
          moduleId: mod.id,
          title: recitationModules[mIdx].lessons[lIdx],
          objectives: `Master ${recitationModules[mIdx].lessons[lIdx]}`,
          durationMinutes: 45,
          orderIndex: lIdx + 1,
        }
      });
    }
  }

  console.log('Creating Learning Path 3: Hifz Program...');
  const hifz = await prisma.learningPath.create({
    data: {
      title: 'Hifz Program',
      level: 'Memorization',
      difficulty: 'Advanced',
      description: 'A structured memorization program combining daily Hifz, guided revision, and continuous evaluation to ensure strong long-term retention.',
      targetAudience: 'Students with fluent Quran reading.',
      objectives: 'Memorize selected Surahs or Juz, Improve retention, Build revision habits, Maintain Tajweed during memorization',
    }
  });

  const hifzModules = [
    { title: 'Memorization Strategy', lessons: ['How to Memorize', 'Setting a Schedule'] },
    { title: 'Daily Hifz', lessons: ['New Lesson Practice', 'Teacher Review'] },
    { title: 'Revision', lessons: ['Sabaq (Recent)', 'Manzil (Old)'] },
    { title: 'Weekly Review', lessons: ['Consolidation', 'Correction'] },
  ];

  for (let mIdx = 0; mIdx < hifzModules.length; mIdx++) {
    const mod = await prisma.module.create({
      data: {
        learningPathId: hifz.id,
        title: hifzModules[mIdx].title,
        orderIndex: mIdx + 1,
      }
    });

    for (let lIdx = 0; lIdx < hifzModules[mIdx].lessons.length; lIdx++) {
      await prisma.lesson.create({
        data: {
          moduleId: mod.id,
          title: hifzModules[mIdx].lessons[lIdx],
          objectives: `Master ${hifzModules[mIdx].lessons[lIdx]}`,
          durationMinutes: 45,
          orderIndex: lIdx + 1,
        }
      });
    }
  }
  
  console.log('✅ Curriculum created successfully!');
  
  // Assign all students to Noorani Qaida module 1 lesson 1
  console.log('Migrating existing students to Noorani Qaida...');
  
  const qaidaFirstModule = await prisma.module.findFirst({
    where: { learningPathId: qaida.id },
    orderBy: { orderIndex: 'asc' }
  });
  
  const qaidaFirstLesson = await prisma.lesson.findFirst({
    where: { moduleId: qaidaFirstModule!.id },
    orderBy: { orderIndex: 'asc' }
  });

  // Assign lecturer 1 to all students
  const firstLecturer = await prisma.lecturerProfile.findFirst();

  const students = await prisma.studentProfile.findMany();
  for (const student of students) {
    await prisma.studentProfile.update({
      where: { userId: student.userId },
      data: { assignedLecturerId: firstLecturer?.userId }
    });
    
    // Create progress tracker if not exist
    const existing = await prisma.studentProgress.findUnique({ where: { studentId: student.userId } });
    if (!existing) {
      await prisma.studentProgress.create({
        data: {
          studentId: student.userId,
          currentLearningPathId: qaida.id,
          currentModuleId: qaidaFirstModule!.id,
          currentLessonId: qaidaFirstLesson!.id,
          progressPercentage: 0,
        }
      });
    }
  }
  
  console.log('✅ Students migrated successfully!');
}

seedCurriculum()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
