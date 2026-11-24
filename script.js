// たかぽんの御朱印巡り - 補助スクリプト
(function () {
  // フッターの年号を現在の年に更新
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ページ内リンクのスムーズスクロール（固定ヘッダー分を引く）
  var header = document.querySelector('header.blog') || document.querySelector('header.site');
  var offset = header ? header.offsetHeight + 8 : 0;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

// 記事アコーディオン（タイトル／「続きを読む」ボタンで開閉）
(function () {
  var posts = document.querySelectorAll('article.post');
  if (!posts.length) return;

  function setOpen(post, open) {
    post.classList.toggle('open', open);
    post.querySelectorAll('.post-toggle').forEach(function (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (btn.classList.contains('read-more')) {
        var label = btn.querySelector('.rm-text');
        if (label) label.textContent = open ? '閉じる' : '続きを読む';
      }
    });
  }

  posts.forEach(function (post) {
    post.querySelectorAll('.post-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setOpen(post, !post.classList.contains('open'));
      });
    });
  });

  // URLハッシュやページ内リンクで特定の記事へ飛んだら、その記事を開く
  function openPost(el) {
    if (el && el.classList && el.classList.contains('post')) setOpen(el, true);
  }
  function openFromHash() {
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
      try { openPost(document.querySelector(hash)); } catch (e) { /* 不正なハッシュは無視 */ }
    }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href');
      if (id && id.length > 1) openPost(document.querySelector(id));
    });
  });
})();
