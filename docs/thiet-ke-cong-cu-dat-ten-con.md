# Thiết kế công cụ Đặt Tên Con cho phongthuy.vietaa.com

Chốt ngày 2026-10-31 theo lựa chọn của user: dựng công cụ tính thật trước, các ứng dụng sau tính tiếp.
Căn cứ: research-dat-ten-con-logic.md (nghiên cứu cùng thư mục).

## Chỉ đạo của user ngày 2026-10-31 (bổ sung)
User chốt: lấy form cũ và dữ liệu cũ làm nền, update cho phù hợp, được sáng tạo thêm, KHÔNG nhất thiết giống hệt bản cũ. Vì vậy các lựa chọn "của bản dựng lại" trong tài liệu này được tự do triển khai theo hướng hiện đại, dễ hiểu, minh bạch cách tính, miễn giữ khung phương pháp phong thủy cốt lõi và form nhập quen thuộc.

## Tuyên bố trung thực về mức độ giống gốc
- KHÔNG khôi phục được nguyên văn bản miễn phí gốc: output và trọng số chấm điểm của nó không còn ở đâu trên web công khai, và có chứng thực nó chấm khác xa bản trả phí (cùng tên: miễn phí >8, trả phí 3/10).
- Bản dựng lại đi theo đúng engine/phương pháp VietAA công bố: Định Danh Kỳ Thư, cơ sở Ngũ cách + 81 hoạch + Ngũ hành + Quẻ dịch + số nét chữ Hán phồn thể + bổ trợ tứ trụ. Mọi chỗ thuật toán gốc chưa rõ đều ghi rõ là lựa chọn của bản dựng lại, không giả danh bản gốc.

## Form nhập (giống form gốc)
- Tên cần xem (họ + tên đệm + tên chính)
- Giới tính: Nam / Nữ
- Giờ sinh: 12 giờ can chi (Tí...Hợi)
- Ngày / Tháng / Năm sinh dương lịch (năm 1940-2050)

## Kết quả trả ra (theo khung kết quả mẫu Kỳ Thư 2.0)
1. Hồ sơ mệnh: ngày âm lịch tương ứng, niên mệnh (nạp âm năm sinh), tứ trụ 4 cột can chi.
2. Đếm ngũ hành tứ trụ: 8 chữ bề mặt + tàng can phụ (trung khí + dư khí của địa chi; tàng can chính không đếm trùng vì hành của chi đã là chính khí).
   Kiểm chứng: cách đếm này tái tạo CHÍNH XÁC bảng đếm trong kết quả mẫu Kỳ Thư 2.0 (sinh 19:30, 24/10/1982: Mộc 1, Hỏa 4, Thổ 4, Kim 5, Thủy 2, tổng 16).
3. Hành vượng / hành suy, và hành mục tiêu cho tổng nét tên: ưu tiên hành suy, lọc theo quan hệ với niên mệnh (tránh khắc mệnh, ưu tiên hành tiết chế hành vượng hoặc sinh cho mệnh).
4. Phân tích từng chữ trong tên: chữ Hán phồn thể, số nét, ngũ hành, ý nghĩa (từ CSDL chữ tự xây, bản đầu tập trung các âm tiết đặt tên phổ biến; âm tiết chưa có trong CSDL sẽ báo rõ "chưa có dữ liệu" chứ không chấm bừa).
5. Các khối chấm:
   - Chuỗi ngũ hành các chữ trái sang phải: đếm cặp tương sinh / tương khắc
   - Cân bằng âm dương theo chẵn lẻ số nét từng chữ (lẻ = Dương, chẵn = Âm)
   - Hành của tổng số nét phần tên (số cuối: 1-2 Mộc, 3-4 Hỏa, 5-6 Thổ, 7-8 Kim, 9-0 Thủy) đối chiếu hành mục tiêu
   - Hành tổng nét đối chiếu niên mệnh (sinh / khắc / bình hòa)
   - Luận hoạch của tổng nét theo bảng 81 hoạch (cát / bình / hung + lời luận ngắn; có lưu ý riêng cho nữ ở các số cổ thư coi là kỵ nữ giới như 21, 23, 33, 39)
   - Phối quẻ Dịch: bản dựng lại dùng Thiên cách mod 8 = thượng quái, Địa cách mod 8 = hạ quái (số Tiên thiên: Càn 1, Đoài 2, Ly 3, Chấn 4, Tốn 5, Khảm 6, Cấn 7, Khôn 8), tra 64 quẻ lấy cát hung. Ghi rõ đây là công thức của bản dựng lại vì công thức gốc chưa khôi phục được.
6. Ngũ cách (phần bổ sung, công thức chuẩn): Thiên = nét họ + 1; Nhân = nét họ + nét chữ đầu phần tên; Địa = tổng nét phần tên (tên 1 chữ thì +1); Tổng = tổng nét toàn tên; Ngoại = Tổng − Nhân + 1. Mỗi cách tra bảng 81 hoạch, kèm quan hệ tam tài Thiên-Nhân-Địa.
   Kiểm chứng công thức với báo cáo tenchocon.vn: Nguyễn Hoàng Hải 6/9/16 nét cho Thiên 7, Nhân 15, Địa 25, Ngoại 17, Tổng 31 — khớp.
7. Tổng điểm /10 theo nấc 0.25 từ 6 khối ở mục 5 (trọng số: chuỗi hành 2.0, âm dương 1.5, tổng nét vs hành mục tiêu 2.0, tổng nét vs niên mệnh 1.5, hoạch 1.5, quẻ 1.5) + câu kết luận theo ngưỡng điểm.

## Định dạng đăng trên WordPress (user chốt 2026-10-31)
Mỗi ứng dụng là một PAGE (Trang) riêng, slug ngang cấp dạng /<slug> (ví dụ /dat-ten-con), KHÔNG đăng dạng bài viết blog (Post). Blog/Post chỉ dùng sau này nếu làm bài viết SEO hỗ trợ, không chứa công cụ.

## Kỹ thuật dựng trên WordPress
- Ưu tiên 1 (nếu tài khoản đủ quyền): plugin tự viết nhỏ gọn hoặc trang có mã JS riêng, dữ liệu bảng (nạp âm 60, 81 hoạch, 64 quẻ, CSDL chữ) đóng gói trong mã.
- Ưu tiên 2 (quyền Editor): nhúng toàn bộ công cụ bằng khối Custom HTML + JavaScript chạy phía trình duyệt ngay trong trang /dat-ten-con. Vẫn là công cụ tính thật, không cần server.
- Can chi / âm lịch: dùng thuật toán lịch âm Việt Nam chuẩn (quy đổi dương sang âm, can chi ngày theo số ngày Julian, trụ năm theo mốc Lập Xuân xấp xỉ 4/2, trụ tháng theo tiết khí xấp xỉ, can giờ theo Ngũ Thử Độn từ can ngày). Các mốc xấp xỉ phải ghi chú trong trang kết quả.

## Dữ liệu cần xây
1. Bảng nạp âm 60 hoa giáp
2. Hành của 10 can, 12 chi + bảng tàng can (chính, trung, dư)
3. Bảng 81 hoạch: cát hung + luận ngắn
4. Bảng 64 quẻ: tên + cát hung
5. CSDL chữ theo âm tiết tiếng Việt: chữ Hán phồn thể, số nét, hành, nghĩa — tài sản lớn nhất, làm tăng dần, bản đầu phủ các tên phổ biến nhất
6. Ma trận tương sinh tương khắc ngũ hành
