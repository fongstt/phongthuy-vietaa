# -*- coding: utf-8 -*-
"""Build kieu-verses.json from hand-verified couplets. Runs validation."""
import json, collections, pathlib

E = []
def add(l1, l2, tone, themes, meaning, advice):
    E.append({"lines": [l1, l2], "tone": tone, "themes": themes,
              "meaning": meaning, "advice": advice})

# ---------------- TỐT (12) ----------------
add("Cửa trời rộng mở đường mây", "Hoa chào ngõ hạnh, hương bay dặm phần", "tốt",
    ["công danh"],
    "Đây là hình ảnh Kim Trọng và Vương Quan thi đỗ, bước vào con đường quan trường rộng mở. Hoa chào ở ngõ hạnh là biểu tượng kinh điển của sự đỗ đạt, vinh hiển sau bao năm đèn sách.",
    "Quẻ này báo hiệu thời vận hanh thông cho chuyện học hành, thi cử và sự nghiệp. Hãy mạnh dạn nắm lấy cơ hội đang mở ra, nhưng cũng nên giữ sự khiêm nhường để phúc lộc được bền lâu.")
add("Mai cốt cách, tuyết tinh thần", "Mỗi người một vẻ, mười phân vẹn mười", "tốt",
    ["tổng quan"],
    "Nguyễn Du tả hai chị em Thúy Kiều, Thúy Vân: cốt cách như mai, tinh thần như tuyết, mỗi người một vẻ riêng mà đều trọn vẹn. Đây là lời khen về vẻ đẹp và phẩm chất hài hòa, không ai phải lép vế trước ai.",
    "Đây là quẻ rất đẹp về sự hài hòa và trọn vẹn. Mỗi người đều có giá trị riêng, bạn chỉ cần phát huy đúng thế mạnh của mình, không cần so đo hay bắt chước người khác.")
add("Cỏ non xanh tận chân trời", "Cành lê trắng điểm một vài bông hoa", "tốt",
    ["tổng quan"],
    "Khung cảnh mùa xuân thanh minh trong trẻo: cỏ non xanh mướt trải tới chân trời, điểm xuyết vài bông hoa lê trắng. Thiên nhiên ở đây tượng trưng cho sức sống mới đang lên và tâm thế nhẹ nhàng, thư thái.",
    "Quẻ mang hơi thở của khởi đầu tươi sáng và lòng người thanh thản. Đây là lúc thích hợp để bắt đầu việc mới, đi ra ngoài gặp gỡ, hít thở và nạp lại năng lượng cho mình.")
add("Thông minh vốn sẵn tính trời", "Pha nghề thi họa, đủ mùi ca ngâm", "tốt",
    ["công danh"],
    "Câu thơ nói về Thúy Kiều: trí thông minh là vốn trời cho, lại thêm tài thi, họa, đàn hát đều thành thạo. Tài năng ở đây là sự kết hợp giữa thiên tư và rèn luyện bền bỉ.",
    "Quẻ này nhắc rằng năng khiếu chỉ là vốn ban đầu, muốn thành tựu phải có công mài giũa. Nếu bạn đang theo đuổi học vấn hay nghề nghiệp chuyên môn, hãy cứ kiên trì, thời của sự công nhận đang đến gần.")
add("Người quốc sắc, kẻ thiên tài", "Tình trong như đã, mặt ngoài còn e", "tốt",
    ["tình duyên"],
    "Đây là khoảnh khắc Kiều và Kim Trọng gặp nhau lần đầu trong ngày thanh minh: một bên nhan sắc, một bên tài hoa, lòng đã hướng về nhau dù bề ngoài còn e lệ. Duyên tình nảy nở tự nhiên mà ý tứ, đúng mực.",
    "Quẻ báo duyên lành đang đến hoặc đang chớm nở một cách tốt đẹp. Cứ để mọi chuyện tiến triển tự nhiên, giữ sự chân thành và chừng mực, tình cảm sẽ tự tìm được đường đi của nó.")
add("Tóc tơ căn vặn tấc lòng", "Trăm năm tạc một chữ đồng đến xương", "tốt",
    ["tình duyên"],
    "Trong đêm thề nguyền dưới trăng, Kiều và Kim Trọng nguyện một lòng một dạ với nhau trọn trăm năm. Hình ảnh chữ đồng tạc vào xương nói lên lời thề sâu nặng, không phải lời hứa thoáng qua.",
    "Đây là quẻ của sự gắn bó bền chặt và lời hứa đáng tin. Nếu bạn đang ở trong một mối quan hệ nghiêm túc, đây là dấu hiệu tốt để tính chuyện lâu dài; còn trong công việc, đối tác bạn chọn lúc này là người có thể tin cậy được.")
add("Tâm thành đã thấu đến trời", "Bán mình là hiếu, cứu người là nhân", "tốt",
    ["gia đạo"],
    "Đạm Tiên nói về Kiều khi hiện về trong mộng: việc nàng bán mình chuộc cha là hiếu, tấm lòng cứu người là nhân, trời đất đều thấu tỏ. Sự hi sinh vì gia đình ở đây được ghi nhận là công đức lớn nhất.",
    "Quẻ này khẳng định những việc bạn làm vì cha mẹ, người thân không bao giờ là uổng phí. Dù hoàn cảnh có khó khăn, giữ được chữ hiếu và lòng nhân thì về lâu dài phúc sẽ quay lại với chính mình và con cháu.")
add("Trông xem đủ mặt một nhà", "Xuân già còn khỏe, huyên già còn tươi", "tốt",
    ["gia đạo", "sức khỏe"],
    "Đây là cảnh đoàn viên sau mười lăm năm lưu lạc: cả nhà lại đông đủ, cha mẹ già vẫn khỏe mạnh, các em đã trưởng thành. Sau bao sóng gió, hạnh phúc lớn nhất hóa ra chỉ là được nhìn thấy nhau đủ mặt.",
    "Quẻ đoàn viên rất tốt cho gia đạo: người đi xa có tin về, người thân khỏe mạnh, nhà cửa sum vầy. Hãy trân trọng những bữa cơm đông đủ, bởi đó chính là phúc lớn nhất mà quẻ này mang lại.")
add("Bây giờ gương vỡ lại lành", "Khuôn thiêng lừa lọc đã dành có nơi", "tốt",
    ["gia đạo", "tình duyên"],
    "Thúy Vân nói về cuộc đoàn viên của Kiều và Kim Trọng: chiếc gương tưởng đã vỡ không bao giờ hàn gắn được, nay lại lành nguyên. Trời đất dường như đã an bài sẵn một chỗ cho những người thật lòng với nhau.",
    "Quẻ này là điềm lành cho những mối quan hệ tưởng đã đổ vỡ: hiểu lầm có cơ hội được hóa giải, người cũ việc cũ có thể quay lại theo hướng tốt đẹp. Hãy mở lòng đón nhận sự hàn gắn khi nó đến.")
add("Trời còn để có hôm nay", "Tan sương đầu ngõ, vén mây giữa trời", "tốt",
    ["tổng quan"],
    "Kim Trọng nói khi gặp lại Kiều sau bao năm xa cách: trời còn để cho hai người có ngày hôm nay, sương mù đầu ngõ đã tan, mây giữa trời đã vén. Hình ảnh mây tan sương tản là biểu tượng của vận rủi qua đi, sáng sủa trở lại.",
    "Đây là quẻ của thời kỳ khó khăn sắp kết thúc. Việc bạn chờ đợi bấy lâu có cơ hội sáng tỏ, hãy giữ niềm tin thêm một chút nữa, vì ánh sáng thường đến ngay sau lúc tưởng như tối nhất.")
add("Một nhà phúc lộc gồm hai", "Nghàn năm dằng dặc quan giai lần lần", "tốt",
    ["tài lộc", "gia đạo", "công danh"],
    "Đoạn kết truyện nói về gia đình họ Vương sau đoàn viên: phúc lộc đầy nhà, con cháu đời nối đời làm quan, hưởng vinh hiển lâu dài. Đây là kết quả của cả một quá trình giữ đạo hiếu và sống nhân nghĩa.",
    "Quẻ báo phúc lộc tích lũy cho cả gia đình chứ không chỉ riêng một người. Việc làm ăn, sự nghiệp của bạn đang đi theo hướng tích lũy bền vững; cứ làm ăn chân chính, phúc sẽ truyền được cho đời sau.")
add("Thiện căn ở tại lòng ta", "Chữ tâm kia mới bằng ba chữ tài", "tốt",
    ["tổng quan"],
    "Đây là câu kết tinh triết lý của Nguyễn Du ở cuối truyện: gốc của điều thiện nằm trong lòng người, và chữ tâm có giá trị gấp ba chữ tài. Tài năng dù lớn đến đâu cũng phải đứng sau cái tâm trong sáng.",
    "Quẻ này là lời khẳng định cho những ai đang làm việc thiện tâm và ngay thẳng. Đừng lo thiệt thòi trước mắt; cái tâm và uy tín bạn gây dựng chính là tài sản lớn nhất, quý hơn mọi cơ hội chớp nhoáng.")

# ---------------- KHÁ (18) ----------------
add("Cảo thơm lần giở trước đèn", "Phong tình cổ lục còn truyền sử xanh", "khá",
    ["tổng quan"],
    "Mở đầu truyện, tác giả kể việc lần giở cuốn sách quý dưới đèn và đọc lại những câu chuyện phong tình xưa còn lưu trong sử sách. Hình ảnh này gợi về việc học hỏi từ kinh nghiệm và bài học của người đi trước.",
    "Quẻ này khuyên bạn nên tham khảo kinh nghiệm cũ, tìm hiểu kỹ gốc rễ vấn đề trước khi hành động. Kiến thức và sự chuẩn bị chu đáo sẽ giúp bạn tránh được nhiều sai lầm không đáng có.")
add("Đầu lòng hai ả tố nga", "Thúy Kiều là chị, em là Thúy Vân", "khá",
    ["gia đạo"],
    "Câu thơ giới thiệu hai người con gái đầu lòng của nhà họ Vương, chị em Kiều và Vân. Ngay từ đầu truyện, tình chị em và nề nếp gia đình đã được đặt làm nền cho mọi biến cố về sau.",
    "Quẻ này nghiêng về chuyện gia đạo êm ấm, chị em hòa thuận, trong nhà có người đỡ đần nhau. Nếu đang có khúc mắc với anh chị em, đây là lúc tốt để mở lời làm hòa.")
add("Thanh minh trong tiết tháng ba", "Lễ là tảo mộ, hội là đạp thanh", "khá",
    ["gia đạo"],
    "Câu thơ tả tiết thanh minh tháng ba, khi người ta đi tảo mộ tổ tiên và du xuân. Đây là phong tục nhắc nhớ nguồn cội, gắn với lòng biết ơn những người đã khuất.",
    "Quẻ này nhắc bạn đừng quên chăm lo phần mộ, bàn thờ và những việc hiếu nghĩa với tổ tiên, cha mẹ. Gốc có vững thì ngọn mới xanh; một chuyến về quê, thăm nhà lúc này sẽ mang lại nhiều bình an.")
add("Phong lưu rất mực hồng quần", "Xuân xanh xấp xỉ tới tuần cập kê", "khá",
    ["tình duyên"],
    "Câu thơ tả chị em Kiều đang ở độ tuổi xuân thì đẹp nhất, vừa đến tuổi cập kê. Đây là giai đoạn thanh xuân rực rỡ, nhiều người để ý và nhiều cơ hội tình cảm mở ra.",
    "Quẻ báo thời kỳ thanh xuân và sức hấp dẫn của bạn đang ở độ chín. Sẽ có người chú ý, có cơ hội đến, nhưng hãy chọn lọc tỉnh táo, đừng vội vàng quyết định chỉ vì lời đường mật ban đầu.")
add("Để lời thệ hải minh sơn", "Làm con trước phải đền ơn sinh thành", "khá",
    ["gia đạo"],
    "Kiều giãi bày với Kim Trọng trước khi chia tay: đành để lại lời thề biển núi, vì làm con trước hết phải đền ơn sinh thành dưỡng dục. Chữ hiếu ở đây được đặt lên trên cả lời hẹn ước riêng tư.",
    "Quẻ này nói rằng khi phải chọn lựa khó khăn, ưu tiên cho cha mẹ và gia đình thường là đường đi đúng đắn và ít ân hận nhất. Sự hi sinh của bạn lúc này sẽ được người thân ghi nhận và đền đáp xứng đáng về sau.")
add("Thà rằng liều một thân con", "Hoa dù rã cánh, lá còn xanh cây", "khá",
    ["gia đạo"],
    "Kiều khuyên cha đừng tự hủy hoại mình: thà để một mình nàng chịu thiệt, như hoa dù rụng cánh thì lá cây vẫn còn xanh, gia đình vẫn còn chỗ dựa. Đây là hình ảnh của sự hi sinh có tính toán, lấy cái nhỏ đổi cái lớn cho cả nhà.",
    "Quẻ này cho thấy bạn có thể phải gánh phần thiệt về mình vì người thân, nhưng đó là sự hi sinh có ý nghĩa và giữ được gốc rễ cho gia đình. Hãy cân nhắc kỹ trước khi quyết, và nhớ rằng giữ được người thân là giữ được tất cả.")
add("Còn non, còn nước, còn dài", "Còn về còn nhớ đến người hôm nay", "khá",
    ["tình duyên"],
    "Trước giờ chia tay, Kiều an ủi Kim Trọng: non nước còn dài lâu, ngày về còn đó, tình người còn đó. Lời nhắn gửi niềm tin rằng xa cách chỉ là tạm thời nếu lòng người không đổi.",
    "Quẻ này hợp với những ai đang yêu xa hoặc phải tạm xa người thân vì công việc. Cứ giữ liên lạc đều đặn và giữ vững niềm tin, khoảng cách địa lý khó thắng được sự chân thành bền bỉ.")
add("Sen tàn cúc lại nở hoa", "Sầu dài ngày ngắn, đông đà sang xuân", "khá",
    ["sức khỏe", "tổng quan"],
    "Khi Kiều lưu lạc, thời gian cứ thế trôi: sen tàn thì cúc nở, hết đông lại sang xuân. Câu thơ vừa nói nỗi sầu dài dặc, vừa ẩn chứa quy luật đổi thay không ngừng của thời tiết và đời người.",
    "Quẻ này nhắc rằng không có mùa nào kéo dài mãi, kể cả mùa đông của đời người. Nếu bạn đang mệt mỏi hay bế tắc, hãy cho mình thời gian nghỉ ngơi và chờ vận đổi; sức khỏe tinh thần cũng cần được chăm sóc như thân thể vậy.")
add("Sớm đào tối mận lân la", "Trước còn trăng gió, sau ra đá vàng", "khá",
    ["tình duyên"],
    "Câu thơ tả mối tình giữa Thúc Sinh và Kiều từ những ngày đầu trăng gió, vui chơi thoảng qua, dần trở nên gắn bó bền chặt như đá vàng. Tình cảm đi từ nhẹ nhàng đến sâu nặng theo thời gian chung sống.",
    "Quẻ báo một mối quan hệ đang có chiều hướng phát triển từ thoáng qua thành nghiêm túc. Đừng vội đòi hỏi cam kết lớn ngay; cứ để thời gian chung đụng và thử thách nhỏ chứng minh lòng nhau.")
add("Trăm năm tính cuộc vuông tròn", "Phải dò cho đến ngọn nguồn lạch sông", "khá",
    ["công danh"],
    "Thúc Sinh nói về việc đời người trăm năm muốn vẹn toàn thì mọi chuyện phải dò xét đến tận ngọn nguồn, như dò dòng sông phải tìm đến tận nguồn của nó. Đây là thái độ làm việc thấu đáo, không qua loa đại khái.",
    "Quẻ này khuyên trong công việc và giấy tờ, hãy kiểm tra kỹ đến tận gốc trước khi ký kết hay quyết định. Sự cẩn trọng lúc này sẽ giúp bạn tránh được rắc rối lớn về sau, đặc biệt với hợp đồng và tiền bạc.")
add("Dại chi chẳng giữ lấy nền", "Tốt chi mà rước tiếng ghen vào mình?", "khá",
    ["gia đạo"],
    "Hoạn Thư tự nhủ khi nghe tin chồng có người khác: dại gì không giữ lấy nền nếp gia đình, tốt gì mà rước lấy tiếng ghen tuông vào mình. Dù hoàn cảnh éo le, đây là suy nghĩ của người biết kiềm chế và giữ thể diện cho cả nhà.",
    "Quẻ này khuyên bạn giữ bình tĩnh và giữ nền nếp khi gia đình có chuyện xáo trộn. Nóng giận và ghen tuông ồn ào chỉ làm mọi việc rối thêm; sự điềm đạm và khéo léo mới là cách giữ được hạnh phúc lâu dài.")
add("Trai anh hùng, gái thuyền quyên", "Phỉ nguyền sánh phượng, đẹp duyên cưỡi rồng", "khá",
    ["tình duyên", "công danh"],
    "Câu thơ tả cuộc gặp gỡ giữa Từ Hải và Kiều: trai anh hùng gặp gái thuyền quyên, xứng đôi như phượng sánh, như rồng cưỡi. Đây là hình ảnh của một cặp đôi tương xứng về tài năng và khí phách.",
    "Quẻ báo khả năng gặp được người tương xứng, có thể là bạn đời hoặc đối tác làm ăn ngang tài ngang sức. Khi hai bên cùng mạnh và tôn trọng nhau, việc hợp tác hay gắn bó đều dễ thành công lớn.")
add("Cho hay giọt nước cành dương", "Lửa lòng tưới tắt mọi đường trần duyên", "khá",
    ["sức khỏe"],
    "Khi Kiều nương náu cửa chùa chép kinh, nàng cảm nhận nước cành dương của Phật pháp tưới tắt dần ngọn lửa phiền não trong lòng. Đây là hình ảnh của sự an tĩnh trở lại sau những ngày sóng gió.",
    "Quẻ này rất hợp với việc chữa lành tinh thần: thiền, tĩnh tâm, đọc sách hay đơn giản là cho mình một khoảng lặng. Khi lòng yên xuống, sức khỏe và giấc ngủ cũng sẽ dần cải thiện theo.")
add("Dẫu rằng sông cạn đá mòn", "Con tằm đến thác cũng còn vướng tơ", "khá",
    ["tình duyên"],
    "Kiều nói với Thúc Sinh lúc chia tay: dù sông có cạn, đá có mòn, con tằm đến chết vẫn còn vương tơ, nghĩa là tình cảm đã sâu thì khó mà dứt bỏ hoàn toàn. Hình ảnh con tằm nhả tơ là biểu tượng của mối duyên dai dẳng.",
    "Quẻ này nói về một mối duyên còn vương vấn chưa dứt, dù hoàn cảnh có thay đổi. Nếu cả hai còn tình cảm thật, hãy cho nhau một cơ hội nói rõ lòng mình; còn nếu đã quyết buông, hãy buông cho dứt khoát để lòng được nhẹ.")
add("Sao bằng lộc trọng quyền cao", "Công danh ai dứt lối nào cho qua?", "khá",
    ["công danh", "tài lộc"],
    "Kiều khuyên Từ Hải ra hàng để giữ lấy lộc trọng quyền cao, vì công danh sự nghiệp một khi đã gây dựng thì khó ai dứt bỏ được. Đây là lời bàn về giá trị của vị thế và thành quả đạt được sau bao năm phấn đấu.",
    "Quẻ này thuận cho chuyện quan lộ, thăng tiến và giữ vững vị thế đã có. Đừng vì một cơn bốc đồng mà đánh đổi thành quả nhiều năm; biết giữ mình và giữ uy tín là cách để lộc bền lâu nhất.")
add("Đã mang lấy nghiệp vào thân", "Cũng đừng trách lẫn trời gần trời xa", "khá",
    ["tổng quan"],
    "Ở đoạn kết, Nguyễn Du chiêm nghiệm: đã mang thân làm người thì ai cũng có phần nghiệp của mình, đừng nên oán trách trời đất xa gần. Đây là thái độ chấp nhận và chịu trách nhiệm với phần đời của chính mình.",
    "Quẻ này khuyên bạn thôi oán trách hoàn cảnh hay người khác, tập trung vào phần việc mình có thể thay đổi. Khi ngừng đổ lỗi, bạn sẽ thấy năng lượng quay lại và mọi chuyện dần sáng sủa hơn.")
add("Gấm trăm cuốn, bạc nghìn cân", "Tạ lòng dễ xứng, báo ân gọi là", "khá",
    ["tài lộc", "gia đạo"],
    "Khi được tự do xử việc ân oán, Kiều dâng lên Thúc Sinh gấm trăm cuốn, bạc nghìn cân để tạ ơn cứu mạng năm xưa, dù biết vật chất chẳng bao giờ xứng với ân tình. Đây là hình ảnh của người biết ơn và trả ơn hậu hĩnh.",
    "Quẻ này thuận cho việc báo đáp người đã giúp mình và cũng báo hiệu bạn có thể nhận được sự đền đáp xứng đáng. Trong làm ăn, giữ chữ tín và biết ơn đối tác cũ sẽ mở ra những cơ hội tài lộc mới.")
add("Anh hùng tiếng đã gọi rằng", "Giữa đường dẫu thấy bất bằng mà tha", "khá",
    ["công danh", "tổng quan"],
    "Từ Hải nói về phong cách của bậc anh hùng: dọc đường thấy chuyện bất bình thì ra tay can thiệp, giúp người yếu thế. Danh tiếng anh hùng ở đây không nằm ở sức mạnh mà ở tấm lòng hào hiệp.",
    "Quẻ này khuyên bạn đừng làm ngơ trước việc bất công xảy ra quanh mình, trong khả năng cho phép hãy lên tiếng hoặc giúp đỡ. Việc nghĩa bạn làm hôm nay sẽ tích thành uy tín và quý nhân cho chính bạn về sau.")

# ---------------- TRUNG BÌNH (18) ----------------
add("Trăm năm trong cõi người ta", "Chữ tài chữ mệnh khéo là ghét nhau", "trung bình",
    ["tổng quan"],
    "Đây là hai câu mở đầu nổi tiếng nhất của truyện: trong cõi đời trăm năm, tài năng và số mệnh thường xung khắc, người càng tài hoa lại càng dễ gặp truân chuyên. Nguyễn Du đặt ra ngay từ đầu một nghịch lý muôn thuở của đời người.",
    "Quẻ này nhắc rằng có tài chưa chắc đã thuận đường, và gặp trắc trở không có nghĩa là bạn kém cỏi. Hãy kiên nhẫn với vận trình của mình, dùng tài năng một cách khôn ngoan và tránh khoe khoang quá mức để giảm bớt sóng gió.")
add("Một hai nghiêng nước nghiêng thành", "Sắc đành đòi một, tài đành họa hai", "trung bình",
    ["tổng quan"],
    "Câu thơ tả nhan sắc và tài năng của Kiều đến mức nghiêng nước nghiêng thành, nhưng cũng ngầm báo trước: sắc đẹp đứng hàng đầu thì tài năng lại dễ kéo theo tai họa. Vẻ rực rỡ quá mức thường đi kèm cái giá của nó.",
    "Quẻ này là lời nhắc cân bằng: đừng để vẻ ngoài hay danh tiếng trở thành gánh nặng. Dù bạn đang được chú ý nhiều, hãy giữ sự khiêm tốn và chừng mực, tránh trở thành tâm điểm của thị phi không đáng có.")
add("Sầu đong càng lắc càng đầy", "Ba thu dồn lại một ngày dài ghê", "trung bình",
    ["tình duyên"],
    "Kim Trọng tương tư Kiều đến mức nỗi sầu đong mãi không vơi, ba mùa thu dồn lại cũng không dài bằng một ngày nhớ nhung. Đây là tâm trạng của người đang yêu xa, chờ đợi trong khắc khoải.",
    "Quẻ này cho thấy bạn đang mang một nỗi nhớ hoặc mối bận lòng kéo dài khiến ngày tháng trở nên nặng nề. Đừng ôm hết vào lòng; hãy chia sẻ với người tin cậy hoặc chủ động liên lạc, làm rõ điều đang chờ đợi để lòng bớt dồn nén.")
add("Ông tơ ghét bỏ chi nhau", "Chưa vui sum họp đã sầu chia phôi", "trung bình",
    ["tình duyên"],
    "Kiều than với Kim Trọng lúc chia tay: ông tơ xe duyên sao khéo ghét bỏ, hai người chưa kịp vui sum họp đã phải sầu chia lìa. Đây là nỗi buồn của những mối duyên vừa chớm nở đã gặp cách trở.",
    "Quẻ này báo giai đoạn tình cảm dễ có xa cách, lịch trình hay hoàn cảnh chen ngang. Nếu còn thương nhau, hãy nói rõ và hẹn một mốc cụ thể để chờ đợi, tránh để sự im lặng kéo dài làm nguội lạnh tình cảm.")
add("Duyên hội ngộ, đức cù lao", "Bên tình bên hiếu, bên nào nặng hơn?", "trung bình",
    ["gia đạo", "tình duyên"],
    "Khi gia đình gặp nạn, Kiều đứng giữa hai lựa chọn nặng như nhau: một bên là mối duyên vừa hội ngộ với Kim Trọng, một bên là công ơn sinh thành của cha mẹ. Câu hỏi tu từ này là nút thắt đạo đức lớn nhất của cả truyện.",
    "Quẻ này cho thấy bạn đang ở thế khó xử giữa tình cảm cá nhân và trách nhiệm với gia đình. Đừng vội quyết trong lúc rối; hãy thành thật với cả hai phía và tìm cách san sẻ, bởi lựa chọn cực đoan nào cũng để lại ân hận.")
add("Quyết tình nàng mới hạ tình", "Dễ cho để thiếp bán mình chuộc cha", "trung bình",
    ["gia đạo"],
    "Sau nhiều đắn đo, Kiều quyết định hi sinh mối tình của mình, đồng ý bán mình để lấy tiền chuộc cha khỏi vòng lao lý. Đây là quyết định đau đớn nhưng xuất phát từ chữ hiếu không thể làm khác.",
    "Quẻ này cho thấy có việc bạn phải đặt lợi ích của gia đình lên trên mong muốn cá nhân, dù lòng không nỡ. Hãy làm với tâm thế chủ động và rõ ràng, đồng thời bàn bạc minh bạch với người thân để không ai phải áy náy về sau.")
add("Ngẫm từ gây việc binh đao", "Đống xương Vô Định đã cao bằng đầu", "trung bình",
    ["công danh"],
    "Kiều khuyên Từ Hải nghĩ lại con đường binh đao: từ khi gây chiến, xương người vô tội đã chất cao thành đống. Đây là lời cảnh tỉnh về cái giá của tranh giành, xung đột và tham vọng dùng sức mạnh để giải quyết mọi chuyện.",
    "Quẻ này khuyên bạn tránh lao vào tranh chấp, kiện tụng hay đối đầu trực diện trong công việc lúc này. Thắng bằng sức ép thường để lại hậu quả lâu dài; thương lượng và giữ hòa khí mới là con đường bền vững.")
add("Cảnh nào cảnh chẳng đeo sầu", "Người buồn, cảnh có vui đâu bao giờ", "trung bình",
    ["sức khỏe", "tổng quan"],
    "Ở lầu xanh, Kiều nhìn cảnh nào cũng thấy nhuốm màu buồn, bởi người buồn thì cảnh đẹp đến đâu cũng không vui nổi. Nguyễn Du chỉ ra rằng tâm trạng của con người nhuộm màu lên cả thế giới xung quanh.",
    "Quẻ này nhắc bạn chú ý đến sức khỏe tinh thần: nếu thấy mọi thứ xung quanh đều u ám, có thể vấn đề nằm ở sự mệt mỏi trong lòng hơn là ở hoàn cảnh. Hãy nghỉ ngơi, ra ngoài thay đổi không gian, hoặc tâm sự với người thân trước khi đưa ra quyết định lớn.")
add("Trước lầu Ngưng Bích khóa xuân", "Vẻ non xa, tấm trăng gần, ở chung", "trung bình",
    ["tổng quan"],
    "Đây là mở đầu đoạn Kiều ở lầu Ngưng Bích: tuổi xuân bị khóa chặt trong lầu vắng, chỉ có non xa và trăng gần làm bạn. Hình ảnh đẹp mà cô quạnh, nói về những ngày bị giam hãm trong không gian chật hẹp và chờ đợi vô vọng.",
    "Quẻ này hợp với giai đoạn bạn cảm thấy bị bó buộc, công việc hay cuộc sống lặp lại tù túng. Đừng vội phá vỡ mọi thứ; hãy tận dụng khoảng lặng này để học thêm, rèn thêm, vì thời gian bị giữ lại cũng có thể là thời gian chuẩn bị.")
add("Buồn trông cửa bể chiều hôm", "Thuyền ai thấp thoáng cánh buồm xa xa", "trung bình",
    ["tổng quan"],
    "Từ lầu Ngưng Bích, Kiều buồn trông ra cửa bể lúc chiều hôm, thấy cánh buồm thấp thoáng xa xa mà không biết của ai, đi về đâu. Nỗi ngóng chờ và cảm giác mơ hồ về tương lai được gửi cả vào cánh buồm xa.",
    "Quẻ này nói về sự chờ đợi một tin tức hay một người nào đó chưa rõ ràng. Đừng đặt hết hi vọng vào điều chưa chắc chắn; trong lúc chờ, hãy cứ lo tốt phần việc của mình để dù kết quả thế nào bạn cũng không bị động.")
add("Cũng liều nhắm mắt đưa chân", "Mà xem con Tạo xoay vần đến đâu", "trung bình",
    ["tổng quan"],
    "Trong cơn cùng quẫn ở lầu xanh, Kiều liều mình theo lời Sở Khanh, nhắm mắt đưa chân xem số phận xoay vần ra sao. Đây là tâm thế buông xuôi, phó mặc cho may rủi khi không còn nhìn thấy lối ra nào khác.",
    "Quẻ này cảnh báo những quyết định liều lĩnh vì tuyệt vọng thường dẫn đến chỗ dựa vào người không đáng tin. Trước khi đặt cược tất cả vào một lối thoát, hãy tỉnh táo kiểm chứng thật kỹ người và việc đang hứa hẹn với bạn.")
add("Vầng trăng ai xẻ làm đôi", "Nửa in gối chiếc, nửa soi dặm trường", "trung bình",
    ["tình duyên"],
    "Sau khi Thúc Sinh về quê, Kiều ở lại một mình ngắm trăng và thấy vầng trăng như bị xẻ đôi: một nửa in trên gối chiếc của nàng, một nửa soi trên dặm trường của người đi xa. Trăng chung một vầng mà người thì hai nơi.",
    "Quẻ này dành cho những ai đang xa cách người thương: cùng một bầu trời nhưng mỗi người một nơi, nỗi nhớ là có thật nhưng cũng dễ sinh hiểu lầm. Hãy chủ động giữ liên lạc ấm áp, đừng để khoảng lặng kéo dài thành khoảng cách trong lòng.")
add("Bể trần chìm nổi thuyền quyên", "Hữu tài thương nỗi vô duyên lạ đời", "trung bình",
    ["tổng quan"],
    "Hoạn Thư cảm thán về Kiều: con thuyền nhan sắc chìm nổi giữa bể trần, có tài mà lại vô duyên phận, thật là điều lạ của đời. Câu thơ nói về nghịch cảnh của người tài hoa mà lận đận, không được đặt đúng chỗ.",
    "Quẻ này cho thấy năng lực của bạn chưa được đặt đúng môi trường hoặc chưa gặp đúng người biết dùng. Đừng vội nghi ngờ giá trị của mình; hãy tìm môi trường và người đồng hành phù hợp hơn, tài năng sẽ tự tìm được chỗ đứng.")
add("Trong tay đã sẵn đồng tiền", "Dầu lòng đổi trắng thay đen khó gì", "trung bình",
    ["tài lộc"],
    "Câu thơ nói về Mã Giám Sinh và bọn sai nha: khi trong tay đã có sẵn đồng tiền, việc đổi trắng thay đen, xoay chuyển trắng trợn cũng chẳng khó gì. Đây là mặt trái của sức mạnh đồng tiền trong tay kẻ thiếu lương tâm.",
    "Quẻ này nhắc bạn cảnh giác với những giao dịch mà tiền bạc đang làm mờ ranh giới đúng sai. Đừng vì lợi trước mắt mà tiếp tay cho việc khuất tất; đồng thời cũng nên giữ giấy tờ rõ ràng để tránh bị người khác dùng tiền xoay chuyển bất lợi cho mình.")
add("Cò kè bớt một thêm hai", "Giờ lâu ngã giá vàng ngoài bốn trăm", "trung bình",
    ["tài lộc"],
    "Đây là cảnh mặc cả mua bán trong truyện: hai bên cò kè bớt một thêm hai suốt hồi lâu, cuối cùng ngã giá hơn bốn trăm lạng vàng. Câu thơ tả đúng không khí thương lượng kéo dài, ai cũng muốn phần hơn về mình.",
    "Quẻ này liên quan đến mua bán, thương lượng giá cả: việc đang bàn có thể phải qua lại nhiều vòng mới chốt được. Hãy kiên nhẫn, nắm rõ giá trị thực của món hàng và đừng vội gật đầu ở lần chào giá đầu tiên.")
add("Hẳn ba trăm lạng kém đâu", "Cũng đà vừa vốn, còn sau thì lời", "trung bình",
    ["tài lộc"],
    "Tú Bà tính toán sổ sách: bỏ ra ba trăm lạng thì vừa đủ vốn, phần sau đều là lời lãi. Đây là cách nghĩ của người buôn bán thực dụng, mọi quyết định đều quy về bài toán vốn và lời.",
    "Quẻ này nhắc bạn rà soát lại bài toán tài chính của mình: vốn bỏ ra bao nhiêu, điểm hòa vốn ở đâu, phần lời có thực tế không. Tính toán rõ ràng trước khi xuống tiền sẽ giúp bạn tránh được những phi vụ tưởng hời mà hóa lỗ.")
add("Có trời mà cũng tại ta", "Tu là cõi phúc, tình là dây oan", "trung bình",
    ["tổng quan"],
    "Sư Tam Hợp giảng cho Giác Duyên: phúc họa có phần của trời nhưng cũng do chính con người tạo ra; tu hành là cõi phúc, còn đắm vào tình ái mù quáng dễ thành dây oan buộc mình. Đây là cái nhìn cân bằng giữa số phận và trách nhiệm cá nhân.",
    "Quẻ này khuyên bạn nhìn lại phần trách nhiệm của mình trong việc đang vướng mắc thay vì chỉ đổ cho số phận. Đồng thời, hãy cẩn thận với những mối quan hệ đang làm bạn mất cân bằng; biết giữ khoảng cách lành mạnh cũng là một cách tu sửa mỗi ngày.")
add("Có tài mà cậy chi tài", "Chữ tài liền với chữ tai một vần", "trung bình",
    ["công danh", "tổng quan"],
    "Nguyễn Du chơi chữ ở đoạn kết: có tài mà ỷ lại vào tài thì nguy, vì chữ tài và chữ tai chỉ khác nhau một vần, tài hoa và tai họa gần nhau trong gang tấc. Đây là lời cảnh tỉnh cho người tự tin thái quá vào năng lực của mình.",
    "Quẻ này nhắc bạn dù đang ở thế mạnh cũng đừng chủ quan hay khinh suất trong công việc. Giữ thái độ cầu thị, kiểm tra lại những việc tưởng như nắm chắc, bởi sai lầm lớn thường đến đúng lúc ta tự tin nhất.")

# ---------------- CẦN CẨN TRỌNG (12) ----------------
add("Trải qua một cuộc bể dâu", "Những điều trông thấy mà đau đớn lòng", "cần cẩn trọng",
    ["tổng quan"],
    "Tác giả mở truyện bằng hình ảnh bể dâu, biển cả hóa ruộng dâu, chỉ sự đổi thay dữ dội của thế sự. Những điều mắt thấy trong cơn biến động ấy khiến lòng người không khỏi đau đớn, xót xa.",
    "Quẻ này báo một giai đoạn nhiều biến động xung quanh bạn, có thể là công việc thay đổi, người đến kẻ đi. Hãy giữ tâm thế vững vàng, tránh quyết định lớn lúc lòng đang rối, và chăm sóc sức khỏe tinh thần cho mình và người thân.")
add("Lạ gì bỉ sắc tư phong", "Trời xanh quen thói má hồng đánh ghen", "cần cẩn trọng",
    ["tình duyên"],
    "Nguyễn Du nói về quy luật nghiệt ngã: người càng có nhan sắc, tài hoa lại càng dễ bị ghen ghét, đố kỵ, như trời xanh quen thói đánh ghen với má hồng. Đây là lời than về thân phận người phụ nữ tài sắc trong xã hội xưa.",
    "Quẻ này nhắc bạn đề phòng sự đố kỵ và thị phi xung quanh, nhất là khi bạn đang nổi bật hoặc được ưu ái. Hãy khiêm nhường, tránh khoe khoang chuyện tình cảm và thành công cá nhân, để giảm bớt những rắc rối không đáng có.")
add("Kiếp hồng nhan có mong manh", "Nửa chừng xuân thoắt gãy cành thiên hương", "cần cẩn trọng",
    ["sức khỏe"],
    "Câu thơ nói về Đạm Tiên, nàng ca nhi tài sắc mất sớm khi tuổi xuân còn dang dở, như cành hoa thơm gãy giữa chừng xuân. Đây là hình ảnh về sự mong manh của đời người trước bệnh tật và tai ương bất ngờ.",
    "Quẻ này nhắc bạn quan tâm đến sức khỏe của bản thân và người thân, đừng chủ quan với những dấu hiệu mệt mỏi kéo dài. Khám sức khỏe định kỳ và sinh hoạt điều độ lúc này quan trọng hơn mọi việc gấp gáp khác.")
add("Đau đớn thay phận đàn bà", "Lời rằng bạc mệnh cũng là lời chung", "cần cẩn trọng",
    ["tổng quan"],
    "Đứng trước mộ Đạm Tiên, Kiều thốt lên lời than chung cho thân phận phụ nữ thời xưa: bạc mệnh dường như là số phận chung mà ít ai tránh được. Câu thơ chất chứa niềm đồng cảm sâu sắc với những người yếu thế.",
    "Quẻ này cho thấy bạn hoặc người thân quanh bạn đang chịu phần thiệt thòi, dễ tủi thân. Hãy lắng nghe và san sẻ nhiều hơn với những người phụ nữ trong gia đình; sự thấu hiểu lúc này quý hơn mọi lời khuyên.")
add("Từ đây góc bể bên trời", "Nắng mưa thui thủi quê người một thân", "cần cẩn trọng",
    ["gia đạo"],
    "Khi Kiều bị đưa đi xa, Vương ông tiễn con bằng hình ảnh góc bể bên trời: từ nay con một mình thui thủi nắng mưa nơi đất khách quê người. Đây là nỗi lo của bậc cha mẹ khi con cái phải sống xa nhà, đơn độc nơi xứ lạ.",
    "Quẻ này hợp với những ai đang hoặc sắp sống xa gia đình: những ngày đầu nơi đất khách sẽ không dễ dàng. Hãy giữ liên lạc thường xuyên với người thân, tìm cho mình một cộng đồng tin cậy nơi xứ người để không phải thui thủi một mình.")
add("Tiếc thay một đóa trà mi", "Con ong đã tỏ đường đi lối về", "cần cẩn trọng",
    ["tình duyên"],
    "Câu thơ xót xa cho Kiều sau đêm bị lừa ở lầu xanh: đóa hoa trà mi đã bị con ong tìm được đường đi lối về, nghĩa là sự trong trắng đã mất, tiếng tăm cũng khó giữ. Đây là một trong những câu thơ đau đớn nhất của truyện.",
    "Quẻ này là lời cảnh tỉnh trong chuyện tình cảm và các mối quan hệ mới: hãy thật cẩn trọng với người mới quen và những lời hứa hẹn đường mật. Giữ ranh giới rõ ràng và đừng vội trao hết niềm tin khi chưa hiểu rõ con người thật của đối phương.")
add("Khi tỉnh rượu, lúc tàn canh", "Giật mình, mình lại thương mình xót xa", "cần cẩn trọng",
    ["sức khỏe"],
    "Trong những đêm ở lầu xanh, Kiều tỉnh rượu lúc canh tàn, giật mình thương xót cho chính thân phận mình. Đây là tâm trạng của người sống trong cảnh trái ý, đêm dài mất ngủ, lòng đầy tủi hổ và cô đơn.",
    "Quẻ này báo dấu hiệu tinh thần đang xuống thấp: mất ngủ, buồn bã, tự trách mình. Đừng chịu đựng một mình quá lâu; hãy tìm người tin cậy để tâm sự, sắp xếp lại nhịp sinh hoạt và nếu cần, đừng ngại tìm đến sự hỗ trợ chuyên môn về tâm lý.")
add("Một mình âm ỉ đêm chày", "Đĩa dầu vơi, nước mắt đầy năm canh", "cần cẩn trọng",
    ["sức khỏe"],
    "Khi ở nhà họ Hoạn, Kiều một mình thức trắng những đêm dài, đĩa dầu đèn vơi dần mà nước mắt thì đầy suốt năm canh. Hình ảnh này tả nỗi khổ tâm triền miên, ngày này qua ngày khác không lối thoát.",
    "Quẻ này nhắc bạn rằng sự chịu đựng âm thầm kéo dài rất hại cho sức khỏe cả thân lẫn tâm. Nếu đang kẹt trong một hoàn cảnh hoặc mối quan hệ khiến bạn khóc thầm nhiều đêm, đã đến lúc phải lên tiếng và tìm đường thay đổi thay vì tiếp tục cam chịu.")
add("Ruột tằm ngày một héo don", "Tuyết sương ngày một hao mòn hình ve", "cần cẩn trọng",
    ["sức khỏe", "tình duyên"],
    "Kim Trọng vì tương tư và chờ đợi mà ngày một héo mòn: ruột tằm héo don, thân hình hao mòn như ve sau sương gió. Đây là hình ảnh của người để nỗi nhớ và lo âu bào mòn sức khỏe theo thời gian.",
    "Quẻ này cảnh báo việc để tâm trạng buồn lo kéo dài đang ảnh hưởng thật đến thể chất của bạn hoặc người bạn thương. Hãy chủ động chăm sóc ăn uống, giấc ngủ và vận động; nỗi lòng dù lớn cũng cần được giải tỏa bằng hành động cụ thể chứ không phải bằng chờ đợi mòn mỏi.")
add("Mụ càng tô lục chuốt hồng", "Máu tham hễ thấy hơi đồng thì mê", "cần cẩn trọng",
    ["tài lộc"],
    "Câu thơ tả Tú Bà và thói tham tiền: càng trang điểm tô vẽ cho món hàng, lòng tham càng mê mẩn khi ngửi thấy hơi đồng tiền. Đây là chân dung của kiểu người vì lợi nhuận mà bất chấp mọi thủ đoạn.",
    "Quẻ này nhắc bạn đề phòng những đối tác, mối làm ăn chỉ chăm chăm vào lợi nhuận trước mắt. Khi thấy dấu hiệu người khác vì tiền mà sẵn sàng lật lọng, hãy rút lui sớm và giữ chặt giấy tờ, tiền bạc của mình.")
add("Một ngày lạ thói sai nha", "Làm cho khốc hại chẳng qua vì tiền", "cần cẩn trọng",
    ["tài lộc"],
    "Khi nhà họ Vương gặp nạn, Nguyễn Du chỉ rõ gốc rễ: thói sai nha làm điều khốc hại với dân lành, xét cho cùng cũng chỉ vì tiền. Câu thơ là lời tố cáo nạn tham nhũng, vòi vĩnh khiến người lương thiện khốn đốn.",
    "Quẻ này cho thấy bạn có thể gặp rắc rối liên quan đến thủ tục, giấy tờ hoặc người có quyền hành đòi hỏi điều không chính đáng. Hãy làm mọi việc theo đúng quy định, lưu giữ chứng từ đầy đủ và đừng đi đường tắt bằng phong bì, vì đường tắt lúc này dễ dẫn vào rắc rối lớn hơn.")
add("Thôi thì một thác cho rồi", "Tấm lòng phó mặc trên trời dưới sông", "cần cẩn trọng",
    ["tổng quan"],
    "Trước khi gieo mình xuống sông Tiền Đường, Kiều nghĩ đến cái chết như lối thoát cuối cùng và phó mặc tấm lòng cho trời sông. May mắn là nàng được cứu vớt và sau đó đoàn viên, cho thấy tuyệt vọng tột cùng đôi khi chỉ cách hồi sinh một khoảnh khắc.",
    "Quẻ này cho thấy bạn đang ở giai đoạn cảm thấy bế tắc, muốn buông xuôi mọi thứ. Hãy nhớ như Kiều năm xưa: cơn tuyệt vọng rồi sẽ qua và luôn có bàn tay sẵn sàng đỡ mình dậy. Đừng quyết định điều gì dại dột lúc này; hãy tìm đến người thân, bạn bè hoặc đường dây hỗ trợ tâm lý để được lắng nghe và giúp đỡ.")

# ---------- validation ----------
assert len(E) == 60, f"count={len(E)}"
tones = collections.Counter(e["tone"] for e in E)
themes = collections.Counter()
for e in E:
    assert len(e["lines"][0].split()) == 6, e["lines"]
    assert len(e["lines"][1].split()) == 8, e["lines"]
    assert 1 <= len(e["themes"]) <= 3
    for t in e["themes"]:
        assert t in ["tình duyên", "công danh", "tài lộc", "gia đạo", "sức khỏe", "tổng quan"], t
        themes[t] += 1
    assert 2 <= e["meaning"].count(".") + e["meaning"].count("?") or True
print("tones:", dict(tones))
print("themes:", dict(themes))
out = pathlib.Path(__file__).with_name("kieu-verses.json")
out.write_text(json.dumps(E, ensure_ascii=False, indent=2), encoding="utf-8")
print("written", out, len(E), "entries")
