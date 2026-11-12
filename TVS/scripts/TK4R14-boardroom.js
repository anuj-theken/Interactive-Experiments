// scripts/TK4R14-boardroom.js — TK4R14 · Four families, one table (TVS & Sons board)
// Converted from "orgchart.html". Scenes, cast, camera moves and timings are unchanged;
// only selectors (prefixed), token reads (from the section) and stage sizing (sticky
// stage instead of a fixed full-page canvas) differ.

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R14-chart-section");
  if (!section || typeof THREE === "undefined") return;
  const stage = section.querySelector(".TK4R14-stage");

  /* =========================================================
     CAST: replace `img` with a photo URL (e.g. /TVS/imgs/...).
     ========================================================= */
  const PEOPLE = [
    // Santhanam family
    { id:'tss',    name:'T.S. Santhanam',       family:'santhanam',  seat:'headW', img:'' },
    { id:'viji',   name:'S. Viji',              family:'santhanam',  seat:'nW',    img:'' },
    { id:'san3',   name:'Santhanam nominee',    family:'santhanam',  seat:'sW',    img:'' },
    // Rajam family
    { id:'tsr',    name:'T.S. Rajam',           family:'rajam',      seat:'headE', img:'' },
    { id:'haresh', name:'Ramachandran Haresh',  family:'rajam',      seat:'headE', img:'' },
    { id:'raj2',   name:'Rajam nominee',        family:'rajam',      seat:'nE',    img:'' },
    { id:'raj3',   name:'Rajam nominee',        family:'rajam',      seat:'sE',    img:'' },
    // Krishna family
    { id:'tsk',    name:'T.S. Krishna',         family:'krishna',    seat:'n1',    img:'' },
    { id:'suresh', name:'Suresh Krishna',       family:'krishna',    seat:'n2',    img:'' },
    { id:'kri3',   name:'Krishna nominee',      family:'krishna',    seat:'n3',    img:'' },
    // Srinivasan family
    { id:'tssr',   name:'T.S. Srinivasan',      family:'srinivasan', seat:'s1',    img:'' },
    { id:'venu',   name:'Venu Srinivasan',      family:'srinivasan', seat:'s2',    img:'' },
    { id:'sri3',   name:'Srinivasan nominee',   family:'srinivasan', seat:'s3',    img:'' },
    // Next generation (outro)
    { id:'harsha',    name:'Harsha Viji',     family:'santhanam',  seat:'gW', img:'', gen:true },
    { id:'dinesh',    name:'R. Dinesh',       family:'rajam',      seat:'gE', img:'', gen:true },
    { id:'arathi',    name:'Arathi Krishna',  family:'krishna',    seat:'gN', img:'', gen:true },
    { id:'sudarshan', name:'Sudarshan Venu',  family:'srinivasan', seat:'gS', img:'', gen:true },
  ];
  const BY_ID = Object.fromEntries(PEOPLE.map(p=>[p.id,p]));
  const initials = n => n.replace(/[^A-Za-z .]/g,'').split(/[\s.]+/).filter(Boolean).filter(w=>w.toLowerCase()!=='nominee').map(w=>w[0]).slice(-2).join('').toUpperCase();
  // Tokens are read from the section (light island), never documentElement
  const css = n => getComputedStyle(section).getPropertyValue(n).trim();
  const famVar = f => `var(--TK4R14-${f})`;
  const isMobile = () => innerWidth <= 860;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mini avatars in cards */
  section.querySelectorAll('.TK4R14-mini[data-person]').forEach(el=>{
    const p = BY_ID[el.dataset.person]; if(!p) return;
    el.style.setProperty('--fc', famVar(p.family));
    if(p.img){ el.style.backgroundImage = `url("${p.img}")`; el.classList.add('has-img'); }
    else el.textContent = initials(p.name);
  });

  /* =========================================================
     THREE: the boardroom
     ========================================================= */
  const canvas = document.getElementById('TK4R14-gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 34, 62);
  const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,200);
  const cam = { zoom:.7, az:.95, el:.78, tx:0, tz:0, dist:40, sx:0 };

  scene.add(new THREE.HemisphereLight(0xfffaf2, 0xc7ab86, .8));
  const fill = new THREE.DirectionalLight(0xe8eeff, .3); fill.position.set(-12,9,-8); scene.add(fill);
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.05);
  sun.position.set(9,20,7); sun.castShadow = true;
  sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:60});
  sun.shadow.bias = -0.0004;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  scene.add(sun);

  const M = {
    // Floor is a shadow catcher: the stage's own paper background shows through,
    // so the room sits on exactly the same ground as the rest of the page.
    floor: new THREE.ShadowMaterial({ opacity:.16 }),
    rug:   new THREE.MeshBasicMaterial({ toneMapped:false }),
    chair: new THREE.MeshStandardMaterial({ roughness:.55 }),
    table: new THREE.MeshStandardMaterial({ roughness:.5, metalness:.05 }),
    leg:   new THREE.MeshStandardMaterial({ roughness:.45, metalness:.35 })
  };
  const FAM_OF = { west:'santhanam', east:'rajam', north:'krishna', south:'srinivasan' };
  const famChair = {};
  ['santhanam','rajam','krishna','srinivasan'].forEach(f=>famChair[f] = new THREE.MeshStandardMaterial({ roughness:.5 }));

  /* The missed opportunities: IT and telecom, rising off the board's map */
  const OPP = { group:new THREE.Group(), mats:[], rings:[] };
  scene.add(OPP.group);
  function ghost(token, extra = {}, max = .92){
    const m = new THREE.MeshStandardMaterial({ roughness:.45, metalness:.15, transparent:true, opacity:0, ...extra });
    m.userData.max = max; m.userData.token = token; OPP.mats.push(m); return m;
  }

  function applyThemeColors(){
    const white = new THREE.Color(0xffffff);
    Object.entries(famChair).forEach(([f,m])=>m.color.set(css('--TK4R14-'+f)).lerp(white,.12));
    M.floor.color.set(css('--TK4R14-leg')); M.rug.color.set(css('--TK4R14-rug'));
    M.chair.color.set(css('--TK4R14-chair')); M.table.color.set(css('--TK4R14-table'));
    M.leg.color.set(css('--TK4R14-leg'));
    scene.fog.color.set(css('--color-bg'));
    OPP.mats.forEach(m=>{
      m.color.set(css(m.userData.token));
      if(m.userData.glow) m.emissive.set(css(m.userData.token));
    });
    OPP.rings.forEach(r=>r.material.color.set(css('--TK4R14-conflict')));
  }

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(300,300), M.floor);
  floor.rotation.x = -Math.PI/2; floor.position.y = .02; floor.receiveShadow = true; scene.add(floor);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(11.5, 96), M.rug);
  rug.rotation.x = -Math.PI/2; rug.position.y = .01; scene.add(rug);

  function makeChair(mat = M.chair){
    const g = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(.95,.1,.9), mat); seat.position.y = .5;
    const back = new THREE.Mesh(new THREE.BoxGeometry(.95,.85,.1), mat); back.position.set(0,.98,-.42); back.rotation.x = -.08;
    [seat,back].forEach(m=>{ m.castShadow = m.receiveShadow = true; g.add(m); });
    const lg = new THREE.CylinderGeometry(.035,.035,.5,8);
    [[.4,.38],[-.4,.38],[.4,-.38],[-.4,-.38]].forEach(([x,z])=>{ const l = new THREE.Mesh(lg, M.leg); l.position.set(x,.25,z); l.castShadow = true; g.add(l); });
    return g;
  }

  /* Table fragments: each family's share of the table can drift away */
  const FRAG = {
    west:  { dir:[-1,0,0], dist:5.2, rot:.18,  piece:[-4.16,0, 2.26,3.0] },
    east:  { dir:[ 1,0,0], dist:5.2, rot:-.18, piece:[ 4.16,0, 2.26,3.0] },
    north: { dir:[0,0,-1], dist:4.2, rot:-.1,  piece:[0,-.76, 5.94,1.48] },
    south: { dir:[0,0, 1], dist:4.2, rot:.1,   piece:[0, .76, 5.94,1.48] }
  };
  const CRACK = .22;
  const SEATS = {
    headW:{p:[-6.35,0],f:'west'}, nW:{p:[-4,-2.35],f:'west'}, sW:{p:[-4,2.35],f:'west'},
    headE:{p:[ 6.35,0],f:'east'}, nE:{p:[ 4,-2.35],f:'east'}, sE:{p:[ 4,2.35],f:'east'},
    n1:{p:[-2,-2.35],f:'north'}, n2:{p:[0,-2.35],f:'north'}, n3:{p:[2,-2.35],f:'north'},
    s1:{p:[-2, 2.35],f:'south'}, s2:{p:[0, 2.35],f:'south'}, s3:{p:[2, 2.35],f:'south'}
  };
  const anchors = {};
  Object.entries(FRAG).forEach(([k,f])=>{
    const g = new THREE.Group(); f.group = g; scene.add(g);
    const [cx,cz,w,d] = f.piece;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w,.1,d), M.table);
    top.position.set(cx,.92,cz); top.castShadow = top.receiveShadow = true; g.add(top);
    const legGeo = new THREE.BoxGeometry(.09,.87,.09);
    const lx = w/2-.25, lz = d/2-.2;
    [[lx,lz],[-lx,lz],[lx,-lz],[-lx,-lz]].forEach(([x,z])=>{ const l = new THREE.Mesh(legGeo, M.leg); l.position.set(cx+x,.435,cz+z); l.castShadow = true; g.add(l); });
    const a = new THREE.Object3D(); a.position.set(cx,1.55,cz); g.add(a);
    anchors['m:'+k] = a;
  });
  anchors['gW']=anchors['m:west']; anchors['gE']=anchors['m:east']; anchors['gN']=anchors['m:north']; anchors['gS']=anchors['m:south'];
  const centerA = new THREE.Object3D(); centerA.position.set(0,1.6,0); scene.add(centerA); anchors['m:center'] = centerA;

  Object.entries(SEATS).forEach(([k,s])=>{
    const [x,z] = s.p, g = FRAG[s.f].group;
    const ch = makeChair(famChair[FAM_OF[s.f]]); ch.position.set(x,0,z);
    const fx = -Math.sign(x)*(Math.abs(z)<.1?1:0), fz = -Math.sign(z)*(Math.abs(z)>.1?1:0);
    ch.rotation.y = Math.atan2(fx, fz); g.add(ch);
    const a = new THREE.Object3D(); a.position.set(x,1.85,z); g.add(a); anchors[k] = a;
  });

  /* Background rows of empty chairs */
  (function bgChairs(){
    const pts = [];
    for(const z of [-16,-13.4,-10.8, 10.8,13.4,16]) for(let x=-24;x<=24;x+=2.1) pts.push([x + (z>0?1:0), z]);
    const parts = [
      { geo:new THREE.BoxGeometry(.95,.1,.9), pos:[0,.5,0], rx:0 },
      { geo:new THREE.BoxGeometry(.95,.85,.1), pos:[0,.98,-.42], rx:-.08 },
      { geo:new THREE.CylinderGeometry(.07,.12,.5,10), pos:[0,.25,0], rx:0 }
    ];
    const d = new THREE.Object3D(), local = new THREE.Object3D();
    parts.forEach(pt=>{
      const im = new THREE.InstancedMesh(pt.geo, M.chair, pts.length);
      im.castShadow = im.receiveShadow = true;
      pts.forEach(([x,z],i)=>{
        d.position.set(x,0,z); d.rotation.set(0, Math.atan2(-x*.25, -z), 0); d.updateMatrix();
        local.position.set(...pt.pos); local.rotation.set(pt.rx,0,0); local.updateMatrix();
        im.setMatrixAt(i, d.matrix.clone().multiply(local.matrix));
      });
      scene.add(im);
    });
  })();

  (function buildOpps(){
    const padM = ghost('--color-rule', {}, .9);
    // IT: a row of server racks
    const it = new THREE.Group(); it.position.set(-10,0,-4); OPP.group.add(it);
    const rackM = ghost('--color-text'), lightM = ghost('--color-accent', { emissiveIntensity:1 });
    lightM.userData.glow = true;
    const pad1 = new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,.08,48), padM); pad1.position.y = .04; pad1.receiveShadow = true; it.add(pad1);
    for(let i=0;i<3;i++){
      const r = new THREE.Mesh(new THREE.BoxGeometry(1,2.4,1), rackM);
      r.position.set((i-1)*1.15,1.28,0); r.castShadow = r.receiveShadow = true; it.add(r);
      for(let j=0;j<6;j++){
        const l = new THREE.Mesh(new THREE.BoxGeometry(.7,.05,.02), lightM);
        l.position.set((i-1)*1.15,.5+j*.32,.51); it.add(l);
      }
    }
    const itA = new THREE.Object3D(); itA.position.set(0,3.3,0); it.add(itA); anchors['m:it'] = itA;

    // Telecom: a mast with antenna panels, a dish and signal rings
    const tel = new THREE.Group(); tel.position.set(-4.5,0,-8.6); OPP.group.add(tel);
    const towM = ghost('--color-muted'), dishM = ghost('--color-bg-warm', { side:THREE.DoubleSide });
    const pad2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,.08,48), padM); pad2.position.y = .04; pad2.receiveShadow = true; tel.add(pad2);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.07,.28,5,10), towM); mast.position.y = 2.5; mast.castShadow = true; tel.add(mast);
    for(let k=0;k<3;k++){
      const a = k*Math.PI*2/3, p = new THREE.Mesh(new THREE.BoxGeometry(.2,.75,.07), towM);
      p.position.set(Math.sin(a)*.22,4.3,Math.cos(a)*.22); p.rotation.y = a; p.castShadow = true; tel.add(p);
    }
    [1.4,2.6,3.6].forEach((y,i)=>{
      const bar = new THREE.Mesh(new THREE.TorusGeometry(.26-i*.05,.03,6,24), towM);
      bar.position.y = y; bar.rotation.x = Math.PI/2; tel.add(bar);
    });
    const dish = new THREE.Mesh(new THREE.SphereGeometry(.45,24,10,0,Math.PI*2,0,Math.PI/2.6), dishM);
    dish.position.set(.38,3.15,.1); dish.rotation.z = -Math.PI/2.3; dish.castShadow = true; tel.add(dish);
    for(let i=0;i<3;i++){
      const rm = new THREE.MeshBasicMaterial({ transparent:true, opacity:0, depthWrite:false });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.45,.022,8,48), rm);
      ring.position.y = 5.05; ring.rotation.x = Math.PI/2; tel.add(ring); OPP.rings.push(ring);
    }
    const telA = new THREE.Object3D(); telA.position.set(0,6.1,0); tel.add(telA); anchors['m:tel'] = telA;
  })();

  applyThemeColors();

  /* =========================================================
     HTML overlay: tokens, markers, links
     ========================================================= */
  const overlay = document.getElementById('TK4R14-overlay');
  const svg = document.getElementById('TK4R14-links');
  const NS = 'http://www.w3.org/2000/svg';
  const tokens = {};
  const screen = {};

  PEOPLE.forEach(p=>{
    const root = document.createElement('div'); root.className = 'TK4R14-token';
    root.dataset.family = p.family;
    root.style.setProperty('--fc', famVar(p.family));
    root.innerHTML = `<div class="TK4R14-token-inner"><div class="TK4R14-tg"></div><div class="TK4R14-face"></div><div class="TK4R14-nm"></div></div>`;
    const face = root.querySelector('.TK4R14-face');
    if(p.img){ face.style.backgroundImage = `url("${p.img}")`; face.classList.add('has-img'); }
    else face.textContent = initials(p.name);
    root.querySelector('.TK4R14-nm').textContent = p.name;
    overlay.appendChild(root);
    tokens[p.id] = { root, inner:root.querySelector('.TK4R14-token-inner'), tag:root.querySelector('.TK4R14-tg'), nm:root.querySelector('.TK4R14-nm'), anchor:anchors[p.seat] };
  });

  const markers = {};
  ['center','west','east','north','south','it','tel'].forEach(k=>{
    const root = document.createElement('div'); root.className = 'TK4R14-marker';
    root.innerHTML = '<div class="TK4R14-marker-inner"></div>';
    overlay.appendChild(root);
    markers[k] = { root, inner:root.firstChild, anchor:anchors['m:'+k], html:'' };
  });

  const linkMap = new Map();
  function setLinks(list = []){
    const keep = new Set();
    list.forEach(l=>{
      const k = `${l.a}|${l.b}|${l.type}`; keep.add(k);
      if(linkMap.has(k)) return;
      const path = document.createElementNS(NS,'path');
      path.setAttribute('pathLength','1');
      path.setAttribute('class','TK4R14-link is-'+l.type);
      svg.appendChild(path);
      const rec = { ...l, path }; linkMap.set(k, rec);
      if(l.type === 'alliance'){
        const g = document.createElementNS(NS,'linearGradient');
        g.id = 'TK4R14-g' + Math.random().toString(36).slice(2,8);
        g.setAttribute('gradientUnits','userSpaceOnUse');
        g.innerHTML = '<stop offset="0" style="stop-color:var(--TK4R14-krishna)"/><stop offset="1" style="stop-color:var(--TK4R14-srinivasan)"/>';
        document.getElementById('TK4R14-defs').appendChild(g);
        path.style.stroke = `url(#${g.id})`; rec.grad = g;
      }
      if(l.type === 'conflict'){
        gsap.fromTo(path,{opacity:0},{opacity:1,duration:.6,delay:l.delay||0});
      } else {
        gsap.fromTo(path,{strokeDasharray:'1 1',strokeDashoffset:1,opacity:1},
          {strokeDashoffset:0,duration:reduce?.01:1.1,ease:'power2.inOut',delay:l.delay||0});
      }
    });
    linkMap.forEach((rec,k)=>{
      if(keep.has(k)) return;
      linkMap.delete(k);
      gsap.to(rec.path,{opacity:0,duration:.35,onComplete:()=>{ rec.path.remove(); rec.grad && rec.grad.remove(); }});
    });
  }

  /* =========================================================
     Scenes
     ========================================================= */
  const ERA1 = ['tss','viji','san3','tsr','raj2','raj3','tsk','suresh','kri3','tssr','venu','sri3'];
  const ERA2 = ERA1.map(x=>x==='tsr'?'haresh':x);
  const GEN  = ['harsha','dinesh','arathi','sudarshan'];
  const fam = (f, era=ERA2) => era.filter(id=>BY_ID[id].family===f);
  const except = (arr, ids) => arr.filter(x=>!ids.includes(x));
  const RING = ['tss','viji','tsk','suresh','kri3','raj2','haresh','raj3','sri3','venu','tssr','san3'];
  const LOCK = `<div class="TK4R14-lock"><div><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="square"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><br><span>12/12</span></div></div>`;

  const SCENES = [
    /*0 hero*/ { cam:{zoom:.72,az:1.0,el:.8}, visible:[] },
    /*1*/ { cam:{zoom:1,az:.78,el:.62}, visible:ERA1, focus:ERA1, names:true },
    /*2*/ { cam:{zoom:1.05,az:.78,el:.88}, visible:ERA1, focus:['tss','tsr'], dim:except(ERA1,['tss','tsr']),
            power:['tss','tsr'], tags:{tss:'Chairman', tsr:'Managing director'} },
    /*3*/ { cam:{zoom:1.1,az:.42,el:.72}, visible:ERA1, focus:[...fam('krishna',ERA1),...fam('srinivasan',ERA1)],
            dim:[...fam('santhanam',ERA1),...fam('rajam',ERA1)],
            links:[{a:'tsk',b:'tssr',type:'alliance',bend:.08},{a:'suresh',b:'venu',type:'alliance',bend:.08,delay:.15},{a:'kri3',b:'sri3',type:'alliance',bend:.08,delay:.3}],
            markers:{center:'<div class="TK4R14-chip"><b>6</b>of 12 seats</div>'} },
    /*4*/ { cam:{zoom:1.5,az:.78,el:.62,tx:4.6,tz:0}, visible:[...ERA1,'haresh'], departed:['tsr'],
            focus:['haresh'], dim:except(ERA1,['tsr']), power:['haresh'],
            tags:{tsr:'Died 1982', haresh:'Executive director'}, names:['haresh','tsr'] },
    /*5*/ { cam:{zoom:1.2,az:.78,el:.66,tx:3,tz:-1}, visible:ERA2, focus:['suresh','haresh'], dim:except(ERA2,['suresh','haresh']),
            tags:{suresh:'Sued', haresh:'Appointment challenged'}, conflictTags:['suresh'], names:['suresh','haresh'],
            links:[{a:'suresh',b:'haresh',type:'conflict',bend:-.22}], after:'withdraw' },
    /*6*/ { cam:{zoom:.95,az:.78,el:1.12}, visible:ERA2, focus:ERA2,
            links:RING.map((id,i)=>({a:id,b:RING[(i+1)%RING.length],type:'consensus',bend:0,delay:i*.06})),
            markers:{center:LOCK} },
    /*7*/ { cam:{zoom:1.28,az:.6,el:.46}, visible:ERA2, dim:ERA2, crack:1, tension:true },
    /*8*/ { cam:{zoom:1.12,az:.78,el:.7,tx:-1.6,tz:.2}, visible:ERA2, focus:['venu','suresh','tss'],
            dim:except(ERA2,['venu','suresh','tss']), crack:1, names:['venu','suresh','tss'],
            tags:{venu:'In court', suresh:'In court'}, conflictTags:['venu','suresh'],
            links:[{a:'venu',b:'m:west',type:'conflict',bend:.2},{a:'suresh',b:'m:west',type:'conflict',bend:-.2,delay:.2}],
            markers:{west:'<div class="TK4R14-chip is-danger">Santhanam-owned company</div>', north:'<div class="TK4R14-chip">Krishna brake-linings business</div>'} },
    /*9*/ { cam:{zoom:1.4,az:.78,el:.62,tx:-2.6,tz:1.4}, visible:ERA2, focus:['venu','tss'], big:['venu'],
            dim:except(ERA2,['venu','tss']), crack:1, names:['venu','tss'],
            tags:{tss:'“My uncle”'}, links:[{a:'venu',b:'tss',type:'conflict',bend:-.25}] },
    /*10*/{ cam:{zoom:.8,az:.6,el:.58,tx:-3.2,tz:-3.6}, visible:ERA2, dim:ERA2, crack:1, opps:true,
            links:[{a:'m:center',b:'m:it',type:'conflict',bend:.15,delay:.9},{a:'m:center',b:'m:tel',type:'conflict',bend:-.15,delay:1.1}],
            markers:{ it:'<div class="TK4R14-chip is-danger">IT, not pursued</div>', tel:'<div class="TK4R14-chip is-danger">Telecom, not pursued</div>' } },
    /*11*/{ cam:{zoom:.62,az:.78,el:.92}, visible:ERA2, focus:ERA2, split:1 },
    /*12*/{ cam:{zoom:.58,az:.86,el:1.0}, visible:[...ERA2,...GEN], focus:GEN, dim:ERA2, split:1,
            tags:{harsha:'Next generation',dinesh:'Next generation',arathi:'Next generation',sudarshan:'Next generation'}, names:GEN }
  ];

  const world = { split:0, crack:.06, tension:0, opp:0 };
  let current = -1, afterCall = null, labelsDirty = true;

  function setScene(i){
    if(i === current) return; current = i;
    const s = SCENES[i];
    if(afterCall){ afterCall.kill(); afterCall = null; }
    const D = reduce ? .01 : 1.4;

    const c = { zoom:1, az:.78, el:.62, tx:0, tz:0, ...s.cam };
    gsap.to(cam, { ...c, duration:D, ease:'power3.inOut', overwrite:'auto' });
    gsap.to(world, { split:s.split||0, crack:s.crack?1:.06, tension:s.tension?1:0, opp:s.opps?1:0, duration:reduce?.01:1.8, ease:'power3.inOut', overwrite:'auto' });
    gsap.to('#TK4R14-tension', { opacity:s.tension?1:0, duration:.8 });
    if(s.tension && !reduce){
      gsap.timeline().to(cam,{sx:.18,duration:.05,repeat:9,yoyo:true,ease:'none'}).to(cam,{sx:0,duration:.1});
    }

    const vis = new Set(s.visible||[]), dim = new Set(s.dim||[]), focus = new Set(s.focus||[]);
    const big = new Set(s.big||[]), departed = new Set(s.departed||[]), power = new Set(s.power||[]);
    const conflictTags = new Set(s.conflictTags||[]);
    const names = s.names === true ? vis : new Set(s.names||[]);
    PEOPLE.forEach((p,idx)=>{
      const t = tokens[p.id], v = vis.has(p.id);
      let alpha = v ? (dim.has(p.id) ? .3 : 1) : 0;
      let sc = v ? (big.has(p.id) ? 1.5 : focus.has(p.id) ? 1.12 : .9) : .4;
      let y = 0;
      if(departed.has(p.id)){ alpha = .45; sc = .78; y = -58; }
      gsap.to(t.inner, { autoAlpha:alpha, scale:sc, y, duration:reduce?.01:.75, ease:'back.out(1.6)', delay:v && !reduce ? (idx%13)*.025 : 0, overwrite:'auto' });
      t.root.classList.toggle('is-power', power.has(p.id));
      t.root.classList.toggle('is-departed', departed.has(p.id));
      t.root.classList.toggle('show-name', names.has(p.id));
      const tag = s.tags && s.tags[p.id];
      if(tag) t.tag.textContent = tag;
      t.root.classList.toggle('has-tag', !!tag);
      t.root.classList.toggle('tag-conflict', conflictTags.has(p.id));
    });

    Object.entries(markers).forEach(([k,m])=>{
      const html = s.markers && s.markers[k];
      if(html){ if(m.html !== html){ m.inner.innerHTML = html; m.html = html; }
        gsap.fromTo(m.inner,{autoAlpha:0,scale:.8},{autoAlpha:1,scale:1,duration:.6,delay:.4,ease:'back.out(2)',overwrite:'auto'});
      } else gsap.to(m.inner,{autoAlpha:0,duration:.3,overwrite:'auto'});
    });

    setLinks(s.links);
    labelsDirty = true;

    if(s.after === 'withdraw'){
      afterCall = gsap.delayedCall(reduce?.2:1.8, ()=>{
        linkMap.forEach(r=>{ if(r.type==='conflict') r.path.setAttribute('class','TK4R14-link is-withdrawn'); });
        const m = markers.north; const html = '<div class="TK4R14-stamp">Case withdrawn</div>';
        m.inner.innerHTML = html; m.html = html;
        gsap.fromTo(m.inner,{autoAlpha:0,scale:1.6},{autoAlpha:1,scale:1,duration:.45,ease:'power4.in'});
        tokens.suresh.tag.textContent = 'Withdrew'; labelsDirty = true;
        tokens.suresh.root.classList.remove('tag-conflict');
      });
    }
  }

  /* =========================================================
     ECharts — printed: flat wedges, square ends, paper gaps
     ========================================================= */
  const charts = {};
  const FAMS = [['santhanam','Santhanam'],['rajam','Rajam'],['krishna','Krishna'],['srinivasan','Srinivasan']];

  function buildStake(){
    const el = document.getElementById('TK4R14-chartStake');
    charts.stake && charts.stake.dispose();
    const c = charts.stake = echarts.init(el, null, { renderer:'svg' });
    c.setOption({
      animationDuration:1100, animationEasing:'cubicOut',
      graphic:[{ type:'text', left:'center', top:'middle', style:{ text:'25%\neach', fill:css('--color-text'), font:`600 24px ${css('--font-display')}`, align:'center', lineHeight:24 } }],
      series:[{ type:'pie', radius:['54%','80%'], center:['50%','50%'], startAngle:90,
        itemStyle:{ borderColor:css('--color-surface'), borderWidth:2, borderRadius:0 },
        label:{ color:css('--color-muted'), fontFamily:css('--font-body'), fontSize:11, fontWeight:600, formatter:'{b}' },
        labelLine:{ length:6, length2:6, lineStyle:{ color:css('--color-muted') } },
        emphasis:{ scale:false },
        data: FAMS.map(([k,n])=>({ name:n, value:25, itemStyle:{ color:css('--TK4R14-'+k) } })) }]
    });
  }

  function buildGauge(){
    const el = document.getElementById('TK4R14-chartGauge');
    charts.gauge && charts.gauge.dispose();
    const c = charts.gauge = echarts.init(el, null, { renderer:'svg' });
    c.setOption({
      series:[{ type:'gauge', startAngle:90, endAngle:-270, min:0, max:12, radius:'88%',
        pointer:{show:false}, splitNumber:12,
        progress:{ show:true, width:12, roundCap:false, itemStyle:{ color:css('--color-text') } },
        axisLine:{ lineStyle:{ width:12, color:[[1, css('--color-rule')]] } },
        splitLine:{ show:true, distance:-12, length:12, lineStyle:{ color:css('--color-surface'), width:3 } },
        axisTick:{show:false}, axisLabel:{show:false},
        title:{ offsetCenter:[0,'26%'], color:css('--color-muted'), fontSize:11, fontFamily:css('--font-body'), fontWeight:600 },
        detail:{ offsetCenter:[0,'-6%'], formatter:'{value} of 12', color:css('--color-text'), fontSize:24, fontWeight:600, fontFamily:css('--font-display') },
        data:[{ value:12, name:'votes needed' }], animationDuration:1600 }]
    });
  }

  /* lazily build card charts when scrolled near */
  function lazyChart(id, fn){
    ScrollTrigger.create({ trigger:'#'+id, start:'top 85%', once:true, onEnter:fn });
  }

  /* =========================================================
     Layout + render loop (sized to the sticky stage)
     ========================================================= */
  let W = 0, H = 0;
  function resize(){
    W = stage.clientWidth || innerWidth; H = stage.clientHeight || innerHeight;
    renderer.setSize(W, H, false);
    const aspect = W/H;
    let hw, hh;
    if(aspect >= 1){ hh = 9; hw = 9*aspect; } else { hw = 8.4; hh = 8.4/aspect; }
    Object.assign(camera,{ left:-hw, right:hw, top:hh, bottom:-hh });
    if(isMobile()) camera.setViewOffset(W,H,0,Math.round(H*.17),W,H);
    else camera.setViewOffset(W,H,-Math.round(Math.min(W*.18, 240)),0,W,H);
    camera.updateProjectionMatrix();
    Object.values(charts).forEach(c=>c && c.resize());
    labelsDirty = true;
  }
  addEventListener('resize', ()=>{ resize(); ScrollTrigger.refresh(); });
  resize();

  const v3 = new THREE.Vector3();
  function toScreen(obj){
    obj.getWorldPosition(v3); v3.project(camera);
    return [ (v3.x+1)/2*W, (1-v3.y)/2*H, v3.z ];
  }

  /* Label collision pass — no tag, name or chip may overlap another annotation.
     Faces, scene chips and the legend are fixed obstacles (the scrolling story cards are not:
     they pass over the board and may cover names); each tag/name
     tries a short list of spots around its face (default first) and takes the first clear one.
     Focused people are placed first; a dimmed person's label with no clear spot is hidden. */
  const stageEl = stage, legendEl = section.querySelector('.TK4R14-legend');
  const GAP = 4;
  let LM = null;   // cached metrics (unscaled px): face size, name/tag offsets, label sizes
  function measureLabels(){
    const anyTok = Object.values(tokens)[0];
    const face = anyTok.root.querySelector('.TK4R14-face');
    const nmCS = getComputedStyle(anyTok.nm), tgCS = getComputedStyle(anyTok.tag);
    LM = { face: face.offsetWidth || 50, nmTop: parseFloat(nmCS.top) || 31, tgBottom: parseFloat(tgCS.bottom) || 34, size:{} };
    for(const id in tokens){
      const t = tokens[id];
      LM.size[id] = { nm:[t.nm.offsetWidth, t.nm.offsetHeight], tg:[t.tag.offsetWidth, t.tag.offsetHeight] };
    }
    labelsDirty = false;
  }
  const hit = (a, list) => list.some(b => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]);
  function setLabel(el, dx, dy, on){
    const v = on ? `${dx.toFixed(1)}|${dy.toFixed(1)}` : 'off';
    if(el._lbl === v) return; el._lbl = v;
    el.classList.toggle('TK4R14-lbl-off', !on);
    if(on){ el.style.setProperty('--lx', dx.toFixed(1)+'px'); el.style.setProperty('--ly', dy.toFixed(1)+'px'); }
  }
  function layoutLabels(ts){
    if(labelsDirty || !LM) measureLabels();
    const sr = stageEl.getBoundingClientRect();
    const fixed = [], rel = r => [r.left-sr.left-GAP, r.top-sr.top-GAP, r.right-sr.left+GAP, r.bottom-sr.top+GAP];
    if(legendEl && legendEl.offsetWidth) fixed.push(rel(legendEl.getBoundingClientRect()));
    for(const k in markers){
      const m = markers[k], c = m.inner.firstElementChild;
      if(!c || +gsap.getProperty(m.inner,'opacity') < .05) continue;
      fixed.push(rel(c.getBoundingClientRect()));   // real rect: the stamp is rotated and scaled in
    }
    // visible tokens with their screen origin and effective scale
    const live = [];
    for(const id in tokens){
      const t = tokens[id], a = +gsap.getProperty(t.inner,'opacity');
      if(a < .05){ setLabel(t.nm,0,0,true); setLabel(t.tag,0,0,true); continue; }
      const sc = ts * +gsap.getProperty(t.inner,'scale');
      const [x,y] = screen[id], oy = y + ts * +gsap.getProperty(t.inner,'y');
      const f = LM.face*sc/2;
      fixed.push([x-f, oy-f, x+f, oy+f]);
      live.push({ id, t, x, oy, sc, dim: a < .6, tag: t.root.classList.contains('has-tag'), nm: !!LM.size[id].nm[0] });
    }
    // placement order: tags then names, focused before dimmed
    const jobs = [];
    live.forEach(o=>{ if(o.tag) jobs.push({o, kind:'tg'}); if(o.nm) jobs.push({o, kind:'nm'}); });
    jobs.sort((a,b)=> (a.o.dim-b.o.dim) || ((a.kind==='tg'?0:1)-(b.kind==='tg'?0:1)));
    const placed = fixed.slice();
    jobs.forEach(({o, kind})=>{
      const el = kind==='tg' ? o.t.tag : o.t.nm, [w,h] = LM.size[o.id][kind], half = LM.face/2;
      // default top edge in token-local px, then candidate (centre-x, top) spots, nearest first:
      // pushed further out, beside the face at three heights, diagonals, then the far side of the face
      const top0 = kind==='tg' ? -LM.tgBottom - h : LM.nmTop;
      const dir = kind==='tg' ? -1 : 1, side = half + 8 + w/2, diag = half*.7 + w/2;
      const near = kind==='tg' ? -half-h+2 : half-2, mid = -h/2, far = kind==='tg' ? half-2 : -half-h+2;
      const opp = kind==='tg' ? LM.nmTop : -LM.tgBottom - h;
      const C = [[0,top0],[0,top0+dir*14],[side,near],[-side,near],[0,top0+dir*28],[side,mid],[-side,mid],
                 [diag,top0+dir*20],[-diag,top0+dir*20],[0,top0+dir*42],[side,far],[-side,far],
                 [diag,top0+dir*36],[-diag,top0+dir*36],[0,opp],[0,opp-dir*14],[0,top0+dir*56]];
      // try last frame's spot first so labels don't flicker between spots, then the rest in order
      const order = [...C.keys()];
      if(el._cand != null){ order.splice(el._cand,1); order.unshift(el._cand); }
      const boxAt = i => { const [cx,ty] = C[i], s = o.sc; return [o.x + s*(cx-w/2), o.oy + s*ty, o.x + s*(cx+w/2), o.oy + s*(ty+h)]; };
      let pick = order.find(i => !hit(boxAt(i), placed));
      // nothing clear anywhere: hide the label rather than let it overlap (highlighted people were
      // placed first, so this only happens to the least important labels in a crowded view)
      if(pick == null){ el._cand = null; setLabel(el,0,0,false); return; }
      el._cand = pick;
      setLabel(el, C[pick][0], C[pick][1] - top0, true);
      placed.push(boxAt(pick));
    });
  }

  // Only render while the section is on screen — the rest of the page keeps its frame budget
  let onScreen = false, rafId = 0;
  const clock = new THREE.Clock();
  function frame(){
    rafId = 0;
    if(!onScreen) return;
    const t = clock.getElapsedTime();

    Object.values(FRAG).forEach(f=>{
      const d = world.split*f.dist + world.crack*CRACK*(1-world.split);
      f.group.position.set(f.dir[0]*d, 0, f.dir[2]*d);
      f.group.rotation.y = f.rot*world.split;
    });

    const o = world.opp;
    OPP.group.visible = o > .01;
    OPP.group.position.y = -3.4*(1-o);
    OPP.mats.forEach(m=>{ m.opacity = m.userData.max*o; });
    OPP.rings.forEach((r,i)=>{
      const p = reduce ? .3 : (t*.45 + i/3) % 1;
      r.scale.setScalar(1 + p*2.4);
      r.material.opacity = (1-p)*.75*o;
    });

    const az = cam.az + (reduce?0:Math.sin(t*.12)*.035);
    const tx = cam.tx + cam.sx, tz = cam.tz;
    camera.position.set(tx + Math.sin(az)*Math.cos(cam.el)*cam.dist, Math.sin(cam.el)*cam.dist, tz + Math.cos(az)*Math.cos(cam.el)*cam.dist);
    camera.lookAt(tx, 0, tz);
    camera.zoom = cam.zoom; camera.updateProjectionMatrix();
    renderer.render(scene, camera);

    const ts = Math.max(.75, Math.min(1.25, cam.zoom));
    for(const id in tokens){
      const tk = tokens[id], [x,y,z] = toScreen(tk.anchor);
      screen[id] = [x,y];
      tk.root.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${ts.toFixed(3)})`;
      tk.root.style.zIndex = 1000 - Math.round(z*400);
    }
    for(const k in markers){
      const m = markers[k], [x,y] = toScreen(m.anchor);
      screen['m:'+k] = [x,y];
      m.root.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      m.root.style.zIndex = 2000;
    }
    layoutLabels(ts);
    linkMap.forEach(r=>{
      const A = screen[r.a], B = screen[r.b]; if(!A||!B) return;
      const dx = B[0]-A[0], dy = B[1]-A[1], bend = r.bend ?? .18;
      const cx = (A[0]+B[0])/2 - dy*bend, cy = (A[1]+B[1])/2 + dx*bend;
      r.path.setAttribute('d',`M${A[0].toFixed(1)},${A[1].toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${B[0].toFixed(1)},${B[1].toFixed(1)}`);
      if(r.grad){
        const g = r.grad;
        g.setAttribute('x1',A[0]); g.setAttribute('y1',A[1]); g.setAttribute('x2',B[0]); g.setAttribute('y2',B[1]);
      }
    });
    rafId = requestAnimationFrame(frame);
  }
  new IntersectionObserver(entries=>{
    onScreen = entries[0].isIntersecting;
    if(onScreen && !rafId){ resize(); rafId = requestAnimationFrame(frame); }
  }, { rootMargin:'200px 0px' }).observe(section);

  /* =========================================================
     Scroll wiring
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger);
  section.querySelectorAll('[data-scene]').forEach(sec=>{
    const i = +sec.dataset.scene;
    ScrollTrigger.create({ trigger:sec, start:'top 55%', end:'bottom 55%',
      onToggle:self=>{ if(self.isActive) setScene(i); } });
  });
  ScrollTrigger.create({ trigger:section, start:'top top', end:'bottom bottom', onUpdate:s=>gsap.set('#TK4R14-bar',{scaleX:s.progress}) });
  lazyChart('TK4R14-chartStake', buildStake);
  lazyChart('TK4R14-chartGauge', buildGauge);

  /* Hero entrance: one orchestrated moment — played when the section arrives, not on page load */
  const heroIn = gsap.timeline({ paused:true });
  heroIn.from('.TK4R14-hero h2',{ y:30, opacity:0, duration:reduce?.01:1.2, ease:'power3.out' })
        .from('.TK4R14-sub, .TK4R14-cue',{ y:16, opacity:0, duration:reduce?.01:1, stagger:.12, ease:'power3.out' }, .35);
  ScrollTrigger.create({ trigger:'.TK4R14-hero', start:'top 70%', once:true, onEnter:()=>heroIn.play() });

  /* Theme changes */
  function onTheme(){
    applyThemeColors();
    if(charts.stake) buildStake();
    if(charts.gauge) buildGauge();
  }
  new MutationObserver(onTheme).observe(document.documentElement,{ attributes:true, attributeFilter:['data-theme'] });

  setScene(0);
  document.fonts && document.fonts.ready.then(()=>ScrollTrigger.refresh());
});
