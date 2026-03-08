import { MILK_ITEM } from "../data/constants";
import type { Recipe, MealComponent, MenuMap } from "../types";

export interface NutritionTotals {
  calories: number;
  sodium: number;
  saturatedFat: number;
}

/**
 * Pure function: sums calories, sodium, and saturatedFat for every
 * meal component that has been assigned a recipe on the given day.
 *
 * @param menu       - The MenuMap from the store ({ "2026-03-03-ln_entree": "Chicken Tenders", … })
 * @param recipes    - Full recipe list from the store
 * @param dateKey    - ISO date string "yyyy-MM-dd" (e.g. "2026-03-03")
 * @param comps      - The set of MealComponents to sum (BK_COMPS or LN_COMPS, etc.)
 */
export function computeMealNutrition(
  menu: MenuMap,
  recipes: Recipe[],
  dateKey: string,
  comps: MealComponent[],
): NutritionTotals {
  const totals: NutritionTotals = { calories: 0, sodium: 0, saturatedFat: 0 };
  for (const comp of comps) {
    const slotName = menu[`${dateKey}-${comp.key}`];
    if (!slotName) continue;
    const recipe =
      comp.cat === "Milk"
        ? MILK_ITEM
        : recipes.find((r) => r.name === slotName);
    if (recipe) {
      totals.calories += recipe.nutrition.calories;
      totals.sodium += recipe.nutrition.sodium;
      totals.saturatedFat += recipe.nutrition.saturatedFat;
    }
  }
  return totals;
}
