(function () {
  "use strict";

  var D = window.PORTFOLIO || {};
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function setText(id, value) {
    var node = $(id);
    if (node) node.textContent = value || "";
  }

  var ICONS = {
    mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  };

  function isExternal(href) { return /^https?:/i.test(href || ""); }

  function linkOrBox(href, cls) {
    var node = el(href ? "a" : "div", cls);
    if (href) {
      node.href = href;
      if (isExternal(href)) { node.target = "_blank"; node.rel = "noopener"; }
    }
    return node;
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Identitas & hero ────────────────────────────────────────
  document.title = (D.name || "Portfolio") + " — Portfolio";
  setText("name", D.name);
  setText("tagline", D.tagline);

  var HUE = typeof D.bannerHue === "number" ? D.bannerHue : 275;
  document.documentElement.style.setProperty("--hue", HUE);

  // ── Banner ──────────────────────────────────────────────────
  // Urutan prioritas: video (bannerVideo) → foto (banner) → lampu bokeh di kanvas.
  // Kanvas bokeh juga dipakai sebagai gambar sementara selagi video dimuat.
  var hero = $("hero");
  var LOOP = 8; // detik; semua gerakan berulang mulus tiap 8 detik
  var TAU = Math.PI * 2;

  function seeded(a) { // angka acak yang selalu sama, supaya banner tidak berubah tiap dimuat
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function glow(ctx, x, y, r, h, s, l, a) {
    var c = "hsla(" + h + "," + s + "%," + l + "%,";
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, c + a + ")");
    g.addColorStop(0.55, c + a * 0.5 + ")");
    g.addColorStop(1, c + "0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  function makeSprite(h) { // satu titik lampu buram, digambar sekali lalu dipakai berulang
    var s = document.createElement("canvas");
    s.width = s.height = 96;
    var c = s.getContext("2d");
    var g = c.createRadialGradient(48, 48, 0, 48, 48, 48);
    g.addColorStop(0, "hsla(" + h + ",100%,94%,1)");
    g.addColorStop(0.2, "hsla(" + h + ",98%,74%,.85)");
    g.addColorStop(0.6, "hsla(" + h + ",95%,60%,.32)");
    g.addColorStop(1, "hsla(" + h + ",95%,60%,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 96, 96);
    return s;
  }

  var SPRITES = [-28, -14, 0, 14, 28, 55].map(function (o) { return makeSprite(HUE + o); });
  var LIGHTS = [];
  (function () {
    var rnd = seeded(11);
    for (var row = 0; row < 8; row++) {
      for (var i = 0; i < 34; i++) {
        var t = (i + rnd() * 0.7) / 34;
        LIGHTS.push({
          row: row,
          i: i,
          t: t,
          jy: rnd() - 0.5,
          size: 5 + 20 * t * t + rnd() * 7,
          sprite: rnd() < 0.12 ? 5 : Math.floor(rnd() * 5),
          a: (0.18 + rnd() * 0.6) * Math.min(1, t * 1.7),
          phase: rnd() * TAU,
          speed: 1 + Math.floor(rnd() * 3),
          drift: rnd() - 0.5,
        });
      }
    }
  })();

  // Menggambar satu frame banner pada detik ke-`time`
  function paint(ctx, w, h, time) {
    var k = Math.max(0.62, w / 1040);
    var cycle = (TAU * time) / LOOP;

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    var base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, "hsl(" + HUE + ",72%,9%)");
    base.addColorStop(0.55, "hsl(" + (HUE + 6) + ",78%,24%)");
    base.addColorStop(1, "hsl(" + (HUE - 14) + ",72%,11%)");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";
    glow(ctx, w * 0.72, h * 0.15, w * 0.45, HUE + 12, 90, 48, 0.36 + 0.08 * Math.sin(cycle));
    glow(ctx, w * 0.42, h * 0.95, w * 0.34, HUE + 42, 90, 50, 0.24 + 0.07 * Math.sin(cycle + 2));
    glow(ctx, w * 0.98, h * 0.8, w * 0.3, HUE - 28, 90, 52, 0.28 + 0.07 * Math.sin(cycle + 4));

    // deretan lampu yang makin besar ke arah kanan, berkelip dan bergeser pelan
    var sparse = w < 600;
    for (var n = 0; n < LIGHTS.length; n++) {
      var L = LIGHTS[n];
      if (sparse && L.i % 2) continue;
      var x = w * (0.16 + 0.9 * L.t) + L.drift * 16 * k * Math.sin(cycle + L.phase);
      var y = h * (0.08 + L.row * 0.16) - (x - w * 0.16) * 0.13 + L.jy * 12;
      var r = L.size * k * 1.3;
      ctx.globalAlpha = L.a * (0.55 + 0.45 * Math.sin(L.phase + cycle * L.speed));
      ctx.drawImage(SPRITES[L.sprite], x - r, y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  var cv = $("bokeh");
  var lastW = 0;
  function fitCanvas() {
    var w = hero.clientWidth, h = hero.clientHeight;
    if (!w || (w === lastW && cv.height)) return;
    lastW = w;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    drawFrame(0);
  }

  function drawFrame(time) {
    var dpr = cv.width / (hero.clientWidth || 1);
    var ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(ctx, hero.clientWidth, hero.clientHeight, time);
  }

  var animating = false, inView = true, lastTick = 0;
  function tick(now) {
    if (!animating) return;
    if (inView && now - lastTick > 30) { // ±30 fps sudah cukup untuk lampu berkelip
      lastTick = now;
      drawFrame((now / 1000) % LOOP);
    }
    requestAnimationFrame(tick);
  }

  function startCanvasAnimation() {
    if (animating || reducedMotion) return;
    animating = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { inView = e[0].isIntersecting; }).observe(hero);
    }
    requestAnimationFrame(tick);
  }

  var video = $("bannerVideo");

  if (D.banner) {
    hero.classList.add("has-banner");
    hero.style.backgroundImage = 'url("' + encodeURI(D.banner) + '")';
  } else {
    fitCanvas();
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitCanvas, 150);
    });
  }

  if (D.bannerVideo && !reducedMotion) {
    var broken = false;
    var tryPlay = function () {
      if (broken || !video.paused) return;
      var p = video.play();
      // ditolak = autoplay diblokir atau tab sedang di latar; gambar diam tetap tampil
      if (p && p.catch) p.catch(function () {});
    };
    video.hidden = false;
    video.muted = true;
    video.addEventListener("playing", function () { hero.classList.add("video-on"); });
    video.addEventListener("error", function () { // file tidak ada / format tidak didukung
      broken = true;
      hero.classList.remove("video-on");
      video.hidden = true;
      if (!D.banner) startCanvasAnimation();
    });
    // coba lagi saat tab kembali terlihat atau pengunjung pertama kali menyentuh halaman
    document.addEventListener("visibilitychange", function () { if (!document.hidden) tryPlay(); });
    window.addEventListener("pointerdown", tryPlay, { once: true });
    video.src = D.bannerVideo;
    tryPlay();
  } else if (!D.banner) {
    startCanvasAnimation();
  }

  // ── Foto & cincin nama ──────────────────────────────────────
  var unit = (D.name || "PORTFOLIO").toUpperCase() + " • ";
  var ring = "";
  while (ring.length + unit.length <= 66 || !ring) ring += unit;
  setText("ringText", ring);

  var photo = $("photo");
  if (D.photo) {
    var img = el("img");
    img.src = D.photo;
    img.alt = "";
    img.onerror = function () { photo.textContent = D.initials || ""; };
    photo.appendChild(img);
  } else {
    photo.textContent = D.initials || "";
  }

  // ── Perkenalan ──────────────────────────────────────────────
  setText("greeting", D.greeting);
  $("intro").innerHTML = D.intro || ""; // ditulis sendiri oleh pemilik situs di data.js
  setText("now", D.now);
  setText("previously", (D.previously || []).join(" · "));
  if (!(D.previously || []).length) $("previouslyRow").hidden = true;

  setText("highlightsTitle", D.highlightsTitle);
  if (!(D.highlights || []).length) {
    $("highlightsTitle").hidden = true;
    $("highlights").hidden = true;
  }

  (D.highlights || []).forEach(function (h) {
    var li = el("li");
    li.appendChild(el("span", "", h.emoji));
    li.appendChild(el("span", "", h.text));
    $("highlights").appendChild(li);
  });

  (D.contacts || []).forEach(function (c) {
    var a = linkOrBox(c.href, "chip");
    var svg = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[c.icon] || ICONS.link) + "</svg>";
    a.insertAdjacentHTML("afterbegin", svg);
    a.appendChild(el("span", "", c.label));
    $("contacts").appendChild(a);
  });

  // ── Pengalaman: Work, Academic, Publication ─────────────────
  setText("xpTitle", D.experienceTitle);
  setText("xpIntro", D.experienceIntro);

  var groups = D.experience || [];
  if (!groups.length) {
    $("experience").hidden = true;
    var navXp = document.querySelector('.nav a[href="#experience"]');
    if (navXp) navXp.hidden = true;
  }
  groups.forEach(function (g) {
    var wrap = el("div", "xp-group" + (g.kind ? " xp-" + g.kind : ""));
    if (g.title) wrap.appendChild(el("h3", "xp-group-title", g.title));
    var list = el("ol", "xp-list");

    (g.items || []).forEach(function (it) {
      var li = el("li", "xp-item");

      // logo sebagai stiker bulat (atau emoji kalau tidak ada logo)
      var logo = el("span", "xp-logo" + (it.logoFit === "cover" ? " cover" : ""));
      logo.setAttribute("aria-hidden", "true");
      if (it.logo) {
        var im = el("img");
        im.src = it.logo;
        im.alt = "";
        im.loading = "lazy";
        logo.appendChild(im);
      } else {
        logo.appendChild(el("span", "xp-emoji", it.emoji || "•"));
      }
      li.appendChild(logo);

      var body = el("div", "xp-body");
      var name = el("p", "xp-name");
      if (it.href) {
        var link = linkOrBox(it.href, "");
        link.textContent = it.name;
        name.appendChild(link);
      } else {
        name.appendChild(el("span", "", it.name));
      }
      body.appendChild(name);
      if (it.role) body.appendChild(el("p", "xp-role", it.role));
      if (it.date) body.appendChild(el("p", "xp-date", it.date));
      if (it.desc) body.appendChild(el("p", "xp-desc", it.desc));
      li.appendChild(body);

      list.appendChild(li);
    });

    wrap.appendChild(list);
    $("xpGroups").appendChild(wrap);
  });

  // ── Proyek + filter ─────────────────────────────────────────
  setText("projectsTitle", D.projectsTitle);
  setText("projectsIntro", D.projectsIntro);

  var projects = D.projects || [];
  var ALL = "All";
  var active = ALL;
  var tags = [];
  projects.forEach(function (p) {
    (p.tags || []).forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
  });

  var SPANS = [4, 2, 2, 4, 3, 3]; // lebar kartu bergantian, tiap pasang = 6 kolom

  // Nama tampilan untuk logo alat (file-nya di logos/tools/<kunci>.svg)
  var TOOLS = { laravel: "Laravel", php: "PHP", mysql: "MySQL", python: "Python", javascript: "JavaScript" };

  // Video sampul proyek hanya diputar saat kartunya terlihat di layar (hemat baterai & data).
  var videoObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting && !reducedMotion) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {}); // autoplay ditolak: poster tetap tampil
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.15 })
    : null;

  function watchVideo(v) {
    if (videoObserver) videoObserver.observe(v);
    else if (!reducedMotion) v.autoplay = true;
  }

  function renderProjects() {
    var grid = $("projectGrid");
    if (videoObserver) grid.querySelectorAll("video").forEach(function (v) { videoObserver.unobserve(v); });
    grid.replaceChildren();
    var list = projects.filter(function (p) {
      return active === ALL || (p.tags || []).indexOf(active) !== -1;
    });

    if (!list.length) {
      grid.appendChild(el("p", "empty", "No projects in this category yet."));
      return;
    }

    list.forEach(function (p, i) {
      var card = linkOrBox(p.href, "project");
      var alone = i === list.length - 1 && i % 2 === 0;
      card.style.setProperty("--span", alone ? 6 : SPANS[i % SPANS.length]);
      if (p.colors) {
        card.style.setProperty("--c1", p.colors[0]);
        card.style.setProperty("--c2", p.colors[1] || p.colors[0]);
      }

      if (p.video) {
        // rekaman jelajah situs: tanpa suara, berulang, diputar hanya saat terlihat
        var vid = el("video", "cover");
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.preload = "metadata";
        vid.setAttribute("aria-hidden", "true");
        if (p.poster) vid.poster = p.poster;
        vid.src = p.video;
        card.appendChild(vid);
        card.classList.add("has-video");
        watchVideo(vid);
      } else if (p.image) {
        var im = el("img");
        im.src = p.image;
        im.alt = "";
        im.loading = "lazy";
        card.appendChild(im);
      } else if (p.emoji) {
        var g = el("span", "glyph", p.emoji);
        g.setAttribute("aria-hidden", "true");
        card.appendChild(g);
      }

      // tahun + logo alat yang dipakai, berjajar di pojok kiri atas
      var badges = el("div", "badges");
      if (p.year) badges.appendChild(el("span", "year", p.year)); // kosong = tanpa label tahun
      var tools = (p.tools || []).filter(function (t) { return TOOLS[t]; });
      if (tools.length) {
        var box = el("span", "tools");
        box.setAttribute("aria-label", "Built with " + tools.map(function (t) { return TOOLS[t]; }).join(", "));
        tools.forEach(function (t) {
          var ic = el("img");
          ic.src = "logos/tools/" + t + ".svg";
          ic.alt = "";
          ic.title = TOOLS[t];
          box.appendChild(ic);
        });
        badges.appendChild(box);
      }
      if (badges.children.length) card.appendChild(badges);
      if (p.featured) {
        var star = el("span", "star", "⭐");
        star.title = "Featured";
        card.appendChild(star);
      }

      var label = el("div", "label");
      label.appendChild(el("h3", "", p.title));
      if (p.desc) label.appendChild(el("p", "", p.desc)); // kosong = tanpa deskripsi
      card.appendChild(label);
      grid.appendChild(card);
    });
  }

  function renderFilters() {
    var box = $("filters");
    if (tags.length < 2) { box.hidden = true; return; }
    [ALL].concat(tags).forEach(function (t) {
      var b = el("button", "filter", t);
      b.type = "button";
      b.setAttribute("aria-pressed", String(t === active));
      b.addEventListener("click", function () {
        active = t;
        Array.prototype.forEach.call(box.children, function (c) {
          c.setAttribute("aria-pressed", String(c === b));
        });
        renderProjects();
      });
      box.appendChild(b);
    });
  }

  renderFilters();
  renderProjects();

  // ── Stiker: ditempel di pinggir kartu, klik = balon teks ────
  var openSticker = null, stickerTimer;

  function closeSticker() {
    if (!openSticker) return;
    openSticker.classList.remove("open");
    openSticker.setAttribute("aria-expanded", "false");
    openSticker = null;
  }

  // Stiker bisa diseret ke mana saja. Saat mulai diseret, stiker dipindah dari kartunya ke
  // lapisan halaman (posisi dalam koordinat halaman), lalu mengikuti jari/kursor.
  var stickerLayer = el("div", "stk-layer");
  document.body.appendChild(stickerLayer);

  function makeDraggable(b) {
    var startX, startY, offX, offY, dragging = false, pid = null;

    function move(e) {
      if (e.pointerId !== pid) return;
      if (!dragging) {
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) return; // masih dianggap klik
        dragging = true;
        closeSticker();
        var r = b.getBoundingClientRect();
        var w = b.offsetWidth, h = b.offsetHeight;
        var left = r.left + r.width / 2 - w / 2 + window.scrollX;
        var top = r.top + r.height / 2 - h / 2 + window.scrollY;
        if (b.parentNode !== stickerLayer) stickerLayer.appendChild(b);
        b.style.right = "auto";
        b.style.left = left + "px";
        b.style.top = top + "px";
        offX = startX + window.scrollX - left;
        offY = startY + window.scrollY - top;
        b.classList.add("dragging");
      }
      e.preventDefault();
      var maxX = document.documentElement.clientWidth - b.offsetWidth;
      var maxY = document.documentElement.scrollHeight - b.offsetHeight;
      b.style.left = Math.min(Math.max(e.clientX + window.scrollX - offX, 0), maxX) + "px";
      b.style.top = Math.min(Math.max(e.clientY + window.scrollY - offY, 0), maxY) + "px";
    }

    function end(e) {
      if (e.pointerId !== pid) return;
      pid = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      if (!dragging) return;
      dragging = false;
      b.classList.remove("dragging");
      b.dataset.dragged = "1";
      setTimeout(function () { delete b.dataset.dragged; }, 0); // klik palsu sesudah lepas diabaikan
      // balon teks muncul ke arah yang lebih lega
      var r = b.getBoundingClientRect();
      var onLeft = r.left + r.width / 2 < window.innerWidth / 2;
      b.classList.toggle("stk-left", onLeft);
      b.classList.toggle("stk-right", !onLeft);
    }

    b.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || pid !== null) return;
      pid = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    });
  }

  // Pemutar musik untuk stiker yang punya lagu Spotify. Pemutar resmi Spotify disiapkan
  // diam-diam (tak terlihat) sesaat setelah halaman dimuat, supaya begitu stiker ditekan
  // lagu langsung berbunyi dari detik yang ditentukan (start).
  var music = null, musicPanel = null, musicWaiting = [];

  function withMusic(uri, start, done) {
    if (music) return done(music);
    musicWaiting.push(done);
    if (musicPanel) return; // masih memuat
    musicPanel = el("div", "np");
    musicPanel.setAttribute("aria-hidden", "true");
    var target = el("div");
    musicPanel.appendChild(target);
    document.body.appendChild(musicPanel);

    window.onSpotifyIframeApiReady = function (API) {
      API.createController(target, { uri: uri, width: 300, height: 80 }, function (controller) {
        var state = { controller: controller, playing: false, started: false, seeked: !start };
        controller.addListener("playback_update", function (e) {
          var d = e.data || {};
          state.playing = !d.isPaused;
          // lompat ke detik `start` sekali saja, begitu lagu mulai berbunyi.
          // Cuplikan 30 detik (pengunjung tanpa akun Spotify) tidak bisa dilompati.
          if (!state.seeked && state.playing && d.duration > (start + 1) * 1000) {
            state.seeked = true;
            controller.seek(start);
          }
          document.querySelectorAll(".stk-music").forEach(function (b) { b.classList.toggle("playing", state.playing); });
        });
        controller.addListener("ready", function () {
          music = state;
          musicWaiting.splice(0).forEach(function (fn) { fn(state); });
        });
      });
    };
    var sc = document.createElement("script");
    sc.src = "https://open.spotify.com/embed/iframe-api/v1";
    sc.async = true;
    document.body.appendChild(sc);
  }

  function toggleMusic(uri, start) {
    withMusic(uri, start, function (m) {
      if (m.playing) m.controller.pause();
      else if (m.started) m.controller.resume();
      else { m.controller.play(); m.started = true; }
    });
  }

  // siapkan pemutar lebih awal (setelah halaman selesai dimuat) agar tekan = langsung bunyi
  var musicSticker = (D.stickers || []).filter(function (s) { return s.spotify; })[0];
  if (musicSticker) {
    window.addEventListener("load", function () {
      setTimeout(function () { withMusic(musicSticker.spotify, musicSticker.start || 0, function () {}); }, 800);
    });
  }

  (D.stickers || []).forEach(function (s) {
    var host = s.at === "intro" ? document.querySelector(".intro") : $(s.at);
    if (!host || !s.img) return;

    var b = el("button", "stk " + (s.side === "left" ? "stk-left" : "stk-right") + (s.mobile ? " stk-mobile" : "") + (s.spotify ? " stk-music" : ""));
    b.type = "button";
    b.style.setProperty("--top", (s.top || 0) + "%");
    b.style.setProperty("--tilt", (s.tilt || 0) + "deg");
    if (s.size) b.style.setProperty("--k", s.size);
    b.setAttribute("aria-label", s.text || "sticker");
    b.setAttribute("aria-expanded", "false");

    var img = el("img");
    img.src = s.img;
    img.alt = "";
    img.loading = "lazy";
    img.draggable = false;
    b.appendChild(img);

    if (s.text) {
      var bubble = el("span", "stk-bubble", s.text);
      bubble.setAttribute("aria-hidden", "true"); // teksnya sudah dibacakan lewat aria-label
      b.appendChild(bubble);
    }

    b.title = "drag me around";
    makeDraggable(b);

    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (b.dataset.dragged) { delete b.dataset.dragged; return; } // habis diseret: bukan klik
      if (s.spotify) toggleMusic(s.spotify, s.start || 0);
      var wasOpen = openSticker === b;
      closeSticker();
      if (wasOpen || !s.text) return;
      b.classList.add("open");
      b.setAttribute("aria-expanded", "true");
      openSticker = b;
      clearTimeout(stickerTimer);
      stickerTimer = setTimeout(closeSticker, 3500); // balon hilang sendiri
    });

    host.appendChild(b);
  });

  document.addEventListener("click", closeSticker);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSticker(); });

  // ── Kontak & footer ─────────────────────────────────────────
  setText("contactTitle", D.contactTitle);
  setText("contactText", D.contactText);
  var btn = $("contactButton");
  btn.textContent = (D.contactButton || "Send an email") + " →";
  btn.href = "mailto:" + (D.email || "");
  setText("footerText", "© " + new Date().getFullYear() + " " + (D.name || ""));

  // ── Animasi muncul saat digulir ─────────────────────────────
  var targets = document.querySelectorAll(".card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) {
      // yang sudah terlihat saat halaman dibuka tidak perlu dianimasikan
      if (t.getBoundingClientRect().top < window.innerHeight) return;
      t.classList.add("reveal");
      io.observe(t);
    });
  }
})();
