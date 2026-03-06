import { X } from "lucide-react";
import { font, surface, text, border } from "../../data/brand";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog = ({ open, onClose, title, children }: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "var(--overlay)" }} onClick={onClose} />
      <div className="relative rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto" style={{ backgroundColor: surface.card }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: border.default }}>
          <h2 className="font-bold text-lg" style={{ fontFamily: font.header, color: text.primary }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: text.primary }}><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
