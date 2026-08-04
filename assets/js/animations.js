// Só roda se o GSAP carregou
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Integração Lenis + GSAP ScrollTrigger
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    // Quem prefere menos movimento vê tudo já no lugar
    if (reduceMotion) {
      gsap.set('.reveal-text span', { y: 0 });
      gsap.set('.hero-name .hl', { y: 0 });
      return;
    }

    // Animação de entrada da tipografia (hero da home: letra por letra)
    const heroLetters = document.querySelectorAll('.hero-name .hl');
    if (heroLetters.length > 0) {
      gsap.to(heroLetters, {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.05,
        delay: 0.15,
      });
    }

    // (demais páginas ainda usam .reveal-text)
    const revealTexts = document.querySelectorAll('.reveal-text span');
    if (revealTexts.length > 0) {
      gsap.to(revealTexts, {
        y: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.2,
      });
    }

    // Fade up nos cards de projeto ao scrollar (grid e bento)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Piras e linhas de serviço também entram suavemente
    document.querySelectorAll('.pira-card, .service-row').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
    });

    // ==========================================
    // Parallax sutil: cada imagem do bento viaja em
    // velocidade própria enquanto o card passa pela tela
    // ==========================================
    document.querySelectorAll('.bento .project-image').forEach((img, i) => {
      const drift = 6 + (i % 3) * 2;
      gsap.fromTo(img,
        { yPercent: -drift, scale: 1.12 },
        {
          yPercent: drift,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.project-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // Saída do hero: o nome desliza de leve ao rolar
    const hero = document.querySelector('.hero');
    const heroTitle = hero && (hero.querySelector('.hero-name') || hero.querySelector('.h1-brutal'));
    if (heroTitle) {
      gsap.to(heroTitle, {
        xPercent: -6,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    // Faixas entortam de leve conforme a velocidade do scroll
    const marquees = gsap.utils.toArray('.marquee');
    if (marquees.length > 0) {
      const proxy = { skew: 0 };
      const clampSkew = gsap.utils.clamp(-8, 8);
      const applySkew = (v) => marquees.forEach((m) => gsap.set(m, { skewX: v }));

      ScrollTrigger.create({
        onUpdate(self) {
          const skew = clampSkew(self.getVelocity() / -350);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: true,
              onUpdate: () => applySkew(proxy.skew),
            });
          }
        },
      });
    }
  });
}
