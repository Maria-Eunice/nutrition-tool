import { font, C } from "../../data/brand";

export const Logo = () => (
  <div className="flex items-center justify-center gap-0.5">
    <span className="text-2xl font-black tracking-tight" style={{ fontFamily: font.header, fontWeight: 900, color: C.green }}>
      Sprou<span className="relative">t<span className="absolute -top-1 -right-1" style={{ color: C.green, fontSize: 10 }}>🌿</span></span>
    </span>
    <span className="text-2xl font-black tracking-tight" style={{ fontFamily: font.header, fontWeight: 900, color: C.blue }}>CNP</span>
  </div>
);
