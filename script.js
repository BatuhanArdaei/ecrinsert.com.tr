// Oyunlar butonu ve ilgili alanları seçiyoruz
const oyunlarBtn = document.getElementById('oyunlarBtn');
const oyunMenu = document.getElementById('oyunMenu');
const oyunAlani = document.getElementById('oyunAlani');

// Oyunlar butonuna tıklandığında çalışacak fonksiyon
oyunlarBtn.addEventListener('click', () => {
  // Şimdilik oyun menüsü açmak yerine direkt puzzle sayfasına yönlendiriyoruz
  window.location.href = 'oyunlar/puzzle.html';
});
