import CertificateShell from "@/components/layout/CertificateShell";
import { VoucherFormData } from "@/types";
import { formatKSH, formatDate, calculateExpiryDate } from "@/lib/formatters";
import { amountToWords } from "@/lib/numberToWords";

interface VoucherTemplateProps {
  data: VoucherFormData;
}

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

  return (
    <CertificateShell title="Gift Voucher">
      <div className="flex flex-col items-center text-center flex-1">
        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-6 w-full max-w-xs">
          <div className="flex-1 h-px bg-gold-border" />
          <div className="w-2 h-2 rotate-45 bg-gold-border" />
          <div className="flex-1 h-px bg-gold-border" />
        </div>

        {/* Recipient */}
        <p className="text-muted text-[12px] mb-1">Presented to</p>
        <p className="font-serif text-2xl font-bold text-dark mb-4">
          {data.recipientName || "________________"}
        </p>

        {/* Occasion */}
        {data.occasion && (
          <p className="text-[12px] text-muted italic mb-4">
            On the occasion of {data.occasion}
          </p>
        )}

        {/* Amount */}
        <div className="my-4 py-4 px-8 border-y border-gold-border/40">
          <p className="font-serif text-3xl font-bold text-gold">
            {data.amountKSH ? formatKSH(data.amountKSH) : "KSH —"}
          </p>
          {data.amountKSH > 0 && (
            <p className="text-[10px] text-muted italic mt-1">
              ({amountToWords(data.amountKSH)})
            </p>
          )}
        </div>

        {/* Validity */}
        <div className="text-[12px] text-dark mb-4">
          {data.issueDate && (
            <p>
              Valid from{" "}
              <strong>{formatDate(data.issueDate)}</strong> to{" "}
              <strong>{expiryDate ? formatDate(expiryDate) : "—"}</strong>
            </p>
          )}
        </div>

        {/* Personal message */}
        {data.personalMessage && (
          <div className="max-w-sm mx-auto mb-4 py-3 px-4 bg-ivory/50 rounded">
            <p className="text-[12px] italic text-dark/70 leading-relaxed">
              &ldquo;{data.personalMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Decorative divider */}
        <div className="flex items-center gap-3 my-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-gold-border" />
          <div className="w-2 h-2 rotate-45 bg-gold-border" />
          <div className="flex-1 h-px bg-gold-border" />
        </div>

        {/* Voucher code */}
        {data.voucherCode && (
          <p className="text-[10px] font-mono tracking-wider text-muted mb-3">
            Voucher Code: {data.voucherCode}
          </p>
        )}

        {/* Terms */}
        <p className="text-[9px] text-muted leading-relaxed max-w-sm mt-auto">
          Redeemable against any purchase at Goldiam Jewellers. Non-transferable.
          Cannot be exchanged for cash. This voucher must be presented at the
          time of purchase.
        </p>
      </div>
    </CertificateShell>
  );
}
