const fs = require('fs');
const PHP = __dirname + '/phongthuy-tools.php';
let src = fs.readFileSync(PHP, 'utf8');
const startMark = '    // Bao ve menu sua tay (Issue #2)';
const endMark = '    $old = wp_get_nav_menu_items($menu_id);';
const i = src.indexOf(startMark);
const j = src.indexOf(endMark, i);
if (i < 0 || j < 0 || j < i) throw new Error('menu markers missing: ' + i + ' ' + j);
const replacement = `    // Che do menu (Issue #2): 'manual' la menu cua admin, khong bao gio tu dung lai;
    // 'managed' la menu do plugin dung, chi dung lai khi khong bi sua tay.
    $menu_mode = get_option('ptv_ss_menu_mode', '');
    $saved_sig = get_option('ptv_ss_menu_sig', '');
    if ($menu) {
        $cur_items = wp_get_nav_menu_items($menu_id);
        $has_items = $cur_items && count($cur_items) > 0;
        $cur_sig = ptv_ss_menu_signature();
        if ($menu_mode === 'manual') {
            if ($cur_sig !== null && $cur_sig !== $saved_sig) {
                update_option('ptv_ss_menu_sig', $cur_sig, false);
                ptv_ss_log('menu_manual_kept', '', 'Giữ nguyên menu thủ công khi kích hoạt (nội dung menu có thay đổi so với mốc, đã cập nhật chữ ký theo menu hiện tại)');
            }
            return;
        }
        if ($has_items && $menu_mode !== 'managed') {
            update_option('ptv_ss_menu_mode', 'manual', false);
            if ($cur_sig !== null) update_option('ptv_ss_menu_sig', $cur_sig, false);
            ptv_ss_log('menu_seed', '', 'Menu đã có sẵn nội dung và chưa phân loại: xếp vào chế độ thủ công, giữ nguyên khi kích hoạt');
            return;
        }
        if ($menu_mode === 'managed' && $has_items && $cur_sig !== null && $saved_sig !== '' && $cur_sig !== $saved_sig) {
            update_option('ptv_ss_menu_mode', 'manual', false);
            update_option('ptv_ss_menu_sig', $cur_sig, false);
            ptv_ss_log('menu_adopted', '', 'Menu do plugin dựng đã bị sửa tay: chuyển sang chế độ thủ công và giữ nguyên');
            return;
        }
    }
`;
src = src.slice(0, i) + replacement + src.slice(j);
fs.writeFileSync(PHP, src);
console.log('menu guard replaced');
