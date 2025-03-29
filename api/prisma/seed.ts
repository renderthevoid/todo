import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { Priority, Role, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const passwords = await Promise.all([
    hashPassword("пароль123"),
    hashPassword("пароль456"),
    hashPassword("пароль789"),
    hashPassword("пароль000"),
    hashPassword("пароль111"),
  ]);


  const director = await prisma.user.create({
    data: {
      firstName: "Владимир",
      lastName: "Петров",
      middleName: "Сергеевич",
      login: "petrov_vs",
      password: passwords[0],
      role: Role.MANAGER,
    },
  });


  const finDirector = await prisma.user.create({
    data: {
      firstName: "Анна",
      lastName: "Смирнова",
      middleName: "Игоревна",
      login: "smirnova_ai",
      password: passwords[1],
      role: Role.MANAGER,
      managerId: director.id,
    },
  });


  const salesManager = await prisma.user.create({
    data: {
      firstName: "Дмитрий",
      lastName: "Суворов",
      middleName: "Адидасович",
      login: "suvorov_da",
      password: passwords[2],
      role: Role.MANAGER,
      managerId: finDirector.id,
    },
  });

  const salesRep1 = await prisma.user.create({
    data: {
      firstName: "Ольга",
      lastName: "Кузнецова",
      middleName: "Викторовна",
      login: "kuznetsova_ov",
      password: passwords[3],
      role: Role.USER,
      managerId: salesManager.id,
    },
  });

  const assistant = await prisma.user.create({
    data: {
      firstName: "Иван",
      lastName: "Сидоров",
      middleName: "Петрович",
      login: "sidorov_ip",
      password: passwords[4],
      role: Role.USER,
      managerId: salesRep1.id,
    },
  });


  const itTasks = [
    {
      title: "Разработать микросервис аутентификации",
      description: "Создать JWT-аутентификацию с refresh-токенами",
      dueDate: new Date("2025-04-15T18:00:00Z"),
      priority: Priority.HIGH,
      status: Status.TODO,
      creatorId: director.id, 
      assigneeId: salesManager.id,
    },
    {
      title: "Оптимизировать запросы к PostgreSQL",
      description: "Проанализировать медленные запросы и добавить индексы",
      dueDate: new Date("2025-04-10T12:00:00Z"),
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      creatorId: salesManager.id,
      assigneeId: salesManager.id, 
    },
    {
      title: "Внедрить Sentry для мониторинга ошибок",
      description: "Настроить интеграцию с фронтендом и бэкендом",
      dueDate: new Date("2025-04-05T14:00:00Z"),
      priority: Priority.HIGH,
      status: Status.DONE,
      creatorId: finDirector.id, 
      assigneeId: salesRep1.id, 
    },
    {
      title: "Рефакторинг легаси-кода",
      description: "Переписать модуль отчетов на TypeScript",
      dueDate: new Date("2025-04-20T09:00:00Z"),
      priority: Priority.MEDIUM,
      status: Status.TODO,
      creatorId: salesRep1.id, 
      assigneeId: assistant.id, 
    },
    {
      title: "Настроить CI/CD пайплайн",
      description: "Автоматизировать деплой в продакшен при мердже в main",
      dueDate: new Date("2025-11-30T16:00:00Z"),
      priority: Priority.HIGH,
      status: Status.IN_PROGRESS,
      creatorId: director.id, 
      assigneeId: finDirector.id, 
    },
    {
      title: "Провести код-ревью PR #154",
      description: "Проверить изменения в API контрактах",
      dueDate: new Date("2025-11-25T11:00:00Z"),
      priority: Priority.LOW,
      status: Status.TODO,
      creatorId: assistant.id, 
      assigneeId: assistant.id, 
    },
    {
      title: "Обновить документацию Swagger",
      description: "Добавить новые endpoints и примеры запросов",
      dueDate: new Date("2025-04-01T13:00:00Z"),
      priority: Priority.MEDIUM,
      status: Status.TODO,
      creatorId: salesManager.id, 
      assigneeId: salesRep1.id, 
    },
    {
      title: "Исследовать переход на React 18",
      description: "Проанализировать breaking changes и преимущества",
      dueDate: new Date("2025-04-12T10:00:00Z"),
      priority: Priority.LOW,
      status: Status.IN_PROGRESS,
      creatorId: salesRep1.id,
      assigneeId: salesManager.id, 
    },
    {
      title: "Написать e2e тесты для checkout",
      description: "Покрыть основные сценарии оплаты",
      dueDate: new Date("2025-04-08T15:00:00Z"),
      priority: Priority.HIGH,
      status: Status.TODO,
      creatorId: finDirector.id, 
      assigneeId: finDirector.id,
    },
    {
      title: "Митинг по архитектуре",
      description: "Обсудить переход на event-driven архитектуру",
      dueDate: new Date("2025-11-28T09:00:00Z"),
      priority: Priority.LOW,
      status: Status.DONE,
      creatorId: director.id, 
      assigneeId: director.id, 
    }
  ];
  
  await prisma.task.createMany({
    data: itTasks,
  });


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
