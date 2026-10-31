"""Build data/gifting.js from the Typeform export.

Run from the gifting/ folder:  python3 scripts/build_data.py
Only aggregates and hand-picked quotes leave this script. Emails, network IDs and
answers from readers who did not consent to publication are never written out.
"""
import csv, glob, json, re, statistics
from collections import Counter

SRC = glob.glob('responses-*.csv')[0]
rows = list(csv.reader(open(SRC, encoding='utf-8-sig')))
head, rows = rows[0], rows[1:]
N = len(rows)

C_PHIL, C_LINE, C_SAFE, C_TREAT, C_BELIEF = 1, 2, 3, 4, 5
C_GIVE, C_GET = 6, 7
C_SHARE = range(8, 15)
C_OCC = range(15, 30)
C_HARD, C_GIVEN, C_FEEL, C_NOTE, C_RECV, C_NEVER, C_HOBBY, C_DREAM, C_FALLBACK = 30, 31, 32, 33, 34, 35, 36, 37, 38
C_AGE, C_CREDIT, C_NAME, C_PUBLISH = 39, 40, 41, 42

AGES = ['20–25', '25–30', '30–40', '40–50', '50–60', 'Over 60']


def low(s):
    return s.lower().replace('’', "'")


def has(text, *words):
    t = low(text)
    return any(re.search(r'\b' + w, t) for w in words)


# ---------- 1. Who gets the gifting budget ----------
BANDS = ['1–5%', '5–10%', '10–25%', '25%+']
share = []
for c in C_SHARE:
    cnt = Counter(r[c] for r in rows if r[c])
    share.append({'who': head[c], 'n': sum(cnt.values()), 'bands': [cnt[b] for b in BANDS]})

# ---------- 2. The gift gap: give vs. want ----------
pairs = [(int(r[C_GIVE]), int(r[C_GET]), r[C_AGE]) for r in rows
         if r[C_GIVE].strip().isdigit() and r[C_GET].strip().isdigit()]
gap = {
    'n': len(pairs),
    'more': sum(a > b for a, b, _ in pairs),
    'same': sum(a == b for a, b, _ in pairs),
    'less': sum(a < b for a, b, _ in pairs),
    'medGive': statistics.median(a for a, _, _ in pairs),
    'medGet': statistics.median(b for _, b, _ in pairs),
    # every respondent, sorted so the dot grid reads more -> same -> less
    'dots': sorted([1 if a > b else (0 if a == b else -1) for a, b, _ in pairs], reverse=True),
}
BUCKETS = [(0, 0, '₹0'), (1, 999, 'Under ₹1k'), (1000, 1999, '₹1k–2k'), (2000, 2999, '₹2k–3k'),
           (3000, 4999, '₹3k–5k'), (5000, 9999, '₹5k–10k'), (10000, 10**9, '₹10k+')]
gap['buckets'] = [{'label': l,
                   'give': sum(lo <= a <= hi for a, _, _ in pairs),
                   'get': sum(lo <= b <= hi for _, b, _ in pairs)} for lo, hi, l in BUCKETS]
gap['byAge'] = []
for g in AGES:
    p = [(a, b) for a, b, age in pairs if age == g]
    gap['byAge'].append({'age': g, 'n': len(p),
                         'give': statistics.median(a for a, _ in p),
                         'get': statistics.median(b for _, b in p)})

# ---------- 3. Occasions ----------
occ = sorted(({'label': head[c], 'n': sum(1 for r in rows if r[c])} for c in C_OCC if head[c] != 'Other'),
             key=lambda d: -d['n'])

# ---------- 4. The feeling, split at 40 ----------
FEELS = ['Cared-for', 'Delighted / surprised', 'Seen & understood', 'Useful every day']
def feel_split(ages):
    rs = [r for r in rows if r[C_AGE] in ages and r[C_FEEL]]
    cnt = Counter(r[C_FEEL] for r in rs)
    return {'n': len(rs), 'counts': [cnt[f] for f in FEELS], 'other': len(rs) - sum(cnt[f] for f in FEELS)}
feel_all = Counter(r[C_FEEL] for r in rows if r[C_FEEL])
feeling = {
    'labels': FEELS,
    'all': [feel_all[f] for f in FEELS], 'allN': sum(feel_all.values()),
    'under40': feel_split(AGES[:3]), 'over40': feel_split(AGES[3:]),
}

# ---------- 5. "A great gift is one that ___" themes ----------
THEMES = [
    ('Brings joy or a smile', ('joy', 'smile', 'happ', 'delight', 'excite', 'euphori', 'sparkle', 'light')),
    ('Gets used', ('use', 'useful', 'utility', 'functional', 'daily', 'everyday', 'practical', 'purpose', 'solv', 'solution', 'improve')),
    ('Is remembered, or reminds them of you', ('remember', 'remind', 'memor', 'cherish', 'lasting', 'timeless', 'long', 'forever')),
    ('Shows you know them', ('seen', 'heard', 'listen', 'know you', 'special', 'understand', 'personal', 'reflect', 'detail', 'noticed', 'resonat', 'thought')),
    ('Is something they didn\'t know they wanted', ("didn't know", 'didnt know', 'never knew', 'not even realize', 'would never buy', 'never buy', 'unrealized', 'not expecting', 'surpris', 'just what i wanted', 'just wanted', 'always wanted')),
]
lines = [r[C_LINE] for r in rows if r[C_LINE].strip()]
themes = [{'label': l, 'n': sum(1 for t in lines if has(t, *k))} for l, k in THEMES]

# ---------- 6. Hardest person to buy for ----------
HARD = [
    ('Spouse or partner', ('wife', 'husband', 'spouse', 'partner', 'boyfriend', 'girlfriend', 'fianc')),
    ('Parents', ('dad', 'father', 'mother', 'mom', 'parent', 'senior citizen', "80's")),
    ('Children and teens', ('son', 'daughter', 'kid', 'child', 'teen', 'baby', '15-17')),
    ('Siblings and extended family', ('brother', 'sister', 'cousin', 'extended', 'relative', 'bade papa', 'in law', 'family')),
    ('Men, as a category', ('men', 'male')),
    ('People who have everything', ('rich', 'wealthy', 'affluent', 'has everything', 'have everything', 'almost everything')),
    ('Bosses and colleagues', ('boss', 'colleague', 'higherup')),
    ('People I don\'t know well', ("don't know", 'dont know', 'not know', 'stranger', 'not met', 'not a personal', 'someone i don')),
]
hard_ans = [r[C_HARD] for r in rows if r[C_HARD].strip() and not re.fullmatch(r"\W*(none|no one|na|n\.a\.|nothing specific|can't think|'-)\W*", low(r[C_HARD]).strip())]
hard = []
taken = set()
for label, keys in HARD:  # first matching bucket wins, so each answer is counted once
    hits = [i for i, t in enumerate(hard_ans) if i not in taken and has(t, *keys)]
    taken.update(hits)
    hard.append({'label': label, 'n': len(hits)})
hard.append({'label': 'Someone else', 'n': len(hard_ans) - len(taken)})
spouse_words = Counter()
for t in hard_ans:
    for w in ('wife', 'husband'):
        if has(t, w): spouse_words[w] += 1

# ---------- 7. Never buy for yourself ----------
never = [r[C_NEVER] for r in rows if r[C_NEVER].strip() and not re.fullmatch(r"\W*(none|na|nothing|nothing really|unsure|i dont know|i don't know!*)\W*", low(r[C_NEVER]).strip())]
never_price = sum(1 for t in never if has(t, 'expensive', 'costly', 'cost', 'afford', 'luxur', 'price', 'money', 'spend', 'lakh', '1 lakh'))
never_guilt = sum(1 for t in never if has(t, 'guilt', 'justify', 'indulg', 'unnecessary', 'waste', "don't need", 'not a need', 'excess', 'vanity', 'useless', 'better use', 'heart to spend', 'comfortable spending'))

# ---------- 8. Safe bets & fallbacks ----------
CATS = [
    ('Books', ('book', 'novel', 'sapiens', 'little prince', 'mackesy')),
    ('Cash, vouchers & gift cards', ('cash', 'voucher', 'gift card', 'coupon', 'envelope', 'lifafa', 'money', 'amazon')),
    ('Flowers & plants', ('flower', 'bouquet', 'plant')),
    ('Chocolates, sweets & food', ('chocolate', 'sweet', 'cake', 'dessert', 'food', 'dry ?fruit', 'nut', 'baked', 'cookie', 'snack', 'fruit', 'edible', 'hamper', 'coffee', 'ganache', 'ganche', 'royce', 'f&b', 'olive oil')),
    ('Home & decor', ('decor', 'candle', 'mug', 'lamp', 'good ?earth', 'crockery', 'home')),
    ('Clothes, bags & accessories', ('cloth', 'shirt', 'saree', 'bag', 'watch', 'jewel', 'scarf', 'scarves', 'socks', 'fashion', 'apparel', 'kurta', 'dress', 'wallet', 'accessor')),
    ('Wine & spirits', ('wine', 'whisk', 'malt', 'tequila', 'alcohol', 'prosecco', 'sake')),
    ('Perfume & self-care', ('perfume', 'fragrance', 'self-care', 'self care', 'skincare', 'bath', 'personal care', 'aroma')),
    ('Gadgets', ('electronic', 'gadget', 'tech', 'earbud', 'audio', 'appliance', 'device')),
    ('Experiences', ('experience', 'spa', 'staycation', 'dinner', 'holiday', 'membership', 'subscription', 'activities')),
    ('Gold & silver', ('gold', 'silver')),
    ('Stationery', ('stationery', 'pen', 'notebook', 'journal', 'diary', 'diaries')),
]
def code(col):
    ans = [r[col] for r in rows if r[col].strip()]
    return {'n': len(ans), 'cats': [{'label': l, 'n': sum(1 for t in ans if has(t, *k))} for l, k in CATS]}
safe = code(C_SAFE)
fallback = code(C_FALLBACK)

# ---------- Quotes ----------
# Only readers who said yes to publication. Named only if they asked to be named;
# names are normalised by hand from the free-text name & city field.
NAMES = {
    4: 'Mariah, Gurgaon', 6: 'Trisha, Kolkata', 7: 'Amartya, Kolkata', 9: 'Thomas Fenn, Delhi',
    22: 'Vedant, Bengaluru', 31: 'Shivam, Gurugram', 36: 'Abhishek, Bengaluru', 57: None,
    60: 'Purnima Joshi, Bangalore', 75: 'Alisha, Gurgaon', 93: 'Shaunak, Hyderabad',
    94: 'Sarath, Bengaluru', 101: 'Vikas Singhal, Faridabad', 124: 'Evara C, Mumbai',
    129: 'Karthik, Gurugram', 130: 'Sangram, Mumbai', 134: 'Deejay, Mumbai', 142: 'S. Vinit, Mumbai',
    143: 'Amit, Bengaluru', 159: 'Shradha Singh, Nainital', 70: 'Adarsh, Bengaluru',
    13: None, 49: 'Dinesh, Bangalore', 87: 'Vandana Aggarwal, Gurgaon', 114: None, 55: 'Elton Pais, Bengaluru',
}
# (key, row, column, optional light edit)
PICKS = [
    ('gapNoExpensive', 38, C_BELIEF, 'I don’t accept gifts that are too expensive — meaning ones I can never return the favour for. Stupid middle-class conditioning that I am unable to let go.'),
    ('gapSplurge', 60, C_HARD, 'Husband, mother — I want there to be no compromise in the gift experience I give them, because of which I always overshoot an ideal budget by 5–10x.'),
    ('neverSpa', 28, C_NEVER, 'A spa day. Reason: mom guilt.'),
    ('neverBike', 142, C_NEVER, 'A bicycle. I want to just wander the city. But I can never justify it to myself, as I always think it’s an indulgence.'),
    ('neverDyson', 75, C_NEVER, 'I would love to get a Dyson Airwrap. I always think there is a better use for money; but I also know I would love to get it as a gift.'),
    ('neverWallet', 134, C_NEVER, 'Wallet — superstition; never buy your own wallet.'),
    ('neverBag', 123, C_NEVER, 'A designer handbag. I won’t buy one because I don’t see the point in spending ₹1 lakh on a purse, when I can get a very good one for ₹10k as well.'),
    ('recvBirk', 144, C_RECV, 'A pair of Birkenstocks; it’s just something I’d never buy, but it’s a delight.'),
    ('recvWatch', 60, C_RECV, 'Apple Watch. Would have never bought it for myself and couldn’t believe I actually own one now. Felt cared for.'),
    ('occBirthday', 9, C_BELIEF, 'Don’t do it on a birthday, anniversary, occasion — it’ll get lost in the crowd and conveys more a sense of duty than thought. Do it when the receiver least expects it.'),
    ('occItself', 138, C_BELIEF, 'As far as possible, don’t find gifts to suit the occasion. A great gift is an occasion in itself.'),
    ('occMarch', 4, C_LINE, 'A great gift is one that proves you were listening in March when you had to gift in December.'),
    ('feelKnow', 62, C_LINE, 'A great gift is one that tells the person receiving it, “I know you.”'),
    ('feelListen', 94, C_LINE, 'A great gift is one that reminds them I listen to what they say — and sometimes what they don’t.'),
    ('feelNever', 129, C_LINE, 'A great gift is one I don’t need, and never knew that I wanted.'),
    ('feelUsed', 36, C_LINE, 'A great gift is one that gets used.'),
    ('hardSpouse', 143, C_HARD, 'My spouse. I know her too well for “safe” to feel thoughtful, and too much shared history means the obvious ideas are already used up.'),
    ('hardParents', 3, C_HARD, 'Parents, since it’s next to impossible to get them to admit they need anything. They always want you to get something for yourself.'),
    ('hardPaise', 31, C_HARD, 'Parents — “paise kyun kharch karne hain?”'),
    ('hardSurgeon', 7, C_HARD, 'A specific friend, for he can dissect the gift and its reasoning like a surgeon.'),
    ('hardSurprise', 62, C_HARD, 'Husband — ’cause nothing is a surprise anymore.'),
    ('hardKids', 101, C_HARD, 'My kids. They like gifting. That is the situation I fear.'),
    ('booksMiss', 130, C_SAFE, 'Books are a miss because most people don’t read books. The person who gives the gift feels good — the receiver may not.'),
    ('booksGraphic', 9, C_FALLBACK, 'A graphic novel. Not as intimidating as a book can be for an irregular reader. Also flippable art.'),
    ('booksOrder', 94, C_FALLBACK, 'Books — Sapiens, Big Panda and Tiny Dragon, The Name of the Wind, in this order.'),
    ('bestQR', 124, C_GIVEN, 'A card with a QR code that took my mother to a song my Nana sang for her. We had lost him six months back, and that video just made it feel like he was alive.'),
    ('bestMask', 132, C_GIVEN, 'A mulberry silk eye mask to my husband. He’s been using it for five years now. He said he never would have thought of it, although light disturbs his sleep — and it makes him feel like a rich floof.'),
    ('bestStand', 137, C_RECV, 'A laptop stand I did not know I needed. She had seen me struggle to get the right height on a video call a year ago. She waited till my birthday to gift it, with a message.'),
    ('bestGramophone', 22, C_GIVEN, 'A gramophone to my father. He reacted by going straight to the market to buy vinyls.'),
    ('bestTime', 143, C_RECV, 'A friend’s company gave me a watch to thank me for the time I spent advising them. What he said stuck with me: I gave them time, and this was their way of giving time back.'),
    ('philWrap', 93, C_PHIL, 'Buy what they wouldn’t, wrap it like they would.'),
    ('philPersonal', 6, C_PHIL, 'I like giving something that is personal but not “personalised”. A book on a topic someone loves — personal. A coffee mug with your name on it — personalised technically, but it just shows you don’t know the person.'),
    ('philThought', 159, C_BELIEF, None),
]
quotes = {}
for key, i, col, edited in PICKS:
    r = rows[i]
    assert r[C_PUBLISH] == '1', f'row {i} did not consent to publication'
    named = r[C_CREDIT] == 'Yes, use my name' and NAMES.get(i)
    who = NAMES[i] if named else 'Anonymous reader'
    age = r[C_AGE] if r[C_AGE] else None
    quotes[key] = {'text': edited or r[col].strip(), 'who': who, 'age': age}

DREAMS = [  # (row, light edit) — dream gift and the reader's own price tag
    (13, 'A trip to Bhutan, staying at the Aman'),
    (9, 'An Ambassador car, floor shift'),
    (57, 'A Le Creuset signature round casserole — ₹18,000'),
    (134, 'An authenticated poster of Angoor, signed by Gulzar and the cast — priceless'),
    (77, 'A Virgin Galactic flight to see Earth from space — around $800k'),
    (94, 'A Timex automatic field watch — ~₹13k'),
    (23, 'A coffee estate, and the business around it — ₹20–50 crore'),
    (49, 'A solo trip to every Second World War memorial, Europe to Japan — ₹8–10 lakh'),
    (114, 'A full set of Copic markers'),
    (3, 'An all-expenses-paid trip to a book fair. You can’t calculate the burden on the wallet if you let a bibliophile roam free'),
    (135, 'A lovely violin that I can learn to play'),
    (152, 'One month in New York or Rome — $15,000'),
]
dreams = []
for i, text in DREAMS:
    assert rows[i][C_PUBLISH] == '1'
    dreams.append(text)

# "A great gift is one that ___" answers for the fill-in-the-blank, lightly edited, unattributed
BLANKS = [
    (2, 'can be enjoyed again and again'), (7, 'blends into their daily life'),
    (8, 'tells them you remember all the little details they tell you'), (14, 'feels thoughtful, not obligatory'),
    (19, 'solves a problem I face every day'), (21, 'tugs at the heartstrings'),
    (24, 'makes you think of the gifter every time you use it'), (31, 'improves some part of their life, even by 1%'),
    (41, 'they fondly remember — and that doesn’t burden them'), (46, 'gets them to call you immediately'),
    (53, 'does minimal harm to nature once it’s no longer used'), (55, 'starts a conversation'),
    (73, 'improves their quality of life by at least a tiny delta'), (76, 'only you could give'),
    (95, 'they were 70% sure they wanted, but would never have gone looking for'),
    (101, 'doesn’t come. I prefer people'), (111, 'survives 15 months'),
    (115, 'lights up their face — the joy is spontaneous and infectious'), (128, 'forces you to feel deeply'),
    (134, 'is hard to put a price on'), (141, 'I don’t want to give away!'), (148, 'helps expand a person'),
    (154, 'they didn’t even realise they wanted, but love'), (13, 'you go back to again and again'),
]
blanks = []
for i, text in BLANKS:
    assert rows[i][C_PUBLISH] == '1', f'row {i} did not consent to publication'
    blanks.append(text)

out = {
    'blanks': blanks,
    'n': N, 'share': share, 'bands': BANDS, 'gap': gap, 'occasions': occ, 'feeling': feeling,
    'themes': themes, 'themesN': len(lines), 'hard': hard, 'hardN': len(hard_ans), 'spouseWords': spouse_words,
    'never': {'n': len(never), 'price': never_price, 'guilt': never_guilt},
    'safe': safe, 'fallback': fallback, 'quotes': quotes, 'dreams': dreams,
}
with open('data/gifting.js', 'w', encoding='utf-8') as f:
    f.write('// Generated by scripts/build_data.py — do not edit by hand.\n')
    f.write('window.GIFTING = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print(json.dumps({k: v for k, v in out.items() if k not in ('quotes', 'dreams', 'gap')}, ensure_ascii=False, indent=1))
print({k: v for k, v in gap.items() if k != 'dots'})
