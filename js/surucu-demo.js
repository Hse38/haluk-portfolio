// === SÜRÜCÜ KURSU UYGULAMASI (v2 - Navigasyonlu) ===
const app = document.getElementById("app-screen");

const screens = {
  ders: `
    <div class="p-4 animate-fadein">
      <h2 class="text-xl font-semibold text-orange-400 mb-3">🕐 Ders Saati Seçimi</h2>
      <p class="text-gray-300 mb-4">Müsait saatleri görüntüleyin ve uygun zamanı seçin:</p>
      <div class="grid grid-cols-3 gap-3">
        ${["09:00", "11:00", "14:00"].map(t => 
          `<button class="bg-orange-500/20 border border-orange-500/30 hover:bg-orange-500/40 text-white rounded-lg py-2 transition" onclick="goTo('egitmen')">${t}</button>`
        ).join("")}
      </div>
    </div>
  `,
  egitmen: `
    <div class="p-4 animate-fadein">
      <h2 class="text-xl font-semibold text-sky-400 mb-3">👩‍🏫 Eğitmen Seçimi</h2>
      <p class="text-gray-300 mb-4">Tercih ettiğiniz eğitmeni seçin:</p>
      <div class="grid gap-3">
        ${["Elif Hoca", "Mert Hoca", "Ahmet Bey"].map(n => 
          `<button class="bg-sky-500/20 border border-sky-500/30 hover:bg-sky-500/40 text-white rounded-lg py-2 transition" onclick="goTo('harita')">${n}</button>`
        ).join("")}
      </div>
    </div>
  `,
  harita: `
    <div class="p-4 animate-fadein">
      <h2 class="text-xl font-semibold text-green-400 mb-3">📍 Sınav Haritası</h2>
      <p class="text-gray-300 mb-4">Simülasyon başlatılıyor...</p>
      <div class="relative w-full h-48 bg-green-500/10 border border-green-400/20 rounded-lg overflow-hidden">
        <div class="absolute w-6 h-6 bg-green-400 rounded-full top-2 left-2 animate-ping"></div>
        <div class="absolute w-4 h-4 bg-green-400 rounded-full top-2 left-2"></div>
      </div>
      <button class="mt-6 bg-green-500/20 border border-green-500/40 hover:bg-green-500/40 text-white rounded-lg py-2 w-full transition" onclick="goTo('sorular')">Devam Et</button>
    </div>
  `,
  sorular: `
    <div class="p-4 animate-fadein">
      <h2 class="text-xl font-semibold text-purple-400 mb-3">📘 Çıkmış Sorular</h2>
      <p class="text-gray-300 mb-4">Mini test: 2 soru</p>
      <div class="space-y-4">
        <div>
          <p>1️⃣ Trafikte öncelik hakkı kime aittir?</p>
          <button class="block mt-1 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/40 text-white rounded-lg py-2 w-full transition" onclick="finishDemo()">Yayaya</button>
        </div>
        <div>
          <p>2️⃣ Sinyal vermeden şerit değiştirmenin cezası var mı?</p>
          <button class="block mt-1 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/40 text-white rounded-lg py-2 w-full transition" onclick="finishDemo()">Evet</button>
        </div>
      </div>
    </div>
  `,
  bitis: `
    <div class="p-6 animate-fadein flex flex-col items-center justify-center text-center">
      <h2 class="text-2xl font-bold text-brand mb-3">🎉 Tebrikler!</h2>
      <p class="text-gray-300">Tüm aşamaları tamamladınız. Uygulama kullanımını başarıyla simüle ettiniz.</p>
      <button class="mt-6 bg-brand/30 hover:bg-brand/50 text-white rounded-lg py-2 px-6 transition" onclick="goTo('ders')">↩️ Baştan Başla</button>
    </div>
  `
};

// --- Navigasyon bar ---
function renderNav(active) {
  return `
  <div class="flex justify-around items-center bg-white/5 border-b border-white/10 py-2 text-sm font-medium">
    <button onclick="goTo('ders')" class="px-2 ${active==='ders'?'text-orange-400':'text-gray-400'}">📱 Ders</button>
    <button onclick="goTo('egitmen')" class="px-2 ${active==='egitmen'?'text-sky-400':'text-gray-400'}">👨‍🏫 Eğitmen</button>
    <button onclick="goTo('harita')" class="px-2 ${active==='harita'?'text-green-400':'text-gray-400'}">🧭 Harita</button>
    <button onclick="goTo('sorular')" class="px-2 ${active==='sorular'?'text-purple-400':'text-gray-400'}">🧩 Test</button>
  </div>
  `;
}

function goTo(screen) {
  const nav = renderNav(screen);
  const content = screens[screen] || "";
  app.innerHTML = nav + content;
}

function finishDemo() {
  goTo('bitis');
}

// Başlangıç
goTo('ders');

// --- Animasyon CSS ---
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadein {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadein {
  animation: fadein 0.4s ease-out;
}
`;
document.head.appendChild(style);
