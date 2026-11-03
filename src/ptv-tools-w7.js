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
