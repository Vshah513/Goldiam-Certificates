interface GoldiamLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 120, height: 40 },
  md: { width: 180, height: 60 },
  lg: { width: 260, height: 87 },
};

// Plain (space-free) path served from /public. A normal <img> — not next/image —
// is used so the logo is reliably rendered in the print iframe and captured by
// html2canvas during PDF export (the optimized next/image element was being dropped).
const LOGO_SRC = "/goldiam-logo.png";

export default function GoldiamLogo({
  size = "md",
  className = "",
}: GoldiamLogoProps) {
  const { width, height } = sizes[size];
  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt="Goldiam Jewellers"
        width={width}
        height={height}
        loading="eager"
        decoding="sync"
        className="object-contain object-center"
        style={{ width, height }}
      />
    </div>
  );
}
