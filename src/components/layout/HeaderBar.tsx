"use client";
// HeaderBar: top navigation bar with logo, dark mode toggle, and action buttons.
import { RotateCcw, Printer, Save, Sun, Moon, ShieldCheck } from "lucide-react";
import { C, font, surface, text, border } from "../../data/brand";
import { useAppStore } from "../../store/useAppStore";
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

  const iconBtn = "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80 active:scale-95";

  return (
    <header
      className="flex items-center justify-between px-5 py-0 shrink-0"
      style={{
        height: 56,
        backgroundColor: surface.card,
        borderBottom: `1px solid ${border.default}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Left: logo ── */}
      <Logo />

      {/* ── Centre: USDA compliance badge ── */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ backgroundColor: `${C.green}18`, color: C.green, fontFamily: font.body }}>
        <ShieldCheck size={13} />
        USDA Compliant · v1.0
      </div>

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={iconBtn}
          style={{ color: text.secondary }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: border.medium }} />

        {/* Print */}
        <button
          onClick={onPrint}
          className={iconBtn}
          style={{ color: text.secondary }}
          title="Print current page"
        >
          <Printer size={15} />
          <span className="hidden md:inline">Print</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          className={iconBtn}
          style={{ color: C.blue }}
          title="Save backup to file"
        >
          <Save size={15} />
          <span className="hidden md:inline">Save</span>
        </button>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: border.medium }} />

        {/* Reset */}
        <button
          onClick={onReset}
          className={iconBtn}
          style={{ color: text.muted }}
          title="Reset all data"
        >
          <RotateCcw size={14} />
          <span className="hidden md:inline text-xs">Reset</span>
        </button>
      </div>
    </header>
  );
};
