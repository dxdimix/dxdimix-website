/*
 * DimiX サイト共通の動き（全ページで読み込む。ライブラリは使わない）
 * - スマホのメニュー開閉（Esc・外側クリック・リンク選択で閉じる。開いている間は背景を固定）
 * - スクロールしたらヘッダーに影
 * - .reveal の要素を画面に入ったときにふわっと表示（動きを減らす設定では即表示）
 * - スマホ下部の固定お問い合わせボタン（ファーストビューを過ぎたら出し、締めのお問い合わせ帯が見えたら隠す）
 * - ページ内目次（.page-nav）の現在地表示
 * JS が動かない環境でも、メニュー・本文はすべて表示される（CSS 側で html.js のときだけ隠している）。
 */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    // ===== メニュー =====
    var btn = document.querySelector('.menu-btn');
    var nav = document.getElementById('site-nav');
    function setMenu(open) {
      if (!btn || !nav) return;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('.menu-label').textContent = open ? '閉じる' : 'メニュー';
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
    }
    if (btn && nav) {
      btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
      });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
      window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
    }

    // ===== ヘッダーの影 =====
    var header = document.querySelector('.site-header');
    function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== 表示の動き =====
    var items = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    }

    // ===== スマホ下部の固定ボタン =====
    var mcta = document.querySelector('.mobile-cta');
    if (mcta && 'IntersectionObserver' in window) {
      document.body.classList.add('has-mobile-cta');
      var start = document.querySelector('.hero, .product-hero, .page-hero') || document.querySelector('main > section');
      var end = document.querySelector('.cta, .site-footer');
      var passedStart = false, endVisible = false;
      function update() { mcta.classList.toggle('is-shown', passedStart && !endVisible); }
      new IntersectionObserver(function (en) {
        passedStart = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; update();
      }).observe(start);
      if (end) new IntersectionObserver(function (en) { endVisible = en[0].isIntersecting; update(); }).observe(end);
    }

    // ===== ページ内目次の現在地 =====
    var pn = document.querySelectorAll('.page-nav a[href^="#"]');
    if (pn.length && 'IntersectionObserver' in window) {
      var map = {};
      pn.forEach(function (a) { var t = document.querySelector(a.getAttribute('href')); if (t) map[t.id] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            pn.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
            var a = map[en.target.id];
            if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); }
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
    }
  });
})();
