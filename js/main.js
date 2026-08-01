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
// (o tema inicial é resolvido no <head> de cada página)
// ============================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* modo anônimo etc. */ }
  });
}

// Se a pessoa nunca escolheu manualmente, acompanha mudanças do sistema
try {
  if (!localStorage.getItem('theme') && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
      }
    });
  }
} catch (e) { /* segue o jogo */ }

// ============================================
// Rolagem suave até a âncora (botão do hero)
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

// Uma saudação discreta pra quem curiosamente abre o console :)
console.log('Oi! Se você chegou até aqui pelo console, provavelmente também gosta de detalhe. Vamos conversar? seuemail@dominio.com');
