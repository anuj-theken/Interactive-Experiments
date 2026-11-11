// scripts/TK4R15-mopeddesign.js — TK4R15 · Designing the moped (story V3.3)
// Converted from "Designing the moped.html"; replaces TK4R12. The four pinned
// timelines, their durations, eases and scroll lengths are the original's —
// only selectors are prefixed and the progress line is scoped to this module.

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R15-chart-section");
  if (!section || typeof gsap === "undefined") return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = s => s.replace(/#(?=[A-Za-z])/g, '#TK4R15-').replace(/\.(?=[a-z])/g, '.TK4R15-');
  const $ = s => section.querySelector(P(s)), $$ = s => Array.from(section.querySelectorAll(P(s)));
  const show = { autoAlpha:1, y:0, duration:.7, ease:'power2.out' };
  const hide = { autoAlpha:0, y:'-38vh', duration:.7, ease:'power2.in' };
  gsap.registerPlugin(ScrollTrigger);
  const scrub = reduce ? true : .8;
  const st = (id, end) => ({ trigger:P(id), start:'top top', end, scrub, pin:true });
  gsap.set($$('.copy .b'), { autoAlpha:0, y:'38vh' });
  if (matchMedia('(min-width:821px)').matches) gsap.set($$('#s1 .copy .b, #s4 .copy .b'), { yPercent:-50 });

  /* 01 — the idea: bike outline is drawn on (back wheel → front), then the family, then their colour */
  const bikeWipe = $('#bikeWipe'), mLine = [$('#mBack'), $('#mLine')], mColor = $('#mColor');   // silhouette arrives with the lines
  gsap.set($('#paper1'), { yPercent:-104, rotation:-.8 });
  gsap.set(bikeWipe, { attr:{ width:0 } });
  gsap.set(mLine, { autoAlpha:0, y:-14 });
  gsap.set(mColor, { autoAlpha:0 });
  const tl1 = gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:st('#s1','+=640%') });
  tl1.to({}, {duration:.6})
    .to($('#paper1'), {yPercent:0, rotation:0, duration:1.1, ease:'power2.out'})
    .to($('#c1a'), show, '-=.3')
    .to(bikeWipe, {attr:{width:540}, duration:2, ease:'power1.inOut'}, '<.2')
    .to(mLine, {autoAlpha:1, y:0, duration:.9, ease:'power2.out'})
    .to({}, {duration:.7})
    .to($('#c1a'), hide)
    .to($('#c1b'), show, '<.3')
    .to(mColor, {autoAlpha:1, duration:1.1}, '<.2')
    .to({}, {duration:.7})
    .to($('#c1b'), hide)
    .to($('#c1c'), show, '<.2')
    .to({}, {duration:.9});

  /* 02 — Hosur */
  const pv = {a:0, b:0};
  const n1 = $('#n1'), n2 = $('#n2'), f1 = $('#f1'), f2 = $('#f2');
  const fmt = v => Math.round(v).toLocaleString('en-IN');
  const render = () => { n1.textContent=fmt(pv.a); n2.textContent=fmt(pv.b); f1.style.width=(pv.a/60000*100)+'%'; f2.style.width=(pv.b/60000*100)+'%' };
  render();
  gsap.set($$('.fig'), {autoAlpha:0, y:24});
  gsap.set($('#paper2'), {yPercent:-104, rotation:.8});
  const tl2 = gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:st('#s2','+=420%') });
  tl2.to({}, {duration:.6})
    .to($('#paper2'), {yPercent:0, rotation:0, duration:1.1, ease:'power2.out'})
    .to($('#c2a'), show)
    .to($$('.fig'), {autoAlpha:1, y:0, duration:.5, stagger:.2}, '<.3')
    .to({}, {duration:.8})
    .to($('#c2b'), show)
    .to(pv, {b:40000, duration:.8, onUpdate:render})
    .to(pv, {a:60000, duration:1, onUpdate:render})
    .to({}, {duration:.9});

  /* 03 — 1979 */
  gsap.set($$('.fac i'), {scaleY:0});
  const tl3 = gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:st('#s3','+=280%') });
  tl3.to($$('.fac i'), {scaleY:1, duration:1.2, stagger:.1, ease:'power1.out'})
    .to($('#c3a'), show, '<.5')
    .to({}, {duration:.7})
    .to($('#c3a'), hide)
    .to($('#c3b'), show)
    .to($('#y1979'), {opacity:1, duration:.6}, '<')
    .to($('.fac'), {opacity:.45, duration:.6}, '<')
    .to({}, {duration:.9});

  /* 04 — after */
  const fr1 = $('#fr1'), fr2 = $('#fr2');
  gsap.set([fr1, fr2], {yPercent:-190, rotation:-6});
  const prints = [$('#p1'), $('#p2'), $('#p3')], ROT = [-3,3.5,-1.5], XO = [0,24,-12], YO = [0,18,40];
  gsap.set(prints, {yPercent:-260, autoAlpha:0, rotation:i=>ROT[i]*4});
  const drop = i => gsap.to(prints[i], {yPercent:0, y:YO[i], x:XO[i], rotation:ROT[i], autoAlpha:1, duration:.8, ease:'power3.out'});
  const tl4 = gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:st('#s4','+=480%') });
  tl4.to($('#c4a'), show)
    .to(fr1, {yPercent:0, rotation:-1.5, duration:.9, ease:'back.out(1.3)'}, '<.3')
    .to(fr2, {yPercent:0, rotation:1.2, duration:.9, ease:'back.out(1.3)'}, '<.25')
    .to({}, {duration:.7})
    .to($('#c4a'), hide).add(drop(0), '<').to($('#c4b'), show, '<.3')
    .to({}, {duration:.8})
    .to($('#c4b'), hide).add(drop(1), '<').to($('#c4c'), show, '<.3')
    .to({}, {duration:.8})
    .to($('#c4c'), hide).add(drop(2), '<').to($('#c4d'), show, '<.3')
    .to({}, {duration:1});

  /* progress line — across this module only, visible only while inside it */
  const prog = section.querySelector('.TK4R15-prog'), bar = prog.querySelector('i');
  ScrollTrigger.create({
    trigger: section.querySelector('.TK4R15-scenes'), start:'top top', end:'bottom bottom',
    onUpdate: s => gsap.set(bar, {scaleX:s.progress}),
    onToggle: s => prog.classList.toggle('is-on', s.isActive)
  });

  // This module pins but loads after modules further down the page:
  // re-sort every trigger into page order so their start positions include these pin spacers.
  ScrollTrigger.sort && ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
});
