"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getCertificateById,
  deleteCertificate,
  type SavedCertificate,
} from "@/lib/savedCertificates";
import ValuationTemplate from "@/components/templates/ValuationTemplate";
import GuaranteeTemplate from "@/components/templates/GuaranteeTemplate";
import VoucherTemplate from "@/components/templates/VoucherTemplate";
import CreditNoteTemplate from "@/components/templates/CreditNoteTemplate";
import type {
  ValuationFormData,
  GuaranteeFormData,
  VoucherFormData,
  CreditNoteFormData,
} from "@/types";

function CertificateNotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6">
      <p className="text-dark font-medium mb-4">Certificate not found.</p>
      <Link
        href="/"
        className="text-gold font-bold hover:text-gold/80 transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  );
}

function CertificateView({ cert }: { cert: SavedCertificate }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    const filename = `${cert.title.replace(/\s+/g, "_")}.pdf`;
    const { exportCertificateToPDF } = await import("@/lib/exportCertificatePDF");
    await exportCertificateToPDF(
      contentRef.current,
      filename,
      cert.type === "voucher" ? "landscape" : "portrait"
    );
  };

  const handleDelete = () => {
    deleteCertificate(cert.id);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="sticky top-0 z-10 bg-ivory/95 backdrop-blur border-b border-dark/10 px-4 py-3 flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="text-sm text-muted hover:text-dark transition-colors"
        >
          ← Back to home
        </Link>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gold/90"
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
          Download PDF
        </button>
        <button
          onClick={handleDelete}
          className="text-sm text-muted hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-6 flex justify-center">
        <div
          ref={contentRef}
          className="w-full max-w-[595px] shadow-2xl bg-white"
        >
          {cert.type === "valuation" && (
            <ValuationTemplate data={cert.formData as ValuationFormData} />
          )}
          {cert.type === "guarantee" && (
            <GuaranteeTemplate data={cert.formData as GuaranteeFormData} />
          )}
          {cert.type === "voucher" && (
            <VoucherTemplate data={cert.formData as VoucherFormData} />
          )}
          {cert.type === "credit-note" && (
            <CreditNoteTemplate data={cert.formData as CreditNoteFormData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificateViewerPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const [cert, setCert] = useState<SavedCertificate | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (typeof window === "undefined" || !id) {
      setCert(id === null ? null : undefined);
      return;
    }
    setCert(getCertificateById(id));
  }, [id]);

  if (cert === undefined) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <span className="text-muted">Loading…</span>
      </div>
    );
  }

  if (cert === null) {
    return <CertificateNotFound />;
  }

  return <CertificateView cert={cert} />;
}
