export interface Ingredient {
  name: string;
  qty: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbs: number;
  fiber: number;
  totalSugars: number;
  addedSugars: number;
  protein: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  yield: number;
  servingSize: string;
  ingredients: Ingredient[];
  nutrition: Nutrition;
}

export type MenuMap = Record<string, string>;

export interface MealComponent {
  key: string;
  label: string;
  cat: string;
  color: string;
}

export interface UsdaLimits {
  calories: { min: number; max: number };
  sodium: number;
  saturatedFatPct: number;
  grainOz: number;
  meatOz: number;
  vegCup: number;
  fruitCup: number;
  milkCup: number;
}
