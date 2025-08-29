const symbols = ["🍒", "7️⃣", "BAR", "⭐", "🍋"];
let coins = 100;

document.getElementById("spinBtn").addEventListener("click", () => {
  if (coins <= 0) {
    document.getElementById("result").textContent = "コインがありません！";
    return;
  }

  coins -= 10;

  const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
  const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
  const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

  document.getElementById("reel1").textContent = reel1;
  document.getElementById("reel2").textContent = reel2;
  document.getElementById("reel3").textContent = reel3;

  if (reel1 === reel2 && reel2 === reel3) {
    coins += 50;
    document.getElementById("result").textContent = "🎉 大当たり！ +50コイン 🎉";
  } else {
    document.getElementById("result").textContent = "はずれ…";
  }

  document.getElementById("coins").textContent = coins;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  coins = 100;
  document.getElementById("coins").textContent = coins;
  document.getElementById("result").textContent = "リセットしました！";
});
