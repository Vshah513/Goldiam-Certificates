export type CertificateType =
  | "valuation"
  | "guarantee"
  | "voucher"
  | "credit-note";

export interface SavedCertificate {
  id: string;
  type: CertificateType;
  title: string;
  savedAt: string;
  formData: object;
}

const STORAGE_KEY = "goldiam-saved-certificates";
const MAX_ENTRIES = 50;

function readList(): SavedCertificate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedCertificate[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(list: SavedCertificate[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed =
      list.length > MAX_ENTRIES ? list.slice(0, MAX_ENTRIES) : list;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function getSavedCertificates(): SavedCertificate[] {
  const list = readList();
  return [...list].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

export function saveCertificate(
  type: CertificateType,
  formData: object,
  title: string
): SavedCertificate {
  const list = readList();
  const entry: SavedCertificate = {
    id: crypto.randomUUID(),
    type,
    title: title || `${type} – ${new Date().toISOString().slice(0, 10)}`,
    savedAt: new Date().toISOString(),
    formData: JSON.parse(JSON.stringify(formData)),
  };
  const next = [entry, ...list];
  writeList(next);
  return entry;
}

export function getCertificateById(id: string): SavedCertificate | null {
  const list = readList();
  return list.find((c) => c.id === id) ?? null;
}

export function deleteCertificate(id: string): void {
  const list = readList().filter((c) => c.id !== id);
  writeList(list);
}

export const SAVED_EVENT = "goldiam-certificate-saved";

export function dispatchSavedEvent(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SAVED_EVENT));
}
