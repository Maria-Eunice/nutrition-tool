"use client";
import Image from "next/image";

/**
 * Official SproutCNP logo — vector paths extracted directly from
 * SPROUTCNP MAIN.ai, rendered as a high-res transparent PNG.
 * Font: Helvetica Neue LT Pro 85 Heavy  Colors: #679436 / #05668D
 */
export const Logo = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const height = size === "sm" ? 26 : 34;
  const width  = Math.round(height * (2400 / 482)); // preserve aspect ratio

  return (
    <Image
      src="/logo-sproutcnp.png"
      alt="SproutCNP"
      width={width}
      height={height}
      priority
      style={{ display: "block" }}
    />
  );
};
