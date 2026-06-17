import { format, addMonths } from "date-fns";

export function formatKSH(amount: number): string {
  return `KSH ${new Intl.NumberFormat("en-KE").format(amount)}`;
}

export function resolveCurrency(
  currency?: string,
  customCurrency?: string,
  fallback = "KSH"
): string {
  if (currency === "Other") {
    return customCurrency?.trim() || "CUR";
  }
  return currency?.trim() || fallback;
}

export function formatCurrency(
  amount: number,
  currency?: string,
  customCurrency?: string
): string {
  const activeCurrency = resolveCurrency(currency, customCurrency);
  return `${activeCurrency} ${new Intl.NumberFormat("en-KE").format(amount)}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const day = d.getDate();
  const suffix = getOrdinalSuffix(day);
  return `${day}${suffix} ${format(d, "MMMM, yyyy")}`;
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  return format(d, "dd/MM/yyyy");
}

export function calculateExpiryDate(issueDate: Date, period: string): Date {
  switch (period) {
    case "3 months":
      return addMonths(issueDate, 3);
    case "6 months":
      return addMonths(issueDate, 6);
    case "1 year":
      return addMonths(issueDate, 12);
    default:
      return addMonths(issueDate, 6);
  }
}

export function todayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
