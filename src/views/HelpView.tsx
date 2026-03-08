import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  HelpCircle, BookOpen, ChefHat, CheckCircle, CalendarDays,
  BarChart3, ChevronDown, Printer, Leaf, Search, ArrowUpDown,
  Upload, Download, PlusCircle, Eye, Pencil, Trash2,
  ToggleLeft, FileText, Info,
} from "lucide-react";
import { C, font, text, border, surface } from "../data/brand";
import { Btn } from "../components/ui/Btn";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

/* ── Small content-building primitives ─────────────────────────────────── */

/** Green left-border callout for tips and important notes. */
const Tip = ({ children }: { children: React.ReactNode }) => (
  <div
    className="flex gap-2.5 p-3 rounded-lg mt-3 mb-1"
    style={{ backgroundColor: `${C.green}14`, borderLeft: `3px solid ${C.green}` }}
  >
    <Info size={15} color={C.green} className="flex-shrink-0 mt-0.5" />
    <span className="text-sm leading-relaxed" style={{ color: text.primary, fontFamily: font.body }}>
      {children}
    </span>
  </div>
);

/** Numbered step row. */
const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div className="flex gap-3 py-1.5">
    <span
      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
      style={{ backgroundColor: C.green }}
    >
      {n}
    </span>
    <span className="text-sm leading-relaxed" style={{ color: text.primary, fontFamily: font.body }}>
      {children}
    </span>
  </div>
);

/** Inline UI-element label — renders like a soft badge. */
const UI = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold mx-0.5"
    style={{ backgroundColor: `${C.slate}12`, color: C.slate, fontFamily: font.body }}
  >
    {children}
  </span>
);

/** USDA compliance value badge. */
const Limit = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block px-2 py-0.5 rounded-full text-xs font-bold"
    style={{ backgroundColor: `${C.green}18`, color: C.green, fontFamily: font.body }}
  >
    {children}
  </span>
);

/** A prose paragraph inside an accordion section. */
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed mb-2" style={{ color: text.primary, fontFamily: font.body }}>
    {children}
  </p>
);

/** Section sub-heading. */
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3
    className="font-bold text-sm mt-4 mb-2"
    style={{ fontFamily: font.header, color: text.primary }}
  >
    {children}
  </h3>
);

/* ── Accordion item definition ─────────────────────────────────────────── */

interface AccordionSection {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string; fill?: string }>;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

/* ── Accordion item component ───────────────────────────────────────────── */

const AccordionItem = ({
  section,
  isOpen,
  onToggle,
}: {
  section: AccordionSection;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { icon: Icon, title, badge, content } = section;
  return (
    <Card className="overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:opacity-90"
        style={{
          backgroundColor: isOpen ? `${C.green}10` : surface.card,
          borderBottom: isOpen ? `1px solid ${C.green}25` : "none",
        }}
      >
        <span
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: isOpen ? C.green : `${C.green}18` }}
        >
          <Icon size={16} color={isOpen ? "#fff" : C.green} />
        </span>
        <span className="flex-1 font-bold text-sm" style={{ fontFamily: font.header, color: text.primary }}>
          {title}
        </span>
        {badge && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block"
            style={{ backgroundColor: `${C.blue}15`, color: C.blue, fontFamily: font.body }}
          >
            {badge}
          </span>
        )}
        <ChevronDown
          size={18}
          color={text.secondary}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Content — toggled via class for print override */}
      <div
        className={`help-section-content ${isOpen ? "" : "hidden"}`}
        aria-hidden={!isOpen}
      >
        <div className="px-5 py-4">{content}</div>
      </div>
    </Card>
  );
};

/* ── Section content definitions ───────────────────────────────────────── */

const SECTIONS: AccordionSection[] = [
  /* ── 1. Overview ─────────────────────────────────────────────────────── */
  {
    id: "overview",
    icon: Leaf,
    title: "Overview — What is SproutCNP?",
    badge: "Start here",
    content: (
      <div>
        <P>
          <strong>SproutCNP</strong> is a browser-based school nutrition compliance and menu management
          tool designed for National School Lunch Program (NSLP) and School Breakfast Program (SBP)
          operators. It helps you build a recipe library, verify USDA meal pattern requirements,
          plan weekly menus, and review weekly nutrition averages — all in one place.
        </P>

        <H3>The five views</H3>
        <div className="space-y-2 mb-3">
          {[
            { icon: BookOpen, label: "Recipe Book", desc: "Your full recipe library — browse, search, import, and manage recipes." },
            { icon: ChefHat, label: "Recipe Builder", desc: "Create or edit a recipe with full FDA nutrition data and an ingredient list." },
            { icon: CheckCircle, label: "Meal Pattern Checker", desc: "Test any combination of recipes against USDA calorie, sodium, and component requirements." },
            { icon: CalendarDays, label: "Menu Planner", desc: "Assign recipes to breakfast and lunch slots for each weekday and navigate between weeks." },
            { icon: BarChart3, label: "Reports", desc: "See per-day and weekly-average nutrition totals charted against USDA limits." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: surface.page }}>
              <Icon size={16} color={C.green} className="flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold" style={{ fontFamily: font.header, color: text.primary }}>{label} </span>
                <span className="text-sm" style={{ fontFamily: font.body, color: text.secondary }}>— {desc}</span>
              </div>
            </div>
          ))}
        </div>

        <H3>Data storage</H3>
        <P>
          All data (recipes, menu assignments, and preferences) is saved automatically to your
          browser's local storage — no account or internet connection required. Use the{" "}
          <UI><Download size={11} /> Save to File</UI> button in the header to export a JSON
          backup at any time.
        </P>
        <Tip>
          Data lives in your browser. Clearing browser storage will erase your recipes and menus.
          Export a backup regularly with <strong>Save to File</strong>.
        </Tip>
      </div>
    ),
  },

  /* ── 2. Recipe Book ───────────────────────────────────────────────────── */
  {
    id: "recipe-book",
    icon: BookOpen,
    title: "Recipe Book",
    badge: "Library",
    content: (
      <div>
        <P>
          The Recipe Book is your central recipe library. It opens by default when you launch the
          app and shows all recipes in your collection. The count in the toolbar reflects the total
          number of recipes currently saved.
        </P>

        <H3>Switching between Grid and Table views</H3>
        <P>
          Use the <UI><ToggleLeft size={11} /> Grid / Table</UI> toggle in the toolbar to switch
          display modes:
        </P>
        <div className="space-y-1.5 mb-2">
          <div className="flex gap-2 text-sm" style={{ color: text.primary, fontFamily: font.body }}>
            <span className="font-semibold w-14 flex-shrink-0">Grid</span>
            <span>Cards showing recipe name, category badge, yield, calories, and sodium at a glance. Best for browsing.</span>
          </div>
          <div className="flex gap-2 text-sm" style={{ color: text.primary, fontFamily: font.body }}>
            <span className="font-semibold w-14 flex-shrink-0">Table</span>
            <span>Dense row layout with sortable columns, per-column filters, and pagination. Best for managing a large collection.</span>
          </div>
        </div>

        <H3><Search size={13} style={{ display: "inline", marginRight: 4 }} />Searching and filtering</H3>
        <Step n={1}>Type in the <UI><Search size={11} /> Search recipes…</UI> box to filter by recipe name in real time. The filter is case-insensitive and matches partial names.</Step>
        <Step n={2}>In <strong>Table view</strong>, each column header also has its own filter input below the header row — type there to narrow by name or category independently.</Step>

        <H3><ArrowUpDown size={13} style={{ display: "inline", marginRight: 4 }} />Sorting (Table view only)</H3>
        <Step n={1}>Click any column header (<strong>Recipe Name</strong>, <strong>Category</strong>, <strong>Yield</strong>, <strong>Cal/srv</strong>, <strong>Na mg</strong>) to sort ascending.</Step>
        <Step n={2}>Click the same header again to reverse the sort (descending).</Step>
        <Step n={3}>A third click clears the sort. An arrow icon in the header indicates active sort direction.</Step>
        <Step n={4}>Use the <UI>← Prev</UI> / <UI>Next →</UI> buttons at the bottom to navigate pages (10 recipes per page).</Step>

        <H3><Eye size={13} style={{ display: "inline", marginRight: 4 }} />Viewing a recipe</H3>
        <P>Click any recipe card (Grid) or row (Table) to open a detail dialog showing the full ingredient list and an FDA-style nutrition facts label. From there you can also <UI><Pencil size={11} /> Edit</UI> or <UI><Printer size={11} /> Print Label</UI> the recipe.</P>

        <H3>Adding and editing recipes</H3>
        <Step n={1}>Click <UI><PlusCircle size={11} /> New Recipe</UI> to open a quick-add form.</Step>
        <Step n={2}>For the full editor with ingredient management and a live nutrition preview, click <strong>New Recipe</strong> and then choose <strong>Open in Builder</strong>, or navigate to the <strong>Recipe Builder</strong> view directly.</Step>
        <Step n={3}>To edit an existing recipe, click the <UI><Pencil size={11} /></UI> icon on its card or choose <strong>Edit Recipe</strong> from the detail dialog.</Step>

        <H3><Trash2 size={13} style={{ display: "inline", marginRight: 4 }} />Deleting a recipe</H3>
        <P>Click the <UI><Trash2 size={11} /></UI> icon on a recipe card. A confirmation dialog will list any menu slots that reference the recipe so you know what will be affected before confirming.</P>

        <H3><Upload size={13} style={{ display: "inline", marginRight: 4 }} />Importing recipes from CSV</H3>
        <Step n={1}>Click <UI><Download size={11} /> CSV Template</UI> to download a spreadsheet template with the correct column headers.</Step>
        <Step n={2}>Fill in the template in Excel or Google Sheets. Each row is one recipe. Required columns: <code>name</code>, <code>category</code>, <code>yield</code>, <code>servingSize</code>, plus all 15 nutrition columns.</Step>
        <Step n={3}>Save your file as <code>.csv</code> (comma-separated).</Step>
        <Step n={4}>Click <UI><Upload size={11} /> Import CSV</UI> and select your file. Valid recipes are added to the collection immediately. Any row errors are shown in a warning panel below the toolbar.</Step>
        <Tip>Importing adds to your existing collection — it does not replace it. Duplicate names will appear as separate entries.</Tip>
      </div>
    ),
  },

  /* ── 3. Recipe Builder ────────────────────────────────────────────────── */
  {
    id: "recipe-builder",
    icon: ChefHat,
    title: "Recipe Builder",
    badge: "Create & edit",
    content: (
      <div>
        <P>
          The Recipe Builder is the full-featured recipe editor. It validates every field before
          saving and shows a live FDA nutrition facts label so you can review the data as you type.
        </P>

        <H3>Creating a new recipe</H3>
        <Step n={1}>Navigate to <UI><ChefHat size={11} /> Recipe Builder</UI> in the sidebar.</Step>
        <Step n={2}>Fill in the <strong>Recipe Name</strong> (minimum 3 characters), <strong>Category</strong>, <strong>Yield</strong> (number of servings), and <strong>Serving Size</strong> (descriptive text, e.g. "1 cup (240g)").</Step>
        <Step n={3}>Add ingredients using the <UI><PlusCircle size={11} /> Add Ingredient</UI> button. Each row needs a name, quantity, and unit.</Step>
        <Step n={4}>Fill in all 15 nutrition fields (per serving). Use the <UI>Lookup</UI> buttons to auto-fill common ingredient values as a starting point.</Step>
        <Step n={5}>Click <UI><FileText size={11} /> Save Recipe</UI>. The recipe is added to your collection immediately.</Step>

        <H3>Editing an existing recipe</H3>
        <P>
          Open a recipe from the Recipe Book (detail dialog → <UI><Pencil size={11} /> Edit Recipe</UI>),
          or navigate directly to <code>/builder/:id</code>. The form pre-fills with the recipe's
          current values. Changes are saved to the same recipe when you click <UI>Save Recipe</UI>.
        </P>

        <H3>Form validation</H3>
        <P>
          All fields are validated when you click <UI>Save Recipe</UI>. Any field that fails shows
          a <strong style={{ color: "#dc2626" }}>red outline</strong> and an error message directly
          below it. Fix every flagged field and click Save again — the form will not save until all
          rules pass.
        </P>

        <div className="space-y-3 my-3">
          {/* Recipe Name */}
          <div className="p-3 rounded-lg" style={{ border: `1px solid ${border.default}`, backgroundColor: surface.page }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ fontFamily: font.header, color: text.primary }}>Recipe Name</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                "Name must be at least 3 characters"
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: text.secondary, fontFamily: font.body }}>
              The name must be <strong>3 or more characters</strong>. One- or two-character entries
              (e.g. "AB") are rejected as likely typos. Single-word names like "Rice" (4 chars) are
              fine. Spaces count toward the length.
            </p>
          </div>

          {/* Calories */}
          <div className="p-3 rounded-lg" style={{ border: `1px solid ${border.default}`, backgroundColor: surface.page }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ fontFamily: font.header, color: text.primary }}>Calories</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                "Calories must be a positive number"
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: text.secondary, fontFamily: font.body }}>
              Calories must be <strong>greater than zero</strong>. The field rejects 0 because a
              zero-calorie entry almost always means the value was not entered yet. If a recipe
              genuinely provides negligible calories, enter <code>1</code> as a placeholder.
              Negative numbers are never allowed.
            </p>
          </div>

          {/* Yield */}
          <div className="p-3 rounded-lg" style={{ border: `1px solid ${border.default}`, backgroundColor: surface.page }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ fontFamily: font.header, color: text.primary }}>Yield</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                "Yield must be greater than zero"
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: text.secondary, fontFamily: font.body }}>
              Yield is the number of servings the batch produces. It must be a{" "}
              <strong>positive whole or decimal number</strong> (e.g. 50, 25.5). Zero is not valid
              because it would mean the recipe produces no servings.
            </p>
          </div>

          {/* Serving Size */}
          <div className="p-3 rounded-lg" style={{ border: `1px solid ${border.default}`, backgroundColor: surface.page }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ fontFamily: font.header, color: text.primary }}>Serving Size</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                "Serving size is required"
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: text.secondary, fontFamily: font.body }}>
              This is a free-text description (e.g. <code>1 cup (240g)</code> or{" "}
              <code>3 pieces (85g)</code>). It appears on the nutrition label and in the Recipe
              Book. It cannot be left blank.
            </p>
          </div>

          {/* Ingredients */}
          <div className="p-3 rounded-lg" style={{ border: `1px solid ${border.default}`, backgroundColor: surface.page }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ fontFamily: font.header, color: text.primary }}>Ingredients</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                "At least one ingredient is required"
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: text.secondary, fontFamily: font.body }}>
              The ingredients list must contain <strong>at least one row</strong>. Add a row with
              the <UI><PlusCircle size={10} /> Add Ingredient</UI> button and fill in the name,
              quantity, and unit before saving.
            </p>
          </div>

          {/* Other nutrition */}
          <div className="p-3 rounded-lg" style={{ border: `1px solid ${border.default}`, backgroundColor: surface.page }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ fontFamily: font.header, color: text.primary }}>All other nutrition fields</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "#fef2f2", color: "#dc2626" }}>
                red outline, no message
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: text.secondary, fontFamily: font.body }}>
              Total Fat, Saturated Fat, Trans Fat, Cholesterol, Sodium, Total Carbs, Fiber, Sugars,
              Protein, Vitamin D, Calcium, Iron, and Potassium must all be{" "}
              <strong>0 or greater</strong>. Entering a negative number (e.g. <code>-5</code>)
              will flag the field. A value of <code>0</code> is valid for these fields — use it
              when a nutrient is truly absent.
            </p>
          </div>
        </div>

        <Tip>All nutrition values are entered <strong>per serving</strong>, not per batch. Divide the total batch nutrition value by the yield count to get each per-serving figure.</Tip>

        <H3>Live nutrition label</H3>
        <P>
          The right column shows an FDA-style nutrition facts label that updates as you type. Use it
          to spot data-entry errors before saving. The label matches what students see on printed
          CN labels.
        </P>

        <H3>Printing a nutrition facts label</H3>
        <Step n={1}>Save the recipe first.</Step>
        <Step n={2}>Open the recipe from the Recipe Book and click <UI><Printer size={11} /> Print Label</UI> in the detail dialog.</Step>
        <Step n={3}>Your browser's print dialog opens with a formatted, print-ready FDA nutrition label.</Step>
      </div>
    ),
  },

  /* ── 4. Meal Pattern Checker ──────────────────────────────────────────── */
  {
    id: "meal-pattern",
    icon: CheckCircle,
    title: "Meal Pattern Checker",
    badge: "USDA compliance",
    content: (
      <div>
        <P>
          The Meal Pattern Checker lets you test any combination of recipes against USDA NSLP
          requirements before committing it to the weekly menu. Select one recipe per meal
          component and the checker instantly evaluates 8 compliance criteria.
        </P>

        <H3>USDA requirements by grade group</H3>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: `${C.green}12` }}>
                {["Requirement", "K–5", "6–8", "9–12"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold" style={{ fontFamily: font.header, color: text.primary, border: `1px solid ${border.default}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Calories", "550–650 kcal", "600–700 kcal", "750–850 kcal"],
                ["Sodium ceiling", "≤ 1,230 mg", "≤ 1,360 mg", "≤ 1,420 mg"],
                ["Saturated fat", "< 10% of cal", "< 10% of cal", "< 10% of cal"],
                ["Grain", "1 oz eq", "1 oz eq", "2 oz eq"],
                ["Meat / Meat Alt.", "1 oz eq", "1 oz eq", "2 oz eq"],
                ["Vegetable", "¾ cup", "¾ cup", "1 cup"],
                ["Fruit", "½ cup", "½ cup", "1 cup"],
                ["Milk", "1 cup", "1 cup", "1 cup"],
              ].map(([req, ...vals], i) => (
                <tr key={req} style={{ backgroundColor: i % 2 === 0 ? "transparent" : `${C.slate}05` }}>
                  <td className="px-3 py-1.5 font-semibold" style={{ fontFamily: font.body, color: text.primary, border: `1px solid ${border.default}` }}>{req}</td>
                  {vals.map((v, j) => (
                    <td key={j} className="px-3 py-1.5 text-center" style={{ fontFamily: font.body, color: text.secondary, border: `1px solid ${border.default}` }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H3>Using the checker</H3>
        <Step n={1}>Select your <strong>Grade Group</strong> (K–5, 6–8, or 9–12) at the top. The calorie and sodium targets update immediately.</Step>
        <Step n={2}>Use the <strong>Entrée</strong> dropdown to choose a recipe from the Entrée category.</Step>
        <Step n={3}>Choose a <strong>Grain</strong>, <strong>Vegetable</strong>, and <strong>Fruit</strong> from their respective dropdowns.</Step>
        <Step n={4}>Milk defaults to <strong>1% Low-Fat Milk</strong> (the NSLP standard). Leave it as-is unless you are modelling a different milk option from your recipe library.</Step>
        <Step n={5}>Review the <strong>Compliance Panel</strong> on the right. Each of the 8 checks shows a green ✓ or a red ✗ with the current value.</Step>
        <Step n={6}>When all 8 checks pass, the green <Limit>COMPLIANT</Limit> banner appears.</Step>

        <H3>Compliance checks explained</H3>
        <div className="space-y-1 mt-1">
          {[
            ["Meat/Meat Alt", "Entrée dropdown has a selection (presence check only)"],
            ["Grain", "Grain dropdown has a selection"],
            ["Fruit", "Fruit dropdown has a selection"],
            ["Vegetable", "Vegetable dropdown has a selection"],
            ["Milk", "Milk selection is present"],
            ["Calories", "Total calories fall within the grade group's min–max range"],
            ["Sodium", "Total sodium is at or below the grade group's ceiling"],
            ["Sat. Fat < 10%", "Saturated fat provides less than 10% of total calories"],
          ].map(([check, rule]) => (
            <div key={check} className="flex gap-2 text-sm" style={{ fontFamily: font.body, color: text.primary }}>
              <CheckCircle size={13} color={C.green} className="flex-shrink-0 mt-0.5" />
              <span><strong>{check}:</strong> {rule}</span>
            </div>
          ))}
        </div>
        <Tip>Use the Meal Pattern Checker to pre-validate recipe combinations before building your weekly menu. This saves time catching issues before they appear in the planner.</Tip>
      </div>
    ),
  },

  /* ── 5. Menu Planner ──────────────────────────────────────────────────── */
  {
    id: "menu-planner",
    icon: CalendarDays,
    title: "Menu Planner",
    badge: "Weekly planning",
    content: (
      <div>
        <P>
          The Menu Planner is a weekly grid showing Monday through Friday as columns and every
          breakfast and lunch component as rows. Assign a recipe to any slot using the dropdown,
          and daily nutrition totals update instantly.
        </P>

        <H3>Navigating between weeks</H3>
        <Step n={1}>Use the <UI>←</UI> arrow button to go back one week, and the <UI>→</UI> arrow button to go forward one week.</Step>
        <Step n={2}>Click <UI>Today</UI> to jump back to the current calendar week at any time.</Step>
        <Step n={3}>The header shows the date range of the currently displayed week (e.g. "Mar 3 – Mar 7, 2026").</Step>
        <Tip>Each calendar week is stored independently. You can plan multiple weeks in advance and return to any week later — your assignments are saved automatically.</Tip>

        <H3>Assigning recipes to slots</H3>
        <Step n={1}>Locate the component row you want to fill (e.g. <strong>Lunch — Entrée</strong>).</Step>
        <Step n={2}>Click the dropdown in the column for the desired day.</Step>
        <Step n={3}>The dropdown lists only recipes in the matching category (Entrée dropdowns show Entrée recipes, Grain dropdowns show Grain and WG Rich recipes, etc.).</Step>
        <Step n={4}>Select a recipe. The daily nutrition totals at the bottom of each column update immediately.</Step>
        <Step n={5}>To clear a slot, open its dropdown and choose the blank option at the top.</Step>

        <H3>Meal components</H3>
        <div className="grid sm:grid-cols-2 gap-2 my-2">
          {[
            { meal: "☀️ Breakfast", comps: ["Whole Grain Rich (WG Rich)", "Protein", "Fruit", "Milk"] },
            { meal: "🥗 Lunch", comps: ["Entrée", "Grain", "Vegetable", "Fruit", "Milk"] },
          ].map(({ meal, comps }) => (
            <div key={meal} className="p-3 rounded-lg" style={{ backgroundColor: surface.page, border: `1px solid ${border.default}` }}>
              <div className="font-bold text-sm mb-1.5" style={{ fontFamily: font.header, color: text.primary }}>{meal}</div>
              {comps.map(c => (
                <div key={c} className="text-xs py-0.5" style={{ color: text.secondary, fontFamily: font.body }}>• {c}</div>
              ))}
            </div>
          ))}
        </div>

        <H3>Daily nutrition totals</H3>
        <P>
          Below each day's column, the planner shows the combined <strong>Calories</strong>,{" "}
          <strong>Sodium (mg)</strong>, and <strong>Saturated Fat (g)</strong> for all assigned
          recipes that day (breakfast + lunch combined). These update in real time as you make or
          change selections.
        </P>

        <H3>Printing the weekly menu</H3>
        <Step n={1}>Click the <UI><Printer size={11} /> Print Menu</UI> button in the planner toolbar.</Step>
        <Step n={2}>A print-optimised weekly menu layout opens. It includes the week dates, all assigned recipes organised by meal and day, and the SproutCNP branding.</Step>
        <Step n={3}>Use your browser's print dialog to send it to a printer or save as PDF.</Step>
        <Tip>Print the weekly menu to post in your kitchen or share with staff before the week begins.</Tip>
      </div>
    ),
  },

  /* ── 6. Reports ───────────────────────────────────────────────────────── */
  {
    id: "reports",
    icon: BarChart3,
    title: "Reports",
    badge: "Analytics",
    content: (
      <div>
        <P>
          The Reports view provides a nutritional summary of your current week's planned menus.
          It aggregates data from the Menu Planner and compares daily and weekly averages
          against USDA limits.
        </P>

        <H3>Summary stat cards</H3>
        <P>Three cards appear at the top of the page:</P>
        <div className="space-y-2 mb-3">
          {[
            { label: "Avg Daily Calories", target: "USDA: 550–850 kcal", desc: "Average calories across all days that have at least one item planned." },
            { label: "Avg Daily Sodium", target: "USDA: ≤ 1,230 mg", desc: "Average sodium across active days. The limit shown is the K–5 Target 1; actual limits vary by grade group." },
            { label: "Avg Saturated Fat", target: "USDA: < 10% of cal", desc: "Average grams of saturated fat across active days." },
          ].map(({ label, target, desc }) => (
            <div key={label} className="p-3 rounded-lg" style={{ backgroundColor: surface.page }}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold" style={{ fontFamily: font.header, color: text.primary }}>{label}</span>
                <Limit>{target}</Limit>
              </div>
              <p className="text-xs" style={{ color: text.secondary, fontFamily: font.body }}>{desc}</p>
            </div>
          ))}
        </div>
        <P>
          Each card's value indicator turns <strong style={{ color: C.green }}>green</strong> when
          the average is within USDA limits and <strong style={{ color: "#dc2626" }}>red</strong>{" "}
          when it falls outside.
        </P>

        <H3>Bar charts</H3>
        <P>
          Three bar charts display per-day values for <strong>Calories</strong>,{" "}
          <strong>Sodium</strong>, and <strong>Saturated Fat</strong> across Monday through Friday.
          A horizontal dashed reference line marks the USDA limit for each nutrient. Days without
          any planned recipes show a zero bar.
        </P>

        <H3>How averages are calculated</H3>
        <P>
          Only days that have <em>at least one item assigned</em> in the Menu Planner are included
          in average calculations. Days with no assignments are skipped so a partially-planned week
          does not artificially deflate the averages.
        </P>

        <H3>Keeping reports current</H3>
        <P>
          Reports always reflect the <em>current state</em> of the Menu Planner. As you add,
          remove, or change meal assignments in the planner, the Reports view updates immediately
          when you navigate back to it.
        </P>
        <Tip>
          Reports reads from the <strong>current week only</strong> (whatever week is displayed in
          the Menu Planner). Navigate to the desired week in the planner first, then open Reports
          to see that week's summary.
        </Tip>
      </div>
    ),
  },

  /* ── 7. Data management ───────────────────────────────────────────────── */
  {
    id: "data",
    icon: FileText,
    title: "Data Management & Backups",
    badge: "Save & restore",
    content: (
      <div>
        <H3>Saving your data</H3>
        <P>
          SproutCNP automatically saves all changes to your browser's local storage after every
          action. There is no manual save button for the store itself — changes persist across
          page refreshes.
        </P>

        <H3>Exporting a JSON backup</H3>
        <Step n={1}>Click <UI><Download size={11} /> Save to File</UI> in the top header bar.</Step>
        <Step n={2}>A file named <code>sproutcnp-data.json</code> downloads to your computer. It contains your full recipe collection and all menu slot assignments.</Step>
        <Tip>Export a backup before clearing browser data, switching browsers, or sharing data with a colleague.</Tip>

        <H3>Resetting all data</H3>
        <Step n={1}>Click the <UI>↺ Reset All</UI> button in the header.</Step>
        <Step n={2}>Confirm the prompt. This clears your entire menu plan and restores the default recipe collection. <strong>This action cannot be undone.</strong></Step>

        <H3>Dark mode</H3>
        <P>
          SproutCNP supports a dark theme that reduces eye strain in low-light environments and on
          OLED displays.
        </P>
        <Step n={1}>
          Look for the <strong>sun ☀ icon</strong> in the top-right header bar (visible when you
          are in light mode).
        </Step>
        <Step n={2}>
          Click it to switch to dark mode. The entire app — sidebar, cards, tables, dialogs, and
          charts — immediately transitions to a dark colour scheme. The icon changes to a{" "}
          <strong>crescent moon ☾</strong>.
        </Step>
        <Step n={3}>
          Click the moon icon to switch back to light mode at any time.
        </Step>
        <Tip>
          Your dark/light preference is saved automatically and restored the next time you open the
          app. No account or setting page needed — just click the icon once.
        </Tip>
        <P>
          <strong>Printing in dark mode:</strong> If you print a weekly menu or nutrition label
          while in dark mode, the printable layout is always rendered in a light/white background
          regardless of your theme setting. You do not need to switch to light mode before printing.
        </P>

        <H3>Browser compatibility</H3>
        <P>SproutCNP works best in a modern browser (Chrome, Edge, Firefox, or Safari). Local storage must be enabled. Minimum recommended screen width: 1024px for the full sidebar + main layout.</P>
      </div>
    ),
  },
];

/* ── Print stylesheet injected via react-to-print ──────────────────────── */

const PRINT_STYLES = `
  @page { size: letter; margin: 0.65in; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .help-section-content { display: block !important; }
    .no-print { display: none !important; }
  }
`;

/* ── Main HelpView component ────────────────────────────────────────────── */

export const HelpView = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["overview"]));
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "SproutCNP User Guide",
    pageStyle: PRINT_STYLES,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allOpen = openSections.size === SECTIONS.length;

  const toggleAll = () => {
    setOpenSections(allOpen ? new Set() : new Set(SECTIONS.map(s => s.id)));
  };

  return (
    <div>
      <SectionHeader icon={HelpCircle}>User Guide</SectionHeader>

      {/* ── Top action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <p className="text-sm" style={{ fontFamily: font.body, color: text.secondary }}>
          Complete guide to using SproutCNP — {SECTIONS.length} sections
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{
              fontFamily: font.body,
              color: C.green,
              backgroundColor: `${C.green}12`,
              border: `1px solid ${C.green}30`,
            }}
          >
            {allOpen ? "Collapse All" : "Expand All"}
          </button>
          <Btn icon={Printer} variant="primary" onClick={() => handlePrint()}>
            Print User Guide
          </Btn>
        </div>
      </div>

      {/* ── Printable content wrapper ── */}
      <div ref={printRef}>
        {/* Print-only header */}
        <div
          className="hidden"
          style={{ display: "none" }}
        >
          <div
            className="flex items-center gap-3 mb-6 pb-4"
            style={{ borderBottom: `2px solid ${C.green}` }}
          >
            <Leaf size={28} color={C.green} fill={C.green} />
            <div>
              <div className="text-xl font-black" style={{ fontFamily: font.header, color: C.slate }}>
                SproutCNP User Guide
              </div>
              <div className="text-sm" style={{ fontFamily: font.body, color: text.secondary }}>
                School Nutrition &amp; Compliance Tool · Printed {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* ── Accordion list ── */}
        <div className="space-y-3">
          {SECTIONS.map(section => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-8 pt-4 text-center text-xs"
          style={{
            fontFamily: font.body,
            color: text.muted,
            borderTop: `1px solid ${border.default}`,
          }}
        >
          <Leaf size={12} color={C.green} fill={C.green} style={{ display: "inline", marginRight: 4 }} />
          SproutCNP v1.0 · © 2026 SproutCNP · Built for USDA NSLP/SBP compliance
        </div>
      </div>
    </div>
  );
};
