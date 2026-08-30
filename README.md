# Talja, webbplats

Statisk enkelsidig webbplats för Talja: AI-rådgivning, webbutveckling och tech-konsulting för tech-, SaaS- och digitala produktbolag i Sverige och Finland.

## Innehåll

- `index.html`: hela sidans struktur, svensk grundtext
- `i18n.js`: ordbok med svenska, finska och engelska
- `app.js`: språkväxling, tema, animationer, formulärlogik
- `style.css`, `base.css`: stilar med ljust och mörkt tema
- `assets/`: bilder och typsnitt

## Språk

Tre språk: svenska (standard), finska och engelska. Språkval sparas i cookie `talja-lang`. Växlaren i sidhuvudet cyklar sv, fi, en.

## Kontakt och formulär

Formuläret öppnar besökarens e-postprogram med ett förifyllt meddelande till lilius.alexander@gmail.com. Vill du senare skicka i bakgrunden, sätt `FORM_ENDPOINT` i `app.js` till en POST-URL, till exempel Formspree.

## Uppdatera innehåll

All synlig text finns i `i18n.js` under nycklar per språk. Ändra texten i alla tre språk samtidigt så att versionerna hålls i synk. Ingen påhittad information: inga kundcase, siffror, adresser eller telefonnummer får läggas till utan underlag.
