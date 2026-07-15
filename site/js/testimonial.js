/* ============================================================
   Casa Kaypa · Reseñas (testimonio minimal)
   Adaptación vanilla del componente "minimal-testimonial"
   (referencia 21st.dev, ver "REVIEWS.docx"): una cita a la vez
   con transición suave, avatares para cambiar de voz y ficha
   de autor sincronizada.

   - Rotación automática pausada y serena; se detiene en cuanto
     el usuario elige una reseña manualmente.
   - Con prefers-reduced-motion no hay rotación automática y las
     transiciones se resuelven al instante (ver CSS).
   ============================================================ */
(function () {
  'use strict';

  var AUTOPLAY_MS = 7000;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var root = document.querySelector('[data-testimonial]');
    if (!root) return;

    var quotes = Array.prototype.slice.call(root.querySelectorAll('.testimonial__quote'));
    var avatars = Array.prototype.slice.call(root.querySelectorAll('.testimonial__avatar'));
    var authors = Array.prototype.slice.call(root.querySelectorAll('.testimonial__author'));
    if (!quotes.length || quotes.length !== avatars.length || quotes.length !== authors.length) return;

    var active = 0;
    var timer = null;
    var visible = true;

    function setActive(i) {
      quotes[active].classList.remove('is-active');
      avatars[active].classList.remove('is-active');
      avatars[active].setAttribute('aria-selected', 'false');
      authors[active].classList.remove('is-active');

      active = i;

      quotes[active].classList.add('is-active');
      avatars[active].classList.add('is-active');
      avatars[active].setAttribute('aria-selected', 'true');
      authors[active].classList.add('is-active');
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    avatars.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        stopAutoplay(); // el usuario toma el control
        setActive(i);
      });
    });

    // Rotación automática, solo con la sección visible
    if (!reduceMotion) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }).observe(root);
      }

      timer = setInterval(function () {
        if (visible && !document.hidden) {
          setActive((active + 1) % quotes.length);
        }
      }, AUTOPLAY_MS);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
