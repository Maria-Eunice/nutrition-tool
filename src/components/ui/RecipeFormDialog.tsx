import { useState, useEffect } from "react";
import { font, text, border } from "../../data/brand";
import { RECIPE_CATEGORIES, EMPTY_NUTRITION } from "../../data/constants";
import { useAppStore } from "../../store/useAppStore";
import { Dialog } from "./Dialog";
import { Input } from "./Input";
import { Sel } from "./Sel";
import { Btn } from "./Btn";
import type { Recipe } from "../../types";

interface RecipeFormDialogProps {
  open: boolean;
  onClose: () => void;
  recipe?: Recipe | null;
}

export const RecipeFormDialog = ({ open, onClose, recipe }: RecipeFormDialogProps) => {
  const addRecipe = useAppStore((s) => s.addRecipe);
  const updateRecipe = useAppStore((s) => s.updateRecipe);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(RECIPE_CATEGORIES[0]);
  const [recipeYield, setRecipeYield] = useState(50);
  const [servingSize, setServingSize] = useState("1 serving");

  const isEdit = !!recipe;

  useEffect(() => {
    if (open && recipe) {
      setName(recipe.name);
      setCategory(recipe.category);
      setRecipeYield(recipe.yield);
      setServingSize(recipe.servingSize);
    } else if (open) {
      setName("");
      setCategory(RECIPE_CATEGORIES[0]);
      setRecipeYield(50);
      setServingSize("1 serving");
    }
  }, [open, recipe]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (isEdit && recipe) {
      updateRecipe({
        ...recipe,
        name: name.trim(),
        category,
        yield: recipeYield,
        servingSize: servingSize.trim(),
      });
    } else {
      addRecipe({
        id: Date.now(),
        name: name.trim(),
        category,
        yield: recipeYield,
        servingSize: servingSize.trim(),
        ingredients: [],
        nutrition: { ...EMPTY_NUTRITION },
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? "Edit Recipe" : "New Recipe"}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ fontFamily: font.body, color: text.primary }}>
            Recipe Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chicken Tenders"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" style={{ fontFamily: font.body, color: text.primary }}>
            Category
          </label>
          <Sel value={category} onChange={(e) => setCategory(e.target.value)} className="w-full">
            {RECIPE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Sel>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ fontFamily: font.body, color: text.primary }}>
              Yield (servings)
            </label>
            <Input
              type="number"
              min={1}
              value={recipeYield}
              onChange={(e) => setRecipeYield(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ fontFamily: font.body, color: text.primary }}>
              Serving Size
            </label>
            <Input
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              placeholder="e.g. 3 pieces (85g)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t" style={{ borderColor: border.default }}>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={!name.trim()}>
            {isEdit ? "Save Changes" : "Add Recipe"}
          </Btn>
        </div>
      </div>
    </Dialog>
  );
};
