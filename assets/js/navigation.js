// Lógica de Filtro na página de Projetos
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if(filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove classe ativa de todos
      filterBtns.forEach(b => b.classList.remove('active'));
      // Adiciona no clicado
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          gsap.fromTo(card, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.4});
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
