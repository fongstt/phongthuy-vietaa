# name-chars.json — Ghi chú nguồn và độ tin cậy

Bản v1, 2026-10-31. Tổng: **334 âm tiết**, **75 mục gắn `uncertain: true`** (nguồn xung đột, hoặc số nét/hành chưa kiểm chứng chéo được — khi dùng để chấm điểm nên hiển thị kèm cảnh báo hoặc cho phép người dùng sửa chữ Hán).

## Cách biên soạn
- Mỗi âm tiết tiếng Việt (có dấu, chữ thường) → MỘT chữ Hán phồn thể đại diện phổ biến nhất trong từ điển tên Hán–Việt.
- Số nét: tổng số nét Khang Hy của dạng phồn thể, áp dụng điều chỉnh bộ thủ ngũ cách ở những chữ đã được kiểm chứng rộng rãi (氵 +1 như 清 12, 江 7; 艹 tính 6 như 英 11, 草 12, 莊 13; 辶 tính 7 như 達 16, 進 15, 運 16; 忄 +1 như 情 12, 懷 20). Chữ nào chưa chắc về điều chỉnh bộ thì lấy tổng nét phồn thể thuần và gắn `uncertain`.
- Hành: theo bộ thủ/nghĩa trong thực hành phân tích tên Hán–Việt (ví dụ bộ 金 → Kim, 木 → Mộc, 氵 → Thủy, 日/火 → Hỏa, 土/山 → Thổ). Hành là trường xung đột nhiều nhất giữa các nguồn (xem dưới), nên một số mục hành đẹp về bộ thủ vẫn gắn uncertain.

## Kiểm chứng anchors (theo báo cáo Định Danh Kỳ Thư tại tenchocon.vn) — KHỚP 4/4
| Âm | File này | Nguồn đối chiếu khác | Xử lý |
|---|---|---|---|
| nguyễn 阮 | 6 nét, Thổ | tuvikhoahoc.com luận tên Nguyễn Hoàng Hải ghi Nguyễn 7 nét, Dương Kim; tổng nét chữ 阮 phồn thể thuần cũng thường đếm 7 | **Dùng giá trị anchor 6/Thổ** theo báo cáo Kỳ Thư (tenchocon.vn), ghi nhận xung đột tại đây |
| hoàng 皇 | 9 nét, Kim | tudienten.com ghi hành của 皇 là Thủy | **Dùng giá trị anchor 9/Kim** theo báo cáo Kỳ Thư, ghi nhận xung đột |
| hải 澥 | 16 nét, Thủy | Đa số site hiện đại dùng 海 (10 nét thuần, 11 theo điều chỉnh 氵) và tên mẫu mặc định của VietAA "Phạm Nhật Vượng" cũng gợi 海 | **Dùng chữ 澥 16 nét** đúng như báo cáo Kỳ Thư; đây là lựa chọn riêng của bộ dữ liệu Kỳ Thư, không phải chữ Hải phổ thông |
| nhật 日 | 4 nét (hành Hỏa theo bộ nhật) | tuvi.kabala.vn cũng dùng Nhật 日 4 nét; Vượng 旺 8 nét (file này có "vượng" 旺 8, khớp) | Khớp; anchor không cho hành nên hành Hỏa suy từ bộ 日 |

Kiểm chứng phụ từ bản mẫu Kỳ Thư 2.0 (PDF xspace.talaweb.com): Mỹ 美 = 9 nét, hành Thủy; Gia = 5 nét, hành Hỏa → file này để "gia" là 加 5 nét Hỏa (KHÔNG dùng 家 10 nét) và "my/mỹ" 美 9 nét Thủy, khớp cả hai.

## Nguồn đã dùng
- Báo cáo mẫu Định Danh Kỳ Thư (tenchocon.vn, file ten_cho_con.pdf) và nghiên cứu nội bộ ~/workspace/phongthuy/research-dat-ten-con-logic.md — nguồn anchors và quy ước đếm tàng can/bộ thủ.
- tudienten.com (trang họ tên, gồm bảng quy đổi chữ Hán và ngũ hành từng thành phần tên).
- tuvikhoahoc.com (luận giải ngũ cách tên Nguyễn Hoàng Hải — dùng để đối chiếu, có xung đột với anchors như ghi trên).
- scr.vn và invert.vn (bảng dịch họ/tên sang chữ Hán: Bùi 裴, Đỗ 杜, Đoàn 段, Đặng 鄧, Hồ 胡, Hoàng/Huỳnh 黃, Lê 黎, Lâm 林, Nguyễn 阮, Ngô 吳, Trần 陳, Ngân 銀, Trọng 重, Tuyết 雪, Tú 秀...).
- rdsic.edu.vn (bảng chữ Hán hay để đặt tên: An 安, Bảo 寶, Dũng 勇, Đức 德, Hiếu 孝, Hùng 雄, Huy 輝, Khải 凱, Khang 康, Khôi 魁, Minh 明, Nghĩa 義, Nhân 仁, Quang 光, Sơn 山, Thành 誠, Trí 智, Trung 忠, Tuấn 俊).
- Bảng 214 bộ thủ (Viện Việt Học / thuvienso.com.vn) và danh sách 3000 từ Hán–Việt thông dụng (phanxuanchanh.com) để tra nghĩa và bộ thủ.

## Mục gắn uncertain (75)
binh, biên, bùi, bằng, cao, chinh, châu, công, cường, diệp, diễm, doanh, dự, hiếu, hiển, hiệp, hoa, hùng, hưng, hương, hằng, hồ, hồng, khánh, khôi, kỳ, linh, liên, loan, ly, lê, lĩnh, lộc, lực, mạnh, mộng, ngô, nhượng, nương, phi, phong, phúc, phước, phạm, quyên, quách, quân, quỳnh, sáng, thoa, thuyên, thành, thùy, thịnh, thức, tiêu, toản, trâm, trần, trịnh, tô, tú, tường, tấn, uất, vi, viên, vĩ, yên, đình, đô, đại, đắc, đặng, ưu.

Lý do điển hình: số nét Khang Hy vs số nét viết tay hiện đại lệch nhau (trịnh 鄭 14/19, tô 蘇 19/22, hiển 顯 18/23), hành tra khác nhau giữa các site (hùng 雄, hương 香, phúc 福), hoặc chữ đại diện chưa phải lựa chọn duy nhất (thành 成/誠, linh 玲/靈, phi 飛/非).

## Âm tiết có nhiều chữ đại diện — file chỉ giữ 1, cần lưu ý khi mở rộng
- dương: file giữ 楊 13 Mộc (họ Dương). Tên "Dương" cho bé thường là 陽 17 Hỏa — nên tách key theo ngữ cảnh họ/tên ở v2.
- hà: file giữ 何 7 (họ Hà). Tên "Hà" thường là 河 (sông) hoặc 霞 (ráng chiều).
- châu: file giữ 珠 (ngọc, tên). Họ Châu thường viết 周.
- vũ: file giữ 武 (họ Vũ/Võ và tên). Tên "Vũ" cũng hay là 雨 (mưa).
- gia: giữ 加 theo đúng mẫu Kỳ Thư 2.0; nhiều từ điển tên dùng 家 (nhà, 10 nét).
- hải: giữ 澥 theo Kỳ Thư; chữ phổ thông là 海 (xem bảng anchors).
- thành: giữ 成 7; chữ 誠 (chân thành, 14 nét) cũng rất phổ biến trong tên.

## Âm tiết muốn có nhưng KHÔNG đưa vào (tránh bịa)
- thương: không có một chữ Hán đại diện chuẩn duy nhất cho tên "Thương" (các ứng viên 商/瑲 đều hiếm và không thống nhất giữa các từ điển tên) — để trống, công cụ phải báo "chưa có dữ liệu".
- lành, mến, thắm, xinh, nhớ, vui: âm thuần Việt, không có chữ Hán–Việt tương ứng dùng trong đặt tên theo ngũ cách — không gán chữ.
- sang: ứng viên phổ biến nhất là 桑 (dâu tằm) nhưng chưa kiểm chứng được là chữ đại diện chuẩn cho tên "Sang" — để trống chờ kiểm chứng.

## Hạn chế v1
- Đây là bản phủ tên phổ biến, chưa phải CSDL 2.700 chữ như VietAA quảng cáo; công cụ phải báo rõ âm tiết chưa có dữ liệu thay vì chấm bừa (đúng thiết kế tại ~/workspace/phongthuy/thiet-ke-cong-cu-dat-ten-con.md).
- Họ kép và âm tiết ít gặp (họ Âu Dương, Tư Mã...) chưa có.
