import CertificateShell from "@/components/layout/CertificateShell";
import { ValuationFormData } from "@/types";
import { formatKSH, formatDate } from "@/lib/formatters";
import { amountToWords } from "@/lib/numberToWords";

interface ValuationTemplateProps {
  data: ValuationFormData;
}

export default function ValuationTemplate({ data }: ValuationTemplateProps) {
  const total = data.items.reduce((sum, item) => sum + (item.valueKSH || 0), 0);

  return (
    <CertificateShell title="Valuation Certificate">
      {/* Date */}
      <div className="text-right text-xs mb-4">
        <span className="text-muted">Date: </span>
        <span className="font-semibold">
          {data.date ? formatDate(data.date) : "—"}
        </span>
        <br />
        <span className="text-muted">Certificate No: </span>
        <span className="font-semibold">{data.certificateNumber || "—"}</span>
      </div>

      {/* Salutation */}
      <p className="font-serif text-base font-semibold mb-3">
        To Whom It May Concern
      </p>

      {/* Client intro */}
      <p className="mb-3 text-[13px] leading-relaxed">
        The following item(s) belonging to{" "}
        <strong className="font-calligraphy text-xl text-dark not-italic">
          {data.clientName || "________________"}
        </strong>{" "}
        have been examined and valued by us for insurance replacement purposes.
      </p>

      {/* Disclaimer */}
      <p className="mb-4 text-[11px] leading-relaxed text-muted italic">
        The values stated herein represent the estimated retail replacement
        value for insurance purposes only. This valuation does not constitute
        an offer to purchase or sell. Goldiam Jewellers accepts no liability
        for any loss or damage arising from reliance on this valuation.
      </p>

      {/* Items table */}
      <div className="mb-3">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b-2 border-dark bg-white text-dark">
              <th className="py-1.5 px-2 text-left font-semibold w-8">#</th>
              <th className="py-1.5 px-2 text-left font-semibold">
                Description
              </th>
              <th className="py-1.5 px-2 text-right font-semibold w-28">
                Value (KSH)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => {
              const descParts: string[] = [];
              if (item.description) descParts.push(item.description);
              if (item.metal) descParts.push(item.metal);
              if (item.metalColour) descParts.push(`${item.metalColour} Gold`);
              if (item.stoneType && item.stoneWeight)
                descParts.push(
                  `${item.stoneType} (${item.stoneWeight} CT)`
                );
              if (item.numberOfDiamonds > 0)
                descParts.push(
                  `${item.numberOfDiamonds} ${item.diamondType || ""} Diamond${item.numberOfDiamonds > 1 ? "s" : ""}`
                );

              const description = descParts.join(" — ") || "—";

              return (
                <tr
                  key={idx}
                  className="border-b border-dark/10"
                >
                  <td className="py-2 px-2 text-muted">{idx + 1}</td>
                  <td className="py-2 px-2">{description}</td>
                  <td className="py-2 px-2 text-right font-medium">
                    {item.valueKSH ? formatKSH(item.valueKSH) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-dark font-bold">
              <td className="py-2 px-2" colSpan={2}>
                Total
              </td>
              <td className="py-2 px-2 text-right">{formatKSH(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Amount in words */}
      {total > 0 && (
        <p className="text-[11px] italic text-muted mb-6">
          ({amountToWords(total)})
        </p>
      )}

      {/* Signature */}
      <div className="mt-auto pt-6">
        <div className="w-48">
          <div className="border-b border-dark/30 mb-1 h-8" />
          <div className="text-[11px] text-muted">Authorised Valuer</div>
          <div className="text-[12px] font-semibold">
            {data.valuerName || "Goldiam Jewellers"}
          </div>
        </div>
      </div>
    </CertificateShell>
  );
}
