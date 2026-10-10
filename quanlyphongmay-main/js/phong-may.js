// TRANG PHÒNG MÁY
// Mỗi phòng là một hàng ngang: phòng đang có lớp thực hành thì tô đỏ, phòng trống thì xám.
// Bấm dấu + bên dưới để thêm một phòng máy mới.

var khungPhong = document.getElementById('rooms');
var nutThemPhong = document.getElementById('themPhong');

// Tìm lớp đang thực hành trong phòng này (không có thì trả về null)
function timLopDangHoc(phong) {
  var bayGio = new Date();

  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    var dungPhong = luot.phong === phong;
    var dangTrongGio = gioBatDau(luot) <= bayGio && bayGio < gioKetThuc(luot);

    if (dungPhong && dangTrongGio) {
      return luot;
    }
  }
  return null;
}

// Vẽ các hàng phòng máy
function vePhong() {
  var danhSachPhong = docDanhSachPhong();
  var html = '';

  for (var i = 0; i < danhSachPhong.length; i++) {
    var phong = danhSachPhong[i];
    var luot = timLopDangHoc(phong);

    // Mặc định là phòng trống (hàng xám)
    var lopCss = 'room';
    var trangThai = 'Trống';
    var tenLop = 'Chưa có lớp thực hành';
    var gioCa = '';

    // Nếu có lớp đang học thì đổi sang hàng đỏ
    if (luot !== null) {
      lopCss = 'room busy';
      trangThai = 'Đang thực hành';
      tenLop = lamSachChu(luot.lop);
      gioCa = 'Ca ' + luot.ca + ' · ' + chuGioCa(luot.ca);
    }

    // Mỗi hàng: chấm màu | tên phòng | trạng thái | tên lớp | ca và giờ
    html += '<div class="' + lopCss + '">';
    html += '<span class="dot"></span>';
    html += '<h3>Phòng máy ' + phong + '</h3>';
    html += '<span class="st">' + trangThai + '</span>';
    html += '<span class="lop">' + tenLop + '</span>';
    html += '<span class="ca">' + gioCa + '</span>';
    html += '</div>';
  }

  khungPhong.innerHTML = html;
}

// Dấu +: thêm một phòng máy mới (số phòng mới = số lớn nhất hiện có + 1)
nutThemPhong.onclick = function () {
  var danhSachPhong = docDanhSachPhong();

  if (danhSachPhong.length >= SO_PHONG_TOI_DA) {
    alert('Chỉ được thêm tối đa ' + SO_PHONG_TOI_DA + ' phòng máy.');
    return;
  }

  var lonNhat = 0;
  for (var i = 0; i < danhSachPhong.length; i++) {
    if (danhSachPhong[i] > lonNhat) {
      lonNhat = danhSachPhong[i];
    }
  }

  danhSachPhong.push(lonNhat + 1);
  luuDanhSachPhong(danhSachPhong);
  vePhong();
};

// Đọc dữ liệu mới nhất rồi vẽ lại
function capNhat() {
  lamMoiDuLieu();
  vePhong();
}

capNhat();
setInterval(capNhat, 20000);   // tự cập nhật mỗi 20 giây
