var squares = {};
const player = "X";
const robot = "O";
var turn;
var stop = false;

var squares_elements = document.querySelectorAll(".square");

function handlePlayerPlay(e) {
  if (e.target.innerText !== "" || !(turn === player) || stop) return;
  const key = e.target.id;
  squares[key] = player;
  e.target.innerText = player;
  checkWinner();
  changeTurn();
  handleRobotPlay();
}

function handleRobotPlay() {
  if (stop) return;
  const otherSquares = [...squares_elements].filter((s) => s.innerText === "");
  setTimeout(() => {
    let randomKey = Math.floor(Math.random() * otherSquares.length);
    let possibleWins = checkPossiblePlayerWin();
    if (possibleWins.length > 0) {
      console.log("possibleWins");
      console.log(possibleWins);
      randomKey = otherSquares.map((oSQ) => oSQ.id).indexOf(possibleWins[0]);
    }
    console.log(`randomKey : ${randomKey}`);
    const random_square = otherSquares[randomKey];
    squares[random_square.id] = robot;
    random_square.innerText = robot;
    checkWinner();
    changeTurn();
  }, 1500);
}

function changeTurn() {
  turn = turn === player ? robot : player;
}

function checkWinner() {
  let winner_squares = [];
  if (check("s1", "s2", "s3")) {
    winner_squares = ["s1", "s2", "s3"];
  } else if (check("s4", "s5", "s6")) {
    winner_squares = ["s4", "s5", "s6"];
  } else if (check("s7", "s8", "s9")) {
    winner_squares = ["s7", "s8", "s9"];
  } else if (check("s1", "s4", "s7")) {
    winner_squares = ["s1", "s4", "s7"];
  } else if (check("s2", "s5", "s8")) {
    winner_squares = ["s2", "s5", "s8"];
  } else if (check("s3", "s6", "s9")) {
    winner_squares = ["s3", "s6", "s9"];
  } else if (check("s1", "s5", "s9")) {
    winner_squares = ["s1", "s5", "s9"];
  } else if (check("s3", "s5", "s7")) {
    winner_squares = ["s3", "s5", "s7"];
  } else {
    if (gameOver()) {
      //
      stop = true;
      setTimeout(() => {
        initializeGame();
      }, 2000);
    }
  }

  if (winner_squares.length) {
    stop = true;
    handleWin(winner_squares);
  }
}

function check(s1, s2, s3, sq = squares, symbol = null) {
  if (symbol == null) {
    return sq[s1] === sq[s2] && sq[s1] === sq[s3] && sq[s1] !== null;
  }

  return (
    sq[s1] === sq[s2] &&
    sq[s1] === sq[s3] &&
    sq[s1] !== null &&
    sq[s1] == symbol
  );
}

function handleWin(winner_squares) {
  let winner = squares[winner_squares[0]] === player ? "player" : "robot";
  for (let s of winner_squares) {
    document.querySelector("#" + s).style.color = "yellow";
  }
  let score = document.querySelector("." + winner + " .score");
  score.innerText = +score.innerText + 1;
  setTimeout(() => {
    initializeGame();
  }, 2000);
}

function initializeGame() {
  turn = player;
  stop = false;
  let i = 0;
  squares_elements.forEach((e) => {
    e.innerText = "";
    e.style.color = "white";
    squares["s" + ++i] = null;
    e.onclick = handlePlayerPlay;
  });
}

function gameOver() {
  let remainingSquares = [...document.querySelectorAll(".square")].filter(
    (e) => e.innerHtml !== ""
  );
  return remainingSquares.length === 0;
}

// check next possible win:

function checkPossiblePlayerWin() {
  let placed = Object.keys(squares).filter((sq) => {
    return squares[sq] === player;
  });
  if (placed.length <= 1) {
    return [];
  }
  if (placed.length > 2) {
    placed = placed.slice(placed.length - 2);
  }
  console.log("placed");
  console.log(placed);

  let emptySq = Object.keys(squares).filter((sq) => {
    return squares[sq] === null;
  });

  let sqCopy = {};
  Object.assign(sqCopy, squares);

  let winnerTriplets = ["123", "456", "789", "159", "357", "147", "258", "369"];

  let possibleWin = emptySq.filter((sq) => {
    return winnerTriplets.includes(
      [...placed, sq]
        .map((squ) => squ.replace("s", ""))
        .sort((a, b) => parseInt(a) - parseInt(b))
        .join("")
    );
  });
  return possibleWin;
}

initializeGame();
