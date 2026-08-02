// Ao passar o mouse num card de projeto, a faixa animada "gira" como
// caça-níquel e para no tipo de trabalho daquele card.
(function () {
  const CATEGORY_WORDS = {
    'ui-ux': 'UI/UX',
    'embalagem': 'Embalagem',
    'produto': 'Produto',
    'digital': 'Digital',
    'branding': 'Branding',
  };
  const SPIN_POOL = ['UI/UX', 'Produto', 'Identidade', 'Embalagem', 'Branding', 'Digital', 'Web'];

  const marquees = document.querySelectorAll('.marquee');
  if (marquees.length === 0) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  marquees.forEach((marquee) => {
    const overlay = document.createElement('div');
    overlay.className = 'slot-overlay';
    const word = document.createElement('span');
    word.className = 'slot-word';
    overlay.appendChild(word);
    marquee.appendChild(overlay);
    marquee._slotWord = word;
  });

  function spin(target) {
    if (reduceMotion) return;
    marquees.forEach((marquee) => {
      const word = marquee._slotWord;
      clearTimeout(marquee._spinTimer);
      marquee.classList.add('is-spinning');
      word.classList.remove('landed');

      let step = 0;
      const totalSteps = 9;
      function tick() {
        if (step < totalSteps) {
          word.textContent = SPIN_POOL[Math.floor(Math.random() * SPIN_POOL.length)];
          step += 1;
          marquee._spinTimer = setTimeout(tick, 45 + step * 12);
        } else {
          word.textContent = target;
          word.classList.add('landed');
        }
      }
      tick();
    });
  }

  function stop() {
    marquees.forEach((marquee) => {
      clearTimeout(marquee._spinTimer);
      marquee.classList.remove('is-spinning');
    });
  }

  document.querySelectorAll('.project-card[data-category]').forEach((card) => {
    const category = card.getAttribute('data-category');
    const label = CATEGORY_WORDS[category];
    if (!label) return;
    card.addEventListener('mouseenter', () => spin(label));
    card.addEventListener('mouseleave', stop);
  });
})();
