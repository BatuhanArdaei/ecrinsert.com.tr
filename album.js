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
    // 1) Upload URL al
    const r1 = await fetch("/api/upload-url", { method: "POST" });
    const t1 = await r1.text();
    if (!r1.ok) throw new Error("upload-url HTTP " + r1.status + " -> " + t1.slice(0,200));
    let s1; try { s1 = JSON.parse(t1); } catch { throw new Error("upload-url JSON degil: " + t1.slice(0,200)); }
    if (!s1.uploadUrl) throw new Error("upload-url bos geldi");

    // 2) Dosyayı doğrudan Blob'a POST et
    const r2 = await fetch(s1.uploadUrl, { method: "POST", body: file });
    if (!r2.ok) {
      const t2 = await r2.text();
      throw new Error("Blob POST " + r2.status + " -> " + t2.slice(0,200));
    }
  } catch (e) {
    alert("Yukleme hatasi: " + e.message);
  }
}

async function loadGallery() {
  gallery.innerHTML = "<p>Yükleniyor...</p>";
  try {
    const res = await fetch("/api/list");
    const t = await res.text();
    if (!res.ok) throw new Error("list HTTP " + res.status + " -> " + t.slice(0,200));
    const data = JSON.parse(t);
    gallery.innerHTML = "";
    data.forEach((it) => {
      const box = document.createElement("div");
      box.className = "item";
      if ((it.contentType || "").startsWith("video")) {
        const v = document.createElement("video");
        v.src = it.url;
        v.controls = true;
        box.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.src = it.url;
        box.appendChild(img);
      }
      gallery.appendChild(box);
    });
  } catch (e) {
    gallery.innerHTML = "<p>Galeri yüklenemedi: " + e.message + "</p>";
  }
}

loadGallery();
