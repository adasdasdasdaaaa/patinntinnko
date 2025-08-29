const socket = io();

// --- スロット用 ---
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

// --- 効果音 ---
const stopSound = new Audio("/sounds/決定ボタンを押す7.mp3");
// const bigWinSound = new Audio("/sounds/bigwin.mp3"); // 任意で大当たり音

let currentScore = 100;
const costPerSpin = 10;
let intervals = [];

// --- スロット回転 ---
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

// --- 各リール停止 ---
function stopReel(index) {
  clearInterval(intervals[index]);
  stopBtns[index].disabled = true;

  stopSound.currentTime = 0;
  stopSound.play();

  if (stopBtns.every(btn => btn.disabled)) {
    calculateScore();
  }
}

// --- スコア計算＆演出 ---
function calculateScore() {
  const results = reels.map(r => r.textContent);
  let gain = 0;

  if (results.every(s => s === results[0])) {
    gain = 810;
    resultDiv.textContent = `🎉 大当たり！ +${gain}点`;
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 1500);
    // bigWinSound.play(); // 任意で大当たり音
  } else if (new Set(results).size === 2) {
    gain = 50;
    resultDiv.textContent = `✨ チャンス！ +${gain}点`;
  } else {
    gain = 0;
    resultDiv.textContent = `😢 ハズレ... +0点`;
  }

  currentScore += gain;
  resultDiv.textContent += ` | 現在のスコア: ${currentScore}`;
}

// --- スロット操作 ---
spinBtn.addEventListener("click", startSpin);
stopBtns.forEach((btn, i) => btn.addEventListener("click", () => stopReel(i)));

// --- ランキング送信 ---
publishBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim() || "名無し";
  socket.emit("score", { name, score: currentScore });
});

// --- ランキング受信 ---
socket.on("ranking", (data) => {
  rankingList.innerHTML = "";
  data.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}位: ${entry.name} - ${entry.score}点`;
    rankingList.appendChild(li);
  });
});

// --- FX 投資欄 ---
const fxInvestBtn = document.getElementById("fxInvestBtn");
const fxAmount = document.getElementById("fxAmount");
const fxResult = document.getElementById("fxResult");

fxInvestBtn.addEventListener("click", () => {
  let amount = Number(fxAmount.value);
  if (isNaN(amount) || amount <= 0) {
    fxResult.textContent = "⚠ 投資額を正しく入力してください";
    return;
  }

  // -50%～+50% の損益
  const rate = (Math.random() - 0.5) * 2;
  const profit = Math.floor(amount * rate);

  // スロットスコアに反映
  currentScore += profit;

  fxResult.textContent = `結果: ${profit >= 0 ? "利益" : "損失"} ${profit}点 | 現在スコア: ${currentScore}`;

  // ランキング自動送信
  const name = playerNameInput.value.trim() || "名無し";
  socket.emit("score", { name, score: currentScore });
});

// --- BIPスロット ---
const bipSymbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];
const bipReels = [
  document.getElementById("bipReel1"),
  document.getElementById("bipReel2"),
  document.getElementById("bipReel3")
];
const bipStopBtns = [
  document.getElementById("bipStop1"),
  document.getElementById("bipStop2"),
  document.getElementById("bipStop3")
];
const bipSpinBtn = document.getElementById("bipSpinBtn");
const bipResultDiv = document.getElementById("bipResult");

let bipIntervals = [];
const bipCost = 10000;

function startBipSpin() {
  if (currentScore < bipCost) {
    bipResultDiv.textContent = "⚠ スコアが足りません！";
    return;
  }
  currentScore -= bipCost;
  bipResultDiv.textContent = "";

  bipReels.forEach((reel, i) => {
    bipIntervals[i] = setInterval(() => {
      reel.textContent = bipSymbols[Math.floor(Math.random() * bipSymbols.length)];
    }, 100);
  });

  bipStopBtns.forEach(btn => btn.disabled = false);
}

function stopBipReel(index) {
  clearInterval(bipIntervals[index]);
  bipStopBtns[index].disabled = true;

  stopSound.currentTime = 0;
  stopSound.play();

  if (bipStopBtns.every(btn => btn.disabled)) {
    calculateBipScore();
  }
}

function calculateBipScore() {
  const results = bipReels.map(r => r.textContent);
  let gain = 0;

  if (results.every(s => s === results[0])) {
    gain = 8100000;
    bipResultDiv.textContent = `🎉 BIP大当たり！ +${gain}点`;
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 1500);
  } else if (new Set(results).size === 2) {
    gain = 40000;
    bipResultDiv.textContent = `✨ BIPチャンス！ +${gain}点`;
  } else {
    gain = 0;
    bipResultDiv.textContent = `😢 ハズレ... +0点`;
  }

  currentScore += gain;
  bipResultDiv.textContent += ` | 現在スコア: ${currentScore}`;

  // ランキング送信
  const name = playerNameInput.value.trim() || "名無し";
  socket.emit("score", { name, score: currentScore });
}

// --- イベント ---
bipSpinBtn.addEventListener("click", startBipSpin);
bipStopBtns.forEach((btn, i) => btn.addEventListener("click", () => stopBipReel(i)));
// アイテム管理
const buyGeodeBtn = document.getElementById("buyGeode");
const itemsList = document.getElementById("itemsList");

let inventory = [];

// 購入
buyGeodeBtn.addEventListener("click", () => {
  if (currentScore < 1000) {
    alert("お金が足りません！");
    return;
  }
  currentScore -= 1000;
  inventory.push("ジオード");
  updateInventory();
});

// インベントリ表示更新
function updateInventory() {
  itemsList.innerHTML = "";
  inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    const useBtn = document.createElement("button");
    useBtn.textContent = "使う";
    useBtn.addEventListener("click", () => useItem(index));
    li.appendChild(useBtn);
    itemsList.appendChild(li);
  });
}

// アイテム使用
function useItem(index) {
  const item = inventory[index];
  if (item === "ジオード") {
    // ランダムで報酬
    const rand = Math.random() * 100;
    let reward = 0;
    if (rand <= 1) reward = 100000;       // 1%
    else if (rand <= 6) reward = 10000;   // 5%
    else reward = 0;                       // 94%
    
    alert(`ジオードを開けた！ +${reward}円`);
    currentScore += reward;
  }

  // 使用済みアイテム削除
  inventory.splice(index, 1);
  updateInventory();
}

const raceTrack = document.getElementById("raceTrack");
const selectedHorse = document.getElementById("selectedHorse");
const startRaceBtn = document.getElementById("startRaceBtn");
const raceResult = document.getElementById("raceResult");

// 馬情報
const horsesData = [
  { name: "1号馬", speed: 9, stamina: 12 },
  { name: "2号馬", speed: 9, stamina: 11 },
  { name: "3号馬", speed: 9, stamina: 11 },
  { name: "4号馬", speed: 8, stamina: 13 }
];

// 選択肢に反映
horsesData.forEach((h, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = h.name;
  selectedHorse.appendChild(opt);

  const div = document.createElement("div");
  div.id = `horse${i}`;
  div.textContent = "🐎";
  div.style.position = "absolute";
  div.style.left = "0%";
  div.style.top = `${i*30}px`;
  div.style.transition = "left 0.5s linear";
  raceTrack.appendChild(div);
});

// レース開始
startRaceBtn.addEventListener("click", () => {
  const bet = Number(document.getElementById("betAmount").value);
  const pick = Number(selectedHorse.value);
  if (isNaN(bet) || bet <= 0 || bet > currentScore) {
    alert("掛け金が正しくありません");
    return;
  }

  currentScore -= bet;
  raceResult.textContent = "";
  
  const raceDistance = 100; // %
  const positions = [0,0,0,0];
  let finished = false;

  const interval = setInterval(() => {
    horsesData.forEach((h, i) => {
      if (positions[i] < raceDistance) {
        // スピード + ランダム補正
        positions[i] += h.speed + Math.random()*3;
        if (positions[i] > raceDistance) positions[i] = raceDistance;
        document.getElementById(`horse${i}`).style.left = positions[i] + "%";
      }
    });

    if (!finished && positions.some(p => p >= raceDistance)) {
      finished = true;
      clearInterval(interval);

      // 順位計算
      const horseRank = positions.map((p,i)=>({i,p})).sort((a,b)=>b.p-a.p).map(e=>e.i);
      const winnerIndex = horseRank[0];

      let gain = 0;
      if (pick === winnerIndex) {
        gain = bet * 5; // 当たれば5倍
        raceResult.textContent = `🎉 あなたの馬が1位！ +${gain}点`;
      } else {
        raceResult.textContent = `😢 外れました。掛け金-${bet}点`;
      }

      currentScore += gain;

      // ランキング送信
      const name = playerNameInput.value.trim() || "名無し";
      socket.emit("score", { name, score: currentScore });
    }
  }, 500);
});
