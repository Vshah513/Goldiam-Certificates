const PREFIXES: Record<string, string> = {
  valuation: "VAL",
  guarantee: "GC",
  voucher: "GV",
  "credit-note": "CN",
};

export function generateCertificateNumber(docType: string): string {
  const prefix = PREFIXES[docType] || "DOC";
  const year = new Date().getFullYear();
  const seq = getNextSequence(prefix, year);
  return `${prefix}-${year}-${String(seq).padStart(3, "0")}`;
}

function getNextSequence(prefix: string, year: number): number {
  if (typeof window === "undefined") return 1;
  const key = `goldiam_seq_${prefix}_${year}`;
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
}
