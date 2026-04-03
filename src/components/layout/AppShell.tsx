"use client";
// AppShell: client wrapper that replicates the original App.tsx layout shell.
// Handles dark mode sync, fetchRecipes on mount, sidebar overlay, and modal.
import { useEffect } from "react";
import { font, surface, border, text } from "../../data/brand";
import { useAppStore } from "../../store/useAppStore";
import { HeaderBar } from "./HeaderBar";
import { AppSidebar } from "./AppSidebar";
import { RecipeDetailDialog } from "../RecipeDetailDialog";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const fetchRecipes   = useAppStore((s) => s.fetchRecipes);
  const darkMode       = useAppStore((s) => s.darkMode);
  const sidebarOpen    = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  // Fetch recipes from Supabase on first mount.
  useEffect(() => { fetchRecipes(); }, []);

  // Sync dark mode class on <html>.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: surface.page, fontFamily: font.body }}
    >
      <HeaderBar />

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
            {children}
          </div>
        </main>
      </div>

      {/* Recipe detail modal — reads viewRecipe from the store directly */}
      <RecipeDetailDialog />
    </div>
  );
};
