export const C = {
  green: "#679436",
  blue: "#05668D",
  yellow: "#F0D173",
  lightBlue: "#D5E6F1",
  white: "#FFFFFF",
  slate: "#1D363D",
};

export const font = {
  header: "'Roboto Slab', 'Arial Black', sans-serif",
  body: "'Montserrat', Arial, sans-serif",
};

/* ── Theme-aware semantic tokens (resolve via CSS custom properties) ── */

export const surface = {
  page: "var(--bg-page)",
  card: "var(--bg-card)",
  sidebar: "var(--bg-sidebar)",
  input: "var(--bg-input)",
  hover: "var(--bg-hover)",
  tableHeader: "var(--bg-table-header)",
};

export const text = {
  primary: "var(--text-primary)",
  secondary: "var(--text-secondary)",
  muted: "var(--text-muted)",
  onSidebar: "var(--text-on-sidebar)",
};

export const border = {
  default: "var(--border-default)",
  medium: "var(--border-medium)",
};
