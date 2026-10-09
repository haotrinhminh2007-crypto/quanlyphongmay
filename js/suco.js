let incidents = [
  { id: 'SC01', room: 'Lab 101', pc: 'Máy 05', desc: 'Lỗi không lên nguồn', priority: 'Khẩn cấp', date: '2026-10-07', status: 'Chờ xử lý' },
  { id: 'SC02', room: 'Lab 102', pc: 'Máy 12', desc: 'Chuột liệt chuột phải, RAM nhận 4GB', priority: 'Bình thường', date: '2026-10-06', status: 'Đang sửa chữa' },
  { id: 'SC03', room: 'Lab 201', pc: 'Máy 01', desc: 'Mất kết nối mạng LAN', priority: 'Trung bình', date: '2026-10-05', status: 'Chờ xử lý' },
  { id: 'SC04', room: 'Lab 305', pc: 'Máy 20', desc: 'Màn hình chớp nhấp nháy', priority: 'Trung bình', date: '2026-10-04', status: 'Đã hoàn thành' }
];

document.addEventListener('DOMContentLoaded', function () {
  // Hiển thị ngày
  const elemHomNay = document.getElementById('homNay');
  if (elemHomNay) {
    const now = new Date();
    elemHomNay.textContent = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  renderIncidents(incidents);

  // Xử lý gửi Form
  const form = document.getElementById('incident-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const newIncident = {
        id: 'SC' + String(incidents.length + 1).padStart(2, '0'),
        room: document.getElementById('inp-room').value,
        pc: document.getElementById('inp-pc').value,
        desc: document.getElementById('inp-desc').value,
        priority: document.getElementById('inp-priority').value,
        date: new Date().toISOString().split('T')[0],
        status: 'Chờ xử lý'
      };

      incidents.unshift(newIncident);
      renderIncidents(incidents);
      updateStats();
      form.reset();
      alert('Đã gửi báo cáo sự cố thành công!');
    });
  }
});

function renderIncidents(data) {
  const tbody = document.getElementById('incident-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#999;">Không có sự cố nào.</td></tr>';
    return;
  }

  data.forEach(item => {
    let badgeClass = 'badge-pending';
    if (item.status === 'Đang sửa chữa') badgeClass = 'badge-fixing';
    if (item.status === 'Đã hoàn thành') badgeClass = 'badge-done';

    let priorityStyle = item.priority === 'Khẩn cấp' ? 'style="color:red; font-weight:bold;"' : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${item.id}</b></td>
      <td>${item.room}</td>
      <td>${item.pc}</td>
      <td>${item.desc}</td>
      <td ${priorityStyle}>${item.priority}</td>
      <td>${item.date}</td>
      <td><span class="badge ${badgeClass}">${item.status}</span></td>
      <td>
        ${item.status !== 'Đã hoàn thành' ? `<button class="btn-action" onclick="changeStatus('${item.id}')">🔄 Đổi trạng thái</button>` : '---'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function changeStatus(id) {
  const target = incidents.find(item => item.id === id);
  if (target) {
    if (target.status === 'Chờ xử lý') target.status = 'Đang sửa chữa';
    else if (target.status === 'Đang sửa chữa') target.status = 'Đã hoàn thành';
    
    renderIncidents(incidents);
    updateStats();
  }
}

function updateStats() {
  document.getElementById('stat-pending').textContent = incidents.filter(i => i.status === 'Chờ xử lý').length;
  document.getElementById('stat-fixing').textContent = incidents.filter(i => i.status === 'Đang sửa chữa').length;
  document.getElementById('stat-fixed').textContent = incidents.filter(i => i.status === 'Đã hoàn thành').length + 15;
}

function filterIncidents() {
  const dateVal = document.getElementById('filter-date').value;
  const statusVal = document.getElementById('filter-status').value;

  let filtered = incidents;
  if (dateVal) filtered = filtered.filter(i => i.date === dateVal);
  if (statusVal !== 'ALL') filtered = filtered.filter(i => i.status === statusVal);

  renderIncidents(filtered);
}

function exportData() {
  alert("Xuất dữ liệu danh sách sự cố thành công!");
}s