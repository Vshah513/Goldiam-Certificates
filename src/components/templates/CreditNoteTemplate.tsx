import CertificateShell from "@/components/layout/CertificateShell";
import { CreditNoteFormData } from "@/types";
import {
  formatKSH,
  formatDate,
  calculateExpiryDate,
} from "@/lib/formatters";
import { amountToWords } from "@/lib/numberToWords";

interface CreditNoteTemplateProps {
  data: CreditNoteFormData;
}

export default function CreditNoteTemplate({ data }: CreditNoteTemplateProps) {
  const expiryDate =
    data.validityPeriod === "Custom" && data.customExpiry
      ? data.customExpiry
      : data.validityPeriod === "No expiry"
        ? null
        : data.dateIssued
          ? calculateExpiryDate(
              new Date(data.dateIssued + "T00:00:00"),
              data.validityPeriod
            )
              .toISOString()
              .split("T")[0]
          : "";

  return (
    <CertificateShell title="Credit Note">
      {/* Header info */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-[13px]">
          <p>
            <span className="text-muted">Client: </span>
            <strong className="font-calligraphy text-lg text-dark not-italic">
              {data.clientName || "________________"}
            </strong>
          </p>
          {data.clientContact && (
            <p className="text-[12px] text-muted">{data.clientContact}</p>
          )}
        </div>
        <div className="text-right text-xs">
          <p>
            <span className="text-muted">Credit Note #: </span>
            <span className="font-semibold">
              {data.creditNoteNumber || "—"}
            </span>
          </p>
          <p>
            <span className="text-muted">Date: </span>
            <span className="font-semibold">
              {data.dateIssued ? formatDate(data.dateIssued) : "—"}
            </span>
          </p>
        </div>
      </div>

      {/* Reference */}
      {data.originalReference && (
        <p className="text-[12px] mb-2">
          <span className="text-muted">With reference to: </span>
          <span className="font-medium">{data.originalReference}</span>
        </p>
      )}

      {/* Reason */}
      {data.reason && (
        <p className="text-[12px] mb-2">
          <span className="text-muted">Reason for credit: </span>
          <span className="font-medium">{data.reason}</span>
        </p>
      )}

      {/* Reason details */}
      {data.reasonDetails && (
        <p className="text-[12px] leading-relaxed text-dark/80 mb-4">
          {data.reasonDetails}
        </p>
      )}

      {/* Amount table */}
      <div className="my-4">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b-2 border-dark bg-white text-dark">
              <th className="py-1.5 px-2 text-left font-semibold">
                Description
              </th>
              <th className="py-1.5 px-2 text-right font-semibold w-32">
                Amount (KSH)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dark/10">
              <td className="py-2 px-2">
                Credit — {data.reason || "General"}
                {data.originalReference
                  ? ` (Ref: ${data.originalReference})`
                  : ""}
              </td>
              <td className="py-2 px-2 text-right font-medium">
                {data.creditAmountKSH
                  ? formatKSH(data.creditAmountKSH)
                  : "—"}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-dark font-bold">
              <td className="py-2 px-2">Total Credit</td>
              <td className="py-2 px-2 text-right">
                {data.creditAmountKSH
                  ? formatKSH(data.creditAmountKSH)
                  : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Amount in words */}
      {data.creditAmountKSH > 0 && (
        <p className="text-[11px] italic text-muted mb-4">
          ({amountToWords(data.creditAmountKSH)})
        </p>
      )}

      {/* Validity */}
      <div className="text-[12px] mb-4">
        {expiryDate === null ? (
          <p>This credit note has no expiry date.</p>
        ) : expiryDate ? (
          <p>
            This credit note is valid until{" "}
            <strong>{formatDate(expiryDate)}</strong> and may be redeemed
            against any purchase at Goldiam Jewellers.
          </p>
        ) : null}
      </div>

      {/* Terms */}
      <p className="text-[10px] leading-relaxed text-muted italic mb-6 mt-auto">
        Non-transferable. No cash value. Subject to Goldiam Jewellers&apos;
        standard terms and conditions. This credit note must be presented at
        the time of purchase.
      </p>

      {/* Signature */}
      <div className="flex justify-between items-end pt-4">
        <div className="w-44">
          <div className="border-b border-dark/30 mb-1 h-8" />
          <div className="text-[11px] text-muted">Authorised Signatory</div>
          <div className="text-[12px] font-semibold">
            {data.issuedBy || "Goldiam Jewellers"}
          </div>
        </div>
      </div>
    </CertificateShell>
  );
}
