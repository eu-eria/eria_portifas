// ============================================
// SMOOTH SCROLL (Lenis) — com guarda caso o CDN falhe
// ============================================
const lenis = (typeof Lenis !== 'undefined')
  ? new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
  : null;

if (lenis) {
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ============================================
// SWITCH DE MODO DE COR
// ============================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

try {
  if (!localStorage.getItem('theme') && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
      }
    });
  }
} catch (e) {}

// ============================================
// Rolagem suave até a âncora
// ============================================
document.querySelectorAll('[data-scroll-to]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const target = document.querySelector(el.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -60 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Uma saudação discreta pra quem abre o console :)
console.log('Oi! Se você chegou até aqui pelo console, a gente provavelmente combina. Vamos conversar? seuemail@dominio.com');
