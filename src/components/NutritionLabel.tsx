import { C } from "../data/brand";
import type { Nutrition } from "../types";

interface NutritionLabelProps {
  nutrition: Nutrition;
  servingSize?: string;
}

/** Returns the % Daily Value for a given amount and daily reference value. */
const pctDV = (value: number, dailyRef: number) =>
  dailyRef ? Math.round((value / dailyRef) * 100) : 0;

interface NutritionRowProps {
  label: string;
  value?: number;
  unit: string;
  dailyRef: number | null;
  bold?: boolean;
  indent?: boolean;
}

/** One row in the FDA-style nutrition facts panel. */
const NutritionRow = ({ label, value, unit, dailyRef, bold = false, indent = false }: NutritionRowProps) => (
  <div
    className={`flex justify-between py-0.5 ${bold ? "font-bold" : ""} ${indent ? "pl-4" : ""}`}
    style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
  >
    <span>{label} {value !== undefined ? `${Math.round(value * 10) / 10}${unit}` : ""}</span>
    {dailyRef
      ? <span className="font-bold">{pctDV(value ?? 0, dailyRef)}%</span>
      : <span />
    }
  </div>
);

export const NutritionLabel = ({ nutrition, servingSize = "1 serving" }: NutritionLabelProps) => {
  const n = nutrition || ({} as Nutrition);
  return (
    <div className="border-2 border-black p-2 max-w-xs bg-white" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="text-3xl font-extrabold leading-none">Nutrition Facts</div>
      <div className="border-b border-black pb-1 mb-1 text-sm">Serving size {servingSize}</div>
      <div className="border-b-8 border-black pb-1 mb-1">
        <div className="text-sm font-bold">Amount per serving</div>
        <div className="flex justify-between items-end">
          <span className="text-3xl font-extrabold">Calories</span>
          <span className="text-4xl font-extrabold">{Math.round(n.calories || 0)}</span>
        </div>
      </div>
      <div className="text-sm text-right font-bold border-b border-gray-400 pb-0.5 mb-0.5">% Daily Value*</div>
      <div className="text-sm divide-y divide-gray-300">
        <NutritionRow label="Total Fat"          value={n.totalFat}      unit="g"  dailyRef={78}   bold />
        <NutritionRow label="Saturated Fat"      value={n.saturatedFat}  unit="g"  dailyRef={20}   indent />
        <NutritionRow label="Trans Fat"          value={n.transFat}      unit="g"  dailyRef={null} indent />
        <NutritionRow label="Cholesterol"        value={n.cholesterol}   unit="mg" dailyRef={300}  bold />
        <NutritionRow label="Sodium"             value={n.sodium}        unit="mg" dailyRef={2300} bold />
        <NutritionRow label="Total Carbohydrate" value={n.totalCarbs}    unit="g"  dailyRef={275}  bold />
        <NutritionRow label="Dietary Fiber"      value={n.fiber}         unit="g"  dailyRef={28}   indent />
        <NutritionRow label="Total Sugars"       value={n.totalSugars}   unit="g"  dailyRef={null} indent />
        <div className="pl-8 flex justify-between py-0.5">
          <span>Incl. {Math.round((n.addedSugars || 0) * 10) / 10}g Added Sugars</span>
          <span className="font-bold">{pctDV(n.addedSugars, 50)}%</span>
        </div>
        <NutritionRow label="Protein" value={n.protein} unit="g" dailyRef={50} bold />
      </div>
      <div className="border-t-8 border-black mt-1 pt-1 text-sm divide-y divide-gray-300">
        <NutritionRow label="Vitamin D"  value={n.vitaminD}  unit="mcg" dailyRef={20}   />
        <NutritionRow label="Calcium"    value={n.calcium}   unit="mg"  dailyRef={1300} />
        <NutritionRow label="Iron"       value={n.iron}      unit="mg"  dailyRef={18}   />
        <NutritionRow label="Potassium"  value={n.potassium} unit="mg"  dailyRef={4700} />
      </div>
      <div className="border-t border-black mt-1 pt-1 text-xs leading-tight" style={{ color: `${C.slate}99` }}>
        * The % Daily Value tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
};
