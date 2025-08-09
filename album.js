// NOTE: comments use ASCII only
const uploadBtn = document.getElementById('uploadBtn');
const refreshBtn = document.getElementById('refreshBtn');
const fileInput  = document.getElementById('fileInput');
const gallery    = document.getElementById('gallery');
const goHomeBtn  = document.getElementById('goHomeBtn');

goHomeBtn.addEventListener('click', () => {
  // change if your home is different
  window.location.href = '/';
});

uploadBtn.addEventListener('click', () => fileInput.click());
refreshBtn.addEventListener('click', () => loadGallery());

fileInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []);
  for (const f of files) {
    await uploadOne(f);
  }
  fileInput.value = '';
  loadGallery();
});

async function uploadOne(file) {
  const fd = new FormData();
  fd.append('file', file);
  try {
    const res = await fetch('upload.php', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('upload failed');
    const data = await res.json(); // { ok, url, mime, name }
    // optimistic add
    addItemToGallery(data.url, data.mime, Date.now());
  } catch (err) {
    alert('Yukleme hatasi: ' + err.message);
  }
}

function addItemToGallery(url, mime, timeMs) {
  const wrap = document.createElement('div');
  wrap.className = 'item';
  if (mime && mime.startsWith('image')) {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = url;
    wrap.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = url;
    vid.controls = true;
    wrap.appendChild(vid);
  }
  const meta = document.createElement('div');
  meta.className = 'meta';
  if (timeMs) meta.textContent = new Date(timeMs).toLocaleString('tr-TR');
  wrap.appendChild(meta);
  gallery.prepend(wrap);
}

async function loadGallery() {
  try {
    const res = await fetch('list.php');
    if (!res.ok) throw new Error('list failed');
    const items = await res.json(); // [{url,mime,mtime}]
    gallery.innerHTML = '';
    for (const it of items) {
      addItemToGallery(it.url, it.mime, it.mtime * 1000);
    }
  } catch (e) {
    console.error(e);
  }
}

// initial
loadGallery();
