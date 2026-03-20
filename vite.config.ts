/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expose NEXT_PUBLIC_ vars to import.meta.env (in addition to VITE_)
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Pure Node environment — no DOM needed for these unit tests.
    // None of the imported modules call window/document at module scope.
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
