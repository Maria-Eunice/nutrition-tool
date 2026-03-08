# SproutCNP — Product Requirements Document

**Version:** 1.0
**Last Updated:** March 2026
**Status:** Live — actively developed
**Repository:** https://github.com/Maria-Eunice/nutrition-tool

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Current Feature Inventory](#2-current-feature-inventory)
3. [Technical Architecture](#3-technical-architecture)
4. [Data Model](#4-data-model)
5. [User Workflows](#5-user-workflows)
6. [Known Limitations](#6-known-limitations)
7. [Planned Enhancements](#7-planned-enhancements)
8. [Design Decisions](#8-design-decisions)

---

## 1. Product Overview

### What is SproutCNP?

SproutCNP is a browser-based school nutrition compliance and menu management tool built for K–12 food service programs participating in the **National School Lunch Program (NSLP)** and **School Breakfast Program (SBP)**. It runs entirely in a web browser — no installation, no app store, no server to maintain.

The name combines "Sprout" (fresh, growing, healthy food) with "CNP" (Child Nutrition Program), reflecting the product's mission: make federal nutrition compliance approachable for the staff who do this work every day.

### Who is it for?

| Role | Primary Use |
|---|---|
| **Nutrition Director** | Build the district recipe library, verify meal pattern compliance, review weekly nutrition reports |
| **Food Service Manager** | Plan weekly breakfast and lunch menus, print production menus for the kitchen |
| **Cafeteria Supervisor** | Look up recipes, print individual nutrition fact labels |

### What problem does it solve?

School nutrition programs are required by federal law to serve meals that meet specific calorie, sodium, and food component targets set by the USDA. These vary by grade group (K–5, 6–8, and 9–12). Meeting these requirements while planning five days of breakfast and lunch every week is a complex, error-prone process when done manually in spreadsheets.

SproutCNP replaces spreadsheets with a purpose-built workflow that:

- **Stores** all recipes with full FDA-standard nutrition data in one place
- **Checks** any meal combination against USDA requirements before it goes on the menu
- **Plans** an entire week of meals with a guided interface that only shows appropriate recipe choices for each slot
- **Reports** weekly nutrition averages so directors can identify compliance gaps at a glance
- **Prints** production-ready weekly menus and FDA-format nutrition labels

### Current Version

Version 1.0 is a **single-user, browser-based application**. All data is stored locally in the user's browser (no account required). It ships with 42 pre-loaded school lunch and breakfast recipes covering all seven USDA food categories.

---

## 2. Current Feature Inventory

### 2.1 Recipe Book

The Recipe Book is the application's home screen and the central hub for managing the recipe library.

**Browse and search**
- Displays all recipes in the collection with a live count in the toolbar
- **Grid view:** Visual cards showing recipe name, category badge, yield (number of servings), calories per serving, and sodium per serving — best for browsing
- **Table view:** Dense, sortable, paginated table — best for managing a large collection
- **Real-time search:** Type in the search box to filter recipes by name instantly (case-insensitive, matches partial names)

**Table view capabilities (powered by TanStack Table)**
- Sort by any column (Recipe Name, Category, Yield, Calories, Sodium, Saturated Fat) — click a header once for ascending, again for descending, a third time to clear
- Per-column filter boxes below each sortable header for independent filtering
- Pagination at 10 recipes per page with Previous/Next navigation

**Recipe detail**
- Click any recipe card or table row to open a full-screen detail dialog
- Detail dialog shows: category, yield, serving size, complete ingredient list, and a full FDA-format Nutrition Facts label
- From the detail dialog: open in the Recipe Builder for editing, or print a standalone nutrition label

**Adding and editing recipes**
- **Quick-add form (RecipeFormDialog):** A simple dialog for adding a recipe with name, category, yield, and serving size — creates the recipe with zeroed-out nutrition data that can be completed in the Builder later
- **Recipe Builder (full editor):** Full-featured editor with ingredient management and a live nutrition label preview (see Section 2.2)
- Edit icon on every recipe card opens the quick-edit form; detail dialog provides access to the full Builder

**Deleting recipes**
- Delete icon on every recipe card
- Before confirming, a dialog lists every menu slot that currently references the recipe so the user understands the downstream impact

**CSV import and export**
- **Download Template:** Produces a `.csv` file with the correct column headers (name, category, yield, servingSize, plus all 15 nutrition columns) for bulk data entry in Excel or Google Sheets
- **Import CSV:** Upload a completed CSV file; valid rows are appended to the recipe library immediately; invalid rows are reported in an error panel below the toolbar (import is non-destructive — it never deletes existing recipes)

---

### 2.2 Recipe Builder

The Recipe Builder is the full-featured recipe editor with field-by-field validation.

**Core fields**
- Recipe Name (minimum 3 characters)
- Category (dropdown: Entrée, Grain, WG Rich, Vegetable, Fruit, Protein, Milk)
- Yield — total number of servings the batch produces
- Serving Size — descriptive text (e.g., "3 pieces (85g)")

**Ingredients**
- Dynamic list: add as many ingredient rows as needed
- Each row: ingredient name, quantity (number), and unit (text, e.g., "lb", "cups", "each")
- Remove any row with the × button

**Nutrition data entry**
- All 15 FDA-required nutrition panel fields, entered per serving:
  - Calories, Total Fat, Saturated Fat, Trans Fat, Cholesterol, Sodium
  - Total Carbohydrates, Dietary Fiber, Total Sugars, Added Sugars, Protein
  - Vitamin D, Calcium, Iron, Potassium
- **Ingredient lookup:** Common ingredient buttons (chicken, beef, rice, pasta, cheese, egg) auto-fill approximate nutrition values as a starting point, reducing manual data entry
- **Live Nutrition Label:** The right column shows a real FDA-format Nutrition Facts label that updates as values are typed — allows visual QA before saving

**Validation (all rules enforced on Save)**

| Field | Rule | Error Message Shown |
|---|---|---|
| Recipe Name | At least 3 characters | "Name must be at least 3 characters" |
| Calories | Must be greater than zero | "Calories must be a positive number" |
| Yield | Must be greater than zero | "Yield must be greater than zero" |
| Serving Size | Cannot be blank | "Serving size is required" |
| Ingredients | At least one row required | "At least one ingredient is required" |
| All other nutrition fields | Must be 0 or greater | Red outline (no message) |

Fields that fail show a red outline and an error message beneath them. All errors must be resolved before the form saves.

**Edit mode**
- Navigating to `/builder/:id` or clicking Edit in any recipe detail dialog pre-fills the form with the recipe's current data
- Saving updates the existing recipe in place; it does not create a duplicate

**Print nutrition label**
- Prints an FDA-format nutrition label for the recipe directly from the detail dialog
- Uses a dedicated print layout with all browser chrome hidden — produces a clean label suitable for posting or distribution

---

### 2.3 Meal Pattern Checker

The Meal Pattern Checker lets staff test any combination of recipes against USDA NSLP requirements before committing to a menu.

**How it works**
1. Select a **Grade Group** — K–5, 6–8, or 9–12 — which loads the corresponding USDA calorie range and sodium ceiling
2. Select one recipe from each of the five required components: Entrée, Grain, Vegetable, Fruit, Milk
3. Milk defaults to the NSLP-standard 1% Low-Fat Milk
4. Eight compliance checks update in real time as selections change

**The 8 compliance checks**

| Check | What it evaluates |
|---|---|
| Meat/Meat Alternative | An Entrée is selected |
| Grain | A Grain is selected |
| Fruit | A Fruit is selected |
| Vegetable | A Vegetable is selected |
| Milk | A Milk item is selected |
| Calories | Combined calories fall within the grade group's min–max range |
| Sodium | Combined sodium is at or below the grade group's ceiling |
| Saturated Fat < 10% | Saturated fat provides less than 10% of total calories |

**USDA targets by grade group**

| Requirement | K–5 | 6–8 | 9–12 |
|---|---|---|---|
| Calories | 550–650 | 600–700 | 750–850 |
| Sodium ceiling | ≤ 1,230 mg | ≤ 1,360 mg | ≤ 1,420 mg |
| Saturated fat | < 10% of cal | < 10% of cal | < 10% of cal |
| Grain minimum | 1 oz eq | 1 oz eq | 2 oz eq |
| Meat/Meat Alt. | 1 oz eq | 1 oz eq | 2 oz eq |
| Vegetable | ¾ cup | ¾ cup | 1 cup |
| Fruit | ½ cup | ½ cup | 1 cup |
| Milk | 1 cup | 1 cup | 1 cup |

When all 8 checks pass, a green **COMPLIANT** banner appears at the top of the results panel.

---

### 2.4 Menu Planner

The Menu Planner is a weekly calendar grid for assigning recipes to every breakfast and lunch slot across a Monday–Friday school week.

**Calendar and navigation**
- Displays 5 columns (Monday through Friday) and 9 component rows (4 breakfast + 5 lunch)
- **Week navigation:** Left and right arrow buttons move one week at a time; a **Today** button returns to the current calendar week
- The week header shows the date range (e.g., "Mar 3 – Mar 7, 2026")
- Each calendar week is stored independently — past and future weeks can be planned and revisited at any time

**Meal components**

| Meal | Components |
|---|---|
| ☀ Breakfast | Whole Grain Rich, Protein, Fruit, Milk |
| 🥗 Lunch | Entrée, Grain, Vegetable, Fruit, Milk |

**Assigning recipes**
- Each cell contains a dropdown showing only recipes whose category matches that component (e.g., the Entrée dropdown only lists Entrée-category recipes)
- Select a recipe to assign it; choose the blank option to clear the slot
- Assignments are saved automatically to the browser on every change

**Daily nutrition totals**
- Below each day's column: combined calories, sodium, and saturated fat for all assigned recipes that day (breakfast and lunch combined)
- Totals update instantly when any selection changes

**Printing the weekly menu**
- The Print Menu button produces a landscape-format, print-ready weekly menu
- The printed layout includes: week date header, all assigned recipes by meal and component, per-meal nutrition subtotals, and daily grand totals
- Uses dedicated print CSS — the browser's address bar, sidebar, and buttons are hidden on the printed page

---

### 2.5 Reports

The Reports view provides a nutritional summary of the currently displayed week in the Menu Planner.

**Summary cards**
- Three stat cards at the top: Average Daily Calories, Average Daily Sodium, Average Saturated Fat
- Each card includes a USDA reference target and a green (compliant) or red (over limit) indicator
- Averages are calculated only across days that have at least one item assigned — partially planned weeks are not penalised

**Bar charts**
- Calories chart: Mon–Fri bars with a visual reference line at the 850 kcal maximum; bars turn red when over 850 kcal and yellow when under 550 kcal
- Sodium chart: Mon–Fri bars with a reference line at the K–5 Target 1 ceiling (1,230 mg); bars turn red when exceeded

---

### 2.6 Help

A built-in user guide accessible from the sidebar at all times.

- 7 collapsible accordion sections covering every view and feature
- Expand All / Collapse All controls
- **Print User Guide** button produces a fully expanded, formatted guide on letter paper
- Each section opens/closes independently; Overview is open by default

---

### 2.7 Global Application Features

These features are available across all views:

| Feature | Description |
|---|---|
| **Dark mode** | Sun/moon toggle in the top header switches between light and dark themes; preference is saved automatically |
| **Save to File** | Downloads a `sproutcnp-data.json` backup of all recipes and menu assignments |
| **Reset All** | Clears all menu assignments and restores the 42 default recipes; requires confirmation |
| **Print Page** | Triggers the browser's native print dialog for the current view |
| **Responsive sidebar** | Sidebar collapses on smaller screens with a hamburger button to reopen it |

---

## 3. Technical Architecture

> This section explains the tools and structure of the codebase. Technical terms are explained in plain language.

### 3.1 Technology Choices at a Glance

| Category | Technology | Plain-English Role |
|---|---|---|
| **UI Framework** | React 19 | The library that builds what users see and respond to their clicks |
| **Language** | TypeScript 5.9 | JavaScript with data type checking — catches bugs before they reach users |
| **Build Tool** | Vite 7.3 | Packages the code for the browser; dev server starts in under 500ms |
| **Styling** | Tailwind CSS 4.2 | Utility-first CSS system for consistent spacing, colors, and layout |
| **State Management** | Zustand 5.0 | The application's "memory" — holds all recipe and menu data while the app is open |
| **Routing** | React Router 7 | Controls which view (page) appears based on the URL |
| **Forms & Validation** | React Hook Form 7 + Zod 4 | Manages form inputs and enforces data rules before saving |
| **Data Table** | TanStack Table 8 | Powers the sortable, filterable, paginated recipe table |
| **Date Logic** | date-fns 4 | Handles all calendar math for week navigation |
| **Printing** | react-to-print 3.3 | Prints specific components (menus, labels) without browser chrome |
| **Icons** | Lucide React 0.577 | The icon set used throughout the application |
| **Testing** | Vitest 4.0 | Automated test runner — 31 tests across 4 test files |

### 3.2 How Data is Stored

All application data lives in the browser's **local storage** — a built-in browser feature that works like a small database on the user's own computer. There is no server; no data is ever sent over the internet.

The Zustand state management library handles reading from and writing to local storage automatically. Three data slices are persisted:

1. **recipes** — the full recipe library
2. **menu** — all weekly meal assignments (every week ever planned)
3. **darkMode** — the user's light/dark theme preference

Two pieces of state are intentionally _not_ saved (they reset on page reload):
- **viewRecipe** — which recipe detail dialog is open
- **sidebarOpen** — whether the mobile sidebar is expanded

The local storage key is `"sproutcnp-store"`. Data survives page refreshes but is tied to the specific browser and computer. Clearing browser data will erase it.

### 3.3 Application Routes (Pages)

| URL | View |
|---|---|
| `/` | Recipe Book |
| `/builder` | Recipe Builder (new recipe) |
| `/builder/:id` | Recipe Builder (edit existing recipe) |
| `/checker` | Meal Pattern Checker |
| `/planner` | Menu Planner |
| `/reports` | Reports |
| `/help` | Help / User Guide |

### 3.4 Project File Structure

```
School Nutrition & Compliance Tool/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx       Navigation sidebar
│   │   │   └── HeaderBar.tsx        Top bar (dark mode, Reset, Save, Print)
│   │   ├── ui/
│   │   │   ├── Btn.tsx              Button (primary/secondary/outline/ghost/danger)
│   │   │   ├── Badge.tsx            Coloured pill label
│   │   │   ├── Card.tsx             White/dark card surface
│   │   │   ├── ConfirmDialog.tsx    "Are you sure?" dialog
│   │   │   ├── Dialog.tsx           Modal dialog wrapper
│   │   │   ├── Input.tsx            Text/number input field
│   │   │   ├── RecipeFormDialog.tsx Quick-add/edit recipe form
│   │   │   ├── SectionHeader.tsx    Page heading with icon
│   │   │   └── Sel.tsx              Dropdown select field
│   │   ├── NutritionLabel.tsx       FDA-format Nutrition Facts panel
│   │   ├── PrintableNutritionFacts.tsx   Print layout for nutrition labels
│   │   ├── PrintableWeeklyMenu.tsx  Print layout for weekly menus
│   │   ├── RecipeDetailDialog.tsx   Recipe detail modal (reads store directly)
│   │   └── RecipeTable.tsx          TanStack-powered sortable recipe table
│   ├── data/
│   │   ├── brand.ts                 Colours, fonts, CSS token exports
│   │   ├── constants.ts             RECIPE_CATEGORIES, USDA_LIMITS, meal components
│   │   └── recipes.ts               42 built-in seed recipes
│   ├── lib/
│   │   └── utils.ts                 cn() utility for combining CSS class names
│   ├── store/
│   │   └── useAppStore.ts           Single Zustand store with all state and actions
│   ├── types/
│   │   └── index.ts                 TypeScript interface definitions
│   ├── utils/
│   │   ├── csv.ts                   CSV import/export helpers
│   │   ├── nutrition.ts             computeMealNutrition() pure function
│   │   └── recipes.ts               groupRecipesByCategory() utility
│   └── views/
│       ├── HelpView.tsx
│       ├── MealPatternView.tsx
│       ├── MealPatternView.test.ts  10 tests
│       ├── MenuPlannerView.tsx
│       ├── MenuPlannerView.test.ts  7 tests
│       ├── RecipeBookView.tsx
│       ├── RecipeBookView.test.ts   7 tests
│       ├── RecipeBuilderView.tsx
│       ├── RecipeBuilderView.test.ts 7 tests
│       └── ReportsView.tsx
├── docs/
│   └── PRD.md                       This document
├── .claude/
│   ├── launch.json                  Dev server configuration
│   └── skills/sproutcnp-app-setup/  Claude Skill for project setup
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 3.5 Automated Tests

The project has **31 automated tests** across 4 test files, all passing. Tests cover:

| File | Tests | What's verified |
|---|---|---|
| `RecipeBuilderView.test.ts` | 7 | Zod schema validation rules for all field types |
| `MealPatternView.test.ts` | 10 | USDA calorie compliance logic for all grade groups and boundary values |
| `MenuPlannerView.test.ts` | 7 | Nutrition total calculation across multi-slot, multi-day plans |
| `RecipeBookView.test.ts` | 7 | Recipe search filter (case insensitivity, partial matches, category exclusion) |

---

## 4. Data Model

> This section describes every piece of data the application stores, what each field means, and what type of value it holds.

---

### 4.1 Recipe

The core data object. Each recipe represents one school-foodservice recipe for a batch of servings.

| Field | Type | Description | Example |
|---|---|---|---|
| `id` | Number | Unique identifier for the recipe, auto-assigned when created | `1`, `1704067200000` |
| `name` | Text | The recipe's display name (min 3 characters) | `"Chicken Tenders"` |
| `category` | Text | One of seven USDA food categories (see 4.3) | `"Entrée"` |
| `yield` | Number | How many servings the full batch produces | `50` |
| `servingSize` | Text | Human-readable description of one serving | `"3 pieces (85g)"` |
| `ingredients` | List of Ingredients | Every ingredient in the batch recipe (see 4.2) | — |
| `nutrition` | Nutrition object | All 15 FDA nutrition panel values per single serving (see 4.4) | — |

---

### 4.2 Ingredient

One item in a recipe's ingredient list. Represents a batch quantity (not per-serving).

| Field | Type | Description | Example |
|---|---|---|---|
| `name` | Text | The ingredient name | `"Chicken breast, boneless"` |
| `qty` | Number | How much of the ingredient to use | `12` |
| `unit` | Text | Unit of measure for the quantity | `"lb"` |

---

### 4.3 Recipe Categories

The seven categories align directly with USDA NSLP food component groups:

| Category | USDA Component | Used in |
|---|---|---|
| Entrée | Meat / Meat Alternative | Lunch Entrée slot |
| Grain | Grain | Lunch Grain slot |
| WG Rich | Whole Grain Rich | Breakfast Grain slot |
| Vegetable | Vegetable | Lunch Vegetable slot |
| Fruit | Fruit | Breakfast & Lunch Fruit slot |
| Protein | Meat / Meat Alternative | Breakfast Protein slot |
| Milk | Fluid Milk | Breakfast & Lunch Milk slot |

---

### 4.4 Nutrition

Fifteen nutritional values per serving, matching the FDA Nutrition Facts label format exactly. All values are per single serving (not per batch).

| Field | Unit | Description | FDA Label Position |
|---|---|---|---|
| `calories` | kcal | Energy content | Prominent display, top |
| `totalFat` | grams | Total fat | Main nutrient |
| `saturatedFat` | grams | Saturated fat component | Sub-nutrient under fat |
| `transFat` | grams | Trans fat component | Sub-nutrient under fat |
| `cholesterol` | milligrams | Cholesterol | Main nutrient |
| `sodium` | milligrams | Sodium | Main nutrient — USDA compliance |
| `totalCarbs` | grams | Total carbohydrates | Main nutrient |
| `fiber` | grams | Dietary fiber | Sub-nutrient under carbs |
| `totalSugars` | grams | Total sugars | Sub-nutrient under carbs |
| `addedSugars` | grams | Added sugars | Sub-sub-nutrient |
| `protein` | grams | Protein | Main nutrient |
| `vitaminD` | micrograms (mcg) | Vitamin D | Micronutrient panel |
| `calcium` | milligrams | Calcium | Micronutrient panel |
| `iron` | milligrams | Iron | Micronutrient panel |
| `potassium` | milligrams | Potassium | Micronutrient panel |

---

### 4.5 Menu Map

The Menu Map stores all weekly meal assignments as a flat key-value lookup.

- **Key format:** `"YYYY-MM-DD-componentKey"` — the ISO date of the day concatenated with the component identifier
- **Value:** The name of the assigned recipe (text), or absent if nothing is assigned

| Example Key | Example Value | Meaning |
|---|---|---|
| `"2026-03-03-ln_entree"` | `"Chicken Tenders"` | Tuesday March 3, Lunch Entrée = Chicken Tenders |
| `"2026-03-03-bk_grain"` | `"WG Pancakes (2)"` | Tuesday March 3, Breakfast Grain = WG Pancakes |
| `"2026-03-07-ln_veg"` | `"Steamed Broccoli"` | Saturday (unused) — would appear if that key is set |

**Component keys:**

| Key | Meal | Component |
|---|---|---|
| `bk_grain` | Breakfast | Whole Grain Rich |
| `bk_protein` | Breakfast | Protein |
| `bk_fruit` | Breakfast | Fruit |
| `bk_milk` | Breakfast | Milk |
| `ln_entree` | Lunch | Entrée |
| `ln_grain` | Lunch | Grain |
| `ln_veg` | Lunch | Vegetable |
| `ln_fruit` | Lunch | Fruit |
| `ln_milk` | Lunch | Milk |

---

### 4.6 Application State (Zustand Store)

The complete in-memory state of the application at any given time:

| Field | Type | Persisted? | Description |
|---|---|---|---|
| `recipes` | Recipe list | ✅ Yes | The full recipe library |
| `menu` | Menu Map | ✅ Yes | All meal assignments across all weeks |
| `darkMode` | True/False | ✅ Yes | Current theme preference |
| `viewRecipe` | Recipe or null | ❌ No | Which recipe detail dialog is currently open |
| `sidebarOpen` | True/False | ❌ No | Whether the mobile sidebar is expanded |

---

### 4.7 USDA Limits

The compliance targets for each grade group, stored as constants (not user-editable in v1.0):

| Field | Type | Description |
|---|---|---|
| `calories.min` | Number | Minimum total calories per meal |
| `calories.max` | Number | Maximum total calories per meal |
| `sodium` | Number | Maximum milligrams of sodium per meal |
| `saturatedFatPct` | Number | Maximum % of calories from saturated fat (always 10) |
| `grainOz` | Number | Minimum oz equivalent of grain per meal |
| `meatOz` | Number | Minimum oz equivalent of meat/meat alt per meal |
| `vegCup` | Number | Minimum cup equivalent of vegetable per meal |
| `fruitCup` | Number | Minimum cup equivalent of fruit per meal |
| `milkCup` | Number | Minimum cup equivalent of fluid milk per meal |

---

## 5. User Workflows

> These are the key journeys a user takes through the application to accomplish real-world tasks.

---

### Workflow 1: Adding a new recipe to the library

**Trigger:** A new menu item needs to be added to the collection — e.g., a new vendor's product or a scratch recipe.

1. Navigate to **Recipe Book** → click **New Recipe**
2. In the quick-add dialog: enter the recipe name, select its category (e.g., Entrée), enter the yield and serving size → click **Add Recipe**
   - _Shortcut path: click_ **Open in Builder** _to skip the dialog and go directly to the full editor_
3. Open **Recipe Builder**, search for the recipe just created, click **Edit**
4. Add each ingredient row (name, quantity, unit)
5. Enter all 15 nutrition values per serving (use Lookup buttons for common ingredients as a starting point)
6. Verify the live Nutrition Facts label on the right looks correct
7. Click **Save Recipe**
8. Return to Recipe Book — the recipe now appears in the collection and is available in planner dropdowns

---

### Workflow 2: Checking a meal combination for compliance before planning

**Trigger:** A director wants to verify a proposed combination of recipes will meet USDA requirements for a specific grade group before assigning it to the weekly menu.

1. Navigate to **Meal Pattern Checker**
2. Select the **Grade Group** (e.g., 6–8)
3. Choose a recipe from each dropdown: Entrée, Grain, Vegetable, Fruit (Milk is pre-set)
4. Watch the compliance panel on the right — each of the 8 checks shows a green checkmark or a red X
5. If any check fails, change the recipe selection for that component and try alternatives until all 8 pass
6. Once the green **COMPLIANT** banner appears, note the winning combination
7. Navigate to Menu Planner and assign those same recipes to the appropriate week

---

### Workflow 3: Planning a full week of menus

**Trigger:** A food service manager needs to build the menu for an upcoming week.

1. Navigate to **Menu Planner**
2. Use the arrow buttons to navigate to the target week (e.g., next week)
3. For each day (Monday through Friday):
   - **Breakfast row by row:** Assign a Whole Grain Rich item, a Protein, a Fruit; Milk is typically left at the default
   - **Lunch row by row:** Assign an Entrée, a Grain, a Vegetable, a Fruit; Milk is typically left at the default
4. Monitor the **daily nutrition totals** at the bottom of each column — watch for unusual calorie or sodium values
5. Adjust any slot that looks off (e.g., swap a high-sodium Entrée for a lower-sodium option)
6. When satisfied, click **Print Menu** to produce the kitchen-ready weekly menu for posting

---

### Workflow 4: Reviewing weekly nutrition performance

**Trigger:** A director wants to confirm the planned week meets USDA averages and identify any problem days.

1. Ensure the Menu Planner shows the week under review (use week navigation if needed)
2. Navigate to **Reports**
3. Review the three summary cards — green badges indicate compliance, red indicates a problem
4. Examine the bar charts: identify any day with a bar that is outside the acceptable range (too tall = over-limit, too short/yellow = under minimum)
5. Return to **Menu Planner**, locate the problem day, and swap out the offending recipe
6. Navigate back to **Reports** — totals update immediately to reflect the change

---

### Workflow 5: Bulk-importing a recipe library from a spreadsheet

**Trigger:** A district is setting up SproutCNP for the first time and has an existing recipe inventory in a spreadsheet.

1. Navigate to **Recipe Book** → click **CSV Template** to download the import template
2. Open the template in Excel or Google Sheets
3. Add one recipe per row: fill in name, category, yield, serving size, and all 15 nutrition columns per serving
4. Save the file as `.csv` (File → Download As → CSV)
5. Return to Recipe Book → click **Import CSV** → select the saved file
6. SproutCNP immediately adds all valid rows to the collection
7. If any rows have errors (missing required fields, invalid numbers), a warning panel lists them by row number
8. Fix the flagged rows in the spreadsheet and re-import — duplicates will appear but can be deleted individually

---

### Workflow 6: Backing up and restoring data

**Trigger:** A user is switching computers, clearing their browser, or wants to share their recipe library with a colleague.

**Backup:**
1. Click **Save to File** in the top header bar
2. A file named `sproutcnp-data.json` downloads to the computer
3. Store this file in a safe location (cloud drive, email to self, network folder)

**Restore / Share:**
> Note: Full JSON import/restore from file is a planned enhancement (see Section 7). Currently, the saved file can be used by a developer to seed a new instance, but there is no one-click "Import from backup" button in v1.0.

---

## 6. Known Limitations

The following are gaps in the current v1.0 release. They are documented here for transparency and to inform prioritisation of planned enhancements.

### Data and Storage

| # | Limitation | Impact |
|---|---|---|
| 1 | **No user accounts** — all data is stored in a single browser profile | Multiple staff members on the same computer share one recipe library and menu; there is no way to distinguish whose work belongs to whom |
| 2 | **Browser-only storage** — data does not sync across devices or browsers | A menu planned on a work computer is not visible on a home computer or a colleague's machine |
| 3 | **No import-from-backup button** — the JSON backup file can be exported but cannot be re-imported through the UI | Restoring from a backup requires manual developer intervention |
| 4 | **No audit trail** — changes are saved silently with no record of who changed what or when | Accountability and change tracking are not possible in v1.0 |

### Functionality

| # | Limitation | Impact |
|---|---|---|
| 5 | **Reports shows only the current week** — there is no historical view or trend analysis across multiple weeks | Directors cannot compare this week against last week or the same week last year |
| 6 | **Reports uses day names (Monday–Friday) as keys, not calendar dates** — the Reports view aggregates by day name regardless of what calendar week is displayed | Reports and Menu Planner must be on the same week for the data to match; the Reports view does not yet respect the week navigation from the planner |
| 7 | **No USDA FoodData Central integration** — all nutrition values must be entered manually | Manual entry is time-consuming and prone to transcription errors; there is no way to pull verified nutrition data from the federal database |
| 8 | **Compliance checks use presence only for components** — the Meal Pattern Checker confirms that a slot is filled, but does not verify that the correct oz/cup quantity is actually met | A recipe listed as "Vegetable" passes the vegetable check regardless of whether it provides the required ¾ or 1 cup equivalent |
| 9 | **No allergen tracking** — the system does not flag or track the top 9 FDA-required allergens per recipe | Allergy communication must be handled outside the system |
| 10 | **No cycle menu support** — menus must be re-entered every week; there is no template or copy-from-previous-week function | Repetitive weekly menu building wastes staff time when cycle menus are used |
| 11 | **Single school only** — there is no concept of a school, district, or organisation hierarchy | A district with multiple schools cannot manage all schools from one interface |

### Technical and UX

| # | Limitation | Impact |
|---|---|---|
| 12 | **Limited mobile optimisation** — the planner grid and recipe table are not designed for small screens | Staff using tablets or phones in the cafeteria may find the interface difficult to use |
| 13 | **No Progressive Web App (PWA)** — the app cannot be installed from the browser to the home screen | Users must navigate to the URL; no offline caching beyond what the browser already does |
| 14 | **English only** — no Spanish or other language support | Districts with non-English-speaking staff cannot use the tool natively |
| 15 | **Quick-add form (RecipeFormDialog) bypasses full validation** — creating a recipe via the toolbar button uses a simpler form without Zod validation or ingredient management | Recipes created this way start with zeroed-out nutrition data and no ingredients; staff must remember to complete them in the Builder |

---

## 7. Planned Enhancements

These enhancements are ordered roughly by expected priority, with the most foundational items first.

---

### 7.1 Database Integration (Supabase)

**What changes:** Replace browser local storage with a cloud PostgreSQL database provided by Supabase.

**What this enables:**
- Data persists across devices — plan a menu at the office, view it on your phone
- Multiple users can share one recipe library
- Automatic cloud backup — no manual export needed
- Foundation for all other multi-user features

**Technical readiness:** A complete Supabase SQL schema has already been designed as part of this project (see `docs/SUPABASE_SCHEMA.sql`). It includes three tables:
- `recipes` — one row per recipe with all 15 nutrition fields as typed columns
- `menu_slots` — one row per meal assignment with date, component, and recipe reference
- `user_preferences` — one row per user for dark mode and future settings

All three tables have Row Level Security enabled so users can only see their own data.

---

### 7.2 User Authentication

**What changes:** Add login/logout functionality via Supabase Auth.

**What this enables:**
- Each staff member has their own account with their own recipe library and menus
- Directors can be granted a higher access level to view all staff menus across the school
- Password reset, email verification, and secure session management
- Potential for SSO (single sign-on) via the district's existing Google Workspace or Microsoft 365 accounts

**Roles proposed for v2.0:**

| Role | Permissions |
|---|---|
| Staff | View shared library, edit own menus, print own menus |
| Manager | All Staff permissions + edit shared recipe library, view all menus |
| Director | All Manager permissions + district-wide reporting, user management |

---

### 7.3 Multi-School and District Support

**What changes:** Add an organisation layer above the user, so a district administrator can manage multiple schools from one account.

**What this enables:**
- A district nutrition director manages recipe libraries for all 12 (or 50) schools in one interface
- Shared "master" recipes at the district level with school-specific overrides allowed
- District-wide compliance reports showing which schools are meeting USDA targets
- Per-school grade group configuration (a K–8 school has different needs than a 9–12 high school)

---

### 7.4 USDA FoodData Central API Integration

**What changes:** Add a search function that queries the [USDA FoodData Central](https://fdc.nal.usda.gov/) database by ingredient name and returns verified nutrition values.

**What this enables:**
- Staff type "whole wheat pasta" and select from a list of USDA-verified matches
- All 15 nutrition fields auto-fill from the USDA data — no manual entry
- Dramatically reduces data entry time and eliminates transcription errors
- Results are cached locally so the same ingredient lookup does not require a repeated API call

---

### 7.5 Enhanced Mobile Experience

**What changes:** Redesign the Menu Planner, Recipe Table, and Recipe Builder for use on tablet and phone screens.

**Specific improvements:**
- Planner grid: scrollable horizontally on tablets; card layout (one card per day) on phone screens
- Recipe Book: full-screen card browsing optimised for touch
- Recipe Builder: multi-step wizard layout (one section per screen) on small screens
- Bottom navigation bar on mobile to replace the sidebar
- Progressive Web App (PWA) — installable from browser, with offline caching so the tool works without an internet connection once set up

---

### 7.6 Additional Planned Features

| Feature | Description |
|---|---|
| **Import from backup** | A one-click button to restore recipes and menus from a saved JSON file |
| **Copy previous week** | Duplicate last week's menu as a starting point for the current week |
| **Cycle menus** | Define a repeating 4-week or 6-week cycle; apply it to any date range with one click |
| **Allergen tracking** | Flag the 9 FDA major allergens per recipe; filter recipe lists by allergen; print allergen disclosure sheets |
| **Cost tracking** | Record ingredient cost per unit; automatically calculate cost per serving per recipe; report total weekly food cost |
| **Production records** | Record actual quantities served vs. planned; track waste; generate USDA-required production records |
| **Historical reporting** | View and compare nutrition reports across any date range, not just the current week |
| **PDF export** | Export menus and reports as PDF without using the browser's print dialog |
| **Spanish language support** | Full UI translation into Spanish for districts with Spanish-speaking staff |

---

## 8. Design Decisions

> This section explains _why_ each major technical choice was made. Written for stakeholders who may evaluate whether the technology choices support the product's long-term goals.

---

### 8.1 Why Zustand instead of Redux for state management?

**What "state management" means:** Every application needs a place to hold its data while it's running — the list of recipes, the weekly meal assignments, whether dark mode is on. "State management" is the system that holds and updates this data.

**Redux** is the most famous state management library for React applications. It is powerful and well-tested, but it requires a significant amount of repetitive code ("boilerplate") for even simple operations — separate files for "actions", "reducers", and "slices".

**Zustand** achieves the same result in a fraction of the code. The entire SproutCNP data store — recipes, menus, preferences, and all the actions to modify them — is defined in approximately 75 lines. The equivalent Redux implementation would require 300+ lines across multiple files.

Zustand was also chosen because it:
- Has a built-in `persist` middleware that connects to browser local storage in a single line of configuration
- Uses a selector pattern (`useStore(s => s.recipes)`) that only re-renders components when the specific data they need changes — keeping the interface fast even with 42+ recipes loaded
- Is designed to be migrated to a server-based backend (Supabase) with minimal changes to component code

---

### 8.2 Why Vite instead of Create React App?

**What a "build tool" does:** Before a web application can run in a browser, the source code (TypeScript, JSX, imports) must be compiled and bundled into plain JavaScript. The build tool is what does this work.

**Create React App (CRA)** was the official starter for React projects for many years, but Facebook officially deprecated it in 2023. It is no longer maintained.

**Vite** is the modern standard. It starts a development server in under 500 milliseconds (CRA typically took 15–30 seconds) and updates the browser almost instantly when code changes. It also produces smaller production builds through a more efficient bundling algorithm.

For a school nutrition tool that a developer needs to iterate on and improve, fast feedback during development directly translates into faster feature delivery.

---

### 8.3 Why Tailwind CSS instead of traditional stylesheets?

**What Tailwind does:** Instead of writing CSS in separate files, Tailwind provides hundreds of short utility class names that you apply directly to HTML elements. `className="p-4 rounded-lg text-sm font-bold"` means "padding of 4 units, rounded corners, small text, bold font."

This approach was chosen because:
- All styling is co-located with the component it describes — no hunting through separate CSS files to understand why something looks a certain way
- Dark mode is implemented via CSS custom properties (`--bg-card`, `--text-primary`, etc.) that change when the `.dark` class is applied to the HTML root — a clean, zero-JavaScript approach to theming
- Tailwind v4 requires no configuration file and installs as a Vite plugin with two lines of setup
- Only the CSS class names actually used in the code are included in the final bundle — unused styles are automatically discarded

---

### 8.4 Why a custom component library instead of Material UI or Ant Design?

SproutCNP uses a small set of custom UI primitives (`Btn`, `Card`, `Dialog`, `Input`, `Sel`, `Badge`) rather than a third-party component library.

**Third-party libraries** like Material UI or Ant Design ship thousands of pre-built components. While convenient, they:
- Import a large amount of code and styles even when only 5 components are used
- Apply their own visual opinions (Material Design, Ant's design language) that conflict with the SproutCNP brand
- Create version lock-in — upgrading major versions often requires significant rework
- Add peer-dependency complexity that can block framework upgrades (e.g., upgrading React)

**The custom approach** gives SproutCNP:
- Components styled exactly to the SproutCNP green, slate, and blue brand palette
- Only the code that is actually needed
- Full control — a component can be changed in one file and the change applies everywhere it is used
- No dependency version conflicts to manage

This approach mirrors the philosophy of [shadcn/ui](https://ui.shadcn.com/) — a popular modern pattern where component source code is owned by the project, not by a third-party package.

---

### 8.5 Why React Hook Form + Zod instead of Formik?

**What form libraries do:** HTML forms are deceptively complex. A form library handles tracking which fields have been touched, when to show error messages, how to connect field values to application state, and how to validate everything before submitting.

**Formik** was the dominant React form library for several years, but it uses "controlled" inputs — every keystroke triggers a re-render of the entire form. For the Recipe Builder, which has 15+ nutrition fields, this meant 15+ re-renders per second while typing.

**React Hook Form** uses "uncontrolled" inputs that read values from the DOM only when needed. The Recipe Builder form produces zero re-renders while a user types in any field — the interface feels instant regardless of how many fields are present.

**Zod** adds schema-based validation: the same schema that describes the data structure also generates TypeScript types, validates the data at runtime, and produces human-readable error messages. One schema definition does three jobs.

The combination also enables the 31 automated tests: because the Zod schema is a plain exported object, it can be tested in isolation without rendering any UI at all.

---

### 8.6 Why react-to-print instead of window.print()?

Every browser has a `window.print()` function that sends the current page to the printer. However, it prints everything — the sidebar, the header, the toolbar buttons, the URL bar. The result is not suitable for a kitchen or a parent-facing menu.

**react-to-print** works by rendering a specific React component into a hidden frame, then printing only that frame. SproutCNP has two dedicated print-only components:

1. **PrintableWeeklyMenu** — a landscape-format table with the week's meals, per-meal nutrition subtotals, and daily totals, formatted for an 8.5 × 11 page
2. **PrintableNutritionFacts** — an FDA-format single-recipe nutrition label formatted for a quarter-page card

Both use 100% inline styles (rather than Tailwind classes) to ensure consistent print output across all browsers, which have inconsistent support for external stylesheets when printing.

---

### 8.7 Why browser local storage as the initial data layer?

For v1.0, there are compelling reasons to avoid building a backend:

- **No authentication complexity** — no login screen, no password reset, no session management to build and maintain
- **Zero hosting cost** — the entire application is a static website; no server to pay for or maintain
- **Zero latency** — reads and writes to local storage are effectively instant; no network round trips
- **Works offline** — the application works without an internet connection once the page has loaded
- **Faster to ship** — removing the backend allowed the first version to be built and deployed significantly faster

The design has been intentionally forward-compatible with a future Supabase migration:
- The Zustand `partialize` option already separates what is persisted from what is transient — the same separation needed for a server-side API
- A complete Supabase SQL schema (with UUID primary keys, Row Level Security, and per-user policies) has already been designed and documented in this repository
- Component code reads and writes through the store, never directly to local storage — switching the store's persistence layer to Supabase will not require changes to any view or component

---

*This document was generated from analysis of the SproutCNP v1.0 source code and is intended to serve as the authoritative reference for product scope, architecture, and planned direction.*
