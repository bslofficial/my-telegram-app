import { db, ref, set } from "./firebase.js";

const tg = window.Telegram.WebApp;
tg.expand();

const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const width = 8;
const squares = [];
let score = 0;
let timeLeft = 60;
let selected = null;
let target = null;

// Telegram User
const userId = tg.initDataUnsafe?.user?.id || "guest";
const username = tg.initDataUnsafe?.user?.username || "Guest";

// ------------------ Dynamic Adsgram Load ------------------
let AdController = null;

function initAds() {
  if (window.Adsgram && typeof window.Adsgram.init === "function") {
    AdController = window.Adsgram.init({ blockId: "bot-23742" });
    document.getElementById("watchAdBtn").onclick = showRewardedAd;
  } else {
    console.warn("Adsgram SDK not loaded yet, retrying...");
    setTimeout(initAds, 500);
  }
}

function loadAdsgramSDK() {
  const s = document.createElement("script");
  s.src = "https://sad.adsgram.ai/js/adsgram-ad-sdk.js";
  s.onload = initAds;
  s.onerror = () => console.warn("Failed to load Adsgram SDK");
  document.body.appendChild(s);
}

loadAdsgramSDK();

// ------------------ Game Board ------------------
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.className = "candy-" + Math.floor(Math.random() * 5);
    square.id = i;

    square.addEventListener("click", () => {
      if (selected === null) {
        selected = i;
      } else {
        target = i;
        moveCandies();
        selected = null;
      }
    });

    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

function moveCandies() {
  const validMoves = [selected - 1, selected + 1, selected - width, selected + width];
  if (!validMoves.includes(target)) return;

  const temp = squares[selected].className;
  squares[selected].className = squares[target].className;
  squares[target].className = temp;

  if (!checkMatches()) {
    squares[target].className = squares[selected].className;
    squares[selected].className = temp;
  }
}

function checkMatches() {
  let matched = false;
  for (let i = 0; i < 64; i++) {
    if (i % width > 5) continue;
    const row = [i, i + 1, i + 2];
    const color = squares[i].className;

    if (row.every(idx => squares[idx].className === color)) {
      matched = true;
      score += 10;
      scoreDisplay.innerText = score;
      row.forEach(idx => squares[idx].className = "candy-" + Math.floor(Math.random() * 5));
    }
  }
  return matched;
}

// ------------------ Score Save ------------------
function saveScore() {
  set(ref(db, "leaderboard/" + userId), {
    name: username,
    score: score,
    timestamp: Date.now()
  });
}

// ------------------ Rewarded Ad ------------------
function showRewardedAd() {
  if (!AdController) {
    alert("Ad not ready yet, try again later.");
    return;
  }
  const btn = document.getElementById("watchAdBtn");
  btn.disabled = true;
  btn.innerText = "Loading...";
  AdController.show().then(() => {
    score += 500;
    scoreDisplay.innerText = score;
    alert("+500 Points Added!");
    btn.disabled = false;
    btn.innerText = "📺 Watch Ad +500";
  }).catch(() => {
    alert("Ad failed to load.");
    btn.disabled = false;
    btn.innerText = "📺 Watch Ad +500";
  });
}

// ------------------ Spin Wheel ------------------
function spinWheel() {
  const rewards = [100, 200, 300, 500, 1000];
  const win = rewards[Math.floor(Math.random() * rewards.length)];
  score += win;
  scoreDisplay.innerText = score;
  alert("You won " + win + " coins!");
}

// ------------------ Withdraw ------------------
function withdraw() {
  if (score < 5000) {
    alert("Minimum 5000 coins required");
    return;
  }
  set(ref(db, "withdraw/" + userId), { name: username, coins: score, status: "pending" });
  alert("Withdraw request sent to admin!");
}

// ------------------ Invite ------------------
function invite() {
  const link = "https://t.me/bslgames_bot?start=" + userId;
  tg.openTelegramLink(link);
}

// ------------------ Timer ------------------
const gameTimer = setInterval(() => {
  timeLeft--;
  timerDisplay.innerText = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(gameTimer);
    saveScore();
    alert("Game Over! Score: " + score);
    location.reload();
  }
}, 1000);

// Auto check matches
setInterval(checkMatches, 300);

// Daily Reward
const today = new Date().toDateString();
if (localStorage.getItem("loginDate") !== today) {
  score += 100;
  localStorage.setItem("loginDate", today);
  scoreDisplay.innerText = score;
}