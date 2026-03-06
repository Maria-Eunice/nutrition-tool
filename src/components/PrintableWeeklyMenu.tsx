import { forwardRef } from "react";
import { format } from "date-fns";
import { C, font } from "../data/brand";
import { BK_COMPS, LN_COMPS, MILK_ITEM } from "../data/constants";
import type { Recipe, MenuMap, MealComponent } from "../types";

interface Props {
  weekStart: Date;
  weekDays: Date[];
  menu: MenuMap;
  recipes: Recipe[];
}

/** Paper-formatted weekly menu — 8.5 x 11 landscape, all inline styles for print */
export const PrintableWeeklyMenu = forwardRef<HTMLDivElement, Props>(
  ({ weekStart, weekDays, menu, recipes }, ref) => {
    /* ── Helpers ── */
    const dateKey = (d: Date) => format(d, "yyyy-MM-dd");

    const getSlotName = (day: Date, compKey: string) =>
      menu[`${dateKey(day)}-${compKey}`] || "\u2014";

    const getNutr = (day: Date, comps: MealComponent[]) => {
      const t = { calories: 0, sodium: 0, saturatedFat: 0 };
      const dk = dateKey(day);
      comps.forEach((comp) => {
        const nm = menu[`${dk}-${comp.key}`];
        if (!nm) return;
        const r =
          comp.cat === "Milk"
            ? MILK_ITEM
            : recipes.find((x) => x.name === nm);
        if (r) {
          t.calories += r.nutrition.calories;
          t.sodium += r.nutrition.sodium;
          t.saturatedFat += r.nutrition.saturatedFat;
        }
      });
      return t;
    };

    const getDayTot = (d: Date) => {
      const b = getNutr(d, BK_COMPS);
      const l = getNutr(d, LN_COMPS);
      return {
        calories: b.calories + l.calories,
        sodium: b.sodium + l.sodium,
        saturatedFat: b.saturatedFat + l.saturatedFat,
      };
    };

    /* ── Inline style constants ── */
    const thStyle: React.CSSProperties = {
      padding: "6px 8px",
      textAlign: "center",
      fontWeight: 700,
      fontSize: 11,
      fontFamily: font.header,
      color: "#fff",
      backgroundColor: C.blue,
      borderRight: "1px solid rgba(255,255,255,0.3)",
    };

    const cellStyle: React.CSSProperties = {
      padding: "4px 6px",
      fontSize: 10,
      fontFamily: font.body,
      borderBottom: "1px solid #ddd",
      borderRight: "1px solid #eee",
      textAlign: "center",
      verticalAlign: "middle",
    };

    const labelCellStyle: React.CSSProperties = {
      ...cellStyle,
      textAlign: "left",
      fontWeight: 600,
      fontSize: 10,
      backgroundColor: "#f8f9fa",
      whiteSpace: "nowrap",
    };

    /* ── Meal section renderer ── */
    const MealSection = ({
      label,
      comps,
    }: {
      label: string;
      comps: MealComponent[];
    }) => (
      <>
        {/* Meal header */}
        <tr>
          <td
            colSpan={weekDays.length + 1}
            style={{
              padding: "6px 8px",
              fontWeight: 800,
              fontSize: 12,
              fontFamily: font.header,
              color: "#fff",
              backgroundColor: C.green,
            }}
          >
            {label}
          </td>
        </tr>
        {/* Component rows */}
        {comps.map((comp) => (
          <tr key={comp.key}>
            <td style={labelCellStyle}>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: comp.color,
                  marginRight: 6,
                  verticalAlign: "middle",
                }}
              />
              {comp.label}
            </td>
            {weekDays.map((day) => (
              <td key={dateKey(day)} style={cellStyle}>
                {getSlotName(day, comp.key)}
              </td>
            ))}
          </tr>
        ))}
        {/* Meal subtotal */}
        <tr>
          <td
            style={{
              ...labelCellStyle,
              backgroundColor: `${C.green}15`,
              fontWeight: 700,
              fontStyle: "italic",
              color: C.green,
            }}
          >
            {label} Totals
          </td>
          {weekDays.map((day) => {
            const n = getNutr(day, comps);
            return (
              <td
                key={dateKey(day)}
                style={{
                  ...cellStyle,
                  backgroundColor: `${C.green}08`,
                  fontSize: 9,
                }}
              >
                {n.calories > 0
                  ? `${n.calories} cal / ${n.sodium}mg Na`
                  : "\u2014"}
              </td>
            );
          })}
        </tr>
      </>
    );

    return (
      <div
        ref={ref}
        style={{
          fontFamily: font.body,
          color: "#222",
          backgroundColor: "#fff",
          maxWidth: 1050,
          padding: 0,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 16,
            borderBottom: `3px solid ${C.green}`,
            paddingBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              fontFamily: font.header,
              color: C.slate,
            }}
          >
            School Nutrition Program
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.blue,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            Weekly Menu &mdash; Week of{" "}
            {format(weekStart, "MMMM d, yyyy")}
          </div>
        </div>

        {/* ── Menu table ── */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: "left", width: 130 }}>
                Component
              </th>
              {weekDays.map((day) => (
                <th key={dateKey(day)} style={thStyle}>
                  <div>{format(day, "EEEE")}</div>
                  <div
                    style={{ fontWeight: 400, fontSize: 10, opacity: 0.85 }}
                  >
                    {format(day, "MMM d")}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <MealSection label="Breakfast" comps={BK_COMPS} />
            <MealSection label="Lunch" comps={LN_COMPS} />

            {/* ── Daily totals ── */}
            <tr>
              <td
                style={{
                  padding: "8px",
                  fontWeight: 900,
                  fontSize: 11,
                  fontFamily: font.header,
                  color: "#fff",
                  backgroundColor: C.slate,
                }}
              >
                Daily Total
              </td>
              {weekDays.map((day) => {
                const t = getDayTot(day);
                return (
                  <td
                    key={dateKey(day)}
                    style={{
                      padding: "6px",
                      textAlign: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: font.body,
                      backgroundColor: `${C.slate}10`,
                      borderRight: "1px solid #eee",
                    }}
                  >
                    {t.calories > 0 ? (
                      <>
                        <div style={{ color: C.green }}>
                          {t.calories} cal
                        </div>
                        <div style={{ color: "#666", fontSize: 9 }}>
                          Na: {t.sodium}mg
                        </div>
                        <div style={{ color: "#666", fontSize: 9 }}>
                          SF: {t.saturatedFat.toFixed(1)}g
                        </div>
                      </>
                    ) : (
                      "\u2014"
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 8,
            borderTop: "1px solid #ddd",
            fontSize: 10,
            color: "#999",
            textAlign: "center",
          }}
        >
          Generated by SproutCNP — School Nutrition & Compliance Tool
        </div>
      </div>
    );
  },
);
