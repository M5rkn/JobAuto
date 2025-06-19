## Структура проекта

- `frontend/` — клиентская часть (React)
- `backend/` — серверная часть (Node.js + Express + MongoDB)



## Переменные окружения

В папке `backend` создайте файл `.env` со следующим содержимым:
```
MONGO_URI=ваш_адрес_базы_данных_mongodb
JWT_SECRET=любой_секрет_для_jwt
```

Пример для локальной MongoDB:
```
MONGO_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=supersecretkey
```

Запуск:

- Сервер стартует на http://localhost:5000 (или порту из переменной окружения)

### Важно
- Фронтенд по умолчанию ожидает, что API доступен на `/api` (прокси на localhost:5000).
- Для работы авторизации и корзины обязательно наличие переменных окружения и рабочей MongoDB.





Установить Node.js (LTS-версия).

Скачать/склонировать весь проект (папки frontend и backend). - после этого в папке frontend прописать npm install и так же в папке backend 

В папке backend создать файл .env и прописать свои значения:
MONGO_URI=
JWT_SECRET=

Запуск фронтенда (React):
1.cd frontend
2.npm run dev

Запуск бэкенда
1.cd backend
2.npm start
Открыть сайт по адресу, который покажет консоль (обычно http://localhost:5173).