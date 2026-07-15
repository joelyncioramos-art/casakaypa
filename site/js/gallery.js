/* ============================================================
   Casa Kaypa · Galería de habitaciones y baños
   Adaptación vanilla del componente "image-gallery" (referencia
   21st.dev, ver "CARRUSEL DE FOTOS.docx"): tiras de foto que se
   expanden con fluidez. Sobre esa base se añade navegación por
   clic, flechas y deslizamiento táctil:

   - Escritorio: las tiras crecen al pasar el cursor (mecánica
     original del componente); el clic o las flechas fijan la
     tira activa.
   - Móvil (<768px): carrusel de desplazamiento horizontal con
     scroll-snap; las flechas también avanzan las fotos.
   ============================================================ */
(function () {
  'use strict';

  var mobileQuery = window.matchMedia('(max-width: 767px)');

  function init() {
    var root = document.querySelector('[data-gallery]');
    if (!root) return;

    var strip = root.querySelector('.gallery__strip');
    var items = Array.prototype.slice.call(root.querySelectorAll('.gallery__item'));
    var prevBtn = root.querySelector('[data-gallery-prev]');
    var nextBtn = root.querySelector('[data-gallery-next]');
    if (!items.length) return;

    var active = Math.max(0, items.findIndex(function (el) {
      return el.classList.contains('is-active');
    }));

    function setActive(i, scroll) {
      items[active].classList.remove('is-active');
      items[active].removeAttribute('aria-current');
      active = (i + items.length) % items.length;
      items[active].classList.add('is-active');
      items[active].setAttribute('aria-current', 'true');

      if (scroll && mobileQuery.matches) {
        items[active].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () {
        setActive(i, false);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive(i, false);
        }
      });
    });

    prevBtn.addEventListener('click', function () { setActive(active - 1, true); });
    nextBtn.addEventListener('click', function () { setActive(active + 1, true); });

    // En móvil, el deslizamiento manual actualiza la tira activa
    var scrollTimer = null;
    strip.addEventListener('scroll', function () {
      if (!mobileQuery.matches) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var center = strip.scrollLeft + strip.clientWidth / 2;
        var closest = 0;
        var best = Infinity;
        items.forEach(function (item, i) {
          var mid = item.offsetLeft + item.offsetWidth / 2;
          var d = Math.abs(mid - center);
          if (d < best) { best = d; closest = i; }
        });
        if (closest !== active) setActive(closest, false);
      }, 120);
    }, { passive: true });

    setActive(active, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
