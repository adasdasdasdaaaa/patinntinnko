const socket = io();

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
const spinBtn = document.getElementById("spinBtn");
const publishBtn = document.getElementById("publishBtn");
const resultDiv = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const rankingList = document.getElementById("rankingList");

let currentScore = 100; // 初期スコア100点
const costPerSpin = 10; // 回すごとに10ポイント消費

// スロットを回す
spinBtn.addEventListener("click", () => {
  if (currentScore < costPerSpin) {
    resultDiv.textContent = "⚠ スコアが足りません！";
    return;
  }

  currentScore -= costPerSpin; // 回すごとに消費

  const results = reels.map(r => {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    r.textContent = symbol;
    return symbol;
  });

  let gain = 0; // 今回の得点

  if (results.every(s => s === results[0])) {
    gain = 810; // 大当たり
    resultDiv.textContent = `🎉 大当たり！ +${gain}点`;
  } else if (new Set(results).size === 2) {
    gain = 50; // 2つ揃い
    resultDiv.textContent = `✨ チャンス！ +${gain}点`;
  } else {
    gain = 0; // ハズレ
    resultDiv.textContent = `😢 ハズレ... +0点`;
  }

  currentScore += gain;
  resultDiv.textContent += ` | 現在のスコア: ${currentScore}`;
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
