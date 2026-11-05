/* ---------------- Dong bo noi dung an toan (Issue #2, v1.54) ----------------
 * Nguyen tac:
 * - Duong kich hoat (deploy hien hanh) van ghi nhu cu DOI VOI cac trang khong
 *   xung dot, nhung truoc khi ghi se backup, va trang nao lech moc (nghi sua
 *   tay) se bi BO QUA kem log chu khong bi ghi de. Trang chu va menu cung
 *   duoc bao ve tuong tu.
 * - Moc (baseline) chi duoc cap nhat cho tung slug GHI THANH CONG. Khong bao
 *   gio ghi lai moc cho trang xung dot, trang loi hoac trang khong dong toi.
 * - Chot moc (seed) chi lam tung trang kem o xac nhan, khong lam hang loat.
 * - Man hinh admin (Tools > Dong bo PhongThuy): xem diff truoc, ghi qua nonce
 *   + quyen manage_options, backup truoc khi ghi (khong backup duoc thi khong
 *   ghi), rollback theo ID backup co dinh va xac minh dung Page.
 */
function ptv_ss_pages() {
    $pages = array(
        array('slug' => 'dat-ten-con', 'title' => 'Đặt Tên Con Theo Phong Thủy', 'file' => 'page-dat-ten-con.html'),
        array('slug' => 'boi-kieu', 'title' => 'Bói Kiều', 'file' => 'page-boi-kieu.html'),
    );
    $mf = plugin_dir_path(__FILE__) . 'data/tools-manifest.json';
    if (file_exists($mf)) {
        $mlist = json_decode(file_get_contents($mf), true);
        if (is_array($mlist)) foreach ($mlist as $t) {
            if (!empty($t['slug']) && !empty($t['file'])) $pages[] = array('slug' => $t['slug'], 'title' => isset($t['title']) ? $t['title'] : $t['slug'], 'file' => $t['file']);
        }
    }
    return $pages;
}
function ptv_ss_plugin_content($file) {
    $path = plugin_dir_path(__FILE__) . 'content/' . $file;
    return file_exists($path) ? file_get_contents($path) : '';
}
function ptv_ss_hash($s) { return hash('sha256', (string) $s); }

function ptv_ss_get_baseline() {
    $b = get_option('ptv_ss_baseline', array());
    return is_array($b) ? $b : array();
}
/* Cap nhat moc CHI cho cac slug chi dinh (mac dinh: khong slug nao).
 * $slugs phai la danh sach slug vua ghi thanh cong. */
function ptv_ss_record_baseline($source, $slugs = array()) {
    if (!$slugs) return;
    $want = array_fill_keys($slugs, true);
    $baseline = ptv_ss_get_baseline();
    foreach (ptv_ss_pages() as $p) {
        if (!isset($want[$p['slug']])) continue;
        $page = get_page_by_path($p['slug']);
        if (!$page) continue;
        $baseline[$p['slug']] = array(
            'id' => (int) $page->ID,
            'db' => ptv_ss_hash($page->post_content),
            'plugin' => ptv_ss_hash(ptv_ss_plugin_content($p['file'])),
            'time' => time(),
            'source' => $source,
        );
    }
    update_option('ptv_ss_baseline', $baseline, false);
}
function ptv_ss_log($action, $slug, $detail) {
    $log = get_option('ptv_ss_log', array());
    if (!is_array($log)) $log = array();
    $u = function_exists('wp_get_current_user') ? wp_get_current_user() : null;
    array_unshift($log, array(
        'time' => time(),
        'user' => ($u && isset($u->user_login)) ? $u->user_login : 'system',
        'action' => $action,
        'slug' => $slug,
        'detail' => $detail,
    ));
    update_option('ptv_ss_log', array_slice($log, 0, 100), false);
}
/* Trang thai cua mot Page so voi plugin va moc da ghi.
 * synced: DB trung plugin. update: plugin co ban moi, DB chua ai sua tay.
 * conflict: DB lech moc (nghi sua tay) -> khong tu ghi de.
 * missing: chua co Page. nobaseline: chua co moc. */
function ptv_ss_status($plugin_hash, $db_hash, $baseline_db_hash, $page_exists) {
    if (!$page_exists) return 'missing';
    if ($db_hash === $plugin_hash) return 'synced';
    if ($baseline_db_hash === null) return 'nobaseline';
    if ($db_hash === $baseline_db_hash) return 'update';
    return 'conflict';
}
function ptv_ss_page_status($p) {
    $page = get_page_by_path($p['slug']);
    $baseline = ptv_ss_get_baseline();
    $b = isset($baseline[$p['slug']]) ? $baseline[$p['slug']] : null;
    $plugin_hash = ptv_ss_hash(ptv_ss_plugin_content($p['file']));
    $db_hash = $page ? ptv_ss_hash($page->post_content) : '';
    $status = ptv_ss_status($plugin_hash, $db_hash, $b ? $b['db'] : null, $page ? true : false);
    return array('page' => $page, 'status' => $status, 'plugin_hash' => $plugin_hash, 'db_hash' => $db_hash, 'baseline' => $b);
}
/* Trang $slug co nen bi bo qua khi kich hoat hay khong:
 * - DB lech moc da ghi (nghi sua tay), hoac
 * - Page da ton tai nhung CHUA co moc va noi dung khac plugin (truong hop nang
 *   cap tu ban cu chua co baseline: khong phan biet duoc sua tay hay khong,
 *   nen bao toan du lieu va de admin quyet dinh o man hinh dong bo). */
function ptv_ss_would_conflict($slug, $file) {
    $page = get_page_by_path($slug);
    if (!$page) return false;
    $db = ptv_ss_hash($page->post_content);
    if ($db === ptv_ss_hash(ptv_ss_plugin_content($file))) return false;
    $baseline = ptv_ss_get_baseline();
    if (!isset($baseline[$slug])) return true;
    return $db !== $baseline[$slug]['db'];
}
/* Kiem chung sau ghi: noi dung DB thuc te da khop ban plugin chua. */
function ptv_ss_verify_written($slug, $file) {
    $page = get_page_by_path($slug);
    return $page && ptv_ss_hash($page->post_content) === ptv_ss_hash(ptv_ss_plugin_content($file));
}
/* Diff tung dong (LCS), tra ve so dong them/xoa va HTML xem truoc.
 * Gioi han 500 dong moi ben de tranh phinh RAM; vuot thi chi bao tong quat. */
function ptv_ss_line_diff($old, $new) {
    $a = explode("\n", (string) $old);
    $b = explode("\n", (string) $new);
    if (count($a) > 500 || count($b) > 500) {
        return array('add' => null, 'del' => null, 'html' => '<p>Văn bản dài hơn 500 dòng nên không hiển thị diff chi tiết tại đây để tránh nặng máy chủ. Hãy đối chiếu hai bản nội dung thủ công.</p>');
    }
    $n = count($a); $m = count($b);
    $dp = array();
    for ($i = 0; $i <= $n; $i++) $dp[$i] = array_fill(0, $m + 1, 0);
    for ($i = $n - 1; $i >= 0; $i--) {
        for ($j = $m - 1; $j >= 0; $j--) {
            $dp[$i][$j] = ($a[$i] === $b[$j]) ? $dp[$i + 1][$j + 1] + 1 : max($dp[$i + 1][$j], $dp[$i][$j + 1]);
        }
    }
    $add = 0; $del = 0; $lines = array(); $i = 0; $j = 0;
    while ($i < $n && $j < $m) {
        if ($a[$i] === $b[$j]) { $i++; $j++; }
        elseif ($dp[$i + 1][$j] >= $dp[$i][$j + 1]) { $lines[] = array('-', $a[$i]); $del++; $i++; }
        else { $lines[] = array('+', $b[$j]); $add++; $j++; }
    }
    while ($i < $n) { $lines[] = array('-', $a[$i]); $del++; $i++; }
    while ($j < $m) { $lines[] = array('+', $b[$j]); $add++; $j++; }
    $html = '<div class="ptv-ss-diff" style="font-family:monospace;white-space:pre-wrap;max-height:320px;overflow:auto;border:1px solid #ccd0d4;padding:8px;background:#fff">';
    $shown = 0;
    foreach ($lines as $ln) {
        if ($shown >= 400) { $html .= '<div>... (đã rút gọn phần diff còn lại)</div>'; break; }
        $color = $ln[0] === '+' ? 'color:#0a7d26' : 'color:#b32d2e';
        $html .= '<div style="' . $color . '">' . esc_html($ln[0] . ' ' . $ln[1]) . '</div>';
        $shown++;
    }
    $html .= '</div>';
    return array('add' => $add, 'del' => $del, 'html' => $html);
}
/* Backup noi dung DB hien tai cua cac slug sap ghi, giu 3 ban gan nhat.
 * Moi ban co ID co dinh de rollback khong phu thuoc vi tri trong danh sach.
 * Khi $include_extras = true (duong kich hoat), snapshot con gom trang chu
 * kem SEO meta (khoa '__front') va cac muc menu hien tai (khoa '__menu').
 * Tra ve ID backup, hoac false neu luu that bai (nguoi goi PHAI dung ghi). */
function ptv_ss_backup($slugs, $reason, $include_extras = false) {
    $pages = array();
    foreach ($slugs as $slug) {
        $page = get_page_by_path($slug);
        if ($page) $pages[$slug] = array('id' => (int) $page->ID, 'content' => $page->post_content, 'title' => $page->post_title);
    }
    if ($include_extras) {
        $front_id = (int) get_option('page_on_front');
        if (!$front_id) {
            $home = get_page_by_path('trang-chu');
            if ($home) $front_id = (int) $home->ID;
        }
        if ($front_id && function_exists('get_post_meta')) {
            $fp = get_post($front_id);
            if ($fp) $pages['__front'] = array(
                'id' => $front_id,
                'content' => $fp->post_content,
                'title' => $fp->post_title,
                'seo_title' => get_post_meta($front_id, '_yoast_wpseo_title', true),
                'seo_desc' => get_post_meta($front_id, '_yoast_wpseo_metadesc', true),
            );
        }
        $menu_snapshot = ptv_ss_menu_snapshot();
        if ($menu_snapshot) $pages['__menu'] = $menu_snapshot;
    }
    if (!$pages) return true;
    $backups = get_option('ptv_ss_backups', array());
    if (!is_array($backups)) $backups = array();
    $u = function_exists('wp_get_current_user') ? wp_get_current_user() : null;
    $id = 'bk' . time() . '-' . substr(md5(uniqid('', true)), 0, 6);
    array_unshift($backups, array('id' => $id, 'time' => time(), 'user' => ($u && isset($u->user_login)) ? $u->user_login : 'system', 'reason' => $reason, 'pages' => $pages));
    $ok = update_option('ptv_ss_backups', array_slice($backups, 0, 3), false);
    if (!$ok) {
        ptv_ss_log('backup_error', '', 'Không lưu được backup ' . $id . ' (' . $reason . ')');
        return false;
    }
    return $id;
}
/* Chu ky cua menu hien tai de phat hien menu da duoc sua tay. */
function ptv_ss_menu_signature() {
    if (!function_exists('wp_get_nav_menu_object') || !function_exists('wp_get_nav_menu_items')) return null;
    $menu = wp_get_nav_menu_object('Menu Phong Thủy VietAA');
    if (!$menu) return null;
    $items = wp_get_nav_menu_items((int) $menu->term_id);
    if (!$items) return '';
    $parts = array();
    foreach ($items as $it) $parts[] = $it->title . '|' . $it->url . '|' . (int) $it->menu_item_parent;
    return ptv_ss_hash(implode("\n", $parts));
}
/* Chup day du cac muc menu hien tai theo dinh dang snapshot '__menu',
 * gom ca thuoc tinh WordPress: type, object, object_id, classes, target... */
function ptv_ss_menu_snapshot() {
    if (!function_exists('wp_get_nav_menu_object') || !function_exists('wp_get_nav_menu_items')) return null;
    $menu = wp_get_nav_menu_object('Menu Phong Thủy VietAA');
    if (!$menu) return null;
    $items = wp_get_nav_menu_items((int) $menu->term_id);
    if (!$items) return array();
    $saved = array();
    foreach ($items as $it) {
        $saved[] = array(
            'id' => (int) $it->ID,
            'title' => $it->title,
            'url' => isset($it->url) ? $it->url : '',
            'parent' => (int) $it->menu_item_parent,
            'type' => isset($it->type) ? $it->type : 'custom',
            'object' => isset($it->object) ? $it->object : '',
            'object_id' => isset($it->object_id) ? (int) $it->object_id : 0,
            'classes' => isset($it->classes) ? implode(' ', (array) $it->classes) : '',
            'attr_title' => isset($it->attr_title) ? $it->attr_title : '',
            'target' => isset($it->target) ? $it->target : '',
            'description' => isset($it->description) ? $it->description : '',
            'xfn' => isset($it->xfn) ? $it->xfn : '',
            'position' => isset($it->menu_order) ? (int) $it->menu_order : 0,
        );
    }
    return $saved;
}
/* LUU Y (quyet dinh vong 5 tren PR #4): khong con ham khoi phuc menu trong
 * plugin. WordPress khong co co che thay the menu nguyen tu; xoa roi dung lai
 * co the mat du lieu khi loi keo dai. Snapshot menu trong backup chi de tham
 * khao. Neu can khoi phuc menu, huong dung la dung mot menu moi day du roi
 * hoan doi tham chieu, lam o PR rieng. */
function ptv_ss_admin_menu() {
    add_submenu_page('tools.php', 'Đồng bộ nội dung công cụ', 'Đồng bộ PhongThuy', 'manage_options', 'ptv-safe-sync', 'ptv_ss_render');
}
add_action('admin_menu', 'ptv_ss_admin_menu');

function ptv_ss_render() {
    if (!current_user_can('manage_options')) { wp_die('Bạn không có quyền truy cập trang này.'); }
    $pages = ptv_ss_pages();
    $notice = '';
    $notice_err = '';
    if (!empty($_POST['ptv_ss_action'])) {
        check_admin_referer('ptv_ss_action');
        $act = sanitize_key($_POST['ptv_ss_action']);
        if ($act === 'menu_to_managed') {
            if (!empty($_POST['ptv_ss_confirm_menu'])) {
                update_option('ptv_ss_menu_mode', 'managed', false);
                ptv_ss_log('menu_mode', 'menu', 'Admin chủ động chuyển menu sang chế độ plugin quản lý; lần kích hoạt sau menu sẽ được dựng lại theo plugin');
                $notice = 'Đã chuyển menu sang chế độ plugin quản lý. Menu sẽ được dựng lại theo plugin ở lần kích hoạt kế tiếp.';
            } else {
                $notice_err = 'Chưa chuyển chế độ menu: cần tích ô xác nhận.';
            }
        } elseif ($act === 'sync_safe') {
            $targets = array();
            foreach ($pages as $p) {
                $st = ptv_ss_page_status($p);
                if ($st['status'] === 'missing' || $st['status'] === 'update') $targets[] = $p;
            }
            if ($targets) {
                $existing = array();
                foreach ($targets as $p) if (get_page_by_path($p['slug'])) $existing[] = $p['slug'];
                $bk = ptv_ss_backup($existing, 'sync_safe');
                if ($bk === false) {
                    $notice_err = 'Đã hủy đồng bộ vì không lưu được bản backup. Kiểm tra nhật ký trước khi thử lại.';
                } else {
                    $done = array(); $errors = array();
                    foreach ($targets as $p) {
                        $content = ptv_ss_plugin_content($p['file']);
                        $page = get_page_by_path($p['slug']);
                        if ($page) {
                            $r = wp_update_post(array('ID' => $page->ID, 'post_content' => $content), true);
                            if (is_wp_error($r)) { $errors[] = $p['slug'] . ': ' . $r->get_error_message(); ptv_ss_log('sync_error', $p['slug'], $r->get_error_message()); }
                            elseif (!ptv_ss_verify_written($p['slug'], $p['file'])) { $errors[] = $p['slug'] . ': nội dung sau ghi không khớp bản plugin'; ptv_ss_log('sync_error', $p['slug'], 'Kiểm chứng sau ghi thất bại, không cập nhật mốc'); }
                            else { $done[] = $p['slug']; ptv_ss_log('sync_update', $p['slug'], 'Cập nhật nội dung từ plugin (chỉ post_content, giữ nguyên tiêu đề và SEO meta)'); }
                        } else {
                            $r = wp_insert_post(array('post_title' => $p['title'], 'post_name' => $p['slug'], 'post_content' => $content, 'post_status' => 'publish', 'post_type' => 'page'), true);
                            if (is_wp_error($r)) { $errors[] = $p['slug'] . ': ' . $r->get_error_message(); ptv_ss_log('sync_error', $p['slug'], $r->get_error_message()); }
                            elseif (!ptv_ss_verify_written($p['slug'], $p['file'])) { $errors[] = $p['slug'] . ': nội dung sau khi tạo không khớp bản plugin'; ptv_ss_log('sync_error', $p['slug'], 'Kiểm chứng sau khi tạo thất bại, không cập nhật mốc'); }
                            else { $done[] = $p['slug']; ptv_ss_log('sync_create', $p['slug'], 'Tạo Page mới từ plugin'); }
                        }
                    }
                    ptv_ss_record_baseline('admin-sync', $done);
                    $notice = 'Đã đồng bộ ' . count($done) . ' trang: ' . implode(', ', $done) . ($errors ? '. Lỗi: ' . implode('; ', $errors) : '.');
                    if ($errors) $notice_err = 'Một số trang ghi thất bại, mốc của chúng được giữ nguyên: ' . implode('; ', $errors);
                }
            } else {
                $notice = 'Không có trang nào ở trạng thái cần đồng bộ an toàn.';
            }
        } elseif ($act === 'force_one' || $act === 'seed_one') {
            $slug = isset($_POST['ptv_ss_slug']) ? sanitize_title(wp_unslash($_POST['ptv_ss_slug'])) : '';
            $confirmed = !empty($_POST['ptv_ss_confirm']) && $_POST['ptv_ss_confirm'] === $slug;
            $target = null;
            foreach ($pages as $p) if ($p['slug'] === $slug) $target = $p;
            if (!$target) {
                $notice_err = 'Không tìm thấy trang ' . $slug . ' trong manifest.';
            } elseif (!$confirmed) {
                $notice_err = 'Chưa thực hiện: cần tích ô xác nhận đúng trang này trước.';
            } elseif ($act === 'seed_one') {
                $page = get_page_by_path($slug);
                if ($page) {
                    $baseline = ptv_ss_get_baseline();
                    $baseline[$slug] = array('id' => (int) $page->ID, 'db' => ptv_ss_hash($page->post_content), 'plugin' => ptv_ss_hash(ptv_ss_plugin_content($target['file'])), 'time' => time(), 'source' => 'admin-seed-one');
                    $saved = update_option('ptv_ss_baseline', $baseline, false);
                    if (!$saved) { ptv_ss_log('seed_error', $slug, 'Không lưu được mốc khi chốt mốc thủ công'); $notice_err = 'Không lưu được mốc cho trang ' . $slug . ', hãy thử lại.'; }
                    else {
                        ptv_ss_log('seed_one', $slug, 'Admin chốt mốc theo nội dung DB hiện tại của riêng trang này');
                        $notice = 'Đã chốt mốc cho trang ' . $slug . '. Lưu ý: từ nay nếu plugin có bản mới, trang này sẽ được coi là cập nhật an toàn.';
                    }
                } else $notice_err = 'Trang ' . $slug . ' chưa tồn tại nên không chốt mốc được.';
            } else {
                $bk = ptv_ss_backup(array($slug), 'force_one');
                if ($bk === false) {
                    $notice_err = 'Đã hủy ghi đè vì không lưu được bản backup.';
                } else {
                    $page = get_page_by_path($slug);
                    if ($page) {
                        $r = wp_update_post(array('ID' => $page->ID, 'post_content' => ptv_ss_plugin_content($target['file'])), true);
                        if (is_wp_error($r)) { ptv_ss_log('sync_error', $slug, $r->get_error_message()); $notice_err = 'Lỗi khi ghi đè ' . $slug . ': ' . $r->get_error_message(); }
                        elseif (!ptv_ss_verify_written($slug, $target['file'])) { ptv_ss_log('sync_error', $slug, 'Kiểm chứng sau ghi đè thất bại, không cập nhật mốc'); $notice_err = 'Nội dung sau ghi đè của ' . $slug . ' không khớp bản plugin, mốc được giữ nguyên.'; }
                        else { ptv_ss_record_baseline('admin-force', array($slug)); ptv_ss_log('sync_force', $slug, 'Admin xác nhận ghi đè nội dung plugin lên Page lệch mốc'); $notice = 'Đã ghi đè nội dung plugin cho trang ' . $slug . '.'; }
                    } else $notice_err = 'Không tìm thấy Page ' . $slug . '.';
                }
            }
        } elseif ($act === 'rollback') {
            $bkid = isset($_POST['ptv_ss_backup_id']) ? sanitize_text_field(wp_unslash($_POST['ptv_ss_backup_id'])) : '';
            $backups = get_option('ptv_ss_backups', array());
            $found = null;
            if (is_array($backups)) foreach ($backups as $bk) if (isset($bk['id']) && $bk['id'] === $bkid) $found = $bk;
            if (!$found) {
                $notice_err = 'Không tìm thấy bản backup ' . $bkid . '.';
            } elseif (empty($_POST['ptv_ss_confirm_rb'])) {
                $notice_err = 'Chưa khôi phục: cần tích ô xác nhận.';
            } else {
                // Backup trang thai hien tai truoc khi khoi phuc; loi thi huy, khong ghi gi ca.
                $pre_slugs = array();
                foreach (array_keys($found['pages']) as $k) if ($k !== '__front' && $k !== '__menu') $pre_slugs[] = $k;
                $pre_bk = ptv_ss_backup($pre_slugs, 'pre-rollback', true);
                if ($pre_bk === false) {
                    $notice_err = 'Đã hủy khôi phục vì không lưu được backup của trạng thái hiện tại.';
                    ptv_ss_log('rollback_abort', '', 'Hủy rollback về bản ' . $found['id'] . ' vì pre-rollback backup thất bại');
                } else {
                    $backs_now = get_option('ptv_ss_backups', array());
                    $ids_now = array();
                    if (is_array($backs_now)) foreach ($backs_now as $b2) if (isset($b2['id'])) $ids_now[] = $b2['id'];
                    if (!in_array($found['id'], $ids_now, true)) {
                        $keep = array();
                        if (is_array($backs_now)) foreach ($backs_now as $b2) { $keep[] = $b2; if (count($keep) >= 2) break; }
                        $keep[] = $found;
                        $pin_ok = update_option('ptv_ss_backups', $keep, false);
                        if (!$pin_ok) {
                            $pre_bk = false;
                            $notice_err = 'Đã hủy khôi phục vì không ghim lại được bản backup đang chọn vào danh sách.';
                            ptv_ss_log('rollback_abort', '', 'Hủy rollback về bản ' . $found['id'] . ' vì ghim lại snapshot thất bại');
                        } else {
                            ptv_ss_log('rollback_pin', '', 'Đã ghim lại bản backup ' . $found['id'] . ' để không bị đẩy khỏi danh sách 3 bản gần nhất');
                        }
                    }
                }
                if ($pre_bk !== false) {
                    // Preflight: xac minh toan bo doi tuong dich truoc khi ghi bat cu thu gi.
                    $preflight_errors = array();
                    foreach ($found['pages'] as $pslug => $psaved) {
                        if ($pslug === '__menu') continue;
                        if ($pslug === '__front') {
                            $ef = (int) get_option('page_on_front');
                            if (!$ef) { $hh = get_page_by_path('trang-chu'); if ($hh) $ef = (int) $hh->ID; }
                            $fp0 = get_post((int) $psaved['id']);
                            if (!$fp0 || $fp0->post_type !== 'page' || (int) $psaved['id'] !== $ef) $preflight_errors[] = 'trang chủ không còn khớp trang chủ hiện tại';
                            continue;
                        }
                        $tp0 = get_post((int) $psaved['id']);
                        if (!$tp0 || $tp0->post_name !== $pslug || $tp0->post_type !== 'page') $preflight_errors[] = $pslug . ' không còn tồn tại hoặc đã đổi slug/loại';
                    }
                    if ($preflight_errors) {
                        $pre_bk = false;
                        $notice_err = 'Đã hủy khôi phục vì kiểm tra trước khi ghi phát hiện vấn đề: ' . implode('; ', $preflight_errors);
                        ptv_ss_log('rollback_abort', '', 'Preflight rollback về bản ' . $found['id'] . ' thất bại: ' . implode('; ', $preflight_errors));
                    }
                }
                if ($pre_bk !== false) {
                $restored = array(); $errors = array(); $to_baseline = array();
                $file_by_slug = array();
                foreach ($pages as $pp) $file_by_slug[$pp['slug']] = $pp['file'];
                foreach ($found['pages'] as $slug => $saved) {
                    if ($slug === '__front') {
                        $expect_front = (int) get_option('page_on_front');
                        if (!$expect_front) { $h = get_page_by_path('trang-chu'); if ($h) $expect_front = (int) $h->ID; }
                        $fp = get_post((int) $saved['id']);
                        if (!$fp || $fp->post_type !== 'page' || (int) $saved['id'] !== $expect_front) {
                            $errors[] = 'trang chủ: Page trong backup không còn là trang chủ hiện tại nên đã bỏ qua';
                            ptv_ss_log('rollback_error', 'trang-chu', 'Bỏ qua khôi phục trang chủ vì ID ' . (int) $saved['id'] . ' không khớp trang chủ hiện tại ' . $expect_front);
                        } else {
                            $r = wp_update_post(array('ID' => $saved['id'], 'post_content' => $saved['content'], 'post_title' => $saved['title']), true);
                            if (is_wp_error($r)) { $errors[] = 'trang chủ: ' . $r->get_error_message(); ptv_ss_log('rollback_error', 'trang-chu', $r->get_error_message()); }
                            else {
                                update_post_meta($saved['id'], '_yoast_wpseo_title', isset($saved['seo_title']) ? $saved['seo_title'] : '');
                                update_post_meta($saved['id'], '_yoast_wpseo_metadesc', isset($saved['seo_desc']) ? $saved['seo_desc'] : '');
                                $fp2 = get_post((int) $saved['id']);
                                $body_ok = $fp2 && ptv_ss_hash($fp2->post_content) === ptv_ss_hash($saved['content']);
                                $meta_ok = (string) get_post_meta($saved['id'], '_yoast_wpseo_title', true) === (string) (isset($saved['seo_title']) ? $saved['seo_title'] : '')
                                    && (string) get_post_meta($saved['id'], '_yoast_wpseo_metadesc', true) === (string) (isset($saved['seo_desc']) ? $saved['seo_desc'] : '');
                                if ($body_ok && $meta_ok) { $restored[] = 'trang-chu'; ptv_ss_log('rollback', 'trang-chu', 'Khôi phục trang chủ và SEO meta từ backup ' . $found['id']); }
                                else { $errors[] = 'trang chủ: kiểm chứng sau khôi phục thất bại'; ptv_ss_log('rollback_error', 'trang-chu', 'Kiểm chứng nội dung/meta trang chủ sau khôi phục không khớp bản backup'); }
                            }
                        }
                        continue;
                    }
                    if ($slug === '__menu') {
                        // Khoi phuc menu dang KHOA (quyet dinh vong 5): WordPress khong co
                        // co che thay menu nguyen tu, xoa roi dung lai co the mat du lieu.
                        // Du lieu menu trong backup chi giu lam tham khao.
                        ptv_ss_log('rollback_menu_locked', 'menu', 'Bỏ qua khôi phục menu từ backup ' . $found['id'] . ' vì tính năng khôi phục menu đang khóa');
                        continue;
                    }
                    $page = get_post((int) $saved['id']);
                    if (!$page || $page->post_name !== $slug || $page->post_type !== 'page') {
                        $errors[] = $slug . ': Page hiện tại không khớp ID/slug đã lưu';
                        ptv_ss_log('rollback_error', $slug, 'Bỏ qua vì Page ID ' . (int) $saved['id'] . ' không còn khớp slug');
                        continue;
                    }
                    $r = wp_update_post(array('ID' => $saved['id'], 'post_content' => $saved['content'], 'post_title' => $saved['title']), true);
                    if (is_wp_error($r)) { $errors[] = $slug . ': ' . $r->get_error_message(); ptv_ss_log('rollback_error', $slug, $r->get_error_message()); }
                    else {
                        $restored[] = $slug;
                        ptv_ss_log('rollback', $slug, 'Khôi phục từ backup ' . $found['id']);
                        if (isset($file_by_slug[$slug]) && ptv_ss_hash($saved['content']) === ptv_ss_hash(ptv_ss_plugin_content($file_by_slug[$slug]))) {
                            $to_baseline[] = $slug;
                        } else {
                            // Noi dung khoi phuc khac ban plugin: khoa moc de khong bi
                            // dong bo lan sau de len, cho admin quyet dinh rieng.
                            $baseline = ptv_ss_get_baseline();
                            if (isset($baseline[$slug])) { unset($baseline[$slug]); update_option('ptv_ss_baseline', $baseline, false); }
                            ptv_ss_log('rollback_lock', $slug, 'Đã xóa mốc sau khôi phục vì nội dung khôi phục khác bản plugin; trang được khóa cho tới khi admin chốt mốc hoặc ghi đè');
                        }
                    }
                }
                ptv_ss_record_baseline('rollback', $to_baseline);
                $notice = 'Đã khôi phục ' . count($restored) . ' mục từ backup ' . $found['id'] . ': ' . implode(', ', $restored) . '.' . (isset($found['pages']['__menu']) ? ' Phần menu trong bản backup không được khôi phục vì tính năng này đang khóa, dữ liệu menu chỉ giữ làm tham khảo.' : '');
                if ($errors) $notice_err = 'Một số mục không khôi phục được: ' . implode('; ', $errors);
                }
            }
        }
    }
    $labels = array(
        'synced' => 'Đã khớp',
        'update' => 'Plugin có bản mới',
        'conflict' => 'Đã sửa tay (xung đột)',
        'missing' => 'Chưa có Page',
        'nobaseline' => 'Chưa có mốc',
    );
    echo '<div class="wrap"><h1>Đồng bộ nội dung công cụ PhongThuy</h1>';
    echo '<p>Trang này cho xem trước và đồng bộ có kiểm soát. Trang đã sửa tay (lệch mốc) mặc định không bị ghi đè ở bất kỳ đường nào, kể cả khi kích hoạt plugin. Mọi lần ghi đều cần backup thành công trước và đều có nhật ký. Trang chủ, menu và SEO meta được bảo vệ riêng.</p>';
    if ($notice) echo '<div class="notice notice-success"><p>' . esc_html($notice) . '</p></div>';
    if ($notice_err) echo '<div class="notice notice-error"><p>' . esc_html($notice_err) . '</p></div>';
    echo '<form method="post" style="margin:12px 0">';
    wp_nonce_field('ptv_ss_action');
    echo '<button class="button button-primary" name="ptv_ss_action" value="sync_safe">Đồng bộ các trang an toàn (tạo mới và cập nhật, bỏ qua trang xung đột)</button>';
    echo '</form>';
    echo '<table class="widefat striped"><thead><tr><th>Trang</th><th>Trạng thái</th><th>Thay đổi so với DB</th><th>Thao tác</th></tr></thead><tbody>';
    foreach ($pages as $p) {
        $st = ptv_ss_page_status($p);
        $diff_txt = '';
        $diff_html = '';
        if ($st['status'] === 'update' || $st['status'] === 'conflict' || $st['status'] === 'nobaseline') {
            $d = ptv_ss_line_diff($st['page'] ? $st['page']->post_content : '', ptv_ss_plugin_content($p['file']));
            $diff_txt = ($d['add'] === null) ? 'Quá dài để đếm' : ('+' . $d['add'] . ' / -' . $d['del'] . ' dòng');
            $diff_html = $d['html'];
        }
        echo '<tr><td><strong>' . esc_html($p['slug']) . '</strong><br>' . esc_html($p['title']) . ($st['page'] ? '<br>ID ' . (int) $st['page']->ID : '') . '</td>';
        echo '<td>' . esc_html($labels[$st['status']]) . '</td><td>' . esc_html($diff_txt) . '</td>';
        echo '<td>';
        if ($diff_html) echo '<details><summary>Xem diff</summary>' . $diff_html . '</details>';
        if ($st['status'] === 'conflict' || $st['status'] === 'nobaseline') {
            echo '<form method="post" style="margin-top:6px">';
            wp_nonce_field('ptv_ss_action');
            echo '<input type="hidden" name="ptv_ss_slug" value="' . esc_attr($p['slug']) . '">';
            echo '<label><input type="checkbox" name="ptv_ss_confirm" value="' . esc_attr($p['slug']) . '"> Tôi đã đọc kỹ hai lựa chọn dưới đây cho đúng trang này</label><br>';
            echo '<button class="button" name="ptv_ss_action" value="force_one">Ghi đè bằng nội dung plugin</button> ';
            echo '<button class="button" name="ptv_ss_action" value="seed_one">Chốt mốc theo nội dung hiện tại</button>';
            echo '<p class="description">Ghi đè: nội dung sửa tay sẽ bị thay bằng bản plugin (đã có backup). Chốt mốc: giữ nội dung hiện tại làm chuẩn, từ nay plugin có bản mới thì trang này được coi là cập nhật an toàn.</p></form>';
        }
        echo '</td></tr>';
    }
    echo '</tbody></table>';
    $front_id = (int) get_option('page_on_front');
    echo '<h2>Trang chủ</h2><p>Trang chủ hiện tại (ID ' . $front_id . ') không tham gia đồng bộ tại trang này. Khi kích hoạt, nội dung trang chủ chỉ bị thay nếu đang trống hoặc đang là shortcode của plugin; nội dung tự viết sẽ được giữ lại và ghi nhật ký.</p>';
    $menu_mode = get_option('ptv_ss_menu_mode', '');
    echo '<h2>Menu chính</h2>';
    if ($menu_mode === 'manual') {
        echo '<p>Menu hiện đang ở chế độ <strong>thủ công</strong>: plugin tôn trọng menu bạn đang dùng và không bao giờ tự dựng lại khi kích hoạt.</p>';
        echo '<form method="post" style="margin:6px 0">';
        wp_nonce_field('ptv_ss_action');
        echo '<label><input type="checkbox" name="ptv_ss_confirm_menu" value="1"> Tôi muốn chuyển menu sang chế độ plugin quản lý (lần kích hoạt sau menu sẽ được dựng lại theo plugin)</label> ';
        echo '<button class="button" name="ptv_ss_action" value="menu_to_managed">Chuyển sang plugin quản lý</button></form>';
    } elseif ($menu_mode === 'managed') {
        echo '<p>Menu đang ở chế độ <strong>plugin quản lý</strong>: plugin dựng lại menu khi kích hoạt, nhưng nếu phát hiện menu đã bị sửa tay so với bản plugin dựng thì sẽ tự chuyển sang chế độ thủ công và giữ nguyên.</p>';
    } else {
        echo '<p>Menu chưa được phân loại. Ở lần kích hoạt sau, nếu menu đã có sẵn nội dung thì plugin sẽ tự xếp vào chế độ thủ công và giữ nguyên.</p>';
    }
    $backups = get_option('ptv_ss_backups', array());
    echo '<h2>Backup và khôi phục</h2>';
    if (is_array($backups) && $backups) {
        foreach ($backups as $bk) {
            if (!isset($bk['id'])) continue;
            echo '<form method="post" style="margin:6px 0">';
            wp_nonce_field('ptv_ss_action');
            echo '<input type="hidden" name="ptv_ss_backup_id" value="' . esc_attr($bk['id']) . '">';
            echo esc_html(date('d/m/Y H:i:s', $bk['time'])) . ' bởi ' . esc_html($bk['user']) . ', lý do: ' . esc_html($bk['reason']) . ', gồm ' . count($bk['pages']) . ' trang (ID ' . esc_html($bk['id']) . '). ';
            echo '<label><input type="checkbox" name="ptv_ss_confirm_rb" value="1"> Xác nhận khôi phục</label> ';
            echo '<button class="button" name="ptv_ss_action" value="rollback">Khôi phục bản này</button></form>';
        }
    } else echo '<p>Chưa có bản backup nào. Backup được tạo tự động trước mỗi lần ghi.</p>';
    $log = get_option('ptv_ss_log', array());
    echo '<h2>Nhật ký đồng bộ (30 mục gần nhất)</h2>';
    if (is_array($log) && $log) {
        echo '<table class="widefat striped"><thead><tr><th>Thời gian</th><th>Người</th><th>Hành động</th><th>Trang</th><th>Chi tiết</th></tr></thead><tbody>';
        foreach (array_slice($log, 0, 30) as $e) {
            echo '<tr><td>' . esc_html(date('d/m/Y H:i:s', $e['time'])) . '</td><td>' . esc_html($e['user']) . '</td><td>' . esc_html($e['action']) . '</td><td>' . esc_html($e['slug']) . '</td><td>' . esc_html($e['detail']) . '</td></tr>';
        }
        echo '</tbody></table>';
    } else echo '<p>Chưa có mục nhật ký nào.</p>';
    echo '</div>';
}
