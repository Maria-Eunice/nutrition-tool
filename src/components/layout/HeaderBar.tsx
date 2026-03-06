import { RotateCcw, Printer, Save, Info } from "lucide-react";
import { C, font } from "../../data/brand";
import { Btn } from "../ui/Btn";
import { Logo } from "../ui/Logo";

interface HeaderBarProps {
  onReset: () => void;
  onPrint: () => void;
  onSave: () => void;
}

export const HeaderBar = ({ onReset, onPrint, onSave }: HeaderBarProps) => (
  <div className="bg-white border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3" style={{ borderColor: `${C.slate}12` }}>
    <Logo />
    <div className="flex items-center gap-1 text-xs" style={{ color: `${C.slate}88`, fontFamily: font.body }}>
      <Info size={12} /> info@sproutcnp.com
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <Btn variant="outline" icon={RotateCcw} onClick={onReset}>Reset All</Btn>
      <Btn variant="secondary" icon={Printer} onClick={onPrint}>Print Page</Btn>
      <Btn variant="primary" icon={Save} onClick={onSave}>Save to File</Btn>
    </div>
  </div>
);
