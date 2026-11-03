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
