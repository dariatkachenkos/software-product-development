const { CreativeFlowTracker, DailyLog, NutritionEntry } = require('../3.1-Program-Classes-Example/NutritionTracker');

function createMockPool(rows) {
    return {
        query: async () => ({ rows })
    };
}

describe('CreativeFlowTracker.getAverageQuality', () => {
    test('TC-BB-01: повертає середній рейтинг при наявності сесій', async () => {
        const mockPool = createMockPool([{ avg_quality: '7.00' }]);
        const tracker = new CreativeFlowTracker(mockPool);

        const result = await tracker.getAverageQuality(1, '2026-05-01', '2026-05-10');
        expect(result).toBe(7);
    });

    test('TC-BB-03: повертає 0 при відсутності сесій', async () => {
        const mockPool = createMockPool([{ avg_quality: '0' }]);
        const tracker = new CreativeFlowTracker(mockPool);

        const result = await tracker.getAverageQuality(1, '2026-05-01', '2026-05-10');
        expect(result).toBe(0);
    });

    test('TC-WB-01: кидає помилку при from = null', async () => {
        const mockPool = createMockPool([]);
        const tracker = new CreativeFlowTracker(mockPool);

        await expect(tracker.getAverageQuality(1, null, '2026-05-10'))
            .rejects.toThrow('InvalidDateError');
    });
});

describe('NutritionEntry.isValid', () => {
    test('TC-NFR-01: коректна назва — валідна', () => {
        const entry = new NutritionEntry(1, 1, 'Вівсяна каша з ягодами', 320, 'breakfast');
        expect(entry.isValid()).toBe(true);
    });

    test('TC-NFR-02: надто коротка назва — невалідна', () => {
        const entry = new NutritionEntry(2, 1, 'А', 100, 'snack');
        expect(entry.isValid()).toBe(false);
    });

    test('TC-NFR-05: заборонений символ < — невалідна', () => {
        const entry = new NutritionEntry(3, 1, 'Суп<бульйон>', 150, 'lunch');
        expect(entry.isValid()).toBe(false);
    });
});

describe('DailyLog', () => {
    test('getTotalCalories підсумовує калорії всіх записів', () => {
        const log = new DailyLog(1, 1, new Date());
        log.addNutritionEntry(new NutritionEntry(1, 1, 'Вівсянка', 320, 'breakfast'));
        log.addNutritionEntry(new NutritionEntry(2, 1, 'Салат', 180, 'lunch'));

        expect(log.getTotalCalories()).toBe(500);
    });

    test('removeNutritionEntry видаляє запис за ID', () => {
        const log = new DailyLog(1, 1, new Date());
        log.addNutritionEntry(new NutritionEntry(1, 1, 'Вівсянка', 320, 'breakfast'));
        log.addNutritionEntry(new NutritionEntry(2, 1, 'Салат', 180, 'lunch'));
        log.removeNutritionEntry(1);

        expect(log.entries.length).toBe(1);
        expect(log.entries[0].id).toBe(2);
    });
});
