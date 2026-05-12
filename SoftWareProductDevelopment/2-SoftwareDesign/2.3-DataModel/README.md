### Схема моделі даних

**Обрана модель:** реляційна (PostgreSQL)

![Relational Model Schema](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/dariatkachenkos/software-product-development/main/SoftWareProductDevelopment/2-SoftwareDesign/2.3-DataModel/RelModelSchema.puml)

## SQL-скрипт ініціалізації БД

```sql
CREATE TABLE musician (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL CHECK (LENGTH(first_name) >= 2),
    last_name VARCHAR(50) NOT NULL CHECK (LENGTH(last_name) >= 2),
    email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    password_hash VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL CHECK (birth_date <= CURRENT_DATE),
    weight DECIMAL(5,1) CHECK (weight > 0 AND weight <= 300),
    height INTEGER CHECK (height > 0 AND height <= 300)
);

CREATE TABLE food_item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
        CHECK (LENGTH(name) >= 2 AND name !~ '[<>{}[\]]'),
    calories_per_100g DECIMAL(6,2) NOT NULL CHECK (calories_per_100g >= 0),
    proteins_per_100g DECIMAL(5,2) NOT NULL CHECK (proteins_per_100g >= 0),
    fats_per_100g DECIMAL(5,2) NOT NULL CHECK (fats_per_100g >= 0),
    carbs_per_100g DECIMAL(5,2) NOT NULL CHECK (carbs_per_100g >= 0)
);

CREATE TABLE daily_intake (
    id SERIAL PRIMARY KEY,
    musician_id INTEGER NOT NULL REFERENCES musician(id) ON DELETE CASCADE,
    intake_date DATE NOT NULL CHECK (intake_date <= CURRENT_DATE),
    UNIQUE (musician_id, intake_date)
);

CREATE TABLE food_entry (
    id SERIAL PRIMARY KEY,
    daily_intake_id INTEGER NOT NULL REFERENCES daily_intake(id) ON DELETE CASCADE,
    food_item_id INTEGER NOT NULL REFERENCES food_item(id),
    quantity_g DECIMAL(6,1) NOT NULL CHECK (quantity_g > 0 AND quantity_g <= 5000),
    added_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE health_metric (
    id SERIAL PRIMARY KEY,
    musician_id INTEGER NOT NULL REFERENCES musician(id) ON DELETE CASCADE,
    metric_type VARCHAR(30) NOT NULL,
    value DECIMAL(6,2) NOT NULL CHECK (value > 0),
    measure_date DATE NOT NULL CHECK (measure_date <= CURRENT_DATE)
);

CREATE TABLE recommendation (
    id SERIAL PRIMARY KEY,
    musician_id INTEGER NOT NULL REFERENCES musician(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    nutrient_type VARCHAR(30) NOT NULL
);
```
