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
// PRESS START ▼ — rolagem suave até a âncora
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

// ============================================
// EASTER EGG 1 — KONAMI CODE (↑ ↑ ↓ ↓ ← → ← → B A)
// Liga/desliga o "modo retro" com scanlines de CRT
// ============================================
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

window.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === KONAMI[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      konamiIndex = 0;
      document.body.classList.toggle('retro-mode');
      showToast(document.body.classList.contains('retro-mode')
        ? '★ MODO RETRO DESBLOQUEADO'
        : 'MODO RETRO: OFF');
    }
  } else {
    konamiIndex = key === KONAMI[0] ? 1 : 0;
  }
});

function showToast(message) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

// ============================================
// EASTER EGG 2 — mensagem no console pra quem abre o inspetor
// ============================================
console.log('%cÉRIA.EXE ▸ carregado com sucesso', 'font-family: monospace; font-weight: bold; font-size: 14px;');
console.log('%cdica: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-family: monospace; color: #0033ff;');
