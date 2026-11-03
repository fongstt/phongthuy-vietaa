/* Wave 7: nang cap tung tool con lai (ban tho, bep nau, ...) */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var GOOD_W = { 'Sinh Khí': 4, 'Thiên Y': 3, 'Diên Niên': 2, 'Phục Vị': 1 };
  var BAD_W = { 'Tuyệt Mệnh': 4, 'Ngũ Quỷ': 3, 'Lục Sát': 2, 'Họa Hại': 1 };
  function yg(p, defY) {
    return '<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select(p + 'y', L.yearOptions(1940, 2010, defY || 1990))) + L.field('Giới tính', L.genderSelect(p + 'g')) + '</div>';
  }
  function goodsSorted(cung, order) {
    var g = L.goodDirs(cung, order || ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']);
    return g.sort(function (a, b) { return GOOD_W[b.star] - GOOD_W[a.star]; });
  }
  function badsSorted(cung) {
    var b = L.starsFor(cung).filter(function (s) { return s.info.t === 'xấu'; });
    return b.sort(function (a, b) { return BAD_W[b.star] - BAD_W[a.star]; });
  }
  function dirSelect(id, label) {
    return L.field(label, L.select(id, L.DIRS.map(function (d) { return '<option>' + d + '</option>'; }).join('')));
  }

  /* --- Xem huong ban tho v2 --- */
  function banThoV2(c) {
    c.innerHTML = V.tabsHTML([['bt-dir', 'Hướng bàn thờ theo tuổi gia chủ'], ['bt-check', 'Kiểm tra hướng bàn thờ hiện tại']]) +
      '<div id="bt-dir">' + V.formWrap2(yg('a'), 'Xem hướng bàn thờ') + '</div>' +
      '<div id="bt-check" hidden>' + V.formWrap2(yg('a') + '<div class="ptv-row">' + dirSelect('dir', 'Hướng mặt bàn thờ đang quay về (từ trong nhìn ra)') + '</div>', 'Kiểm tra hướng này') + '</div>';
    V.wireTabs(c, ['bt-dir', 'bt-check']);
    c.querySelector('#bt-dir form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#bt-dir'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value;
      var cp = L.cungPhi(y, g), goods = goodsSorted(cp.cung);
      var html = '<h3>Hướng đặt bàn thờ cho gia chủ sinh năm ' + y + ', mệnh ' + cp.cung + ' (' + cp.group + ')</h3>' +
        '<p>Bàn thờ nên quay mặt về hướng <strong>' + goods[0].dir + ' (sao ' + goods[0].star + ')</strong>. Sao Sinh Khí được ưu tiên số một cho bàn thờ vì chủ về phúc đức, tài lộc và con cháu hưng thịnh; lưng bàn thờ khi đó tựa về phía đối diện, thỏa nguyên tắc tọa cát hướng cát khi hướng mặt đã là hướng tốt.</p>' +
        '<p><strong>Thứ tự các hướng tốt còn lại:</strong> ' + goods.slice(1).map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '.</p>' +
        '<h3>Quy tắc đặt bàn thờ quan trọng không kém hướng</h3><ul>' +
        '<li>Lưng bàn thờ tựa vào tường vững chắc, không tựa vào cửa sổ, tường nhà vệ sinh hoặc tường bếp.</li>' +
        '<li>Bàn thờ không đối diện thẳng cửa chính, cửa nhà vệ sinh, cửa phòng ngủ và không đặt dưới xà ngang, gầm cầu thang.</li>' +
        '<li>Độ cao bàn thờ nên từ ngực người trở lên, khi thắp hương không phải với quá cao cũng không cúi quá thấp.</li>' +
        '<li>Không đặt bàn thờ chung tường với bếp nấu ở phía sau trong thế lửa sát lưng bàn thờ.</li>' +
        '<li>Phía trước bàn thờ cần thoáng và sáng, tránh để đồ đạc chắn lối thắp hương.</li></ul>' +
        L.dirTable(cp.cung) +
        '<p class="ptv-note">Nếu nhà chung cư hoặc nhà thuê không xoay được bàn thờ về hướng tốt nhất, hãy chọn một trong các hướng tốt còn lại, giữ lưng bàn thờ tựa tường và tránh các vị trí kiêng phía trên, như vậy đã đạt phần lớn yêu cầu thực tế.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#bt-check form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#bt-check'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value, dir = box.querySelector('#dir').value;
      var cp = L.cungPhi(y, g), s = L.starsFor(cp.cung)[L.DIRS.indexOf(dir)], good = s.info.t === 'tốt';
      var html = '<h3>Bàn thờ hướng ' + dir + ' với gia chủ mệnh ' + cp.cung + ': sao ' + s.star + '</h3>' +
        '<p class="' + (good ? 'ptv-good' : 'ptv-bad') + '">' + (good ? 'Đây là hướng tốt cho bàn thờ của gia chủ.' : 'Đây là hướng xấu cho bàn thờ của gia chủ, nên cân nhắc xoay lại nếu điều kiện cho phép.') + '</p><p>' + esc(s.info.d || '') + '</p>' +
        (good ? '<p>Bạn giữ nguyên hướng này, chỉ cần kiểm tra thêm các quy tắc vị trí ở tab bên cạnh: lưng tựa tường, không đối diện cửa vệ sinh, không dưới xà ngang.</p>' : '<p>Các hướng tốt để xoay về: ' + goodsSorted(cp.cung).map(function (x) { return x.dir + ' (' + x.star + ')'; }).join(', ') + '. Nếu không xoay được vì kết cấu nhà, ưu tiên xử lý vị trí trước: dời bàn thờ khỏi thế đối diện nhà vệ sinh hoặc dưới xà ngang còn quan trọng hơn cố xoay hướng.</p>') +
        L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
  }

  /* --- Xem huong bep nau v2 --- */
  function bepV2(c) {
    c.innerHTML = V.tabsHTML([['bp-dir', 'Hướng bếp theo tuổi gia chủ'], ['bp-check', 'Kiểm tra bếp hiện tại']]) +
      '<div id="bp-dir">' + V.formWrap2(yg('a'), 'Xem hướng đặt bếp') + '</div>' +
      '<div id="bp-check" hidden>' + V.formWrap2(yg('a') + '<div class="ptv-row">' + dirSelect('toa', 'Bếp đang đặt tại phía nào của nhà (tọa)') + dirSelect('cua', 'Cửa bếp, hướng người nấu quay mặt tới') + '</div>', 'Kiểm tra bếp này') + '</div>';
    V.wireTabs(c, ['bp-dir', 'bp-check']);
    c.querySelector('#bp-dir form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#bp-dir'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value;
      var cp = L.cungPhi(y, g), goods = goodsSorted(cp.cung), bads = badsSorted(cp.cung);
      var html = '<h3>Hướng bếp cho gia chủ sinh năm ' + y + ', mệnh ' + cp.cung + ' (' + cp.group + '): tọa hung hướng cát</h3>' +
        '<p>Nguyên tắc đặt bếp là <strong>đặt bếp tại hướng xấu để đốt cháy, trấn áp khí xấu</strong>, còn cửa bếp, tức hướng người nấu đứng quay mặt tới khi nấu, <strong>quay về hướng tốt</strong> để đón khí lành vào bữa ăn.</p>' +
        '<p><strong>Vị trí đặt bếp nên chọn, theo thứ tự trấn áp mạnh dần:</strong> ' + bads.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Trong đó đặt tại ' + bads[0].dir + ' (' + bads[0].star + ') là thế tọa hung được coi là mạnh nhất.</p>' +
        '<p><strong>Cửa bếp nên quay về:</strong> ' + goods.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + ', tốt nhất là ' + goods[0].dir + ' (' + goods[0].star + ').</p>' +
        '<h3>Các cặp đặt bếp gợi ý</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Đặt bếp tại (tọa)</th><th>Cửa bếp quay về (hướng)</th><th>Đánh giá</th></tr>' +
        '<tr><td>' + bads[0].dir + ' (' + bads[0].star + ')</td><td>' + goods[0].dir + ' (' + goods[0].star + ')</td><td><strong>Cặp tốt nhất</strong>: tọa hung mạnh nhất, hướng cát mạnh nhất</td></tr>' +
        '<tr><td>' + bads[1].dir + ' (' + bads[1].star + ')</td><td>' + goods[0].dir + ' (' + goods[0].star + ')</td><td>Rất tốt</td></tr>' +
        '<tr><td>' + bads[0].dir + ' (' + bads[0].star + ')</td><td>' + goods[1].dir + ' (' + goods[1].star + ')</td><td>Tốt</td></tr></table></div>' +
        '<h3>Quy tắc bếp quan trọng không kém hướng</h3><ul>' +
        '<li>Bếp nấu và bồn rửa, tủ lạnh thuộc hành Thủy không đặt đối diện hoặc sát nhau trong thế thủy hỏa xung khắc, nên có khoảng đệm ít nhất một gang tay.</li>' +
        '<li>Không đặt bếp đối diện cửa nhà vệ sinh, cửa phòng ngủ, và không đặt bếp dưới phòng ngủ hoặc dưới nhà vệ sinh tầng trên.</li>' +
        '<li>Bếp không đặt giữa nhà (trung cung) và không để góc nhọn của tủ, cột chĩa thẳng vào bếp.</li>' +
        '<li>Lưng bếp nên tựa tường vững, tránh đặt bếp trước cửa sổ lớn vì gió lùa làm lửa chập chờn, vừa mất an toàn vừa phạm lệ hỏa không yên.</li></ul>' +
        L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
    c.querySelector('#bp-check form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#bp-check'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value;
      var toa = box.querySelector('#toa').value, cua = box.querySelector('#cua').value;
      var cp = L.cungPhi(y, g);
      var sToa = L.starsFor(cp.cung)[L.DIRS.indexOf(toa)], sCua = L.starsFor(cp.cung)[L.DIRS.indexOf(cua)];
      var toaOK = sToa.info.t === 'xấu', cuaOK = sCua.info.t === 'tốt';
      var html = '<h3>Kiểm tra bếp cho gia chủ mệnh ' + cp.cung + '</h3>' +
        '<p><strong>Vị trí đặt bếp tại ' + toa + ' (sao ' + sToa.star + '):</strong> ' + (toaOK ? '<span class="ptv-good">Đúng nguyên tắc tọa hung</span>, bếp đặt tại hướng xấu để trấn áp khí xấu.' : '<span class="ptv-bad">Chưa đúng nguyên tắc tọa hung</span>, vì ' + toa + ' là hướng tốt (' + sToa.star + ') với gia chủ, đặt bếp ở hướng tốt được cho là đốt đi khí lành.') + '</p>' +
        '<p><strong>Cửa bếp quay về ' + cua + ' (sao ' + sCua.star + '):</strong> ' + (cuaOK ? '<span class="ptv-good">Đúng nguyên tắc hướng cát</span>, cửa bếp đón khí tốt cho bữa ăn gia đình.' : '<span class="ptv-bad">Chưa đúng nguyên tắc hướng cát</span>, vì ' + cua + ' là hướng xấu (' + sCua.star + ') với gia chủ.') + '</p>' +
        '<p><strong>Kết luận:</strong> ' + (toaOK && cuaOK ? 'Bếp của bạn đạt cả hai nguyên tắc tọa hung hướng cát, giữ nguyên và chỉ cần lưu ý các quy tắc vị trí như tránh thủy hỏa đối đầu.' : 'Bếp chưa đạt trọn vẹn. Các vị trí đặt bếp nên chọn: ' + badsSorted(cp.cung).map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Các hướng cửa bếp nên quay về: ' + goodsSorted(cp.cung).map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Nếu không sửa được cả hai, hãy ưu tiên sửa hướng cửa bếp trước vì đây là phần dễ thay đổi khi cải tạo nhỏ.') + '</p>' +
        L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
  }

  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-huong-ban-tho': banThoV2, 'xem-huong-bep-nau': bepV2 });
})();

  /* --- Xem huong nha tot xau v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var GOOD_W = { 'Sinh Khí': 4, 'Thiên Y': 3, 'Diên Niên': 2, 'Phục Vị': 1 };
  var BAD_W = { 'Tuyệt Mệnh': 4, 'Ngũ Quỷ': 3, 'Lục Sát': 2, 'Họa Hại': 1 };
  function yg(p, defY) {
    return '<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select(p + 'y', L.yearOptions(1940, 2010, defY || 1990))) + L.field('Giới tính', L.genderSelect(p + 'g')) + '</div>';
  }
  function goodsSorted(cung, order) {
    var g = L.goodDirs(cung, order || ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']);
    return g.sort(function (a, b) { return GOOD_W[b.star] - GOOD_W[a.star]; });
  }
  function badsSorted(cung) {
    var b = L.starsFor(cung).filter(function (s) { return s.info.t === 'xấu'; });
    return b.sort(function (a, b) { return BAD_W[b.star] - BAD_W[a.star]; });
  }
  function dirSelect(id, label) {
    return L.field(label, L.select(id, L.DIRS.map(function (d) { return '<option>' + d + '</option>'; }).join('')));
  }

  var HOA_GIAI = {
    'Tuyệt Mệnh': 'Đây là sao xấu nặng nhất. Nếu đã ở ổn định và mọi việc vẫn bình thường thì không cần hoảng sợ dọn nhà; nên hóa giải bằng cách đặt nhà vệ sinh hoặc kho tại phương này để trấn, giữ cửa chính sạch sáng, và nếu có cửa phụ ở hướng tốt thì ưu tiên đi cửa phụ.',
    'Ngũ Quỷ': 'Sao chủ về thị phi và hao tán. Hóa giải theo lệ là đặt bếp nấu tại phương này để lửa trấn áp, đồng thời giữ khu vực cửa chính gọn gàng, tránh để đồ sắc nhọn và gương soi chiếu thẳng ra cửa.',
    'Lục Sát': 'Sao chủ về trục trặc quan hệ và kiện tụng nhỏ. Đặt nhà vệ sinh hoặc khu giặt phơi tại phương này để trấn là cách dân gian hay dùng; trong nhà nên giữ hòa khí, tránh đặt phòng làm việc chính tại đây.',
    'Họa Hại': 'Đây là sao xấu nhẹ nhất trong bốn sao xấu, chủ về hao tài nhỏ và điều tiếng. Phần lớn gia đình chỉ cần giữ cửa chính thông thoáng, sáng sủa và tránh để thùng rác, đồ hỏng ngay trước cửa là đủ yên tâm.'
  };
  var STAR_SCORE = { 'Sinh Khí': 95, 'Thiên Y': 90, 'Diên Niên': 85, 'Phục Vị': 80, 'Họa Hại': 45, 'Lục Sát': 40, 'Ngũ Quỷ': 30, 'Tuyệt Mệnh': 20 };
  function starVerdictHTML(cp, dir) {
    var s = L.starsFor(cp.cung)[L.DIRS.indexOf(dir)], good = s.info.t === 'tốt';
    return '<h3>Hướng ' + dir + ' với mệnh ' + cp.cung + ': sao ' + s.star + ', điểm hài hòa ' + STAR_SCORE[s.star] + '/100</h3>' +
      '<p class="' + (good ? 'ptv-good' : 'ptv-bad') + '">' + (good ? 'Đây là hướng tốt với gia chủ.' : 'Đây là hướng xấu với gia chủ.') + '</p><p>' + esc(s.info.d || '') + '</p>' +
      (good ? '' : '<p><strong>Cách hóa giải tham khảo:</strong> ' + HOA_GIAI[s.star] + '</p>');
  }
  function huongNhaV2(c) {
    c.innerHTML = V.tabsHTML([['hn-check', 'Kiểm tra hướng nhà'], ['hn-list', 'Hướng nhà tốt theo tuổi'], ['hn-cmp', 'So sánh hai hướng nhà']]) +
      '<div id="hn-check">' + V.formWrap2(yg('a') + '<div class="ptv-row">' + dirSelect('dir', 'Hướng nhà (từ trong nhà nhìn ra cửa chính)') + '</div>', 'Kiểm tra hướng nhà') + '</div>' +
      '<div id="hn-list" hidden>' + V.formWrap2(yg('a'), 'Xem hướng nhà tốt') + '</div>' +
      '<div id="hn-cmp" hidden>' + V.formWrap2(yg('a') + '<div class="ptv-row">' + dirSelect('d1', 'Hướng nhà thứ nhất') + dirSelect('d2', 'Hướng nhà thứ hai') + '</div>', 'So sánh hai hướng') + '</div>';
    V.wireTabs(c, ['hn-check', 'hn-list', 'hn-cmp']);
    c.querySelector('#hn-check form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hn-check'), cp = L.cungPhi(parseInt(box.querySelector('#ay').value, 10), box.querySelector('#ag').value);
      L.resultBox(box, starVerdictHTML(cp, box.querySelector('#dir').value) + L.dirTable(cp.cung));
    });
    c.querySelector('#hn-list form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hn-list'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value;
      var cp = L.cungPhi(y, g), goods = goodsSorted(cp.cung), bads = badsSorted(cp.cung);
      var html = '<h3>Hướng nhà nên chọn cho gia chủ sinh năm ' + y + ', mệnh ' + cp.cung + ' (' + cp.group + ')</h3>' +
        '<p>Khi mua nhà hoặc chọn đất làm nhà, hãy ưu tiên các hướng sau theo thứ tự: ' + goods.map(function (s) { return '<strong>' + s.dir + '</strong> (' + s.star + ', ' + STAR_SCORE[s.star] + ' điểm)'; }).join(', ') + '.</p>' +
        '<p><strong>Các hướng nên tránh:</strong> ' + bads.map(function (s) { return s.dir + ' (' + s.star + ')'; }).join(', ') + '. Nếu căn nhà ưng ý về giá và vị trí nhưng hướng rơi vào nhóm xấu nhẹ (Họa Hại, Lục Sát), nhiều gia đình vẫn chọn ở và hóa giải bằng bố trí nội thất thay vì bỏ qua cơ hội tốt.</p>' +
        '<p class="ptv-note">Người thuộc ' + cp.group + ' chỉ hợp bốn hướng thuộc cùng nhóm trạch. Đây là lý do cùng một căn nhà, người này ở thấy hợp, người khác ở lại không hợp: hướng nhà tính theo mệnh của gia chủ, không có hướng nào tốt cho tất cả mọi người.</p>' + L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
    c.querySelector('#hn-cmp form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hn-cmp'), cp = L.cungPhi(parseInt(box.querySelector('#ay').value, 10), box.querySelector('#ag').value);
      var d1 = box.querySelector('#d1').value, d2 = box.querySelector('#d2').value;
      var s1 = L.starsFor(cp.cung)[L.DIRS.indexOf(d1)], s2 = L.starsFor(cp.cung)[L.DIRS.indexOf(d2)];
      var win = STAR_SCORE[s1.star] === STAR_SCORE[s2.star] ? 'Hai hướng ngang nhau về sao, hãy quyết định bằng các yếu tố khác như giá, ánh sáng và tiếng ồn.' : (STAR_SCORE[s1.star] > STAR_SCORE[s2.star] ? 'Hướng ' + d1 + ' hơn hẳn, nên ưu tiên căn nhà hướng ' + d1 + ' nếu các điều kiện khác tương đương.' : 'Hướng ' + d2 + ' hơn hẳn, nên ưu tiên căn nhà hướng ' + d2 + ' nếu các điều kiện khác tương đương.');
      var html = '<h3>So sánh cho gia chủ mệnh ' + cp.cung + '</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Hướng nhà</th><th>Sao</th><th>Điểm hài hòa</th><th>Nhận định</th></tr>' +
        '<tr><td><strong>' + d1 + '</strong></td><td>' + s1.star + '</td><td>' + STAR_SCORE[s1.star] + '/100</td><td>' + (s1.info.t === 'tốt' ? 'Hướng tốt' : 'Hướng xấu') + '</td></tr>' +
        '<tr><td><strong>' + d2 + '</strong></td><td>' + s2.star + '</td><td>' + STAR_SCORE[s2.star] + '/100</td><td>' + (s2.info.t === 'tốt' ? 'Hướng tốt' : 'Hướng xấu') + '</td></tr></table></div>' +
        '<p><strong>Kết luận:</strong> ' + win + '</p>' +
        (!STAR_SCORE[s1.star] || s1.info.t === 'xấu' ? '<p><strong>Về hướng ' + d1 + ':</strong> ' + HOA_GIAI[s1.star] + '</p>' : '') +
        (s2.info.t === 'xấu' ? '<p><strong>Về hướng ' + d2 + ':</strong> ' + HOA_GIAI[s2.star] + '</p>' : '');
      L.resultBox(box, html);
    });
  }

  /* --- Xem phong thuy nha v2 --- */
  var ROOM_TXT = {
    'phong-khach': { name: 'Phòng khách, cửa chính', good: 'Đặt tại hướng tốt là lý tưởng: đây là nơi đón khí vào nhà, khí tốt vào từ hướng tốt thì cả nhà được hưởng.', bad: 'Phòng khách rơi vào hướng xấu của gia chủ: nên giữ khu vực này thật sáng và thoáng, treo đèn sáng ấm, tránh để đồ cũ hỏng chắn lối, và nếu có thể hãy mở thêm cửa phụ ở hướng tốt để cân bằng dòng khí ra vào.' },
    'ban-tho': { name: 'Bàn thờ', good: 'Bàn thờ tại phương này là tốt so với mệnh gia chủ, giữ lưng bàn thờ tựa tường và phía trước thoáng là đạt.', bad: 'Bàn thờ không nên đặt tại phương xấu của gia chủ. Nếu kết cấu nhà không đổi được, hãy chuyển bàn thờ sang phương tốt gần nhất, ưu tiên Sinh Khí hoặc Thiên Y.' },
    'bep': { name: 'Bếp nấu (vị trí đặt bếp)', good: 'Đặt bếp tại hướng tốt là chưa đúng nguyên tắc tọa hung: bếp thuộc hỏa, đặt ở hướng tốt được cho là đốt khí lành. Nếu bếp đã cố định ở đây, hãy bảo đảm cửa bếp quay về hướng tốt để cân bằng.', bad: 'Đặt bếp tại phương xấu là ĐÚNG nguyên tắc tọa hung hướng cát: lửa trấn áp khí xấu tại phương này. Chỉ cần cửa bếp quay về hướng tốt nữa là đạt trọn vẹn.' },
    'giuong': { name: 'Giường ngủ chính (hướng đầu giường)', good: 'Đầu giường quay về hướng tốt của gia chủ là đạt, ưu tiên Thiên Y cho sức khỏe và giấc ngủ.', bad: 'Đầu giường quay về hướng xấu của gia chủ thì nên xoay lại nếu phòng cho phép; nếu không xoay được, ít nhất giữ đầu giường tựa tường và tránh hai sao nặng Tuyệt Mệnh, Ngũ Quỷ.' },
    'wc': { name: 'Nhà vệ sinh, kho', good: 'Nhà vệ sinh đặt tại hướng tốt là uổng khí tốt và không đúng lệ trấn áp; nếu đã xây cố định thì giữ vệ sinh thật sạch, cửa luôn đóng và thông gió tốt để giảm ảnh hưởng.', bad: 'Nhà vệ sinh, kho đặt tại phương xấu là ĐÚNG cách dân gian dùng để trấn áp khí xấu, đây là vị trí nên ưu tiên khi thiết kế nhà mới.' },
    'ban-lam-viec': { name: 'Bàn làm việc, bàn học', good: 'Bàn làm việc tại hướng tốt, nhất là Phục Vị hoặc Sinh Khí, được cho là giúp tập trung và ổn định, rất nên tận dụng.', bad: 'Bàn làm việc tại hướng xấu thì nên dịch sang phương tốt nếu phòng còn chỗ; nếu không, hãy quay mặt bàn về hướng tốt của bạn thay vì nhìn vào tường phía xấu.' }
  };
  function phongThuyNhaV2(c) {
    c.innerHTML = V.tabsHTML([['ptn-plan', 'Bản đồ phong thủy cả nhà'], ['ptn-room', 'Kiểm tra từng phòng']]) +
      '<div id="ptn-plan">' + V.formWrap2(yg('a') + '<div class="ptv-row">' + dirSelect('dir', 'Hướng nhà (từ trong nhà nhìn ra cửa chính)') + '</div>', 'Lập bản đồ phong thủy nhà') + '</div>' +
      '<div id="ptn-room" hidden>' + V.formWrap2(yg('a') + '<div class="ptv-row">' + L.field('Khu vực muốn kiểm tra', L.select('room', Object.keys(ROOM_TXT).map(function (k) { return '<option value="' + k + '">' + ROOM_TXT[k].name + '</option>'; }).join(''))) + dirSelect('pdir', 'Phương của khu vực này so với tâm nhà') + '</div>', 'Kiểm tra khu vực này') + '</div>';
    V.wireTabs(c, ['ptn-plan', 'ptn-room']);
    c.querySelector('#ptn-plan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ptn-plan'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value, dir = box.querySelector('#dir').value;
      var cp = L.cungPhi(y, g), hs = L.starsFor(cp.cung)[L.DIRS.indexOf(dir)];
      var goods = goodsSorted(cp.cung), bads = badsSorted(cp.cung);
      var sleep = L.goodDirs(cp.cung, ['Thiên Y', 'Sinh Khí', 'Diên Niên', 'Phục Vị']).sort(function (a, b) { return ({ 'Thiên Y': 4, 'Sinh Khí': 3, 'Diên Niên': 2, 'Phục Vị': 1 })[b.star] - ({ 'Thiên Y': 4, 'Sinh Khí': 3, 'Diên Niên': 2, 'Phục Vị': 1 })[a.star]; })[0];
      var html = '<h3>Bản đồ phong thủy cho gia chủ sinh năm ' + y + ', mệnh ' + cp.cung + ' (' + cp.group + '), nhà hướng ' + dir + '</h3>' +
        '<p>Hướng nhà ' + dir + ' ứng với sao <strong>' + hs.star + '</strong>, điểm hài hòa <strong>' + STAR_SCORE[hs.star] + '/100</strong> ' + (hs.info.t === 'tốt' ? '(hướng tốt, nền nhà hợp mệnh gia chủ).' : '(hướng xấu, nên bố trí các phòng theo bảng dưới để trấn và hóa giải).') + '</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Khu vực</th><th>Gợi ý bố trí cho mệnh ' + cp.cung + '</th></tr>' +
        '<tr><td>Phòng khách, cửa chính</td><td>Đón khí tốt nhất từ hướng ' + goods.map(function (s) { return s.dir; }).join(', ') + '.</td></tr>' +
        '<tr><td>Bàn thờ</td><td>Quay mặt về ' + goods[0].dir + ' (' + goods[0].star + '), lưng tựa tường vững chắc.</td></tr>' +
        '<tr><td>Bếp nấu</td><td>Đặt bếp tại ' + bads[0].dir + ' (' + bads[0].star + '), cửa bếp quay về ' + goods[0].dir + ' (' + goods[0].star + '), theo nguyên tắc tọa hung hướng cát.</td></tr>' +
        '<tr><td>Giường ngủ chính</td><td>Đầu giường quay về ' + sleep.dir + ' (' + sleep.star + ') để ưu tiên sức khỏe và giấc ngủ.</td></tr>' +
        '<tr><td>Bàn làm việc, bàn học</td><td>Đặt tại phương ' + (goods.filter(function (s) { return s.star === 'Phục Vị'; })[0] || goods[3]).dir + ' (Phục Vị) để ổn định và tập trung.</td></tr>' +
        '<tr><td>Nhà vệ sinh, kho</td><td>Đặt tại các phương xấu ' + bads.map(function (s) { return s.dir; }).join(', ') + ' để trấn áp khí xấu.</td></tr></table></div>' +
        '<p class="ptv-note">Bản đồ này theo Bát Trạch dựa trên cung mệnh gia chủ và 8 phương vị quanh tâm nhà. Khi thiết kế nhà mới, hãy dùng tab kiểm tra từng phòng bên cạnh để đối chiếu từng vị trí cụ thể trên bản vẽ trước khi chốt.</p>' + L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
    c.querySelector('#ptn-room form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ptn-room'), y = parseInt(box.querySelector('#ay').value, 10), g = box.querySelector('#ag').value;
      var room = ROOM_TXT[box.querySelector('#room').value], pdir = box.querySelector('#pdir').value;
      var cp = L.cungPhi(y, g), s = L.starsFor(cp.cung)[L.DIRS.indexOf(pdir)], good = s.info.t === 'tốt';
      var isBadGood = (box.querySelector('#room').value === 'bep' || box.querySelector('#room').value === 'wc');
      var html = '<h3>' + room.name + ' tại phương ' + pdir + ' với gia chủ mệnh ' + cp.cung + ': sao ' + s.star + '</h3>' +
        '<p>' + (good ? room.good : room.bad) + '</p>' +
        '<p class="ptv-note">' + (isBadGood ? 'Lưu ý: riêng bếp và nhà vệ sinh, đặt tại phương xấu lại là đúng lệ trấn áp, ngược với các phòng sinh hoạt khác.' : 'Với các phòng sinh hoạt chính, phương tốt của gia chủ là nơi nên đặt.') + '</p>' + L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
  }

  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-huong-nha-tot-xau': huongNhaV2, 'xem-phong-thuy-nha': phongThuyNhaV2 });
})();

/* --- Thuoc Lo Ban v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var LOBAN = [
    { id: 'r522', name: 'Thước 52,2 cm (đo cửa, cổng, thông thủy)', cycle: 52.2, segs: [['Quý Nhân', 1, 'Gặp quý nhân giúp đỡ, công việc hanh thông'], ['Hiểm Họa', 0, 'Dễ gặp trở ngại, hao tốn'], ['Thiên Tai', 0, 'Tránh dùng, chủ về bất trắc'], ['Thiên Tài', 1, 'Tài lộc tìm đến, làm ăn phát đạt'], ['Phúc Lộc', 1, 'Phúc lộc dồi dào, con cháu hưởng phúc'], ['Cô Độc', 0, 'Chủ về đơn lẻ, thiếu hòa khí'], ['Thiên Tặc', 0, 'Dễ mất mát, trộm cắp để ý'], ['Tể Tướng', 1, 'Quyền uy, địa vị vững vàng']] },
    { id: 'r429', name: 'Thước 42,9 cm (đo bàn, ghế, bếp, giường)', cycle: 42.9, segs: [['Tài', 1, 'Tài lộc, tiền bạc thuận lợi'], ['Bệnh', 0, 'Ảnh hưởng sức khỏe, nên tránh'], ['Ly', 0, 'Chia ly, xa cách'], ['Nghĩa', 1, 'Nghĩa tình, quan hệ tốt đẹp'], ['Quan', 1, 'Công danh, thi cử thuận lợi'], ['Nạn', 0, 'Tai nạn, biến cố bất ngờ'], ['Hại', 0, 'Tổn hại, hao tài'], ['Bản', 1, 'Gốc rễ vững, vốn liếng bền']] },
    { id: 'r388', name: 'Thước 38,8 cm (đo bàn thờ, mộ, đồ thờ)', cycle: 38.8, segs: [['Đinh', 1, 'Con trai, thêm người thêm của'], ['Hại', 0, 'Tổn hại, nên tránh'], ['Vượng', 1, 'Thịnh vượng, phát triển'], ['Khổ', 0, 'Vất vả, khó khăn'], ['Nghĩa', 1, 'Nghĩa tình trọn vẹn'], ['Quan', 1, 'Quan lộc, địa vị'], ['Tử', 0, 'Hung, tuyệt đối tránh'], ['Hưng', 1, 'Hưng thịnh, đi lên'], ['Thất', 0, 'Thất thoát, mất mát'], ['Tài', 1, 'Tài lộc dồi dào']] }
  ];
  function measure(r, cm) {
    var segLen = r.cycle / r.segs.length;
    var pos = cm % r.cycle; if (pos === 0) pos = r.cycle;
    var idx = Math.min(r.segs.length - 1, Math.floor((pos - 0.0001) / segLen));
    var start = Math.floor(cm / r.cycle) * r.cycle + idx * segLen;
    if (cm % r.cycle === 0) start = cm - segLen * (r.segs.length - idx) + 0; // truong hop bien cuoi chu ky
    return { seg: r.segs[idx], start: start, end: start + segLen, segLen: segLen };
  }
  function fmt(n) { return String(Math.round(n * 10) / 10).replace('.', ','); }
  function nearestGood(r, cm) {
    var segLen = r.cycle / r.segs.length, base = Math.floor(cm / r.cycle) * r.cycle, out = [];
    for (var k = -1; k <= 1; k++) {
      for (var i = 0; i < r.segs.length; i++) {
        if (!r.segs[i][1]) continue;
        var s = base + k * r.cycle + i * segLen, e = s + segLen;
        if (e > cm - segLen * 2 && s < cm + segLen * 2) out.push({ s: s, e: e, name: r.segs[i][0] });
      }
    }
    out.sort(function (a, b) { return Math.abs((a.s + a.e) / 2 - cm) - Math.abs((b.s + b.e) / 2 - cm); });
    return out.slice(0, 2);
  }
  var CATS = [
    { id: 'cua-di', name: 'Cửa đi (chiều cao hoặc rộng thông thủy)', r: 'r522', min: 190, max: 240 },
    { id: 'cua-so', name: 'Cửa sổ (chiều cao hoặc rộng thông thủy)', r: 'r522', min: 100, max: 200 },
    { id: 'ban-tho', name: 'Bàn thờ (chiều ngang hoặc sâu)', r: 'r388', min: 80, max: 220 },
    { id: 'bep-ban', name: 'Bàn bếp, bàn ăn, bàn làm việc', r: 'r429', min: 60, max: 220 },
    { id: 'giuong', name: 'Giường ngủ (chiều dài hoặc rộng)', r: 'r429', min: 150, max: 230 },
    { id: 'tu', name: 'Tủ, kệ (chiều cao hoặc ngang)', r: 'r429', min: 80, max: 260 }
  ];
  function loBanV2(c) {
    c.innerHTML = V.tabsHTML([['lb-one', 'Đo một kích thước'], ['lb-cat', 'Tra kích thước đẹp theo hạng mục'], ['lb-multi', 'Đo nhiều kích thước']]) +
      '<div id="lb-one">' + V.formWrap2('<div class="ptv-row">' + L.field('Kích thước cần đo (cm)', '<input type="text" id="cm" inputmode="decimal" value="81">', 'ptv-field-name') + '</div>', 'Đo thước Lỗ Ban') + '</div>' +
      '<div id="lb-cat" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Hạng mục', L.select('cat', CATS.map(function (x) { return '<option value="' + x.id + '">' + x.name + '</option>'; }).join(''))) + '</div><div class="ptv-row">' + L.field('Khoảng tối thiểu (cm)', '<input type="text" id="mn" inputmode="decimal" value="190">') + L.field('Khoảng tối đa (cm)', '<input type="text" id="mx" inputmode="decimal" value="240">') + '</div>', 'Tra các khoảng đẹp') + '</div>' +
      '<div id="lb-multi" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Loại thước áp dụng', L.select('r', LOBAN.map(function (r) { return '<option value="' + r.id + '">' + r.name + '</option>'; }).join(''))) + '</div><div class="ptv-row">' + L.field('Danh sách kích thước, mỗi dòng một số (cm)', '<textarea id="list" rows="6">81\n107\n127\n153\n197\n217</textarea>', 'ptv-field-name') + '</div>', 'Đo cả danh sách') + '</div>';
    V.wireTabs(c, ['lb-one', 'lb-cat', 'lb-multi']);
    var catSel = c.querySelector('#lb-cat #cat');
    catSel.addEventListener('change', function () {
      var cat = CATS.filter(function (x) { return x.id === catSel.value; })[0];
      c.querySelector('#lb-cat #mn').value = cat.min; c.querySelector('#lb-cat #mx').value = cat.max;
    });
    c.querySelector('#lb-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lb-one'), cm = parseFloat(String(box.querySelector('#cm').value).replace(',', '.'));
      if (!cm || cm <= 0) { L.resultBox(box, '<p class="ptv-bad">Bạn nhập một kích thước lớn hơn 0, tính bằng cm nhé.</p>'); return; }
      var html = '<h3>Kết quả đo ' + fmt(cm) + ' cm trên 3 loại thước Lỗ Ban</h3>';
      LOBAN.forEach(function (r) {
        var m = measure(r, cm);
        html += '<div class="ptv-block"><div class="ptv-block-head"><span>' + r.name + '</span><span class="' + (m.seg[1] ? 'ptv-good' : 'ptv-bad') + '">Cung ' + m.seg[0] + (m.seg[1] ? ' (tốt)' : ' (xấu)') + '</span></div><p>Kích thước ' + fmt(cm) + ' cm rơi vào cung ' + m.seg[0] + ' (từ ' + fmt(m.start) + ' đến ' + fmt(m.end) + ' cm). ' + m.seg[2] + '.</p>' +
          (m.seg[1] ? '' : '<p><strong>Gợi ý chỉnh về cung tốt gần nhất:</strong> ' + nearestGood(r, cm).map(function (g) { return 'khoảng ' + fmt(g.s) + ' đến ' + fmt(g.e) + ' cm (cung ' + g.name + ')'; }).join(' hoặc ') + '.</p>') + '</div>';
      });
      html += '<p class="ptv-note">Mỗi hạng mục chỉ nên chốt theo MỘT loại thước đúng công dụng của nó: cửa và thông thủy dùng thước 52,2; bàn ghế, bếp, giường dùng thước 42,9; bàn thờ và đồ thờ dùng thước 38,8. Đừng cố ép một kích thước phải đẹp trên cả ba thước, vì chu kỳ khác nhau nên rất hiếm khi đẹp đồng thời.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#lb-cat form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lb-cat'), cat = CATS.filter(function (x) { return x.id === box.querySelector('#cat').value; })[0];
      var r = LOBAN.filter(function (x) { return x.id === cat.r; })[0];
      var mn = parseFloat(String(box.querySelector('#mn').value).replace(',', '.')), mx = parseFloat(String(box.querySelector('#mx').value).replace(',', '.'));
      if (!mn || !mx || mx <= mn) { L.resultBox(box, '<p class="ptv-bad">Khoảng tra chưa hợp lệ, bạn kiểm tra lại nhé.</p>'); return; }
      var segLen = r.cycle / r.segs.length, rows = '', from = Math.floor(mn / r.cycle) * r.cycle;
      for (var base = from; base < mx; base += r.cycle) {
        for (var i = 0; i < r.segs.length; i++) {
          if (!r.segs[i][1]) continue;
          var s = base + i * segLen, e = s + segLen;
          if (e <= mn || s >= mx) continue;
          rows += '<tr><td><strong>' + fmt(Math.max(s, mn)) + ' đến ' + fmt(Math.min(e, mx)) + ' cm</strong></td><td>' + r.segs[i][0] + '</td><td>' + r.segs[i][2] + '</td></tr>';
        }
      }
      var html = '<h3>Các khoảng kích thước đẹp cho ' + cat.name.toLowerCase() + ' trong ' + fmt(mn) + ' đến ' + fmt(mx) + ' cm</h3>' +
        '<p>Áp dụng ' + r.name.toLowerCase() + '. Bạn chọn bất kỳ số đo nào nằm trọn trong một khoảng dưới đây là rơi vào cung tốt:</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Khoảng đẹp (cm)</th><th>Cung</th><th>Ý nghĩa</th></tr>' + rows + '</table></div>' +
        '<p class="ptv-note">Khi thi công, hãy chốt số đo ở giữa khoảng đẹp thay vì sát mép, để sai số vài mm ngoài công trường không đẩy kích thước sang cung xấu.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#lb-multi form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lb-multi'), r = LOBAN.filter(function (x) { return x.id === box.querySelector('#r').value; })[0];
      var nums = box.querySelector('#list').value.split(/\s+/).map(function (s) { return parseFloat(String(s).replace(',', '.')); }).filter(function (n) { return n > 0; });
      if (!nums.length) { L.resultBox(box, '<p class="ptv-bad">Danh sách chưa có kích thước hợp lệ nào.</p>'); return; }
      var rows = nums.map(function (cm) {
        var m = measure(r, cm);
        return '<tr><td><strong>' + fmt(cm) + ' cm</strong></td><td class="' + (m.seg[1] ? 'ptv-good' : 'ptv-bad') + '">' + m.seg[0] + (m.seg[1] ? ' (tốt)' : ' (xấu)') + '</td><td>' + fmt(m.start) + ' đến ' + fmt(m.end) + ' cm</td><td>' + (m.seg[1] ? 'Giữ nguyên' : 'Chỉnh về ' + nearestGood(r, cm).map(function (g) { return fmt(g.s) + '–' + fmt(g.e); }).join(' hoặc ')) + '</td></tr>';
      }).join('');
      L.resultBox(box, '<h3>Đo ' + nums.length + ' kích thước theo ' + r.name.toLowerCase() + '</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Kích thước</th><th>Cung</th><th>Khoảng của cung</th><th>Gợi ý</th></tr>' + rows + '</table></div>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'thuoc-lo-ban': loBanV2 });
})();

/* --- Than so hoc + Cung hoang dao v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function reduceNum(n) { while (n > 9 && n !== 11 && n !== 22) { n = String(n).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0); } return n; }
  function sumD(n) { return String(n).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0); }
  function stripVN(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
  var LETTER_NUM = {}; 'abcdefghi'.split('').forEach(function (ch, i) { LETTER_NUM[ch] = i + 1; }); 'jklmnopqr'.split('').forEach(function (ch, i) { LETTER_NUM[ch] = i + 1; }); 'stuvwxyz'.split('').forEach(function (ch, i) { LETTER_NUM[ch] = i + 1; });
  function nameNums(name) {
    var clean = stripVN(name || '').replace(/[^a-z ]/g, ''), vowels = 'aeiou', soul = 0, expr = 0, cons = 0;
    clean.replace(/ /g, '').split('').forEach(function (ch) { var n = LETTER_NUM[ch] || 0; expr += n; if (vowels.indexOf(ch) >= 0) soul += n; else cons += n; });
    return { soul: reduceNum(soul), expr: reduceNum(expr), pers: reduceNum(cons) };
  }
  function dateFields2(p) {
    return '<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="' + p + 'd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="' + p + 'm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="' + p + 'y" inputmode="numeric" value="1995">') + '</div>';
  }
  function readD(box, p) { return { d: parseInt(box.querySelector('#' + p + 'd').value, 10), m: parseInt(box.querySelector('#' + p + 'm').value, 10), y: parseInt(box.querySelector('#' + p + 'y').value, 10) }; }
  function numBlock(data, title, n, intro) {
    var e = data.numbers[String(n)] || {};
    if (!e.traits) return '';
    return '<div class="ptv-block"><div class="ptv-block-head"><span>' + title + '</span><span class="ptv-block-score">Số ' + n + '</span></div><p><strong>' + esc(e.name || '') + '</strong>. ' + (intro || '') + esc(e.traits) + '</p><p><em>Sự nghiệp:</em> ' + esc(e.career || '') + '</p><p><em>Tình cảm:</em> ' + esc(e.love || '') + '</p></div>';
  }

  function thanSoV2(c) {
    var data = (window.PTV_TOOLS_DATA || {}).thanSoHoc || { numbers: {} };
    c.innerHTML = V.tabsHTML([['ts-full', 'Hồ sơ thần số học đầy đủ'], ['ts-lookup', 'Tra cứu ý nghĩa từng con số']]) +
      '<div id="ts-full">' + V.formWrap2('<div class="ptv-row">' + L.field('Họ tên đầy đủ (tên thường dùng)', '<input type="text" id="nm" value="">', 'ptv-field-name') + '</div>' + dateFields2('b'), 'Xem hồ sơ thần số học') + '</div>' +
      '<div id="ts-lookup" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Con số muốn tra', L.select('n', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22'].map(function (n) { return '<option value="' + n + '">Số ' + n + '</option>'; }).join(''))) + '</div>', 'Tra ý nghĩa số này') + '</div>';
    V.wireTabs(c, ['ts-full', 'ts-lookup']);
    c.querySelector('#ts-full form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ts-full'), dt = readD(box, 'b'), nm = box.querySelector('#nm').value || '';
      if (!dt.d || !dt.m || !dt.y) { L.resultBox(box, '<p>Bạn nhập đủ ngày tháng năm sinh nhé.</p>'); return; }
      var lp = reduceNum(sumD(dt.d) + sumD(dt.m) + sumD(dt.y)), nn = nameNums(nm);
      var dayN = reduceNum(dt.d), maturity = reduceNum(lp + nn.expr);
      var digits = (String(dt.d) + String(dt.m) + String(dt.y)).split('').map(Number);
      var present = [], missing = [];
      for (var k = 1; k <= 9; k++) { var cnt = digits.filter(function (x) { return x === k; }).length; if (cnt) present.push(k + (cnt > 1 ? ' (×' + cnt + ')' : '')); else missing.push(k); }
      var html = '<h3>Hồ sơ thần số học của ' + (nm ? esc(nm) : 'bạn') + ', sinh ' + dt.d + '/' + dt.m + '/' + dt.y + '</h3>' +
        numBlock(data, 'Số chủ đạo (đường đời)', lp, 'Đây là con số quan trọng nhất, tính từ ngày tháng năm sinh. ') +
        (nm ? numBlock(data, 'Số linh hồn (khát vọng bên trong)', nn.soul, 'Tính từ các nguyên âm trong tên. ') + numBlock(data, 'Số biểu đạt (năng lực thể hiện ra ngoài)', nn.expr, 'Tính từ toàn bộ họ tên. ') + numBlock(data, 'Số nhân cách (ấn tượng ban đầu)', nn.pers, 'Tính từ các phụ âm trong tên. ') : '<p class="ptv-note">Bạn chưa nhập họ tên nên ba con số của tên (linh hồn, biểu đạt, nhân cách) chưa được tính. Hãy nhập tên thường dùng nhất của bạn để có hồ sơ đầy đủ.</p>') +
        numBlock(data, 'Số ngày sinh (tài năng bẩm sinh)', dayN, '') +
        (nm ? numBlock(data, 'Số trưởng thành (nửa sau cuộc đời)', maturity, 'Bằng số chủ đạo cộng số biểu đạt, thường phát huy rõ từ sau tuổi 35 đến 40. ') : '') +
        '<h3>Biểu đồ ngày sinh của bạn</h3><p>Các con số xuất hiện trong ngày sinh: <strong>' + present.join(', ') + '</strong>. Các con số vắng mặt: <strong>' + missing.join(', ') + '</strong>. Trong thần số học, số có mặt là năng lượng bạn sẵn có và dùng tự nhiên; số vắng mặt là bài học bạn thường phải rèn luyện thêm trong đời. Số xuất hiện nhiều lần (×2, ×3) thì năng lượng đó càng đậm, cần để ý cả mặt quá và mặt thiếu của nó.</p>' +
        '<p class="ptv-note">Hồ sơ do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> tính theo hệ Pythagoras phổ biến: rút gọn giữ hai số bậc thầy 11 và 22, tên chuyển về không dấu trước khi quy đổi chữ cái.</p>' +
        '<p><button type="button" class="ptv-copy-btn">Sao chép tóm tắt hồ sơ</button></p>';
      L.resultBox(box, html);
      var btn = box.querySelector('.ptv-copy-btn');
      if (btn) btn.addEventListener('click', function () {
        var text = 'Thần số học ' + (nm || '') + ' sinh ' + dt.d + '/' + dt.m + '/' + dt.y + ': số chủ đạo ' + lp + ', số ngày sinh ' + dayN + (nm ? ', linh hồn ' + nn.soul + ', biểu đạt ' + nn.expr + ', nhân cách ' + nn.pers + ', trưởng thành ' + maturity : '') + '. (Phong Thủy VietAA, phongthuy.vietaa.com)';
        function done() { btn.textContent = 'Đã sao chép'; setTimeout(function () { btn.textContent = 'Sao chép tóm tắt hồ sơ'; }, 2000); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
      });
    });
    c.querySelector('#ts-lookup form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ts-lookup'), n = box.querySelector('#n').value;
      L.resultBox(box, '<h3>Ý nghĩa số ' + n + ' trong thần số học</h3>' + numBlock(data, 'Số ' + n, parseInt(n, 10)) + '<p class="ptv-note">Cùng một con số nhưng ở vị trí khác nhau (chủ đạo, linh hồn, biểu đạt...) thì cách thể hiện sẽ khác nhau theo vị trí đó. Xem hồ sơ đầy đủ ở tab bên cạnh để biết số này nằm ở đâu trong bộ số của bạn.</p>');
    });
  }

  var ZOD_BOUNDS = [[3, 21, 4, 19, 0], [4, 20, 5, 20, 1], [5, 21, 6, 21, 2], [6, 22, 7, 22, 3], [7, 23, 8, 22, 4], [8, 23, 9, 22, 5], [9, 23, 10, 23, 6], [10, 24, 11, 22, 7], [11, 23, 12, 21, 8], [12, 22, 1, 19, 9], [1, 20, 2, 18, 10], [2, 19, 3, 20, 11]];
  function signOf(d, m) { for (var i = 0; i < ZOD_BOUNDS.length; i++) { var b = ZOD_BOUNDS[i]; if ((m === b[0] && d >= b[1]) || (m === b[2] && d <= b[3])) return i; } return 9; }
  var EL_PAIR = {
    'Lửa|Lửa': [90, 'Hai cung cùng hành Lửa: bùng nổ, thẳng thắn và rất hút nhau lúc đầu; cần học cách nhường nhau khi cùng nổi nóng.'],
    'Đất|Đất': [90, 'Hai cung cùng hành Đất: cùng coi trọng ổn định và thực tế, xây dựng được nền tảng bền; nên chủ động tạo thêm sự mới mẻ để tránh nhàm chán.'],
    'Khí|Khí': [90, 'Hai cung cùng hành Khí: nói chuyện không hết đề tài, rất hiểu nhau về mặt trí tuệ; cần thêm cam kết cụ thể để quan hệ không dừng ở mức bạn bè thân.'],
    'Nước|Nước': [90, 'Hai cung cùng hành Nước: thấu cảm sâu sắc, gắn bó tình cảm mạnh; cần tỉnh táo để không cùng nhau chìm trong cảm xúc tiêu cực.'],
    'Lửa|Khí': [82, 'Lửa và Khí là cặp tương sinh kinh điển: Khí thổi bùng Lửa, Lửa cho Khí điểm tựa hành động. Cặp này hợp cả làm bạn, làm ăn lẫn yêu đương.'],
    'Đất|Nước': [82, 'Đất và Nước là cặp tương sinh kinh điển: Đất cho Nước bờ bãi ổn định, Nước nuôi Đất màu mỡ. Cặp này bền và thực tế, hợp xây dựng lâu dài.'],
    'Lửa|Nước': [45, 'Lửa và Nước vốn khắc nhau: một bên cảm xúc mãnh liệt, một bên cần được vỗ về nhẹ nhàng. Không phải không hợp, nhưng cần rất nhiều thấu hiểu và thỏa hiệp mới bền.'],
    'Đất|Khí': [48, 'Đất thực tế gặp Khí bay bổng: dễ thấy nhau khó hiểu lúc đầu, một bên cần chắc chắn, một bên cần tự do. Nếu tôn trọng được nhịp khác biệt này, đây lại là cặp bổ sung cho nhau rất tốt.'],
    'Lửa|Đất': [62, 'Lửa và Đất ở mức trung tính khá: Đất ngưỡng mộ sự quyết liệt của Lửa, Lửa cần sự vững chãi của Đất; chỉ cần thống nhất tốc độ ra quyết định là đi được đường dài.'],
    'Khí|Nước': [62, 'Khí và Nước ở mức trung tính khá: Nước cảm xúc gặp Khí lý trí, nếu Khí học cách lắng nghe bằng trái tim và Nước học cách nói thẳng nhu cầu, cặp này rất ăn ý.']
  };
  function pairKey(e1, e2) { var k = e1 + '|' + e2; if (EL_PAIR[k]) return EL_PAIR[k]; return EL_PAIR[e2 + '|' + e1] || [60, '']; }
  function hoangDaoV2(c) {
    var zlist = (window.PTV_TOOLS_DATA || {}).zodiac || [];
    function zHTML(z) {
      return '<h3>' + esc(z.sign) + ' (' + esc(z.dates) + ') · Hành ' + esc(z.element) + '</h3><p>' + esc(z.traits) + '</p><p><strong>Sự nghiệp:</strong> ' + esc(z.career) + '</p><p><strong>Tình duyên:</strong> ' + esc(z.love) + '</p><p><strong>May mắn:</strong> ' + esc(z.lucky) + '</p>';
    }
    function signSelect(id) { return L.select(id, zlist.map(function (z, i) { return '<option value="' + i + '">' + z.sign + ' (' + z.dates + ')</option>'; }).join('')); }
    c.innerHTML = V.tabsHTML([['hd-one', 'Cung hoàng đạo của bạn'], ['hd-pair', 'Độ hợp giữa hai cung'], ['hd-all', 'Bảng 12 cung hoàng đạo']]) +
      '<div id="hd-one">' + V.formWrap2(dateFields2('b'), 'Xem cung hoàng đạo') + '</div>' +
      '<div id="hd-pair" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Cung của người thứ nhất', signSelect('s1')) + L.field('Cung của người thứ hai', signSelect('s2')) + '</div>', 'Xem độ hợp hai cung') + '</div>' +
      '<div id="hd-all" hidden><div class="ptv-out"></div></div>';
    V.wireTabs(c, ['hd-one', 'hd-pair', 'hd-all']);
    c.querySelector('#hd-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hd-one'), dt = readD(box, 'b');
      if (!dt.d || !dt.m) { L.resultBox(box, '<p>Bạn nhập ngày và tháng sinh nhé.</p>'); return; }
      var idx = signOf(dt.d, dt.m), z = zlist[idx];
      var cuspNote = '';
      var prev = zlist[(idx + 11) % 12], next = zlist[(idx + 1) % 12];
      var b = ZOD_BOUNDS[idx];
      if ((dt.m === b[0] && dt.d - b[1] <= 1) || (dt.m === b[2] && b[3] - dt.d <= 1)) cuspNote = '<p class="ptv-note">Bạn sinh rất sát ngày chuyển cung (gần ranh giới với ' + (dt.m === b[0] ? prev.sign : next.sign) + '). Người sinh sát ranh giới thường mang thêm ít nhiều nét của cung kề bên, bạn có thể đọc thêm phần luận của cung đó để đối chiếu.</p>';
      L.resultBox(box, zHTML(z) + cuspNote);
    });
    c.querySelector('#hd-pair form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hd-pair'), z1 = zlist[parseInt(box.querySelector('#s1').value, 10)], z2 = zlist[parseInt(box.querySelector('#s2').value, 10)];
      var pk = pairKey(z1.element, z2.element);
      var html = '<h3>' + z1.sign + ' và ' + z2.sign + ': độ hợp ' + pk[0] + '%</h3><p>' + pk[1] + '</p>' +
        '<p><strong>' + z1.sign + ' (hành ' + z1.element + '):</strong> ' + esc(z1.love) + '</p>' +
        '<p><strong>' + z2.sign + ' (hành ' + z2.element + '):</strong> ' + esc(z2.love) + '</p>' +
        '<p class="ptv-note">Độ hợp tính theo quan hệ bốn nhóm hành của chiêm tinh phương Tây (Lửa, Đất, Khí, Nước) và chỉ là một lớp tham khảo vui. Hai cung điểm thấp vẫn có thể rất bền nếu hai người thật sự hiểu nhau, và ngược lại.</p>';
      L.resultBox(box, html);
    });
    var rendered = false;
    c.querySelector('[data-t="hd-all"]').addEventListener('click', function () {
      if (rendered) return; rendered = true;
      var rows = zlist.map(function (z) { return '<tr><td><strong>' + z.sign + '</strong></td><td>' + z.dates + '</td><td>' + z.element + '</td><td>' + esc(z.lucky) + '</td></tr>'; }).join('');
      c.querySelector('#hd-all .ptv-out').innerHTML = '<h3>Bảng tra nhanh 12 cung hoàng đạo theo ngày sinh</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Cung</th><th>Ngày sinh</th><th>Hành</th><th>May mắn</th></tr>' + rows + '</table></div>';
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-than-so-hoc': thanSoV2, 'xem-cung-hoang-dao': hoangDaoV2 });
})();

/* --- La so tu vi + Tien kiep v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc, V = window.PTVDayToolsV2;
  function dateFields3() {
    return '<div class="ptv-row">' + L.field('Ngày sinh (dương lịch)', '<input type="text" id="bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="by" inputmode="numeric" value="1995">') + '</div>';
  }
  var MENH_TXT = { 'Tý': 'Mệnh tại Tý, cung của sự khởi đầu và trí tuệ. Người có mệnh cung này thường thông minh, linh hoạt, giỏi tích lũy nhưng đôi lúc lo xa.', 'Sửu': 'Mệnh tại Sửu, chủ về cần cù và bền bỉ. Đường đời đi chậm mà chắc, hậu vận thường khá hơn tiền vận.', 'Dần': 'Mệnh tại Dần, khí thế mạnh, dám nghĩ dám làm. Sự nghiệp có nhiều bước ngoặt lớn, cần tiết chế sự nóng nảy.', 'Mão': 'Mệnh tại Mão, tính tình mềm mỏng, trọng tình cảm và thẩm mỹ. Hợp các việc cần sự khéo léo và giao tiếp.', 'Thìn': 'Mệnh tại Thìn, ôm chí lớn, có duyên với quyền lực và việc lớn. Cần tránh tự tin quá mức khi thời cơ chưa tới.', 'Tỵ': 'Mệnh tại Tỵ, sâu sắc và kín đáo, trực giác mạnh. Hợp việc nghiên cứu, phân tích và các nghề cần sự tinh tế.', 'Ngọ': 'Mệnh tại Ngọ, nhiệt huyết, thích tự do và được chú ý. Sự nghiệp thăng trầm theo cảm hứng, cần người đồng hành giữ nhịp.', 'Mùi': 'Mệnh tại Mùi, hiền lành, giàu lòng trắc ẩn, có duyên nghệ thuật. Đời sống tình cảm phong phú, cần quyết đoán hơn trong việc lớn.', 'Thân': 'Mệnh tại Thân, nhanh trí, giỏi ứng biến và giao thiệp rộng. Hợp kinh doanh và các việc cần xoay xở linh hoạt.', 'Dậu': 'Mệnh tại Dậu, cầu toàn, sắc sảo và có óc tổ chức. Chú ý tránh khắt khe với người thân vì những tiểu tiết.', 'Tuất': 'Mệnh tại Tuất, trung thành, trọng nghĩa và có trách nhiệm. Được người tin cậy giao việc lớn, hậu vận an ổn.', 'Hợi': 'Mệnh tại Hợi, phúc hậu, dễ được quý nhân giúp. Tiền vận vất vả hơn hậu vận, càng về sau càng an nhàn.' };
  var CUNG12 = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
  var CUNG_TXT = {
    'Mệnh': 'Cung Mệnh là trung tâm của lá số, nói về bản chất, khí chất và hướng đi tổng thể của một đời người. Mọi luận giải đều bắt đầu từ cung này, kết hợp với cung Thân để thấy cả phần bẩm sinh lẫn phần phát triển về sau.',
    'Phụ Mẫu': 'Cung Phụ Mẫu luận về cha mẹ, sự dạy dỗ thuở nhỏ và nền tảng gia đình để lại, đồng thời phản ánh duyên của bạn với cấp trên và người đỡ đầu thời trẻ.',
    'Phúc Đức': 'Cung Phúc Đức nói về phúc phần dòng họ, đời sống tinh thần và khả năng hưởng thụ an yên của bạn. Cung này tốt thì tâm tính nhẹ nhàng, gặp khó cũng có đường lui.',
    'Điền Trạch': 'Cung Điền Trạch luận về nhà cửa, đất đai và khả năng tích lũy tài sản cố định, cũng như mức độ ổn định của chỗ ở qua các giai đoạn đời người.',
    'Quan Lộc': 'Cung Quan Lộc là cung sự nghiệp: con đường công danh, nghề nghiệp hợp mệnh và cách bạn gây dựng vị thế xã hội. Đây là cung được xem kỹ nhất khi luận về nghề.',
    'Nô Bộc': 'Cung Nô Bộc luận về bạn bè, đồng nghiệp, cấp dưới và các mối quan hệ xã giao, cho thấy bạn hợp làm việc nhóm hay độc lập, được bạn giúp hay phải tự thân.',
    'Thiên Di': 'Cung Thiên Di nói về phần đời khi ra ngoài xã hội: đi xa, lập nghiệp phương xa, giao tế và hình ảnh của bạn trong mắt người ngoài thường rõ hơn ở cung này so với cung Mệnh.',
    'Tật Ách': 'Cung Tật Ách luận về sức khỏe và những điểm yếu thể chất cần lưu ý theo bản mệnh. Đây là gợi ý để chăm sóc bản thân sớm, không phải lời phán về bệnh tật.',
    'Tài Bạch': 'Cung Tài Bạch là cung tiền bạc: cách kiếm tiền, cách giữ tiền và thái độ với tài chính. Cung này cần xem cùng Điền Trạch và Quan Lộc mới thấy trọn bức tranh tài vận.',
    'Tử Tức': 'Cung Tử Tức luận về con cái, duyên con và cách bạn nuôi dạy thế hệ sau, mở rộng ra còn là các sản phẩm sáng tạo và học trò mà bạn truyền lại.',
    'Phu Thê': 'Cung Phu Thê nói về hôn nhân và người bạn đời: kiểu người hợp với bạn, cách hai người chung sống và những giai đoạn cần vun đắp nhiều hơn trong đời sống vợ chồng.',
    'Huynh Đệ': 'Cung Huynh Đệ luận về anh chị em ruột và những người bạn thân như ruột thịt, mức độ hòa hợp, đỡ đần nhau trong gia đình và khi ra đời.'
  };
  var CUC = { 'Thủy': ['Thủy Nhị Cục', 2], 'Mộc': ['Mộc Tam Cục', 3], 'Kim': ['Kim Tứ Cục', 4], 'Thổ': ['Thổ Ngũ Cục', 5], 'Hỏa': ['Hỏa Lục Cục', 6] };
  function chart(dt, hourIdx, g) {
    var lu = E.convertSolar2Lunar(dt.d, dt.m, dt.y, 7), yi = L.yearInfo(lu.year);
    var menhIdx = ((2 + (lu.month - 1) - hourIdx) % 12 + 12) % 12;
    var thanIdx = ((2 + (lu.month - 1) + hourIdx) % 12 + 12) % 12;
    var duong = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].indexOf(yi.can) >= 0;
    var thuan = (duong && g === 'Nam') || (!duong && g === 'Nữ');
    return { lu: lu, yi: yi, menhIdx: menhIdx, thanIdx: thanIdx, thuan: thuan, amDuong: (duong ? 'Dương' : 'Âm') + ' ' + g };
  }
  function palaceAtChi(ch, chiIdx) { return CUNG12[((ch.menhIdx - chiIdx) % 12 + 12) % 12]; }
  function tuViV2(c) {
    c.innerHTML = V.tabsHTML([['tv-chart', 'Lập lá số cơ bản'], ['tv-palace', 'Luận từng cung']]) +
      '<div id="tv-chart">' + V.formWrap2(dateFields3() + '<div class="ptv-row">' + L.field('Giờ sinh', L.select('h', E.CHI.map(function (x, i) { return '<option value="' + i + '">' + x + ' (' + E.HOUR_LABEL[x] + ')</option>'; }).join(''))) + L.field('Giới tính', L.genderSelect('g')) + '</div>', 'Lập lá số tử vi') + '</div>' +
      '<div id="tv-palace" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Cung muốn xem', L.select('p', CUNG12.map(function (n) { return '<option value="' + n + '">Cung ' + n + '</option>'; }).join(''))) + '</div>', 'Xem luận cung này') + '</div>';
    V.wireTabs(c, ['tv-chart', 'tv-palace']);
    c.querySelector('#tv-chart form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tv-chart');
      var dt = { d: parseInt(box.querySelector('#bd').value, 10), m: parseInt(box.querySelector('#bm').value, 10), y: parseInt(box.querySelector('#by').value, 10) };
      var ch = chart(dt, parseInt(box.querySelector('#h').value, 10), box.querySelector('#g').value);
      var rows = CUNG12.map(function (name, i) {
        var idx = ((ch.menhIdx - i) % 12 + 12) % 12;
        return '<tr><td><strong>' + name + '</strong>' + (idx === ch.thanIdx ? ' (kiêm Thân)' : '') + '</td><td>' + E.CHI[idx] + '</td><td>' + CUNG_TXT[name].split('.')[0] + '.</td></tr>';
      }).join('');
      var cuc = CUC[ch.yi.el], limits = '';
      for (var k = 0; k < 8; k++) {
        var chiIdx = ((ch.menhIdx + (ch.thuan ? k : -k)) % 12 + 12) % 12;
        var startAge = cuc[1] + k * 10;
        limits += '<tr><td><strong>' + startAge + ' đến ' + (startAge + 9) + ' tuổi</strong></td><td>Cung ' + palaceAtChi(ch, chiIdx) + ' (' + E.CHI[chiIdx] + ')</td></tr>';
      }
      var html = '<div class="ptv-facts"><span>Sinh: <strong>' + dt.d + '/' + dt.m + '/' + dt.y + '</strong>, âm lịch <strong>' + ch.lu.day + '/' + ch.lu.month + '/' + ch.lu.year + '</strong></span><span>Tuổi: <strong>' + ch.yi.text + '</strong></span><span>Mệnh: <strong>' + esc(ch.yi.napAm) + '</strong></span><span><strong>' + cuc[0] + '</strong></span><span>' + ch.amDuong + '</span></div>' +
        '<h3>Cung Mệnh tại ' + E.CHI[ch.menhIdx] + ', Cung Thân tại ' + E.CHI[ch.thanIdx] + (ch.menhIdx === ch.thanIdx ? ' (Mệnh Thân đồng cung)' : '') + '</h3><p>' + MENH_TXT[E.CHI[ch.menhIdx]] + '</p>' +
        '<h3>Mười hai cung trên lá số của bạn</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Cung</th><th>An tại</th><th>Chủ về</th></tr>' + rows + '</table></div>' +
        '<h3>Đại hạn của bạn (mỗi hạn 10 năm, khởi từ ' + cuc[1] + ' tuổi, đi ' + (ch.thuan ? 'thuận' : 'nghịch') + ' vì bạn là ' + ch.amDuong + ')</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Khoảng tuổi</th><th>Đại hạn tại</th></tr>' + limits + '</table></div>' +
        '<p>Đọc đại hạn theo cách cơ bản: giai đoạn nào đại hạn đóng tại cung nào thì chủ đề của cung đó nổi lên trong mười năm ấy, ví dụ đại hạn tại Quan Lộc là thập kỷ sự nghiệp được đẩy lên trước, tại Tài Bạch là thập kỷ tiền bạc cần nhiều quyết định. Muốn hiểu sâu từng cung, bạn mở tab Luận từng cung bên cạnh.</p>' +
        '<p class="ptv-note">Đây là lá số CƠ BẢN do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> lập minh bạch: an cung Mệnh, Thân, mười hai cung chức năng, cục và đại hạn theo quy tắc truyền thống. Lá số tử vi đầy đủ còn an 14 chính tinh và nhiều phụ tinh theo ngày sinh giờ sinh, phần này cần luận giải chuyên sâu và công cụ không mạo nhận làm thay.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#tv-palace form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tv-palace'), p = box.querySelector('#p').value;
      L.resultBox(box, '<h3>Cung ' + p + ' trong lá số tử vi</h3><p>' + CUNG_TXT[p] + '</p><p class="ptv-note">Muốn biết cung ' + p + ' của chính bạn an tại địa chi nào và đại hạn nào sẽ đi qua cung này, hãy lập lá số ở tab bên cạnh trước.</p>');
    });
  }

  var LP_LESSON = { '1': 'bài học về độc lập và tự quyết: thôi chờ người khác mở đường, tự đứng ra chịu trách nhiệm với lựa chọn của mình', '2': 'bài học về lắng nghe và cân bằng cảm xúc: mềm mỏng không có nghĩa là chịu đựng, mà là biết nói đúng lúc', '3': 'bài học về diễn đạt và niềm vui sống: nói ra điều mình nghĩ một cách xây dựng thay vì giữ trong lòng hoặc buông lời tùy tiện', '4': 'bài học về kỷ luật và nền tảng: xây chậm mà chắc, tôn trọng quy trình thay vì tìm đường tắt', '5': 'bài học về tự do có trách nhiệm: trải nghiệm nhiều nhưng cần biết dừng đúng chỗ, thay đổi vì tiến bộ chứ không vì chán', '6': 'bài học về yêu thương và trách nhiệm gia đình: chăm người khác mà không quên chăm mình, cho đi không kèm điều kiện', '7': 'bài học về nội tâm và niềm tin: dành thời gian tĩnh lặng, tin vào trải nghiệm tự kiểm chứng thay vì chạy theo đám đông', '8': 'bài học về tiền bạc và giá trị bản thân: dùng vật chất như công cụ phục vụ đời sống, không để nó định giá con người mình', '9': 'bài học về bao dung và cho đi: khép lại những chuyện cũ một cách tử tế, giúp người trong khả năng mà không ôm hết việc đời', '11': 'bài học bậc thầy về trực giác và truyền cảm hứng: năng lượng nhạy cảm lớn cần được dẫn vào việc có ích, tránh để nó thành căng thẳng triền miên', '22': 'bài học bậc thầy về xây dựng lớn từ nền nhỏ: biến tầm nhìn xa thành từng việc cụ thể mỗi ngày, kiên nhẫn với hành trình dài' };
  function reduceNum2(n) { while (n > 9 && n !== 11 && n !== 22) { n = String(n).split('').reduce(function (a, x) { return a + parseInt(x, 10); }, 0); } return n; }
  function tienKiepV2(c) {
    var data = (window.PTV_TOOLS_DATA || {}).tienKiep || { pastLives: [], lessons: [] };
    var draws = {};
    c.innerHTML = V.tabsHTML([['tk-draw', 'Giải mã tiền kiếp'], ['tk-lesson', 'Bài học mang theo theo số chủ đạo']]) +
      '<div id="tk-draw">' + V.formWrap2(dateFields3() + '<div class="ptv-row">' + L.field('Họ tên của bạn (không bắt buộc, làm hạt giống gieo khác nhau)', '<input type="text" id="nm" value="">', 'ptv-field-name') + '</div>', 'Giải mã tiền kiếp của tôi') + '</div>' +
      '<div id="tk-lesson" hidden>' + V.formWrap2(dateFields3(), 'Xem bài học theo số chủ đạo') + '</div>';
    V.wireTabs(c, ['tk-draw', 'tk-lesson']);
    c.querySelector('#tk-draw form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tk-draw');
      var seedStr = 'tienkiep|' + box.querySelector('#bd').value + '/' + box.querySelector('#bm').value + '/' + box.querySelector('#by').value + '|' + (box.querySelector('#nm').value || '');
      draws[seedStr] = (draws[seedStr] || 0) + 1;
      var h = L.hashStr(seedStr + '|' + draws[seedStr]);
      var life = data.pastLives[h % data.pastLives.length], lesson = data.lessons[(h >> 3) % data.lessons.length];
      var html = '<h3>Tiền kiếp của bạn: ' + esc(life.role) + '</h3><p>' + esc(life.desc) + '</p><h3>Bài học còn mang theo sang đời này</h3><p>' + esc(lesson) + '</p>' +
        '<p>Bạn có thể bấm giải mã lại để gieo một lát cắt khác, vì theo quan niệm luân hồi một người trải qua nhiều kiếp với nhiều vai khác nhau, mỗi lần gieo là một lát cắt tham khảo. Cách dùng có ích nhất là đọc như một tấm gương soi tính cách hiện tại: phần nào trong mô tả khiến bạn gật gù, phần đó thường chạm đúng thói quen bạn đang có.</p>' +
        '<p class="ptv-note">Giải mã tiền kiếp tại <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> là luận giải giải trí dựa trên ngày sinh, không phải khẳng định về quá khứ thật của bất kỳ ai.</p>';
      L.resultBox(box, html);
      try {
        var hist = JSON.parse(localStorage.getItem('ptvTienKiepHistory') || '[]');
        hist.unshift({ d: box.querySelector('#bd').value + '/' + box.querySelector('#bm').value + '/' + box.querySelector('#by').value, role: life.role });
        localStorage.setItem('ptvTienKiepHistory', JSON.stringify(hist.slice(0, 5)));
      } catch (e) {}
    });
    c.querySelector('#tk-lesson form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tk-lesson');
      var total = (box.querySelector('#bd').value + box.querySelector('#bm').value + box.querySelector('#by').value).split('').reduce(function (a, ch) { return a + (parseInt(ch, 10) || 0); }, 0);
      var lp = reduceNum2(total);
      L.resultBox(box, '<h3>Số chủ đạo ' + lp + ': ' + LP_LESSON[String(lp)] + '</h3><p>Trong cách đọc kết hợp thần số học và quan niệm nghiệp quả, số chủ đạo được xem là bài học lớn mà đời này bạn quay lại để học cho trọn. Nó không phải án phạt, mà giống một môn học chính: bạn sẽ gặp lại cùng một dạng tình huống dưới nhiều hình thức, cho tới khi cách phản ứng của bạn thay đổi. Nhận ra được mẫu lặp đó sớm, bạn sẽ bớt hỏi vì sao chuyện này cứ xảy ra với mình, và bắt đầu hỏi mình cần học điều gì từ nó.</p><p class="ptv-note">Đây là cách đọc tham khảo kết hợp hai hệ luận giải, dùng để suy ngẫm về bản thân là chính.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-la-so-tu-vi': tuViV2, 'giai-ma-tien-kiep': tienKiepV2 });
})();

/* --- Hau kiep + Duong hoc van v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, esc = L.esc, V = window.PTVDayToolsV2;
  function df3() {
    return '<div class="ptv-row">' + L.field('Ngày sinh (dương lịch)', '<input type="text" id="bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="by" inputmode="numeric" value="1995">') + '</div>';
  }
  function rd(box) { return { d: parseInt(box.querySelector('#bd').value, 10), m: parseInt(box.querySelector('#bm').value, 10), y: parseInt(box.querySelector('#by').value, 10) }; }
  var HAU_MENH = {
    'Kim': 'Hậu vận của người mệnh Kim thường nghiêng về sự gọn gàng và thành quả tích lũy: càng lớn tuổi càng biết mình có gì, cần gì, và sống có trật tự. Điểm cần giữ là sức khỏe hô hấp và xương khớp, cùng thói quen mềm mỏng hơn với con cháu thay vì áp tiêu chuẩn của mình lên thế hệ sau.',
    'Mộc': 'Hậu vận của người mệnh Mộc nghiêng về sự phát triển bền bỉ và vai trò cây cao bóng cả trong gia đình. Càng về sau càng hợp truyền kinh nghiệm, dạy dỗ lớp trẻ. Điểm cần giữ là gan và gân cốt, cùng sự kiên nhẫn khi con cháu đi con đường khác lựa chọn của mình.',
    'Thủy': 'Hậu vận của người mệnh Thủy nghiêng về chiều sâu và sự linh hoạt: thích nghi tốt với thay đổi nơi ở, hoàn cảnh, và thường là nơi cả nhà tìm tới khi cần lời khuyên. Điểm cần giữ là thận, giấc ngủ và thói quen không ôm hết lo lắng của mọi người vào mình.',
    'Hỏa': 'Hậu vận của người mệnh Hỏa nghiêng về sự rực rỡ và ảnh hưởng: càng lớn tuổi càng có tiếng nói trong cộng đồng nếu biết tiết chế nóng nảy. Điểm cần giữ là tim mạch, huyết áp và nhịp sống chậm lại đúng lúc, vì mệnh Hỏa dễ kiệt sức do quá nhiệt huyết.',
    'Thổ': 'Hậu vận của người mệnh Thổ nghiêng về sự ổn định và tích lũy: nhà cửa, đất đai và nền nếp gia đình thường vững dần theo tuổi. Điểm cần giữ là tiêu hóa, cân nặng và sự cởi mở trước thay đổi, tránh vì quá chắc chắn mà bỏ lỡ cơ hội mới ở tuổi trung niên.'
  };
  function hauKiepV2(c) {
    var data = (window.PTV_TOOLS_DATA || {}).tienKiep || { futurePaths: [], lessons: [] };
    c.innerHTML = V.tabsHTML([['hk-main', 'Giải mã hậu kiếp'], ['hk-plan', 'Ba việc vun bồi cho hậu vận']]) +
      '<div id="hk-main">' + V.formWrap2(df3(), 'Giải mã hậu kiếp của tôi') + '</div>' +
      '<div id="hk-plan" hidden>' + V.formWrap2(df3(), 'Xem việc nên vun bồi') + '</div>';
    V.wireTabs(c, ['hk-main', 'hk-plan']);
    c.querySelector('#hk-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hk-main'), dt = rd(box);
      var info = D.dayInfo(new Date(dt.y, dt.m - 1, dt.d)), yi = L.yearInfo(info.lunar.y);
      var h = L.hashStr('haukiep|' + dt.d + '/' + dt.m + '/' + dt.y);
      var p = data.futurePaths[h % data.futurePaths.length], lesson = data.lessons[(h >> 4) % data.lessons.length];
      var html = '<div class="ptv-facts"><span>Sinh: <strong>' + dt.d + '/' + dt.m + '/' + dt.y + '</strong></span><span>Tuổi: <strong>' + yi.text + '</strong></span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong></span></div>' +
        '<h3>Hậu vận của bạn: ' + esc(p.path) + '</h3><p>' + esc(p.desc) + '</p>' +
        '<h3>Hậu vận theo mệnh ' + yi.el + ' của bạn</h3><p>' + HAU_MENH[yi.el] + '</p>' +
        '<p><strong>Điều nên vun bồi từ bây giờ:</strong> ' + esc(lesson) + '</p>' +
        '<p class="ptv-note">Hậu kiếp và hậu vận là cách nói dân gian về chặng sau của đời người. Phần luận tại <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> chỉ là gợi ý suy ngẫm, tương lai vẫn nằm trong tay bạn và được quyết định bởi những gì bạn làm từ hôm nay.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#hk-plan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hk-plan'), dt = rd(box);
      var now = new Date(), age = now.getFullYear() - dt.y;
      var stage = age < 40 ? 'Bạn đang ở chặng gieo nền (trước 40 tuổi): hậu vận tốt xấu quyết định nhiều nhất ở những năm này, khi sức khỏe, nghề nghiệp và quan hệ đều còn đắp được nền.' : (age < 55 ? 'Bạn đang ở chặng tích lũy (40 đến 55 tuổi): đây là lúc hậu vận bắt đầu hiện hình qua sức khỏe, tài chính và vị thế của bạn, điều chỉnh bây giờ vẫn rất kịp.' : 'Bạn đang ở chặng thu hoạch (sau 55 tuổi): hậu vận lúc này là quả của những gì đã gieo, việc cần làm là giữ nhịp sống lành mạnh và truyền lại kinh nghiệm cho lớp sau.');
      var h = L.hashStr('haukiep|' + dt.d + '/' + dt.m + '/' + dt.y);
      var lesson = data.lessons[(h >> 4) % data.lessons.length];
      var html = '<h3>Ba việc vun bồi cho hậu vận của bạn</h3><p>' + stage + '</p>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Một, sức khỏe là vốn gốc</span></div><p>Mọi cách luận hậu vận đều vô nghĩa nếu sức khỏe sụp sớm. Khám định kỳ, ngủ đủ và vận động đều là khoản đầu tư có lãi nhất cho chặng sau của đời người, hơn mọi vật phẩm phong thủy.</p></div>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Hai, tài chính và chỗ ở ổn định</span></div><p>Hậu vận an yên thường đứng trên ba chân: một khoản dự phòng, một chỗ ở chắc chắn và ít nợ nần. Ba chân này xây bằng kỷ luật chi tiêu từ tuổi 30, không xây bằng may rủi.</p></div>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Ba, quan hệ là tài sản cuối cùng</span></div><p>' + esc(lesson) + ' Người có hậu vận được luận là tốt trong dân gian, nhìn kỹ đều là người giữ được vài mối quan hệ sâu bền tới cuối đời.</p></div>';
      L.resultBox(box, html);
    });
  }

  var LP_STUDY = { '1': 'Bạn học theo kiểu tự chủ: có mục tiêu rõ ràng là bứt tốc rất nhanh, nhưng dễ chán khi bị ép học theo nhịp của người khác. Hợp học qua dự án và thử thách.', '2': 'Bạn học bằng sự đều đặn và cảm xúc an toàn: tiến bộ vững trong môi trường thân thiện, có người đồng hành. Hợp học nhóm nhỏ và ôn tập theo lịch cố định.', '3': 'Bạn học qua nói và viết: giảng lại cho người khác là cách bạn thuộc bài sâu nhất. Hợp các môn ngôn ngữ, xã hội và học qua thảo luận, thuyết trình.', '4': 'Bạn học theo hệ thống: cần giáo trình rõ ràng, từng bước một, không hợp nhảy cóc. Hợp các môn kỹ thuật, kế toán, và ôn luyện bằng sơ đồ, bảng biểu.', '5': 'Bạn học bằng trải nghiệm: ngồi yên một chỗ là cực hình, học qua thực hành, ví dụ thật và thay đổi bối cảnh sẽ nhớ rất lâu. Hợp ngoại ngữ qua giao tiếp và học nghề qua làm thật.', '6': 'Bạn học vì trách nhiệm và người thân: có động lực rõ ràng vì ai là bạn bền bỉ nhất. Hợp các ngành chăm sóc, giáo dục, y tế và học cùng người thân.', '7': 'Bạn học theo chiều sâu và tự nghiên cứu: cần không gian yên tĩnh, tự đặt câu hỏi và đào tới gốc. Hợp nghiên cứu, triết học, khoa học và các kỳ thi cần tư duy phân tích.', '8': 'Bạn học có định hướng thành quả: hợp chương trình gắn với bằng cấp, vị trí và thu nhập cụ thể. Điểm cần rèn là kiên nhẫn ở giai đoạn chưa thấy kết quả.', '9': 'Bạn học rộng và vì lý tưởng: hứng thú với nhiều lĩnh vực, hợp các ngành nhân văn, xã hội và công tác cộng đồng. Điểm cần rèn là học tới nơi tới chốn một chuyên ngành thay vì dàn trải.', '11': 'Bạn học bằng trực giác mạnh: nắm ý rất nhanh khi hứng thú, nhưng hiệu quả lên xuống theo cảm xúc. Cần kỷ luật ôn tập đều để trực giác không bị lãng phí.', '22': 'Bạn học theo tầm nhìn lớn: hợp các chương trình dài hơi xây dựng nền tảng cho sự nghiệp lớn. Cần chia mục tiêu lớn thành chặng nhỏ để không nản giữa đường.' };
  function hocVanV2(c) {
    var data = (window.PTV_TOOLS_DATA || {}).hocVan || { byCan: {}, byMenh: {} };
    c.innerHTML = V.tabsHTML([['hv-main', 'Hồ sơ học vấn của bạn'], ['hv-exam', 'Xem năm thi cử']]) +
      '<div id="hv-main">' + V.formWrap2(df3(), 'Xem đường học vấn') + '</div>' +
      '<div id="hv-exam" hidden>' + V.formWrap2(df3() + '<div class="ptv-row">' + L.field('Năm dự định thi hoặc bảo vệ, xin học', '<input type="text" id="ey" inputmode="numeric" value="2026">') + '</div>', 'Xem năm thi này có thuận không') + '</div>';
    V.wireTabs(c, ['hv-main', 'hv-exam']);
    function lpOf(dt) { var s = String(dt.d) + String(dt.m) + String(dt.y); var n = s.split('').reduce(function (a, ch) { return a + parseInt(ch, 10); }, 0); while (n > 9 && n !== 11 && n !== 22) { n = String(n).split('').reduce(function (a, ch) { return a + parseInt(ch, 10); }, 0); } return n; }
    c.querySelector('#hv-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hv-main'), dt = rd(box);
      var info = D.dayInfo(new Date(dt.y, dt.m - 1, dt.d)), yi = L.yearInfo(info.lunar.y), lp = lpOf(dt);
      var html = '<div class="ptv-facts"><span>Ngày sinh: <strong>' + dt.d + '/' + dt.m + '/' + dt.y + '</strong></span><span>Ngày can chi: <strong>' + info.day.text + '</strong></span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong></span><span>Số chủ đạo: <strong>' + lp + '</strong></span></div>' +
        '<h3>Đường học vấn theo can ngày ' + info.day.can + '</h3><p>' + esc(data.byCan[info.day.can] || '') + '</p>' +
        '<h3>Đường học vấn theo mệnh ' + yi.el + '</h3><p>' + esc(data.byMenh[yi.el] || '') + '</p>' +
        '<h3>Phong cách học theo số chủ đạo ' + lp + '</h3><p>' + LP_STUDY[String(lp)] + '</p>' +
        '<p class="ptv-note">Ba lớp luận trên là ba hệ tham khảo khác nhau (can ngày, mệnh nạp âm, thần số học) do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> trình bày minh bạch để bạn đối chiếu. Học vấn thành hay bại, cuối cùng vẫn do nỗ lực và phương pháp của chính bạn.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#hv-exam form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#hv-exam'), dt = rd(box), ey = parseInt(box.querySelector('#ey').value, 10);
      if (!ey) { L.resultBox(box, '<p>Bạn nhập năm dự định thi nhé.</p>'); return; }
      var info = D.dayInfo(new Date(dt.y, dt.m - 1, dt.d)), yi = L.yearInfo(info.lunar.y);
      var eyInfo = L.yearInfo(ey);
      var rel, verdict;
      if (L.GENERATES[eyInfo.el] === yi.el) { rel = 'hành của năm sinh ra mệnh của bạn'; verdict = 'Theo ngũ hành đây là năm được nâng đỡ: hành lưu niên sinh mệnh, thường ứng với việc gặp thầy tốt, hồ sơ và thủ tục hanh thông. Hãy tận dụng năm này cho kỳ thi quan trọng nhất.'; }
      else if (yi.el === eyInfo.el) { rel = 'cùng hành với mệnh của bạn'; verdict = 'Năm tỷ hòa, vận khí ổn định và quen thuộc: kết quả phụ thuộc gần như hoàn toàn vào mức độ ôn luyện, không có gió ngược cũng không có gió xuôi đáng kể.'; }
      else if (L.GENERATES[yi.el] === eyInfo.el) { rel = 'mệnh của bạn sinh ra hành của năm'; verdict = 'Năm sinh xuất, bạn phải bỏ nhiều công sức hơn thường lệ: dễ mệt, dễ phân tán. Nên bắt đầu ôn sớm hơn dự định và giữ sức khỏe, thay vì dồn vào nước rút.'; }
      else if (L.CONTROLS[eyInfo.el] === yi.el) { rel = 'hành của năm khắc mệnh của bạn'; verdict = 'Năm khắc nhập, áp lực cao hơn mặt bằng chung: dễ gặp trục trặc thủ tục hoặc tâm lý phòng thi. Cách hóa giải thực tế nhất là chuẩn bị sớm, dự phòng giấy tờ và phương án B, thi thử nhiều lần cho quen áp lực.'; }
      else { rel = 'mệnh của bạn khắc hành của năm'; verdict = 'Năm bạn ở thế chủ động khắc chế: hợp để bứt phá và cạnh tranh, nhưng tránh chủ quan khinh suất ở những phần tưởng là dễ.'; }
      var html = '<h3>Năm ' + ey + ' (' + eyInfo.text + ', mệnh ' + esc(eyInfo.napAm) + ') với người mệnh ' + yi.el + '</h3>' +
        '<p>Quan hệ ngũ hành: <strong>' + rel + '</strong>. ' + verdict + '</p>' +
        '<p class="ptv-note">Luận năm thi theo quan hệ hành của lưu niên với bản mệnh chỉ là một lớp tham khảo dân gian. Lịch thi, đề thi và sự chuẩn bị của bạn mới là những yếu tố quyết định thật sự.</p>';
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'giai-ma-hau-kiep': hauKiepV2, 'xem-duong-hoc-van': hocVanV2 });
})();

/* --- La bai ban menh + Tu vi tay phuong v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function df4(p) {
    return '<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="' + p + 'd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="' + p + 'm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="' + p + 'y" inputmode="numeric" value="1995">') + '</div>';
  }
  var TAROTX = [
    ['Kẻ Khờ', 'Khởi đầu mới, sự hồn nhiên và một bước nhảy niềm tin.', 'Dám bắt đầu, không sợ sai, năng lượng tươi mới.', 'Dễ liều lĩnh và thiếu chuẩn bị, nhảy việc theo cảm hứng.', 'Khi lá này ngược, bạn đang chần chừ trước một khởi đầu cần thiết, hoặc ngược lại đang liều mà chưa nhìn xuống chân mình.'],
    ['Pháp Sư', 'Năng lực và sự chủ động đang ở trong tay bạn.', 'Biến ý tưởng thành việc thật, giỏi xoay xở nguồn lực.', 'Dễ ôm đồm và tin rằng một mình làm được tất cả.', 'Lá ngược nhắc bạn đang có đủ công cụ nhưng chưa chịu bắt tay, hoặc đang dùng khéo léo vào việc chưa xứng đáng.'],
    ['Nữ Tư Tế', 'Trực giác và những điều chưa nói thành lời.', 'Trực giác nhạy, giữ được bí mật, nhìn thấu ý người.', 'Dễ khép mình, để cảm xúc ngầm chi phối quyết định.', 'Lá ngược cho thấy bạn đang bỏ qua tiếng nói bên trong, hoặc một thông tin quan trọng vẫn còn bị giấu.'],
    ['Nữ Hoàng', 'Sự đủ đầy, chăm sóc và sáng tạo.', 'Nuôi dưỡng người khác và cả dự án của mình tới nơi tới chốn.', 'Dễ ôm hết việc chăm sóc mà quên bản thân.', 'Lá ngược nhắc bạn đang kiệt sức vì cho đi quá nhiều, hoặc một việc sáng tạo đang bị bỏ bê.'],
    ['Hoàng Đế', 'Kỷ luật, cấu trúc và trách nhiệm.', 'Dựng nền chắc, giữ chữ tín, quản việc có hệ thống.', 'Dễ cứng nhắc và khó nhận sai trước người thân.', 'Lá ngược cảnh báo sự kiểm soát quá mức, hoặc ngược lại là thiếu kỷ luật ở đúng chỗ cần nhất.'],
    ['Giáo Hoàng', 'Truyền thống, thầy dạy và niềm tin.', 'Học từ người đi trước, tôn trọng nền nếp tốt.', 'Dễ lệ thuộc vào khuôn mẫu, ngại làm khác số đông.', 'Lá ngược gợi ý bạn nên tự kiểm chứng thay vì tin theo lời khuyên quen thuộc trong việc này.'],
    ['Người Tình', 'Lựa chọn của trái tim.', 'Chân thành trong tình cảm, dám chọn và chịu với lựa chọn.', 'Dễ đứng giữa hai lựa chọn quá lâu.', 'Lá ngược cho thấy một lựa chọn đang bị ép buộc hoặc trái lòng, cần rõ ràng trước khi đi tiếp.'],
    ['Cỗ Xe', 'Chiến thắng nhờ ý chí và sự tập trung.', 'Quyết tâm cao, giữ hướng tốt dưới áp lực cạnh tranh.', 'Dễ thắng việc mà thua người, nóng vội ở chặng cuối.', 'Lá ngược nhắc bạn đang mất lái vì ôm hai hướng cùng lúc, cần chọn một mục tiêu chính.'],
    ['Sức Mạnh', 'Sức mạnh mềm, kiên nhẫn và can đảm điềm tĩnh.', 'Thu phục bằng bình tĩnh, bền bỉ đáng nể.', 'Dễ nén cảm xúc quá lâu rồi bùng phát.', 'Lá ngược cho thấy bạn đang tự nghi ngờ mình, hoặc đang dùng sức cứng với việc cần sự mềm mỏng.'],
    ['Ẩn Sĩ', 'Cần thời gian một mình để nhìn lại.', 'Sâu sắc, tự soi chiếu tốt, không chạy theo ồn ào.', 'Dễ thu mình quá lâu và bỏ lỡ người sẵn lòng giúp.', 'Lá ngược nhắc bạn đã ở trong hang đủ lâu, đến lúc mang điều đã ngộ ra trở lại với đời sống.'],
    ['Bánh Xe Số Phận', 'Vận đang xoay chiều, cơ hội bất ngờ sắp tới.', 'Nắm bắt thời cơ nhanh, thích nghi giỏi.', 'Dễ phó mặc cho may rủi ở việc đáng ra tự quyết được.', 'Lá ngược cho thấy vận đang chậm lại ngoài ý muốn, việc cần làm là giữ vị thế thay vì cưỡng cầu.'],
    ['Công Lý', 'Cân bằng và hậu quả rõ ràng.', 'Công bằng, minh bạch giấy tờ, nghĩ trước hậu quả.', 'Dễ khắt khe với lỗi nhỏ của người khác.', 'Lá ngược cảnh báo một việc đang thiếu công bằng hoặc giấy tờ chưa rõ ràng, cần rà soát kỹ.'],
    ['Người Treo', 'Tạm dừng để nhìn việc từ góc khác.', 'Chịu dừng đúng lúc, hy sinh ngắn hạn cho dài hạn.', 'Dễ kẹt trong thế chờ đợi quá lâu.', 'Lá ngược cho thấy sự trì hoãn đã hết tác dụng, bạn đang treo mình vì sợ quyết định.'],
    ['Thần Chết', 'Một chương cũ khép lại để chương mới mở ra.', 'Dám kết thúc điều đã hết thời, tái sinh mạnh mẽ.', 'Dễ níu giữ quá khứ vì sợ khoảng trống.', 'Lá ngược cho thấy bạn đang chống lại một kết thúc tất yếu, càng giữ càng mệt.'],
    ['Tiết Độ', 'Điều hòa, cân bằng và chữa lành.', 'Pha trộn khéo các yếu tố, chữa lành tốt cho mình và người.', 'Dễ dĩ hòa vi quý tới mức né tránh vấn đề thật.', 'Lá ngược nhắc nhịp sống đang mất cân bằng, cần cắt bớt một đầu việc hoặc một thói quen.'],
    ['Ác Quỷ', 'Cẩn thận với cám dỗ và thói quen đang trói bạn.', 'Tham vọng mạnh, chịu được áp lực vật chất cao.', 'Dễ lệ thuộc vào tiền, khoái lạc hoặc một mối quan hệ độc hại.', 'Lá ngược là tín hiệu tốt: bạn đang bắt đầu thoát ra khỏi thứ từng trói mình.'],
    ['Tháp Đổ', 'Một biến cố bất ngờ phá vỡ điều cũ.', 'Chịu sốc tốt, dựng lại nhanh trên nền đúng hơn.', 'Dễ chủ quan rằng nền móng của mình không thể sập.', 'Lá ngược cho thấy biến cố đã qua đỉnh, hoặc một sự thật đang bị trì hoãn công bố.'],
    ['Ngôi Sao', 'Hy vọng, cảm hứng và sự hồi phục.', 'Truyền cảm hứng, hồi phục sau khó khăn rất tốt.', 'Dễ mơ xa mà thiếu bước đi cụ thể.', 'Lá ngược nhắc bạn đang tạm mất niềm tin, cần một thắng lợi nhỏ để thắp lại hy vọng.'],
    ['Mặt Trăng', 'Mọi việc còn mờ, cảm xúc dễ đánh lừa lý trí.', 'Trực cảm mạnh, giàu tưởng tượng và thấu cảm.', 'Dễ quyết định lớn khi thông tin chưa rõ.', 'Lá ngược cho thấy sương mù đang tan, một điều từng mơ hồ sắp rõ ràng.'],
    ['Mặt Trời', 'Niềm vui, thành công và sự rõ ràng.', 'Lạc quan có cơ sở, tỏa sáng tự nhiên, được yêu quý.', 'Dễ chủ quan vì mọi việc đang quá thuận.', 'Lá ngược chỉ là niềm vui bị chậm lại, không phải mất đi, cứ làm rõ từng việc nhỏ.'],
    ['Phán Xét', 'Tiếng gọi thức tỉnh và cơ hội làm lại.', 'Dám nhìn lại quá khứ và làm lại tử tế.', 'Dễ tự phán xét mình quá nặng.', 'Lá ngược nhắc bạn đang né một lời gọi thay đổi, hoặc chưa tha thứ cho mình về chuyện cũ.'],
    ['Thế Giới', 'Hoàn thành một chu trình lớn, viên mãn và được ghi nhận.', 'Nhìn toàn cục tốt, khép việc trọn vẹn.', 'Dễ tự mãn ở đỉnh và ngại bắt đầu chu trình mới.', 'Lá ngược cho thấy một việc đang thiếu đúng một bước cuối để hoàn thành, đừng bỏ dở.']
  ];
  function laBaiV2(c) {
    c.innerHTML = V.tabsHTML([['lbm-main', 'Lá bài bản mệnh của bạn'], ['lbm-ask', 'Rút bài cho một câu hỏi'], ['lbm-all', 'Tra cứu 22 lá ẩn chính']]) +
      '<div id="lbm-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Họ tên của bạn', '<input type="text" id="nm" value="">', 'ptv-field-name') + '</div>' + df4('b'), 'Rút lá bài bản mệnh') + '</div>' +
      '<div id="lbm-ask" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Câu hỏi bạn đang băn khoăn (viết ngắn gọn)', '<input type="text" id="q" value="">', 'ptv-field-name') + '</div>', 'Rút một lá cho câu hỏi này') + '</div>' +
      '<div id="lbm-all" hidden><div class="ptv-out"></div></div>';
    V.wireTabs(c, ['lbm-main', 'lbm-ask', 'lbm-all']);
    c.querySelector('#lbm-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lbm-main');
      var seed = (box.querySelector('#nm').value || '').toLowerCase() + '|' + box.querySelector('#bd').value + '/' + box.querySelector('#bm').value + '/' + box.querySelector('#by').value;
      var card = TAROTX[L.hashStr('tarot|' + seed) % 22];
      var html = '<div class="ptv-kieu-verse"><p>🃏 ' + card[0] + '</p></div>' +
        '<p><strong>Thông điệp cốt lõi:</strong> ' + card[1] + '</p>' +
        '<p><strong>Thế mạnh bản mệnh của bạn:</strong> ' + card[2] + '</p>' +
        '<p><strong>Điểm cần rèn:</strong> ' + card[3] + '</p>' +
        '<p class="ptv-note">Lá bài bản mệnh được rút CỐ ĐỊNH theo họ tên và ngày sinh, nên mỗi người gắn với một lá duy nhất trong 22 lá ẩn chính của bộ Tarot. Hãy đọc lá bài như một tấm gương tính cách: thế mạnh để phát huy và điểm cần rèn để tránh, thay vì một lời tiên tri.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#lbm-ask form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lbm-ask'), q = (box.querySelector('#q').value || '').trim();
      if (!q) { L.resultBox(box, '<p>Bạn viết câu hỏi ngắn gọn trước khi rút bài nhé.</p>'); return; }
      var now = new Date(), dayKey = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
      var h = L.hashStr('ask|' + q.toLowerCase() + '|' + dayKey);
      var card = TAROTX[h % 22], reversed = (h % 5 === 0);
      var html = '<div class="ptv-kieu-verse"><p>🃏 ' + card[0] + (reversed ? ' (lá ngược)' : '') + '</p></div>' +
        '<p><strong>Câu hỏi:</strong> ' + esc(q) + '</p>' +
        (reversed ? '<p>' + card[4] + '</p>' : '<p>' + card[1] + ' Áp vào câu hỏi của bạn: ' + card[2] + '</p>') +
        '<p class="ptv-note">Lá bài cho câu hỏi được gieo theo câu hỏi và ngày hôm nay, cùng một câu hỏi trong cùng một ngày sẽ ra cùng một lá, qua ngày mới kết quả có thể khác. Đây là gợi ý để suy ngẫm trước quyết định, không thay thế được phân tích thực tế của bạn.</p>';
      L.resultBox(box, html);
    });
    var rendered = false;
    c.querySelector('[data-t="lbm-all"]').addEventListener('click', function () {
      if (rendered) return; rendered = true;
      var rows = TAROTX.map(function (t, i) { return '<tr><td><strong>' + (i + 1) + '. ' + t[0] + '</strong></td><td>' + t[1] + '</td></tr>'; }).join('');
      c.querySelector('#lbm-all .ptv-out').innerHTML = '<h3>22 lá ẩn chính (Major Arcana) và thông điệp cốt lõi</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Lá bài</th><th>Thông điệp</th></tr>' + rows + '</table></div>';
    });
  }

  var YEAR_TXT = {
    career: ['Năm nay cung sự nghiệp của bạn sáng dần từ giữa năm, một cơ hội đổi vai trò hoặc nhận dự án lớn xuất hiện khi bạn chủ động đề xuất thay vì chờ giao việc.', 'Đây là năm tích lũy vị thế: làm chắc việc chuyên môn, xây quan hệ với người có tiếng nói, thành quả lớn thường chốt vào cuối năm.', 'Sự nghiệp năm nay có biến động theo hướng buộc bạn nâng cấp kỹ năng; ai chịu học thêm sẽ biến biến động thành bậc thang.'],
    money: ['Tài chính năm nay ổn định nếu giữ kỷ luật chi tiêu theo tháng; khoản bất ngờ đến từ việc phụ hoặc tài sản cũ hơn là đầu tư mạo hiểm.', 'Năm nay hợp trả nợ và gom vốn hơn là mở rộng; một quyết định tài chính vào quý ba cần đọc kỹ giấy tờ trước khi ký.', 'Tiền bạc năm nay vào đều nhưng ra cũng nhanh theo cảm xúc; đặt trần chi tiêu cho sở thích sẽ giữ được khoản tích lũy đáng kể.'],
    love: ['Chuyện tình cảm năm nay có chuyển biến rõ: người độc thân dễ gặp nhân duyên qua công việc và bạn bè chung, người có đôi cần thêm thời gian chất lượng thay vì quà cáp.', 'Năm nay là năm của sự rõ ràng trong tình cảm: điều gì mập mờ sẽ tự lộ diện, và đó là điều tốt dù ban đầu hơi khó nghe.', 'Tình cảm năm nay ấm dần nhờ những việc nhỏ đều đặn; một chuyến đi chung hoặc kế hoạch chung sẽ gắn kết hai người hơn hẳn lời hứa lớn.'],
    health: ['Sức khỏe năm nay cần chú ý giấc ngủ và cột sống; đừng để công việc dồn nén thành stress kéo dài, khám định kỳ đúng hẹn là việc không nên hoãn.', 'Năm nay thể lực hồi phục tốt nếu bạn giữ vận động đều; kỵ nhất là thức khuya triền miên và ăn uống thất thường theo lịch làm việc.', 'Sức khỏe năm nay nhìn chung ổn, điểm yếu nằm ở tinh thần: dành thời gian cho sở thích và người thân là liều thuốc phòng ngừa tốt nhất.']
  };
  function tuViTayV2(c) {
    var zlist = (window.PTV_TOOLS_DATA || {}).zodiac || [];
    function zOf(dt) { var b = [[3, 21, 4, 19], [4, 20, 5, 20], [5, 21, 6, 21], [6, 22, 7, 22], [7, 23, 8, 22], [8, 23, 9, 22], [9, 23, 10, 23], [10, 24, 11, 22], [11, 23, 12, 21], [12, 22, 1, 19], [1, 20, 2, 18], [2, 19, 3, 20]]; for (var i = 0; i < 12; i++) { if ((dt.m === b[i][0] && dt.d >= b[i][1]) || (dt.m === b[i][2] && dt.d <= b[i][3])) return zlist[i]; } return zlist[9]; }
    function zHTML(z) { return '<h3>' + esc(z.sign) + ' (' + esc(z.dates) + ') · Hành ' + esc(z.element) + '</h3><p>' + esc(z.traits) + '</p><p><strong>Sự nghiệp:</strong> ' + esc(z.career) + '</p><p><strong>Tình duyên:</strong> ' + esc(z.love) + '</p><p><strong>May mắn:</strong> ' + esc(z.lucky) + '</p>'; }
    c.innerHTML = V.tabsHTML([['tvt-year', 'Tử vi năm nay theo cung'], ['tvt-month', 'Tử vi tháng này theo cung']]) +
      '<div id="tvt-year">' + V.formWrap2(df4('b'), 'Xem tử vi năm nay') + '</div>' +
      '<div id="tvt-month" hidden>' + V.formWrap2(df4('b'), 'Xem tử vi tháng này') + '</div>';
    V.wireTabs(c, ['tvt-year', 'tvt-month']);
    function pick(z, tag, n) { var arr = YEAR_TXT[tag]; return arr[L.hashStr(z.sign + '|' + tag + '|' + n) % arr.length]; }
    c.querySelector('#tvt-year form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tvt-year');
      var dt = { d: parseInt(box.querySelector('#bd').value, 10), m: parseInt(box.querySelector('#bm').value, 10), y: parseInt(box.querySelector('#by').value, 10) };
      var z = zOf(dt), yr = new Date().getFullYear();
      var html = zHTML(z) + '<h3>Tử vi năm ' + yr + ' của ' + z.sign + '</h3>' +
        '<p><strong>Sự nghiệp:</strong> ' + pick(z, 'career', yr) + '</p>' +
        '<p><strong>Tài chính:</strong> ' + pick(z, 'money', yr) + '</p>' +
        '<p><strong>Tình cảm:</strong> ' + pick(z, 'love', yr) + '</p>' +
        '<p><strong>Sức khỏe:</strong> ' + pick(z, 'health', yr) + '</p>' +
        '<p class="ptv-note">Phần tử vi năm do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> luận theo cung hoàng đạo ở mức tổng quan tham khảo, không phải lá số chiêm tinh cá nhân đầy đủ.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#tvt-month form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tvt-month');
      var dt = { d: parseInt(box.querySelector('#bd').value, 10), m: parseInt(box.querySelector('#bm').value, 10), y: parseInt(box.querySelector('#by').value, 10) };
      var z = zOf(dt), now = new Date(), mk = now.getFullYear() * 100 + (now.getMonth() + 1);
      var html = '<h3>Tử vi tháng ' + (now.getMonth() + 1) + '/' + now.getFullYear() + ' của ' + z.sign + '</h3>' +
        '<p><strong>Công việc và tiền bạc:</strong> ' + pick(z, 'career', mk) + ' Về tiền: ' + pick(z, 'money', mk) + '</p>' +
        '<p><strong>Tình cảm và sức khỏe:</strong> ' + pick(z, 'love', mk) + ' Về sức khỏe: ' + pick(z, 'health', mk) + '</p>' +
        '<p class="ptv-note">Luận tháng ở mức tổng quan theo cung, dùng để lên tâm thế và lịch trình là chính.</p>';
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'la-bai-ban-menh': laBaiV2, 'xem-tu-vi-tay-phuong': tuViTayV2 });
})();

/* --- Gieo que Quan Thanh + Giai ma giac mo v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var QT_TONES = {
    'Thượng thượng': { verse: ['Mây tan trời sáng tỏ', 'Đường rộng thênh thang mở lối về', 'Việc cầu như ý nguyện', 'Quý nhân đưa bước chẳng hề sai'], text: 'Đây là quẻ thượng thượng, cát tường bậc nhất. Việc bạn cầu đang ở thế thuận buồm xuôi gió, nên mạnh dạn tiến hành, đồng thời nhớ chia sẻ phúc lộc cho người xung quanh để giữ bền.', nen: 'Mạnh dạn bắt đầu việc đã dự định, ký kết và mở rộng trong lúc vận đang sáng.', khong: 'Đừng vì quá thuận mà chủ quan bỏ qua khâu kiểm tra giấy tờ và lời hứa miệng.' },
    'Thượng': { verse: ['Suối nguồn vừa mở lối', 'Cây khô gặp tiết xuân sang', 'Công danh tài lộc rõ ràng', 'Chậm mà chắc chắn, chớ mang vội vàng'], text: 'Quẻ thượng, điềm lành rõ rệt. Việc cầu có quý nhân đỡ, kết quả tốt nếu bạn làm đúng trình tự và giữ chữ tín.', nen: 'Làm đúng trình tự, giữ chữ tín và nhờ người có kinh nghiệm đỡ đầu.', khong: 'Đừng nóng vội đốt cháy giai đoạn, quẻ tốt nhưng kỵ sự hấp tấp.' },
    'Trung': { verse: ['Nửa mừng nửa lại lo', 'Đường đi khúc khuỷu chưa thông', 'Giữ lòng cho vững chớ nông', 'Qua cơn bĩ cực tới vòng thái lai'], text: 'Quẻ trung bình, tốt xấu đan xen. Việc cầu chưa thành ngay, cần kiên nhẫn và điều chỉnh từng bước, tránh quyết định bốc đồng.', nen: 'Chia việc lớn thành bước nhỏ, làm tới đâu chắc tới đó và giữ phương án dự phòng.', khong: 'Đừng đặt cược toàn bộ vào một quyết định trong lúc đường đi chưa thông.' },
    'Hạ': { verse: ['Gió mưa đương buổi tối trời', 'Thuyền con chớ vội ra khơi lúc này', 'Giữ mình chờ đợi đổi thay', 'Cẩn thận lời nói, việc hay hóa dở'], text: 'Quẻ hạ, điềm chưa thuận. Nên thu mình chờ thời, tránh đầu tư mạo hiểm và các việc cần quyết nhanh trong lúc này.', nen: 'Thu mình, hoàn thiện phần chuẩn bị và giữ gìn sức khỏe, gia đạo yên ổn là thắng lợi lúc này.', khong: 'Đừng ra quyết định lớn, đầu tư mạo hiểm hay tranh cãi đúng sai khi vận đang tối.' },
    'Hạ hạ': { verse: ['Đêm dài chưa thấy ánh dương', 'Việc cầu trắc trở trăm đường khó khăn', 'An lòng giữ phận ân cần', 'Qua được vận hạn, phúc phần lại sinh'], text: 'Quẻ hạ hạ, giai đoạn khó khăn nhất thời. Đừng cưỡng cầu việc lớn, hãy chăm lo sức khỏe và gia đạo, vận sẽ đổi khi thời điểm chín muồi.', nen: 'Chăm lo sức khỏe và gia đạo, làm việc thiện lặng lẽ và chờ qua giai đoạn khó.', khong: 'Đừng cưỡng cầu việc lớn, vay mượn lớn hay thay đổi chỗ ở, công việc trong lúc này.' }
  };
  var QT_ORDER = ['Thượng thượng', 'Thượng', 'Thượng', 'Trung', 'Trung', 'Trung', 'Trung', 'Hạ', 'Hạ', 'Hạ hạ'];
  var QT_TOPICS = {
    'Tổng quát': 'Xét tổng thể, quẻ này nói về xu hướng chung của việc bạn cầu trong giai đoạn này. Hãy đối chiếu thêm hoàn cảnh thực tế của mình trước khi quyết.',
    'Tài lộc': 'Về tài lộc: quẻ sáng thì hợp mở rộng và ký kết làm ăn, quẻ tối thì kỵ đầu tư theo lời rủ rê và cho vay số tiền lớn.',
    'Công danh': 'Về công danh và thi cử: quẻ sáng báo hiệu sự ghi nhận xứng đáng nếu hồ sơ và chuẩn bị đã chu toàn, quẻ tối khuyên bạn bổ sung phần còn thiếu thay vì nôn nóng.',
    'Tình duyên': 'Về tình duyên: quẻ sáng hợp bày tỏ và tiến thêm một bước rõ ràng, quẻ tối nhắc bạn chậm lại để nhìn đúng lòng mình và lòng người.',
    'Sức khỏe': 'Về sức khỏe: quẻ này chỉ là lời nhắc về tâm thế, người đang có bệnh vẫn phải theo điều trị của bác sĩ. Quẻ tối là lời nhắc đi khám sớm thay vì tự chịu đựng.',
    'Gia đạo': 'Về gia đạo: quẻ sáng là lúc hợp bàn việc lớn trong nhà, quẻ tối thì nhường nhịn và tránh tranh cãi chuyện cũ là cách giữ yên cửa nhà.'
  };
  function qtResult(n, topic) {
    var tone = QT_ORDER[L.hashStr('qt|' + n) % 10], t = QT_TONES[tone];
    return '<div class="ptv-kieu-verse">' + t.verse.map(function (v) { return '<p>' + v + '</p>'; }).join('') + '</div>' +
      '<h3>Quẻ Quan Thánh số ' + n + ' · ' + tone + '</h3><p>' + t.text + '</p>' +
      '<p><strong>Cầu về ' + topic.toLowerCase() + ':</strong> ' + QT_TOPICS[topic] + '</p>' +
      '<p><strong>Việc nên làm:</strong> ' + t.nen + '</p><p><strong>Việc nên tránh:</strong> ' + t.khong + '</p>';
  }
  function quanThanhV2(c) {
    c.innerHTML = V.tabsHTML([['qt-draw', 'Rút quẻ Quan Thánh'], ['qt-lookup', 'Tra quẻ theo số']]) +
      '<div id="qt-draw"><div class="ptv-form"><p style="margin-top:0">Thành tâm khấn nguyện, chọn việc muốn cầu và nghĩ về điều đó, rồi bấm rút quẻ. Mỗi quẻ gồm thơ quẻ, luận giải tổng quát và phần luận riêng theo việc bạn cầu.</p>' +
      '<div class="ptv-row">' + L.field('Bạn cầu việc gì', L.select('topic', Object.keys(QT_TOPICS).map(function (t) { return '<option value="' + t + '">' + t + '</option>'; }).join(''))) + '</div>' +
      '<div class="ptv-kieu-verse" id="ptv-qt2"><p>🏮</p></div>' +
      '<button type="button" class="ptv-btn" id="ptv-qt2-btn">Rút quẻ Quan Thánh</button></div><div class="ptv-out"></div></div>' +
      '<div id="qt-lookup" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Số quẻ (1 đến 100)', '<input type="text" id="n" inputmode="numeric" value="1">') + '</div>', 'Tra quẻ số này') + '</div>';
    V.wireTabs(c, ['qt-draw', 'qt-lookup']);
    var shaking = false;
    c.querySelector('#ptv-qt2-btn').addEventListener('click', function () {
      if (shaking) return; shaking = true;
      var box = c.querySelector('#qt-draw'), verseBox = box.querySelector('#ptv-qt2');
      verseBox.innerHTML = '<p>🏮 Ống quẻ đang lắc... hãy giữ điều muốn cầu trong lòng.</p>';
      setTimeout(function () {
        shaking = false;
        var n = 1 + Math.floor(Math.random() * 100), topic = box.querySelector('#topic').value;
        var html = qtResult(n, topic) + '<p class="ptv-note">Thơ quẻ tại <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> được biên soạn theo đẳng quẻ (thượng thượng tới hạ hạ) để giữ đúng tinh thần quẻ Quan Thánh, chưa phải nguyên văn 100 bài thơ tại đền. Trang công bố rõ điều này để bạn đọc với tâm thế đúng mực.</p>';
        var t = QT_TONES[QT_ORDER[L.hashStr('qt|' + n) % 10]];
        verseBox.innerHTML = t.verse.map(function (v) { return '<p>' + v + '</p>'; }).join('');
        L.resultBox(box, html);
        try {
          var hist = JSON.parse(localStorage.getItem('ptvQuanThanhHistory') || '[]');
          hist.unshift({ n: n, topic: topic });
          localStorage.setItem('ptvQuanThanhHistory', JSON.stringify(hist.slice(0, 5)));
        } catch (e) {}
      }, 900);
    });
    c.querySelector('#qt-lookup form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#qt-lookup'), n = parseInt(box.querySelector('#n').value, 10);
      if (!n || n < 1 || n > 100) { L.resultBox(box, '<p>Số quẻ hợp lệ từ 1 đến 100, bạn kiểm tra lại nhé.</p>'); return; }
      L.resultBox(box, qtResult(n, 'Tổng quát') + '<p class="ptv-note">Đẳng quẻ của từng số được giữ cố định theo truyền thống chia quẻ, thơ quẻ theo đẳng như phần giới thiệu ở tab rút quẻ.</p>');
    });
  }

  function giacMoV2(c) {
    var dict = (window.PTV_TOOLS_DATA || {}).dreamDict || [];
    c.innerHTML = V.tabsHTML([['gm-search', 'Kể giấc mơ của bạn'], ['gm-dict', 'Từ điển giấc mơ phổ biến']]) +
      '<div id="gm-search">' + V.formWrap2('<div class="ptv-row">' + L.field('Bạn mơ thấy điều gì?', '<input type="text" id="q" value="" placeholder="Ví dụ: mơ thấy rắn bò vào nhà">', 'ptv-field-name') + '</div>', 'Giải mã giấc mơ') + '</div>' +
      '<div id="gm-dict" hidden><div class="ptv-out"></div></div>';
    V.wireTabs(c, ['gm-search', 'gm-dict']);
    c.querySelector('#gm-search form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#gm-search'), q = (box.querySelector('#q').value || '').toLowerCase();
      var matched = [];
      dict.forEach(function (e) {
        var bestK = 0;
        (e.keywords || []).forEach(function (k) { if (q.indexOf(k.toLowerCase()) >= 0 && k.length > bestK) bestK = k.length; });
        if (bestK) matched.push({ e: e, score: bestK });
      });
      matched.sort(function (a, b) { return b.score - a.score; });
      if (!matched.length) {
        L.resultBox(box, '<p>Chưa tìm thấy hình ảnh khớp với mô tả của bạn trong từ điển ' + dict.length + ' giấc mơ phổ biến. Bạn thử kể ngắn gọn bằng hình ảnh chính, ví dụ "rắn", "nước", "tiền", "răng rụng", hoặc mở tab từ điển bên cạnh để tra theo danh sách nhé.</p>');
        return;
      }
      var top = matched[0].e;
      var html = '<h3>' + esc(top.subject) + '</h3><p>' + esc(top.meaning) + '</p><p><strong>Con số gợi ý từ giấc mơ:</strong> ' + (top.numbers || []).join(', ') + '.</p>';
      if (matched.length > 1) {
        html += '<h3>Các hình ảnh khác cũng xuất hiện trong giấc mơ của bạn</h3>' + matched.slice(1, 4).map(function (m) { return '<p><strong>' + esc(m.e.subject) + ':</strong> ' + esc(m.e.meaning.split('.')[0]) + '. Con số gợi ý: ' + (m.e.numbers || []).join(', ') + '.</p>'; }).join('');
      }
      html += '<p class="ptv-note">Giải mã giấc mơ là lớp luận giải dân gian kết hợp tâm lý học phổ thông, dùng để suy ngẫm về những điều đang diễn ra trong đời bạn. Con số đi kèm mang tính giải trí, <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> không khuyến khích dùng vào mục đích cờ bạc.</p>';
      L.resultBox(box, html);
    });
    var rendered = false;
    c.querySelector('[data-t="gm-dict"]').addEventListener('click', function () {
      if (rendered) return; rendered = true;
      var rows = dict.map(function (e) { return '<tr><td><strong>' + esc(e.subject) + '</strong></td><td>' + (e.numbers || []).join(', ') + '</td></tr>'; }).join('');
      c.querySelector('#gm-dict .ptv-out').innerHTML = '<h3>Từ điển ' + dict.length + ' giấc mơ phổ biến và con số gợi ý</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Giấc mơ</th><th>Con số gợi ý</th></tr>' + rows + '</table></div><p class="ptv-note">Muốn đọc phần luận giải đầy đủ của một giấc mơ, bạn quay lại tab kể giấc mơ và gõ hình ảnh đó vào ô tìm.</p>';
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'gieo-que-quan-thanh': quanThanhV2, 'giai-ma-giac-mo': giacMoV2 });
})();

/* --- Luc thap tu quai + Luan con so trong mo v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2, W3 = window.PTVToolsW3a || {};
  var queLookup = W3._queLookup, QUE_TEXT = W3._QUE_TEXT || {};
  var TRI8 = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
  var RATING_ADVICE = {
    'Cát': { 'Tài lộc': 'Quẻ Cát về tài lộc: hợp mở rộng có tính toán, ký kết và thu hồi vốn; vẫn giữ nguyên tắc không đặt hết trứng vào một giỏ.', 'Công việc': 'Quẻ Cát về công việc: nên chủ động nhận việc khó và đề xuất ý tưởng, đây là lúc tiếng nói của bạn có trọng lượng.', 'Tình cảm': 'Quẻ Cát về tình cảm: hợp bày tỏ rõ ràng và tính chuyện lâu dài, sự chân thành lúc này được đáp lại xứng đáng.', 'Gia đạo': 'Quẻ Cát về gia đạo: nhà có việc vui hoặc cơ hội sum họp, nên tranh thủ gắn kết các thế hệ trong nhà.' },
    'Bình': { 'Tài lộc': 'Quẻ Bình về tài lộc: giữ nhịp hiện tại, ưu tiên an toàn vốn, tránh quyết định theo cảm xúc trong ngày.', 'Công việc': 'Quẻ Bình về công việc: làm tốt phần việc của mình và tích lũy thêm kỹ năng, cơ hội lớn chưa tới nhưng đang được chuẩn bị.', 'Tình cảm': 'Quẻ Bình về tình cảm: quan hệ cần thêm sự quan tâm đều đặn hơn là biến động lớn, đừng để sự quen thuộc thành thờ ơ.', 'Gia đạo': 'Quẻ Bình về gia đạo: nhà yên ổn, nên dành thời gian cho người lớn tuổi và sắp xếp lại những việc nhà tồn đọng.' },
    'Hung': { 'Tài lộc': 'Quẻ chưa thuận về tài lộc: hoãn đầu tư và cho vay, giữ tiền mặt và rà soát lại các cam kết đang dang dở.', 'Công việc': 'Quẻ chưa thuận về công việc: tránh tranh cãi và đổi việc bốc đồng, làm chắc phần việc hiện tại chờ qua giai đoạn này.', 'Tình cảm': 'Quẻ chưa thuận về tình cảm: chậm lại để hiểu nhau, tránh quyết định chia tay hay kết hôn trong lúc cảm xúc đang nóng.', 'Gia đạo': 'Quẻ chưa thuận về gia đạo: nhường nhịn và tránh bàn việc lớn khi mọi người đang căng thẳng, sức khỏe người già trong nhà cần được để ý.' }
  };
  function queFullHTML(q) {
    if (!q) return '<p>Chưa tra được quẻ này.</p>';
    var adv = RATING_ADVICE[q.rating] || {};
    var topics = Object.keys(adv).map(function (t) { return '<p><strong>' + t + ':</strong> ' + adv[t] + '</p>'; }).join('');
    return '<h3>Quẻ ' + esc(q.name) + ' <span class="' + (q.rating === 'Cát' ? 'ptv-good' : q.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad') + '">(' + q.rating + ')</span></h3>' +
      '<p>Quẻ thượng ' + q.upper + ', quẻ hạ ' + q.lower + '. ' + (QUE_TEXT[q.name] || '') + '</p>' +
      '<h3>Đọc quẻ này theo từng việc</h3>' + topics +
      '<p class="ptv-note">Phần đọc theo việc là lớp luận ứng dụng theo đẳng quẻ Cát, Bình, Hung do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> biên soạn để bạn đối chiếu với hoàn cảnh của mình.</p>';
  }
  function lucThapV2(c) {
    var list = (window.PTV_DATA || {}).que64 || [];
    var triOpts = TRI8.map(function (t) { return '<option>' + t + '</option>'; }).join('');
    var nameOpts = list.map(function (q) { return '<option value="' + q.name + '">' + q.name + '</option>'; }).join('');
    c.innerHTML = V.tabsHTML([['lt-tri', 'Tra theo quẻ thượng, quẻ hạ'], ['lt-name', 'Tra theo tên quẻ'], ['lt-all', 'Bảng 64 quẻ']]) +
      '<div id="lt-tri">' + V.formWrap2('<div class="ptv-row">' + L.field('Quẻ thượng', L.select('up', triOpts)) + L.field('Quẻ hạ', L.select('lo', triOpts)) + '</div>', 'Tra quẻ này') + '</div>' +
      '<div id="lt-name" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Tên quẻ', L.select('nm', nameOpts), 'ptv-field-name') + '</div>', 'Tra theo tên') + '</div>' +
      '<div id="lt-all" hidden><div class="ptv-out"></div></div>';
    V.wireTabs(c, ['lt-tri', 'lt-name', 'lt-all']);
    c.querySelector('#lt-tri form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lt-tri');
      L.resultBox(box, queFullHTML(queLookup(box.querySelector('#up').value, box.querySelector('#lo').value)));
    });
    c.querySelector('#lt-name form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#lt-name'), nm = box.querySelector('#nm').value;
      var q = list.filter(function (x) { return x.name === nm; })[0];
      L.resultBox(box, queFullHTML(q));
    });
    var rendered = false;
    c.querySelector('[data-t="lt-all"]').addEventListener('click', function () {
      if (rendered) return; rendered = true;
      var rows = list.map(function (q, i) { return '<tr><td>' + (i + 1) + '</td><td><strong>' + q.name + '</strong></td><td>' + q.upper + ' / ' + q.lower + '</td><td class="' + (q.rating === 'Cát' ? 'ptv-good' : q.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad') + '">' + q.rating + '</td></tr>'; }).join('');
      c.querySelector('#lt-all .ptv-out').innerHTML = '<h3>Bảng 64 quẻ Kinh Dịch theo cặp quẻ thượng, quẻ hạ</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>STT</th><th>Tên quẻ</th><th>Thượng / Hạ</th><th>Đẳng</th></tr>' + rows + '</table></div>';
    });
  }

  function conSoMoV2(c) {
    var dict = (window.PTV_TOOLS_DATA || {}).dreamDict || [];
    var subjOpts = dict.map(function (e, i) { return '<option value="' + i + '">' + esc(e.subject) + '</option>'; }).join('');
    c.innerHTML = V.tabsHTML([['cs-tell', 'Kể giấc mơ, luận con số'], ['cs-pick', 'Ghép bộ số từ nhiều hình ảnh']]) +
      '<div id="cs-tell">' + V.formWrap2('<div class="ptv-row">' + L.field('Kể lại giấc mơ của bạn', '<input type="text" id="q" value="" placeholder="Ví dụ: mơ thấy rắn bò vào nhà">', 'ptv-field-name') + '</div>', 'Luận con số từ giấc mơ') + '</div>' +
      '<div id="cs-pick" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Chọn các hình ảnh có trong mơ (giữ Ctrl hoặc Cmd để chọn nhiều)', '<select id="multi" multiple size="8">' + subjOpts + '</select>', 'ptv-field-name') + '</div>', 'Ghép bộ số của tôi') + '</div>';
    V.wireTabs(c, ['cs-tell', 'cs-pick']);
    c.querySelector('#cs-tell form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#cs-tell'), q = (box.querySelector('#q').value || '').toLowerCase();
      var matched = [];
      dict.forEach(function (e) {
        var bestK = 0;
        (e.keywords || []).forEach(function (k) { if (q.indexOf(k.toLowerCase()) >= 0 && k.length > bestK) bestK = k.length; });
        if (bestK) matched.push({ e: e, score: bestK });
      });
      matched.sort(function (a, b) { return b.score - a.score; });
      if (!matched.length) { L.resultBox(box, '<p>Chưa tìm thấy hình ảnh khớp trong từ điển ' + dict.length + ' giấc mơ. Bạn thử kể bằng hình ảnh chính ngắn gọn, hoặc sang tab ghép bộ số để chọn trực tiếp các hình ảnh nhé.</p>'); return; }
      var top = matched[0].e;
      var html = '<h3>' + esc(top.subject) + ': bộ số ' + (top.numbers || []).join(' · ') + '</h3><p>' + esc(top.meaning) + '</p>';
      if (matched.length > 1) html += '<h3>Các hình ảnh khác trong mơ và bộ số của chúng</h3>' + matched.slice(1, 4).map(function (m) { return '<p><strong>' + esc(m.e.subject) + ':</strong> ' + (m.e.numbers || []).join(' · ') + '</p>'; }).join('');
      html += '<p class="ptv-note">Con số trong mơ theo sổ mơ dân gian là phần giải trí đi kèm giấc mơ. <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> nhắc rõ: đừng dùng những con số này vào lô đề cờ bạc, vì về lâu dài đó là con đường thua lỗ chắc chắn.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#cs-pick form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#cs-pick'), sel = box.querySelector('#multi');
      var picked = Array.prototype.filter.call(sel.options, function (o) { return o.selected; }).map(function (o) { return dict[parseInt(o.value, 10)]; });
      if (!picked.length) { L.resultBox(box, '<p>Bạn chọn ít nhất một hình ảnh trong danh sách nhé.</p>'); return; }
      var all = [];
      picked.forEach(function (e) { (e.numbers || []).forEach(function (n) { if (all.indexOf(n) < 0) all.push(n); }); });
      all.sort(function (a, b) { return a - b; });
      var html = '<h3>Bộ số ghép từ ' + picked.length + ' hình ảnh trong mơ của bạn</h3>' +
        picked.map(function (e) { return '<p><strong>' + esc(e.subject) + ':</strong> ' + (e.numbers || []).join(' · ') + '</p>'; }).join('') +
        '<p><strong>Gộp lại (không trùng):</strong> ' + all.join(' · ') + '</p>' +
        '<p class="ptv-note">Bộ số gộp chỉ là trò chơi sổ mơ để bạn vui vẻ đối chiếu. Hình ảnh chính của giấc mơ (hình ảnh nhớ rõ và gây ấn tượng nhất) mới là bộ số nên ưu tiên nếu bạn muốn giữ danh sách ngắn.</p>';
      L.resultBox(box, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'luc-thap-tu-quai': lucThapV2, 'luan-con-so-trong-mo': conSoMoV2 });
})();
