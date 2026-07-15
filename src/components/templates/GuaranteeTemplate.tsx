import { ReactNode } from "react";
import CertificateShell from "@/components/layout/CertificateShell";
import SignatureBlock from "@/components/templates/SignatureBlock";
import { GuaranteeFormData, Stone } from "@/types";
import { formatDate } from "@/lib/formatters";

interface GuaranteeTemplateProps {
  data: GuaranteeFormData;
}

export default function GuaranteeTemplate({ data }: GuaranteeTemplateProps) {
  const stones = getStones(data);

  // Metal fields are all optional — only keep the ones actually filled in, and
  // hide the whole section if metal is on but nothing has been entered yet.
  const metalFields = [
    { label: "Metal Type", value: data.metalType },
    { label: "Colour", value: data.metalColour },
    { label: "Purity", value: data.goldPurity },
    {
      label: "Total Weight",
      value: data.totalMetalWeight ? `${data.totalMetalWeight}g` : "",
    },
  ].filter((f) => f.value);
  const showMetal = (data.hasMetal ?? true) && metalFields.length > 0;

  // Only render an optional column when at least one stone has a value for it.
  const stoneColumns = STONE_COLUMNS.filter((col) =>
    col.always ? true : stones.some((s) => col.hasValue(s))
  );
  // Show the stone table only once at least one real detail has been entered,
  // so an empty "Has Stones" toggle doesn't print a lone row-number column.
  const showStones =
    data.hasStones && stones.length > 0 && stoneColumns.length > 1;

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
        <strong className="font-calligraphy calligraphy-inline text-xl text-dark not-italic">
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
      {showMetal && (
        <div className="mb-4">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold mb-2">
            Metal Details
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
            {metalFields.map((f) => (
              <DetailRow key={f.label} label={f.label} value={f.value} />
            ))}
          </div>
        </div>
      )}

      {/* Stone details */}
      {showStones && (
        <div className="mb-4">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-gold mb-2">
            Stone Details
          </h3>
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="border-b-2 border-dark text-dark">
                {stoneColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-1 px-1.5 font-semibold ${
                      col.align === "right" ? "text-right" : "text-left"
                    } ${col.key === "index" ? "w-6" : ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stones.map((stone, idx) => (
                <tr key={idx} className="border-b border-dark/10">
                  {stoneColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-1.5 px-1.5 ${
                        col.align === "right" ? "text-right" : ""
                      } ${col.cellClass ?? ""}`}
                    >
                      {col.cell(stone, idx)}
                    </td>
                  ))}
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
        <SignatureBlock
          showSignature={data.showSignature}
          signatureScale={data.signatureScale}
          label="Authorised Signatory"
          name="Goldiam Jewellers"
        />
      </div>
    </CertificateShell>
  );
}

interface StoneColumn {
  key: string;
  header: string;
  align?: "left" | "right";
  cellClass?: string;
  /** Column always renders (e.g. the row number); others hide when empty for every stone. */
  always?: boolean;
  hasValue: (s: Stone) => boolean;
  cell: (s: Stone, idx: number) => ReactNode;
}

// Optional columns render only when at least one stone fills them, so a blank
// field (e.g. clarity left empty) drops out of the printout entirely.
const STONE_COLUMNS: StoneColumn[] = [
  {
    key: "index",
    header: "#",
    always: true,
    hasValue: () => true,
    cell: (_s, idx) => <span className="text-muted">{idx + 1}</span>,
    cellClass: "text-muted",
  },
  {
    key: "name",
    header: "Stone",
    hasValue: (s) => !!s.stoneName,
    cell: (s) => <span className="font-medium">{s.stoneName}</span>,
  },
  {
    key: "type",
    header: "Type",
    hasValue: (s) => !!s.stoneType,
    cell: (s) => s.stoneType,
  },
  {
    key: "weight",
    header: "Wt (CT)",
    align: "right",
    cellClass: "whitespace-nowrap",
    hasValue: (s) => !!s.stoneWeight,
    cell: (s) =>
      s.stoneWeight
        ? `${s.approxWeight ? "Approx. " : ""}${s.stoneWeight}`
        : "",
  },
  {
    key: "shape",
    header: "Shape",
    hasValue: (s) => !!s.stoneShape,
    cell: (s) => s.stoneShape,
  },
  {
    key: "count",
    header: "No.",
    align: "right",
    hasValue: (s) => !!s.numberOfStones,
    cell: (s) => (s.numberOfStones ? s.numberOfStones : ""),
  },
  {
    key: "colour",
    header: "Colour",
    hasValue: (s) => !!s.stoneColour,
    cell: (s) => s.stoneColour,
  },
  {
    key: "clarity",
    header: "Clarity",
    hasValue: (s) => !!s.stoneClarity,
    cell: (s) => s.stoneClarity,
  },
];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="text-muted w-28 shrink-0">{label}:</span>
      <span className="font-medium">{value}</span>
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
