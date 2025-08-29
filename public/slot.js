const socket = io();

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3")
];
const stopBtns = [
  document.getElementById("stop1"),
  document.getElementById("stop2"),
  document.getElementById("stop3")
];
const spinBtn = document.getElementById("spinBtn");
const publishBtn = document.getElementById("publishBtn");
const resultDiv = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const rankingList = document.getElementById("rankingList");

let currentScore = 100;
const costPerSpin = 10;
let intervals = []; // 各リールの回転用

function startSpin() {
  if (currentScore < costPerSpin) {
    resultDiv.textContent = "⚠ スコアが足りません！";
    return;
  }
  currentScore -= costPerSpin;
  resultDiv.textContent = "";

  // 各リールを回す
  reels.forEach((reel, i) => {
    intervals[i] = setInterval(() => {
      reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 100);
  });

  // ボタン活性化
  stopBtns.forEach(btn => btn.disabled = false);
}

function stopReel(index) {
  clearInterval(intervals[index]);
  stopBtns[index].disabled = true;

  // 全リール止まったら判定
  if (stopBtns.every(btn => btn.disabled)) {
    calculateScore();
  }
}

function calculateScore() {
  const results = reels.map(r => r.textContent);
  let gain = 0;

  // 3つ揃い
  if (results.every(s => s === results[0])) {
    gain = 810; // 大当たり
    resultDiv.textContent = `🎉 大当たり！ +${gain}点`;

    // 光る演出
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 1500); // 3回分で削除
  } else if (new Set(results).size === 2) {
    gain = 100; // 2つ揃い
    resultDiv.textContent = `✨ チャンス！ +${gain}点`;
  } else {
    gain = 0; // ハズレ
    resultDiv.textContent = `😢 ハズレ... +0点`;
  }

  currentScore = Number(currentScore) + Number(gain);
  resultDiv.textContent += ` | 現在のスコア: ${currentScore}`;
}

// スタートボタン
spinBtn.addEventListener("click", startSpin);

// 各リールの止めボタン
stopBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => stopReel(i));
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
