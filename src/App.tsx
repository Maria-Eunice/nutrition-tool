import { useRef } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BookOpen, ChefHat, CheckCircle, CalendarDays, BarChart3, Leaf, Edit, Printer } from "lucide-react";
import { C, font } from "./data/brand";
import { useAppStore } from "./store/useAppStore";
import { HeaderBar } from "./components/layout/HeaderBar";
import { Dialog } from "./components/ui/Dialog";
import { Badge } from "./components/ui/Badge";
import { Btn } from "./components/ui/Btn";
import { NutritionLabel } from "./components/NutritionLabel";
import { PrintableNutritionFacts } from "./components/PrintableNutritionFacts";
import { RecipeBookView } from "./views/RecipeBookView";
import { RecipeBuilderView } from "./views/RecipeBuilderView";
import { MealPatternView } from "./views/MealPatternView";
import { MenuPlannerView } from "./views/MenuPlannerView";
import { ReportsView } from "./views/ReportsView";

const NAV = [
  { to: "/", label: "Recipe Book", Icon: BookOpen },
  { to: "/builder", label: "Recipe Builder", Icon: ChefHat },
  { to: "/checker", label: "Meal Pattern", Icon: CheckCircle },
  { to: "/planner", label: "Menu Planner", Icon: CalendarDays },
  { to: "/reports", label: "Reports", Icon: BarChart3 },
];

export default function App() {
  const navigate = useNavigate();
  const viewRecipe = useAppStore((s) => s.viewRecipe);
  const setViewRecipe = useAppStore((s) => s.setViewRecipe);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const resetAll = useAppStore((s) => s.resetAll);
  const recipes = useAppStore((s) => s.recipes);
  const menu = useAppStore((s) => s.menu);
  const mainRef = useRef<HTMLElement>(null);
  const nutritionPrintRef = useRef<HTMLDivElement>(null);
  const handlePrintLabel = useReactToPrint({
    contentRef: nutritionPrintRef,
    documentTitle: `${viewRecipe?.name || "Recipe"} — Nutrition Facts`,
    pageStyle: `
      @page { size: letter; margin: 0.75in; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  const handlePrint = () => window.print();
  const handleSaveFile = () => {
    const data = JSON.stringify({ recipes, menu }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sproutcnp-data.json"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: "#f8f9fa", fontFamily: font.body }}>
      <HeaderBar onReset={resetAll} onPrint={handlePrint} onSave={handleSaveFile} />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`} style={{ backgroundColor: C.slate }}>
          <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-black tracking-tight" style={{ fontFamily: font.header, fontWeight: 900, color: C.green }}>
                Sprou<span className="relative">t<span className="absolute -top-0.5 -right-0.5" style={{ color: C.green, fontSize: 8 }}>🌿</span></span>
              </span>
              <span className="text-lg font-black tracking-tight" style={{ fontFamily: font.header, fontWeight: 900, color: C.lightBlue }}>CNP</span>
            </div>
            <div className="text-center mt-1 text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: font.body }}>Menu Manager</div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all no-underline"
                style={({ isActive }) => isActive
                  ? { backgroundColor: C.green, color: "#fff", fontFamily: font.body }
                  : { backgroundColor: "transparent", color: "rgba(255,255,255,0.65)", fontFamily: font.body }
                }>
                {({ isActive }) => (
                  <>
                    <Icon size={18} fill={isActive ? "#fff" : "none"} color={isActive ? "#fff" : "rgba(255,255,255,0.5)"} />
                    {label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.yellow }} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf size={14} color={C.green} fill={C.green} />
              <span className="text-xs font-semibold" style={{ color: C.green, fontFamily: font.body }}>USDA Compliant</span>
            </div>
            <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)", fontFamily: font.body }}>v1.0 · © 2026 SproutCNP</div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto" ref={mainRef}>
          <div className="lg:hidden p-3 border-b bg-white sticky top-0 z-20" style={{ borderColor: `${C.slate}12` }}>
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100" style={{ color: C.slate }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<RecipeBookView />} />
              <Route path="/builder" element={<RecipeBuilderView />} />
              <Route path="/builder/:id" element={<RecipeBuilderView />} />
              <Route path="/checker" element={<MealPatternView />} />
              <Route path="/planner" element={<MenuPlannerView />} />
              <Route path="/reports" element={<ReportsView />} />
            </Routes>
          </div>
        </main>
      </div>

      <Dialog open={!!viewRecipe} onClose={() => setViewRecipe(null)} title={viewRecipe?.name || ""}>
        {viewRecipe && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge color={C.blue}>{viewRecipe.category}</Badge>
                <span className="text-sm" style={{ color: `${C.slate}88`, fontFamily: font.body }}>Yield: {viewRecipe.yield} | {viewRecipe.servingSize}</span>
              </div>
              <h4 className="font-bold text-sm mb-2" style={{ fontFamily: font.header, color: C.blue }}>Ingredients</h4>
              <div className="space-y-1">
                {viewRecipe.ingredients.map((ing, i) => (
                  <div key={i} className="text-sm py-1 border-b" style={{ fontFamily: font.body, color: C.slate, borderColor: `${C.slate}10` }}>{ing.qty} {ing.unit} — {ing.name}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Btn variant="outline" icon={Edit} onClick={() => { setViewRecipe(null); navigate(`/builder/${viewRecipe.id}`); }}>Edit Recipe</Btn>
                <Btn variant="ghost" icon={Printer} onClick={() => handlePrintLabel()}>Print Label</Btn>
              </div>
            </div>
            <div>
              <NutritionLabel nutrition={viewRecipe.nutrition} servingSize={viewRecipe.servingSize} />
              <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
                <PrintableNutritionFacts
                  ref={nutritionPrintRef}
                  recipeName={viewRecipe.name}
                  servingSize={viewRecipe.servingSize}
                  nutrition={viewRecipe.nutrition}
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
