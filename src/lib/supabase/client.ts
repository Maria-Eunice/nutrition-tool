// Browser-side Supabase client — safe to use in React components and hooks.
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl  = import.meta.env.NEXT_PUBLIC_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and " +
    "NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
