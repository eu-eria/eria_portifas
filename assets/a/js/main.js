/* ============================================================
   main.js — Éria / portfólio
   Comportamentos base do site. Sem dependências.
   Pode ser carregado em qualquer página: cada bloco só roda
   se os elementos correspondentes existirem no HTML.

   1. Tema claro/escuro  (#themeToggle)
   2. Switch Projetos / Piras  (.view-btn + .view-panel)
   3. Filtro por categoria  (.filter-btn + .project-card[data-category])
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var REDUCED = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Estilos que o comportamento precisa.
     Ficam aqui pra este arquivo ser autossuficiente — se
     preferir, mova as três regras pro style.css e apague daqui.
     O display:none precisa de !important porque .project-card
     já declara display:block.
  --------------------------------------------------------- */
  var style = document.createElement('style');
  style.textContent =
    '.project-card[data-filtered-out]{display:none!important}' +
    '@keyframes eriaCardIn{from{opacity:0;transform:translateY(10px)}' +
    'to{opacity:1;transform:none}}' +
    '.project-card.is-entering{animation:eriaCardIn .3s cubic-bezier(.2,.6,.2,1) both}';
  document.head.appendChild(style);

  /* =========================================================
     1. TEMA
     O <script> no <head> já define data-theme antes da página
     pintar (evita o flash branco). Aqui só cuidamos do clique.
  ========================================================= */
  (function theme() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    function stored() {
      try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }

    function setTheme(value, persist) {
      root.setAttribute('data-theme', value);
      toggle.setAttribute(
        'aria-label',
        value === 'dark' ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'
      );
      if (persist) {
        try { localStorage.setItem('theme', value); } catch (e) {}
      }
    }

    setTheme(root.getAttribute('data-theme') || 'light', false);

    toggle.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });

    // Se a pessoa nunca escolheu um tema, acompanha o sistema.
    if (window.matchMedia) {
      var os = window.matchMedia('(prefers-color-scheme: dark)');
      var follow = function (e) {
        if (!stored()) setTheme(e.matches ? 'dark' : 'light', false);
      };
      if (os.addEventListener) os.addEventListener('change', follow);
      else if (os.addListener) os.addListener(follow);
    }
  })();

  /* =========================================================
     2. SWITCH PROJETOS / PIRAS
     Cada botão .view-btn[data-view="x"] mostra o painel #view-x
     e esconde os outros.
  ========================================================= */
  (function views() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.view-btn'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.view-panel'));
    if (!buttons.length || !panels.length) return;

    function show(name) {
      buttons.forEach(function (btn) {
        var on = btn.getAttribute('data-view') === name;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.id !== 'view-' + name;
      });
    }

    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
      btn.addEventListener('click', function () {
        show(btn.getAttribute('data-view'));
      });
    });
  })();

  /* =========================================================
     3. FILTRO DE PROJETOS
     .filter-btn[data-filter="embalagem"] mostra só os cards
     com data-category="embalagem". "all" mostra todos.
     Card sem data-category aparece sempre (ex.: card de contato).
  ========================================================= */
  (function filters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.bento .project-card'));
    if (!buttons.length || !cards.length) return;

    function apply(value) {
      buttons.forEach(function (btn) {
        var on = btn.getAttribute('data-filter') === value;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      var visible = 0;

      cards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        var show = value === 'all' || !category || category === value;
        var wasHidden = card.hasAttribute('data-filtered-out');

        if (!show) {
          card.setAttribute('data-filtered-out', '');
          return;
        }

        card.removeAttribute('data-filtered-out');

        // Anima só o que estava escondido e acabou de voltar.
        if (wasHidden && !REDUCED) {
          card.style.animationDelay = (visible * 30) + 'ms';
          card.classList.remove('is-entering');
          void card.offsetWidth;               // força o reflow pra reiniciar
          card.classList.add('is-entering');
          card.addEventListener('animationend', function handler() {
            card.classList.remove('is-entering');
            card.style.animationDelay = '';
            card.removeEventListener('animationend', handler);
          });
        }

        visible++;
      });
    }

    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
      btn.addEventListener('click', function () {
        apply(btn.getAttribute('data-filter') || 'all');
      });
    });
  })();

})();
