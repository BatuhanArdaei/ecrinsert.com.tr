const container = document.getElementById("puzzle-container");
const etapBaslik = document.getElementById("etap-baslik");
let currentEtap = 1;
let selected = null;

function createPuzzle(etap) {
  container.innerHTML = "";
  etapBaslik.textContent = `${etap}. Etap`;

  const pieces = [];
  for (let i = 0; i < 9; i++) {
    pieces.push(i);
  }
  pieces.sort(() => Math.random() - 0.5);

  pieces.forEach((pos, i) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundImage = `url('görsel/${etap}.jpeg')`;

    const x = pos % 3;
    const y = Math.floor(pos / 3);
    piece.style.backgroundPosition = `-${x * 160}px -${y * 160}px`;
    piece.dataset.index = i;
    piece.dataset.correct = pos;

    piece.addEventListener("click", () => swapPiece(piece));
    container.appendChild(piece);
  });
}

function swapPiece(piece) {
  if (!selected) {
    selected = piece;
    piece.style.border = "2px solid red";
    return;
  }

  const tempIndex = selected.dataset.correct;
  selected.dataset.correct = piece.dataset.correct;
  piece.dataset.correct = tempIndex;

  const tempBG = selected.style.backgroundPosition;
  selected.style.backgroundPosition = piece.style.backgroundPosition;
  piece.style.backgroundPosition = tempBG;

  selected.style.border = "1px solid #ccc";
  selected = null;

  checkPuzzle();
}

function checkPuzzle() {
  const pieces = [...document.getElementsByClassName("piece")];
  const correct = pieces.every(
    (piece, i) => parseInt(piece.dataset.correct) === i
  );
  if (correct) {
    setTimeout(() => {
      alert(`${currentEtap}. Etap Tamam!`);
      currentEtap++;
      if (currentEtap <= 8) {
        createPuzzle(currentEtap);
      } else {
        alert("🎉 Tüm etaplar tamamlandı!");
        container.innerHTML = "<h2>Ne zaman ki canın sıkkın olur, kendini kötü hissedersen gelip oyun oynayarak kafanı dağıtabilirsin sevgilim.<3!</h2>";
      }
    }, 500);
  }
}

createPuzzle(currentEtap);
