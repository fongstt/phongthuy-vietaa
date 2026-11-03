/* PhongThuy VietAA - Cong cu Boi Kieu (v1.2) */
(function () {
  'use strict';
  var TONE_STYLE = {
    'tốt': { bg: '#2e7d32', label: 'Điềm tốt' },
    'khá': { bg: '#2f855a', label: 'Điềm khá' },
    'trung bình': { bg: '#b8860b', label: 'Điềm trung bình' },
    'cần cẩn trọng': { bg: '#b3543f', label: 'Cần cẩn trọng' }
  };
  var lastIndex = -1;
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function hashStr(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h;
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function poolFor(topic) {
    var all = window.PTV_KIEU_DATA || [];
    if (!topic || topic === 'tổng quan') return all;
    var f = all.filter(function (v) { return (v.themes || []).indexOf(topic) >= 0; });
    return f.length >= 5 ? f : all;
  }
  function draw() {
    var topic = (document.querySelector('input[name="ptv-kieu-topic"]:checked') || {}).value || 'tổng quan';
    var name = el('ptv-kieu-name').value.trim();
    var birth = el('ptv-kieu-birth').value;
    var num = el('ptv-kieu-num').value.trim();
    var all = window.PTV_KIEU_DATA || [];
    var pool = poolFor(topic);
    if (!pool.length) return;
    var idx, seeded = false;
    if (num !== '' && !isNaN(parseInt(num, 10))) {
      idx = hashStr(topic + '|' + name.toLowerCase() + '|' + birth + '|' + num + '|' + todayStr()) % pool.length;
      seeded = true;
    } else {
      idx = Math.floor(Math.random() * pool.length);
      if (pool.length > 1 && pool[idx] === all[lastIndex]) idx = (idx + 1) % pool.length;
    }
    lastIndex = all.indexOf(pool[idx]);
    render(pool[idx], topic, name, seeded);
  }
  function render(v, topic, name, seeded) {
    var tone = TONE_STYLE[v.tone] || TONE_STYLE['trung bình'];
    var html = '<div class="ptv-card ptv-kieu-result">' +
      '<div class="ptv-kieu-head"><span class="ptv-kieu-topic">Quẻ Kiều · ' + esc(topic) + '</span>' +
      '<span class="ptv-kieu-tone" style="background:' + tone.bg + '">' + tone.label + '</span></div>' +
      '<blockquote class="ptv-kieu-verse"><p>' + esc(v.lines[0]) + '</p><p>' + esc(v.lines[1]) + '</p></blockquote>' +
      '<p class="ptv-kieu-src">Trích Truyện Kiều, Nguyễn Du</p>' +
      (name ? '<p class="ptv-kieu-for">Quẻ rút cho: <strong>' + esc(name) + '</strong></p>' : '') +
      '<h4>Giải nghĩa câu Kiều</h4><p>' + esc(v.meaning) + '</p>' +
      '<h4>Luận giải cho bạn</h4><p>' + esc(v.advice) + '</p>' +
      '<p class="ptv-note">' + (seeded
        ? 'Quẻ được rút theo con số bạn nghĩ tới, kết hợp chủ đề và ngày hôm nay, nên cùng một người hỏi cùng một việc trong ngày sẽ nhận cùng một quẻ để suy ngẫm cho nhất quán.'
        : 'Quẻ được gieo ngẫu nhiên. Nếu muốn quẻ gắn với một con số bạn vừa nghĩ tới trong đầu, hãy nhập con số đó rồi gieo lại.') + '</p>' +
      '<button type="button" class="ptv-btn" id="ptv-kieu-again">Gieo quẻ khác</button></div>';
    var out = el('ptv-kieu-result');
    out.innerHTML = html;
    el('ptv-kieu-again').addEventListener('click', draw);
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('DOMContentLoaded', function () {
    if (!el('ptv-kieu-form')) return;
    var yr = el('ptv-kieu-birth'), i;
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Không nhập'; yr.appendChild(o0);
    for (i = 1940; i <= 2025; i++) { var o = document.createElement('option'); o.value = i; o.textContent = i; yr.appendChild(o); }
    el('ptv-kieu-form').addEventListener('submit', function (ev) { ev.preventDefault(); draw(); });
  });
})();
