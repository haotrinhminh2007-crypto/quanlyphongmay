document.addEventListener('DOMContentLoaded', function () {
  // Hiển thị ngày
  const elemHomNay = document.getElementById('homNay');
  if (elemHomNay) {
    const now = new Date();
    elemHomNay.textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  // Khởi tạo các biểu đồ Chart.js
  initUsageChart();
  initStatusChart();
});

function initUsageChart() {
  const ctx = document.getElementById('usageChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10'],
      datasets: [{
        label: 'Số giờ sử dụng (Giờ)',
        data: [210, 180, 90, 320, 410, 384],
        backgroundColor: '#4318ff',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

function initStatusChart() {
  const ctx = document.getElementById('statusChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tốt / Sẵn sàng', 'Đang sửa chữa', 'Hỏng hóc'],
      datasets: [{
        data: [142, 6, 2],
        backgroundColor: ['#01b574', '#ffb547', '#ee5d50']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function exportReport() {
  alert("Xuất file báo cáo thống kê Excel thành công!");
}