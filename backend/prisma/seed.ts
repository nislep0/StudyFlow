import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.assignment.deleteMany();
  await prisma.course.deleteMany();

  const course1 = await prisma.course.create({
    data: {
      name: 'Algorithms and Data Structures',
      description: 'Basic data structures and algorithms course',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Web Development',
      description: 'Frontend and Backend development',
    },
  });

  const course3 = await prisma.course.create({
    data: {
      name: 'Database Systems',
      description: 'SQL, NoSQL and database design',
    },
  });

  const assignments = [
    {
      courseId: course1.id,
      title: 'Lab 1: Arrays and Linked Lists',
      description: 'Implement basic data structures',
      status: 'done' as const,
      priority: 'medium' as const,
      dueDate: new Date('2024-01-15'),
    },
    {
      courseId: course1.id,
      title: 'Lab 2: Sorting Algorithms',
      description: 'Implement quicksort and mergesort',
      status: 'in_progress' as const,
      priority: 'high' as const,
      dueDate: new Date('2024-02-01'),
    },
    {
      courseId: course2.id,
      title: 'HTML/CSS Project',
      description: 'Create responsive website',
      status: 'done' as const,
      priority: 'low' as const,
      dueDate: new Date('2024-01-10'),
    },
    {
      courseId: course2.id,
      title: 'React Application',
      description: 'Build SPA with React and TypeScript',
      status: 'in_progress' as const,
      priority: 'high' as const,
      dueDate: new Date('2024-02-15'),
    },
    {
      courseId: course3.id,
      title: 'SQL Queries Practice',
      description: 'Complete SQL exercises',
      status: 'planned' as const,
      priority: 'medium' as const,
      dueDate: new Date('2024-02-20'),
    },
  ];

  for (const assignment of assignments) {
    await prisma.assignment.create({ data: assignment });
  }

  console.log('Database seeded successfully!');
  console.log(`Courses created: 3`);
  console.log(`Assignments created: ${assignments.length}`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
