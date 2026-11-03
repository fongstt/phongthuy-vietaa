# -*- coding: utf-8 -*-
import json, io
TOOLS = [
 ("xem-ngay-mua-xe","Xem Ngày Mua Xe","Xem ngày tốt mua xe, nhận xe theo tuổi gia chủ",
  "Tra ngày tốt mua xe và nhận xe trong tháng theo tuổi của bạn, tránh ngày xung tuổi, ngày kỵ và ngày trực xấu.",
  "Ngày mua xe, ngày ký hợp đồng và ngày nhận xe được nhiều người chọn kỹ vì chiếc xe gắn bó lâu dài và liên quan trực tiếp đến an toàn đi lại.",
  "Công cụ chấm điểm từng ngày trong tháng bạn chọn dựa trên hoàng đạo hắc đạo, trực của ngày, quan hệ giữa ngày và tuổi của bạn, đồng thời loại các ngày Nguyệt kỵ và Tam nương."),
 ("xem-ngay-mua-nha","Xem Ngày Mua Nhà","Xem ngày tốt mua nhà, ký hợp đồng và nhận nhà theo tuổi",
  "Tra ngày tốt để mua nhà, ký hợp đồng mua bán và nhận bàn giao nhà theo tuổi gia chủ trong tháng bạn chọn.",
  "Mua nhà là việc lớn của đời người, chọn được ngày đẹp để ký kết giúp gia chủ yên tâm và mọi thủ tục được cho là hanh thông hơn.",
  "Công cụ chấm điểm từng ngày trong tháng theo hoàng đạo, trực, quan hệ xung hợp với tuổi gia chủ và các ngày kỵ, rồi xếp hạng các ngày tốt nhất kèm giờ hoàng đạo."),
 ("xem-ngay-dong-tho","Xem Ngày Động Thổ","Xem ngày động thổ tốt theo tuổi, tránh ngày xấu khi khởi công",
  "Tra ngày động thổ, khởi công xây dựng tốt theo tuổi gia chủ, kèm lưu ý tam tai, kim lâu, hoang ốc của năm xây.",
  "Lễ động thổ mở đầu cho cả quá trình xây dựng, nên ngày động thổ thường được chọn rất kỹ và phải hợp với tuổi người đứng tên.",
  "Công cụ chấm điểm ngày trong tháng theo hoàng đạo, trực hợp việc động thổ và tuổi gia chủ, đồng thời nhắc lại tình trạng tam tai, kim lâu, hoang ốc của năm đó để bạn cân nhắc mượn tuổi nếu cần."),
 ("xem-ngay-nhap-trach","Xem Ngày Nhập Trạch","Xem ngày nhập trạch, về nhà mới tốt theo tuổi gia chủ",
  "Tra ngày nhập trạch, dọn về nhà mới tốt theo tuổi gia chủ trong tháng, kèm giờ hoàng đạo để làm lễ.",
  "Nhập trạch là ngày chính thức dọn về nhà mới và làm lễ cúng gia tiên, được coi là ngày khởi đầu cuộc sống tại nơi ở mới.",
  "Công cụ chấm điểm từng ngày trong tháng dựa trên hoàng đạo, trực hợp việc nhập trạch, quan hệ với tuổi gia chủ và các ngày kỵ truyền thống."),
 ("xem-ngay-mo-hang","Xem Ngày Mở Hàng","Xem ngày mở hàng, khai trương tốt theo tuổi chủ cơ sở",
  "Tra ngày mở hàng, khai trương cửa hàng và bắt đầu kinh doanh tốt theo tuổi của chủ cơ sở trong tháng bạn chọn.",
  "Ngày mở hàng đẹp được tin là giúp buôn may bán đắt cả kỳ kinh doanh, nên các chủ cửa hàng thường xem ngày rất kỹ trước khi khai trương.",
  "Công cụ ưu tiên các ngày hoàng đạo có trực Khai, Thành, Mãn, tránh ngày xung tuổi người chủ và các ngày Tam nương, Nguyệt kỵ."),
 ("xem-ngay-cuoi-hoi","Xem Ngày Cưới Hỏi","Xem ngày cưới hỏi tốt theo tuổi cô dâu và chú rể",
  "Nhập tuổi chú rể và cô dâu để tra ngày cưới tốt trong tháng, tránh ngày xung với cả hai tuổi.",
  "Ngày cưới là ngày trọng đại, gia đình hai họ thường chọn ngày hợp tuổi cả cô dâu và chú rể để lễ cưới diễn ra suôn sẻ và hôn nhân bền lâu.",
  "Công cụ chấm điểm ngày trong tháng theo hoàng đạo, trực hợp việc cưới hỏi và quan hệ xung hợp của ngày với tuổi của cả chú rể lẫn cô dâu."),
 ("xem-ngay-xuat-hanh","Xem Ngày Xuất Hành","Xem ngày xuất hành tốt xấu, giờ hoàng đạo và hướng xuất hành theo ngày",
  "Chọn một ngày cụ thể để xem ngày đó có tốt cho việc xuất hành không, kèm giờ hoàng đạo và hướng đón Quý nhân.",
  "Trước chuyến đi xa hoặc chuyến công tác quan trọng, nhiều người xem ngày xuất hành để chọn ngày và giờ khởi hành cho yên tâm.",
  "Bạn nhập ngày dương lịch muốn đi, công cụ đổi sang âm lịch, luận can chi ngày, chấm điểm theo tuổi của bạn và gợi ý giờ hoàng đạo cùng hướng xuất hành đón Quý nhân theo can ngày."),
 ("xem-gio-xuat-hanh","Xem Giờ Xuất Hành","Xem giờ hoàng đạo xuất hành theo ngày, bảng 12 giờ trong ngày",
  "Tra bảng giờ hoàng đạo và hắc đạo của một ngày bất kỳ để chọn giờ khởi hành, xuất hành đẹp nhất.",
  "Cùng một ngày nhưng giờ tốt giờ xấu khác nhau, nên người cần đi xa thường xem thêm giờ hoàng đạo để khởi hành.",
  "Công cụ tính can chi của ngày bạn chọn, sau đó tra bảng giờ hoàng đạo theo địa chi ngày và liệt kê đủ 12 giờ kèm khung giờ cụ thể."),
 ("xem-nam-sinh-con","Xem Năm Sinh Con","Xem năm sinh con hợp tuổi bố mẹ theo can chi và nạp âm",
  "Nhập năm sinh của bố và mẹ để xếp hạng các năm sinh con sắp tới theo mức độ hợp tuổi với cả hai.",
  "Nhiều gia đình có kế hoạch sinh con thường xem trước năm nào con hợp tuổi bố mẹ để gia đạo thêm hòa thuận.",
  "Công cụ xét từng năm từ nay đến năm bạn chọn, chấm điểm dựa trên quan hệ địa chi như tam hợp, lục xung và quan hệ sinh khắc nạp âm giữa con với từng người bố và mẹ."),
 ("doi-ngay-am-lich","Đổi Ngày Âm Lịch","Đổi ngày âm lịch sang dương lịch và ngược lại, kèm can chi ngày",
  "Đổi qua lại giữa dương lịch và âm lịch Việt Nam, kèm ngày can chi, trực và sao của ngày.",
  "Tra ngày âm dương là nhu cầu hằng ngày để xem giỗ chạp, lễ tết và các ngày quan trọng trong gia đình.",
  "Công cụ dùng thuật toán lịch âm Việt Nam theo múi giờ GMT+7, đổi hai chiều và hiển thị thêm thông tin can chi của ngày sau khi đổi."),
 ("cung-sao-giai-han","Cung Sao Giải Hạn","Xem sao chiếu mệnh và hạn theo tuổi, cách cúng sao giải hạn",
  "Nhập năm sinh và giới tính để xem sao chiếu mệnh và hạn của một năm bất kỳ, kèm cách cúng giải hạn theo dân gian.",
  "Đầu năm, nhiều gia đình xem sao hạn để biết năm nay mình thuộc sao tốt hay sao xấu và làm lễ cúng sao giải hạn cho yên tâm.",
  "Công cụ tính tuổi âm lịch của bạn trong năm muốn xem, tra sao chiếu mệnh theo bảng 9 sao luân phiên theo giới tính và tra hạn trong 8 hạn lớn, kèm hướng dẫn cúng giải hạn của từng sao."),
 ("chon-tuoi-xong-dat","Chọn Tuổi Xông Đất","Chọn tuổi xông đất đầu năm hợp gia chủ và hợp năm mới",
  "Nhập năm sinh gia chủ và năm Tết để xem 10 tuổi xông đất hợp nhất, xét cả quan hệ với gia chủ và với năm mới.",
  "Người đầu tiên bước vào nhà sau giao thừa được tin là ảnh hưởng đến vận khí cả năm của gia đình, nên việc chọn tuổi xông đất rất được coi trọng.",
  "Công cụ chấm điểm các tuổi dựa trên quan hệ địa chi và nạp âm với gia chủ, đồng thời tránh các tuổi xung với chi của năm mới."),
 ("ngay-mo-hang-dau-nam","Ngày Mở Hàng Đầu Năm","Ngày mở hàng đầu năm tốt theo tuổi, từ mùng 1 đến 16 tháng Giêng",
  "Tra ngày mở hàng đầu năm đẹp nhất trong các ngày đầu tháng Giêng theo tuổi của chủ cơ sở kinh doanh.",
  "Mở hàng đầu năm là nghi thức lấy may cho cả năm buôn bán, các chủ cửa hàng thường chọn ngày rất kỹ trong nửa đầu tháng Giêng.",
  "Công cụ chấm điểm các ngày từ mùng 1 đến 16 tháng Giêng của năm Tết bạn chọn theo tuổi của bạn, dựa trên hoàng đạo, trực và các ngày kỵ."),
 ("ngay-xuat-hanh-dau-nam","Ngày Xuất Hành Đầu Năm","Ngày xuất hành đầu năm tốt theo tuổi trong các ngày đầu tháng Giêng",
  "Tra ngày xuất hành đầu năm đẹp nhất từ mùng 1 đến 16 tháng Giêng theo tuổi của bạn, kèm giờ hoàng đạo.",
  "Xuất hành đầu năm là chuyến đi đầu tiên ra khỏi nhà trong năm mới, được tin là mở đầu cho sự hanh thông của cả năm.",
  "Công cụ chấm điểm các ngày đầu tháng Giêng theo tuổi của bạn và gợi ý giờ hoàng đạo cho từng ngày được chọn."),
 ("huong-xuat-hanh-dau-nam","Hướng Xuất Hành Đầu Năm","Hướng xuất hành đầu năm theo can ngày, đón Quý nhân đầu năm mới",
  "Xem hướng xuất hành đón Quý nhân cho 10 ngày đầu năm mới, kèm giờ hoàng đạo của từng ngày.",
  "Ngoài chọn ngày, người xưa còn chọn hướng xuất hành đầu năm để đón khí tốt, phổ biến nhất là hướng Quý nhân theo can của ngày.",
  "Công cụ tính can chi của từng ngày từ mùng 1 đến mùng 10, tra phương Quý nhân của can ngày và đổi sang hướng la bàn để bạn áp dụng ngay."),
 ("li-xi-theo-menh","Lì Xì Theo Mệnh","Lì xì theo mệnh, gợi ý số tiền và con số may mắn đầu năm theo ngũ hành",
  "Nhập năm sinh để biết mệnh và các mức lì xì, con số may mắn hợp mệnh cho dịp đầu năm.",
  "Nhiều người thích chọn mức lì xì có con số hợp mệnh người nhận để lời chúc đầu năm thêm phần ý nghĩa.",
  "Công cụ xác định mệnh nạp âm từ năm sinh, gợi ý nhóm số may mắn theo hành mệnh và hành tương sinh, kèm các mức lì xì tham khảo."),
]
manifest = []
for slug, title, seo_title, intro, why, how in TOOLS:
    body = f'''<div class="ptv-page">
<div class="ptv-hero"><span class="ptv-hero-badge">ỨNG DỤNG PHONG THỦY MIỄN PHÍ</span><h1>{title}</h1><p>{intro}</p></div>

<p>{why}</p>

[ptv_tool slug="{slug}"]

<h2>Công cụ tính như thế nào</h2>
<p>{how}</p>
<p>Các yếu tố được dùng gồm lịch âm Việt Nam, can chi ngày, hoàng đạo hắc đạo theo Thanh Long, 12 trực và các ngày kỵ truyền thống như Nguyệt kỵ, Tam nương. Kết quả mang tính tham khảo theo phong thủy dân gian, bạn nên kết hợp với lịch trình thực tế của gia đình và công việc.</p>
</div>
'''
    fname = f'page-{slug}.html'
    io.open(fname, 'w', encoding='utf-8').write(body)
    manifest.append({'slug': slug, 'title': title, 'seoTitle': seo_title, 'seoDesc': intro, 'file': fname})
manifest.append({'slug': 'van-khan', 'title': 'Văn Khấn', 'seoTitle': 'Văn khấn gia tiên, Thổ Công, Thần Tài và các bài khấn truyền thống', 'seoDesc': 'Tổng hợp các bài văn khấn truyền thống thường dùng: gia tiên ngày rằm mùng một, Thổ Công, Thần Tài, ông Công ông Táo, giao thừa, hóa vàng, tạ mộ và nhập trạch.', 'file': 'content-van-khan.html'})
manifest.append({'slug': 'van-khan-ngay-tet', 'title': 'Văn Khấn Ngày Tết', 'seoTitle': 'Văn khấn ngày Tết: tất niên, giao thừa, mùng 1, hóa vàng và khai trương', 'seoDesc': 'Các bài văn khấn truyền thống dịp Tết Nguyên Đán: tất niên, giao thừa trong nhà, mùng 1 cúng gia tiên, hóa vàng, khai trương mở hàng và lễ chùa đầu năm.', 'file': 'content-van-khan-tet.html'})
w1 = json.load(io.open('tools-manifest-w1.json', encoding='utf-8'))
json.dump(w1 + manifest, io.open('tools-manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('manifest total:', len(w1) + len(manifest))
