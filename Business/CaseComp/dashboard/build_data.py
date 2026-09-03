#!/usr/bin/env python3
"""
Parses survey_results.csv into data.js — one record per respondent, one
`tags` entry per life-area category they answered. Run this whenever
survey_results.csv changes; data.js is committed, this script is not linked
from the page.
"""
import csv
import json
import re

CATS = [
    ("Health and medical", "Health & medical"),
    ("Kids and school", "Kids & school"),
    ("Money, investing and insurance", "Money & investing"),
    ("Travel and holidays", "Travel & holidays"),
    ("Groceries and household", "Groceries"),
    ("Food and eating out", "Food & eating out"),
    ("Shopping and deals", "Shopping & deals"),
    ("Fitness and wellness", "Fitness & wellness"),
    ("Going out and entertainment", "Going out"),
    ("Weddings and special occasions", "Weddings"),
    ("Learning and hobbies", "Learning & hobbies"),
    ("Getting around and vehicles", "Getting around"),
    ("Pets", "Pets"),
    ("Beauty and self-care", "Beauty & self-care"),
]

AGE_BINS = [("<25", 0, 24), ("25-34", 25, 34), ("35-44", 35, 44), ("45-54", 45, 54), ("55+", 55, 200)]

CITY_ALIASES = {
    "bangalore": "Bangalore", "bengaluru": "Bangalore",
    "mumbai": "Mumbai", "bombay": "Mumbai", "navi mumbai": "Navi Mumbai",
    "delhi": "Delhi", "new delhi": "Delhi",
    "gurgaon": "Gurugram", "gurugram": "Gurugram",
    "hyderabad": "Hyderabad", "chennai": "Chennai", "pune": "Pune",
    "ahmedabad": "Ahmedabad", "visakhapatnam": "Visakhapatnam", "vizag": "Visakhapatnam",
    "indore": "Indore", "mohali": "Mohali", "bhopal": "Bhopal", "kochi": "Kochi",
    "cochin": "Kochi", "faridabad": "Faridabad", "noida": "Noida",
    "coimbatore": "Coimbatore", "ghaziabad": "Ghaziabad", "lucknow": "Lucknow",
}


def normalize_city(raw):
    raw = (raw or "").strip()
    if not raw:
        return None
    key = raw.lower()
    if key in CITY_ALIASES:
        return CITY_ALIASES[key]
    return raw.title()


def age_bin(age):
    for label, lo, hi in AGE_BINS:
        if lo <= age <= hi:
            return label
    return None


def parse_emotion(raw):
    if not raw or not raw.strip():
        return None
    head = raw.split("—")[0].split("-")[0].strip()
    if head.lower().startswith("frustrat"):
        return "Frustrating"
    if head.lower().startswith("procrastin"):
        return "Procrastinate"
    if head.lower().startswith("repetit"):
        return "Repetitive"
    return None


# Ordered rules — first match wins. Word-boundary regex to avoid "whatsapp"
# matching a bare "app" check, etc.
SYSTEM_RULES = [
    ("Nothing at all", r"\b(nothing|none|n/?a|no system|not really|dont have|don't have|haven't|havent)\b"),
    ("Excel/Spreadsheet", r"\b(excel|spreadsheet|google sheet)"),
    ("Chats", r"\b(whatsapp|chat|texting|group chat)"),
    ("House staff", r"\b(maid|cook|driver|house ?help|house ?staff|domestic help|nanny|watchman)"),
    ("Broker/Agent", r"\b(broker|agent|consultant|advisor|adviser|ca\b|chartered accountant|wealth manager|relationship manager)"),
    ("Friends", r"\bfriend"),
    ("Family", r"\b(family|mother|father|parent|wife|husband|spouse|sister|brother|mom|dad|mum|in-?law)"),
    ("Apps", r"\b(app|apps|application|website|online|google|amazon|myntra|zomato|swiggy|zerodha|groww|calendar|reminder|software|platform"
              r"|phonepe|gpay|g\-?pay|paytm|cred\b|practo|urban company|bookmyshow|district\b|ola\b|uber|netflix|spotify|duolingo"
              r"|notion|chatgpt|claude|ai agent|\bai\b|trello|todoist|banking app|\bupi\b|policy ?bazaar|coin ?switch|smallcase|\bkite\b)"),
]
SYSTEM_RULES = [(label, re.compile(pat, re.IGNORECASE)) for label, pat in SYSTEM_RULES]


def classify_system(raw):
    if not raw or not raw.strip():
        return None
    for label, pat in SYSTEM_RULES:
        if pat.search(raw):
            return label
    return None


def main():
    with open("survey_results.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    header = list(rows[0].keys())
    # category columns start at index 16, 3 columns each (emotion, story, system)
    cat_cols = []
    for i, (csv_name, short_name) in enumerate(CATS):
        base = 16 + i * 3
        cat_cols.append((short_name, header[base], header[base + 1], header[base + 2]))

    age_col = "How old are you?"
    city_col = "Finally, which city do you live in?"
    pilot_col = [h for h in header if h.startswith("One last thing")][0]

    out = []
    for row in rows:
        try:
            age = int(re.sub(r"[^\d]", "", row[age_col] or ""))
        except ValueError:
            age = None
        if age is not None and not (10 <= age <= 100):
            age = None

        city = normalize_city(row[city_col])
        pilot_raw = (row[pilot_col] or "").strip()
        pilot = "yes" if pilot_raw.lower().startswith("yes") else ("no" if pilot_raw else None)

        tags = []
        for short_name, emo_col, story_col, sys_col in cat_cols:
            emotion = parse_emotion(row[emo_col])
            if not emotion:
                continue
            story = (row[story_col] or "").strip()
            system = classify_system(row[sys_col])
            tags.append({"cat": short_name, "emotion": emotion, "story": story, "system": system})

        out.append({
            "age": age,
            "ageBin": age_bin(age) if age is not None else None,
            "city": city or None,
            "pilot": pilot,
            "tags": tags,
        })

    with open("data.js", "w", encoding="utf-8") as f:
        f.write("/* Generated by build_data.py from survey_results.csv — do not hand-edit. */\n")
        f.write("window.ROWS = ")
        f.write(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n")

    # ---- sanity check against the page's previous hardcoded totals ----
    n_tags = sum(len(r["tags"]) for r in out)
    emo_counts = {}
    cat_counts = {}
    sys_counts = {}
    age_bin_counts = {}
    pilot_yes = sum(1 for r in out if r["pilot"] == "yes")
    for r in out:
        if r["ageBin"]:
            age_bin_counts[r["ageBin"]] = age_bin_counts.get(r["ageBin"], 0) + 1
        for t in r["tags"]:
            emo_counts[t["emotion"]] = emo_counts.get(t["emotion"], 0) + 1
            cat_counts[t["cat"]] = cat_counts.get(t["cat"], 0) + 1
            if t["system"]:
                sys_counts[t["system"]] = sys_counts.get(t["system"], 0) + 1

    print(f"respondents: {len(out)}  total tags: {n_tags}")
    print("emotion:", emo_counts)
    print("age bins:", age_bin_counts)
    print("pilot yes:", pilot_yes, "/", len(out))
    print("demand (top 5):", sorted(cat_counts.items(), key=lambda x: -x[1])[:5])
    print("systems:", dict(sorted(sys_counts.items(), key=lambda x: -x[1])))
    print("classified system tags:", sum(sys_counts.values()), "/", n_tags)


if __name__ == "__main__":
    main()
