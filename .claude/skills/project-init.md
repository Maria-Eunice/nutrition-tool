---
description: Initialize a new React project with the standard library stack, testing, and Git setup
argument-hint: [project-name]
---

You are initializing a new Vite + React + TypeScript project. The project name is provided as the argument: **$ARGUMENTS**. If no argument was given, ask the user for the project name before proceeding.

Work through each step below in order. Complete each step fully before moving to the next. Show the user what you are doing at each stage with a brief heading (e.g., "**Step 1 — Scaffolding the project**").

---

## Step 1 — Scaffold the Vite project

Run the following command in the current working directory to create the project. Use the exact project name from `$ARGUMENTS`:

```bash
npm create vite@latest $ARGUMENTS -- --template react-ts
```

Then change into the new project directory and install the base dependencies:

```bash
cd $ARGUMENTS && npm install
```

---

## Step 2 — Install the standard library stack

Install all production dependencies in a single command:

```bash
npm install zustand react-router-dom react-hook-form @hookform/resolvers zod @tanstack/react-table date-fns react-to-print papaparse
npm install @types/papaparse --save-dev
```

---

## Step 3 — Install and configure Tailwind CSS v4

Install Tailwind CSS v4 and its Vite plugin:

```bash
npm install tailwindcss @tailwindcss/vite
```

Open `vite.config.ts` and add the Tailwind plugin. Replace the file contents with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

Open `src/index.css` and replace its entire contents with:

```css
@import "tailwindcss";
```

### Initialize shadcn/ui

Run the shadcn initializer. Accept all defaults when prompted (press Enter through each question):

```bash
npx shadcn@latest init
```

shadcn/ui will add a `components.json` config file and create `src/lib/utils.ts`. Verify both exist after the command completes. If the command prompts interactively, answer:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

---

## Step 4 — Install testing dependencies and configure Vitest

Install test tooling as dev dependencies:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Create `vitest.config.ts` in the project root:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
})
```

Create the test setup file at `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Open `package.json` and add two scripts inside the `"scripts"` block (alongside the existing `dev`, `build`, `preview` scripts):

```json
"test": "vitest run",
"test:coverage": "vitest run --coverage"
```

Create a smoke-test at `src/__tests__/App.test.tsx` to verify the app renders without crashing:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    // If render throws, the test fails — this just confirms the tree mounts cleanly
    expect(document.body).toBeTruthy()
  })
})
```

Run the tests to confirm they pass:

```bash
npm run test
```

If the smoke test fails because `App.tsx` imports components that don't exist yet, simplify `App.tsx` temporarily to `export default function App() { return <div>App</div> }`, rerun the test, then restore the original content.

---

## Step 5 — Create the .gitignore

Create `.gitignore` in the project root. Vite scaffolds a basic one; replace its contents entirely with:

```
# Dependencies
node_modules/

# Build output
dist/

# Environment variables
.env.local
.env.*.local

# Test coverage
coverage/

# Editor and OS files
.DS_Store
Thumbs.db
*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
```

---

## Step 6 — Initialize Git and create the initial commit

Initialize a Git repository and commit everything created so far:

```bash
git init
git add .
git commit -m "Initial project setup with standard library stack"
```

If `git commit` fails because no user identity is configured, instruct the user to run:

```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

Then retry the commit.

---

## Step 7 — Create CLAUDE.md with project conventions

Create `CLAUDE.md` in the project root:

```markdown
# Project Conventions

This file tells Claude Code how to work in this repository.

## Technology Stack

- **React 19** with TypeScript (strict mode enabled)
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite`
- **shadcn/ui** — component library (source code owned by the project in `src/components/ui/`)
- **Zustand** — all application state management
- **React Router** — all client-side navigation
- **React Hook Form + Zod** — all form handling and validation
- **TanStack Table** — all data table implementations
- **date-fns** — all date arithmetic and formatting
- **react-to-print** — all print-specific layouts
- **Vitest + Testing Library** — all automated tests

## Code Conventions

### TypeScript
- Strict mode is on (`"strict": true` in tsconfig). Do not use `any`.
- Prefer `interface` for object shapes, `type` for unions and primitives.
- All props must be typed. No implicit `any` from third-party libraries — add `@types/*` packages where available.

### Components
- Use **shadcn/ui** components for all new UI elements. Run `npx shadcn@latest add [component]` to add a component before using it.
- Custom one-off components go in `src/components/`. UI primitives go in `src/components/ui/`.
- Prefer small, focused components. A component file should rarely exceed 150 lines.

### State Management
- All shared application state lives in Zustand stores under `src/store/`.
- Do not use React `useState` for state that is needed by more than one component.
- Persist user preferences and core data using Zustand's `persist` middleware.

### Routing
- All routes are defined in `src/App.tsx` using React Router `<Routes>` and `<Route>`.
- Use `<NavLink>` (not `<a>`) for all internal navigation.

### Styling
- Use Tailwind utility classes for layout, spacing, and typography.
- Use inline `style` props (with CSS custom properties or brand tokens) for theme-aware colors.
- Never hardcode hex color values directly in components — use tokens from `src/data/brand.ts`.

### Testing
- Every utility function and business logic module must have a corresponding test file.
- Test files live alongside the file they test with a `.test.ts` or `.test.tsx` suffix.
- **Run `npm run test` before every commit.** Do not commit with failing tests.

## File Structure

```
src/
├── components/
│   ├── layout/      # App shell: header, sidebar, navigation
│   └── ui/          # shadcn/ui components (auto-generated + custom primitives)
├── data/            # Static constants, seed data, brand tokens
├── lib/             # Shared utilities (cn(), etc.)
├── store/           # Zustand store definitions
├── test/            # Vitest setup file
├── types/           # TypeScript interface/type definitions
├── utils/           # Pure utility functions (testable)
└── views/           # Top-level page components (one per route)
```

## Before Committing

1. `npm run test` — all tests must pass
2. Review that no `console.log` statements were left in production code
3. Confirm no hardcoded colors or magic numbers were introduced
```

---

## Step 8 — Create the PRD template

Create a `docs/` directory and add a `docs/PRD.md` template:

```markdown
# [Project Name] — Product Requirements Document

**Version:** 0.1 (Draft)
**Last Updated:** [Date]
**Status:** In progress
**Repository:** [GitHub URL]

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

### What is [Project Name]?

> Describe the product in 2–3 sentences. Who is it for, what does it do, and why does it exist?

### Who is it for?

| Role | Primary Use |
|---|---|
| [Role 1] | [How they use the product] |
| [Role 2] | [How they use the product] |

### What problem does it solve?

> Describe the pain point or gap this product addresses. What does the user do today without this tool, and why is that insufficient?

### Current Version

> Describe the current release status, key constraints (e.g., single-user, browser-only), and any notable out-of-scope items for this version.

---

## 2. Current Feature Inventory

> List every feature available in the current version, organized by view or module.

### 2.1 [Feature / View Name]

> Describe what this feature does and how users interact with it.

---

## 3. Technical Architecture

### 3.1 Technology Choices at a Glance

| Category | Technology | Role |
|---|---|---|
| UI Framework | React 19 | Component rendering |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Dev server and bundler |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Components | shadcn/ui | Pre-built accessible UI primitives |
| State Management | Zustand | Application state and persistence |
| Routing | React Router 7 | Client-side navigation |
| Forms & Validation | React Hook Form + Zod | Form state and schema validation |
| Data Tables | TanStack Table | Sortable, filterable tables |
| Date Logic | date-fns | Calendar and date arithmetic |
| Printing | react-to-print | Component-scoped print layouts |
| Testing | Vitest + Testing Library | Unit and integration tests |

### 3.2 Data Storage

> Describe where and how data is persisted (browser local storage, database, etc.).

### 3.3 Application Routes

| URL | View |
|---|---|
| `/` | [Home view] |

### 3.4 Project File Structure

> Add a directory tree once the structure is established.

---

## 4. Data Model

> Document every entity the application stores, with field names, types, and descriptions.

---

## 5. User Workflows

> Describe 3–6 key end-to-end user journeys through the application.

### Workflow 1: [Name]

**Trigger:** [What prompts the user to start this workflow?]

1. Step one
2. Step two
3. Step three

---

## 6. Known Limitations

> Document gaps, constraints, or incomplete features in the current version.

| # | Limitation | Impact |
|---|---|---|
| 1 | [Description] | [What the user cannot do as a result] |

---

## 7. Planned Enhancements

> List future features in rough priority order.

### 7.1 [Enhancement Name]

**What changes:** [Brief description]

**What this enables:**
- [Benefit 1]
- [Benefit 2]

---

## 8. Design Decisions

> Explain the key technical and product choices made, and why.

### 8.1 [Decision]

> Context, options considered, and rationale for the choice made.

---

*Document created from project analysis. Update this file as the product evolves.*
```

---

## Step 9 — Start the dev server

Start the development server so the user can verify the project is working:

```bash
npm run dev
```

Confirm the terminal shows a local URL (typically `http://localhost:5173`). Tell the user the project is ready and share:

1. The local dev URL
2. The command to run tests: `npm run test`
3. The command to add a shadcn/ui component: `npx shadcn@latest add [component-name]`
4. A reminder that `CLAUDE.md` and `docs/PRD.md` are ready to be filled in with project-specific details

---

## Error Handling

- If any `npm install` command fails, retry once. If it fails again, report the exact error to the user and ask whether to continue or abort.
- If `npx shadcn@latest init` hangs or fails, skip it and note in the summary that shadcn/ui was not initialized — the user can run `npx shadcn@latest init` manually later.
- If `git init` fails because Git is not installed, skip steps 6 and note this — the user should install Git and run `git init && git add . && git commit -m "Initial project setup with standard library stack"` manually.
- If the smoke test in Step 4 fails for a reason unrelated to App.tsx (e.g., a missing module), report the error and ask the user how to proceed rather than silently skipping the test run.
