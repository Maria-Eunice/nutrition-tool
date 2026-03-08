import { describe, it, expect } from "vitest";
import { recipeSchema } from "./RecipeBuilderView";

// ---------------------------------------------------------------------------
// Shared valid recipe fixture — all fields satisfy the schema constraints.
// Individual tests mutate one field at a time to isolate each validation rule.
// ---------------------------------------------------------------------------
const VALID_RECIPE = {
  name: "Chicken Tenders",
  category: "Entrée",
  yield: 50,
  servingSize: "3 pieces (85g)",
  ingredients: [{ name: "Chicken breast", qty: 12, unit: "lb" }],
  nutrition: {
    calories: 210,
    totalFat: 7,
    saturatedFat: 1.5,
    transFat: 0,
    cholesterol: 65,
    sodium: 340,
    totalCarbs: 12,
    fiber: 1,
    totalSugars: 0,
    addedSugars: 0,
    protein: 24,
    vitaminD: 0.1,
    calcium: 20,
    iron: 1.2,
    potassium: 220,
  },
};

describe("recipeSchema — name validation", () => {
  it("rejects a recipe with a blank name", () => {
    const result = recipeSchema.safeParse({ ...VALID_RECIPE, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameErrors = result.error.issues.filter((i) => i.path[0] === "name");
      expect(nameErrors.length).toBeGreaterThan(0);
    }
  });

  it("rejects a name shorter than 3 characters", () => {
    const result = recipeSchema.safeParse({ ...VALID_RECIPE, name: "AB" });
    expect(result.success).toBe(false);
  });

  it("accepts a name of exactly 3 characters", () => {
    const result = recipeSchema.safeParse({ ...VALID_RECIPE, name: "BLT" });
    expect(result.success).toBe(true);
  });
});

describe("recipeSchema — calorie validation", () => {
  it("rejects a recipe with negative calories", () => {
    const result = recipeSchema.safeParse({
      ...VALID_RECIPE,
      nutrition: { ...VALID_RECIPE.nutrition, calories: -1 },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const calErrors = result.error.issues.filter(
        (i) => i.path[0] === "nutrition" && i.path[1] === "calories",
      );
      expect(calErrors.length).toBeGreaterThan(0);
    }
  });

  it("rejects zero calories (must be strictly positive)", () => {
    const result = recipeSchema.safeParse({
      ...VALID_RECIPE,
      nutrition: { ...VALID_RECIPE.nutrition, calories: 0 },
    });
    expect(result.success).toBe(false);
  });
});

describe("recipeSchema — valid data", () => {
  it("accepts a recipe with all valid fields", () => {
    const result = recipeSchema.safeParse(VALID_RECIPE);
    expect(result.success).toBe(true);
  });

  it("coerces string numbers in nutrition fields to numbers", () => {
    // The form submits values as strings; z.coerce.number() handles this.
    const result = recipeSchema.safeParse({
      ...VALID_RECIPE,
      yield: "50" as unknown as number,
      nutrition: { ...VALID_RECIPE.nutrition, calories: "210" as unknown as number },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.yield).toBe(50);
      expect(result.data.nutrition.calories).toBe(210);
    }
  });
});
