// === Dinamik Proje Detay ===
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("project-detail");

async function loadProject() {
  try {
    const res = await fetch("data/projects.json?_=" + Date.now());
    const data = await res.json();
    const project = data.projects.find(p => p.id === id);

    if (!project) {
      container.innerHTML = `<p class="text-red-400 text-lg mt-10">🚫 Proje bulunamadı.</p>`;
      return;
    }

    document.title = `${project.title} | Haluk Şakir Ekinci`;

    container.innerHTML = `
      <section class="mb-14 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-3">${project.title}</h1>
        <p class="text-gray-400 max-w-3xl mx-auto text-lg">${project.description}</p>
        ${project.image ? `<img src="${project.image}" alt="${project.title}" class="mt-10 rounded-2xl shadow-lg mx-auto max-w-4xl" />` : ""}
      </section>

      ${project.detailImages && project.detailImages.length ? `
        <section class="grid md:grid-cols-3 gap-6 mb-16">
          ${project.detailImages.map((img, i) => `
            <div class="bg-gray-900 rounded-2xl p-4 hover:shadow-orange-500/30 transition">
              <img src="${img.src}" alt="Detay ${i+1}" class="rounded-xl shadow-md w-full object-cover" />
              ${img.caption ? `<p class="mt-3 text-gray-300 text-sm">${img.caption}</p>` : ""}
            </div>
          `).join("")}
        </section>
      ` : ""}

      <section class="text-center">
        <h2 class="text-2xl font-semibold mb-6">⚙️ Teknik Özellikler</h2>
        <div class="flex flex-wrap justify-center gap-3">
          ${(project.tags || [])
            .map(t => `<span class="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm">${t}</span>`)
            .join("")}
        </div>
      </section>

      ${project.repo ? `
        <div class="mt-12 text-center">
          <a href="${project.repo}" target="_blank" class="text-orange-400 underline text-lg font-medium">🔗 GitHub Projesi</a>
        </div>` : ""}
    `;
  } catch (err) {
    console.error("Proje yüklenemedi:", err);
    container.innerHTML = `<p class="text-red-400 mt-10">Bir hata oluştu. (${err.message})</p>`;
  }
}

loadProject();