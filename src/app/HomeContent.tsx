"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import GoldiamLogo from "@/components/GoldiamLogo";
import { GOLDIAM_ADDRESS } from "@/lib/constants";
import {
  getSavedCertificates,
  deleteCertificate,
  SAVED_EVENT,
  type SavedCertificate,
  type CertificateType,
} from "@/lib/savedCertificates";

const documents = [
  {
    title: "Valuation Certificate",
    description: "Insurance & replacement value estimates for jewellery items",
    href: "/valuation",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Guarantee Certificate",
    description: "Gold purity & stone quality guarantee for purchased items",
    href: "/guarantee",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "Gift Voucher",
    description: "Customer gift vouchers with custom amounts & validity periods",
    href: "/voucher",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    title: "Credit Note",
    description: "Refund & deposit credits issued to customers",
    href: "/credit-note",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
];

const typeLabels: Record<CertificateType, string> = {
  valuation: "Valuation",
  guarantee: "Guarantee",
  voucher: "Voucher",
  "credit-note": "Credit Note",
};

function PastCertificatesList() {
  const [list, setList] = useState<SavedCertificate[]>([]);

  const refresh = () => setList(getSavedCertificates());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const onSaved = () => refresh();
    window.addEventListener(SAVED_EVENT, onSaved);
    return () => window.removeEventListener(SAVED_EVENT, onSaved);
  }, []);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleDelete = (id: string) => {
    deleteCertificate(id);
    refresh();
  };

  return (
    <section className="w-full max-w-2xl mt-12">
      <h2 className="font-serif text-lg font-bold text-dark mb-4">
        Past certificates
      </h2>
      {list.length === 0 ? (
        <p className="text-sm text-muted bg-white rounded-xl border border-dark/8 p-6 text-center">
          No saved certificates yet. Create a certificate, then click{" "}
          <strong className="text-dark">Save</strong> to download the PDF and
          add it here.
        </p>
      ) : (
      <ul className="space-y-3">
        {list.map((cert) => (
          <li
            key={cert.id}
            className="bg-white rounded-xl border border-dark/8 p-4 shadow-sm flex flex-wrap items-center gap-3"
          >
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-gold/15 text-gold shrink-0">
              {typeLabels[cert.type]}
            </span>
            <span className="flex-1 min-w-0 font-medium text-dark truncate">
              {cert.title}
            </span>
            <span className="text-xs text-muted shrink-0">
              {format(new Date(cert.savedAt), "dd MMM yyyy")}
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href={`/certificates/${cert.id}`}
                className="text-sm font-bold text-gold hover:text-gold/80 transition-colors"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(cert.id)}
                className="text-sm text-muted hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </section>
  );
}

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <GoldiamLogo size="lg" className="mb-3" />
        <p className="text-sm text-muted tracking-[0.25em] uppercase mb-16">
          Document Management System
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {documents.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group relative bg-white rounded-xl border border-dark/8 p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-gold-border hover:-translate-y-0.5"
            >
              <div className="text-gold/70 group-hover:text-gold transition-colors mb-4">
                {doc.icon}
              </div>
              <h3 className="font-serif text-lg font-semibold text-dark mb-1.5">
                {doc.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {doc.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gold group-hover:gap-2.5 transition-all">
                Create
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <PastCertificatesList />
      </div>

      <footer className="py-6 text-center text-xs text-muted">
        {GOLDIAM_ADDRESS}
      </footer>
    </div>
  );
}
