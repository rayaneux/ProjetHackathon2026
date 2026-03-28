"""Retire le fond blanc (ou très clair) du logo CentraleSupélec PNG."""
from PIL import Image
import os

root = os.path.join(os.path.dirname(__file__), "..")
path = os.path.normpath(os.path.join(root, "public", "logos", "centrale-supelec.png"))

im = Image.open(path).convert("RGBA")
p = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, _a = p[x, y]
        span = max(r, g, b) - min(r, g, b)
        if r > 238 and g > 238 and b > 238 and span < 25:
            p[x, y] = (0, 0, 0, 0)
        elif r + g + b > 715 and span < 18:
            p[x, y] = (0, 0, 0, 0)

bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)
    padded = Image.new("RGBA", (im.width + 32, im.height + 16), (0, 0, 0, 0))
    padded.paste(im, (16, 8), im)
    im = padded

im.save(path, "PNG")
print("OK", path, im.size)
