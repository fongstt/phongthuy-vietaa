# Phong Thủy VietAA — bộ 59 ứng dụng phong thủy miễn phí

Mã nguồn của website https://phongthuy.vietaa.com : một plugin WordPress tự viết
("PhongThuy VietAA Tools") chứa toàn bộ 59 ứng dụng phong thủy miễn phí của site
gốc (theo bản lưu Wayback 2025-08-08): đặt tên con, bói Kiều, xem ngày tốt,
bát trạch, gieo quẻ, thần số học...

## Cấu trúc

- `plugin/phongthuy-tools/` — plugin WordPress hoàn chỉnh, đóng gói zip để cài
  trực tiếp: PHP (shortcode, đồng bộ nội dung Page khi kích hoạt), `assets/`
  (JS/CSS đã gộp bundle), `content/` (HTML nội dung từng trang), `data/`.
- `src/` — nguồn build chưa gộp: các file `ptv-*.js` (engine + từng đợt tool),
  `ptv-style.css`, `page-*.html`, `content-*-sections.html`, script sinh trang.
- `data/` — dữ liệu gốc dạng JSON: 81 hoạch, từ điển chữ đặt tên, 60 cặp câu
  Kiều, từ điển giấc mơ, nốt ruồi...
- `docs/` — tài liệu thiết kế và danh sách 59 ứng dụng gốc.

## Cách các bundle JS được gộp

- Trang Đặt Tên Con: `ptv-dat-ten.js` = data head + `ptv-engine.js` + `ptv-ui.js` + `ptv-dat-ten-v2.js`.
- Trang Bói Kiều: `ptv-boi-kieu.js` = kieu data head + `ptv-kieu-v2.js`.
- 57 công cụ chung: `ptv-tools.js` = tools data head + engine + `ptv-lib.js` +
  `ptv-lib2.js` + `ptv-tools-w1..w5.js` (các file gắn sau ghi đè renderer của
  slug tương ứng qua `Object.assign` lên `window.PTVTools`).
- CSS toàn site: `assets/ptv-custom.css` (nguồn: `src/ptv-style.css`).

## Triển khai

1. Sửa nguồn trong `src/`, gộp lại bundle tương ứng, copy vào `plugin/phongthuy-tools/`.
2. Tăng version trong `phongthuy-tools.php`, nén thư mục plugin thành zip.
3. wp-admin > Plugins > Add New > Upload Plugin (Replace), sau đó Deactivate
   rồi Activate lại: hook kích hoạt sẽ đồng bộ nội dung mọi Page từ `content/`.

## Phạm vi trung thực

- Lá số tử vi là bản cơ bản (an cung Mệnh/Thân + 12 cung + cục, chưa an 14 chính tinh).
- Gieo quẻ Quan Thánh dùng thơ theo đẳng quẻ, chưa phải nguyên văn 100 bài ở đền.
- Công cụ Đặt Tên Con trình bày minh bạch phương pháp tính (ngũ cách, 81 hoạch,
  ngũ hành, quẻ dịch, tứ trụ), không nhận là thuật toán của site gốc đã mất.
