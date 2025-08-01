const oyunlarBtn = document.getElementById('oyunlarBtn');
const oyunMenu = document.getElementById('oyunMenu');
const oyunAlani = document.getElementById('oyunAlani');

oyunlarBtn.addEventListener('click', () => {
  // Burada ileride oyun menüsü açılabilir
  // Şimdilik direkt puzzle sayfasına yönlendirelim
  window.location.href = 'oyunlar/puzzle.html';
});
document.getElementById('puzzleBtn').addEventListener('click', () => {
  window.location.href = 'oyunlar/puzzle.html';
});

document.getElementById('muzikBtn').addEventListener('click', () => {
  window.location.href = 'muzik-oneri.html';
});

document.getElementById('soruBtn').addEventListener('click', () => {
  // Mesela içerik göster
  alert('Soru-Cevap tıklandı');
});
