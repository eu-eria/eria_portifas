// Subtítulo do hero: revezada sozinho entre frases, e vira "caça-níquel"
// quando o mouse passa em um card de projeto (mostra o tipo de trabalho dele).
(function () {
  const heroSub = document.getElementById('heroSub');
  if (!heroSub) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PHRASES = [
    'Designer multidisciplinar — e curiosa em tempo integral.',
    'Transformo briefing em produto, tela e embalagem.',
    'Grid organizado. Ideias, nem sempre.',
    'Detalhe é o que separa "pronto" de "bom".',
  ];
  const CATEGORY_WORDS = {
    'ui-ux': 'UI/UX',
    'embalagem': 'Embalagem',
    'produto': 'Produto',
    'digital': 'Digital',
    'branding': 'Branding',
  };
  const SPIN_POOL = ['UI/UX', 'Produto', 'Identidade', 'Embalagem', 'Branding', 'Digital', 'Web'];

  let phraseIndex = 0;
  let ambientTimer = null;
  let isSpinning = false;

  function showPhrase(text) {
    heroSub.classList.add('is-fading');
    setTimeout(() => {
      heroSub.textContent = text;
      heroSub.classList.remove('is-fading');
    }, 220);
  }

  function startAmbient() {
    if (reduceMotion) return;
    stopAmbient();
    ambientTimer = setInterval(() => {
      if (isSpinning) return;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      showPhrase(PHRASES[phraseIndex]);
    }, 3200);
  }
  function stopAmbient() {
    if (ambientTimer) clearInterval(ambientTimer);
  }

  let spinTimer;
  function spin(target) {
    isSpinning = true;
    clearTimeout(spinTimer);
    heroSub.classList.add('is-category');
    let step = 0;
    const totalSteps = 9;
    function tick() {
      if (step < totalSteps) {
        heroSub.textContent = SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)];
        step += 1;
        spinTimer = setTimeout(tick, 45 + step * 12);
      } else {
        heroSub.textContent = target;
      }
    }
    tick();
  }

  function stopSpin() {
    clearTimeout(spinTimer);
    isSpinning = false;
    heroSub.classList.remove('is-category');
    showPhrase(PHRASES[phraseIndex]);
  }

  document.querySelectorAll('.project-card[data-category]').forEach((card) => {
    const label = CATEGORY_WORDS[card.getAttribute('data-category')];
    if (!label) return;
    card.addEventListener('mouseenter', () => spin(label));
    card.addEventListener('mouseleave', stopSpin);
  });

  startAmbient();
})();
