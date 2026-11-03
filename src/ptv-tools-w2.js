/* PhongThuy VietAA - cong cu dot 2: Ngay Thang + Ngay Tet (v1.4) */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  function monthOptions() {
    var now = new Date(), h = '';
    for (var i = 0; i < 12; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      h += '<option value="' + d.getFullYear() + '-' + (d.getMonth() + 1) + '"' + (i === 1 ? ' selected' : '') + '>Tháng ' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</option>';
    }
    return h;
  }
  function dayListHTML(days, limit) {
    return days.slice(0, limit || 5).map(function (x) {
      return '<div class="ptv-block"><div class="ptv-block-head"><span>' + D.fmtSolar(x.i) + ' (' + D.fmtLunar(x.i) + '), ngày ' + x.i.day.text + '</span><span class="ptv-block-score">' + x.s.score + ' điểm</span></div><p>' + x.s.notes.join('. ') + '. Giờ hoàng đạo: ' + D.GIO_HD[x.i.day.chi].join(', ') + '.</p></div>';
    }).join('');
  }
  function dayPicker(container, purpose, label, extra) {
    var fields = '<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn ' + label, L.select('m', monthOptions())) + '</div>';
    if (extra === 'cuoi') fields = '<div class="ptv-row">' + L.field('Năm sinh chú rể', L.select('y', L.yearOptions(1940, 2010, 1995))) + L.field('Năm sinh cô dâu', L.select('y2', L.yearOptions(1940, 2010, 1997))) + L.field('Tháng muốn cưới', L.select('m', monthOptions())) + '</div>';
    container.innerHTML = formWrap(fields, 'Xem ngày tốt');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10);
      var parts = container.querySelector('#m').value.split('-');
      var me = L.yearInfo(y);
      var opts = { purpose: purpose, birthChi: me.chi };
      if (extra === 'cuoi') { var y2 = parseInt(container.querySelector('#y2').value, 10); opts.birthChi2 = L.yearInfo(y2).chi; }
      var scored = D.monthDays(parseInt(parts[0], 10), parseInt(parts[1], 10)).map(function (i) { return { i: i, s: D.scoreDay(i, opts) }; });
      var good = scored.filter(function (x) { return x.s.score >= 6; }).sort(function (a, b) { return b.s.score - a.s.score; });
      var bad = scored.filter(function (x) { return x.s.score <= 3; });
      var html = '<h3>Ngày tốt ' + label + ' trong tháng ' + parts[1] + '/' + parts[0] + ' cho tuổi ' + me.chi + '</h3>';
      html += good.length ? dayListHTML(good, 6) : '<p>Tháng này không có ngày nào đạt từ 6 điểm cho tuổi của bạn, bạn nên xem thêm tháng kề trước hoặc kề sau.</p>';
      if (bad.length) html += '<p class="ptv-note"><strong>Ngày nên tránh trong tháng:</strong> ' + bad.map(function (x) { return D.fmtSolar(x.i) + ' (' + x.s.notes.slice(-1)[0] + ')'; }).join('; ') + '.</p>';
      if (extra === 'dong-tho') {
        var by = parseInt(parts[0], 10), age = by - y + 1, tt = L.tamTai(me.chi, by), kl = L.kimLau(age), ho = L.hoangOc(age);
        html += '<p class="ptv-note"><strong>Lưu ý theo tuổi:</strong> năm ' + by + ' bạn ' + age + ' tuổi âm, ' + (tt ? 'phạm tam tai' : 'không phạm tam tai') + ', ' + (kl.bad ? 'phạm kim lâu' : 'không phạm kim lâu') + ', hoang ốc cung ' + ho.name + '. Nếu năm phạm hạn, nên mượn tuổi động thổ (xem công cụ Xem tuổi xây nhà).</p>';
      }
      L.resultBox(container, html);
    });
  }
  function xuatHanhNgay(container) {
    var now = new Date();
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Ngày dương lịch muốn xem (năm-tháng-ngày)', '<input type="text" id="dt" value="' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '">') + '</div>', 'Xem ngày xuất hành');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var p = container.querySelector('#dt').value.split('-').map(Number);
      var info = D.dayInfo(new Date(p[0], p[1] - 1, p[2]));
      var me = L.yearInfo(parseInt(container.querySelector('#y').value, 10));
      var s = D.scoreDay(info, { purpose: 'xuat-hanh', birthChi: me.chi });
      var qn = D.QUY_NHAN[info.day.can] || [];
      var html = '<h3>Ngày ' + D.fmtSolar(info) + ' (' + D.fmtLunar(info) + '), ngày ' + info.day.text + '</h3>' +
        '<p>Đánh giá cho việc xuất hành của tuổi ' + me.chi + ': <strong>' + s.score + ' điểm</strong>. ' + s.notes.join('. ') + '.</p>' +
        '<p><strong>Giờ hoàng đạo trong ngày:</strong> ' + D.GIO_HD[info.day.chi].map(function (g) { return g + ' (' + E.HOUR_LABEL[g] + ')'; }).join(', ') + '.</p>' +
        '<p><strong>Hướng xuất hành đón Quý nhân:</strong> ngày can ' + info.day.can + ', Quý nhân ở phương ' + qn.map(function (c) { return D.CHI_DIR[c] + ' (' + c + ')'; }).join(' và ') + '. Khi xuất hành đầu ngày, nên đi về hướng này trước rồi mới rẽ tới điểm đến.</p>';
      L.resultBox(container, html);
    });
  }
  function gioXuatHanh(container) {
    var now = new Date();
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Ngày dương lịch (năm-tháng-ngày)', '<input type="text" id="dt" value="' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '">', 'ptv-field-name') + '</div>', 'Xem giờ hoàng đạo');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var p = container.querySelector('#dt').value.split('-').map(Number);
      var info = D.dayInfo(new Date(p[0], p[1] - 1, p[2]));
      var sat = D.satOf(info), hoang = ['Thanh Long', 'Minh Đường', 'Kim Quỹ', 'Thiên Đức', 'Ngọc Đường', 'Tư Mệnh'].indexOf(sat) >= 0;
      var rows = E.CHI.map(function (g) {
        var hd = D.GIO_HD[info.day.chi].indexOf(g) >= 0;
        return '<tr><td><strong>Giờ ' + g + '</strong></td><td>' + E.HOUR_LABEL[g] + '</td><td class="' + (hd ? 'ptv-good' : 'ptv-bad') + '">' + (hd ? 'Hoàng đạo' : 'Hắc đạo') + '</td></tr>';
      }).join('');
      var html = '<h3>Giờ xuất hành ngày ' + D.fmtSolar(info) + ' (' + D.fmtLunar(info) + ')</h3><p>Ngày ' + info.day.text + ', thuộc ngày ' + (hoang ? '<span class="ptv-good">hoàng đạo (' + sat + ')</span>' : '<span class="ptv-bad">hắc đạo (' + sat + ')</span>') + ', trực ' + D.trucOf(info) + '. Các giờ hoàng đạo nên ưu tiên khi xuất hành, khởi hành đi xa hoặc mở đầu công việc:</p><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Giờ</th><th>Khung giờ</th><th>Loại</th></tr>' + rows + '</table></div>';
      L.resultBox(container, html);
    });
  }
  function namSinhCon(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của bố', L.select('fy', L.yearOptions(1955, 2010, 1992))) + L.field('Năm sinh của mẹ', L.select('my', L.yearOptions(1955, 2010, 1994))) + L.field('Sinh con đến năm', L.select('ey', L.yearOptions(2027, 2035, 2030))) + '</div>', 'Xem năm sinh con');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var F = L.yearInfo(parseInt(container.querySelector('#fy').value, 10)), M = L.yearInfo(parseInt(container.querySelector('#my').value, 10));
      var ey = parseInt(container.querySelector('#ey').value, 10), rows = [];
      for (var cy = 2026; cy <= ey; cy++) {
        var C = L.yearInfo(cy), s = 5, notes = [];
        [F, M].forEach(function (P, ix) {
          var rel = L.chiRelation(P.chi, C.chi);
          s += rel.score * 0.8; if (rel.score >= 2) notes.push(rel.label + ' với ' + (ix ? 'mẹ' : 'bố')); if (rel.score <= -2) notes.push('xung với ' + (ix ? 'mẹ' : 'bố'));
          var er = L.relEl(C.el, P.el);
          if (L.GENERATES[C.el] === P.el) { /* con sinh bo me: hao */ }
          if (L.GENERATES[P.el] === C.el) { s += 0.8; notes.push('mệnh ' + (ix ? 'mẹ' : 'bố') + ' sinh con'); }
          else if (L.CONTROLS[P.el] === C.el) { s -= 0.8; notes.push('mệnh ' + (ix ? 'mẹ' : 'bố') + ' khắc con'); }
          else if (L.CONTROLS[C.el] === P.el) { s -= 0.5; }
        });
        s = Math.max(0, Math.min(10, Math.round(s * 2) / 2));
        rows.push({ cy: cy, C: C, s: s, notes: notes });
      }
      rows.sort(function (a, b) { return b.s - a.s; });
      var html = '<div class="ptv-facts"><span>Bố: <strong>' + F.year + '</strong> (' + F.text + ', ' + esc(F.napAm) + ')</span><span>Mẹ: <strong>' + M.year + '</strong> (' + M.text + ', ' + esc(M.napAm) + ')</span></div><h3>Xếp hạng năm sinh con hợp bố mẹ</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm sinh</th><th>Tuổi của con</th><th>Mệnh</th><th>Điểm hợp</th><th>Ghi chú</th></tr>' +
        rows.map(function (r) { return '<tr><td><strong>' + r.cy + '</strong></td><td>' + r.C.text + '</td><td>' + esc(r.C.napAm) + '</td><td><strong>' + r.s + '</strong></td><td>' + (r.notes.join(', ') || 'Bình hòa') + '</td></tr>'; }).join('') + '</table></div><p class="ptv-note">Điểm dựa trên quan hệ địa chi và nạp âm giữa con với bố mẹ. Con cái là duyên trời, bảng này chỉ nên dùng tham khảo khi gia đình đang có kế hoạch và nhiều lựa chọn.</p>';
      L.resultBox(container, html);
    });
  }
  function doiNgay(container) {
    var now = new Date();
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Chiều đổi', L.select('mode', '<option value="s2l">Dương lịch sang Âm lịch</option><option value="l2s">Âm lịch sang Dương lịch</option>')) + L.field('Ngày', '<input type="text" id="dd" inputmode="numeric" value="' + now.getDate() + '">') + L.field('Tháng', '<input type="text" id="mm" inputmode="numeric" value="' + (now.getMonth() + 1) + '">') + L.field('Năm', '<input type="text" id="yy" inputmode="numeric" value="' + now.getFullYear() + '">') + '</div><div class="ptv-row">' + L.field('Tháng nhuận (chỉ khi đổi Âm sang Dương)', L.select('leap', '<option value="">Tháng thường</option><option value="1">Tháng nhuận</option>')) + '</div>', 'Đổi ngày');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dd = parseInt(container.querySelector('#dd').value, 10), mm = parseInt(container.querySelector('#mm').value, 10), yy = parseInt(container.querySelector('#yy').value, 10);
      var mode = container.querySelector('#mode').value, html = '';
      if (mode === 's2l') {
        var info = D.dayInfo(new Date(yy, mm - 1, dd));
        var wd = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][new Date(yy, mm - 1, dd).getDay()];
        html = '<h3>' + wd + ', ngày ' + dd + '/' + mm + '/' + yy + ' dương lịch</h3><p>Đổi sang âm lịch là ngày <strong>' + D.fmtLunar(info) + '</strong> năm ' + L.yearInfo(info.lunar.y).text + ', ngày can chi <strong>' + info.day.text + '</strong>, trực ' + D.trucOf(info) + ', thuộc ngày ' + D.satOf(info) + '.</p>';
      } else {
        var leap = container.querySelector('#leap').value === '1';
        var dt = D.lunar2solar(dd, mm, yy, leap);
        if (!dt) { L.resultBox(container, '<p class="ptv-bad">Không tìm thấy ngày dương lịch tương ứng, bạn kiểm tra lại ngày tháng âm lịch (năm ' + yy + ' có thể không có tháng nhuận này).</p>'); return; }
        var info2 = D.dayInfo(dt);
        var wd2 = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][dt.getDay()];
        html = '<h3>Ngày ' + dd + '/' + mm + '/' + yy + ' âm lịch' + (leap ? ' (tháng nhuận)' : '') + '</h3><p>Đổi sang dương lịch là <strong>' + wd2 + ', ngày ' + D.fmtSolar(info2) + '</strong>, ngày can chi <strong>' + info2.day.text + '</strong>.</p>';
      }
      L.resultBox(container, html);
    });
  }
  var SAO_NAM = ['La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương', 'Vân Hán', 'Kế Đô', 'Thái Âm', 'Mộc Đức'];
  var SAO_NU = ['Kế Đô', 'Vân Hán', 'Thái Dương', 'Thái Bạch', 'Thủy Diệu', 'Thổ Tú', 'La Hầu', 'Mộc Đức', 'Thái Âm'];
  var HAN_OFF = { 'Nam': { 'Thiên La': 13, 'Toán Tận': 14, 'Tam Kheo': 15, 'Ngũ Mộ': 16, 'Thiên Tinh': 17, 'Huỳnh Tuyền': 18, 'Địa Võng': 19, 'Diêm Vương': 20 }, 'Nữ': { 'Diêm Vương': 13, 'Địa Võng': 14, 'Huỳnh Tuyền': 15, 'Thiên Tinh': 16, 'Ngũ Mộ': 17, 'Tam Kheo': 18, 'Toán Tận': 19, 'Thiên La': 20 } };
  function cungSao(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh', L.select('y', L.yearOptions(1940, 2015, 1990))) + L.field('Giới tính', L.genderSelect('g')) + L.field('Năm muốn xem', L.select('vy', L.yearOptions(2025, 2035, 2026))) + '</div>', 'Xem sao hạn');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), g = container.querySelector('#g').value, vy = parseInt(container.querySelector('#vy').value, 10);
      var age = vy - y + 1;
      var saoName = (g === 'Nam' ? SAO_NAM : SAO_NU)[((age - 10) % 9 + 9) % 9];
      var data = (window.PTV_TOOLS_DATA || {}).saoHan || { sao: {}, han: {} };
      var sao = data.sao[saoName] || { type: '', desc: '', offering: '' };
      var hanName = null, off = HAN_OFF[g];
      Object.keys(off).forEach(function (k) { if (((age - off[k]) % 9 + 9) % 9 === 0 && age >= off[k]) hanName = k; });
      var han = hanName ? (data.han[hanName] || { desc: '' }) : null;
      var html = '<div class="ptv-facts"><span>Sinh năm <strong>' + y + '</strong>, ' + g.toLowerCase() + '</span><span>Năm xem: <strong>' + vy + '</strong></span><span>Tuổi âm lịch: <strong>' + age + '</strong></span></div>' +
        '<h3>Sao chiếu mệnh năm ' + vy + ': ' + saoName + (sao.type ? ' <span class="' + (sao.type === 'tốt' ? 'ptv-good' : sao.type === 'xấu' ? 'ptv-bad' : 'ptv-mid') + '">(' + sao.type + ')</span>' : '') + '</h3><p>' + esc(sao.desc) + '</p>' +
        (sao.offering ? '<p><strong>Cách cúng giải hạn:</strong> ' + esc(sao.offering) + '</p>' : '') +
        (han ? '<h3>Hạn năm ' + vy + ': ' + hanName + '</h3><p>' + esc(han.desc) + '</p>' : '<h3>Hạn năm ' + vy + '</h3><p>Năm nay tuổi của bạn không rơi vào một hạn lớn nào trong 8 hạn thường xem, đây là điểm thuận lợi. Vẫn nên giữ gìn sức khỏe và cẩn trọng chi tiêu như thường lệ.</p>') +
        '<p class="ptv-note">Sao và hạn được tính theo bảng dân gian phổ biến dựa trên tuổi âm lịch và giới tính. Cúng sao giải hạn là nét văn hóa tâm linh, phần quan trọng nhất vẫn là sống cẩn trọng và làm việc thiện.</p>';
      L.resultBox(container, html);
    });
  }
  function xongDat(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tết năm', L.select('ty', L.yearOptions(2026, 2028, 2027))) + '</div>', 'Tìm tuổi xông đất');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), ty = parseInt(container.querySelector('#ty').value, 10);
      var host = L.yearInfo(y), tet = L.yearInfo(ty), scored = [];
      for (var cy = ty - 68; cy <= ty - 18; cy++) {
        var o = L.yearInfo(cy), s = 0, reasons = [];
        var r1 = L.chiRelation(host.chi, o.chi); s += r1.score; if (r1.score >= 2) reasons.push(r1.label + ' với gia chủ'); if (r1.score < 0) reasons.push(r1.label + ' với gia chủ');
        var r2 = L.chiRelation(tet.chi, o.chi); s += r2.score * 0.8; if (r2.score <= -2) reasons.push('xung với năm ' + tet.text); if (r2.score >= 2) reasons.push(r2.label + ' với năm mới');
        if (L.GENERATES[o.el] === host.el) { s += 1; reasons.push('mệnh sinh cho gia chủ'); }
        else if (L.CONTROLS[o.el] === host.el) { s -= 1; reasons.push('mệnh khắc gia chủ'); }
        scored.push({ cy: cy, o: o, s: s, reasons: reasons, age: ty - cy + 1 });
      }
      scored.sort(function (a, b) { return b.s - a.s; });
      var html = '<div class="ptv-facts"><span>Gia chủ sinh năm <strong>' + y + '</strong> (' + host.text + ', mệnh ' + esc(host.napAm) + ')</span><span>Tết năm <strong>' + ty + '</strong> (' + tet.text + ')</span></div><h3>10 tuổi xông đất hợp nhất Tết ' + ty + '</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm sinh</th><th>Tuổi</th><th>Mệnh</th><th>Tuổi âm dịp Tết</th><th>Điểm hợp</th></tr>' +
        scored.slice(0, 10).map(function (t) { return '<tr><td><strong>' + t.cy + '</strong></td><td>' + t.o.text + '</td><td>' + esc(t.o.napAm) + '</td><td>' + t.age + '</td><td>' + (t.reasons.join(', ') || 'Bình hòa') + '</td></tr>'; }).join('') + '</table></div><p class="ptv-note">Ngoài hợp tuổi, người xông đất nên là người khỏe mạnh, tính tình vui vẻ, làm ăn ổn định và không đang chịu tang. Nếu không tìm được khách xông đất, gia chủ có thể tự xông đất cho nhà mình bằng cách ra khỏi nhà trước giao thừa và bước vào lại sau thời khắc chuyển giao.</p>';
      L.resultBox(container, html);
    });
  }
  function tetDays(container, mode) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tết năm', L.select('ty', L.yearOptions(2026, 2028, 2027))) + '</div>', mode === 'mo-hang' ? 'Xem ngày mở hàng' : 'Xem ngày xuất hành');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), ty = parseInt(container.querySelector('#ty').value, 10);
      var me = L.yearInfo(y), out = [];
      for (var ld = 1; ld <= 16; ld++) {
        var dt = D.lunar2solar(ld, 1, ty, false); if (!dt) continue;
        var info = D.dayInfo(dt);
        var s = D.scoreDay(info, { purpose: mode === 'mo-hang' ? 'mo-hang' : 'xuat-hanh', birthChi: me.chi });
        out.push({ i: info, s: s });
      }
      out.sort(function (a, b) { return b.s.score - a.s.score; });
      var html = '<h3>' + (mode === 'mo-hang' ? 'Ngày mở hàng đầu năm' : 'Ngày xuất hành đầu năm') + ' Tết ' + ty + ' cho tuổi ' + me.chi + '</h3>' + dayListHTML(out, 6) +
        '<p class="ptv-note">Danh sách xét các ngày từ mùng 1 đến 16 tháng Giêng. Ngày đẹp nhất còn tùy giờ mở hàng và hướng xuất hành, bạn xem thêm giờ hoàng đạo trong từng ngày ở trên.</p>';
      L.resultBox(container, html);
    });
  }
  function huongTet(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Tết năm', L.select('ty', L.yearOptions(2026, 2028, 2027)), 'ptv-field-name') + '</div>', 'Xem hướng xuất hành');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ty = parseInt(container.querySelector('#ty').value, 10), rows = '';
      for (var ld = 1; ld <= 10; ld++) {
        var dt = D.lunar2solar(ld, 1, ty, false); if (!dt) continue;
        var info = D.dayInfo(dt), qn = D.QUY_NHAN[info.day.can] || [];
        rows += '<tr><td><strong>Mùng ' + ld + '</strong></td><td>' + D.fmtSolar(info) + '</td><td>' + info.day.text + '</td><td>' + qn.map(function (c) { return D.CHI_DIR[c]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(', ') + '</td><td>' + D.GIO_HD[info.day.chi].slice(0, 3).join(', ') + '...</td></tr>';
      }
      var html = '<h3>Hướng xuất hành đầu năm Tết ' + ty + '</h3><p>Hướng xuất hành dưới đây lấy theo phương Quý nhân của can ngày, là hướng được cho là đón quý khí khi ra khỏi nhà đầu năm. Cách dùng: sáng ngày xuất hành, bước ra cửa đi về hướng này một đoạn trước, rồi mới đi tiếp tới điểm đến.</p><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Ngày Tết</th><th>Dương lịch</th><th>Ngày can chi</th><th>Hướng Quý nhân</th><th>Giờ hoàng đạo đầu ngày</th></tr>' + rows + '</table></div>';
      L.resultBox(container, html);
    });
  }
  var LIXI = {
    'Kim': { so: '6, 7 và các số thuộc Thổ sinh Kim như 2, 5, 8', amounts: ['66.000', '86.000', '168.000', '268.000', '666.000'], note: 'Người mệnh Kim hợp các khoản lì xì có chữ số 6, 7 chủ đạo, điểm thêm số 8 của hành Thổ để được sinh trợ.' },
    'Mộc': { so: '3, 4 và các số thuộc Thủy sinh Mộc như 0, 1', amounts: ['13.000', '31.000', '103.000', '301.000', '431.000'], note: 'Người mệnh Mộc hợp số 3, 4 của hành Mộc và số 0, 1 của hành Thủy sinh trợ, tượng trưng cho cây được tưới tắm mà lớn.' },
    'Thủy': { so: '0, 1 và các số thuộc Kim sinh Thủy như 6, 7', amounts: ['16.000', '61.000', '106.000', '601.000', '710.000'], note: 'Người mệnh Thủy hợp số 0, 1 của hành Thủy và số 6, 7 của hành Kim sinh trợ, tượng trưng cho nguồn nước được bồi đắp.' },
    'Hỏa': { so: '9 và các số thuộc Mộc sinh Hỏa như 3, 4', amounts: ['39.000', '93.000', '349.000', '439.000', '939.000'], note: 'Người mệnh Hỏa hợp số 9 của hành Hỏa và số 3, 4 của hành Mộc sinh trợ, tượng trưng cho lửa được thêm củi mà rực.' },
    'Thổ': { so: '2, 5, 8 và số 9 thuộc Hỏa sinh Thổ', amounts: ['29.000', '58.000', '258.000', '852.000', '958.000'], note: 'Người mệnh Thổ hợp số 2, 5, 8 của hành Thổ và số 9 của hành Hỏa sinh trợ, tượng trưng cho đất được bồi đắp vững bền.' }
  };
  function liXi(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh của người lì xì (hoặc của bạn)', L.select('y', L.yearOptions(1940, 2015, 1990)), 'ptv-field-name') + '</div>', 'Xem mức lì xì hợp mệnh');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), yi = L.yearInfo(y), g = LIXI[yi.el];
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div><h3>Lì xì hợp mệnh ' + yi.el + '</h3><p>' + g.note + '</p><p><strong>Con số may mắn theo mệnh:</strong> ' + g.so + '.</p><p><strong>Gợi ý mức lì xì tham khảo:</strong> ' + g.amounts.map(function (a) { return a + ' đồng'; }).join(', ') + '.</p><p class="ptv-note">Lì xì đầu năm cốt ở tấm lòng và lời chúc, số tiền lớn hay nhỏ không quyết định may mắn. Hãy chọn mức phù hợp với quan hệ và khả năng của bạn.</p>';
      L.resultBox(container, html);
    });
  }
  var W2 = {
    'xem-ngay-mua-xe': function (c) { dayPicker(c, 'mua-xe', 'mua xe'); },
    'xem-ngay-mua-nha': function (c) { dayPicker(c, 'mua-nha', 'mua nhà'); },
    'xem-ngay-dong-tho': function (c) { dayPicker(c, 'dong-tho', 'động thổ', 'dong-tho'); },
    'xem-ngay-nhap-trach': function (c) { dayPicker(c, 'nhap-trach', 'nhập trạch'); },
    'xem-ngay-mo-hang': function (c) { dayPicker(c, 'mo-hang', 'mở hàng, khai trương'); },
    'xem-ngay-cuoi-hoi': function (c) { dayPicker(c, 'cuoi-hoi', 'cưới hỏi', 'cuoi'); },
    'xem-ngay-xuat-hanh': xuatHanhNgay, 'xem-gio-xuat-hanh': gioXuatHanh, 'xem-nam-sinh-con': namSinhCon,
    'doi-ngay-am-lich': doiNgay, 'cung-sao-giai-han': cungSao, 'chon-tuoi-xong-dat': xongDat,
    'ngay-mo-hang-dau-nam': function (c) { tetDays(c, 'mo-hang'); }, 'ngay-xuat-hanh-dau-nam': function (c) { tetDays(c, 'xuat-hanh'); },
    'huong-xuat-hanh-dau-nam': huongTet, 'li-xi-theo-menh': liXi
  };
  window.PTVTools = Object.assign({}, window.PTVTools || {}, W2);
})();
