document.addEventListener("DOMContentLoaded", () => {
  const parts = ["header", "footer"];

  // 🧭 Base path belirle (local veya web)
  const base =
    window.location.protocol === "file:"
      ? window.location.href.substring(0, window.location.href.lastIndexOf("/"))
      : "";

  parts.forEach((part) => {
    fetch(`${base}/partials/${part}.html`)
      .then((res) => res.text())
      .then((html) => {
        const container = document.getElementById(`${part}-placeholder`);
        if (!container) return;
        container.innerHTML = html;

        // Header yüklendikten sonra script başlat
        if (part === "header") {
          console.log("✅ Header yüklendi, script başlatılıyor...");
          setTimeout(initHeaderScripts, 300);
        }
      })
      .catch((err) => console.error(`${part} yüklenemedi:`, err));
  });
});

function initHeaderScripts() {
  console.log("🔹 initHeaderScripts çağrıldı");

  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("fullscreenMenu");

  if (!menuBtn || !menu) {
    console.warn("⚠️ Header henüz DOM'a oturmadı, tekrar deneniyor...");
    setTimeout(initHeaderScripts, 300);
    return;
  }

  // 🍔 Menü kontrolü
  let isMenuOpen = false;
  menuBtn.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      menu.classList.remove("hidden");
      setTimeout(() => menu.classList.add("active"), 10);
      menuBtn.innerHTML = "×";
    } else {
      menu.classList.remove("active");
      setTimeout(() => menu.classList.add("hidden"), 600);
      menuBtn.innerHTML = "☰";
    }
  });

  // 🌗 Tema kontrolü
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement;
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("haluk:theme", isDark ? "dark" : "light");
    });
  }

  // 🌐 Dil geçişi
  const flagSwitch = document.getElementById("langSwitch");
  const flagTr = document.getElementById("flagTr");
  const flagEn = document.getElementById("flagEn");
  const slider = document.getElementById("flagSlider");

  if (flagSwitch && flagTr && flagEn && slider) {
    let lang = localStorage.getItem("haluk:lang") || "tr";
    const updateLangUI = () => {
      if (lang === "tr") {
        flagTr.style.opacity = "1";
        flagEn.style.opacity = "0.5";
        slider.style.left = "1px";
      } else {
        flagTr.style.opacity = "0.5";
        flagEn.style.opacity = "1";
        slider.style.left = "calc(100% - 26px)";
      }
    };
    updateLangUI();

    flagSwitch.addEventListener("click", () => {
      lang = lang === "tr" ? "en" : "tr";
      localStorage.setItem("haluk:lang", lang);
      updateLangUI();
      if (typeof loadLang === "function") loadLang();
      else if (typeof applyI18n === "function") applyI18n();
    });
  }

  console.log("✅ Header script başarıyla başlatıldı!");
}

// 🎨 Siteyi Özelleştir - Footer yüklendikten sonra aktif et
function initCustomizerScripts() {
  const popup = document.getElementById("customizerPopup");
  const openBtn = document.getElementById("customizeBtn");
  const closeBtn = document.getElementById("closeCustomizer");
  const previewBtn = document.getElementById("previewBtn");

  if (!openBtn || !popup) {
    console.warn("🎨 Footer henüz yüklenmedi, tekrar denenecek...");
    setTimeout(initCustomizerScripts, 400); // footer yüklenene kadar bekle
    return;
  }

  console.log("✅ Site Özelleştir script aktif!");

  // Açma
  openBtn.addEventListener("click", () => {
    popup.classList.remove("invisible", "opacity-0");
    popup.classList.add("opacity-100");
  });

  // Kapatma
  closeBtn.addEventListener("click", () => {
    popup.classList.add("opacity-0");
    setTimeout(() => popup.classList.add("invisible"), 300);
  });

  // Önizleme
  previewBtn.addEventListener("click", () => {
    const bgColor = document.getElementById("bgColorPicker").value;
    const heroText = document.getElementById("heroTextInput").value;
    const buttonColor = document.getElementById("buttonColorPicker").value;

     // Arka plan rengi (body + footer)
    document.body.style.backgroundColor = bgColor;
    const footer = document.querySelector("footer");
    if (footer) footer.style.backgroundColor = bgColor;

    // Başlık
    const heroTitle = document.querySelector("h1, .hero-title, #heroTitle");
    if (heroTitle) heroTitle.textContent = heroText || heroTitle.textContent;

    // Butonlar
    document.querySelectorAll("button").forEach(btn => {
      if (!btn.id.includes("custom"))
        btn.style.backgroundColor = buttonColor;
    });

     // ✅ Önizleme sonrası popup'ı otomatik kapat
    popup.classList.add("opacity-0");
    setTimeout(() => popup.classList.add("invisible"), 300);
  });
}

// ✅ Özelleştirici popup DOM'a gelince başlat
const customizerReady = setInterval(() => {
  const popup = document.getElementById("customizerPopup");
  if (popup) {
    clearInterval(customizerReady);
    initCustomizerScripts();
  }
}, 300);
// 🔹 Scroll'da header gizle/göster
let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // aşağı kaydır -> gizle
  if (currentScroll > lastScroll && currentScroll > 80) {
    header.style.transform = "translateY(-100%)";
  } 
  // yukarı kaydır -> göster
  else {
    header.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});
