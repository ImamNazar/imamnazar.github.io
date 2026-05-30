/* ============================================================
   HOLOCRON · interactions
   ============================================================ */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  // ════════════════════════════════════════════
  // 1. HYPERSPACE JUMP — plays once on load
  // ════════════════════════════════════════════
  const hyperCanvas = document.getElementById("hyper-canvas");
  if (hyperCanvas && !reduceMotion) {
    const hctx = hyperCanvas.getContext("2d");
    let hw = window.innerWidth, hh = window.innerHeight;
    const setH = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      hw = window.innerWidth; hh = window.innerHeight;
      hyperCanvas.width = hw * dpr; hyperCanvas.height = hh * dpr;
      hyperCanvas.style.width = hw + "px"; hyperCanvas.style.height = hh + "px";
      hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setH();

    const streaks = [];
    const NUM = 220;
    for (let i = 0; i < NUM; i++) {
      streaks.push({
        x: hw / 2, y: hh / 2,
        a: Math.random() * Math.PI * 2,
        d: Math.random() * 30,
        s: 4 + Math.random() * 14,
        len: 0,
      });
    }

    const T_START = performance.now();
    const DURATION = 1800;

    function tick(now) {
      const t = (now - T_START) / DURATION;
      hctx.fillStyle = `rgba(0, 0, 0, ${0.25 + t * 0.4})`;
      hctx.fillRect(0, 0, hw, hh);

      const accel = 1 + t * t * 8;
      for (const s of streaks) {
        const px = hw / 2 + Math.cos(s.a) * s.d;
        const py = hh / 2 + Math.sin(s.a) * s.d;
        s.d += s.s * accel * 0.6;
        s.len = s.s * accel * 1.2;

        const nx = hw / 2 + Math.cos(s.a) * s.d;
        const ny = hh / 2 + Math.sin(s.a) * s.d;

        hctx.strokeStyle = `rgba(${180 + t * 75}, ${220 + t * 35}, 255, ${0.4 + t * 0.6})`;
        hctx.lineWidth = 1 + t * 1.5;
        hctx.beginPath();
        hctx.moveTo(px, py);
        hctx.lineTo(nx, ny);
        hctx.stroke();
      }

      // Final white flash
      if (t > 0.85) {
        hctx.fillStyle = `rgba(255, 255, 255, ${(t - 0.85) * 6.5})`;
        hctx.fillRect(0, 0, hw, hh);
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        document.body.classList.add("hyperspace-done");
      }
    }
    requestAnimationFrame(tick);
    window.addEventListener("resize", setH);
  } else {
    document.body.classList.add("hyperspace-done");
  }

  // ════════════════════════════════════════════
  // 2. STAR FIELD — drifts behind everything
  // ════════════════════════════════════════════
  const canvas = document.getElementById("starfield");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, stars = [];

    function buildStars() {
      const isMobile = window.innerWidth < 768;
      const target = isMobile ? 90 : 220;
      stars = [];
      for (let i = 0; i < target; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          r: 0.3 + Math.random() * 1.2,
          twinkle: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.0,
        });
      }
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, Math.max(w, h));
      grad.addColorStop(0, "rgba(15, 25, 60, 0.35)");
      grad.addColorStop(0.5, "rgba(5, 11, 28, 0.2)");
      grad.addColorStop(1, "rgba(0, 5, 16, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        const tw = reduceMotion ? 1 : (Math.sin(t * 0.002 * s.speed + s.twinkle) + 1) * 0.5;
        const alpha = 0.25 + tw * 0.75 * (0.4 + s.z * 0.6);
        const radius = s.r * (0.7 + s.z * 0.6);
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        if (s.z > 0.85) ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`;
        else if (s.z > 0.55) ctx.fillStyle = `rgba(220, 230, 255, ${alpha})`;
        else ctx.fillStyle = `rgba(200, 210, 240, ${alpha * 0.75})`;
        ctx.fill();
        if (s.z > 0.92 && !reduceMotion) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, radius * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 3);
          g.addColorStop(0, `rgba(255, 240, 200, ${alpha * 0.25})`);
          g.addColorStop(1, "rgba(255, 240, 200, 0)");
          ctx.fillStyle = g;
          ctx.fill();
        }
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    window.addEventListener("resize", () => {
      clearTimeout(window._sr);
      window._sr = setTimeout(resize, 150);
    });
    resize();
    if (reduceMotion) draw(0); else requestAnimationFrame(draw);
  }

  // ════════════════════════════════════════════
  // 3. LIGHTSABER CURSOR
  // ════════════════════════════════════════════
  if (!isTouch && !reduceMotion) {
    const cursor = document.querySelector(".saber-cursor");
    if (cursor) {
      let mx = 0, my = 0, cx = 0, cy = 0, lastX = 0, lastY = 0;
      let ignited = false;
      const igniteTimeout = setTimeout(() => {
        document.body.classList.add("cursor-active");
        ignited = true;
      }, 2200);

      window.addEventListener("mousemove", (e) => {
        mx = e.clientX; my = e.clientY;
        if (ignited) {
          // Calculate angle based on motion direction for natural feel
          const dx = mx - lastX, dy = my - lastY;
          const mag = Math.sqrt(dx*dx + dy*dy);
          if (mag > 2) {
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            cursor._angle = angle - 20;
          }
          lastX = mx; lastY = my;
        }
      });
      function loop() {
        cx += (mx - cx) * 0.25;
        cy += (my - cy) * 0.25;
        const rot = cursor._angle != null ? cursor._angle : -35;
        cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-22px, -4px) rotate(${rot}deg)`;
        requestAnimationFrame(loop);
      }
      loop();
    }
  }

  // ════════════════════════════════════════════
  // 4. R2-D2 DROID — scroll-to-top
  // ════════════════════════════════════════════
  const droid = document.getElementById("droid");
  if (droid) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight * 1.2) {
        droid.classList.add("visible");
      } else {
        droid.classList.remove("visible");
      }
    });
    droid.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Beep sound if audio enabled
      playBeep();
    });
  }

  // ════════════════════════════════════════════
  // 5. SECTION TRACKING — cursor color changes
  // ════════════════════════════════════════════
  const sections = document.querySelectorAll("[data-section]");
  if (sections.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          const name = e.target.dataset.section;
          if (name) document.body.setAttribute("data-section", name);
        }
      });
    }, { threshold: [0.4, 0.6] });
    sections.forEach((s) => obs.observe(s));
  }

  // ════════════════════════════════════════════
  // 6. AMBIENT SOUND + INTERACTION CUES
  //    (Web Audio synthesis — no external files)
  // ════════════════════════════════════════════
  let audioCtx = null;
  let ambientOn = false;
  let ambientNodes = null;
  const soundBtn = document.getElementById("sound-toggle");

  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return false; }
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return true;
  }

  function startAmbient() {
    if (!ensureAudio()) return;
    // Low rumble + occasional shimmer — a faint "in-space" pad
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);

    // Low drone
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55;
    const g1 = ctx.createGain();
    g1.gain.value = 0.6;
    osc1.connect(g1).connect(master);
    osc1.start(now);

    // Slow detuned partial
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 82.5;
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    osc2.connect(g2).connect(master);
    osc2.start(now);

    // Slow LFO on gain
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start(now);

    ambientNodes = { master, osc1, osc2, lfo };
  }

  function stopAmbient() {
    if (!ambientNodes || !audioCtx) return;
    const now = audioCtx.currentTime;
    ambientNodes.master.gain.linearRampToValueAtTime(0, now + 0.5);
    setTimeout(() => {
      try {
        ambientNodes.osc1.stop();
        ambientNodes.osc2.stop();
        ambientNodes.lfo.stop();
      } catch (e) {}
      ambientNodes = null;
    }, 600);
  }

  function playSaberIgnite() {
    if (!ambientOn || !audioCtx) return;
    const ctx = audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.05);
    g.gain.linearRampToValueAtTime(0.06, now + 0.4);
    g.gain.linearRampToValueAtTime(0, now + 0.7);
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.75);
  }

  function playBeep() {
    if (!ambientOn || !audioCtx) return;
    const ctx = audioCtx;
    const now = ctx.currentTime;
    // R2-D2 beep — short ascending blips
    [600, 900, 750].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.01);
      g.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.06);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.08);
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      ambientOn = !ambientOn;
      soundBtn.setAttribute("aria-pressed", ambientOn ? "true" : "false");
      if (ambientOn) {
        ensureAudio();
        startAmbient();
        // Light "ignite" cue
        setTimeout(playSaberIgnite, 100);
      } else {
        stopAmbient();
      }
    });
  }

  // Saber ignite on mission hover (if sound on)
  document.querySelectorAll(".mission, .saber-link").forEach((el) => {
    el.addEventListener("mouseenter", () => { if (ambientOn) playSaberIgnite(); });
  });

})();
