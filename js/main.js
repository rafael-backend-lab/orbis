/* ORBIS — loja (sem dependências) */
(function () {
  "use strict";

  var cfg = window.ORBIS_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Textos centralizados ───────────────────────────────── */
  if (cfg.PRICE_LABEL) $$("[data-price]").forEach(function (el) { el.textContent = cfg.PRICE_LABEL; });
  var yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (cfg.CONTACT_EMAIL && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.CONTACT_EMAIL)) {
    var mk = function (prefix) {
      var frag = document.createDocumentFragment();
      if (prefix) frag.appendChild(document.createTextNode(prefix));
      var a = document.createElement("a");
      a.href = "mailto:" + cfg.CONTACT_EMAIL;
      a.textContent = cfg.CONTACT_EMAIL;
      frag.appendChild(a);
      return frag;
    };
    var f1 = $("[data-contact-faq]"), f2 = $("[data-contact-footer]");
    if (f1) { f1.appendChild(mk("Outra dúvida? Escreva para ")); f1.hidden = false; }
    if (f2) { f2.appendChild(mk("")); f2.hidden = false; }
  }

  /* ── Checkout Kiwify ────────────────────────────────────── */
  function validCheckout(url) {
    if (!url || typeof url !== "string") return null;
    try {
      var u = new URL(url.trim());
      var h = u.hostname.toLowerCase();
      var ok = /(^|\.)kiwify\.com\.br$/.test(h) || /(^|\.)kiwify\.com$/.test(h);
      return u.protocol === "https:" && ok ? u.href : null;
    } catch (e) { return null; }
  }
  var checkout = validCheckout(cfg.CHECKOUT_URL);

  $$("[data-checkout]").forEach(function (btn) {
    var soft = btn.hasAttribute("data-soft") || btn.closest("[data-buybar]");
    if (checkout) {
      btn.href = checkout;
      btn.rel = "noopener";
    } else if (soft) {
      btn.href = "#produto";           // atalhos levam ao produto
    } else {
      btn.removeAttribute("href");      // botões principais ficam desativados
      btn.setAttribute("role", "link");
      btn.setAttribute("aria-disabled", "true");
      btn.classList.add("is-disabled");
      btn.textContent = "Disponível em breve";
    }
  });
  if (!checkout) {
    var st = $("[data-checkout-status]");
    if (st) st.textContent = "As vendas serão abertas em breve.";
    console.info(cfg.CHECKOUT_URL
      ? "[ORBIS] CHECKOUT_URL inválido — use um link https da Kiwify em js/config.js."
      : "[ORBIS] Checkout desativado — defina CHECKOUT_URL em js/config.js.");
  }

  /* ── Carregamento de imagens ────────────────────────────── */
  // Cria um .media e tenta carregar a imagem. Sem arquivo, mantém o painel neutro.
  var cache = {};
  function probe(src) {
    if (!src) return Promise.resolve(false);
    if (!cache[src]) {
      cache[src] = new Promise(function (res) {
        var i = new Image();
        i.onload = function () { res(true); };
        i.onerror = function () { res(false); };
        i.src = src;
      });
    }
    return cache[src];
  }
  function fillMedia(box, item, eager) {
    box.innerHTML = "";
    box.classList.remove("is-loaded");
    if (!item || !item.src) return Promise.resolve(false);
    return probe(item.src).then(function (ok) {
      if (!ok) return false;
      var img = document.createElement("img");
      img.alt = item.alt || "";
      img.decoding = "async";
      if (!eager) img.loading = "lazy";
      img.onload = function () { img.classList.add("is-ready"); };
      img.src = item.src;
      box.appendChild(img);
      box.classList.add("is-loaded");
      return true;
    });
  }
  function media(cls) {
    var d = document.createElement("div");
    d.className = "media" + (cls ? " " + cls : "");
    return d;
  }

  var images = cfg.IMAGES || {};
  $$("[data-img]").forEach(function (el) {
    el.classList.add("media");
    fillMedia(el, images[el.getAttribute("data-img")]);
  });

  /* ── Visualizador (ampliação + miniaturas) ──────────────── */
  var viewer = $("[data-viewer]");
  var vImg = $("[data-viewer-img]"), vCap = $("[data-viewer-cap]"), vThumbs = $("[data-viewer-thumbs]");
  var vList = [], vIdx = 0;

  function vShow(i) {
    if (!vList.length) return;
    vIdx = (i + vList.length) % vList.length;
    var it = vList[vIdx];
    vImg.src = it.src; vImg.alt = it.alt || "";
    vCap.textContent = (it.label || it.alt || "") + "  ·  " + (vIdx + 1) + "/" + vList.length;
    $$("button", vThumbs).forEach(function (b, k) { b.setAttribute("aria-current", k === vIdx ? "true" : "false"); });
  }
  function vOpen(list, idx) {
    if (!viewer || typeof viewer.showModal !== "function" || !list.length) return;
    vList = list; vThumbs.innerHTML = "";
    list.forEach(function (it, k) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver imagem " + (k + 1));
      var im = document.createElement("img"); im.src = it.src; im.alt = "";
      b.appendChild(im);
      b.addEventListener("click", function () { vShow(k); });
      vThumbs.appendChild(b);
    });
    viewer.showModal();
    vShow(idx);
  }
  if (viewer) {
    $("[data-viewer-close]").addEventListener("click", function () { viewer.close(); });
    $("[data-viewer-prev]").addEventListener("click", function () { vShow(vIdx - 1); });
    $("[data-viewer-next]").addEventListener("click", function () { vShow(vIdx + 1); });
    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") vShow(vIdx - 1);
      if (e.key === "ArrowRight") vShow(vIdx + 1);
    });
    swipe(viewer, function (d) { vShow(vIdx + d); });
  }

  function swipe(el, cb) {
    var x0 = null, y0 = null;
    el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) cb(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  // Mantém só os itens cujo arquivo existe; se nenhum existir, mantém todos (painéis neutros).
  function available(list) {
    return Promise.all(list.map(function (it) { return probe(it.src); })).then(function (r) {
      var ok = list.filter(function (_, k) { return r[k]; });
      return { items: ok.length ? ok : list, any: ok.length > 0 };
    });
  }

  /* ── Galeria do produto (primeira tela) ─────────────────── */
  var pMain = $("[data-pdp-main]"), pThumbs = $("[data-pdp-thumbs]");
  var pZoom = $("[data-pdp-zoom]"), pCount = $("[data-pdp-count]");
  var pg = [], pIdx = 0, pAny = false, mainBox = media();

  if (pMain && (cfg.PRODUCT_GALLERY || []).length) {
    pMain.appendChild(mainBox);
    available(cfg.PRODUCT_GALLERY).then(function (res) {
      pg = res.items; pAny = res.any;
      pg.forEach(function (it, k) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "thumb";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", it.alt || "Imagem " + (k + 1));
        var m = media(); b.appendChild(m);
        fillMedia(m, it, k < 5);
        b.addEventListener("click", function () { pShow(k); });
        pThumbs.appendChild(b);
      });
      var single = pg.length < 2;
      $("[data-pdp-prev]").hidden = single; $("[data-pdp-next]").hidden = single;
      pShow(0);
    });
    $("[data-pdp-prev]").addEventListener("click", function () { pShow(pIdx - 1); });
    $("[data-pdp-next]").addEventListener("click", function () { pShow(pIdx + 1); });
    swipe(pMain, function (d) { pShow(pIdx + d); });
    pZoom.addEventListener("click", function () { if (pAny) vOpen(pg, pIdx); });
    pMain.addEventListener("click", function () { if (!pZoom.hidden) pZoom.click(); });
  }

  function pShow(i) {
    if (!pg.length) return;
    pIdx = (i + pg.length) % pg.length;
    $$(".thumb", pThumbs).forEach(function (t, k) {
      t.setAttribute("aria-selected", k === pIdx ? "true" : "false");
      if (k === pIdx && pThumbs.scrollWidth > pThumbs.clientWidth) {
        pThumbs.scrollTo({ left: t.offsetLeft - pThumbs.clientWidth / 2 + t.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
    if (pCount) pCount.textContent = (pIdx + 1) + " / " + pg.length;
    fillMedia(mainBox, pg[pIdx], true).then(function (ok) {
      pZoom.hidden = !ok;
      pMain.style.cursor = ok ? "zoom-in" : "default";
    });
  }

  /* ── Galeria "Por dentro do ORBIS" ──────────────────────── */
  var gal = $("[data-gallery]");
  if (gal && (cfg.GALLERY || []).length) {
    available(cfg.GALLERY).then(function (res) {
      res.items.forEach(function (it, k) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "gallery__item";
        b.disabled = !res.any;
        b.setAttribute("aria-label", res.any ? "Ampliar: " + (it.alt || it.label) : (it.label || "Imagem"));
        var m = media(); b.appendChild(m);
        if (it.label) { var t = document.createElement("span"); t.className = "gallery__label"; t.textContent = it.label; b.appendChild(t); }
        fillMedia(m, it);
        b.addEventListener("click", function () { if (res.any) vOpen(res.items, k); });
        gal.appendChild(b);
      });
    });
  }

  /* ── Faixas de ambiente (imagem de fundo) ───────────────── */
  $$("[data-bg]").forEach(function (el) {
    var it = images[el.getAttribute("data-bg")];
    if (!it) return;
    probe(it.src).then(function (ok) {
      if (ok) { el.style.setProperty("--bg-img", 'url("' + new URL(it.src, document.baseURI).href + '")'); el.classList.add("has-bg"); }
    });
  });

  /* ── Revelação ao rolar ─────────────────────────────────── */
  var reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach(function (el) {
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib * 60, 240) + "ms";
      io.observe(el);
    });
  }

  /* ── Barra de compra fixa ───────────────────────────────── */
  var bar = $("[data-buybar]");
  var anchor = $(".pdp__price"), offer = $("#oferta");
  if (bar && anchor) {
    var ticking = false;
    var upd = function () {
      ticking = false;
      var a = anchor.getBoundingClientRect();
      var o = offer ? offer.getBoundingClientRect() : { top: 1e9, bottom: -1e9 };
      var offerIn = o.top < window.innerHeight && o.bottom > 0;
      var show = a.bottom < 0 && !offerIn;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      var l = $("a", bar); if (l) l.tabIndex = show ? 0 : -1;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(upd); }
    }, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }
})();
