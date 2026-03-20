/**
 * One-time migration script: inserts all INITIAL_RECIPES into the Supabase
 * recipes table. Safe to run multiple times — skips recipes that already exist
 * (matched by name) to avoid duplicates.
 *
 * Usage:
 *   npx tsx scripts/seed-recipes.ts
 */

import { createClient } from "@supabase/supabase-js";
import { INITIAL_RECIPES } from "../src/data/recipes";
import type { Recipe } from "../src/types";

// ── Supabase client ────────────────────────────────────────────────────────────

const SUPABASE_URL  = "https://eixjneyxbsdnrrrqjypy.supabase.co";
const SUPABASE_KEY  = "sb_publishable_3YBOPiAOBwuqTchWdb5KjA_7c1iiwtc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Mapper: Recipe → DB insert row ────────────────────────────────────────────

function toDbRow(r: Recipe) {
  return {
    name:               r.name,
    category:           r.category,
    yield:              r.yield,
    serving_size:       r.servingSize,
    ingredients:        r.ingredients,
    nutr_calories:      r.nutrition.calories,
    nutr_fat_g:         r.nutrition.totalFat,
    nutr_sat_fat_g:     r.nutrition.saturatedFat,
    nutr_trans_fat_g:   r.nutrition.transFat,
    nutr_cholesterol_mg: r.nutrition.cholesterol,
    nutr_sodium_mg:     r.nutrition.sodium,
    nutr_carbs_g:       r.nutrition.totalCarbs,
    nutr_fiber_g:       r.nutrition.fiber,
    nutr_sugars_g:      r.nutrition.totalSugars,
    nutr_added_sugars_g: r.nutrition.addedSugars,
    nutr_protein_g:     r.nutrition.protein,
    nutr_vit_d_mcg:     r.nutrition.vitaminD,
    nutr_calcium_mg:    r.nutrition.calcium,
    nutr_iron_mg:       r.nutrition.iron,
    nutr_potassium_mg:  r.nutrition.potassium,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱  SproutCNP Recipe Seed Migration`);
  console.log(`   Target: ${SUPABASE_URL}`);
  console.log(`   Recipes to process: ${INITIAL_RECIPES.length}\n`);

  // 1. Fetch existing recipe names to skip duplicates
  const { data: existing, error: fetchErr } = await supabase
    .from("recipes")
    .select("name");

  if (fetchErr) {
    console.error("❌  Could not fetch existing recipes:", fetchErr.message);
    process.exit(1);
  }

  const existingNames = new Set((existing ?? []).map((r: { name: string }) => r.name));
  console.log(`   Already in DB: ${existingNames.size} recipe(s)`);

  const toInsert = INITIAL_RECIPES.filter((r) => !existingNames.has(r.name));
  console.log(`   New recipes to insert: ${toInsert.length}\n`);

  if (toInsert.length === 0) {
    console.log("✅  Nothing to insert — all recipes already exist in the database.");
    process.exit(0);
  }

  // 2. Insert in batches of 10 to stay well within Supabase limits
  const BATCH_SIZE = 10;
  let inserted = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const rows  = batch.map(toDbRow);

    const { data, error } = await supabase
      .from("recipes")
      .insert(rows)
      .select("name");

    if (error) {
      failed += batch.length;
      errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      batch.forEach((r) => console.log(`   ⚠️  Failed: ${r.name}`));
    } else {
      const names = (data ?? []).map((r: { name: string }) => r.name);
      names.forEach((name: string) => console.log(`   ✅  Inserted: ${name}`));
      inserted += names.length;
    }
  }

  // 3. Final report
  console.log(`\n${"─".repeat(50)}`);
  console.log(`   Total processed : ${toInsert.length}`);
  console.log(`   Inserted        : ${inserted}`);
  console.log(`   Skipped (exist) : ${existingNames.size}`);
  console.log(`   Failed          : ${failed}`);

  if (errors.length > 0) {
    console.log(`\n   Errors:`);
    errors.forEach((e) => console.log(`     • ${e}`));
    console.log();
    process.exit(1);
  }

  if (inserted > 0) {
    console.log(`\n🎉  Migration complete — ${inserted} recipe(s) inserted successfully!\n`);
  } else {
    console.log(`\n⚠️  Migration finished but 0 rows were inserted. Check errors above.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
