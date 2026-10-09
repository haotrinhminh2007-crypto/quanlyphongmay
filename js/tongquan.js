// JS RIÊNG của trang Tổng quan (đọc số liệu từ data.js)
var D = DULIEU;
var tt = D.tinhTrang;
var tongMay = D.phongMay.reduce(function (t, ph) { return t + ph.soMay; }, 0);
var tongTinhTrang = tt.sanSang + tt.dangDung + tt.baoTri + tt.hong;

function gan(id, noiDung) { document.getElementById(id).textContent = noiDung; }

gan('tenNguoiDung', D.nguoiDung);
gan('soPhong', D.phongMay.length);
gan('soMay', tongMay);
gan('ghiChuMay', tt.sanSang + ' sẵn sàng - ' + tt.hong + ' hỏng');
gan('soCa', D.caHomNay);
gan('ghiChuCa', D.caChoDuyet + ' ca chờ duyệt');
gan('soSuCo', D.suCoChuaXuLy);
gan('chiPhi', 'Chi phí sửa chữa: ' + D.chiPhiSuaChua.toLocaleString('vi-VN') + ' đ');

if (tongMay !== tongTinhTrang) {
  console.warn('Tổng máy các phòng (' + tongMay + ') khác tổng theo tình trạng (' + tongTinhTrang + ') - kiểm tra lại data.js');
}

if (typeof Chart === 'undefined') {
  console.warn('Chưa tải được Chart.js - kiểm tra internet hoặc đường dẫn thư viện.');
} else {
  new Chart(document.getElementById('bieuDoCot'), {
    type: 'bar',
    data: {
      labels: D.phongMay.map(function (ph) { return ph.ten; }),
      datasets: [{ label: 'Số máy', data: D.phongMay.map(function (ph) { return ph.soMay; }),
        backgroundColor: '#3b5bfd', borderRadius: 8, maxBarThickness: 64 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: '#e4e8f2' } }, x: { grid: { display: false } } } }
  });
  new Chart(document.getElementById('bieuDoTron'), {
    type: 'doughnut',
    data: { labels: ['Sẵn sàng', 'Đang dùng', 'Bảo trì', 'Hỏng'],
      datasets: [{ data: [tt.sanSang, tt.dangDung, tt.baoTri, tt.hong],
        backgroundColor: ['#12b886', '#3b5bfd', '#f59f00', '#e5384f'], borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom' } } }
  });
}
