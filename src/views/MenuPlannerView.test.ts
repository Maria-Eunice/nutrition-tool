import { describe, it, expect } from "vitest";
import { computeMealNutrition } from "../utils/nutrition";
import { LN_COMPS, BK_COMPS, MILK_ITEM } from "../data/constants";
import type { Recipe, MenuMap } from "../types";

// ---------------------------------------------------------------------------
// Minimal recipe fixtures with known, easy-to-reason-about nutrition numbers.
// ---------------------------------------------------------------------------

const CHICKEN_TENDERS: Recipe = {
  id: '1',
  name: "Chicken Tenders",
  category: "Entrée",
  yield: 50,
  servingSize: "3 pieces (85g)",
  ingredients: [],
  nutrition: {
    calories: 210, totalFat: 7, saturatedFat: 1.5, transFat: 0,
    cholesterol: 65, sodium: 340, totalCarbs: 12, fiber: 1,
    totalSugars: 0, addedSugars: 0, protein: 24,
    vitaminD: 0.1, calcium: 20, iron: 1.2, potassium: 220,
  },
};

const DINNER_ROLL: Recipe = {
  id: '2',
  name: "Whole Wheat Dinner Roll",
  category: "Grain",
  yield: 100,
  servingSize: "1 roll (45g)",
  ingredients: [],
  nutrition: {
    calories: 120, totalFat: 2, saturatedFat: 0.5, transFat: 0,
    cholesterol: 0, sodium: 180, totalCarbs: 22, fiber: 2,
    totalSugars: 3, addedSugars: 1, protein: 4,
    vitaminD: 0, calcium: 20, iron: 1.2, potassium: 80,
  },
};

const BROCCOLI: Recipe = {
  id: '3',
  name: "Steamed Broccoli",
  category: "Vegetable",
  yield: 50,
  servingSize: "1/2 cup (78g)",
  ingredients: [],
  nutrition: {
    calories: 30, totalFat: 0, saturatedFat: 0, transFat: 0,
    cholesterol: 0, sodium: 30, totalCarbs: 6, fiber: 2,
    totalSugars: 1, addedSugars: 0, protein: 2,
    vitaminD: 0, calcium: 43, iron: 0.5, potassium: 230,
  },
};

const ALL_RECIPES: Recipe[] = [CHICKEN_TENDERS, DINNER_ROLL, BROCCOLI];
const DATE = "2026-03-03";

describe("computeMealNutrition — adding a recipe updates totals", () => {
  it("returns zero totals when no slots are filled", () => {
    const menu: MenuMap = {};
    const result = computeMealNutrition(menu, ALL_RECIPES, DATE, LN_COMPS);
    expect(result).toEqual({ calories: 0, sodium: 0, saturatedFat: 0 });
  });

  it("reflects the entrée nutrition after assigning a recipe to the entrée slot", () => {
    // Simulate: user selects "Chicken Tenders" for the lunch entrée slot
    const menu: MenuMap = { [`${DATE}-ln_entree`]: "Chicken Tenders" };
    const result = computeMealNutrition(menu, ALL_RECIPES, DATE, LN_COMPS);

    expect(result.calories).toBe(210);
    expect(result.sodium).toBe(340);
    expect(result.saturatedFat).toBe(1.5);
  });

  it("sums nutrition across multiple filled slots", () => {
    // Entrée + grain + vegetable filled; fruit and milk empty
    const menu: MenuMap = {
      [`${DATE}-ln_entree`]: "Chicken Tenders",
      [`${DATE}-ln_grain`]: "Whole Wheat Dinner Roll",
      [`${DATE}-ln_veg`]: "Steamed Broccoli",
    };
    const result = computeMealNutrition(menu, ALL_RECIPES, DATE, LN_COMPS);

    // 210 + 120 + 30 = 360
    expect(result.calories).toBe(360);
    // 340 + 180 + 30 = 550
    expect(result.sodium).toBe(550);
    // 1.5 + 0.5 + 0 = 2
    expect(result.saturatedFat).toBeCloseTo(2.0);
  });

  it("uses MILK_ITEM for the milk slot regardless of recipe list", () => {
    // The milk slot always resolves to MILK_ITEM (100 cal, 105mg Na)
    const menu: MenuMap = { [`${DATE}-ln_milk`]: "1% Low-Fat Milk" };
    const result = computeMealNutrition(menu, [], DATE, LN_COMPS);

    expect(result.calories).toBe(MILK_ITEM.nutrition.calories);   // 100
    expect(result.sodium).toBe(MILK_ITEM.nutrition.sodium);       // 105
  });

  it("ignores slots assigned to a recipe not in the recipe list", () => {
    // If a recipe was deleted from the library, its slot should contribute 0
    const menu: MenuMap = { [`${DATE}-ln_entree`]: "Deleted Recipe" };
    const result = computeMealNutrition(menu, ALL_RECIPES, DATE, LN_COMPS);
    expect(result.calories).toBe(0);
  });

  it("sums breakfast and lunch separately to produce a correct daily total", () => {
    const menu: MenuMap = {
      // Breakfast: grain only
      [`${DATE}-bk_grain`]: "Whole Wheat Dinner Roll",
      // Lunch: entrée only
      [`${DATE}-ln_entree`]: "Chicken Tenders",
    };

    const breakfast = computeMealNutrition(menu, ALL_RECIPES, DATE, BK_COMPS);
    const lunch = computeMealNutrition(menu, ALL_RECIPES, DATE, LN_COMPS);

    expect(breakfast.calories).toBe(120);  // roll
    expect(lunch.calories).toBe(210);      // tenders
    expect(breakfast.calories + lunch.calories).toBe(330);
  });

  it("does not bleed state from one date to another", () => {
    const menu: MenuMap = {
      [`${DATE}-ln_entree`]: "Chicken Tenders",
      // A different date — should NOT be included in DATE's totals
      ["2026-03-04-ln_entree"]: "Steamed Broccoli",
    };
    const result = computeMealNutrition(menu, ALL_RECIPES, DATE, LN_COMPS);
    // Should only count Chicken Tenders (210 cal), not Steamed Broccoli (30 cal)
    expect(result.calories).toBe(210);
  });
});
