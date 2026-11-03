/* PhongThuy VietAA - Cong cu Boi Kieu v2: 2 loi gieo, cau Kieu hom nay, lich su que, sao chep, cau lien quan */
(function () {
  'use strict';
  var TONE_STYLE = {
    'tốt': { bg: '#2e7d32', label: 'Điềm tốt' },
    'khá': { bg: '#2f855a', label: 'Điềm khá' },
    'trung bình': { bg: '#b8860b', label: 'Điềm trung bình' },
    'cần cẩn trọng': { bg: '#b3543f', label: 'Cần cẩn trọng' }
  };
  var lastIndex = -1, mode = 'topic';
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function hashStr(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function all() { return window.PTV_KIEU_DATA || []; }
  function poolFor(topic) {
    var a = all();
    if (!topic || topic === 'tổng quan') return a;
    var f = a.filter(function (v) { return (v.themes || []).indexOf(topic) >= 0; });
    return f.length >= 5 ? f : a;
  }

  /* ---------- Lich su que (luu tren thiet bi) ---------- */
  var HKEY = 'ptvKieuHistory';
  function loadHist() { try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch (e) { return []; } }
  function saveHist(entry) {
    try {
      var h = loadHist();
      h.unshift(entry);
      h = h.slice(0, 10);
      localStorage.setItem(HKEY, JSON.stringify(h));
    } catch (e) {}
    renderHist();
  }
  function renderHist() {
    var box = el('ptv-kieu-hist'); if (!box) return;
    var h = loadHist();
    if (!h.length) { box.innerHTML = ''; return; }
    var items = h.map(function (x, i) {
      var tone = TONE_STYLE[x.tone] || TONE_STYLE['trung bình'];
      return '<button type="button" class="ptv-hist-item" data-i="' + i + '"><span class="ptv-hist-date">' + esc(x.d) + ' · ' + esc(x.topic) + '</span><span class="ptv-hist-line">' + esc(x.l1) + '</span><span class="ptv-kieu-tone" style="background:' + tone.bg + '">' + tone.label + '</span></button>';
    }).join('');
    box.innerHTML = '<div class="ptv-card"><h3>Lịch sử quẻ của bạn</h3><p class="ptv-note">Các quẻ bạn đã gieo được lưu ngay trên thiết bị này để xem lại và chiêm nghiệm, không gửi đi đâu. Bấm vào một quẻ để xem lại luận giải.</p>' + items +
      '<button type="button" class="ptv-xbtn ptv-hist-clear" id="ptv-kieu-hist-clear">Xóa lịch sử</button></div>';
    var btns = box.querySelectorAll('.ptv-hist-item');
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', function () {
      var x = loadHist()[parseInt(this.getAttribute('data-i'), 10)];
      if (!x) return;
      var v = all().filter(function (z) { return z.lines[0] === x.l1; })[0];
      if (v) render(v, x.topic, '', false, 'Quẻ đã gieo ngày ' + x.d + '.');
    });
    el('ptv-kieu-hist-clear').addEventListener('click', function () { try { localStorage.removeItem(HKEY); } catch (e) {} renderHist(); });
  }

  /* ---------- Gieo que ---------- */
  function draw() {
    var topic = mode === 'classic' ? 'cổ điển' : ((document.querySelector('input[name="ptv-kieu-topic"]:checked') || {}).value || 'tổng quan');
    var name = el('ptv-kieu-name').value.trim();
    var birth = el('ptv-kieu-birth').value;
    var num = el('ptv-kieu-num').value.trim();
    var pool = mode === 'classic' ? all() : poolFor(topic);
    if (!pool.length) return;
    var idx, seeded = false;
    if (num !== '' && !isNaN(parseInt(num, 10))) {
      idx = hashStr(topic + '|' + name.toLowerCase() + '|' + birth + '|' + num + '|' + todayStr()) % pool.length;
      seeded = true;
    } else {
      idx = Math.floor(Math.random() * pool.length);
      if (pool.length > 1 && pool[idx] === all()[lastIndex]) idx = (idx + 1) % pool.length;
    }
    lastIndex = all().indexOf(pool[idx]);
    render(pool[idx], topic, name, seeded, '');
    saveHist({ d: todayStr(), topic: topic, l1: pool[idx].lines[0], tone: pool[idx].tone });
  }

  function related(v, topic) {
    var cands = all().filter(function (x) { return x !== v && x.tone === v.tone; });
    var sameTopic = cands.filter(function (x) { return (x.themes || []).indexOf(topic) >= 0; });
    var pick = (sameTopic.length >= 2 ? sameTopic : cands).slice(0, 2);
    if (!pick.length) return '';
    return '<h4>Câu Kiều cùng điềm để chiêm nghiệm thêm</h4><div class="ptv-sugs">' + pick.map(function (x, i) {
      return '<button type="button" class="ptv-sug ptv-kieu-rel" data-rel="' + all().indexOf(x) + '"><span class="ptv-sug-name">' + esc(x.lines[0]) + '</span></button>';
    }).join('') + '</div>';
  }

  function render(v, topic, name, seeded, extraNote) {
    var tone = TONE_STYLE[v.tone] || TONE_STYLE['trung bình'];
    var html = '<div class="ptv-card ptv-kieu-result">' +
      '<div class="ptv-kieu-head"><span class="ptv-kieu-topic">Quẻ Kiều · ' + esc(topic) + '</span>' +
      '<span class="ptv-kieu-tone" style="background:' + tone.bg + '">' + tone.label + '</span></div>' +
      '<blockquote class="ptv-kieu-verse"><p>' + esc(v.lines[0]) + '</p><p>' + esc(v.lines[1]) + '</p></blockquote>' +
      '<p class="ptv-kieu-src">Trích Truyện Kiều, Nguyễn Du</p>' +
      (name ? '<p class="ptv-kieu-for">Quẻ rút cho: <strong>' + esc(name) + '</strong></p>' : '') +
      '<h4>Giải nghĩa câu Kiều</h4><p>' + esc(v.meaning) + '</p>' +
      '<h4>Luận giải cho bạn</h4><p>' + esc(v.advice) + '</p>' +
      related(v, topic) +
      '<p class="ptv-note">' + (extraNote ? esc(extraNote) + ' ' : '') + (seeded
        ? 'Quẻ được rút theo con số bạn nghĩ tới, kết hợp chủ đề và ngày hôm nay, nên cùng một người hỏi cùng một việc trong ngày sẽ nhận cùng một quẻ để suy ngẫm cho nhất quán.'
        : 'Quẻ được gieo ngẫu nhiên. Nếu muốn quẻ gắn với một con số bạn vừa nghĩ tới trong đầu, hãy nhập con số đó rồi gieo lại.') + '</p>' +
      '<div class="ptv-kieu-actions"><button type="button" class="ptv-btn" id="ptv-kieu-again">Gieo quẻ khác</button>' +
      '<button type="button" class="ptv-xbtn" id="ptv-kieu-copy">Sao chép quẻ này</button><span id="ptv-kieu-copy-msg" class="ptv-note"></span></div></div>';
    var out = el('ptv-kieu-result');
    out.innerHTML = html;
    el('ptv-kieu-again').addEventListener('click', draw);
    el('ptv-kieu-copy').addEventListener('click', function () {
      var txt = 'Quẻ Kiều (' + topic + ', ' + tone.label + '): "' + v.lines[0] + ' / ' + v.lines[1] + '". ' + v.advice + ' Xem tại https://phongthuy.vietaa.com/boi-kieu/';
      var msg = el('ptv-kieu-copy-msg');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { msg.textContent = ' Đã chép.'; }, function () { msg.textContent = ' Trình duyệt chặn sao chép.'; });
    });
    var rels = out.querySelectorAll('.ptv-kieu-rel');
    for (var i = 0; i < rels.length; i++) rels[i].addEventListener('click', function () {
      var v2 = all()[parseInt(this.getAttribute('data-rel'), 10)];
      if (v2) render(v2, topic, name, false, 'Câu Kiều cùng điềm ' + tone.label.toLowerCase() + ' để bạn chiêm nghiệm thêm, không phải quẻ mới gieo.');
    });
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Giao dien bo sung: nghi thuc, che do gieo, cau hom nay ---------- */
  function injectExtras() {
    var form = el('ptv-kieu-form');
    var a = all();
    var daily = a.length ? a[hashStr('daily|' + todayStr()) % a.length] : null;
    var holder = document.createElement('div');
    var dailyHtml = '';
    if (daily) {
      var tone = TONE_STYLE[daily.tone] || TONE_STYLE['trung bình'];
      dailyHtml = '<div class="ptv-card ptv-kieu-daily"><div class="ptv-kieu-head"><span class="ptv-kieu-topic">Câu Kiều hôm nay · ' + esc(todayStr()) + '</span><span class="ptv-kieu-tone" style="background:' + tone.bg + '">' + tone.label + '</span></div>' +
        '<blockquote class="ptv-kieu-verse"><p>' + esc(daily.lines[0]) + '</p><p>' + esc(daily.lines[1]) + '</p></blockquote>' +
        '<button type="button" class="ptv-xbtn" id="ptv-kieu-daily-go">Xem luận giải câu này</button></div>';
    }
    holder.innerHTML =
      '<details class="ptv-card ptv-kieu-ritual"><summary>Nghi thức gieo quẻ theo lối xưa (bấm để xem)</summary>' +
      '<p>Người xưa gieo quẻ Kiều vào lúc yên tĩnh, rửa tay sạch, ngồi ngay ngắn rồi khấn thầm: xưng họ tên, ngày tháng năm sinh, nơi ở, và điều đang băn khoăn muốn hỏi. Ba câu khấn truyền thống được truyền miệng nhiều đời là:</p>' +
      '<blockquote class="ptv-kieu-verse"><p>Lạy vua Từ Hải</p><p>Lạy vãi Giác Duyên</p><p>Lạy tiên Thúy Kiều</p></blockquote>' +
      '<p>Khấn xong mới mở sách hoặc gieo quẻ, và chỉ hỏi một việc trong một lần gieo. Điều quan trọng nhất không nằm ở hình thức mà ở sự thành tâm và bình thản: đã gieo được quẻ thì suy ngẫm theo quẻ đó, không gieo đi gieo lại cho đến khi vừa ý.</p></details>' +
      dailyHtml +
      '<div class="ptv-kieu-modes"><span class="ptv-kieu-modes-label">Lối gieo:</span>' +
      '<button type="button" class="ptv-xtab ptv-on" id="ptv-mode-topic">Theo chủ đề</button>' +
      '<button type="button" class="ptv-xtab" id="ptv-mode-classic">Cổ điển, mở sách ngẫu nhiên</button></div>';
    form.parentNode.insertBefore(holder, form);
    var topicsRow = form.querySelector('.ptv-kieu-topics');
    function setMode(m) {
      mode = m;
      el('ptv-mode-topic').classList.toggle('ptv-on', m === 'topic');
      el('ptv-mode-classic').classList.toggle('ptv-on', m === 'classic');
      if (topicsRow) topicsRow.style.opacity = m === 'classic' ? '0.35' : '1';
    }
    el('ptv-mode-topic').addEventListener('click', function () { setMode('topic'); });
    el('ptv-mode-classic').addEventListener('click', function () { setMode('classic'); });
    if (daily) el('ptv-kieu-daily-go').addEventListener('click', function () { render(daily, 'câu Kiều hôm nay', '', false, 'Đây là câu Kiều của ngày hôm nay, mọi người gieo trong ngày đều gặp câu này.'); });
    var histBox = document.createElement('div');
    histBox.id = 'ptv-kieu-hist';
    var res = el('ptv-kieu-result');
    res.parentNode.insertBefore(histBox, res.nextSibling);
    renderHist();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('ptv-kieu-form')) return;
    var yr = el('ptv-kieu-birth'), i;
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Không nhập'; yr.appendChild(o0);
    for (i = 1940; i <= 2025; i++) { var o = document.createElement('option'); o.value = i; o.textContent = i; yr.appendChild(o); }
    injectExtras();
    el('ptv-kieu-form').addEventListener('submit', function (ev) { ev.preventDefault(); draw(); });
  });
})();
