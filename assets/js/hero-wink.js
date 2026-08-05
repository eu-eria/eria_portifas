// ============================================
// ;] EM 3D — o wink da marca vira objeto
// Sem biblioteca 3D: o mesmo ;] é clonado dezenas de vezes e
// cada cópia recua um tiquinho no eixo Z. Empilhadas, as fatias
// viram volume — truque velho de letreiro, só que em CSS.
//
// O giro é do CSS (@keyframes w3d-spin, em css/animations.css).
// Aqui a gente só monta as fatias e faz o objeto inclinar
// na direção do cursor.
// ============================================
(function () {
  const root = document.querySelector('.wink3d');
  if (!root) return;

  const stage = root.querySelector('.wink3d-stage');
  const face = root.querySelector('.wink3d-face');
  if (!stage || !face) return;

  // ------- calibragem -------
  const LAYERS = 30;   // nº de fatias (mais fatias = extrusão mais lisa, um tico mais pesado)
  const BASE_X = -7;   // inclinação de repouso, em graus (deixa o objeto meio "de cima")
  const TILT_X = 16;   // quanto ele deita pra frente/trás seguindo o cursor
  const TILT_Y = 20;   // quanto ele vira pros lados seguindo o cursor
  // --------------------------

  // 1) miolo — as fatias, uma atrás da outra
  const frag = document.createDocumentFragment();
  for (let i = 1; i <= LAYERS; i++) {
    const slice = face.cloneNode(true);
    slice.className = 'wink3d-face is-depth';
    slice.style.setProperty('--i', i);
    slice.style.setProperty('--t', (i / LAYERS).toFixed(3)); // 0 = cor da frente, 1 = cor do fundo
    frag.appendChild(slice);
  }

  // 2) verso — mesma cor da frente, espelhado, pro ;] continuar
  //    legível na metade do giro em que o objeto mostra as costas
  const back = face.cloneNode(true);
  back.className = 'wink3d-face is-back';
  back.style.setProperty('--i', LAYERS + 1);
  frag.appendChild(back);

  stage.appendChild(frag);

  // 3) inclinação seguindo o cursor — só com mouse/trackpad,
  //    e só pra quem não pediu menos movimento
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (reduceMotion || !finePointer) return;

  const tilt = root.querySelector('.wink3d-tilt');
  if (!tilt) return;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  let queued = false;
  let px = 0;
  let py = 0;

  window.addEventListener('pointermove', (e) => {
    px = e.clientX;
    py = e.clientY;
    if (queued) return;      // uma atualização por quadro, no máximo
    queued = true;
    requestAnimationFrame(apply);
  }, { passive: true });

  function apply() {
    queued = false;
    const r = root.getBoundingClientRect();
    if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return; // fora da tela: nem calcula

    // posição do cursor em relação ao centro do objeto, de -1 a 1
    const nx = clamp((px - (r.left + r.width / 2)) / (window.innerWidth * 0.5), -1, 1);
    const ny = clamp((py - (r.top + r.height / 2)) / (window.innerHeight * 0.5), -1, 1);

    tilt.style.setProperty('--w3d-tilt-y', (nx * TILT_Y).toFixed(2) + 'deg');
    tilt.style.setProperty('--w3d-tilt-x', (BASE_X - ny * TILT_X).toFixed(2) + 'deg');
  }
})();
