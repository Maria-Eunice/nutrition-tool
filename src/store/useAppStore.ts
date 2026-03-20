// Supabase is the source of truth for recipes. Call fetchRecipes() on app mount.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_RECIPES } from "../data/recipes";
import type { Recipe, MenuMap } from "../types";
import { supabase } from "../lib/supabase/client";
import { dbRowToRecipe, recipeToDbInsert } from "../lib/supabase/mappers";
import type { DbRecipeRow } from "../lib/supabase/mappers";

interface AppState {
  // Server-backed state
  recipes: Recipe[];
  loading: boolean;
  error: string | null;

  // Local / persisted
  menu: MenuMap;
  darkMode: boolean;

  // UI (not persisted)
  viewRecipe: Recipe | null;
  sidebarOpen: boolean;

  // Async actions
  fetchRecipes: () => Promise<void>;
  fetchMenu: () => Promise<void>;
  syncPreferences: () => Promise<void>;

  // Recipe CRUD
  addRecipe: (recipe: Recipe) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  importRecipes: (recipes: Recipe[]) => Promise<void>;

  // Menu
  setMenuSlot: (key: string, value: string) => void;

  // UI actions
  setViewRecipe: (recipe: Recipe | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  resetAll: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      recipes: [],
      loading: false,
      error: null,
      menu: {},
      darkMode: false,
      viewRecipe: null,
      sidebarOpen: false,

      fetchRecipes: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .order("name");

          if (error) throw error;

          const recipes = (data as DbRecipeRow[]).map(dbRowToRecipe);
          set({ recipes, loading: false });
        } catch (err) {
          // Fall back to INITIAL_RECIPES so the app remains functional offline / before DB is set up.
          const existing = get().recipes;
          set({
            recipes: existing.length > 0 ? existing : INITIAL_RECIPES,
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      },

      fetchMenu: async () => {
        // Menu sync is a future enhancement — no-op for now.
      },

      syncPreferences: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          await supabase.from("user_preferences").upsert(
            { user_id: user.id, dark_mode: get().darkMode },
            { onConflict: "user_id" }
          );
        } catch {
          // Silently ignore — auth may not be configured yet.
        }
      },

      addRecipe: async (recipe) => {
        set({ error: null });
        try {
          const { data, error } = await supabase
            .from("recipes")
            .insert(recipeToDbInsert(recipe))
            .select()
            .single();

          if (error) throw error;

          const newRecipe = dbRowToRecipe(data as DbRecipeRow);
          set((s) => ({ recipes: [...s.recipes, newRecipe] }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : String(err) });
        }
      },

      updateRecipe: async (recipe) => {
        set({ error: null });
        try {
          const { error } = await supabase
            .from("recipes")
            .update(recipeToDbInsert(recipe))
            .eq("id", recipe.id);

          if (error) throw error;

          set((s) => ({
            recipes: s.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : String(err) });
        }
      },

      deleteRecipe: async (id) => {
        set({ error: null });
        try {
          const { error } = await supabase
            .from("recipes")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set((s) => {
            const deleted = s.recipes.find((r) => r.id === id);
            return {
              recipes: s.recipes.filter((r) => r.id !== id),
              menu: deleted
                ? Object.fromEntries(
                    Object.entries(s.menu).filter(([, name]) => name !== deleted.name)
                  )
                : s.menu,
            };
          });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : String(err) });
        }
      },

      importRecipes: async (newRecipes) => {
        set({ error: null });
        try {
          const { data, error } = await supabase
            .from("recipes")
            .insert(newRecipes.map((r) => recipeToDbInsert(r)))
            .select();

          if (error) throw error;

          const imported = (data as DbRecipeRow[]).map(dbRowToRecipe);
          set((s) => ({ recipes: [...s.recipes, ...imported] }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : String(err) });
        }
      },

      resetAll: async () => {
        set({ menu: {} });
        await get().fetchRecipes();
      },

      setMenuSlot: (key, value) => {
        set((s) => ({ menu: { ...s.menu, [key]: value } }));
        // Best-effort sync to Supabase menu_plans table (silently ignore errors).
        void Promise.resolve(
          supabase
            .from("menu_plans")
            .upsert({ slot_key: key, recipe_name: value }, { onConflict: "slot_key" })
        ).catch(() => {/* silent */});
      },

      setViewRecipe: (recipe) => set({ viewRecipe: recipe }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: "sproutcnp-store",
      partialize: (state) => ({
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
