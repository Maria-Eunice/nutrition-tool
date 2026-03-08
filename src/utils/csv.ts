import type { Recipe, Nutrition } from "../types";

export const CSV_TEMPLATE_HEADERS = [
  "name", "category", "yield", "servingSize",
  "calories", "totalFat", "saturatedFat", "transFat", "cholesterol", "sodium",
  "totalCarbs", "fiber", "totalSugars", "addedSugars", "protein",
  "vitaminD", "calcium", "iron", "potassium",
];

const NUTRITION_KEYS: (keyof Nutrition)[] = [
  "calories", "totalFat", "saturatedFat", "transFat", "cholesterol", "sodium",
  "totalCarbs", "fiber", "totalSugars", "addedSugars", "protein",
  "vitaminD", "calcium", "iron", "potassium",
];

/** Triggers a browser file-download for any Blob without needing a server. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSVTemplate() {
  const exampleRow = [
    "Chicken Tenders", "Entrée", "50", "3 pieces (85g)",
    "210", "7", "1.5", "0", "65", "340",
    "12", "1", "0", "0", "24",
    "0.1", "20", "1.2", "220",
  ];
  const csv = CSV_TEMPLATE_HEADERS.join(",") + "\n" + exampleRow.join(",") + "\n";
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "recipe-import-template.csv");
}

function splitCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCSV(text: string): { recipes: Recipe[]; errors: string[] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { recipes: [], errors: ["CSV must have a header row and at least one data row."] };

  const headers = splitCSVRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ""));
  const headerMap: Record<string, number> = {};
  headers.forEach((h, i) => { headerMap[h] = i; });

  const nameIdx = headerMap["name"];
  const catIdx = headerMap["category"];
  if (nameIdx === undefined || catIdx === undefined) {
    return { recipes: [], errors: ["CSV must have 'name' and 'category' columns."] };
  }

  const recipes: Recipe[] = [];
  const errors: string[] = [];
  const now = Date.now();

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVRow(lines[i]);
    const name = cols[nameIdx];
    const category = cols[catIdx];
    if (!name) { errors.push(`Row ${i + 1}: missing name, skipped.`); continue; }
    if (!category) { errors.push(`Row ${i + 1}: missing category, skipped.`); continue; }

    const yldIdx = headerMap["yield"];
    const ssIdx = headerMap["servingsize"];

    const nutrition: Nutrition = { calories: 0, totalFat: 0, saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 0, totalCarbs: 0, fiber: 0, totalSugars: 0, addedSugars: 0, protein: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0 };
    for (const key of NUTRITION_KEYS) {
      const idx = headerMap[key.toLowerCase()];
      if (idx !== undefined && cols[idx]) {
        const val = parseFloat(cols[idx]);
        if (!isNaN(val)) nutrition[key] = val;
      }
    }

    recipes.push({
      id: now * 1000 + i,
      name,
      category,
      yield: yldIdx !== undefined ? (parseInt(cols[yldIdx]) || 50) : 50,
      servingSize: ssIdx !== undefined ? (cols[ssIdx] || "1 serving") : "1 serving",
      ingredients: [],
      nutrition,
    });
  }

  return { recipes, errors };
}
