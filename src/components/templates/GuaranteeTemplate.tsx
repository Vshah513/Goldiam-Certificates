import CertificateShell from "@/components/layout/CertificateShell";
import { GuaranteeFormData } from "@/types";
import { formatDate } from "@/lib/formatters";

interface GuaranteeTemplateProps {
  data: GuaranteeFormData;
}

export default function GuaranteeTemplate({ data }: GuaranteeTemplateProps) {
  return (
    <CertificateShell title="Certificate of Guarantee">
      {/* Date & Cert number */}
      <div className="text-right text-xs mb-4">
        <span className="text-muted">Date: </span>
        <span className="font-semibold">
          {data.date ? formatDate(data.date) : "—"}
        </span>
        <br />
        <span className="text-muted">Certificate No: </span>
        <span className="font-semibold">{data.certificateNumber || "—"}</span>
      </div>

      {/* Client */}
      <p className="mb-2 text-[13px]">
        <span className="text-muted">Issued to: </span>
        <strong className="uppercase">
          {data.clientName || "________________"}
        </strong>
      </p>

      {/* Guarantee statement */}
      <p className="mb-4 text-[13px] leading-relaxed">
        Goldiam Jewellers hereby certifies that the item described herein has
        been carefully examined and the following details are guaranteed to be
        accurate as of the date of issue.
      </p>

      {/* Item description */}
      {data.itemDescription && (
        <p className="mb-4 text-[13px]">
          <span className="text-muted">Item: </span>
          <span className="font-medium">{data.itemDescription}</span>
        </p>
      )}

      {/* Metal details */}
      <div className="mb-4">
        <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold mb-2">
          Metal Details
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
          <DetailRow label="Metal Type" value={data.metalType} />
          <DetailRow label="Colour" value={data.metalColour} />
          <DetailRow label="Purity" value={data.goldPurity} />
          <DetailRow
            label="Total Weight"
            value={data.totalMetalWeight ? `${data.totalMetalWeight}g` : ""}
          />
        </div>
      </div>

      {/* Stone details */}
      {data.hasStones && (
        <div className="mb-4">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold mb-2">
            Stone Details
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
            <DetailRow label="Stone" value={data.stoneName} />
            <DetailRow label="Type" value={data.stoneType} />
            <DetailRow
              label="Weight"
              value={data.stoneWeight ? `${data.stoneWeight} CT` : ""}
            />
            <DetailRow label="Shape" value={data.stoneShape} />
            <DetailRow
              label="Number of Stones"
              value={
                data.numberOfStones ? String(data.numberOfStones) : ""
              }
            />
            <DetailRow label="Colour" value={data.stoneColour} />
            <DetailRow label="Clarity" value={data.stoneClarity} />
          </div>
        </div>
      )}

      {/* Additional notes */}
      {data.additionalNotes && (
        <div className="mb-4">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold mb-2">
            Additional Notes
          </h3>
          <p className="text-[12px] leading-relaxed">{data.additionalNotes}</p>
        </div>
      )}

      {/* Terms */}
      <p className="text-[10px] leading-relaxed text-muted italic mb-6 mt-auto">
        This guarantee certifies the quality and authenticity of the materials
        described above. It does not cover damage resulting from misuse,
        accidents, or unauthorised alterations. This certificate is the
        property of Goldiam Jewellers and must be presented for any warranty
        claims.
      </p>

      {/* Signature */}
      <div className="pt-4">
        <div className="w-48">
          <div className="border-b border-dark/30 mb-1 h-8" />
          <div className="text-[11px] text-muted">Authorised Signatory</div>
          <div className="text-[12px] font-semibold">Goldiam Jewellers</div>
        </div>
      </div>
    </CertificateShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="text-muted w-28 shrink-0">{label}:</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
