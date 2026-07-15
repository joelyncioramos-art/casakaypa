# Casa Kaypa

Sitio web de **Casa Kaypa** — refugio de campo boutique en Santa Eulalia, Lima (a 2 horas de la ciudad).

## Estructura

- [`site/`](site) — el sitio web (HTML/CSS/JS estático, sin build). Abrir `site/index.html` o servir la carpeta con cualquier servidor estático.
- [`design-system/`](design-system) — sistema de diseño de la marca: tokens (colores, tipografía, espaciado, motion), componentes y lineamientos.

## Stack

100% estático: HTML + CSS + JavaScript vanilla. Sin dependencias ni paso de build.

Características principales:

- **Hero cinemático día→noche**: el scroll "frota" un video generado (Higgsfield/Seedance) con entrega adaptativa (4K en escritorio, 720p en móvil).
- **Rotor de palabras** en el titular del hero.
- **Aparición de texto reversible** palabra por palabra al scrollear (port vanilla de "TextEffect" de motion-primitives).
- Tipografía **Boska**, paleta marfil/carbón/salvia según el sistema de diseño.
