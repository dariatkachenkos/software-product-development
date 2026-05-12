class FoodEntry {
    constructor(id, foodItem, quantityG) {
        this.id = id;
        this.foodItem = foodItem;
        this.quantityG = quantityG;
        this.addedAt = new Date();
    }

    calculateCalories() {
        return (this.foodItem.caloriesPer100g * this.quantityG) / 100;
    }
}

class DailyIntake {
    constructor(id, musicianId, intakeDate) {
        this.id = id;
        this.musicianId = musicianId;
        this.intakeDate = intakeDate;
        this.entries = [];
    }

    addEntry(entry) {
        this.entries.push(entry);
    }

    removeEntry(entryId) {
        this.entries = this.entries.filter(e => e.id !== entryId);
    }

    calculateTotalCalories() {
        return this.entries.reduce((sum, entry) => sum + entry.calculateCalories(), 0);
    }
}

class NutritionTracker {
    constructor(pool) {
        this.pool = pool;
    }

    async getDailyCalories(musicianId, date) {
        if (!date) throw new Error('InvalidDateError: date is required');

        const result = await this.pool.query(
            `SELECT COALESCE(SUM(fe.quantity_g * fi.calories_per_100g / 100), 0) AS total_calories
             FROM daily_intake di
             JOIN food_entry fe ON fe.daily_intake_id = di.id
             JOIN food_item fi ON fi.id = fe.food_item_id
             WHERE di.musician_id = $1 AND di.intake_date = $2`,
            [musicianId, date]
        );
        return parseFloat(result.rows[0].total_calories);
    }

    async compareWithDailyNorms(musicianId, date) {
        const calories = await this.getDailyCalories(musicianId, date);
        const DAILY_NORM_KCAL = 2000;
        return {
            current: calories,
            norm: DAILY_NORM_KCAL,
            difference: calories - DAILY_NORM_KCAL,
            status: calories >= DAILY_NORM_KCAL ? 'норма' : 'недостатньо'
        };
    }

    async generateRecommendations(musicianId, date) {
        const comparison = await this.compareWithDailyNorms(musicianId, date);
        const recommendations = [];

        if (comparison.difference < -500) {
            recommendations.push({
                nutrientType: 'calories',
                text: `Ваш раціон містить на ${Math.abs(comparison.difference).toFixed(0)} ккал менше за норму. Додайте горіхи, авокадо або бобові.`
            });
        }
        return recommendations;
    }
}

module.exports = { NutritionTracker, DailyIntake, FoodEntry };
