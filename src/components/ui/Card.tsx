import { C } from "../../data/brand";

export const Card = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white rounded-xl border shadow-sm ${className}`} style={{ borderColor: `${C.slate}12` }} {...props}>{children}</div>
);
