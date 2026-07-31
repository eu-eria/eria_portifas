// Inicializa Lenis para Smooth Scroll Brutalista (fluido mas rígido)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  smooth: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Cursor Customizado
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Suavização do cursor via RequestAnimationFrame
function animateCursor() {
  let distX = mouseX - cursorX;
  let distY = mouseY - cursorY;
  
  cursorX += distX * 0.2;
  cursorY += distY * 0.2;
  
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Efeitos de Hover no Cursor
const hoverElements = document.querySelectorAll('a, button, .project-card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
