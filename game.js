const tg = window.Telegram.WebApp;
tg.expand();

const grid = document.querySelector('#grid');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer'); // টাইমার ডিসপ্লে
const width = 8;
const squares = [];
let score = 0;
let timeLeft = 60; // ৬০ সেকেন্ড সময়

let selectedSquareId;
let targetSquareId;

// সাউন্ড ইফেক্ট লোড করা
const matchSound = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');

// ক্যান্ডি বোর্ড তৈরি
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        let randomColor = Math.floor(Math.random() * 5);
        square.classList.add(`candy-${randomColor}`);
        square.setAttribute('id', i);
        
        square.addEventListener('touchstart', (e) => {
            selectedSquareId = parseInt(e.target.id);
        });
        
        square.addEventListener('touchend', (e) => {
            let touch = e.changedTouches[0];
            let targetElem = document.elementFromPoint(touch.clientX, touch.clientY);
            if (targetElem && targetElem.parentNode === grid) {
                targetSquareId = parseInt(targetElem.id);
                moveCandies();
            }
        });

        grid.appendChild(square);
        squares.push(square);
    }
}
createBoard();

// ক্যান্ডি অদলবদল করা
function moveCandies() {
    const validMoves = [
        selectedSquareId - 1,
        selectedSquareId - width,
        selectedSquareId + 1,
        selectedSquareId + width
    ];

    if (validMoves.includes(targetSquareId)) {
        let selectedColor = squares[selectedSquareId].className;
        let targetColor = squares[targetSquareId].className;
        
        squares[selectedSquareId].className = targetColor;
        squares[targetSquareId].className = selectedColor;
        
        checkMatches();
    }
}

// ৩টি ক্যান্ডি ম্যাচিং চেক করা
function checkMatches() {
    let hasMatch = false;

    // পাশাপাশি ৩টি (Row)
    for (let i = 0; i < 62; i++) {
        let rowOfThree = [i, i+1, i+2];
        let decidedColor = squares[i].className;
        if ((i + 1) % width !== 0 && (i + 2) % width !== 0 && decidedColor !== '') {
            if (rowOfThree.every(index => squares[index].className === decidedColor)) {
                score += 10;
                scoreDisplay.innerHTML = score;
                hasMatch = true;
                rowOfThree.forEach(index => {
                    squares[index].className = 'candy-' + Math.floor(Math.random() * 5);
                });
            }
        }
    }

    // উপরে-নিচে ৩টি (Column)
    for (let i = 0; i < 47; i++) {
        let columnOfThree = [i, i + width, i + width * 2];
        let decidedColor = squares[i].className;
        if (decidedColor !== '') {
            if (columnOfThree.every(index => squares[index].className === decidedColor)) {
                score += 10;
                scoreDisplay.innerHTML = score;
                hasMatch = true;
                columnOfThree.forEach(index => {
                    squares[index].className = 'candy-' + Math.floor(Math.random() * 5);
                });
            }
        }
    }

    // যদি ম্যাচ হয় তবে শব্দ হবে
    if (hasMatch) {
        matchSound.play().catch(e => console.log("Sound error:", e));
    }
}

// টাইমার ফাংশন
const gameTimer = setInterval(() => {
    timeLeft--;
    if (timerDisplay) timerDisplay.innerHTML = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(gameTimer);
        alert("সময় শেষ! আপনার চূড়ান্ত স্কোর: " + score);
        location.reload(); 
    }
}, 1000);

window.setInterval(checkMatches, 300);
