import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { font, surface, text, border } from "./data/brand";
import { useAppStore } from "./store/useAppStore";
import { downloadBlob } from "./utils/csv";
import { HeaderBar } from "./components/layout/HeaderBar";
import { AppSidebar } from "./components/layout/AppSidebar";
import { RecipeDetailDialog } from "./components/RecipeDetailDialog";
import { RecipeBookView } from "./views/RecipeBookView";
import { RecipeBuilderView } from "./views/RecipeBuilderView";
import { MealPatternView } from "./views/MealPatternView";
import { MenuPlannerView } from "./views/MenuPlannerView";
import { ReportsView } from "./views/ReportsView";
import { HelpView } from "./views/HelpView";

export default function App() {
  const resetAll = useAppStore((s) => s.resetAll);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const darkMode = useAppStore((s) => s.darkMode);
  const recipes = useAppStore((s) => s.recipes);
  const menu = useAppStore((s) => s.menu);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSaveFile = () => {
    const data = JSON.stringify({ recipes, menu }, null, 2);
    downloadBlob(new Blob([data], { type: "application/json" }), "sproutcnp-data.json");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: surface.page, fontFamily: font.body }}>
      <HeaderBar onReset={resetAll} onPrint={() => window.print()} onSave={handleSaveFile} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay — closes sidebar when tapping outside */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ backgroundColor: "var(--overlay)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AppSidebar />

        <main className="flex-1 overflow-auto">
          {/* Mobile hamburger bar */}
          <div
            className="lg:hidden p-3 border-b sticky top-0 z-20"
            style={{ backgroundColor: surface.card, borderColor: border.default }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg"
              style={{ color: text.primary }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
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
              <Route path="/help" element={<HelpView />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Recipe detail modal — reads viewRecipe from the store directly */}
      <RecipeDetailDialog />
    </div>
  );
}
