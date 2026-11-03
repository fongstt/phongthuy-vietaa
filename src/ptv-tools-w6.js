
/* --- Nang cap rieng Gieo Que Dong Xu (v2): que bien + tra cuu 64 que + lich su --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc;
  var W3 = window.PTVToolsW3a || {};
  var queLookup = W3._queLookup;
  var QUE_TEXT = W3._QUE_TEXT || {};
  var TRIMAP = { '111': 'Càn', '110': 'Đoài', '101': 'Ly', '100': 'Chấn', '011': 'Tốn', '010': 'Khảm', '001': 'Cấn', '000': 'Khôn' };
  var TRI = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
  function triOfBits(b) { return TRIMAP[b.join('')]; }
  function queHTML2(q) {
    if (!q) return '';
    var cls = q.rating === 'Cát' ? 'ptv-good' : q.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad';
    return '<h3>Quẻ ' + esc(q.name) + ' <span class="' + cls + '">(' + esc(q.rating) + ')</span></h3><p>Quẻ thượng ' + esc(q.upper) + ', quẻ hạ ' + esc(q.lower) + '. ' + esc(QUE_TEXT[q.name] || '') + '</p>';
  }
  function linesHTML(tosses, flip) {
    return tosses.map(function (s, i) {
      var yang = (s === 7 || s === 9);
      if (flip && (s === 6 || s === 9)) yang = !yang;
      var mv = (s === 6 || s === 9);
      return '<div>Hào ' + (i + 1) + ': ' + (yang ? '▅▅▅▅▅' : '▅▅ ▅▅') + (mv ? (s === 6 ? ' ○ (lão âm, biến thành dương)' : ' × (lão dương, biến thành âm)') : '') + '</div>';
    }).reverse().join('');
  }

  function dongXuV2(c) {
    var tosses = [];
    c.innerHTML =
      '<div class="ptv-xtabs"><button type="button" class="ptv-xtab ptv-on" data-t="gieo">Gieo quẻ đồng xu</button>' +
      '<button type="button" class="ptv-xtab" data-t="tra">Tra cứu nhanh 64 quẻ</button></div>' +
      '<div id="dx-gieo"><div class="ptv-form">' +
      '<div class="ptv-row">' + L.field('Điều bạn muốn hỏi (không bắt buộc, giúp bạn tập trung khi gieo)', '<input type="text" id="dx-q" value="" placeholder="Ví dụ: Tôi có nên nhận công việc mới trong tháng này không?">', 'ptv-field-name') + '</div>' +
      '<p style="margin-top:0">Thành tâm nghĩ về điều bạn muốn hỏi, rồi bấm gieo xu 6 lần để lập đủ 6 hào, từ hào 1 ở dưới lên hào 6 ở trên, đúng cách gieo quẻ Kinh Dịch truyền thống. Nếu quẻ có hào biến, công cụ sẽ luận thêm cả quẻ biến cho bạn.</p>' +
      '<div class="ptv-kieu-verse" id="dx-coins"><p>🪙 🪙 🪙</p></div>' +
      '<div id="dx-lines" style="text-align:center;font-size:19px;line-height:1.5;margin:10px 0"></div>' +
      '<button type="button" class="ptv-btn" id="dx-toss">Gieo lần 1</button>' +
      '<div id="dx-hist"></div>' +
      '</div><div class="ptv-out"></div></div>' +
      '<div id="dx-tra" hidden><form class="ptv-form"><div class="ptv-row">' +
      L.field('Quẻ thượng', L.select('dx-up', TRI.map(function (t) { return '<option>' + t + '</option>'; }).join(''))) +
      L.field('Quẻ hạ', L.select('dx-lo', TRI.map(function (t) { return '<option>' + t + '</option>'; }).join(''))) +
      '</div><button type="submit" class="ptv-btn">Tra quẻ</button></form><div class="ptv-out"></div></div>';

    var tabs = c.querySelectorAll('.ptv-xtab');
    function show(t) {
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('ptv-on', tabs[i].getAttribute('data-t') === t);
      c.querySelector('#dx-gieo').hidden = t !== 'gieo';
      c.querySelector('#dx-tra').hidden = t !== 'tra';
    }
    for (var i = 0; i < tabs.length; i++) tabs[i].addEventListener('click', function () { show(this.getAttribute('data-t')); });

    function renderHist() {
      var h = [];
      try { h = JSON.parse(localStorage.getItem('ptvDongXuHistory') || '[]'); } catch (e) { h = []; }
      var box = c.querySelector('#dx-hist');
      if (!h.length) { box.innerHTML = ''; return; }
      box.innerHTML = '<h4>Các quẻ bạn đã gieo gần đây</h4>' + h.map(function (x, i) {
        return '<p class="ptv-note">🪙 <strong>' + esc(x.name) + '</strong>' + (x.bien ? ' → biến sang ' + esc(x.bien) : '') + (x.q ? ' · hỏi: ' + esc(x.q) : '') + '</p>';
      }).join('') + '<p><button type="button" class="ptv-xbtn" id="dx-hist-clear">Xóa lịch sử gieo</button></p>';
      c.querySelector('#dx-hist-clear').addEventListener('click', function () { localStorage.removeItem('ptvDongXuHistory'); renderHist(); });
    }
    renderHist();

    var btn = c.querySelector('#dx-toss');
    btn.addEventListener('click', function () {
      if (tosses.length >= 6) return;
      btn.disabled = true;
      var coinsBox = c.querySelector('#dx-coins');
      coinsBox.classList.remove('ptv-coin-anim'); void coinsBox.offsetWidth; coinsBox.classList.add('ptv-coin-anim');
      var spins = 0;
      var iv = setInterval(function () {
        spins++;
        coinsBox.innerHTML = '<p>' + [0, 0, 0].map(function () { return Math.random() < 0.5 ? '🟡' : '⚪'; }).join(' ') + '</p>';
        if (spins >= 6) {
          clearInterval(iv);
          settle();
        }
      }, 70);
      function settle() {
        var coins = [0, 0, 0].map(function () { return Math.random() < 0.5 ? 2 : 3; });
        var sum = coins[0] + coins[1] + coins[2];
        tosses.push(sum);
        coinsBox.innerHTML = '<p>' + coins.map(function (x) { return x === 3 ? '🟡 Ngửa' : '⚪ Sấp'; }).join(' · ') + ' = ' + sum + '</p>';
        c.querySelector('#dx-lines').innerHTML = linesHTML(tosses, false);
        btn.disabled = false;
        if (tosses.length < 6) { btn.textContent = 'Gieo lần ' + (tosses.length + 1); return; }
        btn.style.display = 'none';
        finish();
      }
    });

    function finish() {
      var bits = tosses.map(function (s) { return (s === 7 || s === 9) ? 1 : 0; });
      var lower = triOfBits(bits.slice(0, 3)), upper = triOfBits(bits.slice(3, 6));
      var q = queLookup(upper, lower);
      var bien = tosses.map(function (s, i) { return (s === 6 || s === 9) ? i + 1 : null; }).filter(Boolean);
      var question = (c.querySelector('#dx-q').value || '').trim();
      var html = (question ? '<p><strong>Điều bạn hỏi:</strong> ' + esc(question) + '</p>' : '') + queHTML2(q);
      var qb = null;
      if (bien.length) {
        var fbits = bits.map(function (b, i) { return (tosses[i] === 6 || tosses[i] === 9) ? (b ? 0 : 1) : b; });
        qb = queLookup(triOfBits(fbits.slice(3, 6)), triOfBits(fbits.slice(0, 3)));
        html += '<p><strong>Hào biến:</strong> hào ' + bien.join(', ') + '. Hào biến là nơi việc đang chuyển động mạnh nhất trong quẻ.</p>' +
          '<h4>Đồ hình quẻ biến</h4><div style="text-align:center;font-size:19px;line-height:1.5">' + linesHTML(tosses, true) + '</div>' +
          '<h4>Quẻ biến: ' + esc(qb ? qb.name : '') + '</h4>' + (qb ? queHTML2(qb).replace(/<h3>.*?<\/h3>/, '') : '') +
          '<p>Cách đọc khi có quẻ biến: quẻ chính (' + esc(q.name) + ') cho thấy tình hình hiện tại và xu hướng chính, quẻ biến (' + esc(qb ? qb.name : '') + ') cho thấy hướng sự việc sẽ chuyển tới nếu các hào biến phát huy tác dụng. ' + (bien.length === 1 ? 'Chỉ có một hào biến thì hào đó là điểm nhấn quan trọng nhất, hãy chú ý vị trí của nó: hào ở dưới chủ về giai đoạn đầu và việc gần, hào ở trên chủ về kết cục và việc xa.' : 'Có nhiều hào biến thì trọng tâm nằm ở bức tranh tổng thể của hai quẻ hơn là từng hào riêng lẻ.') + '</p>';
      } else {
        html += '<p>Quẻ không có hào biến, tình hình tương đối ổn định và diễn biến đúng theo ý nghĩa của quẻ chính trong thời gian tới.</p>';
      }
      html += '<div class="ptv-kieu-actions"><button type="button" class="ptv-xbtn" id="dx-new">Gieo quẻ mới</button> <button type="button" class="ptv-xbtn" id="dx-copy">Sao chép kết quả</button><span id="dx-copy-msg" class="ptv-note"></span></div>' +
        '<p class="ptv-note">Gieo quẻ đồng xu trên Phong Thủy VietAA dùng 3 đồng xu gieo 6 lần theo đúng lệ xưa: tổng 6 là lão âm, 7 là thiếu dương, 8 là thiếu âm, 9 là lão dương; hai hào lão là hào biến.</p>';
      L.resultBox(c.querySelector('#dx-gieo'), html);
      try {
        var h = JSON.parse(localStorage.getItem('ptvDongXuHistory') || '[]');
        h.unshift({ name: q.name, bien: qb ? qb.name : '', q: question });
        localStorage.setItem('ptvDongXuHistory', JSON.stringify(h.slice(0, 8)));
      } catch (e) {}
      renderHist();
      c.querySelector('#dx-new').addEventListener('click', function () {
        tosses = [];
        c.querySelector('#dx-lines').innerHTML = '';
        c.querySelector('#dx-coins').innerHTML = '<p>🪙 🪙 🪙</p>';
        c.querySelector('#dx-gieo .ptv-out').innerHTML = '';
        btn.style.display = ''; btn.textContent = 'Gieo lần 1';
      });
      c.querySelector('#dx-copy').addEventListener('click', function () {
        var txt = 'Mình vừa gieo quẻ đồng xu được quẻ ' + q.name + (qb ? ', biến sang quẻ ' + qb.name : '') + '. Gieo thử tại https://phongthuy.vietaa.com/gieo-que-dong-xu/';
        var msg = c.querySelector('#dx-copy-msg');
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { msg.textContent = ' Đã chép xong.'; }, function () { msg.textContent = ' Trình duyệt chặn sao chép.'; });
      });
    }

    c.querySelector('#dx-tra form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var q = queLookup(c.querySelector('#dx-up').value, c.querySelector('#dx-lo').value);
      if (q) L.resultBox(c.querySelector('#dx-tra'), queHTML2(q) + '<p class="ptv-note">64 quẻ Kinh Dịch được tạo thành từ 8 quẻ đơn ghép đôi. Đổi quẻ thượng và quẻ hạ ở form phía trên để tra quẻ khác.</p>');
    });
  }

  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'gieo-que-dong-xu': dongXuV2 });
})();

/* --- Bo cong cu xem ngay v2 dung chung: quet thang / kiem tra ngay / top 3 thang --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc;
  function monthOptions2() {
    var now = new Date(), out = '';
    for (var k = 0; k < 14; k++) { var d = new Date(now.getFullYear(), now.getMonth() + k, 1); out += '<option value="' + d.getFullYear() + '-' + (d.getMonth() + 1) + '"' + (k === 0 ? ' selected' : '') + '>Tháng ' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</option>'; }
    return out;
  }
  function fmtScore(s) { return String(s).replace('.', ','); }
  function verdictFor(s) { return s >= 7.5 ? 'Rất tốt' : s >= 6 ? 'Tốt' : s >= 5 ? 'Khá' : s >= 4 ? 'Trung bình' : s >= 3 ? 'Kém' : 'Nên tránh'; }
  function gioHDText(info) { return D.GIO_HD[info.day.chi].map(function (g) { return g + ' (' + E.HOUR_LABEL[g] + ')'; }).join(', '); }
  function dayLineHTML(x) {
    var i = x.i, s = x.s;
    return '<div class="ptv-dayline"><span class="ptv-dayline-date">' + D.fmtSolar(i) + '</span> <span class="ptv-dayline-lunar">' + D.fmtLunar(i) + ', ngày ' + i.day.text + '</span> <span class="ptv-dayline-score">' + fmtScore(s.score) + ' điểm</span><span class="ptv-dayline-why">' + s.notes.join('. ') + '. Giờ hoàng đạo: ' + gioHDText(i) + '.</span></div>';
  }
  function scanHTML(purpose, birthChi, yy, mm, label, extraOpts) {
    var opts = { purpose: purpose, birthChi: birthChi };
    if (extraOpts) for (var k in extraOpts) opts[k] = extraOpts[k];
    var me = null;
    var scored = D.monthDays(yy, mm).map(function (i) { return { i: i, s: D.scoreDay(i, opts) }; });
    var good = scored.filter(function (x) { return x.s.score >= 7; }).sort(function (a, b) { return b.s.score - a.s.score; });
    var ok = scored.filter(function (x) { return x.s.score >= 5.5 && x.s.score < 7; }).sort(function (a, b) { return b.s.score - a.s.score; });
    var bad = scored.filter(function (x) { return x.s.score <= 3; }).sort(function (a, b) { return a.i.dayOfMonth - b.i.dayOfMonth; });
    var html = '';
    html += '<h4>Ngày rất tốt (từ 7 điểm)</h4>' + (good.length ? good.slice(0, 10).map(dayLineHTML).join('') : '<p>Tháng này không có ngày nào đạt từ 7 điểm, bạn xem nhóm ngày khá bên dưới hoặc đổi sang tháng khác.</p>');
    if (ok.length) html += '<h4>Ngày khá (5,5 đến dưới 7 điểm), dùng được khi cần gấp</h4>' + ok.slice(0, 8).map(dayLineHTML).join('');
    if (bad.length) html += '<p class="ptv-note"><strong>Ngày nên tránh ' + label + ' trong tháng:</strong> ' + bad.map(function (x) { return D.fmtSolar(x.i) + ' (' + x.s.notes[x.s.notes.length - 1] + ')'; }).join('; ') + '.</p>';
    return html;
  }
  function quarterHTML(purpose, birthChi, label) {
    var now = new Date(), all = [];
    for (var k = 0; k < 3; k++) {
      var base = new Date(now.getFullYear(), now.getMonth() + k, 1);
      D.monthDays(base.getFullYear(), base.getMonth() + 1).forEach(function (i) {
        if (k === 0 && i.date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return;
        var s = D.scoreDay(i, { purpose: purpose, birthChi: birthChi });
        if (s.score >= 6.5) all.push({ i: i, s: s });
      });
    }
    all.sort(function (a, b) { return b.s.score - a.s.score || a.i.date - b.i.date; });
    if (!all.length) return '<p>Trong 3 tháng tới không có ngày nào đạt từ 6,5 điểm cho tuổi của bạn. Bạn nới sang tháng thứ tư hoặc chấp nhận một ngày khá ở tab quét tháng.</p>';
    return '<h4>Top ngày tốt ' + label + ' trong 3 tháng tới</h4>' + all.slice(0, 8).map(dayLineHTML).join('');
  }
  function checkDayHTML(purpose, birthChi, dateStr, label) {
    var p = (dateStr || '').split('-').map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2] || p[1] < 1 || p[1] > 12 || p[2] < 1 || p[2] > 31) return '<p>Ngày chưa đúng định dạng. Bạn nhập theo dạng năm-tháng-ngày, ví dụ 2027-03-17.</p>';
    var info = D.dayInfo(new Date(p[0], p[1] - 1, p[2]));
    var s = D.scoreDay(info, { purpose: purpose, birthChi: birthChi });
    return '<h4>Ngày ' + D.fmtSolar(info) + ' (' + D.fmtLunar(info) + '), ngày ' + info.day.text + ': <span class="' + (s.score >= 6 ? 'ptv-good' : s.score >= 4 ? 'ptv-mid' : 'ptv-bad') + '">' + fmtScore(s.score) + '/10, ' + verdictFor(s.score) + '</span></h4>' +
      '<p>' + s.notes.join('. ') + '.</p><p><strong>Giờ hoàng đạo trong ngày:</strong> ' + gioHDText(info) + '. Khi ' + label + ', nên chọn một giờ hoàng đạo thuận tiện nhất để bắt đầu.</p>';
  }
  function tabsHTML(labels) {
    return '<div class="ptv-xtabs">' + labels.map(function (x, i) { return '<button type="button" class="ptv-xtab' + (i === 0 ? ' ptv-on' : '') + '" data-t="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>';
  }
  function wireTabs(c, ids) {
    var tabs = c.querySelectorAll('.ptv-xtab');
    function show(t) {
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('ptv-on', tabs[i].getAttribute('data-t') === t);
      ids.forEach(function (id) { var el = c.querySelector('#' + id); if (el) el.hidden = id !== t; });
    }
    for (var i = 0; i < tabs.length; i++) tabs[i].addEventListener('click', function () { show(this.getAttribute('data-t')); });
  }
  function formWrap2(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }

  function dongThoV2(c) {
    c.innerHTML = tabsHTML([['dt-scan', 'Quét ngày tốt theo tháng'], ['dt-day', 'Kiểm tra một ngày cụ thể'], ['dt-quarter', 'Top ngày tốt 3 tháng tới'], ['dt-year', 'Kiểm tra năm xây nhà']]) +
      '<div id="dt-scan">' + formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn động thổ', L.select('m', monthOptions2())) + '</div>', 'Xem ngày tốt động thổ') + '</div>' +
      '<div id="dt-day" hidden>' + formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Ngày dự kiến động thổ (năm-tháng-ngày)', '<input type="text" id="dt" value="2027-03-17">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="dt-quarter" hidden>' + formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990)), 'ptv-field-name') + '</div>', 'Tìm ngày tốt nhất 3 tháng tới') + '</div>' +
      '<div id="dt-year" hidden>' + formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Năm dự định xây nhà', L.select('by', L.yearOptions(2024, 2035, 2027))) + '</div>', 'Kiểm tra năm xây') + '</div>';
    wireTabs(c, ['dt-scan', 'dt-day', 'dt-quarter', 'dt-year']);
    function birthChi(box) { return L.yearInfo(parseInt(box.querySelector('#y').value, 10)); }
    c.querySelector('#dt-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dt-scan'), me = birthChi(box);
      var parts = box.querySelector('#m').value.split('-').map(Number);
      var yy = parts[0], mm = parts[1], age = yy - me.year + 1;
      var tt = L.tamTai(me.chi, yy), kl = L.kimLau(age), ho = L.hoangOc(age);
      var html = '<h3>Ngày tốt động thổ tháng ' + mm + '/' + yy + ' cho gia chủ sinh năm ' + me.year + ' (tuổi ' + me.chi + ')</h3>' +
        '<p class="ptv-note"><strong>Kiểm tra năm ' + yy + ' theo tuổi:</strong> gia chủ ' + age + ' tuổi âm, ' + (tt ? 'phạm tam tai' : 'không phạm tam tai') + ', ' + (kl.bad ? 'phạm ' + kl.kind.toLowerCase() : 'không phạm kim lâu') + ', hoang ốc cung ' + ho.name + (ho.bad ? ' (cung xấu)' : ' (cung tốt)') + '. Chi tiết ở tab Kiểm tra năm xây nhà.</p>' +
        scanHTML('dong-tho', me.chi, yy, mm, 'động thổ');
      L.resultBox(box, html);
    });
    c.querySelector('#dt-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dt-day'), me = birthChi(box);
      L.resultBox(box, checkDayHTML('dong-tho', me.chi, box.querySelector('#dt').value, 'động thổ'));
    });
    c.querySelector('#dt-quarter form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dt-quarter'), me = birthChi(box);
      L.resultBox(box, '<h3>Ngày tốt động thổ nhất trong 3 tháng tới cho tuổi ' + me.chi + '</h3>' + quarterHTML('dong-tho', me.chi, 'động thổ'));
    });
    c.querySelector('#dt-year form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dt-year'), me = birthChi(box);
      var by = parseInt(box.querySelector('#by').value, 10), bInfo = L.yearInfo(by), age = by - me.year + 1;
      var tt = L.tamTai(me.chi, by), kl = L.kimLau(age), ho = L.hoangOc(age);
      var badCount = (tt ? 1 : 0) + (kl.bad ? 1 : 0) + (ho.bad ? 1 : 0);
      var TAI = { 'Thân': 'Dần, Mão, Thìn', 'Tý': 'Dần, Mão, Thìn', 'Thìn': 'Dần, Mão, Thìn', 'Dần': 'Thân, Dậu, Tuất', 'Ngọ': 'Thân, Dậu, Tuất', 'Tuất': 'Thân, Dậu, Tuất', 'Hợi': 'Tỵ, Ngọ, Mùi', 'Mão': 'Tỵ, Ngọ, Mùi', 'Mùi': 'Tỵ, Ngọ, Mùi', 'Tỵ': 'Hợi, Tý, Sửu', 'Dậu': 'Hợi, Tý, Sửu', 'Sửu': 'Hợi, Tý, Sửu' };
      var html = '<h3>Năm ' + by + ' (' + bInfo.text + ') với gia chủ sinh năm ' + me.year + ' (tuổi ' + me.chi + ', ' + age + ' tuổi âm)</h3>' +
        '<p><strong>Tam tai:</strong> ' + (tt ? 'phạm tam tai. Tuổi ' + me.chi + ' phạm tam tai vào các năm ' + TAI[me.chi] + ', và năm ' + by + ' là năm ' + bInfo.chi + '.' : 'không phạm. Tuổi ' + me.chi + ' chỉ phạm tam tai vào các năm ' + TAI[me.chi] + ', năm ' + by + ' là năm ' + bInfo.chi + ' nên không phạm.') + '</p>' +
        '<p><strong>Kim lâu:</strong> ' + (kl.bad ? 'phạm ' + kl.kind + ' (tuổi âm ' + age + ' chia 9 dư ' + (age % 9) + ').' : 'không phạm (tuổi âm ' + age + ' chia 9 dư ' + (age % 9) + ', các số dư phạm là 1, 3, 6, 8).') + '</p>' +
        '<p><strong>Hoang ốc:</strong> cung ' + ho.name + ', ' + (ho.bad ? 'là cung xấu trong 6 cung hoang ốc.' : 'là cung tốt trong 6 cung hoang ốc.') + '</p>' +
        '<p><strong>Kết luận:</strong> ' + (badCount === 0 ? 'năm ' + by + ' không phạm cả ba hạn, là năm thuận để gia chủ tự đứng tuổi động thổ và xây nhà.' : 'năm ' + by + ' phạm ' + badCount + ' trong 3 hạn lớn. Cách xử lý phổ biến là mượn tuổi của người không phạm hạn để đứng tên động thổ và làm các lễ chính, thủ tục và cách tính chi tiết có ở công cụ <a href="https://phongthuy.vietaa.com/xem-tuoi-xay-nha/">Xem tuổi xây nhà</a> của Phong Thủy VietAA. Nếu vẫn muốn tự làm, nên chọn ngày giờ thật tốt ở các tab bên trên và cân nhắc quy mô xây dựng vừa phải.') + '</p>' +
        '<p class="ptv-note">Ba hạn tam tai, kim lâu, hoang ốc là lớp kiểm tra theo NĂM và tuổi gia chủ, khác với điểm ngày ở các tab còn lại vốn chấm theo ngày. Một năm đẹp vẫn cần chọn ngày đẹp, và một ngày đẹp trong năm phạm hạn vẫn nên cân nhắc mượn tuổi.</p>';
      L.resultBox(box, html);
    });
  }

  window.PTVDayToolsV2 = { scanHTML: scanHTML, quarterHTML: quarterHTML, checkDayHTML: checkDayHTML, tabsHTML: tabsHTML, wireTabs: wireTabs, formWrap2: formWrap2, monthOptions2: monthOptions2, fmtScore: fmtScore, verdictFor: verdictFor };
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-ngay-dong-tho': dongThoV2 });
})();

/* --- Nang cap rieng Xem Ngay Mua Nha (v2) --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function muaNhaV2(c) {
    c.innerHTML = V.tabsHTML([['mn-scan', 'Quét ngày tốt theo tháng'], ['mn-day', 'Kiểm tra một ngày cụ thể'], ['mn-quarter', 'Top ngày tốt 3 tháng tới']]) +
      '<div id="mn-scan">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn mua nhà', L.select('m', V.monthOptions2())) + '</div><div class="ptv-row">' + L.field('Việc chính trong ngày', L.select('mode', '<option value="ban-giao">Nhận bàn giao nhà</option><option value="ky-ket">Ký hợp đồng, đặt cọc</option>'), 'ptv-field-name') + '</div>', 'Xem ngày tốt mua nhà') + '</div>' +
      '<div id="mn-day" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Ngày dự kiến (năm-tháng-ngày)', '<input type="text" id="dt" value="2027-03-17">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="mn-quarter" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990)), 'ptv-field-name') + '</div>', 'Tìm ngày tốt nhất 3 tháng tới') + '</div>';
    V.wireTabs(c, ['mn-scan', 'mn-day', 'mn-quarter']);
    c.querySelector('#mn-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mn-scan'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      var parts = box.querySelector('#m').value.split('-').map(Number);
      var mode = box.querySelector('#mode').value;
      var note = mode === 'ban-giao'
        ? '<p class="ptv-note">Bạn đang xem ngày cho việc <strong>nhận bàn giao nhà</strong>: đây là mốc bạn chính thức nhận chìa khóa và bước vào nhà mới, nên ưu tiên ngày giờ thuận tiện để kiểm tra kỹ hiện trạng nhà, đồng hồ điện nước và biên bản bàn giao. Nếu ngày ký hợp đồng khác ngày nhận nhà, bạn có thể kiểm tra riêng ngày ký ở tab Kiểm tra một ngày cụ thể.</p>'
        : '<p class="ptv-note">Bạn đang xem ngày cho việc <strong>ký hợp đồng, đặt cọc</strong>: đây là mốc pháp lý quan trọng nhất của giao dịch, nên ưu tiên ngày đẹp và mang đủ giấy tờ, đọc kỹ điều khoản trước khi ký. Ngày nhận bàn giao sau này có thể chọn riêng ở tab Kiểm tra một ngày cụ thể.</p>';
      L.resultBox(box, '<h3>Ngày tốt mua nhà tháng ' + parts[1] + '/' + parts[0] + ' cho gia chủ sinh năm ' + me.year + ' (tuổi ' + me.chi + ')</h3>' + note + V.scanHTML('mua-nha', me.chi, parts[0], parts[1], 'mua nhà'));
    });
    c.querySelector('#mn-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mn-day'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, V.checkDayHTML('mua-nha', me.chi, box.querySelector('#dt').value, 'ký kết và nhận nhà'));
    });
    c.querySelector('#mn-quarter form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mn-quarter'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, '<h3>Ngày tốt mua nhà nhất trong 3 tháng tới cho tuổi ' + me.chi + '</h3>' + V.quarterHTML('mua-nha', me.chi, 'mua nhà'));
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-ngay-mua-nha': muaNhaV2 });
})();

/* --- Nang cap rieng Xem Nam Sinh Con (v2): giu nguyen cong thuc diem, them phan tich tung ben --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function relText(P, C) {
    if (L.GENERATES[P.el] === C.el) return 'mệnh ' + P.el + ' sinh mệnh ' + C.el + ' của con (bố mẹ nâng đỡ con)';
    if (L.GENERATES[C.el] === P.el) return 'mệnh con ' + C.el + ' sinh mệnh ' + P.el + ' (con hao cho bố mẹ, theo lệ là con mang tài khí về nhà)';
    if (L.CONTROLS[P.el] === C.el) return 'mệnh ' + P.el + ' khắc mệnh ' + C.el + ' của con';
    if (L.CONTROLS[C.el] === P.el) return 'mệnh con ' + C.el + ' khắc mệnh ' + P.el;
    return 'mệnh cùng hành ' + P.el + ' hoặc bình hòa với mệnh con';
  }
  function scoreYear(F, M, cy) {
    var C = L.yearInfo(cy), s = 5, notes = [];
    [F, M].forEach(function (P, ix) {
      var rel = L.chiRelation(P.chi, C.chi);
      s += rel.score * 0.8;
      if (rel.score >= 2) notes.push(rel.label + ' với ' + (ix ? 'mẹ' : 'bố'));
      if (rel.score <= -2) notes.push('xung với ' + (ix ? 'mẹ' : 'bố'));
      if (L.GENERATES[P.el] === C.el) { s += 0.8; notes.push('mệnh ' + (ix ? 'mẹ' : 'bố') + ' sinh con'); }
      else if (L.CONTROLS[P.el] === C.el) { s -= 0.8; notes.push('mệnh ' + (ix ? 'mẹ' : 'bố') + ' khắc con'); }
      else if (L.CONTROLS[C.el] === P.el) { s -= 0.5; }
    });
    s = Math.max(0, Math.min(10, Math.round(s * 2) / 2));
    return { cy: cy, C: C, s: s, notes: notes };
  }
  function verdict(s) { return s >= 7 ? 'Rất hợp' : s >= 6 ? 'Hợp' : s >= 5 ? 'Khá hợp' : s >= 4 ? 'Bình hòa' : 'Ít hợp'; }

  function namSinhConV2(c) {
    var nowY = new Date().getFullYear();
    c.innerHTML = V.tabsHTML([['sc-rank', 'Xếp hạng các năm sinh con'], ['sc-one', 'Kiểm tra một năm cụ thể']]) +
      '<div id="sc-rank">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bố', L.select('fy', L.yearOptions(1955, 2010, 1992))) + L.field('Năm sinh của mẹ', L.select('my', L.yearOptions(1955, 2010, 1994))) + L.field('Xét đến năm', L.select('ey', L.yearOptions(2028, 2035, 2030))) + '</div>', 'Xem năm sinh con hợp tuổi') + '</div>' +
      '<div id="sc-one" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bố', L.select('fy', L.yearOptions(1955, 2010, 1992))) + L.field('Năm sinh của mẹ', L.select('my', L.yearOptions(1955, 2010, 1994))) + L.field('Năm dự định sinh con', L.select('cy', L.yearOptions(2026, 2035, 2027))) + '</div>', 'Kiểm tra năm này') + '</div>';
    V.wireTabs(c, ['sc-rank', 'sc-one']);
    function parents(box) { return [L.yearInfo(parseInt(box.querySelector('#fy').value, 10)), L.yearInfo(parseInt(box.querySelector('#my').value, 10))]; }
    c.querySelector('#sc-rank form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#sc-rank'), pr = parents(box), F = pr[0], M = pr[1];
      var ey = parseInt(box.querySelector('#ey').value, 10), rows = [];
      for (var cy = nowY; cy <= ey; cy++) rows.push(scoreYear(F, M, cy));
      rows.sort(function (a, b) { return b.s - a.s || a.cy - b.cy; });
      var top = rows[0];
      var html = '<div class="ptv-facts"><span>Bố: <strong>' + F.year + '</strong> (' + F.text + ', ' + esc(F.napAm) + ')</span><span>Mẹ: <strong>' + M.year + '</strong> (' + M.text + ', ' + esc(M.napAm) + ')</span></div>' +
        '<h3>Năm hợp nhất trong các năm đã xét: ' + top.cy + ' (' + top.C.text + '), ' + V.fmtScore(top.s) + '/10</h3>' +
        '<p>Con sinh năm ' + top.cy + ' tuổi ' + top.C.text + ', mệnh ' + esc(top.C.napAm) + '. ' + (top.notes.length ? 'Điểm mạnh của năm này: ' + top.notes.join(', ').toLowerCase() + '.' : 'Năm này bình hòa với cả bố và mẹ, không xung khắc đáng kể.') + ' Bảng đầy đủ bên dưới xếp hạng mọi năm từ ' + nowY + ' đến ' + ey + ' để bạn đối chiếu cùng kế hoạch thực tế của gia đình.</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm sinh</th><th>Tuổi của con</th><th>Mệnh</th><th>Điểm hợp</th><th>Nhận định</th><th>Chi tiết quan hệ</th></tr>' +
        rows.map(function (r) { return '<tr><td><strong>' + r.cy + '</strong></td><td>' + r.C.text + '</td><td>' + esc(r.C.napAm) + '</td><td><strong>' + V.fmtScore(r.s) + '</strong></td><td>' + verdict(r.s) + '</td><td>' + (r.notes.join(', ') || 'Bình hòa với cả bố và mẹ') + '</td></tr>'; }).join('') + '</table></div>' +
        '<p class="ptv-note">Điểm được tính từ quan hệ địa chi (tam hợp, lục hợp, lục xung, lục hại) và quan hệ sinh khắc nạp âm giữa con với từng người bố, mẹ. Con cái là duyên trời cho, bảng này chỉ nên dùng để tham khảo khi gia đình đang có kế hoạch và còn nhiều lựa chọn, tuyệt đối không nên trì hoãn việc sinh con chỉ vì một năm điểm thấp nếu sức khỏe và điều kiện của mẹ không cho phép chờ đợi.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#sc-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#sc-one'), pr = parents(box), F = pr[0], M = pr[1];
      var cy = parseInt(box.querySelector('#cy').value, 10), r = scoreYear(F, M, cy), C = r.C;
      function block(P, label) {
        var rel = L.chiRelation(P.chi, C.chi);
        return '<p><strong>Con với ' + label + ' (' + P.text + '):</strong> tuổi ' + C.chi + ' và tuổi ' + P.chi + ' thuộc quan hệ ' + rel.label.toLowerCase() + ' theo địa chi; về mệnh, ' + relText(P, C) + '.</p>';
      }
      var html = '<h3>Con sinh năm ' + cy + ' (' + C.text + ', mệnh ' + esc(C.napAm) + '): điểm hợp ' + V.fmtScore(r.s) + '/10, ' + verdict(r.s) + '</h3>' +
        block(F, 'bố') + block(M, 'mẹ') +
        '<p><strong>Tổng kết:</strong> ' + (r.notes.length ? r.notes.join(', ') + '.' : 'Năm này bình hòa với cả bố và mẹ.') + ' ' + (r.s >= 6 ? 'Đây là mức điểm thuận theo quan niệm dân gian, gia đình có thể yên tâm lên kế hoạch.' : r.s >= 4.5 ? 'Mức điểm trung bình khá phổ biến, vì trong 12 con giáp rất hiếm năm hợp hoàn hảo với cả hai tuổi bố mẹ; đừng vì mức điểm này mà thay đổi kế hoạch lớn của gia đình.' : 'Mức điểm thấp chủ yếu do xung khắc địa chi, nhưng đây chỉ là một lớp quan niệm tham khảo; tình cảm và cách nuôi dạy con mới quyết định hòa khí gia đình.') + '</p>' +
        '<p class="ptv-note">Khi đã chốt năm sinh, bạn có thể xem tiếp công cụ <a href="https://phongthuy.vietaa.com/dat-ten-con/">Đặt tên con theo phong thủy</a> của Phong Thủy VietAA để chuẩn bị sẵn vài cái tên hợp mệnh cho bé.</p>';
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-nam-sinh-con': namSinhConV2 });
})();
