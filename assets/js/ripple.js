// Cursor padrão do sistema — só um pequeno "ripple" ao clicar, como reação visual.
document.addEventListener('pointerdown', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top = e.clientY + 'px';
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});
