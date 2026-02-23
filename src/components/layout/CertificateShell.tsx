import { ReactNode } from "react";
import GoldiamLogo from "@/components/GoldiamLogo";
import { GOLDIAM_ADDRESS, GOLDIAM_PHONE, GOLDIAM_EMAIL } from "@/lib/constants";

interface CertificateShellProps {
  title: string;
  children: ReactNode;
}

export default function CertificateShell({
  title,
  children,
}: CertificateShellProps) {
  return (
    <div className="certificate-shell bg-white relative" style={{ aspectRatio: "210 / 297" }}>
      {/* Outer border */}
      <div className="absolute inset-0 border-2 border-gold-border" />
      {/* Inner border */}
      <div className="absolute inset-[6px] border border-gold-border" />

      <div className="relative h-full flex flex-col p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <GoldiamLogo size="sm" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="font-serif font-bold text-xl sm:text-2xl uppercase tracking-[0.15em] text-dark">
            {title}
          </h1>
          <div className="mx-auto mt-2 h-px w-32 bg-gold-border" />
        </div>

        {/* Content */}
        <div className="flex-1 text-sm leading-relaxed text-dark">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gold-border/40">
          <div className="text-center text-[10px] text-muted leading-snug space-y-0.5">
            <div className="font-bold text-dark/60">{GOLDIAM_ADDRESS}</div>
            <div>
              Tel: {GOLDIAM_PHONE} &nbsp;|&nbsp; Email: {GOLDIAM_EMAIL}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
