import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// ランキング（メモリ管理、サーバー再起動でリセット）
let rankings = []; // { name, score }

// ランキング取得 API
app.get("/ranking", (req, res) => {
  res.json(rankings.sort((a, b) => b.score - a.score).slice(0, 10));
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  // スコア送信
  socket.on("score", ({ name, score }) => {
    if (!name || typeof score !== "number") return;
    rankings.push({ name, score });
    // 上位 10 件のみ保持
    rankings = rankings.sort((a, b) => b.score - a.score).slice(0, 10);
    io.emit("ranking", rankings);
  });

  // 初期ランキング送信
  socket.emit("ranking", rankings);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log("Pachislot running on port " + PORT));
