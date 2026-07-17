#!/usr/bin/env python3
"""
Casa Kaypa · Sincronización del calendario de Airbnb
Descarga el iCal privado de Airbnb (URL en el secreto AIRBNB_ICAL_URL)
y escribe una copia FILTRADA en site/assets/data/availability.ics con
solo las fechas ocupadas (DTSTART/DTEND) y SUMMARY:Reserved.

Por qué se filtra: el .ics real de Airbnb puede incluir nombres de
huéspedes, códigos de confirmación u otros detalles en SUMMARY/
DESCRIPTION. El repo es público, así que nunca se guarda ese texto
crudo — solo las fechas bloqueadas, que es lo único que el calendario
de la web necesita mostrar.

El archivo de salida usa el mismo formato iCal simple que ya entiende
site/js/availability.js (parseICS), así que no hace falta tocar ese
parser.
"""

import os
import re
import sys
import urllib.request
from datetime import date, datetime

ICAL_URL = os.environ.get("AIRBNB_ICAL_URL", "").strip()
OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "site", "assets", "data", "availability.ics"
)


def fetch_ical(url):
    req = urllib.request.Request(url, headers={"User-Agent": "CasaKaypa-Sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def unfold(text):
    # RFC 5545: una línea continuada empieza con espacio/tab
    return re.sub(r"\r?\n[ \t]", "", text)


def extract_date(value):
    m = re.match(r"^(\d{4})(\d{2})(\d{2})", value)
    if not m:
        return None
    return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))


def parse_events(text):
    """Devuelve [(start_date, end_date)] solo con fechas, sin ningún
    otro dato del evento (nombres, notas, códigos de reserva, etc.)."""
    lines = unfold(text).split("\n")
    events = []
    in_event = False
    start = None
    end = None

    for raw in lines:
        line = raw.strip()
        if line == "BEGIN:VEVENT":
            in_event = True
            start = None
            end = None
        elif line == "END:VEVENT":
            if in_event and start:
                events.append((start, end or start))
            in_event = False
        elif in_event and ":" in line:
            prop, _, value = line.partition(":")
            prop = prop.split(";")[0].upper()
            if prop == "DTSTART":
                start = extract_date(value)
            elif prop == "DTEND":
                end = extract_date(value)

    return events


def build_filtered_ics(events, generated_at):
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//CasaKaypa//AvailabilitySync//ES",
        "X-GENERATED-AT:" + generated_at,
    ]
    for i, (start, end) in enumerate(events):
        lines += [
            "BEGIN:VEVENT",
            "UID:sync-" + str(i) + "@casakaypa",
            "DTSTART;VALUE=DATE:" + start.strftime("%Y%m%d"),
            "DTEND;VALUE=DATE:" + end.strftime("%Y%m%d"),
            "SUMMARY:Reserved",
            "END:VEVENT",
        ]
    lines.append("END:VCALENDAR")
    return "\r\n".join(lines) + "\r\n"


def main():
    if not ICAL_URL:
        print("AIRBNB_ICAL_URL no configurado — nada que sincronizar.", file=sys.stderr)
        sys.exit(1)

    raw = fetch_ical(ICAL_URL)
    events = parse_events(raw)
    if not events:
        print("Aviso: el iCal de Airbnb no devolvió eventos (¿URL correcta?).", file=sys.stderr)

    generated_at = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    filtered = build_filtered_ics(events, generated_at)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8", newline="") as f:
        f.write(filtered)

    print(f"OK: {len(events)} rango(s) ocupado(s) escritos en {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
