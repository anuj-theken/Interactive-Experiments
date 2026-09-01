/* ==========================================================================
   SURVEY DATA — one record per respondent, per category
   ==========================================================================
   Generated from the raw CSVs in `raw data/` (tenants, landlords, owners,
   non-resident). Field values are the respondent's literal chosen answer
   text (or '' if left blank) — every chart module aggregates these into
   counts itself (see js/aggregate.js), rather than the chart data being
   hand-computed and pasted in, so filtering by age/career/region just
   means re-aggregating a filtered subset of these arrays.
   ========================================================================== */

window.SURVEY_DATA = {
  tenant: [
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute"
    ],
    "subjective": "Looking for a house that can offer all of the features such as affordability and connectivity in terms of area where you living, you have to take a call on which is the driving factor for the decision you made"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "10% increment every year"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Finding a house within your budget in a locality where it has the following no basic amenities -> car parking, power backup, security, elevator & 24x7 water supply"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Landlords increasing rents arbitrarily (and not in a time-bound manner) based on prevailing rents in the locality in complete disregard of other factors like quality of interiors, amenities, etc. of the houses charging such high rents."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Brokers",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": "Water issues in Whitefield plays a big role when switching flats in that area."
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": "There are rent laws on security deposits but no one honors it. Am I supposed to go to indian courts for it? It is clearly written in contract rent and deposit. The law seems toothless"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Reason 1: Increase in property prices resulting in higher rents.   Reason 2: Rents are being inflated by brokers for commission. Reason 3: Landlords tasted success with renting 1 room for 25 to 50K to 3 people rather than for single tenant."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Matching house expectations with commute distance"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "11–20%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "That I've to see it go away from my account !!"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "It didn't go up",
    "coping": [
      "savings"
    ],
    "subjective": "Getting fleeced by landlords and brokers"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding an affordable place close enough to your workplace"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Traffic and high rentals"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "21–40%",
    "coping": [
      "delayed"
    ],
    "subjective": "Finding the place, brokerage,"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "More than 10 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "11–20%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "More than 10 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Discrimination"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "More than 10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "bachelors and vegetarian"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "commute"
    ],
    "subjective": "Finding good home owner"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "Security advance, Refund deduction while vacating, Brokerage, Closer to work location"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Finding ways to avoid traffic to office while finding rental home"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "West",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Finding a house"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "21–40%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Student",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "paying brokerage and high deposits"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "If both husband and wife working, it is difficult to find a flat which is not leading to 60+ minutes commute one way, in a budget one is comfortable."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "11–20%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Lack of good homes"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Finding a decent place  (ventilation, connectivity, allows batchelors)"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "40–50%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Wanting to upgrade to a better house with evolving is not a possibility. Even after 5 treats."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Finding the balance between price and quality"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Finding a good affordable society near work place"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "21–40%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "Dealing with landlords"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "savings"
    ],
    "subjective": "Atiny fraction of tenants working in high paying industries are willing to pay a hefty premium. All landlords in the locality use that as a common benchmark to drive up rents. Post covid, brokers are to blame as well - given the constant inflow of migrants from all across india resulting in continuous demand for housing, brokers incite landlords with the lure of getting higher rentals, forcing existing tenants to cough up more or vacate."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "none"
    ],
    "subjective": "Finding a place close to work"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Finding a house more than renting"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "21–40%",
    "coping": [
      "none"
    ],
    "subjective": "Zero negotiating power, you can try but landlord has other people who’d pay what the owner asks and then some more."
  },
  {
    "age": "25 – 34",
    "career": "Student",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "It didn't go up",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": "Finding a decent house in budget"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Something else",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": "all parties involved in renting out properties are incentivised to be a terrible experience. brokers don’t look at your basic qualifications, landlords don’t even bother thinking of the law, and the government doesn’t bother enforcing anything to improve standards of living. the conjunction of these three makes it impossible to be a tenant in this city if you’re not well connected or rich"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Rents are exorbitant. The renter doesn't have much leverage when it comes to negotiation since there is always someone willing to pay it."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Rent for old and sub par apartments are not reasonable in areas with decent demand"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "Mediocre housing charging high rents simply because a premium property in the vicinity is charging high."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "savings",
      "delayed"
    ],
    "subjective": "Finding affordable houses that aren't boxed in on all sides with buildings less than 10m away"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "The fact that you know that you will never get your advance back but yet you have to pay an hefty advance plus brokerage and all other moving in expenses and still you will be kicked out anytime they feel like"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "Over 50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "West",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Not many good options"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "commute",
      "flatmates"
    ],
    "subjective": "finding a place for single woman apart from sharing with another flatmate"
  },
  {
    "age": "25 – 34",
    "career": "Not working right now",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "Finding an apartment with amenities, connectivity while being affordable and in the main city."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "savings"
    ],
    "subjective": "getting money back from the current landlord at the end of your stay."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "Insane deposits, high rents, and one-month rent cutoff for painting and extra charges for when you want to move. Also discrimination against religion and family type"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Very limited societies due to unorganised and haphazard development unlike Noida and Gurgaon. There is skewness in rent between standalone buildings vs gated societies."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding the right flat, which is central, is well-kept, and has a good community. Search is the biggest trouble in central Bangalore. Most listings are fake."
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "House hunting, with an extremely fragmented market that is mostly inaccessible unless you know the right broker"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding houses near place of work to ensure we're not spending hours in traffic"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "More than 10 months",
    "payShare": "40–50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "More than 40%",
    "coping": [
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "Deposit being eaten up"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "The quality of homes (and locality) you get even after paying exorbitant rents. And the prohibitive deposit. How do landlords expect renters to have several lakhs just lying around for them to lock in?"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": "The demand for good places is too high. The landlords love to take advantage. Any argument ends up being 'but you all earn lacs per month why are you negotiating for this few thousands or few tens of thousands....'"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "North",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "commute"
    ],
    "subjective": "Brokers, landlords and deposits"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "I'm lucky, I've got a great landlord that only hikes rent every 3 years from a relatively low base. But, that's an outlier. Part of the problem is the VC market flooding the high end in BLR, part of it is the generic problem India has with more people who own two houses than people who own one. We don't have a middle class, and that's particularly problematic in cities."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "flatmates",
      "savings",
      "delayed"
    ],
    "subjective": "Language barrier, when they know you are in need they take advantage."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "flatmates",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Not sure",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": "Taking deposit back"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Getting a good society without exorbitant rent"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Outer",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": "The annual hikes"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Same flat with limited facilities, rates have gone up, rent blindly increased, without looking at whether your flat has that facilities or features"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "Finding a good landlord."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute"
    ],
    "subjective": "Getting places with decent facilities in affordable rent"
  },
  {
    "age": "25 – 34",
    "career": "Not working right now",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Places closer to office is shit expensive and travelling is a pain too"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "More than 10 months",
    "payShare": "40–50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "More than 40%",
    "coping": [
      "savings"
    ],
    "subjective": "Lack of trust towards non Kannadiga Bangalore landlords are having."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": "Finding a property that matches your basic needs of light and space at a decent price"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "It has stopped feeling like you're renting an apartment, but feels more like you're paying someone else's home loan EMI. The deposits charged are in correlation to the rent, and with exorbitant rents, it's a double-edged sword. Also think given tax concessions for rent, higher-salaried IT folks don't mind paying this rent, increasing the rent pricing for all. Pay higher in rent, pay less in taxes, and maintain a higher standard of living because you can afford to. (it's a twisted logic, but I think there's something there)."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Price gauging for outsiders; Outsiders not considering to live alternative comfortable non-society apartments; broken relationship due to greedy landlords; just-need-a-quick-buck brokers"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Something else",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Areas near offices are unaffordable and unliveable. Staying in affordable areas makes you spend eternity on Bangalore roads. Metro connectivity would put BSNL to shame."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "It didn't go up",
    "coping": [
      "downgrade",
      "flatmates"
    ],
    "subjective": "Judgy landlords"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "40–50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "It didn't go up",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding a place that justifies the asking rent. Low rent places are all concrete barnacles and high end places are way too overpriced for the facilities they come with"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "delayed",
      "none"
    ],
    "subjective": "Painting charges, enormous deposits, high rents, high maintenance"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute"
    ],
    "subjective": "The random deposit which the owners demand, makes no sense. Am I responsible for the children’s education/marriage?"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Outer",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Something else",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "1 month rent is deducted at leaving for painting walls"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "If its close, its dilapidated/not luxurious/not clean enough. All parameters do not line up"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "delayed"
    ],
    "subjective": "Even if the rents are sky high, the houses aren't nearly good enough to match it. Yes tech bros have inflated rents as well, but landlords need to come back to earth about the kind of places they are renting as well when it comes to the amount of rent they are charging"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "West",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": "Security Deposit without interest or return gurrantee"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Outer",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Sky high rents"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "40–50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "Not sure about getting back our deposits"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "flatmates"
    ],
    "subjective": "Brokerage and avoiding frauds"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [
      "downgrade",
      "flatmates",
      "delayed"
    ],
    "subjective": "Finding a decent house that is livable and not far from the office location"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "1. You lose a month's rent from your deposit for \"painting charges\"\n\n2. You lose another month's of rent in brokerage\n\n3. You need to pay a significant deposit amount which you will lose 2/3rd of when you move out later. \n\n4. You need to move with the job, so you never know when you'll have to move out again."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Quality for the rent being paid. Almost all the 'good' flats have to be sourced via a broker. Moving in/moving out charges by the association"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "Lack of supply of apartments and poor negotiation power with tenants"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Finding a decent place without a broker"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "The overheads - they are significant and unpredictable. The tenant takes care of repairs, electricity and gas, maintenance and at the end of a lease - also of repainting and replacements. The switching cost of homes for a family including landlord deductions, packing and moving and associated expenses has started touching 6 figures."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding a nice landlord… its a relationship that needs to be beyond transactional"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "The security deposits are unreasonable. When I was looking for a 1RK in Rajajinagar, even for rents under 10k, owners were asking for deposits over 1 lakh."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "More than 40%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Not sure",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Finding a place with proper facilities, if things are good, deposit is a lot, there will be some trade off."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "flatmates",
      "savings",
      "delayed"
    ],
    "subjective": "Landlords and their whimsical rules"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "Taking time to decide - the \"good\" places or even the \"decent\" places go off so quickly you don't have time to weigh options - like you did even 3 years ago. Most of the brokers I've interacted with are scammers who sell up the house to you and then the landlord adds rules to the place once you move in. Not to forget it COSTS so much to just live a life in the city."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "The rents are unreasonable most of the time. And this is to do with property rates which is just purely based of certain mafia who owns the lands and builders."
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "Finding good propertly at affordable price"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Seamlessly able to find and visit homes in a particular area"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": "Finding a house that’s close to work"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "No checks on landlords whatsoever and no legal redressal for tenants."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": "The number of hoops you have to jump through just to live comfortably. The said comfort comes at a cost of stress — financial and emotional, both — which renders the gained “comfort” more or less obsolete."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": "Finding a place as a bachelor, especially if you are from a marginalized community."
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding a reasonably priced house in a good locality (read safe) is difficult. Especially in gated communities. On top of that, landlords often demand security deposits of 4 to 5 months' rent and impose unusual conditions, such as asking for your work experience, restricting friends or family from staying for extended periods, and withholding up to 1.5 months' rent from the security deposit when you move out."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates",
      "delayed"
    ],
    "subjective": "I feel this is true for every Indian city but the fact is, it doesn't matter if there are rental regulations because in reality if one tries to bring up the legalities or illegalities of renting, then landlords will simply ask them to find another house. That's why they get to dictate their terms. \n\nFor instance, in Bangalore landlords are still asking for an exorbitant security deposit despite the new regulation. Secondly, generally landlords demand rent in cash to evade taxes. Thirdly, they enforce rules on food habits, castes and religion and there's nothing one can do about any of this. The entire housing system is titled in favour of the landed."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Over 50%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Disagree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "flatmates",
      "savings",
      "delayed"
    ],
    "subjective": "difficulty finding decent enough houses. balconies and well-ventilated flats becoming a commodity instead of a necessity. insanely high security that we might never get back. high prices for what reason idk."
  },
  {
    "age": "Under 25",
    "career": "Self-employed / run my own business",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "21–40%",
    "coping": [
      "delayed"
    ],
    "subjective": "Deposits"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "21–40%",
    "coping": [
      "none"
    ],
    "subjective": "On account of traffic, you want to stay close to the workplace but that is getting extremely difficult"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Many landlords require rent to be paid out in cash and do not provide any receipts"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "flatmates",
      "savings"
    ],
    "subjective": "Deposit amount and lack of fair marketplace"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": "job market is volatile but rent is a fixed monthly expense"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Brokers have captured the market and they are inflating the rent. On exit the owners deduct 1 month+ rent as painting charges. It is a lose lose for tenants. If you move, you pay 2 month of extra rent for security deduction and brokerage. If you don't you are stuck with the owners."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": "It's hard to get any decent houses with lift, etc. without a broker. And when rents are high, paying one month rent as brokerage makes it punishing. Especially because deposits are minimum 1 lakh and are often 3 lakh and above for 2 bhks. And the mandatory \"1 month rent will be deducted as painting charges\" clause in all rent agreements is unfair. If someone needs to rent a house for just one year, they end up paying rent for 11 months + 2 months (brokerage &  painting charges). The house owners sometimes deduct charges over this for repairs, etc. \n\nAnd in gated communities, there are people who informally do brokerage work who take money even if you found the house through a message on a group shared by the house owner -- my sister ended up paying 30K to a lady who had the key and showed the house to them despite coming across the house through a message from the owner in a WhatsApp group. And in fancy gated communities, it becomes a matter of pride and embarassment to push back or fight such a thing. \n\nAlso, I've seen house owners openly telling my muslim friend no and one even followed it up with \"there are terrorist problems these days\"."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "I stay in a PG, but the rent has randomly hiked 3-4 times within a year, which made no sense"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Getting fresh air and natural light are a premium"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Landlords are selective. Can stop entertaining based on LinkedIn profiles."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Finding leads in good societies."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "flatmates",
      "delayed"
    ],
    "subjective": "Sky high rents for basic apartments near office - no cap on rent increases or enforcement on landlords to cap deposits etc."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Renting is okay, free market, voluntary negotiation between buyer and sellers. Sellers have higher power due to Black Money involved in buying property, government policy on building codes, FSI and poor infrastructure in most places."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "delayed"
    ],
    "subjective": "Owners can dictate all terms (5 month deposit and 1 month painting charge is unheard of anywhere else in India). Rent are just high."
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates",
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "",
    "career": "Not working right now",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "More than 10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": "The deposit, the water, and power backup"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Broker"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed",
      "none"
    ],
    "subjective": "Insane rates for no facilities"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "Outer",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Rents are extremely high and landlords are very finicky. Deposits are the highest across the country."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Something else",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "21–40%",
    "coping": [
      "savings"
    ],
    "subjective": "Finding a house owner with empathy who understands not everyone is making 24LPA+"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "finding the right balance between location and affordable rent"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding a flat in a gated society"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "30–40%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding well maintained homes"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "Rent amount"
  },
  {
    "age": "45 – 54",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "",
    "reasonRisen": "Something else",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "",
    "coping": [],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "downgrade"
    ],
    "subjective": "No negotiation power for the tenant. Landlord do most of the talking & dictate"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "If I want a new house that has a modular kitchen and attached bathroom, I need to pay at least 50-70% of my take-home salary. In my budget, all I can afford is dingy houses that are not at all maintained, the kitchen is just there, no sunlight coming in - all this in Indiranagar. We just cannot afford a good life."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "40–50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "",
    "coping": [],
    "subjective": "Being single is a costly affair in Bangalore."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "21–40%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Security Deposit"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "North",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [],
    "subjective": "Rent + Maintenance+ water bill + electricity"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding good apartments worth the rent being quoted"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "flatmates"
    ],
    "subjective": "We have been ghosted by brokers.🥲\nRents are so high but localities don’t have a decent road. It’s a bubble inside the society. \nWant a society for safety but places like Hsr and Kora have so few of them and will never rent to bachelors at right prices. \n40k for 1 bhk is insanity!"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding a well ventilated flat at a reasonable price WITHOUT a broker"
  },
  {
    "age": "35 – 44",
    "career": "Not working right now",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "It didn't go up",
    "coping": [
      "delayed"
    ],
    "subjective": "High rents for no rhyme or reason. A 3 bed ground floor unit with zero ventilation and sunlight goes for 60 to 70k. Why? Also it’s in a 30 yo property. Question the owner and the simple answer is. When you can’t afford why wasting my time. 2 bed rents are north of 45k. Again no reason."
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Anything close to prominent work areas are too too expensive, so you have to increase travel time to ensure rentals are okay as well as society and appartment are good enough"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "It didn't go up",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": "A centralized digital resource to finding apartments. There are many channels (Facebook groups, WhatsApp groups, Websites like Housing.com,  NoBroker,  MagicBricks), both paid and free, in which most listings are unreliable. They will either turn out to be scams, or landlords will arbitrarily change prices/terms of the agreement.\n\nAnother tough part is being a non-IT service employee and looking for houses. Everybody just assumes our salaries are on par, but most of us don't make enough money to live comfortably in a metro city. (To illustrate that: our incomes 4-5 years into our career still fall below the lowest tax bracket -- i.e. we're exempt) Renting makes up a much larger portion of our income than it does for IT workers with salaries exceeding 1 lakh a month."
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "The hardest part is usually the upfront cost: most landlords ask for 6–10 months' rent as a security deposit, which is brutal for a big city.\n\nBeyond that, tenants struggle with:\n- Broker fees on top of the deposit\n- Frequent rent hikes at renewal (often 10%+ per year)\n- Limited stock in prime tech-corridor areas (Koramangala, Indiranagar, Whitefield) near work, so long commutes are common\n- Landlords being picky about food/lifestyle preferences (veg-only buildings, bachelor restrictions)"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Rising rents overall: rents have climbed sharply post-pandemic as people returned to office and demand outpaced new supply, especially in tech corridors like Whitefield, Sarjapur Road, and HSR Layout.\n\t•\tTraffic-driven location lock-in: because commutes are so bad, people end up paying a premium to live close to work, which shrinks their options and bargaining power.\n\t•\tWater and power issues: many newer apartment complexes on the outskirts rely on tanker water supply, and tenants often don’t find out about shortages until after moving in.\n\t•\tLack of standardized rental agreements: verbal promises about maintenance, deposit return, or notice periods often don’t hold up, and tenants have little legal recourse compared to more formalized rental markets elsewhere.\n\t•\tDeposit refund disputes: getting the full security deposit back at move-out is a common pain point — landlords deduct for “wear and tear” that’s disputed.\n\t•\tFurnished vs. unfurnished confusion: listings aren’t always accurate, so what’s advertised as “semi-furnished” varies wildly, leading to surprises during viewings.\n\t•\tBroker-dominated market: many good listings never make it to portals like NoBroker or 99acres because brokers keep them exclusive, so word-of-mouth and local Facebook/WhatsApp groups often work better than apps."
  },
  {
    "age": "45 – 54",
    "career": "",
    "region": "Central",
    "deposit": "",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "21–40%",
    "coping": [
      "savings"
    ],
    "subjective": "Landlords have just no concern and keep raising rents. My landlord asked for a 22% increase."
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates",
      "delayed"
    ],
    "subjective": "Cost and landlords monopoly"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "Being at the mercy of landlords or societies in aspects like rules, dos and don'ts, rent hikes, parking etc."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding good place with uninterrupted water supply and dealing with brokers."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "The market is cornered by brokers. Need better price discovery mechanics."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Discoverability and expectation gaps"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "The fact that you dont have an option but to do what the landlord says, if you disagree you'd be homeless. So it's a take it or leave it for renters."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "Need to find near office to manage traffic, which means higher rents and cost of living and lower standard of living."
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Hard to find a good house near to office location"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "",
    "coping": [
      "delayed"
    ],
    "subjective": "Extremely high security deposit, probably the worst in the globe"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Not sure",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "Finding a clean suitable place; not being taken advantage of by local brokers and landlords; travelling to, visiting each flat and dealing with multiple brokers"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding a good place for bachelor"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "Rising costs across the board - rent + house help costs + cook + maintenance. It's just extremely expensive. Higher salaries in certain pockets (Indiranagar, MG Road, etc.) make it impossible for someone with lower salaries to live there"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "reasonable rent, manageable traffic and amenities - all together"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [],
    "subjective": "High rent - say 50k for an average 2bhk has been normalised. You get nothing extra. The same garbage outside the apartment, the same issues. \n\nThe landlords and brokers have become arrogant and started judging people based on religion, job profile or the state where they come from. \n\nThe landlords assume that if you are not IT, you can’t afford rents and hence they choose not to show the house. \n\nA stronger rule will change it and people should stop paying ridiculous amounts as rents."
  },
  {
    "age": "",
    "career": "Self-employed / run my own business",
    "region": "East",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "West",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "",
    "payShare": "",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "It didn't go up",
    "coping": [
      "commute",
      "savings",
      "delayed"
    ],
    "subjective": "Finding the right house"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Money"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "West",
    "deposit": "More than 10 months",
    "payShare": "30–40%",
    "reasonRisen": "",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": "Lack of abundant \"good\" options"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Finding a space with decent lighting and air ventilation."
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "downgrade"
    ],
    "subjective": "Finding reasonable (rent vs facilities) homes in moderately connected areas"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Something else",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "The hardest part is that the public infra is not good enough, so you are forced to pay rent close to office, that means hot rental pockets due to localized demand/supply."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Brokerage menace; Rental hikes should be capped; Apartments should disband move-in and move-out charges."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "If Metro was like NCR, no one will mind staying far...but with school, office and traffic leaves us with little choice"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "",
    "leaveRent": "Another 25%",
    "renewalHike": "",
    "coping": [
      "downgrade"
    ],
    "subjective": "The uncertainty of sudden increases because of the greed of both home owners and brokers."
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Over 50%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "11–20%",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "West",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": "There isn’t any. Check out Chennai, Kochi, Delhi to know how a tenant is under a microscope before  deal is done."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "It didn't go up",
    "coping": [
      "downgrade"
    ],
    "subjective": "Very high deposits and hooliganism/groupism by landlords"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Lack of Amenities for the given rent"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Landlords expecting usurious rents and paying little head to rights of tenants"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Security deposit. The rent itself is very high and 4x or 6x of that rent is just too much to give in one go.\n\nTo be honest it's all landlords taking advantage since there are more takers they simply raise the rent. It's pure greed. It's causes the city to become expensive. These people are at the core of it and they don't even know it. It's a vicious cycle that they start. \n\nRent up -> business prices and salary ask up -> stuff and services increase in price -> everything becomes expensive for everyone even landlords -> rent increase because the heat comes back to the landlords."
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Something else",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Competing with food preference"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "Central",
    "deposit": "More than 10 months",
    "payShare": "",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "More than 40%",
    "coping": [],
    "subjective": "Arbitrary nature of rents in a location with no standardization of amenities, facilities, or even in some cases, area"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Rents are just too high"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "The security amount to shift anywhere is insane. I’m bound to stay at this current flat for the last 3 years because the shifting security, the brokerage are insane. The tenant honestly doesn’t have much say in any of this- my landlord has put a clause in my agreement that when I move out, I have to give up a months rent for repairs and repainting. So effectively, for me to move out to a different house with lower rent, is not any cheaper. So I end up taking the 10% hikes every year."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Finding decently priced house closer to office and other essential amenities. The biggest problem is the crumbling infrastructure. I can live farther away but traffic is a nightmare (orr commuter- office in mahadevpura, stays in ecity)!!"
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "Cheap, affordable rent. No mechanism to control rental increase"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Outer",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Matching expectations of home owners in terms of rent and conditions"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "21–40%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Not working right now",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "21–40%",
    "coping": [
      "none"
    ],
    "subjective": "I still consider myself lucky to have good amenities for the rent I'm paying. Others pay exorbitant rent just to stay near their offices and other hotspots, which doesn't make sense for me. The salaries people have, and the pressure they live with, they are always willing to throw money at things (for fancy houses and hot areas, just like founders and VCs) than actually adjust a bit (particularly live a little far from office with better amenities at same or lower price)."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Even the local, no amenities, independent houses wants rent like premimum community apartments with all amenities and security. Landlords have no differentiation."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Right society"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": "finding the right place"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "40–50%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Decent homes for affordable prices and bad maintenance"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Brokerage"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Finding a good place you make it home"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Scarcity of supply. Especially in jayanagar."
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute"
    ],
    "subjective": "nothing really versus owning a home, if that's the Q; BLR is just too noisy, too much traffic, etc. Its a BLR problem not a renting problem"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "North",
    "deposit": "",
    "payShare": "20–30%",
    "reasonRisen": "",
    "hikeLast": "I negotiated it down",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "",
    "coping": [
      "none"
    ],
    "subjective": "There is always a set of people who are paying very high rent,which pushes the market far ahead of what it need to be"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I negotiated it down",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "",
    "coping": [
      "none"
    ],
    "subjective": "Getting the right sized apartment near the office"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "West",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Not getting a value for money on the rent"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [
      "flatmates"
    ],
    "subjective": "Even after paying a good amount of money, most houses are poorly constructed. You end up viewing at least 20 flats before finalizing one and even then, you have to compromise on either the locality, ventilation, apartment size, or something else."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "21–40%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Finding the right neighborhood, with the right configuration of flat, too many variables to optimize on"
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Getting a good landlord and a good deal"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "21–40%",
    "coping": [
      "none"
    ],
    "subjective": "Landlords have all the power. Even in premium residential societies, there's discrimination against renters and owners. There's no protection for the security deposit."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "The ability to get another flat in case your current landlord chucks you out because there are limited housing available in central bengaluru"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": "No good place available for a decent price"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "West",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "To be able to find a good house and decent owners. Landlords are very difficult. They have their own rules and it becomes difficult to find good people."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Student",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Brokers",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Logic"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Houses don't justify the rent"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "South",
    "deposit": "",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "More than 40%",
    "coping": [
      "none"
    ],
    "subjective": "jhhj"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Not sure",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "More than 40%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Despite paying high rent, not getting enough ROI for the rent. Eg: Less space, minimal amenities, Far away from office"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "flatmates",
      "delayed"
    ],
    "subjective": "Finding friendly housing societies for bachelors and pet owners"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Getting a decent house to live in a decent society which is not too old."
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Moving in and out"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "The rules are still landlord friendly. In areas like Delhi/NCR you don't have clauses like one month rent deduction, 6 month security  deposits"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "It didn't go up",
    "coping": [
      "commute",
      "flatmates"
    ],
    "subjective": "The prices!"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "North",
    "deposit": "More than 10 months",
    "payShare": "",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "",
    "coping": [
      "none"
    ],
    "subjective": "Rent levels"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed",
      "none"
    ],
    "subjective": "Finding house without broker. And broker takes one month's rent. Nobroker is pretty useless in areas like Indiranagar."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding a place with balcony, unblocked window without a premium"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Deposits and ever increasing rents."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "deposit": "More than 10 months",
    "payShare": "20–30%",
    "reasonRisen": "",
    "hikeLast": "",
    "rentLimit": "",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "More than 40%",
    "coping": [],
    "subjective": "The scarcity premium that comes from lack of standard housing stock in central Bangalore"
  },
  {
    "age": "Under 25",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": "The high Security Deposit"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "West",
    "deposit": "9–10 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Discovery of homes"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "West",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "",
    "coping": [
      "commute",
      "downgrade"
    ],
    "subjective": "High deposits and no certainty of deposits being returned"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding a good place (place + facilities+ interiors) in your budget"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Rent is too high…no value for money… only because of earning opportunity is keeping me here otherwise no other reason can keep me here…if I get any opportunity, i will move out…I have been to Mumbai before and there things are much better, even though he rent is ok but people and other livening things are better….given same salary, I will be more than happy to move out as soon as possible.."
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "West",
    "deposit": "More than 10 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding the right home"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "Exorbitant rental prices"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Outer",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Good quality villas are extremely tough to get and are expensive"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding good places nearby"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Tenants have no say and have to comply to anything and everything to get a decent flat"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "More than 40%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding a good community near desired location"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "West",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Uncertainty. Might have to move out not just bcoz you don’t want to pay the rent but bcoz landlord suddenly came back to city or something else. It’s particularly difficult when your kid is in school and you have house help etc setup and the move is simply a nightmare"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "When the owner asks to change , need to house hunt , deal with agents , deal with monetary pinch of moving things and settling again"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": "I tend to think landlords should stop thinking about tenants as an ATM and move towards being hosts. Tenants on the other hand should look at the accomodation as their own and do whatever it takes to keep it in pristine condition. This needs teamwork and it maybe a business but above all else its a basic human need. Or maybe lets just buy sleeping bags and start camping."
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "Old homes and big rent"
  },
  {
    "age": "",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "",
    "rentLimit": "",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "21–40%",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Not getting value for money"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "More than 40%",
    "coping": [
      "savings"
    ],
    "subjective": "I've lived in the same neighbourhood for 26 years. The neighbourhood's been getting attention for its \"kind\" community (Which is wiftly disappearing because it's being seen as an experience, not as something residents need to contribute to) over the past decade, is gentrified, rents have gone up 80% in the last 5 years. When it's time to move next, I'll need  to shift out of here just to keep rent manageable."
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": "deposit and the attitude of landlords who think they can charge whatever they want and outsiders will have to pay"
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "North",
    "deposit": "",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "",
    "coping": [
      "downgrade"
    ],
    "subjective": "There are very few places without unreasonable conditions like no bachelors, no pets, only married couples eyc"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed"
    ],
    "subjective": "Finding a good house (light, ventilation etc) with no landlord interference, and also dealing with the brokers (you will almost never get to view a house without a broker being involved)."
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "Outer",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "11–20%",
    "coping": [
      "none"
    ],
    "subjective": "Finding value for money homes as everything seems overpriced"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "40–50%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Find a good flat in budget"
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "There is no value in the rental market. The house is not worth the rent."
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "",
    "coping": [
      "delayed"
    ],
    "subjective": "Hard to find a place with reasonable travel time to office"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "delayed"
    ],
    "subjective": "Rent amount =/= Facility. Around the IT corridor the race of converting old PGs into exorbitantly high priced 1BHKs (or compact 1RKs) with burdened with same PG issues has been a revelation to many people coming from Northern or Western part of India."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "flatmates"
    ],
    "subjective": "The deposit at the start, which really should only be a month or two of a deposit. 6 months or more is criminal because it’s money we don’t have."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": "High deposits, bare minimum facilities even with exorbitant rents, finding inventory without a broker"
  },
  {
    "age": "35 – 44",
    "career": "Early career",
    "region": "West",
    "deposit": "",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "",
    "coping": [
      "savings"
    ],
    "subjective": "Beyond limit"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "downgrade",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "9–10 months",
    "payShare": "20–30%",
    "reasonRisen": "Brokers",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "21–40%",
    "coping": [
      "savings"
    ],
    "subjective": "Exorbitant rents"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Disagree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": "Great locality and spacious housing is very expensive"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "It didn't go up",
    "coping": [
      "flatmates"
    ],
    "subjective": "Finding a good apartment with a good layout"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "flatmates",
      "savings",
      "delayed"
    ],
    "subjective": "Really terribly behaved landlords"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Finding a good place"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly disagree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "11–20%",
    "coping": [
      "flatmates",
      "savings",
      "delayed"
    ],
    "subjective": "The entire thing: Brokers taking a month's rent as a cut, landlord not giving the entire deposit during the time of vacating, removing again a month's in the name of renovation even when the damages are minimal. Deposit seems to be the hardest part but it's the overall aspect. Tenets are usually not able to push back on the rent increase because there's a risk of being thrown out as others in dire need are ready to pay that rent price."
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "South",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Something else",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Agree",
    "leaveRent": "Another 25%",
    "renewalHike": "It didn't go up",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "I’ve never really struggled. I’ve been in the same house since I moved here and it’s great because I have a lovely landlady."
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "South",
    "deposit": "",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "30–40%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade",
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Up to 10%",
    "coping": [
      "flatmates"
    ],
    "subjective": "With the same rent I can live better somewhere"
  },
  {
    "age": "45 – 54",
    "career": "",
    "region": "North",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "IT salaries",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "savings"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "21–40%",
    "coping": [],
    "subjective": "There are no rental laws protecting renters and the courts do not bother creating a system for handling such disputes. My landlord has a politician brother he had the property registered in the name of his sister. When I left the apartment my entire 1 lakh deposit was kept inspite of the fact that when I was leaving I got the entire house painted because they were quoting me double the amount I was getting the painting for. When I told her I will sue if they don't send me back the money, as they are clearly violating the rental agreement she said go ahead. So I went to register a case in the police station, they called the lady on the phone, spoke for 5 mins in Kannada and then refused to file a case. Tried another dozen things, but with a myriad of other things to take care of, i stopped trying to get my money back."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Something else",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Disagree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "21–40%",
    "coping": [
      "downgrade"
    ],
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "South",
    "deposit": "More than 10 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Not sure",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "commute"
    ],
    "subjective": "landlords do not return the deposits. tenants get a step figure treatment. a lot of discrimination. brokers don't pay taxes. in the name of painting, even normal wear and tear repairs are done by landlords. landlords are so hungry that they don't even provide parking facilities and construct buildings with 10-15 units for rent. idiots"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "delayed",
      "none"
    ],
    "subjective": "Paying exorbitant maintenance charges as most apartments do Not have good facilities even after paying rent"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "Outer",
    "deposit": "3–5 months",
    "payShare": "",
    "reasonRisen": "IT salaries",
    "hikeLast": "",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "21–40%",
    "coping": [
      "commute"
    ],
    "subjective": "Finding a good house worth of the rent being paid"
  },
  {
    "age": "",
    "career": "Senior career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I negotiated it down",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Up to 10%",
    "coping": [],
    "subjective": "Good flats or decent flats are way too expensive, regardless of whether they are located in a gated community or not. This is because as plethora of private three floor buildings with very shitty housing for your options of getting a decent limit that you have to be willing to pay the premium of either living in a gated community and dealing with everything else that comes with it or pay for a better accommodation. For areas like Kormangala or Indira Nagar, you have to pay to live in the area and housing will barely matter."
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "region": "East",
    "deposit": "More than 10 months",
    "payShare": "20–30%",
    "reasonRisen": "",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "11–20%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Rules which they put"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Entire societies being monopolised by 1-2 brokers."
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I negotiated it down",
    "rentLimit": "",
    "leaveRent": "I'm already past my limit",
    "renewalHike": "",
    "coping": [
      "none"
    ],
    "subjective": "Value received vs rent"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "30–40%",
    "reasonRisen": "IT salaries",
    "hikeLast": "I walked/moved out over it",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "downgrade"
    ],
    "subjective": "Landlords raising rent because there are people willing to pay it"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "6–8 months",
    "payShare": "Under 20%",
    "reasonRisen": "",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "region": "East",
    "deposit": "3–5 months",
    "payShare": "Under 20%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Up to 10%",
    "coping": [
      "none"
    ],
    "subjective": "Getting a decent home which doesn't break the pockets"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Not enough housing",
    "hikeLast": "I pushed back, and they didn't budge",
    "rentLimit": "Agree",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute"
    ],
    "subjective": "Frequent rent hikes and low bargaining power (survey flow test)"
  },
  {
    "age": "Under 25",
    "career": "",
    "region": "Central",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "",
    "leaveRent": "Another 10% and I'm out",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "South",
    "deposit": "3–5 months",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "I paid it, no discussion",
    "rentLimit": "",
    "leaveRent": "I'll pay whatever it takes to stay",
    "renewalHike": "Up to 10%",
    "coping": [
      "commute",
      "delayed"
    ],
    "subjective": "Finding good houses and the opacity"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Too many people moving here",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "",
    "region": "Central",
    "deposit": "",
    "payShare": "",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "Another 25%",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "none"
    ],
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "Central",
    "deposit": "1–2 months' rent",
    "payShare": "20–30%",
    "reasonRisen": "Landlords taking advantage",
    "hikeLast": "Haven't faced a rent hike",
    "rentLimit": "Strongly agree",
    "leaveRent": "I'd never leave over rent",
    "renewalHike": "Haven't renewed / not applicable",
    "coping": [
      "savings",
      "delayed"
    ],
    "subjective": "Finding a place that fits all criteria -- location, price, maintenance, security etc. I have comparatively low rent considering the location and security afforded, but the maintenance of the flat is quite poorly done."
  }
],
  landlord: [
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Other reasons",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "East",
    "portfolioSize": "More than five",
    "motivation": "I bought it to earn rent",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Strongly disagree",
    "lastHike": "More than 40%",
    "vacancySpeed": "It has not been vacant in years",
    "raiseReason": "People were ready to pay",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Other reasons",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "Two",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Disagree",
    "lastHike": "11–20%",
    "vacancySpeed": "More than a month",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Sell the house"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly agree",
    "lastHike": "I did not raise it",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "I did not raise it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it to earn rent",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "45 – 54",
    "career": "Not working right now",
    "region": "Outer",
    "portfolioSize": "One",
    "motivation": "I bought it for my child or for later use",
    "pricing": "It covers my costs",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "portfolioSize": "Three to five",
    "motivation": "Other reasons",
    "pricing": "Honestly, whatever I felt I could get",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "People were ready to pay",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "West",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "I did not raise it",
    "vacancySpeed": "It has not been vacant in years",
    "raiseReason": "I did not raise it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to earn rent",
    "pricing": "Honestly, whatever I felt I could get",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to earn rent",
    "pricing": "I matched nearby houses",
    "rentCap": "Disagree",
    "lastHike": "I did not raise it",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Not sure",
    "lastHike": "Up to 10%",
    "vacancySpeed": "It has not been vacant in years",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "East",
    "portfolioSize": "",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "",
    "vacancySpeed": "",
    "raiseReason": "",
    "cutEarnings": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "People were ready to pay",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Other reasons",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "West",
    "portfolioSize": "One",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "The house was empty/does not apply",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "People were ready to pay",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "South",
    "portfolioSize": "Three to five",
    "motivation": "I got it from family / inherited it",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Not sure",
    "lastHike": "I did not raise it",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "I did not raise it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "West",
    "portfolioSize": "Two",
    "motivation": "I got it from family / inherited it",
    "pricing": "Honestly, whatever I felt I could get",
    "rentCap": "Disagree",
    "lastHike": "11–20%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "",
    "rentCap": "Strongly disagree",
    "lastHike": "",
    "vacancySpeed": "In a week or two",
    "raiseReason": "A new metro or office nearby raised demand",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "Honestly, whatever I felt I could get",
    "rentCap": "Strongly disagree",
    "lastHike": "11–20%",
    "vacancySpeed": "It has not been vacant in years",
    "raiseReason": "Other reasons",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "North",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Disagree",
    "lastHike": "11–20%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "People were ready to pay",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "My costs went up — tax, repairs, loan etc",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "South",
    "portfolioSize": "",
    "motivation": "I bought it to earn rent",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "The house was empty/does not apply",
    "vacancySpeed": "In a week or two",
    "raiseReason": "I did not raise it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "South",
    "portfolioSize": "Two",
    "motivation": "I bought it for my child or for later use",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Not sure",
    "lastHike": "",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it to earn rent",
    "pricing": "",
    "rentCap": "Not sure",
    "lastHike": "11–20%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "region": "North",
    "portfolioSize": "Two",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Other reasons",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Sell the house"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "region": "Outer",
    "portfolioSize": "",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "It has not been vacant in years",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Mid career",
    "region": "West",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Not sure",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Outer",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "Honestly, whatever I felt I could get",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "Other reasons",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "My costs went up — tax, repairs, loan etc",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "I bought it for my child or for later use",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Other reasons",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "45 – 54",
    "career": "",
    "region": "Central",
    "portfolioSize": "Two",
    "motivation": "I got it from family / inherited it",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "It has not been vacant in years",
    "raiseReason": "",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "Other reasons",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "My costs went up — tax, repairs, loan etc",
    "cutEarnings": "Not sure"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "My costs went up — tax, repairs, loan etc",
    "cutEarnings": "Not sure"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "Two",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "More than a month",
    "raiseReason": "Other reasons",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Mid career",
    "region": "Central",
    "portfolioSize": "Two",
    "motivation": "Other reasons",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Other reasons",
    "cutEarnings": "Not sure"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "East",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "Honestly, whatever I felt I could get",
    "rentCap": "Strongly disagree",
    "lastHike": "21–40%",
    "vacancySpeed": "More than a month",
    "raiseReason": "People were ready to pay",
    "cutEarnings": "Sell the house"
  },
  {
    "age": "35 – 44",
    "career": "",
    "region": "",
    "portfolioSize": "One",
    "motivation": "",
    "pricing": "I matched nearby houses",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "",
    "raiseReason": "",
    "cutEarnings": "There are ways to get around such limits"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "Central",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "My costs went up — tax, repairs, loan etc",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to earn rent",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Other reasons",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "East",
    "portfolioSize": "One",
    "motivation": "I bought it to earn rent",
    "pricing": "The broker or agent told me the rate",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": ""
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it for my child or for later use",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Agree",
    "lastHike": "I did not raise it",
    "vacancySpeed": "More than a month",
    "raiseReason": "I did not raise it",
    "cutEarnings": "Sell the house"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "region": "Outer",
    "portfolioSize": "One",
    "motivation": "I got it from family / inherited it",
    "pricing": "I matched nearby houses",
    "rentCap": "Agree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "region": "North",
    "portfolioSize": "One",
    "motivation": "I bought it for my child or for later use",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "",
    "cutEarnings": "Rent it out for short stays instead (like Airbnb)"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "region": "West",
    "portfolioSize": "Two",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I matched nearby houses",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "I was charging low before, so I fixed it",
    "cutEarnings": "Keep renting — some rent is better than none"
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "region": "South",
    "portfolioSize": "One",
    "motivation": "I bought it to live in, then moved to a different house",
    "pricing": "I took what the last tenant paid and added a bit",
    "rentCap": "Strongly disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a few days — many people wanted it",
    "raiseReason": "My costs went up — tax, repairs, loan etc",
    "cutEarnings": "Keep the house vacant until the rule changes"
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "region": "South",
    "portfolioSize": "Two",
    "motivation": "I bought it to earn rent",
    "pricing": "I matched nearby houses",
    "rentCap": "Disagree",
    "lastHike": "Up to 10%",
    "vacancySpeed": "In a week or two",
    "raiseReason": "Rents in the area went up, so I did the same",
    "cutEarnings": "Keep renting — some rent is better than none"
  }
],
  homeowner: [
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "Move to North Bengaluru"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Not working right now",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Not sure",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": "Move out if possible"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "Look for space near to work place as might you will end up paying high rental but you will save ample of other resources that make your life comfortable & will give you enough time to use for your personal growth or peace !"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Almost impossible now",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": "If you're sure you want to stay in Bengaluru for the long haul, cut your rent losses and buy as soon as you can. Even though you might be priced out of prime locations initially, find something in your budget and make the move as fast as possible.\n\nP.S. Stay away from \"finfluencers\" who post stuff about rent vs buy. You might be able to save in X years, but your dream home is going to get proportionally expensive too, so take that into account as well."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": "Rent smaller, more convenient which you can sustain even without a job for some time."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Try to find a house through your network. Office colleagues already staying in societies can help you find homes nearby."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "Skip the typical posh localities, decent homes are available in lot of layouts, just a km away.. Avoid brokers, online websites are good enough"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Not sure",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Rent only if you can't afford to buy OR have an option to share the rent"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Stay disciplined in investing/spending.  Start with a PG for an absolute beginner. Move to a shared apartment/house with friends as you progress.  Depending on life stage you can have an entire home. Take care of the home as it were your own - and you generally are better off from landlord's perspective and rental appreciations are greatly influenced by tenants good behaviour and maintenance of house."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Strongly agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Almost impossible now",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Don't go over budget"
  },
  {
    "age": "25 – 34",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": "Be prepared, it's a super brutal market. You pay hong kong rents and would very likely end up with super horrible facilities."
  },
  {
    "age": "45 – 54",
    "career": "Not working right now",
    "rentedBefore": "No, I bought without ever renting here",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Strongly disagree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Not sure",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Find something to balance your budget and location. There is enough choice"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Be flexible than being rigid about the location you want to rent in. Patience will get you good options and learn to bargain/negotiate."
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "do your research, build an excel on renting vs owning including long term ownership costs, rent increase and relocation costs. also include assumed returns if invested elsewhere instead of buying. make a calculated decision"
  },
  {
    "age": "25 – 34",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Considering present geo political issue and increasing all materials construction cost is inreasing and inlfation also high. Minimal rent should be fine."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Strongly agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Almost impossible now",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": "Do cost benefit analysis of living in a pro-living environment before taking up units of rent.\n\nIf there is a family as well, best option would be to take relatively older communities where renting is still reasonable\n\nLook for large communities for rent where there is changes of vacancy and competition and people are flexible on rental terms just to ensure less vacancy periods."
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Strongly agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "."
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Strongly disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Far cheaper than Mumbai (!).  Rent today and plan to buy a few years from now, Bangalore is a lovely city"
  },
  {
    "age": "",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "",
    "subjective": "Rent what you afford and take good care of the house"
  },
  {
    "age": "45 – 54",
    "career": "Not working right now",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Almost impossible now",
    "subjective": "Till you build a reasonable bit of saving, and are sort of settled in a location, it's always better to rent than buy. You need flexibility in moving around. Also a large EMI liability creates other issues- what if you lose your job?"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": "Find a good owner who understands you, even if the house may not be 100% to your taste."
  },
  {
    "age": "25 – 34",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "I would recommend them to rent a home they like spending time in, preferably close to a few friends, even if it means a longer commute (if it’s 2-3 days a week, of it’s 5 days then I would recommend staying closer) and reduce on other expenses like going out etc as a good home especially in a society can really uplift your life."
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "",
    "rentLimit": "",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "Renting is better than buying"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Save, the market is getting to tipping point, prices will rationalize in next 2-3 years and you can get out of the security deposit forfeited rigmarole by buying. The rationalization is already underway and resales will come as rates go up. Too many people jumped the gun and can't afford the increase in EMIs coming their way. Society groups are already filled with folks worrying about spending 500/- more for maids."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Hard, but possible",
    "subjective": "Live within your means"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Don't bother with home ownership in the medium term- its a consumption decision and rental yields still don't justify the investment. It may be better to have flexibility to move around and shift locations easily with the job uncertainty that exists now"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Live within your means, share accomodation like we did in the 90s, dont lean on parents to fund your lifestyle."
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Buy somewhere. Anywhere. Even if it's not a tier 1 city."
  },
  {
    "age": "55 and above",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "",
    "todayRents": "",
    "buyingPossible": "Almost impossible now",
    "subjective": "1. compromise between distance to office, and rent.\n2. Marry young, DINK is a way to save rent."
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "No chance at today's prices",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Not sure",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Hard, but possible",
    "subjective": "If you plan to be in Bangalore for the next 7 years, the paln to buy."
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Look at total cost of renting - rent value plus transportation cost to office and back and so on"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": "If you are going to rent a place, stay close to your workplace and social circle. Makes the commute bearable."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Almost impossible now",
    "subjective": "Move out of Bangalore. Or start saving like crazy if you plan to buy a home."
  },
  {
    "age": "25 – 34",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Buy a house in your means, it should not loot you of all your income"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Almost impossible now",
    "subjective": "Buy now"
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "",
    "rentLimit": "Strongly disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "",
    "subjective": "Choose what makes sense from a life perspective"
  },
  {
    "age": "35 – 44",
    "career": "",
    "rentedBefore": "",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Not sure",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": "Im 40 and I actually bought my house during the lucky phase of the world ending (in 2021) when no one was buying. \nBut, I would tell -  move a little away from the office areas (the second last or last metro stations). Try walking anything under 1km. Helps with the last mile mobility. These all aspects bring down the rent.\nIf your salary can help, and you are in a decently stable job, get a scooty (EV) for local commute.\nDo not expect world class complex at the start of your career, renting in an independent house or a PG helps. Know that the rents keep increasing irrespective of your salary. You keep moving outside the city as the rents keep increasing. You also keep moving (sad but true)\nEventually, when you do buy a house, you should buy in an upcoming area nearish to the metro or new metro coming up. Definitely in a community (prestige, Goyal) purely because of the amenities and the family friendly setup"
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Strongly disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Housing cost has always been the single largest item in the yesteryears.. nothing new now"
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": "Bangalore transport is good. Find a cheaper place with a good landlord because rents keep going up and you will anyway end up paying more each year."
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "invest in outskirts and rent it out and use that to pay your rent - central isn't possible"
  },
  {
    "age": "55 and above",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Strongly disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "The rental yield is still a few % of the investment. \n\nIf landlords were to calculate the rental yield with even FD rates, we would hv very few homes to rent \n\nJust because, renters can post on social media, and land lords don’t, does not mean renters are right \n\nLike ur company, land lords have invested their hard earned money in the property, tenants can just leave and go . As a land lord , we are fighting with a hotel next door for the noise . \n\nAs a land lord I can’t move out while a tenant will in 30 days\n\nSo, stop vilifying land lords as villain always \n. \nBuy a house if u want and you will know how hard it is to even pay the EMI and then have to listen to renters complaints \n\nWe bought thinking value of the property will go up, but that is when I sell. Until then it is a 3 % yield per annum \n\nAny body - renters esp willing to invest a few crores for such a pitiable yield ?"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Not sure",
    "todayRents": "",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "Better to stay in a PG or shared apartment and after retirement settle down in a peaceful tier 2/3 city or in the countryside."
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Not working right now",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "I know how difficult it must seem with rents going sky high (have been there), but have some patience, the market adjusts for this - the sheer scale of construction of new flats in Bengaluru is a direct response to this. In 2 years, so many new flats will be on the market, that rents will automatically stagnate (like they did before 2020). \n\nCities with rent caps have other issues - no incentives for new units construction, and then owners are incentivized to evict tenants every year, so they can escape the rent increase caps and get what they perceive to be the actual market rate."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Almost impossible now",
    "subjective": "If you have to buy think about buying a setup which you will need 15 years out. That will be afforadable."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, if they plan and save",
    "subjective": "don't always look for posh gated communities to buy, there are plenty of reasonable budgeted reasonable amenities filled flats"
  },
  {
    "age": "",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Strongly disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was the main reason — I was tired of rent going up",
    "rentLimit": "Agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Almost impossible now",
    "subjective": "Be clear on your priorities. If you want a place close to the office be ready to pay more and save commuting time. That's better than spending so much time in traffic. High rents are a reality of the city"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Disagree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Given property prices, it is safer to rent and gives you the fliexibility. But if you can afford it, buy."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "save aggressively"
  },
  {
    "age": "25 – 34",
    "career": "Self-employed / run my own business",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly disagree",
    "todayRents": "",
    "buyingPossible": "Hard, but possible",
    "subjective": "Rent along the metro line, preferably on the edges (if work permits). A slightly longer commute outweighs the pain of paying high rents to stay within \"happening\". Stay in Vijaynagar over Indiranagar, or Konanakunte (or even Nagasandra) ver Jayanagar."
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "rentedBefore": "No, I bought without ever renting here",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Hard, but possible",
    "subjective": "Don't splurge on high rent early in your career, live within your means, buy a property when you have the financial means and leverage to do so"
  },
  {
    "age": "35 – 44",
    "career": "",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "",
    "rentLimit": "Disagree",
    "todayRents": "About the same as my time",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "Try out lesser known areas in west, or south Bangalore that have metro access."
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Not sure",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Almost impossible now",
    "subjective": "Be prepared to commute at least 1 hr each way."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Almost impossible now",
    "subjective": "Keep renting it's not worth buying a place right now unless you are doing it for intensely emotional reasons"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Not sure",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "No chance at today's prices",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Disagree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "Figure out your priorities and make a measured decision as rent will be your biggest expense. A rental home is still home and it has to be a place to de-stress. Community quality, office commute time, access to facilities are all important factors to consider and more important than the area name."
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "rentedBefore": "Yes, for a short time",
    "pushedBuy": "Not much — I bought for other reasons",
    "rentLimit": "Strongly agree",
    "todayRents": "Honestly, I would not be able to rent my old life today",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Hard, but possible",
    "subjective": "Start saving early and negotiate hard (survey flow test)"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "rentedBefore": "Yes, for many years",
    "pushedBuy": "It was one of the reasons",
    "rentLimit": "Agree",
    "todayRents": "It is worse now, but I would still manage",
    "buyingPossible": "Yes, but only with help from family/friends",
    "subjective": "'-"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "rentedBefore": "No, I moved into family property",
    "pushedBuy": "Does not apply — I did not rent before buying",
    "rentLimit": "Agree",
    "todayRents": "I do not know what rents are like now",
    "buyingPossible": "Hard, but possible",
    "subjective": ""
  }
],
  nonresident: [
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Student",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, never",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "About the same",
    "subjective": "Rent in itself is not the issue. There's plenty of Bangalore outside the Indiranagar Kormanagala HSR triangle but people seem fixated on that area and whine about hefty rents. I stayed in North Bangalore in a 3BHK where my rent was Rs. 40,000 pm. Almost half of what the triangle pays. \n\nSecurity Deposit and the exploitative practices around it is a much bigger issue in Bangalore. 5-6 months deposit is a norm and it sucks away a huge part of liquidity especially if you are just moving to the city or shifting to a new place within BLR. I felt the survey should have asked a few questions on that front."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Extortionate"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "The difficulty of dealing with landlords - I used to rent in Bangalore. My landlord insisted on a 6 month security deposit and then kept all of it claiming that is std practice in Bangalore. I had already moved, COVID was in swing, and there was no practical way for me to fight it so I let it go but swore to never go back to renting there."
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Student",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, never",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "I used to live in Bengaluru — the rent is why I left",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "Traffic and empty bank balance"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "Due to rent pressure, need to compromise on quality and distance from work"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "A large chunk of earnings get deployed in paying off rent only which creates a sense that how can I plan a better future for me and my family of I keep on paying so much in rent month on month"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "Security Deposit"
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is affordable where I live",
    "compareCity": "Much worse than where I live",
    "subjective": "High but not as bad as Mumbai but definitely worse than Gurgaon. Three Cities that I have been in, and that I find comparable"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "My city is actually worse",
    "subjective": "Expensive"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "I do not know how they compare",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Mid career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is affordable where I live",
    "compareCity": "Much worse than where I live",
    "subjective": "Should be close enough to avoid the horrid traffic while keeping rent and facilities reasonable."
  },
  {
    "age": "45 – 54",
    "career": "Self-employed / run my own business",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "About the same",
    "subjective": "How long will i have to commute in hellish traffic"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "Rent is an issue for anyone making sub-10LPA"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Self-employed / run my own business",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "You get great value for money compared to a city like Mumbai. However, the fact that brokers charge a months rent at every renewal continues to boggle my mind."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "I do not know how they compare",
    "subjective": "Overpriced"
  },
  {
    "age": "35 – 44",
    "career": "",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "Traffic vs Rent"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "Money that I pay is not going to be worth it. Either I will stay to far from the workplace or compromise on the space if I would save on the rent"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Rents in bangalore are high"
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": "Living close to office has become impossible for most people which further worsens the traffic on road"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "The high cost of living in a reasonable apartment with facilities"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Yes, rent is the main thing holding me back",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Prohibitively expensive deposits, poor tenancy rights"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "The 10 month deposit is nonsensical and probably is from a time when Bangalore was a small city (it still feels like a small-minded city but that’s a different issue). It is unfair to liquidity-poor folks like students, interns, first-job-holders from smaller towns(?). Highly unfair."
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "saidNo": "No, cost never came into it",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "Rarely",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "My city is actually worse",
    "subjective": "Better Choices. Be it Location, amenities, Maintenence, layout, ambience, neighbours and residents, services"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "My city is actually worse",
    "subjective": "High security deposits, and hair-cut during exit."
  },
  {
    "age": "25 – 34",
    "career": "Student",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": "Expensive"
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Cost for what's offered. And yearly increase spent keep up with salary, and deposit expectation and charges by the landlord when you leave. No transparency, and worst is brokers."
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "Yes, once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "Half the salary is gone in rent. It's almost the same as the EMI I spend on my house right now. But in Bangalore, this EMI won't even suffice."
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Yes, rent is the main thing holding me back",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "High Security Deposits"
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Rarely",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "Lower per sqft rent, bigger flats and online broking platforms.. Better than Mumbai.. It's relative"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "Yes, once",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "Not as bad as Mumbai"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "I do not know how they compare",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "Good quality options in all neighbourhoods"
  },
  {
    "age": "45 – 54",
    "career": "Senior career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": "Other than food everything is expensive. Commute, Rent, Living Cost etc."
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Not working right now",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "I never hear about it",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Screwed over by the land mafia."
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Renting in Bengaluru is different for locals (Kannadigas) and \"outsiders\" - the rent is disproportionately high for outsiders and leasing terms are worse. The local landlords exploit you when they know you are not a local and have no recourse other than doing courts and stuff, which most renters will anyway avoid. Landlords retain deposits - the cash for sure and even often the cheques. Everything I have heard about renting in Bengaluru seems to be a horribly bad experience due to the local landlords, Not heard this level of complaints from other metros or my own metro."
  },
  {
    "age": "55 and above",
    "career": "Self-employed / run my own business",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "I do not know how they compare",
    "subjective": "High deposits"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Senior career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "High handedness of apartment owners"
  },
  {
    "age": "25 – 34",
    "career": "Student",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "I do not know how they compare",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, never",
    "oftenComesUp": "I never hear about it",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "I do not know how they compare",
    "subjective": "I guess it’s the same as Delhi. High rents which are piggybacking on artificially high real estate costs are adding a lot to the living costs and business costs"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "Under 25",
    "career": "Early career",
    "saidNo": "",
    "toldOthers": "Yes, once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Yes, rent is the main thing holding me back",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "45 – 54",
    "career": "",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "No, rent is affordable where I live",
    "compareCity": "I do not know how they compare",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "About the same",
    "subjective": "Proximity to office, Gated society"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "I've lived in Bengaluru, My brother still stays there. I moved out because IMO quality of life was absent there and it seemed tough that parent could get used to Bengaluru. \n\nHigh Cost of Rents eats up a lot of salary post tax. So whenever we're paying rent, we need to consider 1.33x of that is going from our CTC and post deducting that number, if the CTC is not lucrative enough, we need to stay away from Bengaluru from expense POV. \n\nAlso, Its not just about Money, The Process of finding a decent house with or without broker puts a lot of cognitive effort on your mind which drains you to a good degree. Post renting might also come with abrupt rent hikes if rent market explods again or neighbouring rents starts rising. \n\nEvent after paying so much rent, one has to worry about the water and electricity, which sounds stupid. Atleast other cities are far better that way with lower rent."
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Irrational deposits which are often not refunded, especially true in case of prople coming froom outside the state 0f Karnataka"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, never",
    "oftenComesUp": "Once in a while",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "I do not know how they compare",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "",
    "saidNo": "I thought about it hard, but went anyway",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Substantial salary goes to rent. Negotiate salary accordingly"
  },
  {
    "age": "25 – 34",
    "career": "",
    "saidNo": "",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "55 and above",
    "career": "Not working right now",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "About the same",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "No, rent is manageable here",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "Yes, more than once",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "Yes, rent is the main thing holding me back",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "About the same",
    "subjective": "That, buying a house might be cheaper..."
  },
  {
    "age": "55 and above",
    "career": "Senior career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "Yes, once",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "Close to place of work"
  },
  {
    "age": "25 – 34",
    "career": "Senior career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "I would actually tell them to go, rent or not",
    "oftenComesUp": "I never hear about it",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": "Value for money"
  },
  {
    "age": "25 – 34",
    "career": "Early career",
    "saidNo": "No, cost never came into it",
    "toldOthers": "No, never",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "No, rent is not why I stay away",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "About the same",
    "subjective": "High deposits"
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "35 – 44",
    "career": "Mid career",
    "saidNo": "It made me pause, but was not the deciding factor",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "All the time — it is the first thing people mention",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, just as bad as Bengaluru sounds",
    "compareCity": "My city is actually worse",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "Mid career",
    "saidNo": "Does not apply — I never had the chance",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "I would never move there anyway",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "",
    "career": "",
    "saidNo": "",
    "toldOthers": "",
    "oftenComesUp": "",
    "lowerRentMove": "",
    "ownCityWorry": "",
    "compareCity": "",
    "subjective": ""
  },
  {
    "age": "25 – 34",
    "career": "Mid career",
    "saidNo": "Yes — I turned down or avoided a Bengaluru move over cost",
    "toldOthers": "No, but I have thought about it",
    "oftenComesUp": "Fairly often",
    "lowerRentMove": "Maybe, along with a few other things",
    "ownCityWorry": "Yes, but not as bad",
    "compareCity": "Much worse than where I live",
    "subjective": "'-"
  }
]
};
