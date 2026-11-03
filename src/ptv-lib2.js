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
    // Thanh Long khoi tai chi tuy thang am: thang 1,7 o Ty; 2,8 o Dan; 3,9 o Thin; 4,10 o Ngo; 5,11 o Than; 6,12 o Tuat.
    // Kiem chung: 3/11/2026 (25/9 am, ngay Ty) = Minh Duong hoang dao; 24/12/2026 (16/11 am, ngay Than) = Thanh Long.
    var start = ((info.lunar.m - 1) % 6) * 2;
    var dayChiIdx = CHI.indexOf(info.day.chi);
    return SAT[(dayChiIdx - start + 24) % 12];
  }
  var TU28 = [
    ['Giác', 'Giác Mộc Giao', 1, 'Tốt cho công danh, thi cử, cưới hỏi; kỵ xây cất mộ phần'],
    ['Cang', 'Cang Kim Long', -1, 'Tránh việc đại sự, nhất là cưới hỏi; cẩn trọng tiền bạc'],
    ['Đê', 'Đê Thổ Lạc', -1, 'Việc dễ đổ vỡ, dở dang; kỵ thi cử, nhận chức, kinh doanh lớn'],
    ['Phòng', 'Phòng Nhật Thố', 1, 'Trăm sự đều lợi, hợp động thổ, nhập trạch, cưới hỏi'],
    ['Tâm', 'Tâm Nguyệt Hồ', -1, 'Chủ thất thoát, thị phi, kiện tụng; không nên làm việc lớn'],
    ['Vĩ', 'Vĩ Hỏa Hổ', 1, 'Cưới hỏi, xây nhà, lập khế ước giao dịch đều thuận'],
    ['Cơ', 'Cơ Thủy Báo', 1, 'Chủ tài lộc, danh lợi; hợp làm nhà, khai trương'],
    ['Đẩu', 'Đẩu Mộc Giải', 1, 'May mắn, vinh quang; hợp hôn sự, chuyển chỗ ở, trồng trọt, chăn nuôi'],
    ['Ngưu', 'Ngưu Kim Ngưu', -1, 'Hao tổn tài sản và sức khỏe; kỵ cưới hỏi, khai trương, động thổ'],
    ['Nữ', 'Nữ Thổ Bức', -1, 'Bại tinh, đại kỵ xuất hành, buôn bán, khai trương'],
    ['Hư', 'Hư Nhật Thử', -1, 'Chủ phiền toái, lo âu; tránh việc quan trọng'],
    ['Nguy', 'Nguy Nguyệt Yên', -1, 'Bất lợi cho hôn nhân, gia đạo; dễ sinh mâu thuẫn'],
    ['Thất', 'Thất Hỏa Trư', 1, 'Hợp cưới hỏi, xây dựng, khai trương, đầu tư'],
    ['Bích', 'Bích Thủy Du', 1, 'Chủ tài lộc, công thành danh toại; hợp hôn sự, động thổ'],
    ['Khuê', 'Khuê Mộc Lang', -1, 'Nhiều rắc rối, rủi ro; tránh công to việc lớn'],
    ['Lâu', 'Lâu Kim Cẩu', 1, 'Hưng thịnh, hồng phát; hợp hợp tác làm ăn, khai trương, xây dựng'],
    ['Vị', 'Vị Thổ Trĩ', 1, 'Hưng vượng, sung túc, có quý nhân phù trợ; trăm sự cát lợi'],
    ['Mão', 'Mão Nhật Kê', -1, 'Bất lợi trồng trọt, chăn nuôi; kỵ đóng giường ghế, khai thông hào rãnh'],
    ['Tất', 'Tất Nguyệt Ô', 1, 'Hợp các việc đại sự như cưới hỏi, xây nhà, nhận chức'],
    ['Chủy', 'Chủy Hỏa Hầu', -1, 'Trăm việc trắc trở; kỵ nhất là chôn cất và tạo tác'],
    ['Sâm', 'Sâm Thủy Viên', 1, 'Tài vận hanh thông; khai trương, buôn bán thuận lợi'],
    ['Tỉnh', 'Tỉnh Mộc Hãn', 1, 'Bình an, may mắn, công thành danh toại'],
    ['Quỷ', 'Quỷ Kim Dương', -1, 'Sát tinh, đại kỵ cưới hỏi, nhập mộ, cải táng'],
    ['Liễu', 'Liễu Thổ Chương', -1, 'Chủ phá tán, chia ly; kỵ khai trương, kết hôn, hợp tác'],
    ['Tinh', 'Tinh Nhật Mã', -1, 'Không thích hợp cho động thổ, xây nhà'],
    ['Trương', 'Trương Nguyệt Lộc', 0, 'Dị bản giữa các lịch thư: Ngọc Hạp chánh tông xếp cát tú, hợp khởi công, động thổ, hôn nhân; vài lịch thư khác xếp hung tú'],
    ['Dực', 'Dực Hỏa Xà', 1, 'Vượng tài lộc, con cháu hưởng phúc; hợp động thổ, xây dựng, hôn thú'],
    ['Chẩn', 'Chẩn Thủy Dẫn', 1, 'Hợp xuất hành đi xa, làm ăn kinh doanh, khai trương']
  ];
  function tu28Of(info) {
    // Neo chu ky: 3/11/2026 = sao Chuy (Santa Lich va BNews cung ghi), 26/10/1998 = sao Tam.
    var idx = ((info.jd + 11) % 28 + 28) % 28;
    var t = TU28[idx];
    return { name: t[0], full: t[1], good: t[2], note: t[3] };
  }
  var THIEN_DUC = [null, 'Đinh', 'Thân', 'Nhâm', 'Tân', 'Hợi', 'Giáp', 'Quý', 'Dần', 'Bính', 'Ất', 'Tỵ', 'Canh'];
  var NGUYET_DUC = { 'Dần': 'Bính', 'Ngọ': 'Bính', 'Tuất': 'Bính', 'Thân': 'Nhâm', 'Tý': 'Nhâm', 'Thìn': 'Nhâm', 'Hợi': 'Giáp', 'Mão': 'Giáp', 'Mùi': 'Giáp', 'Tỵ': 'Canh', 'Dậu': 'Canh', 'Sửu': 'Canh' };
  function ducOf(info) {
    var out = [];
    var td = THIEN_DUC[info.lunar.m];
    if (td && (info.day.can === td || info.day.chi === td)) out.push('Thiên Đức');
    var monthChi = CHI[(info.lunar.m + 1) % 12];
    if (NGUYET_DUC[monthChi] && info.day.can === NGUYET_DUC[monthChi]) out.push('Nguyệt Đức');
    return out;
  }
  var LUC_HOP_PAIR = { 'Tý': 'Sửu', 'Sửu': 'Tý', 'Dần': 'Hợi', 'Hợi': 'Dần', 'Mão': 'Tuất', 'Tuất': 'Mão', 'Thìn': 'Dậu', 'Dậu': 'Thìn', 'Tỵ': 'Thân', 'Thân': 'Tỵ', 'Ngọ': 'Mùi', 'Mùi': 'Ngọ' };
  var TAM_HOP_GROUP = { 'Thân': 'Thủy cục', 'Tý': 'Thủy cục', 'Thìn': 'Thủy cục', 'Dần': 'Hỏa cục', 'Ngọ': 'Hỏa cục', 'Tuất': 'Hỏa cục', 'Hợi': 'Mộc cục', 'Mão': 'Mộc cục', 'Mùi': 'Mộc cục', 'Tỵ': 'Kim cục', 'Dậu': 'Kim cục', 'Sửu': 'Kim cục' };
  function hopMonthOf(info) {
    var monthChi = CHI[(info.lunar.m + 1) % 12];
    if (LUC_HOP_PAIR[info.day.chi] === monthChi) return 'Ngày lục hợp với tháng ' + monthChi;
    if (TAM_HOP_GROUP[info.day.chi] && TAM_HOP_GROUP[info.day.chi] === TAM_HOP_GROUP[monthChi]) return 'Ngày tam hợp với tháng ' + monthChi + ' (' + TAM_HOP_GROUP[monthChi] + ')';
    return '';
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
  var TAI_THAN = { 'Giáp': 'Đông Nam', 'Ất': 'Đông Nam', 'Bính': 'Chính Đông', 'Đinh': 'Chính Đông', 'Mậu': 'Chính Bắc', 'Kỷ': 'Chính Nam', 'Canh': 'Tây Nam', 'Tân': 'Tây Nam', 'Nhâm': 'Chính Tây', 'Quý': 'Tây Bắc' };
  var HY_THAN = { 'Giáp': 'Đông Bắc', 'Kỷ': 'Đông Bắc', 'Ất': 'Tây Bắc', 'Canh': 'Tây Bắc', 'Bính': 'Tây Nam', 'Tân': 'Tây Nam', 'Đinh': 'Chính Nam', 'Nhâm': 'Chính Nam', 'Mậu': 'Đông Nam', 'Quý': 'Đông Nam' };
  var LTP_NAMES = ['Tuyệt Lộ', 'Đại An', 'Tốc Hỷ', 'Lưu Niên', 'Xích Khẩu', 'Tiểu Cát'];
  var LTP_GOOD = { 'Đại An': 1, 'Tốc Hỷ': 1, 'Tiểu Cát': 1 };
  var LTP_TEXT = { 'Đại An': 'Mọi việc hanh thông, nhà cửa yên lành, người xuất hành bình an, cầu tài nên đi hướng Tây hoặc Nam.', 'Tốc Hỷ': 'Tin vui sắp tới, đi việc quan và gặp gỡ đều may mắn, cầu tài nên đi hướng Nam, người đi có tin tốt về.', 'Tiểu Cát': 'May mắn chắc chắn, buôn bán có lời, mọi việc hòa hợp, có bệnh cầu chữa sẽ khỏi, người nhà mạnh khỏe.', 'Lưu Niên': 'Việc khó thành nhanh, cầu tài mờ mịt, kiện cáo nên hoãn, người đi lâu có tin về, nên làm chậm mà chắc.', 'Xích Khẩu': 'Dễ sinh cãi cọ và thị phi, nên hoãn chuyến đi nếu được, giữ lời ăn tiếng nói, đề phòng điều tiếng.', 'Tuyệt Lộ': 'Cầu tài dễ trái ý, ra đi dễ gặp trở ngại, tránh khởi sự việc lớn trong khắc này.' };
  var CHI_KHAC = { 'Tý': 1, 'Sửu': 2, 'Dần': 3, 'Mão': 4, 'Thìn': 5, 'Tỵ': 6, 'Ngọ': 1, 'Mùi': 2, 'Thân': 3, 'Dậu': 4, 'Tuất': 5, 'Hợi': 6 };
  function ltpOf(lunarDay, lunarMonth, hourChi) {
    var r = ((lunarDay + lunarMonth + (CHI_KHAC[hourChi] || 1) - 2) % 6 + 6) % 6;
    return LTP_NAMES[r];
  }
  window.PTVDay = { dayInfo: dayInfo, fmtSolar: fmtSolar, fmtLunar: fmtLunar, trucOf: trucOf, satOf: satOf, GIO_HD: GIO_HD, scoreDay: scoreDay, monthDays: monthDays, lunar2solar: lunar2solar, QUY_NHAN: QUY_NHAN, CHI_DIR: CHI_DIR, PURPOSE_TRUC: PURPOSE_TRUC, TAI_THAN: TAI_THAN, HY_THAN: HY_THAN, ltpOf: ltpOf, LTP_TEXT: LTP_TEXT, LTP_GOOD: LTP_GOOD, tu28Of: tu28Of, ducOf: ducOf, hopMonthOf: hopMonthOf, TU28: TU28 };
})();
