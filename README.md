# EventPass — microservices (Mojo)

Навчальний проєкт для курсу **«Розробка ПЗ на платформі Node.js»**: сервіс реєстрації учасників на події.
Реалізовано **2 мікросервіси × 3 основні роути**, PostgreSQL через Prisma, тести (unit/integration/e2e) та мутаційне тестування.

> Примітка: технічні ендпоїнти типу `/health` можуть існувати для перевірки працездатності, але **не входять** у вимогу “3 роути на сервіс”.

---

## Стек
- Node.js + TypeScript
- Express
- PostgreSQL (Docker) + Prisma **6.19.1**
- Zod (валідація)
- Vitest (unit/integration/e2e)
- Stryker (mutation testing)
- PNPM workspaces (монорепо)

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
1) `GET /people` — список учасників  
2) `POST /people` — створити учасника  
3) `GET /people/:id` — отримати учасника за id  

### event-service (порт за замовчуванням: `3002`, для тестів: `3102`)
1) `GET /events` — список подій  
2) `POST /events` — створити подію  
3) `POST /events/:id/register` — зареєструвати учасника на подію (з перевіркою `personId` через people-service)  

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

### 3) Міграції та генерація клієнта Prisma
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

## План виконання лабораторних
- [x] **ЛР0** Вибір ідеї, репозиторій, README
- [x] **ЛР1 (08.10.2025)** Пакети, prettier/eslint, husky + commitlint
- [x] **ЛР2 (22.10.2025)** Діаграми, ER, сценарії оновлення даних
- [x] **ЛР4 (19.11.2025)** Інтеграція з БД (об’єднано з ЛР3)
- [x] **ЛР5 (03.12.2025)** Unit + інтеграц. + E2E + mutation репорт
- [ ] **ЛР6 (17.12.2025)** CI/CD, staging, доступ з інтернету
