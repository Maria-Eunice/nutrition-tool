import { font, surface, text, border } from "../../data/brand";

export const Sel = ({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 ${className}`}
    style={{ fontFamily: font.body, backgroundColor: surface.input, borderColor: border.medium, color: text.primary }}
    {...props}
  >{children}</select>
);
