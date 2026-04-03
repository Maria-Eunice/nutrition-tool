"use client";
// HeaderBar: top navigation bar with logo, dark mode toggle, and action buttons.
import { RotateCcw, Printer, Save, Info, Sun, Moon } from "lucide-react";
import { C, font, surface, text, border } from "../../data/brand";
import { useAppStore } from "../../store/useAppStore";
import { Btn } from "../ui/Btn";
import { Logo } from "../ui/Logo";

export const HeaderBar = () => {
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const resetAll = useAppStore((s) => s.resetAll);

  const onReset = () => resetAll();
  const onPrint = () => window.print();
  const onSave = () => {
    const data = localStorage.getItem("sproutcnp-store");
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sproutcnp-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: surface.card, borderColor: border.default }}>
      <Logo />
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#fef08a", color: "#854d0e", border: "1px solid #fde047", fontFamily: font.body }}>
          Preview Test
        </span>
        <div className="flex items-center gap-1 text-xs" style={{ color: text.secondary, fontFamily: font.body }}>
          <Info size={12} /> info@sproutcnp.com
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-colors"
          style={{ color: text.secondary }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Btn variant="outline" icon={RotateCcw} onClick={onReset}>Reset All</Btn>
        <Btn variant="secondary" icon={Printer} onClick={onPrint}>Print Page</Btn>
        <Btn variant="primary" icon={Save} onClick={onSave}>Save to File</Btn>
      </div>
    </div>
  );
};
