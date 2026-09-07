/* Talja · interactions */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  /* cookie-based prefs (storage APIs are unavailable in some embeds) */
  function readPref(k) {
    try { var m = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; }
  }
  function writePref(k, v, persist) {
    try { document.cookie = k + '=' + encodeURIComponent(v) + '; path=/; SameSite=Lax' + (persist ? '; max-age=31536000' : ''); } catch (e) {}
  }

  /* ---------- i18n (English default, Swedish and Finnish) ---------- */
  var I18N = window.TALJA_I18N || { sv: {}, fi: {}, en: {} };
  var LANGS = ['en', 'sv', 'fi'];
  var lang = (LANGS.indexOf(doc.lang) >= 0) ? doc.lang : 'en';
  function tr(key) {
    var d = I18N[lang];
    return (d && d[key] != null) ? d[key] : key;
  }
  function setNode(el, val) {
    if (/[<&]/.test(val)) el.innerHTML = val; else el.textContent = val;
  }
  function applyI18n() {
    var dict = I18N[lang] || {};
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] != null) setNode(el, dict[k]);
      else if (window.console && console.warn) console.warn('i18n missing [' + lang + ']:', k);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (dict[k] != null) el.innerHTML = dict[k];
      else if (window.console && console.warn) console.warn('i18n missing [' + lang + ']:', k);
    });
    document.querySelectorAll('[data-i18n-arialabel]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-arialabel');
      if (dict[k] != null) el.setAttribute('aria-label', dict[k]);
      else if (window.console && console.warn) console.warn('i18n missing [' + lang + ']:', k);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-alt');
      if (dict[k] != null) el.setAttribute('alt', dict[k]);
      else if (window.console && console.warn) console.warn('i18n missing [' + lang + ']:', k);
    });
    if (dict['meta.title']) document.title = dict['meta.title'];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict['meta.desc']) metaDesc.setAttribute('content', dict['meta.desc']);
    doc.lang = lang;
    var lt = document.getElementById('langToggle');
    if (lt) {
      lt.setAttribute('title', dict['aria.lang'] || 'Switch language');
      lt.querySelectorAll('.lang-toggle__opt').forEach(function (opt) {
        opt.classList.toggle('is-active', opt.getAttribute('data-lang') === lang);
      });
    }
    var bg = document.getElementById('burger');
    if (bg) bg.setAttribute('aria-label', bg.getAttribute('aria-expanded') === 'true' ? tr('aria.menuClose') : tr('aria.menuOpen'));
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', doc.dataset.theme === 'dark' ? tr('aria.themeToLight') : tr('aria.themeToDark'));
    }
  }

  /* ---------- theme ---------- */
  var themeToggle = document.getElementById('themeToggle');
  function setTheme(mode) {
    doc.dataset.theme = mode;
    writePref('talja-theme', mode, true);
    themeToggle.setAttribute('aria-label', mode === 'dark' ? tr('aria.themeToLight') : tr('aria.themeToDark'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#171411' : '#F4F1EA');
  }
  themeToggle.addEventListener('click', function () {
    setTheme(doc.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  /* ---------- language toggle (direct choice: en / sv / fi) ---------- */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function (e) {
      var opt = e.target.closest('.lang-toggle__opt');
      if (!opt) return;
      var next = opt.getAttribute('data-lang');
      if (LANGS.indexOf(next) < 0 || next === lang) return;
      lang = next;
      writePref('talja-lang', lang, true);
      applyI18n();
    });
  }
  applyI18n();

  /* ---------- footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- header ---------- */
  var header = document.querySelector('.header');
  function onScrollHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeNav() {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', tr('aria.menuOpen'));
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? tr('aria.menuClose') : tr('aria.menuOpen'));
    if (open) { if (lenis) lenis.stop(); document.body.style.overflow = 'hidden'; }
    else { if (lenis) lenis.start(); document.body.style.overflow = ''; }
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  /* ---------- hero intro runs via CSS animations (see style.css intro-rise/intro-fade) ---------- */

  /* ---------- boot motion stack after DOM + scripts ---------- */
  window.addEventListener('DOMContentLoaded', function () {
    if (!reduceMotion && window.Lenis) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      doc.classList.add('lenis');
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      lenis.on('scroll', function () { if (window.ScrollTrigger) ScrollTrigger.update(); });
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('href');
          if (id.length < 2) return;
          var target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          if (nav.classList.contains('is-open')) { closeNav(); lenis.resize(); }
          lenis.scrollTo(target, { offset: -64, force: true });
        });
      });
    }

    function initScrollMotion() {
      gsap.registerPlugin(ScrollTrigger);

      /* parallax inside hero frame */
      gsap.to('.hero__frame img', {
        yPercent: 10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      /* full-bleed bands parallax */
      document.querySelectorAll('.band__img').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -8 }, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img.closest('.band, .band--studio') || img, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });

      /* rope draw across flow band */
      var rope = document.getElementById('ropePath');
      if (rope) {
        var len = rope.getTotalLength();
        rope.style.strokeDasharray = len;
        rope.style.strokeDashoffset = len;
        gsap.to(rope, {
          strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: '.band--flow', start: 'top 85%', end: 'bottom 35%', scrub: true }
        });
      }

      /* process progress bar + counter */
      var bar = document.getElementById('processBar');
      var nowEl = document.getElementById('processNow');
      var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
      if (bar) {
        gsap.to(bar, {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: '.process__steps', start: 'top 70%', end: 'bottom 55%', scrub: true,
            onUpdate: function (st) {
              var idx = Math.min(steps.length - 1, Math.floor(st.progress * steps.length));
              if (nowEl) nowEl.textContent = '0' + (idx + 1);
            }
          }
        });
      }
    }

    /* Init scroll-linked motion off the critical path to keep the main thread free during load */
    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
      if ('requestIdleCallback' in window) requestIdleCallback(initScrollMotion, { timeout: 1200 });
      else setTimeout(initScrollMotion, 250);
    }

    /* step activation (works with or without GSAP) */
    var stepObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-active', en.isIntersecting); });
    }, { rootMargin: '-35% 0px -45% 0px' });
    document.querySelectorAll('.step').forEach(function (s) { stepObs.observe(s); });

    /* reveals */
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

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

  /* ---------- custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    var cursor = document.querySelector('.cursor');
    var dot = cursor.querySelector('.cursor__dot');
    var ring = cursor.querySelector('.cursor__ring');
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('is-hidden');
      var on = e.target.closest('a, button, .qa__q, input, textarea, select, [data-magnetic]');
      cursor.classList.toggle('is-active', !!on);
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cursor.classList.add('is-hidden'); });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = 7;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- service hover peek ---------- */
  if (finePointer && !reduceMotion) {
    var peek = document.getElementById('svcPeek');
    var px = 0, py = 0, tx = 0, ty = 0, peekOn = false;
    document.querySelectorAll('.svc__row').forEach(function (row) {
      row.addEventListener('pointerenter', function () {
        peek.style.backgroundImage = 'url("' + row.dataset.img + '")';
        peek.classList.add('is-on'); peekOn = true;
      });
      row.addEventListener('pointerleave', function () {
        peek.classList.remove('is-on'); peekOn = false;
      });
    });
    document.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function peekLoop() {
      px += (tx - px) * 0.12; py += (ty - py) * 0.12;
      peek.style.left = (px + 28) + 'px';
      peek.style.top = (py - 160) + 'px';
      requestAnimationFrame(peekLoop);
    })();
  }

  /* ---------- rope canvas in hero ---------- */
  if (!reduceMotion) {
    var canvas = document.getElementById('ropeCanvas');
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var pointer = { x: -9999, y: -9999 };
    var LINES = 9, running = true;

    function sizeCanvas() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    canvas.parentElement.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    }, { passive: true });
    canvas.parentElement.addEventListener('pointerleave', function () { pointer.x = -9999; pointer.y = -9999; });

    var heroVis = new IntersectionObserver(function (en) { running = en[0].isIntersecting; }, { threshold: 0 });
    heroVis.observe(canvas);

    var t = 0;
    (function draw() {
      requestAnimationFrame(draw);
      if (!running) return;
      t += 0.0035;
      ctx.clearRect(0, 0, W, H);
      var ink = doc.dataset.theme === 'dark' ? '237,230,217' : '27,25,22';
      for (var i = 0; i < LINES; i++) {
        var baseY = (H / (LINES + 1)) * (i + 1);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + ink + ',' + (0.05 + (i % 3) * 0.012) + ')';
        ctx.lineWidth = 1;
        var SEG = 16;
        for (var s = 0; s <= SEG; s++) {
          var x = (W / SEG) * s;
          var wave = Math.sin(t * 2 + s * 0.55 + i * 0.9) * 14 + Math.sin(t * 1.2 + s * 0.3 + i * 2.1) * 8;
          var dx = x - pointer.x, dy = baseY - pointer.y;
          var d2 = dx * dx + dy * dy;
          var push = Math.max(0, 1 - d2 / 32000) * 26;
          var y = baseY + wave + (dy > 0 ? push : -push);
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    })();
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
    field.classList.toggle('has-error', !!msg);
    field.querySelector('.form__err').textContent = msg || '';
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
  /* Set FORM_ENDPOINT to a POST URL (e.g. a Formspree/Basin form or your own
     handler) to submit in the background via fetch. While it is empty, the form
     gracefully falls back to opening the visitor's mail client. */
  var FORM_ENDPOINT = '';

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
      locale: lang
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
    var href = 'mailto:lilius.alexander@gmail.com?subject=' +
      encodeURIComponent(tr('form.mailSubject')) +
      '&body=' + encodeURIComponent(body);
    window.location.href = href;
    showSuccess();
  });
})();
