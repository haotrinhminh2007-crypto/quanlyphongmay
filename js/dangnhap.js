

const STORAGE_KEY = "phongMayDemoUsers";
const SESSION_KEY = "phongMayDemoSession";


const DASHBOARD_URL = "tongquan.html";

function getUsers() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("hidden", view.id !== viewId);
  });
  clearStatus();
  clearErrors();
}

function showStatus(message, type = "error") {
  const status = document.getElementById("statusMessage");
  status.textContent = message;
  status.className = `status-message show ${type}`;
}

function clearStatus() {
  const status = document.getElementById("statusMessage");
  status.textContent = "";
  status.className = "status-message";
}

function setError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}Error`);
  if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  if (error) error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((element) => {
    element.textContent = "";
  });
  document.querySelectorAll("input").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.querySelectorAll("[data-view]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView(link.dataset.view);
  });
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  clearStatus();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  let valid = true;

  if (!email || !validEmail(email)) {
    setError("loginEmail", "Vui lòng nhập email hợp lệ.");
    valid = false;
  }
  if (!password) {
    setError("loginPassword", "Vui lòng nhập mật khẩu.");
    valid = false;
  }
  if (!valid) return;

  const user = getUsers().find((item) => item.email === email && item.password === password);
  if (!user) {
    showStatus("Email hoặc mật khẩu không đúng. Nếu chưa có tài khoản, hãy đăng ký trước.");
    return;
  }


  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email: user.email,
    name: user.name,
    loggedInAt: new Date().toISOString()
  }));

  showStatus("Đăng nhập thành công. Đang chuyển đến trang tổng quan…", "success");
  window.setTimeout(() => {
    window.location.href = DASHBOARD_URL;
  }, 600);
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  clearStatus();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  let valid = true;

  if (!name) {
    setError("registerName", "Vui lòng nhập họ và tên.");
    valid = false;
  }
  if (!validEmail(email)) {
    setError("registerEmail", "Vui lòng nhập email hợp lệ.");
    valid = false;
  }
  if (password.length < 6) {
    setError("registerPassword", "Mật khẩu phải có ít nhất 6 ký tự.");
    valid = false;
  }
  if (password !== confirmPassword) {
    setError("confirmPassword", "Mật khẩu xác nhận không khớp.");
    valid = false;
  }
  if (!valid) return;

  const users = getUsers();
  if (users.some((item) => item.email === email)) {
    setError("registerEmail", "Email này đã được đăng ký.");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  document.getElementById("loginEmail").value = email;
  document.getElementById("loginPassword").value = "";
  showView("view-login");
  showStatus("Đăng ký thành công. Hãy đăng nhập bằng tài khoản vừa tạo.", "success");
});

document.getElementById("forgotForm").addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  clearStatus();

  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  if (!validEmail(email)) {
    setError("forgotEmail", "Vui lòng nhập email hợp lệ.");
    return;
  }

  const userExists = getUsers().some((item) => item.email === email);
  if (userExists) {
    showStatus("Tài khoản có tồn tại. Chức năng gửi liên kết đặt lại mật khẩu cần được kết nối với máy chủ.", "success");
  } else {
    showStatus("Không tìm thấy tài khoản có email này.");
  }
});
