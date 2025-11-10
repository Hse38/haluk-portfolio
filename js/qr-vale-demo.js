// ==================== GLOBAL STORE ====================
const State = {
  calls: [],
  completed: [],
  listeners: [],
  soundOn: true,
  emit(event, data) { this.listeners.forEach(fn => fn(event, data)); },
  on(fn) { this.listeners.push(fn); }
};

// ==================== CONTAINER ====================
const container = document.getElementById("qrvale-demo");
container.innerHTML = `
<div id="toastArea" class="fixed top-6 right-6 space-y-2 z-50"></div>

<div class="flex justify-between items-center mb-6 animate-fadein">
  <h2 class="text-2xl font-bold text-white">🎮 QR-Vale Demo Kontrol Paneli</h2>
  <div class="flex items-center gap-3">
    <label class="text-sm text-gray-300 flex items-center gap-2">
      <input type="checkbox" id="soundToggle" checked class="accent-orange-500">
      Ses Açık
    </label>
    <button id="resetDemo" class="px-4 py-2 bg-red-600 rounded-lg hover:scale-105 transition text-white text-sm">
      🔄 Reset Demo
    </button>
  </div>
</div>

<div class="grid md:grid-cols-3 gap-6">
  <!-- 📱 MÜŞTERİ PANELİ -->
  <div id="panel-customer" class="panel hidden bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition translate-y-8 opacity-0">
    <div>
      <h2 class="text-xl font-semibold mb-4">📱 Müşteri Paneli</h2>
      <p class="text-gray-400 mb-4 text-sm">QR kod okut, aracını çağır ve dilersen bahşiş bırak.</p>
      <div id="cust-status" class="text-gray-300 mb-6">Hazır bekliyor...</div>
    </div>
    <div class="space-y-3">
      ${[3,5,10].map(m=>`
        <button onclick="createCall(${m})" class="w-full bg-orange-500 text-black py-2 rounded-lg font-medium hover:scale-105 transition">🚗 ${m} dk içinde aracımı hazırla</button>
      `).join('')}
      <button id="tip-btn" onclick="giveTip()" class="hidden w-full bg-green-500 text-black py-2 rounded-lg hover:scale-105 transition">💰 Bahşiş Bırak</button>
    </div>
  </div>

  <!-- 🧢 VALE PANELİ -->
  <div id="panel-vale" class="panel hidden bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 shadow-lg flex flex-col translate-y-8 opacity-0 transition">
    <h2 class="text-xl font-semibold mb-4">🧢 Vale Paneli</h2>
    <table class="w-full text-sm text-gray-300">
      <thead>
        <tr class="text-gray-400 border-b border-gray-700">
          <th class="py-2 text-left">#</th>
          <th class="py-2 text-left">Kalan Süre</th>
          <th class="py-2 text-left">İşlem</th>
        </tr>
      </thead>
      <tbody id="vale-list"></tbody>
    </table>
  </div>

  <!-- 📊 YÖNETİCİ PANELİ -->
  <div id="panel-admin" class="panel hidden bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 shadow-lg flex flex-col justify-between translate-y-8 opacity-0 transition">
    <div>
      <h2 class="text-xl font-semibold mb-2">📊 Yönetici Paneli</h2>
      <p class="text-gray-400 text-sm mb-4">Anlık istatistikler</p>
      <div class="flex justify-between text-sm text-gray-300 mb-2">
        <span>Toplam Çağrı:</span><span id="totalCalls">0</span>
      </div>
      <div class="flex justify-between text-sm text-gray-300 mb-2">
        <span>Tamamlanan:</span><span id="completedCalls">0</span>
      </div>
      <div class="flex justify-between text-sm text-gray-300 mb-6">
        <span>Ortalama Teslim Süresi:</span><span id="avgTime">0 dk</span>
      </div>
    </div>
    <canvas id="chart"></canvas>
  </div>
</div>
`;

// ==================== AUDIO FEEDBACK ====================
const sfx = {
  call: new Audio("assets/sounds/call.mp3"),
  accept: new Audio("assets/sounds/accept.mp3"),
  chart: new Audio("assets/sounds/chart.mp3")
};
function playSound(key){ if(State.soundOn && sfx[key]) sfx[key].play(); }

// ==================== TOAST SYSTEM ====================
function toast(msg, type="info"){
  const area = document.getElementById("toastArea");
  const div = document.createElement("div");
  const colors = { info:"bg-blue-500", success:"bg-green-500", warn:"bg-yellow-500", error:"bg-red-600" };
  div.className = `text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-slidein ${colors[type]}`;
  div.textContent = msg;
  area.appendChild(div);
  setTimeout(()=>{ div.classList.add("animate-slideout"); },2300);
  setTimeout(()=>div.remove(),3000);
}

// ==================== CUSTOMER PANEL ====================
const statusEl = document.getElementById("cust-status");
const tipBtn = document.getElementById("tip-btn");

function createCall(time) {
  const id = Date.now();
  const call = { id, time, remaining: time*60, status: "Beklemede" };
  State.calls.push(call);
  State.emit("newCall", call);
  playSound("call");
  toast(`🚘 Yeni çağrı oluşturuldu (${time} dk)`, "info");
  statusEl.textContent = `🚗 Aracınız hazırlanıyor (${time} dk)...`;
  tipBtn.classList.add("hidden");
}

// ==================== VALE PANEL ====================
const valeList = document.getElementById("vale-list");

function renderVale() {
  valeList.innerHTML = "";
  State.calls.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.className = "transition transform hover:scale-[1.01]";
    const mins = Math.floor(c.remaining / 60);
    const secs = (c.remaining % 60).toString().padStart(2,"0");
    tr.innerHTML = `
      <td class="py-2">${i+1}</td>
      <td class="py-2">${mins}:${secs}</td>
      <td class="py-2 space-x-2">
        <button onclick="accept(${c.id})" class="px-2 py-1 bg-green-600 text-black rounded hover:scale-105">Kabul Et</button>
        <button onclick="delay(${c.id})" class="px-2 py-1 bg-yellow-400 text-black rounded hover:scale-105">Ertele +3dk</button>
      </td>`;
    valeList.appendChild(tr);
  });
}

function accept(id) {
  const c = State.calls.find(x=>x.id===id);
  if(!c) return;
  State.calls = State.calls.filter(x=>x.id!==id);
  State.completed.push(c);
  playSound("accept");
  toast("✅ Vale çağrıyı kabul etti.", "success");
  State.emit("accepted", c);
  renderVale();
  renderChart();
  updateStats();
  statusEl.textContent = "✅ Aracınız hazırlandı!";
  tipBtn.classList.remove("hidden");
}

function delay(id) {
  const c = State.calls.find(x=>x.id===id);
  if(!c) return;
  c.time += 3;
  c.remaining += 180;
  toast(`⚠️ Çağrı ertelendi (+3 dk)`, "warn");
  State.emit("delayed", c);
  renderVale();
  statusEl.textContent = `⚠️ Yoğunluk nedeniyle ${c.time} dk içinde aracınız hazır olacak.`;
}

// Canlı sayaç
setInterval(()=>{
  State.calls.forEach(c=>{ if(c.remaining>0) c.remaining--; });
  renderVale();
},1000);

// ==================== ADMIN PANEL ====================
const ctx = document.getElementById("chart");
const chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Tamamlanan", "Bekleyen"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#22c55e", "#f59e0b"],
      borderWidth: 0
    }]
  },
  options: { plugins: { legend: { position: "bottom", labels: { color: "#ccc" } } } }
});

const totalCallsEl = document.getElementById("totalCalls");
const completedEl = document.getElementById("completedCalls");
const avgTimeEl = document.getElementById("avgTime");

function renderChart() {
  chart.data.datasets[0].data = [State.completed.length, State.calls.length];
  chart.update();
  playSound("chart");
}

function updateStats() {
  totalCallsEl.textContent = State.calls.length + State.completed.length;
  completedEl.textContent = State.completed.length;
  const avg = State.completed.length
    ? Math.round(State.completed.reduce((a,b)=>a+b.time,0)/State.completed.length)
    : 0;
  avgTimeEl.textContent = `${avg} dk`;
}

// ==================== BAHŞİŞ ====================
function giveTip() {
  toast("💸 Bahşişiniz için teşekkürler!", "success");
  tipBtn.classList.add("hidden");
}

// ==================== EVENTS ====================
State.on((event, data) => {
  if(event==="newCall"){ renderVale(); renderChart(); updateStats(); }
  if(event==="accepted" || event==="delayed"){ renderChart(); updateStats(); }
});

// ==================== AYARLAR ====================
document.getElementById("soundToggle").addEventListener("change",(e)=>{
  State.soundOn = e.target.checked;
  toast(State.soundOn ? "🔊 Ses Açık" : "🔇 Ses Kapalı", "info");
});

document.getElementById("resetDemo").addEventListener("click",()=>{
  if(!confirm("Tüm demo sıfırlansın mı?")) return;
  State.calls = []; State.completed = [];
  renderVale(); renderChart(); updateStats();
  statusEl.textContent = "Hazır bekliyor...";
  tipBtn.classList.add("hidden");
  toast("🔄 Demo sıfırlandı", "info");
});

// ==================== PANEL ANİMASYONU ====================
setTimeout(()=>{
  document.querySelectorAll(".panel").forEach((p,i)=>{
    setTimeout(()=>{
      p.classList.remove("hidden");
      p.classList.add("opacity-100","translate-y-0");
    }, i*200);
  });
},400);

// ==================== TAILWIND EK ANİMASYONLAR ====================
const style = document.createElement("style");
style.innerHTML = `
@keyframes slidein { from {opacity:0; transform:translateY(-10px);} to {opacity:1; transform:translateY(0);} }
@keyframes slideout { from {opacity:1;} to {opacity:0; transform:translateY(-10px);} }
.animate-slidein { animation: slidein 0.3s ease-out; }
.animate-slideout { animation: slideout 0.3s ease-in forwards; }
`;
document.head.appendChild(style);
