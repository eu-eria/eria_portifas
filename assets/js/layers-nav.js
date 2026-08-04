// ============================================
// PAINEL DE CAMADAS — scrollspy
// Observa uma "faixa" no meio da tela; quando uma seção
// cruza essa faixa, a camada correspondente acende.
// (o clique/rolagem suave já é tratado pelo main.js via data-scroll-to)
// ============================================
(function () {
  const links = Array.from(document.querySelectorAll('.layers-panel .layer-link'));
  if (!links.length) return;

  const map = links
    .map((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      return target ? { link, target } : null;
    })
    .filter(Boolean);
  if (!map.length) return;

  function setActive(activeLink) {
    links.forEach((l) => l.classList.toggle('is-active', l === activeLink));
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const found = map.find((m) => m.target === entry.target);
          if (found) setActive(found.link);
        });
      },
      // faixa horizontal entre 40% e 45% da altura da tela
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    map.forEach((m) => io.observe(m.target));
  } else {
    // Fallback simples pra navegadores bem antigos
    window.addEventListener('scroll', () => {
      const y = window.innerHeight * 0.42;
      let current = map[0];
      map.forEach((m) => {
        if (m.target.getBoundingClientRect().top <= y) current = m;
      });
      setActive(current.link);
    }, { passive: true });
  }
})();
