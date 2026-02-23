"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import FormPanel from "@/components/layout/FormPanel";
import CreditNoteTemplate from "@/components/templates/CreditNoteTemplate";
import PrintButton from "@/components/PrintButton";
import ExportPDFButton from "@/components/ExportPDFButton";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextAreaField from "@/components/ui/TextAreaField";
import DateField from "@/components/ui/DateField";
import { CreditNoteFormData } from "@/types";
import { CREDIT_REASONS, VALIDITY_OPTIONS } from "@/lib/constants";
import { generateCertificateNumber } from "@/lib/certificateNumbers";
import { todayString } from "@/lib/formatters";

const CN_VALIDITY = ["6 months", "1 year", "No expiry", "Custom"] as const;

export default function CreditNotePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CreditNoteFormData>({
    clientName: "",
    clientContact: "",
    creditNoteNumber: "",
    dateIssued: todayString(),
    originalReference: "",
    reason: "",
    reasonDetails: "",
    creditAmountKSH: 0,
    validityPeriod: "6 months",
    customExpiry: "",
    issuedBy: "",
  });

  useEffect(() => {
    setData((d) => ({
      ...d,
      creditNoteNumber: generateCertificateNumber("credit-note"),
    }));
  }, []);

  const update = (field: keyof CreditNoteFormData, value: string | number) =>
    setData((d) => ({ ...d, [field]: value }));

  const docTitle = `Goldiam_CreditNote_${data.clientName || "Draft"}_${data.dateIssued}`;

  return (
    <FormPanel
      ref={certificateRef}
      actionButtons={
        <>
          <Link
            href="/"
            className="mr-auto text-sm text-muted hover:text-dark transition-colors"
          >
            &larr; Back
          </Link>
          <PrintButton contentRef={certificateRef} documentTitle={docTitle} />
          <ExportPDFButton
            contentRef={certificateRef}
            filename={`${docTitle}.pdf`}
          />
        </>
      }
      formContent={
        <>
          <h2 className="font-serif text-xl font-bold text-dark">
            Credit Note
          </h2>

          {/* Client info */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Client Name"
              value={data.clientName}
              onChange={(v) => update("clientName", v)}
              placeholder="Client full name"
              required
            />
            <FormField
              label="Client Phone / Email"
              value={data.clientContact}
              onChange={(v) => update("clientContact", v)}
              placeholder="Optional"
            />
          </div>

          {/* Credit note info */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Credit Note #"
                value={data.creditNoteNumber}
                onChange={(v) => update("creditNoteNumber", v)}
              />
              <DateField
                label="Date Issued"
                value={data.dateIssued}
                onChange={(v) => update("dateIssued", v)}
                required
              />
            </div>
            <FormField
              label="Original Order / Reference"
              value={data.originalReference}
              onChange={(v) => update("originalReference", v)}
              placeholder="e.g. Order #245 – Custom Ring"
            />
          </div>

          {/* Reason */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <SelectField
              label="Reason for Credit"
              value={data.reason}
              onChange={(v) => update("reason", v)}
              options={CREDIT_REASONS}
              required
            />
            <TextAreaField
              label="Reason Details"
              value={data.reasonDetails}
              onChange={(v) => update("reasonDetails", v)}
              placeholder="Brief explanation..."
              rows={2}
            />
          </div>

          {/* Amount & validity */}
          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Credit Amount"
              value={data.creditAmountKSH || ""}
              onChange={(v) => update("creditAmountKSH", parseFloat(v) || 0)}
              type="number"
              prefix="KSH"
              required
            />
            <SelectField
              label="Validity Period"
              value={data.validityPeriod}
              onChange={(v) => update("validityPeriod", v)}
              options={CN_VALIDITY}
            />
            {data.validityPeriod === "Custom" && (
              <DateField
                label="Custom Expiry Date"
                value={data.customExpiry}
                onChange={(v) => update("customExpiry", v)}
              />
            )}
            <FormField
              label="Issued By"
              value={data.issuedBy}
              onChange={(v) => update("issuedBy", v)}
              placeholder="Staff name"
            />
          </div>
        </>
      }
      previewContent={<CreditNoteTemplate data={data} />}
    />
  );
}
