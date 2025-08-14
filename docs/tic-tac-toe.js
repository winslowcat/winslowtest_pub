var cells = null;
var board = null;
var currentPlayer = 'X';
var vsAI = false;

function startGame(mode) {
  vsAI = (mode === 'ai');
  document.getElementById('mode-select').style.display = 'none';
  document.getElementById('board').className = '';
  document.getElementById('reset').className = '';
  board = new Array(9);
  for (var i = 0; i < 9; i++) board[i] = null;
  currentPlayer = 'X';
  cells = document.querySelectorAll('.cell');
  cells.forEach(function(cell) {
    cell.innerHTML = '';
    cell.onclick = handleCellClick;
  });
  setStatus('Player ' + currentPlayer + "'s turn");
}

function handleCellClick() {
  var index = this.getAttribute('data-index');
  if (board[index] || checkWinner(board)) return;
  makeMove(this, index, currentPlayer);
  if (checkWinner(board)) {
    setStatus('Player ' + currentPlayer + ' wins!');
    endGame();
    return;
  }
  if (boardFull(board)) {
    setStatus('Draw!');
    endGame();
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus('Player ' + currentPlayer + "'s turn");
  if (vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 300);
  }
}

function makeMove(cell, index, player) {
  board[index] = player;
  cell.innerHTML = player;
}

function aiMove() {
  var best = minimax(board.slice(), 'O').index;
  var cell = document.querySelector('.cell[data-index="' + best + '"]');
  makeMove(cell, best, 'O');
  if (checkWinner(board)) {
    setStatus('Player O wins!');
    endGame();
    return;
  }
  if (boardFull(board)) {
    setStatus('Draw!');
    endGame();
    return;
  }
  currentPlayer = 'X';
  setStatus('Player ' + currentPlayer + "'s turn");
}

function minimax(newBoard, player) {
  var availSpots = [];
  for (var i = 0; i < 9; i++) if (!newBoard[i]) availSpots.push(i);
  var win = checkWinner(newBoard);
  if (win === 'X') return { score: -10 };
  if (win === 'O') return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;
    if (player === 'O') {
      move.score = minimax(newBoard, 'X').score;
    } else {
      move.score = minimax(newBoard, 'O').score;
    }
    newBoard[availSpots[i]] = null;
    moves.push(move);
  }
  var bestMove = 0;
  if (player === 'O') {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function checkWinner(b) {
  var lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (var i = 0; i < lines.length; i++) {
    var a = lines[i][0];
    var bb = lines[i][1];
    var c = lines[i][2];
    if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
  }
  return null;
}

function boardFull(b) {
  for (var i = 0; i < 9; i++) if (!b[i]) return false;
  return true;
}

function endGame() {
  cells.forEach(function(cell){ cell.onclick = null; });
}

function resetGame() {
  document.getElementById('mode-select').style.display = '';
  document.getElementById('board').className = 'hidden';
  document.getElementById('reset').className = 'hidden';
  document.getElementById('status').innerHTML = '';
}

function setStatus(msg) {
  document.getElementById('status').innerHTML = msg;
}
