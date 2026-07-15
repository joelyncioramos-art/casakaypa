/* ============================================================
   Casa Kaypa · Aparición lenta de texto
   Port vanilla del componente "TextEffect" (motion-primitives, ver
   "TEXT EFFECT - SLOW APPEARANCE.docx"). En el original (React +
   Framer Motion) un contenedor escalona a sus hijos (palabras) desde
   un estado "hidden" (opacity 0 + blur) a "visible". Aquí se replica
   la misma lógica en JS puro:

   - Se divide el texto en palabras (preservando el marcado en línea
     como <em>) y cada palabra recibe un retraso incremental.
   - Un IntersectionObserver dispara la cascada cuando el bloque entra
     en pantalla, y la revierte al salir: el efecto es REVERSIBLE, de
     modo que al scrollear en cualquier dirección el texto aparece y
     desaparece suavemente (la salida es una cascada inversa, más
     rápida: la última palabra se desvanece primero).

   REGLA DE ALCANCE: solo párrafos largos y frases descriptivas. Nunca
   títulos, subtítulos grandes, etiquetas, botones ni textos cortos
   (se exige un mínimo de palabras). Con prefers-reduced-motion no se
   divide nada y el texto queda visible.
   ============================================================ */
(function () {
  'use strict';

  // Bloques de texto largo a los que aplicar el efecto.
  // (No incluye títulos, eyebrows, etiquetas, botones ni captions cortos.)
  var SELECTOR = [
    '.hero__sub',
    '.section-lead',
    '.historia__text p',
    '.availability__note',
    '.reservas__note',
    '.portafolio__note'
  ].join(',');

  var MIN_WORDS = 6;     // por debajo de esto se considera texto corto: se omite
  var BASE_DELAY = 120;  // ms antes de la primera palabra (deja asentar el bloque)
  var STEP = 64;         // ms de cascada entre palabras (un poco más lento, palabra por palabra)
  var STEP_OUT = 28;     // ms de cascada inversa al salir (más ágil que la entrada)

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Divide un elemento en "unidades" animables preservando el marcado
     en línea (p. ej. <em>) y los espacios. Devuelve el array de spans. */
  function splitWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    var frag = document.createDocumentFragment();
    var units = [];

    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        // Nodo de texto: dividir conservando los espacios
        var parts = node.textContent.split(/(\s+)/);
        parts.forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement('span');
            span.className = 'text-appear__w';
            span.textContent = part;
            frag.appendChild(span);
            units.push(span);
          }
        });
      } else if (node.nodeType === 1) {
        // Elemento en línea (p. ej. <em>): se anima como una unidad
        node.classList.add('text-appear__w');
        frag.appendChild(node);
        units.push(node);
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });

    el.textContent = '';
    el.appendChild(frag);
    return units;
  }

  function countWords(el) {
    var t = (el.textContent || '').trim();
    if (!t) return 0;
    return t.split(/\s+/).length;
  }

  function init() {
    if (reduceMotion) return;

    var els = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    if (!els.length) return;

    var prepared = [];

    els.forEach(function (el) {
      if (el.dataset.textAppearReady) return;
      if (countWords(el) < MIN_WORDS) return; // texto corto: se deja intacto

      // Si el elemento usaba el "reveal" de bloque, se retira para que
      // la aparición por palabras sea la única animación de este texto.
      el.classList.remove('reveal', 'is-visible');

      var units = splitWords(el);
      units.forEach(function (u, i) {
        u.style.setProperty('--w-delay', (BASE_DELAY + i * STEP) + 'ms');
        // Cascada inversa de salida: la última palabra parte primero
        u.style.setProperty('--w-delay-out', ((units.length - 1 - i) * STEP_OUT) + 'ms');
      });

      el.classList.add('text-appear');
      el.dataset.textAppearReady = '1';
      prepared.push(el);
    });

    if (!prepared.length) return;

    if (!('IntersectionObserver' in window)) {
      prepared.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    /* Reversible: se alterna la clase según visibilidad (sin
       unobserve), así el texto aparece al entrar y se desvanece al
       salir, en ambas direcciones de scroll. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-in', entry.isIntersecting);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    prepared.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
