const fs = require('fs');
const F = __dirname + '/ptv-safe-sync-section.php';
let src = fs.readFileSync(F, 'utf8');
const startMark = '/* Chuan hoa danh sach muc menu';
const endMark = 'function ptv_ss_admin_menu() {';
const i = src.indexOf(startMark);
const j = src.indexOf(endMark);
if (i < 0 || j < 0 || j < i) throw new Error('markers missing: ' + i + ' ' + j);
const note = `/* LUU Y (quyet dinh vong 5 tren PR #4): khong con ham khoi phuc menu trong
 * plugin. WordPress khong co co che thay the menu nguyen tu; xoa roi dung lai
 * co the mat du lieu khi loi keo dai. Snapshot menu trong backup chi de tham
 * khao. Neu can khoi phuc menu, huong dung la dung mot menu moi day du roi
 * hoan doi tham chieu, lam o PR rieng. */
`;
src = src.slice(0, i) + note + src.slice(j);
fs.writeFileSync(F, src);
console.log('menu restore functions removed; ptv_ss funcs now:', (src.match(/function ptv_ss_/g) || []).length);
