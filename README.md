# Vinsch, webbplats

Statisk enkelsidig webbplats för Vinsch: webbutveckling, AI-rådgivning och apputveckling för små och medelstora företag i Norden.

Teknik: vanilla HTML, CSS och JavaScript. GSAP med ScrollTrigger och Lenis smooth scrolling, självhostade typsnitt (Clash Display, Satoshi), generativ rep-canvas i hero.

Tre språk: engelska (standard), svenska och finska. Språkval sparas i cookie `vinsch-lang`. Tema är mörkt som standard, ljust val sparas i cookie `vinsch-theme`.

Deploy: statiska filer, ingen byggkedja. Cache-busting via versionerade asset-URL:er (?v=N).
