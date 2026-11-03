/* PhongThuy VietAA - nang cap rieng Xem Ngay Mua Xe (v2): quet thang chi tiet, kiem tra 1 ngay, top 3 thang */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  function monthOptions() {
    var now = new Date(), h = '';
    for (var i = 0; i < 12; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      h += '<option value="' + d.getFullYear() + '-' + (d.getMonth() + 1) + '"' + (i === 0 ? ' selected' : '') + '>Tháng ' + (d.getMonth() + 1) + '/' + d.getFullYear() + '</option>';
    }
    return h;
  }
  function gioHD(info) {
    return D.GIO_HD[info.day.chi].map(function (g) { return g + ' (' + E.HOUR_LABEL[g] + ')'; }).join(', ');
  }
  function scoreColor(s) { return s >= 7 ? '#2e7d32' : s >= 5.5 ? '#b8860b' : '#c62828'; }
  function dayBlock(x) {
    return '<div class="ptv-block"><div class="ptv-block-head"><span>' + D.fmtSolar(x.i) + ' (' + D.fmtLunar(x.i) + '), ngày ' + x.i.day.text + '</span><span class="ptv-block-score" style="color:' + scoreColor(x.s.score) + '">' + x.s.score + ' điểm</span></div><p>' + x.s.notes.join('. ') + '.</p><p><strong>Giờ hoàng đạo để nhận xe:</strong> ' + gioHD(x.i) + '.</p></div>';
  }
  function scanMonth(y, m, opts) {
    return D.monthDays(y, m).map(function (i) { return { i: i, s: D.scoreDay(i, opts) }; });
  }

  function muaXeV2(c) {
    var now = new Date();
    var today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    c.innerHTML =
      '<div class="ptv-xtabs">' +
      '<button type="button" class="ptv-xtab ptv-on" data-t="month">Quét ngày tốt theo tháng</button>' +
      '<button type="button" class="ptv-xtab" data-t="one">Kiểm tra một ngày cụ thể</button>' +
      '<button type="button" class="ptv-xtab" data-t="quarter">Top ngày tốt 3 tháng tới</button></div>' +
      '<div id="mx-month">' + formWrap('<div class="ptv-row">' +
        L.field('Năm sinh của người đứng tên xe', L.select('y', L.yearOptions(1940, 2010, 1990))) +
        L.field('Việc chính trong ngày', '<select id="job"><option value="nhan">Nhận xe</option><option value="ky">Ký hợp đồng, đặt cọc</option></select>') +
        L.field('Tháng muốn mua xe', L.select('m', monthOptions())) + '</div>', 'Xem ngày tốt mua xe') + '</div>' +
      '<div id="mx-one" hidden>' + formWrap('<div class="ptv-row">' +
        L.field('Năm sinh của người đứng tên xe', L.select('y1', L.yearOptions(1940, 2010, 1990))) +
        L.field('Ngày muốn kiểm tra (năm-tháng-ngày)', '<input type="text" id="dt" value="' + today + '">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="mx-quarter" hidden>' + formWrap('<div class="ptv-row">' +
        L.field('Năm sinh của người đứng tên xe', L.select('y2', L.yearOptions(1940, 2010, 1990))) +
        L.field('Việc chính trong ngày', '<select id="job2"><option value="nhan">Nhận xe</option><option value="ky">Ký hợp đồng, đặt cọc</option></select>') + '</div>', 'Tìm ngày tốt nhất 3 tháng tới') + '</div>' +
      '<div id="mx-up"></div>';
    (function () {
      var up = [], base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      for (var k = 0; k < 30; k++) {
        var dd = new Date(base.getFullYear(), base.getMonth(), base.getDate() + k);
        var inf = D.dayInfo(dd), sc = D.scoreDay(inf, { purpose: 'mua-xe' });
        if (sc.score >= 6.5) up.push({ i: inf, s: sc });
      }
      up.sort(function (a, b) { return b.s.score - a.s.score || a.i.jd - b.i.jd; });
      if (up.length) {
        c.querySelector('#mx-up').innerHTML = '<h3>Ngày đẹp mua xe sắp tới (30 ngày tới, chưa xét tuổi của bạn)</h3>' +
          up.slice(0, 5).map(function (x) {
            var tu = D.tu28Of(x.i);
            return '<div class="ptv-dayline"><span class="ptv-dayline-date">' + D.fmtSolar(x.i) + '</span> <span class="ptv-dayline-lunar">' + D.fmtLunar(x.i) + ', ngày ' + x.i.day.text + ', sao ' + tu.name + (tu.good > 0 ? ' (tốt)' : tu.good < 0 ? ' (xấu)' : '') + '</span> <span class="ptv-dayline-score">' + String(x.s.score).replace('.', ',') + ' điểm</span><span class="ptv-dayline-why">' + x.s.notes.join('. ') + '.</span></div>';
          }).join('') +
          '<p class="ptv-note">Muốn xét thêm hợp xung với tuổi của người đứng tên xe, bạn nhập năm sinh ở các tab phía trên.</p>';
      }
    })();

    var tabs = c.querySelectorAll('.ptv-xtab');
    function show(t) {
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('ptv-on', tabs[i].getAttribute('data-t') === t);
      ['month', 'one', 'quarter'].forEach(function (k) { c.querySelector('#mx-' + k).hidden = k !== t; });
    }
    for (var i = 0; i < tabs.length; i++) tabs[i].addEventListener('click', function () { show(this.getAttribute('data-t')); });

    function jobNote(job) {
      return job === 'ky'
        ? '<p class="ptv-note">Bạn đang xem theo việc ký hợp đồng và đặt cọc: đây là thời điểm giao dịch tiền và giấy tờ, nên ưu tiên ngày có trực tốt cho giao dịch và tránh ngày hắc đạo. Ngày nhận xe thực tế nên xem thêm một lần riêng nếu cách xa ngày ký.</p>'
        : '<p class="ptv-note">Bạn đang xem theo việc nhận xe: đây là thời điểm xe chính thức về tay và bắt đầu lăn bánh, nên chọn thêm giờ hoàng đạo trong ngày để xuất phát chuyến đầu tiên.</p>';
    }

    // --- Quet thang ---
    var fMonth = c.querySelector('#mx-month form');
    fMonth.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(c.querySelector('#y').value, 10);
      var job = c.querySelector('#job').value;
      var parts = c.querySelector('#m').value.split('-');
      var me = L.yearInfo(y);
      var opts = { purpose: 'mua-xe', birthChi: me.chi };
      var scored = scanMonth(parseInt(parts[0], 10), parseInt(parts[1], 10), opts);
      var good = scored.filter(function (x) { return x.s.score >= 7; }).sort(function (a, b) { return b.s.score - a.s.score; });
      var ok = scored.filter(function (x) { return x.s.score >= 5.5 && x.s.score < 7; }).sort(function (a, b) { return b.s.score - a.s.score; });
      var bad = scored.filter(function (x) { return x.s.score <= 3; });
      var html = '<h3>Ngày tốt mua xe tháng ' + parts[1] + '/' + parts[0] + ' cho tuổi ' + me.chi + ' (' + esc(me.text) + ')</h3>' + jobNote(job);
      html += '<h4>Ngày rất tốt (từ 7 điểm)</h4>' + (good.length ? good.slice(0, 8).map(dayBlock).join('') : '<p>Tháng này không có ngày nào đạt 7 điểm cho tuổi của bạn.</p>');
      if (ok.length) html += '<h4>Ngày khá, dùng được (5,5 đến dưới 7 điểm)</h4>' + ok.slice(0, 4).map(dayBlock).join('');
      if (bad.length) html += '<p class="ptv-note"><strong>Ngày nên tránh trong tháng:</strong> ' + bad.map(function (x) { return D.fmtSolar(x.i) + ' (' + x.s.notes[x.s.notes.length - 1] + ')'; }).join('; ') + '.</p>';
      html += '<p class="ptv-note">Điểm ngày dựa trên hoàng đạo hắc đạo, trực của ngày, quan hệ giữa chi ngày và tuổi của bạn, trừ điểm các ngày Nguyệt kỵ và Tam nương. Nếu ngày tốt nhất của tháng không khớp lịch hẹn với hãng xe, một ngày ở nhóm khá vẫn hoàn toàn dùng được.</p>';
      L.resultBox(c.querySelector('#mx-month'), html);
    });

    // --- Kiem tra 1 ngay ---
    var fOne = c.querySelector('#mx-one form');
    fOne.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(c.querySelector('#y1').value, 10);
      var p = c.querySelector('#dt').value.split('-').map(Number);
      if (p.length !== 3 || !p[0] || !p[1] || !p[2]) { L.resultBox(c.querySelector('#mx-one'), '<p class="ptv-note">Bạn nhập ngày theo dạng năm-tháng-ngày, ví dụ 2026-11-20.</p>'); return; }
      var info = D.dayInfo(new Date(p[0], p[1] - 1, p[2]));
      var me = L.yearInfo(y);
      var s = D.scoreDay(info, { purpose: 'mua-xe', birthChi: me.chi });
      var verdict = s.score >= 7 ? 'Ngày rất tốt để mua xe và nhận xe cho tuổi của bạn.' : s.score >= 5.5 ? 'Ngày khá, dùng được. Nếu đã hẹn với hãng xe vào ngày này, bạn cứ tiến hành và chọn giờ hoàng đạo bên dưới để nhận xe.' : s.score >= 4 ? 'Ngày ở mức trung bình thấp, có điểm trừ đáng kể. Nếu không gấp, nên cân nhắc một ngày khác trong tháng.' : 'Ngày xấu cho việc mua xe với tuổi của bạn, nên tránh nếu còn lựa chọn khác.';
      var html = '<h3>Ngày ' + D.fmtSolar(info) + ' (' + D.fmtLunar(info) + '), ngày ' + info.day.text + '</h3>' +
        '<p>Đánh giá cho tuổi ' + me.chi + ': <strong style="color:' + scoreColor(s.score) + '">' + s.score + '/10 điểm</strong>. ' + verdict + '</p>' +
        '<p>' + s.notes.join('. ') + '.</p>' +
        '<p><strong>Giờ hoàng đạo trong ngày để nhận xe:</strong> ' + gioHD(info) + '.</p>' +
        '<p class="ptv-note">Mẹo thực tế: hẹn hãng xe giao xe vào một giờ hoàng đạo ở trên, mang theo giấy tờ tùy thân và kiểm tra kỹ xe trước khi ký biên bản bàn giao, phần thủ tục này quan trọng không kém ngày giờ.</p>';
      L.resultBox(c.querySelector('#mx-one'), html);
    });

    // --- Top 3 thang ---
    var fQ = c.querySelector('#mx-quarter form');
    fQ.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(c.querySelector('#y2').value, 10);
      var job = c.querySelector('#job2').value;
      var me = L.yearInfo(y);
      var opts = { purpose: 'mua-xe', birthChi: me.chi };
      var allScored = [];
      for (var k = 0; k < 3; k++) {
        var d = new Date(now.getFullYear(), now.getMonth() + k, 1);
        allScored = allScored.concat(scanMonth(d.getFullYear(), d.getMonth() + 1, opts));
      }
      var top = allScored.filter(function (x) { return x.s.score >= 6.5; }).sort(function (a, b) { return b.s.score - a.s.score; }).slice(0, 8);
      var html = '<h3>Ngày mua xe tốt nhất trong 3 tháng tới cho tuổi ' + me.chi + '</h3>' + jobNote(job);
      html += top.length ? top.map(dayBlock).join('') : '<p>Trong 3 tháng tới không có ngày nào đạt 6,5 điểm cho tuổi của bạn, trường hợp này khá hiếm, bạn thử quét từng tháng để xem nhóm ngày khá.</p>';
      L.resultBox(c.querySelector('#mx-quarter'), html);
    });
  }

  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-ngay-mua-xe': muaXeV2 });
})();

/* --- Nang cap rieng Ten Nguoi Yeu Tuong Lai (v2): ho so day du + xem doi ban --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc;
  var HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Vũ', 'Phan', 'Trương', 'Đặng', 'Ngô', 'Dương', 'Đỗ', 'Lý', 'Bùi'];
  var NAM = ['Minh Quân', 'Hoàng Nam', 'Tuấn Anh', 'Đức Anh', 'Quốc Bảo', 'Thanh Tùng', 'Văn Đức', 'Hữu Phước', 'Trọng Nghĩa', 'Khánh Duy', 'Minh Khang', 'Gia Huy', 'Thành Đạt', 'Xuân Bách', 'Hải Đăng', 'Quang Vinh', 'Minh Trí', 'Anh Tuấn', 'Đình Phong', 'Bảo Long', 'Trí Dũng', 'Minh Hiếu', 'Quốc Anh', 'Văn Thắng'];
  var NU = ['Phương Anh', 'Thu Hằng', 'Ngọc Trâm', 'Mỹ Linh', 'Thanh Thảo', 'Hương Giang', 'Khánh Linh', 'Tuyết Mai', 'Ngọc Anh', 'Thu Trang', 'Minh Châu', 'Bảo Ngọc', 'Phương Chi', 'Thu Hà', 'Lan Anh', 'Diễm Quỳnh', 'Hồng Nhung', 'Thanh Huyền', 'Ngọc Mai', 'Thùy Dương', 'Kim Ngân', 'Hoài Thương', 'Mỹ Tâm', 'Trà My'];
  var JOBS = ['kỹ sư công nghệ', 'bác sĩ', 'giáo viên', 'chủ một cửa hàng nhỏ', 'nhân viên ngân hàng', 'kiến trúc sư', 'làm truyền thông', 'kinh doanh online', 'đầu bếp', 'nhân viên văn phòng', 'làm nghệ thuật tự do', 'làm việc trong ngành du lịch'];
  var PLACES = ['qua bạn bè giới thiệu', 'tại nơi làm việc hoặc một dự án chung', 'trong một chuyến đi xa', 'qua một lớp học hoặc khóa đào tạo', 'tại quán cà phê quen', 'qua một sự kiện của bạn bè chung', 'trên mạng xã hội', 'tại một buổi tiệc của người quen'];
  var TRAITS = ['dịu dàng và biết lắng nghe', 'mạnh mẽ, quyết đoán nhưng rất ấm áp', 'hài hước, đi đến đâu là có tiếng cười đến đó', 'trầm tính, ít nói nhưng cực kỳ tinh tế', 'năng động, thích khám phá và rủ bạn đi cùng', 'chín chắn, biết lo xa và rất đáng tin', 'mơ mộng, yêu nghệ thuật và những điều nhỏ xinh', 'thực tế, gọn gàng và biết chăm sóc người khác'];
  var SIGNS = ['có nụ cười rất dễ nhớ', 'thường đeo một món phụ kiện nhỏ đặc trưng', 'có giọng nói ấm và nói chuyện rất cuốn', 'hay cười bằng mắt trước khi cười thành tiếng', 'có một nốt ruồi nhỏ dễ thương trên gương mặt', 'đi đứng nhanh nhẹn, lúc nào cũng như đang có việc vui'];
  var WHEN = ['trong khoảng một năm tới, vào một dịp bạn không ngờ nhất', 'khi bạn bắt đầu một công việc hoặc dự án mới', 'vào mùa lễ hội cuối năm, giữa không khí đông vui', 'trong một chuyến đi mà ban đầu bạn còn lưỡng lự có đi hay không', 'khi bạn quay lại một nơi cũ với một tâm trạng mới', 'vào đúng giai đoạn bạn đang tập trung cho bản thân nhất'];
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  function dateRow(p) {
    return '<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="' + p + 'bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="' + p + 'bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="' + p + 'by" inputmode="numeric" value="1995">') + '</div>';
  }
  function bar(label, pct, text) {
    return '<div class="ptv-bar-row"><span class="ptv-bar-label" style="min-width:118px">' + label + '</span><span class="ptv-bar-track"><span class="ptv-bar-fill" style="width:' + pct + '%;background:#d4697c"></span></span><span class="ptv-bar-num">' + pct + '%</span></div><p class="ptv-note">' + text + '</p>';
  }

  function tenYeuV2(c) {
    c.innerHTML =
      '<div class="ptv-xtabs"><button type="button" class="ptv-xtab ptv-on" data-t="solo">Gieo tên người yêu tương lai</button>' +
      '<button type="button" class="ptv-xtab" data-t="duo">Xem đôi bạn, bạn và người ấy</button></div>' +
      '<div id="ty-solo">' + formWrap(dateRow('') + '<div class="ptv-row">' + L.field('Giới tính của bạn', L.genderSelect('g')) + L.field('Họ tên của bạn (không bắt buộc)', '<input type="text" id="nm" value="">') + '</div>', 'Gieo quẻ tên người yêu') + '</div>' +
      '<div id="ty-duo" hidden>' + formWrap(
        '<h4>Thông tin của bạn</h4>' + dateRow('a') +
        '<h4>Thông tin của người ấy</h4>' + dateRow('b') +
        '<div class="ptv-row">' + L.field('Tên của người ấy (không bắt buộc)', '<input type="text" id="nm2" value="">') + '</div>', 'Xem độ hợp của đôi bạn') + '</div>';

    var tabs = c.querySelectorAll('.ptv-xtab');
    function show(t) {
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('ptv-on', tabs[i].getAttribute('data-t') === t);
      c.querySelector('#ty-solo').hidden = t !== 'solo';
      c.querySelector('#ty-duo').hidden = t !== 'duo';
    }
    for (var i = 0; i < tabs.length; i++) tabs[i].addEventListener('click', function () { show(this.getAttribute('data-t')); });

    c.querySelector('#ty-solo form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var g = c.querySelector('#g').value;
      var seed = c.querySelector('#bd').value + '/' + c.querySelector('#bm').value + '/' + c.querySelector('#by').value;
      var h = L.hashStr('yeu|' + seed + '|' + (c.querySelector('#nm').value || '').toLowerCase());
      var pool = g === 'Nam' ? NU : NAM;
      var full = HO[h % HO.length] + ' ' + pool[(h >> 2) % pool.length];
      var job = JOBS[(h >> 3) % JOBS.length], place = PLACES[(h >> 5) % PLACES.length];
      var ageDiff = (h % 7) - 3, trait = TRAITS[(h >> 4) % TRAITS.length], sign = SIGNS[(h >> 6) % SIGNS.length], when = WHEN[(h >> 7) % WHEN.length];
      var score = 55 + (h % 45);
      var html = '<div class="ptv-kieu-verse"><p>💌 ' + esc(full) + '</p></div>' +
        '<p>Theo quẻ gieo từ ngày sinh của bạn, người thương tương lai có khả năng tên là <strong>' + esc(full) + '</strong>, ' + (ageDiff === 0 ? 'trạc tuổi bạn' : ageDiff > 0 ? 'hơn bạn khoảng ' + ageDiff + ' tuổi' : 'kém bạn khoảng ' + (-ageDiff) + ' tuổi') + ', làm ' + job + '.</p>' +
        '<p><strong>Tính cách nổi bật:</strong> ' + trait + '. <strong>Dấu hiệu nhận ra:</strong> người ấy ' + sign + '.</p>' +
        '<p><strong>Hai bạn nhiều khả năng gặp nhau</strong> ' + place + ', <strong>thời điểm dễ gặp nhất</strong> là ' + when + '.</p>' +
        bar('Điểm duyên theo quẻ', score, 'Con số này chỉ là gia vị cho vui, duyên thật đến từ sự mở lòng và chủ động của chính bạn.') +
        '<div class="ptv-kieu-actions"><button type="button" class="ptv-xbtn" id="ty-copy">Sao chép kết quả để khoe bạn bè</button><span id="ty-copy-msg" class="ptv-note"></span></div>' +
        '<p class="ptv-note">Đây là công cụ gieo quẻ giải trí được nhiều bạn trẻ yêu thích trên Phong Thủy VietAA. Cùng một ngày sinh và họ tên thì quẻ luôn cho cùng một kết quả, bạn gieo lại bao nhiêu lần cũng vậy.</p>';
      L.resultBox(c.querySelector('#ty-solo'), html);
      c.querySelector('#ty-copy').addEventListener('click', function () {
        var txt = 'Quẻ bảo người yêu tương lai của mình tên là ' + full + ', làm ' + job + ', hai đứa sẽ gặp nhau ' + place + '. Gieo thử tại https://phongthuy.vietaa.com/ten-nguoi-yeu-tuong-lai/';
        var msg = c.querySelector('#ty-copy-msg');
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { msg.textContent = ' Đã chép, dán vào tin nhắn để khoe nhé.'; }, function () { msg.textContent = ' Trình duyệt chặn sao chép.'; });
      });
    });

    c.querySelector('#ty-duo form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      function read(p) { return { d: parseInt(c.querySelector('#' + p + 'bd').value, 10) || 1, m: parseInt(c.querySelector('#' + p + 'bm').value, 10) || 1, y: parseInt(c.querySelector('#' + p + 'by').value, 10) || 1995 }; }
      var A = read('a'), B = read('b');
      var ia = L.yearInfo(A.y), ib = L.yearInfo(B.y);
      var relChi = L.chiRelation(ia.chi, ib.chi);
      var chiPct = relChi.score >= 2 ? 92 : relChi.score === 1 ? 78 : relChi.score === 0 ? 62 : relChi.score === -1 ? 45 : 30;
      var GEN = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' }, CON = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };
      var ea = ia.el, eb = ib.el;
      var menhPct = ea === eb ? 75 : GEN[ea] === eb || GEN[eb] === ea ? 90 : CON[ea] === eb || CON[eb] === ea ? 40 : 60;
      var menhText = ea === eb ? 'Hai bạn cùng hành ' + ea + ', dễ đồng điệu nhưng cũng dễ cứng đầu giống nhau.' : (GEN[ea] === eb || GEN[eb] === ea) ? 'Mệnh của hai bạn tương sinh (' + ea + ' và ' + eb + '), một người nâng đỡ người kia rất tự nhiên.' : 'Mệnh của hai bạn tương khắc (' + ea + ' và ' + eb + '), cần nhường nhịn và tôn trọng khác biệt của nhau hơn.';
      var numPct = 50 + (L.hashStr('duo|' + A.y + B.y + A.d * B.d + A.m * B.m) % 50);
      var total = Math.round((chiPct + menhPct + numPct) / 3);
      var verdict = total >= 80 ? 'Trời sinh một đôi, phần còn lại là hai bạn có chịu nắm tay nhau đi tiếp hay không.' : total >= 65 ? 'Khá hợp nhau, có mâu thuẫn nhỏ nhưng đều là chuyện giải quyết được bằng trò chuyện.' : total >= 50 ? 'Hợp ở mức vừa phải, hai bạn cần thời gian và sự kiên nhẫn để hiểu nhau hơn.' : 'Khá trái dấu, nhưng trái dấu mà biết nhường nhau thì lại bền, đừng vội nản.';
      var html = '<h3>Độ hợp của đôi bạn: <strong style="color:#d4697c">' + total + '%</strong></h3>' +
        '<p>Bạn tuổi <strong>' + ia.chi + '</strong> (mệnh ' + esc(ia.napAm) + '), người ấy tuổi <strong>' + ib.chi + '</strong> (mệnh ' + esc(ib.napAm) + ').</p>' +
        bar('Hợp tuổi (địa chi)', chiPct, 'Quan hệ giữa hai tuổi: ' + esc(relChi.label) + '.') +
        bar('Hợp mệnh (ngũ hành)', menhPct, menhText) +
        bar('Hợp ngày sinh (con số)', numPct, 'Góc nhìn giải trí từ tổng các con số ngày tháng năm sinh của hai bạn, giống cách nhiều bạn trẻ bói tình yêu bằng con số.') +
        '<p><strong>Kết luận vui:</strong> ' + verdict + '</p>' +
        '<p class="ptv-note">Kết quả mang tính giải trí và tham khảo theo quan niệm truyền thống. Tình cảm thật được xây bằng thời gian, sự tử tế và cách hai bạn đối xử với nhau mỗi ngày, không nằm ở bất kỳ con số nào.</p>';
      L.resultBox(c.querySelector('#ty-duo'), html);
    });
  }

  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'ten-nguoi-yeu-tuong-lai': tenYeuV2 });
})();
