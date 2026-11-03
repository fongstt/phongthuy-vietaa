const fs = require('fs');
const HEAD = __dirname + '/ptv-tools-data-head.js';
let src = fs.readFileSync(HEAD, 'utf8');

function findArrayRange(s, key) {
  const k = s.indexOf('"' + key + '"');
  if (k < 0) throw new Error('key not found ' + key);
  const start = s.indexOf('[', k);
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) return [start, i]; }
  }
  throw new Error('no close ' + key);
}

function merge(key, additions, idField, skipPositions) {
  const [a, b] = findArrayRange(src, key);
  const existing = JSON.parse(src.slice(a, b + 1));
  const have = new Set(existing.map(e => e[idField]));
  const add = additions.filter(e => !have.has(e[idField]) && !(skipPositions || []).includes(e[idField]));
  const merged = existing.concat(add);
  src = src.slice(0, a) + JSON.stringify(merged) + src.slice(b + 1);
  console.log(key + ': ' + existing.length + ' + ' + add.length + ' = ' + merged.length + (additions.length - add.length ? ' (bo ' + (additions.length - add.length) + ' muc trung/gan trung)' : ''));
  return merged.length;
}

const faceAdd = JSON.parse(fs.readFileSync(__dirname + '/../data/add-mole-face.json', 'utf8'));
const bodyAdd = JSON.parse(fs.readFileSync(__dirname + '/../data/add-mole-body.json', 'utf8'));
const tatAdd = JSON.parse(fs.readFileSync(__dirname + '/../data/add-tattoo.json', 'utf8'));

merge('moleFace', faceAdd, 'position', ['Giữa hai lông mày (ấn đường)', 'Đuôi lông mày', 'Mí mắt trên', 'Khóe mắt (đuôi mắt)', 'Sống mũi', 'Khóe miệng', 'Môi trên', 'Môi dưới']);
merge('moleBody', bodyAdd, 'position', []);
const tatExtra = [
  { motif: 'Ngọn lửa', meaning: 'Ngọn lửa tượng trưng cho nhiệt huyết, đam mê và sức sống không tắt. Người chọn hình này thường muốn nhắc mình giữ lửa với mục tiêu đã chọn, đồng thời lửa cũng là biểu tượng của sự thanh lọc, đốt bỏ những điều cũ kỹ để bắt đầu lại. Trong phong thủy, lửa thuộc hành Hỏa, hợp với người cần thêm năng lượng và sự quyết liệt.', advice: 'Hợp xăm ở bắp tay, vai hoặc cổ tay; hợp với người mệnh Hỏa, mệnh Thổ hoặc người mệnh Mộc cần lửa để bứt phá.' },
  { motif: 'Chim hạc', meaning: 'Chim hạc trong văn hóa Á Đông là biểu tượng của trường thọ, thanh cao và may mắn. Hình xăm chim hạc thể hiện mong muốn sống lâu, sống an nhiên và giữ phẩm giá trong mọi hoàn cảnh. Hạc cũng gắn với hình ảnh tiên cảnh nên thường được người yêu sự nhẹ nhàng, sâu lắng lựa chọn.', advice: 'Hợp xăm ở lưng, vai hoặc bắp chân với nét mảnh; hợp với mọi mệnh, đặc biệt người mệnh Thủy và mệnh Kim.' },
  { motif: 'Đồng hồ cát', meaning: 'Đồng hồ cát nhắc về giá trị của thời gian và sự vô thường của đời người. Người xăm hình này thường đã trải qua biến cố khiến họ trân trọng từng ngày sống, hoặc muốn tự nhắc mình đừng hoãn những việc quan trọng. Hình cũng hợp với các dòng chữ ngắn về sống trọn hiện tại.', advice: 'Hợp xăm ở cẳng tay, ngực hoặc sau tai với kích thước nhỏ; hợp với mọi mệnh.' },
  { motif: 'Vương miện', meaning: 'Vương miện là biểu tượng của vị thế, sự tự chủ và lòng tự trọng. Người chọn hình này muốn khẳng định giá trị bản thân và quyết tâm làm chủ cuộc đời mình thay vì chờ ai trao cơ hội. Kích thước nhỏ nhưng ý nghĩa lớn nên vương miện là một trong những hình mini được chọn nhiều nhất.', advice: 'Hợp xăm ở cổ tay, ngón tay, sau gáy hoặc mắt cá; hợp với mọi mệnh, hợp nhất người mệnh Kim và mệnh Thổ cần thêm khí chất.' },
  { motif: 'Đôi cánh', meaning: 'Đôi cánh tượng trưng cho tự do, khát vọng bay xa và vượt qua giới hạn cũ. Hình xăm đôi cánh sau lưng là lựa chọn kinh điển của người muốn đánh dấu một bước ngoặt: rời quê lập nghiệp, vượt qua bệnh tật hay bắt đầu cuộc đời mới. Cánh cũng mang ý nghĩa bảo hộ, như có một sức mạnh vô hình nâng đỡ từ phía sau.', advice: 'Hợp xăm lớn ở lưng hoặc nhỏ ở cổ tay, mắt cá; hợp với mọi mệnh, đặc biệt người mệnh Mộc và mệnh Thủy.' }
];
merge('tattooDict', tatAdd.concat(tatExtra), 'motif', ['La bàn', 'Mỏ neo', 'Bướm', 'Sóng biển', 'Chữ (thư pháp hoặc trích dẫn)']);

fs.writeFileSync(HEAD, src);
const window = {}; eval(src);
const D = window.PTV_TOOLS_DATA;
console.log('VERIFY counts:', D.moleFace.length, D.moleBody.length, D.tattooDict.length);
console.log('face has Nhan trung:', D.moleFace.some(e => e.position === 'Nhân trung'));
console.log('body has Nguoc trai:', D.moleBody.some(e => e.position === 'Ngực trái'));
console.log('tattoo has Mũi tên:', D.tattooDict.some(e => e.motif === 'Mũi tên'), '| Vuong mien:', D.tattooDict.some(e => e.motif === 'Vương miện'));
