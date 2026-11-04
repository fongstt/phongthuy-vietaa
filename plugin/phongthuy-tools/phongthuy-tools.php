<?php
/**
 * Plugin Name: PhongThuy VietAA Tools
 * Description: Bộ công cụ phong thủy cho phongthuy.vietaa.com: Đặt tên con, Bói Kiều và danh mục ứng dụng ở trang chủ. Khi kích hoạt, plugin tự tạo hoặc đồng bộ các Page ứng dụng và trang chủ.
 * Version: 1.54.0
 * Author: PhongThuy VietAA
 */

if (!defined('ABSPATH')) exit;

function ptv_enqueue_css() {
    wp_enqueue_style('ptv-custom', plugins_url('assets/ptv-custom.css', __FILE__), array(), (string) filemtime(plugin_dir_path(__FILE__) . 'assets/ptv-custom.css'));
}

function ptv_enqueue_vankhan() {
    if (is_page(array('van-khan', 'van-khan-ngay-tet'))) {
        ptv_enqueue_css();
        wp_enqueue_script('ptv-tools', plugins_url('assets/ptv-tools.js', __FILE__), array(), (string) filemtime(plugin_dir_path(__FILE__) . 'assets/ptv-tools.js'), true);
    }
}
add_action('wp_enqueue_scripts', 'ptv_enqueue_vankhan');

/* ---------------- Dat ten con ---------------- */
function ptv_dat_ten_con_shortcode() {
    ptv_enqueue_css();
    wp_enqueue_script('ptv-dat-ten', plugins_url('assets/ptv-dat-ten.js', __FILE__), array(), (string) filemtime(plugin_dir_path(__FILE__) . 'assets/ptv-dat-ten.js'), true);
    ob_start();
    ?>
    <div class="ptv-tool">
      <form id="ptv-form" class="ptv-form" method="post" action="">
        <div class="ptv-row">
          <div class="ptv-field ptv-field-name">
            <label for="ptv-name">Tên cần xem</label>
            <input type="text" id="ptv-name" name="ptv_name" value="Phạm Nhật Vượng" autocomplete="off" />
          </div>
        </div>
        <div class="ptv-row">
          <div class="ptv-field">
            <label for="ptv-gender">Giới tính</label>
            <select id="ptv-gender" name="ptv_gender">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div class="ptv-field">
            <label for="ptv-hour">Giờ sinh</label>
            <select id="ptv-hour" name="ptv_hour"></select>
          </div>
        </div>
        <div class="ptv-row">
          <div class="ptv-field">
            <label for="ptv-day">Ngày sinh</label>
            <select id="ptv-day" name="ptv_day"></select>
          </div>
          <div class="ptv-field">
            <label for="ptv-month">Tháng sinh</label>
            <select id="ptv-month" name="ptv_month"></select>
          </div>
          <div class="ptv-field">
            <label for="ptv-year">Năm sinh</label>
            <select id="ptv-year" name="ptv_year"></select>
          </div>
        </div>
        <div class="ptv-row ptv-optional">
          <p class="ptv-optional-title">Tùy chọn: đối chiếu với bố mẹ (chỉ cần năm sinh)</p>
          <div class="ptv-field">
            <label for="ptv-father">Năm sinh của bố</label>
            <select id="ptv-father" name="ptv_father"></select>
          </div>
          <div class="ptv-field">
            <label for="ptv-mother">Năm sinh của mẹ</label>
            <select id="ptv-mother" name="ptv_mother"></select>
          </div>
        </div>
        <button type="submit" class="ptv-btn">Xem kết quả</button>
      </form>
      <div id="ptv-result"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('ptv_dat_ten_con', 'ptv_dat_ten_con_shortcode');

/* ---------------- Boi Kieu ---------------- */
function ptv_boi_kieu_shortcode() {
    ptv_enqueue_css();
    wp_enqueue_script('ptv-boi-kieu', plugins_url('assets/ptv-boi-kieu.js', __FILE__), array(), (string) filemtime(plugin_dir_path(__FILE__) . 'assets/ptv-boi-kieu.js'), true);
    $topics = array('tổng quan', 'tình duyên', 'công danh', 'tài lộc', 'gia đạo', 'sức khỏe');
    ob_start();
    ?>
    <div class="ptv-tool">
      <form id="ptv-kieu-form" class="ptv-form" method="post" action="">
        <div class="ptv-row">
          <div class="ptv-field ptv-field-name">
            <label>Bạn đang muốn hỏi về điều gì?</label>
            <div class="ptv-kieu-topics">
              <?php foreach ($topics as $i => $t) : ?>
                <label class="ptv-chip"><input type="radio" name="ptv-kieu-topic" value="<?php echo esc_attr($t); ?>" <?php checked($i, 0); ?> /><span><?php echo esc_html(ucfirst($t)); ?></span></label>
              <?php endforeach; ?>
            </div>
          </div>
        </div>
        <div class="ptv-row">
          <div class="ptv-field">
            <label for="ptv-kieu-name">Họ tên của bạn (không bắt buộc)</label>
            <input type="text" id="ptv-kieu-name" name="ptv_kieu_name" value="" autocomplete="off" />
          </div>
          <div class="ptv-field">
            <label for="ptv-kieu-birth">Năm sinh (không bắt buộc)</label>
            <select id="ptv-kieu-birth" name="ptv_kieu_birth"></select>
          </div>
          <div class="ptv-field">
            <label for="ptv-kieu-num">Con số bạn nghĩ tới, từ 1 đến 999 (không bắt buộc)</label>
            <input type="text" id="ptv-kieu-num" name="ptv_kieu_num" value="" inputmode="numeric" autocomplete="off" />
          </div>
        </div>
        <button type="submit" class="ptv-btn">Tiến hành gieo quẻ</button>
      </form>
      <div id="ptv-kieu-result"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('ptv_boi_kieu', 'ptv_boi_kieu_shortcode');


/* ---------------- Cong cu chung (dot 1 tro di) ---------------- */
function ptv_tool_shortcode($atts) {
    $atts = shortcode_atts(array('slug' => ''), $atts);
    $slug = sanitize_title($atts['slug']);
    if (!$slug) return '';
    ptv_enqueue_css();
    wp_enqueue_script('ptv-tools', plugins_url('assets/ptv-tools.js', __FILE__), array(), (string) filemtime(plugin_dir_path(__FILE__) . 'assets/ptv-tools.js'), true);
    return '<div class="ptv-tool" data-ptv-tool="' . esc_attr($slug) . '"></div>';
}
add_shortcode('ptv_tool', 'ptv_tool_shortcode');

/* ---------------- Danh muc ung dung (trang chu) ---------------- */
function ptv_directory_data() {
    $file = plugin_dir_path(__FILE__) . 'data/tools-directory.json';
    if (!file_exists($file)) return null;
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? $data : null;
}
function ptv_directory_render() {
    ptv_enqueue_css();
    wp_enqueue_script('ptv-home', plugins_url('assets/ptv-home.js', __FILE__), array(), (string) filemtime(plugin_dir_path(__FILE__) . 'assets/ptv-home.js'), true);
    $data = ptv_directory_data();
    if (!$data) return '';
    $built = array('dat-ten-con' => true, 'boi-kieu' => true);
    $mf = plugin_dir_path(__FILE__) . 'data/tools-manifest.json';
    if (file_exists($mf)) {
        $mlist = json_decode(file_get_contents($mf), true);
        if (is_array($mlist)) foreach ($mlist as $t) { if (!empty($t['slug'])) $built[$t['slug']] = true; }
    }
    $by_slug = array();
    foreach ($data['groups'] as $g) foreach ($g['apps'] as $a) $by_slug[$a['slug']] = $a;
    ob_start();
    ?>
    <div class="ptv-home">
      <div class="ptv-hero">
        <span class="ptv-hero-badge">PHONG THỦY VIETAA</span>
        <h1>Toàn Bộ Các Ứng Dụng Phong Thủy Miễn Phí</h1>
        <p>59 ứng dụng xem phong thủy trực tuyến: đặt tên con, bói Kiều, xem hướng nhà, chọn ngày tốt, giải đoán mệnh lý và nhiều hơn nữa. Chọn một ứng dụng bên dưới để bắt đầu.</p>
        <div class="ptv-hero-stats"><span><strong>59</strong> ứng dụng</span><span><strong>6</strong> nhóm chủ đề</span><span><strong>100%</strong> miễn phí</span></div>
      </div>
      <div class="ptv-home-searchwrap">
        <input type="text" id="ptv-home-search" placeholder="Tìm ứng dụng, ví dụ: đặt tên, mua xe, sim, giải mộng..." autocomplete="off" />
        <p id="ptv-home-count" class="ptv-note"></p>
        <p id="ptv-home-none" class="ptv-note" style="display:none">Chưa có ứng dụng nào khớp với từ khóa này. Bạn thử từ ngắn hơn, ví dụ "tên", "ngày", "quẻ", hoặc duyệt theo 6 nhóm bên dưới nhé.</p>
        <div class="ptv-home-chips"><span>Nhu cầu hay gặp:</span>
          <a href="<?php echo esc_url(home_url('/dat-ten-con/')); ?>">Đặt tên con</a>
          <a href="<?php echo esc_url(home_url('/boi-kieu/')); ?>">Bói Kiều</a>
          <a href="<?php echo esc_url(home_url('/xem-ngay-mua-xe/')); ?>">Xem ngày mua xe</a>
          <a href="<?php echo esc_url(home_url('/sim-phong-thuy/')); ?>">Sim phong thủy</a>
          <a href="<?php echo esc_url(home_url('/xem-huong-nha-tot-xau/')); ?>">Xem hướng nhà</a>
          <a href="<?php echo esc_url(home_url('/xem-than-so-hoc/')); ?>">Thần số học</a>
          <a href="<?php echo esc_url(home_url('/giai-ma-giac-mo/')); ?>">Giải mộng</a>
          <a href="<?php echo esc_url(home_url('/thuoc-lo-ban/')); ?>">Thước Lỗ Ban</a>
        </div>
      </div>
      <h2 class="ptv-home-h2">Ứng dụng được dùng nhiều nhất</h2>
      <div class="ptv-hot">
        <?php foreach ($data['hot'] as $i => $slug) : if (!isset($by_slug[$slug])) continue; $a = $by_slug[$slug]; $is_built = isset($built[$slug]); ?>
          <?php if ($is_built) : ?>
            <a class="ptv-hot-item" href="<?php echo esc_url(home_url('/' . $slug . '/')); ?>"><span class="ptv-hot-num"><?php echo $i + 1; ?></span><span class="ptv-hot-icon"><?php echo esc_html($a['icon']); ?></span><span class="ptv-hot-name"><?php echo esc_html($a['name']); ?></span></a>
          <?php else : ?>
            <span class="ptv-hot-item is-soon"><span class="ptv-hot-num"><?php echo $i + 1; ?></span><span class="ptv-hot-icon"><?php echo esc_html($a['icon']); ?></span><span class="ptv-hot-name"><?php echo esc_html($a['name']); ?></span></span>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
      <?php foreach ($data['groups'] as $g) : ?>
      <div class="ptv-home-group" id="nhom-<?php echo esc_attr(sanitize_title($g['name'])); ?>">
        <h2 class="ptv-home-h2"><?php echo esc_html($g['name']); ?> <small><?php echo esc_html($g['subtitle']); ?></small></h2>
        <?php if (!empty($g['intro'])) : ?><p class="ptv-home-intro"><?php echo esc_html($g['intro']); ?></p><?php endif; ?>
        <div class="ptv-apps">
          <?php foreach ($g['apps'] as $a) : $is_built = isset($built[$a['slug']]); ?>
            <?php if ($is_built) : ?>
              <a class="ptv-app-card" href="<?php echo esc_url(home_url('/' . $a['slug'] . '/')); ?>"><span class="ptv-app-icon"><?php echo esc_html($a['icon']); ?></span><span class="ptv-app-name"><?php echo esc_html($a['name']); ?></span><span class="ptv-app-desc"><?php echo esc_html($a['desc']); ?></span><span class="ptv-app-go">Dùng ngay →</span></a>
            <?php else : ?>
              <span class="ptv-app-card is-soon"><span class="ptv-app-icon"><?php echo esc_html($a['icon']); ?></span><span class="ptv-app-name"><?php echo esc_html($a['name']); ?></span><span class="ptv-app-desc"><?php echo esc_html($a['desc']); ?></span><span class="ptv-app-soon">Đang xây dựng</span></span>
            <?php endif; ?>
          <?php endforeach; ?>
        </div>
      </div>
      <?php endforeach; ?>
      <?php
        $sec = plugin_dir_path(__FILE__) . 'content/content-home-sections.html';
        if (file_exists($sec)) echo '<div class="ptv-home-sections">' . file_get_contents($sec) . '</div>';
      ?>
      <div class="ptv-home-note">
        <h2>Về Phong Thủy VietAA</h2>
        <p>Phong Thủy VietAA chia sẻ miễn phí các ứng dụng phong thủy trực tuyến, từ bài trí nhà cửa, đặt tên con đến giải đoán vận mệnh. Các ứng dụng đang được xây dựng lại lần lượt với cách tính minh bạch, bạn quay lại thường xuyên để dùng thêm các ứng dụng mới nhé.</p>
      </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('ptv_trang_chu_tools', 'ptv_directory_render');

/* ---------------- Dong bo trang khi kich hoat ---------------- */
function ptv_sync_page($slug, $title, $content_file, $seo_title, $seo_desc) {
    $path = plugin_dir_path(__FILE__) . 'content/' . $content_file;
    $content = file_exists($path) ? file_get_contents($path) : '';
    $existing = get_page_by_path($slug);
    if ($existing) {
        wp_update_post(array('ID' => $existing->ID, 'post_content' => $content, 'post_title' => $title));
        $page_id = $existing->ID;
    } else {
        $page_id = wp_insert_post(array(
            'post_title'   => $title,
            'post_name'    => $slug,
            'post_content' => $content,
            'post_status'  => 'publish',
            'post_type'    => 'page',
        ));
    }
    if ($page_id && !is_wp_error($page_id)) {
        if ($seo_title) update_post_meta($page_id, '_yoast_wpseo_title', $seo_title);
        if ($seo_desc) update_post_meta($page_id, '_yoast_wpseo_metadesc', $seo_desc);
    }
    return $page_id;
}
function ptv_on_activate() {
    // Lop an toan Issue #2: backup truoc khi ghi; trang lech moc (sua tay) bi bo qua.
    $all_slugs = array();
    foreach (ptv_ss_pages() as $pp) $all_slugs[] = $pp['slug'];
    $bk = ptv_ss_backup($all_slugs, 'pre-activation', true);
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
    // Trang chu: dong bo noi dung cua trang dang duoc dat lam front page
    $front_id = (int) get_option('page_on_front');
    if (!$front_id) {
        $home = get_page_by_path('trang-chu');
        if ($home) $front_id = $home->ID;
    }
    if ($front_id) {
        $front_post = get_post($front_id);
        $front_content = $front_post ? (string) $front_post->post_content : '';
        if ($front_content === '') {
            wp_update_post(array('ID' => $front_id, 'post_content' => '[ptv_trang_chu_tools]'));
            update_post_meta($front_id, '_yoast_wpseo_title', 'Phong Thủy VietAA, toàn bộ 59 ứng dụng phong thủy miễn phí');
            update_post_meta($front_id, '_yoast_wpseo_metadesc', 'Phong Thủy VietAA chia sẻ miễn phí 59 ứng dụng phong thủy trực tuyến: đặt tên con, bói Kiều, sim phong thủy, xem hướng nhà, chọn ngày tốt, giải đoán mệnh lý và nhân tướng.');
        } elseif (trim($front_content) === '[ptv_trang_chu_tools]') {
            // Da la shortcode dung mot minh: giu nguyen ca noi dung lan SEO meta tuy chinh.
        } else {
            ptv_ss_log('activation_skip_front', 'trang-chu', 'Giữ nguyên nội dung trang chủ tự viết khi kích hoạt (ID ' . $front_id . ')');
        }
      }
    ptv_ensure_menu();
    ptv_ss_record_baseline('activation', $written);
}
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
        if (function_exists('wp_get_nav_menu_object') && function_exists('wp_get_nav_menu_items')) {
            $menu = wp_get_nav_menu_object('Menu Phong Thủy VietAA');
            if ($menu) {
                $items = wp_get_nav_menu_items((int) $menu->term_id);
                if ($items) {
                    $saved_items = array();
                    foreach ($items as $it) $saved_items[] = array('id' => (int) $it->ID, 'title' => $it->title, 'url' => $it->url, 'parent' => (int) $it->menu_item_parent);
                    $pages['__menu'] = $saved_items;
                }
            }
        }
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
/* Khoi phuc cac muc menu tu mot snapshot '__menu' (cha luon dung truoc con). */
function ptv_ss_restore_menu($saved_items) {
    if (!function_exists('wp_get_nav_menu_object') || !function_exists('wp_get_nav_menu_items') || !function_exists('wp_update_nav_menu_item')) return false;
    $menu = wp_get_nav_menu_object('Menu Phong Thủy VietAA');
    if (!$menu) return false;
    $menu_id = (int) $menu->term_id;
    $old = wp_get_nav_menu_items($menu_id);
    if ($old) foreach ($old as $it) wp_delete_post($it->ID, true);
    $id_map = array();
    $pos = 0;
    foreach ($saved_items as $it) {
        $pos++;
        $parent_new = isset($id_map[$it['parent']]) ? $id_map[$it['parent']] : 0;
        $r = wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title' => $it['title'],
            'menu-item-url' => $it['url'],
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => $parent_new,
            'menu-item-position' => $pos,
        ));
        if (is_wp_error($r)) return false;
        $id_map[$it['id']] = (int) $r;
    }
    $sig = ptv_ss_menu_signature();
    if ($sig !== null) update_option('ptv_ss_menu_sig', $sig, false);
    return true;
}
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
                $restored = array(); $errors = array(); $to_baseline = array();
                $file_by_slug = array();
                foreach ($pages as $pp) $file_by_slug[$pp['slug']] = $pp['file'];
                foreach ($found['pages'] as $slug => $saved) {
                    if ($slug === '__front') {
                        $r = wp_update_post(array('ID' => $saved['id'], 'post_content' => $saved['content'], 'post_title' => $saved['title']), true);
                        if (is_wp_error($r)) { $errors[] = 'trang chủ: ' . $r->get_error_message(); ptv_ss_log('rollback_error', 'trang-chu', $r->get_error_message()); }
                        else {
                            update_post_meta($saved['id'], '_yoast_wpseo_title', isset($saved['seo_title']) ? $saved['seo_title'] : '');
                            update_post_meta($saved['id'], '_yoast_wpseo_metadesc', isset($saved['seo_desc']) ? $saved['seo_desc'] : '');
                            $restored[] = 'trang-chu';
                            ptv_ss_log('rollback', 'trang-chu', 'Khôi phục trang chủ và SEO meta từ backup ' . $found['id']);
                        }
                        continue;
                    }
                    if ($slug === '__menu') {
                        if (ptv_ss_restore_menu($saved)) { $restored[] = 'menu'; ptv_ss_log('rollback', 'menu', 'Khôi phục các mục menu từ backup ' . $found['id']); }
                        else { $errors[] = 'menu: không khôi phục được'; ptv_ss_log('rollback_error', 'menu', 'Khôi phục menu thất bại'); }
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
                $notice = 'Đã khôi phục ' . count($restored) . ' trang từ backup ' . $found['id'] . ': ' . implode(', ', $restored) . '.';
                if ($errors) $notice_err = 'Một số trang không khôi phục được: ' . implode('; ', $errors);
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

/* ---------------- Menu chinh gom nhom theo danh muc ---------------- */
function ptv_ensure_menu() {
    if (!function_exists('wp_create_nav_menu')) return;
    $data = ptv_directory_data();
    if (!$data || empty($data['groups'])) return;
    $menu_name = 'Menu Phong Thủy VietAA';
    $menu = wp_get_nav_menu_object($menu_name);
    $menu_id = $menu ? (int) $menu->term_id : wp_create_nav_menu($menu_name);
    if (!$menu_id || is_wp_error($menu_id)) return;
    // Che do menu (Issue #2): 'manual' la menu cua admin, khong bao gio tu dung lai;
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
    $old = wp_get_nav_menu_items($menu_id);
    if ($old) foreach ($old as $it) wp_delete_post($it->ID, true);
    $pos = 0;
    $add = function ($title, $url, $parent) use ($menu_id, &$pos) {
        $pos++;
        $r = wp_update_nav_menu_item($menu_id, 0, array(
            'menu-item-title' => $title,
            'menu-item-url' => $url,
            'menu-item-status' => 'publish',
            'menu-item-type' => 'custom',
            'menu-item-parent-id' => $parent,
            'menu-item-position' => $pos,
        ));
        return is_wp_error($r) ? 0 : (int) $r;
    };
    $add('Trang chủ', home_url('/'), 0);
    foreach ($data['groups'] as $g) {
        $pid = $add($g['name'], home_url('/#nhom-' . sanitize_title($g['name'])), 0);
        foreach ($g['apps'] as $a) $add($a['name'], home_url('/' . $a['slug'] . '/'), $pid);
    }
    $extra = array('gioi-thieu' => 'Giới thiệu', 'lien-he' => 'Liên hệ');
    foreach ($extra as $slug => $label) {
        $pg = get_page_by_path($slug);
        if ($pg) $add($label, get_permalink($pg), 0);
    }
    $locs = get_theme_mod('nav_menu_locations', array());
    if (!is_array($locs)) $locs = array();
    foreach (array('primary', 'primary_mobile') as $loc) {
        if (empty($locs[$loc]) || (int) $locs[$loc] === $menu_id) $locs[$loc] = $menu_id;
    }
    set_theme_mod('nav_menu_locations', $locs);
    update_option('ptv_ss_menu_mode', 'managed', false);
    $new_sig = ptv_ss_menu_signature();
    if ($new_sig !== null) update_option('ptv_ss_menu_sig', $new_sig, false);
}
register_activation_hook(__FILE__, 'ptv_on_activate');
