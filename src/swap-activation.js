const fs = require('fs');
const PHP = __dirname + '/phongthuy-tools.php';
let src = fs.readFileSync(PHP, 'utf8');

const startMark = "    ptv_ss_backup($all_slugs, 'pre-activation');";
const endMark = '    // Trang chu: dong bo noi dung cua trang dang duoc dat lam front page';
const i = src.indexOf(startMark);
const j = src.indexOf(endMark);
if (i < 0 || j < 0 || j < i) throw new Error('activation markers missing: ' + i + ' ' + j);

const replacement = `    $bk = ptv_ss_backup($all_slugs, 'pre-activation');
    if ($bk === false) {
        // Khong backup duoc thi khong ghi bat cu thu gi (P0 vong 2).
        ptv_ss_log('activation_abort', '', 'Hủy toàn bộ đồng bộ khi kích hoạt vì không lưu được backup trước khi ghi');
        return;
    }
    $written = array();
    $sync_one = function ($slug, $title, $file, $seo_title, $seo_desc) use (&$written) {
        if (ptv_ss_would_conflict($slug, $file)) {
            ptv_ss_log('activation_skip', $slug, 'Bỏ qua khi kích hoạt: nội dung DB lệch mốc hoặc chưa có mốc (bảo toàn dữ liệu hiện hữu)');
            return;
        }
        ptv_sync_page($slug, $title, $file, $seo_title, $seo_desc);
        if (ptv_ss_verify_written($slug, $file)) {
            $written[] = $slug;
        } else {
            ptv_ss_log('activation_write_error', $slug, 'Nội dung sau khi ghi không khớp bản plugin, không cập nhật mốc cho trang này');
        }
    };
    $sync_one(
        'dat-ten-con',
        'Đặt Tên Con Theo Phong Thủy',
        'page-dat-ten-con.html',
        'Đặt tên con, tìm và xem tên cho con hợp tuổi, hợp mệnh theo đúng phong thủy',
        'Công cụ đặt tên con theo phong thủy: nhập họ tên và ngày giờ sinh của bé để xem bản mệnh, tứ trụ, ngũ cách, chấm điểm tên theo số nét chữ Hán, ngũ hành và quẻ Dịch, có đối chiếu mệnh bố mẹ và gợi ý tên hay.'
    );
    $sync_one(
        'boi-kieu',
        'Bói Kiều',
        'page-boi-kieu.html',
        'Bói Kiều - Tiến hành rút quẻ truyện Kiều để giải đoán điềm tương lai',
        'Bói Kiều online miễn phí: tiến hành rút quẻ Truyện Kiều để giải đoán điềm tương lai về tình duyên, công danh, tài lộc, gia đạo và sức khỏe, kèm giải nghĩa và luận giải chi tiết từng cặp câu Kiều.'
    );

    // Dong bo cac trang cong cu theo manifest
    $mf = plugin_dir_path(__FILE__) . 'data/tools-manifest.json';
    if (file_exists($mf)) {
        $mlist = json_decode(file_get_contents($mf), true);
        if (is_array($mlist)) foreach ($mlist as $t) {
            if (empty($t['slug']) || empty($t['file'])) continue;
            $sync_one($t['slug'], $t['title'], $t['file'], isset($t['seoTitle']) ? $t['seoTitle'] : '', isset($t['seoDesc']) ? $t['seoDesc'] : '');
        }
    }
`;
src = src.slice(0, i) + replacement + src.slice(j);

// Front page: only replace when content is empty or exactly the lone shortcode.
const frontOld = "if ($front_content === '' || strpos($front_content, '[ptv_trang_chu_tools]') !== false) {";
const frontNew = "if ($front_content === '' || trim($front_content) === '[ptv_trang_chu_tools]') {";
if (!src.includes(frontOld)) throw new Error('front anchor missing');
src = src.replace(frontOld, frontNew);

// Menu: seed signature instead of rebuilding when a menu exists but has no saved signature yet.
const menuAnchor = `    $saved_sig = get_option('ptv_ss_menu_sig', '');`;
if (!src.includes(menuAnchor)) throw new Error('menu anchor missing');
const seedBlock = menuAnchor + `
    if (!$saved_sig && $menu) {
        $existing_items = wp_get_nav_menu_items($menu_id);
        if ($existing_items && count($existing_items) > 0) {
            $seed_sig = ptv_ss_menu_signature();
            if ($seed_sig !== null) update_option('ptv_ss_menu_sig', $seed_sig, false);
            ptv_ss_log('menu_seed', '', 'Menu đã có sẵn nhưng chưa có chữ ký mốc: chốt mốc theo menu hiện tại, không dựng lại khi kích hoạt');
            return;
        }
    }`;
src = src.replace(menuAnchor, seedBlock);

fs.writeFileSync(PHP, src);
console.log('activation restructured OK');
