/* PhongThuy VietAA - Cong cu Dat Ten Con (engine)
 * Phuong phap: tu tru + ngu hanh + ngu cach + 81 hoach + phoi que Dich,
 * dung lai theo khung Dinh Danh Ky Thu, trinh bay minh bach.
 * DATA duoc nap tu bien toan cuc PTV_DATA {nameChars, hoach81, que64}.
 */
(function (global) {
  'use strict';

  var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  var CAN_EL = { 'Giáp': 'Mộc', 'Ất': 'Mộc', 'Bính': 'Hỏa', 'Đinh': 'Hỏa', 'Mậu': 'Thổ', 'Kỷ': 'Thổ', 'Canh': 'Kim', 'Tân': 'Kim', 'Nhâm': 'Thủy', 'Quý': 'Thủy' };
  var CHI_EL = { 'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ', 'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy' };
  // Tang can phu (trung khi + du khi). Tang can chinh khong dem trung vi hanh cua chi da la chinh khi.
  var TANG_PHU = { 'Tý': [], 'Sửu': ['Quý', 'Tân'], 'Dần': ['Bính', 'Mậu'], 'Mão': [], 'Thìn': ['Ất', 'Quý'], 'Tỵ': ['Canh', 'Mậu'], 'Ngọ': ['Kỷ'], 'Mùi': ['Đinh', 'Ất'], 'Thân': ['Nhâm', 'Mậu'], 'Dậu': [], 'Tuất': ['Tân', 'Đinh'], 'Hợi': ['Giáp'] };
  var NAP_AM = [
    ['Hải Trung Kim', 'Kim'], ['Lô Trung Hỏa', 'Hỏa'], ['Đại Lâm Mộc', 'Mộc'], ['Lộ Bàng Thổ', 'Thổ'], ['Kiếm Phong Kim', 'Kim'],
    ['Sơn Đầu Hỏa', 'Hỏa'], ['Giản Hạ Thủy', 'Thủy'], ['Thành Đầu Thổ', 'Thổ'], ['Bạch Lạp Kim', 'Kim'], ['Dương Liễu Mộc', 'Mộc'],
    ['Tuyền Trung Thủy', 'Thủy'], ['Ốc Thượng Thổ', 'Thổ'], ['Tích Lịch Hỏa', 'Hỏa'], ['Tùng Bách Mộc', 'Mộc'], ['Trường Lưu Thủy', 'Thủy'],
    ['Sa Trung Kim', 'Kim'], ['Sơn Hạ Hỏa', 'Hỏa'], ['Bình Địa Mộc', 'Mộc'], ['Bích Thượng Thổ', 'Thổ'], ['Kim Bạc Kim', 'Kim'],
    ['Phú Đăng Hỏa', 'Hỏa'], ['Thiên Hà Thủy', 'Thủy'], ['Đại Trạch Thổ', 'Thổ'], ['Thoa Xuyến Kim', 'Kim'], ['Tang Đố Mộc', 'Mộc'],
    ['Đại Khê Thủy', 'Thủy'], ['Sa Trung Thổ', 'Thổ'], ['Thiên Thượng Hỏa', 'Hỏa'], ['Thạch Lựu Mộc', 'Mộc'], ['Đại Hải Thủy', 'Thủy']
  ];
  var ELEMENTS = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
  var GENERATES = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
  var CONTROLS = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
  var TRIGRAM_BY_NUM = { 1: 'Càn', 2: 'Đoài', 3: 'Ly', 4: 'Chấn', 5: 'Tốn', 6: 'Khảm', 7: 'Cấn', 8: 'Khôn' };
  var HOUR_LABEL = { 'Tý': '23h - 1h', 'Sửu': '1h - 3h', 'Dần': '3h - 5h', 'Mão': '5h - 7h', 'Thìn': '7h - 9h', 'Tỵ': '9h - 11h', 'Ngọ': '11h - 13h', 'Mùi': '13h - 15h', 'Thân': '15h - 17h', 'Dậu': '17h - 19h', 'Tuất': '19h - 21h', 'Hợi': '21h - 23h' };

  /* ---------- Lich am Viet Nam (thuat toan Ho Ngoc Duc) ---------- */
  var PI = Math.PI;
  function jdFromDate(dd, mm, yy) {
    var a = Math.floor((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    var jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    return jd;
  }
  function getNewMoonDay(k, tz) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
    var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M) - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr) - 0.0004 * Math.sin(3 * dr * Mpr) - 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin(dr * (M + Mpr)) - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M)) - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr)) + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    var dt = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Math.floor(Jd1 + C1 - dt + 0.5 + tz / 24);
  }
  function getSunLongitude(jdn, tz) {
    var T = (jdn - 2451545.5 - tz / 24) / 36525, T2 = T * T, dr = PI / 180;
    var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    var L = (L0 + DL) * dr; L = L - PI * 2 * Math.floor(L / (PI * 2));
    return Math.floor(L / PI * 6);
  }
  function getLunarMonth11(yy, tz) {
    var off = jdFromDate(31, 12, yy) - 2415021, k = Math.floor(off / 29.530588853), nm = getNewMoonDay(k, tz);
    var sunLong = getSunLongitude(nm, tz);
    if (sunLong >= 9) nm = getNewMoonDay(k - 1, tz);
    return nm;
  }
  function getLeapMonthOffset(a11, tz) {
    var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5), last = 0, i = 1, arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
    do { last = arc; i++; arc = getSunLongitude(getNewMoonDay(k + i, tz), tz); } while (arc !== last && i < 14);
    return i - 1;
  }
  function convertSolar2Lunar(dd, mm, yy, tz) {
    var dayNumber = jdFromDate(dd, mm, yy), k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    var monthStart = getNewMoonDay(k + 1, tz);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
    var a11 = getLunarMonth11(yy, tz), b11 = a11, lunarYear;
    if (a11 >= monthStart) { lunarYear = yy; a11 = getLunarMonth11(yy - 1, tz); } else { lunarYear = yy + 1; b11 = getLunarMonth11(yy + 1, tz); }
    var lunarDay = dayNumber - monthStart + 1, diff = Math.floor((monthStart - a11) / 29);
    var lunarLeap = 0, lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      var leapMonthDiff = getLeapMonthOffset(a11, tz);
      if (diff >= leapMonthDiff) { lunarMonth = diff + 10; if (diff === leapMonthDiff) lunarLeap = 1; }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
  }

  /* ---------- Can chi / tu tru ---------- */
  function sexagenaryIndex(canIdx, chiIdx) {
    for (var n = 0; n < 60; n++) if (n % 10 === canIdx && n % 12 === chiIdx) return n;
    return 0;
  }
  function pillar(canIdx, chiIdx) {
    return { can: CAN[canIdx], chi: CHI[chiIdx], text: CAN[canIdx] + ' ' + CHI[chiIdx], canEl: CAN_EL[CAN[canIdx]], chiEl: CHI_EL[CHI[chiIdx]] };
  }
  function yearPillar(dd, mm, yy) {
    var y = yy;
    if (mm < 2 || (mm === 2 && dd < 4)) y -= 1; // tru nam tinh theo moc Lap Xuan (xap xi 4/2)
    return { pillar: pillar(((y + 6) % 10 + 10) % 10, ((y + 8) % 12 + 12) % 12), effectiveYear: y };
  }
  var MONTH_SEGMENTS = [ // [thang, ngay bat dau, chi index] tiet khi xap xi
    [1, 6, 1], [2, 4, 2], [3, 5, 3], [4, 5, 4], [5, 6, 5], [6, 6, 6],
    [7, 7, 7], [8, 8, 8], [9, 8, 9], [10, 8, 10], [11, 7, 11], [12, 7, 0]
  ];
  function monthChiIndex(dd, mm) {
    var chi = 0; // truoc Tieu Han (6/1) van la thang Ty cua tiet thang 12
    for (var i = 0; i < MONTH_SEGMENTS.length; i++) {
      var s = MONTH_SEGMENTS[i];
      if (mm > s[0] || (mm === s[0] && dd >= s[1])) chi = s[2];
    }
    return chi;
  }
  function startCanForGroup(canIdx) {
    // Ngu Thu Don / can thang Dan: Giap-Ky -> (thang: Binh, gio: Giap); At-Canh -> (Mau, Binh);
    // Binh-Tan -> (Canh, Mau); Dinh-Nham -> (Nham, Canh); Mau-Quy -> (Giap, Nham)
    var table = { 0: [2, 0], 5: [2, 0], 1: [4, 2], 6: [4, 2], 2: [6, 4], 7: [6, 4], 3: [8, 6], 8: [8, 6], 4: [0, 8], 9: [0, 8] };
    return table[canIdx];
  }
  function monthPillar(dd, mm, yearCanIdx) {
    var chiIdx = monthChiIndex(dd, mm);
    var start = startCanForGroup(yearCanIdx)[0];
    var canIdx = (start + ((chiIdx - 2 + 12) % 12)) % 10;
    return pillar(canIdx, chiIdx);
  }
  function dayPillar(dd, mm, yy) {
    var jd = jdFromDate(dd, mm, yy);
    return pillar(((jd + 9) % 10 + 10) % 10, (jd + 1) % 12);
  }
  function hourPillar(hourChi, dayCanIdx) {
    var chiIdx = CHI.indexOf(hourChi);
    var start = startCanForGroup(dayCanIdx)[1];
    return pillar((start + chiIdx) % 10, chiIdx);
  }
  function napAmOf(p) {
    var idx = sexagenaryIndex(CAN.indexOf(p.can), CHI.indexOf(p.chi));
    var pair = NAP_AM[Math.floor(idx / 2)];
    return { name: pair[0], element: pair[1], full: pair[0] + ' (' + pair[1] + ')' };
  }
  function countElements(pillars) {
    var counts = { 'Mộc': 0, 'Hỏa': 0, 'Thổ': 0, 'Kim': 0, 'Thủy': 0 };
    pillars.forEach(function (p) {
      counts[p.canEl]++; counts[p.chiEl]++;
      (TANG_PHU[p.chi] || []).forEach(function (tc) { counts[CAN_EL[tc]]++; });
    });
    return counts;
  }

  /* ---------- Ngu hanh helpers ---------- */
  function relation(a, b) {
    if (a === b) return 'bình';
    if (GENERATES[a] === b) return 'sinh';
    if (CONTROLS[a] === b) return 'khắc';
    if (GENERATES[b] === a) return 'được sinh';
    return 'bị khắc';
  }
  function elementFromNumber(n) {
    var d = Math.abs(n) % 10;
    if (d === 1 || d === 2) return 'Mộc';
    if (d === 3 || d === 4) return 'Hỏa';
    if (d === 5 || d === 6) return 'Thổ';
    if (d === 7 || d === 8) return 'Kim';
    return 'Thủy';
  }
  function reduce81(n) { return ((n - 1) % 80 + 80) % 80 + 1; }
  function chooseTarget(counts, menhEl) {
    var min = Math.min.apply(null, ELEMENTS.map(function (e) { return counts[e]; }));
    var max = Math.max.apply(null, ELEMENTS.map(function (e) { return counts[e]; }));
    var strongest = ELEMENTS.filter(function (e) { return counts[e] === max; });
    // "Hanh suy" theo mau Ky Thu: cac hanh co so dem duoi trung binh (tong/5), khong chi rieng hanh thap nhat.
    var totalCount = ELEMENTS.reduce(function (a, e) { return a + counts[e]; }, 0);
    var avg = totalCount / 5;
    var candidates = ELEMENTS.filter(function (e) { return counts[e] < avg; });
    if (!candidates.length) candidates = ELEMENTS.filter(function (e) { return counts[e] === min; });
    function score(c) {
      var s = 0;
      if (c === menhEl) s += 2;
      if (GENERATES[c] === menhEl) s += 2;
      if (GENERATES[menhEl] === c) s += 1.5;
      if (CONTROLS[c] === menhEl) s -= 3;
      if (CONTROLS[menhEl] === c) s -= 1;
      strongest.forEach(function (st) {
        if (CONTROLS[c] === st) s += 2;
        if (GENERATES[st] === c) s += 1.5;
        if (GENERATES[c] === st) s -= 1;
      });
      return s;
    }
    var best = candidates[0], bs = score(candidates[0]);
    candidates.forEach(function (c) { var s = score(c); if (s > bs) { bs = s; best = c; } });
    return { target: best, candidates: candidates, weakestCount: min, strongest: strongest, strongestCount: max };
  }

  /* ---------- Ten: tra cuu chu Han ---------- */
  function stripVN(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  }
  function lookupName(data, fullName) {
    var tokens = fullName.trim().replace(/\s+/g, ' ').split(' ');
    var baseIndex = {};
    Object.keys(data).forEach(function (k) {
      var b = stripVN(k);
      if (!baseIndex[b]) baseIndex[b] = [];
      baseIndex[b].push(k);
    });
    return tokens.map(function (tok) {
      var key = tok.toLowerCase();
      if (data[key]) return { token: tok, entry: data[key], match: 'exact' };
      var cands = baseIndex[stripVN(tok)] || [];
      if (cands.length) {
        var chosen = cands[0];
        for (var i = 0; i < cands.length; i++) if (!data[cands[i]].uncertain) { chosen = cands[i]; break; }
        return { token: tok, entry: data[chosen], match: 'base', matchedKey: chosen };
      }
      return { token: tok, entry: null, match: 'missing' };
    });
  }

  /* ---------- Phan tich tong the ---------- */
  function analyze(input, DATA) {
    var dd = input.day, mm = input.month, yy = input.year;
    var lunar = convertSolar2Lunar(dd, mm, yy, 7);
    var yP = yearPillar(dd, mm, yy);
    var mP = monthPillar(dd, mm, CAN.indexOf(yP.pillar.can));
    var dP = dayPillar(dd, mm, yy);
    var hP = hourPillar(input.hourChi, CAN.indexOf(dP.can));
    var pillars = [hP, dP, mP, yP.pillar];
    var counts = countElements(pillars);
    var nap = napAmOf(yP.pillar);
    var tgt = chooseTarget(counts, nap.element);

    var looked = lookupName(DATA.nameChars, input.name);
    var missing = looked.filter(function (x) { return !x.entry; }).map(function (x) { return x.token; });
    var result = {
      input: input,
      lunar: lunar,
      pillars: { hour: hP, day: dP, month: mP, year: yP.pillar },
      napAm: nap, counts: counts, targetInfo: tgt,
      nameParts: looked, missing: missing
    };
    // Doi chieu voi bo me (tuy chon): menh theo nam sinh cua bo/me
    result.parents = [];
    [['Bố', input.fatherYear], ['Mẹ', input.motherYear]].forEach(function (pr) {
      var yr = parseInt(pr[1], 10);
      if (!yr || yr < 1900 || yr > 2100) return;
      var yp = yearPillar(1, 6, yr).pillar; // lay tru nam theo nam duong lich cua bo/me
      var na = napAmOf(yp);
      result.parents.push({ role: pr[0], year: yr, pillar: yp.text, napAm: na, relMenhBe: relation(nap.element, na.element) });
    });
    if (missing.length || looked.length < 2) { result.incomplete = true; return result; }

    var surname = looked[0], given = looked.slice(1);
    var givenStrokes = given.map(function (x) { return x.entry.strokes; });
    var givenTotal = givenStrokes.reduce(function (a, b) { return a + b; }, 0);
    var totalElem = elementFromNumber(givenTotal);

    // Chuoi ngu hanh cac chu trong phan ten
    var chain = [];
    for (var i = 0; i + 1 < given.length; i++) {
      chain.push({ from: given[i].entry.element, to: given[i + 1].entry.element, rel: relation(given[i].entry.element, given[i + 1].entry.element) });
    }
    // Am duong theo chan le so net phan ten
    var duong = given.filter(function (x) { return x.entry.strokes % 2 === 1; }).length;
    var am = given.length - duong;

    // Ngu cach
    var s = surname.entry.strokes;
    var tongAll = s + givenTotal;
    var nguCachRaw = {
      'Thiên cách': s + 1,
      'Nhân cách': s + givenStrokes[0],
      'Địa cách': givenTotal + (given.length === 1 ? 1 : 0),
      'Ngoại cách': tongAll - (s + givenStrokes[0]) + 1,
      'Tổng cách': tongAll
    };
    var nguCach = {};
    Object.keys(nguCachRaw).forEach(function (k) {
      var raw = nguCachRaw[k], red = reduce81(raw), h = DATA.hoach81[String(red)];
      nguCach[k] = { value: raw, reduced: red, element: elementFromNumber(raw), rating: h ? h.rating : '', text: h ? h.text : '' };
    });
    // Tam tai: Thien - Nhan - Dia
    var tamTai = {
      thien: nguCach['Thiên cách'].element, nhan: nguCach['Nhân cách'].element, dia: nguCach['Địa cách'].element,
      relThien: relation(nguCach['Nhân cách'].element, nguCach['Thiên cách'].element),
      relDia: relation(nguCach['Nhân cách'].element, nguCach['Địa cách'].element)
    };
    // Phoi que: thuong quai tu Thien cach, ha quai tu Dia cach (so Tien thien)
    function trigram(n) { var m = n % 8; if (m === 0) m = 8; return TRIGRAM_BY_NUM[m]; }
    var up = trigram(nguCachRaw['Thiên cách']), low = trigram(nguCachRaw['Địa cách']);
    var que = null;
    (DATA.que64 || []).forEach(function (q) { if (q.upper === up && q.lower === low) que = q; });

    // Hoach cua tong net phan ten
    var hoachGiven = DATA.hoach81[String(reduce81(givenTotal))];

    /* Cham diem /10 (nang 0.25) theo 6 khoi */
    var blocks = [];
    // 1. Chuoi hanh (2.0)
    var chainScore;
    if (!chain.length) chainScore = 1.0;
    else {
      var per = 2.0 / chain.length;
      chainScore = chain.reduce(function (acc, c) { return acc + (c.rel === 'sinh' ? per : c.rel === 'bình' ? per * 0.6 : c.rel === 'được sinh' ? per : 0); }, 0);
    }
    blocks.push({ key: 'chain', label: 'Chuỗi ngũ hành các chữ trong tên', max: 2.0, score: chainScore, detail: chain });
    // 2. Am duong (1.5)
    var imb = given.length ? Math.abs(duong - am) / given.length : 1;
    blocks.push({ key: 'yinyang', label: 'Cân bằng âm dương theo số nét', max: 1.5, score: 1.5 * (1 - imb), duong: duong, am: am });
    // 3. Tong net vs hanh muc tieu (2.0)
    var rT = relation(totalElem, tgt.target);
    var targetScore = rT === 'bình' ? 2.0 : rT === 'sinh' ? 1.25 : rT === 'được sinh' ? 1.0 : rT === 'bị khắc' ? 0.5 : 0.25;
    blocks.push({ key: 'target', label: 'Hành của tổng số nét so với hành tứ trụ đang thiếu', max: 2.0, score: targetScore, totalElem: totalElem, target: tgt.target, rel: rT });
    // 4. Tong net vs nien menh (1.5)
    var rM = relation(totalElem, nap.element);
    var menhScore = rM === 'sinh' ? 1.5 : rM === 'bình' ? 1.25 : rM === 'được sinh' ? 1.0 : rM === 'bị khắc' ? 0.5 : 0;
    blocks.push({ key: 'menh', label: 'Hành của tên so với bản mệnh (nạp âm)', max: 1.5, score: menhScore, menhElem: nap.element, rel: rM });
    // 5. Hoach (1.5)
    var hScoreMap = { 'Đại cát': 1.5, 'Cát': 1.25, 'Bình': 0.75, 'Hung': 0.25, 'Đại hung': 0 };
    blocks.push({ key: 'hoach', label: 'Luận hoạch của tổng số nét tên (bảng 81 hoạch)', max: 1.5, score: hoachGiven ? hScoreMap[hoachGiven.rating] : 0.75, hoach: hoachGiven, givenTotal: givenTotal });
    // 6. Que (1.5)
    var qScoreMap = { 'Cát': 1.5, 'Bình': 0.75, 'Hung': 0 };
    blocks.push({ key: 'que', label: 'Phối quẻ Dịch (Thiên cách / Địa cách)', max: 1.5, score: que ? qScoreMap[que.rating] : 0.75, que: que });

    var total = blocks.reduce(function (a, b) { return a + b.score; }, 0);
    total = Math.round(total * 4) / 4;
    var verdict = total >= 8.5 ? 'Rất tốt' : total >= 7 ? 'Tốt' : total >= 5.5 ? 'Khá, dùng được' : total >= 4 ? 'Trung bình, nên cân nhắc thêm' : 'Chưa tốt, nên tham khảo tên khác';

    // Luu y nu gioi voi cac so hoach co dien coi la qua manh cho nu
    var femaleNote = null;
    if (input.gender === 'Nữ') {
      var strongNums = [21, 23, 33, 39];
      var hit = Object.keys(nguCachRaw).filter(function (k) { return strongNums.indexOf(reduce81(nguCachRaw[k])) >= 0; });
      if (hit.length) femaleNote = hit;
    }

    result.givenTotal = givenTotal; result.totalElem = totalElem;
    result.parents.forEach(function (p) { p.relName = relation(totalElem, p.napAm.element); });
    result.chain = chain; result.nguCach = nguCach; result.tamTai = tamTai;
    result.que = que; result.blocks = blocks; result.score = total; result.verdict = verdict;
    result.femaleNote = femaleNote;
    return result;
  }

  /* ---------- Goi y ten hay ---------- */
  var QUE_CACHE = null;
  function queLookup(DATA, up, low) {
    if (!QUE_CACHE) {
      QUE_CACHE = {};
      (DATA.que64 || []).forEach(function (q) { QUE_CACHE[q.upper + '|' + q.lower] = q; });
    }
    return QUE_CACHE[up + '|' + low] || null;
  }
  var SURNAME_KEYS = ['nguyễn', 'trần', 'lê', 'phạm', 'phan', 'đặng', 'bùi', 'đỗ', 'hồ', 'ngô', 'lý', 'đào', 'đoàn', 'trịnh', 'đinh', 'vương', 'trương', 'tạ', 'hàn', 'lưu', 'chu', 'diệp', 'tô', 'đường', 'doãn', 'khương', 'quách', 'tống', 'mã', 'phùng', 'lã', 'võ'];
  function scoreGiven(givenEntries, surnameStrokes, tgtEl, menhEl, DATA) {
    var strokes = givenEntries.map(function (x) { return x.strokes; });
    var total = strokes.reduce(function (a, b) { return a + b; }, 0);
    var totalElem = elementFromNumber(total);
    var score = 0, i;
    // chuoi hanh
    if (givenEntries.length < 2) score += 1.0;
    else {
      var per = 2.0 / (givenEntries.length - 1);
      for (i = 0; i + 1 < givenEntries.length; i++) {
        var r = relation(givenEntries[i].element, givenEntries[i + 1].element);
        score += r === 'sinh' || r === 'được sinh' ? per : r === 'bình' ? per * 0.6 : 0;
      }
    }
    // am duong
    var duong = givenEntries.filter(function (x) { return x.strokes % 2 === 1; }).length;
    score += 1.5 * (1 - Math.abs(duong - (givenEntries.length - duong)) / givenEntries.length);
    // hanh tong net vs muc tieu / menh
    var rT = relation(totalElem, tgtEl);
    score += rT === 'bình' ? 2.0 : rT === 'sinh' ? 1.25 : rT === 'được sinh' ? 1.0 : rT === 'bị khắc' ? 0.5 : 0.25;
    var rM = relation(totalElem, menhEl);
    score += rM === 'sinh' ? 1.5 : rM === 'bình' ? 1.25 : rM === 'được sinh' ? 1.0 : rM === 'bị khắc' ? 0.5 : 0;
    // hoach
    var hMap = { 'Đại cát': 1.5, 'Cát': 1.25, 'Bình': 0.75, 'Hung': 0.25, 'Đại hung': 0 };
    var h = DATA.hoach81[String(reduce81(total))];
    score += h ? hMap[h.rating] : 0.75;
    // que tu Thien cach / Dia cach
    function trigram(n) { var m = n % 8; if (m === 0) m = 8; return TRIGRAM_BY_NUM[m]; }
    var dia = total + (givenEntries.length === 1 ? 1 : 0);
    var que = queLookup(DATA, trigram(surnameStrokes + 1), trigram(dia));
    var qMap = { 'Cát': 1.5, 'Bình': 0.75, 'Hung': 0 };
    score += que ? qMap[que.rating] : 0.75;
    return { score: Math.round(score * 4) / 4, total: total, totalElem: totalElem };
  }
  // Nhom am tiet dat ten pho bien hien nay, dung rieng cho goi y de tranh cac am hiem/la
  var SUGGEST_POOL = ['an', 'anh', 'ánh', 'bảo', 'bình', 'bích', 'châu', 'chi', 'cường', 'diệp', 'dũng', 'duy', 'dương', 'đạt', 'đăng', 'đức', 'gia', 'hà', 'hải', 'hạnh', 'hào', 'hiếu', 'hiền', 'hoa', 'hòa', 'hoàng', 'hồng', 'huy', 'hùng', 'hưng', 'hương', 'khải', 'khánh', 'khang', 'khoa', 'khôi', 'kiên', 'kiệt', 'kỳ', 'lam', 'lâm', 'lan', 'linh', 'loan', 'long', 'lộc', 'mai', 'mạnh', 'minh', 'my', 'mỹ', 'nam', 'ngân', 'ngọc', 'nguyên', 'nhân', 'nhật', 'nhi', 'nhiên', 'như', 'phong', 'phúc', 'phú', 'phương', 'quân', 'quang', 'quốc', 'quỳnh', 'sơn', 'tài', 'tâm', 'tân', 'thanh', 'thành', 'thắng', 'thảo', 'thịnh', 'thơ', 'thu', 'thủy', 'thư', 'tiến', 'tiên', 'trang', 'trí', 'trọng', 'trung', 'trúc', 'trường', 'tú', 'tuấn', 'tùng', 'tường', 'tuyết', 'uyên', 'vân', 'văn', 'việt', 'vinh', 'vĩ', 'vũ', 'vy', 'xuân', 'yến', 'diệu', 'hân', 'nhung', 'oanh', 'phượng', 'quyên', 'sen', 'trâm', 'trinh'];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function suggestNames(input, DATA, limit) {
    limit = limit || 8;
    var tokens = input.name.trim().replace(/\s+/g, ' ').split(' ');
    if (tokens.length < 1) return [];
    var surnameKey = tokens[0].toLowerCase();
    var surname = DATA.nameChars[surnameKey];
    if (!surname) return [];
    // Lay ho so menh tu phan tich hien tai (khong can ten hop le)
    var prof = analyze({ name: tokens[0] + ' X', gender: input.gender, hourChi: input.hourChi, day: input.day, month: input.month, year: input.year }, DATA);
    var tgtEl = prof.targetInfo.target, menhEl = prof.napAm.element;
    var pool = SUGGEST_POOL.filter(function (k) { return !!DATA.nameChars[k] && k !== surnameKey; });
    if (pool.length < 40) {
      pool = Object.keys(DATA.nameChars).filter(function (k) {
        return SURNAME_KEYS.indexOf(k) < 0 && k !== surnameKey;
      });
    }
    var out = [], seenGiven = {}, seenFirst = {};
    function consider(keys) {
      var entries = keys.map(function (k) { return DATA.nameChars[k]; });
      var total = entries.reduce(function (a, e) { return a + e.strokes; }, 0);
      var h = DATA.hoach81[String(reduce81(total))];
      if (!h || (h.rating !== 'Cát' && h.rating !== 'Đại cát')) return;
      if (elementFromNumber(total) !== tgtEl && relation(elementFromNumber(total), tgtEl) === 'khắc') return;
      var sc = scoreGiven(entries, surname.strokes, tgtEl, menhEl, DATA);
      if (sc.score < 7) return;
      out.push({ name: cap(surnameKey) + ' ' + keys.map(cap).join(' '), score: sc.score, givenKey: keys[keys.length - 1], firstKey: keys[0], totalElem: sc.totalElem });
    }
    pool.forEach(function (a) { pool.forEach(function (b) { if (a !== b) consider([a, b]); }); });
    out.sort(function (x, y) { return y.score - x.score; });
    var picked = [];
    for (var i = 0; i < out.length && picked.length < limit; i++) {
      var g = out[i].givenKey, f = out[i].firstKey;
      if ((seenGiven[g] || 0) >= 2 || (seenFirst[f] || 0) >= 2) continue;
      seenGiven[g] = (seenGiven[g] || 0) + 1;
      seenFirst[f] = (seenFirst[f] || 0) + 1;
      picked.push(out[i]);
    }
    return picked;
  }

  global.PTVEngine = {
    analyze: analyze, suggestNames: suggestNames, scoreGiven: scoreGiven,
    convertSolar2Lunar: convertSolar2Lunar, jdFromDate: jdFromDate,
    yearPillar: yearPillar, monthPillar: monthPillar, dayPillar: dayPillar, hourPillar: hourPillar,
    countElements: countElements, napAmOf: napAmOf, CAN: CAN, CHI: CHI, HOUR_LABEL: HOUR_LABEL
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = global.PTVEngine;
})(typeof window !== 'undefined' ? window : globalThis);
