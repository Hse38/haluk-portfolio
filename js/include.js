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
