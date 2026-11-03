# -*- coding: utf-8 -*-
import json, io
TOOLS = [
 ("boi-not-ruoi-tren-mat","Bói Nốt Ruồi Trên Mặt","Bói nốt ruồi trên mặt, ý nghĩa nốt ruồi ở từng vị trí trên khuôn mặt",
  "Chọn vị trí nốt ruồi trên khuôn mặt để xem ý nghĩa theo nhân tướng học: trán, ấn đường, lông mày, mắt, mũi, gò má, miệng, cằm và tai.",
  "Theo nhân tướng học, mỗi vị trí nốt ruồi trên mặt gắn với một phương diện tính cách, tài lộc hay tình duyên của chủ nhân."),
 ("boi-not-ruoi-toan-than","Bói Nốt Ruồi Toàn Thân","Bói nốt ruồi toàn thân, ý nghĩa nốt ruồi ở cổ, vai, ngực, lưng, tay, chân",
  "Chọn vị trí nốt ruồi trên cơ thể để xem ý nghĩa theo nhân tướng học dân gian, từ cổ, vai, ngực đến lưng, bụng và lòng bàn chân.",
  "Ngoài khuôn mặt, nốt ruồi trên cơ thể cũng được dân gian gán cho nhiều ý nghĩa thú vị, đặc biệt là các nốt ruồi son được coi là nốt ruồi phúc."),
 ("xem-y-nghia-hinh-xam","Xem Ý Nghĩa Hình Xăm","Ý nghĩa hình xăm phong thủy: rồng, phượng, cá chép, hoa sen và nhiều hình khác",
  "Chọn hình xăm để xem ý nghĩa phong thủy, người mệnh nào hợp và lưu ý về vị trí xăm theo quan niệm dân gian.",
  "Hình xăm ngày nay không chỉ là nghệ thuật cơ thể, nhiều người còn chọn hình theo ý nghĩa phong thủy để cầu may mắn và thể hiện cá tính."),
]
manifest = []
for slug, title, seo_title, intro, why in TOOLS:
    body = f'''<div class="ptv-page">
<div class="ptv-hero"><span class="ptv-hero-badge">ỨNG DỤNG PHONG THỦY MIỄN PHÍ</span><h1>{title}</h1><p>{intro}</p></div>

<p>{why}</p>

[ptv_tool slug="{slug}"]

<h2>Lưu ý khi sử dụng</h2>
<p>Kết quả mang tính tham khảo theo nhân tướng học và quan niệm dân gian. Vẻ đẹp và giá trị của mỗi người nằm ở tính cách và hành động, không nằm ở một nốt ruồi hay một hình xăm.</p>
</div>
'''
    fname = f'page-{slug}.html'
    io.open(fname, 'w', encoding='utf-8').write(body)
    manifest.append({'slug': slug, 'title': title, 'seoTitle': seo_title, 'seoDesc': intro, 'file': fname})
full = json.load(io.open('tools-manifest.json', encoding='utf-8'))
json.dump(full + manifest, io.open('tools-manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('manifest total:', len(full) + len(manifest))
