// ============================================
// Switch de visualização: Projetos / Piras
// ============================================
const viewBtns = document.querySelectorAll('.view-btn');
const viewPanels = document.querySelectorAll('.view-panel');
const titleWord = document.querySelector('.title-word');
const titleWrap = document.querySelector('.title-word-wrap');

function swapTitle(target) {
  if (!titleWord) return;
  const newText = target === 'piras' ? 'Piras' : 'Projetos';
  if (titleWord.textContent === newText) return;

  // Saindo de Piras: some com a estrela já, sem esperar o texto trocar
  if (target !== 'piras' && titleWrap) titleWrap.classList.remove('is-piras');

  titleWord.classList.add('is-swapping');
  setTimeout(() => {
    titleWord.textContent = newText;
    titleWord.classList.remove('is-swapping');
    // Entrando em Piras: estrela aparece junto com o texto novo
    if (target === 'piras' && titleWrap) titleWrap.classList.add('is-piras');
  }, 220);
}

if (viewBtns.length > 0) {
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-view');

      viewBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      swapTitle(target);

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
// Lightbox das Piras — com navegação: setas, teclado e arraste (swipe)
// ============================================
const piraCards = document.querySelectorAll('.pira-card');
if (piraCards.length > 0) {
  const items = Array.from(piraCards).map((card) => {
    const img = card.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Fechar">✕</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Anterior">‹</button>
    <img alt="">
    <button class="lightbox-nav lightbox-next" aria-label="Próxima">›</button>
    <span class="lightbox-count"></span>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const countEl = lightbox.querySelector('.lightbox-count');

  let currentIndex = 0;

  function render() {
    const item = items[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    countEl.textContent = `${currentIndex + 1} / ${items.length}`;
  }
  function openLightbox(index) {
    currentIndex = index;
    render();
    lightbox.classList.add('is-open');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }
  function goNext() {
    currentIndex = (currentIndex + 1) % items.length;
    render();
  }
  function goPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render();
  }

  piraCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  // Arraste/swipe (touch e mouse) pra continuar a sequência sem fechar
  let dragStartX = null;
  lightbox.addEventListener('pointerdown', (e) => {
    if (e.target === prevBtn || e.target === nextBtn || e.target === closeBtn) return;
    dragStartX = e.clientX;
  });
  lightbox.addEventListener('pointerup', (e) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    dragStartX = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  });
}
