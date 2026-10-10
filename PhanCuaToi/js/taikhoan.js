// =====================================================
// TÀI KHOẢN Ở THANH MENU: avatar, tên, chức vụ đổi theo từng người dùng
// Dùng cho 2 trang "Đặt lịch ca" và "Phòng máy".
//
// - Người đang dùng web được lưu giống cách trang Máy tính của nhóm đọc:
//   localStorage 'labmanager_current_user' = { ma, ten, vaiTro }
// - Danh sách người dùng lấy từ trang Người dùng (localStorage 'labmanager_nguoidung')
// - Bấm vào khung tài khoản (góc dưới menu) để chuyển sang người dùng khác
// - File này chạy SAU menu.js: menu.js vẽ khung tài khoản, file này cập nhật lại
// =====================================================

// Các tên khoá có thể lưu người đang đăng nhập (giống trang Máy tính)
var KHOA_NGUOI_HIEN_TAI = ['labmanager_current_user', 'lm_current_user', 'currentUser', 'loggedInUser'];
var KHOA_DANH_SACH_ND = 'labmanager_nguoidung';

// Danh sách mẫu giống trang Người dùng (chỉ dùng khi trang đó chưa lưu gì)
var NGUOI_DUNG_MAU = [
  { ma: 'ND001', ten: 'Hà Nguyễn',      vaiTro: 'Quản trị viên', trangThai: 'Hoạt động' },
  { ma: 'ND002', ten: 'Trần Minh Tuấn', vaiTro: 'Giảng viên',    trangThai: 'Hoạt động' },
  { ma: 'ND003', ten: 'Lê Thu Hương',   vaiTro: 'Giảng viên',    trangThai: 'Hoạt động' },
  { ma: 'ND004', ten: 'Phạm Quốc Bảo',  vaiTro: 'Kỹ thuật viên', trangThai: 'Hoạt động' },
  { ma: 'ND005', ten: 'Vũ Hoàng Long',  vaiTro: 'Sinh viên',     trangThai: 'Hoạt động' },
  { ma: 'ND006', ten: 'Đỗ Thùy Linh',   vaiTro: 'Sinh viên',     trangThai: 'Bị khóa' },
  { ma: 'ND007', ten: 'Ngô Văn Đức',    vaiTro: 'Giảng viên',    trangThai: 'Bị khóa' },
  { ma: 'ND008', ten: 'Bùi Khánh Vy',   vaiTro: 'Sinh viên',     trangThai: 'Hoạt động' }
];


// ---------- 1. Đọc dữ liệu ----------

function docDanhSachNguoiDung() {
  var chu = localStorage.getItem(KHOA_DANH_SACH_ND);
  if (chu === null) {
    return NGUOI_DUNG_MAU;
  }
  return JSON.parse(chu);
}

// Lấy người đã được chọn (trả về null nếu chưa ai được chọn)
function docNguoiDaLuu() {
  for (var i = 0; i < KHOA_NGUOI_HIEN_TAI.length; i++) {
    var chu = localStorage.getItem(KHOA_NGUOI_HIEN_TAI[i]) || sessionStorage.getItem(KHOA_NGUOI_HIEN_TAI[i]);
    if (chu) {
      if (chu.charAt(0) === '{') {
        return JSON.parse(chu);   // dạng { ten: ..., vaiTro: ... }
      }
      return { ten: chu };        // chỉ lưu mỗi cái tên
    }
  }
  return null;
}

// Tìm một người trong danh sách theo tên (không thấy thì trả về null)
function timNguoiTheoTen(ten) {
  var danhSach = docDanhSachNguoiDung();
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i].ten === ten) {
      return danhSach[i];
    }
  }
  return null;
}

// Người đang dùng web: { ma, ten, vaiTro }
// Chưa ai được chọn thì dùng tên mặc định của nhóm (DULIEU.nguoiDung trong data.js)
function layNguoiDungHienTai() {
  var daLuu = docNguoiDaLuu();
  var ten = '';
  var vaiTro = '';
  var ma = '';

  if (daLuu !== null) {
    ten = daLuu.ten || daLuu.name || daLuu.hoTen || '';
    vaiTro = daLuu.vaiTro || daLuu.role || daLuu.chucVu || '';
    ma = daLuu.ma || '';
  }

  // Thiếu tên hoặc tài khoản đã bị khóa -> dùng người mặc định
  var trongDanhSach = timNguoiTheoTen(ten);
  if (ten === '' || (trongDanhSach !== null && trongDanhSach.trangThai === 'Bị khóa')) {
    ten = 'Người dùng';
    if (typeof DULIEU !== 'undefined') {
      ten = DULIEU.nguoiDung;
    }
    vaiTro = '';
    ma = '';
    trongDanhSach = timNguoiTheoTen(ten);
  }

  // Thiếu chức vụ thì lấy từ danh sách người dùng, không có nữa thì để 'Quản trị viên' (giống các trang khác)
  if (trongDanhSach !== null) {
    ma = trongDanhSach.ma;
    if (vaiTro === '') {
      vaiTro = trongDanhSach.vaiTro;
    }
  }
  if (vaiTro === '') {
    vaiTro = 'Quản trị viên';
  }

  return { ma: ma, ten: ten, vaiTro: vaiTro };
}


// ---------- 2. Hàm phụ ----------

// 'Trần Minh Tuấn' -> 'MT' (hai chữ cái đầu của hai từ cuối, giống menu.js)
function chuCaiAvatar(ten) {
  var cacTu = ten.trim().split(/\s+/);
  var chu = '';
  for (var i = 0; i < cacTu.length; i++) {
    chu += cacTu[i].charAt(0);
  }
  return chu.slice(-2).toUpperCase();
}

// Mỗi chức vụ một màu avatar (màu khai báo trong css/taikhoan.css)
function lopVaiTro(vaiTro) {
  if (vaiTro === 'Quản trị viên') {
    return 'vt-admin';
  }
  if (vaiTro === 'Giảng viên') {
    return 'vt-gv';
  }
  if (vaiTro === 'Kỹ thuật viên') {
    return 'vt-kt';
  }
  return 'vt-sv';
}

function tkLamSach(chu) {
  return String(chu).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


// ---------- 3. Vẽ khung tài khoản ở thanh menu ----------

var khungTaiKhoan = document.querySelector('#sidebar .me');

// Hộp danh sách người dùng (hiện khi bấm vào khung tài khoản)
var hopChonNguoi = document.createElement('div');
hopChonNguoi.className = 'chon-nguoi-dung';
hopChonNguoi.hidden = true;
if (khungTaiKhoan !== null) {
  document.getElementById('sidebar').appendChild(hopChonNguoi);
}

function veKhungTaiKhoan() {
  if (khungTaiKhoan === null) {
    return;
  }
  var nguoi = layNguoiDungHienTai();

  khungTaiKhoan.className = 'me ' + lopVaiTro(nguoi.vaiTro);
  khungTaiKhoan.setAttribute('role', 'button');
  khungTaiKhoan.setAttribute('tabindex', '0');
  khungTaiKhoan.setAttribute('title', 'Bấm để chuyển tài khoản');
  khungTaiKhoan.innerHTML = '<span class="avatar"></span><div><b></b><small></small></div><span class="doi-tk">⇅</span>';

  // Dùng textContent để tên có ký tự đặc biệt cũng không làm hỏng trang
  khungTaiKhoan.querySelector('.avatar').textContent = chuCaiAvatar(nguoi.ten);
  khungTaiKhoan.querySelector('b').textContent = nguoi.ten;
  khungTaiKhoan.querySelector('small').textContent = nguoi.vaiTro;
}


// ---------- 4. Chuyển sang người dùng khác ----------

function veDanhSachChon() {
  var danhSach = docDanhSachNguoiDung();
  var hienTai = layNguoiDungHienTai();
  var html = '<h4>Chuyển tài khoản</h4>';

  for (var i = 0; i < danhSach.length; i++) {
    var nguoi = danhSach[i];
    var biKhoa = nguoi.trangThai === 'Bị khóa';
    var lopCss = 'nd-muc ' + lopVaiTro(nguoi.vaiTro);
    if (nguoi.ten === hienTai.ten) {
      lopCss += ' dang-chon';
    }
    var ghiChu = tkLamSach(nguoi.vaiTro);
    if (biKhoa) {
      ghiChu += ' · Bị khóa';
    }

    html += '<button class="' + lopCss + '" data-ma="' + tkLamSach(nguoi.ma) + '"' + (biKhoa ? ' disabled' : '') + '>';
    html += '<span class="avatar">' + tkLamSach(chuCaiAvatar(nguoi.ten)) + '</span>';
    html += '<span><b>' + tkLamSach(nguoi.ten) + '</b><small>' + ghiChu + '</small></span>';
    html += '</button>';
  }

  hopChonNguoi.innerHTML = html;
}

function moDongDanhSach() {
  if (hopChonNguoi.hidden) {
    veDanhSachChon();
    hopChonNguoi.hidden = false;
  } else {
    hopChonNguoi.hidden = true;
  }
}

// Lưu người vừa chọn rồi vẽ lại giao diện
function chonNguoiDung(ma) {
  var danhSach = docDanhSachNguoiDung();
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i].ma === ma && danhSach[i].trangThai !== 'Bị khóa') {   // tài khoản bị khóa thì không chọn được
      localStorage.setItem(KHOA_NGUOI_HIEN_TAI[0], JSON.stringify({
        ma: danhSach[i].ma,
        ten: danhSach[i].ten,
        vaiTro: danhSach[i].vaiTro
      }));
    }
  }
  hopChonNguoi.hidden = true;
  capNhatGiaoDien();
}

// Vẽ lại khung tài khoản và (nếu là trang lịch) vẽ lại lịch để nút xóa đổi theo người dùng
function capNhatGiaoDien() {
  veKhungTaiKhoan();
  if (typeof veLich === 'function') {
    veLich();
  }
}

if (khungTaiKhoan !== null) {
  khungTaiKhoan.onclick = moDongDanhSach;
  khungTaiKhoan.onkeydown = function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moDongDanhSach();
    }
  };

  // Bấm vào một người trong danh sách
  hopChonNguoi.onclick = function (e) {
    var nut = e.target.closest('button[data-ma]');
    if (nut !== null) {
      chonNguoiDung(nut.dataset.ma);
    }
  };

  // Bấm ra ngoài hoặc nhấn Esc thì đóng danh sách
  document.addEventListener('click', function (e) {
    if (!hopChonNguoi.hidden && !hopChonNguoi.contains(e.target) && !khungTaiKhoan.contains(e.target)) {
      hopChonNguoi.hidden = true;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      hopChonNguoi.hidden = true;
    }
  });
}

// Trang khác (hoặc tab khác) đổi người dùng thì trang này cập nhật theo
window.addEventListener('storage', function (e) {
  if (KHOA_NGUOI_HIEN_TAI.indexOf(e.key) !== -1 || e.key === KHOA_DANH_SACH_ND) {
    capNhatGiaoDien();
  }
});

veKhungTaiKhoan();
