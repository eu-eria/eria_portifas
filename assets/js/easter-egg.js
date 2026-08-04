// ============================================
// EASTER EGG — o ;] do footer
// Clique: o rosto pisca (;D) e explode uma chuva de
// estrelas de 8 pontas (as mesmas da faixa animada).
// No 5º clique, a nota do rodapé revela um recado. ;]
// ============================================
(function () {
  const wink = document.getElementById('wink');
  if (!wink) return;

  const note = document.getElementById('footerNote');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STAR_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12.0,2.0 13.6,8.0 19.1,4.9 16.0,10.4 22.0,12.0 16.0,13.6 19.1,19.1 13.6,16.0 12.0,22.0 10.4,16.0 4.9,19.1 8.0,13.6 2.0,12.0 8.0,10.4 4.9,4.9 10.4,8.0"/></svg>';
  const SECRET = 'Cinco cliques? Curiosidade assim combina comigo — bora criar algo? ;]';

  let clicks = 0;
  let faceTimer = null;

  // ------- partículas -------
  let particles = [];
  let rafId = null;

  function themeColors() {
    const cs = getComputedStyle(document.documentElement);
    return [
      (cs.getPropertyValue('--accent-color') || '#D6244E').trim(),
      (cs.getPropertyValue('--text-color') || '#161514').trim(),
    ];
  }

  function burst(x, y, amount) {
    const colors = themeColors();
    for (let i = 0; i < amount; i++) {
      const el = document.createElement('span');
      el.className = 'egg-star';
      const size = 9 + Math.random() * 10;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      // maioria magenta, algumas na cor da tinta
      el.style.color = colors[Math.random() < 0.7 ? 0 : 1];
      el.innerHTML = STAR_SVG;
      document.body.appendChild(el);

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9; // leque pra cima
      const speed = 5 + Math.random() * 6;
      particles.push({
        el,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 16,
        born: performance.now(),
      });
    }
    if (rafId === null) rafId = requestAnimationFrame(step);
  }

  function step(now) {
    rafId = null;
    const H = window.innerHeight;
    particles = particles.filter((p) => {
      const age = now - p.born;
      p.vy += 0.32;            // gravidade
      p.vx *= 0.99;            // arrasto
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      const fade = age > 800 ? Math.max(0, 1 - (age - 800) / 500) : 1;
      if (p.y > H + 40 || fade <= 0) {
        p.el.remove();
        return false;
      }
      p.el.style.opacity = fade;
      p.el.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0) rotate(' + p.rot + 'deg)';
      return true;
    });
    if (particles.length) rafId = requestAnimationFrame(step);
  }

  // ------- clique -------
  wink.addEventListener('click', (e) => {
    clicks += 1;

    // pisca ;D e volta
    wink.textContent = ';D';
    clearTimeout(faceTimer);
    faceTimer = setTimeout(() => { wink.textContent = ';]'; }, 900);

    if (!reduceMotion) {
      // ativação por teclado não tem coordenada: usa o centro do botão
      let x = e.clientX;
      let y = e.clientY;
      if (!x && !y) {
        const r = wink.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
      burst(x, y, clicks >= 5 ? 46 : 22);
    }

    // 5º clique: recado secreto
    if (clicks === 5 && note) {
      note.classList.add('is-fading');
      setTimeout(() => {
        note.textContent = SECRET;
        note.classList.remove('is-fading');
      }, 260);
    }
  });
})();
