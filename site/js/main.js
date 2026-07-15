/* ============================================================
   Casa Kaypa · Comportamiento de página
   - Estado de la cabecera al hacer scroll (IntersectionObserver,
     sin listeners de scroll)
   - Revelado suave de secciones (IntersectionObserver)
   - Menú móvil accesible
   - Iconos Lucide (trazo fino 1.5, lenguaje de línea de la marca)
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabecera: sombra al hacer scroll ---------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    var sentinel = document.getElementById('top-sentinel');
    if (!header || !sentinel || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    });
    io.observe(sentinel);
  }

  /* ---------- Revelado de secciones ---------- */
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Menú móvil ---------- */
  /* En phone view (≤640px) el panel se revela con un borde izquierdo
     curvo (puerto vanilla del efecto "Curved Menu"; ver CURVED
     MENU.docx — allí es React/Framer Motion animando el atributo `d`
     de un SVG). Un <div> no puede tener un borde curvo por sí solo
     (siempre es un rectángulo), así que aquí se anima directamente el
     clip-path del panel: el control de la curva de Bézier se aleja del
     borde real (creando un abombamiento hacia afuera) y vuelve a él a
     medida que el panel termina de revelarse, en vez de deslizar un
     SVG decorativo superpuesto (que quedaba invisible por pintarse del
     mismo color que el propio rectángulo). Fuera de ese rango
     (tablet/desktop con hamburguesa) el menú conserva su comportamiento
     original: aparece/desaparece al instante, sin recorte. */
  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('menu-movil');
    if (!toggle || !menu) return;

    var mqCurved = window.matchMedia('(max-width: 640px)');
    var CURVE_MS = 700;
    var BOW = 0.34; // abombamiento máximo a mitad de la animación, como fracción del ancho
    var closeTimer = null;
    var rafId = null;

    // Misma curva de aceleración que usaba el demo original
    // (cubic-bezier(0.76, 0, 0.24, 1)) para el ritmo de la revelación.
    function cubicBezier(p1x, p1y, p2x, p2y) {
      function a(x1, x2) { return 1 - 3 * x2 + 3 * x1; }
      function b(x1, x2) { return 3 * x2 - 6 * x1; }
      function c(x1) { return 3 * x1; }
      function calc(t, x1, x2) { return ((a(x1, x2) * t + b(x1, x2)) * t + c(x1)) * t; }
      function slope(t, x1, x2) { return 3 * a(x1, x2) * t * t + 2 * b(x1, x2) * t + c(x1); }
      return function (x) {
        var t = x;
        for (var i = 0; i < 8; i++) {
          var d = slope(t, p1x, p2x);
          if (Math.abs(d) < 1e-6) break;
          t -= (calc(t, p1x, p2x) - x) / d;
        }
        return calc(t, p1y, p2y);
      };
    }
    var ease = cubicBezier(0.76, 0, 0.24, 1);

    // t=0 → panel colapsado (nada visible, borde pegado al margen derecho).
    // t=1 → panel abierto (rectángulo completo, borde recto en x=0).
    // A mitad de camino el punto de control de la curva se separa del
    // borde real, creando el abombamiento; en los extremos coincide con
    // él, así que siempre empieza y termina como una línea recta limpia.
    function clipPathAt(t, w, h) {
      var leftX = w * (1 - t);
      var bow = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI) * w * BOW;
      var controlX = leftX - bow;
      return 'path("M ' + w + ' 0 L ' + w + ' ' + h + ' L ' + leftX + ' ' + h +
        ' Q ' + controlX + ' ' + (h / 2) + ' ' + leftX + ' 0 Z")';
    }

    function animatePanel(fromT, toT, duration, onDone) {
      var w = menu.clientWidth;
      var h = menu.clientHeight;
      if (rafId) cancelAnimationFrame(rafId);
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var raw = Math.min(1, (ts - start) / duration);
        var t = fromT + (toT - fromT) * ease(raw);
        menu.style.clipPath = clipPathAt(t, w, h);
        if (raw < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          rafId = null;
          if (onDone) onDone();
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);

      var animated = mqCurved.matches && !reduceMotion;

      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }

      if (open) {
        menu.hidden = false;
        if (animated) {
          menu.style.clipPath = clipPathAt(0, menu.clientWidth, menu.clientHeight);
          animatePanel(0, 1, CURVE_MS);
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
          menu.style.clipPath = '';
        }
        var first = menu.querySelector('a');
        if (first) first.focus();
      } else if (animated) {
        animatePanel(1, 0, CURVE_MS, function () { menu.style.clipPath = ''; });
        closeTimer = setTimeout(function () { menu.hidden = true; }, CURVE_MS);
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        menu.style.clipPath = '';
        menu.hidden = true;
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Navegación por anclas (header, menú móvil, footer) ----------
     Dos bugs que esto corrige:
     1) "Inicio" apunta a #inicio, que es la cabecera FIJA: un elemento
        position:fixed no tiene posición en el flujo del documento, así
        que el navegador no scrollea a ningún lado. Se intercepta y se
        scrollea explícitamente al tope de la página.
     2) En móvil, el scroll suave de CSS atraviesa animadamente las
        300vh del hero (con el motor día/noche frotando el video seek a
        seek) mientras el menú se cierra con su clip-path: tres
        animaciones pesadas a la vez = parpadeo. En pantallas táctiles
        el salto es instantáneo; el desktop conserva el scroll suave. */
  function initAnchorNav() {
    var HEADER_H = 72;
    var instantNav = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 640px)');

    function jump(top, instant) {
      if (instant) {
        // scroll-behavior:smooth de CSS ganaría incluso con
        // behavior:'auto'; se desactiva solo durante el salto.
        var prev = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, top);
        requestAnimationFrame(function () {
          document.documentElement.style.scrollBehavior = prev;
        });
      } else {
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (hash.length < 2) return;
      var target = document.getElementById(hash.slice(1));
      if (!target) return;

      e.preventDefault();
      var instant = instantNav.matches || reduceMotion;

      // La cabecera es fija: "Inicio" = tope absoluto de la página.
      var isFixed = getComputedStyle(target).position === 'fixed';
      var top = isFixed ? 0
        : Math.max(0, target.getBoundingClientRect().top + window.scrollY - HEADER_H);

      // Esperar un frame para que el cierre del menú suelte
      // body.menu-open (overflow:hidden bloquearía el scroll).
      requestAnimationFrame(function () { jump(top, instant); });
    });
  }

  /* ---------- Videos ambiente: reanudar tras suspensión ----------
     Al bloquear el teléfono (o dejar la pestaña en segundo plano un
     buen rato) el navegador pausa los <video autoplay loop> y puede
     liberar sus decodificadores — al volver quedan congelados o en
     NEGRO. Aquí se reanudan: al volver a ser visible el documento, al
     restaurar desde bfcache (pageshow) y al reentrar en pantalla.
     El video del hero (.dn-video) se excluye: lo gobierna day-night.js. */
  function initVideoKeepAlive() {
    function ambientVideos() {
      return Array.prototype.filter.call(
        document.querySelectorAll('video[autoplay][loop]'),
        function (v) { return !v.classList.contains('dn-video'); }
      );
    }

    function resume(v) {
      if (v.paused) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      }
    }

    function resumeAll() {
      if (document.hidden) return;
      ambientVideos().forEach(resume);
    }

    document.addEventListener('visibilitychange', resumeAll);
    window.addEventListener('pageshow', resumeAll);
    window.addEventListener('focus', resumeAll);

    // Reanudar también cuando el video reentra en pantalla (algunos
    // navegadores pausan los que quedan fuera del viewport).
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !document.hidden) resume(entry.target);
        });
      }, { threshold: 0.1 });
      ambientVideos().forEach(function (v) { io.observe(v); });
    }
  }

  /* ---------- Scroll card stack (fichas de la casa) ----------
     Puerto vanilla del componente GSAP ScrollTrigger de "SCROLL
     CARD.docx". Solo en phone view (≤640px): el bloque de fichas se
     fija (sticky) mientras se hace scroll por un "runway" alto; cada
     ficha se encoge y rota mientras la siguiente entra deslizándose
     desde abajo por encima. Orden: Habitaciones → Camas → Baños. En
     pantallas más anchas no se activa (rejilla de 3 columnas normal). */
  function initScrollCards() {
    var runway = document.querySelector('.habitaciones__specs');
    var stage = document.querySelector('[data-scroll-cards]');
    if (!runway || !stage) return;

    var cards = Array.prototype.slice.call(stage.querySelectorAll('.spec-tile'));
    if (cards.length < 2) return;

    var mq = window.matchMedia('(max-width: 640px)');
    var n = cards.length;
    var segments = n - 1;
    var TRANSITION = 0.72; // scroll por transición, como fracción del alto del escenario
    var END_SCALE = 0.82;  // escala a la que se reduce la ficha saliente
    var END_ROT = 5;       // rotación (grados) de la ficha saliente
    var OFF_Y = 140;       // desplazamiento inicial de la ficha entrante (% de su alto; lo recalcula layout())
    var active = false;
    var ticking = false;
    var resizeTicking = false;

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function stickyTopPx() {
      var t = parseFloat(getComputedStyle(stage).top);
      return isNaN(t) ? 0 : t;
    }

    function layout() {
      var stageH = stage.offsetHeight;
      // La ficha entrante debe arrancar totalmente debajo del escenario
      // (que es más alto que la ficha), no solo debajo de su propia altura.
      var cardH = cards[0].offsetHeight || stageH;
      OFF_Y = Math.ceil(((stageH / 2 + cardH / 2) / cardH) * 100) + 8;
      // Alto del runway = escenario + margen de scroll para (n-1) transiciones.
      runway.style.height = Math.round(stageH + segments * stageH * TRANSITION) + 'px';
    }

    function render() {
      ticking = false;
      if (!active) return;
      var scrollDist = runway.offsetHeight - stage.offsetHeight;
      if (scrollDist <= 0) return;
      var p = clamp01((stickyTopPx() - runway.getBoundingClientRect().top) / scrollDist);
      var pos = p * segments;
      for (var i = 0; i < n; i++) {
        var enter = i === 0 ? 1 : clamp01(pos - (i - 1));
        var exit = i === n - 1 ? 0 : clamp01(pos - i);
        var e = easeInOutQuad(enter);
        var x = easeInOutQuad(exit);
        var y = (1 - e) * OFF_Y;
        var scale = 1 - x * (1 - END_SCALE);
        var rot = x * END_ROT;
        cards[i].style.transform = 'translateY(' + y + '%) scale(' + scale + ') rotate(' + rot + 'deg)';
        cards[i].style.zIndex = String(i + 1);
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(render); }
    }

    function onResize() {
      if (resizeTicking) return;
      resizeTicking = true;
      requestAnimationFrame(function () {
        resizeTicking = false;
        if (active) { layout(); render(); }
      });
    }

    function enable() {
      if (active) return;
      active = true;
      layout();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      render();
    }

    function disable() {
      if (!active) return;
      active = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      runway.style.height = '';
      cards.forEach(function (c) { c.style.transform = ''; c.style.zIndex = ''; });
    }

    function apply() {
      if (mq.matches && !reduceMotion) enable();
      else disable();
    }

    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply); // Safari antiguo
    // Reajustar tras cargar imágenes/fuentes (puede cambiar el alto del escenario).
    window.addEventListener('load', function () { if (active) { layout(); render(); } });
    apply();
  }

  /* ---------- Iconos Lucide ---------- */
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }
  }

  function init() {
    initHeader();
    initReveals();
    initMobileMenu();
    initAnchorNav();
    initVideoKeepAlive();
    initScrollCards();
    initIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
