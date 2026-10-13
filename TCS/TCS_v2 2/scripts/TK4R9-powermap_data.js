// scripts/TK4R9-powermap_data.js
// Node/edge geometry extracted verbatim from the source prototype (powermap.html),
// plus the five scrollytelling steps. No color values live in this file —
// TK4R9-powermap.js resolves every color from styles/globals.css at render time.
// The narrative copy itself lives in the section markup (index.html), one
// .TK4R9-narrative-step per entry in TK4R9_STEPS, matched by data-step.

const TK4R9_TIER={
  1:{name:"Tata Trusts",tab:"TIER 1",role:"Governance & shareholding"},
  2:{name:"Tata Sons",tab:"TIER 2",role:"Holding board & chairmanship"},
  3:{name:"TCS",tab:"TIER 3",role:"Operating leadership"}
};

// Each node carries two position sets: d = desktop/landscape layout (wide, tiers flow
// left→right), m = mobile/portrait layout (narrow, tiers stack top→bottom). In m, the hubs
// sit in a left-hand column, people form a single list-like column with their names to the
// right, and Chandrasekaran sits in that column in the seam between Tata Sons and TCS — the
// arrows that skip rows arc round the left of the column, clear of every name.
// photo:true — the node is filled with imgs/people/powermap/<id>.jpg (a 256px square,
// face-centred crop of the full photo in imgs/people); others fall back to initials.
const TK4R9_NODES=[
    {id:"trusts",kind:"hub",tier:1,label:["Tata","Trusts"],name:"Tata Trusts",
     pos:{d:{x:150,y:130,r:30}, m:{x:48,y:110,r:26}}},
    {id:"sons",kind:"hub",tier:2,label:["Tata","Sons"],name:"Tata Sons",
     pos:{d:{x:100,y:348,r:30}, m:{x:48,y:288,r:26}}},
    {id:"tcs",kind:"hub",tier:3,label:["TCS"],name:"TCS",
     pos:{d:{x:100,y:648,r:30}, m:{x:48,y:820,r:26}}},

    {id:"noel",kind:"person",tier:1,initials:"NT",name:"Noel Tata",status:"gold",photo:true,
     pos:{d:{x:420,y:130,r:40}, m:{x:200,y:110,r:27}}},

    {id:"jamsetji",kind:"person",tier:2,initials:"JT",name:"Jamsetji Tata",status:"hist",photo:true,
     pos:{d:{x:250,y:348,r:40}, m:{x:200,y:288,r:27}}},
    {id:"jrd",kind:"person",tier:2,initials:"JRD",name:"JRD Tata",status:"hist",photo:true,
     pos:{d:{x:400,y:348,r:40}, m:{x:200,y:376,r:27}}},
    {id:"ratan",kind:"person",tier:2,initials:"RT",name:"Ratan Tata",status:"hist",photo:true,
     pos:{d:{x:560,y:348,r:42}, m:{x:200,y:464,r:28}}},
    {id:"cyrus",kind:"person",tier:2,initials:"CM",name:"Cyrus Mistry",status:"red",photo:true,
     pos:{d:{x:720,y:348,r:40}, m:{x:200,y:552,r:27}}},

    {id:"chandra",kind:"pivot",tier:2,initials:"NC",name:"N Chandrasekaran",status:"gold",photo:true,
     pos:{d:{x:780,y:492,r:54}, m:{x:200,y:666,r:32}}},

    {id:"agarwala",kind:"person",tier:3,initials:"PMA",name:"PM Agarwala",status:"hist",
     pos:{d:{x:250,y:648,r:40}, m:{x:200,y:820,r:27}}},
    {id:"kohli",kind:"person",tier:3,initials:"FCK",name:"FC Kohli",status:"hist",photo:true,
     pos:{d:{x:400,y:648,r:40}, m:{x:200,y:908,r:27}}},
    {id:"ramadorai",kind:"person",tier:3,initials:"SR",name:"S Ramadorai",status:"hist",photo:true,
     pos:{d:{x:540,y:648,r:40}, m:{x:200,y:996,r:27}}},
    {id:"gopinathan",kind:"person",tier:3,initials:"RG",name:"Rajesh Gopinathan",status:"red",photo:true,
     pos:{d:{x:900,y:648,r:40}, m:{x:200,y:1084,r:27}}},
    {id:"krithivasan",kind:"person",tier:3,initials:"KK",name:"K Krithivasan",status:"gold",photo:true,
     pos:{d:{x:1055,y:648,r:40}, m:{x:200,y:1172,r:27}}}
];

// labelT nudges an edge label off the 50% midpoint. For every edge that touches the
// crowded pivot node, the label is pulled toward the OTHER endpoint so it never sits on
// top of Chandrasekaran's own name/tenure text. `hidden` edges stay invisible except
// in the step that draws them. A labelT of null hides that label in that layout (the
// mobile arcs have no room for one; the cards carry the same facts). Edges are
// addressed as "source>target" in TK4R9_STEPS.
const TK4R9_EDGES=[
    {s:"noel",t:"trusts",type:"ctrl"},
    {s:"trusts",t:"sons",type:"ctrl",label:"66%"},
    {s:"sons",t:"tcs",type:"ctrl",label:"72%"},
    {s:"tcs",t:"sons",type:"div",hidden:true,curv:{d:.45,m:.16},label:"dividends",labelT:{d:.5,m:.3}},
    {s:"jamsetji",t:"jrd",type:"succ"},
    {s:"jrd",t:"ratan",type:"succ"},
    {s:"ratan",t:"cyrus",type:"succ"},
    {s:"cyrus",t:"chandra",type:"succ",curv:{d:-.6,m:0}},
    {s:"agarwala",t:"kohli",type:"succ"},
    {s:"kohli",t:"ramadorai",type:"succ"},
    {s:"chandra",t:"gopinathan",type:"succ",curv:{d:-.35,m:.42},label:"handed TCS",labelT:{d:.5,m:null}},
    {s:"gopinathan",t:"krithivasan",type:"succ"},
    {s:"kohli",t:"chandra",type:"asc",dotted:true,curv:{d:-.30,m:-.36},label:"hired 1987",labelT:{d:.30,m:null}},
    {s:"ramadorai",t:"chandra",type:"asc",curv:{d:-.12,m:-.4},label:"promoted to CEO",labelT:{d:.42,m:null}},
    {s:"ratan",t:"chandra",type:"asc",curv:{d:.14,m:.45},label:"tapped as chair, 2017",labelT:{d:.53,m:null}}
];

// The five scroll frames. For each step:
//   tier  — the band kept at full strength (others fade back)
//   nodes — highlighted nodes; everything else drops to a subtle opacity
//   draw  — edges that animate in once, slot by slot (edges sharing a slot draw together);
//           a node lights up when the first arrow pointing at it lands
//   keep  — edges shown lit but not re-animated (context from an earlier step)
//   view  — narrow screens only: the nodes/bands the camera frames for this step
const TK4R9_STEPS=[
  {tier:1, nodes:["trusts","noel"],
   draw:[["noel>trusts"],["trusts>sons"]], keep:[],
   view:{bands:[1], nodes:["sons"]}},
  {tier:2, nodes:["sons","tcs"],
   draw:[["sons>tcs"]], keep:["trusts>sons"],
   view:{bands:[1,2], nodes:["tcs"]}},
  {tier:2, nodes:["sons","jamsetji","jrd","ratan","cyrus","chandra"],
   draw:[["jamsetji>jrd"],["jrd>ratan"],["ratan>cyrus"],["cyrus>chandra"],["ratan>chandra"]], keep:[],
   view:{bands:[2], nodes:["chandra"]}},
  {tier:3, nodes:["tcs","sons"],
   draw:[["tcs>sons"]], keep:["sons>tcs"],
   view:{bands:[3], nodes:["sons"]}},
  {tier:3, nodes:["tcs","agarwala","kohli","ramadorai","chandra","gopinathan","krithivasan"],
   draw:[["agarwala>kohli"],["kohli>ramadorai"],["kohli>chandra","ramadorai>chandra"],["chandra>gopinathan"],["gopinathan>krithivasan"]], keep:[],
   view:{bands:[3], nodes:["chandra"]}}
];

// Status ring meaning — kept as plain metadata (label text). Actual color values are
// resolved from --status-* / --color-muted at render time, never hardcoded here.
const TK4R9_STATUS_META={
  gold:{token:"good",label:"Current"},
  red:{token:"critical",label:"Removed"},
  hist:{token:"muted",label:"Former",dashed:true}
};

const TK4R9_SHORT_T={
  noel:"Trusts chair, 2024–",jamsetji:"1839–1904",jrd:"chair 1938–1991",
  ratan:"chair 1991–2012",cyrus:"chair 2012–2016",chandra:"CEO ’09 · chair ’17–",
  agarwala:"1968–1974",kohli:"1969–2000",ramadorai:"CEO 1996–2009",
  gopinathan:"CEO 2017–2023",krithivasan:"CEO 2023–"
};

// desktop / landscape bands (tiers side-by-side, wide canvas)
const TK4R9_BANDS_D=[
  {t:1,y:40, h:184},
  {t:2,y:244,h:200},
  {t:3,y:524,h:230}
];
// mobile / portrait bands (tiers stacked, tall narrow canvas). The gap between band 2
// and band 3 is Chandrasekaran's seam — he belongs to both.
const TK4R9_BANDS_M=[
  {t:1,y:20, h:150},
  {t:2,y:196,h:411},
  {t:3,y:728,h:499}
];
