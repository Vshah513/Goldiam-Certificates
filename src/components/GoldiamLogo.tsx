import Image from "next/image";

interface GoldiamLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { width: 120, height: 40 },
  md: { width: 180, height: 60 },
  lg: { width: 260, height: 87 },
};

const LOGO_SRC = "/Goldiam%20Updated%20Logo.png";

export default function GoldiamLogo({
  size = "md",
  className = "",
}: GoldiamLogoProps) {
  const { width, height } = sizes[size];
  return (
    <div className={`relative select-none ${className}`}>
      <Image
        src={LOGO_SRC}
        alt="Goldiam Jewellers"
        width={width}
        height={height}
        className="object-contain object-left"
        priority
      />
    </div>
  );
}
