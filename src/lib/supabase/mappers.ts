import type { Recipe, Ingredient } from "../../types";

/** Shape of a row returned from the `recipes` table in Supabase. */
export interface DbRecipeRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  yield: number;
  serving_size: string;
  ingredients: Ingredient[];
  nutr_calories: number;
  nutr_fat_g: number;
  nutr_sat_fat_g: number;
  nutr_trans_fat_g: number;
  nutr_cholesterol_mg: number;
  nutr_sodium_mg: number;
  nutr_carbs_g: number;
  nutr_fiber_g: number;
  nutr_sugars_g: number;
  nutr_added_sugars_g: number;
  nutr_protein_g: number;
  nutr_vit_d_mcg: number;
  nutr_calcium_mg: number;
  nutr_iron_mg: number;
  nutr_potassium_mg: number;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

/** Shape used when inserting a new recipe row (Supabase assigns id, user_id, timestamps, metadata). */
export type DbRecipeInsert = Omit<DbRecipeRow, "id" | "user_id" | "created_at" | "updated_at" | "metadata">;

/** Convert a Supabase DB row to the app's Recipe type. */
export function dbRowToRecipe(row: DbRecipeRow): Recipe {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    yield: row.yield,
    servingSize: row.serving_size,
    ingredients: row.ingredients ?? [],
    nutrition: {
      calories: row.nutr_calories,
      totalFat: row.nutr_fat_g,
      saturatedFat: row.nutr_sat_fat_g,
      transFat: row.nutr_trans_fat_g,
      cholesterol: row.nutr_cholesterol_mg,
      sodium: row.nutr_sodium_mg,
      totalCarbs: row.nutr_carbs_g,
      fiber: row.nutr_fiber_g,
      totalSugars: row.nutr_sugars_g,
      addedSugars: row.nutr_added_sugars_g,
      protein: row.nutr_protein_g,
      vitaminD: row.nutr_vit_d_mcg,
      calcium: row.nutr_calcium_mg,
      iron: row.nutr_iron_mg,
      potassium: row.nutr_potassium_mg,
    },
  };
}

/** Convert the app's Recipe (minus id) to the Supabase insert shape. */
export function recipeToDbInsert(r: Omit<Recipe, "id">): DbRecipeInsert {
  return {
    name: r.name,
    category: r.category,
    yield: r.yield,
    serving_size: r.servingSize,
    ingredients: r.ingredients,
    nutr_calories: r.nutrition.calories,
    nutr_fat_g: r.nutrition.totalFat,
    nutr_sat_fat_g: r.nutrition.saturatedFat,
    nutr_trans_fat_g: r.nutrition.transFat,
    nutr_cholesterol_mg: r.nutrition.cholesterol,
    nutr_sodium_mg: r.nutrition.sodium,
    nutr_carbs_g: r.nutrition.totalCarbs,
    nutr_fiber_g: r.nutrition.fiber,
    nutr_sugars_g: r.nutrition.totalSugars,
    nutr_added_sugars_g: r.nutrition.addedSugars,
    nutr_protein_g: r.nutrition.protein,
    nutr_vit_d_mcg: r.nutrition.vitaminD,
    nutr_calcium_mg: r.nutrition.calcium,
    nutr_iron_mg: r.nutrition.iron,
    nutr_potassium_mg: r.nutrition.potassium,
  };
}
