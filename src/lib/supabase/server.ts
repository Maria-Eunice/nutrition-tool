// Server-side Supabase client — uses cookie-based session management.
// In this Vite SPA the "server" client is used for service-role or
// edge-function contexts; pass a cookie adapter that matches your runtime.
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL  as string;
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export interface CookieAdapter {
  get(name: string): string | undefined;
  set(name: string, value: string, options: CookieOptions): void;
  remove(name: string, options: CookieOptions): void;
}

/**
 * Creates a Supabase client with cookie-based session management.
 *
 * Usage (e.g. in a Vite SSR entry or edge function):
 *   const client = createSupabaseServerClient({
 *     get:    (name)          => cookieStore.get(name),
 *     set:    (name, val, o)  => cookieStore.set(name, val, o),
 *     remove: (name, _, o)    => cookieStore.delete(name, o),
 *   });
 */
export function createSupabaseServerClient(cookies: CookieAdapter) {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get:    (name)                 => cookies.get(name),
      set:    (name, value, options) => cookies.set(name, value, options),
      remove: (name, options)        => cookies.remove(name, options),
    },
  });
}
