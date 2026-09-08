#!/usr/bin/env python3
"""
Joins poster_response_groups.csv (poster/response groups) with dashboard/data.js
(per-respondent age + city, keyed by exact story text) to produce poster_data.js —
one record per poster, with its responses (sorted by score desc) each tagged with
an age bin / city when a match is found. Run this whenever either source CSV
changes; poster_data.js is committed, this script is not linked from the page.
"""
import csv
import json
import os
import re
from collections import defaultdict

from PIL import Image

POSTER_DIR = "case comp ad posters"
DEFAULT_RATIO = 0.75  # fallback aspect ratio (w/h) for TO-SOURCE posters with no image


def image_ratio(filename):
    path = os.path.join(POSTER_DIR, filename)
    with Image.open(path) as im:
        return round(im.width / im.height, 4)

CAT_FULL_TO_SHORT = {
    "Health and medical": "Health & medical",
    "Kids and school": "Kids & school",
    "Money, investing and insurance": "Money & investing",
    "Travel and holidays": "Travel & holidays",
    "Groceries and household": "Groceries",
    "Food and eating out": "Food & eating out",
    "Shopping and deals": "Shopping & deals",
    "Fitness and wellness": "Fitness & wellness",
    "Going out and entertainment": "Going out",
    "Weddings and special occasions": "Weddings",
    "Learning and hobbies": "Learning & hobbies",
    "Getting around and vehicles": "Getting around",
    "Pets": "Pets",
    "Beauty and self-care": "Beauty & self-care",
}

EXTRA_CITY_ALIASES = {
    "blr": "Bangalore", "bengaluru": "Bangalore", "bombay": "Mumbai",
    "new delhi": "Delhi", "ncr": "Delhi", "gurgaon": "Gurugram",
}

AGE_BIN_ORDER = ["<25", "25-34", "35-44", "45-54", "55+"]

# Free-text city answers sometimes list more than one place ("Bangalore/Mumbai",
# "New Delhi, India", "Delhi and Ahmedabad") — keep just the first one so the
# location filter reads as a clean list of cities rather than raw survey text.
CITY_SPLIT_RE = re.compile(r"\s*(?:,|/|\\?\||&|\band\b)\s*", re.IGNORECASE)


def clean_city(city):
    if not city:
        return city
    first = CITY_SPLIT_RE.split(city.strip())[0].strip()
    if not first:
        return city
    key = first.lower()
    return EXTRA_CITY_ALIASES.get(key, first)


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip()).lower()


def load_respondent_rows():
    with open("dashboard/data.js", encoding="utf-8") as f:
        txt = f.read()
    txt = txt.split("window.ROWS = ", 1)[1].rstrip("\n;")
    return json.loads(txt)


def build_lookup(rows):
    lookup = defaultdict(list)
    for r in rows:
        city = clean_city(r["city"])
        for t in r["tags"]:
            key = (t["cat"], norm(t["story"]))
            lookup[key].append({"age": r["age"], "ageBin": r["ageBin"], "city": city})
    return lookup


def main():
    respondent_rows = load_respondent_rows()
    lookup = build_lookup(respondent_rows)

    with open("poster_response_groups.csv", newline="", encoding="utf-8") as f:
        csv_rows = list(csv.DictReader(f))

    posters = {}
    order = []
    for row in csv_rows:
        pno = row["poster_no"]
        if pno not in posters:
            posters[pno] = {
                "no": pno,
                "opportunitySpace": row["opportunity_space"],
                "feeling": row["feeling"],
                "posterGroup": row["poster_group"],
                "status": row["poster_status"],
                "product": row["poster_product"],
                "file": row["poster_file"].strip() or None,
                "groupSize": int(row["group_size"]),
                "responses": [],
            }
            posters[pno]["ratio"] = image_ratio(posters[pno]["file"]) if posters[pno]["file"] else DEFAULT_RATIO
            order.append(pno)

        short_cat = CAT_FULL_TO_SHORT.get(row["source_category"].strip())
        key = (short_cat, norm(row["response"]))
        matches = lookup.get(key) if short_cat else None
        age_bin = city = age = None
        if matches:
            # a handful of respondents give the exact same short answer —
            # just take the first match rather than fanning one response
            # out into several near-duplicate cards.
            m = matches[0]
            age, age_bin, city = m["age"], m["ageBin"], m["city"]

        posters[pno]["responses"].append({
            "text": row["response"].strip(),
            "score": int(row["score"]),
            "ageBin": age_bin,
            "age": age,
            "city": city,
        })

    opp_order = []
    seen_opp = set()
    feelings_seen = set()
    age_bins_seen = set()
    cities_count = defaultdict(int)

    out_posters = []
    for pno in sorted(order, key=lambda x: int(x)):
        p = posters[pno]
        p["responses"].sort(key=lambda r: -r["score"])
        p["ageBins"] = sorted({r["ageBin"] for r in p["responses"] if r["ageBin"]},
                               key=lambda b: AGE_BIN_ORDER.index(b))
        p["cities"] = sorted({r["city"] for r in p["responses"] if r["city"]})
        out_posters.append(p)

        if p["opportunitySpace"] not in seen_opp:
            seen_opp.add(p["opportunitySpace"]); opp_order.append(p["opportunitySpace"])
        feelings_seen.add(p["feeling"])
        age_bins_seen.update(p["ageBins"])
        for c in p["cities"]:
            cities_count[c] += 1

    opp_counts = defaultdict(int)
    for p in out_posters:
        opp_counts[p["opportunitySpace"]] += 1

    meta = {
        "opportunitySpaces": [{"name": o, "count": opp_counts[o]} for o in opp_order],
        "feelings": sorted(feelings_seen),
        "ageBins": [b for b in AGE_BIN_ORDER if b in age_bins_seen],
        "cities": sorted(cities_count.items(), key=lambda kv: -kv[1]),
    }

    with open("poster_data.js", "w", encoding="utf-8") as f:
        f.write("/* Generated by build_poster_data.py from poster_response_groups.csv + dashboard/data.js — do not hand-edit. */\n")
        f.write("window.POSTER_DATA = ")
        f.write(json.dumps({"posters": out_posters, "meta": meta}, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n")

    n_with_demo = sum(1 for p in out_posters if p["ageBins"] or p["cities"])
    print(f"posters: {len(out_posters)}  with >=1 demographic match: {n_with_demo}")
    print(f"assigned (has poster_file): {sum(1 for p in out_posters if p['file'])}")
    print("opportunity spaces:", len(opp_order))
    print("age bins present:", meta["ageBins"])
    print("top cities:", meta["cities"][:10])


if __name__ == "__main__":
    main()
