// Browser-side Supabase client — safe to use in React components and hooks.
// If env vars are missing the client is created with placeholder values and
// all queries will fail gracefully (fetchRecipes falls back to INITIAL_RECIPES).
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL  as string
  || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  || "placeholder-key";

if (
  supabaseUrl === "https://placeholder.supabase.co" ||
  supabaseKey === "placeholder-key"
) {
  console.warn(
    "[SproutCNP] Supabase env vars not set — running in offline/demo mode. " +
    "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your " +
    "Vercel project settings (or .env.local for local dev)."
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
