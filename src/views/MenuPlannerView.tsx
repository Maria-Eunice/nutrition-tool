import { useState, useMemo, useRef } from "react";
import { CalendarDays, BarChart3, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { startOfWeek, addWeeks, subWeeks, addDays, eachDayOfInterval, format, isThisWeek } from "date-fns";
import { useReactToPrint } from "react-to-print";
import { C, font, text, border } from "../data/brand";
import { BK_COMPS, LN_COMPS, MILK_ITEM } from "../data/constants";
import { useAppStore } from "../store/useAppStore";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Card } from "../components/ui/Card";
import { Sel } from "../components/ui/Sel";
import { Btn } from "../components/ui/Btn";
import { PrintableWeeklyMenu } from "../components/PrintableWeeklyMenu";
import type { Recipe, MealComponent } from "../types";

export const MenuPlannerView = () => {
  const recipes = useAppStore((s) => s.recipes);
  const menu = useAppStore((s) => s.menu);
  const setMenuSlot = useAppStore((s) => s.setMenuSlot);

  /* ── Week navigation ── */
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const weekDays = useMemo(() => eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 4) }), [weekStart]);
  const isCurrentWeek = isThisWeek(weekStart, { weekStartsOn: 1 });

  /* ── Print ── */
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Weekly Menu — ${format(weekStart, "MMMM d, yyyy")}`,
    pageStyle: `
      @page { size: letter landscape; margin: 0.5in; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  /** ISO date key for a given day, e.g. "2026-03-10" */
  const dateKey = (d: Date) => format(d, "yyyy-MM-dd");

  /* ── Recipe lookup by category ── */
  const byC = useMemo(() => {
    const m: Record<string, { id?: number; name: string; nutrition: Recipe["nutrition"] }[]> = {};
    recipes.forEach((r) => { if (!m[r.category]) m[r.category] = []; m[r.category].push(r); });
    m["Milk"] = [MILK_ITEM];
    return m;
  }, [recipes]);

  /* ── Nutrition helpers ── */
  const getNutr = (day: Date, comps: MealComponent[]) => {
    const t = { calories: 0, sodium: 0, saturatedFat: 0 };
    const dk = dateKey(day);
    comps.forEach((comp) => {
      const nm = menu[`${dk}-${comp.key}`];
      if (!nm) return;
      const r = comp.cat === "Milk" ? MILK_ITEM : recipes.find((x) => x.name === nm);
      if (r) { t.calories += r.nutrition.calories; t.sodium += r.nutrition.sodium; t.saturatedFat += r.nutrition.saturatedFat; }
    });
    return t;
  };

  const getDayTot = (d: Date) => {
    const b = getNutr(d, BK_COMPS);
    const l = getNutr(d, LN_COMPS);
    return { calories: b.calories + l.calories, sodium: b.sodium + l.sodium, saturatedFat: b.saturatedFat + l.saturatedFat };
  };

  /* ── Meal block sub-component ── */
  const MealBlock = ({ label, emoji, comps }: { label: string; emoji: string; comps: MealComponent[] }) => (
    <>
      <tr>
        <td colSpan={weekDays.length + 1} className="px-3 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span className="font-bold text-base" style={{ fontFamily: font.header, color: text.primary }}>{label}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: C.green }}>{comps.length} components</span>
          </div>
        </td>
      </tr>
      {comps.map((comp) => (
        <tr key={comp.key} style={{ borderTop: `1px solid ${border.default}` }}>
          <td className="p-2 pl-3 w-40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: comp.color }} />
              <span className="text-sm font-semibold" style={{ fontFamily: font.body, color: text.primary }}>{comp.label}</span>
            </div>
          </td>
          {weekDays.map((day) => {
            const dk = dateKey(day);
            const k = `${dk}-${comp.key}`;
            const val = menu[k] || "";
            const opts = byC[comp.cat] || [];
            return (
              <td key={dk} className="p-1.5" style={{ borderLeft: `1px solid ${border.default}` }}>
                <Sel value={val} onChange={(e) => setMenuSlot(k, e.target.value)} className="w-full text-xs h-8"
                  style={val ? { borderColor: comp.color, borderWidth: 2, backgroundColor: `${comp.color}08` } : {}}>
                  <option value="">—</option>
                  {opts.map((r) => <option key={r.id || r.name} value={r.name}>{r.name}</option>)}
                </Sel>
              </td>
            );
          })}
        </tr>
      ))}
      <tr style={{ borderTop: `2px solid ${C.green}30` }}>
        <td className="p-2 pl-3 text-sm font-bold" style={{ backgroundColor: `${C.green}08`, fontFamily: font.body, color: C.green }}>{label} Total</td>
        {weekDays.map((day) => {
          const n = getNutr(day, comps);
          return (
            <td key={dateKey(day)} className="p-1.5 text-center" style={{ borderLeft: `1px solid ${C.slate}08`, backgroundColor: `${C.green}08` }}>
              {n.calories > 0 ? (
                <div className="text-xs space-y-0.5" style={{ fontFamily: font.body }}>
                  <div className="font-bold" style={{ color: C.green }}>{n.calories} cal</div>
                  <div style={{ color: text.secondary }}>Na: {n.sodium}mg</div>
                </div>
              ) : <span className="text-xs" style={{ color: text.muted }}>—</span>}
            </td>
          );
        })}
      </tr>
    </>
  );

  return (
    <div>
      <SectionHeader icon={CalendarDays}>Weekly Menu Planner</SectionHeader>

      {/* ── Week navigation header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: font.header, color: text.primary }}>
            Week of {format(weekStart, "MMMM d, yyyy")}
          </h2>
          <p className="text-xs mt-0.5" style={{ fontFamily: font.body, color: text.secondary }}>
            Assign recipes to breakfast (4 components) and lunch (5 components) for each day
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="outline" className="text-xs px-3 py-1.5" icon={ChevronLeft}
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
            Prev
          </Btn>
          <Btn variant={isCurrentWeek ? "secondary" : "outline"} className="text-xs px-3 py-1.5"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
            Today
          </Btn>
          <Btn variant="outline" className="text-xs px-3 py-1.5" icon={ChevronRight}
            onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
            Next
          </Btn>
          <span className="w-px h-6 mx-1" style={{ backgroundColor: border.medium }} />
          <Btn variant="secondary" className="text-xs px-3 py-1.5" icon={Printer} onClick={() => handlePrint()}>
            Print Weekly Menu
          </Btn>
        </div>
      </div>

      {/* ── Planner table ── */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[850px]" style={{ fontFamily: font.body }}>
          <thead>
            <tr style={{ borderBottom: `3px solid ${C.blue}` }}>
              <th className="p-3 text-left font-bold text-sm w-40" style={{ fontFamily: font.header, color: C.blue }}>Component</th>
              {weekDays.map((day) => (
                <th key={dateKey(day)} className="p-3 text-center min-w-[140px]" style={{ color: C.blue, fontFamily: font.header }}>
                  <span className="block text-xs uppercase tracking-wider font-semibold" style={{ color: `${C.blue}77` }}>{format(day, "MMM d")}</span>
                  <span className="font-bold">{format(day, "EEEE")}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <MealBlock label="Breakfast" emoji="🌅" comps={BK_COMPS} />
            <MealBlock label="Lunch" emoji="☀️" comps={LN_COMPS} />
            <tr style={{ borderTop: `4px solid ${C.green}` }}>
              <td className="p-3 font-black" style={{ backgroundColor: `${C.green}15`, fontFamily: font.header, color: C.green }}>
                <div className="flex items-center gap-1.5"><BarChart3 size={16} fill={C.green} /> Daily Total</div>
              </td>
              {weekDays.map((day) => {
                const t = getDayTot(day);
                return (
                  <td key={dateKey(day)} className="p-2 text-center" style={{ borderLeft: `1px solid ${C.slate}08`, backgroundColor: `${C.green}15` }}>
                    {t.calories > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-sm font-black" style={{ color: C.green, fontFamily: font.header }}>{t.calories} cal</div>
                        <div className="text-xs" style={{ color: text.secondary }}>Na: {t.sodium}mg</div>
                        <div className="text-xs" style={{ color: text.secondary }}>SF: {t.saturatedFat.toFixed(1)}g</div>
                      </div>
                    ) : <span className="text-xs" style={{ color: text.muted }}>—</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </Card>

      {/* ── Legend ── */}
      <div className="mt-4 flex flex-wrap gap-4">
        {[...BK_COMPS, ...LN_COMPS].filter((c, i, a) => a.findIndex((x) => x.cat === c.cat) === i).map((comp) => (
          <div key={comp.cat} className="flex items-center gap-1.5 text-xs" style={{ color: text.secondary, fontFamily: font.body }}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />{comp.label}
          </div>
        ))}
      </div>

      {/* Hidden printable content for react-to-print */}
      <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <PrintableWeeklyMenu
          ref={printRef}
          weekStart={weekStart}
          weekDays={weekDays}
          menu={menu}
          recipes={recipes}
        />
      </div>
    </div>
  );
};
