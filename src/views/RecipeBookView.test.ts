import { describe, it, expect } from "vitest";
import type { Recipe } from "../types";

// ---------------------------------------------------------------------------
// The search filter used by RecipeBookView (from the useMemo):
//   recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
//
// We replicate it as a pure function so the test is self-contained and the
// assertion is unambiguous.
// ---------------------------------------------------------------------------

function filterRecipes(recipes: Recipe[], search: string): Recipe[] {
  return recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );
}

// ---------------------------------------------------------------------------
// Fixture — a small recipe list covering different categories and name shapes.
// ---------------------------------------------------------------------------

function makeRecipe(id: string, name: string, category = "Entrée"): Recipe {
  return {
    id,
    name,
    category,
    yield: 50,
    servingSize: "1 serving",
    ingredients: [],
    nutrition: {
      calories: 200, totalFat: 5, saturatedFat: 1, transFat: 0,
      cholesterol: 30, sodium: 300, totalCarbs: 20, fiber: 2,
      totalSugars: 5, addedSugars: 0, protein: 15,
      vitaminD: 0, calcium: 10, iron: 1, potassium: 200,
    },
  };
}

const RECIPES: Recipe[] = [
  makeRecipe('1', "Chicken Tenders"),
  makeRecipe('2', "Beef Taco Meat"),
  makeRecipe('3', "Homemade Mac & Cheese", "Grain"),
  makeRecipe('4', "Steamed Broccoli", "Vegetable"),
  makeRecipe('5', "Chicken Noodle Soup"),
  makeRecipe('6', "WG Blueberry Muffin", "WG Rich"),
];

describe("Recipe search filter", () => {
  it("returns all recipes when the search term is empty", () => {
    expect(filterRecipes(RECIPES, "")).toHaveLength(RECIPES.length);
  });

  it("returns only recipes whose name contains the search term (case-insensitive)", () => {
    const results = filterRecipes(RECIPES, "chicken");
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.name)).toEqual([
      "Chicken Tenders",
      "Chicken Noodle Soup",
    ]);
  });

  it("is case-insensitive — 'CHICKEN' matches the same recipes as 'chicken'", () => {
    const lower = filterRecipes(RECIPES, "chicken");
    const upper = filterRecipes(RECIPES, "CHICKEN");
    const mixed = filterRecipes(RECIPES, "ChIcKeN");
    expect(lower.map((r) => r.id)).toEqual(upper.map((r) => r.id));
    expect(lower.map((r) => r.id)).toEqual(mixed.map((r) => r.id));
  });

  it("returns an empty array when no recipe name matches the search term", () => {
    expect(filterRecipes(RECIPES, "pizza")).toHaveLength(0);
  });

  it("matches a partial substring anywhere in the name", () => {
    // "mac" should match "Homemade Mac & Cheese"
    const results = filterRecipes(RECIPES, "mac");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Homemade Mac & Cheese");
  });

  it("returns exactly one recipe for a unique substring", () => {
    const results = filterRecipes(RECIPES, "blueberry");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("WG Blueberry Muffin");
  });

  it("does not search by category — only recipe name is matched", () => {
    // Searching "Vegetable" should NOT return "Steamed Broccoli" (that's its category)
    const results = filterRecipes(RECIPES, "Vegetable");
    expect(results).toHaveLength(0);
  });
});
