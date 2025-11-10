const $ = (s, el=document)=>el.querySelector(s); const $$ = (s, el=document)=>[...el.querySelectorAll(s)];
const STORAGE = { theme: 'haluk:theme', lang: 'haluk:lang' };
function setTheme(mode){ const root=document.documentElement; if(mode==='dark'){root.classList.add('dark');root.setAttribute('data-theme','dark');} else {root.classList.remove('dark');root.setAttribute('data-theme','light');} localStorage.setItem(STORAGE.theme, mode); $('#themeIcon') && ($('#themeIcon').textContent = mode==='dark' ? '🌞' : '🌗'); }
(function(){ const saved = localStorage.getItem(STORAGE.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'); setTheme(saved); $('#themeToggle')?.addEventListener('click', ()=> setTheme(document.documentElement.classList.contains('dark')?'light':'dark')); })();
let LANG='tr'; let dict={}; function t(key){return (dict[LANG]&&dict[LANG][key]) || (dict['tr']&&dict['tr'][key]) || '';}
function applyI18n(){ $$('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n'); const val=t(k); if(val) el.innerHTML=val;}); $$('[data-i18n-ph]').forEach(el=>{const k=el.getAttribute('data-i18n-ph'); const val=t(k); if(val) el.setAttribute('placeholder', val);}); const about=t('about.content'); if($('#aboutText')&&about){$('#aboutText').innerHTML=about;} }
async function loadLang(){ try{ const res=await fetch('data/lang.json?_='+Date.now()); dict=await res.json(); const saved=localStorage.getItem(STORAGE.lang)||'tr'; LANG=saved; applyI18n(); }catch(e){ console.error('Dil dosyası yüklenemedi', e); } }
function toggleLang(){ LANG = (LANG==='tr') ? 'en' : 'tr'; localStorage.setItem(STORAGE.lang, LANG); applyI18n(); }
$('#langToggle')?.addEventListener('click', toggleLang);
function cardTemplate(p) {
  const link = p.page ? `./${p.page}` : `project-detail.html?id=${p.id}`;
  return `
    <a href="${link}" class="group block transition hover:scale-[1.02]" data-id="${p.id}">
      <article class="bg-white/80 dark:bg-white/5 rounded-3xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-white/10 hover:shadow-glow transition h-full flex flex-col">
        <div class="aspect-[16/10] overflow-hidden">
          <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-[1.03] transition" />
        </div>
        <div class="p-5 flex flex-col flex-1">
          <h3 class="font-semibold text-lg mb-2">${p.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 flex-1">${p.description}</p>
        </div>
      </article>
    </a>`;
}
function renderProjects(list){
  const grid = $('#project-grid');
  if(!grid) return;
  grid.innerHTML = list.map(cardTemplate).join('');
  
  // 🔥 Manuel yönlendirme
  grid.querySelectorAll('a[data-id]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = a.getAttribute('data-id');
      const proj = list.find(p=>p.id===id);
      if(proj && proj.page) window.location.href = `./${proj.page}`;
      else window.location.href = `project-detail.html?id=${id}`;
    });
  });
}
function renderFeatured(list){ const wrap=$('#featured-projects'); if(!wrap) return; wrap.innerHTML=list.slice(0,3).map(cardTemplate).join(''); }
async function loadProjects(){ try{ const res=await fetch('./data/projects.json?_='+Date.now()); const data=await res.json(); renderProjects(data.projects); renderFeatured(data.projects);} catch(e){ console.error('Projeler yüklenemedi', e);} }
loadLang(); loadProjects();
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("langToggle");
  const flag = document.getElementById("flag");
  const langLabel = document.getElementById("langLabel");

  if (!langBtn) return; // header henüz yüklenmediyse bekle

  let currentLang = localStorage.getItem("haluk:lang") || "tr";
  updateLangUI();

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("haluk:lang", currentLang);
    updateLangUI();
    if (typeof applyI18n === "function") applyI18n();
  });

  function updateLangUI() {
    if (currentLang === "tr") {
      flag.textContent = "🇹🇷";
      langLabel.textContent = " / EN";
    } else {
      flag.textContent = "🇬🇧";
      langLabel.textContent = " / TR";
    }
  }
});
// === Typewriter Selamlama ===
const messages = [
  "Günaydın ☀️ Ben Haluk, ERP sistemleri geliştiriyorum.",
  "İyi günler 👨‍💻 Dijital dönüşüm süreçlerini kodluyorum.",
  "İyi akşamlar 🌙 Süreçleri sadeleştiriyor, zamanı kazandırıyorum."
];
const intro = document.getElementById("intro");
if (intro) {
  const cursor = document.createElement("span");
  cursor.classList.add("cursor");
  intro.appendChild(cursor);

  let msgIndex = 0, charIndex = 0;
  function type() {
    const text = messages[msgIndex];
    intro.textContent = text.slice(0, charIndex);
    intro.appendChild(cursor);
    charIndex++;
    if (charIndex > text.length) {
      charIndex = 0;
      msgIndex = (msgIndex + 1) % messages.length;
      setTimeout(type, 1500);
    } else setTimeout(type, 70);
  }
  type();
}

// === Teknoloji Döngüsü ===
const techEl = document.getElementById("tech");
if (techEl) {
  const techs = ["Django", "Python", "Flutter", "Tailwind", "PostgreSQL", "Google App Script"];
  let i = 0;
  function cycleTech() {
    techEl.classList.remove("animate-fade-in");
    void techEl.offsetWidth; // restart animation
    techEl.textContent = techs[i];
    techEl.classList.add("animate-fade-in");
    i = (i + 1) % techs.length;
  }
  cycleTech();
  setInterval(cycleTech, 2500);
}

// === Scroll Progress Bar ===
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / height) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
});

// === Modal (Benimle Tanış) ===
const modal = document.getElementById("aboutModal");
if (modal) {
  const modalBox = modal.querySelector(".modal-box");
  const aboutBtn = document.getElementById("aboutBtn");
  const closeBtn = document.getElementById("closeModal");

  // Chat alanı referansları
  //const chatBox = document.getElementById("chatBox");
  const msg = document.getElementById("msg");
  const send = document.getElementById("send");

  // === Chat Fonksiyonları ===
  function append(text, who = "bot") {
    if (!chatBox) return;
    const p = document.createElement("div");
    p.className = who === "bot" ? "text-gray-200" : "text-blue-300 text-right";
    p.innerText = text;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function startIntro() {
    console.log("🎬 startIntro çağrıldı!");
    if (!window.avatarBubble) return;

    const lines = [
      "👋 Merhaba! Ben Haluk Şakir Ekinci.",
      "ERP Sistem Sorumlusu & Yazılım Geliştiricisiyim.",
      "T3 Vakfı’nda dijital dönüşüm ve süreç optimizasyonu üzerine çalışıyorum.",
      "“Selam Haluk!” yaz, birlikte deneyelim. 😎"
    ];

    let i = 0;
    let activeTimeouts = [];

    // 🔸 Önceki zamanlayıcıları iptal et
    function clearAllTimeouts() {
      activeTimeouts.forEach(clearTimeout);
      activeTimeouts = [];
    }

    function showLine() {
      if (!window.avatarBubble) return;

      clearAllTimeouts(); // önceki animasyonu kes
      const bubble = window.avatarBubble;

      bubble.textContent = lines[i];
      bubble.style.opacity = "1";
      bubble.style.transform = "translateY(-10px) scale(1)";

      // 2.3 sn sonra gizle
      const hideTimer = setTimeout(() => {
        bubble.style.opacity = "0";
        bubble.style.transform = "translateY(-25px) scale(0.9)";

        i++;
        if (i < lines.length) {
          const nextTimer = setTimeout(showLine, 800); // sıradaki satır
          activeTimeouts.push(nextTimer);
        } else {
          // son satırdan sonra tekrar karşılama
          const finalTimer = setTimeout(() => {
            bubble.textContent = "👋 Merhaba, ben Haluk!";
            bubble.style.opacity = "1";
            bubble.style.transform = "translateY(-10px) scale(1)";
            const fadeTimer = setTimeout(() => {
              bubble.style.opacity = "0";
              bubble.style.transform = "translateY(-25px) scale(0.9)";
            }, 2500);
            activeTimeouts.push(fadeTimer);
          }, 800);
          activeTimeouts.push(finalTimer);
        }
      }, 2300);

      activeTimeouts.push(hideTimer);
    }

    showLine();
  }


  // === Modal Açma ===
  aboutBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    setTimeout(() => modalBox.classList.add("scale-100", "opacity-100"), 50);
  });

  // === Modal Kapatma ===
  closeBtn.addEventListener("click", () => {
    modalBox.classList.remove("scale-100", "opacity-100");
    setTimeout(() => modal.classList.add("hidden"), 300);
  });

  send?.addEventListener("click", () => {
    if (!window.avatarBubble) return;
    const t = msg.value.trim();
    if (!t) return;
    msg.value = "";

    // Ziyaretçi mesajını balon olarak göster
    if (window.avatarBubble) {
      avatarBubble.textContent = t;
      avatarBubble.style.opacity = "1";
      avatarBubble.style.transform = "translateY(-10px) scale(1)";
      setTimeout(() => {
        avatarBubble.style.opacity = "0";
        avatarBubble.style.transform = "translateY(-25px) scale(0.9)";
      }, 2000);
    }

    const low = t.toLowerCase();
    let response = "";
    if (low.includes("selam") || low.includes("merhaba")) {
      response = "👋 El sallıyorum! Kamerayı açarsan yüzümü de takip edebilirim.";
    } else if (low.includes("ne yapıyorsun") || low.includes("ne iş")) {
      response = "ERP, süreç otomasyonu ve yazılım geliştirme üzerine çalışıyorum.";
    } else if (low.includes("iletişim")) {
      response = "LinkedIn: linkedin.com/in/haluksakirekinci veya mail: info@haluksakirekinci.com.tr";
    } else {
      response = "Harika soru! Biraz daha detay verir misin?";
    }

    // Yanıt da balon olarak gösterilsin
    setTimeout(() => {
      if (window.avatarBubble) {
        avatarBubble.textContent = response;
        avatarBubble.style.opacity = "1";
        avatarBubble.style.transform = "translateY(-10px) scale(1)";
        setTimeout(() => {
          avatarBubble.style.opacity = "0";
          avatarBubble.style.transform = "translateY(-25px) scale(0.9)";
        }, 2500);
      }
    }, 1000);
  });


  // Enter tuşuyla da gönderme desteği
  msg?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") send.click();
  }); 
}

// === 3D Avatar: modal açıldığında başlat ===
let avatarBooted = false;

function initAvatar3D() {
  if (avatarBooted) return;
  const canvas = document.getElementById("avatarCanvas");
  if (!canvas) return;

  // === 💬 Baloncuk ===
  const bubble = document.createElement("div");
  bubble.style.position = "absolute";
  bubble.style.maxWidth = "80vw"; // ekrana taşma olmasın
  bubble.style.wordWrap = "break-word";
  bubble.style.padding = "10px 14px";
  bubble.style.background = "linear-gradient(90deg, #004aad, #007aff)";
  bubble.style.borderRadius = "16px";
  bubble.style.color = "#fff";
  bubble.style.fontSize = "14px";
  bubble.style.fontWeight = "500";
  bubble.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
  bubble.style.transition = "all 0.6s cubic-bezier(0.25,0.1,0.25,1)";
  bubble.style.opacity = "0";
  bubble.style.pointerEvents = "none";
  bubble.style.zIndex = "9999";
  bubble.style.transform = "translateY(0px) scale(0.9)";
  bubble.style.whiteSpace = "normal";
  bubble.style.wordBreak = "break-word";
  bubble.style.textAlign = "center";
  bubble.style.userSelect = "none";
  bubble.style.filter = "drop-shadow(0 2px 6px rgba(0,0,0,0.4))";

  const tail = document.createElement("div");
  tail.style.position = "absolute";
  tail.style.bottom = "-8px";
  tail.style.left = "40%";
  tail.style.transform = "translateX(-50%)";
  tail.style.width = "0";
  tail.style.height = "0";
  tail.style.borderLeft = "6px solid transparent";
  tail.style.borderRight = "6px solid transparent";
  tail.style.borderTop = "8px solid #0066ff";
  bubble.appendChild(tail);

  document.body.appendChild(bubble);
  window.avatarBubble = bubble;

  // === THREE.js Kurulumu ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  function resize() {
    const w = canvas.clientWidth || 600;
    const h = 400;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  camera.position.set(0, 1.6, 3);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(0, 1.5, 2);
  scene.add(dirLight);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false; // 🚫 Sürükleme ile döndürmeyi kapat
  controls.target.set(0, 1.0, 0);

  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://models.readyplayer.me/690ccff8de516bcc96bc3a60.glb",
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, -1.5, 0);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);

      let mouseX = 0, mouseY = 0;
      document.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });

      function updateBubblePosition() {
        if (!window.avatarBubble || !camera) return;
        const rect = canvas.getBoundingClientRect();

        // Modelin kafasının biraz sol tarafına hizala
        const vector = new THREE.Vector3(-0.25, 1.9, 0); // 🧠 sola kaydırdık
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * rect.width;
        const y = (-vector.y * 0.5 + 0.5) * rect.height;

        // 🔥 Balonu sola ve yukarıya net offset ile taşıyoruz
        const offsetX = -window.avatarBubble.offsetWidth * 0.9;  // sola
        const offsetY = + 90;  // yukarı

        const bubbleX = rect.left + x - window.avatarBubble.offsetWidth * 0.6;
        window.avatarBubble.style.left = `${Math.max(10, Math.min(window.innerWidth - bubble.offsetWidth - 10, bubbleX))}px`;
        window.avatarBubble.style.top = `${window.scrollY + rect.top + y + offsetY}px`;
      }

      // === Animasyon ===
      let t = 0;
      function animate() {
        t += 0.02;
        // 🎯 Fare takibini yavaşlatılmış ve yumuşatılmış hale getir
        const targetRotY = mouseX * 0.2;  // daha yavaş dönüş
        const targetRotX = mouseY * 0.1;

        model.rotation.y += (targetRotY - model.rotation.y) * 0.05; // smooth easing
        model.rotation.x += (targetRotX - model.rotation.x) * 0.05;
        model.position.y = Math.sin(t) * 0.03 - 1.5;
        renderer.render(scene, camera);
        updateBubblePosition();

        // intro başlatma
        if (typeof startIntro === "function" && !window._introStarted) {
          console.log("🟢 Intro başlatılıyor...");
          window._introStarted = true;
          startIntro();
        }

        requestAnimationFrame(animate);
      }

      animate();

      // === Başlangıç Balonu ===
      bubble.textContent = "👋 Merhaba, ben Haluk!";
      bubble.style.opacity = "1";
      bubble.style.transform = "translateY(-10px) scale(1)";
      setTimeout(() => {
        bubble.style.opacity = "0";
        bubble.style.transform = "translateY(-25px) scale(0.9)";
      }, 2500);
    },
    undefined,
    (err) => console.error("GLTF yüklenemedi:", err)
  );

  avatarBooted = true;
}

// === Modal açıldığında 3D avatarı başlat ===
(function hookModalOpen() {
  const aboutBtn = document.getElementById("aboutBtn");
  const modal = document.getElementById("aboutModal");
  const closeBtn = document.getElementById("closeModal");

  if (!aboutBtn || !modal || !closeBtn) return;

  aboutBtn.addEventListener("click", () => {
    console.log("🎯 Modal açıldı, 3D avatar başlatılıyor...");
    if (!window.avatarBooted) {
      setTimeout(initAvatar3D, 200);
    }
  });
})();

// 💬 Geri Bildirim Pop-up Script
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("feedbackPopup");
  const btn = document.getElementById("feedbackBtn");
  const closeBtn = document.getElementById("closeFeedback");
  const sendBtn = document.getElementById("sendFeedback");
  const statusText = document.getElementById("feedbackStatus");

  if (!btn) return;

  btn.addEventListener("click", () => {
    popup.classList.remove("invisible", "opacity-0");
    popup.classList.add("opacity-100");
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("opacity-0");
    setTimeout(() => popup.classList.add("invisible"), 300);
  });

  sendBtn.addEventListener("click", () => {
    const text = document.getElementById("feedbackText").value.trim();
    if (!text) return alert("Lütfen bir öneri yazın.");
    
    const all = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    all.push({ text, date: new Date().toLocaleString() });
    localStorage.setItem("feedbacks", JSON.stringify(all));
    
    statusText.classList.remove("hidden");
    document.getElementById("feedbackText").value = "";
    setTimeout(() => statusText.classList.add("hidden"), 3000);
  });
});

// 💬 Geri Bildirim Pop-up Kapatma
const closeFeedbackBtn = document.getElementById("closeFeedback");
const popup = document.getElementById("feedbackPopup");

if (closeFeedbackBtn && popup) {
  closeFeedbackBtn.addEventListener("click", () => {
    const inner = popup.querySelector("div");
    if (!inner) return;
    inner.style.transform = "scale(0.9)";
    popup.classList.add("opacity-0");
    setTimeout(() => {
      popup.classList.add("invisible");
      inner.style.transform = "scale(1)";
    }, 300);
  });
}
