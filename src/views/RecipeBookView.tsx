// Recipe Book: browse, search, import, and manage all saved recipes.
import { useState, useMemo, useRef } from "react";
import { BookOpen, Search, Trash2, Upload, Download, Plus, Pencil, LayoutGrid, Table } from "lucide-react";
import { format } from "date-fns";
import { C, font, surface, text, border } from "../data/brand";
import { COMP_LABELS } from "../data/constants";
import { useAppStore, getMenuSlotsUsingRecipe } from "../store/useAppStore";
import { parseCSV, downloadCSVTemplate } from "../utils/csv";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Btn } from "../components/ui/Btn";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { RecipeFormDialog } from "../components/ui/RecipeFormDialog";
import { RecipeTable } from "../components/RecipeTable";
import type { Recipe } from "../types";

export const RecipeBookView = () => {
  const recipes = useAppStore((s) => s.recipes);
  const menu = useAppStore((s) => s.menu);
  const setViewRecipe = useAppStore((s) => s.setViewRecipe);
  const deleteRecipe = useAppStore((s) => s.deleteRecipe);
  const importRecipes = useAppStore((s) => s.importRecipes);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);
  const [importErrors, setImportErrors] = useState<string[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const fileRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())), [recipes, search]);

  const affectedSlots = deleteTarget ? getMenuSlotsUsingRecipe(menu, deleteTarget.name) : [];

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { recipes: parsed, errors } = parseCSV(text);
      if (parsed.length > 0) importRecipes(parsed);
      setImportErrors(errors.length > 0 ? errors : null);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      <SectionHeader icon={BookOpen}>Recipe Book</SectionHeader>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <p className="text-sm" style={{ fontFamily: font.body, color: text.secondary }}>{recipes.length} recipes in your collection</p>

          {/* View mode toggle */}
          <div className="inline-flex rounded-lg border overflow-hidden" style={{ borderColor: border.medium }}>
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold transition-colors"
              style={{
                fontFamily: font.body,
                backgroundColor: viewMode === "grid" ? C.blue : surface.card,
                color: viewMode === "grid" ? "#fff" : text.secondary,
              }}
              onClick={() => setViewMode("grid")}
              title="Card grid view"
            >
              <LayoutGrid size={14} />
              Grid
            </button>
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold transition-colors"
              style={{
                fontFamily: font.body,
                backgroundColor: viewMode === "table" ? C.blue : surface.card,
                color: viewMode === "table" ? "#fff" : text.secondary,
                borderLeft: `1px solid ${border.medium}`,
              }}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <Table size={14} />
              Table
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Btn variant="primary" icon={Plus} onClick={() => { setEditingRecipe(null); setFormOpen(true); }} className="text-xs">New Recipe</Btn>
          <Btn variant="ghost" icon={Download} onClick={downloadCSVTemplate} className="text-xs">CSV Template</Btn>
          <Btn variant="outline" icon={Upload} onClick={() => fileRef.current?.click()} className="text-xs">Import CSV</Btn>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
        </div>
      </div>

      {/* ── Import warnings ── */}
      {importErrors && (
        <div className="mb-4 p-3 rounded-lg border text-xs space-y-1" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c", fontFamily: font.body }}>
          <div className="font-semibold">Import warnings:</div>
          {importErrors.map((err, i) => <div key={i}>• {err}</div>)}
          <button onClick={() => setImportErrors(null)} className="underline text-xs mt-1">Dismiss</button>
        </div>
      )}

      {/* ── Grid View ── */}
      {viewMode === "grid" && (
        <>
          <div className="relative max-w-md mb-5">
            <Search size={16} className="absolute left-3 top-3" style={{ color: text.muted }} />
            <Input placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(r => (
              <Card key={r.id} className="hover:shadow-md transition-shadow cursor-pointer relative">
                <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                  <button
                    className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setEditingRecipe(r); setFormOpen(true); }}
                    title="Edit recipe"
                  >
                    <Pencil size={14} color={C.green} />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                    title="Delete recipe"
                  >
                    <Trash2 size={14} color="#dc2626" />
                  </button>
                </div>
                <div className="p-6" onClick={() => setViewRecipe(r)}>
                  <div className="pr-16 mb-2">
                    <h3 className="font-bold text-base leading-tight" style={{ fontFamily: font.header, color: text.primary }}>{r.name}</h3>
                  </div>
                  <div className="mb-4">
                    <Badge color={C.blue}>{r.category}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[{ l: "Yield", v: r.yield }, { l: "Cal/srv", v: r.nutrition.calories }, { l: "Na mg", v: r.nutrition.sodium }].map(({ l, v }) => (
                      <div key={l} className="rounded-lg p-3" style={{ backgroundColor: C.white }}>
                        <div className="text-lg font-bold" style={{ color: C.green, fontFamily: font.header }}>{v}</div>
                        <div className="text-xs" style={{ color: text.secondary, fontFamily: font.body }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs" style={{ color: text.secondary, fontFamily: font.body }}>Serving: {r.servingSize}</div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Table View ── */}
      {viewMode === "table" && (
        <RecipeTable
          recipes={recipes}
          onView={(r) => setViewRecipe(r)}
          onEdit={(r) => { setEditingRecipe(r); setFormOpen(true); }}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}

      <RecipeFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingRecipe(null); }}
        recipe={editingRecipe}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteRecipe(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete Recipe"
        message={
          affectedSlots.length > 0
            ? `"${deleteTarget?.name}" is assigned to ${affectedSlots.length} menu slot(s). Deleting it will remove it from these slots.`
            : `Are you sure you want to delete "${deleteTarget?.name}"?`
        }
        details={affectedSlots.length > 0 ? affectedSlots.map(s => {
          const label = COMP_LABELS[s.component] || s.component;
          try { return `${format(new Date(s.day + "T00:00:00"), "EEE, MMM d")} — ${label}`; }
          catch { return `${s.day} — ${label}`; }
        }) : undefined}
      />
    </div>
  );
};
