import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useReactToPrint } from "react-to-print";
import { ChefHat, Save, X, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { C, font } from "../data/brand";
import { NDB } from "../data/constants";
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
  calories: z.coerce.number().positive("Calories must be a positive number"),
  totalFat: z.coerce.number().min(0),
  saturatedFat: z.coerce.number().min(0),
  transFat: z.coerce.number().min(0),
  cholesterol: z.coerce.number().min(0),
  sodium: z.coerce.number().min(0),
  totalCarbs: z.coerce.number().min(0),
  fiber: z.coerce.number().min(0),
  totalSugars: z.coerce.number().min(0),
  addedSugars: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  vitaminD: z.coerce.number().min(0),
  calcium: z.coerce.number().min(0),
  iron: z.coerce.number().min(0),
  potassium: z.coerce.number().min(0),
});

export const recipeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string(),
  yield: z.coerce.number().positive("Yield must be greater than zero"),
  servingSize: z.string().min(1, "Serving size is required"),
  ingredients: z
    .array(z.object({ name: z.string(), qty: z.number(), unit: z.string() }))
    .min(1, "At least one ingredient is required"),
  nutrition: nutritionSchema,
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const EMPTY_NUTRITION: Nutrition = { calories: 0, totalFat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 0, totalCarbs: 0, fiber: 0, totalSugars: 0, addedSugars: 0, protein: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0 };

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

/* ── Component ── */

export const RecipeBuilderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipes = useAppStore((s) => s.recipes);
  const addRecipe = useAppStore((s) => s.addRecipe);
  const updateRecipe = useAppStore((s) => s.updateRecipe);
  const editRecipe = id ? recipes.find((r) => r.id === Number(id)) ?? null : null;

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
  ) as Nutrition;

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
    const recipe = { id: editRecipe?.id || Date.now(), ...data };
    if (editRecipe) updateRecipe(recipe);
    else addRecipe(recipe);
    navigate("/");
  };

  const labelStyle = { color: `${C.slate}88`, fontFamily: font.body } as const;

  return (
    <div>
      <SectionHeader icon={ChefHat}>{editRecipe ? "Edit Recipe" : "Recipe Builder"}</SectionHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* ── Recipe Details ── */}
            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-sm" style={{ fontFamily: font.header, color: C.slate }}>Recipe Details</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Name</label>
                  <Input {...register("name")} placeholder="e.g. Chicken Tenders" />
                  <FieldError message={errors.name?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Category</label>
                  <Sel {...register("category")} className="w-full">
                    {["Entrée", "Grain", "WG Rich", "Vegetable", "Fruit", "Protein", "Milk"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Sel>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Yield</label>
                  <Input type="number" step="any" {...register("yield")} />
                  <FieldError message={errors.yield?.message} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Serving Size</label>
                  <Input {...register("servingSize")} />
                  <FieldError message={errors.servingSize?.message} />
                </div>
              </div>
            </Card>

            {/* ── Ingredients ── */}
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ fontFamily: font.header, color: C.slate }}>Ingredients</h3>
              <div className="flex gap-2 mb-3 flex-wrap">
                <Input placeholder="Ingredient name" value={ingName} onChange={(e) => setIngName(e.target.value)} className="flex-1 min-w-[140px]" />
                <Input type="number" placeholder="Qty" value={ingQty} onChange={(e) => setIngQty(e.target.value)} className="w-20" />
                <Sel value={ingUnit} onChange={(e) => setIngUnit(e.target.value)}>
                  {["lb", "oz", "cups", "tbsp", "tsp", "each", "can", "gal"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </Sel>
                <Btn type="button" onClick={addIng} className="text-xs">+ Add</Btn>
              </div>
              <FieldError message={errors.ingredients?.root?.message ?? errors.ingredients?.message} />
              {fields.length > 0 && (
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: `${C.slate}15` }}>
                  <table className="w-full text-sm" style={{ fontFamily: font.body }}>
                    <thead>
                      <tr style={{ backgroundColor: C.lightBlue }}>
                        <th className="p-2 text-left text-xs font-semibold" style={{ color: C.blue }}>Ingredient</th>
                        <th className="p-2 text-left text-xs font-semibold" style={{ color: C.blue }}>Qty</th>
                        <th className="p-2 text-left text-xs font-semibold" style={{ color: C.blue }}>Unit</th>
                        <th className="p-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, i) => (
                        <tr key={field.id} className="border-t" style={{ borderColor: `${C.slate}10` }}>
                          <td className="p-2">{field.name}</td>
                          <td className="p-2">{field.qty}</td>
                          <td className="p-2">{field.unit}</td>
                          <td className="p-2">
                            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600">
                              <X size={14} />
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
            <Card className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ fontFamily: font.header, color: C.slate }}>Manual Nutrition Override (per serving)</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {(Object.keys(EMPTY_NUTRITION) as (keyof Nutrition)[]).map((k) => (
                  <div key={k}>
                    <label className="text-xs" style={{ color: `${C.slate}77`, fontFamily: font.body }}>{k}</label>
                    <Input type="number" step="any" {...register(`nutrition.${k}`)} className="h-8 text-xs" />
                    {k === "calories" && <FieldError message={errors.nutrition?.calories?.message} />}
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Actions ── */}
            <div className="flex items-center gap-3">
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
              <h3 className="font-bold text-sm mb-3" style={{ fontFamily: font.header, color: C.blue }}>Live Preview</h3>
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
