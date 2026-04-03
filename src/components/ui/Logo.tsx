"use client";
import { font, C } from "../../data/brand";

/** Two rounded leaves matching the SproutCNP style guide wordmark */
const SproutIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", flexShrink: 0 }}
  >
    {/* Left leaf — rotated ellipse */}
    <ellipse cx="10" cy="15" rx="5" ry="11" transform="rotate(-35 10 15)" fill={C.green} />
    {/* Right leaf — rotated ellipse */}
    <ellipse cx="22" cy="15" rx="5" ry="11" transform="rotate(35 22 15)" fill={C.green} />
    {/* Stem */}
    <line x1="16" y1="24" x2="16" y2="31" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Logo = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const fontSize = size === "sm" ? 19 : 27;
  const iconSize = size === "sm" ? 22 : 32;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", lineHeight: 1, gap: 1 }}>
      <span style={{ fontFamily: font.header, fontWeight: 900, fontSize, color: C.green, letterSpacing: "-0.02em" }}>
        Sprout
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", marginTop: size === "sm" ? -8 : -12 }}>
        <SproutIcon size={iconSize} />
      </span>
      <span style={{ fontFamily: font.header, fontWeight: 900, fontSize, color: C.blue, letterSpacing: "-0.02em" }}>
        CNP
      </span>
    </div>
  );
};
