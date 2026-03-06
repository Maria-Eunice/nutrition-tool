import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_RECIPES } from "../data/recipes";
import type { Recipe, MenuMap } from "../types";

interface AppState {
  // Persisted
  recipes: Recipe[];
  menu: MenuMap;
  darkMode: boolean;

  // UI (not persisted)
  viewRecipe: Recipe | null;
  sidebarOpen: boolean;

  // Actions
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: number) => void;
  setMenuSlot: (key: string, value: string) => void;
  setViewRecipe: (recipe: Recipe | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  resetAll: () => void;
  importRecipes: (recipes: Recipe[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      recipes: INITIAL_RECIPES,
      menu: {},
      darkMode: false,
      viewRecipe: null,
      sidebarOpen: false,

      addRecipe: (recipe) =>
        set((s) => ({ recipes: [...s.recipes, recipe] })),

      updateRecipe: (recipe) =>
        set((s) => ({ recipes: s.recipes.map((r) => (r.id === recipe.id ? recipe : r)) })),

      deleteRecipe: (id) =>
        set((s) => {
          const deleted = s.recipes.find((r) => r.id === id);
          return {
            recipes: s.recipes.filter((r) => r.id !== id),
            menu: deleted
              ? Object.fromEntries(Object.entries(s.menu).filter(([, name]) => name !== deleted.name))
              : s.menu,
          };
        }),

      setMenuSlot: (key, value) =>
        set((s) => ({ menu: { ...s.menu, [key]: value } })),

      setViewRecipe: (recipe) => set({ viewRecipe: recipe }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      resetAll: () => set({ menu: {}, recipes: INITIAL_RECIPES }),
      importRecipes: (newRecipes) =>
        set((s) => ({ recipes: [...s.recipes, ...newRecipes] })),
    }),
    {
      name: "sproutcnp-store",
      partialize: (state) => ({
        recipes: state.recipes,
        menu: state.menu,
        darkMode: state.darkMode,
      }),
    }
  )
);

export function getMenuSlotsUsingRecipe(menu: MenuMap, recipeName: string) {
  return Object.entries(menu)
    .filter(([, name]) => name === recipeName)
    .map(([key]) => {
      const [day, ...compParts] = key.split("-");
      return { day, component: compParts.join("-") };
    });
}
