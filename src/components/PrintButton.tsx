"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useReactToPrint } from "react-to-print";
import { RefObject } from "react";

interface PrintButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  documentTitle?: string;
  /** Extra @page / print CSS, e.g. landscape for the gift voucher. */
  pageStyle?: string;
}

export default function PrintButton({
  contentRef,
  documentTitle = "Goldiam Document",
  pageStyle,
}: PrintButtonProps) {
  const [showDoneDialog, setShowDoneDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle,
    onAfterPrint: () => setShowDoneDialog(true),
  });

  const handleStartNew = () => {
    setShowDoneDialog(false);
    window.location.reload();
  };

  const handleKeepEditing = () => {
    setShowDoneDialog(false);
  };

  return (
    <>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-gold/90 active:bg-gold/80"
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
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print
      </button>

      {/* Post-print dialog: render in portal so it's viewport-centered (desktop + mobile) */}
      {mounted && showDoneDialog &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-dark/50 min-h-screen"
            onClick={(e) => e.target === e.currentTarget && handleKeepEditing()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="done-dialog-title"
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-gold-border mx-4 my-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="done-dialog-title"
                className="font-serif text-lg font-bold text-dark mb-1"
              >
                Are you done with this certificate?
              </h2>
              <p className="text-sm text-muted mb-6">
                Would you like to start a new one or keep editing?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartNew}
                  className="flex-1 rounded-md bg-gold px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-gold/90"
                >
                  Yes, start a new one
                </button>
                <button
                  onClick={handleKeepEditing}
                  className="flex-1 rounded-md border-2 border-dark/20 px-4 py-2.5 text-sm font-bold text-dark transition-colors hover:bg-dark/5"
                >
                  No, keep editing
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
