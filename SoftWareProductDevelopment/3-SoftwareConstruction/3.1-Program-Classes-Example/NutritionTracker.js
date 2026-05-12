class NutritionEntry {
    constructor(id, dailyLogId, foodName, calories, mealTime) {
        this.id = id;
        this.dailyLogId = dailyLogId;
        this.foodName = foodName;
        this.calories = calories;
        this.mealTime = mealTime;
    }

    getCalories() {
        return this.calories || 0;
    }

    isValid() {
        const forbidden = /[<>{}\[\]]/;
        return this.foodName && this.foodName.trim().length >= 2 && !forbidden.test(this.foodName);
    }
}

class DailyLog {
    constructor(id, personId, logDate) {
        this.id = id;
        this.personId = personId;
        this.logDate = logDate;
        this.sleepHours = null;
        this.energyLevel = null;
        this.mood = null;
        this.stressLevel = null;
        this.entries = [];
    }

    addNutritionEntry(entry) {
        this.entries.push(entry);
    }

    removeNutritionEntry(entryId) {
        this.entries = this.entries.filter(e => e.id !== entryId);
    }

    getTotalCalories() {
        return this.entries.reduce((sum, entry) => sum + entry.getCalories(), 0);
    }
}

class CreativeFlowTracker {
    constructor(pool) {
        this.pool = pool;
    }

    async getAverageQuality(personId, from, to) {
        if (!from || !to) throw new Error('InvalidDateError: from and to are required');

        const result = await this.pool.query(
            `SELECT COALESCE(AVG(quality_rating), 0) AS avg_quality
             FROM creative_session
             WHERE person_id = $1
               AND session_date BETWEEN $2 AND $3`,
            [personId, from, to]
        );
        return parseFloat(result.rows[0].avg_quality);
    }

    async computeCorrelations(personId, days = 30) {
        const result = await this.pool.query(
            `SELECT
                CORR(dl.sleep_hours, cs.quality_rating)  AS sleep_corr,
                CORR(dl.energy_level, cs.quality_rating) AS energy_corr,
                CORR(dl.mood, cs.quality_rating)         AS mood_corr,
                CORR(dl.stress_level, cs.quality_rating) AS stress_corr
             FROM creative_session cs
             JOIN daily_log dl ON dl.person_id = cs.person_id
                               AND dl.log_date = cs.session_date
             WHERE cs.person_id = $1
               AND cs.session_date >= CURRENT_DATE - $2::int`,
            [personId, days]
        );

        const row = result.rows[0];
        const insights = [];
        const factors = [
            { key: 'sleep_corr',  type: 'sleep',  label: 'годин сну' },
            { key: 'energy_corr', type: 'energy', label: 'рівня енергії' },
            { key: 'mood_corr',   type: 'mood',   label: 'настрою' },
            { key: 'stress_corr', type: 'stress', label: 'рівня стресу' },
        ];

        for (const f of factors) {
            const score = parseFloat(row[f.key]);
            if (!isNaN(score) && Math.abs(score) >= 0.3) {
                const direction = score > 0 ? 'позитивно' : 'негативно';
                insights.push({
                    insightType: f.type,
                    description: `${f.label} ${direction} корелює з якістю творчих сесій (r = ${score.toFixed(2)})`,
                    correlationScore: score,
                });
            }
        }
        return insights;
    }

    async generateRecommendations(personId) {
        const insights = await this.computeCorrelations(personId, 30);
        const recommendations = [];

        for (const insight of insights) {
            if (insight.insightType === 'sleep' && insight.correlationScore > 0.5) {
                recommendations.push({
                    category: 'sleep',
                    text: 'Ваші найкращі творчі сесії трапляються після достатнього сну. Спробуйте дотримуватися стабільного режиму сну 7–9 годин.',
                    basedOnDays: 30,
                });
            }
            if (insight.insightType === 'stress' && insight.correlationScore < -0.4) {
                recommendations.push({
                    category: 'general',
                    text: 'Рівень стресу негативно впливає на вашу творчість. Розгляньте медитацію або прогулянки перед творчою сесією.',
                    basedOnDays: 30,
                });
            }
        }
        return recommendations;
    }
}

module.exports = { CreativeFlowTracker, DailyLog, NutritionEntry };
