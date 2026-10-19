var khungPhong = document.getElementById("rooms");

function vePhongMay() {
  lamMoiDuLieu();
  var bayGio = new Date();
  var html = "";

  for (var i = 0; i < DANH_SACH_PHONG.length; i++) {
    var soPhong = DANH_SACH_PHONG[i];
    var caDangChay = null;

    for (var j = 0; j < duLieu.lichDangKi.length; j++) {
      var luot = duLieu.lichDangKi[j];

      if (
        Number(luot.phong) === soPhong &&
        gioBatDau(luot) <= bayGio &&
        gioKetThuc(luot) > bayGio
      ) {
        caDangChay = luot;
        break;
      }
    }

    var trangThai = "Trống";
    var tenLop = "Chưa có lớp thực hành";
    var thongTinCa = "";
    var classBusy = "";

    if (caDangChay !== null) {
      trangThai = "Đang thực hành";
      tenLop = lamSachChu(caDangChay.lop);
      thongTinCa = "Ca " + caDangChay.ca + " · " + chuGioCa(caDangChay.ca);
      classBusy = " busy";
    }

    html += '<div class="room' + classBusy + '">';
    html += '<span class="dot"></span>';
    html += "<h3>Phòng máy " + soPhong + "</h3>";
    html += '<span class="st">' + trangThai + "</span>";
    html += '<span class="lop">' + tenLop + "</span>";
    html += '<span class="ca">' + thongTinCa + "</span>";
    html += "</div>";
  }

  khungPhong.innerHTML = html;
}

vePhongMay();

setInterval(vePhongMay, 20000);
