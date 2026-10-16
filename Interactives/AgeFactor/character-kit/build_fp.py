# Builds the Age Factor characters from the layered parts in "FP survey characters/".
# Every part is a 1000x1000 transparent PNG drawn in place, so a character is just a stack:
#   base face (skin) -> shirt -> expression -> specs -> hair -> beard/moustache (on top, so long hair never hides it)
# Hair and beards are drawn as plain shapes and recoloured here by age: black, then grey, then white.
#
# Run after adding or changing parts (needs Pillow: pip3 install pillow):
#   python3 character-kit/build_fp.py
#
# Writes:
#   imgs/characters/fp/web/<id>.png   480px portraits of the story's characters, transparent (the page draws the background)
#   imgs/characters/fp/cut/<id>.png   128px head-and-shoulders cut-outs of the same, for the chart squares
#   imgs/characters/fp/layers/*.png   the parts themselves, pre-coloured (6 skins; hair and beards in 5 greys), at 500px.
#                                     The reader's own character is stacked from these on the page, so any combination works.
#   scripts/fp-characters.js          the list of characters and layers, read by scripts/characters.js
#   character-kit/fp-characters.html a contact sheet of everything generated
import glob, json, os, random
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PARTS = os.path.join(HERE, 'FP survey characters')
OUT = os.path.join(ROOT, 'imgs', 'characters', 'fp')

PER_DECADE = 10           # half female-presenting, half male-presenting
FILL_NECK = True          # the base face's neck is white; paint it the skin colour
DECADE_AGE = [16, 25, 35, 45, 55, 65, 75]
DECADES = ['Teens', '20s', '30s', '40s', '50s', '60s', '70s+']

INK = (0, 0, 0)
BASE_SKIN = (208, 139, 91)  # the skin colour drawn in Base Face.png
SKINS = [(246, 214, 189), (232, 185, 146), (208, 139, 91), (176, 112, 70), (140, 86, 52), (98, 60, 36)]  # lightest to deepest
HAIR_COLOURS = [(35, 26, 21), (66, 56, 50), (128, 121, 115), (184, 178, 172), (240, 237, 232)]           # black to white

def hair_tone(age):
    """Index into HAIR_COLOURS: black to the late 30s, then dark grey, grey, light grey, white."""
    return 0 if age < 38 else 1 if age < 48 else 2 if age < 58 else 3 if age < 68 else 4

# Parts. Hair: 1-2 long waves, 3 braid, 4 bun, 5 curls, 6 bob, 7 short curls, 8 short, 9 quiff, 10 balding; 0 = bald.
# Faces: 1 big eyes (teens), 2-3 grins, 4 smile, 5 happy, 6 open mouth, 7 content, 8 worried.
OPEN_MOUTH = {2, 3, 6}       # beards cover these mouths, so they never get one
BIG_EYES = {1, 2, 3}         # Face1 has its own glasses; specs clash with the big eyes of 2 and 3
TEEN_FACE = 1                # everyone 13-19 gets the big eyes
MOOD = {1: 'smile', 2: 'joy', 3: 'joy', 4: 'smile', 5: 'joy', 6: 'neutral', 7: 'smile', 8: 'worried'}
SHIRTS = [1, 2, 3, 4, 5, 6]
BEARDS = ['Beard1', 'Beard2', 'Beard3', 'Moustache']
LONG_STYLES = {1, 2, 3, 4, 5, 6}

def options(decade, fem):
    """Hairstyles and faces that suit a decade. Every style shows up somewhere; later decades lean shorter."""
    if fem:
        hair = [1, 2, 3, 5, 6, 4, 7] if decade <= 2 else [6, 4, 1, 3, 5, 7, 2] if decade <= 4 else [4, 6, 3, 7, 4]
    else:
        hair = [7, 8, 9, 4, 5] if decade <= 1 else [8, 7, 9, 10, 4, 5] if decade <= 3 else [10, 8, 0, 9, 7] if decade <= 4 else [10, 0, 10, 8, 4]
    faces = [TEEN_FACE] if decade == 0 else [4, 5, 3, 6, 8, 2, 7] if decade <= 3 else [4, 7, 5, 8, 6] if decade <= 4 else [7, 4, 8, 5, 7]  # big eyes only for teens
    return hair, faces

def recipe(decade, i, rng):
    fem = i % 2 == 0
    hairs, faces = options(decade, fem)
    hair = hairs[(i // 2 + decade) % len(hairs)]
    face = faces[(i + decade * 3) % len(faces)]
    beard = None
    if not fem and decade >= 1 and face not in OPEN_MOUTH and rng.random() < 0.7:
        beard = BEARDS[(i // 2 + decade * 3) % len(BEARDS)]
    specs = None
    if face not in BIG_EYES and rng.random() < (0.15 if decade <= 1 else 0.3 if decade <= 2 else 0.55):
        specs = 'Specs1' if (i + decade) % 2 else 'Specs2'
    return {
        'id': f'd{decade}-{i + 1:02d}', 'decade': decade, 'age': DECADE_AGE[decade],
        'hair': 'long' if fem else 'short',  # presentation: 'long' reads as female ("Hi aunty!"), 'short' as male
        'hairStyle': hair, 'face': face, 'mood': MOOD[face],
        'beard': beard, 'specs': specs, 'shirt': SHIRTS[(i * 5 + decade * 2) % len(SHIRTS)],
        'skin': (i * 2 + decade) % len(SKINS),
    }

# The one real reader the story follows: fixed, so they look the same whatever else changes
ANCHOR = {'id': 'anchor', 'decade': 3, 'age': 45, 'hair': 'long', 'hairStyle': 5, 'face': 6, 'mood': 'neutral',
          'beard': None, 'specs': None, 'shirt': 5, 'skin': 4, 'fixed': True}

_cache = {}
def part(rel):
    if rel not in _cache:
        _cache[rel] = Image.open(os.path.join(PARTS, rel)).convert('RGBA')
    return _cache[rel]

def tinted(im, rgb, outline=True):
    """Recolour a shape to rgb, with a thin ink outline so light colours still read."""
    a = im.getchannel('A')
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    if outline:
        line = Image.new('RGBA', im.size, INK + (255,))
        line.putalpha(a.filter(ImageFilter.MaxFilter(11)))
        out.alpha_composite(line)
    fill = Image.new('RGBA', im.size, rgb + (255,))
    fill.putalpha(a)
    out.alpha_composite(fill)
    return out

def skinned(rgb):
    """Base face in another skin tone. Ink stays ink; shading keeps its depth."""
    key = ('skin', rgb)
    if key in _cache: return _cache[key]
    im = part('Base Face.png').copy()
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a: continue
            if r > 235 and g > 235 and b > 235:
                if FILL_NECK: px[x, y] = rgb + (a,)
                continue
            t = min(1.0, r / BASE_SKIN[0])  # 0 = ink, 1 = skin
            px[x, y] = tuple(round(c * t) for c in rgb) + (a,)
    _cache[key] = im
    return im

def hair_layer(style, tone):
    return tinted(part(f'hair/Hair{style}.png'), HAIR_COLOURS[tone])

def beard_layer(name, tone):
    rgb = HAIR_COLOURS[tone]
    return tinted(part(f'beard/{name}.png'), rgb, outline=rgb[0] > 90)

def compose(c):
    tone = hair_tone(c['age'])
    im = Image.new('RGBA', (1000, 1000), (0, 0, 0, 0))
    im.alpha_composite(skinned(SKINS[c['skin']]))  # face and neck sit behind the shirt, so the collar overlaps the neck
    im.alpha_composite(part(f"shirts/Shirt{c['shirt']}.png"))
    im.alpha_composite(part(f"faces/Face{c['face']}.png"))
    if c['specs']: im.alpha_composite(part(f"beard/{c['specs']}.png"))
    if c['hairStyle']: im.alpha_composite(hair_layer(c['hairStyle'], tone))
    if c['beard']: im.alpha_composite(beard_layer(c['beard'], tone))  # over the hair, so long hair never hides it
    return im

def save_small(im, path):
    # Palette PNGs with alpha keep the files small; these drawings have few colours
    im.quantize(colors=96, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(path, optimize=True)

def export_layers():
    """Every part, pre-coloured, at half size. Names: base-<skin>, shirt-<n>, face-<n>, specs-<n>, hair-<style>-<tone>, beard-<name>-<tone>."""
    d = os.path.join(OUT, 'layers'); os.makedirs(d, exist_ok=True)
    half = lambda im: im.resize((500, 500), Image.LANCZOS)
    for i, rgb in enumerate(SKINS): save_small(half(skinned(rgb)), os.path.join(d, f'base-{i}.png'))
    for n in SHIRTS: save_small(half(part(f'shirts/Shirt{n}.png')), os.path.join(d, f'shirt-{n}.png'))
    for n in range(1, 9): save_small(half(part(f'faces/Face{n}.png')), os.path.join(d, f'face-{n}.png'))
    for n in (1, 2): save_small(half(part(f'beard/Specs{n}.png')), os.path.join(d, f'specs-{n}.png'))
    for tone in range(len(HAIR_COLOURS)):
        for s in range(1, 11): save_small(half(hair_layer(s, tone)), os.path.join(d, f'hair-{s}-{tone}.png'))
        for b in BEARDS: save_small(half(beard_layer(b, tone)), os.path.join(d, f'beard-{b.lower()}-{tone}.png'))

def main():
    for sub in ('web', 'cut', 'layers'):
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)
        for f in glob.glob(os.path.join(OUT, sub, '*.png')): os.remove(f)  # no stale characters left behind
    rng = random.Random(2026)
    chars = [recipe(d, i, rng) for d in range(len(DECADE_AGE)) for i in range(PER_DECADE)] + [ANCHOR]
    for c in chars:
        im = compose(c)
        save_small(im.crop((80, 40, 940, 900)).resize((480, 480), Image.LANCZOS), os.path.join(OUT, 'web', c['id'] + '.png'))
        save_small(im.crop((215, 70, 805, 660)).resize((128, 128), Image.LANCZOS), os.path.join(OUT, 'cut', c['id'] + '.png'))
    export_layers()
    data = {'dir': 'imgs/characters/fp/', 'skins': ['#%02X%02X%02X' % s for s in SKINS],
            'hairTones': ['#%02X%02X%02X' % s for s in HAIR_COLOURS], 'chars': chars}
    js = ('// Generated by character-kit/build_fp.py. Do not edit by hand; change the build script and rerun it.\n'
          'window.FP_CHARS = ' + json.dumps(data, separators=(',', ':')) + ';\n')
    open(os.path.join(ROOT, 'scripts', 'fp-characters.js'), 'w').write(js)
    fig = lambda c: (f'<figure><img src="../imgs/characters/fp/web/{c["id"]}.png" style="background:{BG[c["decade"]]}"><figcaption><b>{c["id"]}</b> · hair {c["hairStyle"] or "bald"} · {c["mood"]}'
                     f'{" · " + c["beard"] if c["beard"] else ""}{" · specs" if c["specs"] else ""}</figcaption></figure>')
    rows = ''.join(f'<h2>{DECADES[d]}</h2><div class="row">' + ''.join(fig(c) for c in chars if c['decade'] == d and not c.get('fixed')) + '</div>'
                   for d in range(len(DECADE_AGE)))
    rows += '<h2>Our reader (fixed)</h2><div class="row">' + fig(ANCHOR) + '</div>'
    open(os.path.join(HERE, 'fp-characters.html'), 'w').write(SHEET.replace('{{ROWS}}', rows).replace('{{N}}', str(len(chars))))
    print(len(chars), 'characters and', len(glob.glob(os.path.join(OUT, 'layers', '*.png'))), 'layers written to', os.path.relpath(OUT, ROOT))

BG = ['#F2D7C9', '#E7D3C1', '#E9CFCB', '#D9DCCB', '#D3DDD9', '#E3DACB', '#E6DDE3']  # same as scripts/characters.js
SHEET = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FP Characters</title><style>
:root{--bg:#F7F2F2;--ink:#1A1208;--muted:#6B5E57}
@media (prefers-color-scheme:dark){:root{--bg:#1B1715;--ink:#F3ECE8;--muted:#B5A9A2}}
body{margin:0;padding:24px 16px 64px;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif}
main{max-width:1100px;margin:0 auto}h1{font-size:28px;margin:0 0 4px}p{color:var(--muted);margin:0 0 24px}
h2{font-size:16px;margin:28px 0 10px}.row{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
figure{margin:0}img{width:100%;display:block;border:2px solid var(--ink)}figcaption{font-size:12px;color:var(--muted);margin-top:4px}
</style></head><body><main><h1>FP survey characters</h1>
<p>{{N}} characters generated by <code>build_fp.py</code> from the parts in <code>FP survey characters/</code>. Teens get the big eyes; hair turns grey with age; beards only go on closed-mouth faces. The story picks from these by decade. Readers build their own character on the page from the pre-coloured layers in <code>imgs/characters/fp/layers/</code>.</p>
{{ROWS}}</main></body></html>'''

if __name__ == '__main__':
    main()
