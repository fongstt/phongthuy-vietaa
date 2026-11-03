/* PhongThuy VietAA - Dat Ten Con v2: so sanh nhieu ten, tu dien chu, goi y co loc, sao chep ket qua */
(function () {
  'use strict';
  var GEN = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  var CON = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
  var SURNAMES = ['nguyen', 'tran', 'le', 'pham', 'huynh', 'hoang', 'phan', 'vu', 'vo', 'dang', 'bui', 'do', 'ho', 'ngo', 'duong', 'ly', 'luong', 'dinh', 'trinh', 'lam', 'mai', 'ha', 'cao', 'luu', 'truong', 'ta', 'kieu', 'chu', 'thai', 'bach', 'chau', 'giang', 'han', 'khuc', 'la', 'mac', 'nghiem', 'nham', 'ong', 'phi', 'quach', 'sam', 'thach', 'thieu', 'tong', 'ton', 'tu', 'uc', 'ung', 'vi', 'xuan'];
  var COMMON = ['an','anh','ánh','bảo','bình','bích','châu','chi','cường','diệp','dũng','duy','dương','đạt','đăng','đức','gia','hà','hải','hạnh','hào','hiếu','hiền','hoa','hòa','hoàng','hồng','huy','hùng','hưng','hương','khải','khánh','khang','khoa','khôi','kiên','kiệt','kỳ','lam','lâm','lan','linh','long','lộc','mai','mạnh','minh','mỹ','nam','ngân','ngọc','nguyên','nhân','nhật','nhi','nhiên','như','phong','phúc','phú','phương','quân','quang','quốc','quỳnh','sơn','tài','tâm','tân','thanh','thành','thắng','thảo','thịnh','thơ','thu','thủy','thư','tiến','tiên','trang','trí','trọng','trung','trúc','trường','tú','tuấn','tùng','tường','tuyết','uyên','vân','văn','việt','vinh','vũ','vy','xuân','yến','diệu','hân','nhung','oanh','phượng','quyên','sen','trâm','trinh','bách','bằng','bình','chiến','châu','chính','chung','công','cảnh','danh','diệp','duyên','duy','dũng','doanh','dung','dương'];
  var MIDDLES = ['an', 'anh', 'bao', 'chi', 'duc', 'gia', 'hai', 'hoang', 'huy', 'khanh', 'khanh', 'kim', 'long', 'minh', 'nam', 'ngoc', 'nhat', 'phuc', 'phuong', 'quang', 'quoc', 'son', 'thanh', 'thien', 'thuy', 'trang', 'trung', 'tuan', 'van', 'viet', 'xuân', 'yen'];
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function stripAcc(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function elNum(total) { var d = total % 10; if (d === 1 || d === 2) return 'Mộc'; if (d === 3 || d === 4) return 'Hỏa'; if (d === 5 || d === 6) return 'Thổ'; if (d === 7 || d === 8) return 'Kim'; return 'Thủy'; }
  function rel(a, b) { if (a === b) return 'bình'; if (GEN[a] === b) return 'sinh'; if (GEN[b] === a) return 'được sinh'; if (CON[a] === b) return 'khắc'; return 'bị khắc'; }
  function reduce81(n) { return ((n - 1) % 80 + 80) % 80 + 1; }
  function scoreColor(s) { return s >= 7 ? '#2e7d32' : s >= 5.5 ? '#b8860b' : '#c62828'; }

  function readInput(nameOverride) {
    return {
      name: nameOverride || el('ptv-name').value, gender: el('ptv-gender').value, hourChi: el('ptv-hour').value,
      day: parseInt(el('ptv-day').value, 10), month: parseInt(el('ptv-month').value, 10), year: parseInt(el('ptv-year').value, 10),
      fatherYear: el('ptv-father') && el('ptv-father').value ? parseInt(el('ptv-father').value, 10) : null,
      motherYear: el('ptv-mother') && el('ptv-mother').value ? parseInt(el('ptv-mother').value, 10) : null
    };
  }
  function setNameAndRun(name) {
    el('ptv-name').value = name;
    el('ptv-form').dispatchEvent(new Event('submit', { cancelable: true }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function panelsHTML() {
    return '<div class="ptv-card ptv-x"><h3>Công cụ nâng cao</h3>' +
      '<div class="ptv-xtabs">' +
      '<button type="button" class="ptv-xtab ptv-on" data-t="cmp">So sánh nhiều tên</button>' +
      '<button type="button" class="ptv-xtab" data-t="dict">Từ điển chữ đặt tên</button>' +
      '<button type="button" class="ptv-xtab" data-t="flt">Gợi ý theo yêu cầu</button>' +
      '<button type="button" class="ptv-xtab" data-t="copy">Sao chép kết quả</button>' +
      '</div>' +
      '<div class="ptv-xpane" id="ptv-x-cmp"><p>Nhập các tên đang phân vân, mỗi tên một dòng (kèm họ). Công cụ chấm tất cả theo cùng ngày giờ sinh ở form trên rồi xếp hạng để cha mẹ dễ chọn.</p>' +
      '<textarea id="ptv-cmp-in" rows="4" placeholder="Nguyễn Hoàng Hải&#10;Nguyễn Minh Khang&#10;Nguyễn Tuấn Anh"></textarea>' +
      '<button type="button" class="ptv-xbtn" id="ptv-cmp-go">Chấm và so sánh</button><div id="ptv-cmp-out"></div></div>' +
      '<div class="ptv-xpane" id="ptv-x-dict" hidden><p>Tra một âm tiết để xem chữ Hán, số nét, hành và ý nghĩa, kèm vài cách ghép tên mẫu dùng ngày giờ sinh của bé ở form trên.</p>' +
      '<div class="ptv-xrow"><input type="text" id="ptv-dict-in" placeholder="Ví dụ: hải, minh, ngọc, khang"><button type="button" class="ptv-xbtn" id="ptv-dict-go">Tra chữ</button></div><div id="ptv-dict-out"></div></div>' +
      '<div class="ptv-xpane" id="ptv-x-flt" hidden><p>Lọc gợi ý kỹ hơn gợi ý tự động: giữ cố định chữ đệm gia đình muốn dùng, chọn hành cho chữ tên chính, hoặc chọn tên 3 chữ.</p>' +
      '<div class="ptv-xrow"><input type="text" id="ptv-flt-mid" placeholder="Chữ đệm cố định (bỏ trống nếu không có)">' +
      '<select id="ptv-flt-el"><option value="">Hành tên chính: bất kỳ</option><option>Kim</option><option>Mộc</option><option>Thủy</option><option>Hỏa</option><option>Thổ</option></select>' +
      '<select id="ptv-flt-n"><option value="2">Phần tên 2 chữ</option><option value="3">Phần tên 3 chữ</option></select>' +
      '<button type="button" class="ptv-xbtn" id="ptv-flt-go">Tìm tên theo yêu cầu</button></div><div id="ptv-flt-out"></div></div>' +
      '<div class="ptv-xpane" id="ptv-x-copy" hidden><p>Chép nhanh phần tóm tắt kết quả của tên đang nhập ở form trên để gửi cho người thân cùng bàn.</p>' +
      '<button type="button" class="ptv-xbtn" id="ptv-copy-go">Sao chép tóm tắt kết quả</button><span id="ptv-copy-msg" class="ptv-note"></span></div>' +
      '</div>';
  }

  var BASE = null;
  function baseIndex() {
    if (BASE) return BASE;
    BASE = {};
    Object.keys(window.PTV_DATA.nameChars).forEach(function (k) {
      var b = stripAcc(k);
      if (!BASE[b] || (BASE[b] && window.PTV_DATA.nameChars[BASE[b]].uncertain && !window.PTV_DATA.nameChars[k].uncertain)) BASE[b] = k;
    });
    return BASE;
  }
  function realKey(anyKey) { return baseIndex()[stripAcc(anyKey)] || null; }
  function entry(anyKey) { var rk = realKey(anyKey); return rk ? window.PTV_DATA.nameChars[rk] : null; }
  function surnameRealKey(name) { return realKey((name || '').trim().split(/\s+/)[0] || ''); }
  function nameFromKeys(keys) { return keys.map(cap).join(' '); }

  function doCompare() {
    var lines = el('ptv-cmp-in').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 10);
    var out = el('ptv-cmp-out');
    if (!lines.length) { out.innerHTML = '<p class="ptv-note">Bạn nhập ít nhất một tên nhé.</p>'; return; }
    var rows = lines.map(function (nm) {
      try {
        var r = PTVEngine.analyze(readInput(nm), window.PTV_DATA);
        if (r.incomplete) return { name: nm, err: 'thiếu dữ liệu chữ: ' + r.missing.join(', ') };
        var h = window.PTV_DATA.hoach81[String(reduce81(r.givenTotal))];
        return { name: nm, score: r.score, elem: r.totalElem, hoach: h ? h.rating : '', verdict: r.verdict };
      } catch (e) { return { name: nm, err: 'không chấm được' }; }
    });
    rows.sort(function (a, b) { return (b.score || -1) - (a.score || -1); });
    var trs = rows.map(function (x, i) {
      if (x.err) return '<tr><td>' + (i + 1) + '</td><td>' + esc(x.name) + '</td><td colspan="4" class="ptv-bad">' + esc(x.err) + '</td></tr>';
      return '<tr><td>' + (i + 1) + '</td><td><a href="#" class="ptv-cmp-pick" data-name="' + esc(x.name) + '"><strong>' + esc(x.name) + '</strong></a></td>' +
        '<td><strong style="color:' + scoreColor(x.score) + '">' + x.score + '/10</strong></td><td>' + esc(x.elem) + '</td><td>' + esc(x.hoach) + '</td><td>' + esc(x.verdict) + '</td></tr>';
    }).join('');
    out.innerHTML = '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>#</th><th>Tên</th><th>Điểm</th><th>Hành tên</th><th>Tổng nét</th><th>Kết luận</th></tr>' + trs + '</table></div><p class="ptv-note">Bấm vào một tên trong bảng để xem luận giải đầy đủ của tên đó.</p>';
    var picks = out.querySelectorAll('.ptv-cmp-pick');
    for (var i = 0; i < picks.length; i++) picks[i].addEventListener('click', function (ev) { ev.preventDefault(); setNameAndRun(this.getAttribute('data-name')); });
  }

  function doDict() {
    var rk = realKey(el('ptv-dict-in').value.trim());
    var out = el('ptv-dict-out'), e = rk ? window.PTV_DATA.nameChars[rk] : null;
    if (!e) { out.innerHTML = '<p class="ptv-note">Chưa có dữ liệu cho âm "' + esc(el('ptv-dict-in').value) + '". Danh sách chữ đang được bổ sung dần, hiện có ' + Object.keys(window.PTV_DATA.nameChars).length + ' âm tiết phổ biến.</p>'; return; }
    var yy = e.strokes % 2 === 1 ? 'Dương' : 'Âm';
    var html = '<div class="ptv-chars"><div class="ptv-char"><div class="ptv-char-han">' + esc(e.han) + '</div><div class="ptv-char-token">' + esc(rk) + '</div>' +
      '<p>' + e.strokes + ' nét · hành ' + esc(e.element) + ' · ' + yy + '</p><p class="ptv-char-meaning">' + esc(e.meaning) + '</p></div></div>';
    var sk = surnameRealKey(el('ptv-name').value), combos = [];
    if (sk) {
      var partners = MIDDLES.map(realKey).filter(function (k) { return k && k !== rk && k !== sk; });
      for (var i = 0; i < partners.length && combos.length < 4; i++) {
        var nm = nameFromKeys([sk, partners[i], rk]);
        try { var r = PTVEngine.analyze(readInput(nm), window.PTV_DATA); if (!r.incomplete) combos.push({ name: nm, score: r.score }); } catch (err) {}
      }
      combos.sort(function (a, b) { return b.score - a.score; });
      if (combos.length) html += '<p><strong>Ghép thử với họ của bé:</strong></p><div class="ptv-sugs">' + combos.map(function (c) {
        return '<button type="button" class="ptv-sug" data-name="' + esc(c.name) + '"><span class="ptv-sug-name">' + esc(c.name) + '</span><span class="ptv-sug-score" style="background:' + scoreColor(c.score) + '">' + c.score + '</span></button>';
      }).join('') + '</div>';
    }
    out.innerHTML = html;
    var btns = out.querySelectorAll('.ptv-sug');
    for (var j = 0; j < btns.length; j++) btns[j].addEventListener('click', function () { setNameAndRun(this.getAttribute('data-name')); });
  }

  function doFilter() {
    var out = el('ptv-flt-out');
    var sk = surnameRealKey(el('ptv-name').value), se = sk ? window.PTV_DATA.nameChars[sk] : null;
    if (!se) { out.innerHTML = '<p class="ptv-note">Bạn nhập họ của bé ở form trên trước nhé, công cụ cần họ để ghép tên.</p>'; return; }
    var midFixed = el('ptv-flt-mid').value.trim() ? realKey(el('ptv-flt-mid').value.trim()) : '';
    if (el('ptv-flt-mid').value.trim() && !midFixed) { out.innerHTML = '<p class="ptv-note">Chưa có dữ liệu chữ Hán cho chữ đệm "' + esc(el('ptv-flt-mid').value) + '".</p>'; return; }
    var wantEl = el('ptv-flt-el').value, nGiven = parseInt(el('ptv-flt-n').value, 10);
    var base = readInput();
    var prof = PTVEngine.analyze({ name: cap(sk) + ' X', gender: base.gender, hourChi: base.hourChi, day: base.day, month: base.month, year: base.year }, window.PTV_DATA);
    var tgtEl = prof.targetInfo.target, menhEl = prof.napAm.element;
    var pool = Object.keys(window.PTV_DATA.nameChars).filter(function (k) { return SURNAMES.indexOf(stripAcc(k)) < 0 && k !== sk; });
    var found = [];
    function consider(keys) {
      var entries = keys.map(entry);
      if (entries.some(function (x) { return !x; })) return;
      if (wantEl && entries[entries.length - 1].element !== wantEl) return;
      var total = entries.reduce(function (a, x) { return a + x.strokes; }, 0);
      var h = window.PTV_DATA.hoach81[String(reduce81(total))];
      if (!h || (h.rating !== 'Cát' && h.rating !== 'Đại cát')) return;
      if (rel(elNum(total), tgtEl) === 'khắc') return;
      var sc = PTVEngine.scoreGiven(entries, se.strokes, tgtEl, menhEl, window.PTV_DATA);
      if (!sc || sc.score < 7) return;
      found.push({ name: nameFromKeys([sk].concat(keys)), score: sc.score, elem: sc.totalElem });
    }
    if (nGiven === 2) {
      var mids = midFixed ? [midFixed] : pool;
      mids.forEach(function (m) { pool.forEach(function (g) { if (g !== m) consider([m, g]); }); });
    } else {
      var midPool = midFixed ? [midFixed] : MIDDLES.map(realKey).filter(Boolean);
      var common = pool.filter(function (k) { return COMMON.indexOf(stripAcc(k)) >= 0; });
      var tail = common.length >= 40 ? common : pool;
      midPool.forEach(function (m) {
        tail.forEach(function (a) { if (a === m) return; tail.forEach(function (b) { if (b !== a && b !== m) consider([m, a, b]); }); });
      });
    }
    found.sort(function (a, b) { return b.score - a.score; });
    var seen = {}, picked = [];
    found.forEach(function (f) { var g = f.name.split(' ').pop(); if ((seen[g] || 0) >= 2) return; seen[g] = (seen[g] || 0) + 1; if (picked.length < 10) picked.push(f); });
    if (!picked.length) { out.innerHTML = '<p class="ptv-note">Không có tên nào đạt đồng thời các điều kiện lọc này (tổng nét phải là số cát, không khắc hành cần bổ sung, điểm từ 7 trở lên). Bạn thử nới lỏng điều kiện, ví dụ bỏ chọn hành tên chính.</p>'; return; }
    out.innerHTML = '<p>Tìm được <strong>' + picked.length + '</strong> tên đạt yêu cầu, hành cần bổ sung của bé là <strong>' + esc(tgtEl) + '</strong>. Bấm vào tên để xem luận giải đầy đủ:</p><div class="ptv-sugs">' +
      picked.map(function (c) { return '<button type="button" class="ptv-sug" data-name="' + esc(c.name) + '"><span class="ptv-sug-name">' + esc(c.name) + '</span><span class="ptv-sug-meta">hành ' + esc(c.elem || '') + '</span><span class="ptv-sug-score" style="background:' + scoreColor(c.score) + '">' + c.score + '</span></button>'; }).join('') + '</div>';
    var btns = out.querySelectorAll('.ptv-sug');
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', function () { setNameAndRun(this.getAttribute('data-name')); });
  }

  function doCopy() {
    var msg = el('ptv-copy-msg');
    try {
      var inp = readInput(), r = PTVEngine.analyze(inp, window.PTV_DATA);
      if (r.incomplete) { msg.textContent = ' Tên này chưa chấm được nên chưa có tóm tắt.'; return; }
      var txt = 'Chấm điểm tên ' + inp.name + ': ' + r.score + '/10, ' + r.verdict + '. Sinh ' + inp.day + '/' + inp.month + '/' + inp.year + ' giờ ' + inp.hourChi + ', bản mệnh ' + r.napAm.name + ' (hành ' + r.napAm.element + '), hành tên thuộc ' + r.totalElem + ', hành cần bổ sung ' + r.targetInfo.target + '. Xem chi tiết tại https://phongthuy.vietaa.com/dat-ten-con/';
      function done() { msg.textContent = ' Đã chép, bạn dán vào tin nhắn để gửi người thân nhé.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { msg.textContent = ' Trình duyệt chặn sao chép tự động.'; });
      else msg.textContent = ' Trình duyệt không hỗ trợ sao chép tự động.';
    } catch (e) { msg.textContent = ' Bạn nhập họ tên và bấm Xem kết quả trước nhé.'; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = el('ptv-form'); if (!form || !window.PTVEngine) return;
    var holder = document.createElement('div');
    holder.innerHTML = panelsHTML();
    form.parentNode.insertBefore(holder, form.nextSibling);
    var tabs = holder.querySelectorAll('.ptv-xtab');
    for (var i = 0; i < tabs.length; i++) tabs[i].addEventListener('click', function () {
      for (var j = 0; j < tabs.length; j++) tabs[j].classList.remove('ptv-on');
      this.classList.add('ptv-on');
      ['cmp', 'dict', 'flt', 'copy'].forEach(function (k) { el('ptv-x-' + k).hidden = true; });
      el('ptv-x-' + this.getAttribute('data-t')).hidden = false;
    });
    el('ptv-cmp-go').addEventListener('click', doCompare);
    el('ptv-dict-go').addEventListener('click', doDict);
    el('ptv-flt-go').addEventListener('click', doFilter);
    el('ptv-copy-go').addEventListener('click', doCopy);
  });
})();
