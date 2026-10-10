// TRANG ĐẶT LỊCH CA

//1. LẤY CÁC PHẦN TỬ TRÊN TRANG
var bangLich = document.getElementById('cal');
var khungLich = document.getElementById('calwrap');
var khungLichSu = document.getElementById('hist');
var thanhChuyenTuan = document.getElementById('weekctl');
var nhanTuan = document.getElementById('wlabel');
var nutTuanTruoc = document.getElementById('prev');
var nutTuanSau = document.getElementById('next');
var nutHomNay = document.getElementById('thisweek');
var nutCong = document.getElementById('plus');
var form = document.getElementById('pop');
var khungThongBao = document.getElementById('toast');
var oNgay = document.getElementById('f-date');
var oLop = document.getElementById('f-cls');
var khungPhongChon = document.getElementById('f-room');
var khungCa = document.getElementById('f-shifts');
var nutTab = document.querySelectorAll('.seg button');


//2. XỬ LÝ TUẦN ĐANG XEM

// Tìm ngày Thứ hai của tuần chứa ngày này
function thuHaiCuaTuan(ngay) {
  var ketQua = new Date(ngay.getFullYear(), ngay.getMonth(), ngay.getDate());
  var soNgayLui = (ketQua.getDay() + 6) % 7;
  ketQua.setDate(ketQua.getDate() - soNgayLui);
  return ketQua;
}

var tuanBatDau = thuHaiCuaTuan(new Date());   // Thứ hai của tuần đang xem

// Lấy 7 ngày (Thứ hai -> Chủ nhật) của tuần đang xem
function layBayNgay() {
  var bayNgay = [];
  for (var i = 0; i < 7; i++) {
    var ngay = new Date(tuanBatDau);
    ngay.setDate(ngay.getDate() + i);
    bayNgay.push(ngay);
  }
  return bayNgay;
}

// Đổi tuần: soTuan = 1 (tuần sau), -1 (tuần trước)
function doiTuan(soTuan) {
  tuanBatDau.setDate(tuanBatDau.getDate() + soTuan * 7);
  veLich();
}


//3. VẼ LỊCH TUẦN VÀ LỊCH SỬ

// Hàng tiêu đề của lịch
function veTieuDe(bayNgay) {
  var homNay = ngayThanhChu(new Date());
  var html = '<thead><tr><th>Ca</th>';

  for (var i = 0; i < 7; i++) {
    var ngay = bayNgay[i];
    var lopCss = '';
    if (ngayThanhChu(ngay) === homNay) {
      lopCss = 'today';   // tô sáng cột hôm nay
    }
    html += '<th class="' + lopCss + '">' + TEN_THU[ngay.getDay()];
    html += '<small>' + them0(ngay.getDate()) + '/' + them0(ngay.getMonth() + 1) + '</small></th>';
  }

  return html + '</tr></thead>';
}

// Các lớp nằm trong một ô của lịch (1 ngày + 1 ca)
function veCacLopTrongO(chuNgay, ca, bayGio, toi) {
  var html = '';

  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];

    if (luot.ngay === chuNgay && luot.ca === ca) {
      var lopChip = 'chip';
      if (gioBatDau(luot) <= bayGio) {
        lopChip = 'chip live';   // ca đang diễn ra -> màu đỏ
      }

      html += '<span class="' + lopChip + '" title="Người đặt: ' + lamSachChu(luot.nguoiDat) + '">';
      html += lamSachChu(luot.lop);
      html += '<small>Phòng máy ' + luot.phong + '</small>';

      // Nút xóa (dấu ×) chỉ người đặt mới thấy
      if (luot.nguoiDat === toi) {
        html += '<button class="xoa" aria-label="Xóa lịch này" onclick="xoaLich(\'' + luot.id + '\')">×</button>';
      }
      html += '</span>';
    }
  }

  return html;
}

function veLich() {
  var bayNgay = layBayNgay();
  var bayGio = new Date();
  var toi = tenNguoiDung();

  // Nhãn tuần
  var dau = hienNgay(ngayThanhChu(bayNgay[0])).substring(0, 5);
  var cuoi = hienNgay(ngayThanhChu(bayNgay[6])).substring(0, 5);
  nhanTuan.textContent = dau + ' – ' + cuoi;

  // Tiêu đề + 4 hàng ca
  var html = veTieuDe(bayNgay) + '<tbody>';
  for (var ca = 1; ca <= SO_CA; ca++) {
    html += '<tr>';
    html += '<td class="ca-col"><b>Ca ' + ca + '</b><small>' + chuGioCa(ca) + '</small></td>';
    for (var i = 0; i < 7; i++) {
      var chuNgay = ngayThanhChu(bayNgay[i]);
      html += '<td>' + veCacLopTrongO(chuNgay, ca, bayGio, toi) + '</td>';
    }
    html += '</tr>';
  }
  html += '</tbody>';

  bangLich.innerHTML = html;
}

function veLichSu() {
  if (duLieu.lichSu.length === 0) {
    khungLichSu.innerHTML = '<div class="empty">Chưa có ca nào thực hành xong. Các ca đã qua giờ sẽ được lưu ở đây.</div>';
    return;
  }

  var html = '<table><thead><tr><th>Ngày</th><th>Ca</th><th>Lớp học phần</th><th>Phòng</th></tr></thead><tbody>';

  // Chạy từ cuối về đầu để ca mới nhất hiển thị trên cùng
  for (var i = duLieu.lichSu.length - 1; i >= 0; i--) {
    var luot = duLieu.lichSu[i];
    html += '<tr>';
    html += '<td>' + hienNgay(luot.ngay) + '</td>';
    html += '<td>Ca ' + luot.ca + ' (' + chuGioCa(luot.ca) + ')</td>';
    html += '<td>' + lamSachChu(luot.lop) + '</td>';
    html += '<td>Phòng máy ' + luot.phong + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';

  khungLichSu.innerHTML = html;
}

function veTatCa() {
  lamMoiDuLieu();
  veLich();
  veLichSu();
}


//4. CHUYỂN TAB VÀ CHUYỂN TUẦN

function chonTab(ten) {
  if (ten === 'lich') {
    nutTab[0].className = 'on';
    nutTab[1].className = '';
    khungLich.style.display = '';
    thanhChuyenTuan.style.display = '';
    khungLichSu.style.display = 'none';
  } else {
    nutTab[0].className = '';
    nutTab[1].className = 'on';
    khungLich.style.display = 'none';
    thanhChuyenTuan.style.display = 'none';
    khungLichSu.style.display = '';
  }
}

nutTab[0].onclick = function () { chonTab('lich'); };
nutTab[1].onclick = function () { chonTab('lichsu'); };

nutTuanTruoc.onclick = function () { doiTuan(-1); };
nutTuanSau.onclick = function () { doiTuan(1); };
nutHomNay.onclick = function () {
  tuanBatDau = thuHaiCuaTuan(new Date());
  veLich();
};


//5. FORM ĐĂNG KÍ (DẤU +) VÀ XÓA LỊCH

function veOChonCa() {
  var html = '';
  for (var ca = 1; ca <= SO_CA; ca++) {
    html += '<label><input type="checkbox" value="' + ca + '"> Ca ' + ca;
    html += '<small>' + chuGioCa(ca) + '</small></label>';
  }
  khungCa.innerHTML = html;
}

// Tạo các nút chọn phòng máy trong form (theo danh sách phòng hiện có)
function veOChonPhong() {
  var danhSachPhong = docDanhSachPhong();
  var html = '';
  for (var i = 0; i < danhSachPhong.length; i++) {
    var daChon = '';
    if (i === 0) {
      daChon = ' checked';   // mặc định chọn phòng đầu tiên
    }
    html += '<label><input type="radio" name="room" value="' + danhSachPhong[i] + '"' + daChon + '>';
    html += '<span>Phòng ' + danhSachPhong[i] + '</span></label>';
  }
  khungPhongChon.innerHTML = html;
}

function moForm() {
  veOChonPhong();   // cập nhật danh sách phòng (phòng vừa thêm sẽ có mặt)
  form.classList.add('on');
  nutCong.setAttribute('aria-expanded', 'true');
  khungThongBao.classList.remove('on');
  if (oNgay.value === '') {
    oNgay.value = ngayThanhChu(new Date());
  }
}

function dongForm() {
  form.classList.remove('on');
  nutCong.setAttribute('aria-expanded', 'false');
}

nutCong.onclick = function () {
  if (form.classList.contains('on')) {
    dongForm();
  } else {
    moForm();
  }
};

document.onkeydown = function (e) {
  if (e.key === 'Escape') {
    dongForm();
  }
};

var henGioTat;
function thongBao(noiDung, loai) {
  khungThongBao.className = 'toast on ' + loai;
  khungThongBao.textContent = noiDung;
  clearTimeout(henGioTat);
  henGioTat = setTimeout(function () {
    khungThongBao.classList.remove('on');
  }, 4000);
}

function layCacCaDuocChon() {
  var cacCa = [];
  var cacO = khungCa.querySelectorAll('input');
  for (var i = 0; i < cacO.length; i++) {
    if (cacO[i].checked) {
      cacCa.push(Number(cacO[i].value));
    }
  }
  return cacCa;
}

function daCoLop(ngay, ca, phong) {
  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    if (luot.ngay === ngay && luot.ca === ca && luot.phong === phong) {
      return true;
    }
  }
  return false;
}

function kiemTraForm(ngay, lop, cacCa, phong) {
  if (ngay === '' || lop === '') {
    return 'Hãy nhập ngày và lớp học phần.';
  }
  if (cacCa.length === 0) {
    return 'Hãy chọn ít nhất một ca.';
  }

  for (var i = 0; i < cacCa.length; i++) {
    var luotThu = { ngay: ngay, ca: cacCa[i] };
    if (gioKetThuc(luotThu) <= new Date()) {
      return 'Ca này đã qua, hãy chọn ca khác.';
    }
    if (daCoLop(ngay, cacCa[i], phong)) {
      return 'Đã có lớp đăng kí ca này rồi.';
    }
  }

  return '';
}

form.onsubmit = function (e) {
  e.preventDefault();
  lamMoiDuLieu();

  var ngay = oNgay.value;
  var lop = oLop.value.trim();
  var phong = Number(document.querySelector('input[name=room]:checked').value);
  var cacCa = layCacCaDuocChon();

  var loi = kiemTraForm(ngay, lop, cacCa, phong);
  if (loi !== '') {
    dongForm();
    thongBao(loi, 'err');
    return;
  }

  for (var i = 0; i < cacCa.length; i++) {
    duLieu.lichDangKi.push({
      id: Date.now() + '-' + cacCa[i],
      ngay: ngay,
      ca: cacCa[i],
      phong: phong,
      lop: lop,
      nguoiDat: tenNguoiDung()
    });
  }
  luuDuLieu();

  tuanBatDau = thuHaiCuaTuan(new Date(ngay + 'T00:00:00'));

  dongForm();
  form.reset();
  thongBao('Đăng kí thành công: ' + lop + ', Phòng máy ' + phong + ', ' + hienNgay(ngay) + ', ca ' + cacCa.join(', ') + '.', 'ok');
  veTatCa();
};

function xoaLich(id) {
  lamMoiDuLieu();

  var viTri = -1;
  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    if (duLieu.lichDangKi[i].id === id) {
      viTri = i;
    }
  }
  if (viTri === -1) {
    return;
  }

  var luot = duLieu.lichDangKi[viTri];

  if (luot.nguoiDat !== tenNguoiDung()) {
    thongBao('Chỉ người đặt lịch này mới được xóa.', 'err');
    return;
  }

  var chacChan = confirm('Xóa lịch ' + luot.lop + ' - Phòng máy ' + luot.phong + ', ca ' + luot.ca + ' ngày ' + hienNgay(luot.ngay) + '?');
  if (!chacChan) {
    return;
  }

  duLieu.lichDangKi.splice(viTri, 1);
  luuDuLieu();
  veTatCa();
  thongBao('Đã xóa lịch ' + luot.lop + ', ca ' + luot.ca + ', ' + hienNgay(luot.ngay) + '.', 'ok');
}


//CHẠY KHI MỞ TRANG
veOChonCa();
chonTab('lich');
veTatCa();
setInterval(veTatCa, 20000);