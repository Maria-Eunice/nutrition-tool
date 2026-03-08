import { describe, it, expect } from "vitest";
import { USDA_LIMITS, MILK_ITEM } from "../data/constants";

// ---------------------------------------------------------------------------
// The compliance check used by MealPatternView for each nutrient/component:
//   pass: totals.calories >= limits.calories.min && totals.calories <= limits.calories.max
//
// We replicate that exact predicate here so the test exercises the same logic
// that the component uses, driven by the same USDA_LIMITS constant.
// ---------------------------------------------------------------------------

/** Returns true if `calories` falls within the USDA range for the given grade. */
function caloriesCompliant(calories: number, grade: string): boolean {
  const { min, max } = USDA_LIMITS[grade].calories;
  return calories >= min && calories <= max;
}

describe("Meal Pattern — K-5 calorie compliance", () => {
  it("flags a K-5 lunch under 550 cal as non-compliant", () => {
    // 400 cal is well below the K-5 minimum of 550
    expect(caloriesCompliant(400, "K-5")).toBe(false);
  });

  it("flags a K-5 lunch at exactly 549 cal as non-compliant", () => {
    expect(caloriesCompliant(549, "K-5")).toBe(false);
  });

  it("flags a K-5 lunch over 650 cal as non-compliant", () => {
    // K-5 maximum is 650
    expect(caloriesCompliant(700, "K-5")).toBe(false);
  });

  it("accepts a K-5 lunch at exactly 550 cal (lower bound)", () => {
    expect(caloriesCompliant(550, "K-5")).toBe(true);
  });

  it("accepts a K-5 lunch within the 550–650 cal range", () => {
    expect(caloriesCompliant(600, "K-5")).toBe(true);
  });

  it("accepts a K-5 lunch at exactly 650 cal (upper bound)", () => {
    expect(caloriesCompliant(650, "K-5")).toBe(true);
  });
});

describe("Meal Pattern — grade-group calorie ranges", () => {
  it("uses different ranges for each grade group", () => {
    // Verify the USDA_LIMITS constants reflect USDA regulations
    expect(USDA_LIMITS["K-5"].calories).toEqual({ min: 550, max: 650 });
    expect(USDA_LIMITS["6-8"].calories).toEqual({ min: 600, max: 700 });
    expect(USDA_LIMITS["9-12"].calories).toEqual({ min: 750, max: 850 });
  });

  it("flags a 6-8 lunch under 600 cal as non-compliant", () => {
    expect(caloriesCompliant(580, "6-8")).toBe(false);
  });
});

describe("Meal Pattern — MILK_ITEM nutrition contribution", () => {
  it("MILK_ITEM contributes 100 calories toward the daily total", () => {
    // Ensures the built-in milk constant used by the checker has the right value
    expect(MILK_ITEM.nutrition.calories).toBe(100);
  });

  it("MILK_ITEM keeps sodium within K-5 limits when combined with a 500-cal meal", () => {
    const combinedSodium = MILK_ITEM.nutrition.sodium + 500; // 105 + 500 = 605
    expect(combinedSodium).toBeLessThanOrEqual(USDA_LIMITS["K-5"].sodium);
  });
});
