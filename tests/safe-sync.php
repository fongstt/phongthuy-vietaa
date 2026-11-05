<?php
/* Regression tests for the Issue #2 safe-sync layer (plugin v1.54 candidate).
 * Runs the real plugin file against in-memory WordPress stubs.
 * Usage: php tests/safe-sync.php  (exit code 0 = all pass)
 */
error_reporting(E_ALL & ~E_DEPRECATED);

define('ABSPATH', '/tmp/wp-stub/');

$GLOBALS['wp_options'] = array();
$GLOBALS['pages'] = array();       // id => stdClass page
$GLOBALS['next_id'] = 1000;
$GLOBALS['fail_slugs'] = array();  // slugs whose wp_update_post must fail

class WP_Error {
    public $msg;
    public function __construct($code = '', $message = '') { $this->msg = $message; }
    public function get_error_message() { return $this->msg; }
}
function is_wp_error($t) { return $t instanceof WP_Error; }
function add_action() {}
function add_shortcode() {}
function register_activation_hook() {}
function plugin_dir_path($file) { return __DIR__ . '/../plugin/phongthuy-tools/'; }
function plugins_url() { return 'https://example.test/wp-content/plugins/phongthuy-tools/'; }
function get_option($k, $default = false) { return array_key_exists($k, $GLOBALS['wp_options']) ? $GLOBALS['wp_options'][$k] : $default; }
function update_option($k, $v, $autoload = null) {
    if (isset($GLOBALS['fail_option_keys']) && in_array($k, $GLOBALS['fail_option_keys'], true)) return false;
    $GLOBALS['wp_options'][$k] = $v; return true;
}
function get_page_by_path($slug) {
    foreach ($GLOBALS['pages'] as $p) if ($p->post_name === $slug && $p->post_type === 'page') return $p;
    return null;
}
function get_post($id) { return isset($GLOBALS['pages'][(int) $id]) ? $GLOBALS['pages'][(int) $id] : null; }
function wp_update_post($args, $wp_error = false) {
    $p = isset($GLOBALS['pages'][(int) $args['ID']]) ? $GLOBALS['pages'][(int) $args['ID']] : null;
    if (!$p) return $wp_error ? new WP_Error('no_page', 'Page not found') : 0;
    if (in_array($p->post_name, $GLOBALS['fail_slugs'], true)) return $wp_error ? new WP_Error('fail', 'Injected failure') : 0;
    if (isset($args['post_content'])) $p->post_content = $args['post_content'];
    if (isset($args['post_title'])) $p->post_title = $args['post_title'];
    return $p->ID;
}
function wp_insert_post($args, $wp_error = false) {
    $id = $GLOBALS['next_id']++;
    $p = new stdClass();
    $p->ID = $id;
    $p->post_name = $args['post_name'];
    $p->post_title = $args['post_title'];
    $p->post_content = $args['post_content'];
    $p->post_type = 'page';
    $GLOBALS['pages'][$id] = $p;
    return $id;
}
function update_post_meta($id, $key, $value) {
    $GLOBALS['post_meta'][(int) $id][$key] = $value;
    return true;
}
function get_post_meta($id, $key, $single = false) {
    return isset($GLOBALS['post_meta'][(int) $id][$key]) ? $GLOBALS['post_meta'][(int) $id][$key] : '';
}
function get_theme_mod($k, $d = false) {
    return isset($GLOBALS['theme_mods'][$k]) ? $GLOBALS['theme_mods'][$k] : $d;
}
function set_theme_mod($k, $v) { $GLOBALS['theme_mods'][$k] = $v; return true; }
function wp_get_current_user() { $u = new stdClass(); $u->user_login = 'tester'; return $u; }
function current_user_can() { return true; }
function check_admin_referer() { return true; }
function wp_nonce_field() { return ''; }
function wp_die($msg) { throw new Exception('wp_die: ' . $msg); }
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function esc_attr($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function esc_url($s) { return $s; }
function sanitize_key($s) { return strtolower(preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) $s)); }
function sanitize_title($s) { return strtolower(trim(preg_replace('/[^a-zA-Z0-9\-]/', '-', (string) $s), '-')); }
function sanitize_text_field($s) { return trim((string) $s); }
function wp_unslash($v) { return $v; }
function checked() { return ''; }
function home_url($p = '') { return 'https://example.test' . $p; }
function get_permalink($p) { return 'https://example.test/' . $p->post_name . '/'; }
$GLOBALS['menus'] = array();
$GLOBALS['next_menu_id'] = 500;
function wp_get_nav_menu_object($name) {
    if (!isset($GLOBALS['menus'][$name])) return null;
    $o = new stdClass(); $o->term_id = $GLOBALS['menus'][$name]['term_id']; return $o;
}
function wp_create_nav_menu($name) {
    $id = $GLOBALS['next_menu_id']++;
    $GLOBALS['menus'][$name] = array('term_id' => $id, 'items' => array());
    return $id;
}
function test_menu_name_by_id($id) {
    foreach ($GLOBALS['menus'] as $n => $m) if ($m['term_id'] === (int) $id) return $n;
    return null;
}
function wp_get_nav_menu_items($id) {
    $n = test_menu_name_by_id($id);
    return $n ? $GLOBALS['menus'][$n]['items'] : false;
}
function wp_update_nav_menu_item($menu_id, $item_id, $args) {
    $n = test_menu_name_by_id($menu_id);
    if (!$n) return new WP_Error('x', 'no menu');
    $GLOBALS['menu_item_calls'] = isset($GLOBALS['menu_item_calls']) ? $GLOBALS['menu_item_calls'] + 1 : 1;
    if (!empty($GLOBALS['fail_menu_on_call']) && $GLOBALS['menu_item_calls'] === (int) $GLOBALS['fail_menu_on_call']) {
        return new WP_Error('injected', 'Injected menu item failure');
    }
    $it = new stdClass();
    $it->ID = $GLOBALS['next_id']++;
    $it->title = $args['menu-item-title'];
    $it->menu_item_parent = (int) $args['menu-item-parent-id'];
    $it->type = isset($args['menu-item-type']) ? $args['menu-item-type'] : 'custom';
    $it->object = isset($args['menu-item-object']) ? $args['menu-item-object'] : '';
    $it->object_id = isset($args['menu-item-object-id']) ? (int) $args['menu-item-object-id'] : 0;
    if (isset($args['menu-item-url']) && $args['menu-item-url'] !== '') $it->url = $args['menu-item-url'];
    elseif ($it->type === 'post_type' && $it->object_id) $it->url = 'https://example.test/?page_id=' . $it->object_id;
    else $it->url = '';
    $cls = isset($args['menu-item-classes']) ? trim((string) $args['menu-item-classes']) : '';
    $it->classes = $cls === '' ? array() : explode(' ', $cls);
    $it->attr_title = isset($args['menu-item-attr-title']) ? $args['menu-item-attr-title'] : '';
    $it->target = isset($args['menu-item-target']) ? $args['menu-item-target'] : '';
    $it->description = isset($args['menu-item-description']) ? $args['menu-item-description'] : '';
    $it->xfn = isset($args['menu-item-xfn']) ? $args['menu-item-xfn'] : '';
    $it->menu_order = isset($args['menu-item-position']) ? (int) $args['menu-item-position'] : 0;
    $GLOBALS['menus'][$n]['items'][] = $it;
    return $it->ID;
}
function wp_delete_post($id, $force = false) {
    foreach ($GLOBALS['menus'] as $n => $m) {
        $GLOBALS['menus'][$n]['items'] = array_values(array_filter($m['items'], function ($it) use ($id) { return $it->ID !== (int) $id; }));
    }
    return true;
}

require __DIR__ . '/../plugin/phongthuy-tools/phongthuy-tools.php';

$fail = 0; $pass = 0;
function ok($cond, $label) {
    global $fail, $pass;
    if ($cond) { $pass++; echo "PASS  $label\n"; }
    else { $fail++; echo "FAIL  $label\n"; }
}
function reset_state() {
    $GLOBALS['wp_options'] = array();
    $GLOBALS['pages'] = array();
    $GLOBALS['fail_slugs'] = array();
    $GLOBALS['fail_option_keys'] = array();
    $GLOBALS['menus'] = array();
    $GLOBALS['post_meta'] = array();
    $GLOBALS['theme_mods'] = array();
    $GLOBALS['menu_item_calls'] = 0;
    $GLOBALS['fail_menu_on_call'] = 0;
    $_POST = array();
}
function make_page($slug, $content, $title = 'T') {
    $id = $GLOBALS['next_id']++;
    $p = new stdClass();
    $p->ID = $id; $p->post_name = $slug; $p->post_title = $title; $p->post_content = $content; $p->post_type = 'page';
    $GLOBALS['pages'][$id] = $p;
    return $p;
}
function render_action($post) {
    $_POST = $post;
    ob_start();
    try { ptv_ss_render(); } catch (Exception $e) { echo $e->getMessage(); }
    return ob_get_clean();
}
function set_baseline($slug, $db_content) {
    $b = ptv_ss_get_baseline();
    $pg = get_page_by_path($slug);
    $b[$slug] = array('id' => $pg ? (int) $pg->ID : 0, 'db' => ptv_ss_hash($db_content), 'plugin' => 'x', 'time' => time(), 'source' => 'test');
    update_option('ptv_ss_baseline', $b, false);
}

/* ---------- 1. Status truth table ---------- */
ok(ptv_ss_status('A', 'B', null, false) === 'missing', 'status: missing when no page');
ok(ptv_ss_status('A', 'A', null, true) === 'synced', 'status: synced when db == plugin');
ok(ptv_ss_status('A', 'B', null, true) === 'nobaseline', 'status: nobaseline when no baseline');
ok(ptv_ss_status('A', 'B', 'B', true) === 'update', 'status: update when db == baseline and plugin differs');
ok(ptv_ss_status('A', 'C', 'B', true) === 'conflict', 'status: conflict when db deviates from baseline');

$plugin_boi = ptv_ss_plugin_content('page-boi-kieu.html');
$plugin_dat = ptv_ss_plugin_content('page-dat-ten-con.html');
ok($plugin_boi !== '' && $plugin_dat !== '', 'fixtures: real plugin content files readable');

/* ---------- 2. Two rounds of safe sync never overwrite a hand edit (P0-2) ---------- */
reset_state();
$conflict = make_page('boi-kieu', 'NOI DUNG SUA TAY');
set_baseline('boi-kieu', 'BAN GOC DA DONG BO');
$upd = make_page('dat-ten-con', 'BAN CU CUA PLUGIN');
set_baseline('dat-ten-con', 'BAN CU CUA PLUGIN');
$base_conflict_before = ptv_ss_get_baseline()['boi-kieu']['db'];
render_action(array('ptv_ss_action' => 'sync_safe'));
ok(get_page_by_path('boi-kieu')->post_content === 'NOI DUNG SUA TAY', 'round 1: conflict page untouched by sync_safe');
ok(get_page_by_path('dat-ten-con')->post_content === $plugin_dat, 'round 1: update page synced to plugin content');
ok(ptv_ss_get_baseline()['boi-kieu']['db'] === $base_conflict_before, 'round 1: conflict baseline NOT reset (P0-2 regression)');
render_action(array('ptv_ss_action' => 'sync_safe'));
ok(get_page_by_path('boi-kieu')->post_content === 'NOI DUNG SUA TAY', 'round 2: conflict page STILL untouched after second sync_safe');

/* ---------- 3. Partial failure keeps the failed page baseline ---------- */
reset_state();
$pg = make_page('dat-ten-con', 'BAN CU');
set_baseline('dat-ten-con', 'BAN CU');
$GLOBALS['fail_slugs'] = array('dat-ten-con');
$base_before = ptv_ss_get_baseline()['dat-ten-con']['db'];
render_action(array('ptv_ss_action' => 'sync_safe'));
ok(get_page_by_path('dat-ten-con')->post_content === 'BAN CU', 'partial failure: failed page content unchanged');
ok(ptv_ss_get_baseline()['dat-ten-con']['db'] === $base_before, 'partial failure: failed page baseline unchanged');
$log = get_option('ptv_ss_log', array());
$found_sync_error = false;
if (is_array($log)) foreach ($log as $e) if ($e['action'] === 'sync_error' && $e['slug'] === 'dat-ten-con') $found_sync_error = true;
if (!$found_sync_error) echo 'LOG DUMP: ' . json_encode($log) . "\n";
ok($found_sync_error, 'partial failure: error written to audit log');

/* ---------- 4. seed_one needs per-page confirmation (P0-3) ---------- */
reset_state();
$pg = make_page('boi-kieu', 'NOI DUNG CHUA CO MOC');
render_action(array('ptv_ss_action' => 'seed_one', 'ptv_ss_slug' => 'boi-kieu'));
ok(!isset(ptv_ss_get_baseline()['boi-kieu']), 'seed without confirmation does nothing');
render_action(array('ptv_ss_action' => 'seed_one', 'ptv_ss_slug' => 'boi-kieu', 'ptv_ss_confirm' => 'boi-kieu'));
ok(isset(ptv_ss_get_baseline()['boi-kieu']) && ptv_ss_get_baseline()['boi-kieu']['db'] === ptv_ss_hash('NOI DUNG CHUA CO MOC'), 'seed with per-page confirmation sets baseline for that page only');

/* ---------- 5. force_one overwrites only the confirmed page ---------- */
reset_state();
$a = make_page('boi-kieu', 'SUA TAY A'); set_baseline('boi-kieu', 'GOC A');
$b = make_page('dat-ten-con', 'SUA TAY B'); set_baseline('dat-ten-con', 'GOC B');
$base_b = ptv_ss_get_baseline()['dat-ten-con']['db'];
render_action(array('ptv_ss_action' => 'force_one', 'ptv_ss_slug' => 'boi-kieu', 'ptv_ss_confirm' => 'boi-kieu'));
ok(get_page_by_path('boi-kieu')->post_content === $plugin_boi, 'force_one: confirmed page overwritten with plugin content');
ok(get_page_by_path('dat-ten-con')->post_content === 'SUA TAY B', 'force_one: other conflict page untouched');
ok(ptv_ss_get_baseline()['dat-ten-con']['db'] === $base_b, 'force_one: other page baseline unchanged');

/* ---------- 6. Backup + rollback by fixed ID, with identity check (P1) ---------- */
reset_state();
$p = make_page('boi-kieu', 'BAN TRUOC KHI GHI');
$bkid = ptv_ss_backup(array('boi-kieu'), 'test');
ok(is_string($bkid) && $bkid !== '', 'backup returns a fixed backup ID');
wp_update_post(array('ID' => $p->ID, 'post_content' => 'BAN SAU KHI GHI'));
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_page_by_path('boi-kieu')->post_content === 'BAN TRUOC KHI GHI', 'rollback restores content by backup ID');
$p->post_content = 'BAN KHAC';
$p->post_name = 'slug-da-doi';
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok($p->post_content === 'BAN KHAC', 'rollback skips when page identity (slug) no longer matches');

/* ---------- 7. Activation protects hand edits, front page, and baselines (P0-1) ---------- */
reset_state();
$hand = make_page('boi-kieu', 'SUA TAY TRUOC KHI KICH HOAT');
set_baseline('boi-kieu', 'BAN GOC');
$base_hand = ptv_ss_get_baseline()['boi-kieu']['db'];
$front = make_page('trang-chu', 'TRANG CHU TU VIET');
update_option('page_on_front', $front->ID, false);
ptv_on_activate();
ok(get_page_by_path('boi-kieu')->post_content === 'SUA TAY TRUOC KHI KICH HOAT', 'activation: hand-edited page skipped, content preserved');
ok(ptv_ss_get_baseline()['boi-kieu']['db'] === $base_hand, 'activation: skipped page baseline unchanged');
ok(get_post($front->ID)->post_content === 'TRANG CHU TU VIET', 'activation: custom front page content preserved');
ok(get_page_by_path('dat-ten-con') !== null && get_page_by_path('dat-ten-con')->post_content === $plugin_dat, 'activation: untouched pages still sync as before (deploy path intact)');
$backs = get_option('ptv_ss_backups', array());
ok(!empty($backs) && $backs[0]['reason'] === 'pre-activation', 'activation: pre-activation backup snapshot taken');

/* ---------- 8. Activation aborts when pre-activation backup fails (P0-A) ---------- */
reset_state();
$pg = make_page('boi-kieu', 'BAN CU DANG CHAY');
set_baseline('boi-kieu', 'BAN CU DANG CHAY');
$GLOBALS['fail_option_keys'] = array('ptv_ss_backups');
ptv_on_activate();
ok(get_page_by_path('boi-kieu')->post_content === 'BAN CU DANG CHAY', 'backup failure: activation writes nothing');
ok(get_page_by_path('dat-ten-con') === null, 'backup failure: activation creates no new pages');
$log = get_option('ptv_ss_log', array());
$found_abort = false;
if (is_array($log)) foreach ($log as $e) if ($e['action'] === 'activation_abort') $found_abort = true;
ok($found_abort, 'backup failure: activation_abort written to log');

/* ---------- 9. Upgrade from v1.53: existing page without baseline is protected (P0-B) ---------- */
reset_state();
$pg = make_page('boi-kieu', 'TRANG TUY CHINH TU THOI V1.53');
$pg2 = make_page('dat-ten-con', $plugin_dat);
ptv_on_activate();
ok(get_page_by_path('boi-kieu')->post_content === 'TRANG TUY CHINH TU THOI V1.53', 'upgrade: custom page without baseline is NOT overwritten');
ok(!isset(ptv_ss_get_baseline()['boi-kieu']), 'upgrade: skipped page does not get a baseline');
ok(isset(ptv_ss_get_baseline()['dat-ten-con']), 'upgrade: page already matching plugin content gets baselined');

/* ---------- 10. Front page with embedded shortcode is preserved (P0-C) ---------- */
reset_state();
$front = make_page('trang-chu', 'Noi dung builder [ptv_trang_chu_tools] chen o giua');
update_option('page_on_front', $front->ID, false);
ptv_on_activate();
ok(get_post($front->ID)->post_content === 'Noi dung builder [ptv_trang_chu_tools] chen o giua', 'front page: builder content with embedded shortcode preserved');

/* ---------- 11. Adopted manual menu is NEVER rebuilt automatically (round-3 P0) ---------- */
reset_state();
$mid = wp_create_nav_menu('Menu Phong Thủy VietAA');
wp_update_nav_menu_item($mid, 0, array('menu-item-title' => 'Menu Tu Lam', 'menu-item-url' => 'https://example.test/tu-lam/', 'menu-item-parent-id' => 0));
ptv_ensure_menu();
$items = wp_get_nav_menu_items($mid);
ok(count($items) === 1 && $items[0]->title === 'Menu Tu Lam', 'menu: existing unsigned menu kept as-is on first run');
ok(get_option('ptv_ss_menu_mode', '') === 'manual', 'menu: adopted menu classified as manual mode');
ptv_ensure_menu();
$items2 = wp_get_nav_menu_items($mid);
ok(count($items2) === 1 && $items2[0]->title === 'Menu Tu Lam', 'menu: second activation STILL keeps the manual menu (round-3 P0 regression)');
wp_update_nav_menu_item($mid, 0, array('menu-item-title' => 'Muc Them Sau Nay', 'menu-item-url' => 'https://example.test/them/', 'menu-item-parent-id' => 0));
set_theme_mod('nav_menu_locations', array('primary' => 999));
ptv_ensure_menu();
$items3 = wp_get_nav_menu_items($mid);
ok(count($items3) === 2, 'menu: third activation keeps hand edits made after adoption');
$locs = get_theme_mod('nav_menu_locations', array());
ok((int) $locs['primary'] === 999, 'menu: manual mode never steals configured theme locations');

/* ---------- 11b. Plugin-managed menu rebuilds, but a hand edit adopts it to manual ---------- */
reset_state();
ptv_ensure_menu();
ok(get_option('ptv_ss_menu_mode', '') === 'managed', 'menu: freshly built menu is plugin-managed');
$menu_obj = wp_get_nav_menu_object('Menu Phong Thủy VietAA');
$built = wp_get_nav_menu_items((int) $menu_obj->term_id);
ok(count($built) > 1 && $built[0]->title === 'Trang chủ', 'menu: managed menu built from directory');
$GLOBALS['menus']['Menu Phong Thủy VietAA']['items'][0]->title = 'Tieu De Bi Sua Tay';
ptv_ensure_menu();
$after = wp_get_nav_menu_items((int) $menu_obj->term_id);
ok($after[0]->title === 'Tieu De Bi Sua Tay', 'menu: hand edit on managed menu is preserved');
ok(get_option('ptv_ss_menu_mode', '') === 'manual', 'menu: hand-edited managed menu adopted to manual');

/* ---------- 12. Rollback locks the page until the admin decides (round-3 P1) ---------- */
reset_state();
$p = make_page('boi-kieu', 'BAN CU CAN KHOI PHUC');
$bkid = ptv_ss_backup(array('boi-kieu'), 'test-rollback-lock');
wp_update_post(array('ID' => $p->ID, 'post_content' => $plugin_boi));
set_baseline('boi-kieu', $plugin_boi);
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_page_by_path('boi-kieu')->post_content === 'BAN CU CAN KHOI PHUC', 'rollback lock: content restored');
ok(!isset(ptv_ss_get_baseline()['boi-kieu']), 'rollback lock: baseline removed so the page is locked, not marked update');
render_action(array('ptv_ss_action' => 'sync_safe'));
ok(get_page_by_path('boi-kieu')->post_content === 'BAN CU CAN KHOI PHUC', 'rollback lock: following sync_safe does NOT overwrite restored content');
ptv_on_activate();
ok(get_page_by_path('boi-kieu')->post_content === 'BAN CU CAN KHOI PHUC', 'rollback lock: following activation does NOT overwrite restored content');

/* ---------- 13. Front page backup extras + Yoast meta protection (round-3 P1) ---------- */
reset_state();
$front = make_page('trang-chu', '[ptv_trang_chu_tools]');
update_option('page_on_front', $front->ID, false);
update_post_meta($front->ID, '_yoast_wpseo_title', 'TIEU DE SEO TUY CHINH');
ptv_on_activate();
ok(get_post_meta($front->ID, '_yoast_wpseo_title', true) === 'TIEU DE SEO TUY CHINH', 'front: custom Yoast meta preserved when body already is the lone shortcode');
reset_state();
$front = make_page('trang-chu', 'TRANG CHU BAN CU');
update_option('page_on_front', $front->ID, false);
update_post_meta($front->ID, '_yoast_wpseo_title', 'META CU');
$bkid = ptv_ss_backup(array(), 'test-front', true);
ok(is_string($bkid), 'front: extras backup created even with no tool pages');
wp_update_post(array('ID' => $front->ID, 'post_content' => 'TRANG CHU BAN MOI'));
update_post_meta($front->ID, '_yoast_wpseo_title', 'META MOI');
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_post($front->ID)->post_content === 'TRANG CHU BAN CU', 'front: rollback restores front page content from extras snapshot');
ok(get_post_meta($front->ID, '_yoast_wpseo_title', true) === 'META CU', 'front: rollback restores front page Yoast meta');

/* ---------- 14. Menu restore is LOCKED: rollback never touches the live menu (round-5 decision) ---------- */
reset_state();
$mid = wp_create_nav_menu('Menu Phong Thủy VietAA');
wp_update_nav_menu_item($mid, 0, array('menu-item-title' => 'Muc A', 'menu-item-url' => 'https://example.test/a/', 'menu-item-parent-id' => 0));
$p = make_page('boi-kieu', 'BAN TRUOC');
$bkid = ptv_ss_backup(array('boi-kieu'), 't14', true);
wp_update_nav_menu_item($mid, 0, array('menu-item-title' => 'Muc Moi Sau Backup', 'menu-item-url' => 'https://example.test/moi/', 'menu-item-parent-id' => 0));
wp_update_post(array('ID' => $p->ID, 'post_content' => 'BAN SAU'));
$menu_before = ptv_ss_menu_snapshot();
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_page_by_path('boi-kieu')->post_content === 'BAN TRUOC', 'menu locked: page part of rollback still restores normally');
ok(ptv_ss_menu_snapshot() === $menu_before, 'menu locked: live menu completely untouched by rollback');
$log = get_option('ptv_ss_log', array());
$found_lock = false;
if (is_array($log)) foreach ($log as $e) if ($e['action'] === 'rollback_menu_locked') $found_lock = true;
ok($found_lock, 'menu locked: skip is written to audit log');
ok(!function_exists('ptv_ss_restore_menu') && !function_exists('ptv_ss_menu_rebuild'), 'menu locked: destructive menu rebuild functions no longer exist in the plugin');

/* ---------- 14b. Menu snapshot keeps full WordPress attributes (round-4 P1, capture side) ---------- */
reset_state();
$mid = wp_create_nav_menu('Menu Phong Thủy VietAA');
wp_update_nav_menu_item($mid, 0, array(
    'menu-item-title' => 'Trang Mau', 'menu-item-type' => 'post_type', 'menu-item-object' => 'page',
    'menu-item-object-id' => 939, 'menu-item-classes' => 'class-a class-b', 'menu-item-target' => '_blank',
    'menu-item-attr-title' => 'Mo ta muc', 'menu-item-description' => 'Mo ta dai', 'menu-item-xfn' => 'friend',
    'menu-item-parent-id' => 0,
));
$snap = ptv_ss_menu_snapshot();
ok($snap[0]['type'] === 'post_type' && $snap[0]['object_id'] === 939 && $snap[0]['classes'] === 'class-a class-b' && $snap[0]['target'] === '_blank' && $snap[0]['attr_title'] === 'Mo ta muc', 'menu attrs: snapshot captures type/object/classes/target/attr_title');

/* ---------- 15. Front rollback verifies identity against the CURRENT front page (round-4 P1) ---------- */
reset_state();
$front = make_page('trang-chu', 'TRANG CHU GOC');
update_option('page_on_front', $front->ID, false);
$bkid = ptv_ss_backup(array(), 't15', true);
$other = make_page('trang-khac', 'TRANG KHAC');
update_option('page_on_front', $other->ID, false);
wp_update_post(array('ID' => $front->ID, 'post_content' => 'TRANG CHU DA THAY DOI'));
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_post($front->ID)->post_content === 'TRANG CHU DA THAY DOI', 'front identity: rollback skipped because saved page is no longer the front page');
ok(get_post($other->ID)->post_content === 'TRANG KHAC', 'front identity: current front page untouched');

/* ---------- 16. Rollback takes a pre-rollback backup and pins the selected snapshot (round-4 P1) ---------- */
reset_state();
$p = make_page('boi-kieu', 'V1');
$b1 = ptv_ss_backup(array('boi-kieu'), 'one');
wp_update_post(array('ID' => $p->ID, 'post_content' => 'V2'));
$b2 = ptv_ss_backup(array('boi-kieu'), 'two');
wp_update_post(array('ID' => $p->ID, 'post_content' => 'V3'));
$b3 = ptv_ss_backup(array('boi-kieu'), 'three');
wp_update_post(array('ID' => $p->ID, 'post_content' => 'V4'));
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $b1, 'ptv_ss_confirm_rb' => '1'));
ok(get_page_by_path('boi-kieu')->post_content === 'V1', 'pre-rollback: oldest snapshot restored');
$backs = get_option('ptv_ss_backups', array());
$ids = array(); $has_pre = false;
foreach ($backs as $bb) { $ids[] = $bb['id']; if ($bb['reason'] === 'pre-rollback') $has_pre = true; }
ok($has_pre, 'pre-rollback: a pre-rollback backup of the pre-restore state exists');
ok(in_array($b1, $ids, true), 'pre-rollback: selected snapshot pinned, not evicted by the ring buffer');

/* ---------- 17. Rollback fails closed when backup storage writes fail (round-5 P1) ---------- */
reset_state();
$p = make_page('boi-kieu', 'BAN TRONG BACKUP');
$bkid = ptv_ss_backup(array('boi-kieu'), 't17');
wp_update_post(array('ID' => $p->ID, 'post_content' => 'BAN HIEN TAI'));
$GLOBALS['fail_option_keys'] = array('ptv_ss_backups');
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_page_by_path('boi-kieu')->post_content === 'BAN HIEN TAI', 'fail closed: rollback aborted when pre-rollback backup cannot be saved');

/* ---------- 18. Preflight aborts the whole rollback when any target is gone (round-5 P1) ---------- */
reset_state();
$p1 = make_page('boi-kieu', 'TRANG MOT GOC');
$p2 = make_page('dat-ten-con', 'TRANG HAI GOC');
$bkid = ptv_ss_backup(array('boi-kieu', 'dat-ten-con'), 't18');
wp_update_post(array('ID' => $p1->ID, 'post_content' => 'TRANG MOT MOI'));
wp_update_post(array('ID' => $p2->ID, 'post_content' => 'TRANG HAI MOI'));
unset($GLOBALS['pages'][$p2->ID]);
render_action(array('ptv_ss_action' => 'rollback', 'ptv_ss_backup_id' => $bkid, 'ptv_ss_confirm_rb' => '1'));
ok(get_page_by_path('boi-kieu')->post_content === 'TRANG MOT MOI', 'preflight: nothing is written when one target no longer resolves');
$log = get_option('ptv_ss_log', array());
$found_abort = false;
if (is_array($log)) foreach ($log as $e) if ($e['action'] === 'rollback_abort') $found_abort = true;
ok($found_abort, 'preflight: abort is written to audit log');

echo "\nRESULT: $pass passed, $fail failed\n";
exit($fail > 0 ? 1 : 0);
