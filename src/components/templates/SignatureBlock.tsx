interface SignatureBlockProps {
  /** Whether to overlay the e-signature image on the signing line. */
  showSignature?: boolean;
  /** Caption under the line, e.g. "Authorised Valuer". */
  label: string;
  /** Name under the caption, e.g. "Goldiam Jewellers". */
  name: string;
  /** Width of the block. Defaults to w-48. */
  widthClassName?: string;
  /** Signature size as a percentage of the base height (100 = default). */
  signatureScale?: number;
}

// Served from /public as a plain path (no spaces) so a normal <img> renders it
// reliably in the print iframe and is captured by html2canvas during PDF export.
const SIGNATURE_SRC = "/signature.png";

// Base height (px) of the signature at 100%. Scaled by `signatureScale`.
const BASE_SIGNATURE_HEIGHT = 48;

/**
 * The authorised-signatory area on a certificate: a signing space, a line, a
 * caption, and the signatory name. When `showSignature` is on, the saved
 * e-signature is overlaid so it sits on the line, like a hand signature.
 */
export default function SignatureBlock({
  showSignature = false,
  label,
  name,
  widthClassName = "w-48",
  signatureScale = 100,
}: SignatureBlockProps) {
  const sigHeight = (BASE_SIGNATURE_HEIGHT * signatureScale) / 100;
  // The signing space grows with the signature, but never shrinks below the
  // default blank-line height so the layout stays consistent.
  const boxHeight = Math.max(BASE_SIGNATURE_HEIGHT, sigHeight + 4);
  return (
    <div className={widthClassName}>
      <div className="relative mb-1" style={{ height: boxHeight }}>
        {showSignature && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={SIGNATURE_SRC}
            alt="Authorised signature"
            loading="eager"
            decoding="sync"
            className="absolute bottom-1 left-2 w-auto object-contain object-left-bottom"
            style={{ height: sigHeight }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 border-b border-dark/30" />
      </div>
      <div className="text-[11px] text-muted">{label}</div>
      <div className="text-[12px] font-semibold">{name}</div>
    </div>
  );
}
