import { VoucherFormData } from "@/types";
import { formatKSH, formatDate, calculateExpiryDate } from "@/lib/formatters";
import GoldiamLogo from "@/components/GoldiamLogo";

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
    <div className="voucher-panel-layout flex w-full min-h-[360px] sm:min-h-[420px] print:min-h-[297mm] bg-white border-2 border-gold-border overflow-hidden">
      {/* Left panel – maroon with calligraphy title */}
      <div className="w-[38%] min-h-[320px] sm:min-h-[380px] bg-[#6B2D2D] flex flex-col items-center justify-end py-8 px-4">
        {/* Decorative grid placeholder (2x2) – optional product image area */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-[140px] mb-6 flex-1 place-content-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square border border-white/30 bg-white/5 rounded-sm"
              aria-hidden
            />
          ))}
        </div>
        <p className="font-calligraphy text-2xl sm:text-3xl text-white text-center leading-relaxed">
          Gift Voucher for You
        </p>
      </div>

      {/* Right panel – white with details */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 min-w-0">
        {/* Top row: amount tag + logo */}
        <div className="flex items-start justify-between gap-4 mb-6">
          {/* Amount / discount tag */}
          <div className="flex flex-col items-center">
            <div className="bg-gold/20 border border-gold rounded-lg px-4 py-2 text-center">
              <p className="text-lg font-bold text-dark">
                {data.amountKSH ? formatKSH(data.amountKSH) : "KSH —"}
              </p>
              <p className="text-[10px] text-muted mt-0.5">OFF</p>
            </div>
          </div>
          {/* Company branding */}
          <div className="bg-dark text-white px-4 py-3 rounded flex flex-col items-center shrink-0">
            <GoldiamLogo size="sm" />
            <p className="text-[9px] text-white/80 mt-1 uppercase tracking-wider">
              Jewellers
            </p>
          </div>
        </div>

        {/* Voucher details – no content below Valid Till */}
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-xs text-muted mb-0.5">Gift Voucher No.</p>
            <p className="font-mono font-semibold text-dark border border-dark/20 rounded px-3 py-1.5 inline-block">
              {data.voucherCode || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">To</p>
            <p className="font-calligraphy text-xl text-dark border-b border-dark/30 pb-0.5 min-h-[1.5rem]">
              {data.recipientName || "________________"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Date</p>
            <p className="text-sm font-medium text-dark border-b border-dark/30 pb-0.5 min-h-[1.5rem]">
              {data.issueDate ? formatDate(data.issueDate) : "________________"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Valid Till</p>
            <p className="text-sm font-medium text-dark border-b border-dark/30 pb-0.5 min-h-[1.5rem]">
              {expiryDate ? formatDate(expiryDate) : "________________"}
            </p>
          </div>
        </div>

        {/* Occasion line if present */}
        {data.occasion && (
          <p className="text-xs text-muted italic mt-4">
            On the occasion of {data.occasion}
          </p>
        )}
      </div>
    </div>
  );
}
