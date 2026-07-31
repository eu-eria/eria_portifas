// Registra o ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Integração Lenis + GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
});
gsap.ticker.lagSmoothing(0);

// Animação de entrada da Tipografia (Hero)
document.addEventListener("DOMContentLoaded", () => {
  const revealTexts = document.querySelectorAll(".reveal-text span");
  
  if(revealTexts.length > 0) {
    gsap.to(revealTexts, {
      y: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.1,
      delay: 0.2
    });
  }

  // Fade up nos cards de projeto ao scrollar
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  });
});
