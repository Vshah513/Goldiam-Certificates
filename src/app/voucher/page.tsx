"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import FormPanel from "@/components/layout/FormPanel";
import VoucherTemplate from "@/components/templates/VoucherTemplate";
import PrintButton from "@/components/PrintButton";
import ExportPDFButton from "@/components/ExportPDFButton";
import SaveCertificateButton from "@/components/SaveCertificateButton";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextAreaField from "@/components/ui/TextAreaField";
import DateField from "@/components/ui/DateField";
import { VoucherFormData } from "@/types";
import { VALIDITY_OPTIONS } from "@/lib/constants";
import { generateCertificateNumber } from "@/lib/certificateNumbers";
import { todayString } from "@/lib/formatters";

const CURRENCY_OPTIONS = ["KSH", "USD", "Other"] as const;

function generateVoucherCode(name: string): string {
  const year = new Date().getFullYear();
  const first = name.trim().split(/\s+/)[0]?.toUpperCase() || "GUEST";
  return `GLD-${year}-${first}`;
}

export default function VoucherPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<VoucherFormData>({
    recipientName: "",
    occasion: "",
    amountKSH: 0,
    currency: "KSH",
    customCurrency: "",
    issuedBy: "",
    issueDate: todayString(),
    validityPeriod: "6 months",
    customExpiryDate: "",
    voucherCode: "",
    personalMessage: "",
  });

  useEffect(() => {
    setData((d) => ({
      ...d,
      voucherCode: generateVoucherCode(d.recipientName),
    }));
  }, []);

  const update = (field: keyof VoucherFormData, value: string | number) => {
    setData((d) => {
      const next = { ...d, [field]: value };
      if (field === "recipientName" && typeof value === "string") {
        next.voucherCode = generateVoucherCode(value);
      }
      if (field === "currency" && value !== "Other") {
        next.customCurrency = "";
      }
      return next;
    });
  };

  const docTitle = `Goldiam_Voucher_${data.recipientName || "Draft"}_${data.issueDate}`;

  // The voucher artwork is landscape (3:2) — print/export it on a landscape page.
  const voucherPageStyle = `@page { size: A4 landscape; margin: 0; } [class*="max-w-"] { max-width: none !important; }`;

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
          <PrintButton
            contentRef={certificateRef}
            documentTitle={docTitle}
            pageStyle={voucherPageStyle}
          />
          <SaveCertificateButton
            contentRef={certificateRef}
            filename={`${docTitle}.pdf`}
            certificateType="voucher"
            formData={data}
            title={`Voucher – ${data.recipientName || "Draft"} – ${data.issueDate}`}
            orientation="landscape"
          />
          <ExportPDFButton
            contentRef={certificateRef}
            filename={`${docTitle}.pdf`}
            orientation="landscape"
          />
        </>
      }
      formContent={
        <>
          <h2 className="font-serif text-xl font-bold text-dark">
            Gift Voucher
          </h2>

          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Recipient Name"
              value={data.recipientName}
              onChange={(v) => update("recipientName", v)}
              placeholder="e.g. Binal"
              required
            />
            <FormField
              label="Occasion"
              value={data.occasion}
              onChange={(v) => update("occasion", v)}
              placeholder="e.g. Birthday, Anniversary, Wedding"
            />
            <FormField
              label="Amount"
              value={data.amountKSH || ""}
              onChange={(v) => update("amountKSH", parseFloat(v) || 0)}
              type="number"
              prefix={data.currency === "Other" ? data.customCurrency || "CUR" : data.currency}
              required
            />
            <SelectField
              label="Currency"
              value={data.currency}
              onChange={(v) => update("currency", v)}
              options={CURRENCY_OPTIONS}
              required
            />
            {data.currency === "Other" && (
              <FormField
                label="Custom Currency"
                value={data.customCurrency}
                onChange={(v) => update("customCurrency", v.toUpperCase())}
                placeholder="e.g. EUR, GBP, AED"
                required
              />
            )}
          </div>

          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Issued By"
              value={data.issuedBy}
              onChange={(v) => update("issuedBy", v)}
              placeholder="Staff name"
            />
            <DateField
              label="Issue Date"
              value={data.issueDate}
              onChange={(v) => update("issueDate", v)}
              required
            />
            <SelectField
              label="Validity Period"
              value={data.validityPeriod}
              onChange={(v) => update("validityPeriod", v)}
              options={VALIDITY_OPTIONS}
            />
            {data.validityPeriod === "Custom" && (
              <DateField
                label="Custom Expiry Date"
                value={data.customExpiryDate}
                onChange={(v) => update("customExpiryDate", v)}
              />
            )}
          </div>

          <div className="space-y-4 p-4 bg-white rounded-lg border border-dark/10">
            <FormField
              label="Voucher Code"
              value={data.voucherCode}
              onChange={(v) => update("voucherCode", v)}
            />
            <TextAreaField
              label="Personal Message (optional)"
              value={data.personalMessage}
              onChange={(v) => update("personalMessage", v)}
              placeholder="A personal note for the recipient..."
              rows={3}
            />
          </div>
        </>
      }
      previewContent={<VoucherTemplate data={data} />}
    />
  );
}
