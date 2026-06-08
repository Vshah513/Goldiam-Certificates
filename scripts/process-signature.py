#!/usr/bin/env python3
"""
Turn a photo/scan of a hand signature into a clean transparent PNG for the
certificates.

  python3 scripts/process-signature.py <input-image> [output.png]

Default output: public/signature.png

What it does:
  - removes the light paper background (makes it transparent)
  - keeps the ink, with anti-aliased (soft) edges so it looks professional
  - auto-crops to the signature with a little padding
  - downscales to a sensible width for crisp print/PDF output
"""

import sys
import os
from PIL import Image

# Luminance thresholds (0-255). Pixels brighter than HI are treated as paper
# (fully transparent); darker than LO are solid ink; in between fade smoothly.
HI = 155
LO = 85
MAX_WIDTH = 700  # output width cap; height scales proportionally
PAD = 12         # px of transparent padding around the cropped signature


def luminance(r: int, g: int, b: int) -> float:
    return 0.299 * r + 0.587 * g + 0.114 * b


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    src = sys.argv[1]
    here = os.path.dirname(os.path.abspath(__file__))
    default_out = os.path.join(here, "..", "public", "signature.png")
    out = sys.argv[2] if len(sys.argv) > 2 else default_out

    img = Image.open(src).convert("RGBA")

    # Downscale early so per-pixel work stays fast.
    if img.width > MAX_WIDTH:
        h = round(img.height * MAX_WIDTH / img.width)
        img = img.resize((MAX_WIDTH, h), Image.LANCZOS)

    px = img.load()
    span = max(1, HI - LO)
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, _ = px[x, y]
            lum = luminance(r, g, b)
            if lum >= HI:
                alpha = 0
            elif lum <= LO:
                alpha = 255
            else:
                alpha = int(round((HI - lum) / span * 255))
            px[x, y] = (r, g, b, alpha)

    # Auto-crop to the non-transparent content, then pad.
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        padded = Image.new("RGBA", (img.width + 2 * PAD, img.height + 2 * PAD), (0, 0, 0, 0))
        padded.paste(img, (PAD, PAD))
        img = padded

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    img.save(out)
    print(f"Saved {out}  ({img.width}x{img.height})")


if __name__ == "__main__":
    main()
