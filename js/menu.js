// =====================================================
//  MENU + NGÀY HÔM NAY - dùng chung, chỉ 1 người giữ file này
//  Muốn thêm/đổi tên mục menu: sửa DANH SÁCH bên dưới, mọi trang tự cập nhật
// =====================================================
var MENU = [
  { ten: 'Tổng quan',       icon: '📊', file: 'tongquan.html' },
  { ten: 'Đặt lịch ca',     icon: '📅', file: 'lich.html' },
  { ten: 'Phòng máy',       icon: '🖥️', file: 'phong-may.html' },
  { ten: 'Máy tính',        icon: '💻', file: 'maytinh.html' },
  { ten: 'Sự cố & bảo trì', icon: '🔧', file: 'suco.html' },
  { ten: 'Báo cáo',         icon: '📈', file: 'baocao.html' },
  { ten: 'Người dùng',      icon: '👥', file: 'nguoidung.html' }
];

(function () {
  var trang = decodeURIComponent(location.pathname.split('/').pop());
  if (!trang || trang === 'index.html') trang = 'tongquan.html';

  var ten = (typeof DULIEU !== 'undefined') ? DULIEU.nguoiDung : 'Người dùng';
  var chuCai = ten.split(' ').map(function (t) { return t[0]; }).slice(-2).join('').toUpperCase();

  var links = MENU.map(function (m) {
    var active = (m.file === trang) ? ' class="active"' : '';
    return '<a href="' + m.file + '"' + active + '><i>' + m.icon + '</i>' + m.ten.replace('&', '&amp;') + '</a>';
  }).join('');

  var sb = document.getElementById('sidebar');
  if (sb) {
    sb.innerHTML =
      '<div class="brand"><span class="logo">🏢</span><div><b>LabManager</b><small>Pro</small></div></div>' +
      '<nav id="menu">' + links + '</nav>' +
      '<div class="me"><span class="avatar">' + chuCai + '</span><div><b>' + ten + '</b><small>Quản trị viên</small></div></div>';
  }

  var thu = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
  var ngay = document.getElementById('homNay');
  if (ngay) ngay.textContent = thu[d.getDay()] + ', ' + p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
})();
