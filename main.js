var squares_elements;
var squares = {}
const player = "X"
const robot = "O"
var turn;
var stop = false;



function handlePlayerClick(e) {
  if (e.target.innerText !== "" || !(turn === player) || stop) return
  const key = e.target.id.split("")[1]
  squares[key] = player
  e.target.innerText = player
  changeTurn()
  checkWinner()
  handleRobotPlay()
}

function handleRobotPlay() {
  if (stop) return
  const otherSquares = [...squares_elements].filter(s => s.innerText === "")
  if (otherSquares.length === 0) {
    return
  }
  setTimeout(() => {
    const randomKey = Math.floor(Math.random() * otherSquares.length)
    const random_square = otherSquares[randomKey]
    squares[random_square.id.split("")[1]] = robot
    random_square.innerText = robot
    changeTurn()
    checkWinner()
  }, 1500);
}

function changeTurn() {
  turn = turn === player ? robot : player
}



function checkWinner() {
  let winner_squares = []
  if (check(1, 2, 3)) {
    winner_squares = [1, 2, 3]
  }
  else if (check(4, 5, 6)) {
    winner_squares = [4, 5, 6]
  }
  else if (check(7, 8, 9)) {
    winner_squares = [7, 8, 9]
  }
  else if (check(1, 4, 7)) {
    winner_squares = [1, 4, 7]
  }
  else if (check(2, 5, 8)) {
    winner_squares = [2, 5, 8]
  }
  else if (check(3, 6, 9)) {
    winner_squares = [3, 6, 9]
  }
  else if (check(1, 5, 9)) {
    winner_squares = [1, 5, 9]
  }
  else if (check(3, 5, 7)) {
    winner_squares = [3, 5, 7]
  } else {
    // handle ta3adol
    let isTie = true
    for (let i = 1; i < 10; i++) {
      if (squares[i] === null) {
        isTie = false
        break
      }
    }

    if (isTie) {
      // 

      setTimeout(() => {
        initializeGame()
      }, 2000);
    }
  }

  if (winner_squares.length) {
    stop = true
    handleWin(winner_squares)
  }

}

function check(s1, s2, s3) {
  return squares[s1] === squares[s2] && squares[s1] === squares[s3] && squares[s1] !== null
}

function handleWin(winner_squares) {
  let winner = squares[winner_squares[0]] === player ? "player" : "robot";
  for (let i of winner_squares) {
    document.querySelector("#s" + i).style.color = "yellow"
  }

  let score = document.querySelector("." + winner + " .score")
  score.innerText = +score.innerText + 1

  setTimeout(() => {
    initializeGame()
  }, 2000)
}
initializeGame()

function initializeGame() {

  squares_elements = document.querySelectorAll(".square")
  turn = player
  stop = false

  let i = 0
  squares_elements.forEach(e => {
    e.innerText = ""
    e.style.color = "white"
    squares[++i] = null
    e.onclick = handlePlayerClick
  })

}