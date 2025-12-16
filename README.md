# EventPass — microservices (Mojo)

Навчальний проєкт для курсу **«Розробка ПЗ на платформі Node.js»**: система подій та реєстрації учасників.

Реалізовано **2 мікросервіси × 3 основні роути**, PostgreSQL через Prisma, тести (unit/integration/e2e), мутаційне тестування та CI/CD (GitHub Actions + Render).

> Примітка: технічні ендпоїнти типу `/health` можуть існувати для перевірки працездатності, але **не входять** у вимогу “3 роути на сервіс”.

---

## Посилання (staging / internet доступ)

- **people-service:** https://people-service-yohg.onrender.com
- **event-service:** https://event-service-ftyj.onrender.com

---

## Стек

- Node.js + TypeScript
- Express
- PostgreSQL (Render/Docker) + Prisma **6.19.1**
- Zod (валідація)
- Vitest (unit/integration/e2e)
- Stryker (mutation testing)
- PNPM workspaces (монорепо)
- GitHub Actions (CI/CD)
- Render (Deploy + Postgres)

---

## Структура репозиторію

- `apps/people-service` — сервіс учасників
- `apps/event-service` — сервіс подій/реєстрацій
- `packages/shared` — спільні типи/хелпери
- `docs/` — документація (архітектура, ER, сценарії)
- `docker-compose.yml`, `docker/init.sql` — локальна БД

---

## API (3 роути на сервіс)

### people-service (порт за замовчуванням: `3001`, для тестів: `3101`)

1. `GET /people` — список учасників
2. `POST /people` — створити учасника
3. `GET /people/:id` — отримати учасника за id

### event-service (порт за замовчуванням: `3002`, для тестів: `3102`)

1. `GET /events` — список подій
2. `POST /events` — створити подію
3. `POST /events/:id/register` — зареєструвати учасника на подію (з перевіркою `personId` через people-service)

---

## Швидкий старт (локально)

### 1) Встановити залежності

```bash
pnpm install
```

### 2) Запустити PostgreSQL

```bash
docker compose up -d
```

### 3) Міграції та генерація Prisma

```bash
pnpm --filter people-service db:migrate --name init
pnpm --filter event-service db:migrate --name init
```

### 4) Запуск сервісів (dev)

```bash
pnpm --filter people-service dev
pnpm --filter event-service dev
```

---

## Скрипти (root)

```bash
pnpm format
pnpm lint
pnpm build
pnpm test
```

---

## Тестування (ЛР5)

### Unit

```bash
pnpm --filter people-service test:unit
pnpm --filter event-service test:unit
```

### Integration

```bash
pnpm --filter people-service test:integration
pnpm --filter event-service test:integration
```

### E2E (повний флоу)

```bash
pnpm --filter event-service test:e2e
```

### Coverage

```bash
pnpm --filter people-service test:cov
pnpm --filter event-service test:cov
```

### Mutation testing (Stryker)

```bash
pnpm stryker run
```

HTML-звіт: `reports/mutation/mutation.html` (ігнорується в git).

---

## Документація (ЛР2)

- `docs/architecture.md` — компоненти та взаємодія
- `docs/data-model.md` — ER-модель даних
- `docs/scenarios.md` — ключові сценарії та оновлення даних

---

## CI/CD (ЛР6)

### CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

Перевіряє:

- prettier (format check)
- eslint
- build
- тести (unit/integration/e2e)
- (опційно) commitlint / conventional commits

### CD (GitHub Actions → Render)

Workflow: `.github/workflows/cd.yml`

Після пушу в `main` тригерить Render Deploy Hook-и для:

- people-service
- event-service

Потрібні GitHub Secrets:

- `RENDER_DEPLOY_HOOK_PEOPLE`
- `RENDER_DEPLOY_HOOK_EVENT`

> Для Render Postgres рекомендовано розділяти схеми:
>
> - people-service: `DATABASE_URL=... ?schema=people`
> - event-service: `DATABASE_URL=... ?schema=event`

---

## План виконання лабораторних

- [x] **ЛР0** Вибір ідеї, репозиторій, README
- [x] **ЛР1 (08.10.2025)** Пакети, prettier/eslint, husky + commitlint
- [x] **ЛР2 (22.10.2025)** Діаграми, ER, сценарії оновлення даних
- [x] **ЛР3 (05.11.2025)** Інтерактивний прототип (статичні дані)
- [x] **ЛР4 (19.11.2025)** Інтеграція з БД, заміна статичних даних
- [x] **ЛР5 (03.12.2025)** Unit + інтеграц. + E2E + mutation репорт
- [x] **ЛР6 (17.12.2025)** CI/CD, staging, доступ з інтернету (Render)
