import type { Recipe } from "../types";

/**
 * Groups an array of recipes into a map keyed by `recipe.category`.
 * e.g. { "Entrée": [...], "Grain": [...], "Vegetable": [...] }
 */
export function groupRecipesByCategory(recipes: Recipe[]): Record<string, Recipe[]> {
  return recipes.reduce<Record<string, Recipe[]>>((map, recipe) => {
    if (!map[recipe.category]) map[recipe.category] = [];
    map[recipe.category].push(recipe);
    return map;
  }, {});
}
