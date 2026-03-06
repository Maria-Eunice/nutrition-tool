import type { ComponentType } from "react";
import { C, font, text } from "../../data/brand";

export const SectionHeader = ({ children, icon: Icon }: { children: React.ReactNode; icon: ComponentType<{ size?: number; fill?: string }> }) => (
  <h2 className="flex items-center gap-2 text-lg font-bold mb-4" style={{ fontFamily: font.header, fontWeight: 700, color: text.primary }}>
    {Icon && <Icon size={20} fill={C.blue} />}{children}
  </h2>
);
