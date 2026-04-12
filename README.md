Дашборд: https://tz-ks8nyj85m-pugashbek-4846s-projects.vercel.app/

GitHub: https://github.com/AbylayPugashbek/gbc-analytics-dashboard

RetailCRM Analytics Dashboard + Telegram уведомления
Описание проекта

Проект представляет собой систему аналитики и уведомлений на основе API RetailCRM. Реализованы:

получение заказов из RetailCRM
отправка уведомлений в Telegram при заказах свыше 50 000 ₸
веб-дашборд с базовой аналитикой и графиками
деплой дашборда на Vercel
Архитектура

RetailCRM → Node.js сервис → Telegram
RetailCRM → Supabase → Dashboard (Vercel)

![image alt](https://github.com/AbylayPugashbek/gbc-analytics-dashboard/blob/2e1e08dffce972cd8060a1789d4732d79195b8ce/image.png)
![image alt](https://github.com/AbylayPugashbek/gbc-analytics-dashboard/blob/2e1e08dffce972cd8060a1789d4732d79195b8ce/image-1.png)

Шаг 2 — загрузка в RetailCRM

«Сделай Node.js скрипт для массовой загрузки заказов в RetailCRM API из JSON (mock_orders.json), с корректным форматом items, delivery и авторизацией через apiKey.

Была ошибка с форматом order (Input value "order" contains a non-scalar value), из-за попытки отправлять JSON в неправильной структуре request body для API v5. Потратил время на это, хотя проблема была в неправильном формате запроса — из-за этого часть данных не загрузилась, и я потерял возможность нормально строить качественный датасет для дальнейшей аналитики.»

Шаг 3 — RetailCRM → Supabase

«Напиши ETL-скрипт на Node.js: забирай заказы из RetailCRM API и сохраняй их в Supabase таблицу orders. Добавь маппинг полей, обработку total_sum и защиту от дублей по externalId.

Этот шаг был выполнен быстро и без проблем, так как структура данных уже была понятна, и API работал стабильно.»

Шаг 4 — Дашборд

«Сделай SaaS-style dashboard на HTML + Chart.js, который читает данные из Supabase через REST API. Реализуй KPI (revenue, orders, avg order) и график дохода по датам. Подготовь под деплой на Vercel.

Основная сложность была не в логике, а в получении данных из Supabase — из-за RLS (Row Level Security) доступ был ограничен, и пришлось разбираться с политиками доступа и API key.»

Шаг 5 — Telegram бот

«Сделай Node.js сервис, который периодически проверяет новые заказы в RetailCRM API и отправляет уведомление в Telegram, если сумма заказа больше 50,000 ₸.»

Эта часть была реализована быстро, логика простая — polling API и фильтр по сумме, без критических проблем.

Итог 

Основная ошибка была в начале — я считал, что структура данных и формат отправки не критичны, из-за чего неправильно реализовал загрузку в RetailCRM. Это привело к потере части корректного датасета, который потом усложнил аналитику и визуализацию. После исправления API-формата остальные шаги были выполнены быстро и без блокеров. Считаю что "customFields": {  "utm_source": "instagram"    } что данная часть помогла бы сделать более информативный дэшборд как bar char но в начале я потратил на него много времени и просто пропустил.
