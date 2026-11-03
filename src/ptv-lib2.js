/* PhongThuy VietAA - engine chon ngay tot (v1.4) */
(function () {
  'use strict';
  var E = window.PTVEngine, L = window.PTVLib;
  var CHI = E.CHI, CAN = E.CAN;
  function dayInfo(date) {
    var d = date.getDate(), m = date.getMonth() + 1, y = date.getFullYear();
    var lu = E.convertSolar2Lunar(d, m, y, 7);
    var dp = E.dayPillar(d, m, y);
    return { solar: { d: d, m: m, y: y }, lunar: { d: lu.day, m: lu.month, y: lu.year, leap: lu.leap }, day: dp, jd: E.jdFromDate(d, m, y) };
  }
  function fmtSolar(info) { return info.solar.d + '/' + info.solar.m + '/' + info.solar.y; }
  function fmtLunar(info) { return info.lunar.d + '/' + info.lunar.m + (info.lunar.leap ? ' nhuận' : '') + ' âm lịch'; }
  var TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Thâu', 'Khai'];
  function trucOf(info) {
    var monthChiIdx = (info.lunar.m + 1) % 12;
    var dayChiIdx = CHI.indexOf(info.day.chi);
    return TRUC[(dayChiIdx - monthChiIdx + 24) % 12];
  }
  var SAT = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Thiên Đức', 'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trần'];
  var HOANG = { 'Thanh Long': 1, 'Minh Đường': 1, 'Kim Quỹ': 1, 'Thiên Đức': 1, 'Ngọc Đường': 1, 'Tư Mệnh': 1 };
  function satOf(info) {
    var monthChiIdx = (info.lunar.m + 1) % 12;
    var start = (monthChiIdx + 4) % 12;
    var dayChiIdx = CHI.indexOf(info.day.chi);
    return SAT[(dayChiIdx - start + 24) % 12];
  }
  var GIO_HD = {
    'Tý': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'], 'Ngọ': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu'],
    'Sửu': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'], 'Mùi': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Tuất', 'Hợi'],
    'Dần': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'], 'Thân': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
    'Mão': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'], 'Dậu': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
    'Thìn': ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Tuất'], 'Tuất': ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Tuất'],
    'Tỵ': ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi'], 'Hợi': ['Sửu', 'Thìn', 'Ngọ', 'Mùi', 'Tuất', 'Hợi']
  };
  var NGUYET_KY = [5, 14, 23], TAM_NUONG = [3, 7, 13, 18, 22, 27];
  var PURPOSE_TRUC = {
    'mua-xe': { good: ['Thành', 'Mãn', 'Khai', 'Thu'], bad: ['Phá', 'Nguy', 'Chấp'] },
    'mua-nha': { good: ['Thành', 'Thu', 'Khai', 'Mãn', 'Định'], bad: ['Phá', 'Nguy'] },
    'dong-tho': { good: ['Thành', 'Khai', 'Định', 'Mãn'], bad: ['Phá', 'Nguy', 'Thâu'] },
    'nhap-trach': { good: ['Thành', 'Khai', 'Mãn', 'Định'], bad: ['Phá', 'Nguy', 'Thâu'] },
    'mo-hang': { good: ['Khai', 'Thành', 'Mãn'], bad: ['Phá', 'Nguy', 'Thâu', 'Chấp'] },
    'cuoi-hoi': { good: ['Mãn', 'Định', 'Thành', 'Khai'], bad: ['Phá', 'Nguy', 'Chấp'] },
    'xuat-hanh': { good: ['Thành', 'Khai', 'Mãn', 'Định'], bad: ['Phá', 'Nguy', 'Thâu'] },
    'tong-quat': { good: ['Thành', 'Mãn', 'Khai', 'Định'], bad: ['Phá', 'Nguy'] }
  };
  function scoreDay(info, opts) {
    var purpose = (opts && opts.purpose) || 'tong-quat';
    var pt = PURPOSE_TRUC[purpose] || PURPOSE_TRUC['tong-quat'];
    var sat = satOf(info), hoang = !!HOANG[sat], truc = trucOf(info);
    var score = 5, notes = [];
    if (hoang) { score += 1.5; notes.push('Ngày hoàng đạo (' + sat + ')'); } else { score -= 1; notes.push('Ngày hắc đạo (' + sat + ')'); }
    if (pt.good.indexOf(truc) >= 0) { score += 1; notes.push('Trực ' + truc + ' hợp việc này'); }
    else if (pt.bad.indexOf(truc) >= 0) { score -= 1.2; notes.push('Trực ' + truc + ' không hợp việc này'); }
    else notes.push('Trực ' + truc);
    if (NGUYET_KY.indexOf(info.lunar.d) >= 0) { score -= 1.5; notes.push('Phạm ngày Nguyệt kỵ'); }
    if (TAM_NUONG.indexOf(info.lunar.d) >= 0) { score -= 1; notes.push('Phạm ngày Tam nương'); }
    if (opts && opts.birthChi) {
      var rel = L.chiRelation(opts.birthChi, info.day.chi);
      if (rel.score >= 2) { score += 1; notes.push('Ngày ' + rel.label + ' với tuổi của bạn'); }
      else if (rel.score <= -2) { score -= 2; notes.push('Ngày xung tuổi của bạn (lục xung)'); }
      else if (rel.score === -1) { score -= 0.8; notes.push('Ngày lục hại với tuổi của bạn'); }
    }
    if (opts && opts.birthChi2) {
      var rel2 = L.chiRelation(opts.birthChi2, info.day.chi);
      if (rel2.score <= -2) { score -= 2; notes.push('Ngày xung tuổi người thứ hai'); }
      else if (rel2.score >= 2) { score += 0.7; notes.push('Ngày hợp tuổi người thứ hai'); }
    }
    score = Math.max(0, Math.min(10, Math.round(score * 2) / 2));
    return { score: score, hoangDao: hoang, sat: sat, truc: truc, notes: notes };
  }
  function monthDays(year, month) {
    var out = [], d = new Date(year, month - 1, 1);
    while (d.getMonth() === month - 1) { out.push(dayInfo(d)); d.setDate(d.getDate() + 1); }
    return out;
  }
  function lunar2solar(ld, lm, ly, leap) {
    var guess = new Date(ly, 0, 15);
    for (var i = 0; i < 430; i++) {
      var lu = E.convertSolar2Lunar(guess.getDate(), guess.getMonth() + 1, guess.getFullYear(), 7);
      if (lu.day === ld && lu.month === lm && lu.year === ly && (!!lu.leap === !!leap)) return new Date(guess.getFullYear(), guess.getMonth(), guess.getDate());
      guess.setDate(guess.getDate() + 1);
    }
    return null;
  }
  var QUY_NHAN = { 'Giáp': ['Sửu', 'Mùi'], 'Mậu': ['Sửu', 'Mùi'], 'Canh': ['Sửu', 'Mùi'], 'Ất': ['Tý', 'Thân'], 'Kỷ': ['Tý', 'Thân'], 'Bính': ['Hợi', 'Dậu'], 'Đinh': ['Hợi', 'Dậu'], 'Nhâm': ['Mão', 'Tỵ'], 'Quý': ['Mão', 'Tỵ'], 'Tân': ['Ngọ', 'Dần'] };
  var CHI_DIR = { 'Tý': 'Bắc', 'Sửu': 'Đông Bắc', 'Dần': 'Đông Bắc', 'Mão': 'Đông', 'Thìn': 'Đông Nam', 'Tỵ': 'Đông Nam', 'Ngọ': 'Nam', 'Mùi': 'Tây Nam', 'Thân': 'Tây Nam', 'Dậu': 'Tây', 'Tuất': 'Tây Bắc', 'Hợi': 'Tây Bắc' };
  window.PTVDay = { dayInfo: dayInfo, fmtSolar: fmtSolar, fmtLunar: fmtLunar, trucOf: trucOf, satOf: satOf, GIO_HD: GIO_HD, scoreDay: scoreDay, monthDays: monthDays, lunar2solar: lunar2solar, QUY_NHAN: QUY_NHAN, CHI_DIR: CHI_DIR, PURPOSE_TRUC: PURPOSE_TRUC };
})();
