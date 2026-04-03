"use client";
import { font, C } from "../../data/brand";

/**
 * Sprout icon: two teardrop leaves growing from a shared stem,
 * matching the SproutCNP style guide wordmark exactly.
 */
const SproutIcon = ({ width, height }: { width: number; height: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", flexShrink: 0 }}
  >
    {/* Left leaf — rotated -35° around its own center, tips spread outward */}
    <ellipse cx="9" cy="14" rx="4.5" ry="10" transform="rotate(-35 9 14)" fill={C.green} />
    {/* Right leaf — rotated +35° around its own center */}
    <ellipse cx="15" cy="14" rx="4.5" ry="10" transform="rotate(35 15 14)" fill={C.green} />
    {/* Stem */}
    <line x1="12" y1="23" x2="12" y2="31" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const Logo = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const fontSize  = size === "sm" ? 19 : 27;
  const iconH     = Math.round(fontSize * 1.35);
  const iconW     = Math.round(iconH * 0.75);

  return (
    <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 0, lineHeight: 1, paddingBottom: 2 }}>
      <span
        style={{
          fontFamily: font.header,
          fontWeight: 900,
          fontSize,
          color: C.green,
          letterSpacing: "-0.01em",
        }}
      >
        Sprout
      </span>

      {/* Icon sits between the two words, rising above the text cap-line */}
      <div style={{ marginBottom: Math.round(fontSize * 0.08) }}>
        <SproutIcon width={iconW} height={iconH} />
      </div>

      <span
        style={{
          fontFamily: font.header,
          fontWeight: 900,
          fontSize,
          color: C.blue,
          letterSpacing: "-0.01em",
        }}
      >
        CNP
      </span>
    </div>
  );
};
