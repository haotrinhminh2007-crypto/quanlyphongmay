// DỮ LIỆU DÙNG CHUNG CHO TRANG "ĐẶT LỊCH CA" VÀ "PHÒNG MÁY

var SO_PHONG_TOI_DA = 12;         // tối đa 12 phòng máy
var SO_CA = 4;                    // có 4 ca trong một ngày
var KHOA_LUU = 'labmanager-lich'; // tên dùng để lưu trong localStorage
var KHOA_PHONG = 'labmanager-phong'; // nơi lưu danh sách phòng máy

// 4 ca trong một ngày
var CA = [
  null,
  { batDau: '07:00', ketThuc: '09:30' },  // ca 1
  { batDau: '09:35', ketThuc: '12:00' },  // ca 2
  { batDau: '13:00', ketThuc: '15:30' },  // ca 3
  { batDau: '15:35', ketThuc: '18:00' }   // ca 4
];

var TEN_THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
//Dữ liệu
var duLieu = { lichDangKi: [], lichSu: [] };


//Lưu và đọc dữ liệu

function luuDuLieu() {
  localStorage.setItem(KHOA_LUU, JSON.stringify(duLieu));
}

// Danh sách số phòng máy, ví dụ [1, 2, 3, 4]
// (lúc đầu có 4 phòng, trang Phòng máy có dấu + để thêm phòng mới)
function docDanhSachPhong() {
  var chu = localStorage.getItem(KHOA_PHONG);
  if (chu === null) {
    return [1, 2, 3, 4];
  }
  return JSON.parse(chu);
}

function luuDanhSachPhong(danhSach) {
  localStorage.setItem(KHOA_PHONG, JSON.stringify(danhSach));
}

function docDuLieu() {
  var chu = localStorage.getItem(KHOA_LUU);
  if (chu !== null) {
    duLieu = JSON.parse(chu);
    boSungLichCu();
  }
}

// Lịch đăng kí từ phiên bản cũ chưa có id, hoặc có người đặt là 'Khách' -> gán cho người đang dùng web
function boSungLichCu() {
  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    if (luot.id === undefined) {
      luot.id = 'cu-' + i + '-' + luot.ngay + '-' + luot.ca + '-' + luot.phong;
    }
    if (luot.nguoiDat === undefined || luot.nguoiDat === 'Khách') {
      luot.nguoiDat = tenNguoiDung();
    }
  }
}


// Hàm xử lý ngày giờ

// Thêm số 0 phía trước nếu nhỏ hơn 10: 7 -> '07'
function them0(so) {
  if (so < 10) {
    return '0' + so;
  }
  return '' + so;
}

// Đổi ngày thành chữ để so sánh: Date -> '2026-10-07'
function ngayThanhChu(ngay) {
  return ngay.getFullYear() + '-' + them0(ngay.getMonth() + 1) + '-' + them0(ngay.getDate());
}

// Đổi chữ ngày sang dạng hiển thị: '2026-10-07' -> '07/10/2026'
function hienNgay(chuNgay) {
  var phan = chuNgay.split('-');
  return phan[2] + '/' + phan[1] + '/' + phan[0];
}

// Giờ của ca để hiển thị:
function chuGioCa(ca) {
  return CA[ca].batDau + ' – ' + CA[ca].ketThuc;
}

// Thời điểm bắt đầu của một lượt đăng kí
function gioBatDau(luot) {
  return new Date(luot.ngay + 'T' + CA[luot.ca].batDau + ':00');
}

// Thời điểm kết thúc của một lượt đăng kí
function gioKetThuc(luot) {
  return new Date(luot.ngay + 'T' + CA[luot.ca].ketThuc + ':00');
}



// Tên người đang dùng web (lấy từ khung tài khoản, xem js/taikhoan.js)
function tenNguoiDung() {
  return layNguoiDungHienTai().ten;
}

// Làm sạch chữ nhập vào để tránh lỗi mã HTML
function lamSachChu(chu) {
  return chu.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Ca nào đã thực hành xong thì chuyển sang lịch sử
function chuyenCaDaQua() {
  var bayGio = new Date();
  var conLai = [];

  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    if (gioKetThuc(luot) <= bayGio) {
      duLieu.lichSu.push(luot);   // đã xong -> vào lịch sử
    } else {
      conLai.push(luot);          // chưa xong -> giữ lại
    }
  }

  duLieu.lichDangKi = conLai;
  luuDuLieu();
}

// Làm mới dữ liệu: đọc dữ liệu và chuyển ca đã qua
function lamMoiDuLieu() {
  docDuLieu();
  chuyenCaDaQua();
}