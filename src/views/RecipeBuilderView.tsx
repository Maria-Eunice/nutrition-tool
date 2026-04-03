// Recipe Builder: create and edit recipes with live nutrition label preview.
import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReactToPrint } from "react-to-print";
import { ChefHat, Save, X, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { C, font } from "../data/brand";
import { NDB, RECIPE_CATEGORIES, EMPTY_NUTRITION } from "../data/constants";
import { useAppStore } from "../store/useAppStore";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Sel } from "../components/ui/Sel";
import { Btn } from "../components/ui/Btn";
import { NutritionLabel } from "../components/NutritionLabel";
import { PrintableNutritionFacts } from "../components/PrintableNutritionFacts";
import type { Nutrition } from "../types";

/* ── Zod schema ── */

const nutritionSchema = z.object({
  calories: z.number().positive("Calories must be a positive number"),
  totalFat: z.number().min(0),
  saturatedFat: z.number().min(0),
  transFat: z.number().min(0),
  cholesterol: z.number().min(0),
  sodium: z.number().min(0),
  totalCarbs: z.number().min(0),
  fiber: z.number().min(0),
  totalSugars: z.number().min(0),
  addedSugars: z.number().min(0),
  protein: z.number().min(0),
  vitaminD: z.number().min(0),
  calcium: z.number().min(0),
  iron: z.number().min(0),
  potassium: z.number().min(0),
});

export const recipeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string(),
  yield: z.number().positive("Yield must be greater than zero"),
  servingSize: z.string().min(1, "Serving size is required"),
  ingredients: z
    .array(z.object({ name: z.string(), qty: z.number(), unit: z.string() }))
    .min(1, "At least one ingredient is required"),
  nutrition: nutritionSchema,
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

/** Human-readable label + unit for each nutrition key. */
const NUTR_META: Record<string, { label: string; unit: string }> = {
  calories:     { label: "Calories",        unit: "kcal" },
  totalFat:     { label: "Total Fat",        unit: "g" },
  saturatedFat: { label: "Saturated Fat",    unit: "g" },
  transFat:     { label: "Trans Fat",        unit: "g" },
  cholesterol:  { label: "Cholesterol",      unit: "mg" },
  sodium:       { label: "Sodium",           unit: "mg" },
  totalCarbs:   { label: "Total Carbs",      unit: "g" },
  fiber:        { label: "Dietary Fiber",    unit: "g" },
  totalSugars:  { label: "Total Sugars",     unit: "g" },
  addedSugars:  { label: "Added Sugars",     unit: "g" },
  protein:      { label: "Protein",          unit: "g" },
  vitaminD:     { label: "Vitamin D",        unit: "mcg" },
  calcium:      { label: "Calcium",          unit: "mg" },
  iron:         { label: "Iron",             unit: "mg" },
  potassium:    { label: "Potassium",        unit: "mg" },
};

/* ── Component ── */

export const RecipeBuilderView = ({ editId }: { editId?: string } = {}) => {
  const router = useRouter();
  const recipes = useAppStore((s) => s.recipes);
  const addRecipe = useAppStore((s) => s.addRecipe);
  const updateRecipe = useAppStore((s) => s.updateRecipe);
  const editRecipe = editId ? recipes.find((r) => r.id === editId) ?? null : null;

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, control } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: editRecipe?.name || "",
      category: editRecipe?.category || "Entrée",
      yield: editRecipe?.yield || 50,
      servingSize: editRecipe?.servingSize || "1 serving",
      ingredients: editRecipe?.ingredients || [],
      nutrition: editRecipe?.nutrition || { ...EMPTY_NUTRITION },
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

  const [ingName, setIngName] = useState("");
  const [ingQty, setIngQty] = useState("");
  const [ingUnit, setIngUnit] = useState("lb");
  const printRef = useRef<HTMLDivElement>(null);

  /* Watched values for live preview & print */
  const watchedNutritionRaw = watch("nutrition");
  const watchedServingSize = watch("servingSize");
  const watchedName = watch("name");

  /* Ensure nutrition values are numbers for the label component */
  const nutrition: Nutrition = Object.fromEntries(
    Object.entries(watchedNutritionRaw).map(([k, v]) => [k, Number(v) || 0])
  ) as unknown as Nutrition;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${watchedName || "Recipe"} — Nutrition Facts`,
    pageStyle: `
      @page { size: letter; margin: 0.75in; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  const addIng = () => {
    if (!ingName || !ingQty) return;
    append({ name: ingName, qty: parseFloat(ingQty), unit: ingUnit });
    const k = Object.keys(NDB).find((k) => ingName.toLowerCase().includes(k));
    if (k) {
      const currentYield = Number(getValues("yield")) || 50;
      const f = parseFloat(ingQty) / currentYield;
      const n = NDB[k];
      const prev = getValues("nutrition");
      (Object.keys(n) as (keyof Nutrition)[]).forEach((key) => {
        setValue(`nutrition.${key}`, Math.round((Number(prev[key]) + n[key] * f) * 10) / 10, { shouldValidate: true });
      });
    }
    setIngName("");
    setIngQty("");
    setIngUnit("lb");
  };

  const onSubmit = (data: RecipeFormData) => {
    const recipe = { id: editRecipe?.id ?? '', ...data };
    if (editRecipe) updateRecipe(recipe);
    else addRecipe(recipe);
    router.push("/");
  };

  const labelStyle = { color: `${C.slate}88`, fontFamily: font.body } as const;

  return (
    <div>
      <SectionHeader icon={ChefHat}>{editRecipe ? "Edit Recipe" : "Recipe Builder"}</SectionHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">

            {/* ── Recipe Details ── */}
            <Card className="p-6 space-y-5">
              <div>
                <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: font.header, color: C.slate }}>Recipe Details</h3>
                <p className="text-xs" style={{ color: `${C.slate}66`, fontFamily: font.body }}>Basic information about this recipe</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold mb-1.5 block" style={labelStyle}>Recipe Name</label>
                  <Input {...register("name")} placeholder="e.g. Chicken Tenders" />
                  <FieldError message={errors.name?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={labelStyle}>Category</label>
                  <Sel {...register("category")} className="w-full">
                    {RECIPE_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Sel>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={labelStyle}>Serving Size</label>
                  <Input {...register("servingSize")} placeholder="e.g. 1 cup (240g)" />
                  <FieldError message={errors.servingSize?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={labelStyle}>Yield <span className="font-normal">(total servings)</span></label>
                  <Input type="number" step="any" {...register("yield", { valueAsNumber: true })} placeholder="50" />
                  <FieldError message={errors.yield?.message} />
                </div>
              </div>
            </Card>

            {/* ── Ingredients ── */}
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: font.header, color: C.slate }}>Ingredients</h3>
                <p className="text-xs" style={{ color: `${C.slate}66`, fontFamily: font.body }}>Add ingredients — nutrition values auto-fill when names are recognised</p>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <Input placeholder="Ingredient name" value={ingName} onChange={(e) => setIngName(e.target.value)} className="flex-1 min-w-[160px]" />
                <Input type="number" placeholder="Qty" value={ingQty} onChange={(e) => setIngQty(e.target.value)} className="w-24" />
                <Sel value={ingUnit} onChange={(e) => setIngUnit(e.target.value)}>
                  {["lb", "oz", "cups", "tbsp", "tsp", "each", "can", "gal"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </Sel>
                <Btn type="button" onClick={addIng}>+ Add</Btn>
              </div>
              <FieldError message={errors.ingredients?.root?.message ?? errors.ingredients?.message} />
              {fields.length === 0 ? (
                <p className="text-sm text-center py-6" style={{ color: `${C.slate}44`, fontFamily: font.body }}>No ingredients added yet</p>
              ) : (
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: `${C.slate}15` }}>
                  <table className="w-full text-sm" style={{ fontFamily: font.body }}>
                    <thead>
                      <tr style={{ backgroundColor: C.lightBlue }}>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: C.blue }}>Ingredient</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: C.blue }}>Qty</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: C.blue }}>Unit</th>
                        <th className="px-3 py-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, i) => (
                        <tr key={field.id} className="border-t" style={{ borderColor: `${C.slate}10` }}>
                          <td className="px-3 py-2.5">{field.name}</td>
                          <td className="px-3 py-2.5">{field.qty}</td>
                          <td className="px-3 py-2.5">{field.unit}</td>
                          <td className="px-3 py-2.5">
                            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                              <X size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* ── Nutrition Override ── */}
            <Card className="p-6">
              <div className="mb-5">
                <h3 className="font-bold text-base mb-0.5" style={{ fontFamily: font.header, color: C.slate }}>Nutrition Facts <span className="font-normal text-sm">(per serving)</span></h3>
                <p className="text-xs" style={{ color: `${C.slate}66`, fontFamily: font.body }}>Values auto-fill from ingredients. Edit manually if needed.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                {(Object.keys(EMPTY_NUTRITION) as (keyof Nutrition)[]).map((k) => {
                  const meta = NUTR_META[k] ?? { label: k, unit: "" };
                  return (
                    <div key={k}>
                      <label className="text-xs font-medium mb-1 block" style={{ color: `${C.slate}88`, fontFamily: font.body }}>
                        {meta.label}
                        {meta.unit && <span className="ml-1 font-normal" style={{ color: `${C.slate}55` }}>({meta.unit})</span>}
                      </label>
                      <Input
                        type="number"
                        step="any"
                        {...register(`nutrition.${k}`, { valueAsNumber: true })}
                        className="h-9 text-sm"
                      />
                      {k === "calories" && <FieldError message={errors.nutrition?.calories?.message} />}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* ── Actions ── */}
            <div className="flex items-center gap-3 pb-6">
              <Btn type="submit" icon={Save}>
                {editRecipe ? "Update Recipe" : "Save Recipe"}
              </Btn>
              <Btn type="button" variant="outline" icon={Printer} onClick={handlePrint}>
                Print Nutrition Facts
              </Btn>
            </div>
          </div>

          {/* ── Live Preview ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <h3 className="font-bold text-base mb-3" style={{ fontFamily: font.header, color: C.blue }}>Live Preview</h3>
              <p className="text-xs mb-4" style={{ color: `${C.slate}66`, fontFamily: font.body }}>Updates as you type</p>
              <NutritionLabel nutrition={nutrition} servingSize={watchedServingSize} />
            </div>
          </div>
        </div>
      </form>
      <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <PrintableNutritionFacts
          ref={printRef}
          recipeName={watchedName || "Untitled Recipe"}
          servingSize={watchedServingSize}
          nutrition={nutrition}
        />
      </div>
    </div>
  );
};
