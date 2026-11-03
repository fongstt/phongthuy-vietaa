/* PhongThuy VietAA - cong cu dot 3: Menh Ly (v1.5) */
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  function queLookup(upper, lower) {
    var list = (window.PTV_DATA || {}).que64 || [];
    for (var i = 0; i < list.length; i++) if (list[i].upper === upper && list[i].lower === lower) return list[i];
    return null;
  }
  var TRI = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
  var QUE_TEXT = {
    'Thuần Càn': 'Quẻ của trời, chủ về khởi đầu mạnh mẽ, tự cường và lãnh đạo. Việc lớn nên làm lúc này, nhưng cần giữ sự khiêm tốn để bền lâu.', 'Thuần Khôn': 'Quẻ của đất, chủ về nhu thuận, tích lũy và hậu thuẫn. Nên đi bước chắc, dựa vào tập thể, tránh tranh phần hơn thua.', 'Thủy Lôi Truân': 'Khởi đầu gian nan như mầm cây đội đất. Việc mới bắt đầu sẽ vướng mắc, cần kiên trì và tìm người đỡ đầu.', 'Sơn Thủy Mông': 'Quẻ của sự chưa sáng tỏ. Nên học hỏi, hỏi người có kinh nghiệm trước khi quyết định việc quan trọng.', 'Thủy Thiên Nhu': 'Chờ đợi đúng lúc. Thời cơ chưa chín, nên chuẩn bị kỹ và giữ sức, đừng nóng vội hành động.', 'Thiên Thủy Tụng': 'Chủ về tranh chấp, kiện tụng và bất đồng ý kiến. Nên nhường nhịn, giải quyết bằng lời lẽ để tránh hao tổn.', 'Địa Thủy Sư': 'Quẻ của việc dùng người và kỷ luật. Cần tổ chức chặt chẽ, chọn người đáng tin thì việc lớn mới thành.', 'Thủy Địa Tỷ': 'Chủ về gắn kết, hợp tác và được người giúp. Hợp cho việc kết giao, lập nhóm, ký kết đồng hành.', 'Phong Thiên Tiểu Súc': 'Tích lũy nhỏ, mây dày chưa mưa. Tài và việc đang gom lại, chưa phải lúc bung ra, hãy kiên nhẫn thêm.', 'Thiên Trạch Lý': 'Chủ về lễ nghi và chừng mực. Làm việc gì cũng nên đúng quy tắc, giữ uy tín thì đường dài êm đẹp.', 'Địa Thiên Thái': 'Quẻ thái bình hanh thông, trời đất giao hòa. Đây là quẻ rất tốt, việc cầu đa phần thuận lợi.', 'Thiên Địa Bĩ': 'Bế tắc, trên dưới không thông. Nên thu mình chờ thời, tránh đầu tư lớn và các quyết định mạo hiểm.', 'Thiên Hỏa Đồng Nhân': 'Đồng lòng với người khác thì việc thành. Hợp tác minh bạch, chia sẻ lợi ích là chìa khóa lúc này.', 'Hỏa Thiên Đại Hữu': 'Sở hữu lớn, tài lộc và danh tiếng đang ở độ sáng. Nhưng càng có càng cần chia sẻ để giữ phúc.', 'Địa Sơn Khiêm': 'Khiêm tốn thì được người quý, việc đi chậm mà chắc. Đây là quẻ tốt cho người biết nhún nhường.', 'Lôi Địa Dự': 'Vui vẻ, thuận lợi và có động lực. Hợp cho khởi sự việc mới, nhưng đừng vì vui mà quên chuẩn bị.', 'Trạch Lôi Tùy': 'Thuận theo thời thế, tùy cơ ứng biến thì cát. Đừng cố chấp giữ cách cũ khi hoàn cảnh đã đổi.', 'Sơn Phong Cổ': 'Có việc hư cũ cần sửa sang, dọn dẹp. Nên nhìn lại gốc rễ vấn đề và xử lý dứt điểm.', 'Địa Trạch Lâm': 'Thế đang lên, người trên đỡ người dưới. Nên tranh thủ mở rộng, nhưng giữ chừng mực kẻo quá đà.', 'Phong Địa Quan': 'Chủ về quan sát và làm gương. Khoan hành động, hãy nhìn kỹ toàn cảnh và học từ người đi trước.', 'Hỏa Lôi Phệ Hạp': 'Có trở ngại cần xử lý dứt khoát, như nhai vỡ vật cứng. Việc liên quan pháp lý, kỷ luật nên làm rõ ràng.', 'Sơn Hỏa Bí': 'Chủ về hình thức và trang trí. Việc nhỏ, việc bề mặt thì tốt, việc cốt lõi đừng chỉ lo vẻ ngoài.', 'Sơn Địa Bác': 'Đang mòn dần, thế yếu. Nên dừng việc lớn, giữ gìn phần gốc, chờ chu kỳ phục hồi.', 'Địa Lôi Phục': 'Quay trở lại, khí dương bắt đầu sinh. Sau giai đoạn khó, cơ hội đang nhen nhóm quay về.', 'Thiên Lôi Vô Vọng': 'Thuận theo tự nhiên, đừng cưỡng cầu. Việc làm chân thành, không mưu mẹo thì tránh được họa bất ngờ.', 'Sơn Thiên Đại Súc': 'Tích lũy lớn về tri thức và tài sản. Thời gian này hợp học tập, rèn luyện và gom vốn cho việc lớn sau.', 'Sơn Lôi Di': 'Chủ về nuôi dưỡng, ăn uống và lời nói. Chăm sóc sức khỏe, giữ miệng giữ lời thì phúc đến.', 'Trạch Phong Đại Quá': 'Gánh nặng quá sức, dầm nhà cong. Nên giảm tải, đừng ôm thêm việc vượt khả năng lúc này.', 'Thuần Khảm': 'Nước chồng nước, hiểm trở liên tiếp. Cần bình tĩnh, giữ chữ tín và đi từng bước chắc qua giai đoạn khó.', 'Thuần Ly': 'Lửa sáng, chủ về văn minh, danh tiếng và sự rõ ràng. Hợp cho học hành, thi cử, truyền thông.', 'Trạch Sơn Hàm': 'Cảm ứng, rung động, chủ về tình cảm và sự thu hút lẫn nhau. Tình duyên và giao tế đang có tín hiệu tốt.', 'Lôi Phong Hằng': 'Bền lâu, ổn định. Việc đang làm nên duy trì đều đặn, tránh thay đổi liên tục làm mất nhịp.', 'Thiên Sơn Độn': 'Rút lui đúng lúc là khôn ngoan. Nên tránh va chạm và thị phi, giữ mình chờ thời thế đổi.', 'Lôi Thiên Đại Tráng': 'Thế đang mạnh, khí đang thịnh. Có thể tiến lên nhưng tránh dùng sức quá đà mà gây đổ vỡ.', 'Hỏa Địa Tấn': 'Tiến lên như mặt trời mọc, được cấp trên chú ý. Hợp cho thăng tiến, thi cử và mở rộng.', 'Địa Hỏa Minh Di': 'Ánh sáng bị che, tài năng chưa được nhìn nhận. Nên ẩn mình, giữ thực lực, đợi người biết nhìn.', 'Phong Hỏa Gia Nhân': 'Chủ về gia đình và nội bộ. Việc nhà, việc tổ chức bên trong êm đẹp thì việc ngoài mới thuận.', 'Hỏa Trạch Khuê': 'Khác biệt và xa cách trong quan hệ. Cần dung hòa cái khác nhau, việc nhỏ có thể thành nếu bỏ qua tiểu tiết.', 'Thủy Sơn Kiển': 'Trở ngại trước mặt, đi khó. Nên dừng lại xem xét đường khác thay vì cố vượt qua.', 'Lôi Thủy Giải': 'Giải tỏa, tháo gỡ được nút thắt. Việc đang bế tắc sắp có lối ra, nên chủ động dàn xếp.', 'Sơn Trạch Tổn': 'Giảm bớt để được lợi lâu dài. Hy sinh cái nhỏ, bỏ bớt tham cầu thì kết cục lại tốt.', 'Phong Lôi Ích': 'Tăng thêm lợi ích, được hỗ trợ và có cơ hội phát triển. Nên tranh thủ giúp người, phúc sẽ quay lại.', 'Trạch Thiên Quải': 'Quyết đoán loại bỏ cái xấu. Việc cần dứt khoát thì nên làm rõ ràng, công khai, tránh mưu ngầm.', 'Thiên Phong Cấu': 'Gặp gỡ bất ngờ, duyên và cơ hội đến đột ngột. Nhưng cần tỉnh táo vì cái mới chưa rõ tốt xấu.', 'Trạch Địa Tụy': 'Tụ họp, đông vui và quy tụ được người. Hợp cho sự kiện, hội nhóm, việc cần sức đông người.', 'Địa Phong Thăng': 'Thăng tiến từ từ như cây mọc khỏi đất. Đi từng bước chính quy thì lên bền, đừng đốt cháy giai đoạn.', 'Trạch Thủy Khốn': 'Khốn khó, bị vây hãm về tiền bạc hoặc tinh thần. Giữ lời ít, hành động thật, chờ qua giai đoạn này.', 'Thủy Phong Tỉnh': 'Giếng nước nuôi người, chủ về nguồn lực bền và phúc chia sẻ. Việc làm vì cộng đồng được hậu thuẫn.', 'Trạch Hỏa Cách': 'Thay đổi, cải cách. Cái cũ đã hết thời, mạnh dạn đổi mới đúng thời điểm thì tốt.', 'Hỏa Phong Đỉnh': 'Cái đỉnh nấu thức ăn nuôi người tài. Chủ về gây dựng sự nghiệp và được trọng dụng.', 'Thuần Chấn': 'Sấm động, chấn động bất ngờ nhưng qua đó mà tỉnh táo hơn. Việc có biến động, giữ bình tĩnh là thắng.', 'Thuần Cấn': 'Núi dừng, biết dừng đúng lúc. Nên tĩnh lại, việc nào cần ngưng thì ngưng, tránh đi quá giới hạn.', 'Phong Sơn Tiệm': 'Tiến dần từng bước như cây trên núi. Việc hôn nhân, sự nghiệp đi chậm mà chắc sẽ bền.', 'Lôi Trạch Quy Muội': 'Việc tình cảm hoặc hợp tác chưa đúng vị thế, dễ vội vàng. Nên rõ ràng danh phận trước khi tiến xa.', 'Lôi Hỏa Phong': 'Phong phú, thịnh vượng như mùa màng tốt. Đang ở giai đoạn đẹp, nhưng thịnh rồi sẽ suy, nên tích lũy phòng xa.', 'Hỏa Sơn Lữ': 'Lữ khách trên đường, chủ về xa nhà, dịch chuyển và việc tạm thời. Nên nhẹ nhàng, đừng đầu tư cố định lớn.', 'Thuần Tốn': 'Gió thổi lan, chủ về mềm mỏng, lan tỏa và thuận theo. Dùng sự khéo léo thay cho cứng rắn sẽ thành việc.', 'Thuần Đoài': 'Đầm vui, chủ về giao tiếp, đàm phán và niềm vui. Lời nói ngọt ngào mở được nhiều cửa lúc này.', 'Phong Thủy Hoán': 'Tan rã rồi tụ lại, gió thổi trên nước. Nên phá bỏ sự trì trệ, đoàn kết lại nội bộ.', 'Thủy Trạch Tiết': 'Tiết chế, chừng mực trong chi tiêu và lời nói. Có khuôn khổ rõ ràng thì mọi việc ổn định.', 'Phong Trạch Trung Phu': 'Thành tín tự bên trong. Giữ chữ tín và sự chân thành thì cảm hóa được cả người khó tính.', 'Lôi Sơn Tiểu Quá': 'Vượt mức một chút, hợp việc nhỏ, không hợp việc lớn. Nên khiêm tốn, làm việc vừa sức.', 'Thủy Hỏa Ký Tế': 'Việc đã thành, nước lửa cân bằng. Nhưng thành rồi dễ sinh chủ quan, cần giữ gìn như lúc ban đầu.', 'Hỏa Thủy Vị Tế': 'Việc chưa thành, còn dở dang ở chặng cuối. Đừng bỏ cuộc, cẩn thận bước cuối cùng là tới đích.'
  };
  function queHTML(q, extra) {
    return '<h3>Quẻ ' + esc(q.name) + ' <span class="' + (q.rating === 'Cát' ? 'ptv-good' : q.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad') + '">(' + q.rating + ')</span></h3><p>Quẻ thượng ' + q.upper + ', quẻ hạ ' + q.lower + '. ' + (QUE_TEXT[q.name] || '') + '</p>' + (extra || '');
  }
  function dongXu(container) {
    var tosses = [];
    container.innerHTML = '<div class="ptv-form"><p style="margin-top:0">Thành tâm nghĩ về điều bạn muốn hỏi, rồi bấm gieo xu 6 lần để lập đủ 6 hào, từ hào 1 ở dưới lên hào 6 ở trên, giống cách gieo quẻ Kinh Dịch truyền thống.</p><div class="ptv-kieu-verse" id="ptv-coins"><p>🪙 🪙 🪙</p></div><div id="ptv-lines" style="text-align:center;font-size:19px;line-height:1.5;margin:10px 0"></div><button type="button" class="ptv-btn" id="ptv-toss">Gieo lần 1</button></div><div class="ptv-out"></div>';
    var btn = container.querySelector('#ptv-toss');
    btn.addEventListener('click', function () {
      var coins = [0, 0, 0].map(function () { return Math.random() < 0.5 ? 2 : 3; });
      var sum = coins[0] + coins[1] + coins[2];
      tosses.push(sum);
      container.querySelector('#ptv-coins').innerHTML = '<p>' + coins.map(function (c) { return c === 3 ? '🟡 Ngửa' : '⚪ Sấp'; }).join(' · ') + ' = ' + sum + '</p>';
      var lines = tosses.map(function (s, i) {
        var yang = (s === 7 || s === 9);
        return '<div>Hào ' + (i + 1) + ': ' + (yang ? '▅▅▅▅▅' : '▅▅ ▅▅') + (s === 6 ? ' (lão âm, hào biến)' : s === 9 ? ' (lão dương, hào biến)' : '') + '</div>';
      }).reverse().join('');
      container.querySelector('#ptv-lines').innerHTML = lines;
      if (tosses.length < 6) { btn.textContent = 'Gieo lần ' + (tosses.length + 1); return; }
      btn.style.display = 'none';
      var lower = triOf(tosses.slice(0, 3)), upper = triOf(tosses.slice(3, 6));
      var q = queLookup(upper, lower);
      var bien = tosses.map(function (s, i) { return (s === 6 || s === 9) ? i + 1 : null; }).filter(Boolean);
      var html = queHTML(q, bien.length ? '<p><strong>Hào biến:</strong> hào ' + bien.join(', ') + '. Có hào biến nghĩa là tình hình còn đang chuyển động, bạn nên đọc quẻ này như xu hướng chính và chờ thêm diễn biến ở các hào biến.</p>' : '<p>Quẻ không có hào biến, tình hình tương đối ổn định theo đúng ý nghĩa của quẻ.</p>');
      html += '<button type="button" class="ptv-btn" onclick="location.reload()">Gieo quẻ mới</button>';
      L.resultBox(container, html);
    });
    function triOf(t) {
      var bits = t.map(function (s) { return (s === 7 || s === 9) ? 1 : 0; });
      var key = bits.join('');
      var MAP = { '111': 'Càn', '110': 'Đoài', '101': 'Ly', '100': 'Chấn', '011': 'Tốn', '010': 'Khảm', '001': 'Cấn', '000': 'Khôn' };
      return MAP[key];
    }
  }
  function xiNgau(container) {
    container.innerHTML = '<div class="ptv-form"><p style="margin-top:0">Nghĩ về điều muốn hỏi rồi bấm gieo xí ngầu. Máy gieo 3 lượt, mỗi lượt 2 viên: lượt đầu lấy quẻ hạ, lượt hai lấy quẻ thượng, lượt ba lấy hào động.</p><div class="ptv-kieu-verse" id="ptv-dice"><p>🎲 🎲</p></div><button type="button" class="ptv-btn" id="ptv-roll">Gieo xí ngầu</button></div><div class="ptv-out"></div>';
    container.querySelector('#ptv-roll').addEventListener('click', function () {
      function roll2() { return [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]; }
      var r1 = roll2(), r2 = roll2(), r3 = roll2();
      container.querySelector('#ptv-dice').innerHTML = '<p>🎲 Lượt 1: ' + r1.join(' + ') + ' · Lượt 2: ' + r2.join(' + ') + ' · Lượt 3: ' + r3.join(' + ') + '</p>';
      var lower = TRI[(r1[0] + r1[1]) % 8], upper = TRI[(r2[0] + r2[1]) % 8];
      var hao = ((r3[0] + r3[1] - 1) % 6) + 1;
      var q = queLookup(upper, lower);
      L.resultBox(container, queHTML(q, '<p><strong>Hào động:</strong> hào ' + hao + '. Hào động là điểm đáng chú ý nhất của quẻ, cho thấy khía cạnh đang chuyển biến mạnh nhất trong việc bạn hỏi.</p>'));
    });
  }
  function lucThapTu(container) {
    var opts = TRI.map(function (t) { return '<option>' + t + '</option>'; }).join('');
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Quẻ thượng', L.select('up', opts)) + L.field('Quẻ hạ', L.select('lo', opts)) + '</div>', 'Tra quẻ');
    container.querySelector('#up') && (container.querySelector('#up').selectedIndex = 0);
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var q = queLookup(container.querySelector('#up').value, container.querySelector('#lo').value);
      if (q) L.resultBox(container, queHTML(q, '<p class="ptv-note">64 quẻ Kinh Dịch được tạo từ 8 quẻ đơn ghép đôi. Bạn có thể tra nhanh quẻ khác bằng cách đổi quẻ thượng và quẻ hạ ở form phía trên.</p>'));
    });
  }
  var CUNG_EL = { 'Khảm': 'Thủy', 'Ly': 'Hỏa', 'Chấn': 'Mộc', 'Tốn': 'Mộc', 'Càn': 'Kim', 'Đoài': 'Kim', 'Cấn': 'Thổ', 'Khôn': 'Thổ' };
  function queMenh(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh', L.select('y', L.yearOptions(1940, 2015, 1990))) + L.field('Giới tính', L.genderSelect('g')) + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), g = container.querySelector('#g').value;
      var yi = L.yearInfo(y), cp = L.cungPhi(y, g);
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong> (' + yi.text + ')</span><span>Mệnh nạp âm: <strong>' + esc(yi.napAm) + '</strong></span></div>' +
        '<h3>Quẻ mệnh của bạn: quẻ ' + cp.cung + '</h3><p>Quẻ mệnh (cung phi) của người sinh năm ' + y + ', ' + g.toLowerCase() + ' là <strong>' + cp.cung + '</strong>, thuộc hành ' + CUNG_EL[cp.cung] + ', nhóm <strong>' + cp.group + '</strong>, ở phương ' + L.CUNG_DIR[cp.cung] + '.</p>' +
        '<p>' + (cp.group === 'Đông tứ mệnh' ? 'Người Đông tứ mệnh hợp các hướng Bắc, Đông, Đông Nam và Nam.' : 'Người Tây tứ mệnh hợp các hướng Tây, Tây Bắc, Tây Nam và Đông Bắc.') + ' Quẻ mệnh là nền tảng để xem hướng nhà, hướng bàn thờ, giường ngủ và cung phi vợ chồng, bạn có thể tra tiếp ở các công cụ trong nhóm Trạch Mệnh.</p>' + L.dirTable(cp.cung);
      L.resultBox(container, html);
    });
  }
  function nienMenh(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Năm sinh', L.select('y', L.yearOptions(1930, 2025, 1990)), 'ptv-field-name') + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var y = parseInt(container.querySelector('#y').value, 10), yi = L.yearInfo(y);
      var same = [];
      for (var cy = y - 60; cy <= y + 60; cy += 60) if (cy !== y && cy >= 1924 && cy <= 2043) same.push(cy);
      var html = '<div class="ptv-facts"><span>Năm sinh: <strong>' + y + '</strong></span><span>Tuổi: <strong>' + yi.text + '</strong></span><span>Niên mệnh: <strong>' + esc(yi.napAm) + '</strong> ' + L.badge(yi.el) + '</span></div>' +
        '<p>Người sinh năm ' + y + ' thuộc tuổi ' + yi.text + ', có niên mệnh (mệnh nạp âm) là <strong>' + esc(yi.napAm) + '</strong>, thuộc hành ' + yi.el + '. Thiên can ' + yi.can + ' thuộc hành ' + yi.canEl + '. Năm cùng niên mệnh gần nhất: ' + same.join(', ') + ' (chu kỳ 60 năm của lục thập hoa giáp).</p>' +
        '<p>Niên mệnh được dùng trong hầu hết các tra cứu phong thủy theo tuổi trên trang này: chọn nghề, chọn màu, xem tuổi vợ chồng, sinh con và xông đất.</p>';
      L.resultBox(container, html);
    });
  }
  window.PTVToolsW3a = { 'gieo-que-dong-xu': dongXu, 'gieo-que-xi-ngau': xiNgau, 'luc-thap-tu-quai': lucThapTu, 'tim-que-menh': queMenh, 'tim-nien-menh': nienMenh, '_queLookup': queLookup, '_QUE_TEXT': QUE_TEXT };
})();
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  function dateFields(prefix) {
    return '<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="' + prefix + 'd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="' + prefix + 'm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="' + prefix + 'y" inputmode="numeric" value="1995">') + '</div>';
  }
  function readDate(c, prefix) { return { d: parseInt(c.querySelector('#' + prefix + 'd').value, 10), m: parseInt(c.querySelector('#' + prefix + 'm').value, 10), y: parseInt(c.querySelector('#' + prefix + 'y').value, 10) }; }
  function reduceNum(n) { while (n > 9 && n !== 11 && n !== 22) { n = String(n).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0); } return n; }
  function lifePath(dt) { return reduceNum(String(dt.d).split('').concat(String(dt.m).split(''), String(dt.y).split('')).reduce(function (a, c) { return a + parseInt(c, 10); }, 0)); }
  function stripVN(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
  var LETTER_NUM = {}; 'abcdefghi'.split('').forEach(function (ch, i) { LETTER_NUM[ch] = i + 1; });
  'jklmnopqr'.split('').forEach(function (ch, i) { LETTER_NUM[ch] = i + 1; });
  'stuvwxyz'.split('').forEach(function (ch, i) { LETTER_NUM[ch] = i + 1; });
  function nameNums(name) {
    var clean = stripVN(name).replace(/[^a-z ]/g, '');
    var vowels = 'aeiou', soul = 0, expr = 0, cons = 0;
    clean.replace(/ /g, '').split('').forEach(function (ch) { var n = LETTER_NUM[ch] || 0; expr += n; if (vowels.indexOf(ch) >= 0) soul += n; else cons += n; });
    return { soul: reduceNum(soul), expr: reduceNum(expr), pers: reduceNum(cons) };
  }
  function thanSo(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Họ tên đầy đủ', '<input type="text" id="nm" value="">', 'ptv-field-name') + '</div>' + dateFields('b'), 'Xem thần số học');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), data = (window.PTV_TOOLS_DATA || {}).thanSoHoc || { numbers: {} };
      var lp = lifePath(dt), nn = nameNums(container.querySelector('#nm').value || '');
      function numBlock(title, n) {
        var e = data.numbers[String(n)] || {};
        return '<div class="ptv-block"><div class="ptv-block-head"><span>' + title + '</span><span class="ptv-block-score">Số ' + n + '</span></div>' + (e.name ? '<p><strong>' + esc(e.name) + '</strong>. ' + esc(e.traits) + '</p><p><em>Sự nghiệp:</em> ' + esc(e.career) + ' <em>Tình duyên:</em> ' + esc(e.love) + '</p>' : '<p>Chưa có dữ liệu cho số này.</p>') + '</div>';
      }
      var html = '<h3>Kết quả thần số học</h3>' + numBlock('Số chủ đạo (đường đời)', lp) + numBlock('Số linh hồn (từ nguyên âm trong tên)', nn.soul) + numBlock('Số biểu đạt (từ toàn bộ tên)', nn.expr) + numBlock('Số nhân cách (từ phụ âm trong tên)', nn.pers) +
        '<p class="ptv-note">' + esc(data.lifePathNote || '') + ' Số chủ đạo tính từ tổng các chữ số ngày tháng năm sinh, rút gọn giữ số 11 và 22. Các số tên tính theo bảng chữ cái Pythagoras từ tên không dấu.</p>';
      L.resultBox(container, html);
    });
  }
  function boiNgaySinh(container) {
    container.innerHTML = formWrap(dateFields('b'), 'Xem bói ngày sinh');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), data = (window.PTV_TOOLS_DATA || {}).thanSoHoc || { numbers: {} };
      var lp = lifePath(dt), dayN = reduceNum(dt.d);
      var info = D.dayInfo(new Date(dt.y, dt.m - 1, dt.d)), yi = L.yearInfo(info.lunar.y);
      var e1 = data.numbers[String(lp)] || {}, e2 = data.numbers[String(dayN)] || {};
      var wd = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][new Date(dt.y, dt.m - 1, dt.d).getDay()];
      var html = '<div class="ptv-facts"><span>Sinh: <strong>' + dt.d + '/' + dt.m + '/' + dt.y + '</strong> (' + wd + ')</span><span>Âm lịch: <strong>' + D.fmtLunar(info) + '</strong></span><span>Ngày can chi: <strong>' + info.day.text + '</strong></span><span>Tuổi: <strong>' + yi.text + '</strong>, mệnh ' + esc(yi.napAm) + '</span></div>' +
        '<h3>Tính cách theo ngày sinh</h3><p><strong>Số chủ đạo ' + lp + (e1.name ? ' (' + esc(e1.name.replace(/^Số \d+, /, '')) + ')' : '') + ':</strong> ' + esc(e1.traits || '') + '</p>' +
        '<p><strong>Số ngày sinh ' + dayN + ':</strong> ' + esc(e2.traits || '') + '</p>' +
        '<p>Người sinh ngày can chi ' + info.day.text + ' mang hành ngày ' + info.day.canEl + ' (thiên can) và ' + info.day.chiEl + ' (địa chi). Kết hợp với mệnh ' + esc(yi.napAm) + ', đây là bức tranh tham khảo về tính cách và vận mệnh theo ngày sinh kết hợp thần số học và can chi.</p>';
      L.resultBox(container, html);
    });
  }
  function hocVan(container) {
    container.innerHTML = formWrap(dateFields('b'), 'Xem đường học vấn');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), data = (window.PTV_TOOLS_DATA || {}).hocVan || { byCan: {}, byMenh: {} };
      var info = D.dayInfo(new Date(dt.y, dt.m - 1, dt.d)), yi = L.yearInfo(info.lunar.y);
      var html = '<div class="ptv-facts"><span>Ngày sinh: <strong>' + dt.d + '/' + dt.m + '/' + dt.y + '</strong></span><span>Ngày can chi: <strong>' + info.day.text + '</strong></span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong></span></div>' +
        '<h3>Đường học vấn theo can ngày ' + info.day.can + '</h3><p>' + esc(data.byCan[info.day.can] || '') + '</p>' +
        '<h3>Đường học vấn theo mệnh ' + yi.el + '</h3><p>' + esc(data.byMenh[yi.el] || '') + '</p>' +
        '<p class="ptv-note">Luận giải mang tính tham khảo. Học vấn thành hay bại chủ yếu do nỗ lực và phương pháp học của mỗi người.</p>';
      L.resultBox(container, html);
    });
  }
  function tuTru(container) {
    container.innerHTML = formWrap(dateFields('b') + '<div class="ptv-row">' + L.field('Giờ sinh', L.select('h', E.CHI.map(function (c) { return '<option value="' + c + '">' + c + ' (' + E.HOUR_LABEL[c] + ')</option>'; }).join(''))) + L.field('Giới tính', L.genderSelect('g')) + '</div>', 'Lập lá số tứ trụ');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), hourChi = container.querySelector('#h').value;
      var yP = E.yearPillar(dt.d, dt.m, dt.y), mP = E.monthPillar(dt.d, dt.m, E.CAN.indexOf(yP.pillar.can)), dP = E.dayPillar(dt.d, dt.m, dt.y), hP = E.hourPillar(hourChi, E.CAN.indexOf(dP.can));
      var counts = E.countElements([hP, dP, mP, yP.pillar]);
      function cell(p, label) { var na = E.napAmOf(p); return '<td><strong>' + label + '</strong><br>' + p.text + '<br><span class="ptv-note">' + na.name + '</span></td>'; }
      var total = Object.keys(counts).reduce(function (a, k) { return a + counts[k]; }, 0);
      var maxEl = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      var minEl = Object.keys(counts).sort(function (a, b) { return counts[a] - counts[b]; })[0];
      var dayEl = dP.canEl;
      var strength = counts[dayEl] + counts[Object.keys(L.GENERATES).find(function (k) { return L.GENERATES[k] === dayEl; })];
      var bars = Object.keys(counts).map(function (e) { return '<div class="ptv-bar-row"><span class="ptv-bar-label">' + e + '</span><span class="ptv-bar-track"><span class="ptv-bar-fill" style="width:' + (total ? counts[e] / total * 100 : 0) + '%;background:' + ({ 'Kim': '#8a6d1c', 'Mộc': '#2e7d32', 'Thủy': '#1565c0', 'Hỏa': '#c62828', 'Thổ': '#8d5a2b' }[e]) + '"></span></span><span class="ptv-bar-num">' + counts[e] + '</span></div>'; }).join('');
      var html = '<h3>Lá số tứ trụ</h3><div class="ptv-table-wrap"><table class="ptv-table"><tr>' + cell(yP.pillar, 'Trụ năm') + cell(mP, 'Trụ tháng') + cell(dP, 'Trụ ngày') + cell(hP, 'Trụ giờ') + '</tr></table></div>' +
        '<p>Nhật chủ (bản mệnh ngày sinh) là <strong>' + dP.can + '</strong> thuộc hành ' + L.badge(dayEl) + '. Mệnh năm: <strong>' + esc(E.napAmOf(yP.pillar).name) + '</strong>.</p>' +
        '<h3>Cân bằng ngũ hành trong tứ trụ</h3>' + bars +
        '<p>Hành mạnh nhất là <strong>' + maxEl + '</strong>, hành yếu hoặc thiếu là <strong>' + minEl + '</strong>. Nhật chủ được ' + strength + ' điểm tựa từ hành bản mệnh và hành sinh cho mình trong tổng ' + total + ' điểm ngũ hành, ' + (strength >= total / 2 ? 'thuộc nhóm nhật chủ vượng, nên tiết chế bằng hành khắc và hành được sinh.' : 'thuộc nhóm nhật chủ nhược hoặc trung hòa, nên bổ trợ bằng hành sinh cho nhật chủ và hành bản mệnh.') + '</p>' +
        '<p><strong>Gợi ý bổ trợ:</strong> ưu tiên màu sắc, nghề nghiệp và môi trường thuộc hành <strong>' + (strength >= total / 2 ? L.GENERATES[dayEl] + ' và ' + L.CONTROLS[dayEl] : minEl + ' và ' + dayEl) + '</strong>. Đây là luận giải cơ bản từ tứ trụ, lá số chuyên sâu cần xét thêm đại vận và lưu niên.</p>';
      L.resultBox(container, html);
    });
  }
  var MENH_CUNG_TEXT = { 'Tý': 'Mệnh tại Tý, cung của sự khởi đầu và trí tuệ. Người có mệnh cung này thường thông minh, linh hoạt, giỏi tích lũy nhưng đôi lúc lo xa.', 'Sửu': 'Mệnh tại Sửu, chủ về cần cù và bền bỉ. Đường đời đi chậm mà chắc, hậu vận thường khá hơn tiền vận.', 'Dần': 'Mệnh tại Dần, khí thế mạnh, dám nghĩ dám làm. Sự nghiệp có nhiều bước ngoặt lớn, cần tiết chế sự nóng nảy.', 'Mão': 'Mệnh tại Mão, tính tình mềm mỏng, trọng tình cảm và thẩm mỹ. Hợp các việc cần sự khéo léo và giao tiếp.', 'Thìn': 'Mệnh tại Thìn, ôm chí lớn, có duyên với quyền lực và việc lớn. Cần tránh tự tin quá mức khi thời cơ chưa tới.', 'Tỵ': 'Mệnh tại Tỵ, sâu sắc và kín đáo, trực giác mạnh. Hợp việc nghiên cứu, phân tích và các nghề cần sự tinh tế.', 'Ngọ': 'Mệnh tại Ngọ, nhiệt huyết, thích tự do và được chú ý. Sự nghiệp thăng trầm theo cảm hứng, cần người đồng hành giữ nhịp.', 'Mùi': 'Mệnh tại Mùi, hiền lành, giàu lòng trắc ẩn, có duyên nghệ thuật. Đời sống tình cảm phong phú, cần quyết đoán hơn trong việc lớn.', 'Thân': 'Mệnh tại Thân, nhanh trí, giỏi ứng biến và giao thiệp rộng. Hợp kinh doanh và các việc cần xoay xở linh hoạt.', 'Dậu': 'Mệnh tại Dậu, cầu toàn, sắc sảo và có óc tổ chức. Chú ý tránh khắt khe với người thân vì những tiểu tiết.', 'Tuất': 'Mệnh tại Tuất, trung thành, trọng nghĩa và có trách nhiệm. Được người tin cậy giao việc lớn, hậu vận an ổn.', 'Hợi': 'Mệnh tại Hợi, phúc hậu, dễ được quý nhân giúp. Tiền vận vất vả hơn hậu vận, càng về sau càng an nhàn.' };
  var CUNG12 = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
  var CUC = { 'Thủy': 'Thủy Nhị Cục', 'Mộc': 'Mộc Tam Cục', 'Kim': 'Kim Tứ Cục', 'Thổ': 'Thổ Ngũ Cục', 'Hỏa': 'Hỏa Lục Cục' };
  function laSoTuVi(container) {
    container.innerHTML = formWrap(dateFields('b') + '<div class="ptv-row">' + L.field('Giờ sinh', L.select('h', E.CHI.map(function (c, i) { return '<option value="' + i + '">' + c + ' (' + E.HOUR_LABEL[c] + ')</option>'; }).join(''))) + L.field('Giới tính', L.genderSelect('g')) + '</div>', 'Lập lá số tử vi');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), hourIdx = parseInt(container.querySelector('#h').value, 10), g = container.querySelector('#g').value;
      var lu = E.convertSolar2Lunar(dt.d, dt.m, dt.y, 7);
      var yi = L.yearInfo(lu.year);
      var start = 2;
      var menhIdx = ((start + (lu.month - 1) - hourIdx) % 12 + 12) % 12;
      var thanIdx = ((start + (lu.month - 1) + hourIdx) % 12 + 12) % 12;
      var rows = CUNG12.map(function (name, i) {
        var idx = ((menhIdx - i) % 12 + 12) % 12;
        return '<tr><td><strong>' + name + '</strong>' + (idx === thanIdx ? ' (kiêm Cung Thân)' : '') + '</td><td>' + E.CHI[idx] + '</td></tr>';
      }).join('');
      var duongCan = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].indexOf(yi.can) >= 0;
      var amDuong = (duongCan ? 'Dương' : 'Âm') + ' ' + (g === 'Nam' ? 'Nam' : 'Nữ');
      var html = '<div class="ptv-facts"><span>Sinh: <strong>' + dt.d + '/' + dt.m + '/' + dt.y + '</strong>, âm lịch <strong>' + lu.day + '/' + lu.month + '/' + lu.year + '</strong></span><span>Tuổi: <strong>' + yi.text + '</strong></span><span>Mệnh: <strong>' + esc(yi.napAm) + '</strong></span><span><strong>' + CUC[yi.el] + '</strong></span><span>' + amDuong + '</span></div>' +
        '<h3>Cung Mệnh tại ' + E.CHI[menhIdx] + ', Cung Thân tại ' + E.CHI[thanIdx] + '</h3><p>' + MENH_CUNG_TEXT[E.CHI[menhIdx]] + '</p>' +
        '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Cung</th><th>An tại địa chi</th></tr>' + rows + '</table></div>' +
        '<p class="ptv-note">Đây là lá số cơ bản gồm cung Mệnh, cung Thân, 12 cung chức năng và cục theo mệnh nạp âm, trình bày minh bạch theo cách an cung truyền thống. Lá số tử vi đầy đủ còn cần an 14 chính tinh và các phụ tinh theo ngày sinh và cục, vốn cần luận giải chuyên sâu hơn.</p>';
      L.resultBox(container, html);
    });
  }
  function zodiacHTML(z) {
    return '<h3>' + esc(z.sign) + ' (' + esc(z.dates) + ') · Hành ' + esc(z.element) + '</h3><p>' + esc(z.traits) + '</p><p><strong>Sự nghiệp:</strong> ' + esc(z.career) + '</p><p><strong>Tình duyên:</strong> ' + esc(z.love) + '</p><p><strong>May mắn:</strong> ' + esc(z.lucky) + '</p>';
  }
  function signOf(d, m) {
    var bounds = [[3, 21, 4, 19, 0], [4, 20, 5, 20, 1], [5, 21, 6, 21, 2], [6, 22, 7, 22, 3], [7, 23, 8, 22, 4], [8, 23, 9, 22, 5], [9, 23, 10, 23, 6], [10, 24, 11, 22, 7], [11, 23, 12, 21, 8], [12, 22, 1, 19, 9], [1, 20, 2, 18, 10], [2, 19, 3, 20, 11]];
    for (var i = 0; i < bounds.length; i++) { var b = bounds[i]; if ((m === b[0] && d >= b[1]) || (m === b[2] && d <= b[3])) return i; }
    return 9;
  }
  function cungHoangDao(container) {
    container.innerHTML = formWrap(dateFields('b'), 'Xem cung hoàng đạo');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), zlist = (window.PTV_TOOLS_DATA || {}).zodiac || [];
      var z = zlist[signOf(dt.d, dt.m)];
      if (z) L.resultBox(container, zodiacHTML(z));
    });
  }
  function tuViTayPhuong(container) {
    container.innerHTML = formWrap(dateFields('b'), 'Xem tử vi');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var dt = readDate(container, 'b'), zlist = (window.PTV_TOOLS_DATA || {}).zodiac || [];
      var z = zlist[signOf(dt.d, dt.m)];
      if (!z) return;
      var now = new Date(), seed = L.hashStr(z.sign + now.getFullYear());
      var overviews = ['Năm nay là năm để ' + z.sign + ' bứt phá trong công việc, quý nhân xuất hiện vào giữa năm.', 'Năm nay ' + z.sign + ' nên chú trọng tích lũy và sức khỏe, cơ hội lớn đến vào cuối năm.', 'Năm nay chuyện tình cảm và quan hệ của ' + z.sign + ' có nhiều chuyển biến tích cực, tài lộc ổn định.', 'Năm nay ' + z.sign + ' hợp học thêm kỹ năng mới và mở rộng quan hệ, tránh đầu tư mạo hiểm.'];
      L.resultBox(container, zodiacHTML(z) + '<h3>Tử vi năm ' + now.getFullYear() + '</h3><p>' + overviews[seed % overviews.length] + '</p>');
    });
  }
  window.PTVToolsW3b = { 'xem-than-so-hoc': thanSo, 'xem-boi-ngay-sinh': boiNgaySinh, 'xem-duong-hoc-van': hocVan, 'xem-la-so-tu-tru': tuTru, 'xem-la-so-tu-vi': laSoTuVi, 'xem-cung-hoang-dao': cungHoangDao, 'xem-tu-vi-tay-phuong': tuViTayPhuong };
})();
(function () {
  'use strict';
  var L = window.PTVLib, D = window.PTVDay, E = window.PTVEngine, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem kết quả') + '</button></form><div class="ptv-out"></div>'; }
  function dateFields() { return '<div class="ptv-row">' + L.field('Ngày sinh', '<input type="text" id="bd" inputmode="numeric" value="15">') + L.field('Tháng sinh', '<input type="text" id="bm" inputmode="numeric" value="6">') + L.field('Năm sinh', '<input type="text" id="by" inputmode="numeric" value="1995">') + '</div>'; }
  function seedOf(c) { return (c.querySelector('#bd').value || '') + '/' + (c.querySelector('#bm').value || '') + '/' + (c.querySelector('#by').value || ''); }
  function tienKiep(container) {
    container.innerHTML = formWrap(dateFields(), 'Giải mã tiền kiếp');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = (window.PTV_TOOLS_DATA || {}).tienKiep || { pastLives: [], lessons: [] };
      var h = L.hashStr('tienkiep|' + seedOf(container));
      var life = data.pastLives[h % data.pastLives.length], lesson = data.lessons[(h >> 3) % data.lessons.length];
      L.resultBox(container, '<h3>Tiền kiếp của bạn: ' + esc(life.role) + '</h3><p>' + esc(life.desc) + '</p><h3>Bài học còn mang theo</h3><p>' + esc(lesson) + '</p><p class="ptv-note">Giải mã tiền kiếp ở đây là hình thức luận giải giải trí dựa trên ngày sinh, giúp bạn soi chiếu tính cách hiện tại qua một câu chuyện kiếp trước.</p>');
    });
  }
  function hauKiep(container) {
    container.innerHTML = formWrap(dateFields(), 'Giải mã hậu kiếp');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = (window.PTV_TOOLS_DATA || {}).tienKiep || { futurePaths: [], lessons: [] };
      var h = L.hashStr('haukiep|' + seedOf(container));
      var p = data.futurePaths[h % data.futurePaths.length], lesson = data.lessons[(h >> 4) % data.lessons.length];
      L.resultBox(container, '<h3>Hậu vận của bạn: ' + esc(p.path) + '</h3><p>' + esc(p.desc) + '</p><p><strong>Điều nên vun bồi từ bây giờ:</strong> ' + esc(lesson) + '</p><p class="ptv-note">Hậu kiếp và hậu vận là cách nói dân gian về chặng sau của đời người. Tương lai vẫn nằm trong tay bạn, phần luận giải này chỉ là một gợi ý để suy ngẫm.</p>');
    });
  }
  var NAMES_NAM = ['Minh Quân', 'Hoàng Nam', 'Tuấn Anh', 'Đức Anh', 'Quốc Bảo', 'Thanh Tùng', 'Văn Đức', 'Hữu Phước', 'Trọng Nghĩa', 'Khánh Duy', 'Minh Khang', 'Gia Huy', 'Thành Đạt', 'Xuân Bách', 'Hải Đăng', 'Quang Vinh', 'Minh Trí', 'Anh Tuấn', 'Đình Phong', 'Bảo Long', 'Trí Dũng', 'Minh Hiếu', 'Quốc Anh', 'Văn Thắng'];
  var NAMES_NU = ['Phương Anh', 'Thu Hằng', 'Ngọc Trâm', 'Mỹ Linh', 'Thanh Thảo', 'Hương Giang', 'Khánh Linh', 'Tuyết Mai', 'Ngọc Anh', 'Thu Trang', 'Minh Châu', 'Bảo Ngọc', 'Phương Chi', 'Thu Hà', 'Lan Anh', 'Diễm Quỳnh', 'Hồng Nhung', 'Thanh Huyền', 'Ngọc Mai', 'Thùy Dương', 'Kim Ngân', 'Hoài Thương', 'Mỹ Tâm', 'Trà My'];
  var JOBS = ['kỹ sư công nghệ', 'bác sĩ', 'giáo viên', 'chủ một cửa hàng nhỏ', 'nhân viên ngân hàng', 'kiến trúc sư', 'làm truyền thông', 'kinh doanh online', 'đầu bếp', 'nhân viên văn phòng', 'làm nghệ thuật tự do', 'làm việc trong ngành du lịch'];
  var PLACES = ['qua bạn bè giới thiệu', 'tại nơi làm việc hoặc một dự án chung', 'trong một chuyến đi xa', 'qua một lớp học hoặc khóa đào tạo', 'tại quán cà phê quen', 'qua một sự kiện của bạn bè chung', 'trên mạng xã hội', 'tại một buổi tiệc của người quen'];
  function tenNguoiYeu(container) {
    container.innerHTML = formWrap(dateFields() + '<div class="ptv-row">' + L.field('Giới tính của bạn', L.genderSelect('g')) + L.field('Họ tên của bạn (không bắt buộc)', '<input type="text" id="nm" value="">') + '</div>', 'Gieo quẻ tên người yêu');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var g = container.querySelector('#g').value;
      var h = L.hashStr('yeu|' + seedOf(container) + '|' + (container.querySelector('#nm').value || '').toLowerCase());
      var pool = g === 'Nam' ? NAMES_NU : NAMES_NAM;
      var name = pool[h % pool.length], job = JOBS[(h >> 3) % JOBS.length], place = PLACES[(h >> 5) % PLACES.length];
      var ageDiff = (h % 7) - 3;
      var html = '<div class="ptv-kieu-verse"><p>💌 ' + esc(name) + '</p></div>' +
        '<p>Theo quẻ gieo từ ngày sinh của bạn, người thương tương lai có khả năng tên là <strong>' + esc(name) + '</strong>, ' + (ageDiff === 0 ? 'trạc tuổi bạn' : ageDiff > 0 ? 'hơn bạn khoảng ' + ageDiff + ' tuổi' : 'kém bạn khoảng ' + (-ageDiff) + ' tuổi') + ', làm ' + job + '. Hai bạn nhiều khả năng gặp nhau ' + place + '.</p>' +
        '<p class="ptv-note">Đây là công cụ gieo quẻ giải trí được nhiều bạn trẻ yêu thích, kết quả mang tính vui vẻ tham khảo. Duyên thật sự đến từ sự mở lòng và chủ động của chính bạn.</p>';
      L.resultBox(container, html);
    });
  }
  var TAROT = [['Kẻ Khờ', 'Khởi đầu mới, sự hồn nhiên và một bước nhảy niềm tin. Năm nay hợp để bạn bắt đầu điều chưa từng thử.'], ['Pháp Sư', 'Năng lực và sự chủ động đang ở trong tay bạn. Hãy dùng kỹ năng mình có để biến ý tưởng thành việc thật.'], ['Nữ Tư Tế', 'Trực giác và những điều chưa nói thành lời. Nên lắng nghe bên trong trước khi quyết định việc lớn.'], ['Nữ Hoàng', 'Sự đủ đầy, chăm sóc và sáng tạo. Gia đạo và các mối quan hệ được nuôi dưỡng sẽ sinh trái ngọt.'], ['Hoàng Đế', 'Kỷ luật, cấu trúc và trách nhiệm. Muốn đi xa cần dựng nền thật chắc và giữ chữ tín.'], ['Giáo Hoàng', 'Truyền thống, thầy dạy và niềm tin. Học từ người đi trước giúp bạn tránh nhiều vòng vo.'], ['Người Tình', 'Lựa chọn của trái tim. Một quyết định quan trọng về tình cảm hoặc đối tác đang chờ bạn rõ lòng.'], ['Cỗ Xe', 'Chiến thắng nhờ ý chí và sự tập trung. Cứ giữ đúng hướng, bạn sẽ vượt qua giai đoạn cạnh tranh này.'], ['Sức Mạnh', 'Sức mạnh mềm: kiên nhẫn và lòng can đảm điềm tĩnh sẽ thắng sự nóng vội.'], ['Ẩn Sĩ', 'Cần thời gian một mình để nhìn lại. Câu trả lời bạn tìm nằm trong sự tĩnh lặng, không nằm ở bên ngoài.'], ['Bánh Xe Số Phận', 'Vận đang xoay chiều, cơ hội bất ngờ sắp tới. Hãy sẵn sàng nắm bắt khi thời cơ đổi hướng.'], ['Công Lý', 'Cân bằng và hậu quả rõ ràng. Việc gì làm đúng, giấy tờ minh bạch thì kết quả sẽ công bằng với bạn.'], ['Người Treo', 'Tạm dừng để nhìn việc từ góc khác. Chậm lại lúc này là để đi đúng hơn về sau.'], ['Thần Chết', 'Một chương cũ khép lại để chương mới mở ra. Buông bỏ điều đã hết thời là cần thiết.'], ['Tiết Độ', 'Điều hòa, cân bằng và chữa lành. Mọi việc nên tiến hành từ tốn, tránh cực đoan.'], ['Ác Quỷ', 'Cẩn thận với cám dỗ và những thói quen đang trói bạn. Nhận diện được là thoát ra được.'], ['Tháp Đổ', 'Một biến cố bất ngờ phá vỡ điều cũ. Dù sốc, đây là cơ hội dựng lại trên nền đúng hơn.'], ['Ngôi Sao', 'Hy vọng, cảm hứng và sự hồi phục. Sau giai đoạn khó, ánh sáng đang quay lại với bạn.'], ['Mặt Trăng', 'Mọi việc còn mờ, cảm xúc dễ đánh lừa lý trí. Đừng quyết định lớn khi chưa rõ thông tin.'], ['Mặt Trời', 'Niềm vui, thành công và sự rõ ràng. Đây là lá bài sáng nhất, báo hiệu giai đoạn rực rỡ.'], ['Phán Xét', 'Tiếng gọi thức tỉnh và cơ hội làm lại. Hãy khép lại ân oán cũ để bước sang trang mới.'], ['Thế Giới', 'Hoàn thành một chu trình lớn, viên mãn và được ghi nhận. Một cánh cửa mới ở tầm cao hơn đang mở.']];
  function laBai(container) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Họ tên của bạn', '<input type="text" id="nm" value="">', 'ptv-field-name') + '</div>' + dateFields(), 'Rút lá bài bản mệnh');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var h = L.hashStr('tarot|' + (container.querySelector('#nm').value || '').toLowerCase() + '|' + seedOf(container));
      var card = TAROT[h % 22];
      L.resultBox(container, '<div class="ptv-kieu-verse"><p>🃏 ' + card[0] + '</p></div><p>' + card[1] + '</p><p class="ptv-note">Lá bài bản mệnh được rút cố định theo họ tên và ngày sinh của bạn, nên mỗi người có một lá bài riêng gắn với mình.</p>');
    });
  }
  var QT_TONES = {
    'Thượng thượng': { verse: ['Mây tan trời sáng tỏ', 'Đường rộng thênh thang mở lối về', 'Việc cầu như ý nguyện', 'Quý nhân đưa bước chẳng hề sai'], text: 'Đây là quẻ thượng thượng, cát tường bậc nhất. Việc bạn cầu đang ở thế thuận buồm xuôi gió, nên mạnh dạn tiến hành, đồng thời nhớ chia sẻ phúc lộc cho người xung quanh để giữ bền.' },
    'Thượng': { verse: ['Suối nguồn vừa mở lối', 'Cây khô gặp tiết xuân sang', 'Công danh tài lộc rõ ràng', 'Chậm mà chắc chắn, chớ mang vội vàng'], text: 'Quẻ thượng, điềm lành rõ rệt. Việc cầu có quý nhân đỡ, kết quả tốt nếu bạn làm đúng trình tự và giữ chữ tín.' },
    'Trung': { verse: ['Nửa mừng nửa lại lo', 'Đường đi khúc khuỷu chưa thông', 'Giữ lòng cho vững chớ nông', 'Qua cơn bĩ cực tới vòng thái lai'], text: 'Quẻ trung bình, tốt xấu đan xen. Việc cầu chưa thành ngay, cần kiên nhẫn và điều chỉnh từng bước, tránh quyết định bốc đồng.' },
    'Hạ': { verse: ['Gió mưa đương buổi tối trời', 'Thuyền con chớ vội ra khơi lúc này', 'Giữ mình chờ đợi đổi thay', 'Cẩn thận lời nói, việc hay hóa dở'], text: 'Quẻ hạ, điềm chưa thuận. Nên thu mình chờ thời, tránh đầu tư mạo hiểm và các việc cần quyết nhanh trong lúc này.' },
    'Hạ hạ': { verse: ['Đêm dài chưa thấy ánh dương', 'Việc cầu trắc trở trăm đường khó khăn', 'An lòng giữ phận ân cần', 'Qua được vận hạn, phúc phần lại sinh'], text: 'Quẻ hạ hạ, giai đoạn khó khăn nhất thời. Đừng cưỡng cầu việc lớn, hãy chăm lo sức khỏe và gia đạo, vận sẽ đổi khi thời điểm chín muồi.' }
  };
  var QT_ORDER = ['Thượng thượng', 'Thượng', 'Thượng', 'Trung', 'Trung', 'Trung', 'Trung', 'Hạ', 'Hạ', 'Hạ hạ'];
  function quanThanh(container) {
    container.innerHTML = '<div class="ptv-form"><p style="margin-top:0">Thành tâm khấn nguyện và nghĩ về điều muốn cầu, rồi bấm rút quẻ Quan Thánh. Mỗi quẻ gồm một bài thơ quẻ và phần luận giải tổng quát.</p><div class="ptv-kieu-verse" id="ptv-qt"><p>🏮</p></div><button type="button" class="ptv-btn" id="ptv-qt-btn">Rút quẻ Quan Thánh</button></div><div class="ptv-out"></div>';
    container.querySelector('#ptv-qt-btn').addEventListener('click', function () {
      var n = 1 + Math.floor(Math.random() * 100);
      var tone = QT_ORDER[L.hashStr('qt|' + n) % 10];
      var t = QT_TONES[tone];
      container.querySelector('#ptv-qt').innerHTML = t.verse.map(function (v) { return '<p>' + v + '</p>'; }).join('');
      L.resultBox(container, '<h3>Quẻ Quan Thánh số ' + n + ' · ' + tone + '</h3><p>' + t.text + '</p><p class="ptv-note">Lời giải ở đây là luận giải tổng quát theo đẳng quẻ. Với việc cụ thể như cầu tài, cầu danh, cầu bệnh hay cầu duyên, bạn đối chiếu ý quẻ với hoàn cảnh của mình để suy ngẫm.</p>');
    });
  }
  function dreamSearch(container, mode) {
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field(mode === 'numbers' ? 'Kể lại giấc mơ của bạn' : 'Bạn mơ thấy điều gì?', '<input type="text" id="q" value="" placeholder="Ví dụ: mơ thấy rắn bò vào nhà">', 'ptv-field-name') + '</div>', mode === 'numbers' ? 'Luận con số' : 'Giải mã giấc mơ');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var q = (container.querySelector('#q').value || '').toLowerCase();
      var dict = (window.PTV_TOOLS_DATA || {}).dreamDict || [];
      var best = null, bestLen = 0;
      dict.forEach(function (e) { (e.keywords || []).forEach(function (k) { if (q.indexOf(k.toLowerCase()) >= 0 && k.length > bestLen) { best = e; bestLen = k.length; } }); });
      if (!best) { L.resultBox(container, '<p>Chưa tìm thấy giấc mơ khớp với mô tả của bạn trong từ điển ' + dict.length + ' giấc mơ phổ biến. Bạn thử kể ngắn gọn bằng từ khóa chính, ví dụ "rắn", "nước", "tiền", "răng rụng" nhé.</p>'); return; }
      var html = '<h3>' + esc(best.subject) + '</h3><p>' + esc(best.meaning) + '</p><p><strong>Con số gợi ý từ giấc mơ:</strong> ' + (best.numbers || []).join(', ') + '.</p>';
      if (mode === 'numbers') html += '<p class="ptv-note">Con số trong mơ là phần luận giải dân gian đi kèm giấc mơ, mang tính giải trí tham khảo.</p>';
      L.resultBox(container, html);
    });
  }
  function diemBao(container) {
    var dict = (window.PTV_TOOLS_DATA || {}).omenDict || [];
    var opts = dict.map(function (e, i) { return '<option value="' + i + '">' + esc(e.subject) + '</option>'; }).join('');
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Chọn điềm báo bạn gặp', L.select('om', opts), 'ptv-field-name') + '</div>', 'Giải mã điềm báo');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var e = dict[parseInt(container.querySelector('#om').value, 10)];
      if (!e) return;
      L.resultBox(container, '<h3>' + esc(e.subject) + ' <span class="' + (e.type === 'tốt' ? 'ptv-good' : e.type === 'cần chú ý' ? 'ptv-bad' : 'ptv-mid') + '">· Điềm ' + e.type + '</span></h3><p>' + esc(e.meaning) + '</p><p class="ptv-note">Điềm báo là quan niệm dân gian truyền miệng, bạn đọc để tham khảo và vui vẻ suy ngẫm, không nên lo lắng thái quá với các điềm cần chú ý.</p>');
    });
  }
  var W3c = { 'giai-ma-tien-kiep': tienKiep, 'giai-ma-hau-kiep': hauKiep, 'ten-nguoi-yeu-tuong-lai': tenNguoiYeu, 'la-bai-ban-menh': laBai, 'gieo-que-quan-thanh': quanThanh, 'giai-ma-giac-mo': function (c) { dreamSearch(c, 'dream'); }, 'luan-con-so-trong-mo': function (c) { dreamSearch(c, 'numbers'); }, 'giai-ma-diem-bao': diemBao };
  window.PTVTools = Object.assign({}, window.PTVTools || {}, window.PTVToolsW3a || {}, window.PTVToolsW3b || {}, W3c);
})();
