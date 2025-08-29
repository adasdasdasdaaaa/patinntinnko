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

// 効果音
const stopSound = new Audio("/sounds/決定ボタンを押す7.mp3");
const bigWinSound = new Audio("/sounds/bigwin.mp3"); // 任意で大当たり音

let currentScore = 100;
const costPerSpin = 10;
let intervals = []; // 各リールの回転用

// スロット回転開始
function startSpin() {
  if (currentScore < costPerSpin) {
    resultDiv.textContent = "⚠ スコアが足りません！";
    return;
  }
  currentScore -= costPerSpin;
  resultDiv.textContent = "";

  reels.forEach((reel, i) => {
    intervals[i] = setInterval(() => {
      reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 100);
  });

  stopBtns.forEach(btn => btn.disabled = false);
}

// 各リール停止
function stopReel(index) {
  clearInterval(intervals[index]);
  stopBtns[index].disabled = true;

  // 止める音を再生
  stopSound.currentTime = 0;
  stopSound.play();

  if (stopBtns.every(btn => btn.disabled)) {
    calculateScore();
  }
}

// スコア計算＆演出
function calculateScore() {
  const results = reels.map(r => r.textContent);
  let gain = 0;

  // 3つ揃い
  if (results.every(s => s === results[0])) {
    gain = 810; // 大当たり
    resultDiv.textContent = `🎉 大当たり！ +${gain}点`;

    // 光る演出
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 1500);

    // 大当たり音（任意）
    // bigWinSound.play();
  } else if (new Set(results).size === 2) {
    gain = 70; // 2つ揃い
    resultDiv.textContent = `✨ チャンス！ +${gain}点`;
  } else {
    gain = 0;
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
  socket.emit("score", { name, score: Number(currentScore) });
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
