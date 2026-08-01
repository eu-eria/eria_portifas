// Cursor customizado — só ativa em dispositivos com mouse de precisão.
(function () {
  const supportsFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsFinePointer) return;

  document.documentElement.classList.add('has-custom-cursor');

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const label = document.createElement('span');
  label.className = 'cursor-label';
  cursor.appendChild(label);
  document.body.appendChild(cursor);

  // Movimento suave (não instantâneo, mas rápido o bastante pra não parecer atraso)
  const hasGsap = typeof gsap !== 'undefined';
  let moveX, moveY;
  if (hasGsap) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    moveX = gsap.quickTo(cursor, 'x', { duration: 0.28, ease: 'power3' });
    moveY = gsap.quickTo(cursor, 'y', { duration: 0.28, ease: 'power3' });
  }

  window.addEventListener('mousemove', (e) => {
    if (hasGsap) {
      moveX(e.clientX);
      moveY(e.clientY);
    } else {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  function setState(className, text) {
    cursor.classList.remove('is-link', 'is-open', 'is-toggle');
    if (className) cursor.classList.add(className);
    label.textContent = text || '';
  }

  // Cards de projeto e piras: cursor vira selo "Abrir"
  document.querySelectorAll('.project-card, .pira-card').forEach((el) => {
    el.addEventListener('mouseenter', () => setState('is-open', 'Abrir'));
    el.addEventListener('mouseleave', () => setState(null, ''));
  });

  // Switch de tema: cursor encolhe
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('mouseenter', () => setState('is-toggle', ''));
    toggle.addEventListener('mouseleave', () => setState(null, ''));
  }

  // Demais links/botões: cursor cresce discretamente
  document.querySelectorAll('a, button').forEach((el) => {
    if (el.closest('.project-card') || el.closest('.pira-card') || el.id === 'themeToggle') return;
    el.addEventListener('mouseenter', () => setState('is-link', ''));
    el.addEventListener('mouseleave', () => setState(null, ''));
  });
})();
