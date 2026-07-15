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

   GRUPOS (data-text-appear-group): los bloques dentro de un contenedor
   con ese atributo (p. ej. los párrafos de Historia) forman UNA sola
   cascada continua: la numeración de palabras atraviesa los párrafos
   en orden, de modo que el conjunto se lee como una única pincelada y
   no como varios párrafos arrancando a la vez. Los miembros ocultos
   por el viewport (is-desktop-only / is-mobile-only) no consumen
   turnos, y los retrasos se recalculan si cambia el tamaño de la
   ventana. El disparo (y la salida) se observan sobre el contenedor,
   así todo el grupo entra y sale como uno.

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

  // Grupos: pasos algo más ágiles — la cascada atraviesa muchos más
  // párrafos/palabras y con el paso normal tardaría demasiado en llegar
  // a la última línea.
  var GROUP_STEP = 40;
  var GROUP_STEP_OUT = 14;

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

  function isHidden(el) {
    return getComputedStyle(el).display === 'none';
  }

  /* Cascada continua a través de los miembros de un grupo, en orden de
     documento. Los miembros ocultos (is-desktop-only / is-mobile-only)
     no consumen turnos: la numeración fluye solo por lo visible. */
  function assignGroupDelays(members) {
    var visible = members.filter(function (m) { return !isHidden(m.el); });
    var total = 0;
    visible.forEach(function (m) { total += m.units.length; });

    var idx = 0;
    visible.forEach(function (m) {
      m.units.forEach(function (u) {
        u.style.setProperty('--w-delay', (BASE_DELAY + idx * GROUP_STEP) + 'ms');
        u.style.setProperty('--w-delay-out', ((total - 1 - idx) * GROUP_STEP_OUT) + 'ms');
        idx++;
      });
    });
  }

  function init() {
    if (reduceMotion) return;

    var els = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    if (!els.length) return;

    var solos = [];
    var groups = []; // { container, members: [{ el, units }] }

    els.forEach(function (el) {
      if (el.dataset.textAppearReady) return;
      if (countWords(el) < MIN_WORDS) return; // texto corto: se deja intacto

      // Si el elemento usaba el "reveal" de bloque, se retira para que
      // la aparición por palabras sea la única animación de este texto.
      el.classList.remove('reveal', 'is-visible');

      var units = splitWords(el);
      el.classList.add('text-appear');
      el.dataset.textAppearReady = '1';

      var container = el.closest('[data-text-appear-group]');
      if (container) {
        var group = null;
        for (var g = 0; g < groups.length; g++) {
          if (groups[g].container === container) { group = groups[g]; break; }
        }
        if (!group) {
          group = { container: container, members: [] };
          groups.push(group);
        }
        group.members.push({ el: el, units: units });
      } else {
        // Suelto: cascada propia dentro del elemento
        units.forEach(function (u, i) {
          u.style.setProperty('--w-delay', (BASE_DELAY + i * STEP) + 'ms');
          u.style.setProperty('--w-delay-out', ((units.length - 1 - i) * STEP_OUT) + 'ms');
        });
        solos.push(el);
      }
    });

    groups.forEach(function (group) { assignGroupDelays(group.members); });

    // is-desktop-only / is-mobile-only cambian con el viewport: los
    // turnos del grupo se recalculan para que la cascada siga continua.
    if (groups.length) {
      var resizeTimer = null;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          groups.forEach(function (group) { assignGroupDelays(group.members); });
        }, 200);
      });
    }

    if (!solos.length && !groups.length) return;

    if (!('IntersectionObserver' in window)) {
      solos.forEach(function (el) { el.classList.add('is-in'); });
      groups.forEach(function (group) {
        group.members.forEach(function (m) { m.el.classList.add('is-in'); });
      });
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

    solos.forEach(function (el) { io.observe(el); });

    /* Grupos: se observa el CONTENEDOR y la clase se propaga a todos
       los miembros a la vez — los retrasos continuos hacen el resto.
       Umbral más bajo que el de sueltos: el contenedor es alto y con
       0.2 la cascada arrancaría demasiado tarde. */
    var ioGroup = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        for (var g = 0; g < groups.length; g++) {
          if (groups[g].container !== entry.target) continue;
          groups[g].members.forEach(function (m) {
            m.el.classList.toggle('is-in', entry.isIntersecting);
          });
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    groups.forEach(function (group) { ioGroup.observe(group.container); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
