# Nghiên cứu: Công cụ "Đặt tên con" gốc của phongthuy.vietaa.com tính kết quả thế nào?

Ngày nghiên cứu: 2026-10-31. Phạm vi: web công khai, không đăng nhập, không dùng live browser.
Quy ước nhãn: **[XÁC NHẬN]** = thấy trực tiếp trong nguồn; **[SUY LUẬN]** = kết luận suy ra từ nhiều nguồn; **[CHƯA RÕ]** = không tìm được bằng chứng.

---

## Tóm tắt 1 dòng

Công cụ miễn phí gốc không còn truy cập được và không có bản sao nguyên vẹn nào được tìm thấy, nhưng gần như chắc chắn nó chạy trên cùng một "trường phái/engine" mà VietAA dùng cho dịch vụ đặt tên trả phí: phần mềm **Định Danh Kỳ Thư** — bằng chứng cứng là kết quả dịch vụ VietAA được host tại `manager.vietaa.com/kythu/html/916.html` ("kythu" = Kỳ Thư). Thuật toán Kỳ Thư đã khôi phục được khá đầy đủ từ một bản kết quả mẫu gốc của chính phần mềm này (Định Danh Kỳ Thư 2.0) còn lưu trên web.

---

## (a) Sự kiện đã xác nhận về công cụ gốc và hệ sinh thái VietAA

1. **Trang gốc hiện đã chết.** `https://phongthuy.vietaa.com/dat-ten-con` trả 404 (site đã rebuild bằng WordPress). Bản Wayback cụ thể (capture 2025-08-08) không fetch được trong môi trường nghiên cứu này (Wayback trả 403 cho cả trang lẫn CDX API; domain `manager.vietaa.com` không còn phân giải). Hệ quả: **không lấy được HTML source của form** — action, method, tên field, file JS đều **[CHƯA RÕ]**.

2. **Mọi ứng dụng VietAA dùng chung một khối nhập liệu "người"**: tên đối tượng + Giới tính + Giờ sinh + Ngày + Tháng + Năm sinh. Thấy trên trang Sim phong thủy (cùng hệ 59 ứng dụng): "Số sim cần xem / Giới tính, Giờ sinh, Ngày sinh, Tháng sinh, Năm sinh" — khớp form Đặt tên con. **[XÁC NHẬN]** qua snippet index của Google:
   - https://phongthuy.vietaa.com/sim-phong-thuy
   - https://phongthuy.vietaa.com/luan-con-so-trong-mo

3. **Có người dùng thật đã dùng cả bản miễn phí lẫn bản trả phí (Otofun, 13/05/2016) [XÁC NHẬN]** — nguồn: https://www.otofun.net/threads/chu-de-muon-thua-dat-ten-cho-con.1037985/
   - Tra miễn phí tại phongthuy.vietaa.com/dat-ten-con (và tại tracuu.tuvisomenh.com/tool/dattencon) thì tên "Hà Đức Phúc" và "Hà Đức Tùng" đều được **điểm cao (>8 điểm)**.
   - Thuê dịch vụ trả phí của chính VietAA (hơn 1 triệu đồng, đặt qua chính trang đó) thì 2 tên trên chỉ được **3/10 điểm**; chuyên gia gợi ý: Hà Lâm Khôi 8/10, Hà Kiên Bình 8/10, Hà Huy Công **8.25/10**, Hà Khôi Quý 8/10, Hà Khang Vinh 8/10.
   - Link diễn giải trả phí mà người dùng dẫn: `http://manager.vietaa.com/kythu/html/916.html` → kết quả VietAA do hệ thống **"kythu"** sinh ra.
   - Kết luận quan trọng: **bản miễn phí và bản trả phí chấm khác nhau rất xa cho cùng một tên** → bản miễn phí là bản rút gọn/đơn giản hoá, không phải bản phân tích chuyên gia đầy đủ.

4. **VietAA tự mô tả phương pháp của mình (trang dịch vụ chính thức, vietaa.com) [XÁC NHẬN]** — http://vietaa.com/dich-vu/dat-ten-cho-con
   - Video "CƠ SỞ ĐỂ ĐẶT TÊN" ghi rõ các cơ sở: **Ngũ cách, Bát thập nhất hoạch (81 số), Ngũ hành, Quẻ dịch** — "Tất cả đều xuất phát từ Kinh Dịch".
   - "Phân tích 81 bộ nét: Từ số nét của từng từ, chuyên gia sẽ tính theo tổ hợp Ngũ cách gồm Thiên cách, Địa cách, Nhân cách, Tổng cách, Ngoại cách, tổng nét Ngũ cách có thể lên đến 81 bộ nét cát hung khác nhau."
   - "Tìm tên từ 2700 bộ chữ Hán" — cơ sở dữ liệu >2.700 chữ Hán để tra cứu.
   - Câu marketing đáng chú ý: VietAA chê "các trang web xem tên miễn phí thường sử dụng lập trình tự động một cách sơ lược và đơn giản, dựa trên bảng chữ cái La tinh" và khẳng định dịch vụ của họ "lấy chữ Hán Việt làm nền tảng, phân tích số nét và ngũ hành theo đúng các bộ nét chuẩn trong chữ Hán. Kết hợp với Ngũ cách và phối quẻ dịch". (Đây là lời quảng cáo cho bản trả phí; nó cũng gián tiếp thừa nhận bản miễn phí tự động thì "sơ lược" hơn.)
   - Thông tin dịch vụ yêu cầu cung cấp: giới tính, giờ sinh, ngày/tháng/năm sinh **dương lịch** (họ tự quy đổi âm lịch), họ của bé, họ tên + ngày sinh của bố mẹ và anh chị em ruột, tên cần tránh (phạm huý), số chữ của tên (2/3/4), tên cần kiểm tra, tỉnh thành. Lưu ý: form miễn phí trên web **không** có mục bố mẹ — đó là khác biệt nữa giữa 2 bản.

5. **Định Danh Kỳ Thư là phần mềm/app có thật, cùng hệ phương pháp [XÁC NHẬN]**:
   - App iOS "Định Danh Kỳ Thư" (com.afoli.dinhdanhkythu), mô tả của chính nhà phát triển: phân tích tên dựa trên "ngũ hành tương sinh tương khắc, số nét của từng chữ trong tên (theo tiếng Hán phồn thể), hành của tên phải bổ sung, cân bằng cho tứ trụ mệnh, và khi phối quẻ của tên trong Kinh dịch cũng cần tạo được các quẻ Cát"; cơ sở là "Âm dương, Ngũ hành, Bát quái" của Kinh Dịch; dùng cho cả đặt tên bé và đặt tên doanh nghiệp. Nguồn: https://www.pgyer.com/ipa/de/ipa/com.afoli.dinhdanhkythu
   - Nhiều bài giới thiệu app (Huggies, Viettel Store, Pos365, MyTour) đều liệt kê Định Danh Kỳ Thư là một trong các phần mềm đặt tên phổ biến tại VN, "luận giải theo tứ trụ".

6. **Các bài viết SEO đời mới về "chấm điểm tên con theo phong thủy Vietaa" (daquyanhvu.com, dattenhay.com) tự thừa nhận là giả định.** dattenhay.com viết thẳng: "Giả sử, 'Công cụ Chấm Điểm Tên Con Vietaa'..." và "công cụ Vietaa (giả định) sẽ phân tích...". Các bài này mô tả quy trình chung chung (bản mệnh theo năm sinh → ngũ hành tên → ngũ cách → âm dương → báo cáo điểm) nhưng **không phải nguồn sơ cấp**, không nên dùng làm căn cứ thuật toán. Nguồn: https://dattenhay.com/cham-diem-ten-con-theo-phong-thuy-vietaa-co-hieu-qua-khong/ và https://daquyanhvu.com (bài cùng chủ đề).

---

## (b) Output của các bản sao / cùng engine còn chạy được

### B1. [Quan trọng nhất] Bản kết quả mẫu GỐC của Định Danh Kỳ Thư 2.0

Nguồn: http://xspace.talaweb.com/quangphu80/home/Dinhdanhkythu2.pdf — đây là file kết quả mẫu thật của phần mềm (module đặt tên doanh nghiệp, dùng chung engine phân tích tên với module đặt tên cho bé). Thân chủ mẫu: nam, sinh 19:30 ngày 24/10/1982.

Cấu trúc output, theo đúng thứ tự:

1. **Thân chủ**: giới tính; **Niên mệnh: Đại Hải Thủy** (nạp âm của năm sinh Nhâm Tuất); thời gian sinh dương lịch + quy đổi âm lịch (8/9 Nhâm Tuất).
2. **Chuyển sang hệ can chi (tứ trụ)**: Giờ Bính Tuất, Ngày Canh Thìn, Tháng Canh Tuất, Năm Nhâm Tuất.
3. **Phân tích tứ trụ theo ngũ hành**: "Mộc: 1; Hỏa: 4; Thổ: 4; Kim: 5; Thủy: 2" — tổng = 16 đơn vị (không phải 8), tức cách đếm có tính cả **tàng can** trong địa chi hoặc trọng số, không chỉ 8 chữ bề mặt **[SUY LUẬN từ phép cộng]**. → "Các hành vượng: Kim; Các hành suy: Mộc, Thủy".
4. **Suy ra hành mà tên cần đạt**: "tổng số nét của tên nên đặt thuộc một trong các hành Mộc, Thủy" (các hành suy), rồi lọc tiếp bằng quan hệ với niên mệnh: bản mệnh Thủy, hành Thủy của tên không khắc mệnh, lại tiết chế Kim đang vượng (Kim sinh Thủy) → chốt hành mục tiêu cho **tổng số nét của tên là Thủy**.
5. **Phân tích từng tên ứng viên** (tên đã chọn + các tên tư vấn mới). Mỗi tên gồm đúng các mục sau:
   - Từng chữ: số nét Hán phồn thể + ngũ hành của chữ. VD: "Chữ Mỹ thuộc bộ chữ có 9 nét, ngũ hành thuộc Thủy; Chữ Gia ... 5 nét, ngũ hành thuộc Hỏa".
   - Quan hệ ngũ hành giữa các chữ theo chiều trái→phải: đếm số cặp **tương sinh** và số cặp **tương khắc** (Mỹ Gia: 0 sinh, 1 khắc — Thủy khắc Hỏa).
   - **Âm dương từng chữ**: số nét lẻ = Dương (+), chẵn = Âm (−). Mỹ Gia: cả 2 chữ đều Dương → "số lượng âm dương mất cân bằng, **hung**". Tên 3 chữ cân bằng hơn → "khá cân bằng, **bình**"; cân bằng tuyệt đối → "**cát**".
   - **Tổng số nét của tên** (chỉ phần tên, không gồm họ, trong module doanh nghiệp) → ngũ hành của tổng theo chữ số cuối: 14 → Hỏa; 39 → Thủy; 29 → Thủy (khớp quy tắc chuẩn 1–2 Mộc, 3–4 Hỏa, 5–6 Thổ, 7–8 Kim, 9–0 Thủy).
   - Tổng hành đó có bổ trợ tứ trụ không → cát/bình (Mỹ Gia: Hỏa "không giúp cân bằng nhưng cũng không làm lệch thêm, bình").
   - Quan hệ hành của tên với **niên mệnh** → sinh/khắc/bình (đều "bình" trong mẫu). Module doanh nghiệp có thêm 1 quan hệ nữa: với hành của ngành nghề.
   - **Luận số nét (hoạch)**: tra bảng 81 hoạch — "Số nét 14 là số Hung, thập tứ hoạch, nhẫn đắc khổ nan, tất hữu hậu phước..."; 39 là Cát "tam cửu hoạch, vân khai kiến nguyệt..."; 29 là Cát "nhị cửu hoạch, như long đắc vân...".
   - **Phối quẻ Dịch từ số nét của tên**: 14 → **Thiên Phong Cấu** (Quẻ Hung); 39 → **Địa Phong Thăng** (Quẻ Cát); 29 → **Hỏa Địa Tấn** (Quẻ Cát).
   - **Kết luận: tổng điểm /10**, theo nấc 0.5 (3.5/10; 7.5/10; 8/10) + câu kết mẫu ("Tên Mỹ Gia chưa thực sự toàn vẹn, nếu có thể nên sử dụng các tên tốt hơn theo tư vấn" / "Tên này rất tốt, có thể sử dụng...").
6. **Tư vấn tên mới**: phần mềm tự ghép tên mới từ CSDL chữ sao cho đạt hành mục tiêu của tổng nét, hoạch cát, quẻ cát (Mạnh Khang Gia 7.5/10; Bảo Khang 8/10) — tức engine có cả chức năng **sinh tên**, không chỉ chấm tên có sẵn.

### B2. Bản dựng lại hiện đại mang thương hiệu "Định Danh Kỳ Thư" — tenchocon.vn

Nguồn mẫu đầy đủ: https://tenchocon.vn/doc/ten_cho_con.pdf (báo cáo cho tên "Nguyễn Hoàng Hải", bé nam sinh 10:40 ngày 19/11/2025). Đây là bản re-implementation đời mới (có thêm điểm phát âm, thang 100), **không phải bản gốc**, nhưng cho thấy khung báo cáo Kỳ Thư khi áp cho tên bé:
- Thông tin bé: ngày giờ sinh + ngày âm lịch tương ứng, giới tính, mùa, tiết khí (Lập Đông); **Niên mệnh (nạp âm): Phú Đăng Hỏa** (năm Ất Tỵ); **Tứ trụ**: giờ Ất Tỵ, ngày Nhâm Thìn, tháng Bính Tuất, năm Ất Tỵ, kèm bảng can/chi/ngũ hành từng trụ.
- Bảng tổng hợp ngũ hành tứ trụ (chỉ đếm 8 chữ bề mặt): Mộc 2, Hỏa 3 (vượng), Thổ 2, Kim 0 (khuyết hoàn toàn), Thủy 1 → **Nhật chủ** Nhâm (Thủy), **Dụng thần** Thủy, **Hỷ thần** Kim, **Kỵ thần** Thổ → tên nên chọn hành Thủy/Kim, tránh Thổ. **Điểm hợp phong thủy: 9/10**.
- Ý nghĩa gốc Hán tự từng chữ, kèm số nét + hành: Nguyễn = 阮 6 nét Thổ; Hoàng = 皇 9 nét Kim; Hải = 澥 16 nét Thủy; kèm nghĩa từ điển Hán–Việt và **điểm phát âm 10/10**.
- **Ngũ cách** theo công thức chuẩn (khác hẳn bản Kabala ở B3): Thiên = họ + 1 = 7 (điểm 5/10, Bình); Nhân = họ + chữ đầu tên = 6+9 = 15 (9/10, Đại cát); Địa = đệm + tên = 9+16 = 25 (8/10, Cát); Ngoại = chữ cuối + 1 = 17 (8/10, Cát); Tổng = 31 (20/20, Đại cát). Mỗi cách tra "quẻ số" 1–81 kèm đoạn luận và điểm riêng.
- Quan hệ giữa các cách (tam tài): Nhân–Thiên (vận thành công), Nhân–Địa (vận cơ sở), Nhân–Ngoại (vận xã giao) — xét sinh/khắc giữa các hành suy từ số (Thiên Kim – Nhân Thổ – Địa Thổ → Cát), có điểm từng quan hệ. **Điểm ngũ cách: 8.4/10**.
- Tổng kết: Phát âm 10, Phong thủy 9, Ngũ cách 8.4 → **Tổng 87/100, "Cực tốt"**.

### B3. Bản sao thuộc "họ" khác (để đối chứng, đừng nhầm là VietAA) — tuvi.kabala.vn

Nguồn: https://tuvi.kabala.vn/dat-ten-cho-con/xem-ten-Phạm-Nhật-Vượng.html — công cụ còn chạy, dùng đúng tên mẫu mặc định của VietAA là "Phạm Nhật Vượng", và dùng kho văn bản luận giải ngũ cách cổ điển phổ biến (cùng kho với bài "Dự đoán số mệnh qua họ tên" của tuviglobal.com / họ tuvisomenh). Output chỉ gồm 5 mục Thiên/Địa/Ngoại/Nhân/Tổng cách + kết luận định tính "**Khá Tốt**" (không có điểm số, không có tứ trụ/bản mệnh). Đáng chú ý công thức của bản này **không chuẩn và không nhất quán**: Thiên cách ghi "Họ + Đệm" (Phạm Nhật = 9), Nhân cách ghi chỉ "Đệm" (Nhật = 4), Ngoại cách ghi "Họ + Tên" (Phạm Vượng = 13) dù nhãn công thức viết "Tổng − Nhân"; số nét suy ra: Phạm 5, Nhật 4, Vượng 8 (Nhật 日 4 nét và Vượng 旺 8 nét là số nét Hán thật; Phạm = 5 thì không rõ cơ sở). Hành suy từ số của bản này cũng lệch quy tắc chuẩn (9 → Kim, 12 → Hỏa, 13 → Mộc). → Đây là bằng chứng cho thấy các công cụ miễn phí cùng thời **tự chế công thức**, và càng củng cố việc không thể coi bất kỳ clone nào là bản sao trung thực của VietAA.

### B4. Họ công cụ lichvansu / xemtuong / fengshuiexpress (được Mamamy mô tả chi tiết)

Nguồn: https://mamamy.vn/?p=47961 — nhóm công cụ chấm tên /10 theo 4 khối: (1) quan hệ **tên – bản mệnh** (tối đa 3đ; VD tên Anh hành Thổ, bản mệnh Kim, Thổ sinh Kim → 3.0/3); (2) quan hệ **họ – đệm – tên** theo ngũ hành từng chữ (tối đa 2đ; họ Nguyễn = Mộc, đệm Châu = Thổ, tên Anh = Thổ → 0.5/2); (3) quan hệ **hành của bố và mẹ – tên** (tối đa 2đ); (4) **quẻ Kinh Dịch của tên**: "tách tên và họ ra, lấy hai phần ứng với thượng quái và hạ quái, tạo thành quẻ kép" (tối đa 3đ; VD quẻ Bí → 3/3). Tổng ví dụ: **7.5/10**, kết luận mẫu "Cái tên này khá tốt. Mẹ có thể lựa chọn những tên tốt hơn." — câu kết này gần như trùng văn phong câu kết của Định Danh Kỳ Thư 2.0. Tuy nhiên họ công cụ này hỏi cả năm sinh bố mẹ, còn form VietAA thì không → VietAA miễn phí **không thể** có khối (3) y hệt.

---

## (c) Những gì còn chưa rõ

1. **HTML/source của form gốc**: action, method, tên field, file JS — không lấy được (Wayback bị chặn 403 trong môi trường này; trang live đã 404). Chưa rõ form gửi GET/POST tới đâu, kết quả hiển thị cùng trang hay trang riêng.
2. **Output chính xác của bản miễn phí**: chưa tìm được ảnh chụp, bài mô tả sơ cấp, hay bản lưu nào của trang kết quả miễn phí. Mọi mô tả hiện có về "công cụ Vietaa" trên web đều là bài SEO tự nhận "giả định".
3. **Trọng số chấm điểm của bản miễn phí**: không rõ nó chấm /10 theo những khối nào và tỉ trọng bao nhiêu; chỉ biết thang điểm là /10 (qua Otofun) và kết quả thường cao (>8 cho những tên mà bản trả phí cho 3/10).
4. **Công thức phối quẻ từ số nét**: 3 điểm dữ liệu của Kỳ Thư 2.0 (14 → Thiên Phong Cấu; 39 → Địa Phong Thăng; 29 → Hỏa Địa Tấn) không khớp hoàn toàn với bất kỳ công thức tách họ/tên mod 8 nào thử được (mẫu đầu khớp kiểu "phần đầu / phần sau, mod 8, thứ tự Tiên thiên Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8", hai mẫu sau thì không) — **[CHƯA RÕ]**, có thể module doanh nghiệp tách quẻ theo cách riêng hoặc số nét dùng cho quẻ khác số nét hiển thị.
5. **Cách đếm ngũ hành tứ trụ của Kỳ Thư gốc**: tổng 16 đơn vị cho 8 chữ can chi → có trọng số/tàng can, nhưng hệ số cụ thể chưa rõ. (Bản tenchocon hiện đại đếm đơn giản 8 chữ bề mặt.)
6. **CSDL chữ Hán của VietAA**: số nét và hành của từng chữ là dữ liệu proprietary (khai thác từ >2.700 bộ chữ). Có điểm lạ ngay trong mẫu gốc: "Gia" được tính 5 nét (nếu là 家 thì 10 nét; 5 nét ứng với 加) → việc chọn chữ Hán đại diện cho mỗi âm tiết tiếng Việt là quyết định riêng của từng bộ dữ liệu, không suy ra từ quy tắc chung được.
7. **Vai trò của Giới tính trong bản miễn phí**: form có hỏi giới tính nhưng chưa có bằng chứng nó ảnh hưởng tới đâu trong tính toán (trong Kỳ Thư, giới tính có thể ảnh hưởng luận giải một số hoạch — VD các số như 21/39 thường kèm lưu ý "đối với phụ nữ không nên dùng" trong kho văn 81 hoạch cổ điển).
8. Chưa xác minh được mối quan hệ giữa phongthuy.vietaa.com (miễn phí) và tracuu.tuvisomenh.com: hai nơi cho điểm tương đồng theo lời 1 người dùng, nhưng chưa có bằng chứng chúng dùng chung code.

---

## (d) Dựng lại thuật toán — phương án có căn cứ nhất

### D1. Lớp "hồ sơ mệnh" (dùng chung cho cả 59 ứng dụng VietAA) — độ tin cậy cao

Đầu vào: giới tính, giờ sinh (12 giờ can chi), ngày, tháng, năm sinh dương lịch (năm chọn 1940–2050 cho thấy chủ đích là tra cho trẻ/người sống hiện tại).
1. Quy đổi dương → âm lịch; xác định **tiết khí** và mùa.
2. Lập **tứ trụ**: trụ năm theo mốc **Lập Xuân** (không phải 1/1 hay Tết), trụ tháng theo tiết khí, trụ ngày theo chu kỳ 60 hoa giáp liên tục, trụ giờ theo giờ can chi và can giờ suy từ can ngày (quy tắc Ngũ Thử Độn). Mỗi trụ = 1 Thiên Can + 1 Địa Chi, mỗi can/chi có ngũ hành cố định.
3. **Niên mệnh (nạp âm)**: tra bảng nạp âm 60 hoa giáp theo can chi năm (VD Nhâm Tuất = Đại Hải Thủy; Ất Tỵ = Phú Đăng Hỏa) → hành bản mệnh.

### D2. Lớp phân tích tên kiểu Định Danh Kỳ Thư — độ tin cậy cao cho bản trả phí, trung bình cho bản miễn phí

4. **Tra chữ**: mỗi âm tiết trong "Tên cần xem" được map sang chữ Hán (phồn thể) trong CSDL; lấy **số nét** (theo quy ước bộ thủ phồn thể: 氵 tính 4, 艹 tính 6, 忄 tính 4, 辶 tính 7, 阝 tính 8, 王/玉 tính 5...) và **ngũ hành của chữ**.
5. **Đếm ngũ hành tứ trụ** (gốc Kỳ Thư 2.0: có tính tàng can/trọng số, tổng 16) → hành **vượng** và hành **suy/thiếu**.
6. **Xác định hành mục tiêu cho tổng nét của tên**: ưu tiên hành suy/thiếu; sau đó kiểm tra chéo với niên mệnh (tránh khắc mệnh; nếu hành đó tiết chế được hành đang vượng quá mức thì càng tốt) → chốt 1–2 hành mục tiêu.
7. **Chấm tên ứng viên** theo các khối, mỗi khối cho phán quyết cát / bình / hung:
   a. Chuỗi ngũ hành của các chữ (trái→phải): đếm cặp tương sinh / tương khắc.
   b. **Âm dương**: từng chữ lẻ = Dương, chẵn = Âm; tỉ lệ cân bằng → cát/bình/hung.
   c. **Tổng số nét tên** → hành theo chữ số cuối (1–2 Mộc, 3–4 Hỏa, 5–6 Thổ, 7–8 Kim, 9–0 Thủy) → đối chiếu hành mục tiêu ở bước 6 (bổ trợ = cát; trung tính = bình; làm lệch thêm/khắc = hung).
   d. Hành của tổng nét vs **niên mệnh**: sinh/khắc/bình hòa.
   e. **Hoạch của tổng nét**: tra bảng **81 hoạch** (bát thập nhất hoạch) → Cát/Hung + văn luận ("thập tứ hoạch...", "tam cửu hoạch...").
   f. **Phối quẻ Dịch** từ số nét → 1 trong 64 quẻ + phán quyết Cát/Hung (công thức tách số chính xác: chưa rõ, xem mục c4).
   g. (Bản đầy đủ/trả phí còn tính thêm **Ngũ cách** Thiên/Nhân/Địa/Ngoại/Tổng theo công thức chuẩn — Thiên = nét họ + 1; Nhân = nét họ + nét chữ đầu của tên; Địa = tổng nét phần tên; Ngoại = Tổng − Nhân + 1; Tổng = toàn bộ — mỗi cách tra quẻ số 81 kèm điểm, cộng quan hệ tam tài Thiên–Nhân–Địa; đây là phần VietAA quảng cáo rõ ràng và bản tenchocon hiện đại thể hiện đầy đủ.)
8. **Tổng hợp điểm /10** (bản doanh nghiệp gốc: nấc 0.5; bản trả phí cho bé từng cho điểm lẻ 8.25 → nấc 0.25, tức điểm là trung bình có trọng số của nhiều tiểu mục) + câu kết luận mẫu theo ngưỡng điểm.
9. **Sinh tên gợi ý** (bản đầy đủ): ghép chữ từ CSDL sao cho tổng nét rơi vào hành mục tiêu, hoạch Cát, quẻ Cát, chuỗi chữ tương sinh, âm dương cân bằng — rồi chấm lại bằng chính quy trình bước 7.

### D3. Khác biệt dự kiến của bản miễn phí trên web — [SUY LUẬN]

- Bỏ qua mục bố mẹ/anh chị em/phạm huý (form không hỏi); có thể bỏ hoặc rút gọn phần sinh tên gợi ý và phần ngũ cách chi tiết.
- Trọng số "dễ tính" hơn nên điểm thường cao (>8) — khớp phản ánh của người dùng Otofun và khớp lời VietAA tự chê các công cụ miễn phí là "lập trình tự động sơ lược".
- Giữ nguyên khung: hồ sơ tứ trụ + nạp âm (D1) → phân tích chữ/tổng nét/quẻ (D2 rút gọn) → 1 điểm tổng /10 + luận giải ngắn.

### D4. Các bảng dữ liệu bắt buộc phải có để build lại

| # | Bảng dữ liệu | Ghi chú |
|---|---|---|
| 1 | Vạn niên lịch / can chi: chu kỳ 60 ngày, mốc Lập Xuân, tiết khí theo tháng, Ngũ Thử Độn cho can giờ, can tháng theo can năm | Quyết định tứ trụ |
| 2 | Nạp âm 60 hoa giáp | Ra niên mệnh (VD Đại Hải Thủy, Phú Đăng Hỏa) |
| 3 | Ngũ hành của 10 can, 12 chi, và tàng can trong chi | Cho bước đếm ngũ hành tứ trụ |
| 4 | CSDL chữ Hán–Việt theo âm tiết: chữ phồn thể, số nét (quy ước bộ thủ), ngũ hành của chữ, nghĩa | VietAA quảng cáo >2.700 chữ; đây là tài sản dữ liệu lớn nhất |
| 5 | Bảng quy đổi số → hành theo chữ số cuối (1–2 Mộc, 3–4 Hỏa, 5–6 Thổ, 7–8 Kim, 9–0 Thủy) + lẻ/chẵn → âm/dương | Xác nhận qua 3 mẫu số của Kỳ Thư 2.0 |
| 6 | Bảng 81 hoạch: cát/hung + văn luận cho từng số 1–81 | Dùng cho cả hoạch tổng nét và quẻ số của ngũ cách |
| 7 | Bát quái (số Tiên thiên: Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8) + 64 quẻ: tên + Cát/Hung + văn luận | Cho bước phối quẻ |
| 8 | Ma trận tương sinh / tương khắc / bình hòa giữa 5 hành | Dùng ở nhiều khối chấm |
| 9 | Thang điểm & câu kết luận mẫu theo ngưỡng (VD ≥8 "rất tốt", ~3.5 "chưa toàn vẹn, nên dùng tên khác") | Trọng số chi tiết: chưa rõ |

---

## Nguồn chính (URL đầy đủ)

- Trang dịch vụ chính thức VietAA (phương pháp Ngũ cách / 81 hoạch / quẻ dịch / 2.700 chữ): http://vietaa.com/dich-vu/dat-ten-cho-con
- Kết quả mẫu gốc Định Danh Kỳ Thư 2.0 (PDF): http://xspace.talaweb.com/quangphu80/home/Dinhdanhkythu2.pdf
- Báo cáo "Định Danh Kỳ Thư" hiện đại đầy đủ (tenchocon.vn): https://tenchocon.vn/doc/ten_cho_con.pdf
- Chứng thực người dùng thật + link manager.vietaa.com/kythu (Otofun, 2016): https://www.otofun.net/threads/chu-de-muon-thua-dat-ten-cho-con.1037985/
- Mô tả app Định Danh Kỳ Thư của nhà phát triển: https://www.pgyer.com/ipa/de/ipa/com.afoli.dinhdanhkythu
- Clone ngũ cách còn chạy (họ khác, để đối chứng): https://tuvi.kabala.vn/dat-ten-cho-con/xem-ten-Phạm-Nhật-Vượng.html
- Họ công cụ chấm /10 theo bản mệnh + quẻ (Mamamy mô tả): https://mamamy.vn/?p=47961
- Bài thừa nhận "giả định" về công cụ Vietaa: https://dattenhay.com/cham-diem-ten-con-theo-phong-thuy-vietaa-co-hieu-qua-khong/
- Form dùng chung của các ứng dụng VietAA: https://phongthuy.vietaa.com/sim-phong-thuy
- Lý thuyết tứ trụ/dụng thần chuẩn: https://tendep.vn/dat-ten-con-theo-tu-tru-la-gi-cach-dat-ten-dung-chuan-ngu-hanh-thien-can-dia-chi/ ; ngũ cách chuẩn: https://www.tuviglobal.com/thu-vien/chu-dich/du-doan-so-menh-qua-ho-ten-p1.html
