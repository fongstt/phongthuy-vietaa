/* PhongThuy VietAA - UI cho cong cu Dat Ten Con (v1.1) */
(function () {
  'use strict';
  var EL_COLOR = { 'Mộc': '#3e9b4f', 'Hỏa': '#d9534f', 'Thổ': '#b8860b', 'Kim': '#8a8d93', 'Thủy': '#337ab7' };
  var REL_GLOSS = { 'sinh': 'tương sinh, nâng đỡ nhau', 'được sinh': 'được tương sinh, nâng đỡ nhau', 'bình': 'bình hòa, không sinh không khắc', 'khắc': 'tương khắc', 'bị khắc': 'bị tương khắc' };
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function badge(e) { return '<span class="ptv-el" style="background:' + (EL_COLOR[e] || '#666') + '">' + esc(e) + '</span>'; }
  function ratingClass(r) { return (r === 'Cát' || r === 'Đại cát') ? 'ptv-good' : (r === 'Bình' ? 'ptv-mid' : 'ptv-bad'); }
  function scoreColor(s) { return s >= 7 ? '#2e7d32' : s >= 5.5 ? '#b8860b' : '#c62828'; }

  function fillSelects() {
    var hour = el('ptv-hour'), day = el('ptv-day'), mon = el('ptv-month'), yr = el('ptv-year'), i;
    PTVEngine.CHI.forEach(function (c) {
      var o = document.createElement('option'); o.value = c; o.textContent = c + ' (' + PTVEngine.HOUR_LABEL[c] + ')'; hour.appendChild(o);
    });
    for (i = 1; i <= 31; i++) { var o1 = document.createElement('option'); o1.value = i; o1.textContent = i; day.appendChild(o1); }
    for (i = 1; i <= 12; i++) { var o2 = document.createElement('option'); o2.value = i; o2.textContent = i; mon.appendChild(o2); }
    for (i = 1940; i <= 2050; i++) { var o3 = document.createElement('option'); o3.value = i; o3.textContent = i; yr.appendChild(o3); }
    [['ptv-father'], ['ptv-mother']].forEach(function (pair) {
      var sel = el(pair[0]); if (!sel) return;
      var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'Không nhập'; sel.appendChild(o0);
      for (var y = 1955; y <= 2015; y++) { var oy = document.createElement('option'); oy.value = y; oy.textContent = y; sel.appendChild(oy); }
    });
    day.value = '8'; mon.value = '8'; yr.value = '2025'; hour.value = 'Tý';
  }


  function toneOf(tok) {
    var n = tok.normalize('NFD');
    if (/[\u0301\u0309\u0303\u0323]/.test(n)) return 'Trắc';
    return 'Bằng'; // ngang hoac huyen (0300)
  }
  function stripAcc(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }
  function pythNum(str) {
    var sum = 0, clean = stripAcc(str).replace(/[^a-z]/g, '');
    for (var i = 0; i < clean.length; i++) sum += (clean.charCodeAt(i) - 96 - 1) % 9 + 1;
    while (sum > 9 && sum !== 11 && sum !== 22) { var s2 = 0, ss = String(sum); for (var j = 0; j < ss.length; j++) s2 += parseInt(ss[j], 10); sum = s2; }
    return sum;
  }
  function meaningHTML(r, n) {
    var given = r.nameParts.slice(1).filter(function (x) { return x.entry; });
    if (!given.length) return '';
    var lines = given.map(function (x) {
      return '<li><strong>' + esc(x.token) + '</strong> (chữ Hán ' + esc(x.entry.han) + '): ' + esc(x.entry.meaning) + '.</li>';
    }).join('');
    var wants = given.map(function (x) { return x.entry.meaning.split(',')[0]; }).join(', ');
    return '<div class="ptv-card"><h3>' + n + '. Ý nghĩa của tên</h3>' +
      '<p>Ý nghĩa tên là lớp nghĩa mà cha mẹ gửi gắm vào con, đọc được ngay từ nghĩa Hán Việt của từng chữ:</p><ul class="ptv-list">' + lines + '</ul>' +
      '<p>Ghép các chữ lại, tên <strong>' + esc(r.input.name) + '</strong> gửi gắm mong ước về ' + esc(wants) + '. Đây cũng là phần ý nghĩa mà người đối diện cảm nhận được đầu tiên khi nghe tên, trước cả yếu tố số nét hay ngũ hành.</p></div>';
  }
  function extrasHTML(r, n) {
    var tones = r.nameParts.map(function (x) { return { tok: x.token, tone: toneOf(x.token) }; });
    var seq = tones.map(function (x) { return x.tone; }).join(' - ');
    var nb = tones.filter(function (x) { return x.tone === 'Bằng'; }).length, nt = tones.length - nb;
    var toneNote = nt === 0 ? 'Toàn thanh bằng: tên đọc nhẹ nhàng, trôi chảy, hợp với người muốn cảm giác êm đềm, nhưng có thể hơi nhạt nếu họ và đệm cũng toàn bằng.' : (nb === 0 ? 'Toàn thanh trắc: tên đọc mạnh, dứt khoát và dễ gây ấn tượng, nhưng dễ tạo cảm giác nặng khi gọi đầy đủ họ tên.' : 'Có cả bằng lẫn trắc: nhịp đọc lên xuống tự nhiên, đây là kiểu phối thanh được chuộng nhất trong tên Việt.');
    var full = stripAcc(r.input.name);
    var exp = pythNum(full), soul = pythNum(full.replace(/[^aeiou]/g, ' ')), pers = pythNum(full.replace(/[aeiou]/g, ' '));
    return '<div class="ptv-card"><h3>' + n + '. Thanh luật và thần số học của tên (tham khảo)</h3>' +
      '<p><strong>Thanh luật:</strong> ' + tones.map(function (x) { return esc(x.tok) + ' thanh ' + x.tone.toLowerCase(); }).join(', ') + '. Dãy thanh: <strong>' + seq + '</strong> (' + nb + ' bằng, ' + nt + ' trắc). ' + toneNote + '</p>' +
      '<p><strong>Thần số học:</strong> theo bảng Pythagoras, tên này có số biểu đạt (toàn bộ họ tên) là <strong>' + exp + '</strong>, số linh hồn (nguyên âm) là <strong>' + soul + '</strong>, số nhân cách (phụ âm) là <strong>' + pers + '</strong>. Bạn có thể đối chiếu thêm ở công cụ <a href="https://phongthuy.vietaa.com/xem-than-so-hoc/">Xem thần số học</a> của VietAA.</p>' +
      '<p class="ptv-note">Hai mục này chỉ để tham khảo thêm và đối chiếu chéo, không cộng vào điểm phong thủy của tên ở trên.</p></div>';
  }

  function profileHTML(r, n) {
    var p = r.pillars;
    var rows = [['Giờ', p.hour], ['Ngày', p.day], ['Tháng', p.month], ['Năm', p.year]].map(function (x) {
      return '<tr><td>Trụ ' + x[0].toLowerCase() + '</td><td><strong>' + esc(x[1].text) + '</strong></td><td>' + esc(x[1].can) + ' hành ' + esc(x[1].canEl) + ', ' + esc(x[1].chi) + ' hành ' + esc(x[1].chiEl) + '</td></tr>';
    }).join('');
    var total = 0, max = 0;
    Object.keys(r.counts).forEach(function (k) { total += r.counts[k]; if (r.counts[k] > max) max = r.counts[k]; });
    var bars = Object.keys(r.counts).map(function (k) {
      var pct = max ? Math.round(r.counts[k] / max * 100) : 0;
      return '<div class="ptv-bar-row"><span class="ptv-bar-label">' + badge(k) + '</span><span class="ptv-bar-track"><span class="ptv-bar-fill" style="width:' + pct + '%;background:' + EL_COLOR[k] + '"></span></span><span class="ptv-bar-num">' + r.counts[k] + '</span></div>';
    }).join('');
    var weak = Object.keys(r.counts).filter(function (k) { return r.counts[k] < total / 5; });
    return '<div class="ptv-card"><h3>' + n + '. Hồ sơ mệnh của bé</h3>' +
      '<div class="ptv-facts"><span>Ngày sinh: <strong>' + r.input.day + '/' + r.input.month + '/' + r.input.year + '</strong></span><span>Giờ: <strong>' + esc(r.input.hourChi) + '</strong> (' + PTVEngine.HOUR_LABEL[r.input.hourChi] + ')</span><span>Giới tính: <strong>' + esc(r.input.gender) + '</strong></span><span>Âm lịch: <strong>' + r.lunar.day + '/' + r.lunar.month + '/' + r.lunar.year + '</strong>' + (r.lunar.leap ? ' (nhuận)' : '') + '</span></div>' +
      '<p class="ptv-menh">Bản mệnh: <strong>' + esc(r.napAm.name) + '</strong> ' + badge(r.napAm.element) + '</p>' +
      '<table class="ptv-table"><tr><th>Trụ</th><th>Can chi</th><th>Ngũ hành</th></tr>' + rows + '</table>' +
      '<p><strong>Ngũ hành trong tứ trụ</strong> (8 chữ can chi cộng tàng can phụ của địa chi):</p>' + bars +
      '<p>Hành đang vượng: <strong>' + r.targetInfo.strongest.join(', ') + '</strong>. Hành đang suy, thiếu: <strong>' + (weak.join(', ') || 'không có, tứ trụ khá cân bằng') + '</strong>.</p>' +
      '<p class="ptv-note">Tổng số nét của phần tên nên thuộc hành ' + badge(r.targetInfo.target) + ' để bổ sung chỗ thiếu và cân bằng lại tứ trụ.</p></div>';
  }

  function namePartsHTML(r, n) {
    var cards = r.nameParts.map(function (x, idx) {
      if (!x.entry) return '<div class="ptv-char ptv-char-missing"><div class="ptv-char-token">' + esc(x.token) + '</div><p>Chưa có dữ liệu chữ Hán cho âm này.</p></div>';
      var yy = x.entry.strokes % 2 === 1 ? 'Dương' : 'Âm';
      return '<div class="ptv-char"><div class="ptv-char-han">' + esc(x.entry.han) + '</div>' +
        '<div class="ptv-char-token">' + esc(x.token) + (idx === 0 ? ' (họ)' : '') + '</div>' +
        '<p>' + x.entry.strokes + ' nét · hành ' + esc(x.entry.element) + ' · ' + yy + '</p>' +
        '<p class="ptv-char-meaning">' + esc(x.entry.meaning) + '</p></div>';
    }).join('');
    return '<div class="ptv-card"><h3>' + n + '. Phân tích từng chữ trong tên</h3><div class="ptv-chars">' + cards + '</div>' +
      '<p>Tổng số nét của phần tên (không tính họ): <strong>' + (r.givenTotal || 0) + ' nét</strong>, quy ra hành <strong>' + esc(r.totalElem || '') + '</strong> theo chữ số cuối của tổng nét.</p></div>';
  }

  function blocksHTML(r, n) {
    var items = r.blocks.map(function (b, i) {
      var extra = '';
      if (b.key === 'chain') extra = b.detail.length ? b.detail.map(function (c) { return esc(c.from) + ' → ' + esc(c.to) + ': ' + esc(c.rel); }).join('; ') : 'Phần tên chỉ có một chữ nên không có cặp chữ để xét sinh khắc, mục này tính điểm trung hòa.';
      if (b.key === 'yinyang') extra = 'Phần tên có ' + b.duong + ' chữ Dương (nét lẻ) và ' + b.am + ' chữ Âm (nét chẵn). Càng cân bằng càng tốt.';
      if (b.key === 'target') extra = 'Hành của tên là ' + esc(b.totalElem) + ', hành cần bổ sung là ' + esc(b.target) + ', quan hệ: ' + esc(b.rel) + '.';
      if (b.key === 'menh') extra = 'Hành của tên là ' + esc(r.totalElem) + ', bản mệnh là ' + esc(b.menhElem) + ', quan hệ: ' + esc(b.rel) + '.';
      if (b.key === 'hoach' && b.hoach) extra = 'Tổng ' + b.givenTotal + ' nét là số ' + esc(b.hoach.rating) + '. ' + esc(b.hoach.text);
      if (b.key === 'que' && b.que) extra = 'Phối được quẻ ' + esc(b.que.name) + ' (' + esc(b.que.upper) + ' trên, ' + esc(b.que.lower) + ' dưới), thuộc quẻ ' + esc(b.que.rating) + '.';
      var pct = Math.round(b.score / b.max * 100);
      return '<div class="ptv-block"><div class="ptv-block-head"><span>' + esc(b.label) + '</span><span class="ptv-block-score">' + (Math.round(b.score * 100) / 100) + ' / ' + b.max + '</span></div><div class="ptv-mini-track"><span class="ptv-mini-fill" style="width:' + pct + '%"></span></div><p>' + extra + '</p></div>';
    }).join('');
    return '<div class="ptv-card"><h3>' + n + '. Chấm điểm chi tiết</h3>' + items + '</div>';
  }

  function nguCachHTML(r, n) {
    var rows = Object.keys(r.nguCach).map(function (k) {
      var v = r.nguCach[k];
      return '<tr><td><strong>' + esc(k) + '</strong></td><td>' + v.value + ' nét</td><td>' + esc(v.element) + '</td><td class="' + ratingClass(v.rating) + '">' + esc(v.rating) + '</td><td>' + esc(v.text) + '</td></tr>';
    }).join('');
    return '<div class="ptv-card"><h3>' + n + '. Ngũ cách của tên</h3>' +
      '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Cách</th><th>Số nét</th><th>Hành</th><th>Cát hung</th><th>Luận giải</th></tr>' + rows + '</table></div>' +
      '<p>Tam tài (Thiên, Nhân, Địa): ' + esc(r.tamTai.thien) + ', ' + esc(r.tamTai.nhan) + ', ' + esc(r.tamTai.dia) + '. Nhân cách với Thiên cách: ' + esc(r.tamTai.relThien) + '; Nhân cách với Địa cách: ' + esc(r.tamTai.relDia) + '.</p></div>';
  }

  function parentsHTML(r, n) {
    if (!r.parents || !r.parents.length) return '';
    var rows = r.parents.map(function (p) {
      var lineName = p.relName ? '<br>Hành của tên (' + esc(r.totalElem) + ') với mệnh ' + esc(p.role.toLowerCase()) + ': <strong>' + esc(p.relName) + '</strong>, ' + REL_GLOSS[p.relName] + '.' : '';
      return '<div class="ptv-parent"><p class="ptv-parent-head">' + esc(p.role) + ' sinh năm ' + p.year + ': <strong>' + esc(p.napAm.name) + '</strong> ' + badge(p.napAm.element) + ' <span class="ptv-parent-pillar">(' + esc(p.pillar) + ')</span></p>' +
        '<p>Bản mệnh của bé (' + esc(r.napAm.element) + ') với mệnh ' + esc(p.role.toLowerCase()) + ': <strong>' + esc(p.relMenhBe) + '</strong>, ' + REL_GLOSS[p.relMenhBe] + '.' + lineName + '</p></div>';
    }).join('');
    return '<div class="ptv-card"><h3>' + n + '. Đối chiếu với bố mẹ</h3>' + rows +
      '<p class="ptv-note">Mục này chỉ để tham khảo thêm về sự hòa hợp trong gia đình, không cộng vào điểm của tên, vì tên trước hết phải hợp với chính bé. Nếu hành của tên chưa hòa với mệnh bố hoặc mẹ, có thể cân nhắc chữ đệm thuộc hành trung gian để nối hai hành lại, thay vì đổi hẳn tên.</p></div>';
  }

  function suggestHTML(list, n) {
    if (!list || !list.length) return '';
    var cards = list.map(function (s) {
      return '<button type="button" class="ptv-sug" data-name="' + esc(s.name) + '"><span class="ptv-sug-name">' + esc(s.name) + '</span><span class="ptv-sug-meta">hành ' + esc(s.totalElem) + '</span><span class="ptv-sug-score" style="background:' + scoreColor(s.score) + '">' + s.score + '</span></button>';
    }).join('');
    return '<div class="ptv-card"><h3>' + n + '. Gợi ý tên hay khác cho bé</h3>' +
      '<p>Các tên dưới đây giữ nguyên họ và ngày giờ sinh của bé, được máy chọn vì bổ sung đúng hành đang thiếu, tổng nét rơi vào số cát và chuỗi chữ tương sinh. Bấm vào một tên để xem luận giải đầy đủ của tên đó.</p>' +
      '<div class="ptv-sugs">' + cards + '</div></div>';
  }

  function render() {
    var name = el('ptv-name').value, out = el('ptv-result');
    var input = {
      name: name, gender: el('ptv-gender').value, hourChi: el('ptv-hour').value,
      day: parseInt(el('ptv-day').value, 10), month: parseInt(el('ptv-month').value, 10), year: parseInt(el('ptv-year').value, 10),
      fatherYear: el('ptv-father') && el('ptv-father').value ? parseInt(el('ptv-father').value, 10) : null,
      motherYear: el('ptv-mother') && el('ptv-mother').value ? parseInt(el('ptv-mother').value, 10) : null
    };
    if (!name || name.trim().split(/\s+/).length < 2) {
      out.innerHTML = '<div class="ptv-alert">Bạn nhập họ tên đầy đủ của bé nhé, ít nhất gồm họ và tên, ví dụ: Nguyễn Hoàng Hải.</div>';
      return;
    }
    var r = PTVEngine.analyze(input, window.PTV_DATA);
    var n = 0, html = profileHTML(r, ++n);
    if (r.incomplete) {
      html += '<div class="ptv-alert">Chưa chấm điểm được tên này vì cơ sở dữ liệu chữ Hán hiện chưa có âm: <strong>' + esc(r.missing.join(', ')) + '</strong>. Phần hồ sơ mệnh ở trên vẫn đúng và dùng được. Danh sách chữ sẽ được bổ sung dần, bạn thử lại sau hoặc chọn cách viết khác của tên nhé.</div>';
      out.innerHTML = html;
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    html += namePartsHTML(r, ++n) + meaningHTML(r, ++n) + blocksHTML(r, ++n) + nguCachHTML(r, ++n) + extrasHTML(r, ++n);
    var par = parentsHTML(r, n + 1); if (par) { n++; html += par; }
    var sug = [];
    try { sug = PTVEngine.suggestNames(input, window.PTV_DATA, 8); } catch (e) { sug = []; }
    var sugHtml = suggestHTML(sug, n + 1); if (sugHtml) { n++; html += sugHtml; }
    html += '<div class="ptv-card ptv-total"><h3>' + (++n) + '. Kết luận</h3>' +
      '<div class="ptv-score-wrap"><div class="ptv-score-circle" style="border-color:' + scoreColor(r.score) + ';color:' + scoreColor(r.score) + '">' + r.score + '<span>/10</span></div>' +
      '<div><p class="ptv-verdict">' + esc(r.verdict) + '</p>' +
      '<p>Tên <strong>' + esc(input.name) + '</strong> có tổng số nét phần tên thuộc hành ' + esc(r.totalElem) + ', hành tứ trụ của bé đang cần bổ sung là ' + esc(r.targetInfo.target) + ', bản mệnh thuộc hành ' + esc(r.napAm.element) + ' (' + esc(r.napAm.name) + ').</p></div></div>';
    if (r.femaleNote && r.femaleNote.length) {
      html += '<p class="ptv-note">Lưu ý theo sách cổ: với bé gái, các mục ' + r.femaleNote.join(', ') + ' có số hoạch thuộc nhóm 21, 23, 33, 39, là nhóm số mạnh, xưa thường khuyên cân nhắc thêm cho nữ. Đây là quan niệm truyền thống, bạn đọc để tham khảo.</p>';
    }
    html += '<p class="ptv-note">Kết quả theo phương pháp tứ trụ, ngũ hành, ngũ cách, 81 hoạch và quẻ Dịch, mang tính tham khảo theo quan niệm phong thủy truyền thống. Tên hay còn cần dễ đọc, dễ nhớ và hợp với mong muốn của gia đình.</p></div>';
    out.innerHTML = html;
    var btns = out.querySelectorAll('.ptv-sug');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        el('ptv-name').value = this.getAttribute('data-name');
        render();
      });
    }
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!el('ptv-form')) return;
    fillSelects();
    el('ptv-form').addEventListener('submit', function (ev) { ev.preventDefault(); render(); });
  });
})();
