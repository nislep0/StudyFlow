# Лабораторна робота №4

## Інтеграція з віддаленими джерелами даних та заміна статичних даних

---

## Мета роботи

Метою лабораторної роботи є:

- інтеграція застосунку **StudyFlow** з віддаленим джерелом даних;
- заміна статичних даних (LocalStorage) на реальну роботу з базою даних;
- реалізація повноцінного backend API для доступу до даних;
- перевірка коректної взаємодії frontend <-> backend <-> database.

---

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

Для розгортання бази даних використовується Docker Compose.

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
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U studyflow -d studyflow']
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
      JWT_SECRET: dev_secret_change_me
      PORT: '3000'
    depends_on:
      db:
        condition: service_healthy
    ports:
      - '3000:3000'

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_BASE: /api
    depends_on:
      - api
    ports:
      - '5173:80'

volumes:
  dbdata:
```

Запуск системи:

```bash
docker compose build --no-cache api
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

model User {
  id String @id @default(uuid())
  email String @unique
  passwordHash String
  fullName String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courses Course[]
  assignments Assignment[]
}

model Course {
  id String @id @default(uuid())
  userId String
  name String
  description String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignments Assignment[]

  @@index([userId])
}

model Assignment {
  id String @id @default(uuid())
  userId String
  courseId String
  title String
  description String?
  status AssignmentStatus @default(planned)
  priority Priority @default(medium)
  dueDate DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([courseId])
}
```

---

## Backend API

### Авторизація (тимчасова)

Для Lab4 використовується спрощена авторизація через HTTP-заголовок:

```
x-user-id: <USER_ID>
```

Цей ідентифікатор використовується backend для фільтрації даних конкретного користувача.

---

### Courses API

| Метод  | Шлях             | Опис                       |
| ------ | ---------------- | -------------------------- |
| GET    | /api/courses     | Отримати курси користувача |
| POST   | /api/courses     | Створити курс              |
| PUT    | /api/courses/:id | Оновити курс               |
| DELETE | /api/courses/:id | Видалити курс              |

---

### Assignments API

| Метод  | Шлях                 | Опис              |
| ------ | -------------------- | ----------------- |
| GET    | /api/assignments     | Отримати завдання |
| POST   | /api/assignments     | Створити завдання |
| PUT    | /api/assignments/:id | Оновити завдання  |
| DELETE | /api/assignments/:id | Видалити завдання |

---

## Заміна статичних даних на реальні

У Lab3 дані зберігались у LocalStorage. У Lab4:

- LocalStorage більше не використовується для курсів і завдань;
- всі CRUD-операції виконуються через backend API;
- frontend отримує дані з PostgreSQL.

---

## Frontend інтеграція

### API client

```ts
export async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const userId = localStorage.getItem('studyflow_user_id');

  const res = await fetch(`http://localhost:3000/api${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {}),
      ...(opts?.headers ?? {}),
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
```

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

Для тестування використовувався `Invoke-RestMethod` з передачею заголовка `x-user-id`.

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

У межах лабораторної роботи №4 було реалізовано інтеграцію з віддаленим джерелом даних PostgreSQL, створено backend API з використанням Express та Prisma, а також виконано заміну статичних даних на реальні. Отримане рішення забезпечує повноцінну клієнт-серверну взаємодію та підготовлене до подальшого тестування і розгортання.
