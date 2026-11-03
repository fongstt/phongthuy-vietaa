/* PhongThuy VietAA - cong cu dot 1: Trach Menh + Linh Khi (v1.3) */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc;
  function formWrap(inner) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">Xem kết quả</button></form><div class="ptv-out"></div>'; }
  function yearGenderFields(yLabel) {
    return '<div class="ptv-row">' + L.field(yLabel || 'Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2015, 1990))) + L.field('Giới tính', L.genderSelect('g')) + '</div>';
  }
  function profileLine(year, gender) {
    var yi = L.yearInfo(year), cp = L.cungPhi(year, gender);
    return '<div class="ptv-facts"><span>Năm sinh: <strong>' + year + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span><span>Cung mệnh: <strong>' + cp.cung + '</strong> (' + cp.group + ')</span></div>';
  }
  function huongBasic(container, mode) {
    container.innerHTML = formWrap(yearGenderFields());
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), g = container.querySelector('#g').value;
      var cp = L.cungPhi(y, g), html = profileLine(y, g);
      if (mode === 'ban-tho') {
        var goods = L.goodDirs(cp.cung, ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']);
        html += '<h3>Hướng đặt bàn thờ cho mệnh ' + cp.cung + '</h3><p>Bàn thờ nên quay mặt về một trong các hướng tốt của gia chủ, tốt nhất là <strong>' + goods[0].dir + ' (' + goods[0].star + ')</strong>. Các hướng tốt theo thứ tự ưu tiên: ' + goods.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Lưng bàn thờ nên tựa vào tường vững chắc theo nguyên tắc tọa cát, và tránh quay bàn thờ thẳng ra cửa chính hoặc đối diện nhà vệ sinh.</p>' + L.dirTable(cp.cung);
      } else if (mode === 'bep') {
        var good = L.goodDirs(cp.cung, ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']);
        var bad = L.starsFor(cp.cung).filter(function (s) { return s.info.t === 'xấu'; });
        html += '<h3>Hướng bếp cho mệnh ' + cp.cung + ': tọa hung, hướng cát</h3><p>Bếp nấu theo nguyên tắc đặt tại hướng xấu để trấn áp khí xấu, cửa bếp quay về hướng tốt. Với gia chủ mệnh ' + cp.cung + ', nên đặt bếp tại các hướng ' + bad.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + ', và để cửa bếp, tức hướng người nấu đứng quay mặt tới, hướng về ' + good.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Tốt nhất là đặt bếp tại ' + bad[0].dir + ' và quay cửa bếp về ' + good[0].dir + '.</p>' + L.dirTable(cp.cung);
      } else if (mode === 'giuong') {
        var gg = L.goodDirs(cp.cung, ['Thiên Y', 'Sinh Khí', 'Diên Niên', 'Phục Vị']);
        var bb = L.starsFor(cp.cung).filter(function (s) { return s.info.t === 'xấu'; });
        html += '<h3>Hướng đầu giường cho mệnh ' + cp.cung + '</h3><p>Đầu giường nên quay về hướng <strong>' + gg[0].dir + ' (' + gg[0].star + ')</strong> để giấc ngủ sâu và sức khỏe ổn định. Các hướng tốt khác: ' + gg.slice(1).map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Tránh quay đầu giường về ' + bb.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + ', và tránh kê đầu giường sát cửa sổ hoặc đối diện cửa phòng.</p>' + L.dirTable(cp.cung);
      }
      L.resultBox(container, html);
    });
  }
  function huongNha(container) {
    container.innerHTML = formWrap(yearGenderFields() + '<div class="ptv-row">' + L.field('Hướng nhà (hướng từ trong nhà nhìn ra cửa chính)', L.select('dir', L.DIRS.map(function (d) { return '<option>' + d + '</option>'; }).join(''))) + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), g = container.querySelector('#g').value, dir = container.querySelector('#dir').value;
      var cp = L.cungPhi(y, g);
      var s = L.starsFor(cp.cung)[L.DIRS.indexOf(dir)];
      var good = s.info.t === 'tốt';
      var html = profileLine(y, g) + '<h3>Hướng nhà ' + dir + ' với mệnh ' + cp.cung + ': sao ' + s.star + '</h3>' +
        '<p class="' + (good ? 'ptv-good' : 'ptv-bad') + '">' + (good ? 'Đây là hướng tốt với gia chủ.' : 'Đây là hướng xấu với gia chủ, nên cân nhắc hóa giải nếu đã ở ổn định.') + '</p><p>' + s.info.d + '</p>' +
        '<p>Các hướng nhà tốt cho mệnh ' + cp.cung + ': ' + L.goodDirs(cp.cung, ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']).map(function (x) { return x.dir + ' (' + x.star + ')'; }).join(', ') + '.</p>' + L.dirTable(cp.cung);
      L.resultBox(container, html);
    });
  }
  function phongThuyNha(container) {
    container.innerHTML = formWrap(yearGenderFields() + '<div class="ptv-row">' + L.field('Hướng nhà', L.select('dir', L.DIRS.map(function (d) { return '<option>' + d + '</option>'; }).join(''))) + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), g = container.querySelector('#g').value, dir = container.querySelector('#dir').value;
      var cp = L.cungPhi(y, g), stars = L.starsFor(cp.cung);
      var hs = stars[L.DIRS.indexOf(dir)];
      var good = L.goodDirs(cp.cung, ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']);
      var bad = stars.filter(function (s) { return s.info.t === 'xấu'; });
      var html = profileLine(y, g) +
        '<h3>Tổng quan ngôi nhà</h3><p>Hướng nhà ' + dir + ' ứng với sao <strong>' + hs.star + '</strong> (' + (hs.info.t === 'tốt' ? '<span class="ptv-good">tốt</span>' : '<span class="ptv-bad">xấu</span>') + ') đối với gia chủ mệnh ' + cp.cung + '. ' + hs.info.d + '</p>' +
        '<h3>Gợi ý bố trí theo phòng</h3><div class="ptv-table-wrap"><table class="ptv-table">' +
        '<tr><th>Khu vực</th><th>Gợi ý cho mệnh ' + cp.cung + '</th></tr>' +
        '<tr><td>Bàn thờ</td><td>Quay về hướng ' + good[0].dir + ' (' + good[0].star + '), lưng tựa tường vững.</td></tr>' +
        '<tr><td>Bếp nấu</td><td>Đặt tại hướng ' + bad[0].dir + ' (' + bad[0].star + '), cửa bếp quay về ' + good[1].dir + ' (' + good[1].star + '), theo nguyên tắc tọa hung hướng cát.</td></tr>' +
        '<tr><td>Giường ngủ chính</td><td>Đầu giường quay về ' + good[0].dir + ' hoặc ' + good[2].dir + '.</td></tr>' +
        '<tr><td>Phòng khách, cửa chính</td><td>Nên đón khí từ hướng ' + good.map(function (s) { return s.dir; }).join(', ') + '.</td></tr>' +
        '<tr><td>Nhà vệ sinh, kho</td><td>Nên đặt tại các hướng xấu ' + bad.map(function (s) { return s.dir; }).join(', ') + ' để trấn áp khí xấu.</td></tr></table></div>' +
        '<p class="ptv-note">Đây là luận giải theo bát trạch phái dựa trên cung mệnh của gia chủ. Khi xây hoặc sửa nhà lớn, nên kết hợp thêm tọa hướng thực tế đo bằng la bàn và thế đất xung quanh.</p>' + L.dirTable(cp.cung);
      L.resultBox(container, html);
    });
  }
  function xayNha(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2005, 1990))) + L.field('Năm dự định xây nhà', L.select('by', L.yearOptions(2025, 2035, 2026))) + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), by = parseInt(container.querySelector('#by').value, 10);
      var yi = L.yearInfo(y), age = by - y + 1;
      var tt = L.tamTai(yi.chi, by), kl = L.kimLau(age), ho = L.hoangOc(age);
      var badCount = (tt ? 1 : 0) + (kl.bad ? 1 : 0) + (ho.bad ? 1 : 0);
      function row(name, bad, text) { return '<tr><td><strong>' + name + '</strong></td><td class="' + (bad ? 'ptv-bad' : 'ptv-good') + '">' + (bad ? 'Phạm' : 'Không phạm') + '</td><td>' + text + '</td></tr>'; }
      var html = '<div class="ptv-facts"><span>Gia chủ sinh năm <strong>' + y + '</strong> (' + yi.text + ', mệnh ' + esc(yi.napAm) + ')</span><span>Năm xây: <strong>' + by + '</strong> (' + L.yearInfo(by).text + ')</span><span>Tuổi âm lịch khi xây: <strong>' + age + '</strong></span></div>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Hạng mục</th><th>Kết quả</th><th>Giải thích</th></tr>' +
        row('Tam tai', tt, tt ? 'Năm ' + by + ' rơi vào hạn tam tai của tuổi ' + yi.chi + ', xây nhà năm này dễ gặp trắc trở.' : 'Năm ' + by + ' không thuộc 3 năm tam tai của tuổi ' + yi.chi + '.') +
        row('Kim lâu', kl.bad, kl.bad ? 'Tuổi ' + age + ' phạm ' + kl.kind + '.' : 'Tuổi ' + age + ' không phạm kim lâu.') +
        row('Hoang ốc', ho.bad, 'Tuổi ' + age + ' rơi vào cung ' + ho.name + (ho.bad ? ', thuộc cung xấu của hoang ốc.' : ', thuộc cung tốt của hoang ốc.')) +
        '</table></div>';
      if (badCount === 0) html += '<p class="ptv-good"><strong>Năm ' + by + ' là năm đẹp để tuổi ' + yi.chi + ' xây nhà</strong>, không phạm cả tam tai, kim lâu và hoang ốc.</p>';
      else {
        html += '<p class="ptv-bad"><strong>Năm ' + by + ' phạm ' + badCount + '/3 yếu tố</strong>, theo phong thủy nên cân nhắc dời năm hoặc mượn tuổi người khác để đứng tên động thổ.</p>';
        var cands = [];
        for (var cy = by - 45; cy <= by - 20 && cands.length < 8; cy++) {
          var ci = L.yearInfo(cy), cage = by - cy + 1;
          if (!L.tamTai(ci.chi, by) && !L.kimLau(cage).bad && !L.hoangOc(cage).bad) cands.push(cy + ' (tuổi ' + ci.chi + ', ' + cage + ' tuổi âm)');
        }
        if (cands.length) html += '<p><strong>Gợi ý tuổi mượn để động thổ năm ' + by + ':</strong> sinh năm ' + cands.join('; ') + '. Người mượn tuổi nên là nam giới trong nhà khỏe mạnh, gia đạo êm ấm, và làm lễ mượn tuổi đầy đủ trước khi động thổ.</p>';
      }
      L.resultBox(container, html);
    });
  }
  var LOBAN = [
    { name: 'Thước 52,2 cm (đo cửa, cổng)', cycle: 52.2, segs: [['Quý Nhân', 1, 'Gặp quý nhân giúp đỡ, công việc hanh thông'], ['Hiểm Họa', 0, 'Dễ gặp trở ngại, hao tốn'], ['Thiên Tai', 0, 'Tránh dùng, chủ về bất trắc'], ['Thiên Tài', 1, 'Tài lộc tìm đến, làm ăn phát đạt'], ['Phúc Lộc', 1, 'Phúc lộc dồi dào, con cháu hưởng phúc'], ['Cô Độc', 0, 'Chủ về đơn lẻ, thiếu hòa khí'], ['Thiên Tặc', 0, 'Dễ mất mát, trộm cắp để ý'], ['Tể Tướng', 1, 'Quyền uy, địa vị vững vàng']] },
    { name: 'Thước 42,9 cm (đo bàn, ghế, bếp)', cycle: 42.9, segs: [['Tài', 1, 'Tài lộc, tiền bạc thuận lợi'], ['Bệnh', 0, 'Ảnh hưởng sức khỏe, nên tránh'], ['Ly', 0, 'Chia ly, xa cách'], ['Nghĩa', 1, 'Nghĩa tình, quan hệ tốt đẹp'], ['Quan', 1, 'Công danh, thi cử thuận lợi'], ['Nạn', 0, 'Tai nạn, biến cố bất ngờ'], ['Hại', 0, 'Tổn hại, hao tài'], ['Bản', 1, 'Gốc rễ vững, vốn liếng bền']] },
    { name: 'Thước 38,8 cm (đo bàn thờ, mộ)', cycle: 38.8, segs: [['Đinh', 1, 'Con trai, thêm người thêm của'], ['Hại', 0, 'Tổn hại, nên tránh'], ['Vượng', 1, 'Thịnh vượng, phát triển'], ['Khổ', 0, 'Vất vả, khó khăn'], ['Nghĩa', 1, 'Nghĩa tình trọn vẹn'], ['Quan', 1, 'Quan lộc, địa vị'], ['Tử', 0, 'Hung, tuyệt đối tránh'], ['Hưng', 1, 'Hưng thịnh, đi lên'], ['Thất', 0, 'Thất thoát, mất mát'], ['Tài', 1, 'Tài lộc dồi dào']] }
  ];
  function loBan(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Kích thước cần đo (cm)', '<input type="text" id="cm" inputmode="decimal" value="81">', 'ptv-field-name') + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var cm = parseFloat(String(container.querySelector('#cm').value).replace(',', '.'));
      if (!cm || cm <= 0) { L.resultBox(container, '<p class="ptv-bad">Bạn nhập một kích thước lớn hơn 0, tính bằng cm nhé.</p>'); return; }
      var html = '<h3>Kết quả đo ' + cm + ' cm trên 3 loại thước Lỗ Ban</h3>';
      LOBAN.forEach(function (r) {
        var segLen = r.cycle / r.segs.length;
        var pos = cm % r.cycle; if (pos === 0) pos = r.cycle;
        var idx = Math.min(r.segs.length - 1, Math.floor((pos - 0.0001) / segLen));
        var seg = r.segs[idx];
        var start = Math.floor(cm / r.cycle) * r.cycle + idx * segLen;
        html += '<div class="ptv-block"><div class="ptv-block-head"><span>' + r.name + '</span><span class="' + (seg[1] ? 'ptv-good' : 'ptv-bad') + '">Cung ' + seg[0] + (seg[1] ? ' (tốt)' : ' (xấu)') + '</span></div><p>Kích thước ' + cm + ' cm rơi vào cung ' + seg[0] + ' (từ ' + start.toFixed(1) + ' đến ' + (start + segLen).toFixed(1) + ' cm). ' + seg[2] + '.</p></div>';
      });
      html += '<p class="ptv-note">Khi thi công, sai số vài mm là bình thường. Nếu kích thước rơi vào cung xấu nhưng sát ranh giới, bạn có thể nới hoặc thu vài mm sang cung tốt gần nhất.</p>';
      L.resultBox(container, html);
    });
  }
  window.PTVToolsW1a = { 'xem-huong-ban-tho': function (c) { huongBasic(c, 'ban-tho'); }, 'xem-huong-bep-nau': function (c) { huongBasic(c, 'bep'); }, 'xem-huong-giuong-ngu': function (c) { huongBasic(c, 'giuong'); }, 'xem-huong-nha-tot-xau': huongNha, 'xem-phong-thuy-nha': phongThuyNha, 'xem-tuoi-xay-nha': xayNha, 'thuoc-lo-ban': loBan };
})();
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  var DIGIT_EL = { '0': 'Thủy', '1': 'Thủy', '2': 'Thổ', '3': 'Mộc', '4': 'Mộc', '5': 'Thổ', '6': 'Kim', '7': 'Kim', '8': 'Thổ', '9': 'Hỏa' };
  function nutSo(digits) { var s = digits.split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0); var n = s % 10; return n === 0 ? 10 : n; }
  function hoachOf(n) { var r = n % 80; if (r === 0) r = 80; return { num: r, entry: (window.PTV_DATA.hoach81 || {})[String(r)] || { rating: 'Bình', text: '' } }; }
  function ratingPts(r) { return { 'Đại cát': 4, 'Cát': 3.4, 'Bình': 2, 'Hung': 1, 'Đại hung': 0.4 }[r] || 2; }
  function sim(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Số điện thoại', '<input type="text" id="phone" inputmode="numeric" value="">', 'ptv-field-name') + '</div><div class="ptv-row">' + L.field('Năm sinh của bạn (không bắt buộc, để đối chiếu mệnh)', L.select('y', '<option value="">Không nhập</option>' + L.yearOptions(1940, 2015, 1990))) + '</div>', 'Xem sim');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var digits = container.querySelector('#phone').value.replace(/\D/g, '');
      if (digits.length < 9) { L.resultBox(container, '<p class="ptv-bad">Bạn nhập số điện thoại đầy đủ, ít nhất 9 chữ số nhé.</p>'); return; }
      var last4 = digits.slice(-4), h = hoachOf(parseInt(last4, 10)), nut = nutSo(digits);
      var counts = {}; digits.split('').forEach(function (d) { var e = DIGIT_EL[d]; counts[e] = (counts[e] || 0) + 1; });
      var dom = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      var score = nut / 10 * 3 + ratingPts(h.entry.rating);
      var html = '<h3>Luận sim ' + esc(digits) + '</h3>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Số nút của dãy số</span><span class="ptv-block-score">' + nut + ' nút</span></div><p>' + (nut >= 8 ? 'Số nút cao, theo quan niệm sim số đây là dãy số đẹp, dễ nhớ và mang khí vượng.' : nut >= 5 ? 'Số nút ở mức khá, dãy số cân bằng.' : 'Số nút thấp, dãy số thiên về trầm, hợp người thích sự điềm tĩnh hơn là cầu tài.') + '</p></div>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>4 số cuối ' + last4 + ' theo quẻ số ' + h.num + '</span><span class="ptv-block-score">' + h.entry.rating + '</span></div><p>' + esc(h.entry.text) + '</p></div>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Ngũ hành chủ đạo của dãy số</span><span class="ptv-block-score">Hành ' + dom + '</span></div><p>Các chữ số trong sim nghiêng về hành ' + dom + ' (' + (counts[dom]) + '/' + digits.length + ' số).</p></div>';
      var yv = container.querySelector('#y').value;
      if (yv) {
        var yi = L.yearInfo(parseInt(yv, 10)), rel = L.relEl(dom, yi.el);
        score += rel.indexOf('tương sinh') >= 0 && rel.indexOf('được') < 0 ? 1.5 : rel.indexOf('được tương sinh') >= 0 ? 2 : rel.indexOf('Cùng hành') >= 0 ? 1.5 : rel.indexOf('khắc') >= 0 ? 0 : 1;
        html += '<div class="ptv-block"><div class="ptv-block-head"><span>Đối chiếu với mệnh của bạn</span><span class="ptv-block-score">' + esc(yi.napAm) + '</span></div><p>Bạn sinh năm ' + yv + ', mệnh ' + esc(yi.napAm) + ' ' + L.badge(yi.el) + '. Hành chủ đạo của sim so với mệnh của bạn: ' + rel + '.</p></div>';
      } else score += 1.2;
      score = Math.max(0.5, Math.min(10, Math.round(score * 2) / 2));
      html += '<div class="ptv-score-wrap"><div class="ptv-score-circle" style="border-color:' + (score >= 7 ? '#2e7d32' : score >= 5 ? '#b8860b' : '#c62828') + '">' + String(score).replace('.', ',') + '<span>/ 10</span></div><div><p class="ptv-verdict">' + (score >= 8 ? 'Sim rất hợp, khí số vượng' : score >= 6.5 ? 'Sim khá tốt' : score >= 5 ? 'Sim ở mức trung bình khá' : 'Sim thiên về trầm, nên cân nhắc') + '</p><p class="ptv-note">Điểm gồm số nút, quẻ của 4 số cuối theo bảng 81 số và độ hợp hành giữa dãy số với mệnh người dùng. Đây là luận giải tham khảo theo sim phong thủy dân gian.</p></div></div>';
      L.resultBox(container, html);
    });
  }
  function boi4(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Nhập 4 số cuối điện thoại', '<input type="text" id="n4" inputmode="numeric" maxlength="4" value="">', 'ptv-field-name') + '</div>', 'Xem 4 số cuối');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = container.querySelector('#n4').value.replace(/\D/g, '');
      if (v.length !== 4) { L.resultBox(container, '<p class="ptv-bad">Bạn nhập đúng 4 chữ số cuối nhé.</p>'); return; }
      var h = hoachOf(parseInt(v, 10)), nut = nutSo(v);
      var els = v.split('').map(function (d) { return d + ' thuộc ' + DIGIT_EL[d]; }).join(', ');
      var html = '<h3>Luận 4 số cuối ' + v + '</h3><p>Theo cách luận phổ biến, lấy 4 số cuối chia cho 80, phần dư ứng với quẻ số <strong>' + h.num + '</strong>, được đánh giá là <strong>' + h.entry.rating + '</strong>.</p><div class="ptv-card" style="margin:10px 0"><p>' + esc(h.entry.text) + '</p></div>' +
        '<p><strong>Số nút của 4 số:</strong> ' + nut + ' nút. <strong>Ngũ hành từng chữ số:</strong> ' + els + '.</p>' +
        '<p class="ptv-note">Cách xem này chỉ dựa trên 4 số cuối. Muốn luận đầy đủ cả dãy số, bạn dùng thêm công cụ Sim phong thủy ở mục Linh Khí.</p>';
      L.resultBox(container, html);
    });
  }
  function voChong(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của chồng', L.select('hy', L.yearOptions(1940, 2010, 1990))) + L.field('Năm sinh của vợ', L.select('wy', L.yearOptions(1940, 2010, 1992))) + '</div>', 'Xem tuổi vợ chồng');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var hy = parseInt(container.querySelector('#hy').value, 10), wy = parseInt(container.querySelector('#wy').value, 10);
      var H = L.yearInfo(hy), W = L.yearInfo(wy);
      var chi = L.chiRelation(H.chi, W.chi);
      var canHop = L.CAN_HOP[H.can] === W.can;
      var naRel = L.relEl(H.el, W.el);
      var hCung = L.cungPhi(hy, 'Nam').cung, wCung = L.cungPhi(wy, 'Nữ').cung;
      var star = L.coupleStar(hCung, wCung);
      var score = 5 + chi.score + (canHop ? 1 : 0) + (naRel.indexOf('tương sinh') >= 0 ? 1.2 : naRel.indexOf('Cùng hành') >= 0 ? 0.5 : naRel.indexOf('khắc') >= 0 ? -1.2 : 0);
      score += { 'Sinh Khí': 2, 'Diên Niên': 2, 'Thiên Y': 1.5, 'Phục Vị': 1, 'Họa Hại': -0.5, 'Lục Sát': -1, 'Ngũ Quỷ': -1.5, 'Tuyệt Mệnh': -2 }[star] || 0;
      score = Math.max(0.5, Math.min(10, Math.round(score * 2) / 2));
      function row(a, b, c) { return '<tr><td><strong>' + a + '</strong></td><td>' + b + '</td><td>' + c + '</td></tr>'; }
      var html = '<div class="ptv-facts"><span>Chồng: <strong>' + hy + '</strong> (' + H.text + ', ' + esc(H.napAm) + ', cung ' + hCung + ')</span><span>Vợ: <strong>' + wy + '</strong> (' + W.text + ', ' + esc(W.napAm) + ', cung ' + wCung + ')</span></div>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Yếu tố</th><th>Kết quả</th><th>Nhận xét</th></tr>' +
        row('Địa chi', chi.label, chi.score >= 2 ? 'Hai tuổi thuộc nhóm rất hợp nhau về tính khí và đường đời.' : chi.score < 0 ? 'Hai tuổi có điểm xung khắc, cần nhường nhịn và phân chia việc rõ ràng.' : 'Hai tuổi không xung không hợp đặc biệt, êm đềm do cách sống.') +
        row('Thiên can', canHop ? 'Can hợp (' + H.can + ' hợp ' + W.can + ')' : 'Không thuộc cặp can hợp', canHop ? 'Can hợp là điểm cộng lớn, vợ chồng dễ đồng lòng làm ăn.' : 'Không có điểm cộng cũng không trừ điểm ở yếu tố này.') +
        row('Nạp âm ngũ hành', naRel, 'Xét theo hành của mệnh nạp âm hai vợ chồng.') +
        row('Cung phi bát trạch', 'Sao ' + star, L.STAR_INFO[star].d) +
        '</table></div>' +
        '<div class="ptv-score-wrap"><div class="ptv-score-circle" style="border-color:' + (score >= 7 ? '#2e7d32' : score >= 5 ? '#b8860b' : '#c62828') + '">' + String(score).replace('.', ',') + '<span>/ 10</span></div><div><p class="ptv-verdict">' + (score >= 8 ? 'Rất hợp, thuộc nhóm vợ chồng đồng lòng' : score >= 6.5 ? 'Hợp nhau ở mức tốt' : score >= 5 ? 'Ở mức trung bình, sống chung hòa hợp do nhường nhịn' : 'Có nhiều điểm xung, cần chú ý cách hóa giải') + '</p><p class="ptv-note">Điểm tổng hợp 4 yếu tố trên thang 10. Tuổi xung không có nghĩa là không nên duyên, phong thủy chỉ gợi ý những điểm cần chú ý để hai người bù trừ cho nhau.</p></div></div>';
      L.resultBox(container, html);
    });
  }
  var MENH_GUIDE = {
    'Kim': { nghe: 'Tài chính, ngân hàng, kế toán kiểm toán, cơ khí, kỹ thuật, công nghệ thông tin, y khoa, luật và kinh doanh kim loại, trang sức. Người mệnh Kim hợp việc cần độ chính xác, kỷ luật và quyết đoán.', mau: 'Màu hợp: trắng, xám, ghi và vàng ánh kim thuộc hành Kim; vàng, nâu đất thuộc hành Thổ sinh Kim cũng rất tốt. Màu nên hạn chế: đỏ, hồng, tím thuộc hành Hỏa khắc Kim.', trangSuc: 'Vàng, bạch kim, bạc và các đá màu trắng, vàng như kim cương, thạch anh trắng, thạch anh vàng, hổ phách. Đeo trang sức kim loại giúp mệnh Kim thêm vượng khí và sự sắc bén trong công việc.', cay: 'Cây kim tiền, cây kim ngân, ngọc ngân, bạch mã hoàng tử, lan ý và sen đá. Nên chọn chậu trắng, xám hoặc chậu kim loại để tăng hành Kim.', quanAo: 'Tông trắng, xám, vàng ánh kim; kiểu dáng gọn gàng, đứng form, phụ kiện kim loại như đồng hồ, thắt lưng bản nhỏ. Tránh phối quá nhiều đỏ tím trong những ngày cần quyết việc quan trọng.' },
    'Mộc': { nghe: 'Giáo dục, y dược và đông y, nông lâm nghiệp, nội thất và đồ gỗ, thời trang, xuất bản, thiết kế sáng tạo. Người mệnh Mộc hợp việc nuôi dưỡng, phát triển lâu dài và cần sự mềm dẻo.', mau: 'Màu hợp: xanh lá các tông thuộc hành Mộc; đen và xanh dương thuộc hành Thủy sinh Mộc. Màu nên hạn chế: trắng, xám, màu kim loại thuộc hành Kim khắc Mộc.', trangSuc: 'Vòng gỗ trầm hương, gỗ sưa và các đá xanh lá như ngọc bích, thạch anh xanh, ngọc lục bảo. Chất liệu gỗ hợp với mệnh Mộc vì cùng hành, giúp tinh thần thư thái.', cay: 'Trầu bà, kim ngân, phát tài, ngũ gia bì, cau tiểu trâm và hầu hết cây lá xanh. Mệnh Mộc trồng cây thường dễ chăm và cây cũng hợp lại với chủ.', quanAo: 'Tông xanh lá, xanh rêu, đen; chất liệu tự nhiên như cotton, linen, họa tiết hoa lá. Tránh lạm dụng tông trắng kim loại trong ngày cần tự tin thuyết trình.' },
    'Thủy': { nghe: 'Logistics, vận tải, du lịch, ngoại giao, truyền thông, thủy hải sản, đồ uống và thương mại linh hoạt. Người mệnh Thủy hợp việc lưu thông, đàm phán và cần sự uyển chuyển.', mau: 'Màu hợp: đen, xanh dương, xanh biển thuộc hành Thủy; trắng, xám thuộc hành Kim sinh Thủy. Màu nên hạn chế: vàng, nâu đất thuộc hành Thổ khắc Thủy.', trangSuc: 'Bạc, bạch kim và các đá đen, xanh dương như thạch anh đen, aquamarine, sapphire, đá mắt hổ xanh. Trang sức có mặt đá cong, hình giọt nước rất hợp hành Thủy.', cay: 'Cây trồng thủy sinh như phát tài thủy sinh, trầu bà nước, lan ý và các bình cây thủy canh trong suốt. Mệnh Thủy nên có thêm yếu tố nước như bể cá nhỏ trong nhà.', quanAo: 'Tông đen, xanh dương, xanh biển; chất vải mềm có độ rủ, họa tiết sóng nước. Tránh phối nhiều vàng nâu trong những dịp cần ký kết.' },
    'Hỏa': { nghe: 'Ẩm thực, năng lượng, điện và điện tử, marketing, giải trí, làm đẹp, công nghệ và các việc cần tốc độ, nhiệt huyết. Người mệnh Hỏa hợp việc tỏa sáng trước đám đông.', mau: 'Màu hợp: đỏ, hồng, tím, cam thuộc hành Hỏa; xanh lá thuộc hành Mộc sinh Hỏa. Màu nên hạn chế: đen, xanh dương thuộc hành Thủy khắc Hỏa.', trangSuc: 'Vàng hồng, vàng và các đá đỏ, hồng như ruby, thạch anh hồng, garnet, mã não đỏ. Đá ấm màu giúp mệnh Hỏa giữ được sự tự tin và sức hút.', cay: 'Hồng môn, phú quý, trạng nguyên, đa búp đỏ và các cây có lá hoặc hoa tông đỏ hồng. Đặt cây ở nơi nhiều sáng để cây và khí Hỏa cùng vượng.', quanAo: 'Tông đỏ, hồng, tím, cam; kiểu dáng nổi bật, có điểm nhấn. Nên tiết chế khi đi đàm phán cần sự điềm tĩnh, thay bằng điểm nhấn phụ kiện nhỏ.' },
    'Thổ': { nghe: 'Bất động sản, xây dựng, nông nghiệp, khoáng sản, quản trị nhân sự, kho vận và dịch vụ lưu trú. Người mệnh Thổ hợp việc cần sự ổn định, tích lũy và chữ tín.', mau: 'Màu hợp: vàng, nâu, be thuộc hành Thổ; đỏ, hồng, tím thuộc hành Hỏa sinh Thổ. Màu nên hạn chế: xanh lá thuộc hành Mộc khắc Thổ.', trangSuc: 'Thạch anh vàng, citrine, đá mắt hổ, hổ phách và trang sức gốm sứ. Đá tông vàng nâu giúp mệnh Thổ thêm vững vàng và thu hút tài lộc ổn định.', cay: 'Lưỡi hổ, sen đá, sống đời, vạn niên thanh và các cây trồng trong chậu đất nung, chậu gốm. Mệnh Thổ chăm cây chịu hạn tốt thường rất hợp tay.', quanAo: 'Tông vàng, nâu, be, cam đất; kiểu dáng ổn định, chất liệu dày dặn, ít họa tiết rối. Thêm điểm nhấn đỏ nhỏ trong ngày cần thêm năng lượng.' }
  };
  function chonTheoMenh(container, key, title) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2015, 1990))) + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), yi = L.yearInfo(y);
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div><h3>' + title + ' cho mệnh ' + yi.el + '</h3><p>' + MENH_GUIDE[yi.el][key] + '</p><p class="ptv-note">Ngoài hành bản mệnh, bạn có thể dùng thêm màu và vật phẩm của hành sinh cho mệnh của mình (' + Object.keys(L.GENERATES).find(function (k) { return L.GENERATES[k] === yi.el; }) + ' sinh ' + yi.el + ') để được hỗ trợ thêm.</p>';
      L.resultBox(container, html);
    });
  }
  function timNguoi(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Mục đích tìm người hợp tuổi', L.select('p', '<option value="làm ăn">Hợp tác làm ăn</option><option value="kết hôn">Kết hôn</option><option value="bạn bè">Bạn bè, đối tác</option>')) + '</div>', 'Tìm tuổi hợp');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), purpose = container.querySelector('#p').value;
      var me = L.yearInfo(y), scored = [];
      for (var cy = 1950; cy <= 2012; cy++) {
        if (cy === y) continue;
        var o = L.yearInfo(cy), s = 0, reasons = [];
        var chi = L.chiRelation(me.chi, o.chi); s += chi.score; if (chi.score >= 2) reasons.push(chi.label); if (chi.score < 0) reasons.push(chi.label);
        if (L.CAN_HOP[me.can] === o.can) { s += 1; reasons.push('Can hợp'); }
        var rel = L.relEl(o.el, me.el);
        if (rel.indexOf('được tương sinh') >= 0 || (L.GENERATES[o.el] === me.el)) { s += 1.5; reasons.push('Mệnh sinh cho bạn'); }
        else if (L.GENERATES[me.el] === o.el) { s += 0.3; reasons.push('Bạn sinh cho họ'); }
        else if (rel.indexOf('Cùng hành') >= 0) { s += 0.5; reasons.push('Cùng hành mệnh'); }
        else if (rel.indexOf('khắc') >= 0) { s -= 1; reasons.push('Mệnh tương khắc'); }
        scored.push({ y: cy, info: o, s: s, reasons: reasons });
      }
      scored.sort(function (a, b) { return b.s - a.s; });
      var top = scored.slice(0, 10);
      var rows = top.map(function (t) { return '<tr><td><strong>' + t.y + '</strong></td><td>' + t.info.text + '</td><td>' + esc(t.info.napAm) + '</td><td>' + t.reasons.join(', ') + '</td></tr>'; }).join('');
      var html = '<div class="ptv-facts"><span>Bạn sinh năm <strong>' + y + '</strong> (' + me.text + ', mệnh ' + esc(me.napAm) + ')</span><span>Mục đích: <strong>' + purpose + '</strong></span></div><h3>10 tuổi hợp nhất với bạn</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm sinh</th><th>Tuổi</th><th>Mệnh</th><th>Điểm hợp</th></tr>' + rows + '</table></div><p class="ptv-note">Bảng xếp hạng dựa trên quan hệ địa chi, thiên can và nạp âm. Hợp tuổi chỉ là một yếu tố tham khảo, sự hòa hợp thật sự vẫn đến từ tính cách và cách cư xử của hai bên.</p>';
      L.resultBox(container, html);
    });
  }
  var W1b = { 'sim-phong-thuy': sim, 'boi-4-so-cuoi-dien-thoai': boi4, 'xem-tuoi-vo-chong': voChong, 'tim-nguoi-hop-tuoi': timNguoi,
    'chon-nghe-hop-tuoi': function (c) { chonTheoMenh(c, 'nghe', 'Nghề nghiệp hợp tuổi'); }, 'chon-mau-sac-hop-tuoi': function (c) { chonTheoMenh(c, 'mau', 'Màu sắc hợp tuổi'); },
    'chon-trang-suc-hop-tuoi': function (c) { chonTheoMenh(c, 'trangSuc', 'Trang sức hợp tuổi'); }, 'chon-cay-trong-hop-tuoi': function (c) { chonTheoMenh(c, 'cay', 'Cây trồng hợp tuổi'); },
    'chon-quan-ao-hop-tuoi': function (c) { chonTheoMenh(c, 'quanAo', 'Quần áo hợp tuổi'); } };
  window.PTVTools = Object.assign({}, window.PTVToolsW1a || {}, W1b, window.PTVTools || {});
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-ptv-tool]').forEach(function (c) {
      var fn = window.PTVTools[c.getAttribute('data-ptv-tool')];
      if (fn) fn(c);
    });
  });
})();
