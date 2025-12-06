# EventPass (Mojo) — лабораторні 0–4

**EventPass** — навчальний проєкт (монорепозиторій на `pnpm workspaces`) з двома сервісами:
- **people-service** — довідник учасників/користувачів
- **event-service** — події та реєстрації учасників на події

---

## Технології

- Node.js (рекомендовано **18+**; перевірено на Node 22)
- TypeScript
- Express
- PostgreSQL (через Docker)
- Prisma **6.19.1**
- Zod (валідація запитів)
- ESLint + Prettier (налаштовано ігнор для згенерованого Prisma client)

---

## Структура репозиторію

```
.
├── apps
│   ├── people-service
│   │   ├── prisma
│   │   │   └── schema.prisma
│   │   ├── src
│   │   │   ├── main.ts
│   │   │   ├── prisma.ts
│   │   │   ├── routes
│   │   │   │   └── people.ts
│   │   │   └── validation
│   │   │       └── people.ts
│   │   ├── .env.example
│   │   └── package.json
│   └── event-service
│       ├── prisma
│       │   └── schema.prisma
│       ├── src
│       │   ├── main.ts
│       │   ├── prisma.ts
│       │   ├── routes
│       │   │   └── events.ts
│       │   └── validation
│       │       └── events.ts
│       ├── .env.example
│       └── package.json
├── docker
│   └── init.sql
├── docker-compose.yml
├── eslint.config.mjs
├── prettier.config.cjs
├── pnpm-workspace.yaml
└── package.json
```

---

## Швидкий старт

### 1) Встановити залежності
```bash
pnpm i
```

### 2) Запустити PostgreSQL (Docker)
```bash
docker compose up -d
docker ps | grep eventpass-postgres
```

> Ініціалізація створює **2 бази**: `people_db` та `event_db` (див. `docker/init.sql`).

### 3) Налаштувати `.env` для сервісів

**people-service**
```bash
cp apps/people-service/.env.example apps/people-service/.env
```

**event-service**
```bash
cp apps/event-service/.env.example apps/event-service/.env
```

### 4) Згенерувати Prisma client і застосувати міграції (по сервісах)

**people-service**
```bash
cd apps/people-service
pnpm db:generate
pnpm db:migrate --name init
cd ../../
```

**event-service**
```bash
cd apps/event-service
pnpm db:generate
pnpm db:migrate --name init
cd ../../
```

### 5) Запустити сервіси (у різних терміналах)

**people-service** (порт `3001`)
```bash
pnpm --filter people-service dev
```

**event-service** (порт `3002`)
```bash
pnpm --filter event-service dev
```

---

## Перевірка роботи (curl)

### Health-check
```bash
curl -s http://localhost:3001/health
curl -s http://localhost:3002/health
```

### 1) Створити Person
```bash
curl -s -X POST http://localhost:3001/people \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","phone":"+380501234567"}'
```

### 2) Створити Event
```bash
curl -s -X POST http://localhost:3002/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo Event","startsAt":"2025-12-05T10:00:00.000Z","location":"Kyiv"}'
```

### 3) Зареєструвати Person на Event
```bash
curl -s -X POST "http://localhost:3002/events/<EVENT_ID>/register" \
  -H "Content-Type: application/json" \
  -d '{"personId":"<PERSON_ID>"}'
```

### 4) Отримати список реєстрацій
```bash
curl -s "http://localhost:3002/events/<EVENT_ID>/registrations"
```

### 5) Перевірка валідації (очікується 400)
```bash
curl -i -s -X POST http://localhost:3001/people \
  -H "Content-Type: application/json" \
  -d '{"fullName":"","email":"not-an-email","phone":"abc"}'
```

---

## API (коротко)

### people-service (http://localhost:3001)
- `GET /health`
- `POST /people` — створення людини (Zod валідація)
- `GET /people/:id` — отримання по id
- `PATCH /people/:id` — часткове оновлення

### event-service (http://localhost:3002)
- `GET /health`
- `POST /events` — створення події
- `POST /events/:id/register` — реєстрація людини на подію  
  - перевіряє існування `personId` через `people-service`
  - унікальність забезпечує `@@unique([eventId, personId])`
- `GET /events/:id/registrations` — список реєстрацій

---

## Prisma (важливо для монорепозиторію)

Ми генеруємо Prisma Client **окремо для кожного сервісу** в `apps/*/generated/prisma-client`, щоб клієнти не “перетирали” один одного.

У скриптах використовується явне посилання на schema:
- `prisma generate --schema prisma/schema.prisma`
- `prisma migrate dev --schema prisma/schema.prisma`

> Папка `generated/` не має лінтитися — додано ignore в `eslint.config.mjs`.

---

## Команди якості коду (root)

```bash
pnpm format
pnpm lint
pnpm test
pnpm build
```

---

## Відповідність лабораторним

### ЛР0 — Вибір ідеї
- створено репозиторій та опис ідеї в `README.md`

### ЛР1 — Налаштування інструментів
- робочий простір (`pnpm workspaces`), форматтер, лінтер, базові скрипти

### ЛР2 — Структура застосунку
- двосервісна архітектура (people-service, event-service)
- опис сценаріїв у документації (якщо є в `docs/`)

### ЛР3+ЛР4 (об’єднано в ЛР4) — Робота з віддаленими даними
- PostgreSQL через Docker
- Prisma + міграції
- реальні CRUD/сценарії через HTTP, без статичних даних

---

## Примітки

- Для локальної роботи **не комітьте** файли `.env` (комітиться тільки `.env.example`).
- Якщо Docker контейнер вже існує і потрібно “з нуля”:
  ```bash
  docker compose down -v
  docker compose up -d
  ```
