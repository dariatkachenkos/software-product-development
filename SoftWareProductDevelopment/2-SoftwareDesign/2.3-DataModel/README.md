### Схема моделі даних

**Обрана модель:** реляційна (PostgreSQL)

![Relational Model Schema](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/dariatkachenkos/software-product-development/main/SoftWareProductDevelopment/2-SoftwareDesign/2.3-DataModel/RelModelSchema.puml)

## SQL-скрипт ініціалізації БД

```sql
CREATE TABLE creative_person (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(name)) >= 2),
    email         VARCHAR(255) UNIQUE NOT NULL
                      CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    creative_type VARCHAR(50) NOT NULL
                      CHECK (creative_type IN ('musician','writer','artist','designer','other')),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE creative_session (
    id             SERIAL PRIMARY KEY,
    person_id      INTEGER NOT NULL REFERENCES creative_person(id) ON DELETE CASCADE,
    session_date   DATE NOT NULL,
    duration_min   INTEGER NOT NULL CHECK (duration_min > 0 AND duration_min <= 1440),
    creative_type  VARCHAR(50) NOT NULL,
    title          VARCHAR(200),
    quality_rating INTEGER NOT NULL CHECK (quality_rating BETWEEN 1 AND 10),
    energy_before  INTEGER CHECK (energy_before BETWEEN 1 AND 10),
    notes          TEXT,
    created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_log (
    id            SERIAL PRIMARY KEY,
    person_id     INTEGER NOT NULL REFERENCES creative_person(id) ON DELETE CASCADE,
    log_date      DATE NOT NULL,
    sleep_hours   NUMERIC(4,1) CHECK (sleep_hours BETWEEN 0 AND 24),
    energy_level  INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    mood          INTEGER CHECK (mood BETWEEN 1 AND 10),
    stress_level  INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    notes         TEXT,
    UNIQUE (person_id, log_date)
);

CREATE TABLE nutrition_entry (
    id           SERIAL PRIMARY KEY,
    daily_log_id INTEGER NOT NULL REFERENCES daily_log(id) ON DELETE CASCADE,
    food_name    VARCHAR(200) NOT NULL
                     CHECK (LENGTH(TRIM(food_name)) >= 2
                        AND food_name !~ '[<>{}\[\]]'),
    calories     INTEGER CHECK (calories >= 0 AND calories <= 5000),
    meal_time    VARCHAR(20) CHECK (meal_time IN ('breakfast','lunch','dinner','snack'))
);

CREATE TABLE insight (
    id                SERIAL PRIMARY KEY,
    person_id         INTEGER NOT NULL REFERENCES creative_person(id) ON DELETE CASCADE,
    generated_at      TIMESTAMP DEFAULT NOW(),
    insight_type      VARCHAR(50) NOT NULL,
    description       TEXT NOT NULL,
    correlation_score NUMERIC(4,3) CHECK (correlation_score BETWEEN -1 AND 1)
);

CREATE TABLE recommendation (
    id            SERIAL PRIMARY KEY,
    person_id     INTEGER NOT NULL REFERENCES creative_person(id) ON DELETE CASCADE,
    created_at    TIMESTAMP DEFAULT NOW(),
    category      VARCHAR(50) NOT NULL
                      CHECK (category IN ('sleep','nutrition','activity','schedule','general')),
    text          TEXT NOT NULL,
    based_on_days INTEGER DEFAULT 30 CHECK (based_on_days > 0)
);
```
