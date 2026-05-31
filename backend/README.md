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

| Метод | Endpoint | Описание                      |
| ----- | -------- | ----------------------------- |
| GET   | /product | Получение списка всех товаров |
| POST  | /product | Создание нового товара        |

### Заказы

| Метод | Endpoint | Описание               |
| ----- | -------- | ---------------------- |
| POST  | /order   | Создание нового заказа |

## Структура проекта

```
src/
├── app.ts              # Точка входа
├── config.ts           # Конфигурация
├── controllers/        # Контроллеры
├── errors/             # Классы ошибок
├── middlewares/        # Мидлвары (валидация, логирование)
├── models/             # Mongoose модели
├── public/             # Статические файлы (изображения)
├── routes/             # Маршруты
└── types/              # TypeScript типы
```

## Автор

Александр Марков
