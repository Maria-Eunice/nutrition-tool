import { C, font } from "../../data/brand";

export const Badge = ({ children, color = C.green }: { children: React.ReactNode; color?: string }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30`, fontFamily: font.body }}
  >{children}</span>
);
