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
  return `
  <article class="group bg-white/80 dark:bg-white/5 rounded-3xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-white/10 hover:shadow-glow transition h-full flex flex-col">
    <div class="aspect-[16/10] bg-white/40 dark:bg-white/5 overflow-hidden">
      <img src="${p.image || 'assets/placeholder.png'}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-[1.02] transition">
    </div>

    <div class="p-5 flex flex-col flex-1 min-h-0">
      <div class="flex items-center justify-between gap-3">
        <h3 class="font-semibold text-lg">${p.title}</h3>
        ${p.year ? `<span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10">${p.year}</span>` : ''}
      </div>

      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">${p.description || ''}</p>

      <!-- 🧩 ETİKETLER (Wrap destekli) -->
      <div class="mt-4 flex flex-wrap gap-2 w-full">
        ${(p.tags || [])
          .map(
            (t) => `
          <span class="inline-block max-w-full px-2 py-1 rounded-full bg-white/90 text-blue-900 text-xs font-medium leading-none whitespace-normal break-words">
            ${t}
          </span>`
          )
          .join('')}
      </div>

      <div class="mt-4 flex items-center gap-3">
        ${
          p.link
            ? `<a href="${p.link}" target="_blank" class="text-sm underline">${t('projects.detail') || 'Detay'}</a>`
            : ''
        }
        ${
          p.repo
            ? `<a href="${p.repo}" target="_blank" class="text-sm underline">${t('projects.code') || 'Kod'}</a>`
            : ''
        }
      </div>
    </div>
  </article>`;
}
function renderProjects(list){ const grid=$('#project-grid'); if(!grid)return; grid.innerHTML=list.map(cardTemplate).join(''); const s=$('#search'); if(s){ s.addEventListener('input', ()=>{ const q=s.value.toLowerCase().trim(); const f=list.filter(p=>(p.title||'').toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q)||(p.tags||[]).join(' ').toLowerCase().includes(q)); grid.innerHTML=f.map(cardTemplate).join(''); }); }}
function renderFeatured(list){ const wrap=$('#featured-projects'); if(!wrap) return; wrap.innerHTML=list.slice(0,3).map(cardTemplate).join(''); }
async function loadProjects(){ try{ const res=await fetch('data/projects.json?_='+Date.now()); const data=await res.json(); renderProjects(data.projects); renderFeatured(data.projects);} catch(e){ console.error('Projeler yüklenemedi', e);} }
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
  document.getElementById("aboutBtn").addEventListener("click", () => {
    modal.classList.remove("hidden");
    setTimeout(() => modalBox.classList.add("scale-100", "opacity-100"), 50);
  });
  document.getElementById("closeModal").addEventListener("click", () => {
    modalBox.classList.remove("scale-100", "opacity-100");
    setTimeout(() => modal.classList.add("hidden"), 300);
  });
}