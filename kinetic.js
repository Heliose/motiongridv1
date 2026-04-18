/* ─── Kinetic Typography — playback engine ─── */

(function () {
  'use strict';

  // ─── Scene data ───────────────────────────────────────────────────────
  // Each scene: { text, fx, duration (entrance ms), hold (post-entrance ms), meta? }
  // `fx` names map to CSS classes (.fx-<name>) applied to .stage-content.
  // Effects not yet defined in CSS fall back to a default fade-up.
  const BD = (n) => 'ab1 (' + n + ').svg';
  const SCRIPT = [
    // Act 1 — the challenge
    { text: "2025 tested everyone.",        fx: "shake",         duration: 1400, hold: 500, backdrop: BD(1) },
    { text: "Cautious markets.",            fx: "hesitateFade",  duration: 1300, hold: 300, backdrop: BD(2) },
    { text: "Shifting demand.",             fx: "letterShift",   duration: 1300, hold: 300, backdrop: BD(3) },
    { text: "Tighter budgets.",             fx: "compress",      duration: 1400, hold: 400, backdrop: BD(4) },
    { text: "THE TIMES WERE CHALLENGING.",  fx: "roughRise",     duration: 1600, hold: 600, backdrop: BD(5) },
    { text: "WE SAID CHALLENGE ACCEPTED.",  fx: "stepForward",   duration: 1600, hold: 700, backdrop: BD(6) },

    // Act 2 — the wins
    { text: "Topline up.",                   fx: "rise",          duration: 1100, hold: 300, backdrop: BD(7) },
    { text: "Margins expanded.",             fx: "stretch",       duration: 1300, hold: 300, backdrop: BD(8) },
    { text: "Large deals across industries.",fx: "sweepAcross",   duration: 1600, hold: 400, backdrop: BD(9) },
    { text: "45+ new marquee accounts → 162+ Fortune 500 clients", fx: "countUp", duration: 2400, hold: 700, meta: { counters: [45, 162] }, backdrop: BD(10) },
    { text: "That's how TechM wins.",        fx: "flashBurst",    duration: 1400, hold: 700, backdrop: BD(11) },

    // Act 3 — innovation
    { text: "We made our clients AI-READY.", fx: "flip",          duration: 1500, hold: 400, backdrop: BD(12) },
    { text: "Then gave ORION MARKETPLACE to the world.", fx: "pushOut", duration: 1800, hold: 500, backdrop: BD(13) },
    { text: "India's first Hindi-language education LLM.", fx: "bigReveal", duration: 1900, hold: 500, backdrop: BD(14) },
    { text: "Built with NVIDIA.",            fx: "assemble",      duration: 1500, hold: 400, backdrop: BD(15) },
    { text: "Agentic AI for telecom.",       fx: "stableFade",    duration: 1300, hold: 300, backdrop: BD(16) },
    { text: "Built with Microsoft.",         fx: "assemble",      duration: 1500, hold: 400, backdrop: BD(17) },
    { text: "EMERGING LEADER — GenAI Consulting & Implementation.", fx: "growRise", duration: 1800, hold: 500, backdrop: BD(18) },
    { text: "That's how TechM innovates.",   fx: "spark",         duration: 1500, hold: 700, backdrop: BD(19) },

    // Act 4 — brand + people
    { text: "We refreshed our brand.",       fx: "scramble",      duration: 1700, hold: 400, backdrop: BD(20) },
    { text: "The world took notice.",        fx: "spotlight",     duration: 1500, hold: 500, backdrop: BD(21) },
    { text: "#4 IN INDIA → #9 GLOBALLY → $3.4 BILLION", fx: "countUpStaged", duration: 2600, hold: 700, meta: { stages: [4, 9, 3.4] }, backdrop: BD(22) },
    { text: "Our people showed up like never before.", fx: "popIn", duration: 1500, hold: 400, backdrop: BD(23) },
    { text: "We broke records.",             fx: "shatter",       duration: 1500, hold: 400, backdrop: BD(24) },
    { text: "61,031 VOICES for TechM CARES Survey.", fx: "countUp", duration: 2000, hold: 500, meta: { counters: [61031] }, backdrop: BD(25) },
    { text: "4.47 engagement score ↑",       fx: "riseArrow",     duration: 1500, hold: 400, backdrop: BD(26) },
    { text: "We created history.",           fx: "typewriter",    duration: 1700, hold: 500, backdrop: BD(27) },
    { text: "Achieved NPS of 75 in customer satisfaction.", fx: "targetZoom", duration: 1800, hold: 500, backdrop: BD(28) },
    { text: "That's how TechM builds trust.",fx: "stackUp",       duration: 1600, hold: 700, backdrop: BD(29) },

    // Act 5 — finale
    { text: "Why choose between scale and speed…", fx: "split",   duration: 1700, hold: 300, backdrop: BD(30) },
    { text: "When we can do both?",          fx: "merge",         duration: 1500, hold: 500, backdrop: BD(31) },
    { text: "This is the TechM promise.",    fx: "stableHold",    duration: 1500, hold: 500, backdrop: BD(32) },
    { text: "Are we ready for the future?",  fx: "pulse",         duration: 1600, hold: 400, backdrop: BD(33) },
    { text: "Are we ready for the future?",  fx: "pulseStrong",   duration: 1500, hold: 400, backdrop: BD(33) },
    { text: "Is the future ready for US?",   fx: "mirror",        duration: 1800, hold: 700, backdrop: BD(34) },
    { text: "TECH MAHINDRA",                 fx: "logoZoom",      duration: 2000, hold: 600, backdrop: BD(34) },
    { text: "SCALE AT SPEED",                fx: "motionBlur",    duration: 1800, hold: 1000, backdrop: BD(34) },
  ];

  // ─── State ────────────────────────────────────────────────────────────
  const state = {
    currentIdx: -1,
    isPlaying: false,
    speed: 1,
    sceneTimer: null,
    progressRaf: null,
    progressStart: 0,
    progressTotal: 0,
    page: detectPage(),
  };

  function detectPage() {
    if (document.getElementById('stage-content')) return 'playback';
    if (document.getElementById('catalog-grid')) return 'catalog';
    return null;
  }

  // ─── Init ─────────────────────────────────────────────────────────────
  function init() {
    if (state.page === 'playback') initPlayback();
    else if (state.page === 'catalog') initCatalog();
  }

  function initPlayback() {
    wireTransport();
    renderSceneList();
  }

  // ─── Catalog page ─────────────────────────────────────────────────────
  const CATALOG_EFFECTS = [
    { fx: 'shake',         sample: 'tested' },
    { fx: 'hesitateFade',  sample: 'cautious' },
    { fx: 'letterShift',   sample: 'shifting' },
    { fx: 'compress',      sample: 'tighter' },
    { fx: 'roughRise',     sample: 'challenging' },
    { fx: 'stepForward',   sample: 'accepted' },
    { fx: 'rise',          sample: 'topline up' },
    { fx: 'stretch',       sample: 'expanded' },
    { fx: 'sweepAcross',   sample: 'across' },
    { fx: 'countUp',       sample: '162 clients' },
    { fx: 'countUpStaged', sample: '#4 → #9 → $3.4B' },
    { fx: 'flashBurst',    sample: 'wins' },
    { fx: 'flip',          sample: 'AI-READY' },
    { fx: 'pushOut',       sample: 'gave' },
    { fx: 'bigReveal',     sample: 'reveal' },
    { fx: 'assemble',      sample: 'built' },
    { fx: 'stableFade',    sample: 'stable' },
    { fx: 'growRise',      sample: 'emerging' },
    { fx: 'spark',         sample: 'innovates' },
    { fx: 'scramble',      sample: 'refreshed' },
    { fx: 'spotlight',     sample: 'notice' },
    { fx: 'popIn',         sample: 'showed up' },
    { fx: 'shatter',       sample: 'broke' },
    { fx: 'riseArrow',     sample: '4.47 ↑' },
    { fx: 'typewriter',    sample: 'created' },
    { fx: 'targetZoom',    sample: 'achieved' },
    { fx: 'stackUp',       sample: 'builds trust' },
    { fx: 'split',         sample: 'scale speed' },
    { fx: 'merge',         sample: 'both' },
    { fx: 'stableHold',    sample: 'promise' },
    { fx: 'pulse',         sample: 'ready?' },
    { fx: 'pulseStrong',   sample: 'READY?' },
    { fx: 'mirror',        sample: 'ready for US?' },
    { fx: 'logoZoom',      sample: 'LOGO' },
    { fx: 'motionBlur',    sample: 'SCALE AT SPEED' },
  ];

  function initCatalog() {
    const grid = byId('catalog-grid');
    if (!grid) return;
    CATALOG_EFFECTS.forEach((item, i) => {
      const tile = document.createElement('div');
      tile.className = 'cat-tile';
      tile.dataset.fx = item.fx;
      tile.title = 'Click to replay';

      const preview = document.createElement('div');
      preview.className = 'cat-preview stage-content';

      const label = document.createElement('div');
      label.className = 'cat-label';
      label.textContent = item.fx;

      tile.appendChild(preview);
      tile.appendChild(label);
      grid.appendChild(tile);

      // Cascade start: add fx class after delay so animations appear in sequence
      const delay = i * 90;
      setTimeout(() => playTile(preview, item), delay);

      tile.addEventListener('click', () => playTile(preview, item));
    });
  }

  function playTile(preview, item) {
    const fxClass = 'fx-' + item.fx;
    preview.className = 'cat-preview stage-content'; // reset
    // Paint content
    if (item.fx === 'countUp' || item.fx === 'countUpStaged') {
      preview.innerHTML = textToCounterHtml(item.sample);
    } else {
      preview.innerHTML = splitText(item.sample);
    }
    // Randomization hooks
    if (item.fx === 'assemble' || item.fx === 'shatter') {
      applyRandomLetterVars(preview, item.fx);
    }
    // Force reflow then add fx class so animation restarts from frame 0
    void preview.offsetWidth;
    preview.classList.add(fxClass);

    // JS-driven effects
    if (item.fx === 'countUp' || item.fx === 'countUpStaged') {
      startCountersForScene(preview, { fx: item.fx, duration: 1500 });
    } else if (item.fx === 'scramble') {
      startScramble(preview);
    }
  }

  // ─── Transport ────────────────────────────────────────────────────────
  function wireTransport() {
    byId('btn-play').addEventListener('click', togglePlay);
    byId('btn-prev').addEventListener('click', () => goTo(state.currentIdx - 1, true));
    byId('btn-next').addEventListener('click', () => goTo(state.currentIdx + 1, true));
    byId('btn-restart').addEventListener('click', () => { goTo(0, true); });

    document.querySelectorAll('#speed-tabs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#speed-tabs button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        setSpeed(parseFloat(btn.dataset.speed) || 1);
      });
    });
  }

  function setSpeed(newSpeed) {
    state.speed = newSpeed;
    // Apply immediately to the stage so future frames use it
    const el = byId('stage-content');
    if (el) el.style.setProperty('--fx-speed', String(newSpeed));

    // If something is playing or visible, restart the current scene so the
    // new speed actually takes effect on the current animation + timer.
    if (state.currentIdx >= 0 && state.currentIdx < SCRIPT.length) {
      clearTimers();
      if (state.isPlaying) {
        playScene(state.currentIdx);
      } else {
        // Not playing — re-render statically (no scheduling)
        renderScene(state.currentIdx);
      }
    }
  }

  function togglePlay() {
    if (state.isPlaying) pausePlayback();
    else startPlayback();
  }

  function startPlayback() {
    state.isPlaying = true;
    byId('btn-play').classList.add('is-playing');
    const startIdx = state.currentIdx < 0 ? 0 : state.currentIdx;
    playScene(startIdx);
  }

  function pausePlayback() {
    state.isPlaying = false;
    byId('btn-play').classList.remove('is-playing');
    clearTimers();
  }

  function clearTimers() {
    if (state.sceneTimer) { clearTimeout(state.sceneTimer); state.sceneTimer = null; }
    if (state.progressRaf) { cancelAnimationFrame(state.progressRaf); state.progressRaf = null; }
  }

  function goTo(idx, userInitiated) {
    if (idx < 0) idx = 0;
    if (idx >= SCRIPT.length) idx = SCRIPT.length - 1;
    clearTimers();
    if (userInitiated && !state.isPlaying) {
      // Show the scene statically without advancing
      renderScene(idx);
      state.currentIdx = idx;
      updateSceneHighlight(idx);
      updateMeta(SCRIPT[idx], idx);
      setProgress(0);
      return;
    }
    playScene(idx);
  }

  // ─── Playback ─────────────────────────────────────────────────────────
  function playScene(idx) {
    if (!state.isPlaying) return;
    if (idx >= SCRIPT.length) { pausePlayback(); return; }
    state.currentIdx = idx;
    const scene = SCRIPT[idx];

    renderScene(idx);
    updateSceneHighlight(idx);
    updateMeta(scene, idx);

    const duration = scene.duration;
    const hold = scene.hold || 0;
    const total = (duration + hold) / state.speed;

    startProgress(total);

    // Warm the cache for the next scene's backdrop
    const nextScene = SCRIPT[idx + 1];
    if (nextScene && nextScene.backdrop) loadBackdrop(nextScene.backdrop);

    state.sceneTimer = setTimeout(() => {
      playScene(idx + 1);
    }, total);
  }

  function renderScene(idx) {
    const scene = SCRIPT[idx];
    const el = byId('stage-content');
    if (!el) return;
    // Reset classes but keep base
    el.className = 'stage-content';
    el.classList.add('fx-' + scene.fx);
    // Set speed-scaled animation speed via CSS var
    el.style.setProperty('--fx-speed', String(state.speed));

    // Swap backdrop (async, non-blocking)
    setBackdrop(scene.backdrop || null);

    // Cancel any active scramble/counter loops tied to the previous scene
    cancelActiveRafLoops();

    // Scene-specific rendering
    if (scene.fx === 'countUp' || scene.fx === 'countUpStaged') {
      el.innerHTML = textToCounterHtml(scene.text);
      startCountersForScene(el, scene);
    } else {
      el.innerHTML = splitText(scene.text);
    }

    // Apply per-letter randomization for assemble/shatter
    if (scene.fx === 'assemble' || scene.fx === 'shatter') {
      applyRandomLetterVars(el, scene.fx);
    }

    // Scramble loops replace letters in flight until settle
    if (scene.fx === 'scramble') {
      startScramble(el);
    }

    // Force reflow so animation restarts
    void el.offsetWidth;
  }

  // ─── Per-letter randomisation for assemble / shatter ──────────────────
  function applyRandomLetterVars(el, fxName) {
    const letters = el.querySelectorAll('.ltr');
    const prefix = fxName === 'assemble' ? 'r' : 's';
    letters.forEach((letter) => {
      const rx = (Math.random() * 180 - 90).toFixed(1) + 'px';
      const ry = (Math.random() * 120 - 60).toFixed(1) + 'px';
      const rr = (Math.random() * 50 - 25).toFixed(1) + 'deg';
      letter.style.setProperty('--' + prefix + 'x', rx);
      letter.style.setProperty('--' + prefix + 'y', ry);
      letter.style.setProperty('--' + prefix + 'r', rr);
    });
  }

  // ─── Counters ─────────────────────────────────────────────────────────
  const activeRafLoops = new Set();

  function cancelActiveRafLoops() {
    activeRafLoops.forEach((id) => cancelAnimationFrame(id));
    activeRafLoops.clear();
  }

  function textToCounterHtml(text) {
    // Wrap numeric tokens (with optional $ prefix, commas, decimals) in .counter spans
    const withCounters = String(text).replace(/(\$?)(\d[\d,]*(?:\.\d+)?)/g, (match, prefix, num) => {
      const clean = num.replace(/,/g, '');
      const target = parseFloat(clean);
      const decimals = clean.includes('.') ? (clean.split('.')[1] || '').length : 0;
      const hasComma = num.includes(',');
      return prefix + '<span class="counter" data-target="' + target +
        '" data-decimals="' + decimals +
        '" data-comma="' + (hasComma ? '1' : '0') + '">' +
        formatNumber(0, decimals, hasComma) + '</span>';
    });
    // Split the non-counter portions into letters so entrance animation still runs
    const container = document.createElement('div');
    container.innerHTML = withCounters;
    const out = document.createElement('div');
    let letterIdx = 0;
    let wordIdx = 0;
    const walk = (node, parent) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          parts.forEach((part) => {
            if (part === '') return;
            if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'word';
            w.style.setProperty('--wi', wordIdx++);
            for (const ch of part) {
              const l = document.createElement('span');
              l.className = 'ltr';
              l.style.setProperty('--i', letterIdx++);
              l.textContent = ch;
              w.appendChild(l);
            }
            parent.appendChild(w);
          });
        } else if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('counter')) {
          // keep counter as-is (no letter split), but still wrap in a word-ish container for layout
          parent.appendChild(child.cloneNode(true));
        } else {
          walk(child, parent);
        }
      });
    };
    walk(container, out);
    return out.innerHTML;
  }

  function startCountersForScene(el, scene) {
    const counters = Array.from(el.querySelectorAll('.counter'));
    if (!counters.length) return;
    const staged = scene.fx === 'countUpStaged';
    const duration = scene.duration;
    if (staged) {
      // Split duration across counters with slight overlap
      const slice = duration / counters.length;
      counters.forEach((c, i) => {
        setTimeout(() => animateCounter(c, duration / counters.length / state.speed), (i * slice) / state.speed);
      });
    } else {
      counters.forEach((c) => animateCounter(c, duration / state.speed));
    }
  }

  function animateCounter(el, durationMs) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const hasComma = el.dataset.comma === '1';
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = eased * target;
      el.textContent = formatNumber(value, decimals, hasComma);
      if (t < 1) {
        const id = requestAnimationFrame(step);
        activeRafLoops.add(id);
      }
    };
    const id = requestAnimationFrame(step);
    activeRafLoops.add(id);
  }

  function formatNumber(val, decimals, hasComma) {
    let s = val.toFixed(decimals);
    if (hasComma) {
      const parts = s.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      s = parts.join('.');
    }
    return s;
  }

  // ─── Scramble effect ──────────────────────────────────────────────────
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&*?';

  function startScramble(el) {
    const letters = Array.from(el.querySelectorAll('.ltr'));
    letters.forEach((letter, i) => {
      const final = letter.textContent;
      if (!/\S/.test(final)) return;
      const scrambleMs = (600 + Math.random() * 300) / state.speed;
      const startDelay = (i * 25) / state.speed;
      const start = performance.now() + startDelay;
      const step = (now) => {
        if (now < start) {
          const id = requestAnimationFrame(step);
          activeRafLoops.add(id);
          return;
        }
        const elapsed = now - start;
        if (elapsed < scrambleMs) {
          letter.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          const id = requestAnimationFrame(step);
          activeRafLoops.add(id);
        } else {
          letter.textContent = final;
        }
      };
      const id = requestAnimationFrame(step);
      activeRafLoops.add(id);
    });
  }

  function updateSceneHighlight(idx) {
    document.querySelectorAll('#scenes li').forEach((li) => {
      li.classList.toggle('is-active', parseInt(li.dataset.idx, 10) === idx);
      if (parseInt(li.dataset.idx, 10) === idx) {
        li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  function updateMeta(scene, idx) {
    const el = byId('stage-meta');
    if (!el) return;
    el.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(SCRIPT.length).padStart(2, '0') + '   •   ' + scene.fx;
  }

  // ─── Progress bar ─────────────────────────────────────────────────────
  function startProgress(totalMs) {
    state.progressStart = performance.now();
    state.progressTotal = totalMs;
    const tick = () => {
      if (!state.isPlaying) { setProgress(0); return; }
      const elapsed = performance.now() - state.progressStart;
      const pct = Math.min(1, elapsed / state.progressTotal);
      setProgress(pct);
      if (pct < 1) state.progressRaf = requestAnimationFrame(tick);
    };
    state.progressRaf = requestAnimationFrame(tick);
  }

  function setProgress(fraction) {
    const el = byId('stage-progress');
    if (!el) return;
    el.style.width = (fraction * 100) + '%';
  }

  // ─── Letter splitter ──────────────────────────────────────────────────
  function splitText(text) {
    const parts = String(text).split(/(\s+)/); // keep spaces as tokens
    let letterIdx = 0;
    let wordIdx = 0;
    let html = '';
    for (const part of parts) {
      if (part === '') continue;
      if (/^\s+$/.test(part)) { html += ' '; continue; }
      let word = '<span class="word" style="--wi:' + (wordIdx++) + '">';
      for (const ch of part) {
        word += '<span class="ltr" style="--i:' + (letterIdx++) + '">' + escapeHtml(ch) + '</span>';
      }
      word += '</span>';
      html += word;
    }
    return html;
  }

  // ─── Backdrop system ──────────────────────────────────────────────────
  const backdropCache = new Map(); // filename -> raw SVG text
  const backdropPending = new Map(); // filename -> Promise
  let bdInstance = 0;
  let activeBdLayer = 'a';
  let lastRequestedBackdrop = null;

  function loadBackdrop(name) {
    if (backdropCache.has(name)) return Promise.resolve(backdropCache.get(name));
    if (backdropPending.has(name)) return backdropPending.get(name);
    const url = 'svgbg/' + encodeURIComponent(name);
    const p = fetch(url)
      .then((r) => r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)))
      .then((text) => {
        backdropCache.set(name, text);
        backdropPending.delete(name);
        return text;
      })
      .catch((err) => {
        backdropPending.delete(name);
        console.warn('Backdrop load failed:', name, err);
        return null;
      });
    backdropPending.set(name, p);
    return p;
  }

  // Illustrator SVGs share class names like .cls-1, .cls-2 across files.
  // Prefix them per instance so multiple SVGs inlined at once don't collide.
  function scopeSvg(svgText, scope) {
    let out = svgText;
    // Scope class selectors inside <style> blocks
    out = out.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (m, attrs, css) => {
      const scoped = css.replace(/\.cls-(\d+)\b/g, '.' + scope + '-cls-$1');
      return '<style' + attrs + '>' + scoped + '</style>';
    });
    // Scope class="" references
    out = out.replace(/class="([^"]*)"/g, (m, classes) => {
      const scoped = classes
        .split(/\s+/)
        .map((c) => (/^cls-\d+$/.test(c) ? scope + '-' + c : c))
        .join(' ');
      return 'class="' + scoped + '"';
    });
    // Ensure cover-fit aspect ratio on the root svg
    out = out.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
      if (/preserveAspectRatio/i.test(attrs)) return m;
      return '<svg' + attrs + ' preserveAspectRatio="xMidYMid slice">';
    });
    return out;
  }

  async function setBackdrop(name) {
    lastRequestedBackdrop = name;
    if (!name) {
      document.querySelectorAll('.stage-backdrop').forEach((l) => l.classList.remove('active'));
      return;
    }
    const svgText = await loadBackdrop(name);
    // If another scene took over before this one finished loading, bail
    if (lastRequestedBackdrop !== name) return;
    if (!svgText) return;
    const scope = 'bd' + (++bdInstance);
    const scoped = scopeSvg(svgText, scope);
    const nextLayer = activeBdLayer === 'a' ? 'b' : 'a';
    const el = byId('backdrop-' + nextLayer);
    if (!el) return;
    el.innerHTML = scoped;
    requestAnimationFrame(() => {
      if (lastRequestedBackdrop !== name) return;
      document.querySelectorAll('.stage-backdrop').forEach((l) => l.classList.remove('active'));
      el.classList.add('active');
      activeBdLayer = nextLayer;
    });
  }

  // ─── Scene list rendering ─────────────────────────────────────────────
  function renderSceneList() {
    const el = byId('scenes');
    if (!el) return;
    el.innerHTML = '';
    SCRIPT.forEach((scene, i) => {
      const li = document.createElement('li');
      li.dataset.idx = i;
      li.innerHTML =
        '<span class="s-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="s-fx">' + scene.fx + '</span>' +
        '<span class="s-text">' + escapeHtml(scene.text) + '</span>';
      li.addEventListener('click', () => goTo(i, true));
      el.appendChild(li);
    });
  }

  // ─── Utilities ────────────────────────────────────────────────────────
  function byId(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Boot ─────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging / future steps
  window.Kinetic = { SCRIPT, state, splitText };
})();
