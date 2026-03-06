import { C, font } from "../../data/brand";

export const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 ${className}`}
    style={{ fontFamily: font.body, borderColor: `${C.slate}22` }}
    {...props}
  />
);
