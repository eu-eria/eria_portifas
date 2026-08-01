// ============================================
// Switch de visualização: Projetos / Piras
// ============================================
const viewBtns = document.querySelectorAll('.view-btn');
const viewPanels = document.querySelectorAll('.view-panel');

if (viewBtns.length > 0) {
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-view');

      viewBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      viewPanels.forEach((panel) => {
        const show = panel.id === `view-${target}`;
        panel.hidden = !show;
        if (show && typeof gsap !== 'undefined') {
          gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      });
    });
  });
}

// ============================================
// Filtro por categoria (dentro da aba Projetos)
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const filterCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      filterCards.forEach((card) => {
        const show = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
        card.style.display = show ? 'block' : 'none';
        if (show && typeof gsap !== 'undefined') {
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        }
      });
    });
  });
}

// ============================================
// Lightbox das Piras (clique pra ampliar)
// ============================================
const piraCards = document.querySelectorAll('.pira-card');
if (piraCards.length > 0) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Fechar">✕</button><img alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }

  piraCards.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
