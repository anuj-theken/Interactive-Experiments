# Writes the EXAMPLE part files in parts/. These are placeholders to show the format;
# the illustrator's real parts replace them file for file (same names, same canvas).
import math, os
INK = '#111111'
def svg(inner): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">\n{inner}\n</svg>\n'
L = f'stroke="{INK}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"'
T = f'stroke="{INK}" stroke-width="5" stroke-linecap="round" fill="none"'   # thin age lines
P = {}

# ---- neck + head (skin) ----
P['neck--default'] = f'<path id="fill-skin" d="M452 500 V672 Q500 700 548 672 V500 Z" fill="#FFFFFF" {L}/>'
P['head--default'] = (f'<ellipse id="fill-skin" cx="372" cy="420" rx="24" ry="40" fill="#FFFFFF" {L}/>'
                      f'<ellipse id="fill-skin_2" cx="628" cy="420" rx="24" ry="40" fill="#FFFFFF" {L}/>'
                      f'<ellipse id="fill-skin_3" cx="500" cy="400" rx="130" ry="158" fill="#FFFFFF" {L}/>')
# ---- faces ----
eyes = f'<circle cx="458" cy="398" r="10" fill="{INK}"/><circle cx="542" cy="398" r="10" fill="{INK}"/>'
brows = f'<path d="M436 356 L478 350 M522 350 L564 356" {L} fill="none"/>'
nose = f'<path d="M503 412 Q488 452 510 460" {T}/>'
P['face--smile'] = brows + eyes + nose + f'<path d="M458 492 Q500 528 542 492" {L} fill="none"/>'
P['face--neutral'] = brows + eyes + nose + f'<path d="M468 500 L532 500" {L} fill="none"/>'
P['face--joy'] = brows + f'<path d="M444 402 Q458 384 472 402 M528 402 Q542 384 556 402" {L} fill="none"/>' + nose + f'<path d="M455 488 Q500 548 545 488 Z" fill="{INK}"/>'
# ---- age lines ----
P['lines--1'] = f'<path d="M448 296 Q500 284 552 296 M452 452 Q440 486 460 508 M548 452 Q560 486 540 508" {T}/>'
P['lines--2'] = P['lines--1'] + f'<path d="M454 318 Q500 308 546 318 M408 388 L392 382 M408 402 L392 406 M592 388 L608 382 M592 402 L608 406 M470 540 Q500 552 530 540" {T}/>'
# ---- hair, front ----
cap = 'M372 410 C356 268 432 222 500 222 C572 222 646 268 628 410 C612 330 568 298 500 302 C436 298 390 330 372 410 Z'
P['hair-front--short'] = f'<path id="fill-hair" d="{cap}" fill="#111111" {L}/>'
circles = ''
for i in range(11):
    a = math.radians(196 + i * 14.8); x = 500 + 158 * math.cos(a); y = 395 + 170 * math.sin(a)
    circles += f'<circle id="fill-hair_{i}" cx="{x:.0f}" cy="{y:.0f}" r="40" fill="#111111" {L}/>'
P['hair-front--curly'] = circles + f'<path id="fill-hair_c" d="{cap}" fill="#111111"/>' + f'<path d="M372 410 C390 330 436 298 500 302 C568 298 612 330 628 410" {L} fill="none"/>'
P['hair-front--bun'] = f'<circle id="fill-hair_b" cx="500" cy="196" r="62" fill="#111111" {L}/><path d="M452 236 Q500 252 548 236" stroke="#FFFFFF" stroke-width="12" fill="none"/>' + P['hair-front--short']
P['hair-front--fringe'] = f'<path id="fill-hair" d="M372 420 C358 270 440 224 520 226 C602 230 650 300 628 420 C604 336 548 296 470 332 C420 352 390 384 372 420 Z" fill="#111111" {L}/>'
P['hair-front--receding'] = (f'<path id="fill-hair" d="M374 414 C366 336 384 292 414 280 C402 328 398 370 400 420 Z" fill="#111111" {L}/>'
                             f'<path id="fill-hair_2" d="M626 414 C634 336 616 292 586 280 C598 328 602 370 600 420 Z" fill="#111111" {L}/>')
P['hair-front--bald'] = '<!-- intentionally empty: no hair in front -->'
# ---- hair, back (sits behind the neck and head) ----
P['hair-back--none'] = '<!-- intentionally empty -->'
P['hair-back--long'] = f'<path id="fill-hair" d="M360 420 C346 268 420 222 500 222 C580 222 654 268 640 420 L668 640 C600 694 400 694 332 640 Z" fill="#111111" {L}/>'
P['hair-back--shoulder'] = f'<path id="fill-hair" d="M362 420 C346 268 420 222 500 222 C580 222 654 268 638 420 C650 500 640 560 610 590 C560 610 440 610 390 590 C360 560 350 500 362 420 Z" fill="#111111" {L}/>'
# ---- facial hair ----
P['facial-hair--none'] = '<!-- intentionally empty -->'
P['facial-hair--beard'] = f'<path id="fill-hair" d="M372 430 C370 566 432 618 500 620 C568 618 630 566 628 430 C612 470 590 498 562 504 C540 478 460 478 438 504 C410 498 388 470 372 430 Z" fill="#111111" {L}/>'
P['facial-hair--moustache'] = f'<path id="fill-hair" d="M450 482 C466 458 494 460 500 474 C506 460 534 458 550 482 C534 498 512 494 500 486 C488 494 466 498 450 482 Z" fill="#111111" {L}/>'
dots = ''.join(f'<circle cx="{500 + 112 * math.cos(math.radians(a)):.0f}" cy="{430 + 120 * math.sin(math.radians(a)):.0f}" r="3.5" fill="{INK}"/>' for a in range(15, 170, 9))
P['facial-hair--stubble'] = dots
# ---- glasses ----
P['glasses--none'] = '<!-- intentionally empty -->'
P['glasses--round'] = f'<g fill="none" stroke="{INK}" stroke-width="7"><circle cx="456" cy="398" r="36"/><circle cx="544" cy="398" r="36"/><path d="M492 394 Q500 386 508 394 M420 392 L376 384 M580 392 L624 384"/></g>'
P['glasses--square'] = f'<g fill="none" stroke="{INK}" stroke-width="7" stroke-linejoin="round"><rect x="414" y="370" width="80" height="58" rx="10"/><rect x="506" y="370" width="80" height="58" rx="10"/><path d="M494 392 Q500 386 506 392 M414 388 L376 382 M586 388 L624 382"/></g>'
# ---- tops ----
body = 'M150 1000 L172 824 C190 742 262 704 404 668 Q500 724 596 668 C738 704 810 742 828 824 L850 1000 Z'
arms = f'<path d="M214 842 L232 1000 M786 842 L768 1000" {L} fill="none"/>'
P['top--tee'] = f'<path id="fill-top" d="{body}" fill="#FFFFFF" {L}/>' + arms
P['top--shirt'] = (P['top--tee'] + f'<path d="M500 704 V1000" {L} fill="none"/>'
    + ''.join(f'<circle cx="518" cy="{y}" r="7" fill="{INK}"/>' for y in (790, 870, 950))
    + f'<path id="fill-top_c" d="M404 668 L452 770 L500 704 Z M596 668 L548 770 L500 704 Z" fill="#FFFFFF" {L}/>')
P['top--hoodie'] = (P['top--tee'] + f'<path id="fill-top_h" d="M374 690 C380 610 440 596 452 640 Q500 700 548 640 C560 596 620 610 626 690 C600 760 400 760 374 690 Z" fill="#FFFFFF" {L}/>'
    + f'<path d="M474 740 V830 M526 740 V830 M372 900 H628 L650 1000 M372 900 L350 1000" {L} fill="none"/>')
dashes = ''.join(f'<path d="M{x} {y} l{dx} {dy}" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>' for x, y, dx, dy in
    [(260, 820, 14, 10), (330, 900, -12, 14), (420, 960, 16, -6), (580, 850, 10, 14), (650, 930, -14, 8), (720, 820, 12, 12), (300, 740, 10, -12), (690, 760, -10, -12), (460, 820, 14, 4), (560, 960, -6, -16), (240, 960, 12, -10), (760, 960, -10, -12)])
P['top--sweater'] = (f'<path d="{body}" fill="{INK}" {L}/>' + dashes
    + f'<path d="M404 668 L452 740 L500 700 L548 740 L596 668 Q500 724 404 668 Z" fill="#FFFFFF" {L}/>')
P['top--jacket'] = (P['top--tee']
    + f'<path d="M150 1000 L172 824 C190 742 262 704 404 668 C420 760 436 880 444 1000 Z M850 1000 L828 824 C810 742 738 704 596 668 C580 760 564 880 556 1000 Z" fill="{INK}" {L}/>'
    + f'<path d="M404 668 C440 700 446 760 430 800 M596 668 C560 700 554 760 570 800" stroke="#FFFFFF" stroke-width="7" fill="none"/>')

for name, inner in P.items():
    open(f'parts/{name}.svg', 'w').write(svg(inner))
print(len(P), 'parts')
