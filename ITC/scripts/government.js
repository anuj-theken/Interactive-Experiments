// scripts/government.js — QW4K9
//
// The ring rotation and the text relay used to be plain CSS @keyframes. Hovering
// swapped animation-duration to speed them up, but CSS remaps elapsed time
// against the new duration when you do that, which jumps the current angle/phase
// instead of continuing smoothly. Driving both off a single rAF clock instead
// means hover only changes how fast the clock ticks — position never jumps.

document.addEventListener("DOMContentLoaded", function () {
  var svgWrapper = document.querySelector('.QW4K9-svg-wrapper');
  var rotateEls = document.querySelectorAll('.QW4K9-rotate-clockwise');
  var textEls = document.querySelectorAll('.QW4K9-animated-text');
  if (!svgWrapper || !rotateEls.length) return;

  var SLOW_ROTATE_PERIOD = 70; // seconds per 360deg turn — matches the old CSS
  var FAST_MULTIPLIER = 70 / 12; // matches the old hover-fast duration intent
  var TEXT_PERIOD = 20; // seconds — matches the old CSS keyframe cycle
  var TEXT_DELAYS = { 1: 0, 2: 4, 3: 8, 4: 12, 5: 16 }; // matches the old animation-delay steps

  var angle = 0;
  var textClock = 0;
  var hovering = false;
  var lastTime = null;

  function stepFor(el) {
    for (var i = 1; i <= 5; i++) {
      if (el.classList.contains('QW4K9-text-step-' + i)) return i;
    }
    return 1;
  }

  // mirrors the old keyframes: hold at 1, fade out over 15%-20%, hold at 0, fade in over 95%-100%
  function phaseOpacity(phase) {
    if (phase <= 0.15) return 1;
    if (phase < 0.20) return 1 - (phase - 0.15) / 0.05;
    if (phase <= 0.95) return 0;
    return (phase - 0.95) / 0.05;
  }

  function tick(now) {
    if (lastTime === null) lastTime = now;
    var dt = (now - lastTime) / 1000;
    lastTime = now;

    var speedMult = hovering ? FAST_MULTIPLIER : 1;

    angle = (angle + dt * speedMult * (360 / SLOW_ROTATE_PERIOD)) % 360;
    rotateEls.forEach(function (el) {
      el.style.transform = 'rotate(' + angle + 'deg)';
    });

    textClock += dt * speedMult;
    textEls.forEach(function (el) {
      var delay = TEXT_DELAYS[stepFor(el)];
      var local = ((textClock - delay) % TEXT_PERIOD + TEXT_PERIOD) % TEXT_PERIOD;
      el.style.opacity = phaseOpacity(local / TEXT_PERIOD);
    });

    requestAnimationFrame(tick);
  }

  svgWrapper.addEventListener('mouseenter', function () { hovering = true; });
  svgWrapper.addEventListener('mouseleave', function () { hovering = false; });

  requestAnimationFrame(tick);
});
