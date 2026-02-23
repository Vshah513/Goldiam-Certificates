"use client";

import { useState, RefObject } from "react";
import {
  saveCertificate,
  dispatchSavedEvent,
  type CertificateType,
} from "@/lib/savedCertificates";
import { exportCertificateToPDF } from "@/lib/exportCertificatePDF";

interface SaveCertificateButtonProps {
  contentRef: RefObject<HTMLDivElement | null>;
  filename?: string;
  certificateType: CertificateType;
  formData: object;
  title: string;
}

export default function SaveCertificateButton({
  contentRef,
  filename = "Goldiam_Document.pdf",
  certificateType,
  formData,
  title,
}: SaveCertificateButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!contentRef.current) {
      setError("Certificate preview is not ready. Switch to the Preview tab and try again.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await exportCertificateToPDF(contentRef.current, filename);
      saveCertificate(certificateType, formData, title);
      dispatchSavedEvent();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(message);
      setTimeout(() => setError(null), 6000);
    } finally {
      setSaving(false);
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
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-forest/90 active:bg-forest/80 disabled:opacity-60"
      >
      {saving ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Saving…
        </>
      ) : saved ? (
        <>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Saved
        </>
      ) : (
        <>
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save
        </>
      )}
    </button>
    </span>
  );
}
