import type { ComponentType } from "react";
import { C, font } from "../../data/brand";

type BtnVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  icon?: ComponentType<{ size?: number }>;
}

const variantStyles: Record<BtnVariant, React.CSSProperties> = {
  primary: { backgroundColor: C.green, color: "#fff", border: "none" },
  secondary: { backgroundColor: C.blue, color: "#fff", border: "none" },
  outline: { backgroundColor: "transparent", color: C.slate, border: `1.5px solid ${C.slate}22` },
  ghost: { backgroundColor: "transparent", color: C.slate, border: "none" },
  danger: { backgroundColor: "#dc2626", color: "#fff", border: "none" },
};

export const Btn = ({ children, variant = "primary", icon: Icon, className = "", ...props }: BtnProps) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 px-4 py-2.5 ${className}`}
    style={{ fontFamily: font.body, ...variantStyles[variant] }}
    {...props}
  >
    {Icon && <Icon size={16} />}{children}
  </button>
);
