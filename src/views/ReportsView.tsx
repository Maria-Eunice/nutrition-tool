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
  const wd = useMemo(() => DAYS.map(day => {
    let cal = 0, sod = 0, sf = 0, cnt = 0;
    ALL_COMPS.forEach(comp => {
      const nm = menu[`${day}-${comp.key}`];
      let r: { nutrition: Recipe["nutrition"] } | undefined;
      if (comp.cat === "Milk" && nm) r = MILK_ITEM; else r = recipes.find(x => x.name === nm);
      if (r) { cal += r.nutrition.calories; sod += r.nutrition.sodium; sf += r.nutrition.saturatedFat; cnt++; }
    });
    return { day: day.slice(0, 3), calories: cal, sodium: sod, saturatedFat: sf, count: cnt };
  }), [recipes, menu]);

  const avg = (fn: (f: typeof wd) => number) => { const f = wd.filter(d => d.count > 0); return f.length ? fn(f) : 0; };
  const aC = Math.round(avg(f => f.reduce((s, d) => s + d.calories, 0) / f.length));
  const aS = Math.round(avg(f => f.reduce((s, d) => s + d.sodium, 0) / f.length));
  const aSF = avg(f => +(f.reduce((s, d) => s + d.saturatedFat, 0) / f.length).toFixed(1));

  return (
    <div>
      <SectionHeader icon={BarChart3}>Weekly Reports</SectionHeader>
      <p className="text-sm mb-6" style={{ fontFamily: font.body, color: `${C.slate}88` }}>Nutrition analysis across your planned menus</p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[{ l: "Avg Daily Calories", v: aC || "—", lim: "USDA: 550-850", ok: aC === 0 || (aC >= 550 && aC <= 850) }, { l: "Avg Daily Sodium", v: aS ? `${aS}mg` : "—", lim: "USDA: ≤1230mg", ok: aS === 0 || aS <= 1230 }, { l: "Avg Sat. Fat", v: aSF ? `${aSF}g` : "—", lim: "USDA: <10% cal", ok: true }].map(({ l, v, lim, ok }) => (
          <Card key={l} className="p-5">
            <div className="text-xs font-semibold mb-1" style={{ color: `${C.slate}88`, fontFamily: font.body }}>{l}</div>
            <div className="text-3xl font-black" style={{ color: C.green, fontFamily: font.header }}>{v}</div>
            <Badge color={ok ? C.green : "#dc2626"}>{lim}</Badge>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[{ title: "Daily Calories", field: "calories" as const, maxRef: 850, limL: "Max 850" }, { title: "Daily Sodium (mg)", field: "sodium" as const, maxRef: 1420, limL: "Limit 1230mg" }].map(({ title, field, maxRef, limL }) => (
          <Card key={title} className="p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: font.header, color: C.blue }}>{title}</h3>
            <div className="space-y-3">
              {wd.map(d => { const v = d[field]; const over = field === "calories" ? v > 850 : v > 1230; const under = field === "calories" && v > 0 && v < 550; return (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-semibold" style={{ fontFamily: font.body, color: C.slate }}>{d.day}</span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: C.lightBlue }}>
                    <div className="h-full rounded-lg transition-all" style={{ width: `${Math.min((v / maxRef) * 100, 100)}%`, backgroundColor: over ? "#dc2626" : under ? C.yellow : C.green }} />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: C.slate, fontFamily: font.body }}>{v || "—"}</span>
                  </div>
                </div>
              ); })}
              <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: `${C.slate}66`, fontFamily: font.body }}>
                <span className="border-t-2 border-dashed w-6" style={{ borderColor: "#dc2626" }} /> {limL}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
