import { font, C } from "../../data/brand";

export const Logo = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const textSize = size === "sm" ? "text-lg" : "text-2xl";
  const leafSize = size === "sm" ? 8 : 11;
  const leafOffset = size === "sm" ? "-top-1.5 -right-1" : "-top-2 -right-1";
  return (
    <div className="flex items-center justify-center gap-0.5">
      <span className={`${textSize} font-black tracking-tight`} style={{ fontFamily: font.header, fontWeight: 900, color: C.green }}>
        Sprou<span className="relative">
          t
          <svg
            className={`absolute ${leafOffset}`}
            width={leafSize}
            height={leafSize}
            viewBox="0 0 24 24"
            fill={C.green}
            stroke={C.green}
            strokeWidth="1"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" />
          </svg>
        </span>
      </span>
      <span className={`${textSize} font-black tracking-tight`} style={{ fontFamily: font.header, fontWeight: 900, color: C.blue }}>CNP</span>
    </div>
  );
};
