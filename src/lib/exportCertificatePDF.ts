/**
 * Theme colors as hex so html2canvas (which doesn't support lab()/oklch from Tailwind v4) gets valid colors.
 */
const THEME_HEX = {
  white: "#ffffff",
  dark: "#1A1A1A",
  muted: "#6B7280",
  gold: "#B8960C",
  goldBorder: "#D4AF37",
  ivory: "#FDFAF4",
} as const;

/**
 * Replace lab() / oklch() / lch() in CSS text so html2canvas never parses them.
 * Uses a neutral fallback so parsing succeeds; we then override with inline hex.
 */
function sanitizeStylesheetCSS(css: string): string {
  return css
    .replace(/\blab\s*\([^)]*\)/g, "rgb(26,26,26)")
    .replace(/\boklch\s*\([^)]*\)/g, "rgb(26,26,26)")
    .replace(/\boklab\s*\([^)]*\)/g, "rgb(26,26,26)")
    .replace(/\blch\s*\([^)]*\)/g, "rgb(26,26,26)");
}

/**
 * In the cloned DOM: (1) sanitize any inline stylesheets so lab() is removed,
 * (2) set inline hex on certificate elements so computed styles are safe.
 */
function forceHexColorsOnClone(root: HTMLElement, clonedDoc: Document): void {
  const cert = root.querySelector(".certificate-shell") || root;
  const el = cert as HTMLElement;
  el.style.backgroundColor = THEME_HEX.white;

  const all = el.getElementsByTagName("*");
  for (let i = 0; i < all.length; i++) {
    const node = all[i] as HTMLElement;
    const cn = node.className || "";
    if (typeof cn !== "string") continue;
    if (/text-dark/.test(cn)) node.style.color = THEME_HEX.dark;
    if (/text-muted/.test(cn)) node.style.color = THEME_HEX.muted;
    if (/text-gold/.test(cn)) node.style.color = THEME_HEX.gold;
    if (/text-white/.test(cn)) node.style.color = THEME_HEX.white;
    if (/bg-white/.test(cn)) node.style.backgroundColor = THEME_HEX.white;
    if (/bg-dark/.test(cn)) node.style.backgroundColor = THEME_HEX.dark;
    if (/bg-gold|bg-gold-border/.test(cn)) node.style.backgroundColor = THEME_HEX.goldBorder;
    if (/bg-ivory/.test(cn)) node.style.backgroundColor = THEME_HEX.ivory;
    if (/border-gold/.test(cn)) node.style.borderColor = THEME_HEX.goldBorder;
    if (/border-dark/.test(cn)) node.style.borderColor = "rgba(26,26,26,0.3)";
  }

  try {
    const styles = clonedDoc.querySelectorAll("style");
    styles.forEach((style) => {
      if (style.textContent) style.textContent = sanitizeStylesheetCSS(style.textContent);
    });
  } catch {
    // ignore
  }
}

/**
 * Wait for every <img> inside the capture target to finish loading/decoding before
 * html2canvas snapshots it. Without this the logo (and any item photos) can be
 * missing from the exported PDF because the canvas is drawn before images render.
 */
async function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
    })
  );
  // Let the browser paint the decoded images before capture.
  await new Promise((r) => requestAnimationFrame(r));
}

/**
 * Export a certificate DOM element to PDF using html2pdf.js.
 * Forces hex colors in the clone so html2canvas doesn't fail on Tailwind v4 lab() colors.
 * If the element is hidden (e.g. on mobile when Form tab is active), clones it
 * into an off-screen visible wrapper so html2canvas can measure and render it.
 */
export async function exportCertificateToPDF(
  element: HTMLDivElement,
  filename: string
): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;

  const hasSize =
    element.offsetWidth > 0 &&
    element.offsetHeight > 0 &&
    element.getBoundingClientRect().width > 0;

  let target: HTMLDivElement = element;

  if (!hasSize) {
    const wrap = document.createElement("div");
    wrap.style.cssText =
      "position:fixed;left:-10000px;top:0;width:595px;min-height:842px;visibility:visible;overflow:visible;background:#ffffff;z-index:99999;";
    const clone = element.cloneNode(true) as HTMLDivElement;
    wrap.appendChild(clone);
    document.body.appendChild(wrap);
    target = wrap;
    await new Promise((r) => requestAnimationFrame(r));
  }

  await waitForImages(target);

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          onclone: (clonedDoc: Document, clonedElement: HTMLElement) => {
            forceHexColorsOnClone(clonedElement, clonedDoc);
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(target)
      .save();
  } finally {
    if (target !== element) {
      target.remove();
    }
  }
}
