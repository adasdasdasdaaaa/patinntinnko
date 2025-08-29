const socket = io();

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const rankingList = document.getElementById("rankingList");

let currentScore = 0;

// スロットを回す
spinBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "名無し";
  const results = reels.map(r => {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    r.textContent = symbol;
    return symbol;
  });

  let score = 0;
  if (results.every(s => s === results[0])) {
    score = 100; // 3つ揃い
    resultDiv.textContent = "🎉 大当たり！ +100点";
  } else if (new Set(results).size === 2) {
    score = 30; // 2つ揃い
    resultDiv.textContent = "✨ チャンス！ +30点";
  } else {
    score = 10; // ハズレでも参加点
    resultDiv.textContent = "😢 ハズレ... +10点";
  }

  currentScore += score;
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
