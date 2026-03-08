import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Edit, Printer } from "lucide-react";
import { C, font, text, border } from "../data/brand";
import { useAppStore } from "../store/useAppStore";
import { Dialog } from "./ui/Dialog";
import { Badge } from "./ui/Badge";
import { Btn } from "./ui/Btn";
import { NutritionLabel } from "./NutritionLabel";
import { PrintableNutritionFacts } from "./PrintableNutritionFacts";

/**
 * Modal dialog that shows the full details of a recipe (ingredients +
 * nutrition label) and provides Edit / Print Label actions.
 *
 * Reads `viewRecipe` directly from the Zustand store so it can be placed
 * once in the app shell without prop-drilling.
 */
export const RecipeDetailDialog = () => {
  const viewRecipe = useAppStore((s) => s.viewRecipe);
  const setViewRecipe = useAppStore((s) => s.setViewRecipe);
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintLabel = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${viewRecipe?.name ?? "Recipe"} — Nutrition Facts`,
    pageStyle: `
      @page { size: letter; margin: 0.75in; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <Dialog open={!!viewRecipe} onClose={() => setViewRecipe(null)} title={viewRecipe?.name ?? ""}>
      {viewRecipe && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge color={C.blue}>{viewRecipe.category}</Badge>
              <span className="text-sm" style={{ color: text.secondary, fontFamily: font.body }}>
                Yield: {viewRecipe.yield} | {viewRecipe.servingSize}
              </span>
            </div>
            <h4 className="font-bold text-sm mb-2" style={{ fontFamily: font.header, color: C.blue }}>
              Ingredients
            </h4>
            <div className="space-y-1">
              {viewRecipe.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="text-sm py-1 border-b"
                  style={{ fontFamily: font.body, color: text.primary, borderColor: border.default }}
                >
                  {ing.qty} {ing.unit} — {ing.name}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Btn
                variant="outline"
                icon={Edit}
                onClick={() => { setViewRecipe(null); navigate(`/builder/${viewRecipe.id}`); }}
              >
                Edit Recipe
              </Btn>
              <Btn variant="ghost" icon={Printer} onClick={() => handlePrintLabel()}>
                Print Label
              </Btn>
            </div>
          </div>

          <div>
            <NutritionLabel nutrition={viewRecipe.nutrition} servingSize={viewRecipe.servingSize} />
            <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
              <PrintableNutritionFacts
                ref={printRef}
                recipeName={viewRecipe.name}
                servingSize={viewRecipe.servingSize}
                nutrition={viewRecipe.nutrition}
              />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};
