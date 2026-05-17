/* ==================================================================
   Mohamed Imam — portfolio v3
   Interaction layer. Vanilla JS, no dependencies, no build step.
   ================================================================== */
(function () {
  "use strict";

  var doc = document;
  var win = window;
  var reduceMotion = win.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── 1. Year stamp ──────────────────────────────────────────── */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ─── 2. Loader → reveal hero ────────────────────────────────── */
  var loader = doc.querySelector(".loader");
  var counter = doc.querySelector(".loader__counter");

  function finishLoad() {
    doc.body.classList.add("is-loaded");
    if (loader) loader.classList.add("is-done");
  }

  if (reduceMotion) {
    finishLoad();
  } else {
    // Animate counter from 000 to 100
    var n = 0;
    var step = setInterval(function () {
      n += 4 + Math.floor(Math.random() * 6);
      if (n >= 100) { n = 100; clearInterval(step); }
      if (counter) counter.textContent = String(n).padStart(3, "0");
    }, 45);

    // Settle the hero shortly after page load
    win.addEventListener("load", function () {
      setTimeout(finishLoad, 1100);
    });
    // Safety fallback in case 'load' doesn't fire
    setTimeout(finishLoad, 2200);
  }

  /* ─── 3. Custom cursor ───────────────────────────────────────── */
  var cursor = doc.querySelector(".cursor");
  if (cursor && win.matchMedia("(hover: hover)").matches && !reduceMotion) {
    var cx = win.innerWidth / 2, cy = win.innerHeight / 2;
    var tx = cx, ty = cy;

    win.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    // Smooth follow loop
    function follow() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      requestAnimationFrame(follow);
    }
    follow();

    // Hover state on interactive elements
    var hoverables = doc.querySelectorAll("a, button, [data-hover]");
    hoverables.forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-hovering"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hovering"); });
    });
  }

  /* ─── 4. Ambient mouse-tracking glow ─────────────────────────── */
  var ambient = doc.querySelector(".ambient");
  if (ambient && !reduceMotion) {
    win.addEventListener("mousemove", function (e) {
      var x = (e.clientX / win.innerWidth) * 100;
      var y = (e.clientY / win.innerHeight) * 100;
      ambient.style.setProperty("--mx", x + "%");
      ambient.style.setProperty("--my", y + "%");
    }, { passive: true });
  }

  /* ─── 5. Magnetic CTAs ───────────────────────────────────────── */
  if (!reduceMotion) {
    var magnets = doc.querySelectorAll("[data-magnetic]");
    magnets.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + (mx * 0.18) + "px," + (my * 0.25) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ─── 6. Scroll progress + nav state + active section ───────── */
  var nav = doc.querySelector(".nav");
  var progressBar = doc.querySelector(".progress span");
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav__links a[data-nav]"));
  var sections = navLinks.map(function (a) {
    var id = a.getAttribute("href").replace("#", "");
    return doc.getElementById(id);
  }).filter(Boolean);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = win.scrollY || win.pageYOffset;

      if (nav) {
        if (y > 12) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      }

      if (progressBar) {
        var h = (doc.documentElement.scrollHeight - doc.documentElement.clientHeight) || 1;
        progressBar.style.width = Math.min(100, Math.max(0, (y / h) * 100)).toFixed(2) + "%";
      }

      var mid = y + win.innerHeight * 0.4;
      var activeId = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= mid) activeId = sections[i].id;
      }
      navLinks.forEach(function (a) {
        if (a.getAttribute("href") === "#" + activeId) a.classList.add("is-active");
        else a.classList.remove("is-active");
      });

      ticking = false;
    });
  }
  win.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ─── 7. Reveal-on-scroll via IntersectionObserver ──────────── */
  var revealEls = doc.querySelectorAll("[data-reveal]");

  // Section titles split into spans — reveal each child span with stagger
  function staggerTitle(parent) {
    var spans = parent.querySelectorAll("[data-reveal]");
    spans.forEach(function (s, i) {
      setTimeout(function () { s.classList.add("is-in"); }, i * 80);
    });
  }

  if ("IntersectionObserver" in win) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var t = entry.target;

        // If this is a title made of multiple data-reveal spans, stagger them
        if (t.classList.contains("section__title") || t.classList.contains("contact__title")) {
          staggerTitle(t);
        } else {
          t.classList.add("is-in");
        }

        // Trigger any stat counters in this element
        var counters = t.querySelectorAll ? t.querySelectorAll("[data-count]:not(.is-counted)") : [];
        counters.forEach(animateCount);

        io.unobserve(t);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    // Observe section titles (containers) too
    var titles = doc.querySelectorAll(".section__title, .contact__title");
    titles.forEach(function (t) { io.observe(t); });

    revealEls.forEach(function (el) {
      // Don't double-observe if it's a child of a title
      if (el.closest(".section__title") || el.closest(".contact__title")) return;
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ─── 8. Animated stat counters ─────────────────────────────── */
  function animateCount(el) {
    el.classList.add("is-counted");
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400;
    var start = performance.now();

    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(tick);
  }

})();
