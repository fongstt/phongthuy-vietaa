<?php
/**
 * Plugin Name: PhongThuy VietAA Tools
 * Description: Bộ công cụ phong thủy cho phongthuy.vietaa.com: Đặt tên con, Bói Kiều và danh mục ứng dụng ở trang chủ. Khi kích hoạt, plugin tự tạo hoặc đồng bộ các Page ứng dụng và trang chủ.
 * Version: 1.45.0
 * Author: PhongThuy VietAA
 */

if (!defined('ABSPATH')) exit;

function ptv_enqueue_css() {
    wp_enqueue_style('ptv-custom', plugins_url('assets/ptv-custom.css', __FILE__), array(), '1.45.0');
}

/* ---------------- Dat ten con ---------------- */
function ptv_dat_ten_con_shortcode() {
    ptv_enqueue_css();
    wp_enqueue_script('ptv-dat-ten', plugins_url('assets/ptv-dat-ten.js', __FILE__), array(), '1.45.0', true);
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
    wp_enqueue_script('ptv-boi-kieu', plugins_url('assets/ptv-boi-kieu.js', __FILE__), array(), '1.45.0', true);
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
    wp_enqueue_script('ptv-tools', plugins_url('assets/ptv-tools.js', __FILE__), array(), '1.45.0', true);
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
    wp_enqueue_script('ptv-home', plugins_url('assets/ptv-home.js', __FILE__), array(), '1.45.0', true);
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
    ptv_sync_page(
        'dat-ten-con',
        'Đặt Tên Con Theo Phong Thủy',
        'page-dat-ten-con.html',
        'Đặt tên con, tìm và xem tên cho con hợp tuổi, hợp mệnh theo đúng phong thủy',
        'Công cụ đặt tên con theo phong thủy: nhập họ tên và ngày giờ sinh của bé để xem bản mệnh, tứ trụ, ngũ cách, chấm điểm tên theo số nét chữ Hán, ngũ hành và quẻ Dịch, có đối chiếu mệnh bố mẹ và gợi ý tên hay.'
    );
    ptv_sync_page(
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
            if (!empty($t['slug']) && !empty($t['file'])) ptv_sync_page($t['slug'], $t['title'], $t['file'], isset($t['seoTitle']) ? $t['seoTitle'] : '', isset($t['seoDesc']) ? $t['seoDesc'] : '');
        }
    }
    // Trang chu: dong bo noi dung cua trang dang duoc dat lam front page
    $front_id = (int) get_option('page_on_front');
    if (!$front_id) {
        $home = get_page_by_path('trang-chu');
        if ($home) $front_id = $home->ID;
    }
    if ($front_id) {
        wp_update_post(array('ID' => $front_id, 'post_content' => '[ptv_trang_chu_tools]'));
        update_post_meta($front_id, '_yoast_wpseo_title', 'Phong Thủy VietAA, toàn bộ 59 ứng dụng phong thủy miễn phí');
        update_post_meta($front_id, '_yoast_wpseo_metadesc', 'Phong Thủy VietAA chia sẻ miễn phí 59 ứng dụng phong thủy trực tuyến: đặt tên con, bói Kiều, sim phong thủy, xem hướng nhà, chọn ngày tốt, giải đoán mệnh lý và nhân tướng.');
      }
    ptv_ensure_menu();
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
    $locs['primary'] = $menu_id;
    $locs['primary_mobile'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locs);
}
register_activation_hook(__FILE__, 'ptv_on_activate');
