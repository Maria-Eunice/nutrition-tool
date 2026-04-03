import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { HeaderBar } from "@/components/layout/HeaderBar";

export const metadata: Metadata = {
  title: "Nutrition Tool Pro",
  description: "USDA-compliant school nutrition planning tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeaderBar />
        <div style={{ display: "flex" }}>
          <AppSidebar />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
