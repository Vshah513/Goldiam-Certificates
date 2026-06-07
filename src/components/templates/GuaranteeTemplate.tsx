import CertificateShell from "@/components/layout/CertificateShell";
import { GuaranteeFormData, Stone } from "@/types";
import { formatDate } from "@/lib/formatters";

interface GuaranteeTemplateProps {
  data: GuaranteeFormData;
}

export default function GuaranteeTemplate({ data }: GuaranteeTemplateProps) {
  const stones = getStones(data);
  const showStones = data.hasStones && stones.length > 0;

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
        <strong className="font-calligraphy text-lg text-dark not-italic">
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
      {showStones && (
        <div className="mb-4">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold mb-2">
            Stone Details
          </h3>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b-2 border-dark text-dark">
                <th className="py-1 px-1.5 text-left font-semibold w-6">#</th>
                <th className="py-1 px-1.5 text-left font-semibold">Stone</th>
                <th className="py-1 px-1.5 text-left font-semibold">Type</th>
                <th className="py-1 px-1.5 text-right font-semibold">Wt (CT)</th>
                <th className="py-1 px-1.5 text-left font-semibold">Shape</th>
                <th className="py-1 px-1.5 text-right font-semibold">No.</th>
                <th className="py-1 px-1.5 text-left font-semibold">Colour</th>
                <th className="py-1 px-1.5 text-left font-semibold">Clarity</th>
              </tr>
            </thead>
            <tbody>
              {stones.map((stone, idx) => (
                <tr key={idx} className="border-b border-dark/10">
                  <td className="py-1.5 px-1.5 text-muted">{idx + 1}</td>
                  <td className="py-1.5 px-1.5 font-medium">
                    {stone.stoneName || "—"}
                  </td>
                  <td className="py-1.5 px-1.5">{stone.stoneType || "—"}</td>
                  <td className="py-1.5 px-1.5 text-right">
                    {stone.stoneWeight ? stone.stoneWeight : "—"}
                  </td>
                  <td className="py-1.5 px-1.5">{stone.stoneShape || "—"}</td>
                  <td className="py-1.5 px-1.5 text-right">
                    {stone.numberOfStones ? stone.numberOfStones : "—"}
                  </td>
                  <td className="py-1.5 px-1.5">{stone.stoneColour || "—"}</td>
                  <td className="py-1.5 px-1.5">{stone.stoneClarity || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

/**
 * Returns the stones to render. Prefers the new `stones` array; falls back to the
 * legacy single-stone fields so certificates saved before multi-stone support
 * still display correctly.
 */
function getStones(data: GuaranteeFormData): Stone[] {
  if (data.stones && data.stones.length > 0) return data.stones;
  if (data.stoneName || data.stoneType || data.stoneWeight) {
    return [
      {
        stoneName: data.stoneName ?? "",
        stoneType: data.stoneType ?? "",
        stoneWeight: data.stoneWeight ?? 0,
        stoneShape: data.stoneShape ?? "",
        numberOfStones: data.numberOfStones ?? 0,
        stoneColour: data.stoneColour ?? "",
        stoneClarity: data.stoneClarity ?? "",
      },
    ];
  }
  return [];
}
