# Лабораторна робота №4

## Інтеграція з віддаленими джерелами даних та заміна статичних даних

---

## Мета роботи

Метою лабораторної роботи є підключення застосунку StudyFlow до реальної бази даних, заміна статичних даних на роботу з БД, а також реалізація backend API для зберігання та отримання інформації про курси і завдання.

---

## Загальний опис виконаної роботи

У попередній лабораторній роботі (Lab 3) застосунок працював зі статичними даними, які зберігались на стороні клієнта.
У межах Lab 4 було реалізовано повноцінну інтеграцію з віддаленим джерелом даних - PostgreSQL.
Для цього був створений backend на Node.js з використанням Express та Prisma ORM, а також налаштовано Docker Compose для запуску всієї системи.

### Примітка

На цьому етапі з проєкту була видалена авторизація.
Під час реалізації виникли проблеми з коректною інтеграцією механізму авторизації разом із Prisma та Docker-оточенням.
Оскільки основною метою лабораторної роботи 4 є саме інтеграція з базою даних, було прийнято рішення тимчасово зосередитись на CRUD-операціях і стабільній роботі з БД без авторизації.

## Архітектура рішення

### Загальна схема

```
Frontend (React)
  HTTP (JSON)
Backend (Express + Prisma)
  SQL
PostgreSQL (Docker)
```

Frontend звертається до backend через REST API. Backend використовує ORM **Prisma** для доступу до бази даних PostgreSQL.

---

## Віддалене джерело даних

### PostgreSQL + Docker

Для розгортання бази даних використовується Docker Compose, що дозволяє легко запускати весь проєкт локально.

```yaml
version: '3.9'

services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: studyflow
      POSTGRES_PASSWORD: studyflow
      POSTGRES_DB: studyflow
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U studyflow']
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://studyflow:studyflow@db:5432/studyflow?schema=public
      PORT: '3000'
    depends_on:
      db:
        condition: service_healthy
    ports:
      - '3000:3000'
    command: >
      sh -c "
        echo 'Waiting for database...' &&
        sleep 5 &&
        npx prisma migrate deploy --config=prisma.config.cjs &&
        node dist/index.js"

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    depends_on:
      - api
    ports:
      - '5173:80'

volumes:
  postgres_data:
```

Запуск системи:

```bash
docker compose build --no-cache
docker compose up -d
```

---

## Модель даних (Prisma)

### Prisma schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum AssignmentStatus {
  planned
  in_progress
  done
}

enum Priority {
  low
  medium
  high
}

model Course {
  id          String      @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  assignments Assignment[]

  @@map("courses")
}

model Assignment {
  id          String           @id @default(uuid())
  courseId    String
  title       String
  description String?
  status      AssignmentStatus @default(planned)
  priority    Priority         @default(medium)
  dueDate     DateTime?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  course      Course           @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@index([courseId])
  @@map("assignments")
}
```

---

## Backend API

Backend реалізує REST API для роботи з курсами та завданнями.

### Courses API

- GET /api/courses — отримати список курсів
- POST /api/courses — створити новий курс
- PUT /api/courses/:id — оновити курс
- DELETE /api/courses/:id — видалити курс

### Assignments API

- GET /api/assignments — отримати список завдань
- POST /api/assignments — створити нове завдання
- PUT /api/assignments/:id — оновити завдання
- DELETE /api/assignments/:id — видалити завдання

API працює без авторизації, що дозволяє зосередитись на коректній роботі з базою даних.

---

## Заміна статичних даних на реальні

У Lab3 дані зберігались у LocalStorage. У Lab4:

- LocalStorage більше не використовується для курсів і завдань;
- всі CRUD-операції виконуються через backend API;
- frontend отримує дані з PostgreSQL.

---

## Frontend інтеграція

### DataContext

Frontend використовує `DataContext`, який:

- завантажує дані з `/api/courses` та `/api/assignments`;
- виконує CRUD-операції через HTTP;
- синхронізує React state з відповідями backend.

---

## Тестування backend

### Перевірка health endpoint

```bash
GET /health
```

Очікувано:

```json
{ "status": "ok" }
```

### Тестування через PowerShell

Для тестування використовувався локально запущена через Docker Compose система.

Перевірялись сценарії:

- створення курсу;
- створення завдання;
- зміна статусу;
- каскадне видалення;
- персистентність даних після рестарту сервера.

---

## Результати

- Backend успішно підключений до PostgreSQL;
- дані зберігаються у БД та не втрачаються після перезапуску;
- frontend працює з реальними даними;
- система готова до наступних лабораторних робіт (тестування та CI/CD).

---

## Висновок

У межах лабораторної роботи 4 було реалізовано інтеграцію з віддаленим джерелом даних PostgreSQL, створено backend API з використанням Express та Prisma, а також виконано заміну статичних даних на реальні.
Отримане рішення забезпечує повноцінну клієнт-серверну взаємодію та підготовлене до подальшого тестування і розгортання.
