import { C } from "./brand";
import type { MealComponent, UsdaLimits, Nutrition } from "../types";

/** Recipe category options — shared by RecipeBuilderView and RecipeFormDialog. */
export const RECIPE_CATEGORIES = [
  "Entrée", "Grain", "WG Rich", "Vegetable", "Fruit", "Protein", "Milk",
] as const;

/** Zero-value nutrition object used as default/reset for new recipes. */
export const EMPTY_NUTRITION: Nutrition = {
  calories: 0, totalFat: 0, saturatedFat: 0, transFat: 0,
  cholesterol: 0, sodium: 0, totalCarbs: 0, fiber: 0,
  totalSugars: 0, addedSugars: 0, protein: 0, vitaminD: 0,
  calcium: 0, iron: 0, potassium: 0,
};

export const USDA_LIMITS: Record<string, UsdaLimits> = {
  "K-5": { calories: { min: 550, max: 650 }, sodium: 1230, saturatedFatPct: 10, grainOz: 1, meatOz: 1, vegCup: 0.75, fruitCup: 0.5, milkCup: 1 },
  "6-8": { calories: { min: 600, max: 700 }, sodium: 1360, saturatedFatPct: 10, grainOz: 1, meatOz: 1, vegCup: 0.75, fruitCup: 0.5, milkCup: 1 },
  "9-12": { calories: { min: 750, max: 850 }, sodium: 1420, saturatedFatPct: 10, grainOz: 2, meatOz: 2, vegCup: 1, fruitCup: 1, milkCup: 1 },
};

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const BK_COMPS: MealComponent[] = [
  { key: "bk_grain", label: "Whole Grain Rich", cat: "WG Rich", color: "#d97706" },
  { key: "bk_protein", label: "Protein", cat: "Protein", color: "#b91c1c" },
  { key: "bk_fruit", label: "Fruit", cat: "Fruit", color: "#7c3aed" },
  { key: "bk_milk", label: "Milk", cat: "Milk", color: C.blue },
];

export const LN_COMPS: MealComponent[] = [
  { key: "ln_entree", label: "Entrée", cat: "Entrée", color: "#b91c1c" },
  { key: "ln_grain", label: "Grain", cat: "Grain", color: "#d97706" },
  { key: "ln_veg", label: "Vegetable", cat: "Vegetable", color: C.green },
  { key: "ln_fruit", label: "Fruit", cat: "Fruit", color: "#7c3aed" },
  { key: "ln_milk", label: "Milk", cat: "Milk", color: C.blue },
];

export const ALL_COMPS = [...BK_COMPS, ...LN_COMPS];

export const MILK_ITEM = {
  id: 99,
  name: "1% Low-Fat Milk",
  category: "Milk",
  nutrition: { calories: 100, totalFat: 2.5, saturatedFat: 1.5, transFat: 0, cholesterol: 12, sodium: 105, totalCarbs: 12, fiber: 0, totalSugars: 12, addedSugars: 0, protein: 8, vitaminD: 2.5, calcium: 305, iron: 0, potassium: 366 } as Nutrition,
};

export const NDB: Record<string, Nutrition> = {
  chicken: { calories: 165, totalFat: 3.6, saturatedFat: 1, transFat: 0, cholesterol: 85, sodium: 74, totalCarbs: 0, fiber: 0, totalSugars: 0, addedSugars: 0, protein: 31, vitaminD: 0.1, calcium: 11, iron: 0.7, potassium: 256 },
  beef: { calories: 250, totalFat: 17, saturatedFat: 6.5, transFat: 1, cholesterol: 80, sodium: 72, totalCarbs: 0, fiber: 0, totalSugars: 0, addedSugars: 0, protein: 26, vitaminD: 0, calcium: 18, iron: 2.6, potassium: 315 },
  rice: { calories: 130, totalFat: 0.3, saturatedFat: 0.1, transFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 28, fiber: 0.4, totalSugars: 0, addedSugars: 0, protein: 2.7, vitaminD: 0, calcium: 10, iron: 0.2, potassium: 35 },
  pasta: { calories: 158, totalFat: 0.9, saturatedFat: 0.2, transFat: 0, cholesterol: 0, sodium: 1, totalCarbs: 31, fiber: 1.8, totalSugars: 0.6, addedSugars: 0, protein: 5.8, vitaminD: 0, calcium: 7, iron: 1, potassium: 44 },
  cheese: { calories: 113, totalFat: 9.3, saturatedFat: 5.9, transFat: 0.3, cholesterol: 28, sodium: 174, totalCarbs: 0.4, fiber: 0, totalSugars: 0.1, addedSugars: 0, protein: 7, vitaminD: 0.1, calcium: 200, iron: 0.2, potassium: 21 },
  egg: { calories: 72, totalFat: 5, saturatedFat: 1.6, transFat: 0, cholesterol: 186, sodium: 71, totalCarbs: 0.4, fiber: 0, totalSugars: 0.2, addedSugars: 0, protein: 6.3, vitaminD: 1, calcium: 28, iron: 0.9, potassium: 69 },
};

export const COMP_LABELS: Record<string, string> = {
  bk_grain: "Breakfast — Whole Grain Rich",
  bk_protein: "Breakfast — Protein",
  bk_fruit: "Breakfast — Fruit",
  bk_milk: "Breakfast — Milk",
  ln_entree: "Lunch — Entrée",
  ln_grain: "Lunch — Grain",
  ln_veg: "Lunch — Vegetable",
  ln_fruit: "Lunch — Fruit",
  ln_milk: "Lunch — Milk",
};
