/**
 * Generates a SQL INSERT statement from INITIAL_RECIPES and prints it to stdout.
 * Run: npx tsx scripts/generate-seed-sql.ts
 */
import { INITIAL_RECIPES } from "../src/data/recipes";

const rows = INITIAL_RECIPES.map((r) => {
  const ingredients = JSON.stringify(r.ingredients).replace(/'/g, "''");
  const name        = r.name.replace(/'/g, "''");
  const category    = r.category.replace(/'/g, "''");
  const serving     = r.servingSize.replace(/'/g, "''");

  return `(NULL, '${name}', '${category}', ${r.yield}, '${serving}', '${ingredients}'::jsonb, `
    + `${r.nutrition.calories}, ${r.nutrition.totalFat}, ${r.nutrition.saturatedFat}, `
    + `${r.nutrition.transFat}, ${r.nutrition.cholesterol}, ${r.nutrition.sodium}, `
    + `${r.nutrition.totalCarbs}, ${r.nutrition.fiber}, ${r.nutrition.totalSugars}, `
    + `${r.nutrition.addedSugars}, ${r.nutrition.protein}, ${r.nutrition.vitaminD}, `
    + `${r.nutrition.calcium}, ${r.nutrition.iron}, ${r.nutrition.potassium})`;
});

const sql = `INSERT INTO public.recipes (
  user_id, name, category, yield, serving_size, ingredients,
  nutr_calories, nutr_fat_g, nutr_sat_fat_g, nutr_trans_fat_g,
  nutr_cholesterol_mg, nutr_sodium_mg, nutr_carbs_g, nutr_fiber_g,
  nutr_sugars_g, nutr_added_sugars_g, nutr_protein_g, nutr_vit_d_mcg,
  nutr_calcium_mg, nutr_iron_mg, nutr_potassium_mg
)
VALUES
${rows.join(",\n")}
ON CONFLICT DO NOTHING
RETURNING name;`;

process.stdout.write(sql);
