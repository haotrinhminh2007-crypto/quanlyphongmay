// TRANG PHÒNG MÁY (web tĩnh)
// Cố định 4 phòng. Dữ liệu viết sẵn bên dưới (không lấy từ trang Đặt lịch ca):
// muốn đổi phòng nào đang dùng thì sửa dangDung = true / false.

var PHONG_MAY = [
  { ten: 'Phòng máy 1', dangDung: true,  lop: 'CNTT-3', ca: 'Ca 2 · 09:35 – 12:00' },
  { ten: 'Phòng máy 2', dangDung: false },
  { ten: 'Phòng máy 3', dangDung: true,  lop: 'CNTT-1', ca: 'Ca 2 · 09:35 – 12:00' },
  { ten: 'Phòng máy 4', dangDung: false }
];

var khungPhong = document.getElementById('rooms');
var html = '';

for (var i = 0; i < PHONG_MAY.length; i++) {
  var phong = PHONG_MAY[i];

  // Mặc định là phòng trống (hàng xám)
  var lopCss = 'room';
  var trangThai = 'Trống';
  var tenLop = 'Chưa có lớp thực hành';
  var gioCa = '';

  // Phòng đang dùng thì đổi sang hàng đỏ
  if (phong.dangDung) {
    lopCss = 'room busy';
    trangThai = 'Đang thực hành';
    tenLop = phong.lop;
    gioCa = phong.ca;
  }

  // Mỗi hàng: chấm màu | tên phòng | trạng thái | tên lớp | ca và giờ
  html += '<div class="' + lopCss + '">';
  html += '<span class="dot"></span>';
  html += '<h3>' + phong.ten + '</h3>';
  html += '<span class="st">' + trangThai + '</span>';
  html += '<span class="lop">' + tenLop + '</span>';
  html += '<span class="ca">' + gioCa + '</span>';
  html += '</div>';
}

khungPhong.innerHTML = html;
