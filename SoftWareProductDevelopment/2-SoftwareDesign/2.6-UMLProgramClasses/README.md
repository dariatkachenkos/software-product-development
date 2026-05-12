### Проектування прототипу програмних класів

![UML Program Classes](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/dariatkachenkos/software-product-development/main/SoftWareProductDevelopment/2-SoftwareDesign/2.6-UMLProgramClasses/UMLProgramClasses.puml)

## Опис прототипів методів

| Клас | Метод | Параметри | Повертає | Відповідна вимога |
|------|-------|-----------|----------|-------------------|
| NutritionTracker | logFoodEntry | foodItem: FoodItem, quantityG: number, date: Date | FoodEntry | FR1.1 |
| NutritionTracker | getDailyCalories | date: Date | number | FR1.2 |
| DailyIntake | getEntries | — | FoodEntry[] | FR1.3 |
| DailyIntake | removeEntry | entryId: number | void | FR1.4 |
| NutritionTracker | compareWithDailyNorms | date: Date | object | FR2.1 |
| NutritionTracker | generateRecommendations | date: Date | Recommendation[] | FR2.2 |
| NutritionTracker | getMissingNutrients | date: Date | string[] | FR2.3 |
| FoodEntry | calculateCalories | — | number | FR1.2 |
| Musician | calculateBMI | — | number | FR4 |
