# Docker-контейнер для Node.js застосунку — CreativeFlow

**Автор:** Ткаченко Дар'я, ЗАІ-231

## Крок 1. Побудова Docker-образу застосунку

```bash
docker build -t tkachenko-creativeflow-app .
```

## Крок 2. Запуск Docker-контейнеру застосунку

```bash
docker run --name tkachenko-app \
  --link tkachenko-postgres:postgres \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_USER=creativeflow_user \
  -e DB_PASSWORD=creativeflow_pass \
  -e DB_NAME=creativeflow_db \
  -p 3000:3000 \
  -d tkachenko-creativeflow-app
```

## Крок 3. Перевірка роботи застосунку

```bash
curl http://localhost:3000/health
```

## Крок 4. Перегляд логів

```bash
docker logs tkachenko-app
```

![Program Docker Execution](ProgramDockerExec.jpg)
