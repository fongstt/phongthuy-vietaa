/* PhongThuy VietAA - thu vien chung cho cac cong cu (v1.3) */
(function () {
  'use strict';
  var E = window.PTVEngine;
  var CAN = E.CAN, CHI = E.CHI;
  var CAN_EL = { 'Giáp': 'Mộc', 'Ất': 'Mộc', 'Bính': 'Hỏa', 'Đinh': 'Hỏa', 'Mậu': 'Thổ', 'Kỷ': 'Thổ', 'Canh': 'Kim', 'Tân': 'Kim', 'Nhâm': 'Thủy', 'Quý': 'Thủy' };
  var GENERATES = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
  var CONTROLS = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
  var EL_COLOR = { 'Kim': '#8a6d1c', 'Mộc': '#2e7d32', 'Thủy': '#1565c0', 'Hỏa': '#c62828', 'Thổ': '#8d5a2b' };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function badge(e) { return '<span class="ptv-el" style="background:' + (EL_COLOR[e] || '#666') + '">' + esc(e) + '</span>'; }
  function relEl(a, b) {
    if (a === b) return 'Cùng hành, hòa hợp';
    if (GENERATES[a] === b) return a + ' sinh ' + b + ', tương sinh';
    if (GENERATES[b] === a) return b + ' sinh ' + a + ', được tương sinh';
    if (CONTROLS[a] === b) return a + ' khắc ' + b + ', tương khắc';
    if (CONTROLS[b] === a) return b + ' khắc ' + a + ', bị tương khắc';
    return 'Bình hòa';
  }
  function yearInfo(y) {
    var ci = ((y - 4) % 10 + 10) % 10, hi = ((y - 4) % 12 + 12) % 12;
    var p = { can: CAN[ci], chi: CHI[hi] };
    var na = E.napAmOf(p);
    return { year: y, can: p.can, chi: p.chi, text: p.can + ' ' + p.chi, canEl: CAN_EL[p.can], napAm: na.name, el: na.element };
  }
  /* Cung phi bat trach */
  function cungPhi(y, gender) {
    var s = String(y).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0);
    while (s > 9) s = String(s).split('').reduce(function (a, c) { return a + parseInt(c, 10); }, 0);
    var n;
    if (gender === 'Nam') n = (y < 2000 ? 10 - s : 9 - s);
    else n = (y < 2000 ? 5 + s : 6 + s);
    n = ((n - 1) % 9 + 9) % 9 + 1;
    if (n === 5) n = (gender === 'Nam' ? 2 : 8);
    var MAP = { 1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly' };
    var cung = MAP[n];
    var dong = ['Khảm', 'Ly', 'Chấn', 'Tốn'].indexOf(cung) >= 0;
    return { cung: cung, group: dong ? 'Đông tứ mệnh' : 'Tây tứ mệnh' };
  }
  var DIRS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  var CUNG_DIR = { 'Khảm': 'Bắc', 'Cấn': 'Đông Bắc', 'Chấn': 'Đông', 'Tốn': 'Đông Nam', 'Ly': 'Nam', 'Khôn': 'Tây Nam', 'Đoài': 'Tây', 'Càn': 'Tây Bắc' };
  var DU_NIEN = {
    'Càn': ['Lục Sát', 'Thiên Y', 'Ngũ Quỷ', 'Họa Hại', 'Tuyệt Mệnh', 'Diên Niên', 'Sinh Khí', 'Phục Vị'],
    'Khôn': ['Tuyệt Mệnh', 'Sinh Khí', 'Họa Hại', 'Lục Sát', 'Ngũ Quỷ', 'Phục Vị', 'Diên Niên', 'Thiên Y'],
    'Cấn': ['Ngũ Quỷ', 'Phục Vị', 'Lục Sát', 'Tuyệt Mệnh', 'Họa Hại', 'Sinh Khí', 'Thiên Y', 'Diên Niên'],
    'Đoài': ['Họa Hại', 'Diên Niên', 'Tuyệt Mệnh', 'Lục Sát', 'Ngũ Quỷ', 'Thiên Y', 'Phục Vị', 'Sinh Khí'],
    'Khảm': ['Phục Vị', 'Ngũ Quỷ', 'Thiên Y', 'Sinh Khí', 'Diên Niên', 'Lục Sát', 'Họa Hại', 'Tuyệt Mệnh'],
    'Ly': ['Thiên Y', 'Lục Sát', 'Sinh Khí', 'Diên Niên', 'Phục Vị', 'Họa Hại', 'Ngũ Quỷ', 'Tuyệt Mệnh'],
    'Chấn': ['Diên Niên', 'Họa Hại', 'Phục Vị', 'Thiên Y', 'Sinh Khí', 'Lục Sát', 'Tuyệt Mệnh', 'Ngũ Quỷ'],
    'Tốn': ['Sinh Khí', 'Họa Hại', 'Diên Niên', 'Phục Vị', 'Thiên Y', 'Tuyệt Mệnh', 'Ngũ Quỷ', 'Lục Sát']
  };
  var STAR_INFO = {
    'Sinh Khí': { t: 'tốt', d: 'Sao tốt nhất trong bát trạch, chủ về tài lộc, danh tiếng và sức sống dồi dào.' },
    'Thiên Y': { t: 'tốt', d: 'Sao chủ về sức khỏe và quý nhân phù trợ, gặp khó có người giúp.' },
    'Diên Niên': { t: 'tốt', d: 'Sao chủ về hòa thuận, các mối quan hệ bền chặt, gia đạo êm ấm.' },
    'Phục Vị': { t: 'tốt', d: 'Sao chủ về sự ổn định, bình an và củng cố nội lực.' },
    'Họa Hại': { t: 'xấu', d: 'Sao xấu nhẹ, chủ về thị phi, hao tốn nhỏ và việc lặt vặt không như ý.' },
    'Lục Sát': { t: 'xấu', d: 'Sao xấu, chủ về rắc rối quan hệ, tranh chấp và hao tài.' },
    'Ngũ Quỷ': { t: 'xấu', d: 'Sao xấu, chủ về biến động, mất mát và những việc bất ngờ ngoài ý muốn.' },
    'Tuyệt Mệnh': { t: 'xấu', d: 'Sao xấu nhất trong bát trạch, chủ về tổn hại lớn, cần tránh dùng lâu dài.' }
  };
  function starsFor(cung) {
    return DIRS.map(function (d, i) { return { dir: d, star: DU_NIEN[cung][i], info: STAR_INFO[DU_NIEN[cung][i]] }; });
  }
  function coupleStar(hCung, wCung) {
    var dir = CUNG_DIR[wCung];
    return DU_NIEN[hCung][DIRS.indexOf(dir)];
  }
  /* Quan he dia chi */
  var TAM_HOP = [['Thân', 'Tý', 'Thìn'], ['Dần', 'Ngọ', 'Tuất'], ['Hợi', 'Mão', 'Mùi'], ['Tỵ', 'Dậu', 'Sửu']];
  var LUC_HOP = { 'Tý': 'Sửu', 'Sửu': 'Tý', 'Dần': 'Hợi', 'Hợi': 'Dần', 'Mão': 'Tuất', 'Tuất': 'Mão', 'Thìn': 'Dậu', 'Dậu': 'Thìn', 'Tỵ': 'Thân', 'Thân': 'Tỵ', 'Ngọ': 'Mùi', 'Mùi': 'Ngọ' };
  var XUNG = { 'Tý': 'Ngọ', 'Ngọ': 'Tý', 'Sửu': 'Mùi', 'Mùi': 'Sửu', 'Dần': 'Thân', 'Thân': 'Dần', 'Mão': 'Dậu', 'Dậu': 'Mão', 'Thìn': 'Tuất', 'Tuất': 'Thìn', 'Tỵ': 'Hợi', 'Hợi': 'Tỵ' };
  var HAI = { 'Tý': 'Mùi', 'Mùi': 'Tý', 'Sửu': 'Ngọ', 'Ngọ': 'Sửu', 'Dần': 'Tỵ', 'Tỵ': 'Dần', 'Mão': 'Thìn', 'Thìn': 'Mão', 'Thân': 'Hợi', 'Hợi': 'Thân', 'Dậu': 'Tuất', 'Tuất': 'Dậu' };
  var CAN_HOP = { 'Giáp': 'Kỷ', 'Kỷ': 'Giáp', 'Ất': 'Canh', 'Canh': 'Ất', 'Bính': 'Tân', 'Tân': 'Bính', 'Đinh': 'Nhâm', 'Nhâm': 'Đinh', 'Mậu': 'Quý', 'Quý': 'Mậu' };
  function chiRelation(a, b) {
    if (a === b) return { label: 'Cùng tuổi ' + a, score: 0.5 };
    for (var i = 0; i < TAM_HOP.length; i++) if (TAM_HOP[i].indexOf(a) >= 0 && TAM_HOP[i].indexOf(b) >= 0) return { label: 'Tam hợp', score: 2 };
    if (LUC_HOP[a] === b) return { label: 'Lục hợp', score: 2 };
    if (XUNG[a] === b) return { label: 'Lục xung', score: -2 };
    if (HAI[a] === b) return { label: 'Lục hại', score: -1 };
    return { label: 'Bình hòa', score: 0 };
  }
  function tamTai(yearChi, buildYear) {
    var groups = { 'Thân': 0, 'Tý': 0, 'Thìn': 0, 'Dần': 1, 'Ngọ': 1, 'Tuất': 1, 'Hợi': 2, 'Mão': 2, 'Mùi': 2, 'Tỵ': 3, 'Dậu': 3, 'Sửu': 3 };
    var taiYears = [['Dần', 'Mão', 'Thìn'], ['Tỵ', 'Ngọ', 'Mùi'], ['Hợi', 'Tý', 'Sửu'], ['Thân', 'Dậu', 'Tuất']];
    var bChi = yearInfo(buildYear).chi;
    return taiYears[groups[yearChi]].indexOf(bChi) >= 0;
  }
  function kimLau(age) { var r = age % 9; return [1, 3, 6, 8].indexOf(r) >= 0 ? { bad: true, kind: { 1: 'Kim lâu thân, hại bản thân', 3: 'Kim lâu thê, hại vợ', 6: 'Kim lâu tử, hại con', 8: 'Kim lâu lục súc, hại vật nuôi và làm ăn' }[r] } : { bad: false }; }
  var HOANG_OC = ['Nhất Cát', 'Nhì Nghi', 'Tam Địa Sát', 'Tứ Tấn Tài', 'Ngũ Thọ Tử', 'Lục Hoang Ốc'];
  var HOANG_OC_GOOD = { 'Nhất Cát': true, 'Nhì Nghi': true, 'Tứ Tấn Tài': true };
  function hoangOc(age) { var name = HOANG_OC[(age - 1) % 6]; return { name: name, bad: !HOANG_OC_GOOD[name] }; }
  function hashStr(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
  function yearOptions(from, to, sel) {
    var h = '';
    for (var y = from; y <= to; y++) h += '<option value="' + y + '"' + (y === sel ? ' selected' : '') + '>' + y + '</option>';
    return h;
  }
  function field(label, inner, cls) { return '<div class="ptv-field ' + (cls || '') + '"><label>' + label + '</label>' + inner + '</div>'; }
  function select(id, optionsHtml) { return '<select id="' + id + '">' + optionsHtml + '</select>'; }
  function genderSelect(id) { return select(id, '<option value="Nam">Nam</option><option value="Nữ">Nữ</option>'); }
  function resultBox(container, html) {
    var out = container.querySelector('.ptv-out');
    out.innerHTML = '<div class="ptv-card">' + html + '</div>';
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function dirTable(cung) {
    var rows = starsFor(cung).map(function (s) {
      return '<tr><td><strong>' + s.dir + '</strong></td><td class="' + (s.info.t === 'tốt' ? 'ptv-good' : 'ptv-bad') + '">' + s.star + '</td><td>' + s.info.d + '</td></tr>';
    }).join('');
    return '<div class="ptv-table-wrap"><table class="ptv-table"><tr><th>Hướng</th><th>Sao</th><th>Ý nghĩa</th></tr>' + rows + '</table></div>';
  }
  function goodDirs(cung, stars) {
    return starsFor(cung).filter(function (s) { return stars.indexOf(s.star) >= 0; });
  }
  window.PTVLib = {
    esc: esc, badge: badge, relEl: relEl, yearInfo: yearInfo, cungPhi: cungPhi,
    DIRS: DIRS, CUNG_DIR: CUNG_DIR, DU_NIEN: DU_NIEN, STAR_INFO: STAR_INFO, starsFor: starsFor, coupleStar: coupleStar,
    chiRelation: chiRelation, CAN_HOP: CAN_HOP, tamTai: tamTai, kimLau: kimLau, hoangOc: hoangOc,
    hashStr: hashStr, yearOptions: yearOptions, field: field, select: select, genderSelect: genderSelect,
    resultBox: resultBox, dirTable: dirTable, goodDirs: goodDirs, GENERATES: GENERATES, CONTROLS: CONTROLS
  };
})();
