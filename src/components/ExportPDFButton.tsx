"use client";

import { RefObject } from "react";

interface ExportPDFButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function ExportPDFButton({
  contentRef,
  filename = "Goldiam_Document.pdf",
}: ExportPDFButtonProps) {
  const handleExport = async () => {
    if (!contentRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(contentRef.current)
      .save();
  };

  return (
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
  );
}
