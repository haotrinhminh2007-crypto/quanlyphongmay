
var KHOA_NGUOI_HIEN_TAI = ['labmanager_current_user', 'lm_current_user', 'currentUser', 'loggedInUser'];
var KHOA_DANH_SACH_ND = 'labmanager_nguoidung';

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




function docDanhSachNguoiDung() {
  var chu = localStorage.getItem(KHOA_DANH_SACH_ND);
  if (chu === null) {
    return NGUOI_DUNG_MAU;
  }
  return JSON.parse(chu);
}


function docNguoiDaLuu() {
  for (var i = 0; i < KHOA_NGUOI_HIEN_TAI.length; i++) {
    var chu = localStorage.getItem(KHOA_NGUOI_HIEN_TAI[i]) || sessionStorage.getItem(KHOA_NGUOI_HIEN_TAI[i]);
    if (chu) {
      if (chu.charAt(0) === '{') {
        return JSON.parse(chu);   
      }
      return { ten: chu };        
    }
  }
  return null;
}


function timNguoiTheoTen(ten) {
  var danhSach = docDanhSachNguoiDung();
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i].ten === ten) {
      return danhSach[i];
    }
  }
  return null;
}


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



function chuCaiAvatar(ten) {
  var cacTu = ten.trim().split(/\s+/);
  var chu = '';
  for (var i = 0; i < cacTu.length; i++) {
    chu += cacTu[i].charAt(0);
  }
  return chu.slice(-2).toUpperCase();
}


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




var khungTaiKhoan = document.querySelector('#sidebar .me');


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

  
  khungTaiKhoan.querySelector('.avatar').textContent = chuCaiAvatar(nguoi.ten);
  khungTaiKhoan.querySelector('b').textContent = nguoi.ten;
  khungTaiKhoan.querySelector('small').textContent = nguoi.vaiTro;
}




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


function chonNguoiDung(ma) {
  var danhSach = docDanhSachNguoiDung();
  for (var i = 0; i < danhSach.length; i++) {
    if (danhSach[i].ma === ma && danhSach[i].trangThai !== 'Bị khóa') {   
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

  
  hopChonNguoi.onclick = function (e) {
    var nut = e.target.closest('button[data-ma]');
    if (nut !== null) {
      chonNguoiDung(nut.dataset.ma);
    }
  };

  
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


window.addEventListener('storage', function (e) {
  if (KHOA_NGUOI_HIEN_TAI.indexOf(e.key) !== -1 || e.key === KHOA_DANH_SACH_ND) {
    capNhatGiaoDien();
  }
});

veKhungTaiKhoan();
