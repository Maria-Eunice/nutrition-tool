import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { C, font } from "../data/brand";
import { DAYS, ALL_COMPS, MILK_ITEM } from "../data/constants";
import { useAppStore } from "../store/useAppStore";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import type { Recipe } from "../types";

export const ReportsView = () => {
  const recipes = useAppStore((s) => s.recipes);
  const menu = useAppStore((s) => s.menu);

  /** Per-day nutrition totals across all planned meal components. */
  const weeklyData = useMemo(() => DAYS.map(day => {
    let calories = 0, sodium = 0, saturatedFat = 0, count = 0;
    ALL_COMPS.forEach(comp => {
      const slotName = menu[`${day}-${comp.key}`];
      let recipe: { nutrition: Recipe["nutrition"] } | undefined;
      if (comp.cat === "Milk" && slotName) recipe = MILK_ITEM;
      else recipe = recipes.find(x => x.name === slotName);
      if (recipe) { calories += recipe.nutrition.calories; sodium += recipe.nutrition.sodium; saturatedFat += recipe.nutrition.saturatedFat; count++; }
    });
    return { day: day.slice(0, 3), calories, sodium, saturatedFat, count };
  }), [recipes, menu]);

  /** Average a numeric field across days that have at least one item planned. */
  const avgAcrossActiveDays = (selector: (days: typeof weeklyData) => number): number => {
    const activeDays = weeklyData.filter(d => d.count > 0);
    return activeDays.length ? selector(activeDays) : 0;
  };

  const avgCalories = Math.round(avgAcrossActiveDays(days => days.reduce((sum, d) => sum + d.calories, 0) / days.length));
  const avgSodium   = Math.round(avgAcrossActiveDays(days => days.reduce((sum, d) => sum + d.sodium, 0) / days.length));
  const avgSatFat   = avgAcrossActiveDays(days => +(days.reduce((sum, d) => sum + d.saturatedFat, 0) / days.length).toFixed(1));

  return (
    <div>
      <SectionHeader icon={BarChart3}>Weekly Reports</SectionHeader>
      <p className="text-sm mb-6" style={{ fontFamily: font.body, color: `${C.slate}88` }}>Nutrition analysis across your planned menus</p>

      {/* ── Summary stat cards ── */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Avg Daily Calories", value: avgCalories || "—", limit: "USDA: 550-850",  ok: avgCalories === 0 || (avgCalories >= 550 && avgCalories <= 850) },
          { label: "Avg Daily Sodium",   value: avgSodium ? `${avgSodium}mg` : "—", limit: "USDA: ≤1230mg", ok: avgSodium === 0 || avgSodium <= 1230 },
          { label: "Avg Sat. Fat",       value: avgSatFat ? `${avgSatFat}g` : "—", limit: "USDA: <10% cal", ok: true },
        ].map(({ label, value, limit, ok }) => (
          <Card key={label} className="p-5">
            <div className="text-xs font-semibold mb-1" style={{ color: `${C.slate}88`, fontFamily: font.body }}>{label}</div>
            <div className="text-3xl font-black" style={{ color: C.green, fontFamily: font.header }}>{value}</div>
            <Badge color={ok ? C.green : "#dc2626"}>{limit}</Badge>
          </Card>
        ))}
      </div>

      {/* ── Bar charts ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { title: "Daily Calories",    field: "calories"  as const, maxRef: 850,  limitLabel: "Max 850"    },
          { title: "Daily Sodium (mg)", field: "sodium"    as const, maxRef: 1420, limitLabel: "Limit 1230mg" },
        ].map(({ title, field, maxRef, limitLabel }) => (
          <Card key={title} className="p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: font.header, color: C.blue }}>{title}</h3>
            <div className="space-y-3">
              {weeklyData.map(d => {
                const value = d[field];
                const isOver  = field === "calories" ? value > 850   : value > 1230;
                const isUnder = field === "calories" && value > 0 && value < 550;
                return (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="w-10 text-sm font-semibold" style={{ fontFamily: font.body, color: C.slate }}>{d.day}</span>
                    <div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: C.lightBlue }}>
                      <div
                        className="h-full rounded-lg transition-all"
                        style={{
                          width: `${Math.min((value / maxRef) * 100, 100)}%`,
                          backgroundColor: isOver ? "#dc2626" : isUnder ? C.yellow : C.green,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: C.slate, fontFamily: font.body }}>
                        {value || "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: `${C.slate}66`, fontFamily: font.body }}>
                <span className="border-t-2 border-dashed w-6" style={{ borderColor: "#dc2626" }} /> {limitLabel}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
