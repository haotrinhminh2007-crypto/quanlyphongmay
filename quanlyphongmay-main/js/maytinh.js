/* Quản lý máy tính - bản sửa lỗi ổn định */
(function () {
  'use strict';

  const STORAGE_KEY = 'lm_machines';
  const $ = (id) => document.getElementById(id);
  const dataDefault = [
    ['A1-101-02','Phòng thực hành 1','AMD Ryzen 5 6600G','8GB','256GB SSD','AMD Radeon Graphics','Dãy 1 - Số 2','Sẵn sàng'],
    ['A1-101-03','Phòng thực hành 1','Intel Core i5-10400','8GB','1TB HDD','NVIDIA GTX 1650','Dãy 1 - Số 3','Sẵn sàng'],
    ['A1-101-04','Phòng thực hành 1','Intel Core i5-12400','16GB','512GB SSD','NVIDIA GTX 1650','Dãy 1 - Số 4','Sẵn sàng'],
    ['A1-101-05','Phòng thực hành 1','Intel Core i7-11700','16GB','512GB SSD','NVIDIA GTX 1660','Dãy 1 - Số 5','Đang sử dụng'],
    ['A1-101-06','Phòng thực hành 1','AMD Ryzen 5 5600G','8GB','256GB SSD','AMD Radeon Graphics','Dãy 1 - Số 6','Sẵn sàng'],
    ['A1-101-07','Phòng thực hành 1','Intel Core i5-10400','8GB','1TB HDD','NVIDIA GTX 1650','Dãy 1 - Số 1','Hỏng'],
    ['A1-101-08','Phòng thực hành 1','Intel Core i5-12400','16GB','512GB SSD','NVIDIA GTX 1650','Dãy 2 - Số 2','Sẵn sàng'],
    ['A1-101-09','Phòng thực hành 1','Intel Core i7-11700','16GB','512GB SSD','NVIDIA GTX 1650','Dãy 2 - Số 3','Sẵn sàng']
  ].map(x => ({ code:x[0], room:x[1], cpu:x[2], ram:x[3], disk:x[4], gpu:x[5], position:x[6], status:x[7], os:'Windows 11 Pro', date:'2023-08-15', note:'' }));

  function readMachines() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return dataDefault.map(x => ({...x}));
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return dataDefault.map(x => ({...x}));
      return parsed.filter(x => x && typeof x === 'object').map(x => ({
        code: String(x.code || ''), room: String(x.room || 'Chưa phân phòng'),
        cpu: String(x.cpu || 'Chưa cập nhật'), ram: String(x.ram || '—'),
        disk: String(x.disk || '—'), gpu: String(x.gpu || '—'),
        position: String(x.position || ''), status: ['Sẵn sàng','Đang sử dụng','Hỏng','Bảo trì'].includes(x.status) ? x.status : 'Sẵn sàng',
        os: String(x.os || 'Windows 11 Pro'), date: String(x.date || ''), note: String(x.note || '')
      })).filter(x => x.code);
    } catch (err) {
      console.warn('Không đọc được dữ liệu máy tính từ localStorage; dùng dữ liệu mẫu.', err);
      return dataDefault.map(x => ({...x}));
    }
  }

  let machines = readMachines();
  function saveMachines() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
      return true;
    } catch (err) {
      toast('Không lưu được dữ liệu. Hãy kiểm tra cài đặt trình duyệt.');
      console.error(err);
      return false;
    }
  }
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function toast(message) {
    const node = $('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    if (node._toastTimer) clearTimeout(node._toastTimer);
    node._toastTimer = setTimeout(() => node.classList.remove('show'), 2400);
  }
  function rooms() {
    const list = [];
    // Thêm các phòng có sẵn từ data.js, nếu tồn tại.
    if (typeof DULIEU !== 'undefined' && Array.isArray(DULIEU.phongMay)) {
      DULIEU.phongMay.forEach(p => { if (p && p.ten && !list.includes(String(p.ten))) list.push(String(p.ten)); });
    }
    machines.forEach(m => { if (m.room && !list.includes(m.room)) list.push(m.room); });
    return list;
  }
  function fillRooms(selectedRoom) {
    const roomNames = rooms();
    const filter = $('roomFilter');
    const roomInput = $('room');
    const oldFilter = filter.value;
    filter.innerHTML = '<option value="">Tất cả phòng</option>' + roomNames.map(r => `<option value="${escapeHTML(r)}">${escapeHTML(r)}</option>`).join('');
    filter.value = roomNames.includes(oldFilter) ? oldFilter : '';
    roomInput.innerHTML = roomNames.map(r => `<option value="${escapeHTML(r)}">${escapeHTML(r)}</option>`).join('');
    if (selectedRoom && roomNames.includes(selectedRoom)) roomInput.value = selectedRoom;
    else if (!roomNames.length) {
      roomInput.innerHTML = '<option value="Phòng thực hành 1">Phòng thực hành 1</option>';
    }
  }
  function badge(status) {
    const cls = status === 'Sẵn sàng' ? 'ready' : status === 'Đang sử dụng' ? 'using' : status === 'Hỏng' ? 'broken' : 'maint';
    return `<span class="badge ${cls}">${escapeHTML(status)}</span>`;
  }
  function render() {
    const query = $('search').value.trim().toLocaleLowerCase('vi');
    const roomFilter = $('roomFilter').value;
    const statusFilter = $('statusFilter').value;
    const list = machines.filter(m => {
      const searchable = [m.code,m.room,m.cpu,m.ram,m.disk,m.gpu,m.position,m.status,m.os,m.note].join(' ').toLocaleLowerCase('vi');
      return (!query || searchable.includes(query)) && (!roomFilter || m.room === roomFilter) && (!statusFilter || m.status === statusFilter);
    });
    $('machineTable').innerHTML = list.map(m => {
      const i = machines.indexOf(m);
      return `<tr>
        <td><span class="code">${escapeHTML(m.code)}</span></td>
        <td>${escapeHTML(m.room)}</td>
        <td class="config"><b>${escapeHTML(m.cpu)}</b><br>${escapeHTML(m.ram)} · ${escapeHTML(m.disk)}<br>${escapeHTML(m.gpu)}<br><small>${escapeHTML(m.os)}</small></td>
        <td>${escapeHTML(m.position || '—')}</td><td>${badge(m.status)}</td>
        <td>${m.date ? escapeHTML(m.date.split('-').reverse().join('/')) : '—'}</td>
        <td><button class="action-btn" type="button" data-action="edit" data-index="${i}" aria-label="Sửa ${escapeHTML(m.code)}" title="Sửa">✎</button><button class="action-btn" type="button" data-action="delete" data-index="${i}" aria-label="Xóa ${escapeHTML(m.code)}" title="Xóa">🗑</button></td>
      </tr>`;
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:35px">Không tìm thấy máy tính.</td></tr>';
    $('resultCount').textContent = `Hiển thị ${list.length} / ${machines.length} máy`;
    $('total').textContent = machines.length;
    $('ready').textContent = machines.filter(m => m.status === 'Sẵn sàng').length;
    $('using').textContent = machines.filter(m => m.status === 'Đang sử dụng').length;
    $('problem').textContent = machines.filter(m => m.status === 'Hỏng' || m.status === 'Bảo trì').length;
  }
  function openModal(index = null) {
    $('machineForm').reset();
    $('editIndex').value = index === null ? '' : String(index);
    $('modalTitle').textContent = index === null ? 'Thêm máy tính' : 'Cập nhật máy tính';
    fillRooms(index === null ? '' : machines[index].room);
    if (index !== null && machines[index]) {
      const m = machines[index];
      ['code','room','position','status','cpu','ram','disk','gpu','os','note'].forEach(key => { $(key).value = m[key] || ''; });
      $('maintenance').value = m.date || '';
    } else {
      $('os').value = 'Windows 11 Pro';
      $('status').value = 'Sẵn sàng';
    }
    $('modal').classList.add('show');
    $('modal').setAttribute('aria-hidden', 'false');
    $('code').focus();
  }
  function closeModal() {
    $('modal').classList.remove('show');
    $('modal').setAttribute('aria-hidden', 'true');
  }
  function deleteMachine(index) {
    const machine = machines[index];
    if (!machine) return;
    if (!window.confirm(`Bạn có chắc muốn xóa máy ${machine.code}?`)) return;
    const removed = machines.splice(index, 1);
    if (!saveMachines()) { machines.splice(index, 0, ...removed); return; }
    fillRooms(); render(); toast('Đã xóa máy tính.');
  }
  function readCurrentUser() {
    const keys = ['lm_current_user', 'labmanager_current_user', 'currentUser', 'loggedInUser'];
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (!raw) continue;
        let value;
        try { value = JSON.parse(raw); } catch (_) { value = { name: raw }; }
        if (typeof value === 'string') value = { name: value };
        if (value && typeof value === 'object') return value;
      } catch (_) {}
    }
    return null;
  }
  function updateAccountDisplay() {
    const user = readCurrentUser() || {};
    const defaultName = (typeof DULIEU !== 'undefined' && DULIEU.nguoiDung) ? DULIEU.nguoiDung : 'Người dùng';
    const name = String(user.name || user.ten || user.fullName || user.username || user.hoTen || defaultName).trim() || defaultName;
    const role = String(user.role || user.vaiTro || user.rolename || user.chucVu || 'Quản trị viên').trim() || 'Người dùng';
    const sidebar = $('sidebar');
    if (!sidebar) return;
    const avatar = sidebar.querySelector('.avatar');
    const labels = sidebar.querySelectorAll('.me b, .me small');
    const initials = name.split(/\s+/).map(part => part[0]).filter(Boolean).slice(-2).join('').toUpperCase();
    if (avatar) avatar.textContent = initials || 'ND';
    if (labels[0]) labels[0].textContent = name;
    if (labels[1]) labels[1].textContent = role;
  }

  $('addBtn').addEventListener('click', () => openModal());
  $('closeBtn').addEventListener('click', closeModal);
  $('cancelBtn').addEventListener('click', closeModal);
  $('search').addEventListener('input', render);
  $('roomFilter').addEventListener('change', render);
  $('statusFilter').addEventListener('change', render);
  $('machineTable').addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const index = Number(button.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index >= machines.length) return;
    if (button.dataset.action === 'edit') openModal(index);
    if (button.dataset.action === 'delete') deleteMachine(index);
  });
  $('machineForm').addEventListener('submit', event => {
    event.preventDefault();
    const code = $('code').value.trim();
    if (!code) { $('code').focus(); return; }
    const indexText = $('editIndex').value;
    const currentIndex = indexText === '' ? null : Number(indexText);
    const duplicate = machines.some((m, i) => m.code.toLocaleLowerCase('vi') === code.toLocaleLowerCase('vi') && i !== currentIndex);
    if (duplicate) { toast('Mã máy đã tồn tại. Vui lòng nhập mã khác.'); $('code').focus(); return; }
    const machine = {
      code, room: $('room').value || 'Phòng thực hành 1', position: $('position').value.trim(),
      status: $('status').value, cpu: $('cpu').value.trim() || 'Chưa cập nhật',
      ram: $('ram').value.trim() || '—', disk: $('disk').value.trim() || '—',
      gpu: $('gpu').value.trim() || '—', os: $('os').value.trim() || 'Windows 11 Pro',
      date: $('maintenance').value, note: $('note').value.trim()
    };
    if (currentIndex === null) machines.push(machine);
    else if (Number.isInteger(currentIndex) && machines[currentIndex]) machines[currentIndex] = machine;
    else { toast('Không tìm thấy máy cần cập nhật. Vui lòng tải lại trang.'); return; }
    if (!saveMachines()) {
      if (currentIndex === null) machines.pop();
      else machines[currentIndex] = readMachines()[currentIndex] || machine;
      return;
    }
    fillRooms(machine.room); render(); closeModal(); toast(currentIndex === null ? 'Đã thêm máy tính.' : 'Đã cập nhật máy tính.');
  });
  $('modal').addEventListener('click', event => { if (event.target === $('modal')) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('modal').classList.contains('show')) closeModal(); });
  window.addEventListener('storage', event => {
    if (['lm_current_user','labmanager_current_user','currentUser','loggedInUser'].includes(event.key)) updateAccountDisplay();
    if (event.key === STORAGE_KEY) { machines = readMachines(); fillRooms(); render(); }
  });

  fillRooms();
  render();
  updateAccountDisplay();
})();
