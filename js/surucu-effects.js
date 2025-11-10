// 🌈 1. Arka plan partikülleri
particlesJS("body", {
  "particles": {
    "number": { "value": 35 },
    "color": { "value": ["#6D5DF6", "#14b8a6", "#f97316"] },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.3, "random": true },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": false },
    "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
  },
  "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false } } },
  "retina_detect": true
});

// 📱 2. Telefon parlaması
const phone = document.querySelector("img[src*='phone-frame']");
if (phone) {
  const glow = document.createElement("div");
  glow.className = "absolute inset-0 rounded-[2rem] z-0 pointer-events-none";
  glow.style.background = "radial-gradient(circle at 50% 10%, rgba(255,255,255,0.15), transparent 70%)";
  glow.style.animation = "shineMove 6s ease-in-out infinite alternate";
  phone.parentElement.style.position = "relative";
  phone.parentElement.appendChild(glow);

  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes shineMove {
    0% { opacity: 0.3; transform: translateY(0px); }
    50% { opacity: 0.6; transform: translateY(15px) scale(1.03); }
    100% { opacity: 0.3; transform: translateY(-10px); }
  }`;
  document.head.appendChild(style);
}

// 💬 3. Sayfa başlığı animasyonu
const observer = new MutationObserver(() => {
  const headers = document.querySelectorAll("#app-screen h2, #app-screen h3");
  headers.forEach(h => {
    h.classList.add("animate-title");
  });
});
observer.observe(document.getElementById("app-screen"), { childList: true, subtree: true });

const style = document.createElement("style");
style.innerHTML = `
@keyframes titlePop {
  0% { transform: scale(0.8); opacity: 0; filter: blur(3px); }
  60% { transform: scale(1.1); opacity: 1; filter: blur(0); }
  100% { transform: scale(1); }
}
.animate-title {
  animation: titlePop 0.6s ease-out;
}
`;
document.head.appendChild(style);
