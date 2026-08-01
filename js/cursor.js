// Cursor contextual — só ativa em dispositivos com mouse de precisão
// (evita quebrar em touch/tablet, onde não existe "hover" de verdade).
(function () {
  const supportsFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsFinePointer) return;

  document.documentElement.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const ringText = document.createElement('span');
  ringText.className = 'cursor-ring-text';
  ring.appendChild(ringText);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Posicionamento 1:1 com o mouse — sem interpolação, sem atraso.
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    dot.style.transform = `translate(${x}, ${y}) translate(-50%, -50%)`;
    ring.style.transform = `translate(${x}, ${y}) translate(-50%, -50%)`;
  }, { passive: true });

  // Some quando o mouse sai da janela
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  function setState(className, text) {
    ring.classList.remove('cursor--link', 'cursor--project', 'cursor--toggle');
    if (className) ring.classList.add(className);
    ringText.textContent = text || '';
  }

  // Cards de projeto: o cursor vira um selo "Ver"
  document.querySelectorAll('.project-card').forEach((el) => {
    el.addEventListener('mouseenter', () => setState('cursor--project', 'Ver'));
    el.addEventListener('mouseleave', () => setState(null, ''));
  });

  // Switch de tema: anel encolhe (indica ação pontual/rápida)
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('mouseenter', () => setState('cursor--toggle', ''));
    toggle.addEventListener('mouseleave', () => setState(null, ''));
  }

  // Demais links e botões: anel cresce discretamente
  document.querySelectorAll('a, button').forEach((el) => {
    if (el.closest('.project-card') || el.id === 'themeToggle') return;
    el.addEventListener('mouseenter', () => setState('cursor--link', ''));
    el.addEventListener('mouseleave', () => setState(null, ''));
  });
})();
