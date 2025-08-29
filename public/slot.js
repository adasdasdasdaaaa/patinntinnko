const socket = io();

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
const spinBtn = document.getElementById("spinBtn");
const publishBtn = document.getElementById("publishBtn");
const resultDiv = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const rankingList = document.getElementById("rankingList");

let currentScore = 0;

// スロットを回す
spinBtn.addEventListener("click", () => {
  const results = reels.map(r => {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    r.textContent = symbol;
    return symbol;
  });

  let score = 0;
  if (results.every(s => s === results[0])) {
    score = 810; // 大当たりは200点に変更
    resultDiv.textContent = "🎉 大当たり！ +810点";
  } else if (new Set(results).size === 2) {
    score = 60; // 2つ揃い
    resultDiv.textContent = "✨ チャンス！ +60点";
  } else {
    score = -5; // ハズレでも参加点
    resultDiv.textContent = "😢 ハズレ... -5点";
  }

  currentScore += score;
});

// ランキングに送信
publishBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "名無し";
  socket.emit("score", { name, score: currentScore });
});

// ランキングを受信
socket.on("ranking", (data) => {
  rankingList.innerHTML = "";
  data.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}位: ${entry.name} - ${entry.score}点`;
    rankingList.appendChild(li);
  });
});
