#!/usr/bin/env python3
"""
Converts every poster in "case comp ad posters/" into a single-colour
halftone dot mask (grain size ~ how dark that spot of the source image
is) under "case comp ad posters halftone/", one PNG per source file
(same basename, always .png for the alpha channel).

The mask is colour-agnostic — solid black dots on a transparent
background — so the page can tint it any colour at runtime with a CSS
mask-image + background-color, per cluster, without regenerating it.

This is a build step (not client-side canvas) specifically so it keeps
working when the page is opened as a local file://: reading pixel data
back out of a <canvas> is blocked by the browser once the source image
came from file://, but a plain <img>/mask-image never needs to read
pixels back, so a pre-rendered mask sidesteps that entirely.

Run whenever "case comp ad posters/" changes.
"""
import os
from PIL import Image, ImageDraw
import numpy as np

SRC_DIR = "case comp ad posters"
OUT_DIR = "case comp ad posters halftone"
GRAIN = 3          # sample cell size, in output-resolution px — smaller = finer grain
LONG_SIDE = 640     # resize so the longer edge is this many px before sampling
OVERLAP = 1.18       # dots can slightly overlap so full-black areas read as solid ink


def make_mask(src_path, out_path):
    im = Image.open(src_path).convert("L")
    w, h = im.size
    scale = LONG_SIDE / max(w, h)
    w2, h2 = max(1, round(w * scale)), max(1, round(h * scale))
    im = im.resize((w2, h2), Image.LANCZOS)

    arr = np.asarray(im, dtype=np.float32)
    cols = -(-w2 // GRAIN)  # ceil div
    rows = -(-h2 // GRAIN)
    pad_h, pad_w = rows * GRAIN - h2, cols * GRAIN - w2
    if pad_h or pad_w:
        arr = np.pad(arr, ((0, pad_h), (0, pad_w)), mode="edge")
    # average luminance per GRAIN x GRAIN cell, vectorised
    cell_avg = arr.reshape(rows, GRAIN, cols, GRAIN).mean(axis=(1, 3))

    out = Image.new("RGBA", (w2, h2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(out)
    max_r = (GRAIN / 2) * OVERLAP
    for row in range(rows):
        cy = row * GRAIN + GRAIN / 2
        for col in range(cols):
            lum = cell_avg[row, col] / 255.0
            r = max_r * (1 - lum)
            if r < 0.4:
                continue
            cx = col * GRAIN + GRAIN / 2
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 0, 0, 255))

    out.save(out_path, "PNG", optimize=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC_DIR) if not f.startswith("."))
    for i, fname in enumerate(files, 1):
        # keep the full original filename (extension included) rather than
        # stripping it — several posters share a basename across different
        # extensions (goldspot.jpg vs goldspot.jpeg are different posters)
        # and stripping would collide their masks together
        out_path = os.path.join(OUT_DIR, fname + ".png")
        make_mask(os.path.join(SRC_DIR, fname), out_path)
        if i % 20 == 0 or i == len(files):
            print(f"{i}/{len(files)}  {fname} -> {out_path}")


if __name__ == "__main__":
    main()
