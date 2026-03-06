import { surface, border } from "../../data/brand";

export const Card = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl border shadow-sm ${className}`} style={{ backgroundColor: surface.card, borderColor: border.default, boxShadow: "var(--shadow-card)" }} {...props}>{children}</div>
);
