
const KHOA_SU_CO = 'lm_su_co_v2';
const TT_CHO = 'Chờ xử lý';
const TT_SUA = 'Đang sửa chữa';
const TT_XONG = 'Đã hoàn thành';

let incidents = docSuCo();

function docSuCo() {
  try {
    const data = JSON.parse(localStorage.getItem(KHOA_SU_CO) || '[]');
    if (Array.isArray(data)) return data;
  } catch (e) {  }
  return [];
}

function luuSuCo() {
  try {
    localStorage.setItem(KHOA_SU_CO, JSON.stringify(incidents));
    return true;
  } catch (e) {
    hienThongBao('Không lưu được dữ liệu. Hãy kiểm tra cài đặt trình duyệt.');
    return false;
  }
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function hienThongBao(noiDung) {
  const node = document.getElementById('toast');
  if (!node) return;
  node.textContent = noiDung;
  node.classList.add('show');
  clearTimeout(node._timer);
  node._timer = setTimeout(() => node.classList.remove('show'), 2400);
}

function hienNgay() {
  const el = document.getElementById('homNay');
  if (!el) return;
  const thu = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  el.textContent = `${thu[d.getDay()]}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function ngayHomNay() {            
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function taoMaMoi() {
  const max = incidents.reduce((m, x) => Math.max(m, parseInt(String(x.id).replace(/\D/g, ''), 10) || 0), 0);
  return 'SC' + String(max + 1).padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', function () {
  hienNgay();
  filterIncidents();
  updateStats();

  
  const form = document.getElementById('incident-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const item = {
        id: taoMaMoi(),
        room: document.getElementById('inp-room').value,
        pc: document.getElementById('inp-pc').value.trim(),
        desc: document.getElementById('inp-desc').value.trim(),
        date: ngayHomNay(),
        status: TT_CHO
      };
      incidents.unshift(item);
      if (!luuSuCo()) { incidents.shift(); return; }
      filterIncidents();
      updateStats();
      form.reset();
      hienThongBao('Đã lưu sự cố ' + item.id + '.');
    });
  }

  
  window.addEventListener('storage', function (e) {
    if (e.key === KHOA_SU_CO) { incidents = docSuCo(); filterIncidents(); updateStats(); }
  });
});

function renderIncidents(data) {
  const tbody = document.getElementById('incident-table-body');
  if (!tbody) return;

  document.getElementById('demSuCo').textContent = incidents.length ? `(${data.length}/${incidents.length})` : '';

  if (data.length === 0) {
    const loi = incidents.length ? 'Không có sự cố nào khớp bộ lọc.' : 'Chưa có sự cố nào. Hãy nhập thông tin ở khung trên rồi bấm Lưu.';
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><span>🛠️</span>${loi}</div></td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(item => {
    const ngay = item.date ? item.date.split('-').reverse().join('/') : '—';
    let trangThai;
    if (item.status === TT_XONG) {
      trangThai = `<span class="badge badge-done">${TT_XONG}</span>`;
    } else {
      const lop = item.status === TT_SUA ? 'badge-fixing' : 'badge-pending';
      const tiep = item.status === TT_SUA ? TT_XONG : TT_SUA;
      trangThai = `<button type="button" class="badge badge-btn ${lop}" title="Bấm để chuyển sang: ${tiep}" onclick="changeStatus('${escapeHtml(item.id)}')">${escapeHtml(item.status)}</button>`;
    }
    return `<tr>
      <td><b>${escapeHtml(item.id)}</b></td>
      <td>${escapeHtml(item.room)}</td>
      <td>${escapeHtml(item.pc)}</td>
      <td class="mota">${escapeHtml(item.desc)}</td>
      <td>${escapeHtml(ngay)}</td>
      <td>${trangThai}</td>
    </tr>`;
  }).join('');
}

function changeStatus(id) {
  const target = incidents.find(item => item.id === id);
  if (!target) return;
  const cu = { status: target.status, doneDate: target.doneDate };
  if (target.status === TT_CHO) target.status = TT_SUA;
  else if (target.status === TT_SUA) { target.status = TT_XONG; target.doneDate = ngayHomNay(); }
  if (!luuSuCo()) { target.status = cu.status; target.doneDate = cu.doneDate; return; }
  filterIncidents();
  updateStats();
}

function updateStats() {
  const thangNay = ngayHomNay().slice(0, 7);
  document.getElementById('stat-pending').textContent = incidents.filter(i => i.status === TT_CHO).length;
  document.getElementById('stat-fixing').textContent = incidents.filter(i => i.status === TT_SUA).length;
  document.getElementById('stat-fixed').textContent = incidents.filter(i => i.status === TT_XONG && String(i.doneDate || i.date).slice(0, 7) === thangNay).length;
}

function filterIncidents() {
  const dateVal = document.getElementById('filter-date').value;
  const statusVal = document.getElementById('filter-status').value;

  let filtered = incidents;
  if (dateVal) filtered = filtered.filter(i => i.date === dateVal);
  if (statusVal !== 'ALL') filtered = filtered.filter(i => i.status === statusVal);

  renderIncidents(filtered);
}
