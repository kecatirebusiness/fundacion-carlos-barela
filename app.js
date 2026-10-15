/* Fundación Carlos Barela — interacciones y motion */
(() => {
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const WA = ''; // número de WhatsApp de la fundación (solo dígitos, con código de país). Ej: '13055551234'
  const MAIL = ''; // email de la fundación

  /* ─── menú ─── */
  $('#burger').addEventListener('click', () => document.body.classList.toggle('menu'));
  $$('#nav a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu')));

  /* ─── personas caminando hacia su nuevo hogar ─── */
  const NS = 'http://www.w3.org/2000/svg';
  const TONES = ['#0E3B22', '#1F7A39', '#2FA84F', '#13472A'], BAGS = ['#F5C842', '#E9A93A', '#FFFFFF', '#7BE38F'];
  // persona de perfil mirando a la derecha, en una caja de 60x120 con el piso en y=120
  function person(tone, bag, kind, x, s = 1) {
    const legs = `<line class="leg a" x1="27" y1="70" x2="27" y2="116" stroke="${tone}" stroke-width="8" stroke-linecap="round"/><line class="leg b" x1="33" y1="70" x2="33" y2="116" stroke="${tone}" stroke-width="8" stroke-linecap="round"/>`;
    const body = `<circle cx="31" cy="14" r="9.5" fill="${tone}"/><rect x="20" y="26" width="21" height="48" rx="10" fill="${tone}"/>`;
    let extra = '', arm = `<line class="arm a" x1="30" y1="32" x2="30" y2="64" stroke="${tone}" stroke-width="7" stroke-linecap="round"/>`;
    if (kind === 'maleta') { // arrastra una maleta con ruedas
      extra = `<line x1="34" y1="34" x2="52" y2="62" stroke="${tone}" stroke-width="7" stroke-linecap="round"/><line x1="52" y1="62" x2="58" y2="84" stroke="#0E3B22" stroke-width="3"/><rect x="50" y="82" width="22" height="30" rx="4" fill="${bag}" stroke="#0E3B22" stroke-width="2.5"/><circle cx="55" cy="115" r="3.5" fill="#0E3B22"/><circle cx="67" cy="115" r="3.5" fill="#0E3B22"/>`;
      arm = '';
    } else if (kind === 'baston') { // persona mayor, un poco encorvada, con bastón
      return `<g transform="translate(${x} ${120 - 120 * s}) scale(${s})"><g class="walker slow"><g transform="rotate(8 30 116)">${legs}<circle cx="35" cy="16" r="9.5" fill="${tone}"/><rect x="21" y="28" width="21" height="46" rx="10" fill="${tone}"/></g><line x1="40" y1="40" x2="52" y2="64" stroke="${tone}" stroke-width="7" stroke-linecap="round"/><path d="M50 62 q4 -4 7 0 L55 116" fill="none" stroke="${bag}" stroke-width="4" stroke-linecap="round"/></g></g>`;
    } else if (kind === 'mochila') {
      extra = `<rect x="8" y="30" width="15" height="32" rx="6" fill="${bag}" stroke="#0E3B22" stroke-width="2.5"/>`;
    } else if (kind === 'bolso') {
      extra = `<line x1="32" y1="32" x2="40" y2="62" stroke="${tone}" stroke-width="7" stroke-linecap="round"/><path d="M34 62 h16 l-2 20 h-12 z" fill="${bag}" stroke="#0E3B22" stroke-width="2.5"/><path d="M38 62 q4 -8 8 0" fill="none" stroke="#0E3B22" stroke-width="2.5"/>`;
      arm = '';
    }
    return `<g transform="translate(${x} ${120 - 120 * s}) scale(${s})"><g class="walker">${extra.includes('rect x="8"') ? extra : ''}${legs}${body}${arm}${extra.includes('rect x="8"') ? '' : extra}</g></g>`;
  }
  // grupos: alguien solo con su maleta, familias con niños de la mano, parejas
  function group(i) {
    const t = TONES[i % 4], t2 = TONES[(i + 2) % 4], b = BAGS[i % 4], b2 = BAGS[(i + 1) % 4];
    switch (i % 5) {
      case 0: return {w: 120, html: person(t, b, 'maleta', 10)};
      case 1: return {w: 170, html: person(t, b, 'mochila', 10) + `<line x1="40" y1="64" x2="74" y2="80" stroke="${t}" stroke-width="5" stroke-linecap="round"/><g class="kid">${person(t2, b2, 'mochila', 66, 0.58)}</g>`};
      case 2: return {w: 200, html: person(t, b, 'bolso', 10) + person(t2, b2, 'maleta', 78)};
      case 3: return {w: 170, html: person('#1F7A39', '#F5C842', 'baston', 10) + `<line x1="46" y1="44" x2="86" y2="52" stroke="#2FA84F" stroke-width="6" stroke-linecap="round"/>` + person('#2FA84F', '#F5C842', 'voluntario', 80)};
      default: return {w: 200, html: `<g class="kid">${person(t2, b2, 'mochila', 6, 0.55)}</g><line x1="30" y1="80" x2="62" y2="66" stroke="${t}" stroke-width="5" stroke-linecap="round"/>` + person(t, b, 'maleta', 36) + `<line x1="140" y1="64" x2="142" y2="64"/>`};
    }
  }
  const track = $('#walkTrack');
  const set = Array.from({length: 10}, (_, i) => group(i));
  const strip = () => { const w = set.reduce((a, g) => a + g.w + 70, 0); let x = 0; return `<svg viewBox="0 0 ${w} 120" xmlns="${NS}">${set.map((g) => { const s = `<g transform="translate(${x} 0)">${g.html}</g>`; x += g.w + 70; return s; }).join('')}</svg>`; };
  track.innerHTML = strip() + strip();
  // desfasa un poco el paso de cada persona para que no caminen como robots
  $$('.walker', track).forEach((w, i) => { const d = -(i * 0.137 % 0.62) + 's'; w.style.animationDelay = d; $$('.leg,.arm', w).forEach((l) => (l.style.animationDelay = d)); });

  /* ─── barrio al que llegan: casas con ventanas que se encienden ─── */
  const town = $('#town');
  (function buildTown() {
    let x = -20, out = '', wins = 0;
    const dark = ['#0E3B22', '#0B321D', '#13472A'];
    while (x < 1460) {
      const r = Math.random();
      if (r < 0.22) { // árbol
        const h = 50 + Math.random() * 30;
        out += `<rect x="${x + 14}" y="${130 - h * 0.45}" width="6" height="${h * 0.45}" fill="#0B321D"/><circle cx="${x + 17}" cy="${130 - h * 0.6}" r="${h * 0.32}" fill="#1F7A39"/>`;
        x += 36;
      } else { // casa
        const w = 70 + Math.random() * 50, h = 46 + Math.random() * 40, roof = 22 + Math.random() * 14, top = 130 - h, c = dark[Math.floor(Math.random() * 3)];
        out += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${c}"/><path d="M${x - 6} ${top + 2} L${x + w / 2} ${top - roof} L${x + w + 6} ${top + 2} Z" fill="${c}"/>`;
        if (Math.random() < 0.4) out += `<rect x="${x + w * 0.7}" y="${top - roof * 0.9}" width="9" height="${roof * 0.6}" fill="${c}"/>`;
        if (Math.random() < 0.18) out += `<line x1="${x + w / 2}" y1="${top - roof}" x2="${x + w / 2}" y2="${top - roof - 26}" stroke="#F7F5EC" stroke-width="2"/><path class="flag" d="M${x + w / 2} ${top - roof - 26} h20 v12 h-20 z" fill="#2FA84F"/><path d="M${x + w / 2 + 10} ${top - roof - 17.5} l-3.4 -3.2 a2 2 0 0 1 3.4 -2 a2 2 0 0 1 3.4 2 z" fill="#F7F5EC"/>`;
        const cols = Math.max(2, Math.floor(w / 26));
        for (let k = 0; k < cols; k++) { out += `<rect class="win" x="${x + 10 + k * ((w - 20) / cols) + 2}" y="${top + 12}" width="${(w - 20) / cols - 8}" height="12" rx="2"/>`; wins++; }
        out += `<rect x="${x + w / 2 - 7}" y="${130 - 24}" width="14" height="24" rx="7" fill="#F5C842" opacity=".85"/>`;
        x += w + 10 + Math.random() * 16;
      }
    }
    town.innerHTML = out;
  })();
  const townWins = $$('.win', town);
  let townOn = false, winTimer;
  function lightTown(on) {
    clearInterval(winTimer);
    if (!on) return;
    townWins.forEach((w, i) => setTimeout(() => w.classList.add('on'), 200 + i * 45 + Math.random() * 300));
    winTimer = setInterval(() => { const w = townWins[Math.floor(Math.random() * townWins.length)]; w.classList.toggle('on'); }, 900);
  }

  /* ─── hojas flotando (canvas) ─── */
  const cv = $('#leaves'), cx = cv.getContext('2d');
  let W, H, leaves = [];
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  function sizeLeaves() {
    W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr;
    leaves = Array.from({length: touch ? 12 : 22}, () => ({x: Math.random() * W, y: Math.random() * H, s: (10 + Math.random() * 14) * dpr, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.02, vy: (0.3 + Math.random() * 0.5) * dpr, ph: Math.random() * 6.28, c: ['#2FA84F', '#3FC35F', '#7BE38F', '#F5C842'][Math.floor(Math.random() * 4)]}));
  }
  sizeLeaves(); addEventListener('resize', sizeLeaves);
  function drawLeaves(t) {
    cx.clearRect(0, 0, W, H);
    for (const l of leaves) {
      l.y += l.vy; l.x += Math.sin(t * 0.8 + l.ph) * 0.6 * dpr; l.r += l.vr;
      if (l.y > H + 30) { l.y = -30; l.x = Math.random() * W; }
      cx.save(); cx.translate(l.x, l.y); cx.rotate(l.r); cx.globalAlpha = 0.55;
      cx.fillStyle = l.c; cx.beginPath(); cx.moveTo(0, -l.s); cx.quadraticCurveTo(l.s * 0.7, 0, 0, l.s); cx.quadraticCurveTo(-l.s * 0.7, 0, 0, -l.s); cx.fill();
      cx.strokeStyle = 'rgba(255,255,255,.5)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(0, -l.s * 0.8); cx.lineTo(0, l.s * 0.8); cx.stroke();
      cx.restore();
    }
  }

  /* ─── viajeros por las rutas del mapa ─── */
  const routes = $$('.routes path'), travelers = $$('.travelers circle');
  const lens = routes.map((r) => r.getTotalLength());
  function drawTravelers(t) {
    travelers.forEach((c, i) => {
      const k = ((t * 0.12 + i * 0.21) % 1), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const p = routes[i].getPointAtLength(lens[i] * e);
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
      c.setAttribute('opacity', k > 0.92 ? (1 - k) / 0.08 : k < 0.06 ? k / 0.06 : 1);
    });
  }

  /* ─── bucle de animación (pausa fuera de pantalla) ─── */
  let heroOn = true;
  const io0 = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.target.id === 'inicio') { heroOn = e.isIntersecting; $('#walkers').classList.toggle('paused', !heroOn); }
    else if (e.isIntersecting !== townOn) { townOn = e.isIntersecting; lightTown(townOn); }
  }), {rootMargin: '150px 0px 0px 0px'});
  io0.observe($('#inicio')); if ($('.promise')) io0.observe($('.promise'));
  function loop(ms) {
    const t = ms / 1000;
    if (heroOn) { if (!reduce) drawLeaves(t); drawTravelers(t); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ─── texto de misión que se ilumina ─── */
  const scrub = $('#scrub'), HL = ['nadie', 'solo', 'mano', 'amiga', 'voluntarios', 'latinos', 'cuida', 'Barela'];
  scrub.innerHTML = scrub.textContent.split(/(\s+)/).map((w) => /^\s+$/.test(w) ? w : `<span class="w${HL.some((h) => w.toLowerCase().includes(h.toLowerCase())) ? ' hl' : ''}">${w}</span>`).join('');
  const sw = $$('.w', scrub);
  function updateScrub() {
    const r = scrub.getBoundingClientRect(), vh = innerHeight;
    const k = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(k * sw.length);
    sw.forEach((s, i) => s.classList.toggle('on', i < n));
  }

  /* ─── revelados ─── */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px'});
  $$('.reveal').filter((el) => !el.closest('.hero')).forEach((el) => io.observe(el));

  /* ─── formulario → WhatsApp ─── */
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

  /* ─── botones magnéticos ─── */
  if (!touch) {
    document.addEventListener('pointermove', (e) => {
      const m = e.target.closest('.magnetic');
      $$('.magnetic').forEach((b) => { if (b !== m) b.style.transform = ''; });
      if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`; }
    });
  }

  /* ─── header + scroll ─── */
  let tick = false;
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => { tick = false; $('#header').classList.toggle('scrolled', scrollY > 20); updateScrub(); }); }, {passive: true});
  updateScrub();

  /* ─── GSAP: entrada del hero, scroll horizontal, línea del proceso, valores ─── */
  function start() {
    document.body.classList.add('ready');
    if (!window.gsap || reduce) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }
    gsap.registerPlugin(ScrollTrigger);

    // hero: líneas del título suben, resto aparece
    $$('.hero-title .line').forEach((l) => { l.innerHTML = `<span>${l.innerHTML}</span>`; });
    const tl = gsap.timeline({defaults: {ease: 'expo.out'}, delay: 0.15});
    tl.from('.hero-title .line>span', {yPercent: 110, duration: 1.2, stagger: 0.12})
      .add(() => $$('.hero .reveal').forEach((el) => el.classList.add('in')), 0.35)
      .from('.map', {scale: 0.85, opacity: 0, duration: 1.4}, 0.2)
      .from('.routes path', {strokeDashoffset: 400, opacity: 0, duration: 1.6, stagger: 0.12}, 0.4)
      .from('.home', {scale: 0, transformOrigin: '50% 50%', duration: 1, ease: 'back.out(2)'}, 0.9)
      .from('.langs > g > g', {scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: 0.7, stagger: 0.12, ease: 'back.out(2)'}, 1.2)
      .from('.header-in > *', {y: -20, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity'}, 0.2);
    gsap.to('.langs > g > g', {y: (i) => (i % 2 ? -10 : 10), duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3, delay: 2});
    gsap.to('.hero-art', {yPercent: -10, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});

    // valores: filas que se mueven en direcciones opuestas
    gsap.fromTo('.values-row:not(.rev)', {xPercent: 0}, {xPercent: -22, ease: 'none', scrollTrigger: {trigger: '.values', start: 'top bottom', end: 'bottom top', scrub: true}});
    gsap.fromTo('.values-row.rev', {xPercent: -22}, {xPercent: 0, ease: 'none', scrollTrigger: {trigger: '.values', start: 'top bottom', end: 'bottom top', scrub: true}});

    // íconos que se dibujan
    $$('.hicon svg *').forEach((el) => { const len = el.getTotalLength ? el.getTotalLength() : 200; el.style.strokeDasharray = len; el.style.strokeDashoffset = len; });

    // ayuda: scroll horizontal fijado (escritorio) / carrusel con revelado (móvil)
    const helpTrack = $('#helpTrack');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1001px)', () => {
      const dist = () => helpTrack.scrollWidth - innerWidth + 60;
      gsap.to(helpTrack, {x: () => -dist(), ease: 'none', scrollTrigger: {trigger: '#helpPin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (st) => drawIcons(st.progress)}});
    });
    mm.add('(max-width: 1000px)', () => {
      helpTrack.style.overflowX = 'auto'; helpTrack.style.width = '100%'; helpTrack.style.scrollSnapType = 'x mandatory'; helpTrack.style.paddingRight = '18px';
      $$('.hcard').forEach((c) => (c.style.scrollSnapAlign = 'start'));
      ScrollTrigger.create({trigger: helpTrack, start: 'top 80%', onEnter: () => drawIcons(1)});
    });
    function drawIcons(p) {
      $$('.hcard').forEach((c, i, all) => { const k = Math.max(0, Math.min(1, p * (all.length + 1) - i + 0.6)); $$('.hicon svg *', c).forEach((el) => (el.style.strokeDashoffset = parseFloat(el.style.strokeDasharray) * (1 - k))); });
    }

    // proceso: línea que se dibuja y pasos que se encienden
    const sp = $('#stepsPath'), sl = sp.getTotalLength();
    sp.style.strokeDasharray = `${sl}`; sp.style.strokeDashoffset = `${sl}`;
    const stepEls = $$('.step');
    ScrollTrigger.create({trigger: '#steps', start: 'top 75%', end: 'bottom 55%', scrub: true,
      onUpdate: (st) => { sp.style.strokeDashoffset = `${sl * (1 - st.progress)}`; stepEls.forEach((s, i) => s.classList.toggle('on', st.progress > i / stepEls.length + 0.05)); }});
    gsap.from('.step', {y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', scrollTrigger: {trigger: '#steps', start: 'top 80%'}});

    // tarjetas de súmate con rebote
    gsap.from('.jart', {scale: 0.5, rotate: -20, duration: 1, stagger: 0.15, ease: 'back.out(2)', scrollTrigger: {trigger: '.join-grid', start: 'top 80%'}});

    ScrollTrigger.refresh();
  }
  const ready = () => setTimeout(start, 900);
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
  setTimeout(() => { if (!document.body.classList.contains('ready')) start(); }, 3500);
})();
