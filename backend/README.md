# WebLarek Backend

Бэкенд для интернет-магазина "WebLarek". Реализован на Node.js с использованием Express, MongoDB и TypeScript.

## Технологии

- Node.js
- Express
- MongoDB + Mongoose
- TypeScript
- Celebrate/Joi (валидация)
- Winston (логирование)
- ESLint (Airbnb style guide)
- JWT (access + refresh токены)
- Multer (загрузка файлов)
- bcryptjs (хеширование паролей)
- Helmet (безопасность)
- express-rate-limit (защита от DDoS)

## Установка и запуск

### Требования

- Node.js (версия 16+)
- MongoDB 4.4+ (или Docker)

### Установка зависимостей

```bash
npm install
```

### Переменные окружения

Скопируйте `.env.example` в `.env` и заполните необходимые значения:

```bash
cp .env.example .env
```

Обязательные переменные:

- `PORT` - порт сервера
- `DB_ADDRESS` - адрес MongoDB
- `JWT_ACCESS_SECRET` - секрет для access токена
- `JWT_REFRESH_SECRET` - секрет для refresh токена
- `TEMP_UPLOAD_DIR` - временная папка для загрузки файлов
- `PUBLIC_UPLOAD_DIR` - папка для публичных изображений
- `ORIGIN_ALLOW` - разрешённый origin для CORS
- `AUTH_ACCESS_TOKEN_EXPIRY` - срок жизни access токена
- `AUTH_REFRESH_TOKEN_EXPIRY` - срок жизни refresh токена

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

### Запуск собранного проекта

```bash
npm run start
```

### Линтинг

```bash
npm run lint
```

## API Endpoints

### Товары

| Метод  | Endpoint            | Описание                      | Авторизация |
| ------ | ------------------- | ----------------------------- | ----------- |
| GET    | /product            | Получение списка всех товаров | Нет         |
| GET    | /product/:productId | Получение товара по ID        | Нет         |
| POST   | /product            | Создание нового товара        | Да          |
| PATCH  | /product/:productId | Обновление товара по ID       | Да          |
| DELETE | /product/:productId | Удаление товара по ID         | Да          |

#### Пример тела запроса POST /product

```json
{
  "title": "Мамка-таймер",
  "image": {
    "fileName": "/images/Asterisk_2.png",
    "originalName": "Asterisk_2.png"
  },
  "category": "софт-скил",
  "description": "Будет стоять над душой и не давать прокрастинировать.",
  "price": null
}
```

#### Пример ответа GET /product

```json
{
  "items": [
    {
      "_id": "66601a8c57ecac94459696d6",
      "title": "Мамка-таймер",
      "image": {
        "fileName": "/images/Asterisk_2.png",
        "originalName": "Asterisk_2.png"
      },
      "category": "софт-скил",
      "description": "Будет стоять над душой и не давать прокрастинировать.",
      "price": null
    }
  ],
  "total": 1
}
```

### Заказы

| Метод | Endpoint | Описание               | Авторизация |
| ----- | -------- | ---------------------- | ----------- |
| POST  | /order   | Создание нового заказа | Нет         |

#### Пример тела запроса POST /order

```json
{
  "payment": "card",
  "email": "admin@ya.ru",
  "phone": "+7999999999",
  "address": "test",
  "total": 4200,
  "items": ["662e97d0c2fed29cab5bf3db", "662e97dec2fed29cab5bf3dd"]
}
```

#### Пример ответа POST /order

```json
{
  "id": "c1f83572-e756-4f82-809b-4c710fe51087",
  "total": 750
}
```

### Аутентификация

| Метод | Endpoint       | Описание                                      | Авторизация |
| ----- | -------------- | --------------------------------------------- | ----------- |
| POST  | /auth/register | Регистрация нового пользователя               | Нет         |
| POST  | /auth/login    | Аутентификация пользователя                   | Нет         |
| GET   | /auth/token    | Обновление пары токенов (через httpOnly куку) | Нет         |
| GET   | /auth/logout   | Выход из аккаунта и удаление refresh токена   | Нет         |
| GET   | /auth/user     | Получение информации о текущем пользователе   | Да          |

#### Пример тела запроса POST /auth/register

```json
{
  "email": "admin@ya.ru",
  "password": "123456789",
  "name": "Максим"
}
```

#### Пример тела запроса POST /auth/login

```json
{
  "email": "admin@ya.ru",
  "password": "123456789"
}
```

#### Пример ответа POST /auth/login

```json
{
  "success": true,
  "user": {
    "email": "admin@ya.ru",
    "name": "Максим"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Пример ответа GET /auth/user

```json
{
  "success": true,
  "user": {
    "email": "admin@ya.ru",
    "name": "Максим"
  }
}
```

### Загрузка файлов

| Метод | Endpoint | Описание                          | Авторизация |
| ----- | -------- | --------------------------------- | ----------- |
| POST  | /upload  | Загрузка файла во временную папку | Да          |

#### Пример запроса

- `multipart/form-data` с полем `file`

#### Пример ответа POST /upload

```json
{
  "fileName": "/images/686ade58.png",
  "originalName": "5_Dots.png"
}
```

## Коды ошибок

| Код | Описание                                  |
| --- | ----------------------------------------- |
| 400 | Некорректные данные в запросе             |
| 401 | Необходима авторизация / невалидный токен |
| 404 | Ресурс не найден                          |
| 409 | Конфликт (дубликат уникального поля)      |
| 429 | Слишком много запросов (rate limit)       |
| 500 | Внутренняя ошибка сервера                 |

## Формат ответа с ошибкой

```json
{
  "message": "Описание ошибки"
}
```

## Безопасность

- **Helmet** — защита HTTP заголовков
- **Rate limiting** — ограничение количества запросов (100 запросов за 15 минут)
- **JWT** — access токен (10 минут) и refresh токен (7 дней)
- **CORS** — ограничение доступа по origin
- **bcryptjs** — хеширование паролей с солью

## Структура проекта

```
src/
├── app.ts              # Точка входа
├── config.ts           # Конфигурация с типами
├── constants/          # Константы (сообщения об ошибках)
├── controllers/        # Контроллеры
│   ├── auth.ts         # Аутентификация
│   ├── order.ts        # Заказы
│   ├── products.ts     # Товары
│   └── upload.ts       # Загрузка файлов
├── errors/             # Классы ошибок
├── middlewares/        # Мидлвары
│   ├── auth.ts         # JWT авторизация
│   ├── cors.ts         # CORS настройки
│   ├── file.ts         # Multer конфигурация
│   ├── logger.ts       # Логирование
│   ├── rate-limiter.ts # Rate limiting
│   └── validations.ts  # Валидация через celebrate
├── models/             # Mongoose модели
│   ├── product.ts      # Модель товара
│   └── user.ts         # Модель пользователя
├── public/             # Статические файлы (изображения)
├── routes/             # Маршруты
│   ├── index.ts        # Главный роутер
│   ├── product.ts      # Роуты товаров
│   ├── order.ts        # Роуты заказов
│   ├── auth.ts         # Роуты аутентификации
│   └── upload.ts       # Роуты загрузки файлов
├── services/           # Сервисы
│   ├── file.service.ts # Работа с файлами
│   └── token.service.ts# JWT операции
└── utils/              # Утилиты
    ├── error-handler.ts# Обработка ошибок MongoDB
    └── validate-env.ts # Валидация переменных окружения
```

## Логирование

- `request.log` - все HTTP запросы
- `error.log` - все ошибки приложения

Файлы логов не добавляются в репозиторий.

## Автор

Александр Марков
