import { C } from "../data/brand";
import type { Nutrition } from "../types";

interface NutritionLabelProps {
  nutrition: Nutrition;
  servingSize?: string;
}

export const NutritionLabel = ({ nutrition, servingSize = "1 serving" }: NutritionLabelProps) => {
  const n = nutrition || ({} as Nutrition);
  const dv = (v: number, d: number) => (d ? Math.round((v / d) * 100) : 0);
  const R = (l: string, v: number | undefined, u: string, d: number | null, b = false, ind = false) => (
    <div className={`flex justify-between py-0.5 ${b ? "font-bold" : ""} ${ind ? "pl-4" : ""}`} style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}>
      <span>{l} {v !== undefined ? `${Math.round(v * 10) / 10}${u}` : ""}</span>
      {d ? <span className="font-bold">{dv(v || 0, d)}%</span> : <span />}
    </div>
  );
  return (
    <div className="border-2 border-black p-2 max-w-xs bg-white" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="text-3xl font-extrabold leading-none">Nutrition Facts</div>
      <div className="border-b border-black pb-1 mb-1 text-sm">Serving size {servingSize}</div>
      <div className="border-b-8 border-black pb-1 mb-1">
        <div className="text-sm font-bold">Amount per serving</div>
        <div className="flex justify-between items-end"><span className="text-3xl font-extrabold">Calories</span><span className="text-4xl font-extrabold">{Math.round(n.calories || 0)}</span></div>
      </div>
      <div className="text-sm text-right font-bold border-b border-gray-400 pb-0.5 mb-0.5">% Daily Value*</div>
      <div className="text-sm divide-y divide-gray-300">
        {R("Total Fat", n.totalFat, "g", 78, true)}
        {R("Saturated Fat", n.saturatedFat, "g", 20, false, true)}
        {R("Trans Fat", n.transFat, "g", null, false, true)}
        {R("Cholesterol", n.cholesterol, "mg", 300, true)}
        {R("Sodium", n.sodium, "mg", 2300, true)}
        {R("Total Carbohydrate", n.totalCarbs, "g", 275, true)}
        {R("Dietary Fiber", n.fiber, "g", 28, false, true)}
        {R("Total Sugars", n.totalSugars, "g", null, false, true)}
        <div className="pl-8 flex justify-between py-0.5"><span>Incl. {Math.round((n.addedSugars || 0) * 10) / 10}g Added Sugars</span><span className="font-bold">{dv(n.addedSugars, 50)}%</span></div>
        {R("Protein", n.protein, "g", 50, true)}
      </div>
      <div className="border-t-8 border-black mt-1 pt-1 text-sm divide-y divide-gray-300">
        {R("Vitamin D", n.vitaminD, "mcg", 20)}{R("Calcium", n.calcium, "mg", 1300)}{R("Iron", n.iron, "mg", 18)}{R("Potassium", n.potassium, "mg", 4700)}
      </div>
      <div className="border-t border-black mt-1 pt-1 text-xs leading-tight" style={{ color: `${C.slate}99` }}>
        * The % Daily Value tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
};
