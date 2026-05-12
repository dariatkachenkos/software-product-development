### Концептуальний опис архітектури програмного продукту

## Архітектурний тип: Клієнт-Сервер (3-рівнева архітектура)

![UML Deployment Diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/dariatkachenkos/software-product-development/main/SoftWareProductDevelopment/1-SoftwareRequirements/1.4-SoftwareProjectPlanning/1.4.1-SoftwareArchitectConcept/UML-Deployment.puml)

## Компоненти архітектури

### PL — Рівень представлення (Presentation Layer)
- **Технологія:** HTML5 / CSS3 / JavaScript (браузерний SPA)
- **Пристрій:** ПК / ноутбук / смартфон
- **Браузери:** Chrome, Firefox, Edge
- **Взаємодія:** HTTP REST API → BL (передача даних у форматі JSON)

### BL — Рівень бізнес-логіки (Business Logic Layer)
- **Технологія:** Node.js + Express.js
- **ОС:** Ubuntu Server 22.04 LTS
- **Порт:** 3000
- **Функції:** обробка запитів, розрахунок нутрієнтів, генерація рекомендацій
- **Взаємодія:** SQL-запити → AL (передача управління)

### AL — Рівень доступу до даних (Application/Data Layer)
- **СКБД:** PostgreSQL 15
- **Модель даних:** реляційна
- **ОС:** Ubuntu Server 22.04 LTS
- **Порт:** 5432
- **Взаємодія:** SQL-відповіді → BL (передача даних)
