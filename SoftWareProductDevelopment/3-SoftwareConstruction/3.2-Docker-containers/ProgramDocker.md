# Docker-контейнер для Node.js застосунку — MusicHealth

**Автор:** Ткаченко Дар'я, ЗАІ-231

## Крок 1. Побудова Docker-образу застосунку

```bash
docker build -t tkachenko-musichealth-app .
```

## Крок 2. Запуск Docker-контейнеру застосунку

```bash
docker run --name tkachenko-app \
  --link tkachenko-postgres:postgres \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_USER=musichealth_user \
  -e DB_PASSWORD=musichealth_pass \
  -e DB_NAME=musichealth_db \
  -p 3000:3000 \
  -d tkachenko-musichealth-app
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
