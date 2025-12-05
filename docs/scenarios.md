# Лабораторна робота №2 — Ключові сценарії та оновлення даних

Нижче описано, як дані **створюються/оновлюються/агрегуються** при основних сценаріях.

---

## 1) Створення учасника (People Service)

**Endpoint:** `POST /people`

### Кроки

1. Клієнт надсилає `fullName`, `email`, `phone`.
2. `people-service` валідовує дані (непорожні поля, формат email/phone).
3. Створюється запис `PERSON`.
4. Повертається створений об’єкт `Person`.

### Зміни даних

- INSERT у таблицю `PERSON`.

---

## 2) Оновлення контактів учасника (People Service)

**Endpoint:** `PATCH /people/:id`

### Кроки

1. Клієнт надсилає часткові поля (`email`, `phone`, або інші).
2. `people-service` перевіряє, що `PERSON` існує.
3. Оновлює дозволені поля.
4. Повертає оновлений `Person`.

### Зміни даних

- UPDATE у таблицю `PERSON`.

---

## 3) Створення події (Event Service)

**Endpoint:** `POST /events`

### Кроки

1. Клієнт надсилає `title`, `startsAt`, `location`.
2. `event-service` валідовує поля (title != empty, startsAt валідний ISO).
3. Створюється запис `EVENT`.
4. Повертається створений `Event`.

### Зміни даних

- INSERT у таблицю `EVENT`.

---

## 4) Реєстрація учасника на подію (Event Service)

**Endpoint:** `POST /events/:id/register`

### Кроки

1. Клієнт надсилає `personId`.
2. `event-service` перевіряє, що подія `EVENT` існує.
3. `event-service` викликає `people-service` → `GET /people/:id` для перевірки існування учасника.
4. Перевіряється, що немає існуючої реєстрації (`eventId`, `personId`) (щоб не дублювати).
5. Створюється запис `REGISTRATION`.
6. Повертається `Registration`.

### Зміни даних

- SELECT `EVENT`
- HTTP GET до `people-service` (перевірка `PERSON`)
- INSERT у `REGISTRATION` (або 409 Conflict якщо дубль)

---

## 5) Список реєстрацій на подію (Event Service)

**Endpoint:** `GET /events/:id/registrations`

### Кроки

1. `event-service` перевіряє, що `EVENT` існує.
2. Вибирає всі `REGISTRATION` по `eventId`.
3. (Опційно для прототипу) Збагачує кожну реєстрацію даними учасника, викликаючи `people-service` по `personId`.
4. Повертає список.

### Агрегація даних

- Базова агрегація: `EVENT` + список `REGISTRATION`.
- Якщо потрібно показати учасників з деталями: агрегація через виклики `people-service`.

### Читання/зміни даних

- SELECT `EVENT`
- SELECT `REGISTRATION WHERE eventId = ...`
- (Опційно) HTTP GET `people-service` для кожного `personId`
