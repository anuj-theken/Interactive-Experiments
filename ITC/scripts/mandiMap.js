// scripts/mandiMap.js — QW4K2

document.addEventListener("DOMContentLoaded", function () {

// MP_GEO is defined in scripts/mandiMap_geo.js, loaded before this file.

const RAW = [
["Gulli","Gulli","Sidhi Apmc","Sidhi",2800,2800,2800,"none",0],
["Gulli","Gulli","Barghat Apmc","Seoni",4800,4850,4900,"none",0],
["Bengal Gram (Whole)","Gram","Javera Apmc","Damoh",5405,5405,5405,"none",0],
["Wheat","Mill Quality","Badamalhera Apmc","Chhatarpur",0,2400,2400,"none",0],
["Wheat","Wheat","Banda Apmc","Sagar",2425,2425,2425,"none",0],
["Bengal Gram (Whole)","Gram","Chaurai Apmc","Chhindwara",5000,5000,5000,"none",0],
["Lentil Masur (Whole)","Masur Dal","Khurai Apmc","Sagar",5720,6145,6145,"none",0],
["Wheat","Mill Quality","Mandla Apmc","Mandla",2375,2375,2375,"down",25],
["Potato","Other","Kailaras Apmc","Morena",600,700,1000,"up",100],
["Tinda","Tinda","Kailaras Apmc","Morena",1400,1400,1400,"down",100],
["Bhindi (Ladies Finger)","Bhindi","Kailaras Apmc","Morena",1000,1500,2200,"none",0],
["Onion","Other","Kailaras Apmc","Morena",1400,2400,2400,"up",400],
["Gulli","Gulli","Umariya Apmc","Umariya",3950,3950,3950,"down",1050],
["Paddy (Common)","Other","Dindori Apmc","Dindori",2010,2010,2010,"up",10],
["Coriander Leaves","Coriander","Mandsaur Apmc","Mandsaur",5400,14670,14670,"none",0],
["Green Gram Moong (Whole)","Green (Whole)","Itarsi Apmc","Hoshangabad",1000,7250,7250,"up",545],
["Green Gram Moong (Whole)","Green (Whole)","Raisen Apmc","Raisen",5600,6000,6666,"down",951],
["Paddy (Common)","Basmati","Raisen Apmc","Raisen",3505,4300,4300,"none",0],
["Wheat","Mill Quality","Katni Apmc","Katni",2300,2300,2300,"down",150],
["Wheat","Wheat","Neemuch Apmc","Neemuch",2580,2755,2901,"none",0],
["Garlic","Garlic","Bhopal Apmc","Bhopal",1100,11300,18000,"up",4300],
["Black Gram Urd (Whole)","Urda/Urd","Paatan Apmc","Jabalpur",9600,9645,9645,"up",100],
["Wheat","Wheat","Khatora Apmc","Shivpuri",2450,2500,2500,"none",0],
["Papaya","Papaya","Sagar F V Apmc","Sagar",1200,1600,2400,"none",0],
["Cauliflower","Cauliflower","Sagar F V Apmc","Sagar",300,400,500,"none",0],
["Cucumber (Kheera)","Cucumber","Sagar F V Apmc","Sagar",1000,1100,1200,"none",0],
["Spinach","Spinach","Sagar F V Apmc","Sagar",500,600,700,"none",0],
["Mango","Other","Sagar F V Apmc","Sagar",3000,4000,5000,"up",500],
["Spinach","Spinach","Ujjain F V Apmc","Ujjain",375,894,1725,"none",0],
["Tomato","Deshi","Ujjain F V Apmc","Ujjain",575,1356,1830,"none",0],
["Cabbage","Cabbage","Ujjain F V Apmc","Ujjain",415,964,1475,"none",0],
["Bitter Gourd","Bitter Gourd","Ujjain F V Apmc","Ujjain",430,721,1475,"none",0],
["Onion","Local","Burhanpur F V Apmc","Burhanpur",1000,1800,2000,"up",200],
["Guar","Gwar","Burhanpur F V Apmc","Burhanpur",2500,4000,4500,"none",0],
["Bhindi (Ladies Finger)","Bhindi","Burhanpur F V Apmc","Burhanpur",2000,2800,3000,"down",200],
["Paddy (Common)","Paddy","Seoni Apmc","Seoni",2850,2850,2850,"none",0],
["Wheat","Wheat","Gotegaon Apmc","Narsinghpur",2400,2405,2405,"none",0],
["Green Gram Moong (Whole)","Green (Whole)","Kolaras Apmc","Shivpuri",6800,6800,6800,"none",0],
["Bengal Gram (Whole)","Gram","Kolaras Apmc","Shivpuri",5770,5770,5770,"up",265],
["Soyabean","Soyabeen","Kolaras Apmc","Shivpuri",5010,7130,7130,"up",255],
["Bengal Gram (Whole)","Gram","Guna Apmc","Guna",5155,5765,5765,"up",55],
["Wheat","Mill Quality","Keolari Apmc","Seoni",2200,2240,2240,"none",0],
["Wheat","Wheat","Taal Apmc","Ratlam",2486,2570,2686,"none",0],
["Wheat","Wheat","Kasrawad Apmc","Khargone",2550,2550,2550,"down",50],
["Maize","Local","Badwaha Apmc","Khargone",2075,2240,2240,"none",0],
["Green Gram Moong (Whole)","Green (Whole)","Sanawad Apmc","Khargone",6705,7500,7500,"up",400],
["Bengal Gram (Whole)","Gram","Sanawad Apmc","Khargone",6600,6600,6600,"down",905],
["Soyabean","Soyabeen","Rajgarh Apmc","Dhar",6010,6300,6300,"up",220],
["Wheat","Mill Quality","Shyampur Apmc","Sehore",2375,2400,2400,"none",0],
["Tomato","Hybrid","Sendhwa F V Apmc","Badwani",1200,1600,2000,"none",0]
].map(function(r){return {commodity:r[0],variety:r[1],market:r[2],district:r[3],min:r[4],modal:r[5],max:r[6],dir:r[7],chg:r[8]};});

// group by commodity + by district
const byCommodity={}, commodityOrder=[];
RAW.forEach(function(r){
  if(!byCommodity[r.commodity]){ byCommodity[r.commodity]=[]; commodityOrder.push(r.commodity); }
  byCommodity[r.commodity].push(r);
});
commodityOrder.sort();

// sentinel for the "all commodities" view
const ALL="__all";

// Hindi names for each commodity (fallback = English key)
const CROP_HI={
  "Bengal Gram (Whole)":"चना",
  "Bhindi (Ladies Finger)":"भिंडी",
  "Bitter Gourd":"करेला",
  "Black Gram Urd (Whole)":"उरद",
  "Cabbage":"पत्ता गोभी",
  "Cauliflower":"फूल गोभी",
  "Coriander Leaves":"धनिया",
  "Cucumber (Kheera)":"खीरा",
  "Garlic":"लहसुन",
  "Green Gram Moong (Whole)":"मूंग",
  "Guar":"ग्वार",
  "Gulli":"गुल्ली",
  "Lentil Masur (Whole)":"मसूर",
  "Maize":"मक्का",
  "Mango":"आम",
  "Onion":"प्याज",
  "Paddy (Common)":"धान",
  "Papaya":"पपीता",
  "Potato":"आलू",
  "Soyabean":"सोयाबीन",
  "Spinach":"पालक",
  "Tinda":"टिंडा",
  "Tomato":"टमाटर",
  "Wheat":"गेहूं"
};
// Hindi names for the districts that appear in the data (fallback = English)
const DIST_HI={
  "Sidhi":"सीधी","Seoni":"सिवनी","Damoh":"दमोह",
  "Chhatarpur":"छतरपुर","Sagar":"सागर","Chhindwara":"छिंदवाड़ा",
  "Mandla":"मंडला","Morena":"मुरैना","Umariya":"उमरिया",
  "Dindori":"डिंडोरी","Mandsaur":"मंदसौर","Hoshangabad":"होशंगाबाद",
  "Raisen":"रायसेन","Katni":"कटनी","Neemuch":"नीमच",
  "Bhopal":"भोपाल","Jabalpur":"जबलपुर","Shivpuri":"शिवपुरी",
  "Ujjain":"उज्जैन","Burhanpur":"बुरहानपुर","Narsinghpur":"नरसिंहपुर",
  "Guna":"गुना","Ratlam":"रतलाम","Khargone":"खरगोन",
  "Dhar":"धार","Sehore":"सीहोर","Badwani":"बड़वानी"
};
function distLabel(dname){ return lang==="hi" ? (DIST_HI[dname]||dname) : dname; }
function cropLabel(c){
  if(c===ALL) return lang==="hi"?"सभी फसलें":"All commodities";
  return lang==="hi" ? (CROP_HI[c]||c) : c;
}

// source prices are quoted per quintal (100kg) — divide by 100 for a per-kg rate
var perKgOpts={minimumFractionDigits:2,maximumFractionDigits:2};
const fmt=function(n){ return "Rs."+(n/100).toLocaleString("en-IN",perKgOpts)+"/kg"; };
const fmtRange=function(lo,hi){ return "Rs."+(lo/100).toLocaleString("en-IN",perKgOpts)+"–"+(hi/100).toLocaleString("en-IN",perKgOpts)+"/kg"; };

// ---- i18n ----
const dict={
  hi:{ title:"e-Choupal : भारतीय किसान के लिए तकनीक...",
    brand:"ई-चौपाल", side:"कृषि जिंस",
    desc:"चयनित फसल की मंडी भाव का जिलावार मध्य प्रदेश नक्शा:",
    descAll:"प्रत्येक जिले में दर्ज फसलों की संख्या का मध्य प्रदेश नक्शा:",
    th1:"मंडी क्षेत्र", th2:"जिला", th3:"फसल", th4:"किस्म", th5:"सरकारी मंडी भाव",
    cropsel:"फसल:", low:"निम्न", high:"उच्च", markets:"मंडियां",
    fewer:"कम फसलें", more:"अधिक फसलें", norate:"कोई भाव नहीं", nrec:"कोई दर्ज नहीं",
    admin:"एडमिन विकल्प", stateLbl:"वरीयता:", code:"प्रवेश कोड बदलिये" },
  en:{ title:"e-Choupal was a revolutionary technology for farmers. This is re-imagined representation of the old website.",
    brand:"e-Choupal", side:"Commodities",
    desc:"District-wise Madhya Pradesh map of modal mandi price for the selected commodity:",
    descAll:"District-wise Madhya Pradesh map of how many commodities each district recorded:",
    th1:"Mandi Terminal", th2:"District", th3:"Commodity", th4:"Variety", th5:"Govt Mandi Rate",
    cropsel:"Crop:", low:"Low", high:"High", markets:"markets",
    fewer:"Fewer crops", more:"More crops", norate:"No rate", nrec:"No record",
    admin:"2026 Prices", stateLbl:"Priority:", code:"Change access code" }
};
let lang="en", currentCrop=ALL;

// ---- Leaflet map ----
// Zoom is locked (see setMinZoom/setMaxZoom below, once bounds are known) — panning
// within the padded MP bounds still works, but users can't zoom in/out at all.
const map=L.map("QW4K2-map",{
  scrollWheelZoom:false,
  doubleClickZoom:false,
  touchZoom:false,
  boxZoom:false,
  keyboard:false,
  zoomControl:false
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,
  attribution:"© OpenStreetMap contributors"}).addTo(map);

// choupal-yellow -> choupal-green sequential ramp
function lerp(a,b,t){return Math.round(a+(b-a)*t);}
function rampColor(t){ // t in [0,1]
  // #eeddab -> #b3a25d -> #006600 (matches prototype visualMap)
  var stops=[[238,221,171],[179,162,93],[0,102,0]];
  if(t<=0) return "rgb("+stops[0].join(",")+")";
  if(t>=1) return "rgb("+stops[2].join(",")+")";
  var seg=t*2, i=Math.min(1,Math.floor(seg)), f=seg-i;
  var c0=stops[i], c1=stops[i+1];
  return "rgb("+lerp(c0[0],c1[0],f)+","+lerp(c0[1],c1[1],f)+","+lerp(c0[2],c1[2],f)+")";
}

var geoLayer=null, labelLayer=L.layerGroup().addTo(map), mpBounds=null;

// modal price per district for a crop (max across that district's markets)
function priceByDistrict(crop){
  var rows=byCommodity[crop]||[], m={};
  rows.forEach(function(r){ if(!(r.district in m)||r.modal>m[r.district]) m[r.district]=r.modal; });
  return m;
}
// distinct-commodity count per district (for ALL mode)
function countByDistrict(){
  var m={};
  RAW.forEach(function(r){ (m[r.district]=m[r.district]||new Set()).add(r.commodity); });
  var out={}; Object.keys(m).forEach(function(k){ out[k]=m[k].size; });
  return out;
}

function popupHtml(dist,rows,isAll){
  var sub = isAll ? (rows.length+" "+(lang==="hi"?"फसलें":"commodities")) : cropLabel(currentCrop);
  var h='<div class="QW4K2-pop-h">'+dist+'</div><div class="QW4K2-pop-sub">'+sub+'</div><hr class="QW4K2-pop-rule">';
  rows.forEach(function(r){
    var name = isAll ? "<b>"+cropLabel(r.commodity)+"</b> " : "<b>"+r.market+"</b><br>";
    h+='<div style="margin:2px 0">'+name+'<span style="font-family:monospace">'+fmt(r.modal)+
       '</span> <span style="color:#555">('+(isAll?r.market:r.variety)+')</span></div>';
  });
  return h;
}

function render(){
  var d=dict[lang];
  var isAll=(currentCrop===ALL);

  // choose the value each district is shaded by
  var valMap, lo, hi;
  if(isAll){ valMap=countByDistrict(); }
  else{ valMap=priceByDistrict(currentCrop); }
  var vals=Object.keys(valMap).map(function(k){return valMap[k];});
  lo=Math.min.apply(null,vals); hi=Math.max.apply(null,vals);
  if(!isFinite(lo)){lo=0;hi=1;}
  var span=(hi-lo)||1;

  if(geoLayer) map.removeLayer(geoLayer);
  labelLayer.clearLayers();

  geoLayer=L.geoJSON(MP_GEO,{
    style:function(feat){
      var dist=feat.properties.district;
      if(dist in valMap){
        var t=(valMap[dist]-lo)/span;
        return {fillColor:rampColor(t),fillOpacity:.85,color:"#556",weight:1};
      }
      return {fillColor:"#f3f0e0",fillOpacity:.45,color:"#a08a5c",weight:.6,dashArray:"2,3"};
    },
    onEachFeature:function(feat,lyr){
      var dist=feat.properties.district;
      if(!(dist in valMap)) return;
      var drows = isAll ? RAW.filter(function(r){return r.district===dist;})
                        : (byCommodity[currentCrop]||[]).filter(function(r){return r.district===dist;});
      lyr.bindPopup(popupHtml(dist,drows,isAll),{closeButton:false});
      lyr.on("mouseover",function(){lyr.setStyle({weight:2.6,color:"#ffcc00"});lyr.openPopup();lyr.bringToFront();});
      lyr.on("mouseout",function(){geoLayer.resetStyle(lyr);});
      try{
        var mk=L.marker(lyr.getBounds().getCenter(),
          {icon:L.divIcon({className:"QW4K2-dlabel",html:dist,iconSize:null}),interactive:false});
        labelLayer.addLayer(mk);
      }catch(e){}
    }
  }).addTo(map);
  geoLayer.bringToBack();

  if(!mpBounds){ mpBounds=geoLayer.getBounds(); map.fitBounds(mpBounds,{padding:[12,12]});
    map.setMaxBounds(mpBounds.pad(0.25));
    var lockedZoom=map.getBoundsZoom(mpBounds);
    map.setMinZoom(lockedZoom); map.setMaxZoom(lockedZoom); }

  // description
  document.getElementById("QW4K2-desc-text").textContent = isAll ? d.descAll : d.desc;

  // caption + stat
  var mapPrefix = lang==="hi" ? "म.प्र. मंडी मानचित्र — " : "MP Mandi Map — ";
  document.getElementById("QW4K2-map-title").textContent = mapPrefix + cropLabel(currentCrop);
  document.getElementById("QW4K2-map-stat").textContent = isAll
    ? (Object.keys(valMap).length+" "+(lang==="hi"?"जिले":"districts")+" · "+lo+"–"+hi+" "+(lang==="hi"?"फसलें":"crops"))
    : (Object.keys(valMap).length+" "+d.markets+" · "+fmtRange(lo,hi));

  // table
  var tbody=document.getElementById("QW4K2-table-body"); tbody.innerHTML="";
  if(isAll){
    document.getElementById("QW4K2-table-headers").innerHTML=
      "<th>"+d.th1+"</th><th>"+d.th2+"</th><th>"+d.th3+"</th><th>"+d.th4+"</th><th>"+d.th5+"</th>";
    RAW.forEach(function(r){
      var tr=document.createElement("tr");
      tr.innerHTML="<td>"+r.market+"</td><td>"+r.district+"</td><td>"+cropLabel(r.commodity)+
        "</td><td>"+r.variety+"</td><td class='QW4K2-highlight-row'>"+fmt(r.modal)+"</td>";
      tbody.appendChild(tr);
    });
  }else{
    document.getElementById("QW4K2-table-headers").innerHTML=
      "<th>"+d.th1+"</th><th>"+d.th2+"</th><th>"+d.th4+"</th><th>"+d.th5+"</th>";
    (byCommodity[currentCrop]||[]).forEach(function(r){
      var tr=document.createElement("tr");
      tr.innerHTML="<td>"+r.market+"</td><td>"+r.district+"</td><td>"+r.variety+
        "</td><td class='QW4K2-highlight-row'>"+fmt(r.modal)+"</td>";
      tbody.appendChild(tr);
    });
  }

  // sidebar active state
  document.querySelectorAll("#QW4K2-commodity-list button").forEach(function(b){
    b.classList.toggle("QW4K2-active", b.dataset.crop===currentCrop);
    var lbl=b.querySelector(".QW4K2-clabel"); if(lbl) lbl.textContent=cropLabel(b.dataset.crop);
  });

  // crop-nav quick links (All + first few)
  var quick=[ALL].concat(commodityOrder.slice(0,6));
  document.getElementById("QW4K2-crop-links").innerHTML="<span>"+d.cropsel+"</span> "+
    quick.map(function(c){
      return "<a class='"+(c===currentCrop?"QW4K2-selected-crop":"")+"' data-crop=\""+c+"\">"+cropLabel(c)+"</a>";
    }).join(" | ");
  document.querySelectorAll("#QW4K2-crop-links a").forEach(function(a){
    a.addEventListener("click",function(){selectCrop(a.dataset.crop);});
  });

  // keep the marquee in sync with the current crop/all view
  var mk=document.getElementById("QW4K2-marquee-ticker");
  if(mk) mk.textContent=buildTicker();
}

function selectCrop(c){ currentCrop=c; render(); }

function buildSidebar(){
  var ul=document.getElementById("QW4K2-commodity-list"); ul.innerHTML="";
  var items=[ALL].concat(commodityOrder);
  items.forEach(function(c){
    var li=document.createElement("li"); li.className="QW4K2-before-marker";
    var b=document.createElement("button"); b.dataset.crop=c;
    if(c===ALL) li.classList.add("QW4K2-all-item");
    b.innerHTML="<span class='QW4K2-clabel'>"+cropLabel(c)+"</span>";
    b.addEventListener("click",function(){selectCrop(c);});
    li.appendChild(b); ul.appendChild(li);
  });
}

function applyLang(){
  var d=dict[lang];
  document.getElementById("QW4K2-win-title").textContent=d.title;
  document.getElementById("QW4K2-brand-title").textContent=d.brand;
  document.getElementById("QW4K2-side-title").textContent=d.admin;
  document.getElementById("QW4K2-state-label").textContent=d.stateLbl;
  document.getElementById("QW4K2-side-code").textContent=d.code;
  // sidebar crop labels
  document.querySelectorAll("#QW4K2-commodity-list button").forEach(function(b){
    var lbl=b.querySelector(".QW4K2-clabel"); if(lbl) lbl.textContent=cropLabel(b.dataset.crop);
  });
  document.getElementById("QW4K2-side-note").textContent=(lang==="hi"
    ? "रंग मान दर्शाता है — गहरा हरा = अधिक। जिले पर क्लिक करें।"
    : "Colour shows the value — darker green = higher. Click a district for detail.");
  document.getElementById("QW4K2-marquee-ticker").textContent=buildTicker();
}

// Build the marquee text from real data: district – crop – modal price.
// For a selected crop, list its markets; for ALL, one representative row per district.
function buildTicker(){
  var rows;
  if(currentCrop===ALL){
    var seen={}; rows=[];
    RAW.forEach(function(r){ if(!seen[r.district]){ seen[r.district]=1; rows.push(r); } });
  } else {
    rows=(byCommodity[currentCrop]||[]).slice();
  }
  var parts=rows.map(function(r){
    var who = currentCrop===ALL ? distLabel(r.district)
                                : distLabel(r.district)+" ("+cropLabel(r.commodity)+")";
    return who+" — "+fmt(r.modal);
  });
  // repeat once so the loop reads continuously without a long gap
  var line=parts.join("   •   ");
  return line+"   •   "+line;
}

function toggleLanguage(){ lang=document.getElementById("QW4K2-langToggle").value; applyLang(); render(); }

// legend control on the map
var legend=L.control({position:"bottomleft"});
legend.onAdd=function(){
  var div=L.DomUtil.create("div","QW4K2-map-legend");
  div.innerHTML="<div id='QW4K2-leg-body'></div>";
  return div;
};
legend.addTo(map);
function refreshLegend(){
  var d=dict[lang];
  var isAll=(currentCrop===ALL);
  var head = isAll ? (lang==="hi"?"फसलों की संख्या":"No. of commodities")
                   : (lang==="hi"?"मंडी भाव (Rs./kg)":"Mandi price (Rs./kg)");
  var hiTxt = isAll ? d.more : d.high;
  var loTxt = isAll ? d.fewer : d.low;
  var none  = isAll ? d.nrec : d.norate;
  document.getElementById("QW4K2-leg-body").innerHTML=
    "<div style='margin-bottom:3px'>"+head+"</div>"+
    "<div><span class='QW4K2-sw' style='background:rgb(0,102,0)'></span>"+hiTxt+"</div>"+
    "<div><span class='QW4K2-sw' style='background:rgb(179,162,93)'></span>&nbsp;</div>"+
    "<div><span class='QW4K2-sw' style='background:rgb(238,221,171)'></span>"+loTxt+"</div>"+
    "<div><span class='QW4K2-sw' style='background:#f3f0e0'></span>"+none+"</div>";
}
var _origRender=render;
render=function(){ _origRender(); refreshLegend(); };

// language select now wires up here instead of an inline onchange= attribute
document.getElementById("QW4K2-langToggle").addEventListener("change", toggleLanguage);

buildSidebar();
applyLang();
render();
// ensure the map fills the fixed-height frame after layout settles
setTimeout(function(){ map.invalidateSize(); if(mpBounds) map.fitBounds(mpBounds,{padding:[12,12]}); },80);
window.addEventListener("resize",function(){ map.invalidateSize(); });

});
