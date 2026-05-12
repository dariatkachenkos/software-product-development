const { NutritionTracker, DailyIntake, FoodEntry } = require('../3.1-Program-Classes-Example/NutritionTracker');

// Мок пулу PostgreSQL для unit-тестів
function createMockPool(rows) {
    return {
        query: async () => ({ rows })
    };
}

describe('NutritionTracker.getDailyCalories', () => {
    test('TC-BB-01: повертає суму калорій при наявності записів', async () => {
        const mockPool = createMockPool([{ total_calories: '525.00' }]);
        const tracker = new NutritionTracker(mockPool);

        const result = await tracker.getDailyCalories(1, '2026-05-10');
        expect(result).toBe(525);
    });

    test('TC-BB-02: повертає 0 при відсутності записів', async () => {
        const mockPool = createMockPool([{ total_calories: '0' }]);
        const tracker = new NutritionTracker(mockPool);

        const result = await tracker.getDailyCalories(1, '2026-05-10');
        expect(result).toBe(0);
    });

    test('TC-WB-01: кидає помилку при date = null', async () => {
        const mockPool = createMockPool([]);
        const tracker = new NutritionTracker(mockPool);

        await expect(tracker.getDailyCalories(1, null))
            .rejects.toThrow('InvalidDateError');
    });
});

describe('FoodEntry.calculateCalories', () => {
    test('коректно розраховує калорії', () => {
        const foodItem = { caloriesPer100g: 165 };
        const entry = new FoodEntry(1, foodItem, 200);

        expect(entry.calculateCalories()).toBe(330);
    });
});

describe('DailyIntake', () => {
    test('calculateTotalCalories підсумовує калорії всіх записів', () => {
        const intake = new DailyIntake(1, 1, new Date());
        intake.addEntry(new FoodEntry(1, { caloriesPer100g: 165 }, 200)); // 330
        intake.addEntry(new FoodEntry(2, { caloriesPer100g: 130 }, 150)); // 195

        expect(intake.calculateTotalCalories()).toBe(525);
    });

    test('removeEntry видаляє запис за ID', () => {
        const intake = new DailyIntake(1, 1, new Date());
        intake.addEntry(new FoodEntry(1, { caloriesPer100g: 165 }, 200));
        intake.addEntry(new FoodEntry(2, { caloriesPer100g: 130 }, 150));
        intake.removeEntry(1);

        expect(intake.entries.length).toBe(1);
        expect(intake.entries[0].id).toBe(2);
    });
});
