# Docker-контейнер для PostgreSQL — MusicHealth

**Автор:** Ткаченко Дар'я, ЗАІ-231

## Крок 1. Завантаження Docker-образу PostgreSQL

```bash
docker pull postgres:15
```

## Крок 2. Запуск Docker-контейнеру СКБД

```bash
docker run --name tkachenko-postgres \
  -e POSTGRES_USER=musichealth_user \
  -e POSTGRES_PASSWORD=musichealth_pass \
  -e POSTGRES_DB=musichealth_db \
  -p 5432:5432 \
  -d postgres:15
```

> Назва контейнеру: **tkachenko-postgres** (містить прізвище автора транслітерацією)

## Крок 3. Перевірка запуску контейнеру

```bash
docker ps
```

## Крок 4. Ініціалізація та заповнення БД

```bash
docker cp ./init.sql tkachenko-postgres:/init.sql
docker exec -it tkachenko-postgres psql -U musichealth_user -d musichealth_db -f /init.sql
```

## Крок 5. Перевірка підключення до СКБД

```bash
docker exec -it tkachenko-postgres psql -U musichealth_user -d musichealth_db -c "SELECT * FROM food_item LIMIT 5;"
```

## Крок 6. Зупинка та видалення контейнеру

```bash
docker stop tkachenko-postgres
docker rm tkachenko-postgres
```

![Docker DBMS Execution](DBMSDockerExec.jpg)
