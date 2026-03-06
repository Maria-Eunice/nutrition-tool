import { C, font } from "../../data/brand";

export const Sel = ({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`h-10 rounded-lg border px-3 text-sm bg-white focus:outline-none focus:ring-2 ${className}`}
    style={{ fontFamily: font.body, borderColor: `${C.slate}22` }}
    {...props}
  >{children}</select>
);
