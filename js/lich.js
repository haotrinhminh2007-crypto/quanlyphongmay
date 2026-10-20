var SO_CA = 4;
var DANH_SACH_PHONG = [1, 2, 3, 4];
var KHOA_LICH_TAM = 'labmanager-lich-tam';
var CA = [
  null,
  { batDau: "07:00", ketThuc: "09:30" },
  { batDau: "09:35", ketThuc: "12:00" },
  { batDau: "13:00", ketThuc: "15:30" },
  { batDau: "15:35", ketThuc: "18:00" },
];
var TEN_THU = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];
var duLieu = { lichDangKi: [], lichSu: [] };

function docDuLieuTam() {
  try {
    var trangThaiTai = performance.getEntriesByType('navigation');
    if (trangThaiTai.length > 0 && trangThaiTai[0].type === 'reload') {
      sessionStorage.removeItem(KHOA_LICH_TAM);
      return;
    }

    var chu = sessionStorage.getItem(KHOA_LICH_TAM);
    if (chu !== null) {
      var duLieuTam = JSON.parse(chu);
      if (Array.isArray(duLieuTam.lichDangKi) && Array.isArray(duLieuTam.lichSu)) {
        duLieu = duLieuTam;
      }
    }
  } catch (e) {
    duLieu = { lichDangKi: [], lichSu: [] };
  }
}

function luuDuLieuTam() {
  try {
    sessionStorage.setItem(KHOA_LICH_TAM, JSON.stringify(duLieu));
  } catch (e) {
    // Trang vẫn chạy với dữ liệu trong bộ nhớ nếu trình duyệt chặn sessionStorage.
  }
}

var bangLich = document.getElementById("cal");
var khungLich = document.getElementById("calwrap");
var khungLichSu = document.getElementById("hist");
var thanhChuyenTuan = document.getElementById("weekctl");
var nhanTuan = document.getElementById("wlabel");
var nutTab = document.querySelectorAll(".seg button");
var tuanBatDau;

function docDanhSachPhong() {
  return DANH_SACH_PHONG.slice();
}

function them0(so) {
  return so < 10 ? "0" + so : String(so);
}

function ngayThanhChu(ngay) {
  return (
    ngay.getFullYear() +
    "-" +
    them0(ngay.getMonth() + 1) +
    "-" +
    them0(ngay.getDate())
  );
}

function hienNgay(chuNgay) {
  var phan = chuNgay.split("-");
  return phan[2] + "/" + phan[1] + "/" + phan[0];
}

function chuGioCa(ca) {
  return CA[Number(ca)].batDau + " – " + CA[Number(ca)].ketThuc;
}

function gioBatDau(luot) {
  return new Date(luot.ngay + "T" + CA[Number(luot.ca)].batDau + ":00");
}

function gioKetThuc(luot) {
  return new Date(luot.ngay + "T" + CA[Number(luot.ca)].ketThuc + ":00");
}

function tenNguoiDung() {
  return layNguoiDungHienTai().ten;
}

function lamSachChu(chu) {
  return String(chu)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function chuyenCaDaQua() {
  var bayGio = new Date();
  var conLai = [];

  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    if (gioKetThuc(luot) <= bayGio) duLieu.lichSu.push(luot);
    else conLai.push(luot);
  }
  duLieu.lichDangKi = conLai;
}

function lamMoiDuLieu() {
  chuyenCaDaQua();
  luuDuLieuTam();
}

function thuHaiCuaTuan(ngay) {
  var dauTuan = new Date(ngay.getFullYear(), ngay.getMonth(), ngay.getDate());
  dauTuan.setDate(dauTuan.getDate() - ((dauTuan.getDay() + 6) % 7));
  return dauTuan;
}

function layBayNgay() {
  var bayNgay = [];
  for (var i = 0; i < 7; i++) {
    var ngay = new Date(tuanBatDau);
    ngay.setDate(ngay.getDate() + i);
    bayNgay.push(ngay);
  }
  return bayNgay;
}

function veTieuDe(bayNgay) {
  var homNay = ngayThanhChu(new Date());
  var html = "<thead><tr><th>Ca</th>";
  for (var i = 0; i < bayNgay.length; i++) {
    var ngay = bayNgay[i];
    var lopCss = ngayThanhChu(ngay) === homNay ? "today" : "";
    html += '<th class="' + lopCss + '">' + TEN_THU[ngay.getDay()];
    html +=
      "<small>" +
      them0(ngay.getDate()) +
      "/" +
      them0(ngay.getMonth() + 1) +
      "</small></th>";
  }
  return html + "</tr></thead>";
}

function veCacLopTrongO(chuNgay, ca, bayGio) {
  var html = "";
  for (var i = 0; i < duLieu.lichDangKi.length; i++) {
    var luot = duLieu.lichDangKi[i];
    if (luot.ngay !== chuNgay || Number(luot.ca) !== ca) continue;

    var dangChay = gioBatDau(luot) <= bayGio && gioKetThuc(luot) > bayGio;
    var lopCss = dangChay ? "chip live" : "chip";
    html += '<div class="' + lopCss + '"><b>' + lamSachChu(luot.lop) + "</b>";
    html += "<small>Phòng máy " + Number(luot.phong) + "</small>";
    if (luot.nguoiDat === tenNguoiDung()) {
      html +=
        '<button type="button" class="xoa" data-delete-id="' +
        lamSachChu(luot.id) +
        '" aria-label="Xóa ca">×</button>';
    }
    html += "</div>";
  }
  return html;
}

function veLich() {
  if (bangLich === null) return;
  var bayNgay = layBayNgay();
  var bayGio = new Date();
  var dau = hienNgay(ngayThanhChu(bayNgay[0]));
  var cuoi = hienNgay(ngayThanhChu(bayNgay[6]));
  var html = veTieuDe(bayNgay) + "<tbody>";

  nhanTuan.textContent = dau + " – " + cuoi;
  for (var ca = 1; ca <= SO_CA; ca++) {
    html +=
      '<tr><td class="ca-col"><b>Ca ' +
      ca +
      "</b><small>" +
      chuGioCa(ca) +
      "</small></td>";
    for (var i = 0; i < bayNgay.length; i++) {
      html +=
        "<td>" + veCacLopTrongO(ngayThanhChu(bayNgay[i]), ca, bayGio) + "</td>";
    }
    html += "</tr>";
  }
  bangLich.innerHTML = html + "</tbody>";
}

function veTatCa() {
  lamMoiDuLieu();
  veLich();
  if (typeof veLichSu === "function") veLichSu();
}

function chonTab(tenTab) {
  if (khungLich === null) return;
  nutTab[0].className = tenTab === "lich" ? "on" : "";
  nutTab[1].className = tenTab === "lichsu" ? "on" : "";
  khungLich.style.display = tenTab === "lich" ? "" : "none";
  thanhChuyenTuan.style.display = tenTab === "lich" ? "" : "none";
  khungLichSu.style.display = tenTab === "lichsu" ? "" : "none";
}

docDuLieuTam();

if (bangLich !== null) {
  tuanBatDau = thuHaiCuaTuan(new Date());
  document.getElementById("prev").onclick = function () {
    tuanBatDau.setDate(tuanBatDau.getDate() - 7);
    veLich();
  };
  document.getElementById("next").onclick = function () {
    tuanBatDau.setDate(tuanBatDau.getDate() + 7);
    veLich();
  };
  document.getElementById("thisweek").onclick = function () {
    tuanBatDau = thuHaiCuaTuan(new Date());
    veLich();
  };
  nutTab[0].onclick = function () {
    chonTab("lich");
  };
  nutTab[1].onclick = function () {
    chonTab("lichsu");
  };
  chonTab("lich");
  veTatCa();
  setInterval(veTatCa, 20000);
} else {
  lamMoiDuLieu();
}
