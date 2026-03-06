import { X } from "lucide-react";
import { C, font } from "../../data/brand";

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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: `${C.slate}12` }}>
          <h2 className="font-bold text-lg" style={{ fontFamily: font.header, color: C.slate }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} color={C.slate} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
