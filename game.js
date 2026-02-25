const tg = window.Telegram.WebApp;
tg.expand();

let tiles = [1, 2, 3, 4, 5, 6, 7, 8, null]; // null মানে খালি ঘর
let moves = 0;
const board = document.getElementById('puzzleBoard');

function renderBoard() {
    board.innerHTML = '';
    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = tile ? 'tile' : 'tile empty';
        div.textContent = tile || '';
        div.onclick = () => moveTile(index);
        board.appendChild(div);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const validMoves = [index - 1, index + 1, index - 3, index + 3];

    if (validMoves.includes(emptyIndex)) {
        // পাশাপাশি বা উপরে-নিচে খালি ঘর থাকলে অদলবদল হবে
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        moves++;
        document.getElementById('moveCount').textContent = moves;
        renderBoard();
        checkWin();
    }
}

function checkWin() {
    const winPattern = [1, 2, 3, 4, 5, 6, 7, 8, null];
    if (JSON.stringify(tiles) === JSON.stringify(winPattern)) {
        document.getElementById('message').textContent = "অভিনন্দন! আপনি জিতেছেন!";
        tg.MainButton.setText("পরবর্তী লেভেল");
        tg.MainButton.show();
    }
}

function shuffle() {
    tiles.sort(() => Math.random() - 0.5);
    moves = 0;
    document.getElementById('moveCount').textContent = moves;
    renderBoard();
}

document.getElementById('shuffleBtn').onclick = shuffle;
shuffle();
