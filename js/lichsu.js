var khungLichSu = document.getElementById("hist");

function veLichSu() {
  if (khungLichSu === null) return;
  if (duLieu.lichSu.length === 0) {
    khungLichSu.innerHTML =
      '<div class="empty">Chưa có ca nào thực hành xong.</div>';
    return;
  }

  var html =
    "<table><thead><tr><th>Ngày</th><th>Ca</th><th>Lớp học phần</th><th>Phòng</th></tr></thead><tbody>";
  for (var i = duLieu.lichSu.length - 1; i >= 0; i--) {
    var luot = duLieu.lichSu[i];
    html += "<tr><td>" + hienNgay(luot.ngay) + "</td>";
    html += "<td>Ca " + luot.ca + " (" + chuGioCa(luot.ca) + ")</td>";
    html += "<td>" + lamSachChu(luot.lop) + "</td>";
    html += "<td>Phòng máy " + Number(luot.phong) + "</td></tr>";
  }
  khungLichSu.innerHTML = html + "</tbody></table>";
}
