// scripts/TK4R2-wheel.js — TK4R2 · Wheel timeline, 1946–1961
// After imgs/reference/tire stuff.png: cards ride a dark disc's rim, the tire turns to the right
// of the copy (never under it) and a small ring rides the tire's rim with progress.

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R2-chart-section");
  const stage   = document.getElementById("TK4R2-stage");
  if (!section || !stage) return;

  // Image paths differ between index files — the section carries its own base.
  const IMG_BASE = section.dataset.imgBase || "";

  /* ---------------- 1. Data ----------------
     img: alt text (or placeholder label when there is no src) · src: photo path(s) under imgs/
     cap: photo caption and credit, shown under the body copy
     null img = text-only beat · "map" = the inline Padi map */
  const STORY = [
    { kicker: "1946", title: "Southern Roadways", img: "Southern Roadways", src: "imgs/TK4R2/TK4R2-01-southern-roadways.jpg", cap: "Photo: Indian &amp; Foreign Metro Card, sourced via Facebook",
      body: "Southern Roadways is founded in 1946 to offer passenger bus and cargo services." },
    { kicker: "Late 1940s", title: "Madras Motor Insurance", img: "Madras Motor Insurance", src: "imgs/TK4R2/TK4R2-02-madras-motors.jpg", cap: "Photo: Madras Local History Group, sourced via Facebook",
      body: "Madras Motor Insurance is set up in the late 1940s." },
    { kicker: "1954", title: "Sundaram Finance", img: "Madras in the 1950s", src: "imgs/TK4R2/TK4R2-03-sundaram-finance.jpg", cap: "Photo: Aditya Kumar Naskar, sourced via Facebook",
      body: "Sundaram Finance is established in 1954 to help transport operators purchase vehicles. It eventually becomes one of the larger NBFCs of India, with more than Rs 62,000 crore under assets under management as of 30 June 2026." },
    { kicker: "1954", title: "General Motors", img: "New York Times report on General Motors and Ford closing their Indian plants", src: "imgs/TK4R2/TK4R2-04-gm.jpg", cap: "“General Motors and Ford to Close Plants in India Under Curb on the Auto Industry,” The New York Times, 6 March 1954.", pos: "center top",
      body: "At the same time, in 1954, General Motors exits India, believing the country does not have a proper industrial base. TVS’s business around being a GM dealership comes to an end after 25 years." },
    { kicker: "1955", statement: "Sundaram dies in 1955.", img: null },
    { title: "Srinivasan", img: "Jawaharlal Nehru at a microscope; officials inspecting railway wheels", src: ["imgs/TK4R2/TK4R2-06a-nehru.jpg", "imgs/TK4R2/TK4R2-06b-rail.jpg"], cap: "India was developing its industrial strength in the 1950s. Photos: Unknown author, sourced via Wikimedia Commons",
      body: "Sundaram’s youngest son, Srinivasan, urges his older brothers to get into manufacturing." },
    { statement: "The TVS group sets up four British-partnered ventures.", light: true, img: null },
    { kicker: "1961", title: "Wheels India", img: "Wheels India", src: "imgs/TK4R2/TK4R2-08-wheels-india.jpg", cap: "Photo: Wheels India",
      body: "Wheels India is formed with Dunlop in 1961 to make wheels for cars and trucks." },
    { title: "Lucas TVS", img: "Lucas-TVS Genuine Spares sign", src: "imgs/TK4R2/TK4R2-09-lucas-tvs.jpg", cap: "Photo: heritagetransportmuseumindia, sourced via Instagram", pos: "center top",
      body: "Lucas TVS is established with Lucas to make electrical equipment for automobiles." },
    { title: "Brakes India", img: "Brakes India logo", src: "imgs/TK4R2/TK4R2-10-brakes-india.jpg", cap: "Photo: Auto Components India", fit: "contain",
      body: "Brakes India is formed with Lucas Girling to make hydraulic brake systems." },
    { title: "Sundaram Clayton", img: "Clayton Dewandre advertisement", src: "imgs/TK4R2/TK4R2-11-clayton.jpg", cap: "Photo: Graces Guide", fit: "contain",
      body: "Sundaram Clayton is a joint venture with Clayton Dewandre to make brake systems for commercial vehicles. This company later gives the TVS group its first two-wheeler." },
    { kicker: "Padi, Madras", title: "265 acres", img: "map", cap: "Map data: &copy; OpenStreetMap contributors",
      body: "To accommodate these operations, Srinivasan locates 265 acres in Padi, on the outskirts of Madras." }
  ];

  // Padi locator map — geometry generated from OpenStreetMap (Overpass extract, Nov 2026): coastline, Cooum/Adyar,
  // canals, lakes, running rail lines and trunk/primary roads, minus post-1961 roads (ORR, bypasses, Inner Ring Road)
  // and MRTS/metro. The red footprint is OSM's "Lucas TVS" industrial area at Padi (Lucas TVS, Brakes India,
  // Wheels India, Sundaram Clayton). Token colours only — styles in TK4R2-wheel.css (.TK4R2-m-*).
  const MAP_SVG = `<svg viewBox="0 0 320 225" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of Madras: the TVS campus at Padi, about 10 km west of Fort St George"><rect width="320" height="225" class="TK4R2-m-land"/><path class="TK4R2-m-road" d="M-30.1 252.1 -22.7 247.2 -22.1 242.6 -11.3 245 -8.6 244.7 -5.4 242 -1.2 241.9 M41.1 209.6 35.7 217.4 22 231.3 12.7 236 M-1.2 241.9 8.3 239.6 M96.6 230 95.4 227.9 M111.9 243.5 108.1 237.4 101.5 233.4 M101.5 233.4 97.4 231.1 M112.6 246.9 111.9 243.5 M122.6 249.1 122.1 249 M122.1 249 112.7 249.1 112.6 246.9 M124.8 247.8 123.5 247.4 124 248.7 128.3 248.5 M112.8 246.9 116.5 246.9 M124.8 247.8 125.1 240.8 M155 241.4 154.4 241.2 M164.7 244 164.4 245.4 161.3 244 M161.3 244 157.2 242.2 M166 246 176.6 248.1 M159.3 229.7 160.6 233.1 M163.1 239.7 166 246 M161.7 236.1 162.4 238.1 M181.4 249.1 184.8 249.7 M183.7 249.6 187.8 250.2 M187.8 250.2 189.3 250.3 M179.6 248.9 176.8 248.3 M193.5 250.2 196.7 250.3 197 253.9 M197 253.9 197.4 256.2 M197.7 250.1 198.1 250.1 M194.9 250.3 190.7 250.3 M214.1 250.3 209.7 250.4 M209.7 250.4 198 250.2 M216 247.6 216.2 241.8 M216.5 248 216.3 249.1 M216.6 236.6 216.4 241.8 M222.6 229.4 229.9 229.4 M220.5 229.7 217.4 233.8 M-30.1 181.5 -26.7 183 M-27.7 210.5 -27.4 205.3 -21.5 190.9 -20.4 185.5 M-27.5 210.7 -27.6 214.5 -30.1 218 M-25.6 151.5 -25.4 140.8 -30.5 124.4 M39.5 155.5 39.9 150.7 39 147 42.7 133.9 48.1 126.6 49.1 122.6 52.3 120.1 54.3 116.7 54.5 108.7 50.1 100.6 40.5 99.7 36.7 86.3 40 79.3 M-18 184.7 13 197.3 24 199.1 M42.4 200.8 30.5 200.4 13.1 197.7 M-20.4 185.5 -26.8 183.2 M-6.7 168.7 -7.6 172.8 -13.8 182.1 -20.4 185.5 M41.1 209.6 46 202.8 M59.9 207.7 56 205.5 M56.1 205.4 69.9 213.2 M34.1 206.9 34.9 199.8 M35.9 186.8 35.8 188.8 M52.7 203.4 55.9 205.3 M50.3 203.2 52.7 203.4 M-23.1 166.9 -26.7 183 M54.6 152.7 54.7 158.6 M81.4 220 67.3 212 M76.7 217.1 89.1 224.1 M95.4 227.9 89.2 224.6 M130.4 218.1 132.9 213 M134.6 206.7 135.1 203.7 M138 207.5 134.8 206.9 M138.4 205.4 138 207.3 M140.9 176.5 142.9 175.8 M138.9 179.8 139 180.9 M138.7 180.9 138.6 173.6 M142.9 176 147.9 174.3 M120.1 137.2 130.8 145.6 M68.5 111.3 55.1 110.6 M45.5 43.9 42.9 45.7 40.4 49.9 34 54.4 M81.3 112.3 68.5 111.3 M105.6 113.5 81.3 112.3 M118.6 135.6 118.8 136 M117 128.9 117.3 130.7 M116.3 121.7 116.4 118.2 M116.6 114 116.2 114 M116.5 109.1 116.5 111.3 M116.2 114 105.8 113.5 M59.8 65.5 59.8 66.6 M59.2 68.6 59.4 66.6 M60.4 61.6 59.8 65.5 M109.8 89.4 110.4 91.9 M108.7 89 103.5 89.8 M112.5 94.3 109.9 92 M113.9 87.6 116 86.9 M116.4 86.9 120.2 86.3 M109 88.4 109.7 83.8 M109.9 88.7 113.9 87.6 M129.6 89.1 123.9 86.1 116.3 87.1 M120.2 86.3 124.1 86 141.7 94.5 M222.7 227.2 222.6 229.4 M230 229.4 237.9 222.9 M221.6 185.4 223.6 185.9 M221.7 185.6 213.5 184.1 M231.5 185.9 235 186.6 M229.1 185.9 231.5 185.9 M228.9 186.1 225.6 186 M165.4 170 174.9 170.3 M152.1 172.8 158.5 171 M146.3 174.6 152.1 172.8 M163.4 170.2 165 170 M160.2 170.6 162.5 170.3 M190.2 172.1 187.7 172.4 M186.2 172.7 176 170.6 M186.7 138.9 188.6 143.7 M201.6 175.9 201.4 175.7 M203.7 173.7 209.3 182.3 211.9 183.3 M197.7 160.3 199.7 166.6 M201.5 170.6 194 172.2 M199.7 166.6 201 169.2 M196.4 157.8 196.3 157.9 M190.5 154 191.9 154.5 M195.5 156.9 192.4 154.7 M197.4 155.2 196.6 157.6 M197.5 146.5 197.4 155.2 M190.5 153.5 190.6 150.2 M189.4 146.6 190.5 149.2 M192.7 149.3 194.6 148.8 195.8 146.5 197.5 146.5 M240.3 221.2 237.9 223 M246.4 204.9 246.7 208.3 244.8 213 M240.6 220.8 242.6 217.7 M257.9 146.2 250.4 188 M246.4 204.9 247 201.7 M247 201.7 247.7 198.9 M247.9 198.2 250.1 188.3 M242.5 188 244.3 188.1 M241.2 188.1 235.1 186.8 M250.1 188.2 244.8 188.2 M258.2 143.9 259.5 136.7 M185.6 136.4 185.7 131.2 M209 116.9 208.6 122.1 M200.6 123.3 201.9 116.2 M194.2 126.9 200.4 123.8 M192.2 127.2 194.2 126.9 M209 127.7 209.3 123.5 M202 116.1 209 116.9 M203.6 95.7 202 116.1 M190.2 80.8 188.4 81.5 188.1 80.1 M189.1 55.4 188.1 52.8 M206.6 84.4 203.1 94.6 M191.5 75.7 190.5 74 191.7 65.5 188.9 64.3 189.1 55.4 M231.6 95.4 231.6 95.4 M235.2 87.2 235.2 89.8 231.7 95.3 M231.6 78.7 224.2 70 M223.6 68.3 227.1 68.3 M220.2 68.1 221.1 62.8 M253.7 122.2 252.6 122.2 M247.2 122.5 253.5 122 M252.2 125.5 253.8 127.3 M242.1 123.2 242.6 123.2 M243.8 114.8 244.9 122.8 M236.1 124.3 242.1 123.2 M244.4 122.9 242.8 108 242.7 92.6 240 85.7 M258 117.1 253.7 122.2 M265.8 121.3 260.7 136.7 M259.5 136.7 254.1 127.8 M265.9 117.9 265.8 121.3 M258.3 116.7 263.7 117.2 M267 113.7 266.1 116.2 M268 111.1 267.6 112.3 M271.3 100.4 274.3 90.4 272.6 88.9 M267.8 111.1 269.7 105.4 M269.7 105.4 271.3 100.6 M239.4 85.6 238.6 85.8 M244.2 85.5 244 85.6 M242.1 85.1 246.2 83.7 M246.6 83.6 254 82.9 M267.9 87.4 267.9 87.3 M275.1 87.5 274.6 88.7 M273 89.1 262.1 84.9 M269.1 88 268.7 84.5 M274.7 82.8 276 84.2 M269.1 81.7 271.3 67.4 M254.1 82.9 257.4 83.6 M261.1 84.4 257.4 83.6 M269 82.2 272.1 81.8 274.7 82.8 M271.3 67.4 274 52.9 M274 52.9 275 48.7 M57.4 38.5 68 37.7 M45.5 43.7 49.4 40.9 57.4 38.5 M75.3 36.4 74.1 37.6 69.1 37.9 M81 29.5 79.1 31.8 M154 -26.8 150.7 -30.1 M72.2 37.6 74.5 37.1 79 31.8 M103.4 7.2 101.1 9.3 98.9 18 86.6 23.5 81.6 29 M109.1 2.6 109.7 1.7 M103.9 6.9 109.1 2.6 M109.7 1.7 110.7 -0.4 113 -1.4 114.1 -7.3 122.5 -6.7 M187.2 46.6 187.1 44.2 M187.2 46.5 188.2 52 M187.6 42 187.4 42.9 M184.9 41.3 189.8 44.9 M181.6 30 181.7 30.2 M184.4 35.9 181.6 30.4 M181.7 30.2 186.3 40.4 M149.2 23.2 149.3 23.1 M161.6 -6.5 165.5 4.7 171.7 14.6 M151.6 17.8 149.4 23.2 M155 9.5 152.1 16.7 M180.8 26.3 181.4 28.3 M171.7 14.6 174.3 17.9 179.5 20.7 180.8 26.3 M160.3 -11.4 158.6 -18.2 154.6 -25.9 M160.3 -11.4 161.1 -7.7 M232.9 -12.5 233.6 -16.3 238.2 -21.6 236.4 -30.1 M236.5 -30.1 238.3 -21.7 233.6 -16 233.1 -11.8 240.8 -5.3 242.6 0.6 M288.7 -13.2 292.6 -30.5 M292.8 -30.4 286.7 -6 M275 48.7 275.7 46.1 M275.7 46.1 276.9 41.7 M283.2 19.1 277 41.6 M282.4 7.4 278.3 17.9 M255.5 0.8 249.4 1.1 M242.6 0.6 255.5 0.7 M258.8 0.4 255.5 0.8 M260.4 0.9 258.8 0.4 M262.2 1.6 261.1 1.2 M265.1 3 264.9 3.1 M282.2 7.4 284.5 0.7 M284.5 0.7 287.3 -8.4"/><path class="TK4R2-m-art" d="M128.5 248.7 121.1 253.1 M134.3 247.9 130.4 248.5 M143.1 244.5 134.8 247.7 M145.7 243.8 144.7 244.2 M153.5 241 149.1 242.4 M149.1 242.4 146.5 243.4 M159.1 229.8 159.1 228.3 162.1 224.1 M153.5 240.6 157.1 238 M160.1 235.3 160.4 233.2 M-17.5 166.6 -21.9 165.4 -28.4 165.5 M-30 165.2 -28.4 165.3 M-30.3 53.9 -11.6 47.4 -0.7 38.7 16.4 41 22.2 48.3 31.7 54.2 M57.3 157.6 61.2 157.2 66 153.1 71.4 152.5 78.6 147.6 82.9 146.8 M0.7 163.7 13.9 158 32.3 156.4 36.7 156.4 38.7 157.3 M55.9 197.5 52.1 198.1 M50.4 198.6 52.1 197.9 M48.6 199.6 49 199.3 M54.5 197.6 67.5 195.5 78.7 190.8 M48.2 200 46.3 202.6 M-14 167.7 -17.1 166.7 M-16.7 166.5 -8 168.8 -4.7 168 0.7 163.7 M-23.5 162.3 -25.7 152.7 M53.6 157.7 52.5 157.6 M52.5 157.6 49.2 157.3 44.5 159.1 38.7 157.5 M89.2 188.8 86.3 190.1 75.5 191.9 68.1 195.5 64 196.4 M95.7 185.4 100.3 183 108.3 182.4 110.4 181.2 M95.7 185.6 89.9 188.3 M86 145.1 83 147 77.8 148.3 M113.2 133.8 109 136 104.2 136 99.9 138.9 92.8 141.3 M89.8 142.2 92.8 141 M121.9 181.2 112 181.2 M124.7 180.6 121.9 181.2 M138.4 177.1 136.7 177.3 M136.7 177.3 124.7 180.6 M34.8 69.6 36.4 70 39.1 73.1 40.2 74.9 40.1 77.2 M56.1 89.6 56.3 89.6 M56.1 89.8 52.5 89.7 49.6 86.9 M49.6 86.9 41 84 40 79.4 M68.1 92.4 56.8 89.9 M33.4 68.4 33 67 M32.8 66.5 33.1 64.5 35.6 61.9 M34 55.6 36 58.5 M120 132.2 114.6 133.4 M121 132.3 120 132.2 M121.3 132.2 130.3 130.9 138.2 130.9 M145.2 134.3 141.5 133.4 138.2 131.2 M75.2 94.5 69.6 92.6 M75.2 94.3 78.2 95.2 M78.2 95.2 84.8 95.7 101 90.7 M103.2 89.9 100.9 91 M145.5 92.2 142.8 91.1 M166.8 219.9 162 224.6 159.3 229.7 M177.1 214.1 181 210.6 190.3 205.3 194.6 201.2 M184.5 209 173.3 216.7 M167.3 219.1 170.5 217.3 M198.4 184.6 196.4 194.7 M194.8 200.4 196 195.3 M201.1 177.1 199.6 180.8 M205.3 171 213.9 163.7 M218.4 160.1 212.3 165.8 M219.4 159.1 220.2 158.4 M222.6 156.3 227.3 152.4 M227.3 152.4 229.9 150.3 M235.9 146.7 233.5 149 231.6 149.3 M237.2 145.5 241.3 140.2 M147.8 134.6 147.6 134.6 M155.7 135.9 154.8 135.9 M148.5 134.5 154.7 135.6 M155.7 135.7 166.7 135.8 174.7 133.1 M181.5 131.8 166.7 136 155.7 135.9 M185.9 130.8 185.8 130.8 M181.5 131.7 185.8 130.6 M185.9 130.5 191.3 129.6 M203.1 94.6 201.7 96 195.4 97.6 188.3 96.6 M209 127.7 210.6 127.6 M203.6 128.1 192.5 129.7 M208.3 128 204.4 128.1 M235.3 124.7 226.5 124.9 M212.7 127.4 226.3 124.7 M164.7 92.1 158.7 92.9 156.2 94.4 145.5 92.2 M169.1 93 164.7 92.1 M173.8 94.4 174.4 94.4 M173.5 94.4 169.6 93.1 M188.2 96.5 181.5 95.7 M191.4 77.7 188.1 77.8 M181.5 95.7 175.6 94.7 M206.8 84 203.2 82 199 81.1 M193.4 79.9 190.5 80.2 M197.7 80.6 193.4 79.9 M199.6 53.2 207.4 56.2 211.8 59.7 220.1 61.6 221.3 62.8 M199 52.8 195.2 49.4 M223.8 69.3 223.6 68.3 M221.3 62.8 223.6 68.3 M243.3 138.2 244.5 137 M253.4 128.6 245 137 M232.7 79.7 235.8 83.2 M112.7 -36.6 122.1 -19.3 125 -6.9 M141.8 40.9 134 45.9 M135.6 44.4 141.4 41 144.4 34.5 M151.1 16.6 134.8 3.7 M129.2 -0.6 127.1 -2.7 M129.2 -0.7 132.1 1.5 M164.1 25.8 181.8 39 M183.2 40.2 182.2 39.5 M152.8 16.7 164.1 25.8 M191.3 46.1 195.3 49.3"/><path class="TK4R2-m-rail" d="M152.2 234.8 148.9 240.3 137.1 249.6 133.4 256.1 M159.5 216.4 157.2 224.6 153 233.1 M15.2 66.4 -31 61.7 M-31.5 61.5 28.1 67.3 46.7 68 59.2 67.3 M-32.6 61.6 33.1 67.8 65.1 67.5 81 68.3 162.9 78.3 187.9 79.6 M247.2 60.7 287.5 -30.2 M130.3 74.7 118.7 73.8 113 78.1 111.1 80.8 110.2 89.4 111.1 92.2 113.4 93.6 120.6 94.6 M160.5 213.5 164.8 197.4 M173 150 168 184 160.3 213.5 M185.7 137 176.8 140 174.5 142.6 173.7 145.6 M173.5 146.7 173.1 149.4 M224.9 128.3 216.2 128.8 212.9 130.2 201.7 132.1 185.9 136.6 M217.2 76.5 188.3 79.7 M218.1 130.2 211.7 131 M225.3 128.3 231.3 125.8 235.7 125 242.4 126.1 M227.8 74.4 227.4 74.5 M234.2 74.5 228.3 74.9 M234.9 83.1 227.6 76.6 224.9 76.1 217.5 76.5 M234.6 70.9 227.8 74.4 M243.4 121.4 241.8 110.4 M269.1 109.8 266.3 116.5 264.2 117.5 258.9 117.3 257 117.9 251.9 125.3 M239.5 104 241.5 120.1 M251.2 76.5 266.4 82 274.1 86.4 275.4 89.6 272.9 98.1 M252.5 48.8 245.4 65 245.2 68.8 246.4 72.3 250.8 76.1 272.5 84.2 275.7 87.8 271.8 106.1 269.2 114.6 M240.6 120.2 239.6 112.5 239.8 106 236.8 98.5 235.3 83.7 M242.9 126.3 249.4 126.3 251.7 125.5 M241 107 241.5 108.4 M271.1 103.1 269.1 109.5 M240.9 74.7 250.3 76.2 M238.2 80.5 244.3 66.6 M234.9 74.4 240.4 74.7 M237 84.4 237.2 83.3 M254.2 44.4 245.2 64.1 235.1 70.5"/><path class="TK4R2-m-canal" d="M197.9 251.2 197.9 255.3 M-30.7 230.3 -28.6 231.1 -26.8 231.1 M-11.2 233.5 -9.6 233.4 -8.6 232.2 -3.9 232.3 -3.7 231.3 -2.6 231.6 1.5 235.1 2.8 234.3 4.3 234.4 M-19.9 232.5 -18.3 232.8 -16.6 232 M-26.8 231.1 -26.7 231.1 M-26.7 231.1 -24.7 231.9 -22.6 231.7 -20.7 232 -20.1 232.5 M-20.1 232.5 -19.9 232.5 M-16.6 232 -16.4 232 M-16.4 232 -14.8 231.8 -11.4 233.5 M-11.4 233.5 -11.2 233.5 M5.9 234.4 9.1 233.6 9.7 234 13.4 232.8 14.8 233.2 16.6 232.1 17.2 230.6 19.5 231.7 21.2 231.1 21.7 231.3 M4.3 234.4 5.9 234.4 M254.7 147.8 254.5 148.8 252.8 150.8 251.8 153.8 251.1 159.2 251.4 170.5 247.5 178.1 244.4 187.4 244.2 189.6 243.4 191 242.8 191.2 238.6 190.2 236.4 190.6 234.1 193.4 233 197.9 231.9 200 230.3 200.9 227.7 203.6 225 205 220.8 208.9 218.3 214.5 218.6 215 217.6 217.7 211.8 221.4 206.9 223.3 205.6 224.4 203.2 228.2 198.8 230.6 198 240.3 197.9 251 M197.9 251 197.9 251.2 M267.7 -32.9 265.3 -14.5 246.5 26.3 242.4 40 234.5 72.3 234.6 75 238.2 81.6 240.7 92.6 240.9 102.1 241.6 104.2 240.6 107 241 114.4 242 120.7 M-30.4 -0.2 -28 1.2 -22.3 2.6 -13.9 5.8 -0.6 1.3 0.1 -0.3 5.7 -1 9.5 -0.1 13.7 2.2 40.3 11.2 M19.2 221.6 13.8 226.4 M94.6 163.2 95.1 162 101.3 161.6 103.5 157.2 106 158.3 107.7 156.5 108.5 156.7 110.7 158.5 112.4 158.8 114.6 158.5 115 157.9 114.9 156.5 115.4 156.3 117.3 157.9 123.3 156.6 126.8 156.9 128.5 157.9 131.5 158.4 135.1 159.7 135.9 159.7 137.4 158.1 138.3 157.8 M126.4 193.7 125.2 201.4 122.9 206.7 121.8 207.5 118.7 207.8 117.9 207.4 116.8 207.6 116.3 208.2 114.7 208.3 114.2 209.2 114.2 212.6 M139 218.8 137 219.8 M139.2 218.9 139 218.8 M140.8 212.9 139.2 218.9 M138.3 157.8 140.1 157 147.2 157.2 148.2 156.4 147.8 155.5 M11.7 73.8 4.4 72.7 3.2 76.7 -0.3 81.7 M32.4 77.6 36.8 76.7 38.6 77.2 M169.3 209.9 166.9 212 164.6 213.4 163.6 216 167.7 219.9 170.6 221.8 175 224.4 177.6 223.5 179.5 224.5 180 225.8 M158.8 215.9 160.1 216.5 160.4 217.2 165.3 217.4 M194.3 194.9 191.3 202.1 189.5 203.1 188.9 204.8 186.9 206.3 169.7 209.9 M194.2 174.4 195.7 174.9 196.6 176.8 196.5 178.2 195.7 179.6 196.5 185.1 195.9 188.6 M195.9 188.8 194.4 194.6 M195.9 188.6 195.9 188.8 M194.4 194.6 194.3 194.9 M161.3 170.3 162.3 163.8 161.8 162 162.4 156.1 163.6 148.7 164.2 148 M147.8 155.5 146.9 154.7 M146.9 154.7 147.2 152.2 146.4 150.6 146.8 150.3 148.6 150.3 148.6 149.5 147.1 148.7 147.5 147.1 148.8 146.2 152.2 146.4 153.1 144.4 156.5 147.1 157.4 146.9 161.6 148.1 164.7 148.1 165.7 146.1 M194.1 174.4 194.2 174.4 M190 172.8 194.1 174.4 M257.4 143.5 254.9 145.3 254.8 147.1 M254.8 147.1 254.7 147.8 M242.4 122.9 242.7 127.3 M242 120.7 242.4 122.9 M235.1 8.9 241.1 7.2 241.7 1.3 254.5 1.4 258.3 0.4"/><path class="TK4R2-m-river" d="M59.7 253.9 62.8 251.4 66 251.4 66.9 251.8 68.3 255.1 M83 257.2 86.3 251.6 89 242.5 89.5 233 90.5 231.6 96.8 228.6 99 226 104.2 218.6 109.3 214 113.6 212.6 118.9 212.7 132.9 216.4 136.9 219.6 137.8 221.6 137.8 224.5 138.6 227.3 139.7 229.1 142.9 231.1 150.8 233.6 157.2 234.5 163 230 165.8 229.6 170.8 235.2 174.7 235.2 176.6 234.2 180 225.8 184.1 218.4 185.4 217.3 187.7 216.7 190.2 217.1 196.2 222.3 198.3 225.2 202.9 234.9 206 236.2 211.2 237.3 218.8 237.9 224.9 235.8 229.6 235 231.5 235.4 237.3 238.2 246.5 240.2 M54.9 259.1 59.7 253.9 M-30.4 120.1 -28.4 123.6 -26.6 129.3 -26.1 132.2 -24.8 135.4 -24.9 137.2 -23.2 142.7 -23.9 148.5 -23 151.2 -22 151.9 -19.7 152 -11.7 150.9 -7.3 148.3 5.4 148.8 9.5 149.9 16.5 156.1 18.3 156.6 21.5 156.9 34.4 154.6 42.6 157.8 44.6 157.7 50.4 155.3 56.3 154.4 57.5 153.2 65.7 150.1 71.4 149.8 73.9 148.8 75.4 147.6 77.2 142.8 80.7 140.9 83.3 140.1 96.7 138.7 99.9 137.4 103.5 134.6 105.4 130.5 107.8 128.1 114.7 129 119.3 130.3 127.4 129.9 129.7 128.7 136.4 128.8 139 129.8 142.5 132 144.4 130.7 144.9 126.5 147.7 124.8 149 125 151.3 126.9 154.7 131.5 155.6 137.7 156.7 139.4 159.6 140.2 165.3 139.1 167.1 139.5 167.5 141.4 165.6 144.9 165.9 146.2 167.1 146.6 170.8 146 174.4 146.4 177.5 148.7 181.4 149.3 190.7 145.4 198 141.5 200.8 141.4 204.9 143.8 210 149.5 210.6 150.7 210.8 155 211.8 157.2 213.3 158.2 215.6 157.6 217.1 156.2 218.3 154.7 219.2 151.9 220.6 150 223.3 148.7 230.4 147.7 231.9 146.9 232.8 145.3 232.9 143.2 232.4 141.9 M232.4 141.9 227.8 136.3 227.2 133.8 228.8 128.4 230.8 126.6 233.3 126.2 235.4 126.8 239.4 129.2 240.5 131 242.2 138.3 245.1 141.2 248.9 143.9 252.6 145.1 258.7 145.4 269.3 148.4 M242.7 127.3 251.6 126.9 253.2 127.8 256.6 134.8 257.4 143.5 M257.4 143.5 257.9 144.9 258.7 145.4 M238.2 128.5 242.7 127.3 M101.5 37.7 101.7 36.5 103.4 35.2 107.1 34.8 108.2 34 109.4 29.4 111.2 27.8 113.9 21.7 114.1 19.3"/><path class="TK4R2-m-lake" d="M14.7 122.1 15.2 119.3 13.9 118.2 12.2 123 12.4 126.9 10.9 127.1 10.8 126.8 10.5 127.2 9.2 127.2 8.1 128.2 8.5 130.3 9.3 130.6 9.3 131.3 8 131.5 6.5 132.4 6.2 132.1 0.8 132.4 0.2 133.5 -0 136.1 3.7 136.6 3.7 141 4 142.2 5.2 142.7 5 145.1 6.1 145 7 143.4 9.8 143.5 12.6 142.8 13.7 141.4 14.9 133.8 14.9 130 14.2 129.1 14.7 122.1Z M30.9 200.6 41.2 200.4 40.9 201.5 42.4 205.5 42.2 207.4 40.1 208.8 37.3 212.1 35.8 216 34.6 216.4 33.7 217.4 31.2 214.3 31.2 213 33.4 209.8 34.7 206.6 31.7 206.2 30.9 204.2 30 204.3 29.9 203.5 30.9 200.6Z M21.1 185.3 28.3 186 28.6 186.7 29.4 186.8 29.2 184.9 28.5 184.7 21.3 184.3 21.1 185.3Z M29.7 193.6 28.5 193.5 28.9 187.5 29.6 187.5 29.9 189.1 29.6 189.4 29.7 193.6Z M58.1 171.1 61.8 171.8 61.5 175.4 60.1 175.7 60.5 174.1 58.2 172.4 58.1 171.1Z M73.7 198.8 76.7 198.7 76.6 197.9 75 196.1 73.9 196.2 73.7 198.8Z M11.7 73.8 11.1 78.5 19.3 83.1 19.2 87.4 25 88.2 23.9 95.8 29.8 96.1 31.5 95.2 34.8 90 36.2 85.4 34.3 84.6 33.8 83.9 32.6 81.3 32.3 76.9 30.6 76.4 28.2 73.2 27.8 73.3 26.6 71.4 25.9 67.9 25.1 67.4 18.8 66.8 17.3 74 16.3 74.7 11.7 73.8Z M16.3 41.7 17.4 43 16.9 50.3 15.1 55.3 13.9 57.3 14.3 55.1 14.6 55 14.2 51.8 14.7 48.1 16.3 41.7Z M19.2 66.2 24 66.7 23.4 65.2 22.2 65 21.9 63.9 20.4 63.2 19.9 64.1 18.9 64.3 18.8 64.7 19.6 64.9 18.9 65 19.4 65.4 19.2 66.2Z M102.8 36.8 104.4 40.1 104.8 42.6 104.7 49.6 103.4 51.1 100.8 50.8 97.6 52.5 95.4 57.2 95.6 58.7 94.2 60.2 94.6 63.5 86.3 65.5 85 66.3 85.2 67.9 77 66.9 76.5 65.1 76.9 64.4 79.3 63.6 79.7 61.9 82.4 62.2 82.4 55.2 78.4 54.7 74.4 55.6 71.8 55.3 71.2 53.1 73.5 50 74.1 49.7 75.4 50.1 77.4 44.8 81.5 42.6 84.1 42.9 86.1 45.7 93.4 47.2 96.8 45.7 100 43.6 101.5 42 102.2 40.5 101.3 37.5 102.8 36.8Z M143.9 87.5 144.9 83.4 151.5 85.3 150.4 89.4 143.9 87.5Z M227.9 224.2 228.2 225 227.7 226.2 228.1 226.5 228.3 226 229 227.7 227.8 227.8 227.4 228.6 226.2 228 226.3 227.4 225.8 228 225.7 227.3 225.4 227.7 224.8 227.4 224.7 226.6 226.2 226.2 227.6 223.4 228.3 223.5 227.9 224.2Z M236 220 234.3 219.6 231.4 220.2 230.7 219.7 227.7 222.8 228.5 223.3 231.5 220.6 234.1 220.7 238.8 222.5 239.2 221.3 237.5 220.4 238.2 221.1 237.5 221 237 220.7 237.1 220.3 236 220Z M100.8 -21.1 102.3 -19.8 107.5 -18.2 109.1 -16.7 104.8 -16.1 104.1 -7.7 108.5 -6.4 105.9 -0.2 98.3 8.1 90.8 11.9 85.1 8.8 81.3 8.9 79.3 14.3 80.9 18.3 81 20.3 82.5 24.7 82.4 25.7 80.7 26.9 77.7 26.4 69.9 20.3 68.4 20.3 66.5 21.5 65.3 23.2 62.9 31.3 61.3 33.2 59.1 33 58.5 29.9 55.8 24.5 42.8 21.6 40 22.7 36.5 24.9 35.4 28 27.9 27.2 25.5 18.3 19.9 16.5 20.4 14.9 15.2 12 15.1 11.1 13.1 10.4 12.7 9.6 11.1 8.8 11 8 7.8 6.9 6.9 5.9 8.2 2.4 11.3 3.2 11.8 1.6 15 1.6 23.4 3.1 24.4 3.8 25.5 3.7 25.6 3 28.3 2.9 32.8 1.4 41.7 -5.6 43.2 -5.2 46.5 -0.5 47.7 -0.5 48.8 -1 49.4 -2.1 50.7 -7.7 55.8 -15.2 57.7 -16.9 59.5 -17.3 64.9 -17.5 67.7 -16.6 69.4 -18.9 71.2 -19.9 71.8 -21 72.4 -24.5 71.6 -26.2 68.2 -28.4 65 -29.3 63.7 -31.5 64.5 -34.4 63.8 -36.7 61.9 -37.1 56.1 -39.6 52.3 -43.2 50.6 -44.1 51.7 -49.6 56.3 -52.7 59.3 -58.2 61.4 -58.7 63.2 -61 66 -60.9 67.5 -63.5 68.5 -63.1 69.4 -64.1 75 -65.3 75.3 -66.2 76.8 -67.1 77.2 -66.7 83.4 -68.8 83.9 -68.4 84 -65.5 83.1 -63.1 83.4 -62.3 88.4 -59.5 92.1 -53.8 95 -54.9 99.2 -53.6 101.5 -53.8 104.4 -50.3 105.4 -43.5 105 -37.6 102.9 -27.1 100.8 -21.1Z M137.3 6.3 143.8 11.6 142.9 26.7 140.8 39.9 139.5 39.1 138.9 36.5 139.2 35.6 138.5 33.4 138.5 27.1 136 26.4 136 26 134.5 25.2 134.6 24.6 134 24.1 134.6 23 134.1 23 133.9 21.5 133.3 21.5 133.3 20.2 132.9 20.1 132.8 17.7 132.4 17.6 132.6 16 130.1 15.9 130 14.7 129 13.1 132 14.3 132.2 11.1 134.9 11.2 137.3 6.3Z M82.7 36.5 84.1 33.8 86.9 34.1 86.6 35.7 87.1 35.8 87 36.3 82.7 36.5Z M91.9 16.8 92.5 15.6 94 15.7 92.5 19.4 91.7 18.6 91.9 16.8Z M104.3 22.3 103.5 23.1 100.8 24 100.4 23.6 101.7 20 102.5 19.9 103.1 19 103.5 19.4 103.3 20.1 104.7 20 104.3 22.3Z M138.4 46.8 138.3 45.8 140.9 44.3 140.1 42.6 141.2 41.8 141.8 43.5 141.4 44.9 141.8 46.7 138.4 46.8Z M137.5 5.4 137.7 3.1 138.2 3 138.9 1.1 139.4 -2 145.1 -2.2 146 -1.9 146.1 0.2 145.1 2.6 143.8 10.2 137.5 5.4Z M176.5 10 176.1 10 175.9 11 176.2 14 176.9 14.1 177.4 12 178.7 12 178.9 10.8 178.4 10.6 178.6 9.9 176.6 9.3 176.5 10Z M230.8 -5.8 232.1 -11.4 236.1 -9 235.5 -1.8 233 -1.6 232.4 4 229.5 2.8 230.8 -5.8Z M186 132.7 187.2 132.8 187.2 133.7 189.3 134.1 189.5 133.2 191.6 133.4 191.7 133.8 189.2 134.3 189 134.9 186.1 135.7 186 132.7Z M231.4 73 229.8 74.2 233.8 74 233.4 72.1 231.4 73Z"/><path class="TK4R2-m-sea" d="M227 314.3 236.3 273.2 238.4 267.2 241.5 255 245.9 243.7 247.3 237.2 248.3 226.2 252.6 197.8 256.5 179 258.2 172.7 262.8 159.6 264.7 155.3 267.8 150.4 269.1 149.6 269.6 146.8 267.4 145.1 270.4 138.8 274.2 129.6 280.8 117.7 284.7 112.7 287.1 110.4 288.9 109.6 289.4 104.2 290.3 100.6 295.1 89.2 294.8 89.1 293.1 90.4 290.6 90.9 289.2 94.7 289.6 94.8 289.5 95.5 284.2 107.3 283.8 107.5 281 106.8 280.1 108 280.8 108.5 274.9 116.6 274.3 116.1 274.5 115.9 273 115.2 279 107.2 279.7 107.7 280.4 106.5 276.7 105.4 275.5 109.3 274.2 110.6 272.7 113.1 271.5 112.7 271.7 111.7 273.7 110.3 273.2 110.1 273.4 109.5 272.9 109.4 272.9 108.5 273.2 107.7 273.7 107.7 274.3 105.9 274 105.3 278 92.4 280.8 93.3 281.1 92.5 282 92.8 281.6 94.4 282.2 94.6 282.8 93.1 286.5 94 281.4 92.4 279.7 90 279.7 89.1 280.2 88.5 285.5 71.2 285.4 70.7 284.8 70.6 285.2 69.3 286.7 68.2 286.2 66.6 286.9 63.8 284.1 56.1 284.4 53.9 291.6 42.1 292.2 39.3 292 38.9 291.5 39.1 291.3 41.9 290.5 42.5 290.7 42.8 284.7 52.5 283.4 53.6 281.5 53.4 280.2 52.8 281.8 51.2 280.3 52.3 278.4 50.6 279.1 49.6 281.2 50.3 279 49.5 279.3 48.8 280.9 49.1 279.3 48.7 279.6 47.9 280.8 48.2 279.5 47.8 280.6 44 283.6 44.8 280.6 43.9 280.9 43.1 283.8 43.7 280.9 42.9 281.1 42.2 283.3 42.7 279.6 41.7 280 38.8 282.3 39 279.7 38.6 280.1 36.2 280.6 36 284.3 37 282.1 36.3 282.7 34.9 285.6 35.9 288.3 40.4 288.6 40.1 289.3 41.1 286.6 35.8 281 34 281.1 28.1 282 24.9 283 23.1 283 21.5 284.8 17 285.4 16.5 286.2 16.7 286.3 13.8 287.4 12.3 288.9 8.6 289.8 8.4 290 5.8 291.1 4 291 2.9 292.4 0.6 293.3 0.4 294 -4.4 294.5 -5.3 295.1 -5.7 296.5 -10.2 298.3 -11.7 298.6 -14.2 299.6 -13.8 302 -19.7 302.5 -21.1 301.5 -21.9 301.8 -23.4 302.8 -25.3 306.8 -38.7 307.6 -39.6 307.9 -42 309.1 -44.5 310.4 -45.9 311 -48.9 311.7 -50 312.2 -52.7 311.7 -54.9 314.6 -64.5 314.6 -67.1 316.6 -70.5 318.3 -75.3 318.4 -76.9 319.6 -78.6 321.1 -82.1 320.2 -85.6 321.5 -88.9 350 -88.9 350 314.3Z"/><text class="TK4R2-m-water" x="151.8" y="17.7">Retteri</text><text class="TK4R2-m-water" x="88.1" y="43.1" text-anchor="middle">Korattur</text><text class="TK4R2-m-water" x="127" y="141" transform="rotate(-8 127 141)">Cooum</text><text class="TK4R2-m-water" x="176.5" y="232.7">Adyar</text><text class="TK4R2-m-sealabel" x="311" y="126" text-anchor="middle" transform="rotate(90 311 126)">BAY OF BENGAL</text><circle cx="59.4" cy="65.8" r="1.1" class="TK4R2-m-pt"/><text x="56.4" y="68.3" text-anchor="end" class="TK4R2-m-place">Ambattur</text><circle cx="133.6" cy="85.4" r="1.1" class="TK4R2-m-pt"/><text x="135.6" y="81.9" text-anchor="start" class="TK4R2-m-place">Villivakkam</text><circle cx="188" cy="70.7" r="1.1" class="TK4R2-m-pt"/><text x="188" y="66.7" text-anchor="middle" class="TK4R2-m-place">Perambur</text><circle cx="181.4" cy="120.6" r="1.1" class="TK4R2-m-pt"/><text x="181.4" y="129.6" text-anchor="middle" class="TK4R2-m-place">Kilpauk</text><circle cx="213.9" cy="138.2" r="1.1" class="TK4R2-m-pt"/><text x="210.9" y="140.7" text-anchor="end" class="TK4R2-m-place">Egmore</text><circle cx="234.2" cy="208" r="1.1" class="TK4R2-m-pt"/><text x="231.2" y="210.5" text-anchor="end" class="TK4R2-m-place">Mylapore</text><text class="TK4R2-m-road-lbl" x="4" y="41.4">← to Tiruvallur</text><text class="TK4R2-m-road-lbl" x="4" y="173.5">← to Bangalore</text><path class="TK4R2-m-fort" d="M259.5 135 260.1 135.5 260.7 135.4 262.1 133 263.3 128.1 263.8 127 263.9 125.7 265.3 121.7 265.5 119.9 264.2 119.9 264.1 119.2 263.4 119 263.6 118 259.4 117.7 257.6 118.1 257 118.7 254.7 122.3 252.2 125.4 253.8 127.1 254 127 256.2 131.5 259.5 135Z"/><circle cx="260.2" cy="125.5" r="3.2" class="TK4R2-m-city"/><text class="TK4R2-map-label TK4R2-m-city-lbl" x="258.2" y="107.5" text-anchor="end">Madras</text><text class="TK4R2-m-sub" x="258.2" y="116.5" text-anchor="end">Fort St George</text><path class="TK4R2-m-link" d="M116.2 86.5 L255.2 126.5"/><text class="TK4R2-m-dist" x="182.2" y="100" text-anchor="middle" transform="rotate(15.4 182.2 100)">11 km</text><circle cx="104.2" cy="82.5" r="17" class="TK4R2-m-halo"/><path class="TK4R2-m-camp" d="M113.3 73.6 113.1 75.4 112.5 76.4 104.6 76.6 104.7 79.2 111.2 78.8 109.6 82.3 109.1 87.7 108.8 88.1 108.1 88.5 103 89.4 101.4 90.1 101 90.5 100.9 89.4 100.2 88.4 99 88.5 98.2 89.4 98.2 90.2 99.5 90.2 99.8 91.4 97.2 92.3 96.8 84.4 97.3 79.4 98.8 79.4 98.3 70.9 106.7 71.7 106.6 72.5 107.5 72.7 108.3 73.6 113.3 73.6Z"/><text class="TK4R2-map-label TK4R2-map-label--key" x="104.2" y="61.5" text-anchor="middle">Padi</text><text class="TK4R2-m-sub" x="104.2" y="108.5" text-anchor="middle">TVS works</text><g class="TK4R2-m-scale" transform="translate(14 215)"><path d="M0 0H28.9M0 -2.5V0M28.9 -2.5V0"/><text x="14.4" y="-3.5" text-anchor="middle">2 km</text></g><g class="TK4R2-m-north" transform="translate(12 14)"><path d="M0 -7L3 3L0 1L-3 3Z"/><text y="12" text-anchor="middle">N</text></g></svg>`;

  /* ---------------- 2. Build DOM ---------------- */
  const N = STORY.length;
  const pad = n => String(n).padStart(2, "0");
  const orbitEl = document.getElementById("TK4R2-orbit");
  const copyEl  = document.getElementById("TK4R2-copy");
  const shots = [], entries = [];
  function add(tag, cls, html) {
    const el = document.createElement(tag);
    el.className = cls; el.innerHTML = html;
    copyEl.appendChild(el);
    return el;
  }
  STORY.forEach((s, i) => {
    if (s.img) {
      const f = document.createElement("figure");
      f.className = "TK4R2-shot";
      let inner;
      if (s.img === "map") inner = MAP_SVG;
      else if (s.src) {
        // src may be one path or an array (shown side by side); fit: "contain" for logos/ads, pos: object-position
        const srcs = [].concat(s.src);
        const style = s.pos ? ` style="object-position:${s.pos}"` : "";
        inner = srcs.map((u, k) => `<img src="${IMG_BASE}${u}" alt="${k ? "" : s.img}" decoding="async"${style}>`).join("");
      }
      else inner = `<span>${s.img}</span>`;
      const mods = (s.src && [].concat(s.src).length > 1 ? " TK4R2-ph--pair" : "") + (s.fit === "contain" ? " TK4R2-ph--contain" : "");
      f.innerHTML = `<div class="TK4R2-ph${mods}">${inner}</div>`;
      f._i = i;
      orbitEl.appendChild(f); shots.push(f);
    }
    const e = { statement: !!s.statement };
    if (s.kicker) e.yr = add("div", "TK4R2-yr", s.kicker);
    if (s.statement) {
      e.title = add("h2", "TK4R2-statement" + (s.light ? " TK4R2-statement--light" : ""), s.statement);
    } else {
      e.title = add("h2", "TK4R2-title", s.title);
      e.body  = add("p", "TK4R2-body", s.body);
      if (s.cap) e.cap = add("p", "TK4R2-cap", s.cap);
    }
    e.num = add("div", "TK4R2-num", `${pad(i + 1)}<small>/${pad(N)}</small>`);
    e.parts = [e.yr, e.title, e.num, e.body, e.cap].filter(Boolean);
    entries.push(e);
  });

  /* ---------------- 3. Geometry ---------------- */
  gsap.registerPlugin(ScrollTrigger);
  const disc = document.getElementById("TK4R2-disc");
  const tire = document.getElementById("TK4R2-tire");
  const ring = document.getElementById("TK4R2-ring");
  const hint = document.getElementById("TK4R2-hint");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MOVE = 0.75;           // seconds for one step
  const EASE = "sine.inOut";
  const RING_SWEEP = 35;       // the ring travels ±35° along the tire rim over the whole sequence
  const RING_WEAVE = 0.035;    // …and swings ±3.5% of the tire radius in/out (x on desktop) between steps — rubber is 0.74–0.855

  let geo = {};
  const disp = { p: 0 };
  let idx = 0;

  const hOf = el => el ? el.offsetHeight : 0;
  const lineOf = el => parseFloat(getComputedStyle(el).lineHeight) || el.offsetHeight;

  // Wide screens: hub off the right edge, cards ride the disc's left rim, copy in a column
  // between the card and the tire.
  function layoutWide(W, H) {
    let imgW = Math.min(Math.min(Math.max(H * 0.42, 220), 420) * 1.42, W * 0.36);
    const imgH = Math.round(imgW / 1.42); imgW = Math.round(imgW);
    const imgL = Math.round(W * 0.2), imgTop = Math.round(H * 0.52 - imgH / 2);
    const imgR = imgL + imgW, imgB = imgTop + imgH;
    const colL = imgR + 40, colW = Math.round(Math.min(Math.max(W * 0.2, 260), 380));
    const tireL = colL + colW + 40;                       // the tire never reaches the copy column
    const r = Math.round(H * 0.62);
    const cx = tireL + r, cy = imgTop + imgH / 2;
    const R = cx - (imgL + imgW / 2);
    geo = { mode: "side", cx, cy, R, r, D: R + imgW * 0.25, imgW, imgH, dir: -1,
            stepDeg: imgH * 1.35 / R * 180 / Math.PI };

    const titleL = Math.round(imgL + imgW * 0.5);
    entries.forEach(e => {
      if (e.statement) {
        e.title.style.width = (tireL - 24 - imgL) + "px";
        const top = cy - hOf(e.title) / 2;
        gsap.set(e.title, { left: imgL, top });
        if (e.yr) gsap.set(e.yr, { left: imgL, top: top - hOf(e.yr) - 12 });
      } else {
        e.title.style.width = (tireL - 24 - titleL) + "px";
        e.body.style.width = colW + "px";
        const top = imgTop - lineOf(e.title) * 0.7;      // first line sits above the card, the rest overlaps it
        gsap.set(e.title, { left: titleL, top });
        const bodyTop = Math.max(top + hOf(e.title) + 20, imgTop + imgH * 0.35);
        gsap.set(e.body, { left: colL, top: bodyTop });
        if (e.cap) { e.cap.style.width = colW + "px"; gsap.set(e.cap, { left: colL, top: bodyTop + hOf(e.body) + 14 }); }
        if (e.yr) gsap.set(e.yr, { left: titleL, top: top - hOf(e.yr) - 10 });
      }
      gsap.set(e.num, { left: imgR + 16 - e.num.offsetWidth, top: imgB - hOf(e.num) * 0.55 });
    });
  }

  // Tall screens: one centred column, the tire rises from the bottom below the copy.
  function layoutTall(W, H) {
    const m = 20, topPad = 96;
    let imgW = Math.min(W - m * 2, 560), imgH, imgTop, bodyTop, maxBody;
    const plain = entries.filter(e => !e.statement);
    for (;;) {
      imgH = Math.round(imgW * 0.7);
      entries.forEach(e => {
        e.title.style.width = (e.statement ? imgW : imgW - 16) + "px";
        if (e.body) e.body.style.width = imgW + "px";
        if (e.cap) e.cap.style.width = imgW + "px";
      });
      const yrH = Math.max(...entries.map(e => hOf(e.yr)));
      const lineH = lineOf(plain[0].title);
      const maxTitle = Math.max(...plain.map(e => hOf(e.title)));
      imgTop = topPad + yrH + 8 + Math.max(lineH * 0.7, maxTitle - lineH * 1.3);
      bodyTop = imgTop + imgH + hOf(entries[0].num) * 0.45 + 12;
      maxBody = Math.max(...plain.map(e => hOf(e.body) + (e.cap ? hOf(e.cap) + 10 : 0)));
      if (bodyTop + maxBody + H * 0.1 <= H || imgW <= 220) break;
      imgW -= 20;
    }
    const imgL = Math.round((W - imgW) / 2), imgR = imgL + imgW, imgB = imgTop + imgH;
    const icy = imgTop + imgH / 2;
    const r = Math.round(Math.min(W * 0.85, 560));
    const treadTop = Math.max(bodyTop + maxBody + 24, H - r * 0.6);   // the tire stays below the copy
    const cx = W / 2, cy = treadTop + r, R = cy - icy;
    geo = { mode: "top", cx, cy, R, r, D: R + imgH * 0.25, imgW, imgH, dir: 1,
            stepDeg: imgW * 1.15 / R * 180 / Math.PI };

    entries.forEach(e => {
      if (e.statement) {
        const top = icy - hOf(e.title) / 2;
        gsap.set(e.title, { left: imgL, top });
        if (e.yr) gsap.set(e.yr, { left: imgL, top: top - hOf(e.yr) - 10 });
      } else {
        const top = imgTop - lineOf(e.title) * 0.7;
        gsap.set(e.title, { left: imgL + 8, top });
        gsap.set(e.body, { left: imgL, top: bodyTop });
        if (e.cap) gsap.set(e.cap, { left: imgL, top: bodyTop + hOf(e.body) + 10 });
        if (e.yr) gsap.set(e.yr, { left: imgL + 8, top: top - hOf(e.yr) - 8 });
      }
      gsap.set(e.num, { left: imgR + 4 - e.num.offsetWidth, top: imgB - hOf(e.num) * 0.55 });
    });
  }

  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (W > 900 && W >= H * 0.9) layoutWide(W, H); else layoutTall(W, H);
    const { cx, cy, r, D, imgW, imgH } = geo;
    gsap.set(tire, { width: 2 * r, height: 2 * r, left: cx - r, top: cy - r });
    gsap.set(disc, { width: 2 * D, height: 2 * D, left: cx - D, top: cy - D });
    shots.forEach(s => gsap.set(s, { width: imgW, height: imgH }));
    render(disp.p);
  }

  /* ---------------- 4. Render ---------------- */
  function render(p) {
    const { cx, cy, R, r, stepDeg, imgW, imgH, dir, mode } = geo;
    // the wheel turns by exactly the angle the cards travel, so they read as attached
    tire.style.transform = `rotate(${p * stepDeg * -dir}deg)`;

    shots.forEach(s => {
      const k = s._i - p, d = Math.abs(k);
      const a = k * stepDeg * dir * Math.PI / 180;
      const px = mode === "side" ? cx - R * Math.cos(a) : cx + R * Math.sin(a);
      const py = mode === "side" ? cy - R * Math.sin(a) : cy - R * Math.cos(a);
      // active card full strength, neighbours dimmed on the disc, the rest gone
      const o = d < 1 ? 1 - d * 0.6 : Math.max(0, 0.4 - (d - 1) * 0.4);
      s.style.transform = `translate3d(${px - imgW / 2}px, ${py - imgH / 2}px, 0)`;
      s.style.opacity = o;
      s.style.zIndex = 100 - Math.round(d * 10);
      s.style.visibility = o <= 0.01 ? "hidden" : "visible";
    });

    // the small ring rides the tire's rim, sweeping with progress
    const t = N > 1 ? p / (N - 1) : 0;
    // …and weaves in and out across the rubber between steps (sin flips sign every step → zigzag),
    // settling back on the tread line at each stop so it reads as moving even on a small sweep
    const phi = (RING_SWEEP - 2 * RING_SWEEP * t) * Math.PI / 180;
    const rr = r * (0.795 + RING_WEAVE * Math.sin(p * Math.PI));
    const kx = mode === "side" ? cx - rr * Math.cos(phi) : cx - rr * Math.sin(phi);
    const ky = mode === "side" ? cy - rr * Math.sin(phi) : cy - rr * Math.cos(phi);
    ring.style.transform = `translate(${kx - 11}px, ${ky - 11}px)`;
  }

  /* ---------------- 5. Text transitions ---------------- */
  const vis = (e, v) => e.parts.forEach(el => el.style.visibility = v);
  function showText(next, prev) {
    const inE = entries[next], outE = prev != null && prev !== next ? entries[prev] : null;
    if (reduce) {
      entries.forEach(e => vis(e, "hidden"));
      vis(inE, "visible");
      gsap.set(inE.parts, { opacity: 1, y: 0 });
      return;
    }
    if (outE) {
      gsap.to(outE.parts, { opacity: 0, y: -10, duration: .2, ease: "sine.in", stagger: .03, overwrite: true,
        onComplete() { vis(outE, "hidden"); } });
    }
    vis(inE, "visible");
    gsap.fromTo(inE.parts, { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: .45, ease: "sine.out", stagger: .04, delay: outE ? .15 : 0, overwrite: true });
  }

  function goTo(i) {
    const prev = idx;
    idx = i;
    entries.forEach((e, j) => e.parts.forEach(el => el.setAttribute("aria-hidden", j === i ? "false" : "true")));
    showText(i, prev);
    gsap.to(disp, { p: i, duration: reduce ? 0 : MOVE, ease: EASE, overwrite: true, onUpdate: () => render(disp.p) });
    gsap.to(hint, { opacity: i === 0 ? 1 : 0, duration: .6 });
  }

  /* ---------------- 6. Scroll trigger ---------------- */
  ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: () => "+=" + (N - 1) * window.innerHeight * 0.9,
    pin: true,
    invalidateOnRefresh: true,
    snap: { snapTo: 1 / (N - 1), duration: { min: .2, max: .45 }, delay: .25, ease: "power1.inOut", inertia: false },
    onUpdate: self => {
      const f = self.progress * (N - 1);
      const i = Math.min(N - 1, Math.max(0, self.direction > 0 ? Math.floor(f + 0.7) : Math.ceil(f - 0.7)));
      if (i !== idx) goTo(i);
    }
  });

  ScrollTrigger.addEventListener("refreshInit", layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  layout();
  entries.forEach((e, j) => e.parts.forEach(el => el.setAttribute("aria-hidden", j === 0 ? "false" : "true")));
  vis(entries[0], "visible");
  gsap.set(entries.slice(1).flatMap(e => e.parts), { opacity: 0 });
});
