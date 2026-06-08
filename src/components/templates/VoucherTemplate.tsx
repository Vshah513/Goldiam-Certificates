import { VoucherFormData } from "@/types";
import { formatDate, calculateExpiryDate } from "@/lib/formatters";

interface VoucherTemplateProps {
  data: VoucherFormData;
}

// The luxury gift-voucher artwork (1536×1024, 3:2). Served from /public as a
// plain path so a normal <img> renders it reliably in the print iframe and is
// captured by html2canvas during PDF export. All editable text is overlaid on
// top of this background, positioned over the artwork's blank slots.
const VOUCHER_BG = "/voucher-design.jpg";

// Tone palette sampled from the artwork so overlaid text blends with the design.
const GOLD = "#C9A24B"; // small caps labels
const CREAM = "#F2E7C8"; // recipient name / message
const CREAM_SOFT = "#E2D7B4"; // occasion / secondary
const VALUE_INK = "#2A2206"; // amount, sits on the parchment value box
const FILL_GOLD = "#E7D295"; // voucher id / valid-until values on dark

export default function VoucherTemplate({ data }: VoucherTemplateProps) {
  const expiryDate =
    data.validityPeriod === "Custom" && data.customExpiryDate
      ? data.customExpiryDate
      : data.issueDate
        ? calculateExpiryDate(
            new Date(data.issueDate + "T00:00:00"),
            data.validityPeriod
          )
            .toISOString()
            .split("T")[0]
        : "";

  const amount =
    data.amountKSH > 0 ? new Intl.NumberFormat("en-KE").format(data.amountKSH) : "";

  return (
    <div
      className="voucher-card relative w-full overflow-hidden select-none"
      style={{ aspectRatio: "1536 / 1024", containerType: "inline-size" }}
    >
      {/* Base artwork */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={VOUCHER_BG}
        alt="Goldiam gift voucher"
        loading="eager"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Recipient — top-right, balancing the logo */}
      <div
        className="absolute text-center"
        style={{ left: "54%", top: "5%", width: "37%" }}
      >
        <div
          className="font-sans"
          style={{
            color: GOLD,
            fontSize: "1.25cqw",
            fontWeight: 700,
            letterSpacing: "0.35em",
          }}
        >
          PRESENTED TO
        </div>
        <div
          className="font-serif"
          style={{
            color: CREAM,
            fontSize: "4.6cqw",
            fontWeight: 600,
            lineHeight: 1.05,
            marginTop: "0.6cqw",
          }}
        >
          {data.recipientName || "—"}
        </div>
        {data.occasion && (
          <div
            className="font-serif"
            style={{
              color: CREAM_SOFT,
              fontSize: "1.75cqw",
              fontStyle: "italic",
              marginTop: "0.4cqw",
            }}
          >
            {data.occasion}
          </div>
        )}
      </div>

      {/* Voucher value — on the parchment box's "KSH ___" line */}
      {amount && (
        <div
          className="absolute text-center font-serif"
          style={{
            left: "29%",
            top: "62.3%",
            width: "21%",
            color: VALUE_INK,
            fontSize: "3.4cqw",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {amount}
        </div>
      )}

      {/* Personal message — italic note in the open band above Voucher ID */}
      {data.personalMessage && (
        <div
          className="absolute text-center font-serif"
          style={{
            left: "57%",
            top: "59.5%",
            width: "38%",
            color: CREAM_SOFT,
            fontSize: "1.7cqw",
            fontStyle: "italic",
            lineHeight: 1.25,
          }}
        >
          {data.personalMessage}
        </div>
      )}

      {/* Voucher ID — on the "VOUCHER ID :" line */}
      {data.voucherCode && (
        <div
          className="absolute font-serif"
          style={{
            left: "73.5%",
            top: "70.6%",
            width: "21%",
            color: FILL_GOLD,
            fontSize: "1.5cqw",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {data.voucherCode}
        </div>
      )}

      {/* Valid until — on the "VALID UNTIL :" line */}
      {expiryDate && (
        <div
          className="absolute font-serif"
          style={{
            left: "73.5%",
            top: "77.2%",
            width: "22%",
            color: FILL_GOLD,
            fontSize: "1.5cqw",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {formatDate(expiryDate)}
        </div>
      )}
    </div>
  );
}
