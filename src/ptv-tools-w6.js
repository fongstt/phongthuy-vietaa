
/* --- Nang cap rieng Gieo Que Dong Xu (v2): que bien + tra cuu 64 que + lich su --- */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc;
  var W3 = window.PTVToolsW3a || {};
  var queLookup = W3._queLookup;
  var QUE_TEXT = W3._QUE_TEXT || {};
  var TRIMAP = { '111': 'Càn', '110': 'Đoài', '101': 'Ly', '100': 'Chấn', '011': 'Tốn', '010': 'Khảm', '001': 'Cấn', '000': 'Khôn' };
  var TRI = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
  function triOfBits(b) { return TRIMAP[b.join('')]; }
  function queHTML2(q) {
    if (!q) return '';
    var cls = q.rating === 'Cát' ? 'ptv-good' : q.rating === 'Bình' ? 'ptv-mid' : 'ptv-bad';
    return '<h3>Quẻ ' + esc(q.name) + ' <span class="' + cls + '">(' + esc(q.rating) + ')</span></h3><p>Quẻ thượng ' + esc(q.upper) + ', quẻ hạ ' + esc(q.lower) + '. ' + esc(QUE_TEXT[q.name] || '') + '</p>';
  }
  function linesHTML(tosses, flip) {
    return tosses.map(function (s, i) {
      var yang = (s === 7 || s === 9);
      if (flip && (s === 6 || s === 9)) yang = !yang;
      var mv = (s === 6 || s === 9);
      return '<div>Hào ' + (i + 1) + ': ' + (yang ? '▅▅▅▅▅' : '▅▅ ▅▅') + (mv ? (s === 6 ? ' ○ (lão âm, biến thành dương)' : ' × (lão dương, biến thành âm)') : '') + '</div>';
    }).reverse().join('');
  }

  function dongXuV2(c) {
    var tosses = [];
    c.innerHTML =
      '<div class="ptv-xtabs"><button type="button" class="ptv-xtab ptv-on" data-t="gieo">Gieo quẻ đồng xu</button>' +
      '<button type="button" class="ptv-xtab" data-t="tra">Tra cứu nhanh 64 quẻ</button></div>' +
      '<div id="dx-gieo"><div class="ptv-form">' +
      '<div class="ptv-row">' + L.field('Điều bạn muốn hỏi (không bắt buộc, giúp bạn tập trung khi gieo)', '<input type="text" id="dx-q" value="" placeholder="Ví dụ: Tôi có nên nhận công việc mới trong tháng này không?">', 'ptv-field-name') + '</div>' +
      '<p style="margin-top:0">Thành tâm nghĩ về điều bạn muốn hỏi, rồi bấm gieo xu 6 lần để lập đủ 6 hào, từ hào 1 ở dưới lên hào 6 ở trên, đúng cách gieo quẻ Kinh Dịch truyền thống. Nếu quẻ có hào biến, công cụ sẽ luận thêm cả quẻ biến cho bạn.</p>' +
      '<div class="ptv-kieu-verse" id="dx-coins"><p>🪙 🪙 🪙</p></div>' +
      '<div id="dx-lines" style="text-align:center;font-size:19px;line-height:1.5;margin:10px 0"></div>' +
      '<button type="button" class="ptv-btn" id="dx-toss">Gieo lần 1</button>' +
      '<div id="dx-hist"></div>' +
      '</div><div class="ptv-out"></div></div>' +
      '<div id="dx-tra" hidden><form class="ptv-form"><div class="ptv-row">' +
      L.field('Quẻ thượng', L.select('dx-up', TRI.map(function (t) { return '<option>' + t + '</option>'; }).join(''))) +
      L.field('Quẻ hạ', L.select('dx-lo', TRI.map(function (t) { return '<option>' + t + '</option>'; }).join(''))) +
      '</div><button type="submit" class="ptv-btn">Tra quẻ</button></form><div class="ptv-out"></div></div>';

    var tabs = c.querySelectorAll('.ptv-xtab');
    function show(t) {
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('ptv-on', tabs[i].getAttribute('data-t') === t);
      c.querySelector('#dx-gieo').hidden = t !== 'gieo';
      c.querySelector('#dx-tra').hidden = t !== 'tra';
    }
    for (var i = 0; i < tabs.length; i++) tabs[i].addEventListener('click', function () { show(this.getAttribute('data-t')); });

    function renderHist() {
      var h = [];
      try { h = JSON.parse(localStorage.getItem('ptvDongXuHistory') || '[]'); } catch (e) { h = []; }
      var box = c.querySelector('#dx-hist');
      if (!h.length) { box.innerHTML = ''; return; }
      box.innerHTML = '<h4>Các quẻ bạn đã gieo gần đây</h4>' + h.map(function (x, i) {
        return '<p class="ptv-note">🪙 <strong>' + esc(x.name) + '</strong>' + (x.bien ? ' → biến sang ' + esc(x.bien) : '') + (x.q ? ' · hỏi: ' + esc(x.q) : '') + '</p>';
      }).join('') + '<p><button type="button" class="ptv-xbtn" id="dx-hist-clear">Xóa lịch sử gieo</button></p>';
      c.querySelector('#dx-hist-clear').addEventListener('click', function () { localStorage.removeItem('ptvDongXuHistory'); renderHist(); });
    }
    renderHist();

    var btn = c.querySelector('#dx-toss');
    btn.addEventListener('click', function () {
      if (tosses.length >= 6) return;
      btn.disabled = true;
      var coinsBox = c.querySelector('#dx-coins');
      coinsBox.classList.remove('ptv-coin-anim'); void coinsBox.offsetWidth; coinsBox.classList.add('ptv-coin-anim');
      var spins = 0;
      var iv = setInterval(function () {
        spins++;
        coinsBox.innerHTML = '<p>' + [0, 0, 0].map(function () { return Math.random() < 0.5 ? '🟡' : '⚪'; }).join(' ') + '</p>';
        if (spins >= 6) {
          clearInterval(iv);
          settle();
        }
      }, 70);
      function settle() {
        var coins = [0, 0, 0].map(function () { return Math.random() < 0.5 ? 2 : 3; });
        var sum = coins[0] + coins[1] + coins[2];
        tosses.push(sum);
        coinsBox.innerHTML = '<p>' + coins.map(function (x) { return x === 3 ? '🟡 Ngửa' : '⚪ Sấp'; }).join(' · ') + ' = ' + sum + '</p>';
        c.querySelector('#dx-lines').innerHTML = linesHTML(tosses, false);
        btn.disabled = false;
        if (tosses.length < 6) { btn.textContent = 'Gieo lần ' + (tosses.length + 1); return; }
        btn.style.display = 'none';
        finish();
      }
    });

    function finish() {
      var bits = tosses.map(function (s) { return (s === 7 || s === 9) ? 1 : 0; });
      var lower = triOfBits(bits.slice(0, 3)), upper = triOfBits(bits.slice(3, 6));
      var q = queLookup(upper, lower);
      var bien = tosses.map(function (s, i) { return (s === 6 || s === 9) ? i + 1 : null; }).filter(Boolean);
      var question = (c.querySelector('#dx-q').value || '').trim();
      var html = (question ? '<p><strong>Điều bạn hỏi:</strong> ' + esc(question) + '</p>' : '') + queHTML2(q);
      var qb = null;
      if (bien.length) {
        var fbits = bits.map(function (b, i) { return (tosses[i] === 6 || tosses[i] === 9) ? (b ? 0 : 1) : b; });
        qb = queLookup(triOfBits(fbits.slice(3, 6)), triOfBits(fbits.slice(0, 3)));
        html += '<p><strong>Hào biến:</strong> hào ' + bien.join(', ') + '. Hào biến là nơi việc đang chuyển động mạnh nhất trong quẻ.</p>' +
          '<h4>Đồ hình quẻ biến</h4><div style="text-align:center;font-size:19px;line-height:1.5">' + linesHTML(tosses, true) + '</div>' +
          '<h4>Quẻ biến: ' + esc(qb ? qb.name : '') + '</h4>' + (qb ? queHTML2(qb).replace(/<h3>.*?<\/h3>/, '') : '') +
          '<p>Cách đọc khi có quẻ biến: quẻ chính (' + esc(q.name) + ') cho thấy tình hình hiện tại và xu hướng chính, quẻ biến (' + esc(qb ? qb.name : '') + ') cho thấy hướng sự việc sẽ chuyển tới nếu các hào biến phát huy tác dụng. ' + (bien.length === 1 ? 'Chỉ có một hào biến thì hào đó là điểm nhấn quan trọng nhất, hãy chú ý vị trí của nó: hào ở dưới chủ về giai đoạn đầu và việc gần, hào ở trên chủ về kết cục và việc xa.' : 'Có nhiều hào biến thì trọng tâm nằm ở bức tranh tổng thể của hai quẻ hơn là từng hào riêng lẻ.') + '</p>';
      } else {
        html += '<p>Quẻ không có hào biến, tình hình tương đối ổn định và diễn biến đúng theo ý nghĩa của quẻ chính trong thời gian tới.</p>';
      }
      html += '<div class="ptv-kieu-actions"><button type="button" class="ptv-xbtn" id="dx-new">Gieo quẻ mới</button> <button type="button" class="ptv-xbtn" id="dx-copy">Sao chép kết quả</button><span id="dx-copy-msg" class="ptv-note"></span></div>' +
        '<p class="ptv-note">Gieo quẻ đồng xu trên Phong Thủy VietAA dùng 3 đồng xu gieo 6 lần theo đúng lệ xưa: tổng 6 là lão âm, 7 là thiếu dương, 8 là thiếu âm, 9 là lão dương; hai hào lão là hào biến.</p>';
      L.resultBox(c.querySelector('#dx-gieo'), html);
      try {
        var h = JSON.parse(localStorage.getItem('ptvDongXuHistory') || '[]');
        h.unshift({ name: q.name, bien: qb ? qb.name : '', q: question });
        localStorage.setItem('ptvDongXuHistory', JSON.stringify(h.slice(0, 8)));
      } catch (e) {}
      renderHist();
      c.querySelector('#dx-new').addEventListener('click', function () {
        tosses = [];
        c.querySelector('#dx-lines').innerHTML = '';
        c.querySelector('#dx-coins').innerHTML = '<p>🪙 🪙 🪙</p>';
        c.querySelector('#dx-gieo .ptv-out').innerHTML = '';
        btn.style.display = ''; btn.textContent = 'Gieo lần 1';
      });
      c.querySelector('#dx-copy').addEventListener('click', function () {
        var txt = 'Mình vừa gieo quẻ đồng xu được quẻ ' + q.name + (qb ? ', biến sang quẻ ' + qb.name : '') + '. Gieo thử tại https://phongthuy.vietaa.com/gieo-que-dong-xu/';
        var msg = c.querySelector('#dx-copy-msg');
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { msg.textContent = ' Đã chép xong.'; }, function () { msg.textContent = ' Trình duyệt chặn sao chép.'; });
      });
    }

    c.querySelector('#dx-tra form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var q = queLookup(c.querySelector('#dx-up').value, c.querySelector('#dx-lo').value);
      if (q) L.resultBox(c.querySelector('#dx-tra'), queHTML2(q) + '<p class="ptv-note">64 quẻ Kinh Dịch được tạo thành từ 8 quẻ đơn ghép đôi. Đổi quẻ thượng và quẻ hạ ở form phía trên để tra quẻ khác.</p>');
    });
  }

  window.PTVTools = Object.assign({}, window.PTVTools || {}, { 'gieo-que-dong-xu': dongXuV2 });
})();
