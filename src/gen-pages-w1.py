# -*- coding: utf-8 -*-
"""Sinh trang Page cho cac cong cu dot 1 + manifest."""
import json, io, os

TOOLS = [
 ("xem-huong-ban-tho","Xem Hướng Bàn Thờ","Xem hướng bàn thờ theo tuổi gia chủ tốt xấu chuẩn phong thủy",
  "Tra cứu hướng đặt bàn thờ theo tuổi và cung mệnh của gia chủ: hướng nào tốt, hướng nào cần tránh, kèm bảng sao bát trạch đầy đủ.",
  "Bàn thờ là nơi trang trọng nhất trong nhà, hướng bàn thờ nên quay về hướng tốt của gia chủ theo bát trạch để đón khí lành cho việc thờ cúng.",
  "Công cụ tính cung mệnh của gia chủ từ năm sinh và giới tính, sau đó tra bảng du niên bát trạch để tìm các hướng ứng với sao tốt như Sinh Khí, Thiên Y, Diên Niên và Phục Vị.",
  "Hướng bàn thờ được tính là hướng mặt bàn thờ nhìn ra, tức hướng từ trong nhà nhìn theo hướng người đứng khấn nhìn tới. Bạn nên đo bằng la bàn hoặc ứng dụng la bàn trên điện thoại tại vị trí đặt bàn thờ.",
  "Nếu nhà đã xây cố định, hướng bàn thờ nên ưu tiên tựa lưng vào tường vững và quay về hướng tốt nhất có thể trong điều kiện thực tế, không nhất thiết phải đúng hướng tốt tuyệt đối."),
 ("xem-huong-bep-nau","Xem Hướng Bếp Nấu","Xem hướng bếp nấu theo tuổi, tọa hung hướng cát chuẩn phong thủy",
  "Tra hướng đặt bếp theo nguyên tắc tọa hung hướng cát dựa trên cung mệnh của gia chủ, kèm bảng 8 hướng tốt xấu chi tiết.",
  "Bếp là nơi giữ lửa và tài lộc của gia đình. Phong thủy bếp nấu có nguyên tắc riêng khác với hướng nhà, gọi là tọa hung hướng cát.",
  "Từ năm sinh và giới tính, công cụ tính cung mệnh của gia chủ, liệt kê các hướng xấu để đặt vị trí bếp trấn áp, và các hướng tốt để cửa bếp quay về.",
  "Cửa bếp được hiểu là mặt trước của bếp, hướng người nấu đứng quay mặt tới khi nấu. Với bếp từ và bếp hồng ngoại, lấy hướng mặt bếp nơi đặt nồi.",
  "Ngoài hướng, bếp nên tránh đặt đối diện cửa nhà vệ sinh, tránh đặt dưới xà ngang và nên giữ khu vực bếp khô ráo, sáng sủa."),
 ("xem-huong-giuong-ngu","Xem Hướng Giường Ngủ","Xem hướng giường ngủ, hướng đầu giường hợp tuổi tốt cho sức khỏe",
  "Tra hướng kê giường và hướng đầu giường hợp cung mệnh của người ngủ, giúp giấc ngủ sâu và sức khỏe ổn định.",
  "Một phần ba đời người dành cho giấc ngủ, nên hướng giường ngủ được xem là yếu tố phong thủy ảnh hưởng trực tiếp đến sức khỏe và tinh thần.",
  "Công cụ tính cung mệnh theo năm sinh và giới tính của người ngủ, sau đó gợi ý các hướng tốt để quay đầu giường, ưu tiên sao Thiên Y chủ về sức khỏe.",
  "Hướng giường được tính theo hướng đầu giường, tức hướng đầu người nằm chỉ về. Phòng ngủ của vợ chồng thường lấy theo tuổi của chồng hoặc người trụ cột.",
  "Đầu giường nên tựa tường vững, tránh kê sát cửa sổ, tránh đối diện thẳng cửa phòng và gương soi chiếu vào giường."),
 ("xem-huong-nha-tot-xau","Xem Hướng Nhà Tốt Xấu","Xem hướng nhà tốt xấu theo tuổi gia chủ, tra sao bát trạch của hướng nhà",
  "Nhập năm sinh và hướng nhà để biết hướng nhà thuộc sao tốt hay xấu với gia chủ, kèm danh sách hướng nhà hợp tuổi thay thế.",
  "Hướng nhà hợp tuổi là câu hỏi đầu tiên khi mua nhà hoặc xây nhà. Mỗi người có 4 hướng tốt và 4 hướng xấu theo cung mệnh của mình.",
  "Công cụ đối chiếu hướng nhà bạn chọn với bảng du niên của cung mệnh gia chủ, cho biết sao chủ của hướng đó và mức độ tốt xấu.",
  "Hướng nhà được tính từ trong nhà nhìn ra cửa chính. Với chung cư, nhiều trường phái lấy hướng cửa chính của căn hộ, bạn nên thống nhất một cách tính khi tra cứu.",
  "Nhà hướng xấu không phải là không ở được. Nếu đã ở ổn định, có thể hóa giải bằng cách bố trí bàn thờ, bếp và giường ngủ về các hướng tốt của gia chủ."),
 ("xem-phong-thuy-nha","Xem Phong Thủy Nhà","Xem phong thủy nhà ở theo tuổi gia chủ, gợi ý bố trí bàn thờ, bếp, giường ngủ",
  "Luận phong thủy tổng thể cho ngôi nhà theo tuổi gia chủ: đánh giá hướng nhà và gợi ý bố trí từng khu vực theo bát trạch.",
  "Trang này gộp nhiều tra cứu phong thủy nhà ở vào một kết quả: cung mệnh của gia chủ, sao của hướng nhà và gợi ý bố trí cho từng phòng.",
  "Từ năm sinh, giới tính và hướng nhà, công cụ tính cung mệnh bát trạch rồi gợi ý hướng bàn thờ, vị trí bếp, hướng giường ngủ và khu vực nên đặt nhà vệ sinh.",
  "Kết quả theo phái bát trạch, phù hợp để tham khảo khi mua nhà, sửa nhà hoặc sắp xếp lại nội thất. Việc xây mới trên đất rộng nên kết hợp thêm đo đạc la bàn thực địa.",
  "Nếu hướng nhà xấu, thứ tự ưu tiên hóa giải thường là bàn thờ và giường ngủ quay về hướng tốt, bếp đặt tọa hung hướng cát, sau đó mới đến các vật phẩm phong thủy."),
 ("xem-tuoi-xay-nha","Xem Tuổi Xây Nhà","Xem tuổi xây nhà, kiểm tra tam tai, kim lâu, hoang ốc và gợi ý mượn tuổi",
  "Nhập năm sinh và năm định xây nhà để kiểm tra tam tai, kim lâu, hoang ốc, kèm gợi ý tuổi mượn động thổ khi năm xây phạm hạn.",
  "Trước khi động thổ, người Việt thường xem tuổi gia chủ có phạm tam tai, kim lâu hay hoang ốc trong năm xây hay không.",
  "Công cụ tính tuổi âm lịch của gia chủ vào năm xây, kiểm tra lần lượt 3 yếu tố, giải thích rõ từng mục và gợi ý danh sách tuổi có thể mượn nếu năm xây không đẹp.",
  "Tuổi xem xây nhà tính theo tuổi âm lịch, tức tuổi mụ, bằng năm xây trừ năm sinh cộng một. Người đứng tên động thổ thường là gia chủ nam, hoặc người trụ cột của gia đình.",
  "Mượn tuổi chỉ là giải pháp khi năm xây phạm hạn mà tiến độ không thể dời. Người cho mượn tuổi nên khỏe mạnh, gia đạo êm ấm và không đang chịu tang."),
 ("thuoc-lo-ban","Thước Lỗ Ban","Thước Lỗ Ban online, tra kích thước đẹp cho cửa, bàn ghế, bàn thờ",
  "Nhập kích thước theo cm để tra cung tốt xấu trên cả 3 loại thước Lỗ Ban: thước 52,2 cm cho cửa, 42,9 cm cho nội thất và 38,8 cm cho bàn thờ.",
  "Thước Lỗ Ban là thước phong thủy chia thành các cung tốt xấu, dùng để chọn kích thước cửa, cổng, bàn ghế và bàn thờ sao cho rơi vào cung đẹp.",
  "Bạn chỉ cần nhập kích thước tính bằng centimet, công cụ sẽ cho biết kích thước đó rơi vào cung nào trên từng loại thước và cung đó tốt hay xấu.",
  "Cửa đi và cổng dùng thước 52,2 cm; bàn ghế, giường, bếp dùng thước 42,9 cm; bàn thờ và mộ phần dùng thước 38,8 cm. Đo theo kích thước thông thủy, tức phần lọt sáng sử dụng được.",
  "Nếu kích thước rơi vào cung xấu nhưng gần ranh giới, chỉ cần nới hoặc thu vài milimet là sang được cung tốt, đây là cách thợ thi công vẫn làm trong thực tế."),
 ("sim-phong-thuy","Sim Phong Thủy","Sim phong thủy, chấm điểm sim số điện thoại theo mệnh và 4 số cuối",
  "Luận sim số điện thoại theo số nút, quẻ 81 số của 4 số cuối và ngũ hành của dãy số đối chiếu với mệnh của bạn.",
  "Số điện thoại theo ta đi nhiều năm, nên việc chọn sim hợp mệnh được nhiều người quan tâm khi mua sim mới hoặc đổi số.",
  "Công cụ chấm điểm sim dựa trên 3 yếu tố: số nút của toàn dãy số, quẻ cát hung của 4 số cuối theo bảng 81 số, và quan hệ ngũ hành giữa dãy số với mệnh của người dùng nếu bạn nhập năm sinh.",
  "Số nút là tổng các chữ số của dãy sim lấy chữ số cuối, nút càng cao thường được coi là càng đẹp. Đây là quan niệm dân gian về sim số, mang tính tham khảo khi chọn số dễ nhớ, dễ đọc.",
  "Một dãy sim đẹp trước hết nên dễ nhớ và hợp ngân sách. Yếu tố phong thủy chỉ nên là tiêu chí phụ sau giá và nhà mạng."),
 ("boi-4-so-cuoi-dien-thoai","Bói 4 Số Cuối Điện Thoại","Bói 4 số cuối điện thoại, luận quẻ cát hung theo cách chia 80",
  "Nhập 4 số cuối điện thoại để luận quẻ cát hung theo cách chia 80 phổ biến, kèm số nút và ngũ hành từng chữ số.",
  "Cách bói 4 số cuối điện thoại rất phổ biến khi chọn sim: lấy 4 số cuối chia cho 80, phần dư ứng với một quẻ số mang ý nghĩa cát hung riêng.",
  "Công cụ tính phần dư của 4 số cuối khi chia 80 rồi tra bảng 81 quẻ số để cho biết mức cát hung và lời luận của quẻ, kèm số nút của 4 chữ số.",
  "Nếu 4 số cuối chia hết cho 80 thì phần dư được tính là 80. Các số có nhiều số cuối đẹp như 68, 79, 86 vẫn nên luận theo quẻ tổng của cả 4 số thay vì chỉ nhìn 2 số cuối.",
  "Kết quả chỉ dựa trên 4 số cuối. Muốn xét cả dãy số và đối chiếu mệnh người dùng, bạn hãy dùng công cụ Sim phong thủy."),
 ("xem-tuoi-vo-chong","Xem Tuổi Vợ Chồng","Xem tuổi vợ chồng hợp nhau không, chấm điểm theo can chi, nạp âm và cung phi",
  "Nhập năm sinh của chồng và vợ để xem mức độ hợp nhau qua 4 yếu tố: địa chi, thiên can, nạp âm ngũ hành và cung phi bát trạch.",
  "Xem tuổi vợ chồng là việc nhiều cặp đôi làm trước khi cưới, để biết hai tuổi có những điểm hợp và xung nào cần lưu ý.",
  "Công cụ chấm điểm tổng hợp trên thang 10 từ quan hệ địa chi như tam hợp, lục hợp hay lục xung, thiên can hợp, quan hệ sinh khắc của nạp âm và sao du niên giữa hai cung phi.",
  "Tuổi xung nhau không có nghĩa là không nên kết hôn. Rất nhiều cặp lục xung vẫn sống hạnh phúc nhờ biết nhường nhịn, phong thủy chỉ chỉ ra điểm cần chú ý.",
  "Nếu kết quả thấp, hai bạn có thể hóa giải bằng cách chọn năm sinh con hợp cả bố và mẹ, bố trí phòng ngủ hợp tuổi chồng và giữ thói quen bàn bạc trước khi quyết việc lớn."),
 ("chon-nghe-hop-tuoi","Chọn Nghề Hợp Tuổi","Chọn nghề nghiệp hợp tuổi theo mệnh ngũ hành nạp âm",
  "Nhập năm sinh để biết mệnh nạp âm và nhóm nghề nghiệp hợp với hành mệnh của bạn, kèm giải thích vì sao hợp.",
  "Mỗi hành mệnh có nhóm nghề tương ứng với tính chất của hành đó. Chọn nghề hợp mệnh giúp bạn phát huy đúng sở trường tính cách của mình.",
  "Công cụ xác định mệnh nạp âm từ năm sinh, sau đó gợi ý nhóm nghề theo hành bản mệnh và hành tương sinh hỗ trợ.",
  "Nghề hợp tuổi chỉ là gợi ý định hướng. Năng lực, sở thích và cơ hội thực tế vẫn là yếu tố quyết định khi chọn nghề.",
  "Nếu đang làm nghề chưa hợp mệnh, bạn có thể bổ trợ bằng màu sắc trang phục, hướng bàn làm việc và vật phẩm hợp mệnh thay vì đổi nghề ngay."),
 ("chon-mau-sac-hop-tuoi","Chọn Màu Sắc Hợp Tuổi","Chọn màu sắc hợp tuổi theo mệnh, màu tương sinh và màu nên tránh",
  "Tra màu hợp, màu tương sinh và màu nên tránh theo mệnh nạp âm của năm sinh, ứng dụng cho trang phục, xe cộ và nội thất.",
  "Màu sắc là cách bổ trợ phong thủy đơn giản nhất vì ai cũng dùng màu mỗi ngày qua quần áo, xe cộ và đồ dùng.",
  "Công cụ xác định hành mệnh từ năm sinh, liệt kê màu thuộc hành bản mệnh, màu của hành sinh cho mệnh và màu của hành khắc mệnh cần hạn chế.",
  "Màu hợp nhất là màu của hành sinh cho mệnh của bạn, vì được hỗ trợ thêm. Màu bản mệnh hợp ở mức thứ hai, còn màu khắc mệnh nên giảm dùng ở các vật lớn như xe và sơn nhà.",
  "Không cần kiêng tuyệt đối màu khắc mệnh. Chỉ cần giảm tỷ lệ dùng và phối thêm màu tương sinh để cân bằng là được."),
 ("tim-nguoi-hop-tuoi","Tìm Người Hợp Tuổi","Tìm người hợp tuổi làm ăn, kết hôn theo can chi và nạp âm",
  "Nhập năm sinh của bạn để xem danh sách 10 tuổi hợp nhất cho làm ăn, kết hôn hoặc quan hệ bạn bè đối tác.",
  "Hợp tuổi trong làm ăn và hôn nhân được xét qua quan hệ giữa địa chi, thiên can và nạp âm của hai người.",
  "Công cụ quét các năm sinh từ 1950 đến 2012, chấm điểm từng tuổi theo tam hợp, lục hợp, can hợp và quan hệ sinh khắc của mệnh, rồi xếp hạng 10 tuổi hợp nhất.",
  "Kết quả là danh sách tham khảo để bạn ưu tiên tìm hiểu. Sự hòa hợp thật sự vẫn phụ thuộc vào tính cách và cách hai bên cư xử với nhau.",
  "Nếu người bạn quan tâm không nằm trong nhóm hợp nhất, hãy xem riêng công cụ Xem tuổi vợ chồng để biết điểm xung cụ thể và cách hóa giải."),
 ("chon-trang-suc-hop-tuoi","Chọn Trang Sức Hợp Tuổi","Chọn trang sức, đá quý hợp tuổi theo mệnh ngũ hành",
  "Tra trang sức và loại đá hợp với mệnh của bạn theo năm sinh: chất liệu, màu đá và ý nghĩa hỗ trợ.",
  "Trang sức đeo hằng ngày là vật phẩm phong thủy gần gũi nhất, chọn đúng chất liệu và màu đá hợp mệnh giúp tăng sự tự tin và vượng khí.",
  "Công cụ xác định hành mệnh từ năm sinh rồi gợi ý chất liệu trang sức và nhóm đá phù hợp theo hành bản mệnh và hành tương sinh.",
  "Đá tự nhiên được cho là mang năng lượng tốt hơn đá nhân tạo. Dù chọn loại nào, yếu tố quan trọng nhất vẫn là bạn thích và đeo thường xuyên.",
  "Vòng tay và nhẫn nên đeo vừa tay, tránh quá chật gây cản trở lưu thông và tâm lý không thoải mái khi sử dụng lâu dài."),
 ("chon-cay-trong-hop-tuoi","Chọn Cây Trồng Hợp Tuổi","Chọn cây phong thủy hợp tuổi, hợp mệnh để bàn làm việc và trong nhà",
  "Gợi ý cây trồng hợp với mệnh của bạn theo năm sinh, kèm gợi ý chậu và vị trí đặt cây.",
  "Cây xanh vừa làm đẹp không gian vừa là vật phẩm phong thủy phổ biến nhất trong nhà và nơi làm việc.",
  "Công cụ xác định hành mệnh từ năm sinh, gợi ý nhóm cây hợp hành mệnh và loại chậu hỗ trợ thêm hành tương sinh.",
  "Cây hợp tuổi chỉ phát huy tác dụng khi được chăm sống khỏe. Cây héo úa đặt trong nhà lại tạo cảm giác trì trệ, nên hãy chọn cây dễ chăm nếu bạn bận rộn.",
  "Người mệnh Thủy có thể trồng cây thủy sinh, người mệnh Thổ nên dùng chậu gốm đất nung, đó là cách kết hợp cả cây và chậu theo ngũ hành."),
 ("chon-quan-ao-hop-tuoi","Chọn Quần Áo Hợp Tuổi","Chọn quần áo hợp tuổi theo mệnh, màu sắc và chất liệu trang phục",
  "Tra màu sắc, chất liệu và phong cách trang phục hợp với mệnh của bạn theo năm sinh, ứng dụng cho đi làm và dịp quan trọng.",
  "Ăn mặc hợp mệnh là cách nhiều người áp dụng trước những dịp quan trọng như phỏng vấn, ký kết hay khai trương.",
  "Công cụ xác định hành mệnh từ năm sinh, gợi ý tông màu chủ đạo, chất liệu và phong cách trang phục hợp hành mệnh và hành tương sinh.",
  "Trong ngày thường, chỉ cần ưu tiên màu hợp mệnh cho trang phục chính. Vào dịp quan trọng, bạn có thể phối thêm phụ kiện thuộc hành sinh cho mệnh.",
  "Trang phục trước hết cần vừa vặn và phù hợp hoàn cảnh. Phong thủy màu sắc là lớp hỗ trợ thêm sự tự tin, không thay thế được sự chỉn chu."),
]

manifest = []
os.makedirs('pages-w1', exist_ok=True)
for slug, title, seo_title, intro, why, how, faq1, faq2 in TOOLS:
    seo_desc = intro
    body = f'''<div class="ptv-page">
<div class="ptv-hero"><span class="ptv-hero-badge">ỨNG DỤNG PHONG THỦY MIỄN PHÍ</span><h1>{title}</h1><p>{intro}</p></div>

<p>{why}</p>

[ptv_tool slug="{slug}"]

<h2>Công cụ tính như thế nào</h2>
<p>{how}</p>

<h2>Câu hỏi thường gặp</h2>
<p>{faq1}</p>
<p>{faq2}</p>
</div>
'''
    fname = f'page-{slug}.html'
    with io.open(fname, 'w', encoding='utf-8') as f: f.write(body)
    manifest.append({'slug': slug, 'title': title, 'seoTitle': seo_title, 'seoDesc': seo_desc, 'file': fname})
with io.open('tools-manifest-w1.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=1)
print('generated', len(manifest), 'pages')
