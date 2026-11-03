/* PhongThuy VietAA - Trang chu: tim kiem ung dung + loc nhanh */
(function () {
  'use strict';
  function stripAcc(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('ptv-home-search');
    if (!input) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.ptv-app-card'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.ptv-home-group'));
    var count = document.getElementById('ptv-home-count');
    var none = document.getElementById('ptv-home-none');
    function apply() {
      var q = stripAcc(input.value.trim());
      var visible = 0;
      cards.forEach(function (c) {
        var hit = !q || stripAcc(c.textContent).indexOf(q) >= 0;
        c.style.display = hit ? '' : 'none';
        if (hit) visible++;
      });
      groups.forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll('.ptv-app-card'), function (c) { return c.style.display !== 'none'; });
        g.style.display = any ? '' : 'none';
      });
      if (count) count.textContent = q ? ('Tìm thấy ' + visible + ' ứng dụng khớp với "' + input.value.trim() + '".') : '';
      if (none) none.style.display = (q && visible === 0) ? '' : 'none';
    }
    input.addEventListener('input', apply);
  });
})();
