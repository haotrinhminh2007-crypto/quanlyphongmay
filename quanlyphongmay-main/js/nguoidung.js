// ===== Trang Người dùng – LabManager =====

const KHOA_LUU = "labmanager_nguoidung";
const SO_DONG = 6; // số dòng mỗi trang

// Dữ liệu mẫu (chỉ dùng lần đầu, sau đó lưu trong localStorage)
const DU_LIEU_MAU = [
  { ma: "ND001", ten: "Hà Nguyễn",       email: "ha.nguyen@labmanager.vn",   sdt: "0912345678", vaiTro: "Quản trị viên", trangThai: "Hoạt động" },
  { ma: "ND002", ten: "Trần Minh Tuấn",  email: "tuan.tm@school.edu.vn",     sdt: "0987654321", vaiTro: "Giảng viên",    trangThai: "Hoạt động" },
  { ma: "ND003", ten: "Lê Thu Hương",    email: "huong.lt@school.edu.vn",    sdt: "0901234567", vaiTro: "Giảng viên",    trangThai: "Hoạt động" },
  { ma: "ND004", ten: "Phạm Quốc Bảo",   email: "bao.pq@labmanager.vn",      sdt: "0933445566", vaiTro: "Kỹ thuật viên", trangThai: "Hoạt động" },
  { ma: "ND005", ten: "Vũ Hoàng Long",   email: "long.vh@student.edu.vn",    sdt: "0977112233", vaiTro: "Sinh viên",     trangThai: "Hoạt động" },
  { ma: "ND006", ten: "Đỗ Thùy Linh",    email: "linh.dt@student.edu.vn",    sdt: "0966778899", vaiTro: "Sinh viên",     trangThai: "Bị khóa" },
  { ma: "ND007", ten: "Ngô Văn Đức",     email: "duc.nv@school.edu.vn",      sdt: "0944556677", vaiTro: "Giảng viên",    trangThai: "Bị khóa" },
  { ma: "ND008", ten: "Bùi Khánh Vy",    email: "vy.bk@student.edu.vn",      sdt: "0922334455", vaiTro: "Sinh viên",     trangThai: "Hoạt động" }
];

let dsNguoiDung = taiDuLieu();
let trangHienTai = 1;
let maDangSua = null; // null = đang thêm mới

// ----- Lấy phần tử -----
const $ = (id) => document.getElementById(id);
const thanBang = $("thanBang");
const modal = $("modal");
const form = $("form");

// ----- Lưu / tải dữ liệu -----
function taiDuLieu() {
  try {
    const raw = localStorage.getItem(KHOA_LUU);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* bỏ qua, dùng dữ liệu mẫu */ }
  return DU_LIEU_MAU.slice();
}
function luuDuLieu() {
  try { localStorage.setItem(KHOA_LUU, JSON.stringify(dsNguoiDung)); } catch (e) {}
}

// ----- Tiện ích -----
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function chuCaiDau(ten) {
  const t = ten.trim().split(/\s+/);
  const a = t[0][0] || "";
  const b = t.length > 1 ? t[t.length - 1][0] : "";
  return (a + b).toUpperCase();
}
function classVaiTro(v) {
  return { "Quản trị viên": "tag-admin", "Giảng viên": "tag-gv", "Kỹ thuật viên": "tag-kt" }[v] || "tag-sv";
}
function taoMaMoi() {
  const max = dsNguoiDung.reduce((m, u) => Math.max(m, parseInt(u.ma.replace("ND", ""), 10) || 0), 0);
  return "ND" + String(max + 1).padStart(3, "0");
}
function layDanhSachLoc() {
  const tu = $("timKiem").value.trim().toLowerCase();
  const vt = $("locVaiTro").value;
  const tt = $("locTrangThai").value;
  return dsNguoiDung.filter((u) =>
    (!tu || [u.ma, u.ten, u.email, u.sdt].some((x) => x.toLowerCase().includes(tu))) &&
    (!vt || u.vaiTro === vt) &&
    (!tt || u.trangThai === tt)
  );
}

// ----- Thống kê -----
function capNhatThongKe() {
  $("tkTong").textContent = dsNguoiDung.length;
  $("tkHoatDong").textContent = dsNguoiDung.filter((u) => u.trangThai === "Hoạt động").length;
  $("tkGiangVien").textContent = dsNguoiDung.filter((u) => u.vaiTro === "Giảng viên").length;
  $("tkKhoa").textContent = dsNguoiDung.filter((u) => u.trangThai === "Bị khóa").length;
}

// ----- Vẽ bảng -----
function veBang() {
  const ds = layDanhSachLoc();
  const tongTrang = Math.max(1, Math.ceil(ds.length / SO_DONG));
  if (trangHienTai > tongTrang) trangHienTai = tongTrang;

  const batDau = (trangHienTai - 1) * SO_DONG;
  const trang = ds.slice(batDau, batDau + SO_DONG);

  thanBang.innerHTML = trang.map((u) => `
    <tr>
      <td>${escapeHtml(u.ma)}</td>
      <td><div class="u-name"><span class="u-avatar">${escapeHtml(chuCaiDau(u.ten))}</span>${escapeHtml(u.ten)}</div></td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.sdt)}</td>
      <td><span class="tag ${classVaiTro(u.vaiTro)}">${escapeHtml(u.vaiTro)}</span></td>
      <td><span class="tag ${u.trangThai === "Hoạt động" ? "tag-on" : "tag-off"}">${escapeHtml(u.trangThai)}</span></td>
      <td class="center">
        <button class="act" data-act="sua" data-ma="${escapeHtml(u.ma)}" title="Sửa">✏️</button>
        <button class="act" data-act="khoa" data-ma="${escapeHtml(u.ma)}" title="Khóa / Mở khóa">${u.trangThai === "Hoạt động" ? "🔒" : "🔓"}</button>
        <button class="act" data-act="xoa" data-ma="${escapeHtml(u.ma)}" title="Xóa">🗑️</button>
      </td>
    </tr>`).join("");

  $("khongCo").hidden = ds.length > 0;
  $("bangNguoiDung").hidden = ds.length === 0;
  $("thongTinTrang").textContent = ds.length
    ? `Hiển thị ${batDau + 1}–${batDau + trang.length} / ${ds.length} người dùng`
    : "0 người dùng";
  $("truoc").disabled = trangHienTai <= 1;
  $("sau").disabled = trangHienTai >= tongTrang;
}

function lamMoi() {
  capNhatThongKe();
  veBang();
}

// ----- Hộp thoại -----
function xoaLoi() {
  ["Ten", "Email", "Sdt"].forEach((k) => {
    $("e" + k).textContent = "";
    $("f" + k).classList.remove("invalid");
  });
}
function moModal(user) {
  xoaLoi();
  maDangSua = user ? user.ma : null;
  $("tieuDeModal").textContent = user ? "Sửa người dùng" : "Thêm người dùng";
  $("fTen").value = user ? user.ten : "";
  $("fEmail").value = user ? user.email : "";
  $("fSdt").value = user ? user.sdt : "";
  $("fVaiTro").value = user ? user.vaiTro : "Sinh viên";
  $("fTrangThai").value = user ? user.trangThai : "Hoạt động";
  modal.hidden = false;
  $("fTen").focus();
}
function dongModal() {
  modal.hidden = true;
  maDangSua = null;
}

function baoLoi(k, msg) {
  $("e" + k).textContent = msg;
  $("f" + k).classList.add("invalid");
  return false;
}
function kiemTra() {
  xoaLoi();
  let ok = true;
  const ten = $("fTen").value.trim();
  const email = $("fEmail").value.trim();
  const sdt = $("fSdt").value.trim();

  if (ten.length < 2) ok = baoLoi("Ten", "Vui lòng nhập họ tên (ít nhất 2 ký tự).");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    ok = baoLoi("Email", "Email không hợp lệ.");
  } else if (dsNguoiDung.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.ma !== maDangSua)) {
    ok = baoLoi("Email", "Email này đã được sử dụng.");
  }

  if (!/^0\d{9}$/.test(sdt)) ok = baoLoi("Sdt", "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.");

  return ok;
}

// ----- Sự kiện -----
$("btnThem").addEventListener("click", () => moModal(null));
$("btnHuy").addEventListener("click", dongModal);
modal.addEventListener("click", (e) => { if (e.target === modal) dongModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) dongModal(); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!kiemTra()) return;

  const du_lieu = {
    ten: $("fTen").value.trim(),
    email: $("fEmail").value.trim(),
    sdt: $("fSdt").value.trim(),
    vaiTro: $("fVaiTro").value,
    trangThai: $("fTrangThai").value
  };

  if (maDangSua) {
    const u = dsNguoiDung.find((x) => x.ma === maDangSua);
    Object.assign(u, du_lieu);
  } else {
    dsNguoiDung.push({ ma: taoMaMoi(), ...du_lieu });
    trangHienTai = Math.ceil(layDanhSachLoc().length / SO_DONG);
  }
  luuDuLieu();
  dongModal();
  lamMoi();
});

// Nút trong bảng (dùng event delegation)
thanBang.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const u = dsNguoiDung.find((x) => x.ma === btn.dataset.ma);
  if (!u) return;

  if (btn.dataset.act === "sua") {
    moModal(u);
  } else if (btn.dataset.act === "khoa") {
    u.trangThai = u.trangThai === "Hoạt động" ? "Bị khóa" : "Hoạt động";
    luuDuLieu();
    lamMoi();
  } else if (btn.dataset.act === "xoa") {
    if (confirm(`Xóa người dùng "${u.ten}"?`)) {
      dsNguoiDung = dsNguoiDung.filter((x) => x.ma !== u.ma);
      luuDuLieu();
      lamMoi();
    }
  }
});

// Tìm kiếm + lọc
["timKiem", "locVaiTro", "locTrangThai"].forEach((id) => {
  $(id).addEventListener("input", () => { trangHienTai = 1; veBang(); });
});

// Phân trang
$("truoc").addEventListener("click", () => { trangHienTai--; veBang(); });
$("sau").addEventListener("click", () => { trangHienTai++; veBang(); });

// Ngày hôm nay
(function hienNgay() {
  const thu = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  $("homNay").textContent = `${thu[d.getDay()]}, ${dd}/${mm}/${d.getFullYear()}`;
})();

lamMoi();
