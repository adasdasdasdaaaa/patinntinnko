import express from "express";
const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Pachislot running on port ${PORT}`);
});
