"""Build data/chai.js from 'survey results.csv'.

Run from the chai folder:  python3 -I scripts/build_data.py
Keeps only the recipe answers, age band, gender and a city group. Emails, network IDs and
timestamps are dropped; free text is kept only if it holds no '@'.
"""
import csv, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
rows = list(csv.reader(open(ROOT / 'survey results.csv', encoding='utf-8')))
H, D = rows[0], [r for r in rows[1:] if r[158] == 'completed']

STAGE = {'At the start, before heating': 0, 'While it heats up': 1, 'Once it boils': 2,
         'After the heat is off': 3, 'In the cup': 4}
MILK = {'None, I take it black': 0, 'A splash': 1, 'About a quarter': 2, 'About half': 3,
        'Mostly milk': 4, 'All milk, no water': 5}
MILKTYPE = {'Toned': 'toned', 'Full-cream': 'full', 'Double-toned, low-fat or skimmed': 'skim',
            'Plant-based (oat, soy, almond…)': 'plant', 'Condensed milk': 'condensed', 'Milk powder': 'powder'}
AMT = {'Less than half a teaspoon': 0, 'About half a teaspoon': 1, 'About 1 teaspoon': 2,
       'About 1½ teaspoons': 3, '2 teaspoons or more': 4, 'I just eyeball it': 5, 'One tea bag': 6}
SWEET = {'Nothing, no sugar': 'none', 'A little sugar (under 1 tsp)': 'sugar1', '1 tsp sugar': 'sugar2',
         '2 tsp sugar or more': 'sugar3', 'Jaggery': 'jaggery', 'Sugar-free sweetener': 'free', 'Honey': 'honey'}
BOILS = {"It doesn't boil after the milk": 0, 'Once': 1, 'Twice': 2, 'Three times or more': 3,
         'I let it simmer for a while': 4}
BREW = {'Under a minute': 0, '1–2 minutes': 1, '3–5 minutes': 2, '5–10 minutes': 3,
        'More than 10 minutes': 4, 'Until the colour looks right': 5}
VESSEL = {'Mug': 'mug', 'Cup': 'cup', 'Steel tumbler': 'tumbler', 'Glass (cutting chai glass)': 'glass'}
TEAS = {8: 'ctc', 9: 'leaf', 10: 'dust', 11: 'bag', 12: 'darjeeling', 13: 'assam', 14: 'nilgiri', 15: 'green', 16: 'unsure'}
SPICES = ['ginger', 'cardamom', 'clove', 'cinnamon', 'pepper', 'tulsi', 'mint', 'masala', 'lemon']
FORMS = ['whole', 'crushed', 'grated', 'sliced', 'powder', 'seeds', 'roasted', 'fresh', 'dried', 'packaged']
AGE = {'18–24': '18–24', '25–34': '25–34', '35–44': '35–44', '45–54': '45–54', '55–64': '55–64', '65+': '65+'}

CITY = [('Mumbai', r'mumbai|^mum$|bombay|thane|navi'), ('Bengaluru', r'bangalore|bengaluru|blr|bangaluru'),
        ('Delhi NCR', r'delhi|gurgaon|gurugram|noida|faridabad|ghaziabad'), ('Chennai', r'chennai|madras'),
        ('Hyderabad', r'hyderabad|secunderabad'), ('Pune', r'pune'), ('Kolkata', r'kolkata|calcutta'),
        ('Abroad', r'singapore|usa|\bus\b|nyc|new jersey|los angeles|germany|london|uk|dubai|bahrain|canada|australia|walldorf|seattle|san ')]

def city(raw):
    s = raw.strip().lower()
    if not s: return ''
    for name, pat in CITY:
        if re.search(pat, s): return name
    return 'Elsewhere in India'

def town(raw):
    """A readable town name for quotes (first part, title-cased)."""
    s = raw.strip().split(',')[0].strip()
    if not s: return ''
    fix = {'blr': 'Bengaluru', 'bangalore': 'Bengaluru', 'mum': 'Mumbai', 'gurgaon': 'Gurugram', 'nyc': 'New York'}
    return fix.get(s.lower(), s.title() if s.islower() or s.isupper() else s)

def clean(t):
    t = re.sub(r'\s+', ' ', (t or '').strip())
    return '' if '@' in t else t

def name(raw):
    s = raw.strip()
    if len(s) > 40: return 'Tea'  # someone wrote their recipe into the name box
    return s[:1].upper() + s[1:] if s else 'Chai'

out = []
for r in D:
    milk = MILK.get(r[5])
    extras = [s for i, s in enumerate(SPICES) if r[22 + i]]
    other = clean(r[32])
    o = {
        'id': r[0][:8], 'name': name(r[3]), 'vessel': VESSEL.get(r[1], 'other'),
        'cups': int(r[4]) if r[4].isdigit() else None, 'milk': milk, 'milkType': MILKTYPE.get(r[6]),
        'teas': [v for k, v in TEAS.items() if r[k]], 'amt': AMT.get(r[19]), 'sweet': SWEET.get(r[20]),
        'extras': extras, 'other': other, 'spiceIn': STAGE.get(r[33]),
        'spice': {}, 'milkIn': STAGE.get(r[143]), 'boils': BOILS.get(r[144]), 'teaIn': STAGE.get(r[145]),
        'brew': BREW.get(r[146]), 'sweetIn': STAGE.get(r[148]),
        'quote': clean(r[151]), 'special': clean(r[34]) if not r[34].strip().isdigit() else '',
        'mix': clean(r[18]), 'age': AGE.get(r[152], ''), 'g': {'Man': 'm', 'Woman': 'w'}.get(r[153], ''),
        'city': city(r[155]), 'town': town(r[155]),
    }
    # an "other" extra like lemongrass/saunf counts as an extra too
    lo = other.lower()
    if 'lemon' in lo and 'grass' in lo: o['extras'].append('lemongrass')
    if 'saunf' in lo or 'fennel' in lo or 'aniseed' in lo: o['extras'].append('saunf')
    if 'saffron' in lo: o['extras'].append('saffron')
    for k, s in enumerate(SPICES):
        if s not in extras: continue
        forms = [FORMS[j] for j in range(10) if r[35 + 12 * k + j]]
        st = STAGE.get(r[46 + 12 * k])
        if forms or st is not None:
            o['spice'][s] = {'f': forms, 'in': st}
    out.append(o)

js = '// Generated by scripts/build_data.py from the survey export. Do not edit by hand.\nwindow.CHAI = ' + \
     json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
(ROOT / 'data' / 'chai.js').write_text(js, encoding='utf-8')
print(len(out), 'readers ->', ROOT / 'data' / 'chai.js', f'{len(js)//1024} KB', file=sys.stderr)
