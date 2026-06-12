/* Klarbyte — interactions */
(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  var SUN =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  var MOON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function applyTheme() {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.innerHTML = theme === 'dark' ? SUN : MOON;
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    }
  }
  applyTheme();
  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme();
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var burger = document.getElementById('navBurger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    var fields = ['name', 'company', 'email', 'need', 'message'];

    function setError(key, show) {
      var input = form.querySelector('[name="' + key + '"]');
      var err = document.getElementById('err-' + key);
      if (input) input.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (err) err.classList.toggle('is-visible', show);
    }

    function validate() {
      var ok = true;
      fields.forEach(function (key) {
        var input = form.querySelector('[name="' + key + '"]');
        var value = input ? input.value.trim() : '';
        var valid = value.length > 0;
        if (key === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setError(key, !valid);
        if (!valid) ok = false;
      });
      return ok;
    }

    fields.forEach(function (key) {
      var input = form.querySelector('[name="' + key + '"]');
      if (input) {
        input.addEventListener('input', function () {
          setError(key, false);
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      var subject = 'Quote request — ' + data.get('company');
      var body =
        'Hi Klarbyte,\n\n' +
        'I would like a quote.\n\n' +
        'Name: ' + data.get('name') + '\n' +
        'Company: ' + data.get('company') + '\n' +
        'Email: ' + data.get('email') + '\n' +
        (data.get('phone') ? 'Phone: ' + data.get('phone') + '\n' : '') +
        'Area: ' + data.get('need') + '\n\n' +
        'About the project:\n' + data.get('message') + '\n';

      /* Open a pre-filled email draft (works without any backend).
         Swap for a Formspree/Formspark POST in production — see README. */
      window.location.href =
        'mailto:hello@klarbyte.se?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      var success = document.getElementById('formSuccess');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.querySelector('button[type="submit"]').textContent = 'Sent — check your email app';
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
