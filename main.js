(function () {
  // Mobile menu
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (header && btn && nav) {
    var setOpen = function (open) {
      nav.setAttribute('data-open', open ? 'true' : 'false');
      header.setAttribute('data-menu', open ? 'open' : 'closed');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    setOpen(false);
    btn.addEventListener('click', function () {
      setOpen(nav.getAttribute('data-open') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Publication filter
  var filterBtns = document.querySelectorAll('.filters button');
  if (filterBtns.length) {
    var pubs = document.querySelectorAll('.pub');
    var groups = document.querySelectorAll('.year-group');
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        pubs.forEach(function (p) {
          p.hidden = !(f === 'all' || p.getAttribute('data-type') === f);
        });
        groups.forEach(function (g) {
          g.hidden = !g.querySelector('.pub:not([hidden])');
        });
      });
    });
  }

  // Copy e-mail address
  document.querySelectorAll('.copy-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = b.getAttribute('data-done') || 'Copied';
      var label = b.textContent;
      var ok = function () { b.textContent = done; setTimeout(function () { b.textContent = label; }, 1600); };
      var fallback = function () {
        var code = b.parentNode.querySelector('code');
        if (code && window.getSelection) {
          var r = document.createRange(); r.selectNodeContents(code);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        }
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok, fallback);
        } else { fallback(); }
      } catch (e) { fallback(); }
    });
  });

  // Hero animation: pause/play button, and no autoplay for reduced-motion users
  document.querySelectorAll('.anim-frame').forEach(function (fr) {
    var v = fr.querySelector('video');
    var b = fr.querySelector('.anim-toggle');
    if (!v || !b) return;
    var set = function () { b.textContent = v.paused ? b.getAttribute('data-label-play') : b.getAttribute('data-label-pause'); };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); v.load(); }
    b.addEventListener('click', function () {
      if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
    });
    v.addEventListener('play', set);
    v.addEventListener('pause', set);
    set();
  });
})();
