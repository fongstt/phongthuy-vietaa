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

/* --- Tim que menh + Gieo que xi ngau v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2, W3 = window.PTVToolsW3a || {};
  var queLookup = W3._queLookup, QUE_TEXT = W3._QUE_TEXT || {};
  var CUNG_EL = { 'Khảm': 'Thủy', 'Ly': 'Hỏa', 'Chấn': 'Mộc', 'Tốn': 'Mộc', 'Càn': 'Kim', 'Đoài': 'Kim', 'Cấn': 'Thổ', 'Khôn': 'Thổ' };
  var TRI_BITS = { 'Càn': [1, 1, 1], 'Đoài': [1, 1, 0], 'Ly': [1, 0, 1], 'Chấn': [1, 0, 0], 'Tốn': [0, 1, 1], 'Khảm': [0, 1, 0], 'Cấn': [0, 0, 1], 'Khôn': [0, 0, 0] };
  var BITS_TRI = {}; Object.keys(TRI_BITS).forEach(function (k) { BITS_TRI[TRI_BITS[k].join('')] = k; });
  function queMenhV2(c) {
    c.innerHTML = V.tabsHTML([['qm-one', 'Quẻ mệnh của bạn'], ['qm-pair', 'Đối chiếu quẻ mệnh hai người']]) +
      '<div id="qm-one">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh', L.select('y', L.yearOptions(1940, 2015, 1990))) + L.field('Giới tính', L.genderSelect('g')) + '</div>', 'Tìm quẻ mệnh của tôi') + '</div>' +
      '<div id="qm-pair" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh người thứ nhất', L.select('y1', L.yearOptions(1940, 2015, 1990))) + L.field('Giới tính người thứ nhất', L.genderSelect('g1')) + '</div><div class="ptv-row">' + L.field('Năm sinh người thứ hai', L.select('y2', L.yearOptions(1940, 2015, 1994))) + L.field('Giới tính người thứ hai', L.genderSelect('g2')) + '</div>', 'Đối chiếu hai quẻ mệnh') + '</div>';
    V.wireTabs(c, ['qm-one', 'qm-pair']);
    c.querySelector('#qm-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#qm-one'), y = parseInt(box.querySelector('#y').value, 10), g = box.querySelector('#g').value;
      var yi = L.yearInfo(y), cp = L.cungPhi(y, g);
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh nạp âm: <strong>' + esc(yi.napAm) + '</strong></span></div>' +
        '<h3>Quẻ mệnh của bạn: quẻ ' + cp.cung + '</h3><p>Quẻ mệnh (cung phi) của người sinh năm ' + y + ', ' + g.toLowerCase() + ' là <strong>' + cp.cung + '</strong>, thuộc hành ' + CUNG_EL[cp.cung] + ', nhóm <strong>' + cp.group + '</strong>, ở phương ' + L.CUNG_DIR[cp.cung] + '.</p>' +
        '<p>' + (cp.group === 'Đông tứ mệnh' ? 'Người Đông tứ mệnh hợp các hướng Bắc, Đông, Đông Nam và Nam. Đây là bốn hướng nhà, hướng bàn thờ và hướng giường nên ưu tiên khi bạn có quyền lựa chọn.' : 'Người Tây tứ mệnh hợp các hướng Tây, Tây Bắc, Tây Nam và Đông Bắc. Đây là bốn hướng nhà, hướng bàn thờ và hướng giường nên ưu tiên khi bạn có quyền lựa chọn.') + '</p>' +
        '<p>Quẻ mệnh là nền tảng của Bát Trạch: từ quẻ mệnh suy ra bốn sao tốt và bốn sao xấu chiếu vào tám hướng của riêng bạn. Mọi công cụ hướng trong nhóm Trạch Mệnh của <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> đều bắt đầu từ kết quả này.</p>' +
        L.dirTable(cp.cung);
      L.resultBox(box, html);
    });
    c.querySelector('#qm-pair form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#qm-pair');
      var y1 = parseInt(box.querySelector('#y1').value, 10), g1 = box.querySelector('#g1').value;
      var y2 = parseInt(box.querySelector('#y2').value, 10), g2 = box.querySelector('#g2').value;
      var cp1 = L.cungPhi(y1, g1), cp2 = L.cungPhi(y2, g2);
      var e1 = CUNG_EL[cp1.cung], e2 = CUNG_EL[cp2.cung];
      var sameGroup = cp1.group === cp2.group;
      var rel;
      if (e1 === e2) rel = 'Hai quẻ mệnh cùng hành ' + e1 + ' (tỷ hòa): tính khí và nhịp sống có nhiều điểm giống nhau, dễ đồng cảm, nhưng cũng dễ cùng mắc một điểm yếu.';
      else if (L.GENERATES[e1] === e2) rel = 'Hành ' + e1 + ' của người thứ nhất sinh hành ' + e2 + ' của người thứ hai: người thứ nhất thường ở thế nâng đỡ, cho đi nhiều hơn trong quan hệ này.';
      else if (L.GENERATES[e2] === e1) rel = 'Hành ' + e2 + ' của người thứ hai sinh hành ' + e1 + ' của người thứ nhất: người thứ hai thường ở thế nâng đỡ, là chỗ dựa cho người thứ nhất.';
      else if (L.CONTROLS[e1] === e2 || L.CONTROLS[e2] === e1) rel = 'Hai hành ' + e1 + ' và ' + e2 + ' có quan hệ khắc: quan điểm dễ trái nhau ở việc lớn, cần thỏa thuận rõ ràng từ đầu thay vì nhường nhịn dồn nén.';
      else rel = 'Hai hành ' + e1 + ' và ' + e2 + ' ở quan hệ trung tính.';
      var html = '<h3>Đối chiếu quẻ mệnh: ' + cp1.cung + ' và ' + cp2.cung + '</h3>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th></th><th>Người thứ nhất (' + y1 + ', ' + g1 + ')</th><th>Người thứ hai (' + y2 + ', ' + g2 + ')</th></tr>' +
        '<tr><td><strong>Quẻ mệnh</strong></td><td>' + cp1.cung + '</td><td>' + cp2.cung + '</td></tr>' +
        '<tr><td><strong>Hành của quẻ</strong></td><td>' + e1 + '</td><td>' + e2 + '</td></tr>' +
        '<tr><td><strong>Nhóm mệnh</strong></td><td>' + cp1.group + '</td><td>' + cp2.group + '</td></tr></table></div>' +
        '<p><strong>' + (sameGroup ? 'Hai người CÙNG nhóm mệnh ' + cp1.group + ': ' : 'Hai người KHÁC nhóm mệnh: ') + '</strong>' + (sameGroup ? 'đây là điểm cộng lớn theo Bát Trạch, vì hai người hợp chung một bộ bốn hướng tốt, nên việc chọn hướng nhà, hướng giường cho cả hai rất dễ thống nhất.' : 'mỗi người hợp một bộ hướng khác nhau, khi chọn nhà chung nên ưu tiên hướng tốt của chủ hộ chính và dùng bố trí phòng để cân bằng cho người còn lại, theo nguyên tắc đã trình bày ở trang Xem phong thủy nhà.') + '</p>' +
        '<p>' + rel + '</p>' +
        '<p class="ptv-note">Đối chiếu quẻ mệnh là một lớp trong xem tuổi vợ chồng và đối tác, cần đọc cùng các lớp khác như can chi và mệnh nạp âm ở trang Xem tuổi vợ chồng, không nên kết luận chỉ từ một lớp này.</p>';
      L.resultBox(box, html);
    });
  }

  function xiNgauV2(c) {
    c.innerHTML = '<div class="ptv-form"><p style="margin-top:0">Nghĩ về điều muốn hỏi rồi bấm gieo xí ngầu. Máy gieo 3 lượt, mỗi lượt 2 viên: lượt đầu lấy quẻ hạ, lượt hai lấy quẻ thượng, lượt ba lấy hào động, rồi tự tính quẻ biến cho bạn.</p>' +
      '<div class="ptv-row">' + L.field('Điều bạn muốn hỏi (không bắt buộc)', '<input type="text" id="q" value="">', 'ptv-field-name') + '</div>' +
      '<div class="ptv-kieu-verse" id="ptv-dice2"><p>🎲 🎲</p></div><button type="button" class="ptv-btn" id="ptv-roll2">Gieo xí ngầu</button></div><div class="ptv-out"></div>';
    c.querySelector('#ptv-roll2').addEventListener('click', function () {
      function roll2() { return [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]; }
      var r1 = roll2(), r2 = roll2(), r3 = roll2();
      var TRI = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
      var lower = TRI[(r1[0] + r1[1]) % 8], upper = TRI[(r2[0] + r2[1]) % 8];
      var hao = ((r3[0] + r3[1] - 1) % 6) + 1;
      c.querySelector('#ptv-dice2').innerHTML = '<p>🎲 Lượt 1: ' + r1.join(' + ') + ' = ' + (r1[0] + r1[1]) + ' · Lượt 2: ' + r2.join(' + ') + ' = ' + (r2[0] + r2[1]) + ' · Lượt 3: ' + r3.join(' + ') + ' = ' + (r3[0] + r3[1]) + '</p>';
      var q = queLookup(upper, lower);
      if (!q) return;
      var loBits = TRI_BITS[lower], upBits = TRI_BITS[upper];
      var lines = [loBits[0], loBits[1], loBits[2], upBits[0], upBits[1], upBits[2]];
      var flipped = lines.slice(); flipped[hao - 1] = flipped[hao - 1] ? 0 : 1;
      var lo2 = BITS_TRI[[flipped[0], flipped[1], flipped[2]].join('')], up2 = BITS_TRI[[flipped[3], flipped[4], flipped[5]].join('')];
      var q2 = queLookup(up2, lo2);
      var question = (c.querySelector('#q').value || '').trim();
      var html = '<h3>Quẻ ' + esc(q.name) + ' <span class="' + (q.rating === 'Cát' ? 'ptv-good' : q.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad') + '">(' + q.rating + ')</span></h3>' +
        (question ? '<p><strong>Điều bạn hỏi:</strong> ' + esc(question) + '</p>' : '') +
        '<p>Từ xí ngầu: quẻ hạ ' + lower + ' (tổng lượt 1 là ' + (r1[0] + r1[1]) + '), quẻ thượng ' + upper + ' (tổng lượt 2 là ' + (r2[0] + r2[1]) + '). ' + (QUE_TEXT[q.name] || '') + '</p>' +
        '<p><strong>Hào động:</strong> hào ' + hao + ' (từ tổng lượt 3 là ' + (r3[0] + r3[1]) + '). Hào động là điểm chuyển biến mạnh nhất của quẻ, việc bạn hỏi sẽ đổi chiều từ điểm này.</p>' +
        (q2 ? '<h3>Quẻ biến: ' + esc(q2.name) + ' <span class="' + (q2.rating === 'Cát' ? 'ptv-good' : q2.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad') + '">(' + q2.rating + ')</span></h3><p>Lật hào ' + hao + ' của quẻ chính được quẻ biến ' + q2.name + ' (thượng ' + up2 + ', hạ ' + lo2 + '). ' + (QUE_TEXT[q2.name] || '') + ' Đọc quẻ chính là hiện tại, quẻ biến là hướng sự việc sẽ đi tới.</p>' : '') +
        '<p class="ptv-note">Gieo quẻ xí ngầu là cách lập quẻ nhanh theo tổng điểm ba lượt gieo. Muốn gieo theo nghi thức đầy đủ hơn, bạn dùng Gieo quẻ đồng xu ở <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a>.</p>';
      L.resultBox(c, html);
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'tim-que-menh': queMenhV2, 'gieo-que-xi-ngau': xiNgauV2 });
})();

/* --- Tim nien menh + Giai ma diem bao v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function nienMenhV2(c) {
    c.innerHTML = V.tabsHTML([['nm-one', 'Niên mệnh theo năm sinh'], ['nm-compare', 'So niên mệnh hai năm sinh']]) +
      '<div id="nm-one">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh', L.select('y', L.yearOptions(1930, 2025, 1990)), 'ptv-field-name') + '</div>', 'Tìm niên mệnh của tôi') + '</div>' +
      '<div id="nm-compare" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh thứ nhất', L.select('y1', L.yearOptions(1930, 2025, 1990))) + L.field('Năm sinh thứ hai', L.select('y2', L.yearOptions(1930, 2025, 1994))) + '</div>', 'So hai niên mệnh') + '</div>';
    V.wireTabs(c, ['nm-one', 'nm-compare']);
    c.querySelector('#nm-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#nm-one'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y);
      var sameCycle = [];
      for (var cy = y - 60; cy <= y + 60; cy += 60) if (cy !== y && cy >= 1924 && cy <= 2043) sameCycle.push(cy);
      var sameNapAm = [];
      for (var yy = 1924; yy <= 2043; yy++) { if (yy !== y && L.yearInfo(yy).napAm === yi.napAm) sameNapAm.push(yy); }
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong></span><span>Tuổi: <strong>' + yi.text + '</strong></span><span>Niên mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<p>Người sinh năm ' + y + ' thuộc tuổi ' + yi.text + ', có niên mệnh (mệnh nạp âm) là <strong>' + esc(yi.napAm) + '</strong>, thuộc hành ' + yi.el + '. Thiên can ' + yi.can + ' thuộc hành ' + yi.canEl + ', địa chi ' + yi.chi + ' thuộc hành ' + yi.chiEl + '.</p>' +
        '<p><strong>Các năm cùng tuổi ' + yi.text + ' (cùng can chi, chu kỳ 60 năm):</strong> ' + (sameCycle.length ? sameCycle.join(', ') : 'không có năm nào khác trong khoảng 1924 đến 2043') + '.</p>' +
        '<p><strong>Các năm cùng niên mệnh ' + esc(yi.napAm) + ' trong hoa giáp hiện tại:</strong> ' + sameNapAm.join(', ') + '. Trong mỗi chu kỳ 60 năm, một mệnh nạp âm thường ứng với hai cặp năm can chi khác nhau, nên người khác tuổi vẫn có thể trùng niên mệnh với bạn.</p>' +
        '<p>Niên mệnh là lớp mệnh được dùng nhiều nhất trong các tra cứu theo tuổi của <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a>: chọn màu hợp tuổi, chọn nghề, xem tuổi vợ chồng, chọn người xông đất và xem năm sinh con.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#nm-compare form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#nm-compare');
      var y1 = parseInt(box.querySelector('#y1').value, 10), y2 = parseInt(box.querySelector('#y2').value, 10);
      var a = L.yearInfo(y1), b = L.yearInfo(y2), rel;
      if (a.el === b.el) rel = 'Hai niên mệnh CÙNG hành ' + a.el + ' (tỷ hòa): nền tính cách và nhịp đời có nhiều điểm tương đồng, dễ hiểu nhau, hợp làm bạn và hợp tác dài hạn.';
      else if (L.GENERATES[a.el] === b.el) rel = 'Hành ' + a.el + ' của năm ' + y1 + ' SINH hành ' + b.el + ' của năm ' + y2 + ': người sinh năm ' + y1 + ' thường ở thế nâng đỡ người sinh năm ' + y2 + ' trong quan hệ giữa hai người.';
      else if (L.GENERATES[b.el] === a.el) rel = 'Hành ' + b.el + ' của năm ' + y2 + ' SINH hành ' + a.el + ' của năm ' + y1 + ': người sinh năm ' + y2 + ' thường ở thế nâng đỡ người sinh năm ' + y1 + '.';
      else rel = 'Hành ' + a.el + ' của năm ' + y1 + ' và hành ' + b.el + ' của năm ' + y2 + ' có quan hệ KHẮC: hai bên cần tôn trọng khác biệt và thỏa thuận rõ ràng ở việc chung, nhất là tiền bạc và việc nhà.';
      var html = '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th></th><th>Năm ' + y1 + '</th><th>Năm ' + y2 + '</th></tr>' +
        '<tr><td><strong>Tuổi</strong></td><td>' + a.text + '</td><td>' + b.text + '</td></tr>' +
        '<tr><td><strong>Niên mệnh</strong></td><td>' + esc(a.napAm) + '</td><td>' + esc(b.napAm) + '</td></tr>' +
        '<tr><td><strong>Hành</strong></td><td>' + a.el + '</td><td>' + b.el + '</td></tr></table></div><p>' + rel + '</p>' +
        '<p class="ptv-note">So niên mệnh chỉ là lớp hành nạp âm. Xem tuổi vợ chồng đầy đủ còn xét can, chi và cung phi, bạn dùng trang Xem tuổi vợ chồng để có kết luận trọn vẹn hơn.</p>';
      L.resultBox(box, html);
    });
  }

  function diemBaoV2(c) {
    var dict = (window.PTV_TOOLS_DATA || {}).omenDict || [];
    var opts = dict.map(function (e, i) { return '<option value="' + i + '">' + esc(e.subject) + '</option>'; }).join('');
    function typeCls(t) { return t === 'tốt' ? 'ptv-good' : t === 'cần chú ý' ? 'ptv-bad' : 'ptv-mid'; }
    function omenHTML(e) {
      var rel = dict.filter(function (x) { return x.type === e.type && x.subject !== e.subject; }).slice(0, 3);
      return '<h3>' + esc(e.subject) + ' <span class="' + typeCls(e.type) + '">· Điềm ' + e.type + '</span></h3><p>' + esc(e.meaning) + '</p>' +
        (rel.length ? '<p><strong>Các điềm cùng loại ' + e.type + ' trong dân gian:</strong> ' + rel.map(function (x) { return esc(x.subject.toLowerCase()); }).join(', ') + '. Bạn tra tiếp các điềm này ở danh sách bên trên nếu muốn đọc thêm.</p>' : '');
    }
    c.innerHTML = V.tabsHTML([['db-pick', 'Chọn điềm báo bạn gặp'], ['db-search', 'Tìm điềm theo từ khóa'], ['db-all', 'Bảng điềm báo dân gian']]) +
      '<div id="db-pick">' + V.formWrap2('<div class="ptv-row">' + L.field('Chọn điềm báo bạn gặp', L.select('om', opts), 'ptv-field-name') + '</div>', 'Giải mã điềm báo') + '</div>' +
      '<div id="db-search" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Từ khóa (ví dụ: mắt, bướm, chim, gương)', '<input type="text" id="kw" value="">', 'ptv-field-name') + '</div>', 'Tìm điềm báo') + '</div>' +
      '<div id="db-all" hidden><div class="ptv-out"></div></div>';
    V.wireTabs(c, ['db-pick', 'db-search', 'db-all']);
    c.querySelector('#db-pick form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#db-pick'), e = dict[parseInt(box.querySelector('#om').value, 10)];
      if (e) L.resultBox(box, omenHTML(e) + '<p class="ptv-note">Điềm báo là quan niệm dân gian truyền miệng, bạn đọc để tham khảo và suy ngẫm vui vẻ, không nên lo lắng thái quá với các điềm cần chú ý.</p>');
    });
    c.querySelector('#db-search form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#db-search'), kw = (box.querySelector('#kw').value || '').toLowerCase().trim();
      var found = dict.filter(function (e) { return (e.subject + ' ' + e.meaning).toLowerCase().indexOf(kw) >= 0; });
      if (!kw || !found.length) { L.resultBox(box, '<p>Chưa tìm thấy điềm báo nào khớp với từ khóa này trong ' + dict.length + ' điềm phổ biến. Bạn thử từ khóa ngắn hơn, ví dụ "mắt", "chim", "bướm", "mèo" nhé.</p>'); return; }
      L.resultBox(box, '<h3>Tìm thấy ' + found.length + ' điềm báo khớp</h3>' + found.map(omenHTML).join(''));
    });
    var rendered = false;
    c.querySelector('[data-t="db-all"]').addEventListener('click', function () {
      if (rendered) return; rendered = true;
      var rows = dict.map(function (e) { return '<tr><td><strong>' + esc(e.subject) + '</strong></td><td class="' + typeCls(e.type) + '">Điềm ' + e.type + '</td></tr>'; }).join('');
      c.querySelector('#db-all .ptv-out').innerHTML = '<h3>Bảng ' + dict.length + ' điềm báo dân gian phổ biến</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Điềm báo</th><th>Loại</th></tr>' + rows + '</table></div><p class="ptv-note">Muốn đọc phần luận của một điềm, quay lại tab chọn điềm và chọn điềm đó trong danh sách.</p>';
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'tim-nien-menh': nienMenhV2, 'giai-ma-diem-bao': diemBaoV2 });
})();

/* --- La so tu tru + Sim phong thuy v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, E = window.PTVEngine, esc = L.esc, V = window.PTVDayToolsV2;
  var CAN_POL = { 'Giáp': 1, 'Bính': 1, 'Mậu': 1, 'Canh': 1, 'Nhâm': 1, 'Ất': 0, 'Đinh': 0, 'Kỷ': 0, 'Tân': 0, 'Quý': 0 };
  var CAN_ELX = { 'Giáp': 'Mộc', 'Ất': 'Mộc', 'Bính': 'Hỏa', 'Đinh': 'Hỏa', 'Mậu': 'Thổ', 'Kỷ': 'Thổ', 'Canh': 'Kim', 'Tân': 'Kim', 'Nhâm': 'Thủy', 'Quý': 'Thủy' };
  var TG_TXT = {
    'Tỷ Kiên': 'Ngôi sao của bản thân và bạn bè đồng trang lứa: chủ về tự lập, cạnh tranh lành mạnh và cái tôi rõ ràng.',
    'Kiếp Tài': 'Ngôi sao của sự mạnh mẽ và tranh đoạt: dám giành cơ hội, hợp cạnh tranh, nhưng cần giữ chừng mực trong tiền bạc chung.',
    'Thực Thần': 'Ngôi sao của tài hoa và hưởng thụ: có duyên với sáng tạo, ẩm thực, nghệ thuật và cách kiếm sống nhẹ nhàng bền bỉ.',
    'Thương Quan': 'Ngôi sao của sự phá cách và tài năng nổi bật: thông minh, dám khác biệt, nhưng cần tiết chế lời nói với cấp trên.',
    'Thiên Tài': 'Ngôi sao của tài lộc bất ngờ và cơ hội ngoài dự tính: nhạy với tiền bạc, hợp đầu tư phụ và các khoản thu không đều.',
    'Chính Tài': 'Ngôi sao của tài lộc chính đáng và ổn định: tiền đến từ công việc chính, tích lũy đều, là ngôi sao tài được coi trọng nhất.',
    'Thất Sát': 'Ngôi sao của áp lực và quyền uy khắc chế: đời có những giai đoạn bị thử thách mạnh, rèn được thì thành người có bản lĩnh và vị thế.',
    'Chính Quan': 'Ngôi sao của danh vị và kỷ luật: hợp đường quan lộ, tổ chức và các nghề cần uy tín, giấy tờ, pháp lý.',
    'Thiên Ấn': 'Ngôi sao của học vấn lệch và trực giác: học sâu một ngành hẹp, có duyên với nghiên cứu, tâm linh và nghề tự do chuyên môn.',
    'Chính Ấn': 'Ngôi sao của học vấn chính quy và sự đỡ đầu: được thầy cô, cấp trên và gia đình nâng đỡ, hợp đường học hành thi cử.'
  };
  function tenGod(dayCan, otherCan) {
    var dEl = CAN_ELX[dayCan], oEl = CAN_ELX[otherCan], same = CAN_POL[dayCan] === CAN_POL[otherCan];
    if (oEl === dEl) return same ? 'Tỷ Kiên' : 'Kiếp Tài';
    if (L.GENERATES[dEl] === oEl) return same ? 'Thực Thần' : 'Thương Quan';
    if (L.CONTROLS[dEl] === oEl) return same ? 'Thiên Tài' : 'Chính Tài';
    if (L.CONTROLS[oEl] === dEl) return same ? 'Thất Sát' : 'Chính Quan';
    return same ? 'Thiên Ấn' : 'Chính Ấn';
  }
  function tuTruV2(c) {
    c.innerHTML = V.tabsHTML([['tt-main', 'Lập lá số tứ trụ'], ['tt-gods', 'Thập thần trong lá số của bạn']]) +
      '<div id="tt-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="by" inputmode="numeric" value="1995">') + '</div><div class="ptv-row">' + L.field('Giờ sinh', L.select('h', E.CHI.map(function (x) { return '<option value="' + x + '">' + x + ' (' + E.HOUR_LABEL[x] + ')</option>'; }).join(''))) + L.field('Giới tính', L.genderSelect('g')) + '</div>', 'Lập lá số tứ trụ') + '</div>' +
      '<div id="tt-gods" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="by" inputmode="numeric" value="1995">') + '</div><div class="ptv-row">' + L.field('Giờ sinh', L.select('h', E.CHI.map(function (x) { return '<option value="' + x + '">' + x + ' (' + E.HOUR_LABEL[x] + ')</option>'; }).join(''))) + '</div>', 'Xem thập thần của tôi') + '</div>';
    V.wireTabs(c, ['tt-main', 'tt-gods']);
    function pillars(box) {
      var dt = { d: parseInt(box.querySelector('#bd').value, 10), m: parseInt(box.querySelector('#bm').value, 10), y: parseInt(box.querySelector('#by').value, 10) };
      var yP = E.yearPillar(dt.d, dt.m, dt.y), mP = E.monthPillar(dt.d, dt.m, E.CAN.indexOf(yP.pillar.can)), dP = E.dayPillar(dt.d, dt.m, dt.y), hP = E.hourPillar(box.querySelector('#h').value, E.CAN.indexOf(dP.can));
      return { dt: dt, yP: yP.pillar, mP: mP, dP: dP, hP: hP };
    }
    c.querySelector('#tt-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tt-main'), P = pillars(box);
      var counts = E.countElements([P.hP, P.dP, P.mP, P.yP]);
      function cell(p, label) { var na = E.napAmOf(p); return '<td><strong>' + label + '</strong><br>' + p.text + '<br><span class="ptv-note">' + na.name + '</span></td>'; }
      var total = Object.keys(counts).reduce(function (a, k) { return a + counts[k]; }, 0);
      var maxEl = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      var minEl = Object.keys(counts).sort(function (a, b) { return counts[a] - counts[b]; })[0];
      var dayEl = P.dP.canEl;
      var genIn = Object.keys(L.GENERATES).filter(function (k) { return L.GENERATES[k] === dayEl; })[0];
      var strength = (counts[dayEl] || 0) + (counts[genIn] || 0);
      var bars = Object.keys(counts).map(function (e) { return '<div class="ptv-bar-row"><span class="ptv-bar-label">' + e + '</span><span class="ptv-bar-track"><span class="ptv-bar-fill" style="width:' + (total ? counts[e] / total * 100 : 0) + '%;background:' + ({ 'Kim': '#8a6d1c', 'Mộc': '#2e7d32', 'Thủy': '#1565c0', 'Hỏa': '#c62828', 'Thổ': '#8d5a2b' }[e]) + '"></span></span><span class="ptv-bar-num">' + counts[e] + '</span></div>'; }).join('');
      var html = '<h3>Lá số tứ trụ của bạn</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr>' + cell(P.yP, 'Trụ năm') + cell(P.mP, 'Trụ tháng') + cell(P.dP, 'Trụ ngày') + cell(P.hP, 'Trụ giờ') + '</tr></table></div>' +
        '<p>Nhật chủ (bản mệnh ngày sinh) là <strong>' + P.dP.can + '</strong> thuộc hành ' + L.badge(dayEl) + '. Mệnh năm: <strong>' + esc(E.napAmOf(P.yP).name) + '</strong>.</p>' +
        '<h3>Cân bằng ngũ hành trong tứ trụ</h3>' + bars +
        '<p>Hành mạnh nhất là <strong>' + maxEl + '</strong>, hành yếu hoặc thiếu là <strong>' + minEl + '</strong>. Nhật chủ được ' + strength + ' điểm tựa từ hành bản mệnh và hành sinh cho mình trong tổng ' + total + ' điểm ngũ hành, ' + (strength >= total / 2 ? 'thuộc nhóm nhật chủ vượng, nên tiết chế bằng hành khắc và hành được sinh.' : 'thuộc nhóm nhật chủ nhược hoặc trung hòa, nên bổ trợ bằng hành sinh cho nhật chủ và hành bản mệnh.') + '</p>' +
        '<p><strong>Gợi ý bổ trợ:</strong> ưu tiên màu sắc, nghề nghiệp và môi trường thuộc hành <strong>' + (strength >= total / 2 ? L.GENERATES[dayEl] + ' và ' + L.CONTROLS[dayEl] : minEl + ' và ' + dayEl) + '</strong>. Sang tab thập thần bên cạnh để đọc tiếp lớp luận về các mối quan hệ trong lá số của bạn.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#tt-gods form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tt-gods'), P = pillars(box);
      var rows = [['Trụ năm', P.yP], ['Trụ tháng', P.mP], ['Trụ giờ', P.hP]].map(function (r) {
        var g = tenGod(P.dP.can, r[1].can);
        return '<tr><td><strong>' + r[0] + '</strong> (' + r[1].text + ')</td><td>' + g + '</td><td>' + TG_TXT[g] + '</td></tr>';
      }).join('');
      var html = '<h3>Thập thần theo nhật chủ ' + P.dP.can + ' (hành ' + P.dP.canEl + ')</h3>' +
        '<p>Thập thần là tên gọi của mười mối quan hệ giữa thiên can của các trụ với nhật chủ (can ngày, đại diện cho chính bạn). Trụ ngày là chính bạn nên không tính thập thần cho trụ này.</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Trụ</th><th>Thập thần</th><th>Ý nghĩa</th></tr>' + rows + '</table></div>' +
        '<p class="ptv-note">Đây là lớp thập thần của thiên can nổi (phần nhìn thấy trực tiếp của lá số). Luận tứ trụ chuyên sâu còn xét thập thần của địa chi tàng can, đại vận và lưu niên, do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> công bố rõ phạm vi cơ bản này.</p>';
      L.resultBox(box, html);
    });
  }

  var DIGIT_EL = { '0': 'Thủy', '1': 'Thủy', '2': 'Thổ', '3': 'Mộc', '4': 'Mộc', '5': 'Thổ', '6': 'Kim', '7': 'Kim', '8': 'Thổ', '9': 'Hỏa' };
  function nutSo(digits) { var s = digits.split('').reduce(function (a, ch) { return a + parseInt(ch, 10); }, 0); var n = s % 10; return n === 0 ? 10 : n; }
  function hoachOf(n) { var r = n % 80; if (r === 0) r = 80; return { num: r, entry: ((window.PTV_DATA || {}).hoach81 || {})[String(r)] || { rating: 'Bình', text: '' } }; }
  function ratingPts(r) { return { 'Đại cát': 4, 'Cát': 3.4, 'Bình': 2, 'Hung': 1, 'Đại hung': 0.4 }[r] || 2; }
  function simScore(digits, yv) {
    var last4 = digits.slice(-4), h = hoachOf(parseInt(last4, 10)), nut = nutSo(digits);
    var counts = {}; digits.split('').forEach(function (d) { var e = DIGIT_EL[d]; counts[e] = (counts[e] || 0) + 1; });
    var dom = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
    var score = nut / 10 * 3 + ratingPts(h.entry.rating), rel = '';
    if (yv) {
      var yi = L.yearInfo(parseInt(yv, 10)); rel = L.relEl(dom, yi.el);
      score += rel.indexOf('tương sinh') >= 0 && rel.indexOf('được') < 0 ? 1.5 : rel.indexOf('được tương sinh') >= 0 ? 2 : rel.indexOf('Cùng hành') >= 0 ? 1.5 : rel.indexOf('khắc') >= 0 ? 0 : 1;
    } else score += 1.2;
    score = Math.max(0.5, Math.min(10, Math.round(score * 2) / 2));
    return { score: score, nut: nut, h: h, dom: dom, counts: counts, rel: rel, last4: last4 };
  }
  function simPatterns(digits) {
    var out = [], tail = digits.slice(-4);
    if (/(\d)\1{3}$/.test(digits)) out.push('Tứ quý ' + tail[0] + ': bốn số cuối giống hệt nhau, thuộc nhóm đuôi hiếm và dễ nhớ bậc nhất trong giới sim.');
    else if (/(\d)\1{2}$/.test(digits)) out.push('Tam hoa: ba số cuối giống nhau, đuôi gọn và dễ nhớ.');
    var inc = true; for (var i = 1; i < tail.length; i++) { if (parseInt(tail[i], 10) !== parseInt(tail[i - 1], 10) + 1) inc = false; }
    if (inc && !/(\d)\1{3}/.test(tail)) out.push('Số tiến ' + tail + ': bốn số cuối tăng dần liên tiếp, được chuộng vì tượng trưng sự thăng tiến.');
    var pair = digits.slice(-2);
    var named = { '39': 'đuôi Thần Tài nhỏ', '79': 'đuôi Thần Tài lớn', '38': 'đuôi Ông Địa nhỏ', '78': 'đuôi Ông Địa lớn', '68': 'đuôi Lộc Phát', '86': 'đuôi Phát Lộc', '99': 'đuôi Trường Cửu', '19': 'đuôi Nhất Cửu' };
    if (named[pair]) out.push('Đuôi ' + pair + ' là ' + named[pair] + ', thuộc nhóm đuôi được săn nhiều nhất trên thị trường sim số đẹp.');
    return out;
  }
  function simV2(c) {
    c.innerHTML = V.tabsHTML([['sim-one', 'Luận một sim'], ['sim-many', 'So sánh nhiều sim']]) +
      '<div id="sim-one">' + V.formWrap2('<div class="ptv-row">' + L.field('Số điện thoại', '<input type="text" id="phone" inputmode="numeric" value="">', 'ptv-field-name') + '</div><div class="ptv-row">' + L.field('Năm sinh của bạn (không bắt buộc, để đối chiếu mệnh)', L.select('y', '<option value="">Không nhập</option>' + L.yearOptions(1940, 2015, 1990))) + '</div>', 'Xem sim này') + '</div>' +
      '<div id="sim-many" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Danh sách số điện thoại, mỗi dòng một số', '<textarea id="list" rows="5">0901234568\n0912345679\n0987654321</textarea>', 'ptv-field-name') + '</div><div class="ptv-row">' + L.field('Năm sinh của bạn (không bắt buộc)', L.select('y', '<option value="">Không nhập</option>' + L.yearOptions(1940, 2015, 1990))) + '</div>', 'So sánh và xếp hạng') + '</div>';
    V.wireTabs(c, ['sim-one', 'sim-many']);
    c.querySelector('#sim-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#sim-one'), digits = box.querySelector('#phone').value.replace(/\D/g, '');
      if (digits.length < 9) { L.resultBox(box, '<p class="ptv-bad">Bạn nhập số điện thoại đầy đủ, ít nhất 9 chữ số nhé.</p>'); return; }
      var yv = box.querySelector('#y').value, r = simScore(digits, yv);
      var pats = simPatterns(digits);
      var html = '<h3>Luận sim ' + esc(digits) + '</h3>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Số nút của dãy số</span><span class="ptv-block-score">' + r.nut + ' nút</span></div><p>' + (r.nut >= 8 ? 'Số nút cao, theo quan niệm sim số đây là dãy số đẹp, dễ nhớ và mang khí vượng.' : r.nut >= 5 ? 'Số nút ở mức khá, dãy số cân bằng.' : 'Số nút thấp, dãy số thiên về trầm, hợp người thích sự điềm tĩnh hơn là cầu tài.') + '</p></div>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>4 số cuối ' + r.last4 + ' theo quẻ số ' + r.h.num + '</span><span class="ptv-block-score">' + r.h.entry.rating + '</span></div><p>' + esc(r.h.entry.text) + '</p></div>' +
        '<div class="ptv-block"><div class="ptv-block-head"><span>Ngũ hành chủ đạo của dãy số</span><span class="ptv-block-score">Hành ' + r.dom + '</span></div><p>Các chữ số trong sim nghiêng về hành ' + r.dom + ' (' + r.counts[r.dom] + '/' + digits.length + ' số).</p></div>' +
        (pats.length ? '<div class="ptv-block"><div class="ptv-block-head"><span>Dạng số đẹp nhận diện được</span></div>' + pats.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' : '') +
        (yv ? '<div class="ptv-block"><div class="ptv-block-head"><span>Đối chiếu với mệnh của bạn</span></div><p>Bạn sinh năm ' + yv + ', mệnh ' + esc(L.yearInfo(parseInt(yv, 10)).napAm) + '. Hành chủ đạo của sim so với mệnh của bạn: ' + r.rel + '.</p></div>' : '') +
        '<div class="ptv-score-wrap"><div class="ptv-score-circle" style="border-color:' + (r.score >= 7 ? '#2e7d32' : r.score >= 5 ? '#b8860b' : '#c62828') + '">' + String(r.score).replace('.', ',') + '<span>/ 10</span></div><div><p class="ptv-verdict">' + (r.score >= 8 ? 'Sim rất hợp, khí số vượng' : r.score >= 6.5 ? 'Sim khá tốt' : r.score >= 5 ? 'Sim ở mức trung bình khá' : 'Sim thiên về trầm, nên cân nhắc') + '</p><p class="ptv-note">Điểm gồm số nút, quẻ của 4 số cuối theo bảng 81 số và độ hợp hành giữa dãy số với mệnh người dùng. Đây là luận giải tham khảo theo sim phong thủy dân gian.</p></div></div>';
      L.resultBox(box, html);
    });
    c.querySelector('#sim-many form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#sim-many'), yv = box.querySelector('#y').value;
      var nums = box.querySelector('#list').value.split(/\n+/).map(function (s) { return s.replace(/\D/g, ''); }).filter(function (s) { return s.length >= 9; });
      if (!nums.length) { L.resultBox(box, '<p class="ptv-bad">Chưa có số hợp lệ nào trong danh sách.</p>'); return; }
      var rows = nums.map(function (n) { var r = simScore(n, yv); return { n: n, r: r }; }).sort(function (a, b) { return b.r.score - a.r.score; }).map(function (x, i) {
        return '<tr><td>' + (i + 1) + '</td><td><strong>' + x.n + '</strong></td><td>' + String(x.r.score).replace('.', ',') + '/10</td><td>' + x.r.nut + ' nút</td><td>' + x.r.h.entry.rating + ' (quẻ ' + x.r.h.num + ')</td><td>' + x.r.dom + '</td></tr>';
      }).join('');
      L.resultBox(box, '<h3>Xếp hạng ' + nums.length + ' sim theo điểm phong thủy</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Hạng</th><th>Số điện thoại</th><th>Điểm</th><th>Số nút</th><th>Quẻ 4 số cuối</th><th>Hành chủ đạo</th></tr>' + rows + '</table></div><p class="ptv-note">Điểm cao nhất chưa chắc là sim nên mua: hãy cân thêm giá, nhà mạng và độ dễ nhớ với khách hàng của bạn. Điểm tại <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> chỉ là một tiêu chí tham khảo.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-la-so-tu-tru': tuTruV2, 'sim-phong-thuy': simV2 });
})();

/* --- Boi 4 so cuoi + Xem tuoi vo chong v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  var DIGIT_EL = { '0': 'Thủy', '1': 'Thủy', '2': 'Thổ', '3': 'Mộc', '4': 'Mộc', '5': 'Thổ', '6': 'Kim', '7': 'Kim', '8': 'Thổ', '9': 'Hỏa' };
  function nut4(v) { var s = v.split('').reduce(function (a, ch) { return a + parseInt(ch, 10); }, 0); var n = s % 10; return n === 0 ? 10 : n; }
  function hoachOf(n) { var r = n % 80; if (r === 0) r = 80; return { num: r, entry: ((window.PTV_DATA || {}).hoach81 || {})[String(r)] || { rating: 'Bình', text: '' } }; }
  function boi4V2(c) {
    var qopts = ''; for (var i = 1; i <= 81; i++) qopts += '<option value="' + i + '">Quẻ số ' + i + '</option>';
    c.innerHTML = V.tabsHTML([['b4-one', 'Luận 4 số cuối của bạn'], ['b4-lookup', 'Tra quẻ trong bảng 81 số']]) +
      '<div id="b4-one">' + V.formWrap2('<div class="ptv-row">' + L.field('Nhập 4 số cuối điện thoại', '<input type="text" id="n4" inputmode="numeric" maxlength="4" value="">', 'ptv-field-name') + L.field('Năm sinh của bạn (không bắt buộc)', L.select('y', '<option value="">Không nhập</option>' + L.yearOptions(1940, 2015, 1990))) + '</div>', 'Xem 4 số cuối') + '</div>' +
      '<div id="b4-lookup" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Chọn quẻ số muốn tra', L.select('q', qopts), 'ptv-field-name') + '</div>', 'Tra quẻ số này') + '</div>';
    V.wireTabs(c, ['b4-one', 'b4-lookup']);
    c.querySelector('#b4-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#b4-one'), v = box.querySelector('#n4').value.replace(/\D/g, '');
      if (v.length !== 4) { L.resultBox(box, '<p class="ptv-bad">Bạn nhập đúng 4 chữ số cuối nhé.</p>'); return; }
      var h = hoachOf(parseInt(v, 10)), nut = nut4(v);
      var els = v.split('').map(function (d) { return d + ' thuộc ' + DIGIT_EL[d]; }).join(', ');
      var counts = {}; v.split('').forEach(function (d) { var e = DIGIT_EL[d]; counts[e] = (counts[e] || 0) + 1; });
      var dom = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      var pats = [];
      if (/^(\d)\1{3}$/.test(v)) pats.push('Bốn số là TỨ QUÝ ' + v[0] + ', dạng đuôi hiếm nhất trong các dạng số đẹp.');
      else if (/(\d)\1{2}/.test(v.slice(1))) pats.push('Ba số cuối giống nhau tạo thành đuôi TAM HOA.');
      var named = { '39': 'Thần Tài nhỏ', '79': 'Thần Tài lớn', '38': 'Ông Địa nhỏ', '78': 'Ông Địa lớn', '68': 'Lộc Phát', '86': 'Phát Lộc', '99': 'Trường Cửu' };
      if (named[v.slice(2)]) pats.push('Cặp cuối ' + v.slice(2) + ' là đuôi ' + named[v.slice(2)] + ' được thị trường sim chuộng.');
      var yv = box.querySelector('#y').value, yhtml = '';
      if (yv) { var yi = L.yearInfo(parseInt(yv, 10)); yhtml = '<p><strong>Đối chiếu với mệnh của bạn:</strong> bạn sinh năm ' + yv + ' mệnh ' + esc(yi.napAm) + ' ' + L.badge(yi.el) + '. Hành chủ đạo của 4 số cuối là ' + dom + ': ' + L.relEl(dom, yi.el) + '.</p>'; }
      var html = '<h3>Luận 4 số cuối ' + v + '</h3><p>Theo cách luận phổ biến, lấy 4 số cuối chia cho 80, phần dư ứng với quẻ số <strong>' + h.num + '</strong>, được đánh giá là <strong>' + h.entry.rating + '</strong>.</p><div class="ptv-card" style="margin:10px 0"><p>' + esc(h.entry.text) + '</p></div>' +
        '<p><strong>Số nút của 4 số:</strong> ' + nut + ' nút. <strong>Hành chủ đạo:</strong> ' + dom + '. <strong>Ngũ hành từng chữ số:</strong> ' + els + '.</p>' +
        (pats.length ? '<p><strong>Dạng đuôi đẹp:</strong> ' + pats.join(' ') + '</p>' : '') + yhtml +
        '<p class="ptv-note">Cách xem này chỉ dựa trên 4 số cuối. Muốn luận đầy đủ cả dãy số, bạn dùng thêm công cụ Sim phong thủy của <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a>.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#b4-lookup form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#b4-lookup'), q = parseInt(box.querySelector('#q').value, 10);
      var e = ((window.PTV_DATA || {}).hoach81 || {})[String(q)] || { rating: 'Bình', text: '' };
      L.resultBox(box, '<h3>Quẻ số ' + q + ' · ' + e.rating + '</h3><div class="ptv-card" style="margin:10px 0"><p>' + esc(e.text) + '</p></div><p>Mọi 4 số cuối khi chia cho 80 cho phần dư ' + (q === 80 ? '0 (tức quẻ 80)' : q) + ' đều luận theo quẻ này. Trong dải đuôi 0000 đến 9999 có đúng 125 đuôi cho ra quẻ số ' + q + '.</p><p class="ptv-note">Bảng 81 số này cũng là bảng dùng trong đặt tên con và luận sim, mỗi quẻ là một hoạch số với đẳng riêng.</p>');
    });
  }

  function voChongV2(c) {
    c.innerHTML = V.tabsHTML([['vc-main', 'Chấm điểm tuổi vợ chồng'], ['vc-year', 'Năm cưới nào hợp cho hai bạn']]) +
      '<div id="vc-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chồng', L.select('hy', L.yearOptions(1940, 2010, 1990))) + L.field('Năm sinh của vợ', L.select('wy', L.yearOptions(1940, 2010, 1992))) + '</div>', 'Xem tuổi vợ chồng') + '</div>' +
      '<div id="vc-year" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chồng', L.select('hy', L.yearOptions(1940, 2010, 1990))) + L.field('Năm sinh của vợ', L.select('wy', L.yearOptions(1940, 2010, 1992))) + '</div>', 'Quét các năm cưới sắp tới') + '</div>';
    V.wireTabs(c, ['vc-main', 'vc-year']);
    function couple(box) {
      var hy = parseInt(box.querySelector('#hy').value, 10), wy = parseInt(box.querySelector('#wy').value, 10);
      return { hy: hy, wy: wy, H: L.yearInfo(hy), W: L.yearInfo(wy) };
    }
    c.querySelector('#vc-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#vc-main'), cp = couple(box), H = cp.H, W = cp.W;
      var chi = L.chiRelation(H.chi, W.chi), canHop = L.CAN_HOP[H.can] === W.can, naRel = L.relEl(H.el, W.el);
      var hCung = L.cungPhi(cp.hy, 'Nam').cung, wCung = L.cungPhi(cp.wy, 'Nữ').cung, star = L.coupleStar(hCung, wCung);
      var parts = { chi: chi.score, can: canHop ? 1 : 0, na: naRel.indexOf('tương sinh') >= 0 ? 1.2 : naRel.indexOf('Cùng hành') >= 0 ? 0.5 : naRel.indexOf('khắc') >= 0 ? -1.2 : 0, star: { 'Sinh Khí': 2, 'Diên Niên': 2, 'Thiên Y': 1.5, 'Phục Vị': 1, 'Họa Hại': -0.5, 'Lục Sát': -1, 'Ngũ Quỷ': -1.5, 'Tuyệt Mệnh': -2 }[star] || 0 };
      var score = 5 + parts.chi + parts.can + parts.na + parts.star;
      score = Math.max(0.5, Math.min(10, Math.round(score * 2) / 2));
      function row(a, b, cc) { return '<tr><td><strong>' + a + '</strong></td><td>' + b + '</td><td>' + cc + '</td></tr>'; }
      var weakest = Object.keys(parts).sort(function (a, b) { return parts[a] - parts[b]; })[0];
      var advice = {
        chi: 'Điểm cần chú ý nhất của hai bạn nằm ở địa chi: tính khí và nhịp sống có chỗ vênh nhau. Cách bù thực tế là phân chia rõ việc nhà và tiền bạc ngay từ đầu, tránh để mâu thuẫn nhỏ dồn thành chuyện lớn.',
        can: 'Hai bạn không có điểm cộng thiên can hợp, nghĩa là sự đồng lòng phải đến từ thỏa thuận chứ không tự nhiên mà có. Hãy đặt quy tắc chung cho các việc lớn: mua nhà, đầu tư, phụng dưỡng hai bên.',
        na: 'Hành nạp âm của hai mệnh có chỗ khắc hoặc chưa sinh được cho nhau. Cách bù là chọn năm sinh con có hành sinh được cho cả cha lẫn mẹ, và chọn màu sắc, hướng nhà theo mệnh của người yếu thế hơn trong hai người.',
        star: 'Sao cung phi của hai bạn rơi vào nhóm sao cần chú ý của Bát Trạch. Cách hóa giải truyền thống là chọn hướng nhà và hướng giường thuộc bộ hướng tốt của chủ hộ, đồng thời chọn ngày cưới và giờ rước dâu vào ngày giờ hợp tuổi hai người.'
      }[weakest];
      var html = '<div class="ptv-facts"><span>Chồng: <strong>' + cp.hy + '</strong> (' + H.text + ', ' + esc(H.napAm) + ', cung ' + hCung + ')</span><span>Vợ: <strong>' + cp.wy + '</strong> (' + W.text + ', ' + esc(W.napAm) + ', cung ' + wCung + ')</span></div>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Yếu tố</th><th>Kết quả</th><th>Nhận xét</th></tr>' +
        row('Địa chi', chi.label, chi.score >= 2 ? 'Hai tuổi thuộc nhóm rất hợp nhau về tính khí và đường đời.' : chi.score < 0 ? 'Hai tuổi có điểm xung khắc, cần nhường nhịn và phân chia việc rõ ràng.' : 'Hai tuổi không xung không hợp đặc biệt, êm đềm do cách sống.') +
        row('Thiên can', canHop ? 'Can hợp (' + H.can + ' hợp ' + W.can + ')' : 'Không thuộc cặp can hợp', canHop ? 'Can hợp là điểm cộng lớn, vợ chồng dễ đồng lòng làm ăn.' : 'Không có điểm cộng cũng không trừ điểm ở yếu tố này.') +
        row('Nạp âm ngũ hành', naRel, 'Xét theo hành của mệnh nạp âm hai vợ chồng.') +
        row('Cung phi bát trạch', 'Sao ' + star, L.STAR_INFO[star].d) +
        '</table></div>' +
        '<div class="ptv-score-wrap"><div class="ptv-score-circle" style="border-color:' + (score >= 7 ? '#2e7d32' : score >= 5 ? '#b8860b' : '#c62828') + '">' + String(score).replace('.', ',') + '<span>/ 10</span></div><div><p class="ptv-verdict">' + (score >= 8 ? 'Rất hợp, thuộc nhóm vợ chồng đồng lòng' : score >= 6.5 ? 'Hợp nhau ở mức tốt' : score >= 5 ? 'Ở mức trung bình, sống chung hòa hợp do nhường nhịn' : 'Có nhiều điểm xung, cần chú ý cách hóa giải') + '</p><p class="ptv-note">Điểm tổng hợp 4 yếu tố trên thang 10. Tuổi xung không có nghĩa là không nên duyên, phong thủy chỉ gợi ý những điểm cần chú ý để hai người bù trừ cho nhau.</p></div></div>' +
        '<p><strong>Lời khuyên theo điểm yếu nhất:</strong> ' + advice + '</p>' +
        '<p>Sang tab năm cưới bên cạnh để xem những năm sắp tới năm nào cưới là nhẹ nhàng nhất cho hai bạn.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#vc-year form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#vc-year'), cp = couple(box);
      var nowY = new Date().getFullYear(), rows = [], good = [];
      for (var y = nowY; y <= nowY + 8; y++) {
        var wAge = y - cp.wy + 1, hAge = y - cp.hy + 1;
        var kl = L.kimLau(wAge), ho = L.hoangOc(hAge);
        var ttW = L.tamTai(cp.W.chi, y), ttH = L.tamTai(cp.H.chi, y);
        var flags = [];
        if (kl.bad) flags.push('vợ phạm Kim Lâu' + (kl.kind ? ' (' + kl.kind + ')' : ''));
        if (ho.bad) flags.push('chồng phạm Hoàng Ốc (' + ho.name + ')');
        if (ttW) flags.push('vợ phạm Tam Tai');
        if (ttH) flags.push('chồng phạm Tam Tai');
        var verdict = flags.length === 0 ? 'Năm nhẹ nhàng cho cả hai' : flags.length === 1 ? 'Cưới được, lưu ý: ' + flags[0] : 'Nên cân nhắc, vì ' + flags.join('; ');
        if (!flags.length) good.push(y);
        rows.push('<tr><td><strong>' + y + '</strong></td><td>' + verdict + '</td></tr>');
      }
      L.resultBox(box, '<h3>Năm cưới cho chồng ' + cp.hy + ' và vợ ' + cp.wy + '</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm</th><th>Đánh giá</th></tr>' + rows.join('') + '</table></div>' +
        (good.length ? '<p><strong>Các năm không phạm cả ba hạn Kim Lâu, Hoàng Ốc và Tam Tai:</strong> ' + good.join(', ') + '. Trong các năm này, bạn chọn tiếp ngày cưới cụ thể bằng công cụ Xem ngày cưới hỏi.</p>' : '<p>Chín năm tới luôn có ít nhất một hạn chen vào; trường hợp này dân gian thường cưới vào năm chỉ phạm một hạn nhẹ nhất và hóa giải bằng việc chọn ngày giờ tốt.</p>') +
        '<p class="ptv-note">Kim Lâu tính theo tuổi âm của vợ, Hoàng Ốc theo tuổi âm của chồng, Tam Tai theo tuổi của từng người. Bảng này do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> tính theo đúng các bảng hạn đang dùng trên toàn trang.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'boi-4-so-cuoi-dien-thoai': boi4V2, 'xem-tuoi-vo-chong': voChongV2 });
})();

/* --- Chon nghe + Chon mau sac v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function guideData() { return window.PTV_MENH_GUIDE || {}; }
  function genIn(el) { return Object.keys(L.GENERATES).filter(function (k) { return L.GENERATES[k] === el; })[0]; }
  var JOB_GROUPS = [
    ['Tài chính, ngân hàng, kế toán, kim loại và trang sức', 'Kim'],
    ['Công nghệ thông tin, cơ khí, kỹ thuật và y khoa', 'Kim'],
    ['Giáo dục, đào tạo, xuất bản và đồ gỗ nội thất', 'Mộc'],
    ['Y dược, đông y, nông lâm nghiệp và thời trang', 'Mộc'],
    ['Logistics, vận tải, du lịch và thương mại linh hoạt', 'Thủy'],
    ['Thủy hải sản, đồ uống và ngoại giao, đàm phán', 'Thủy'],
    ['Truyền thông, quảng cáo, giải trí và ẩm thực', 'Hỏa'],
    ['Điện tử, năng lượng và các nghề trình diễn, sân khấu', 'Hỏa'],
    ['Xây dựng, bất động sản và kiến trúc', 'Thổ'],
    ['Nông nghiệp, khai khoáng, gốm sứ và vật liệu', 'Thổ']
  ];
  function ngheV2(c) {
    c.innerHTML = V.tabsHTML([['ng-main', 'Nghề hợp theo mệnh của bạn'], ['ng-check', 'Kiểm tra một nhóm nghề cụ thể']]) +
      '<div id="ng-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + '</div>', 'Xem nghề hợp với tôi') + '</div>' +
      '<div id="ng-check" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Nhóm nghề bạn đang cân nhắc', L.select('job', JOB_GROUPS.map(function (j, i) { return '<option value="' + i + '">' + j[0] + '</option>'; }).join(''))) + '</div>', 'Kiểm tra nghề này') + '</div>';
    V.wireTabs(c, ['ng-main', 'ng-check']);
    function relJob(jobEl, myEl) {
      if (jobEl === myEl) return ['Rất hợp', 'Nghề thuộc chính hành ' + myEl + ' của bạn: môi trường nghề nuôi dưỡng đúng khí chất bản mệnh, bạn phát huy được thế mạnh tự nhiên và ít phải gồng mình nhất.'];
      if (L.GENERATES[jobEl] === myEl) return ['Rất hợp', 'Hành ' + jobEl + ' của nghề SINH cho hành ' + myEl + ' của bạn: đây là nhóm hợp nhất theo ngũ hành, nghề nâng đỡ người, càng làm càng có lực.'];
      if (L.GENERATES[myEl] === jobEl) return ['Hợp vừa, tốn sức', 'Hành ' + myEl + ' của bạn SINH cho hành ' + jobEl + ' của nghề: bạn phải bỏ sức nuôi nghề, làm được và có thành quả nhưng cần chú ý giữ sức và chọn vị trí có tích lũy, tránh nghề đốt sức ngắn hạn.'];
      if (L.CONTROLS[myEl] === jobEl) return ['Hợp vừa, có thử thách', 'Hành ' + myEl + ' của bạn KHẮC hành ' + jobEl + ' của nghề: bạn ở thế chế ngự được nghề, hợp vai trò quản lý, kiểm soát chất lượng, nhưng cần tránh nóng vội khi nghề gặp trục trặc.'];
      return ['Ít hợp', 'Hành ' + jobEl + ' của nghề KHẮC hành ' + myEl + ' của bạn: môi trường nghề tạo áp lực ngược lên bản mệnh. Nếu vẫn chọn, hãy bổ trợ bằng màu sắc, không gian làm việc thuộc hành ' + genIn(myEl) + ' sinh ' + myEl + ' và chọn mảng việc nhẹ nhàng nhất trong ngành.'];
    }
    c.querySelector('#ng-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ng-main'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), G = guideData();
      var gi = genIn(yi.el);
      var mine = JOB_GROUPS.filter(function (j) { return j[1] === yi.el; }).map(function (j) { return j[0].toLowerCase(); }).join('; ');
      var feed = JOB_GROUPS.filter(function (j) { return j[1] === gi; }).map(function (j) { return j[0].toLowerCase(); }).join('; ');
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<h3>Nghề hợp cho mệnh ' + yi.el + '</h3>' + (G[yi.el] ? '<p>' + esc(G[yi.el].nghe) + '</p>' : '') +
        '<p><strong>Nhóm nghề thuộc hành bản mệnh ' + yi.el + ':</strong> ' + mine + '.</p>' +
        '<p><strong>Nhóm nghề thuộc hành ' + gi + ' sinh cho mệnh của bạn (được coi là hợp nhất):</strong> ' + feed + '.</p>' +
        '<p class="ptv-note">Nghề hợp mệnh là lớp tham khảo về khí chất: nghề hợp nhất trên giấy vẫn cần đúng năng lực và thị trường. Sang tab bên cạnh để kiểm tra một nhóm nghề cụ thể bạn đang cân nhắc.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#ng-check form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ng-check'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y);
      var j = JOB_GROUPS[parseInt(box.querySelector('#job').value, 10)], r = relJob(j[1], yi.el);
      L.resultBox(box, '<h3>' + r[0] + '</h3><p>Bạn sinh năm ' + y + ', mệnh ' + esc(yi.napAm) + ' hành ' + yi.el + '. Nhóm nghề "' + j[0] + '" thuộc hành ' + j[1] + '.</p><p>' + r[1] + '</p>');
    });
  }

  var COLOR_SET = {
    'Kim': { good: [['Trắng', '#f5f5f5'], ['Xám ghi', '#9e9e9e'], ['Vàng ánh kim', '#c9a227']], feed: [['Vàng đất', '#d9a441'], ['Nâu đất', '#8d5a2b'], ['Cam đất', '#c97b2d']], bad: [['Đỏ', '#c62828'], ['Hồng', '#e57373'], ['Tím', '#7b1fa2']] },
    'Mộc': { good: [['Xanh lá', '#2e7d32'], ['Xanh rêu', '#5d7052'], ['Xanh nõn', '#9ccc65']], feed: [['Đen', '#212121'], ['Xanh dương', '#1565c0'], ['Xanh biển', '#42a5f5']], bad: [['Trắng', '#f5f5f5'], ['Xám bạc', '#bdbdbd'], ['Vàng ánh kim', '#c9a227']] },
    'Thủy': { good: [['Đen', '#212121'], ['Xanh dương đậm', '#0d47a1'], ['Xanh biển', '#42a5f5']], feed: [['Trắng', '#f5f5f5'], ['Xám ghi', '#9e9e9e'], ['Bạc', '#cfd8dc']], bad: [['Vàng đất', '#d9a441'], ['Nâu đất', '#8d5a2b'], ['Cam đất', '#c97b2d']] },
    'Hỏa': { good: [['Đỏ', '#c62828'], ['Hồng', '#e57373'], ['Tím', '#7b1fa2'], ['Cam', '#ef6c00']], feed: [['Xanh lá', '#2e7d32'], ['Xanh rêu', '#5d7052']], bad: [['Đen', '#212121'], ['Xanh dương đậm', '#0d47a1']] },
    'Thổ': { good: [['Vàng đất', '#d9a441'], ['Nâu đất', '#8d5a2b'], ['Cam đất', '#c97b2d']], feed: [['Đỏ', '#c62828'], ['Hồng', '#e57373'], ['Tím', '#7b1fa2']], bad: [['Xanh lá', '#2e7d32'], ['Xanh rêu', '#5d7052']] }
  };
  var PURPOSES = {
    'xe': 'Khi mua xe, màu hợp mệnh được dùng cho màu sơn chính. Xe là tài sản lớn và gắn với an toàn đi lại, nên ngoài màu hợp mệnh hãy ưu tiên màu bạn nhìn thấy dễ chịu mỗi ngày.',
    'nha': 'Khi sơn nhà, dùng màu hợp mệnh cho phòng khách và mặt tiền ở tông nhạt, màu sinh nhập cho điểm nhấn. Tránh sơn cả nhà bằng một màu đậm chỉ vì hợp mệnh.',
    'vi': 'Ví tiền và túi xách là vật theo người hằng ngày, đây là chỗ màu hợp mệnh phát huy rõ nhất vì tiếp xúc thường xuyên. Chọn màu bản mệnh hoặc màu sinh nhập đều tốt.',
    'phongvan': 'Trang phục phỏng vấn và gặp đối tác: dùng màu sinh nhập làm chủ đạo để được nâng đỡ, điểm một chi tiết màu bản mệnh như cà vạt, khăn hoặc phụ kiện.',
    'logo': 'Logo và nhận diện thương hiệu: lấy màu bản mệnh làm màu phụ trợ, màu sinh nhập làm màu chính nếu ngành của bạn thuộc hành khắc. Màu logo còn phải hợp ngành nghề trước khi hợp mệnh cá nhân.'
  };
  function swatches(list) {
    return list.map(function (x) { return '<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:' + x[1] + ';border:1px solid #bbb;vertical-align:-3px;margin-right:4px"></span>' + x[0]; }).join(' · ');
  }
  function mauV2(c) {
    c.innerHTML = V.tabsHTML([['m-main', 'Bảng màu theo mệnh của bạn'], ['m-purpose', 'Chọn màu theo việc cụ thể']]) +
      '<div id="m-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + '</div>', 'Xem bảng màu của tôi') + '</div>' +
      '<div id="m-purpose" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Việc bạn cần chọn màu', L.select('p', '<option value="xe">Mua xe</option><option value="nha">Sơn nhà</option><option value="vi">Ví tiền, túi xách</option><option value="phongvan">Trang phục phỏng vấn, gặp đối tác</option><option value="logo">Logo, nhận diện thương hiệu</option>')) + '</div>', 'Gợi ý màu cho việc này') + '</div>';
    V.wireTabs(c, ['m-main', 'm-purpose']);
    c.querySelector('#m-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#m-main'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), G = guideData(), cs = COLOR_SET[yi.el], gi = genIn(yi.el);
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<h3>Bảng màu cho mệnh ' + yi.el + '</h3>' + (G[yi.el] ? '<p>' + esc(G[yi.el].mau) + '</p>' : '') +
        '<p><strong>Màu bản mệnh (hành ' + yi.el + '):</strong> ' + swatches(cs.good) + '</p>' +
        '<p><strong>Màu tương sinh (hành ' + gi + ' sinh ' + yi.el + ', được coi là tốt nhất):</strong> ' + swatches(cs.feed) + '</p>' +
        '<p><strong>Màu nên hạn chế (hành khắc mệnh):</strong> ' + swatches(cs.bad) + '</p>' +
        '<p class="ptv-note">Màu hợp mệnh là lớp hỗ trợ tâm lý và thẩm mỹ. Sang tab bên cạnh để lấy gợi ý màu theo từng việc cụ thể như mua xe hay sơn nhà.</p>';
      L.resultBox(box, html);
    });
    c.querySelector('#m-purpose form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#m-purpose'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), cs = COLOR_SET[yi.el], p = box.querySelector('#p').value;
      L.resultBox(box, '<h3>Gợi ý màu cho mệnh ' + yi.el + '</h3><p><strong>Ưu tiên:</strong> ' + swatches(cs.feed.concat(cs.good).slice(0, 4)) + '</p><p>' + PURPOSES[p] + '</p><p><strong>Nên tránh làm màu chính:</strong> ' + swatches(cs.bad) + '.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'chon-nghe-hop-tuoi': ngheV2, 'chon-mau-sac-hop-tuoi': mauV2 });
})();

/* --- Tim nguoi hop tuoi + Chon trang suc v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function guideData() { return window.PTV_MENH_GUIDE || {}; }
  function scorePair(me, o) {
    var s = 0, reasons = [];
    var chi = L.chiRelation(me.chi, o.chi); s += chi.score; if (chi.score >= 2) reasons.push(chi.label); if (chi.score < 0) reasons.push(chi.label);
    if (L.CAN_HOP[me.can] === o.can) { s += 1; reasons.push('Can hợp'); }
    var rel = L.relEl(o.el, me.el);
    if (L.GENERATES[o.el] === me.el) { s += 1.5; reasons.push('Mệnh sinh cho bạn'); }
    else if (L.GENERATES[me.el] === o.el) { s += 0.3; reasons.push('Bạn sinh cho họ'); }
    else if (rel.indexOf('Cùng hành') >= 0) { s += 0.5; reasons.push('Cùng hành mệnh'); }
    else if (rel.indexOf('khắc') >= 0) { s -= 1; reasons.push('Mệnh tương khắc'); }
    return { s: s, reasons: reasons, chi: chi, rel: rel };
  }
  function timNguoiV2(c) {
    c.innerHTML = V.tabsHTML([['tn-top', '10 tuổi hợp nhất với bạn'], ['tn-one', 'Kiểm tra một tuổi cụ thể']]) +
      '<div id="tn-top">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Mục đích tìm người hợp tuổi', L.select('p', '<option value="làm ăn">Hợp tác làm ăn</option><option value="kết hôn">Kết hôn</option><option value="bạn bè">Bạn bè, đối tác</option>')) + '</div>', 'Tìm tuổi hợp với tôi') + '</div>' +
      '<div id="tn-one" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Năm sinh của người kia', L.select('y2', L.yearOptions(1940, 2010, 1994))) + '</div>', 'Kiểm tra độ hợp') + '</div>';
    V.wireTabs(c, ['tn-top', 'tn-one']);
    c.querySelector('#tn-top form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tn-top'), y = parseInt(box.querySelector('#y').value, 10), purpose = box.querySelector('#p').value;
      var me = L.yearInfo(y), scored = [];
      for (var cy = 1950; cy <= 2012; cy++) {
        if (cy === y) continue;
        var o = L.yearInfo(cy), r = scorePair(me, o);
        scored.push({ y: cy, info: o, s: r.s, reasons: r.reasons });
      }
      scored.sort(function (a, b) { return b.s - a.s; });
      var rows = scored.slice(0, 10).map(function (t) { return '<tr><td><strong>' + t.y + '</strong></td><td>' + t.info.text + '</td><td>' + esc(t.info.napAm) + '</td><td>' + String(Math.round(t.s * 10) / 10).replace('.', ',') + '</td><td>' + t.reasons.join(', ') + '</td></tr>'; }).join('');
      L.resultBox(box, '<div class="ptv-facts"><span>Bạn sinh năm <strong>' + y + '</strong> (' + me.text + ', mệnh ' + esc(me.napAm) + ')</span><span>Mục đích: <strong>' + purpose + '</strong></span></div><h3>10 tuổi hợp nhất với bạn</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Năm sinh</th><th>Tuổi</th><th>Mệnh</th><th>Điểm hợp</th><th>Lý do</th></tr>' + rows + '</table></div><p class="ptv-note">Điểm hợp tính từ quan hệ địa chi, thiên can và nạp âm (thang tham khảo, cao nhất quanh 5,5). Hợp tuổi chỉ là một yếu tố, sự hòa hợp thật sự đến từ tính cách và cách cư xử của hai bên.</p>');
    });
    c.querySelector('#tn-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#tn-one'), y = parseInt(box.querySelector('#y').value, 10), y2 = parseInt(box.querySelector('#y2').value, 10);
      var me = L.yearInfo(y), o = L.yearInfo(y2), r = scorePair(me, o);
      var verdict = r.s >= 3.5 ? 'Rất hợp theo can chi và mệnh' : r.s >= 1.5 ? 'Hợp ở mức tốt' : r.s >= 0 ? 'Mức bình hòa, hợp do cách sống' : 'Có điểm xung cần lưu ý';
      L.resultBox(box, '<h3>' + y + ' (' + me.text + ') và ' + y2 + ' (' + o.text + '): ' + verdict + '</h3>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Yếu tố</th><th>Kết quả</th></tr>' +
        '<tr><td><strong>Địa chi</strong></td><td>' + r.chi.label + '</td></tr>' +
        '<tr><td><strong>Thiên can</strong></td><td>' + (L.CAN_HOP[me.can] === o.can ? 'Can hợp (' + me.can + ' hợp ' + o.can + ')' : 'Không thuộc cặp can hợp') + '</td></tr>' +
        '<tr><td><strong>Nạp âm</strong></td><td>' + r.rel + '</td></tr>' +
        '<tr><td><strong>Điểm hợp</strong></td><td>' + String(Math.round(r.s * 10) / 10).replace('.', ',') + '</td></tr></table></div>' +
        '<p>' + (r.reasons.length ? 'Điểm đáng chú ý: ' + r.reasons.join(', ') + '.' : 'Hai tuổi không có điểm hợp hay xung nổi bật, quan hệ êm hay không nằm ở cách hai bên cư xử.') + ' Nếu đây là chuyện làm ăn, hãy thử một dự án nhỏ trước khi góp vốn lớn; nếu là chuyện tình cảm, dùng thêm trang Xem tuổi vợ chồng để xét cả cung phi.</p>');
    });
  }

  var STONE_SET = {
    'Kim': { metal: 'Vàng, bạch kim, bạc và các kim loại sáng màu', stones: 'Kim cương, thạch anh trắng, thạch anh vàng, hổ phách, đá mặt trăng', wear: 'Đeo kim loại trơn hoặc đá trắng, vàng để tăng sự sắc bén và quyết đoán trong công việc.' },
    'Mộc': { metal: 'Chất liệu gỗ (trầm hương, gỗ sưa) và vàng, bạc điểm đá xanh', stones: 'Ngọc bích, thạch anh xanh, ngọc lục bảo, đá lông công', wear: 'Vòng gỗ trầm và đá xanh lá hợp người mệnh Mộc vì cùng khí nuôi dưỡng, giúp tinh thần thư thái.' },
    'Thủy': { metal: 'Bạc, bạch kim và kim loại mặt cong, mềm', stones: 'Thạch anh đen, aquamarine, sapphire, đá mắt hổ xanh, ngọc trai đen', wear: 'Trang sức có đường cong, hình giọt nước và đá đen, xanh dương giúp hành Thủy thêm sâu và tĩnh.' },
    'Hỏa': { metal: 'Vàng hồng, vàng và các thiết kế góc cạnh, nổi bật', stones: 'Ruby, thạch anh hồng, thạch anh tím, garnet, đá mã não đỏ', wear: 'Đá đỏ, hồng, tím làm tăng sự hiện diện và nhiệt huyết, hợp các dịp cần tỏa sáng và thuyết phục.' },
    'Thổ': { metal: 'Vàng, đồng và các thiết kế chắc chắn, ít chi tiết', stones: 'Thạch anh vàng, hổ phách, đá mắt hổ nâu, mã não vàng, ngọc hoàng long', wear: 'Đá vàng, nâu đất và thiết kế đầm chắc hợp khí Thổ là sự ổn định và chữ tín.' }
  };
  function trangSucV2(c) {
    c.innerHTML = V.tabsHTML([['ts-main', 'Trang sức theo mệnh của bạn'], ['ts-purpose', 'Chọn trang sức theo dịp']]) +
      '<div id="ts-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + '</div>', 'Xem trang sức hợp với tôi') + '</div>' +
      '<div id="ts-purpose" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Dịp đeo chính', L.select('p', '<option value="daily">Đeo hằng ngày, cầu bình an và tài lộc đều</option><option value="sign">Đi ký kết, đàm phán, việc quan trọng</option><option value="gift">Mua tặng người thân</option><option value="event">Dự tiệc, sự kiện cần nổi bật</option>')) + '</div>', 'Gợi ý cho dịp này') + '</div>';
    V.wireTabs(c, ['ts-main', 'ts-purpose']);
    function genInEl(el) { return Object.keys(L.GENERATES).filter(function (k) { return L.GENERATES[k] === el; })[0]; }
    c.querySelector('#ts-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ts-main'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), G = guideData(), st = STONE_SET[yi.el], gi = genInEl(yi.el), stFeed = STONE_SET[gi];
      L.resultBox(box, '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<h3>Trang sức cho mệnh ' + yi.el + '</h3>' + (G[yi.el] ? '<p>' + esc(G[yi.el].trangSuc) + '</p>' : '') +
        '<p><strong>Chất liệu và kim loại hợp:</strong> ' + st.metal + '.</p>' +
        '<p><strong>Đá hợp hành bản mệnh ' + yi.el + ':</strong> ' + st.stones + '.</p>' +
        '<p><strong>Đá của hành ' + gi + ' sinh cho mệnh (đeo để được nâng đỡ):</strong> ' + stFeed.stones + '.</p>' +
        '<p>' + st.wear + '</p>');
    });
    c.querySelector('#ts-purpose form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ts-purpose'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), st = STONE_SET[yi.el], p = box.querySelector('#p').value;
      var notes = {
        daily: 'Đeo hằng ngày nên chọn món nhỏ, bền và ít vướng: một chiếc vòng đá bản mệnh hoặc nhẫn kim loại trơn thuộc nhóm hợp mệnh. Vật đeo sát người mỗi ngày mới là vật có ý nghĩa phong thủy rõ nhất.',
        sign: 'Khi ký kết và đàm phán, ưu tiên trang sức của hành sinh cho mệnh bạn để ở thế được nâng đỡ, thiết kế gọn và đắt vừa đủ để tạo sự tin cậy, tránh phô trương quá mức.',
        gift: 'Mua tặng thì tính theo MỆNH CỦA NGƯỜI NHẬN, không phải mệnh người tặng. Nếu chưa biết năm sinh người nhận, chọn trang sức bạc hoặc vàng trơn trung tính và tránh đá có màu khắc mạnh.',
        event: 'Dự tiệc cần nổi bật: chọn đá bản mệnh có độ bắt sáng cao và kích thước lớn hơn ngày thường một chút. Người mệnh Hỏa và Kim có lợi thế tự nhiên với trang sức sự kiện.'
      };
      L.resultBox(box, '<h3>Gợi ý cho mệnh ' + yi.el + '</h3><p><strong>Nhóm nên chọn:</strong> ' + st.stones + '; chất liệu: ' + st.metal.toLowerCase() + '.</p><p>' + notes[p] + '</p><p class="ptv-note">Trang sức phong thủy tại <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> là gợi ý về chất liệu và màu đá theo ngũ hành. Giá trị thật của món trang sức vẫn nằm ở chất lượng chế tác và cảm giác của người đeo.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'tim-nguoi-hop-tuoi': timNguoiV2, 'chon-trang-suc-hop-tuoi': trangSucV2 });
})();

/* --- Chon cay trong + Chon quan ao v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function guideData() { return window.PTV_MENH_GUIDE || {}; }
  function genInEl(el) { return Object.keys(L.GENERATES).filter(function (k) { return L.GENERATES[k] === el; })[0]; }
  var PLANTS = [
    ['Cây kim tiền', 'Kim', 'it', ['trong-nha', 'ban-lam-viec'], 'Lá dày bóng, chịu bóng tốt, là cây phong thủy phổ biến nhất cho quầy thu ngân và bàn làm việc.'],
    ['Cây kim ngân', 'Mộc', 'ca', ['trong-nha', 'ban-cong'], 'Thân xoắn tượng trưng tụ tài, ưa sáng vừa, hợp phòng khách và cửa hàng.'],
    ['Cây ngọc ngân', 'Kim', 'it', ['trong-nha', 'ban-lam-viec'], 'Lá đốm trắng hợp hành Kim, chịu bóng, hợp bàn làm việc thiếu sáng.'],
    ['Cây lan ý', 'Kim', 'it', ['trong-nha'], 'Hoa trắng thanh khiết, lọc không khí tốt, hợp phòng ngủ và phòng khách ít nắng.'],
    ['Cây trầu bà', 'Mộc', 'ca', ['trong-nha', 'ban-cong', 'ban-lam-viec'], 'Dễ sống bậc nhất, leo hoặc buông, hợp cả chậu treo ban công lẫn bình thủy sinh trên bàn.'],
    ['Cây phát tài', 'Mộc', 'ca', ['trong-nha', 'truoc-cua'], 'Thân thẳng lá dài, thường đặt hai bên cửa chính hoặc góc phòng khách.'],
    ['Cây lưỡi hổ', 'Thổ', 'ca', ['trong-nha', 'ban-cong', 'truoc-cua'], 'Chịu hạn và chịu bóng đều tốt, lá dựng thẳng, hợp hành lang và trước cửa.'],
    ['Cây sen đá', 'Thổ', 'nhieu', ['ban-cong', 'ban-lam-viec'], 'Nhỏ gọn, cần nắng, hợp bậu cửa sổ và bàn làm việc có nắng buổi sáng.'],
    ['Cây vạn lộc', 'Hỏa', 'it', ['trong-nha', 'ban-lam-viec'], 'Lá điểm hồng đỏ hợp hành Hỏa, chịu bóng vừa, làm điểm nhấn màu cho góc làm việc.'],
    ['Cây hồng môn', 'Hỏa', 'it', ['trong-nha'], 'Hoa đỏ bền, hợp phòng khách và quầy lễ tân cần điểm nhấn ấm.'],
    ['Cây thủy sinh để bàn (trầu bà nước, phát tài nước)', 'Thủy', 'it', ['ban-lam-viec', 'trong-nha'], 'Trồng trong nước sạch, hợp người mệnh Thủy và không gian cần yếu tố nước nhẹ nhàng.'],
    ['Cây cau tiểu trâm', 'Mộc', 'it', ['ban-lam-viec', 'trong-nha'], 'Dáng nhỏ thanh, chịu bóng, là cây để bàn kinh điển cho dân văn phòng.']
  ];
  var PLACE_TXT = { 'trong-nha': 'trong nhà', 'ban-cong': 'ban công, sân thượng', 'ban-lam-viec': 'bàn làm việc', 'truoc-cua': 'trước cửa, sảnh' };
  function cayV2(c) {
    c.innerHTML = V.tabsHTML([['cay-main', 'Cây hợp theo mệnh của bạn'], ['cay-place', 'Chọn cây theo chỗ đặt']]) +
      '<div id="cay-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + '</div>', 'Xem cây hợp với tôi') + '</div>' +
      '<div id="cay-place" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Chỗ bạn định đặt cây', L.select('pl', '<option value="trong-nha">Trong nhà, ít nắng</option><option value="ban-cong">Ban công, nhiều nắng</option><option value="ban-lam-viec">Bàn làm việc</option><option value="truoc-cua">Trước cửa, sảnh đón khách</option>')) + '</div>', 'Gợi ý cây cho chỗ này') + '</div>';
    V.wireTabs(c, ['cay-main', 'cay-place']);
    c.querySelector('#cay-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#cay-main'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), G = guideData(), gi = genInEl(yi.el);
      var mine = PLANTS.filter(function (p) { return p[1] === yi.el || p[1] === gi; }).map(function (p) { return '<tr><td><strong>' + p[0] + '</strong></td><td>' + p[1] + '</td><td>' + p[4] + '</td></tr>'; }).join('');
      L.resultBox(box, '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<h3>Cây trồng cho mệnh ' + yi.el + '</h3>' + (G[yi.el] ? '<p>' + esc(G[yi.el].cay) + '</p>' : '') +
        '<p>Danh sách dưới đây gồm cây thuộc hành bản mệnh ' + yi.el + ' và hành ' + gi + ' sinh cho mệnh của bạn, kèm điều kiện chăm thực tế:</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Cây</th><th>Hành</th><th>Ghi chú chăm và đặt</th></tr>' + mine + '</table></div>' +
        '<p class="ptv-note">Cây thuộc hành nào là theo phân loại phong thủy phổ biến của <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a>. Điều kiện nắng và nước trong cột ghi chú mới là yếu tố quyết định cây sống khỏe.</p>');
    });
    c.querySelector('#cay-place form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#cay-place'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), gi = genInEl(yi.el), pl = box.querySelector('#pl').value;
      var fit = PLANTS.filter(function (p) { return p[3].indexOf(pl) >= 0; });
      var good = fit.filter(function (p) { return p[1] === yi.el || p[1] === gi; });
      var list = (good.length ? good : fit).map(function (p) { return '<tr><td><strong>' + p[0] + '</strong></td><td>' + p[1] + (p[1] === yi.el || p[1] === gi ? ' (hợp mệnh bạn)' : '') + '</td><td>' + p[4] + '</td></tr>'; }).join('');
      L.resultBox(box, '<h3>Cây cho vị trí ' + PLACE_TXT[pl] + ', mệnh ' + yi.el + '</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Cây</th><th>Hành</th><th>Ghi chú</th></tr>' + list + '</table></div>' +
        '<p>' + (good.length ? 'Các cây trên vừa hợp vị trí vừa hợp mệnh hoặc hành sinh cho mệnh của bạn.' : 'Vị trí này không có cây nào thuộc hành bản mệnh hay hành sinh cho mệnh của bạn trong danh sách phổ biến, nên tiêu chí sống khỏe được ưu tiên; bạn vẫn có thể tăng yếu tố hợp mệnh bằng màu chậu thuộc hành ' + gi + '.') + '</p>');
    });
  }

  var QA_SET = {
    'Kim': { main: 'Trắng, xám, ghi, vàng ánh kim', accent: 'Vàng đất, nâu nhạt (Thổ sinh Kim)', avoid: 'Đỏ, hồng, tím diện rộng (Hỏa khắc Kim)', fabric: 'Vải đứng form, ít nhăn; phụ kiện kim loại như đồng hồ, kính gọng kim loại là điểm mạnh của mệnh Kim.' },
    'Mộc': { main: 'Xanh lá, xanh rêu, xanh nõn', accent: 'Đen, xanh dương (Thủy sinh Mộc)', avoid: 'Trắng, xám kim loại diện rộng (Kim khắc Mộc)', fabric: 'Vải tự nhiên cotton, linen; họa tiết hoa lá, sọc dọc giúp mệnh Mộc thêm mềm mại và cao ráo.' },
    'Thủy': { main: 'Đen, xanh dương, xanh biển', accent: 'Trắng, xám bạc (Kim sinh Thủy)', avoid: 'Vàng đất, nâu đất diện rộng (Thổ khắc Thủy)', fabric: 'Vải mềm có độ rủ, lụa và voan; đường cắt uốn lượn hợp khí Thủy uyển chuyển.' },
    'Hỏa': { main: 'Đỏ, hồng, tím, cam', accent: 'Xanh lá (Mộc sinh Hỏa)', avoid: 'Đen, xanh dương đậm diện rộng (Thủy khắc Hỏa)', fabric: 'Kiểu dáng nổi bật, một điểm nhấn màu mạnh là đủ; mệnh Hỏa nên tiết chế tránh mặc cả cây đỏ trong dịp cần sự điềm tĩnh.' },
    'Thổ': { main: 'Vàng đất, nâu, be, cam đất', accent: 'Đỏ, hồng, tím (Hỏa sinh Thổ)', avoid: 'Xanh lá diện rộng (Mộc khắc Thổ)', fabric: 'Vải dày dặn, tông trầm ấm; mệnh Thổ hợp phong cách chắc chắn, ít chi tiết rườm rà.' }
  };
  var OCCASIONS = {
    'lam': ['Đi làm hằng ngày', 'Ưu tiên màu bản mệnh ở tông trung tính làm chủ đạo, điểm một phụ kiện màu sinh nhập. Sự gọn gàng và vừa vặn quan trọng hơn màu sắc.'],
    'phongvan': ['Phỏng vấn, gặp đối tác', 'Dùng màu của hành sinh cho mệnh làm chủ đạo để ở thế được nâng đỡ, thêm một chi tiết màu bản mệnh như cà vạt, khăn túi hoặc giày.'],
    'henho': ['Hẹn hò, gặp gỡ thân mật', 'Tông màu bản mệnh ở sắc độ mềm hơn thường ngày, thêm màu sinh nhập ở phụ kiện nhỏ. Tránh mặc nguyên bộ màu kỵ vì dễ tạo cảm giác nặng nề không cần thiết.'],
    'tiec': ['Dự tiệc, sự kiện', 'Đây là dịp được phép nổi bật: dùng màu bản mệnh ở sắc độ mạnh nhất, chất liệu có độ bóng nhẹ. Mệnh Hỏa và Thổ có lợi thế với tông ấm trên ảnh chụp.'],
    'ky': ['Ký kết, khai trương, việc trọng đại', 'Chọn bộ trang phục có cả màu sinh nhập lẫn màu bản mệnh, tránh toàn bộ trang phục rơi vào màu khắc mệnh trong ngày cần ký giấy tờ quan trọng.']
  };
  function quanAoV2(c) {
    c.innerHTML = V.tabsHTML([['qa-main', 'Bảng phối đồ theo mệnh'], ['qa-occ', 'Phối đồ theo dịp']]) +
      '<div id="qa-main">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + '</div>', 'Xem bảng phối của tôi') + '</div>' +
      '<div id="qa-occ" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của bạn', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Dịp bạn cần phối đồ', L.select('o', Object.keys(OCCASIONS).map(function (k) { return '<option value="' + k + '">' + OCCASIONS[k][0] + '</option>'; }).join(''))) + '</div>', 'Gợi ý phối cho dịp này') + '</div>';
    V.wireTabs(c, ['qa-main', 'qa-occ']);
    c.querySelector('#qa-main form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#qa-main'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), G = guideData(), q = QA_SET[yi.el];
      L.resultBox(box, '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<h3>Phối đồ cho mệnh ' + yi.el + '</h3>' + (G[yi.el] ? '<p>' + esc(G[yi.el].quanAo) + '</p>' : '') +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Nhóm</th><th>Màu và chất liệu</th></tr>' +
        '<tr><td><strong>Màu chủ đạo</strong></td><td>' + q.main + '</td></tr>' +
        '<tr><td><strong>Màu điểm nhấn</strong></td><td>' + q.accent + '</td></tr>' +
        '<tr><td><strong>Nên hạn chế</strong></td><td>' + q.avoid + '</td></tr>' +
        '<tr><td><strong>Chất liệu và form</strong></td><td>' + q.fabric + '</td></tr></table></div>');
    });
    c.querySelector('#qa-occ form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#qa-occ'), y = parseInt(box.querySelector('#y').value, 10), yi = L.yearInfo(y), q = QA_SET[yi.el], o = OCCASIONS[box.querySelector('#o').value];
      L.resultBox(box, '<h3>' + o[0] + ' cho mệnh ' + yi.el + '</h3><p><strong>Bộ màu nên dùng:</strong> chủ đạo ' + q.main.toLowerCase() + '; điểm nhấn ' + q.accent.toLowerCase() + '.</p><p>' + o[1] + '</p><p><strong>Tránh:</strong> ' + q.avoid.toLowerCase() + '.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'chon-cay-trong-hop-tuoi': cayV2, 'chon-quan-ao-hop-tuoi': quanAoV2 });
})();

/* --- Xem ngay cuoi hoi + Xem ngay xuat hanh v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function cuoiHoiV2(c) {
    c.innerHTML = V.tabsHTML([['ch-scan', 'Quét ngày cưới tốt theo tháng'], ['ch-day', 'Kiểm tra một ngày cưới'], ['ch-quarter', 'Top ngày cưới 3 tháng tới']]) +
      '<div id="ch-scan">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của cô dâu', L.select('wy', L.yearOptions(1985, 2010, 1996))) + L.field('Năm sinh của chú rể', L.select('hy', L.yearOptions(1985, 2010, 1994))) + '</div><div class="ptv-row">' + L.field('Tháng muốn cưới', L.select('m', V.monthOptions2()), 'ptv-field-name') + '</div>', 'Xem ngày cưới tốt') + '</div>' +
      '<div id="ch-day" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của cô dâu', L.select('wy', L.yearOptions(1985, 2010, 1996))) + L.field('Ngày dự kiến cưới (năm-tháng-ngày)', '<input type="text" id="dt" value="2027-03-17">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="ch-quarter" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của cô dâu', L.select('wy', L.yearOptions(1985, 2010, 1996)), 'ptv-field-name') + '</div>', 'Tìm ngày cưới tốt nhất 3 tháng tới') + '</div>';
    V.wireTabs(c, ['ch-scan', 'ch-day', 'ch-quarter']);
    c.querySelector('#ch-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ch-scan'), bride = L.yearInfo(parseInt(box.querySelector('#wy').value, 10)), groom = L.yearInfo(parseInt(box.querySelector('#hy').value, 10));
      var parts = box.querySelector('#m').value.split('-').map(Number);
      var wAge = parts[0] - bride.year + 1, kl = L.kimLau(wAge);
      var note = '<p class="ptv-note">Ngày cưới trên trang này chấm theo tuổi của <strong>cô dâu ' + bride.text + '</strong> (lệ truyền thống lấy tuổi cô dâu làm gốc cho ngày cưới), chú rể ' + groom.text + ' là thông tin đối chiếu. Năm ' + parts[0] + ' cô dâu ' + wAge + ' tuổi âm: ' + (kl.bad ? 'năm này cô dâu PHẠM Kim Lâu (' + kl.kind + '), nhiều gia đình sẽ cân nhắc dời năm hoặc làm lễ theo lệ địa phương; bảng ngày dưới đây vẫn chấm theo ngày tốt xấu trong tháng.' : 'năm này cô dâu không phạm Kim Lâu, điều kiện năm đã thuận.') + '</p>';
      L.resultBox(box, '<h3>Ngày cưới tốt tháng ' + parts[1] + '/' + parts[0] + ' cho cô dâu ' + bride.text + '</h3>' + note + V.scanHTML('cuoi-hoi', bride.chi, parts[0], parts[1], 'cưới hỏi'));
    });
    c.querySelector('#ch-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ch-day'), bride = L.yearInfo(parseInt(box.querySelector('#wy').value, 10));
      L.resultBox(box, V.checkDayHTML('cuoi-hoi', bride.chi, box.querySelector('#dt').value, 'cưới hỏi'));
    });
    c.querySelector('#ch-quarter form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#ch-quarter'), bride = L.yearInfo(parseInt(box.querySelector('#wy').value, 10));
      L.resultBox(box, '<h3>Ngày cưới tốt nhất trong 3 tháng tới cho cô dâu ' + bride.text + '</h3>' + V.quarterHTML('cuoi-hoi', bride.chi, 'cưới hỏi'));
    });
  }
  function xuatHanhV2(c) {
    c.innerHTML = V.tabsHTML([['xh-scan', 'Quét ngày xuất hành tốt theo tháng'], ['xh-day', 'Kiểm tra một ngày cụ thể'], ['xh-quarter', 'Top ngày xuất hành 3 tháng tới']]) +
      '<div id="xh-scan">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của người đi', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn xuất hành', L.select('m', V.monthOptions2())) + '</div><div class="ptv-row">' + L.field('Mục đích chuyến đi', L.select('mode', '<option value="chung">Đi xa, công tác, du lịch</option><option value="kinh-doanh">Đi ký kết, mở rộng làm ăn</option><option value="chuyen-nha">Chuyển nhà, nhập trạch xa</option>'), 'ptv-field-name') + '</div>', 'Xem ngày xuất hành tốt') + '</div>' +
      '<div id="xh-day" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của người đi', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Ngày dự kiến đi (năm-tháng-ngày)', '<input type="text" id="dt" value="2027-03-17">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="xh-quarter" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của người đi', L.select('y', L.yearOptions(1940, 2010, 1990)), 'ptv-field-name') + '</div>', 'Tìm ngày xuất hành tốt nhất 3 tháng tới') + '</div>';
    V.wireTabs(c, ['xh-scan', 'xh-day', 'xh-quarter']);
    c.querySelector('#xh-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#xh-scan'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      var parts = box.querySelector('#m').value.split('-').map(Number), mode = box.querySelector('#mode').value;
      var notes = {
        chung: 'Với chuyến đi xa thông thường, ngày đẹp là đủ; hãy để giờ khởi hành tránh khung giờ cao điểm và thời tiết xấu, hai yếu tố thực tế ảnh hưởng chuyến đi nhiều hơn mọi bảng ngày.',
        'kinh-doanh': 'Đi ký kết và mở rộng làm ăn: ngoài ngày đẹp, bạn dùng thêm trang Xem giờ xuất hành để chọn giờ hoàng đạo và hướng Quý nhân trong chính ngày đi, hai lớp này đặc biệt quan trọng với chuyến đi cầu tài.',
        'chuyen-nha': 'Chuyển nhà đi xa là việc lớn gần với nhập trạch: ngày xuất hành chỉ là ngày rời nhà cũ, ngày vào nhà mới nên kiểm tra riêng bằng công cụ Xem ngày nhập trạch để hai đầu chuyến dời đều thuận.'
      };
      L.resultBox(box, '<h3>Ngày xuất hành tốt tháng ' + parts[1] + '/' + parts[0] + ' cho tuổi ' + me.text + '</h3><p class="ptv-note">' + notes[mode] + '</p>' + V.scanHTML('xuat-hanh', me.chi, parts[0], parts[1], 'xuất hành'));
    });
    c.querySelector('#xh-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#xh-day'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, V.checkDayHTML('xuat-hanh', me.chi, box.querySelector('#dt').value, 'xuất hành'));
    });
    c.querySelector('#xh-quarter form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#xh-quarter'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, '<h3>Ngày xuất hành tốt nhất trong 3 tháng tới cho tuổi ' + me.text + '</h3>' + V.quarterHTML('xuat-hanh', me.chi, 'xuất hành'));
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-ngay-cuoi-hoi': cuoiHoiV2, 'xem-ngay-xuat-hanh': xuatHanhV2 });
})();

/* --- Xem ngay nhap trach + Xem ngay mo hang v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc, V = window.PTVDayToolsV2;
  function nhapTrachV2(c) {
    c.innerHTML = V.tabsHTML([['nt-scan', 'Quét ngày nhập trạch theo tháng'], ['nt-day', 'Kiểm tra một ngày cụ thể'], ['nt-quarter', 'Top ngày nhập trạch 3 tháng tới']]) +
      '<div id="nt-scan">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn nhập trạch', L.select('m', V.monthOptions2())) + '</div><div class="ptv-row">' + L.field('Hình thức chuyển vào', L.select('mode', '<option value="o-chinh">Vào ở chính thức ngay</option><option value="chuyen-do">Chuyển đồ trước, ở sau (lấy ngày)</option>'), 'ptv-field-name') + '</div>', 'Xem ngày nhập trạch tốt') + '</div>' +
      '<div id="nt-day" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Ngày dự kiến nhập trạch (năm-tháng-ngày)', '<input type="text" id="dt" value="2027-03-17">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="nt-quarter" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của gia chủ', L.select('y', L.yearOptions(1940, 2010, 1990)), 'ptv-field-name') + '</div>', 'Tìm ngày nhập trạch tốt nhất 3 tháng tới') + '</div>';
    V.wireTabs(c, ['nt-scan', 'nt-day', 'nt-quarter']);
    c.querySelector('#nt-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#nt-scan'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      var parts = box.querySelector('#m').value.split('-').map(Number), mode = box.querySelector('#mode').value;
      var note = mode === 'o-chinh'
        ? '<p class="ptv-note">Bạn chọn hình thức <strong>vào ở chính thức</strong>: ngày nhập trạch là ngày làm lễ và ngủ lại đêm đầu tiên, nên điểm ngày được đọc nghiêm hơn và bạn nên chọn thêm giờ hoàng đạo trong ngày để bưng mâm lễ vào nhà.</p>'
        : '<p class="ptv-note">Bạn chọn hình thức <strong>chuyển đồ trước, ở sau</strong> (lấy ngày): ngày này bạn chuyển những vật tượng trưng và làm lễ nhỏ xin vào nhà, việc dọn ở chính thức có thể làm sau vào ngày thường. Đây là cách dân gian dùng khi ngày đẹp đến trước ngày dọn xong nhà.</p>';
      L.resultBox(box, '<h3>Ngày nhập trạch tốt tháng ' + parts[1] + '/' + parts[0] + ' cho gia chủ ' + me.text + '</h3>' + note + V.scanHTML('nhap-trach', me.chi, parts[0], parts[1], 'nhập trạch'));
    });
    c.querySelector('#nt-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#nt-day'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, V.checkDayHTML('nhap-trach', me.chi, box.querySelector('#dt').value, 'nhập trạch') +
        '<h3>Việc cần làm trong ngày nhập trạch</h3><ol><li>Gia chủ tự tay mang vật tượng trưng vào nhà trước: bếp lửa hoặc nồi cơm, chiếu, gạo và nước, tượng trưng cho lửa, chỗ nằm và cái ăn.</li><li>Làm lễ cúng gia tiên và thổ công, đọc văn khấn nhập trạch và xin phép an cư.</li><li>Mở hết cửa sổ, bật đèn và đun một ấm nước sôi trong bếp, tượng trưng cho nhà có sinh khí và tài lộc lưu thông.</li><li>Mọi người trong nhà đều vào nhà trong ngày này, tránh để ai vắng mặt khó chịu; đêm đầu nên ngủ lại nếu là nhập trạch chính thức.</li><li>Trong ngày nhập trạch tránh cãi vã, tránh cho người ngoài mượn đồ và tránh làm vỡ đồ thủy tinh, gốm sứ.</li></ol>');
    });
    c.querySelector('#nt-quarter form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#nt-quarter'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, '<h3>Ngày nhập trạch tốt nhất trong 3 tháng tới cho tuổi ' + me.text + '</h3>' + V.quarterHTML('nhap-trach', me.chi, 'nhập trạch'));
    });
  }
  function moHangV2(c) {
    c.innerHTML = V.tabsHTML([['mh-scan', 'Quét ngày mở hàng theo tháng'], ['mh-day', 'Kiểm tra một ngày cụ thể'], ['mh-quarter', 'Top ngày mở hàng 3 tháng tới']]) +
      '<div id="mh-scan">' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ hàng', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Tháng muốn mở hàng, khai trương', L.select('m', V.monthOptions2())) + '</div><div class="ptv-row">' + L.field('Loại việc mở hàng', L.select('mode', '<option value="moi">Khai trương cửa hàng mới</option><option value="mo-lai">Mở hàng lại sau kỳ nghỉ dài</option><option value="chi-nhanh">Mở thêm chi nhánh, điểm bán mới</option>'), 'ptv-field-name') + '</div>', 'Xem ngày mở hàng tốt') + '</div>' +
      '<div id="mh-day" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ hàng', L.select('y', L.yearOptions(1940, 2010, 1990))) + L.field('Ngày dự kiến (năm-tháng-ngày)', '<input type="text" id="dt" value="2027-03-17">') + '</div>', 'Kiểm tra ngày này') + '</div>' +
      '<div id="mh-quarter" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Năm sinh của chủ hàng', L.select('y', L.yearOptions(1940, 2010, 1990)), 'ptv-field-name') + '</div>', 'Tìm ngày mở hàng tốt nhất 3 tháng tới') + '</div>';
    V.wireTabs(c, ['mh-scan', 'mh-day', 'mh-quarter']);
    var NOTES = {
      moi: 'Khai trương cửa hàng mới là việc lớn nhất trong ba loại: ngoài ngày đẹp theo tuổi chủ, bạn nên chọn ngày trong tuần có đông khách tự nhiên của ngành mình và dành ngân sách cho tuần đầu vận hành thử.',
      'mo-lai': 'Mở hàng lại sau kỳ nghỉ dài mang tính khởi động: ngày đẹp vừa phải là đủ, điều quan trọng là mở đúng giờ đã thông báo, có sẵn hàng và nhân sự trực đầy đủ ngày đầu.',
      'chi-nhanh': 'Mở thêm chi nhánh: tuổi dùng để chấm ngày là tuổi của chủ doanh nghiệp, không phải tuổi người quản lý chi nhánh. Ngày khai trương chi nhánh đẹp cộng với mặt bằng tốt mới là cặp quyết định doanh số.'
    };
    c.querySelector('#mh-scan form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mh-scan'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      var parts = box.querySelector('#m').value.split('-').map(Number), mode = box.querySelector('#mode').value;
      L.resultBox(box, '<h3>Ngày mở hàng tốt tháng ' + parts[1] + '/' + parts[0] + ' cho chủ hàng tuổi ' + me.text + '</h3><p class="ptv-note">' + NOTES[mode] + '</p>' + V.scanHTML('mo-hang', me.chi, parts[0], parts[1], 'mở hàng, khai trương'));
    });
    c.querySelector('#mh-day form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mh-day'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, V.checkDayHTML('mo-hang', me.chi, box.querySelector('#dt').value, 'mở hàng, khai trương'));
    });
    c.querySelector('#mh-quarter form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#mh-quarter'), me = L.yearInfo(parseInt(box.querySelector('#y').value, 10));
      L.resultBox(box, '<h3>Ngày mở hàng tốt nhất trong 3 tháng tới cho tuổi ' + me.text + '</h3>' + V.quarterHTML('mo-hang', me.chi, 'mở hàng, khai trương'));
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'xem-ngay-nhap-trach': nhapTrachV2, 'xem-ngay-mo-hang': moHangV2 });
})();

/* --- Doi ngay am lich v2 --- */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, esc = L.esc, V = window.PTVDayToolsV2;
  var WD = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  function doiNgayV2(c) {
    var now = new Date();
    c.innerHTML = V.tabsHTML([['dn-one', 'Đổi một ngày'], ['dn-month', 'Lịch âm của một tháng dương'], ['dn-count', 'Đếm ngày giữa hai mốc']]) +
      '<div id="dn-one">' + V.formWrap2('<div class="ptv-row">' + L.field('Chiều đổi', L.select('mode', '<option value="s2l">Dương lịch sang Âm lịch</option><option value="l2s">Âm lịch sang Dương lịch</option>')) + L.field('Ngày', '<input type="text" id="dd" inputmode="numeric" value="' + now.getDate() + '">') + L.field('Tháng', '<input type="text" id="mm" inputmode="numeric" value="' + (now.getMonth() + 1) + '">') + L.field('Năm', '<input type="text" id="yy" inputmode="numeric" value="' + now.getFullYear() + '">') + '</div><div class="ptv-row">' + L.field('Tháng nhuận (chỉ khi đổi Âm sang Dương)', L.select('leap', '<option value="">Tháng thường</option><option value="1">Tháng nhuận</option>')) + '</div>', 'Đổi ngày này') + '</div>' +
      '<div id="dn-month" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Tháng dương lịch muốn xem', L.select('m', V.monthOptions2()), 'ptv-field-name') + '</div>', 'Xem lịch âm tháng này') + '</div>' +
      '<div id="dn-count" hidden>' + V.formWrap2('<div class="ptv-row">' + L.field('Từ ngày (năm-tháng-ngày)', '<input type="text" id="d1" value="2027-01-01">') + L.field('Đến ngày (năm-tháng-ngày)', '<input type="text" id="d2" value="2027-02-16">') + '</div>', 'Đếm khoảng ngày') + '</div>';
    V.wireTabs(c, ['dn-one', 'dn-month', 'dn-count']);
    c.querySelector('#dn-one form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dn-one');
      var dd = parseInt(box.querySelector('#dd').value, 10), mm = parseInt(box.querySelector('#mm').value, 10), yy = parseInt(box.querySelector('#yy').value, 10), mode = box.querySelector('#mode').value;
      if (mode === 's2l') {
        var dt = new Date(yy, mm - 1, dd), info = D.dayInfo(dt);
        var hours = D.goodHours ? D.goodHours(info) : null;
        var html = '<h3>' + WD[dt.getDay()] + ', ngày ' + dd + '/' + mm + '/' + yy + ' dương lịch</h3>' +
          '<p>Đổi sang âm lịch là ngày <strong>' + D.fmtLunar(info) + '</strong> năm ' + L.yearInfo(info.lunar.y).text + ', ngày can chi <strong>' + info.day.text + '</strong>, trực ' + D.trucOf(info) + ', thuộc ngày ' + D.satOf(info) + '.</p>' +
          '<p>Tháng này theo âm lịch là tháng ' + info.lunar.m + ' năm ' + L.yearInfo(info.lunar.y).text + '. Các mốc được nhiều người tra nhất trong tháng âm là mùng 1 và ngày rằm (15 âm lịch), bạn xem ở tab lịch âm của tháng dương để thấy vị trí của chúng.</p>';
        L.resultBox(box, html);
      } else {
        var leap = box.querySelector('#leap').value === '1';
        var sdt = D.lunar2solar(dd, mm, yy, leap);
        if (!sdt) { L.resultBox(box, '<p class="ptv-bad">Không tìm thấy ngày dương lịch tương ứng, bạn kiểm tra lại ngày tháng âm lịch (năm ' + yy + ' có thể không có tháng nhuận này).</p>'); return; }
        var info2 = D.dayInfo(sdt);
        L.resultBox(box, '<h3>Ngày ' + dd + '/' + mm + '/' + yy + ' âm lịch' + (leap ? ' (tháng nhuận)' : '') + '</h3><p>Đổi sang dương lịch là <strong>' + WD[sdt.getDay()] + ', ngày ' + sdt.getDate() + '/' + (sdt.getMonth() + 1) + '/' + sdt.getFullYear() + '</strong>, ngày can chi <strong>' + info2.day.text + '</strong>, trực ' + D.trucOf(info2) + ', thuộc ngày ' + D.satOf(info2) + '.</p>');
      }
    });
    c.querySelector('#dn-month form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dn-month'), parts = box.querySelector('#m').value.split('-').map(Number);
      var days = D.monthDays(parts[0], parts[1]);
      var rows = days.map(function (i) {
        var mark = i.lunar.d === 1 ? ' <strong>(Mùng 1 âm lịch)</strong>' : i.lunar.d === 15 ? ' <strong>(Rằm)</strong>' : '';
        return '<tr><td>' + i.solar.d + '/' + i.solar.m + '</td><td>' + WD[new Date(i.solar.y, i.solar.m - 1, i.solar.d).getDay()] + '</td><td>' + i.lunar.d + '/' + i.lunar.m + (i.lunar.leap ? ' nhuận' : '') + '</td><td>' + i.day.text + '</td><td>' + mark + '</td></tr>';
      }).join('');
      L.resultBox(box, '<h3>Lịch âm tháng ' + parts[1] + '/' + parts[0] + '</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Ngày dương</th><th>Thứ</th><th>Ngày âm</th><th>Can chi ngày</th><th>Mốc</th></tr>' + rows + '</table></div><p class="ptv-note">Bảng do <a href="https://phongthuy.vietaa.com/">Phong Thủy VietAA</a> tính bằng cùng một bộ lịch dùng cho mọi công cụ xem ngày trên trang, múi giờ Việt Nam.</p>');
    });
    c.querySelector('#dn-count form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var box = c.querySelector('#dn-count');
      function parse(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
      var a = parse(box.querySelector('#d1').value), b = parse(box.querySelector('#d2').value);
      if (isNaN(a.getTime()) || isNaN(b.getTime())) { L.resultBox(box, '<p class="ptv-bad">Bạn nhập ngày theo dạng năm-tháng-ngày, ví dụ 2027-03-17.</p>'); return; }
      var diff = Math.round((b - a) / 86400000), ia = D.dayInfo(a), ib = D.dayInfo(b);
      L.resultBox(box, '<h3>Khoảng cách giữa hai mốc</h3><p>Từ <strong>' + a.getDate() + '/' + (a.getMonth() + 1) + '/' + a.getFullYear() + '</strong> (âm lịch ' + D.fmtLunar(ia) + ') đến <strong>' + b.getDate() + '/' + (b.getMonth() + 1) + '/' + b.getFullYear() + '</strong> (âm lịch ' + D.fmtLunar(ib) + ') là <strong>' + diff + ' ngày</strong>' + (diff >= 0 ? ', tính cả hai đầu là ' + (diff + 1) + ' ngày.' : '.') + '</p><p>Khoảng đếm này hay dùng để tính ngày cúng tuần, 49 ngày và 100 ngày cho người đã khuất, đếm ngược tới ngày cưới, ngày dự sinh theo tuần thai quy đổi, hoặc tính số ngày còn lại trước một hạn chót. Lưu ý lệ cúng tuần thường tính đủ ngày theo lịch âm, bạn đối chiếu thêm cột âm lịch của hai mốc ở trên.</p>');
    });
  }
  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'doi-ngay-am-lich': doiNgayV2 });
})();
