interface GoldiamLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { main: "text-xl", sub: "text-[9px] tracking-[0.4em]" },
  md: { main: "text-3xl", sub: "text-xs tracking-[0.45em]" },
  lg: { main: "text-5xl", sub: "text-sm tracking-[0.5em]" },
};

export default function GoldiamLogo({
  size = "md",
  className = "",
}: GoldiamLogoProps) {
  const s = sizes[size];
  return (
    <div className={`text-center select-none ${className}`}>
      <div
        className={`font-serif font-bold ${s.main} text-gold tracking-[0.3em]`}
      >
        GOLDIAM
      </div>
      <div className={`font-sans font-normal ${s.sub} text-dark/60 mt-0.5`}>
        JEWELLERS
      </div>
    </div>
  );
}
