// ===== Trang Báo cáo =====
// Số liệu theo phòng lấy từ trang Sự cố (khóa lm_su_co_v2) và danh sách máy ở trang Máy tính (khóa lm_machines).
// Chưa có gì thì mọi chỉ số đều bằng 0. Ca và giờ sử dụng chưa nối với trang Đặt lịch ca nên để 0.
const KHOA_SU_CO = 'lm_su_co_v2';
const KHOA_MAY = 'lm_machines';
const KHOA_BAO_CAO = 'lm_bao_cao_da_luu';
const DANH_SACH_PHONG = ['Phòng 1', 'Phòng 2', 'Phòng 3', 'Phòng 4'];

let bieuDoGio = null;
let bieuDoTinhTrang = null;

function layMau(ten, du) {
  return getComputedStyle(document.documentElement).getPropertyValue(ten).trim() || du;
}

function hienThongBao(noiDung) {
  const node = document.getElementById('toast');
  if (!node) return;
  node.textContent = noiDung;
  node.classList.add('show');
  clearTimeout(node._timer);
  node._timer = setTimeout(() => node.classList.remove('show'), 2800);
}

function hienNgay() {
  const el = document.getElementById('homNay');
  if (!el) return;
  const thu = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  el.textContent = `${thu[d.getDay()]}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function docDanhSach(khoa) {
  try {
    const data = JSON.parse(localStorage.getItem(khoa) || '[]');
    return Array.isArray(data) ? data.filter(x => x && typeof x === 'object') : [];
  } catch (e) { return []; }
}

// Tính số liệu từng phòng từ dữ liệu của trang Sự cố và Máy tính
function tinhPhongMay() {
  const suCo = docDanhSach(KHOA_SU_CO);
  const may = docDanhSach(KHOA_MAY);
  return DANH_SACH_PHONG.map(ten => {
    const so = ten.match(/\d+/)[0];
    const soMay = may.filter(m => typeof m.room === 'string' && (m.room.match(/(\d+)\s*$/) || [])[1] === so).length;
    const dangSua = suCo.filter(s => s.room === ten && s.status === 'Đang sửa chữa').length;
    const hong = suCo.filter(s => s.room === ten && s.status === 'Chờ xử lý').length;
    const tong = Math.max(soMay, dangSua + hong);
    return { ten, tong, tot: tong - dangSua - hong, dangSua, hong };
  });
}

function veBangPhong(phong) {
  const tong = k => phong.reduce((t, p) => t + p[k], 0);
  document.getElementById('bangPhong').innerHTML = phong.map(p => `<tr>
      <td><b>${p.ten}</b></td>
      <td class="so">${p.tong}</td>
      <td class="so"><span class="badge badge-success">${p.tot}</span></td>
      <td class="so"><span class="badge badge-warning">${p.dangSua}</span></td>
      <td class="so"><span class="badge badge-danger">${p.hong}</span></td>
    </tr>`).join('');
  document.getElementById('tongPhong').innerHTML = `<tr>
      <td>Tổng cộng</td><td class="so">${tong('tong')}</td><td class="so">${tong('tot')}</td><td class="so">${tong('dangSua')}</td><td class="so">${tong('hong')}</td>
    </tr>`;
}

// ----- Biểu đồ -----
function nhanSauThangGanNhat() {
  const now = new Date();
  const nhan = [];
  for (let i = 5; i >= 0; i--) nhan.push('Tháng ' + (new Date(now.getFullYear(), now.getMonth() - i, 1).getMonth() + 1));
  return nhan;
}
const GIO_THEO_THANG = { nhan: nhanSauThangGanNhat(), gio: [0, 0, 0, 0, 0, 0] };   // chưa có dữ liệu

function duLieuTinhTrang(phong) {
  const cong = k => phong.reduce((t, p) => t + p[k], 0);
  const so = [cong('tot'), cong('dangSua'), cong('hong')];
  if (so.every(v => v === 0)) {   // chưa có gì: vẽ vòng xám
    return { trong: true, labels: ['Chưa có dữ liệu'], data: [1], mau: ['#e5e7eb'] };
  }
  return {
    trong: false,
    labels: ['Tốt / Sẵn sàng', 'Đang sửa chữa', 'Hỏng chờ xử lý'],
    data: so,
    mau: [layMau('--green', '#12b886'), layMau('--orange', '#f59f00'), layMau('--red', '#e5384f')]
  };
}

function baoKhongCoThuVien(idCanvas) {
  const canvas = document.getElementById(idCanvas);
  if (canvas && canvas.parentElement) {
    canvas.parentElement.innerHTML = '<div class="chart-loi">Không tải được thư viện biểu đồ (cần kết nối mạng).</div>';
  }
}

function veBieuDo(phong) {
  if (typeof Chart === 'undefined') {
    baoKhongCoThuVien('usageChart');
    baoKhongCoThuVien('statusChart');
    return;
  }
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = layMau('--mute', '#6c7489');

  bieuDoGio = new Chart(document.getElementById('usageChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: GIO_THEO_THANG.nhan,
      datasets: [{ label: 'Số giờ sử dụng (Giờ)', data: GIO_THEO_THANG.gio, backgroundColor: layMau('--blue', '#3b5bfd'), borderRadius: 6, maxBarThickness: 48 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, suggestedMax: 10, ticks: { precision: 0 } }, x: { grid: { display: false } } }
    }
  });

  const tt = duLieuTinhTrang(phong);
  bieuDoTinhTrang = new Chart(document.getElementById('statusChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: tt.labels, datasets: [{ data: tt.data, backgroundColor: tt.mau, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom' }, tooltip: { enabled: !tt.trong } } }
  });
}

function capNhatBieuDoTinhTrang(phong) {
  if (!bieuDoTinhTrang) return;
  const tt = duLieuTinhTrang(phong);
  bieuDoTinhTrang.data.labels = tt.labels;
  bieuDoTinhTrang.data.datasets[0].data = tt.data;
  bieuDoTinhTrang.data.datasets[0].backgroundColor = tt.mau;
  bieuDoTinhTrang.options.plugins.tooltip.enabled = !tt.trong;
  bieuDoTinhTrang.update();
}

function capNhatTatCa() {
  const phong = tinhPhongMay();
  veBangPhong(phong);
  capNhatBieuDoTinhTrang(phong);
}

// ----- Lưu báo cáo -----
function chupBaoCao() {
  return {
    luuLuc: new Date().toISOString(),
    thongKe: Array.from(document.querySelectorAll('.stat')).map(s => ({
      ten: s.querySelector('.label').textContent.trim(),
      giaTri: s.querySelector('strong').textContent.trim(),
      ghiChu: s.querySelector('small').textContent.trim()
    })),
    gioSuDungTheoThang: GIO_THEO_THANG,
    phongMay: tinhPhongMay()
  };
}

function luuBaoCao() {
  const ban = chupBaoCao();
  let ds = [];
  try {
    ds = JSON.parse(localStorage.getItem(KHOA_BAO_CAO) || '[]');
    if (!Array.isArray(ds)) ds = [];
  } catch (e) { ds = []; }
  ds.unshift(ban);
  try {
    localStorage.setItem(KHOA_BAO_CAO, JSON.stringify(ds.slice(0, 20)));
  } catch (e) {
    hienThongBao('Không lưu được báo cáo. Hãy kiểm tra cài đặt trình duyệt.');
    return;
  }
  const d = new Date(ban.luuLuc);
  const p = n => String(n).padStart(2, '0');
  hienThongBao(`Đã lưu báo cáo lúc ${p(d.getHours())}:${p(d.getMinutes())} ngày ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}.`);
}

document.addEventListener('DOMContentLoaded', function () {
  hienNgay();
  const phong = tinhPhongMay();
  veBangPhong(phong);
  veBieuDo(phong);
  const nut = document.getElementById('btnLuu');
  if (nut) nut.addEventListener('click', luuBaoCao);
  // Trang Sự cố / Máy tính đổi dữ liệu (ở tab khác) thì báo cáo cập nhật theo
  window.addEventListener('storage', function (e) {
    if (e.key === KHOA_SU_CO || e.key === KHOA_MAY) capNhatTatCa();
  });
});
