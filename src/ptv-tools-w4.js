/* PhongThuy VietAA - cong cu dot 4: Nhan Tuong (v1.6) */
(function () {
  'use strict';
  var L = window.PTVLib, esc = L.esc;
  function formWrap(inner, btn) { return '<form class="ptv-form">' + inner + '<button type="submit" class="ptv-btn">' + (btn || 'Xem ý nghĩa') + '</button></form><div class="ptv-out"></div>'; }
  function moleTool(container, key, label) {
    var dict = (window.PTV_TOOLS_DATA || {})[key] || [];
    var opts = dict.map(function (e, i) { return '<option value="' + i + '">' + esc(e.position) + '</option>'; }).join('');
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Chọn vị trí nốt ruồi ' + label, L.select('pos', opts), 'ptv-field-name') + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var e = dict[parseInt(container.querySelector('#pos').value, 10)];
      if (!e) return;
      L.resultBox(container, '<h3>Nốt ruồi ở ' + esc(e.position) + '</h3><p>' + esc(e.meaning) + '</p><p class="ptv-note">Xem nốt ruồi là một phần của nhân tướng học dân gian, mang tính tham khảo. Nốt ruồi còn liên quan đến sức khỏe da liễu, nếu nốt ruồi thay đổi hình dạng, màu sắc bất thường bạn nên đi khám bác sĩ.</p>');
    });
  }
  function tattooTool(container) {
    var dict = (window.PTV_TOOLS_DATA || {}).tattooDict || [];
    var opts = dict.map(function (e, i) { return '<option value="' + i + '">' + esc(e.motif) + '</option>'; }).join('');
    container.innerHTML = formWrap('<div class="ptv-row">' + L.field('Chọn hình xăm bạn quan tâm', L.select('tt', opts), 'ptv-field-name') + '</div>');
    container.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var e = dict[parseInt(container.querySelector('#tt').value, 10)];
      if (!e) return;
      L.resultBox(container, '<h3>Ý nghĩa hình xăm ' + esc(e.motif) + '</h3><p>' + esc(e.meaning) + '</p><p><strong>Lưu ý:</strong> ' + esc(e.advice) + '</p><p class="ptv-note">Hình xăm đi cùng bạn rất lâu dài, ý nghĩa phong thủy chỉ là một phần, quan trọng nhất là bạn thật sự yêu thích hình đó và chọn cơ sở xăm uy tín, an toàn.</p>');
    });
  }
  var W4 = { 'boi-not-ruoi-tren-mat': function (c) { moleTool(c, 'moleFace', 'trên mặt'); }, 'boi-not-ruoi-toan-than': function (c) { moleTool(c, 'moleBody', 'trên cơ thể'); }, 'xem-y-nghia-hinh-xam': tattooTool };
  window.PTVTools = Object.assign({}, window.PTVTools || {}, W4);
})();
