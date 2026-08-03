// ============================================
// NOME VIVO — Stack Sans Notch é variável (wght 200–700),
// então cada letra do hero vira um eixo interativo:
//   • perto do cursor, a letra engorda e dá uma levantada;
//   • sem interação (ou no celular), uma onda de peso
//     percorre o nome, como se ele respirasse.
// Ajuste os números logo abaixo pra calibrar o efeito.
// ============================================
(function () {
  const hero = document.querySelector('.hero');
  const letters = Array.from(document.querySelectorAll('.hero-name .hl'));
  if (!hero || !letters.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------- calibragem -------
  const BASE = 470;       // peso de repouso
  const MAX = 700;        // peso máximo (limite da fonte)
  const MIN = 240;        // piso da onda ociosa
  const WAVE_AMP = 150;   // quão funda é a onda ociosa
  const WAVE_SPEED = 1.9; // velocidade da onda (rad/s)
  const WAVE_STEP = 0.55; // defasagem entre letras (quanto maior, mais "serpente")
  const LIFT = 8;         // px que a letra sobe perto do cursor
  const EASE = 0.14;      // suavização (0–1; menor = mais lento)
  const IDLE_AFTER = 2400;// ms sem mexer o mouse até a onda voltar
  // --------------------------

  // Quem prefere menos movimento vê o nome firme, num peso bonito, e pronto.
  if (reduceMotion) {
    letters.forEach((el) => el.style.setProperty('--w', 620));
    return;
  }

  const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const state = letters.map(() => ({ w: BASE, ty: 0 }));
  let mouse = null;
  let lastMove = -Infinity;
  let visible = true;
  let rafId = null;

  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      mouse = { x: e.clientX, y: e.clientY };
      lastMove = performance.now();
    }, { passive: true });
    document.addEventListener('pointerleave', () => { mouse = null; });
  }

  // Pausa o loop quando o hero sai da tela (economia de bateria)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && rafId === null) rafId = requestAnimationFrame(tick);
    }).observe(hero);
  }

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function tick(now) {
    rafId = null;
    if (!visible) return;

    const t = now / 1000;
    const idle = !finePointer || !mouse || now - lastMove > IDLE_AFTER;
    const radius = Math.max(220, hero.offsetWidth * 0.28);

    // 1ª passada: só LEITURAS de layout (evita reflow entre letras)
    const centers = idle ? null : letters.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    // 2ª passada: só ESCRITAS de estilo
    for (let i = 0; i < letters.length; i++) {
      const s = state[i];
      let targetW;
      let targetTy = 0;

      if (idle) {
        // Onda senoidal viajando pelo nome
        targetW = clamp(BASE + Math.sin(t * WAVE_SPEED - i * WAVE_STEP) * WAVE_AMP, MIN, MAX);
      } else {
        const dx = mouse.x - centers[i].x;
        const dy = mouse.y - centers[i].y;
        const dist = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - dist / radius);
        const boost = Math.pow(influence, 1.6); // curva: só engorda de verdade bem perto
        targetW = BASE + (MAX - BASE) * boost;
        targetTy = -LIFT * boost;
      }

      s.w += (targetW - s.w) * EASE;
      s.ty += (targetTy - s.ty) * EASE;
      letters[i].style.setProperty('--w', s.w.toFixed(1));
      letters[i].style.setProperty('--ty', s.ty.toFixed(2) + 'px');
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
})();
