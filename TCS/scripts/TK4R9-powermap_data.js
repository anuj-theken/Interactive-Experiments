// scripts/TK4R9-powermap_data.js
// Node/edge geometry extracted verbatim from the source prototype (powermap.html).
// No color values live in this file — TK4R9-powermap.js resolves every color
// from styles/globals.css at render time.

const TK4R9_TIER={
  1:{name:"Tata Trusts",tab:"TIER 1",role:"Governance & shareholding"},
  2:{name:"Tata Sons",tab:"TIER 2",role:"Holding board & chairmanship"},
  3:{name:"TCS",tab:"TIER 3",role:"Operating leadership"}
};

// Each node carries two position sets: d = desktop/landscape layout (wide, tiers flow
// left→right), m = mobile/tablet layout (narrow, tiers stack top→bottom). Chandrasekaran
// gets deliberately generous clearance from his neighbours in both, so his label never
// collides with the converging succession/ascent edges.
const TK4R9_NODES=[
    {id:"trusts",kind:"hub",tier:1,label:["Tata","Trusts"],name:"Tata Trusts",
     role:"Majority shareholder of Tata Sons (~66%)",tenure:"Philanthropic umbrella",statusTag:"tier1",
     note:"An umbrella of ~15 philanthropic entities; the <b>Sir Ratan Tata Trust</b> and <b>Sir Dorabji Tata Trust</b> are the most prominent.",
     pos:{d:{x:150,y:130,r:30}, m:{x:88,y:115,r:25}}},
    {id:"sons",kind:"hub",tier:2,label:["Tata","Sons"],name:"Tata Sons",
     role:"Principal holding company & promoter",tenure:"The group's holding company",statusTag:"tier2",
     note:"Holds the promoter stake across the operating Tata companies and appoints the group chairman. Roughly two-thirds owned by Tata Trusts.",
     pos:{d:{x:100,y:300,r:30}, m:{x:88,y:325,r:25}}},
    {id:"tcs",kind:"hub",tier:3,label:["TCS"],name:"TCS",
     role:"Flagship operating company",tenure:"Tata Consultancy Services",statusTag:"tier3",
     note:"Tata Sons holds roughly a <b>72% promoter stake</b>; TCS dividends fund much of the wider group.",
     pos:{d:{x:100,y:618,r:30}, m:{x:88,y:1182,r:25}}},

    {id:"noel",kind:"person",tier:1,initials:"NT",name:"Noel Tata",
     role:"Chairman, Tata Trusts — earlier a Tata Sons chairmanship candidate",
     tenure:"born on 1957 · Trusts chair Oct 2024–present",status:"gold",
     note:"Took the Trusts chair in October 2024, following the death of Ratan Tata.",
     pos:{d:{x:340,y:130,r:26}, m:{x:300,y:115,r:22}}},

    {id:"jamsetji",kind:"person",tier:2,initials:"JT",name:"Jamsetji Tata",
     role:"Founder",tenure:"born on 1839 · died on 1904",status:"hist",
     note:"Dreamed of a steel plant, a hydro-power station, a world-class hotel and a science university. Three of the four were realised only after his death in 1904 — including the <b>Indian Institute of Science</b>, which opened in 1911.",
     pos:{d:{x:250,y:300,r:26}, m:{x:262,y:325,r:19}}},
    {id:"jrd",kind:"person",tier:2,initials:"JRD",name:"JRD Tata",
     role:"Chairman, Tata Sons & Tata Group; later chairman emeritus",
     tenure:"1938–1991 · emeritus to 1993",status:"hist",
     note:"Funded the 1962 unit; the eventual TCS IPO was timed to his <b>100th birth anniversary</b>.",
     pos:{d:{x:400,y:300,r:26}, m:{x:262,y:455,r:19}}},
    {id:"ratan",kind:"person",tier:2,initials:"RT",name:"Ratan Tata",
     role:"Chairman; later interim chairman",
     tenure:"1991–Dec 2012 · interim Oct 2016–Feb 2017",status:"hist",
     note:"Led the 2004 IPO roadshow and <b>tapped Chandrasekaran in Jan 2017</b>. Died 9 October 2024.",
     pos:{d:{x:560,y:300,r:28}, m:{x:262,y:585,r:21}}},
    {id:"cyrus",kind:"person",tier:2,initials:"CM",name:"Cyrus Mistry",
     role:"Chairman",tenure:"Dec 2012–Oct 2016",status:"red",
     note:"<b>Removed by the board</b> after losing the confidence of the majority shareholder. Died 4 September 2022.",
     pos:{d:{x:720,y:300,r:26}, m:{x:262,y:715,r:19}}},

    {id:"chandra",kind:"pivot",tier:2,initials:"NC",name:"N. Chandrasekaran",
     role:"Chairman, Tata Sons · former CEO, TCS",
     tenure:"TCS CEO 2009–17 → Sons chair 21 Feb 2017–20 Feb 2032",status:"gold",
     tierLabel:"Tier 2 ↔ Tier 3",
     note:"Rose from a <b>1987 TCS intern</b> to the first professional, non-family chairman of Tata Sons. Resigned in Aug 2026, then reversed the decision in Sep 2026.",
     pos:{d:{x:780,y:454,r:40}, m:{x:392,y:917,r:32}}},

    {id:"agarwala",kind:"person",tier:3,initials:"PMA",name:"PM Agarwala",
     role:"MD, Tata Electric — took charge of TCS at the 1968 spin-off",
     tenure:"1968–1974",status:"hist",
     note:"Sought out a disciplinarian to lead the newly carved-out TCS.",
     pos:{d:{x:250,y:618,r:26}, m:{x:262,y:1182,r:19}}},
    {id:"kohli",kind:"person",tier:3,initials:"FCK",name:"FC Kohli",
     role:"General manager, then head of TCS",tenure:"1969–2000",status:"hist",
     note:"Blocked a plan to fold TCS into the Tata–Burroughs JV. The <b>“father of the Indian software industry”</b>; personally signed off on Chandrasekaran's hire.",
     pos:{d:{x:400,y:618,r:26}, m:{x:262,y:1312,r:19}}},
    {id:"ramadorai",kind:"person",tier:3,initials:"SR",name:"S Ramadorai",
     role:"CEO, TCS (joined 1972)",tenure:"CEO 1996–2009",status:"gray",
     note:"Built the Y2K <b>“software factory”</b> and set up Ignite; made Chandrasekaran his executive assistant after becoming CEO.",
     pos:{d:{x:540,y:618,r:26}, m:{x:262,y:1442,r:19}}},
    {id:"gopinathan",kind:"person",tier:3,initials:"RG",name:"Rajesh Gopinathan",
     role:"CEO, TCS",tenure:"2017–2023",status:"gray",
     note:"Abrupt exit amid restructuring backlash.",
     pos:{d:{x:900,y:618,r:26}, m:{x:262,y:1572,r:19}}},
    {id:"krithivasan",kind:"person",tier:3,initials:"KK",name:"K Krithivasan",
     role:"CEO, TCS",tenure:"2023–present",status:"gold",
     note:"Navigating global capability centres (GCCs), H-1B surcharges and AI pricing pressure.",
     pos:{d:{x:1055,y:618,r:26}, m:{x:262,y:1702,r:19}}}
];

// labelT nudges an edge label off the 50% midpoint. For every edge that touches the
// crowded pivot node, the label is pulled toward the OTHER endpoint so it never sits on
// top of Chandrasekaran's own name/tenure text.
const TK4R9_EDGES=[
    {s:"noel",t:"trusts",type:"ctrl"},
    {s:"trusts",t:"sons",type:"ctrl",label:"~66%"},
    {s:"sons",t:"tcs",type:"ctrl",label:"~72%"},
    {s:"jamsetji",t:"jrd",type:"succ"},
    {s:"jrd",t:"ratan",type:"succ"},
    {s:"ratan",t:"cyrus",type:"succ"},
    {s:"agarwala",t:"kohli",type:"succ"},
    {s:"kohli",t:"ramadorai",type:"succ"},
    {s:"chandra",t:"gopinathan",type:"succ",curv:{d:.10,m:0},label:"handed TCS",labelT:{d:.68,m:.74}},
    {s:"gopinathan",t:"krithivasan",type:"succ"},
    {s:"kohli",t:"chandra",type:"asc",dotted:true,curv:{d:-.30,m:0},label:"hired 1987",labelT:{d:.30,m:.64}},
    {s:"ramadorai",t:"chandra",type:"asc",curv:{d:-.12,m:0},label:"promoted to CEO",labelT:{d:.42,m:.34}},
    {s:"ratan",t:"chandra",type:"asc",curv:{d:.14,m:0},label:"tapped as chair, 2017",labelT:{d:.32,m:.80}}
];

// Status ring meaning — kept as plain metadata (label text). Actual color values are
// resolved from --status-* / --color-muted at render time, never hardcoded here.
const TK4R9_STATUS_META={
  gold:{token:"good",label:"Current"},
  red:{token:"critical",label:"Removed"},
  gray:{token:"warning",label:"Stepped down voluntarily"},
  hist:{token:"muted",label:"Historical / legacy",dashed:true},
  tier1:{token:"cat-1",label:"Current"},
  tier2:{token:"cat-2",label:"Current"},
  tier3:{token:"cat-3",label:"Current"}
};

const TK4R9_SHORT_T={
  noel:"Trusts chair, 2024–",jamsetji:"1839–1904",jrd:"chair 1938–1991",
  ratan:"chair 1991–2012",cyrus:"chair 2012–2016",chandra:"CEO ’09 · chair ’17–",
  agarwala:"1968–1974",kohli:"1969–2000",ramadorai:"CEO 1996–2009",
  gopinathan:"CEO 2017–2023",krithivasan:"CEO 2023–"
};

// desktop / landscape bands (tiers side-by-side, wide canvas)
const TK4R9_BANDS_D=[
  {t:1,y:52, h:150},
  {t:2,y:214,h:200},
  {t:3,y:494,h:230}
];
// mobile / tablet-portrait bands (tiers stacked, tall narrow canvas). The gap between
// band 2 and band 3 is deliberately wide — Chandrasekaran's node lives in that seam,
// clear of both neighbouring clusters.
const TK4R9_BANDS_M=[
  {t:1,y:20,  h:180},
  {t:2,y:225, h:570},
  {t:3,y:1082,h:700}
];
