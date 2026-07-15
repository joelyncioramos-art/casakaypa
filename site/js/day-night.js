/* ============================================================
   Casa Kaypa · Transición cinematográfica día→noche
   Scroll-scrubbing sobre el hero: el avance del scroll dentro de
   la pista (.hero-runway) controla directamente la transición.

   ARQUITECTURA (dos modos, mismo motor):
   - Modo FOTO (actual, fase de prueba): fundido entre la foto
     diurna real y su copia con gradación nocturna. Solo anima
     opacity (composición en GPU, cero repintados).
   - Modo VIDEO (Higgsfield): si .hero-runway tiene
     data-video-src, se precarga un <video> silencioso y el
     scroll frota video.currentTime. Preparado para reemplazar
     el archivo de 720p por la versión 4K sin tocar código.
     * Recomendación de exportación para scrubbing fluido:
       H.264 sin audio, keyframes densos (all-intra), 6-10 s.

   RENDIMIENTO:
   - Un solo bucle requestAnimationFrame, activo únicamente
     mientras la pista es visible (IntersectionObserver).
   - El progreso mostrado persigue al objetivo con interpolación
     (lerp) para un frote sedoso, sin listeners de scroll.
   - Los seeks de video se limitan a ~30 por segundo y solo si
     el cambio supera un frame.

   REPOSO ABSOLUTO: sin scroll, el fotograma queda perfectamente
   quieto (sin ken-burns ni derivas). Todo movimiento proviene
   únicamente del scroll del usuario.

   Con prefers-reduced-motion todo queda estático en el día.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var runway = document.querySelector('[data-daynight]');
    if (!runway || reduceMotion) return;

    var stage = runway.querySelector('.dn-stage');
    var night = runway.querySelector('.dn-layer--night');
    var tint = runway.querySelector('.dn-tint');
    if (!stage || !night || !tint) return;

    /* ---------- Modo video (mejora progresiva) ----------
       Entrega adaptativa: el 4K (nítido pero pesado) solo se sirve a
       equipos capaces; en móvil, con ahorro de datos o poca memoria
       se usa la versión ligera (720p). Evita descargar 45MB a un
       teléfono y mantiene el frote fluido. */
    var videoSrc = runway.getAttribute('data-video-src');
    var liteSrc = runway.getAttribute('data-video-src-lite');
    if (liteSrc) {
      var conn = navigator.connection || {};
      var prefersLite =
        window.matchMedia('(max-width: 1024px)').matches ||
        conn.saveData === true ||
        (typeof conn.effectiveType === 'string' && /2g|3g/.test(conn.effectiveType)) ||
        (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4);
      if (prefersLite) videoSrc = liteSrc;
    }
    var video = null;
    var videoReady = false;

    var seekPending = false;

    if (videoSrc) {
      video = document.createElement('video');
      video.className = 'dn-layer dn-video';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'auto';
      video.src = videoSrc;
      video.setAttribute('aria-hidden', 'true');
      stage.appendChild(video);
      video.addEventListener('loadeddata', function () {
        if (video.duration > 0) {
          videoReady = true;
          stage.classList.add('dn-stage--video');
        }
      });
      video.addEventListener('seeked', function () { seekPending = false; });
      video.load();
    }

    /* ---------- Motor de scrubbing ---------- */
    var target = 0;        // progreso según el scroll (0 día · 1 noche)
    var current = 0;       // progreso mostrado (persigue a target)
    var running = false;

    function computeTarget() {
      var rect = runway.getBoundingClientRect();
      var span = rect.height - window.innerHeight;
      if (span <= 0) { target = 0; return; }
      var p = -rect.top / span;
      target = Math.min(1, Math.max(0, p));
    }

    function smoothstep(p) { return p * p * (3 - 2 * p); }

    function apply(p) {
      var e = smoothstep(p);

      if (videoReady) {
        /* Frote "play-toward-target": hacia adelante el video SE
           REPRODUCE a velocidad variable (decodificación secuencial,
           sedosa con cualquier codificación); hacia atrás se busca
           (seek) esperando a que cada búsqueda termine. En reposo
           (target alcanzado) el video queda pausado y quieto. */
        var t = e * Math.max(0, video.duration - 0.05);
        var delta = t - video.currentTime;

        // Histéresis: pausa cerca del objetivo, retoma solo con
        // distancia suficiente (evita el aleteo pausa/reproducción)
        if (Math.abs(delta) <= 0.05 || (video.paused && delta > 0 && delta < 0.15)) {
          if (!video.paused) video.pause();
        } else if (delta > 0) {
          video.playbackRate = Math.min(Math.max(delta * 3, 0.2), 8);
          if (video.paused) video.play().catch(function () {});
        } else {
          if (!video.paused) video.pause();
          if (!seekPending) {
            seekPending = true;
            // Saltos grandes hacia atrás: fastSeek (al keyframe más
            // cercano, veloz); ajuste final: seek preciso.
            if (typeof video.fastSeek === 'function' && delta < -0.5) {
              video.fastSeek(t);
            } else {
              video.currentTime = t;
            }
          }
        }
      } else {
        night.style.opacity = e;
        tint.style.opacity = e * 0.62;
      }
    }

    function frame() {
      if (!running) return;
      computeTarget();
      current += (target - current) * 0.09;
      if (Math.abs(target - current) < 0.0006) current = target;
      apply(current);
      requestAnimationFrame(frame);
    }

    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) {
        running = true;
        requestAnimationFrame(frame);
      } else if (!visible) {
        running = false;
      }
    }).observe(runway);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
