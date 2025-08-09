const uploadBtn = document.getElementById("uploadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const fileInput = document.getElementById("fileInput");
const gallery = document.getElementById("gallery");

uploadBtn.addEventListener("click", () => fileInput.click());
refreshBtn.addEventListener("click", loadGallery);

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files || []);
  for (const file of files) await uploadOne(file);
  fileInput.value = "";
  loadGallery();
});

async function uploadOne(file) {
  try {
    // 1) Tek kullanımlık upload URL al
    const r1 = await fetch("/api/upload-url", { method: "POST" });
    const s1 = await r1.json(); // { uploadUrl, pathname }
    if (!r1.ok || !s1.uploadUrl) throw new Error("upload-url alinamadi");

    // 2) Dosyayi dogrudan Blob'a POST et
    const r2 = await fetch(s1.uploadUrl, { method: "POST", body: file });
    if (!r2.ok) {
      const t = await r2.text();
      throw new Error("Blob POST hatasi: " + t.slice(0,200));
    }
  } catch (e) {
    alert("Yukleme hatasi: " + e.message);
  }
}

async function loadGallery() {
  gallery.innerHTML = "<p>Yükleniyor...</p>";
  try {
    const res = await fetch("/api/list");
    const data = await res.json(); // [{url, size, uploadedAt, contentType}]
    gallery.innerHTML = "";
    data.forEach(it => {
      const box = document.createElement("div");
      box.className = "item";
      if ((it.contentType || "").startsWith("video")) {
        const v = document.createElement("video");
        v.src = it.url; v.controls = true; box.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.src = it.url; box.appendChild(img);
      }
      gallery.appendChild(box);
    });
  } catch (e) {
    gallery.innerHTML = "<p>Galeri yüklenemedi: " + e.message + "</p>";
  }
}

loadGallery();
