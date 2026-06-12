# Talja, Marketing Website

Production-ready single-page marketing site for **Talja AB**, a Stockholm-based IT partner helping small and medium-sized businesses adopt AI: websites, internal AI tools, automation and ongoing IT support. Static HTML/CSS/JS, no build step, no framework lock-in.

The name comes from the Swedish word talja, a block and tackle. A small force lifting a heavy load is the whole brand idea: technology as mechanical advantage.

## Files

- `index.html`: full site (semantic HTML, JSON-LD ProfessionalService schema, OG/meta tags, inline SVG logo)
- `style.css`: design system (warm paper/ink/amber palette, fluid type scale, light + dark themes, all components and motion styles)
- `base.css`: CSS reset
- `app.js`: preloader, Lenis smooth scroll, GSAP scroll animations, theme toggle, mobile nav, custom cursor, magnetic buttons, hero rope canvas, service image peek, FAQ accordion, form validation + submission
- `favicon.svg`: pulley logo mark
- `assets/`: generated images
  - `hero.webp` (pulley lifting a stone cube)
  - `flow.webp` (rope band)
  - `studio.webp` (workshop band)
  - `svc-web.webp`, `svc-tools.webp`, `svc-auto.webp`, `svc-support.webp` (service hover images)
  - `og.jpg` (social share card)

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

The form ships backend-free: on submit it validates, then opens a prefilled email draft to `hello@talja.se` via `mailto:`, so it works on any static host with zero configuration.

To switch to a hosted form backend (recommended for production):

1. Create a form at [Formspree](https://formspree.io) or [Formspark](https://formspark.io) and copy the endpoint URL.
2. In `app.js`, replace the `mailto:` submission block with a `fetch` POST of the form fields to that endpoint.
3. Keep the existing validation and success panel. Only the transport changes.

## Notes

- Contact details (hello@talja.se, 08-410 244 60, Vasagatan 28) are invented placeholders. Replace before launch.
- Testimonials are clearly labeled example quotes, to be replaced with real case studies.
- Fonts load from the Fontshare CDN (Clash Display + Satoshi). Self-host for full GDPR strictness.
- All motion respects `prefers-reduced-motion`.
- The name should be legally cleared (Bolagsverket and trademark search) before launch.
