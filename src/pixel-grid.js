(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.PixelGrid = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // ─── Built-in Animation Presets ───

  var PRESETS = [
    { name: 'wave-lr',       delays: [0, 120, 240, 0, 120, 240, 0, 120, 240],           duration: 200 },
    { name: 'wave-rl',       delays: [240, 120, 0, 240, 120, 0, 240, 120, 0],           duration: 200 },
    { name: 'wave-tb',       delays: [0, 0, 0, 120, 120, 120, 240, 240, 240],           duration: 200 },
    { name: 'wave-bt',       delays: [240, 240, 240, 120, 120, 120, 0, 0, 0],           duration: 200 },
    { name: 'spiral-cw',     delays: [0, 80, 160, 560, 640, 240, 480, 400, 320],        duration: 180 },
    { name: 'corners-first', delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],             duration: 200 },
    { name: 'center-out',    delays: [240, 120, 240, 120, 0, 120, 240, 120, 240],       duration: 200 },
    { name: 'diagonal-tl',   delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],       duration: 180 },
    { name: 'snake',         delays: [0, 80, 160, 400, 320, 240, 480, 560, 640],        duration: 160 },
    { name: 'cross',         delays: [300, 0, 300, 0, 0, 0, 300, 0, 300],               duration: 250 },
    { name: 'checkerboard',  delays: [0, 250, 0, 250, 0, 250, 0, 250, 0],               duration: 220 },
    { name: 'rain',          delays: [0, 180, 60, 120, 300, 240, 360, 80, 420],         duration: 170 },
    { name: 'pinwheel',      delays: [0, 160, 480, 320, 640, 160, 480, 320, 0],         duration: 150 },
    { name: 'orbit',         delays: [0, 80, 160, 480, 640, 240, 400, 320, 560],        duration: 120 },
    { name: 'converge',      delays: [0, 160, 80, 240, 320, 240, 80, 160, 0],           duration: 260 },
    { name: 'zigzag',        delays: [0, 160, 320, 400, 240, 80, 480, 560, 640],        duration: 140 },
    { name: 'spiral-ccw',    delays: [0, 560, 480, 80, 640, 400, 160, 240, 320],        duration: 180 },
    { name: 'diagonal-tr',   delays: [200, 100, 0, 300, 200, 100, 400, 300, 200],       duration: 180 },
    { name: 'diagonal-br',   delays: [400, 300, 200, 300, 200, 100, 200, 100, 0],       duration: 180 },
    { name: 'diagonal-bl',   delays: [200, 300, 400, 100, 200, 300, 0, 100, 200],       duration: 180 },
    { name: 'pulse',         delays: [0, 0, 0, 0, 0, 0, 0, 0, 0],                       duration: 400 },
    { name: 'x-shape',       delays: [0, 200, 0, 200, 0, 200, 0, 200, 0],               duration: 220 },
    { name: 'comet',         delays: [0, 40, 80, 120, 160, 200, 240, 280, 320],         duration: 280 },
    { name: 'bounce',        delays: [0, 120, 240, 240, 120, 0, 0, 120, 240],           duration: 180 },
    { name: 'stripes-h',     delays: [0, 0, 0, 200, 200, 200, 0, 0, 0],                 duration: 220 },
    { name: 'stripes-v',     delays: [0, 200, 0, 0, 200, 0, 0, 200, 0],                 duration: 220 },
    { name: 'frame',         delays: [0, 0, 0, 0, 400, 0, 0, 0, 0],                     duration: 220 },
    { name: 'peek-center',   delays: [400, 400, 400, 400, 0, 400, 400, 400, 400],       duration: 220 },
    { name: 'comet-rev',     delays: [640, 560, 480, 400, 320, 240, 160, 80, 0],        duration: 280 },
    { name: 'doors',         delays: [200, 0, 200, 200, 0, 200, 200, 0, 200],           duration: 200 },
    { name: 'l-fill',        delays: [0, 0, 0, 0, 200, 200, 0, 200, 200],               duration: 200 },
    { name: 'plus-first',    delays: [400, 0, 400, 0, 400, 0, 400, 0, 400],             duration: 220 },
    { name: 'r-fill',        delays: [0, 0, 0, 200, 200, 0, 200, 200, 0],               duration: 200 },
    { name: 'j-fill',        delays: [200, 200, 0, 200, 200, 0, 0, 0, 0],               duration: 200 },
    { name: 'u-shape',       delays: [0, 200, 0, 0, 200, 0, 0, 0, 0],                   duration: 220 },
    { name: 't-shape',       delays: [0, 0, 0, 200, 0, 200, 200, 0, 200],               duration: 220 },
    { name: 'h-shape',       delays: [0, 200, 0, 0, 0, 0, 0, 200, 0],                   duration: 220 },
    { name: 'snake-rev',     delays: [160, 80, 0, 240, 320, 400, 640, 560, 480],        duration: 160 },
    { name: 'arrow-up',      delays: [200, 0, 200, 0, 200, 0, 200, 200, 200],           duration: 220 },
    { name: 'rain-rev',      delays: [360, 80, 420, 120, 300, 240, 0, 180, 60],         duration: 170 },
    { name: 'diag-cross',    delays: [0, 300, 200, 300, 0, 300, 200, 300, 0],           duration: 200 },
    { name: 'chevron-r',     delays: [0, 300, 300, 300, 0, 300, 0, 300, 300],           duration: 200 },

    // ─── Disney's 12 Principles of Animation ───
    { name: 'squash-stretch',  delays: [0, 30, 60, 30, 100, 30, 60, 30, 0],             duration: 400 },
    { name: 'anticipation',    delays: [600, 0, 600, 600, 600, 600, 600, 600, 600],     duration: 200 },
    { name: 'staging',         delays: [200, 400, 200, 400, 0, 400, 200, 400, 200],     duration: 300 },
    { name: 'straight-ahead',  delays: [0, 60, 120, 180, 240, 300, 360, 420, 480],      duration: 180 },
    { name: 'pose-to-pose',    delays: [0, 0, 300, 0, 300, 300, 300, 0, 0],             duration: 200 },
    { name: 'follow-through',  delays: [0, 0, 0, 0, 0, 0, 150, 250, 350],               duration: 200 },
    { name: 'slow-in-out',     delays: [0, 50, 150, 300, 500, 700, 850, 950, 1000],     duration: 150 },
    { name: 'arc',             delays: [0, 100, 200, 800, 800, 300, 800, 800, 400],     duration: 150 },
    { name: 'secondary-action',delays: [0, 100, 200, 500, 500, 500, 400, 550, 450],     duration: 200 },
    { name: 'timing',          delays: [0, 200, 0, 400, 0, 400, 0, 200, 0],             duration: 250 },
    { name: 'exaggeration',    delays: [0, 80, 160, 240, 480, 720, 800, 880, 1000],     duration: 150 },
    { name: 'appeal',          delays: [0, 150, 300, 100, 200, 300, 0, 100, 200],       duration: 220 },

    // ─── Multi-Color Presets ───
    { name: 'aurora',      delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],       duration: 220, colors: ['cyan', 'cyan', 'teal', 'teal', 'blue', 'blue', 'purple', 'purple', 'magenta'] },
    { name: 'ember',       delays: [0, 80, 160, 560, 640, 240, 480, 400, 320],        duration: 180, colors: ['yellow', 'orange', 'orange', 'orange', 'red', 'red', 'red', 'magenta', 'magenta'] },
    { name: 'prism',       delays: [0, 80, 160, 240, 320, 400, 480, 560, 640],        duration: 160, colors: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta', 'pink'] },
    { name: 'neon-cross',  delays: [300, 0, 300, 0, 0, 0, 300, 0, 300],               duration: 250, colors: ['magenta', 'cyan', 'magenta', 'cyan', 'white', 'cyan', 'magenta', 'cyan', 'magenta'] },
    { name: 'tide',        delays: [0, 0, 0, 120, 120, 120, 240, 240, 240],           duration: 200, colors: ['teal', 'cyan', 'teal', 'blue', 'teal', 'blue', 'purple', 'blue', 'purple'] },
    { name: 'sunset',      delays: [240, 240, 240, 120, 120, 120, 0, 0, 0],           duration: 200, colors: ['purple', 'blue', 'purple', 'magenta', 'red', 'magenta', 'orange', 'yellow', 'orange'] },
    { name: 'toxic',       delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],             duration: 200, colors: ['lime', 'green', 'lime', 'green', 'yellow', 'green', 'lime', 'green', 'lime'] },
    { name: 'frost',       delays: [240, 120, 240, 120, 0, 120, 240, 120, 240],       duration: 200, colors: ['blue', 'cyan', 'blue', 'cyan', 'white', 'cyan', 'blue', 'cyan', 'blue'] },
    { name: 'rainbow-spin',delays: [0, 80, 160, 560, 640, 240, 480, 400, 320],        duration: 180, colors: ['red', 'orange', 'yellow', 'magenta', 'white', 'green', 'purple', 'blue', 'cyan'] },
    { name: 'fire',        delays: [240, 240, 240, 120, 120, 120, 0, 0, 0],           duration: 200, colors: ['yellow', 'yellow', 'yellow', 'orange', 'orange', 'orange', 'red', 'red', 'red'] },
    { name: 'deep-sea',    delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],       duration: 220, colors: ['white', 'cyan', 'teal', 'cyan', 'teal', 'blue', 'teal', 'blue', 'purple'] },
    { name: 'mint',        delays: [0, 100, 200, 100, 200, 300, 200, 300, 400],       duration: 200, colors: ['white', 'lime', 'lime', 'lime', 'green', 'green', 'green', 'teal', 'teal'] },
    { name: 'berry',       delays: [0, 200, 0, 200, 0, 200, 0, 200, 0],               duration: 220, colors: ['magenta', 'pink', 'magenta', 'pink', 'purple', 'pink', 'magenta', 'pink', 'magenta'] },
    { name: 'galaxy',      delays: [0, 250, 0, 250, 0, 250, 0, 250, 0],               duration: 250, colors: ['white', 'purple', 'white', 'purple', 'white', 'purple', 'white', 'purple', 'white'] },
    { name: 'candy',       delays: [0, 200, 0, 200, 400, 200, 0, 200, 0],             duration: 200, colors: ['pink', 'yellow', 'cyan', 'yellow', 'magenta', 'yellow', 'cyan', 'yellow', 'pink'] },
    { name: 'volcano',     delays: [240, 120, 240, 120, 0, 120, 240, 120, 240],       duration: 200, colors: ['red', 'orange', 'red', 'orange', 'yellow', 'orange', 'red', 'orange', 'red'] },
    { name: 'matrix',      delays: [0, 180, 60, 120, 300, 240, 360, 80, 420],         duration: 170, colors: ['white', 'lime', 'green', 'lime', 'white', 'green', 'green', 'lime', 'green'] },
    { name: 'cyberpunk',   delays: [0, 120, 240, 0, 120, 240, 0, 120, 240],           duration: 200, colors: ['magenta', 'yellow', 'cyan', 'yellow', 'magenta', 'cyan', 'cyan', 'magenta', 'yellow'] }
  ];

  // Build name → preset lookup
  var ANIMATIONS = {};
  for (var a = 0; a < PRESETS.length; a++) {
    ANIMATIONS[PRESETS[a].name] = PRESETS[a];
  }

  var instances = {};
  var instanceId = 0;
  var prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var NAMED_COLORS = ['cyan', 'magenta', 'yellow', 'green', 'orange', 'blue', 'red', 'purple', 'white', 'teal', 'pink', 'lime'];

  function clearChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  // ─── Color Helpers ───

  function isHexColor(str) {
    return typeof str === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str);
  }

  function applyHexVars(el, hex) {
    el.style.setProperty('--pixel-on', hex);
    el.style.setProperty('--pixel-off', 'color-mix(in oklch, ' + hex + ' 25%, black)');
    el.style.setProperty('--pixel-glow', 'color-mix(in oklch, ' + hex + ' 60%, transparent)');
  }

  function clearHexVars(el) {
    el.style.removeProperty('--pixel-on');
    el.style.removeProperty('--pixel-off');
    el.style.removeProperty('--pixel-glow');
  }

  function applyContainerColor(container, config) {
    clearContainerColor(container);
    if (config.color) {
      if (isHexColor(config.color)) {
        applyHexVars(container, config.color);
      } else {
        container.classList.add('pixel-grid--' + config.color);
      }
    }
  }

  function clearContainerColor(container) {
    for (var i = 0; i < NAMED_COLORS.length; i++) {
      container.classList.remove('pixel-grid--' + NAMED_COLORS[i]);
    }
    clearHexVars(container);
  }

  function applyCellColor(cell, colorName) {
    clearCellColor(cell);
    if (!colorName) return;
    if (isHexColor(colorName)) {
      applyHexVars(cell, colorName);
    } else {
      cell.classList.add('pixel-grid__cell--' + colorName);
    }
  }

  function clearCellColor(cell) {
    for (var i = 0; i < NAMED_COLORS.length; i++) {
      cell.classList.remove('pixel-grid__cell--' + NAMED_COLORS[i]);
    }
    clearHexVars(cell);
  }

  // ─── Bloom Filter ───

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var bloomSvg = null;
  var DEFAULT_BLOOM_AMOUNT = 4;

  function ensureBloomSvg() {
    if (bloomSvg) return bloomSvg;
    bloomSvg = document.createElementNS(SVG_NS, 'svg');
    bloomSvg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    bloomSvg.setAttribute('aria-hidden', 'true');
    bloomSvg.appendChild(document.createElementNS(SVG_NS, 'defs'));
    document.body.appendChild(bloomSvg);
    return bloomSvg;
  }

  function createBloomFilter(id, amount) {
    var svg = ensureBloomSvg();
    var defs = svg.firstChild;
    var filterId = 'pg-bloom-' + id;

    removeBloomFilter(id);

    var filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-100%');
    filter.setAttribute('y', '-100%');
    filter.setAttribute('width', '300%');
    filter.setAttribute('height', '300%');

    var matrix = document.createElementNS(SVG_NS, 'feColorMatrix');
    matrix.setAttribute('in', 'SourceGraphic');
    matrix.setAttribute('type', 'matrix');
    matrix.setAttribute('values', '2 0 0 0 -0.5 0 2 0 0 -0.5 0 0 2 0 -0.5 0 0 0 1 0');
    matrix.setAttribute('result', 'bright');

    var blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
    blur.setAttribute('in', 'bright');
    blur.setAttribute('stdDeviation', String(amount));
    blur.setAttribute('result', 'glow');

    var blend = document.createElementNS(SVG_NS, 'feBlend');
    blend.setAttribute('in', 'SourceGraphic');
    blend.setAttribute('in2', 'glow');
    blend.setAttribute('mode', 'screen');

    filter.appendChild(matrix);
    filter.appendChild(blur);
    filter.appendChild(blend);
    defs.appendChild(filter);

    return filter;
  }

  function removeBloomFilter(id) {
    if (!bloomSvg) return;
    var el = bloomSvg.firstChild.querySelector('#pg-bloom-' + id);
    if (el) el.parentNode.removeChild(el);
  }

  // ─── Instance Factory ───

  function createInstance(container, options) {
    var opts = options || {};
    var config = resolveAnimation(opts.animation || 'wave-lr');
    var autoplay = opts.autoplay !== undefined ? opts.autoplay : true;
    var id = ++instanceId;
    var cells = [];
    var timers = [];
    var cycleTimer = null;
    var running = false;
    var bloomEnabled = false;
    var bloomAmount = 0;

    // Build DOM
    clearChildren(container);
    for (var i = 0; i < 9; i++) {
      var cell = document.createElement('div');
      cell.className = 'pixel-grid__cell';
      if (config.colors && config.colors[i]) {
        applyCellColor(cell, config.colors[i]);
      }
      container.appendChild(cell);
      cells.push(cell);
    }
    applyContainerColor(container, config);

    function resolveAnimation(anim) {
      if (typeof anim === 'string') {
        return ANIMATIONS[anim] || ANIMATIONS['wave-lr'];
      }
      return anim;
    }

    function getMaxDelay() {
      return Math.max.apply(null, config.delays);
    }

    function clearTimers() {
      for (var t = 0; t < timers.length; t++) {
        clearTimeout(timers[t]);
      }
      timers = [];
      if (cycleTimer) {
        clearTimeout(cycleTimer);
        cycleTimer = null;
      }
    }

    function fadeIn(callback) {
      for (var i = 0; i < 9; i++) {
        (function(idx) {
          timers.push(setTimeout(function() {
            cells[idx].classList.add('is-on');
          }, config.delays[idx]));
        })(i);
      }
      var holdTime = getMaxDelay() + config.duration;
      cycleTimer = setTimeout(callback, holdTime);
    }

    function fadeOut(callback) {
      for (var i = 0; i < 9; i++) {
        (function(idx) {
          timers.push(setTimeout(function() {
            cells[idx].classList.remove('is-on');
          }, config.delays[idx]));
        })(i);
      }
      var endTime = getMaxDelay() + config.duration + 50;
      cycleTimer = setTimeout(callback, endTime);
    }

    function cycle() {
      if (!running) return;
      fadeIn(function() {
        if (!running) return;
        fadeOut(function() {
          if (!running) return;
          cycle();
        });
      });
    }

    function play() {
      if (running) return;
      running = true;

      if (prefersReducedMotion) {
        for (var i = 0; i < 9; i++) {
          cells[i].classList.add('is-on');
        }
        return;
      }

      cycle();
    }

    function stop() {
      running = false;
      clearTimers();
      for (var i = 0; i < 9; i++) {
        cells[i].classList.remove('is-on');
      }
    }

    function applyCellColors() {
      for (var i = 0; i < 9; i++) {
        clearCellColor(cells[i]);
        if (config.colors && config.colors[i]) {
          applyCellColor(cells[i], config.colors[i]);
        }
      }
    }

    function setAnimation(anim) {
      var wasRunning = running;
      stop();
      config = resolveAnimation(anim);
      applyContainerColor(container, config);
      applyCellColors();
      if (wasRunning) {
        play();
      }
    }

    function setBloom(value) {
      if (value === false || value === 0) {
        container.style.filter = '';
        removeBloomFilter(id);
        bloomEnabled = false;
        bloomAmount = 0;
      } else {
        var amount = (typeof value === 'number') ? value : DEFAULT_BLOOM_AMOUNT;
        bloomAmount = amount;
        bloomEnabled = true;
        createBloomFilter(id, amount);
        container.style.filter = 'url(#pg-bloom-' + id + ')';
      }
    }

    function destroy() {
      stop();
      if (bloomEnabled) {
        container.style.filter = '';
        removeBloomFilter(id);
      }
      clearChildren(container);
      cells = [];
      delete instances[id];
    }

    var instance = {
      id: id,
      play: play,
      stop: stop,
      setAnimation: setAnimation,
      setBloom: setBloom,
      destroy: destroy,
      getConfig: function() { return config; }
    };

    instances[id] = instance;

    // Init bloom from options
    if (opts.bloom) {
      setBloom(opts.bloom);
    }

    if (autoplay) {
      play();
    }

    return instance;
  }

  // ─── Public API ───

  return {
    create: function(container, options) {
      return createInstance(container, options);
    },

    initAll: function() {
      var elements = document.querySelectorAll('[data-pixel-grid]');
      var created = [];
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var animName = el.getAttribute('data-pixel-grid-animation') || 'wave-lr';
        var initOpts = { animation: animName };
        if (el.hasAttribute('data-pixel-grid-bloom')) {
          var bloomVal = el.getAttribute('data-pixel-grid-bloom');
          initOpts.bloom = bloomVal ? parseFloat(bloomVal) : true;
        }
        created.push(createInstance(el, initOpts));
      }
      return created;
    },

    getInstance: function(id) {
      return instances[id] || null;
    },

    destroyAll: function() {
      var keys = Object.keys(instances);
      for (var i = 0; i < keys.length; i++) {
        instances[keys[i]].destroy();
      }
    },

    getAnimationNames: function() {
      return Object.keys(ANIMATIONS);
    },

    getAnimation: function(name) {
      return ANIMATIONS[name] || null;
    },

    ANIMATIONS: ANIMATIONS
  };
});
