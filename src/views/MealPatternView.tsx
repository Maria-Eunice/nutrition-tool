import { useState, useMemo } from "react";
import { CheckCircle } from "lucide-react";
import { C, font } from "../data/brand";
import { USDA_LIMITS, MILK_ITEM } from "../data/constants";
import { useAppStore } from "../store/useAppStore";
import { groupRecipesByCategory } from "../utils/recipes";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Sel } from "../components/ui/Sel";
import type { Recipe } from "../types";

export const MealPatternView = () => {
  const recipes = useAppStore((s) => s.recipes);
  const [sel, setSel] = useState<Record<string, string>>({
    entree: "", grain: "", fruit: "", vegetable: "", milk: "1% Low-Fat Milk",
  });
  const [grade, setGrade] = useState("K-5");

  const recipesByCategory = useMemo(() => groupRecipesByCategory(recipes), [recipes]);
  const limits = USDA_LIMITS[grade];

  const selected = useMemo(() => {
    const items: { nutrition: Recipe["nutrition"] }[] = [];
    if (sel.entree) { const r = recipes.find(r => r.name === sel.entree); if (r) items.push(r); }
    if (sel.grain) { const r = recipes.find(r => r.name === sel.grain); if (r) items.push(r); }
    if (sel.fruit) { const r = recipes.find(r => r.name === sel.fruit); if (r) items.push(r); }
    if (sel.vegetable) { const r = recipes.find(r => r.name === sel.vegetable); if (r) items.push(r); }
    if (sel.milk) items.push(MILK_ITEM);
    return items;
  }, [sel, recipes]);

  const totals = useMemo(() => {
    const t = { calories: 0, sodium: 0, saturatedFat: 0, totalFat: 0 };
    selected.forEach(item => {
      t.calories += item.nutrition.calories;
      t.sodium += item.nutrition.sodium;
      t.saturatedFat += item.nutrition.saturatedFat;
      t.totalFat += item.nutrition.totalFat;
    });
    return t;
  }, [selected]);

  const satFatPct = totals.calories > 0 ? ((totals.saturatedFat * 9) / totals.calories) * 100 : 0;

  const checks = [
    { label: "Meat/Meat Alt", pass: !!sel.entree, note: sel.entree ? `${limits.meatOz} oz eq ✓` : "Required" },
    { label: "Grain", pass: !!sel.grain, note: sel.grain ? `${limits.grainOz} oz eq ✓` : "Required" },
    { label: "Fruit", pass: !!sel.fruit, note: sel.fruit ? `${limits.fruitCup} cup ✓` : "Required" },
    { label: "Vegetable", pass: !!sel.vegetable, note: sel.vegetable ? `${limits.vegCup} cup ✓` : "Required" },
    { label: "Milk", pass: !!sel.milk, note: sel.milk ? `${limits.milkCup} cup ✓` : "Required" },
    { label: "Calories", pass: totals.calories >= limits.calories.min && totals.calories <= limits.calories.max, note: `${totals.calories} / ${limits.calories.min}-${limits.calories.max}` },
    { label: "Sodium", pass: totals.sodium <= limits.sodium, note: `${totals.sodium}mg / ≤${limits.sodium}mg` },
    { label: "Sat. Fat <10%", pass: satFatPct < 10 || totals.calories === 0, note: `${satFatPct.toFixed(1)}%` },
  ];
  const allPass = checks.every(c => c.pass);

  return (
    <div>
      <SectionHeader icon={CheckCircle}>Meal Pattern Checker</SectionHeader>
      <p className="text-sm mb-6" style={{ fontFamily: font.body, color: `${C.slate}88` }}>Verify USDA meal pattern compliance by grade group</p>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <label className="text-sm font-semibold" style={{ fontFamily: font.body, color: C.slate }}>Grade Group</label>
            <Sel value={grade} onChange={e => setGrade(e.target.value)}>
              {["K-5", "6-8", "9-12"].map(g => <option key={g}>{g}</option>)}
            </Sel>
          </div>
          {[
            { key: "entree", label: "Entrée / Meat Alt", cat: "Entrée" },
            { key: "grain", label: "Grain", cat: "Grain" },
            { key: "fruit", label: "Fruit", cat: "Fruit" },
            { key: "vegetable", label: "Vegetable", cat: "Vegetable" },
          ].map(({ key, label, cat }) => (
            <div key={key}>
              <label className="text-xs font-semibold mb-1 block" style={{ color: C.blue, fontFamily: font.body }}>{label}</label>
              <Sel
                value={sel[key]}
                onChange={e => setSel(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full"
              >
                <option value="">— Select —</option>
                {(recipesByCategory[cat] ?? []).map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </Sel>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: C.blue, fontFamily: font.body }}>Milk</label>
            <Sel
              value={sel.milk}
              onChange={e => setSel(prev => ({ ...prev, milk: e.target.value }))}
              className="w-full"
            >
              <option value="">— None —</option>
              <option>1% Low-Fat Milk</option>
            </Sel>
          </div>
        </Card>

        <div className="space-y-4">
          <Card
            className="p-5"
            style={{
              borderWidth: 2,
              borderColor: allPass ? C.green : C.yellow,
              backgroundColor: allPass ? `${C.green}08` : `${C.yellow}15`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={24} fill={allPass ? C.green : "#f59e0b"} color="#fff" />
              <h3 className="font-bold text-lg" style={{ fontFamily: font.header, color: C.slate }}>
                {allPass ? "Meal Pattern Compliant" : "Compliance Issues Found"}
              </h3>
            </div>
            <div className="space-y-2">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/80">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: check.pass ? C.green : "#dc2626" }}
                    >
                      {check.pass ? "✓" : "✗"}
                    </span>
                    <span className="text-sm font-semibold" style={{ fontFamily: font.body, color: C.slate }}>{check.label}</span>
                  </div>
                  <span className="text-sm" style={{ fontFamily: font.body, color: `${C.slate}88` }}>{check.note}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-sm mb-3" style={{ fontFamily: font.header, color: C.blue }}>Meal Totals</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { label: "Calories", value: totals.calories },
                { label: "Sodium", value: `${totals.sodium}mg` },
                { label: "Sat. Fat", value: `${totals.saturatedFat.toFixed(1)}g` },
                { label: "Total Fat", value: `${totals.totalFat.toFixed(1)}g` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg p-3" style={{ backgroundColor: C.lightBlue }}>
                  <div className="text-xl font-bold" style={{ color: C.green, fontFamily: font.header }}>{value}</div>
                  <div className="text-xs" style={{ color: `${C.slate}88`, fontFamily: font.body }}>{label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
