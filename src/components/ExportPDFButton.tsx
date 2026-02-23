"use client";

import { useState } from "react";
import { RefObject } from "react";
import { exportCertificateToPDF } from "@/lib/exportCertificatePDF";

interface ExportPDFButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function ExportPDFButton({
  contentRef,
  filename = "Goldiam_Document.pdf",
}: ExportPDFButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!contentRef.current) {
      setError("Switch to the Preview tab and try again.");
      setTimeout(() => setError(null), 5000);
      return;
    }
    setError(null);
    try {
      await exportCertificateToPDF(contentRef.current, filename);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(message);
      setTimeout(() => setError(null), 6000);
    }
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      {error && (
        <span className="text-xs text-red-600 max-w-[200px] text-right">
          {error}
        </span>
      )}
      <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-md border border-gold bg-white px-4 py-2 text-sm font-bold text-gold shadow-sm transition-colors hover:bg-gold/5 active:bg-gold/10"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export PDF
    </button>
    </span>
  );
}
