# -*- coding: utf-8 -*-
import json, io
TOOLS = [
 ("xem-than-so-hoc","Xem Thần Số Học","Xem thần số học, số chủ đạo theo ngày sinh và họ tên",
  "Tra số chủ đạo, số linh hồn, số biểu đạt và số nhân cách theo thần số học Pythagoras từ ngày sinh và họ tên của bạn.",
  "Thần số học nghiên cứu ý nghĩa của các con số gắn với ngày sinh và tên gọi, giúp mỗi người hiểu rõ tính cách và đường đời của mình."),
 ("ten-nguoi-yeu-tuong-lai","Tên Người Yêu Tương Lai","Gieo quẻ tên người yêu tương lai theo ngày sinh, công cụ giải trí",
  "Gieo quẻ vui từ ngày sinh của bạn để gợi ý tên, tuổi và nghề nghiệp của người thương tương lai.",
  "Đây là trò gieo quẻ giải trí được các bạn trẻ yêu thích, dùng ngày sinh làm hạt giống để rút ngẫu nhiên tên người yêu tương lai."),
 ("xem-la-so-tu-vi","Xem Lá Số Tử Vi","Lập lá số tử vi cơ bản, an cung Mệnh, cung Thân và 12 cung theo ngày giờ sinh",
  "Lập lá số tử vi cơ bản từ ngày giờ sinh: cung Mệnh, cung Thân, 12 cung chức năng và cục theo mệnh nạp âm, trình bày minh bạch.",
  "Tử vi đẩu số là môn luận mệnh lâu đời của phương Đông, dựa trên ngày giờ sinh âm lịch để an các cung trên lá số."),
 ("giai-ma-tien-kiep","Giải Mã Tiền Kiếp","Giải mã tiền kiếp theo ngày sinh, kiếp trước bạn là ai",
  "Từ ngày sinh của bạn, công cụ gợi mở một thân phận tiền kiếp và bài học còn mang theo sang đời này để suy ngẫm.",
  "Tiền kiếp là chủ đề huyền học được nhiều người tò mò. Phần luận giải ở đây là câu chuyện giải trí giúp bạn soi chiếu tính cách hiện tại."),
 ("xem-boi-ngay-sinh","Xem Bói Ngày Sinh","Xem bói ngày sinh, tính cách và vận mệnh theo ngày tháng năm sinh",
  "Luận tính cách và vận mệnh theo ngày sinh, kết hợp thần số học với can chi và mệnh nạp âm của ngày sinh.",
  "Ngày sinh mang nhiều lớp thông tin: số chủ đạo của thần số học, can chi của ngày và mệnh của năm sinh, gộp lại tạo nên bức tranh tính cách khá riêng."),
 ("giai-ma-hau-kiep","Giải Mã Hậu Kiếp","Giải mã hậu kiếp, hậu vận đời người theo ngày sinh",
  "Từ ngày sinh, công cụ luận về hướng hậu vận và điều nên vun bồi từ bây giờ để chặng sau của đời người được an ổn.",
  "Nếu tiền kiếp là nhìn về quá khứ, hậu kiếp là hướng về chặng sau của đời người, nơi những gì bạn gieo hôm nay sẽ trổ quả."),
 ("xem-duong-hoc-van","Xem Đường Học Vấn","Xem đường học vấn, thi cử theo ngày sinh và mệnh",
  "Luận đường học vấn và thi cử theo can của ngày sinh và mệnh nạp âm, kèm gợi ý cách phát huy thế mạnh học tập.",
  "Mỗi người có một kiểu học hợp với mình. Luận theo can ngày và mệnh giúp phụ huynh và học sinh chọn cách học phù hợp hơn."),
 ("la-bai-ban-menh","Lá Bài Bản Mệnh","Rút lá bài bản mệnh Tarot theo họ tên và ngày sinh",
  "Mỗi người có một lá bài Tarot bản mệnh rút theo họ tên và ngày sinh, mang thông điệp chủ đạo cho đường đời.",
  "Trong Tarot, 22 lá bài Ẩn Chính đại diện cho 22 bài học lớn của đời người. Lá bài bản mệnh được rút cố định theo thông tin của bạn."),
 ("gieo-que-dong-xu","Gieo Quẻ Đồng Xu","Gieo quẻ đồng xu Kinh Dịch, tung xu 6 lần lập quẻ có hào biến",
  "Tung 3 đồng xu 6 lần để lập quẻ Kinh Dịch đủ 6 hào, có hào biến, kèm lời luận của 64 quẻ.",
  "Gieo quẻ bằng đồng xu là cách lập quẻ Kinh Dịch phổ biến nhất, mỗi lần tung 3 xu cho ra một hào, 6 lần thành một quẻ."),
 ("xem-tu-vi-tay-phuong","Xem Tử Vi Tây Phương","Xem tử vi Tây phương theo 12 cung hoàng đạo và năm hiện tại",
  "Xem tử vi theo cung hoàng đạo của bạn: tính cách, sự nghiệp, tình duyên và tổng quan năm nay.",
  "Tử vi Tây phương dựa trên 12 cung hoàng đạo theo ngày sinh dương lịch, là hệ thống chiêm tinh phổ biến ở phương Tây."),
 ("gieo-que-quan-thanh","Gieo Quẻ Quan Thánh","Gieo quẻ Quan Thánh, rút thẻ quẻ số 1 đến 100 xin quẻ đầu năm",
  "Rút quẻ Quan Thánh với đủ 100 quẻ, mỗi quẻ có thơ quẻ và đẳng quẻ từ thượng thượng đến hạ hạ kèm luận giải.",
  "Xin quẻ Quan Thánh tại đền, miếu là nét văn hóa đầu năm quen thuộc. Công cụ này mô phỏng việc rút thẻ quẻ ngay trên điện thoại của bạn."),
 ("giai-ma-giac-mo","Giải Mã Giấc Mơ","Giải mã giấc mơ, tra ý nghĩa các giấc mơ thường gặp và con số gợi ý",
  "Kể lại giấc mơ của bạn để tra ý nghĩa trong từ điển hơn 70 giấc mơ phổ biến, kèm con số gợi ý đi kèm.",
  "Người xưa tin giấc mơ mang điềm báo về việc sắp tới. Từ điển giải mộng ở đây tổng hợp các giấc mơ hay gặp nhất như rắn, nước, tiền, răng rụng."),
 ("luc-thap-tu-quai","Lục Thập Tứ Quái","Tra cứu 64 quẻ Kinh Dịch, lục thập tứ quái đầy đủ",
  "Tra cứu nhanh ý nghĩa của 64 quẻ Kinh Dịch bằng cách chọn quẻ thượng và quẻ hạ.",
  "64 quẻ Kinh Dịch tạo thành từ 8 quẻ đơn ghép đôi, mỗi quẻ là một bức tranh về một trạng thái của sự việc."),
 ("luan-con-so-trong-mo","Luận Con Số Trong Mơ","Luận con số trong mơ, giấc mơ ứng với con số nào",
  "Nhập giấc mơ của bạn để xem con số gợi ý theo luận giải dân gian đi kèm từng giấc mơ.",
  "Dân gian có thói quen luận con số may mắn từ giấc mơ. Công cụ này tra con số theo đúng giấc mơ bạn gặp trong từ điển giải mộng."),
 ("tim-que-menh","Tìm Quẻ Mệnh","Tìm quẻ mệnh, cung phi theo năm sinh và giới tính",
  "Tra quẻ mệnh (cung phi bát trạch) của bạn theo năm sinh và giới tính, kèm bảng 8 hướng tốt xấu.",
  "Quẻ mệnh là nền tảng của bát trạch, quyết định bạn thuộc Đông tứ mệnh hay Tây tứ mệnh và hợp với những hướng nào."),
 ("gieo-que-xi-ngau","Gieo Quẻ Xí Ngầu","Gieo quẻ xí ngầu, lấy quẻ Kinh Dịch bằng xúc xắc",
  "Gieo 3 lượt xúc xắc để lấy quẻ thượng, quẻ hạ và hào động, cách gieo quẻ nhanh và vui.",
  "Ngoài đồng xu, xúc xắc cũng được dùng để gieo quẻ Kinh Dịch theo tổng điểm, hợp khi bạn muốn có quẻ ngay để suy ngẫm."),
 ("tim-nien-menh","Tìm Niên Mệnh","Tìm niên mệnh, mệnh nạp âm theo năm sinh là mệnh gì",
  "Nhập năm sinh để biết tuổi can chi và niên mệnh nạp âm của bạn thuộc hành nào trong ngũ hành.",
  "Niên mệnh là mệnh theo năm sinh trong lục thập hoa giáp, là thông tin nền cho hầu hết các tra cứu phong thủy theo tuổi."),
 ("giai-ma-diem-bao","Giải Mã Điềm Báo","Giải mã điềm báo trong đời sống: nháy mắt, hắt xì, chim vào nhà",
  "Tra ý nghĩa hơn 30 điềm báo dân gian thường gặp như nháy mắt, hắt xì theo giờ, chim bay vào nhà, vỡ gương.",
  "Điềm báo là mảng quan niệm dân gian phong phú, từ cái nháy mắt đến con chim bay vào nhà đều có lời giải truyền miệng riêng."),
 ("xem-cung-hoang-dao","Xem Cung Hoàng Đạo","Xem cung hoàng đạo theo ngày sinh, tính cách 12 cung",
  "Nhập ngày sinh để biết bạn thuộc cung hoàng đạo nào và luận giải tính cách, sự nghiệp, tình duyên của cung đó.",
  "12 cung hoàng đạo chia theo ngày sinh dương lịch, mỗi cung mang một hành và một nhóm tính cách đặc trưng."),
 ("xem-la-so-tu-tru","Xem Lá Số Tứ Trụ","Xem lá số tứ trụ bát tự, cân bằng ngũ hành theo ngày giờ sinh",
  "Lập lá số tứ trụ từ ngày giờ sinh: 4 trụ năm tháng ngày giờ, nạp âm từng trụ và phân tích cân bằng ngũ hành, vượng nhược của nhật chủ.",
  "Tứ trụ bát tự là hệ thống luận mệnh dựa trên can chi của giờ, ngày, tháng, năm sinh, trọng tâm là sự cân bằng ngũ hành quanh nhật chủ."),
]
manifest = []
for slug, title, seo_title, intro, why in TOOLS:
    body = f'''<div class="ptv-page">
<div class="ptv-hero"><span class="ptv-hero-badge">ỨNG DỤNG PHONG THỦY MIỄN PHÍ</span><h1>{title}</h1><p>{intro}</p></div>

<p>{why}</p>

[ptv_tool slug="{slug}"]

<h2>Lưu ý khi sử dụng</h2>
<p>Kết quả của công cụ mang tính tham khảo theo các hệ thống luận giải truyền thống và giải trí văn hóa. Bạn nên dùng như một gợi ý để suy ngẫm thêm trước các quyết định, và luôn ưu tiên thông tin thực tế, lời khuyên chuyên môn và判断 của chính mình trong các việc quan trọng như sức khỏe, tài chính và hôn nhân.</p>
</div>
'''
    fname = f'page-{slug}.html'
    io.open(fname, 'w', encoding='utf-8').write(body)
    manifest.append({'slug': slug, 'title': title, 'seoTitle': seo_title, 'seoDesc': intro, 'file': fname})
full = json.load(io.open('tools-manifest.json', encoding='utf-8'))
json.dump(full + manifest, io.open('tools-manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('manifest total:', len(full) + len(manifest))
