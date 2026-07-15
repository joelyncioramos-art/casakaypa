/* ============================================================
   Casa Kaypa · Calendario de disponibilidad (solo lectura)
   Sincronizado con Airbnb mediante iCal (.ics).

   CÓMO CONECTAR EL CALENDARIO REAL:
   1. En Airbnb: Calendario > Disponibilidad > Exportar calendario.
   2. Pegar el enlace .ics en AIRBNB_ICAL_URL (abajo).
   3. Nota: Airbnb no envía cabeceras CORS, por lo que el
      navegador puede bloquear la petición directa. En producción
      se recomienda un pequeño proxy propio (o un worker) que
      reenvíe el .ics; basta con apuntar AIRBNB_ICAL_URL a ese
      proxy. Si la petición falla, el calendario usa los datos
      de ejemplo y lo indica en la consola.

   Mientras AIRBNB_ICAL_URL esté vacío se usan datos de ejemplo
   (MOCK) generados en formato iCal real, de modo que el parser
   se ejercita de extremo a extremo y la arquitectura queda lista.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Configuración ---------- */
  var AIRBNB_ICAL_URL = ''; // ← pegar aquí el enlace iCal de Airbnb (o del proxy)
  var MONTHS_MAX = 12;      // horizonte máximo de navegación

  // Meses visibles a la vez: 1 en móvil (una sola vista, se navega con las
  // flechas), 2 en pantallas más anchas.
  var mqOneMonth = window.matchMedia('(max-width: 640px)');
  function monthsShown() { return mqOneMonth.matches ? 1 : 2; }

  /* ---------- Utilidades de fecha ---------- */
  function atMidnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function toICSDate(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return '' + d.getFullYear() + m + day;
  }

  function addDays(d, n) {
    var out = new Date(d);
    out.setDate(out.getDate() + n);
    return out;
  }

  /* ---------- Datos de ejemplo (formato iCal real) ---------- */
  function buildMockICS() {
    var today = atMidnight(new Date());
    // Rangos relativos a hoy para que el ejemplo siempre se vea vivo.
    // DTEND es exclusivo, igual que en los .ics reales de Airbnb.
    var ranges = [
      [3, 6],   // escapada corta
      [14, 17], // fin de semana largo
      [21, 28], // semana completa
      [38, 41],
      [52, 59]
    ];
    var events = ranges.map(function (r, i) {
      return [
        'BEGIN:VEVENT',
        'UID:mock-' + i + '@casakaypa',
        'DTSTART;VALUE=DATE:' + toICSDate(addDays(today, r[0])),
        'DTEND;VALUE=DATE:' + toICSDate(addDays(today, r[1])),
        'SUMMARY:Reserved',
        'END:VEVENT'
      ].join('\r\n');
    });
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CasaKaypa//MockCalendar//ES',
      events.join('\r\n'),
      'END:VCALENDAR'
    ].join('\r\n');
  }

  /* ---------- Parser iCal ---------- */
  /* Devuelve [{ start: Date, end: Date }] con end EXCLUSIVO,
     a partir de los VEVENT de un texto .ics (formato Airbnb). */
  function parseICS(text) {
    // Desdoblar líneas continuadas (RFC 5545: CRLF + espacio/tab)
    var unfolded = text.replace(/\r?\n[ \t]/g, '');
    var lines = unfolded.split(/\r?\n/);

    var ranges = [];
    var inEvent = false;
    var start = null;
    var end = null;

    function parseDateValue(value) {
      // Acepta YYYYMMDD y YYYYMMDDTHHMMSS(Z)
      var m = value.match(/^(\d{4})(\d{2})(\d{2})/);
      if (!m) return null;
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    }

    lines.forEach(function (line) {
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        start = null;
        end = null;
      } else if (line === 'END:VEVENT') {
        if (inEvent && start) {
          // Sin DTEND: evento de un día (end exclusivo = start + 1)
          ranges.push({ start: start, end: end || addDays(start, 1) });
        }
        inEvent = false;
      } else if (inEvent) {
        var idx = line.indexOf(':');
        if (idx === -1) return;
        var prop = line.slice(0, idx).split(';')[0].toUpperCase();
        var value = line.slice(idx + 1).trim();
        if (prop === 'DTSTART') start = parseDateValue(value);
        if (prop === 'DTEND') end = parseDateValue(value);
      }
    });

    return ranges;
  }

  /* ---------- Estado ---------- */
  var root = document.querySelector('[data-availability]');
  if (!root) return;

  var monthsEl = root.querySelector('[data-cal-months]');
  var prevBtn = root.querySelector('[data-cal-prev]');
  var nextBtn = root.querySelector('[data-cal-next]');

  var today = atMidnight(new Date());
  var blockedRanges = [];
  var offset = 0; // primer mes visible, relativo al mes actual

  function isBlocked(day) {
    for (var i = 0; i < blockedRanges.length; i++) {
      if (day >= blockedRanges[i].start && day < blockedRanges[i].end) return true;
    }
    return false;
  }

  /* ---------- Render ---------- */
  var monthFormatter = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' });
  var dayFormatter = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  var WEEKDAYS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderMonth(base) {
    var first = new Date(base.getFullYear(), base.getMonth(), 1);
    var daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    // Semana empieza en lunes: getDay() 0=dom → 6 celdas de relleno
    var lead = (first.getDay() + 6) % 7;

    var month = document.createElement('div');
    month.className = 'cal-month';

    var title = document.createElement('h4');
    title.className = 'cal-month__title';
    title.textContent = capitalize(monthFormatter.format(first));
    month.appendChild(title);

    var grid = document.createElement('div');
    grid.className = 'cal-month__grid';

    WEEKDAYS.forEach(function (w) {
      var h = document.createElement('span');
      h.className = 'cal-day cal-day--head';
      h.setAttribute('aria-hidden', 'true');
      h.textContent = w;
      grid.appendChild(h);
    });

    for (var i = 0; i < lead; i++) {
      var pad = document.createElement('span');
      pad.className = 'cal-day cal-day--pad';
      pad.setAttribute('aria-hidden', 'true');
      grid.appendChild(pad);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var day = new Date(base.getFullYear(), base.getMonth(), d);
      var cell = document.createElement('span');
      cell.className = 'cal-day';
      cell.textContent = String(d);

      var state = 'disponible';
      if (day < today) {
        cell.classList.add('is-past');
        state = 'fecha pasada';
      } else if (isBlocked(day)) {
        cell.classList.add('is-blocked');
        state = 'ocupado';
      }
      if (day.getTime() === today.getTime()) cell.classList.add('is-today');

      cell.setAttribute('aria-label', dayFormatter.format(day) + ': ' + state);
      grid.appendChild(cell);
    }

    month.appendChild(grid);
    return month;
  }

  function render() {
    var shown = monthsShown();
    monthsEl.textContent = '';
    for (var i = 0; i < shown; i++) {
      var base = new Date(today.getFullYear(), today.getMonth() + offset + i, 1);
      monthsEl.appendChild(renderMonth(base));
    }
    prevBtn.disabled = offset <= 0;
    nextBtn.disabled = offset + shown >= MONTHS_MAX;
  }

  prevBtn.addEventListener('click', function () {
    offset = Math.max(0, offset - monthsShown());
    render();
  });

  nextBtn.addEventListener('click', function () {
    offset = Math.min(MONTHS_MAX - monthsShown(), offset + monthsShown());
    render();
  });

  // Al cambiar entre 1 y 2 meses visibles (rotar/redimensionar), re-render y
  // ajustar el offset para no exceder el horizonte máximo.
  mqOneMonth.addEventListener('change', function () {
    offset = Math.min(offset, Math.max(0, MONTHS_MAX - monthsShown()));
    render();
  });

  /* ---------- Carga de datos ---------- */
  function useMock(reason) {
    if (reason) {
      console.info('Calendario Casa Kaypa: usando datos de ejemplo (' + reason + ').');
    }
    blockedRanges = parseICS(buildMockICS());
    render();
  }

  if (AIRBNB_ICAL_URL) {
    fetch(AIRBNB_ICAL_URL, { mode: 'cors' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        blockedRanges = parseICS(text);
        render();
      })
      .catch(function (err) {
        // Probable bloqueo CORS de Airbnb: ver nota de cabecera.
        useMock('no se pudo leer el iCal: ' + err.message);
      });
  } else {
    useMock();
  }
})();
