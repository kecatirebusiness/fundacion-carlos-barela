/* Fundación Carlos Barela — "Del Ávila al Mont Royal" */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const WA = ''; // número de WhatsApp de la fundación (solo dígitos, con código de país). Ej: '15145551234'
  const MAIL = ''; // email de la fundación
  const rnd = (a, b) => a + Math.random() * (b - a), pick = (a) => a[Math.floor(Math.random() * a.length)];
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  /* ═════════ CONSTRUCCIÓN DEL MUNDO (coordenadas: 0–5600 de ancho, piso en ~830) ═════════ */
  const WORLD = 5600, VIEW = 1600;
  const star = (cx, cy, r, fill = '#fff', cls = '') => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`; }
    return `<path class="${cls}" d="${d}Z" fill="${fill}"/>`;
  };
  function windows(x, y, w, h, cols, rows, day = '#9CC3E2', nightChance = 0.55) {
    let s = ''; const gw = w / cols, gh = h / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<rect class="win${Math.random() < nightChance ? ' n' : ''}" x="${(x + c * gw + gw * 0.22).toFixed(1)}" y="${(y + r * gh + gh * 0.25).toFixed(1)}" width="${(gw * 0.56).toFixed(1)}" height="${(gh * 0.5).toFixed(1)}" fill="${day}"/>`;
    return s;
  }
  // árbol de araguaney (amarillo, árbol nacional de Venezuela)
  const araguaney = (x, base, s = 1) => {
    let c = `<path d="M${x} ${base} C${x - 4 * s} ${base - 60 * s} ${x + 6 * s} ${base - 90 * s} ${x} ${base - 120 * s} M${x} ${base - 80 * s} L${x - 30 * s} ${base - 115 * s} M${x + 2 * s} ${base - 95 * s} L${x + 32 * s} ${base - 125 * s}" stroke="#6B4A2B" stroke-width="${8 * s}" fill="none" stroke-linecap="round"/>`;
    const blobs = [[0, -150, 52], [-42, -128, 40], [44, -132, 42], [-20, -172, 36], [26, -170, 38], [0, -118, 34]];
    blobs.forEach(([dx, dy, r], i) => { c += `<circle cx="${x + dx * s}" cy="${base + dy * s}" r="${r * s}" fill="${['#FFC300', '#FFD43B', '#F5A800'][i % 3]}"/>`; });
    for (let i = 0; i < 10; i++) c += `<circle cx="${x + rnd(-60, 60) * s}" cy="${base + rnd(-200, -110) * s}" r="${rnd(4, 8) * s}" fill="#FFE680"/>`;
    return c;
  };
  // chaguaramo (palma real)
  const palm = (x, base, h = 260) => {
    let c = `<path d="M${x} ${base} C${x + 8} ${base - h * 0.4} ${x - 6} ${base - h * 0.7} ${x + 4} ${base - h}" stroke="#C9C1B4" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    const tx = x + 4, ty = base - h;
    [[-80, 10], [-60, -30], [-20, -50], [30, -48], [70, -26], [86, 14], [0, 30]].forEach(([dx, dy]) => { c += `<path d="M${tx} ${ty} Q${tx + dx * 0.5} ${ty + dy - 30} ${tx + dx} ${ty + dy + 20}" stroke="#2E8B3E" stroke-width="10" fill="none" stroke-linecap="round"/>`; });
    return c;
  };
  const flagVE = (x, base) => {
    let s = `<line x1="${x}" y1="${base}" x2="${x}" y2="${base - 240}" stroke="#E8E8E8" stroke-width="6"/><g class="flagwave">`;
    s += `<rect x="${x}" y="${base - 236}" width="120" height="26" fill="#FFCC00"/><rect x="${x}" y="${base - 210}" width="120" height="26" fill="#1F4E9E"/><rect x="${x}" y="${base - 184}" width="120" height="26" fill="#CF142B"/>`;
    for (let i = 0; i < 8; i++) { const a = Math.PI * (0.85 - i * 0.1); s += star(x + 60 + Math.cos(a) * 26, base - 192 - Math.sin(a) * 14, 3.2); }
    return s + '</g>';
  };
  const flagQC = (x, base) => {
    let s = `<line x1="${x}" y1="${base}" x2="${x}" y2="${base - 260}" stroke="#E8E8E8" stroke-width="6"/><g class="flagwave"><rect x="${x}" y="${base - 256}" width="120" height="78" fill="#0B4EA2"/><rect x="${x}" y="${base - 223}" width="120" height="12" fill="#fff"/><rect x="${x + 54}" y="${base - 256}" width="12" height="78" fill="#fff"/>`;
    [[27, -239], [93, -239], [27, -195], [93, -195]].forEach(([dx, dy]) => { s += `<use href="#fleur" x="${x + dx - 9}" y="${base + dy - 11}" width="18" height="22"/>`; });
    return s + '</g>';
  };
  const cloud = (x, y, s = 1) => `<g class="cloud" opacity=".9"><ellipse cx="${x}" cy="${y}" rx="${90 * s}" ry="${34 * s}" fill="#fff"/><circle cx="${x - 30 * s}" cy="${y - 22 * s}" r="${36 * s}" fill="#fff"/><circle cx="${x + 26 * s}" cy="${y - 30 * s}" r="${44 * s}" fill="#fff"/></g>`;

  function buildWorld() {
    let w = '';
    /* — VENEZUELA — */
    // El Ávila: dos crestas, como en el logo
    w += `<path d="M-100 840 C120 700 330 560 560 470 C680 420 760 430 830 470 C900 420 980 360 1080 350 C1200 345 1320 430 1460 560 C1600 690 1760 780 1980 840 Z" fill="url(#gAvila)"/>`;
    w += `<path d="M640 560 C760 450 900 400 1060 400" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".55"/>`;
    w += `<path d="M-100 840 C200 760 420 700 640 680 C860 660 1100 700 1400 760 C1600 800 1800 820 2000 840Z" fill="url(#gAvila2)" opacity=".9"/>`;
    // barrios de colores en las faldas del Ávila
    for (let i = 0; i < 70; i++) {
      const x = rnd(-60, 640), slope = 840 - (x + 100) * 0.26 - rnd(0, 60);
      if (slope < 650) continue;
      const bw = rnd(18, 32), bh = rnd(14, 24);
      w += `<rect x="${x.toFixed(0)}" y="${(slope - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="${pick(['#E94F37', '#F6C324', '#3FA7D6', '#F29E4C', '#9BC53D', '#F7F3E3', '#E76F51'])}"/><rect x="${(x + bw * 0.3).toFixed(0)}" y="${(slope - bh * 0.7).toFixed(0)}" width="5" height="6" class="win n" fill="#5A4636"/>`;
    }
    // ciudad de Caracas
    let x = 560;
    while (x < 1900) {
      const bw = rnd(46, 90), bh = rnd(70, 190), col = pick(['#F2D7A6', '#E9C08A', '#F5E6C8', '#DDA77A', '#EDEBE6', '#CFE0EA']);
      if (x > 1180 && x < 1260) { // torres de Parque Central
        [1190, 1270].forEach((tx) => { w += `<rect x="${tx}" y="500" width="58" height="340" fill="#E6E0D2"/>${windows(tx + 4, 512, 50, 320, 3, 22, '#9CC3E2', 0.5)}<rect x="${tx}" y="494" width="58" height="10" fill="#B8B0A0"/>`; });
        x = 1340; continue;
      }
      w += `<rect x="${x.toFixed(0)}" y="${(840 - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="${col}"/>${windows(x + 4, 840 - bh + 8, bw - 8, bh - 16, Math.max(2, Math.round(bw / 22)), Math.max(2, Math.round(bh / 26)))}`;
      x += bw + rnd(4, 14);
    }
    // suelo verde, chaguaramos, araguaneyes y la bandera
    w += `<rect x="-100" y="830" width="2200" height="200" fill="#4E9A3A"/><rect x="-100" y="830" width="2200" height="8" fill="#6DB34C"/>`;
    w += palm(470, 900, 300) + palm(1640, 900, 280) + palm(1720, 910, 230);
    w += araguaney(180, 930, 1.25) + araguaney(760, 940, 1) + araguaney(1460, 935, 1.15);
    w += flagVE(1900, 900);
    /* — COSTA Y MAR CARIBE — */
    w += `<path d="M2050 830 Q2120 820 2200 840 L2200 1030 L2050 1030Z" fill="#F2D49B"/><rect x="2100" y="836" width="1060" height="200" fill="url(#gSea)"/>`;
    for (let i = 0; i < 9; i++) w += `<path class="wave-l" d="M${2160 + i * 110} ${880 + (i % 3) * 36} q20 -10 40 0 t40 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`;
    w += palm(2080, 900, 220);
    w += cloud(1500, 230, 1) + cloud(2300, 300, 1.4) + cloud(2750, 190, 1.1) + cloud(3350, 260, 1.2) + cloud(4300, 200, .9);
    /* — MONTREAL — */
    // río San Lorenzo y puente Jacques-Cartier
    w += `<rect x="3100" y="850" width="700" height="190" fill="#1D4E80"/>`;
    for (let i = 0; i < 6; i++) w += `<path class="wave-l" d="M${3140 + i * 110} ${900 + (i % 2) * 40} q20 -8 40 0 t40 0" stroke="#9CC3E2" stroke-width="3" fill="none" opacity=".5"/>`;
    w += `<path d="M3000 770 L3820 770" stroke="#3E5E58" stroke-width="16"/>`;
    let truss = `M3260 770 C3330 630 3470 630 3540 770`;
    w += `<path d="${truss}" stroke="#3E5E58" stroke-width="12" fill="none"/><path d="M3220 770 L3260 700 L3300 770 M3500 770 L3540 700 L3580 770" stroke="#3E5E58" stroke-width="8" fill="none"/>`;
    for (let i = 0; i <= 10; i++) { const t = i / 10, bx = 3260 + 280 * t, by = 770 - Math.sin(Math.PI * t) * 105; w += `<line x1="${bx}" y1="${by}" x2="${bx}" y2="770" stroke="#3E5E58" stroke-width="4"/>`; }
    [3100, 3260, 3540, 3700].forEach((px) => { w += `<rect x="${px - 10}" y="770" width="20" height="90" fill="#33504B"/>`; });
    w += `<g class="blights">`;
    for (let i = 0; i < 18; i++) { const bx = 3020 + i * 45; w += `<circle class="bridge-l" style="animation-delay:${(i * 0.13).toFixed(2)}s" cx="${bx}" cy="762" r="5" fill="${pick(['#FFCC00', '#7FD1FF', '#FF7FB0', '#9BFF9B'])}"/>`; }
    w += `</g>`;
    // Estadio Olímpico con su torre inclinada
    w += `<path d="M3860 840 C3880 750 4180 750 4200 840Z" fill="#E4EBF2"/><path d="M3900 830 C3940 780 4120 780 4160 830" stroke="#B9C7D5" stroke-width="4" fill="none"/>`;
    w += `<polygon points="3870,840 3912,840 4040,618 4016,606" fill="#D3DDE7"/><polygon points="4016,606 4040,618 4052,596 4030,586" fill="#8FA3B8"/>`;
    for (let i = 0; i < 5; i++) w += `<line x1="${4030 - i * 18}" y1="${606 + i * 30}" x2="${3960 + i * 50}" y2="790" stroke="#AFC0D0" stroke-width="2"/>`;
    // Mont Royal con su cruz
    w += `<path d="M4180 840 C4360 720 4580 580 4800 566 C5020 580 5240 720 5420 840Z" fill="url(#gRoyal)"/>`;
    w += `<path d="M4520 690 C4620 620 4720 596 4820 596" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".5"/>`;
    w += `<g class="cross"><path d="M4800 566 V480 M4778 504 H4822" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`;
    // centro: torres (Place Ville Marie, 1000 de La Gauchetière…)
    x = 4380;
    while (x < 5260) {
      let bw = rnd(50, 90), bh = rnd(110, 250); const col = pick(['#2A4A6E', '#35577E', '#1E3A5C', '#4C6F96', '#5C7FA6']);
      if (x > 4640 && x < 4720) { bw = 110; bh = 290; w += `<rect x="${x - 26}" y="${840 - bh + 60}" width="${bw + 52}" height="${bh - 60}" fill="#2C4C72"/>`; }
      if (x > 4880 && x < 4960) { bh = 300; bw = 70; w += `<polygon points="${x},${840 - bh} ${x + bw},${840 - bh} ${x + bw / 2},${840 - bh - 60}" fill="#6FA08A"/>`; }
      w += `<rect x="${x.toFixed(0)}" y="${(840 - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${bh.toFixed(0)}" fill="${col}"/>${windows(x + 5, 840 - bh + 10, bw - 10, bh - 20, Math.max(2, Math.round(bw / 18)), Math.max(3, Math.round(bh / 20)), '#7FA6CC', 0.6)}`;
      x += bw + rnd(6, 16);
    }
    // casas del Plateau con escaleras de caracol, nieve en los techos
    w += `<rect x="3800" y="860" width="1900" height="180" fill="#EEF5FB"/><rect x="3800" y="852" width="1900" height="14" fill="#C9D6E3"/>`;
    x = 3880;
    while (x < 5640) {
      const hw = rnd(120, 150), hh = rnd(104, 124), top = 860 - hh, col = pick(['#A4523A', '#8E4434', '#B8653F', '#7A3E33', '#C27A4A', '#9C5A3C']);
      w += `<rect x="${x}" y="${top}" width="${hw}" height="${hh}" fill="${col}"/><rect x="${x - 4}" y="${top - 8}" width="${hw + 8}" height="12" fill="#3B2A24"/><rect x="${x - 6}" y="${top - 18}" width="${hw + 12}" height="14" rx="7" fill="#fff"/>`;
      // ventanas en dos pisos
      [top + 14, top + 64].forEach((wy) => { for (let k = 0; k < 2; k++) { const wx = x + 18 + k * (hw * 0.5); w += `<rect x="${wx - 3}" y="${wy - 3}" width="${hw * 0.28 + 6}" height="32" fill="#F4EDE4"/><rect class="win n" x="${wx}" y="${wy}" width="${hw * 0.28}" height="26" fill="#9CC3E2"/>`; } });
      // balcón y escalera exterior
      const by = top + 54;
      w += `<path d="M${x + 6} ${by} H${x + hw - 6}" stroke="#1B1B1B" stroke-width="4"/><path d="M${x + 6} ${by - 14} H${x + hw - 6}" stroke="#1B1B1B" stroke-width="2"/>`;
      const sx = x + hw * 0.72;
      const D = 860 - by; w += `<path d="M${sx} ${by} c24 ${D * 0.12} 24 ${D * 0.38} 0 ${D * 0.5} c-24 ${D * 0.12} -24 ${D * 0.38} 0 ${D * 0.5}" stroke="#1B1B1B" stroke-width="4" fill="none"/>`;
      w += `<rect x="${x + 16}" y="${860 - 40}" width="24" height="40" fill="#3B2A24"/>`;
      x += hw + 6;
    }
    // bancos de nieve, faroles y bandera de Quebec
    for (let i = 0; i < 14; i++) w += `<ellipse cx="${3820 + i * 140}" cy="${880 + (i % 2) * 8}" rx="${rnd(50, 80)}" ry="18" fill="#fff"/>`;
    for (let i = 0; i < 6; i++) { const lx = 3960 + i * 300; w += `<line x1="${lx}" y1="900" x2="${lx}" y2="800" stroke="#1B2B3C" stroke-width="5"/><circle class="win n" cx="${lx}" cy="796" r="9" fill="#C9D6E3"/>`; }
    w += flagQC(5560, 900);
    // franja de estrellas nocturnas pequeñas (se encienden de noche)
    return w;
  }
  const world = $('#world');
  world.innerHTML = buildWorld();

  // 8 estrellas de la bandera en arco + estrellitas de noche
  const stars8 = $('#stars8');
  function placeStars(vx0, vw) {
    const cx = vx0 + vw / 2, r = Math.min(300, vw * 0.36), cy = 120 + r * 0.95;
    let s = '';
    for (let i = 0; i < 8; i++) { const a = Math.PI * (0.84 - i * (0.68 / 7)); s += `<g>${star(cx + Math.cos(a) * r, cy - Math.sin(a) * r * 0.55, Math.max(9, vw * 0.011), '#fff', 'star8')}</g>`; }
    let n = '';
    for (let i = 0; i < 60; i++) n += `<circle cx="${(vx0 + Math.random() * vw).toFixed(0)}" cy="${rnd(20, 520).toFixed(0)}" r="${rnd(1, 2.6).toFixed(1)}" fill="#fff"/>`;
    stars8.innerHTML = `<g id="nightStars" opacity="0">${n}</g>${s}`;
    $$('.star8', stars8).forEach((el, i) => (el.style.animationDelay = (i * 0.25) + 's'));
  }

  /* ═════════ ESCENA: viewport visible, cielo, avión ═════════ */
  const stage = $('#stage'), sky = $('#sky'), sun = $('#sun'), moon = $('#moon'), plane = $('#plane'), trail = $('#trail'), planeBody = $('#planeBody');
  let vx0 = 0, vw = VIEW;
  function measure() {
    const r = stage.getBoundingClientRect(), ar = r.width / r.height;
    vw = ar < VIEW / 1000 ? 1000 * ar : VIEW; vx0 = (VIEW - vw) / 2;
    placeStars(vx0, vw);
    sun.setAttribute('cx', vx0 + vw * 0.8); $('#moon').setAttribute('transform', `translate(${vx0 + vw * 0.78 - 1250} 0)`);
  }
  measure();
  addEventListener('resize', () => { measure(); render(lastP); });

  const SKY = [ // [progreso, arriba, medio, abajo]
    [0, '#2F7FD0', '#8CC4EE', '#CFE6F7'],
    [0.3, '#3C7FC8', '#9AC6EA', '#F6E0B8'],
    [0.5, '#5B5FA8', '#E88A6A', '#FFC36B'],
    [0.66, '#1B2F5E', '#3D4C86', '#8A6A9A'],
    [0.82, '#0B1F3A', '#16335E', '#24497A'],
    [1, '#0B1F3A', '#16335E', '#24497A'],
  ];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; };
  function skyAt(p) {
    let i = 0; while (i < SKY.length - 2 && p > SKY[i + 1][0]) i++;
    const [p0, ...c0] = SKY[i], [p1, ...c1] = SKY[i + 1], t = clamp((p - p0) / (p1 - p0));
    return `linear-gradient(180deg,${mix(c0[0], c1[0], t)} 0%,${mix(c0[1], c1[1], t)} 62%,${mix(c0[2], c1[2], t)} 100%)`;
  }

  const beats = $$('.beat'), STEPS = [0, 0.12, 0.34, 0.56, 0.8];
  const bar = $('#bar'), barPlane = $('#barPlane');
  let lastP = 0, curBeat = 0;
  function planePos(t) { return {x: vx0 + vw * (0.08 + 0.84 * t), y: 470 - Math.sin(Math.PI * t) * 230}; }
  function render(p) {
    lastP = p;
    world.setAttribute('transform', `translate(${(-(WORLD - VIEW) * p).toFixed(1)} 0)`);
    sky.style.background = skyAt(p);
    const sunT = clamp((p - 0.2) / 0.38);
    sun.setAttribute('cy', lerp(230, 980, sunT)); sun.setAttribute('fill', mix('#FFD447', '#FF8A3D', sunT));
    const night = clamp((p - 0.6) / 0.2);
    moon.setAttribute('opacity', night); $('#moonCut').setAttribute('fill', mix('#3D4C86', '#0F2A4E', night));
    const ns = $('#nightStars'); if (ns) ns.setAttribute('opacity', night * 0.9);
    world.classList.toggle('lit', p > 0.6);
    $('.cross', world).style.opacity = 0.55 + night * 0.45;
    $('.blights', world).style.opacity = 0.3 + night * 0.7;
    // avión entre 0.2 y 0.72
    const t = clamp((p - 0.2) / 0.52);
    plane.setAttribute('opacity', t > 0 && t < 1 ? Math.min(1, t * 8, (1 - t) * 8) : 0);
    if (t > 0 && t < 1) {
      const a = planePos(t), b = planePos(Math.min(1, t + 0.01)), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      const sc = vw < 900 ? 0.75 : 1.15;
      planeBody.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${ang}) scale(${sc})`);
      let d = ''; for (let k = 0; k <= 30; k++) { const q = planePos(t * k / 30); d += `${k ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`; }
      trail.setAttribute('d', d);
    }
    // textos
    let b = 0; STEPS.forEach((s, i) => { if (p >= s) b = i; });
    if (b !== curBeat) { beats[curBeat].classList.remove('on'); beats[b].classList.add('on'); curBeat = b; }
    bar.style.width = (p * 100) + '%'; barPlane.style.left = (p * 100) + '%';
  }
  render(0);

  /* ═════════ COMUNIDAD: personas tomadas de la mano haciendo "la ola" ═════════ */
  (function community() {
    const svg = $('#circleArt'); let s = '';
    const cols = ['#2FA84F', '#3A8AC4', '#FFCC00', '#CF142B', '#174E86', '#8DB54A', '#E76F51', '#1F4E9E', '#F29E4C'];
    s += `<path d="M30 118 H370" stroke="#174E86" stroke-width="3" opacity=".2"/>`;
    for (let i = 0; i < 9; i++) {
      const x = 40 + i * 40, c = cols[i];
      s += `<g class="ola" style="animation-delay:${(i * 0.12).toFixed(2)}s"><circle cx="${x}" cy="54" r="11" fill="${c}"/><rect x="${x - 10}" y="68" width="20" height="36" rx="9" fill="${c}"/><line x1="${x - 4}" y1="100" x2="${x - 4}" y2="118" stroke="${c}" stroke-width="7" stroke-linecap="round"/><line x1="${x + 4}" y1="100" x2="${x + 4}" y2="118" stroke="${c}" stroke-width="7" stroke-linecap="round"/>${i < 8 ? `<path d="M${x + 9} 76 Q${x + 20} 86 ${x + 31} 76" stroke="#0B1F3A" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>` : ''}</g>`;
    }
    s += star(370, 30, 12, '#FFCC00', 'star8') + star(30, 26, 8, '#3A8AC4', 'star8');
    svg.innerHTML = s;
  })();

  /* ═════════ SÚMATE: fachada del Plateau con escalera de caracol (dibujo de línea) ═════════ */
  (function plateau() {
    const svg = $('#plateauArt'); const N = '#0B1F3A';
    let s = `<g fill="none" stroke="${N}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">`;
    [[60, 120, 240], [300, 90, 270]].forEach(([x, top, w]) => {
      s += `<path class="d" d="M${x} 400 V${top} H${x + w} V400"/><path class="d" d="M${x - 10} ${top} H${x + w + 10} M${x - 6} ${top + 14} H${x + w + 6}"/>`;
      for (let k = 0; k < 2; k++) for (let f = 0; f < 2; f++) s += `<rect class="d" x="${x + 26 + k * w * 0.5}" y="${top + 40 + f * 110}" width="${w * 0.32}" height="62" rx="4"/>`;
      const by = top + 130; s += `<path class="d" d="M${x + 10} ${by} H${x + w - 10} M${x + 10} ${by - 22} H${x + w - 10}"/>`;
      for (let k = 0; k < 9; k++) s += `<path class="d" d="M${x + 14 + k * (w - 28) / 8} ${by - 22} V${by}"/>`;
      const sx = x + w * 0.72; s += `<path class="d" d="M${sx} ${by} c46 18 46 46 0 64 c-46 18 -46 46 0 64 c30 14 32 30 24 ${400 - by - 128}" stroke-width="6"/>`;
      s += `<rect class="d" x="${x + 24}" y="330" width="48" height="70" rx="3"/>`;
    });
    s += '</g>';
    svg.innerHTML = s;
  })();

  /* ═════════ CONTACTO: puente Jacques-Cartier de noche ═════════ */
  (function bridgeArt() {
    const svg = $('#bridgeArt'); let s = '';
    s += `<path d="M900 300 C1020 220 1140 160 1260 154 C1380 160 1500 220 1620 300Z" fill="#163B66"/><path d="M1260 154 V112 M1248 126 H1272" stroke="#FFE38A" stroke-width="5" stroke-linecap="round"/>`;
    let x = 960; while (x < 1560) { const bw = rnd(26, 50), bh = rnd(40, 120); s += `<rect x="${x}" y="${300 - bh}" width="${bw}" height="${bh}" fill="#1B4472"/>`; for (let k = 0; k < 5; k++) s += `<rect x="${x + rnd(4, bw - 8)}" y="${300 - rnd(10, bh - 6)}" width="4" height="4" fill="#FFD95A" opacity=".8"/>`; x += bw + 6; }
    s += `<rect x="0" y="256" width="1600" height="44" fill="#0A1A30"/>`;
    s += `<path d="M-20 230 L1640 230" stroke="#2D4A5E" stroke-width="10"/><path d="M380 230 C480 90 700 90 800 230" stroke="#2D4A5E" stroke-width="9" fill="none"/>`;
    for (let i = 0; i <= 12; i++) { const t = i / 12, bx = 380 + 420 * t, by = 230 - Math.sin(Math.PI * t) * 105; s += `<line x1="${bx}" y1="${by}" x2="${bx}" y2="230" stroke="#2D4A5E" stroke-width="3"/>`; }
    for (let i = 0; i < 36; i++) s += `<circle class="bridge-l" style="animation-delay:${(i * 0.09).toFixed(2)}s" cx="${i * 46}" cy="224" r="4" fill="${pick(['#FFCC00', '#7FD1FF', '#FF7FB0', '#9BFF9B'])}"/>`;
    svg.innerHTML = s;
  })();

  /* ═════════ interacción general ═════════ */
  $('#burger').addEventListener('click', () => document.body.classList.toggle('menu'));
  $$('#nav a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu')));

  // tarjetas: animan solo cuando se ven
  const ioPlay = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('play', e.isIntersecting)), {threshold: 0.2});
  $$('.card').forEach((c) => ioPlay.observe(c));

  // palabras que cambian en "¿Tienes ___?"
  const rots = $$('#rot span'); let ri = 0; rots[0].classList.add('on');
  setInterval(() => { const a = rots[ri]; ri = (ri + 1) % rots.length; const b = rots[ri]; a.classList.remove('on'); a.classList.add('out'); b.classList.remove('out'); b.classList.add('on'); setTimeout(() => a.classList.remove('out'), 700); }, 1900);

  // texto de "quiénes somos" que se ilumina
  const quote = $('.big-quote');
  quote.innerHTML = quote.textContent.split(/(\s+)/).map((w) => /^\s+$/.test(w) ? w : `<span class="w">${w}</span>`).join('');
  const qw = $$('.w', quote);
  function updateQuote() { const r = quote.getBoundingClientRect(), k = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)); const n = Math.round(k * qw.length); qw.forEach((s, i) => s.classList.toggle('on', i < n)); }

  // formulario → WhatsApp
  $$('[data-motivo]').forEach((b) => b.addEventListener('click', () => { const m = $('#motivo'); [...m.options].forEach((o) => { if (o.text === b.dataset.motivo) m.value = o.text; }); }));
  let idioma = 'Español';
  $$('#idioma button').forEach((b) => b.addEventListener('click', () => { $$('#idioma button').forEach((x) => x.classList.toggle('on', x === b)); idioma = b.textContent; }));
  const waUrl = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = `Hola, Fundación Carlos Barela.\n\nNombre: ${f.get('nombre')}\nTeléfono: ${f.get('telefono')}\nNecesito: ${f.get('motivo')}\nIdioma: ${idioma}${f.get('mensaje') ? `\n\n${f.get('mensaje')}` : ''}`;
    if (WA) window.open(waUrl(msg), '_blank', 'noopener');
    else alert('Falta configurar el número de WhatsApp de la fundación.');
  });
  $$('[data-wa]').forEach((a) => { a.href = WA ? waUrl('Hola, necesito información de la Fundación Carlos Barela.') : '#contacto'; if (WA) a.target = '_blank'; });
  $$('[data-mail]').forEach((a) => { a.href = MAIL ? `mailto:${MAIL}` : '#contacto'; });

  // botones magnéticos
  if (!touch) document.addEventListener('pointermove', (e) => {
    const m = e.target.closest('.magnetic');
    $$('.magnetic').forEach((b) => { if (b !== m) b.style.transform = ''; });
    if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`; }
  });

  let journeyEnd = innerHeight;
  let tick = false;
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; $('#header').classList.toggle('solid', scrollY > journeyEnd - 80); updateQuote(); }); }, {passive: true});

  /* ═════════ GSAP ═════════ */
  if (!window.gsap || reduce) { updateQuote(); return; }
  gsap.registerPlugin(ScrollTrigger);

  // entrada del título
  $$('.mega .ln').forEach((l) => { l.innerHTML = `<span>${l.innerHTML}</span>`; });
  gsap.from('.mega .ln>span', {yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.2});
  gsap.from('.b0 .eyebrow, .b0 .cta-row, .b0 .scroll-hint', {y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.5, clearProps: 'all'});
  gsap.from('#world', {y: 120, duration: 1.6, ease: 'expo.out'});
  gsap.from('.star8', {scale: 0, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.07, ease: 'back.out(3)', delay: 0.6, clearProps: 'transform'});

  // el viaje: escena fijada, el scroll mueve el mundo
  const st = ScrollTrigger.create({
    trigger: '#stage', start: 'top top', end: () => '+=' + Math.round(innerHeight * 4), pin: true, scrub: 0.8, anticipatePin: 1,
    onUpdate: (s) => render(s.progress),
    onRefresh: (s) => { journeyEnd = s.end; },
  });
  journeyEnd = st.end;

  // títulos que suben palabra por palabra
  $$('.split').forEach((h) => {
    h.innerHTML = h.textContent.trim().split(/\s+/).map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
    gsap.from($$('.w>span', h), {yPercent: 110, duration: 0.9, stagger: 0.04, ease: 'expo.out', scrollTrigger: {trigger: h, start: 'top 85%'}});
  });
  gsap.from('.card', {y: 60, opacity: 0, rotate: 1.5, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: {trigger: '.bento', start: 'top 80%'}});

  // métro: el tren avanza con el scroll
  const train = $('#train'), fill = $('#railFill'), stns = $$('.stn'), line = $('#line');
  ScrollTrigger.create({trigger: line, start: 'top 70%', end: 'bottom 55%', scrub: 0.5, onUpdate: (s) => {
    const p = s.progress, mobile = innerWidth <= 1000;
    if (mobile) { const h = line.offsetHeight - 70; train.style.transform = `translate(-50%, ${p * h}px)`; fill.style.height = (p * 100) + '%'; fill.style.width = '100%'; }
    else { train.style.left = (4 + p * 92) + '%'; train.style.transform = 'translateX(-50%)'; fill.style.width = (p * 100) + '%'; fill.style.height = ''; }
    stns.forEach((el, i) => el.classList.toggle('on', p >= i / 3 - 0.02));
  }});
  gsap.from('.stn', {y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: {trigger: line, start: 'top 80%'}});

  // banderas: Venezuela y Quebec se arman
  const ve = $('#veStars'); let vs = '';
  for (let i = 0; i < 8; i++) { const a = Math.PI * (0.86 - i * (0.72 / 7)); vs += star(100 + Math.cos(a) * 80, 92 - Math.sin(a) * 62, 8, '#fff', 's'); }
  ve.innerHTML = vs;
  const ft = gsap.timeline({scrollTrigger: {trigger: '.flags', start: 'top 70%'}});
  ft.to('.flag.ve i', {scaleX: 1, duration: 0.8, stagger: 0.12, ease: 'expo.out'})
    .from('#veStars .s', {scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.06, ease: 'back.out(3)'}, '-=.3')
    .to('.flag.qc .h', {scaleX: 1, duration: 0.7, ease: 'expo.out'}, 0.2)
    .to('.flag.qc .v', {scaleY: 1, duration: 0.7, ease: 'expo.out'}, 0.35)
    .to('.flag.qc .fl', {scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(2.5)'}, 0.6)
    .to('.who-logo', {scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.8)'}, 0.9)
    .from('.flag span', {y: 30, opacity: 0, duration: 0.6, stagger: 0.1}, 1);
  gsap.from('.promises li', {y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: {trigger: '.promises', start: 'top 85%'}});

  // fachada del Plateau que se dibuja
  $$('#plateauArt .d').forEach((p) => { const L = p.getTotalLength ? p.getTotalLength() : 400; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  gsap.to('#plateauArt .d', {strokeDashoffset: 0, duration: 1.6, stagger: 0.02, ease: 'power2.out', scrollTrigger: {trigger: '.join', start: 'top 70%'}});
  gsap.from('.jbox', {y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: {trigger: '.join-grid', start: 'top 85%'}});

  updateQuote();
  addEventListener('load', () => ScrollTrigger.refresh());
})();
