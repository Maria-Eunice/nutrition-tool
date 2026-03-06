import { Dialog } from "./Dialog";
import { Btn } from "./Btn";
import { C, font } from "../../data/brand";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  details?: string[];
}

export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, details }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onClose} title={title}>
    <p className="text-sm mb-3" style={{ fontFamily: font.body, color: C.slate }}>{message}</p>
    {details && details.length > 0 && (
      <ul className="text-xs mb-4 space-y-1 p-3 rounded-lg border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", fontFamily: font.body, color: "#b91c1c" }}>
        {details.map((d, i) => <li key={i}>• {d}</li>)}
      </ul>
    )}
    <div className="flex justify-end gap-2">
      <Btn variant="outline" onClick={onClose}>Cancel</Btn>
      <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
    </div>
  </Dialog>
);
