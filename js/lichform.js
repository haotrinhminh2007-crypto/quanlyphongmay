
var nutCong = document.getElementById('plus');
var form = document.getElementById('pop');
var nutGui = form.querySelector('.submit');
var oNgay = document.getElementById('f-date');
var oLop = document.getElementById('f-cls');
var khungPhongChon = document.getElementById('f-room');
var khungCa = document.getElementById('f-shifts');
var khungBangLich = document.getElementById('cal');

function veOChonCa() {
  var html = '';
  for (var ca = 1; ca <= SO_CA; ca++) {
    html += '<label><input type="checkbox" value="' + ca + '"> Ca ' + ca;
    html += '<small>' + chuGioCa(ca) + '</small></label>';
  }
  khungCa.innerHTML = html;
}

function veOChonPhong() {
  var html = '';
  var danhSachPhong = docDanhSachPhong();
  for (var i = 0; i < danhSachPhong.length; i++) {
    var daChon = i === 0 ? ' checked' : '';
    html += '<label><input type="radio" name="room" value="' + danhSachPhong[i] + '"' + daChon + '>';
    html += '<span>Phòng ' + danhSachPhong[i] + '</span></label>';
  }
  khungPhongChon.innerHTML = html;
}

function moForm() {
  form.reset();
  oNgay.value = ngayThanhChu(new Date());
  veOChonPhong();
  veOChonCa();
  form.classList.add('on');
  nutCong.setAttribute('aria-expanded', 'true');
}

function dongForm() {
  form.classList.remove('on');
  nutCong.setAttribute('aria-expanded', 'false');
}

function layCacCaDuocChon() {
  var cacCa = [];
  var cacO = khungCa.querySelectorAll('input');
  for (var i = 0; i < cacO.length; i++) {
    if (cacO[i].checked) cacCa.push(Number(cacO[i].value));
  }
  return cacCa;
}

function daCoLop(ngay, ca, phong) {
  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    if (luot.ngay === ngay && Number(luot.ca) === ca && Number(luot.phong) === phong) return true;
  }
  return false;
}

function kiemTraForm(ngay, lop, cacCa, phong) {
  if (ngay === '' || lop === '' || cacCa.length === 0) return false;
  for (var i = 0; i < cacCa.length; i++) {
    var luot = { ngay: ngay, ca: cacCa[i] };
    if (gioKetThuc(luot) <= new Date() || daCoLop(ngay, cacCa[i], phong)) return false;
  }
  return true;
}

function xuLyDangKy(e) {
  e.preventDefault();
  lamMoiDuLieu();

  var ngay = oNgay.value;
  var lop = oLop.value.trim();
  var oPhong = form.querySelector('input[name="room"]:checked');
  var phong = oPhong ? Number(oPhong.value) : 0;
  var cacCa = layCacCaDuocChon();
  if (!kiemTraForm(ngay, lop, cacCa, phong)) return;

  for (var i = 0; i < cacCa.length; i++) {
    duLieu.lichDangKi.push({
      id: Date.now() + '-' + cacCa[i] + '-' + i,
      ngay: ngay,
      ca: cacCa[i],
      phong: phong,
      lop: lop,
      nguoiDat: tenNguoiDung()
    });
  }

  dongForm();
  form.reset();
  veTatCa();
}

function xoaLich(id) {
  lamMoiDuLieu();
  var viTri = -1;
  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    if (String(duLieu.lichDangKi[i].id) === String(id)) viTri = i;
  }
  if (viTri < 0) return;

  var luot = duLieu.lichDangKi[viTri];
  if (luot.nguoiDat !== tenNguoiDung()) return;
  if (!confirm('Xóa ca ' + luot.ca + ' của lớp ' + luot.lop + '?')) return;

  duLieu.lichDangKi.splice(viTri, 1);
  veTatCa();
}

nutCong.onclick = function () {
  if (form.classList.contains('on')) dongForm();
  else moForm();
};
khungBangLich.onclick = function (e) {
  var nutXoa = e.target.closest('[data-delete-id]');
  if (nutXoa !== null) xoaLich(nutXoa.getAttribute('data-delete-id'));
};
form.onsubmit = xuLyDangKy;
document.onkeydown = function (e) {
  if (e.key === 'Escape') dongForm();
};
