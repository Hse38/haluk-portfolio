// blog.js – Haluk Portfolio v2 (final stable)
// Çakışma giderildi: $, STORAGE gibi değişkenler app.js ile uyumlu hale getirildi.

const _q = (s, el = document) => el.querySelector(s);
const _qa = (s, el = document) => [...el.querySelectorAll(s)];

function getLikes() {
  try {
    return JSON.parse(localStorage.getItem("haluk:likes") || "{}");
  } catch (e) {
    return {};
  }
}

function setLikes(obj) {
  localStorage.setItem("haluk:likes", JSON.stringify(obj));
}

function formatDate(str) {
  try {
    const d = new Date(str);
    const lang = localStorage.getItem("haluk:lang") || "tr";
    return lang === "en"
      ? d.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : d.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
  } catch (e) {
    return str;
  }
}

async function fetchBlogs() {
  try {
    const res = await fetch("data/blogs.json?_=" + Date.now());
    return await res.json();
  } catch (err) {
    console.error("Blog verisi yüklenemedi:", err);
    return { blogs: [] };
  }
}

function renderList(items) {
  const list = _q("#blog-list");
  if (!list) return;

  if (!items || items.length === 0) {
    list.innerHTML = `<p class="text-gray-500 dark:text-gray-400">Henüz blog yazısı bulunmuyor.</p>`;
    return;
  }

  list.innerHTML = items
    .map(
      (p) => `
    <a href="blog-detail.html?id=${encodeURIComponent(
      p.id
    )}" class="group bg-white/80 dark:bg-white/5 rounded-3xl overflow-hidden ring-1 ring-gray-200/70 dark:ring-white/10 hover:shadow-glow transition block">
      <div class="aspect-[16/10] bg-white/40 dark:bg-white/5 overflow-hidden">
        <img src="${p.image || "assets/burs.jpeg"}" alt="${
        p.title
      }" class="w-full h-full object-cover group-hover:scale-[1.02] transition">
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between gap-3">
          <h3 class="font-semibold text-lg">${p.title}</h3>
          <span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10">${formatDate(
            p.date
          )}</span>
        </div>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">${
          p.excerpt || ""
        }</p>
      </div>
    </a>`
    )
    .join("");
}

function getParam(name) {
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

function setDetailUI() {
  const lang = localStorage.getItem("haluk:lang") || "tr";
  _q("#backBtn") &&
    (_q("#backBtn").textContent =
      lang === "en" ? "← Back to Blog" : "← Geri dön");
  _q("#copyLink") &&
    (_q("#copyLink").textContent =
      lang === "en" ? "Copy Link" : "Linki Kopyala");
  if (_q("#likeBtn"))
    _q("#likeBtn").innerHTML =
      (lang === "en" ? "👍 Like " : "👍 Beğen ") +
      `<span id="likeCount">0</span>`;
  if (_q("#dislikeBtn"))
    _q("#dislikeBtn").innerHTML =
      (lang === "en" ? "👎 Dislike " : "👎 Beğenme ") +
      `<span id="dislikeCount">0</span>`;
}

async function renderDetail() {
  setDetailUI();
  const id = getParam("id");
  if (!id) return;

  const data = await fetchBlogs();
  const post = data.blogs.find((b) => String(b.id) === String(id));
  if (!post) return;

  _q("#pageTitle") &&
    (_q("#pageTitle").textContent = post.title + " — Blog");
  _q("#postTitle").textContent = post.title;
  _q("#postMeta").textContent = formatDate(post.date);

  if (post.image) {
    const img = _q("#postImage");
    img.src = post.image;
    img.alt = post.title;
    img.classList.remove("hidden");
  }

  // 🩵 BURASI GÜNCELLENDİ: Paragrafları düzgün biçimlendirme
  if (Array.isArray(post.content)) {
    _q("#postContent").innerHTML = post.content
      .map((p) => (p.trim() ? `<p>${p}</p>` : "<br>"))
      .join("");
  } else {
    _q("#postContent").innerHTML = `<p>${post.content}</p>`;
  }

  const likes = getLikes();
  const key = "post_" + post.id;
  const likeCountEl = _q("#likeCount");
  const dislikeCountEl = _q("#dislikeCount");
  let l = post.likes || 0,
    d = post.dislikes || 0;

  if (likeCountEl) likeCountEl.textContent = l;
  if (dislikeCountEl) dislikeCountEl.textContent = d;

  _q("#likeBtn")?.addEventListener("click", () => {
    if (likes[key]) return;
    likes[key] = "like";
    setLikes(likes);
    l += 1;
    likeCountEl.textContent = l;
  });

  _q("#dislikeBtn")?.addEventListener("click", () => {
    if (likes[key]) return;
    likes[key] = "dislike";
    setLikes(likes);
    d += 1;
    dislikeCountEl.textContent = d;
  });

  _q("#copyLink")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      _q("#copyLink").textContent =
        (localStorage.getItem("haluk:lang") || "tr") === "en"
          ? "Copied!"
          : "Kopyalandı!";
      setTimeout(setDetailUI, 1200);
    } catch (e) {
      console.warn("Kopyalama başarısız:", e);
    }
  });
}

(async function init() {
  const isList = !!_q("#blog-list");
  if (isList) {
    const data = await fetchBlogs();
    renderList(data.blogs);
  } else {
    renderDetail();
  }
})();
