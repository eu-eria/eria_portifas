// ============================================
// ESTEIRA DE PIRAS — um marquee que você pode agarrar.
// • Anda sozinha, como as faixas do site;
// • Pausa quando o mouse está em cima;
// • Segure e arraste pra frear, rebobinar ou dar um
//   peteleco — ela continua com inércia e volta ao ritmo;
// • As polaroides se inclinam conforme a velocidade;
// • Clique (sem arrastar) abre o lightbox normalmente.
// Ajuste o ritmo em AUTO, e a inclinação em LEAN_K.
// ============================================
(function () {
  const belt = document.getElementById('pirasBelt');
  if (!belt) return;
  const track = belt.querySelector('.piras-track');
  const baseGroup = belt.querySelector('.belt-group');
  if (!track || !baseGroup) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------- calibragem -------
  const AUTO = 0.55;    // velocidade de cruzeiro (px por frame)
  const LEAN_K = 0.5;   // quanto as polaroides se inclinam por velocidade
  const LEAN_MAX = 5;   // inclinação máxima (graus)
  const DRAG_TOL = 6;   // px de arraste que ainda contam como "clique"
  // --------------------------

  // Sem movimento automático: vira uma faixa de rolagem nativa
  if (reduceMotion) {
    belt.classList.add('belt-native');
    return;
  }

  belt.querySelectorAll('img').forEach((img) => { img.draggable = false; });

  // Clones até cobrir ~2 telas de largura (loop sem buracos, mesmo em ultrawide).
  // O clique num clone é repassado ao card original — assim o lightbox
  // (que só conhece os originais) abre na pira certa.
  let loopW = 0;
  function buildClones() {
    track.querySelectorAll('.belt-group[aria-hidden]').forEach((g) => g.remove());
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    loopW = baseGroup.offsetWidth + gap;
    if (!loopW) return;
    const copies = Math.max(1, Math.ceil((window.innerWidth * 2) / loopW));
    const originals = baseGroup.querySelectorAll('.pira-card');
    for (let i = 0; i < copies; i++) {
      const clone = baseGroup.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach((img) => { img.draggable = false; });
      clone.querySelectorAll('.pira-card').forEach((card, idx) => {
        card.addEventListener('click', () => {
          if (originals[idx]) originals[idx].click();
        });
      });
      track.appendChild(clone);
    }
  }
  buildClones();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildClones, 200);
  });

  // ------- estado -------
  const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  let offset = 0;      // deslocamento acumulado da esteira
  let vel = AUTO;      // velocidade atual (px/frame)
  let lean = 0;        // inclinação atual (graus)
  let dragging = false;
  let hovering = false;
  let lastX = 0;
  let lastDx = 0;
  let dragDist = 0;
  let visible = true;
  let rafId = null;

  if (finePointer) {
    belt.addEventListener('pointerenter', () => { hovering = true; });
    belt.addEventListener('pointerleave', () => { hovering = false; });
  }

  belt.addEventListener('pointerdown', (e) => {
    dragging = true;
    dragDist = 0;
    lastX = e.clientX;
    lastDx = 0;
    belt.classList.add('is-grabbing');
    try { belt.setPointerCapture(e.pointerId); } catch (err) {}
  });

  belt.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    lastDx = dx;
    dragDist += Math.abs(dx);
    offset -= dx; // a esteira segue o dedo 1:1
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    belt.classList.remove('is-grabbing');
    vel = -lastDx; // peteleco: sai com a velocidade do arraste
  }
  belt.addEventListener('pointerup', release);
  belt.addEventListener('pointercancel', release);

  // Depois de um arraste de verdade, o clique não abre o lightbox
  belt.addEventListener('click', (e) => {
    if (dragDist > DRAG_TOL) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  // Pausa o loop quando a esteira sai da tela
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && rafId === null) rafId = requestAnimationFrame(tick);
    }).observe(belt);
  }

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function tick() {
    rafId = null;
    if (!visible) return;

    if (!dragging) {
      const cruise = hovering ? 0 : AUTO;
      vel += (cruise - vel) * 0.06; // inércia esvai até o ritmo de cruzeiro
      offset += vel;
    }

    if (loopW > 0) offset = ((offset % loopW) + loopW) % loopW;
    track.style.transform = 'translate3d(' + (-offset).toFixed(2) + 'px, 0, 0)';

    // inclinação: as polaroides "penduram" contra o movimento
    const v = dragging ? -lastDx : vel;
    const targetLean = clamp(v * LEAN_K, -LEAN_MAX, LEAN_MAX);
    lean += (targetLean - lean) * 0.12;
    track.style.setProperty('--lean', lean.toFixed(2) + 'deg');
    lastDx *= 0.85; // sem novos moves, a inclinação relaxa

    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
})();
