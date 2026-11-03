# Bói Kiều, bộ dữ liệu câu Kiều: ghi chú nguồn và cách kiểm chứng

Ngày biên soạn: 2026-11-02. File dữ liệu: `kieu-verses.json` (60 cặp câu lục bát).

## Nguồn toàn văn đã dùng để kiểm chứng

1. **Nguồn chính, đọc toàn bộ 3.254 câu**: bản toàn văn Truyện Kiều tại
   https://nguoi-noi-tieng.com/public/truyenkieu-nguyendu.html
   Cả 60 cặp câu trong dữ liệu đều được định vị và đối chiếu nguyên văn trong bản này.
2. **Nguồn đối chiếu thứ hai**: bản toàn văn tại https://thohay.vn/truyen-kieu.html
   (xác nhận đoạn mở đầu, gồm "Phong tình cổ lục còn truyền sử xanh" và "Thông minh vốn sẵn tính trời").
3. **Nguồn đối chiếu thứ ba**: nhóm Truyện Kiều trên Thi Viện,
   https://www.thivien.net/Nguyễn-Du/Truyện-Kiều/group-uAY7gIaARbh2b4DCVporPQ
   (xác nhận các đoạn Ngưng Bích, bán mình chuộc cha và đoạn đoàn viên).
4. **Chấm kiểm thêm bằng trích dẫn trong bài phân tích văn học** (loigiaihay.com, hoctot.nam.name.vn,
   tailieuhoctap.edu.vn, ynghiasong.vn, vanhoanghean.com.vn): 6 cặp câu nhạy cảm về dị bản được
   kiểm chứng riêng từng cặp, gồm "Trai anh hùng, gái thuyền quyên", "Dễ cho để thiếp bán mình chuộc cha",
   "Cửa trời rộng mở đường mây / Hoa chào ngõ hạnh, hương bay dặm phần", "Mỗi người một vẻ, mười phân vẹn mười",
   "Vầng trăng ai xẻ làm đôi".

## Dị bản giữa các nguồn và lựa chọn đã chốt

- "Phong tình **cổ** lục" (chọn) thay cho "Phong tình có lục" ở nguồn chính: bản thohay.vn và bản học đường
  NXB Văn học đều in "cổ lục".
- "**Mỗi** người một vẻ" (chọn) thay cho "Một người một vẻ": bản học đường hiện hành in "Mỗi người";
  riêng bản hiệu khảo Bùi Kỷ, Trần Trọng Kim (in lần 8, Tân Việt) in "Một người", ghi nhận là dị bản cũ.
- "Thông minh vốn sẵn **tính** trời" (chọn) thay cho "tư trời" ở nguồn chính.
- "Quyết **tình** nàng mới hạ tình" (chọn theo nguồn toàn văn chính); thivien.net trích "Quyết mình",
  đây là dị bản giữa các bản in, cả hai đều tồn tại, dữ liệu theo bản toàn văn đã đọc trọn bộ.
- "**Dễ** cho để thiếp bán mình chuộc cha" (chọn); nguồn chính gõ nhầm "Dẽ cho", nhiều nguồn khác xác nhận "Dễ cho".
- "gái **thuyền quyên**" (chọn); nguồn chính gõ nhầm "thuyền nguyên", các nguồn học đường đều in "thuyền quyên".
- "xấp xỉ" (chọn) thay cho "sấp xỉ"; "làm đôi" (chọn) thay cho lỗi gõ "làm -dôi" ở nguồn chính.
- Chính tả được hiện đại hóa thống nhất: "khóa xuân" (không dùng "khoá"), bỏ dấu phẩy thừa kiểu bản cũ;
  dấu câu trong câu thơ được chuẩn hóa nhẹ, không đổi chữ.
- Cặp câu thề nguyền "Vầng trăng vằng vặc giữa trời / Đinh ninh hai mặt (hoặc hai miệng) một lời song song"
  bị **loại khỏi dữ liệu** vì hai chữ "mặt/miệng" chưa thống nhất giữa các nguồn, đúng nguyên tắc
  không chắc chắn thì không đưa vào.

## Phân bố dữ liệu

- Tone: tốt 12 (20%), khá 18 (30%), trung bình 18 (30%), cần cẩn trọng 12 (20%).
- Chủ đề (mỗi cặp 1 đến 3 chủ đề): tổng quan 20, tình duyên 15, gia đạo 13, công danh 9,
  tài lộc 8, sức khỏe 8. Mọi chủ đề đều có ít nhất 8 cặp.
- Kiểm tra cấu trúc tự động bằng script `build_kieu.py` (cùng thư mục): mọi mục đều có câu 1 đúng 6 tiếng,
  câu 2 đúng 8 tiếng, hai câu là cặp lục bát liên tiếp trong truyện.

## Về phần luận giải

Toàn bộ trường `meaning` và `advice` trong `kieu-verses.json` là **văn bản viết mới hoàn toàn**
cho công cụ Bói Kiều này, không sao chép từ bất kỳ trang bói Kiều hay trang giải nghĩa nào.
Giọng luận giải điềm đạm, chỉ gợi hướng suy ngẫm và hành động, không phán quyết tuyệt đối,
không hù dọa; riêng các quẻ nặng về sức khỏe tinh thần có lồng lời khuyên tìm người lắng nghe,
hỗ trợ khi cần. Văn bản Truyện Kiều thuộc phạm vi công cộng (Nguyễn Du mất năm 1820).

## Lưu ý khi dùng

- Dữ liệu theo văn bản học đường phổ biến hiện nay; nếu sau này đối chiếu thêm bản hiệu đính khác
  (ví dụ bản Đào Duy Anh) có thể phát sinh thêm vài dị bản một chữ, nên kiểm tra lại khi cập nhật.
- Các cặp câu được chọn vì tính phổ biến và dễ kiểm chứng, không phải toàn bộ các câu hay nhất của truyện.
