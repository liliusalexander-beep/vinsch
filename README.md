# Vinsch, webbplats

Statisk enkelsidig webbplats för Vinsch: webbutveckling, AI-rådgivning och apputveckling för små och medelstora företag i Norden.

Teknik: vanilla HTML, CSS och JavaScript. GSAP med ScrollTrigger och Lenis smooth scrolling, självhostade typsnitt (Clash Display, Satoshi), generativ rep-canvas i hero.

Tre språk: engelska (standard), svenska och finska. Språkval sparas i cookie `vinsch-lang`.

Tema: ljust är standard (palett "dawn", `data-light-palette="dawn"`, bakgrund #F7F8FA, accenter rosa #C2607E och ljusblå #E0EDF9). Mörkt tema (bakgrund #151A21, mörkblå och mörkgrå ytor, rosa och ljusblå accenter) väljs med temaknappen och sparas i cookie `vinsch-theme`. Systemets prefers-color-scheme läses inte.

Tjänsterna visas som tre accordionpaneler (en öppen åt gången, knappar med aria-expanded och aria-controls).

## Filer

- `index.html`: markup och all CSS inline.
- `src/app.js` och `src/i18n.js`: källkod. `app.js` och `i18n.js` i roten är minifierade byggen och ska inte redigeras för hand.
- `assets/`: bilder (avif och webp i flera bredder), typsnitt, og-bild.
- `qa/`: loggar över textändringar från kvalitetsgranskningar.

## Bygg

Ingen byggkedja krävs för drift. Efter ändringar i `src/` minifieras filerna med terser 5:

```
npx terser src/app.js -c -m -o app.js
npx terser src/i18n.js -c -m --format ascii_only=true -o i18n.js
```

Bumpa sedan `?v=N` på `app.js` och `i18n.js` i `index.html` (cache-busting).

## Drift

GitHub Pages från branchen `main`, rotkatalogen, med `CNAME` för vinsch.ai. DNS hos Cloudflare. Ändra inte CNAME, robots.txt eller sitemap.xml utan avstämning.
