/* --- Van khan: nut sao chep tung bai (v1.51) --- */
(function () {
  'use strict';
  function init() {
    if (window.location.pathname.indexOf('van-khan') < 0) return;
    var page = document.querySelector('.ptv-page');
    if (!page) return;
    var heads = page.querySelectorAll('h2');
    heads.forEach(function (h) {
      if (h.textContent.indexOf('Văn khấn') !== 0) return;
      var parts = [h.textContent.trim()], last = h, node = h.nextElementSibling;
      while (node && node.tagName !== 'H2') {
        if (node.tagName === 'BLOCKQUOTE' || node.tagName === 'P' || node.tagName === 'UL' || node.tagName === 'OL') parts.push(node.textContent.trim());
        last = node;
        node = node.nextElementSibling;
      }
      if (parts.length < 2) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ptv-btn ptv-copy-khan';
      btn.textContent = 'Sao chép bài khấn này';
      btn.addEventListener('click', function () {
        var text = parts.join('\n\n');
        function done() { btn.textContent = 'Đã sao chép, bạn dán vào ghi chú hoặc tin nhắn để dùng khi khấn'; setTimeout(function () { btn.textContent = 'Sao chép bài khấn này'; }, 3000); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { fallback(); });
        } else fallback();
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = 'Trình duyệt không cho sao chép tự động, bạn bôi đen bài khấn để chép tay nhé'; }
          document.body.removeChild(ta);
        }
      });
      last.parentNode.insertBefore(btn, last.nextSibling);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
