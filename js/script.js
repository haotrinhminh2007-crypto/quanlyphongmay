// Hàm chuyển đổi giữa các màn hình
function switchView(targetViewId) {
  // Lấy tất cả các thẻ có class 'view'
  const views = document.querySelectorAll('.view');
  
  // Ẩn tất cả đi
  views.forEach(view => {
    view.classList.add('hidden');
    view.classList.remove('active');
  });
  
  // Hiện màn hình được chọn
  const targetView = document.getElementById(targetViewId);
  if (targetView) {
    targetView.classList.remove('hidden');
    targetView.classList.add('active');
  }
}

// Xử lý sự kiện chặn submit cho các form (để không reload trang)
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      const originalText = btn.textContent;
      
      btn.textContent = 'Processing...';
      btn.disabled = true;

      // Giả lập độ trễ xử lý API
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Thao tác thành công (Demo)');
      }, 1000);
    });
  });
});