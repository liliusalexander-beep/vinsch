# Talja, Marketing Website

Production-ready single-page marketing site for **Talja AB**, a Stockholm-based IT partner helping small and medium-sized businesses adopt AI: websites, internal AI tools, automation and ongoing IT support. Static HTML/CSS/JS, no build step, no framework lock-in.

The name comes from the Swedish word talja, a block and tackle. A small force lifting a heavy load is the whole brand idea: technology as mechanical advantage.

## Files

- `index.html`: full site (semantic HTML, JSON-LD ProfessionalService schema, OG/meta tags, inline SVG logo)
- `style.css`: design system (warm paper/ink/amber palette, fluid type scale, light + dark themes, all components and motion styles)
- `base.css`: CSS reset
- `app.js`: bilingual engine, preloader, Lenis smooth scroll, GSAP scroll animations, theme toggle, language toggle, mobile nav, custom cursor, magnetic buttons, hero rope canvas, service image peek, FAQ accordion, form validation + submission (honeypot + endpoint/mailto)
- `i18n.js`: full Swedish + English dictionary (`window.TALJA_I18N`), keyed to `data-i18n` / `data-i18n-html` attributes
- `favicon.svg`: pulley logo mark
- `robots.txt`, `sitemap.xml`: SEO crawl files
- `assets/`: generated images
  - `hero.webp` (pulley lifting a stone cube)
  - `flow.webp` (rope band)
  - `studio.webp` (workshop band)
  - `svc-web.webp`, `svc-tools.webp`, `svc-auto.webp`, `svc-support.webp` (service hover images)
  - `og.jpg` (social share card)
  - `fonts/`: self-hosted woff2 (Clash Display 500/600/700, Satoshi 400/500/700)

## Languages

The site is fully bilingual, Swedish by default with an English toggle in the header.

- Every visible string lives in `i18n.js` under flat keys (e.g. `hero.lede`, `svc.1.t`). HTML markup in copy uses `data-i18n-html`; everything else uses `data-i18n`.
- The chosen language is stored in the `talja-lang` cookie and applied before paint by a small inline script in `index.html` (sets `<html lang>`), so there is no flash of the wrong language.
- To edit copy, change the value in both `sv` and `en` blocks of `i18n.js`. To add a string, add the key in both blocks and reference it with `data-i18n="your.key"` in `index.html`.
- Missing keys are logged to the console as `i18n missing [lang]: key` during development.

## Fonts

Fonts are self-hosted as woff2 in `assets/fonts/` and declared via `@font-face` in `style.css` (no third-party CDN, so no IP leak to a font host, which keeps the site GDPR-clean for an EU audience). The two most critical weights are preloaded in `index.html`. `font-display: swap` keeps text visible during load.

## Run locally

Any static server works:

```bash
cd talja-site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

The site is a static bundle. Drag-and-drop or CLI deploy to any static host.

**Netlify**

```bash
npx netlify-cli deploy --prod --dir .
```

Or drag the folder onto app.netlify.com/drop.

**Vercel**

```bash
npx vercel --prod
```

Or import the folder/repo at vercel.com. No framework preset needed (select "Other"), no build command, output directory is the project root.

## Contact form

The form ships backend-free and conversion-ready:

- Inline validation with language-aware error messages.
- A honeypot field (`#fWebsite`, named `website`, hidden off-screen). If a bot fills it, the submission is silently dropped.
- A success panel that confirms receipt without depending on the mail client.

By default, on a valid submit it opens a prefilled email draft to `hello@talja.se` via `mailto:`, so it works on any static host with zero configuration.

To switch to a hosted form backend (recommended for production), no rewrite is needed:

1. Create a form at [Formspree](https://formspree.io) or [Formspark](https://formspark.io) and copy the endpoint URL.
2. In `app.js`, set `var FORM_ENDPOINT = 'https://...';` near the form handler.
3. The form then POSTs the fields as JSON via `fetch`, shows the success panel on a 2xx response, and falls back to an inline error if the request fails. Validation, honeypot and success UI are unchanged.

## Notes

- Contact details (hello@talja.se, 08-410 244 60, Vasagatan 28) are invented placeholders. Replace before launch.
- Testimonials are clearly labeled example quotes, to be replaced with real case studies.
- Fonts are self-hosted (Clash Display + Satoshi) for GDPR strictness and speed.
- All motion respects `prefers-reduced-motion`.
- Theme and language preferences persist via cookies (no localStorage), so the site behaves correctly inside sandboxed preview iframes.
- The name should be legally cleared (Bolagsverket and trademark search) before launch.
