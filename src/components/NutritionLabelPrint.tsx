import { forwardRef } from "react";
import type { Nutrition } from "../types";

interface Props {
  nutrition: Nutrition;
  servingSize?: string;
}

/** FDA-style Nutrition Facts label using only inline styles (for print extraction) */
export const NutritionLabelPrint = forwardRef<HTMLDivElement, Props>(({ nutrition, servingSize = "1 serving" }, ref) => {
  const n = nutrition || ({} as Nutrition);
  const dv = (v: number, d: number) => (d ? Math.round((v / d) * 100) : 0);

  const row = (label: string, value: number | undefined, unit: string, dvRef: number | null, opts: { bold?: boolean; indent?: boolean; topBorder?: number } = {}) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontWeight: opts.bold ? 700 : 400, paddingLeft: opts.indent ? 16 : 0, borderTop: opts.topBorder ? `${opts.topBorder}px solid #000` : "1px solid #ccc", fontSize: 13 }}>
      <span>{label} {value !== undefined ? `${Math.round(value * 10) / 10}${unit}` : ""}</span>
      {dvRef ? <span style={{ fontWeight: 700 }}>{dv(value || 0, dvRef)}%</span> : <span />}
    </div>
  );

  return (
    <div ref={ref} style={{ border: "2px solid #000", padding: 4, maxWidth: 300, backgroundColor: "#fff", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#000" }}>
      <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>Nutrition Facts</div>
      <div style={{ borderBottom: "1px solid #000", paddingBottom: 2, marginBottom: 2, fontSize: 13 }}>Serving size {servingSize}</div>
      <div style={{ borderBottom: "8px solid #000", paddingBottom: 4, marginBottom: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Amount per serving</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 28, fontWeight: 900 }}>Calories</span>
          <span style={{ fontSize: 36, fontWeight: 900 }}>{Math.round(n.calories || 0)}</span>
        </div>
      </div>
      <div style={{ textAlign: "right", fontWeight: 700, borderBottom: "1px solid #999", paddingBottom: 2, marginBottom: 2, fontSize: 13 }}>% Daily Value*</div>
      {row("Total Fat", n.totalFat, "g", 78, { bold: true })}
      {row("Saturated Fat", n.saturatedFat, "g", 20, { indent: true })}
      {row("Trans Fat", n.transFat, "g", null, { indent: true })}
      {row("Cholesterol", n.cholesterol, "mg", 300, { bold: true })}
      {row("Sodium", n.sodium, "mg", 2300, { bold: true })}
      {row("Total Carbohydrate", n.totalCarbs, "g", 275, { bold: true })}
      {row("Dietary Fiber", n.fiber, "g", 28, { indent: true })}
      {row("Total Sugars", n.totalSugars, "g", null, { indent: true })}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", paddingLeft: 32, borderTop: "1px solid #ccc", fontSize: 13 }}>
        <span>Incl. {Math.round((n.addedSugars || 0) * 10) / 10}g Added Sugars</span>
        <span style={{ fontWeight: 700 }}>{dv(n.addedSugars, 50)}%</span>
      </div>
      {row("Protein", n.protein, "g", 50, { bold: true })}
      <div style={{ borderTop: "8px solid #000", marginTop: 2, paddingTop: 2 }}>
        {row("Vitamin D", n.vitaminD, "mcg", 20)}
        {row("Calcium", n.calcium, "mg", 1300)}
        {row("Iron", n.iron, "mg", 18)}
        {row("Potassium", n.potassium, "mg", 4700)}
      </div>
      <div style={{ borderTop: "1px solid #000", marginTop: 4, paddingTop: 4, fontSize: 11, lineHeight: 1.3, color: "#666" }}>
        * The % Daily Value tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
});
