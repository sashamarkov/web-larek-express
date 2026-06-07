export const ERROR_MESSAGES = {
  // Продукты
  DUPLICATE_TITLE: 'Товар с таким названием уже существует',
  PRODUCT_NOT_FOUND: 'Товар не найден',
  INVALID_PRODUCT_ID: 'Невалидный ID товара',

  // Авторизация
  UNAUTHORIZED_NEED_AUTH: 'Необходимо авторизоваться',
  INVALID_TOKEN: 'Невалидный токен',
  INVALID_CREDENTIALS: 'Неверный email или пароль',
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
  REFRESH_TOKEN_NOT_PROVIDED: 'Refresh token не предоставлен',
  REFRESH_TOKEN_INVALID: 'Невалидный refresh token',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token не найден',

  // Заказы
  CART_EMPTY: 'Корзина не может быть пустой',
  PRODUCTS_NOT_FOUND: 'Некоторые товары не найдены',
  PRODUCT_NOT_SOLD: (title: string) => `Товар "${title}" не продается (он бесценен)`,
  TOTAL_MISMATCH: 'Сумма заказа не совпадает с суммой товаров',

  // Загрузка файлов
  FILE_NOT_UPLOADED: 'Файл не загружен',
  UNSUPPORTED_FILE_TYPE: 'Неподдерживаемый тип файла',

  // Общие
  ROUTE_NOT_FOUND: 'Маршрут не найден',
  SERVER_ERROR: 'На сервере произошла ошибка',
  VALIDATION_ERROR: 'Ошибка валидации',
};

export const SUCCESS_MESSAGES = {
  LOGOUT_SUCCESS: 'Выход выполнен успешно',
  FILE_UPLOADED: 'Файл успешно загружен',
};
