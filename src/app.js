/* Vinsch · Koncept B interactions */
(function () {
  'use strict';

  var doc = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = motionQuery.matches;

  /* cookie-based prefs (storage APIs are unavailable in some embeds) */
  function readPref(k) {
    try { var m = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; }
  }
  function writePref(k, v, persist) {
    try { document.cookie = k + '=' + encodeURIComponent(v) + '; path=/; SameSite=Lax' + (persist ? '; max-age=31536000' : ''); } catch (e) {}
  }

  /* ---------- i18n (English default, Swedish and Finnish) ---------- */
  var I18N = window.VINSCH_I18N || { sv: {}, fi: {}, en: {} };
  var LANGS = ['en', 'sv', 'fi'];
  var lang = (LANGS.indexOf(doc.lang) >= 0) ? doc.lang : 'en';
  var themeToggle = document.getElementById('themeToggle');

  function tr(key) {
    var d = I18N[lang];
    return (d && d[key] != null) ? d[key] : key;
  }
  function setNode(el, val) {
    if (/[<&]/.test(val)) el.innerHTML = val; else el.textContent = val;
  }
  function warnMissing(k) {
    if (window.console && console.warn) console.warn('i18n missing [' + lang + ']:', k);
  }
  function applyI18n() {
    var dict = I18N[lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] != null) setNode(el, dict[k]); else warnMissing(k);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (dict[k] != null) el.innerHTML = dict[k]; else warnMissing(k);
    });
    document.querySelectorAll('[data-i18n-arialabel]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-arialabel');
      if (dict[k] != null) el.setAttribute('aria-label', dict[k]); else warnMissing(k);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-alt');
      if (dict[k] != null) el.setAttribute('alt', dict[k]); else warnMissing(k);
    });
    if (dict['meta.title']) document.title = dict['meta.title'];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict['meta.desc']) metaDesc.setAttribute('content', dict['meta.desc']);
    doc.lang = lang;
    var lt = document.getElementById('langToggle');
    if (lt) {
      lt.setAttribute('title', dict['aria.lang'] || 'Switch language');
      lt.querySelectorAll('.lang-toggle__opt').forEach(function (opt) {
        var active = opt.getAttribute('data-lang') === lang;
        opt.classList.toggle('is-active', active);
        if (active) opt.setAttribute('aria-current', 'true'); else opt.removeAttribute('aria-current');
      });
    }
    var bg = document.getElementById('burger');
    if (bg) bg.setAttribute('aria-label', bg.getAttribute('aria-expanded') === 'true' ? tr('aria.menuClose') : tr('aria.menuOpen'));
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', doc.dataset.theme === 'dark' ? tr('aria.themeToLight') : tr('aria.themeToDark'));
    }
    /* stats already counted up keep their final value; the dictionary value is the source of truth */
    document.querySelectorAll('.stat__num[data-count]').forEach(function (n) { n.dataset.final = n.textContent.trim(); });
  }

  /* ---------- theme ---------- */
  function setTheme(mode) {
    doc.dataset.theme = mode;
    writePref('vinsch-theme', mode, true);
    if (themeToggle) themeToggle.setAttribute('aria-label', mode === 'dark' ? tr('aria.themeToLight') : tr('aria.themeToDark'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#171411' : '#EDE7DA');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(doc.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- language toggle (direct choice: en / sv / fi) ---------- */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function (e) {
      var opt = e.target.closest('.lang-toggle__opt');
      if (!opt) return;
      var next = opt.getAttribute('data-lang');
      if (LANGS.indexOf(next) < 0 || next === lang) return;
      lang = next;
      writePref('vinsch-lang', lang, true);
      applyI18n();
    });
  }
  applyI18n();

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- header: transparent over the hero, solid after ---------- */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  function setHeaderState(scrolled) { header.classList.toggle('is-scrolled', scrolled); }
  if (hero && 'IntersectionObserver' in window) {
    var heroObs = new IntersectionObserver(function (entries) {
      setHeaderState(!entries[0].isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 });
    heroObs.observe(hero);
  } else {
    var onScrollHeader = function () { setHeaderState(window.scrollY > (hero ? hero.offsetHeight - 72 : 12)); };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeNav() {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', tr('aria.menuOpen'));
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? tr('aria.menuClose') : tr('aria.menuOpen'));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); burger.focus(); }
  });
  /* brand link: straight to the top */
  document.querySelectorAll('a[href="#top"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      closeNav();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- service links preselect the form topic ---------- */
  document.querySelectorAll('a[data-topic]').forEach(function (hit) {
    hit.addEventListener('click', function () {
      var sel = document.getElementById('fTopic');
      if (sel) {
        sel.value = hit.getAttribute('data-topic');
        setErr(sel, '');
      }
    });
  });

  /* ---------- scroll reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revObs.observe(el); });
    /* safety net: anything still hidden after load settles becomes visible */
    setTimeout(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 1500);
  }

  /* ---------- parallax drift on duotone surfaces (max 8 percent) ---------- */
  var parallaxItems = [];
  if (!reduceMotion) {
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      var box = img.parentElement;
      parallaxItems.push({ img: img, box: box, strength: parseFloat(img.getAttribute('data-parallax')) || 0.06 });
    });
  }
  var ticking = false;
  function updateParallax() {
    ticking = false;
    var vh = window.innerHeight;
    parallaxItems.forEach(function (it) {
      var r = it.box.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      /* progress 0 when box enters at the bottom, 1 when it leaves at the top */
      var p = (vh - r.top) / (vh + r.height);
      var y = (p - 0.5) * 2 * it.strength * r.height;
      it.img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }
  function requestParallax() { if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); } }
  if (parallaxItems.length) {
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
    updateParallax();
  }

  /* ---------- stats count up once ---------- */
  var statNums = document.querySelectorAll('.stat__num[data-count]');
  if (statNums.length && !reduceMotion && 'IntersectionObserver' in window) {
    var counted = false;
    function countUp(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var finalText = el.dataset.final || String(target);
      var dur = 1400, start = null;
      function frame(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(frame); else el.textContent = finalText;
      }
      requestAnimationFrame(frame);
    }
    var statObs = new IntersectionObserver(function (entries) {
      if (counted) return;
      if (entries.some(function (en) { return en.isIntersecting; })) {
        counted = true;
        statNums.forEach(countUp);
        statObs.disconnect();
      }
    }, { threshold: 0.4 });
    statObs.observe(document.querySelector('.case__stats'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.qa').forEach(function (qa) {
    var btn = qa.querySelector('.qa__q');
    btn.addEventListener('click', function () {
      var open = qa.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- form ---------- */
  var form = document.getElementById('quoteForm');
  var success = document.getElementById('formSuccess');

  function setErr(input, msg) {
    var field = input.closest('.form__field');
    if (!field) return;
    field.classList.toggle('has-error', !!msg);
    field.querySelector('.form__err').textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  function validate() {
    var ok = true;
    var name = form.name, email = form.email, topic = form.topic, msg = form.message;
    if (!name.value.trim()) { setErr(name, tr('err.name')); ok = false; } else setErr(name, '');
    if (!email.value.trim()) { setErr(email, tr('err.email')); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setErr(email, tr('err.emailBad')); ok = false; }
    else setErr(email, '');
    if (!topic.value) { setErr(topic, tr('err.topic')); ok = false; } else setErr(topic, '');
    if (!msg.value.trim()) { setErr(msg, tr('err.msg')); ok = false; } else setErr(msg, '');
    return ok;
  }
  ['input', 'change'].forEach(function (evt) {
    form.addEventListener(evt, function (e) {
      var f = e.target.closest('.form__field');
      if (f && f.classList.contains('has-error')) validate();
    });
  });

  /* Background submission via FormSubmit AJAX. If the request fails, the form
     falls back to opening the visitor's mail client. */
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/alexander@vinsch.ai';

  function showSuccess() {
    success.hidden = false;
    success.setAttribute('tabindex', '-1');
    success.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* honeypot: real people never fill this hidden field */
    if (form.website && form.website.value.trim() !== '') { return; }
    if (!validate()) {
      var firstErr = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstErr) firstErr.focus();
      return;
    }
    var d = form;
    var topicSel = d.topic;
    var topicLabel = (topicSel.selectedOptions && topicSel.selectedOptions[0]) ? topicSel.selectedOptions[0].textContent.trim() : topicSel.value;
    var payload = {
      name: d.name.value.trim(),
      company: d.company.value.trim(),
      email: d.email.value.trim(),
      topic: topicLabel,
      message: d.message.value.trim(),
      locale: lang,
      _subject: tr('form.mailSubject'),
      _replyto: d.email.value.trim(),
      _template: 'table',
      _captcha: 'false'
    };
    var submitBtn = form.querySelector('.form__submit');

    if (FORM_ENDPOINT) {
      if (submitBtn) submitBtn.disabled = true;
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        form.reset();
        showSuccess();
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        setErr(form.message, tr('err.send'));
        form.message.focus();
      });
      return;
    }

    /* fallback: hand off to the mail client, then confirm honestly */
    var body = [
      tr('form.mailName') + ': ' + payload.name,
      tr('form.mailCompany') + ': ' + (payload.company || tr('form.mailNone')),
      tr('form.mailEmail') + ': ' + payload.email,
      tr('form.mailTopic') + ': ' + payload.topic,
      '',
      payload.message
    ].join('\n');
    var href = 'mailto:alexander@vinsch.ai?subject=' +
      encodeURIComponent(tr('form.mailSubject')) +
      '&body=' + encodeURIComponent(body);
    window.location.href = href;
    showSuccess();
  });
})();
