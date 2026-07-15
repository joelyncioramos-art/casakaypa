/* ============================================================
   Casa Kaypa · Rotor de palabras del hero
   Adaptación vanilla del componente "animated-hero" (referencia
   21st.dev, ver "MULTIPALABRAS.docx"): la palabra destacada del
   titular rota en un carrusel vertical suave.

   - Hereda la tipografía Boska del <em> contenedor (itálica).
   - El ancho del contenedor se anima entre palabras para que el
     punto final acompañe el cambio sin saltos bruscos.
   - Con prefers-reduced-motion la palabra queda fija
     ("reconectar") y no se inicia ninguna animación.
   ============================================================ */
(function () {
  'use strict';

  var HOLD_MS = 2800; // tiempo de lectura por palabra (ritmo pausado de marca)

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initRotor(em) {
    var words;
    try {
      words = JSON.parse(em.getAttribute('data-word-rotor'));
    } catch (e) {
      return;
    }
    if (!Array.isArray(words) || words.length < 2) return;
    if (reduceMotion) return; // texto estático original

    var srWord = em.textContent.trim();
    em.textContent = '';

    // Texto estable para lectores de pantalla
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = srWord;
    em.appendChild(sr);

    // Dimensionador en flujo: conserva altura y línea base
    var sizer = document.createElement('span');
    sizer.className = 'hero__rotor-sizer';
    sizer.setAttribute('aria-hidden', 'true');
    sizer.textContent = srWord;
    em.appendChild(sizer);

    // Escenario animado
    var stage = document.createElement('span');
    stage.className = 'hero__rotor-stage';
    stage.setAttribute('aria-hidden', 'true');
    em.appendChild(stage);

    var spans = words.map(function (word, i) {
      var s = document.createElement('span');
      s.className = 'hero__rotor-word ' + (i === 0 ? 'is-current' : 'is-below');
      s.textContent = word;
      stage.appendChild(s);
      return s;
    });

    var widths = [];
    var current = 0;
    var visible = true;
    var timer = null;

    function measure() {
      var probe = document.createElement('span');
      probe.className = 'hero__rotor-probe';
      probe.setAttribute('aria-hidden', 'true');
      em.appendChild(probe);
      widths = words.map(function (word) {
        probe.textContent = word;
        return probe.getBoundingClientRect().width;
      });
      em.removeChild(probe);
    }

    function goTo(next) {
      spans[current].classList.remove('is-current');
      spans[current].classList.add('is-above');

      var incoming = spans[next];
      incoming.classList.remove('is-above');
      incoming.classList.add('is-below');
      // Forzar reflow para que la entrada anime desde abajo
      void incoming.offsetHeight;
      incoming.classList.remove('is-below');
      incoming.classList.add('is-current');

      em.style.width = widths[next] + 'px';
      current = next;
    }

    function tick() {
      if (visible && !document.hidden) {
        goTo((current + 1) % words.length);
      }
      timer = setTimeout(tick, HOLD_MS);
    }

    function start() {
      measure();
      em.style.width = widths[0] + 'px';
      // Activar transiciones después de fijar el ancho inicial
      requestAnimationFrame(function () {
        em.classList.add('is-rotating');
        timer = setTimeout(tick, HOLD_MS);
      });
    }

    // Pausar fuera de pantalla
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(em);
    }

    // Remedir si cambia el tamaño de la tipografía (viewport)
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measure();
        em.style.width = widths[current] + 'px';
      }, 200);
    });

    // Esperar a que Boska cargue para medir con la fuente real
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }
  }

  function init() {
    var em = document.querySelector('[data-word-rotor]');
    if (em) initRotor(em);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
