document.addEventListener('DOMContentLoaded', () => {

  // 1. CẤU HÌNH DỮ LIỆU GÓI CHỤP (Sửa giá và nội dung tại đây)
  const PACKAGES_DATA = {
    kyyeu: [
      {
        name: "Gói Cơ Bản (Nửa Ngày)",
        detail: "2 Thợ chụp<br>Gồm 2 Trang phục: Áo Dài, Vest, Cử Nhân",
        price: "280k/Học sinh"
      },
      {
        name: "Gói Nâng Cao (Sáng + Chiều)",
        detail: "3 Thợ chụp<br>Gồm 3 Trang phục<br>Có Photobooth (+60k/hs)",
        price: "450k/Học sinh"
      },
      {
        name: "Gói VIP (Full ngày )",
        detail: "3 Thợ Chụp <br>Trang Phục: Cử Nhân, Áo Dài, Vest, Thanh Xuân<br>Trả toàn bộ File chỉnh sửa<br>Tặng Giấy, Chong Chóng, Pháo BQP<br> Mỗi Bạn 1 ảnh tập thể 15.21<br> GVCN 1 ảnh để bàn mika 25.38",
        price: "550k/Học sinh"
      }
    ],
    concept: [
      {
        name: "Concept Indoor",
        detail: "Chụp tại Studio<br>Hỗ trợ Makeup & Làm tóc<br>10 ảnh chỉnh sửa kỹ",
        price: "1.500k"
      },
      {
        name: "Concept Outdoor (Ngoại cảnh)",
        detail: "Chụp ngoại cảnh (biển, rừng...)<br>Makeup đi theo<br>20 ảnh chỉnh sửa kỹ",
        price: "2.500k"
      }
    ],
    wedding: [
      {
        name: "Phóng Sự Lễ Ăn Hỏi",
        detail: "1 Máy chụp truyền thống<br>1 Máy phóng sự<br>Trả toàn bộ file gốc",
        price: "3.500k"
      },
      {
        name: "Phóng Sự Ngày Cưới (VIP)",
        detail: "2 Máy chụp + 1 Máy quay<br>Photobook cao cấp<br>Trả file ngay trong ngày",
        price: "5.500k"
      }
    ],
    beauty: [
      {
        name: "Chụp Gia Đình (Studio)",
        detail: "Phông nền trơn hiện đại<br>Miễn phí thuê váy cưới/vest<br>Tặng ảnh phóng lớn",
        price: "2.000k"
      }
    ]
  };

  // Các biến toàn cục
  let currentService = null;
  let currentPackageName = null;
  let selectedDates = [];

  // --- MENU MOBILE TOGGLE ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if(menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // --- KHỞI TẠO LỊCH ---
  flatpickr.localize(flatpickr.l10ns.vn);
  const calendar = flatpickr("#calendar", {
    inline: true,
    mode: "multiple",
    dateFormat: "d/m/Y",
    minDate: "today",
    onChange: function(dates, dateStr) {
      selectedDates = dates.map(d => calendar.formatDate(d, "d/m/Y"));
      updateBookButton();
    }
  });

  // --- XỬ LÝ CLICK CHỌN DỊCH VỤ ---
  const serviceCards = document.querySelectorAll('.service-card');
  const packageSection = document.getElementById('package-section');
  const packageListDiv = document.getElementById('package-list');
  const serviceTitle = document.getElementById('selected-service-title');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      // 1. Highlight card được chọn
      serviceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // 2. Lấy dữ liệu gói tương ứng
      const serviceType = card.dataset.service; // kyyeu, concept, wedding...
      currentService = card.querySelector('h3').textContent; // Lấy tên hiển thị
      
      const data = PACKAGES_DATA[serviceType];

      // 3. Render (Vẽ) danh sách gói ra màn hình
      if (data) {
        packageSection.style.display = "block"; // Hiện khu vực chi tiết
        serviceTitle.textContent = `Các gói ${currentService}`;
        packageListDiv.innerHTML = ""; // Xóa nội dung cũ

        data.forEach(pkg => {
          const div = document.createElement('div');
          div.className = 'package-item';
          div.innerHTML = `
            <div class="pkg-name">${pkg.name}</div>
            <div class="pkg-detail">${pkg.detail}</div>
            <div class="pkg-price">${pkg.price}</div>
          `;
          
          // Bắt sự kiện chọn gói con
          div.addEventListener('click', () => {
            document.querySelectorAll('.package-item').forEach(p => p.classList.remove('selected'));
            div.classList.add('selected');
            currentPackageName = pkg.name;
            updateBookButton();
          });

          packageListDiv.appendChild(div);
        });

        // Scroll xuống để người dùng thấy
        packageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Reset các lựa chọn cũ
      currentPackageName = null;
      selectedDates = [];
      calendar.clear();
      updateBookButton();
    });
  });

  // --- CẬP NHẬT NÚT ĐẶT LỊCH ---
  const bookBtn = document.getElementById('bookBtn');
  
  function updateBookButton() {
    if (currentPackageName && selectedDates.length > 0) {
      bookBtn.disabled = false;
      bookBtn.textContent = `Đặt Lịch: ${currentPackageName} - ${selectedDates.length} ngày`;
    } else {
      bookBtn.disabled = true;
      bookBtn.textContent = "Vui lòng chọn Gói & Ngày chụp";
    }
  }

  // --- XỬ LÝ CLICK NÚT ĐẶT ---
  bookBtn.addEventListener('click', () => {
    const channel = document.querySelector('input[name="channel"]:checked').value;
    const FB_PAGE = "Iuqanh"; 
    const ZALO_PHONE = "0383070200";

    const message = `Xin chào Tiệm Ảnh Flop! 👋\n\nMình muốn đặt lịch:\n📸 Dịch vụ: ${currentService}\n📦 Gói: ${currentPackageName}\n🗓 Ngày: ${selectedDates.join(", ")}\n\nTư vấn giúp mình nhé!`;
    
    // Copy nội dung vào clipboard
    navigator.clipboard.writeText(message).then(() => {
        alert("Đã sao chép nội dung đặt lịch! Bạn hãy dán vào ô chat nhé.");
        
        if (channel === 'messenger') {
            window.open(`https://m.me/${FB_PAGE}`, '_blank');
        } else {
            window.open(`https://zalo.me/${ZALO_PHONE}`, '_blank');
        }
    });
  });

});
