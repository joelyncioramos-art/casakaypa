/* ============================================================
   Casa Kaypa · Ink Reveal (adaptación vanilla)
   Port del componente React "ink-reveal" (referencia 21st.dev,
   ver "INK REVEAL EFFECT.docx"). Una máscara del color del
   papel cubre la imagen; al pasar el cursor, sellos de tinta
   con borde irregular la "carvan" y revelan la escena, que
   luego se cierra sola.

   Mejora progresiva:
   - Con cursor fino (hover): interacción manual, la tinta sigue
     al mouse y se cierra sola al alejarse (comportamiento arriba).
   - Táctil (sin hover fino): no hay cursor que seguir, así que la
     obra se "auto-pinta" una sola vez —de blanco y negro a color,
     con el mismo trazo irregular de tinta— cuando entra en pantalla
     al hacer scroll (ver initAutoReveal). Queda revelada para
     siempre tras esa animación.
   - Con prefers-reduced-motion: sin máscara, imagen visible tal cual.
   ============================================================ */
(function () {
  'use strict';

  var DEFAULTS = {
    maskColor: [251, 249, 244],   // --ck-warm-ivory (#FBF9F4)
    brushSize: 128,
    lifetime: 600,
    rStart: 10,
    rVary: 0.45,
    stampStep: 10,
    maxStamps: 200,
    segments: 36,
    wobble: [0.14, 0.08, 0.05],
    gradientInnerRadius: 0.2,
    gradientStops: [0.95, 0.88, 0]
  };

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initPanel(panel, opts) {
    var img = panel.querySelector('img');
    if (!img) return;

    // Envolver la imagen en un marco posicionado
    var frame = document.createElement('div');
    frame.className = 'ink-panel__frame';
    img.parentNode.insertBefore(frame, img);
    frame.appendChild(img);

    // Movimiento reducido: imagen visible, sin máscara ni animación
    if (reduceMotion) return;

    var canvas = document.createElement('canvas');
    frame.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var stamps = [];
    var running = false;
    var lastPos = null;
    var dims = { w: 0, h: 0 };
    var mc = opts.maskColor;
    var revealed = false; // modo táctil: evita re-disparar el auto-revelado

    // Rectángulo "cover" para dibujar la imagen llenando el marco
    function coverRect(iw, ih, w, h) {
      var s = Math.max(w / iw, h / ih);
      var dw = iw * s, dh = ih * s;
      return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw: dw, dh: dh };
    }

    // Velo previo: en lugar de un lienzo en blanco, muestra la imagen
    // desaturada y con un ligero velo marfil — una vista previa que
    // invita a interactuar. El pincel "carva" este velo para revelar el
    // color pleno de la imagen base que está debajo.
    function paintVeil() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, dims.w, dims.h);
      // Ya revelada (modo táctil): queda transparente, sin repintar el
      // velo — evita que una carga tardía de imagen o un resize (p. ej.
      // girar el celular) vuelvan a tapar la obra.
      if (revealed) return;
      if (img.complete && img.naturalWidth) {
        var r = coverRect(img.naturalWidth, img.naturalHeight, dims.w, dims.h);
        ctx.filter = 'grayscale(1) brightness(1.06) contrast(0.94)';
        ctx.drawImage(img, r.dx, r.dy, r.dw, r.dh);
        ctx.filter = 'none';
        ctx.fillStyle = 'rgba(' + mc[0] + ',' + mc[1] + ',' + mc[2] + ',0.32)';
        ctx.fillRect(0, 0, dims.w, dims.h);
      } else {
        ctx.fillStyle = 'rgb(' + mc[0] + ',' + mc[1] + ',' + mc[2] + ')';
        ctx.fillRect(0, 0, dims.w, dims.h);
      }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = frame.getBoundingClientRect();
      dims.w = rect.width;
      dims.h = rect.height;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintVeil();
    }

    function carveInk(x, y, r, seed, alpha) {
      var g = ctx.createRadialGradient(x, y, r * opts.gradientInnerRadius, x, y, r);
      g.addColorStop(0, 'rgba(0,0,0,' + (opts.gradientStops[0] * alpha) + ')');
      g.addColorStop(0.5, 'rgba(0,0,0,' + (opts.gradientStops[1] * alpha) + ')');
      g.addColorStop(1, 'rgba(0,0,0,' + (opts.gradientStops[2] * alpha) + ')');
      ctx.fillStyle = g;

      ctx.beginPath();
      for (var i = 0; i <= opts.segments; i++) {
        var a = (i / opts.segments) * Math.PI * 2;
        var wob = 0.78 +
          opts.wobble[0] * Math.sin(a * 3 + seed) +
          opts.wobble[1] * Math.sin(a * 5 + seed * 2.1) +
          opts.wobble[2] * Math.sin(a * 7 + seed * 0.7);
        var px = x + Math.cos(a) * r * wob;
        var py = y + Math.sin(a) * r * wob;
        if (i === 0) { ctx.moveTo(px, py); } else { ctx.lineTo(px, py); }
      }
      ctx.closePath();
      ctx.fill();
    }

    function addStamp(x, y) {
      if (stamps.length >= opts.maxStamps) stamps.shift();
      stamps.push({
        x: x,
        y: y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: opts.brushSize * (1 - opts.rVary + Math.random() * opts.rVary)
      });
    }

    function stampAlong(x, y) {
      if (!lastPos) {
        addStamp(x, y);
      } else {
        var dx = x - lastPos.x;
        var dy = y - lastPos.y;
        var dist = Math.hypot(dx, dy);
        var steps = Math.max(1, Math.ceil(dist / opts.stampStep));
        for (var i = 1; i <= steps; i++) {
          addStamp(lastPos.x + (dx * i) / steps, lastPos.y + (dy * i) / steps);
        }
      }
      lastPos = { x: x, y: y };
    }

    function loop() {
      var now = performance.now();

      // Repinta el velo desaturado y luego carva los sellos de tinta
      paintVeil();
      ctx.globalCompositeOperation = 'destination-out';

      for (var i = stamps.length - 1; i >= 0; i--) {
        var t = (now - stamps[i].born) / opts.lifetime;
        if (t >= 1) { stamps.splice(i, 1); continue; }
        var ease = 1 - Math.pow(1 - t, 3);
        var r = opts.rStart + (stamps[i].rmax - opts.rStart) * ease;
        var alpha = 1 - t * t;
        carveInk(stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha);
      }

      if (stamps.length) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    function startLoop() {
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    }

    /* ---------- Auto-revelado (solo táctil / sin hover fino) ----------
       Sin cursor que seguir, la obra se "auto-pinta" una única vez con
       varias manchas de tinta que brotan (con el mismo trazo irregular
       del modo hover) y crecen hasta cubrir todo el lienzo, revelando
       el color permanentemente. Se dispara al entrar en pantalla. */
    // Curva simétrica (lenta-rápida-lenta), como la del frote día/noche:
    // se siente "pintada" en vez de un arranque brusco tipo ease-out.
    function smoothstep(t) { return t * t * (3 - 2 * t); }

    function autoReveal() {
      if (revealed) return;
      revealed = true;

      var GROW = 1300;   // ms que tarda cada mancha en abrirse (pausado, de marca)
      var STAGGER = 150; // ms de desfase entre manchas (aspecto orgánico)
      var start = performance.now();

      // Puntos de origen repartidos por el lienzo (centro + 4 cuadrantes).
      // Radio ajustado a la distancia real al rincón más lejano (los
      // marcos de Arte son cuadrados): cubre el lienzo justo al llegar
      // al final de la animación, no antes.
      var maxR = Math.max(dims.w, dims.h) * 0.78;
      var blots = [
        { fx: 0.5, fy: 0.5, delay: 0 },
        { fx: 0.22, fy: 0.28, delay: STAGGER },
        { fx: 0.78, fy: 0.26, delay: STAGGER * 2 },
        { fx: 0.24, fy: 0.76, delay: STAGGER * 3 },
        { fx: 0.8, fy: 0.78, delay: STAGGER * 4 }
      ].map(function (b) {
        return {
          x: dims.w * b.fx,
          y: dims.h * b.fy,
          delay: b.delay,
          seed: Math.random() * Math.PI * 2
        };
      });

      ctx.globalCompositeOperation = 'destination-out';

      function frame(now) {
        var elapsed = now - start;
        var allDone = true;

        blots.forEach(function (b) {
          var t = (elapsed - b.delay) / GROW;
          if (t <= 0) { allDone = false; return; }
          if (t < 1) allDone = false;
          t = Math.min(1, t);
          var r = maxR * smoothstep(t);
          carveInk(b.x, b.y, r, b.seed, 1);
        });

        if (!allDone) {
          requestAnimationFrame(frame);
        } else {
          // Red de seguridad: borra cualquier resto de velo en las
          // esquinas para garantizar un revelado completo y limpio.
          ctx.fillStyle = 'rgba(0,0,0,1)';
          ctx.fillRect(0, 0, dims.w, dims.h);
        }
      }

      requestAnimationFrame(frame);
    }

    if (canHover) {
      /* ---------- Modo hover (desktop) — sin cambios ---------- */
      function relPos(e) {
        var rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }

      canvas.addEventListener('mouseenter', function (e) {
        var pos = relPos(e);
        lastPos = pos;
        stampAlong(pos.x, pos.y);
        startLoop();
      });

      canvas.addEventListener('mousemove', function (e) {
        var pos = relPos(e);
        stampAlong(pos.x, pos.y);
        startLoop();
      });

      canvas.addEventListener('mouseleave', function () {
        lastPos = null;
      });
    } else {
      /* ---------- Modo táctil (celular) — auto-revelado en scroll ---------- */
      canvas.style.pointerEvents = 'none';

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            autoReveal();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }).observe(panel);
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(frame);
    } else {
      window.addEventListener('resize', resize);
    }

    // Repinta el velo cuando la imagen (lazy) termine de cargar
    if (!img.complete) {
      img.addEventListener('load', paintVeil, { once: true });
    }

    resize();
  }

  function init() {
    var panels = document.querySelectorAll('[data-ink-reveal]');
    if (!panels.length) return;

    panels.forEach(function (panel) {
      initPanel(panel, DEFAULTS);
    });

    // Mostrar la pista de interacción solo cuando la máscara está activa
    var hint = document.querySelector('[data-ink-hint]');
    if (hint && canHover && !reduceMotion) {
      hint.hidden = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
