import { PrismaClient } from '@prisma/client';


import { Priority, Status, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.task.deleteMany();
  await prisma.user.deleteMany();


  const user1 = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      login: 'alice_smith',
      password: 'password123', 
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Johnson',
      login: 'bob_johnson',
      password: 'password456',
      role: Role.MANAGER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      firstName: 'Charlie',
      lastName: 'Brown',
      login: 'charlie_brown',
      password: 'password789',
      role: Role.USER,
      managerId: user2.id, 
    },
  });

  console.log('Users created:', { user1, user2, user3 });

  const tasks = [
    {
      title: 'Task 1',
      description: 'Complete the project proposal',
      dueDate: new Date('2023-11-15T18:00:00Z'),
      priority: Priority.HIGH, 
      status: Status.TODO,     
      creatorId: user1.id,
      assigneeId: user3.id,
    },
    {
      title: 'Task 2',
      description: 'Review the code changes',
      dueDate: new Date('2023-11-16T12:00:00Z'),
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      creatorId: user2.id,
      assigneeId: user1.id,
    },
    {
      title: 'Task 3',
      description: 'Prepare the presentation slides',
      dueDate: new Date('2023-11-17T10:00:00Z'),
      priority: Priority.LOW,
      status: Status.DONE,
      creatorId: user3.id,
      assigneeId: user2.id,
    },
    {
      title: 'Task 4',
      description: 'Fix the bug in the login module',
      dueDate: new Date('2023-11-18T14:00:00Z'),
      priority: Priority.HIGH,
      status: Status.TODO,
      creatorId: user1.id,
      assigneeId: user1.id,
    },
    {
      title: 'Task 5',
      description: 'Write unit tests for the API',
      dueDate: new Date('2023-11-19T09:00:00Z'),
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      creatorId: user2.id,
      assigneeId: user3.id,
    },
    {
      title: 'Task 6',
      description: 'Optimize the database queries',
      dueDate: new Date('2023-11-20T16:00:00Z'),
      priority: Priority.LOW,
      status: Status.CANCELED,
      creatorId: user3.id,
      assigneeId: user2.id,
    },
    {
      title: 'Task 7',
      description: 'Update the documentation',
      dueDate: new Date('2023-11-21T11:00:00Z'),
      priority: Priority.HIGH,
      status: Status.TODO,
      creatorId: user1.id,
      assigneeId: user2.id,
    },
    {
      title: 'Task 8',
      description: 'Deploy the application to staging',
      dueDate: new Date('2023-11-22T13:00:00Z'),
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      creatorId: user2.id,
      assigneeId: user1.id,
    },
    {
      title: 'Task 9',
      description: 'Conduct a team meeting',
      dueDate: new Date('2023-11-23T08:00:00Z'),
      priority: Priority.LOW,
      status: Status.DONE,
      creatorId: user3.id,
      assigneeId: user3.id,
    },
    {
      title: 'Task 10',
      description: 'Plan the next sprint',
      dueDate: new Date('2023-11-24T15:00:00Z'),
      priority: Priority.HIGH,
      status: Status.TODO,
      creatorId: user1.id,
      assigneeId: user2.id,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData,
    });
  }

  console.log('Tasks created:', tasks);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });