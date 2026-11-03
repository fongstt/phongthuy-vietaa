
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

/* --- Nang cap rieng Xem Gio Xuat Hanh (v2) --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc, V = window.PTVDayToolsV2;
  function todayStr(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function hoursHTML(info) {
    var sat = D.satOf(info), hoang = ['Thanh Long', 'Minh Đường', 'Kim Quỹ', 'Thiên Đức', 'Ngọc Đường', 'Tư Mệnh'].indexOf(sat) >= 0;
    var rows = E.CHI.map(function (g) {
      var hd = D.GIO_HD[info.day.chi].indexOf(g) >= 0;
      return '<tr><td><strong>Giờ ' + g + '</strong></td><td>' + E.HOUR_LABEL[g] + '</td><td class="' + (hd ? 'ptv-good' : 'ptv-bad') + '">' + (hd ? 'Hoàng đạo' : 'Hắc đạo') + '</td></tr>';
    }).join('');
    var qn = (D.QUY_NHAN[info.day.can] || []).map(function (ch) { return D.CHI_DIR[ch] + ' (' + ch + ')'; }).join(' và ');
    return '<h3>Giờ xuất hành ngày ' + D.fmtSolar(info) + ' (' + D.fmtLunar(info) + ')</h3>' +
      '<p>Ngày ' + info.day.text + ', thuộc ngày ' + (hoang ? '<span class="ptv-good">hoàng đạo (' + sat + ')</span>' : '<span class="ptv-bad">hắc đạo (' + sat + ')</span>') + ', trực ' + D.trucOf(info) + '.</p>' +
      '<p><strong>Hướng xuất hành đón Quý nhân hôm nay:</strong> phương ' + qn + '. Khi ra khỏi nhà, nên đi về hướng này một đoạn trước rồi mới rẽ tới điểm đến, theo lệ dân gian là để đón khí lành đầu ngày.</p>' +
      '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Giờ</th><th>Khung giờ</th><th>Loại</th></tr>' + rows + '</table></div>' +
      '<p class="ptv-note">Sáu giờ hoàng đạo trong ngày là các khung nên ưu tiên để khởi hành, mở đầu công việc hoặc làm lễ. Các giờ hắc đạo còn lại không phải là không đi được, chỉ nên tránh dùng cho việc quan trọng nếu bạn còn lựa chọn khác.</p>';
  }
  function gioXuatHanhV2(c) {
    c.innerHTML = V.tabsHTML([['gx-day', 'Giờ hoàng đạo trong ngày'], ['gx-scan', 'Quét ngày xuất hành tốt theo tháng'], ['gx-today', 'Giờ tốt hôm nay và ngày mai']]) +
      '<div id="gx-day">' + V.formWrap2('<div class="ptv-row">' + L.field('Ngày dương lịch (năm-tháng-ngày)', '<input type="text" id="dt" value="' + todayStr(0) + '">', 'ptv-field-name') + '</div>', 'Xem giờ hoàng đạo') + '</div>' +
      '<div id="gx-scan" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn xuất hành', L.select('m', V.monthOptions2())) + '</div>', 'Xem ngày xuất hành tốt') + '</div>' +
      '<div id="gx-today" hidden><div class="ptv-out"></div></div>';
    V.wireTabs(c, ['gx-day', 'gx-scan', 'gx-today']);
    c.querySelector('#gx-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#gx-day'), p = box.querySelector('#dt').value.split('-').map(Number);
      if (p.length !== 3 || !p[0] || !p[1] || !p[2]) { L.resultBox(box, '<p>Ngày chưa đúng định dạng năm-tháng-ngày, ví dụ ' + todayStr(0) + '.</p>'); return; }
      L.resultBox(box, hoursHTML(D.dayInfo(new Date(p[0], p[1] - 1, p[2]))));
    });
    c.querySelector('#gx-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#gx-scan'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      var parts = box.querySelector('#m').value.split('-').map(Number);
      L.resultBox(box, '<h3>Ngày xuất hành tốt tháng ' + parts[1] + '/' + parts[0] + ' cho tuổi ' + me.chi + '</h3>' + V.scanHTML('xuat-hanh', me.chi, parts[0], parts[1], 'xuất hành'));
    });
    var rendered = false;
    c.querySelector('[data-t="gx-today"]').addEventListener('click', function () {
      if (rendered) return; rendered = true;
      var box = c.querySelector('#gx-today .ptv-out');
      box.innerHTML = hoursHTML(D.dayInfo(new Date())) + '<hr>' + hoursHTML(D.dayInfo(new Date(Date.now() + 86400000)));
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-gio-xuat-hanh': gioXuatHanhV2 });
})();

/* --- Nang cap rieng Xem Boi Ngay Sinh (v2) --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, esc = L.esc, V = window.PTVDayToolsV2;
  function reduceNum(n) { while (n > 9 && n !== 11 && n !== 22) { n = String(n).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0); } return n; }
  function sumDigits(n) { return String(n).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0); }
  function boiNgaySinhV2(c) {
    c.innerHTML = V.formWrap2('<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="by" inputmode="numeric" value="1995">') + '</div>', 'Xem bói ngày sinh');
    c.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = parseInt(c.querySelector('#bd').value, 10), m = parseInt(c.querySelector('#bm').value, 10), y = parseInt(c.querySelector('#by').value, 10);
      if (!d || !m || !y || d > 31 || m > 12 || y < 1900 || y > 2100) { L.resultBox(c, '<p>Ngày sinh chưa hợp lệ, bạn kiểm tra lại giúp mình nhé.</p>'); return; }
      var data = (window.PTV_TOOLS_DATA || {}).thanSoHoc || { numbers: {} };
      var lp = reduceNum(sumDigits(d) + sumDigits(m) + sumDigits(y));
      var dayN = reduceNum(d), att = reduceNum(d + m);
      var nowY = new Date().getFullYear(), py = reduceNum(sumDigits(d) + sumDigits(m) + sumDigits(nowY));
      var info = D.dayInfo(new Date(y, m - 1, d)), yi = L.yearInfo(info.lunar.y);
      var wd = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][new Date(y, m - 1, d).getDay()];
      function numBlock(title, n, intro) {
        var e = data.numbers[String(n)] || {};
        if (!e.traits) return '';
        return '<p><strong>' + title + ' ' + n + (e.name ? ' (' + esc(e.name.replace(/^Số \d+, /, '')) + ')' : '') + ':</strong> ' + (intro || '') + esc(e.traits) + '</p>' +
          (e.career ? '<p><strong>Sự nghiệp hợp:</strong> ' + esc(e.career) + '</p>' : '') +
          (e.love ? '<p><strong>Tình cảm:</strong> ' + esc(e.love) + '</p>' : '');
      }
      var html = '<div class="ptv-facts"><span>Sinh: <strong>' + d + '/' + m + '/' + y + '</strong> (' + wd + ')</span><span>Âm lịch: <strong>' + D.fmtLunar(info) + '</strong></span><span>Ngày can chi: <strong>' + info.day.text + '</strong></span><span>Tuổi: <strong>' + yi.text + '</strong>, mệnh ' + esc(yi.napAm) + '</span></div>' +
        '<h3>Số chủ đạo ' + lp + ' quyết định phần lớn tính cách của bạn</h3>' + numBlock('Số chủ đạo', lp) +
        '<h3>Hai con số phụ từ chính ngày sinh</h3>' +
        '<p><strong>Số ngày sinh ' + dayN + '</strong> là tài năng bẩm sinh bạn mang theo từ lúc chào đời: ' + esc((data.numbers[String(dayN)] || {}).traits || '') + '</p>' +
        '<p><strong>Số thái độ ' + att + '</strong> là cách bạn phản ứng đầu tiên trước mọi việc và ấn tượng người khác nhận được ở lần gặp đầu: ' + esc((data.numbers[String(att)] || {}).traits || '') + '</p>' +
        '<h3>Năm cá nhân ' + nowY + ' của bạn là số ' + py + '</h3>' +
        '<p>Theo chu kỳ 9 năm của thần số học, mỗi năm bạn đi qua một con số cá nhân từ 1 đến 9 (và đôi khi là số bậc thầy 11, 22). Năm ' + nowY + ' bạn ở số ' + py + ': ' + esc((data.numbers[String(py)] || {}).traits || '') + ' Hãy đọc phần này như một gợi ý về nhịp năm, việc gì nên đẩy mạnh, việc gì nên chậm lại, thay vì một lời tiên đoán.</p>' +
        '<h3>Lớp can chi của ngày sinh</h3>' +
        '<p>Bạn sinh vào ngày ' + info.day.text + ': thiên can ' + info.day.can + ' thuộc hành ' + info.day.canEl + ', địa chi ' + info.day.chi + ' thuộc hành ' + info.day.chiEl + '. Năm sinh ' + yi.text + ' mang mệnh ' + esc(yi.napAm) + ' (hành ' + yi.el + '). Trong cách luận truyền thống, hành của ngày sinh được xem là phần khí chất gần với bản thân nhất, còn mệnh năm sinh là nền chung của cả thế hệ sinh cùng năm. Khi ba lớp số học, can chi ngày và mệnh năm sinh cùng chỉ về một xu hướng, xu hướng đó thường thể hiện khá rõ ở bạn; khi chúng mâu thuẫn nhau, tính cách của bạn sẽ đa diện hơn, tùy hoàn cảnh mà bộc lộ mặt khác nhau.</p>' +
        '<p class="ptv-note">Toàn bộ phần luận giải trên do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> biên soạn để tham khảo và tự chiêm nghiệm. Ngày sinh cho thấy xu hướng, còn con người thật được tạo nên bởi lựa chọn và nỗ lực mỗi ngày.</p>' +
        '<p><button type="button" class="ptv-copy-btn">Sao chép tóm tắt kết quả</button></p>';
      L.resultBox(c, html);
      var btn = c.querySelector('.ptv-copy-btn');
      if (btn) btn.addEventListener('click', function () {
        var e1 = data.numbers[String(lp)] || {};
        var text = 'Bói ngày sinh ' + d + '/' + m + '/' + y + ' (' + wd + '), ngày ' + info.day.text + ', tuổi ' + yi.text + ' mệnh ' + yi.napAm + '. Số chủ đạo ' + lp + ': ' + (e1.traits || '') + ' Năm cá nhân ' + nowY + ': số ' + py + '. (Phong Thủy VietAA, phongthuy.vietaa.com)';
        function done() { btn.textContent = 'Đã sao chép'; setTimeout(function () { btn.textContent = 'Sao chép tóm tắt kết quả'; }, 2000); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
      });
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-boi-ngay-sinh': boiNgaySinhV2 });
})();

/* --- Nang cap rieng Ngay Mo Hang Dau Nam (v2) --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc, V = window.PTVDayToolsV2;
  function dayDetail(info, s) {
    var qn = (D.QUY_NHAN[info.day.can] || []).map(function (ch) { return D.CHI_DIR[ch] + ' (' + ch + ')'; }).join(' và ');
    return '<p><strong>Giờ hoàng đạo trong ngày:</strong> ' + D.GIO_HD[info.day.chi].map(function (g) { return 'giờ ' + g + ' (' + E.HOUR_LABEL[g] + ')'; }).join(', ') + '.</p>' +
      '<p><strong>Hướng đón Quý nhân:</strong> phương ' + qn + '.</p>' +
      '<p><strong>Các yếu tố chấm điểm:</strong> ' + (s.notes.length ? esc(s.notes.join('; ')) : 'Ngày bình hòa, không có yếu tố nổi bật') + '.</p>';
  }
  function moHangV2(c) {
    c.innerHTML = V.tabsHTML([['mh-rank', 'Ngày mở hàng tốt nhất'], ['mh-guest', 'Chọn người mở hàng hợp tuổi'], ['mh-one', 'Kiểm tra một ngày']]) +
      '<div id="mh-rank">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ cơ sở', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tết năm', L.select('ty', L.yearOptions(2026, 2028, 2027))) + '</div>', 'Xem ngày mở hàng đầu năm') + '</div>' +
      '<div id="mh-guest" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ cơ sở', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tết năm', L.select('ty', L.yearOptions(2026, 2028, 2027))) + L.field('Ngày mở hàng (tháng Giêng)', L.select('ld', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(function (n) { return '<option value="' + n + '"' + (n === 1 ? ' selected' : '') + '>Mùng ' + n + '</option>'; }).join(''))) + '</div>', 'Xem tuổi người mở hàng hợp') + '</div>' +
      '<div id="mh-one" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ cơ sở', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tết năm', L.select('ty', L.yearOptions(2026, 2028, 2027))) + L.field('Ngày muốn kiểm tra (tháng Giêng)', L.select('ld', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(function (n) { return '<option value="' + n + '"' + (n === 1 ? ' selected' : '') + '>Mùng ' + n + '</option>'; }).join(''))) + '</div>', 'Kiểm tra ngày này') + '</div>';
    V.wireTabs(c, ['mh-rank', 'mh-guest', 'mh-one']);
    function rank(box) {
      var y = parseInt(box.querySelector('#y').value, 10), ty = parseInt(box.querySelector('#ty').value, 10);
      var me = L.yearInfo(y), out = [];
      for (var ld = 1; ld <= 16; ld++) {
        var dt = D.lunar2solar(ld, 1, ty, false); if (!dt) continue;
        var info = D.dayInfo(dt);
        out.push({ ld: ld, i: info, s: D.scoreDay(info, { purpose: 'mo-hang', birthChi: me.chi }) });
      }
      out.sort(function (a, b) { return b.s.score - a.s.score || a.ld - b.ld; });
      return { me: me, ty: ty, out: out };
    }
    c.querySelector('#mh-rank form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mh-rank'), r = rank(box), top = r.out[0];
      var html = '<h3>Ngày mở hàng đầu năm Tết ' + r.ty + ' cho tuổi ' + r.me.text + ': tốt nhất là mùng ' + top.ld + '</h3>' +
        '<p>Mùng ' + top.ld + ' tháng Giêng năm ' + r.ty + ' (dương lịch ' + D.fmtSolar(top.i) + ') là ngày ' + top.i.day.text + ', đạt ' + V.fmtScore(top.s.score) + '/10, ' + V.verdictFor(top.s.score).toLowerCase() + ' cho việc mở hàng của tuổi ' + r.me.chi + '.</p>' + dayDetail(top.i, top.s) +
        '<h3>Bảng xếp hạng đủ 16 ngày đầu tháng Giêng</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Ngày</th><th>Dương lịch</th><th>Can chi</th><th>Điểm</th><th>Nhận định</th></tr>' + r.out.map(function (x) { return '<tr><td><strong>Mùng ' + x.ld + '</strong></td><td>' + D.fmtSolar(x.i) + '</td><td>' + x.i.day.text + '</td><td><strong>' + V.fmtScore(x.s.score) + '</strong></td><td>' + V.verdictFor(x.s.score) + (x.s.hoangDao ? ', ngày hoàng đạo' : ', ngày hắc đạo') + ', trực ' + x.s.truc + '</td></tr>'; }).join('') + '</table></div>' +
        '<p class="ptv-note">Bảng xét từ mùng 1 đến 16 tháng Giêng. Nếu ngày điểm cao nhất không thuận cho khâu chuẩn bị, bạn hoàn toàn có thể chọn ngày điểm khá ngay phía sau, mở hàng đúng ngày chuẩn bị kỹ vẫn hơn chạy theo ngày đẹp mà cập rập.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#mh-guest form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mh-guest'), y = parseInt(box.querySelector('#y').value, 10), ty = parseInt(box.querySelector('#ty').value, 10), ld = parseInt(box.querySelector('#ld').value, 10);
      var me = L.yearInfo(y), dt = D.lunar2solar(ld, 1, ty, false), info = D.dayInfo(dt);
      var rows = E.CHI.map(function (ch) {
        var r1 = L.chiRelation(me.chi, ch), r2 = L.chiRelation(info.day.chi, ch), tot = r1.score + r2.score;
        var vd = tot >= 3 ? 'Rất hợp, nên mời' : tot >= 1 ? 'Hợp' : tot >= -1 ? 'Bình hòa' : 'Nên tránh';
        return { ch: ch, tot: tot, html: '<tr><td><strong>Tuổi ' + ch + '</strong></td><td>' + r1.label + ' với chủ</td><td>' + r2.label + ' với ngày mở hàng</td><td>' + vd + '</td></tr>' };
      }).sort(function (a, b) { return b.tot - a.tot; });
      var html = '<h3>Người mở hàng hợp cho ngày mùng ' + ld + ' Tết ' + ty + ' (' + D.fmtSolar(info) + ', ngày ' + info.day.text + ')</h3>' +
        '<p>Chủ cơ sở tuổi ' + me.text + '. Theo lệ mở hàng đầu năm, vị khách đầu tiên bước vào hoặc người được mời mở hàng nên hợp tuổi với cả chủ lẫn ngày mở hàng, đồng thời tính tình xởi lởi, làm ăn phát đạt để lấy vía tốt cho cả năm.</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Tuổi của người mở hàng</th><th>Quan hệ với tuổi chủ</th><th>Quan hệ với ngày</th><th>Nhận định</th></tr>' + rows.map(function (r) { return r.html; }).join('') + '</table></div>' +
        '<p class="ptv-note">Bảng tính theo địa chi của tuổi; khi chọn người cụ thể, hãy ưu tiên người khỏe mạnh, vui vẻ và đang làm ăn thuận lợi thật ở ngoài đời, vì vía tốt trước hết là năng lượng thật của con người đó.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#mh-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mh-one'), y = parseInt(box.querySelector('#y').value, 10), ty = parseInt(box.querySelector('#ty').value, 10), ld = parseInt(box.querySelector('#ld').value, 10);
      var me = L.yearInfo(y), dt = D.lunar2solar(ld, 1, ty, false), info = D.dayInfo(dt);
      var s = D.scoreDay(info, { purpose: 'mo-hang', birthChi: me.chi });
      var html = '<h3>Mùng ' + ld + ' tháng Giêng Tết ' + ty + ' (' + D.fmtSolar(info) + '): ' + V.fmtScore(s.score) + '/10, ' + V.verdictFor(s.score) + ' cho mở hàng tuổi ' + me.chi + '</h3>' +
        '<p>Ngày ' + info.day.text + ', ' + (s.hoangDao ? 'ngày hoàng đạo (' + s.sat + ')' : 'ngày hắc đạo (' + s.sat + ')') + ', trực ' + s.truc + '.</p>' + dayDetail(info, s) +
        '<p class="ptv-note">Nếu điểm của ngày này chưa cao, hãy mở tab xếp hạng để xem các ngày đầu năm khác hợp hơn cho tuổi của bạn.</p>';
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'ngay-mo-hang-dau-nam': moHangV2 });
})();

/* --- Nang cap rieng Xem Tuoi Xay Nha (v2) --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var HO_TXT = { 'Nhất Cát': 'cung tốt, làm nhà tuổi này gia chủ có chốn an cư êm ấm, mọi việc hanh thông', 'Nhì Nghi': 'cung tốt, làm nhà sẽ tấn tài lộc, nhà cửa hưng thịnh, giàu có', 'Tam Địa Sát': 'cung xấu, gia chủ dễ mắc bệnh tật nếu làm nhà năm này', 'Tứ Tấn Tài': 'cung tốt, làm nhà phúc lộc sẽ tới, tiền của dồi dào', 'Ngũ Thọ Tử': 'cung xấu, trong nhà dễ chia rẽ, lâm vào cảnh bất hòa, tử biệt', 'Lục Hoang Ốc': 'cung xấu, làm nhà khó thành đạt, nhà dễ rơi vào cảnh hoang vắng' };
  function checkYear(birth, year) {
    var age = year - birth + 1, me = L.yearInfo(birth), yI = L.yearInfo(year);
    var tt = L.tamTai(me.chi, year) === true;
    var kl = L.kimLau(age), ho = L.hoangOc(age);
    return { age: age, me: me, yI: yI, tt: tt, kl: kl, ho: ho, clean: !tt && !kl.bad && !ho.bad };
  }
  function hanBlocks(ck) {
    var ttNames = { };
    var html = '<p><strong>Tam tai:</strong> ' + (ck.tt ? '<span class="ptv-bad">Phạm tam tai.</span> Tuổi ' + ck.me.chi + ' gặp tam tai vào các năm ' + tamTaiYearsText(ck.me.chi) + ', và năm ' + ck.yI.year + ' (' + ck.yI.chi + ') nằm trong ba năm đó. Dân gian kiêng động thổ, khởi công lớn trong năm tam tai vì cho rằng dễ gặp trắc trở ngoài dự tính.' : '<span class="ptv-good">Không phạm tam tai.</span> Năm ' + ck.yI.year + ' không nằm trong ba năm tam tai của tuổi ' + ck.me.chi + ' (' + tamTaiYearsText(ck.me.chi) + ').') + '</p>';
    html += '<p><strong>Kim lâu:</strong> ' + (ck.kl.bad ? '<span class="ptv-bad">Phạm kim lâu.</span> Tuổi âm ' + ck.age + ', số dư khi chia cho 9 rơi vào nhóm kim lâu: ' + esc(ck.kl.kind || '') + '.' : '<span class="ptv-good">Không phạm kim lâu.</span> Tuổi âm ' + ck.age + ' chia 9 cho số dư ngoài nhóm 1, 3, 6, 8 nên không phạm.') + '</p>';
    html += '<p><strong>Hoang ốc:</strong> tuổi âm ' + ck.age + ' rơi vào cung <strong>' + ck.ho.name + '</strong>, ' + HO_TXT[ck.ho.name] + (ck.ho.bad ? ' <span class="ptv-bad">Đây là cung xấu nên kiêng làm nhà.</span>' : ' <span class="ptv-good">Đây là cung tốt cho việc làm nhà.</span>') + '</p>';
    return html;
  }
  function tamTaiYearsText(chi) {
    var groups = [['Thân', 'Tý', 'Thìn', 'Dần, Mão, Thìn'], ['Dần', 'Ngọ', 'Tuất', 'Thân, Dậu, Tuất'], ['Hợi', 'Mão', 'Mùi', 'Tỵ, Ngọ, Mùi'], ['Tỵ', 'Dậu', 'Sửu', 'Hợi, Tý, Sửu']];
    for (var i = 0; i < groups.length; i++) if (groups[i].slice(0, 3).indexOf(chi) >= 0) return groups[i][3];
    return '';
  }
  function muonTuoiHTML(birth, year) {
    var owner = L.yearInfo(birth), cand = [];
    for (var by = 1945; by <= 2010; by++) {
      var ck = checkYear(by, year); if (!ck.clean) continue;
      var ci = L.yearInfo(by), rel = L.chiRelation(owner.chi, ci.chi);
      cand.push({ by: by, text: ci.text, age: ck.age, rel: rel.label, score: rel.score });
    }
    cand.sort(function (a, b) { return b.score - a.score || Math.abs(a.age - 45) - Math.abs(b.age - 45); });
    if (!cand.length) return '<p>Không tìm được tuổi nào sạch cả ba hạn trong năm ' + year + ' ở dải tuổi đã xét.</p>';
    return '<h3>Gợi ý tuổi mượn làm nhà năm ' + year + '</h3><p>Các năm sinh dưới đây không phạm tam tai, kim lâu và hoang ốc trong năm ' + year + ', xếp theo mức hợp với tuổi chủ nhà trước:</p>' +
      '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm sinh người mượn tuổi</th><th>Tuổi</th><th>Tuổi âm năm ' + year + '</th><th>Quan hệ với chủ nhà</th></tr>' +
      cand.slice(0, 10).map(function (x) { return '<tr><td><strong>' + x.by + '</strong></td><td>' + x.text + '</td><td>' + x.age + '</td><td>' + x.rel + '</td></tr>'; }).join('') + '</table></div>' +
      '<p class="ptv-note">Khi mượn tuổi, nên chọn người khỏe mạnh, gia đạo êm ấm, tính tình sởi lởi và đang không chịu tang. Người được mượn tuổi sẽ đứng tên làm lễ động thổ, cúng khởi công thay chủ nhà; mọi giấy tờ pháp lý của ngôi nhà vẫn mang tên chủ thật.</p>';
  }
  function xayNhaV2(c) {
    c.innerHTML = V.tabsHTML([['xn-check', 'Kiểm tra năm xây nhà'], ['xn-scan', 'Quét các năm sắp tới'], ['xn-muon', 'Mượn tuổi xây nhà']]) +
      '<div id="xn-check">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ nhà', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Năm định xây nhà', L.select('by', L.yearOptions(2026, 2035, 2027))) + '</div>', 'Kiểm tra năm xây nhà') + '</div>' +
      '<div id="xn-scan" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ nhà', L.select('y', L.yearOptions(1940, 2010, 1990))) + '</div>', 'Quét 10 năm sắp tới') + '</div>' +
      '<div id="xn-muon" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ nhà', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Năm định xây nhà', L.select('by', L.yearOptions(2026, 2035, 2028))) + '</div>', 'Tìm tuổi mượn xây nhà') + '</div>';
    V.wireTabs(c, ['xn-check', 'xn-scan', 'xn-muon']);
    c.querySelector('#xn-check form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#xn-check'), birth = parseInt(box.querySelector('#y').value, 10), year = parseInt(box.querySelector('#by').value, 10);
      var ck = checkYear(birth, year);
      var html = '<h3>Năm ' + year + ' (' + ck.yI.text + ') với chủ nhà sinh năm ' + birth + ' (' + ck.me.text + '), tuổi âm ' + ck.age + ': ' + (ck.clean ? '<span class="ptv-good">Được tuổi, không phạm hạn nào</span>' : '<span class="ptv-bad">Phạm hạn, nên cân nhắc</span>') + '</h3>' + hanBlocks(ck) +
        (ck.clean ? '<p><strong>Kết luận:</strong> năm ' + year + ' sạch cả ba hạn tam tai, kim lâu, hoang ốc cho tuổi của bạn. Bước tiếp theo là chọn ngày động thổ đẹp theo tuổi ở công cụ <a href="https://phongthuy.vietaa.com/xem-ngay-dong-tho/">Xem ngày động thổ</a> của Phong Thủy VietAA.</p>' : '<p><strong>Kết luận:</strong> theo lệ xem tuổi làm nhà, năm phạm một trong ba hạn thì nên lùi sang năm sạch hơn, hoặc vẫn tiến hành bằng cách mượn tuổi người khác đứng tên động thổ. Danh sách tuổi mượn gợi ý cho năm ' + year + ' ở ngay bên dưới.</p>' + muonTuoiHTML(birth, year));
      L.resultBox(box, html);
    });
    c.querySelector('#xn-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#xn-scan'), birth = parseInt(box.querySelector('#y').value, 10);
      var nowY = new Date().getFullYear(), rows = '', firstClean = 0;
      for (var y = nowY; y <= nowY + 9; y++) {
        var ck = checkYear(birth, y);
        if (ck.clean && !firstClean) firstClean = y;
        rows += '<tr><td><strong>' + y + '</strong> (' + ck.yI.text + ')</td><td>' + ck.age + '</td><td>' + (ck.tt ? 'Phạm' : 'Không') + '</td><td>' + (ck.kl.bad ? 'Phạm' : 'Không') + '</td><td>' + ck.ho.name + (ck.ho.bad ? ' (xấu)' : ' (tốt)') + '</td><td>' + (ck.clean ? '<strong class="ptv-good">Được tuổi</strong>' : 'Phạm hạn') + '</td></tr>';
      }
      var html = '<h3>10 năm từ ' + nowY + ' đến ' + (nowY + 9) + ' cho chủ nhà sinh năm ' + birth + '</h3>' +
        (firstClean ? '<p>Năm sạch cả ba hạn gần nhất là <strong>' + firstClean + '</strong>. Bạn có thể lấy năm này làm mốc lên kế hoạch tài chính và thiết kế từ bây giờ.</p>' : '<p>Trong 10 năm tới không có năm nào sạch tuyệt đối cả ba hạn, trường hợp này nên tính phương án mượn tuổi cho năm phù hợp nhất với kế hoạch của gia đình.</p>') +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm xây</th><th>Tuổi âm</th><th>Tam tai</th><th>Kim lâu</th><th>Hoang ốc</th><th>Kết luận</th></tr>' + rows + '</table></div>';
      L.resultBox(box, html);
    });
    c.querySelector('#xn-muon form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#xn-muon'), birth = parseInt(box.querySelector('#y').value, 10), year = parseInt(box.querySelector('#by').value, 10);
      var ck = checkYear(birth, year);
      var html = '<h3>Mượn tuổi xây nhà năm ' + year + ' cho chủ nhà sinh năm ' + birth + ' (' + ck.me.text + ')</h3>' +
        (ck.clean ? '<p>Năm ' + year + ' tuổi của bạn vốn đã sạch cả ba hạn, không cần mượn tuổi. Bạn cứ đứng tên động thổ bình thường.</p>' : '<p>Năm ' + year + ' tuổi của bạn phạm hạn (' + [ck.tt ? 'tam tai' : '', ck.kl.bad ? 'kim lâu' : '', ck.ho.bad ? 'hoang ốc cung ' + ck.ho.name : ''].filter(Boolean).join(', ') + ') nên phương án mượn tuổi là phù hợp theo lệ truyền thống.</p>' + muonTuoiHTML(birth, year));
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-tuoi-xay-nha': xayNhaV2 });
})();

/* --- Nang cap rieng Xem Huong Giuong Ngu (v2) --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var SLEEP_TXT = { 'Thiên Y': 'sao tốt nhất cho giấc ngủ và sức khỏe, chủ về được chăm sóc, bệnh tật chóng qua', 'Sinh Khí': 'sao tốt cho sinh lực và tinh thần sảng khoái mỗi sáng thức dậy', 'Diên Niên': 'sao tốt cho hòa khí vợ chồng, giấc ngủ yên ổn, ít mộng mị', 'Phục Vị': 'sao tốt cho sự bình yên, tâm trí vững vàng, ngủ sâu giấc' };
  var Q = { 'Sinh Khí': 4, 'Thiên Y': 4, 'Diên Niên': 3, 'Phục Vị': 3, 'Họa Hại': -2, 'Lục Sát': -2, 'Ngũ Quỷ': -3, 'Tuyệt Mệnh': -4 };
  function ygFields(p) {
    return '<div class="ptv-row">' + L.field('Năm sinh', L.select(p + 'y', L.yearOptions(1940, 2010, 1990))) + L.field('Giới tính', L.genderSelect(p + 'g')) + '</div>';
  }
  function singleHTML(y, g) {
    var cp = L.cungPhi(y, g);
    var goods = L.goodDirs(cp.cung, ['Thiên Y', 'Sinh Khí', 'Diên Niên', 'Phục Vị']);
    var bads = L.starsFor(cp.cung).filter(function (s) { return s.info.t === 'xấu'; });
    return '<h3>Hướng đầu giường cho người sinh năm ' + y + ' (' + (String(g).toLowerCase() === 'nam' ? 'nam' : 'nữ') + '), mệnh ' + cp.cung + ' thuộc ' + cp.group + '</h3>' +
      '<p>Hướng đầu giường được tính là hướng đầu người nằm chỉ về khi ngủ. Với mệnh ' + cp.cung + ', hướng nên ưu tiên số một là <strong>' + goods[0].dir + ' (sao ' + goods[0].star + ')</strong>: ' + SLEEP_TXT[goods[0].star] + '.</p>' +
      '<p><strong>Các hướng tốt còn lại theo thứ tự ưu tiên:</strong> ' + goods.slice(1).map(function (s) { return s.dir + ' (' + s.star + ': ' + SLEEP_TXT[s.star] + ')'; }).join('; ') + '.</p>' +
      '<p><strong>Các hướng nên tránh đặt đầu giường:</strong> ' + bads.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Trong đó Tuyệt Mệnh và Ngũ Quỷ là hai sao xấu nặng nhất, nếu phòng chỉ còn lựa chọn xấu thì hãy chọn Họa Hại hoặc Lục Sát vì hai sao này nhẹ hơn.</p>' +
      L.dirTable(cp.cung) + rulesHTML();
  }
  function rulesHTML() {
    return '<h3>Quy tắc kê giường quan trọng không kém hướng</h3><ul>' +
      '<li>Đầu giường phải tựa vào tường vững chắc, tránh kê giữa phòng hoặc tựa vào cửa sổ vì vừa mất điểm tựa vừa lọt sáng, lọt gió.</li>' +
      '<li>Tránh nằm dưới xà ngang, dầm nhà hoặc tủ treo phía trên đầu giường, cảm giác đè nén làm giấc ngủ chập chờn.</li>' +
      '<li>Không để đầu giường đối diện thẳng cửa ra vào hoặc gương soi chiếu thẳng vào giường.</li>' +
      '<li>Tránh kê đầu giường sát tường chung với bếp nấu hoặc nhà vệ sinh, vừa ồn vừa ẩm, lại là điều phong thủy kiêng.</li>' +
      '<li>Hai bên giường nên có lối đi và đèn ngủ riêng, giường không chạm tường cả hai phía sẽ bí và khó vệ sinh.</li></ul>' +
      '<p class="ptv-note">Hướng giường theo Bát Trạch là lớp tham khảo theo mệnh; giấc ngủ ngon trước hết đến từ phòng tối, mát, yên tĩnh và giường nệm phù hợp. Nếu hướng tốt theo mệnh xung đột với bố cục phòng, hãy ưu tiên các quy tắc kê giường phía trên.</p>';
  }
  function giuongNguV2(c) {
    c.innerHTML = V.tabsHTML([['gn-one', 'Xem cho một người'], ['gn-two', 'Xem cho hai vợ chồng']]) +
      '<div id="gn-one">' + V.formWrap2(ygFields('a'), 'Xem hướng giường của bạn') + '</div>' +
      '<div id="gn-two" hidden>' + V.formWrap2('<p><strong>Người thứ nhất (chồng)</strong></p>' + ygFields('a') + '<p><strong>Người thứ hai (vợ)</strong></p>' + ygFields('b'), 'Xem hướng giường chung') + '</div>';
    V.wireTabs(c, ['gn-one', 'gn-two']);
    c.querySelector('#gn-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#gn-one');
      L.resultBox(box, singleHTML(parseInt(box.querySelector('#ay').value, 10), box.querySelector('#ag').value));
    });
    c.querySelector('#gn-two form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#gn-two');
      var y1 = parseInt(box.querySelector('#ay').value, 10), g1 = box.querySelector('#ag').value;
      var y2 = parseInt(box.querySelector('#by').value, 10), g2 = box.querySelector('#bg').value;
      var cp1 = L.cungPhi(y1, g1), cp2 = L.cungPhi(y2, g2);
      var STARS4 = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị'];
      var good1 = L.goodDirs(cp1.cung, STARS4).map(function (x) { return x.dir; }), good2 = L.goodDirs(cp2.cung, STARS4).map(function (x) { return x.dir; });
      var common = good1.filter(function (d) { return good2.indexOf(d) >= 0; });
      var html = '<h3>Hướng giường chung cho ' + y1 + ' (mệnh ' + cp1.cung + ', ' + cp1.group + ') và ' + y2 + ' (mệnh ' + cp2.cung + ', ' + cp2.group + ')</h3>';
      if (common.length) {
        html += '<p><strong>Tin tốt:</strong> hai bạn có ' + common.length + ' hướng cùng tốt cho cả hai: ' + common.map(function (d) {
          var s1 = L.starsFor(cp1.cung)[L.DIRS.indexOf(d)], s2 = L.starsFor(cp2.cung)[L.DIRS.indexOf(d)];
          return d + ' (' + s1.star + ' với người thứ nhất, ' + s2.star + ' với người thứ hai)';
        }).join('; ') + '. Hãy ưu tiên hướng có sao Thiên Y hoặc Sinh Khí cho một trong hai người.</p>';
      } else {
        var best = null;
        L.DIRS.forEach(function (d) {
          var i = L.DIRS.indexOf(d), s1 = L.starsFor(cp1.cung)[i], s2 = L.starsFor(cp2.cung)[i], tot = Q[s1.star] + Q[s2.star];
          if (!best || tot > best.tot) best = { d: d, s1: s1, s2: s2, tot: tot };
        });
        html += '<p>Hai bạn thuộc hai nhóm mệnh khác nhau (' + cp1.group + ' và ' + cp2.group + ') nên theo Bát Trạch <strong>không có hướng nào tốt tuyệt đối cho cả hai</strong>, đây là trường hợp rất phổ biến ở các cặp vợ chồng. Hướng dung hòa tốt nhất là <strong>' + best.d + '</strong>: với người thứ nhất là sao ' + best.s1.star + ', với người thứ hai là sao ' + best.s2.star + '. Sao Họa Hại và Lục Sát là hai sao xấu nhẹ nhất, nên cách dung hòa thường là để một người được sao tốt lớn, người còn lại chỉ chạm sao xấu nhẹ như vậy.</p>' +
          '<p>Một nguyên tắc thực tế nữa: hãy ưu tiên hướng tốt cho người khó ngủ hơn hoặc người có sức khỏe yếu hơn trong hai vợ chồng, vì giấc ngủ của người đó ảnh hưởng trực tiếp đến chất lượng sống của cả nhà.</p>';
      }
      html += '<p><strong>Hướng tốt của người thứ nhất:</strong> ' + L.goodDirs(cp1.cung, ['Thiên Y', 'Sinh Khí', 'Diên Niên', 'Phục Vị']).map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '.</p>' +
        '<p><strong>Hướng tốt của người thứ hai:</strong> ' + L.goodDirs(cp2.cung, ['Thiên Y', 'Sinh Khí', 'Diên Niên', 'Phục Vị']).map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '.</p>' + rulesHTML();
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-huong-giuong-ngu': giuongNguV2 });
})();
