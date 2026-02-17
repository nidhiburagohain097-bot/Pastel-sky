<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Pastel Stack ✨</title>
<style>
  body {
    margin: 0;
    overflow: hidden;
    font-family: "Comic Sans MS", cursive;
    background: linear-gradient(135deg,
      #ffdee9,
      #ffc3a0,
      #fbc2eb,
      #a6c1ee);
    background-size: 400% 400%;
    animation: gradientMove 12s ease infinite;
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  canvas {
    display: block;
    margin: auto;
  }

  #score {
    position: absolute;
    top: 20px;
    width: 100%;
    text-align: center;
    font-size: 22px;
    color: #ffffff;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255,255,255,0.8);
  }

  #message {
    position: absolute;
    top: 60px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: white;
    font-weight: bold;
  }

  #gameOver {
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
    transform: translateY(-50%);
    font-size: 28px;
    color: white;
    display: none;
  }

  button {
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    background: white;
    font-size: 16px;
    margin-top: 15px;
  }
</style>
</head>
<body>

<div id="score">Score: 0</div>
<div id="message"></div>
<div id="gameOver">
  Game Over 💔<br/>
  <button onclick="restartGame()">Try Again ✨</button>
</div>

<canvas id="gameCanvas"></canvas>

<audio id="bgMusic" loop>
  <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sweet-background-music-110624.mp3" type="audio/mpeg">
</audio>

<script>
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const music = document.getElementById("bgMusic");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let blocks = [];
let currentBlock;
let direction = 1;
let speed = 3;
let score = 0;
let combo = 0;
let gameRunning = true;

const emojis = ["🌸","✨","💖","🧁","🌼","🍓","🐰"];

function createBlock(width, y) {
  return {
    x: (canvas.width - width) / 2,
    y: y,
    width: width,
    height: 40,
    emoji: emojis[Math.floor(Math.random()*emojis.length)],
    moving: true
  };
}

function startGame() {
  blocks = [];
  score = 0;
  combo = 0;
  speed = 3;
  gameRunning = true;

  document.getElementById("gameOver").style.display = "none";
  document.getElementById("message").innerText = "";

  let base = createBlock(150, canvas.height - 80);
  base.moving = false;
  blocks.push(base);

  currentBlock = createBlock(150, canvas.height - 130);
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  blocks.forEach(block => {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(block.x, block.y, block.width, block.height);
    ctx.font = "28px serif";
    ctx.fillText(block.emoji, block.x + block.width/2 - 14, block.y + 28);
  });

  if (currentBlock.moving) {
    currentBlock.x += speed * direction;
    if (currentBlock.x <= 0 || currentBlock.x + currentBlock.width >= canvas.width) {
      direction *= -1;
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
  ctx.font = "28px serif";
  ctx.fillText(currentBlock.emoji, currentBlock.x + currentBlock.width/2 - 14, currentBlock.y + 28);

  requestAnimationFrame(update);
}

function dropBlock() {
  if (!gameRunning) return;

  music.play();

  let last = blocks[blocks.length - 1];
  let overlap = Math.min(
    currentBlock.x + currentBlock.width,
    last.x + last.width
  ) - Math.max(currentBlock.x, last.x);

  if (overlap <= 0) {
    gameOver();
    return;
  }

  currentBlock.width = overlap;
  currentBlock.x = Math.max(currentBlock.x, last.x);
  currentBlock.moving = false;

  blocks.push(currentBlock);
  score++;
  combo++;

  document.getElementById("score").innerText = "Score: " + score;

  if (combo >= 3) {
    document.getElementById("message").innerText = "Perfect Combo ✨";
  } else {
    document.getElementById("message").innerText = "";
  }

  if (score % 5 === 0) speed += 0.5;

  currentBlock = createBlock(overlap, currentBlock.y - 45);
}

function gameOver() {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
}

function restartGame() {
  startGame();
}

window.addEventListener("click", dropBlock);

startGame();
update();
</script>

</body>
</html>
