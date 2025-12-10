/* =====================================================
   FLOP' STUDIO - MAIN SCRIPT (CONSOLIDATED)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. GLOBAL: XỬ LÝ MENU MOBILE & ACTIVE LINK
  // ============================================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Xử lý nút 3 gạch
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active'); // Thêm hiệu ứng xoay nếu có CSS
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });

    // Đóng menu khi click vào link bên trong
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // Active Link: Tô màu menu dựa trên URL hiện tại
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  // ============================================================
  // 2. TRANG GÓI CHỤP (gia.html): LOGIC ĐẶT LỊCH
  // ============================================================
  const serviceList = document.getElementById('serviceList'); // Kiểm tra xem có đang ở trang gói chụp không

  if (serviceList) {
    // --- CẤU HÌNH DỮ LIỆU ---
    const FB_PAGE_ID = "Iuqanh"; // Thay bằng ID Fanpage của bạn
    const ZALO_PHONE = "0383070200"; // Số điện thoại Zalo

    // Dữ liệu gói chụp (Bạn sửa giá và tên gói ở đây)
    const servicePackages = {
      beauty: [
        { name: "Gói Cơ bản", price: "2.000.000đ", detail: "Chụp Studio, 1 trang phục, 10 ảnh chỉnh sửa" },
        { name: "Gói Nâng cao", price: "3.000.000đ", detail: "Chụp Studio, 2 trang phục, Makeup, 20 ảnh chỉnh sửa" }
      ],
      wedding: [
        { name: "Gói Tiêu chuẩn", price: "5.000.000đ", detail: "Phóng sự cưới 1 máy, trả toàn bộ file gốc" },
        { name: "Gói VIP", price: "8.000.000đ", detail: "Phóng sự 2 máy + Quay phim highlight, Photobook" }
      ],
      yearbook: [
        { name: "Gói Lớp Nhỏ", price: "4.000.000đ", detail: "Dưới 30 học sinh, 2 thợ chụp, Free flycam" },
        { name: "Gói Lớp Lớn", price: "6.000.000đ", detail: "Trên 30 học sinh, 3 thợ chụp, Free flycam + bột màu" },
        { name: "Gói Nâng cao", price: "7.500.000đ", detail: "Full concept, Quay MV kỷ yếu, Photobook" }
      ],
      concept: [
        { name: "Gói Đơn", price: "2.500.000đ", detail: "Chụp cá nhân, ngoại cảnh hoặc studio, makeup" },
        { name: "Gói Đôi", price: "3.500.000đ", detail: "Chụp Couple/Bạn thân, 2 concept, makeup" }
      ]
    };

    // --- BIẾN TRẠNG THÁI ---
    let selectedService = null;
    let selectedPackage = null;
    let selectedDates = [];

    // --- DOM ELEMENTS ---
    const serviceCards = document.querySelectorAll('.service-card');
    const packageSection = document.getElementById('package-section');
    const packageListDiv = document.getElementById('package-list');
    const serviceTitle = document.getElementById('selected-service-title');
    const bookBtn = document.getElementById('bookBtn');
    
    // --- KHỞI TẠO LỊCH (FLATPICKR) ---
    // Kiểm tra nếu thư viện đã load
    if (typeof flatpickr !== 'undefined') {
      flatpickr.localize(flatpickr.l10ns.vn); // Ngôn ngữ tiếng Việt
      
      var calendar = flatpickr("#calendar", {
        inline: true,
        mode: "multiple",
        dateFormat: "d/m/Y",
        minDate: "today",
        onChange: function(dates, dateStr) {
          selectedDates = dates.map(d => calendar.formatDate(d, "d/m/Y"));
          updateBookButton();
        }
      });
    }

    // --- XỬ LÝ KHI CHỌN DỊCH VỤ ---
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        // 1. Highlight thẻ dịch vụ
        serviceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // 2. Lấy dữ liệu
        const serviceType = card.dataset.service; // beauty, wedding...
        const serviceName = card.querySelector('h3').textContent;
        currentService = serviceName;
        
        const data = servicePackages[serviceType];

        // 3. Hiển thị danh sách gói
        if (data) {
          packageSection.style.display = "block"; // Hiện khu vực bên dưới
          serviceTitle.textContent = `Các gói: ${serviceName}`;
          packageListDiv.innerHTML = ""; // Xóa gói cũ

          data.forEach(pkg => {
            const div = document.createElement('div');
            div.className = 'package-item';
            div.innerHTML = `
              <div class="pkg-name">${pkg.name}</div>
              <div class="pkg-detail">${pkg.detail || ''}</div>
              <div class="pkg-price">${pkg.price}</div>
            `;
            
            // Sự kiện chọn gói con
            div.addEventListener('click', () => {
              document.querySelectorAll('.package-item').forEach(p => p.classList.remove('selected'));
              div.classList.add('selected');
              selectedPackage = pkg.name;
              updateBookButton();
            });
            
            packageListDiv.appendChild(div);
          });

          // Cuộn xuống nhẹ nhàng để khách thấy
          packageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Reset trạng thái
        selectedPackage = null;
        selectedDates = [];
        if(calendar) calendar.clear();
        updateBookButton();
      });
    });

    // --- CẬP NHẬT NÚT ĐẶT LỊCH ---
    function updateBookButton() {
      if (selectedPackage && selectedDates.length > 0) {
        bookBtn.disabled = false;
        bookBtn.innerHTML = `ĐẶT NGAY: ${selectedPackage}`;
        bookBtn.style.opacity = "1";
        bookBtn.style.cursor = "pointer";
      } else {
        bookBtn.disabled = true;
        bookBtn.textContent = "Vui lòng chọn Gói & Ngày chụp";
        bookBtn.style.opacity = "0.6";
        bookBtn.style.cursor = "not-allowed";
      }
    }

    // --- XỬ LÝ CLICK NÚT ĐẶT ---
    bookBtn.addEventListener('click', () => {
      const channelRadio = document.querySelector('input[name="channel"]:checked');
      const channel = channelRadio ? channelRadio.value : 'zalo';
      
      const message = `Xin chào FLOP' Studio! 👋\n\nMình muốn đặt lịch chụp:\n📸 Dịch vụ: ${currentService}\n📦 Gói: ${selectedPackage}\n🗓️ Ngày chọn: ${selectedDates.join(", ")}\n\nTư vấn giúp mình nhé!`;
      
      // Copy nội dung vào clipboard
      navigator.clipboard.writeText(message).then(() => {
          alert("Đã sao chép nội dung đặt lịch! Bạn hãy 'Dán' vào ô chat nhé.");
      }).catch(err => {
          console.error('Không thể copy text', err);
      });

      // Mở ứng dụng chat
      setTimeout(() => {
        if (channel === 'messenger') {
            // Link messenger (Web & Mobile)
            window.open(`https://m.me/${FB_PAGE_ID}`, '_blank');
        } else {
            // Link Zalo
            window.open(`https://zalo.me/${ZALO_PHONE}`, '_blank');
        }
      }, 500);
    });
  }


  // ============================================================
  // 3. TRANG LIÊN HỆ (contact.html): FORM & GMAIL
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    // Xử lý submit form (Gửi qua PHP nếu có setup, hoặc alert demo)
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Lấy dữ liệu
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const submitBtn = contactForm.querySelector('button[type=submit]');

      // Hiệu ứng đang gửi
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang xử lý...';

      // --- CÁCH 1: Gửi qua file PHP (send_email.php) ---
      // Nếu bạn đã cấu hình file PHP, hãy bỏ comment đoạn dưới đây:
      /*
      try {
        const formData = new FormData(contactForm);
        const res = await fetch('send_email.php', { method: 'POST', body: formData });
        const json = await res.json();
        if (json.success) {
           alert('✅ Gửi thành công! Chúng tôi sẽ liên hệ lại sớm.');
           contactForm.reset();
        } else {
           alert('❌ Có lỗi xảy ra: ' + json.message);
        }
      } catch (err) {
        alert('⚠️ Lỗi kết nối server.');
      }
      */

      // --- CÁCH 2: Mở trình soạn thảo mail (Client-side) ---
      // Đây là cách đơn giản nhất không cần server PHP
      const recipient = "nguyenduykhanh200339@gmail.com";
      const subject = encodeURIComponent(`Liên hệ từ: ${name}`);
      const body = encodeURIComponent(`Tên: ${name}\nEmail: ${email}\n\nNội dung:\n${message}`);
      
      // Ưu tiên mở Gmail web
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
      
      // Fallback sang mailto
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        if (confirm("Bạn có muốn mở Gmail để gửi nội dung này không?")) {
             window.open(gmailUrl, "_blank");
        } else {
             window.location.href = mailtoUrl;
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi qua Gmail ✉️';
      }, 500);
    });
  }

});