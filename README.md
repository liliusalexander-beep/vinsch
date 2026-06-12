# Klarbyte — Marketing Website

Production-ready single-page marketing site for **Klarbyte AB**, a Stockholm-based IT support company helping small and medium-sized businesses adopt AI. Static HTML/CSS/JS — no build step, no framework, no dependencies.

## Stack

- `index.html` — full site (semantic HTML, JSON-LD ProfessionalService schema, OG/meta tags)
- `style.css` — design system (fluid type scale, light + dark themes, components, scroll animations)
- `base.css` — CSS reset
- `app.js` — theme toggle, sticky header, mobile nav, form validation + submission, footer year
- `favicon.svg` — logo mark
- `assets/` — generated images (hero.webp, office.webp, flow.webp, og.jpg)

Fonts (Cabinet Grotesk + Satoshi) load from the Fontshare CDN.

## Run locally

Any static file server works:

```bash
cd klarbyte-site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

The site is a static bundle — drag-and-drop or CLI deploy to any static host.

### Vercel

```bash
npm i -g vercel
cd klarbyte-site
vercel --prod
```

Or import the folder/repo at vercel.com — no framework preset needed (select "Other"), no build command, output directory is the project root.

### Netlify

```bash
npm i -g netlify-cli
cd klarbyte-site
netlify deploy --prod --dir .
```

Or drag the folder onto app.netlify.com/drop.

### After deploying

Update the canonical URL and OG URL in `index.html` (`<link rel="canonical">` and `og:url`) to your real domain.

## Contact form: production setup

The quote form currently works **without a backend**: on submit it validates inline, then opens a prefilled email draft to `hello@klarbyte.se` via `mailto:` and shows a success panel.

For production, swap to a form backend such as [Formspree](https://formspree.io) or [Formspark](https://formspark.io):

1. Create a form endpoint (e.g. `https://formspree.io/f/YOUR_ID`).
2. In `app.js`, replace the `mailto:` submission in the form handler with a `fetch` POST:

```js
const res = await fetch("https://formspree.io/f/YOUR_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify(data),
});
if (res.ok) showSuccess();
```

3. Keep the existing validation and success panel — only the transport changes.

## Placeholder content to replace before launch

All copy is finished writing, but these details were invented and should be replaced with real ones:

- Email `hello@klarbyte.se`, phone `08-410 244 60`, address Vasagatan 28, Stockholm
- Testimonials and client industries (clearly labeled as examples in the markup)
- Pricing guide figures in the FAQ
