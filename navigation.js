// Lógica de filtro na página de Projetos
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
