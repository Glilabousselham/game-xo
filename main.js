
var squares = {}
const player = "X"
const robot = "O"
var turn;
var stop;
var counter;
var mode = 0;
var positions

document.querySelector("#mode").onchange=(e)=>{
  const v = e.target.value
  if (v === 0) {
    return window.alert("please select an other option")
  }
  mode = +v
  e.target.setAttribute("disabled","")
}


var positions_id = ["s1", "s2", "s3","s4", "s5", "s6","s7", "s8", "s9"] 
const rows = [
  ["s1", "s2", "s3"],
  ["s4", "s5", "s6"],
  ["s7", "s8", "s9"],
  ["s1", "s4", "s7"],
  ["s2", "s5", "s8"],
  ["s3", "s6", "s9"],
  ["s1", "s5", "s9"],
  ["s3", "s5", "s7"]
]


function handlePlayerPlay(e) {

  if (mode===0) {
    window.alert("please select the defficulty mode before start the game")
    return
  }

  if (e.target.innerText !== "" || !(turn === player) || gameOver()) return
  const position = e.target.id
  squares[position] = player
  e.target.innerText = player
  counter++
  checkWinner()
  changeTurn()
  handleRobotPlay()
}

function handleRobotPlay() {
  if (gameOver())  return
  counter++
  setTimeout(robotPlay, 700);
}

function changeTurn() {
  turn = turn === player ? robot : player
}

function checkWinner() {
  const check = (s1, s2, s3) => squares[s1] === squares[s2] && squares[s1] === squares[s3] && squares[s1] !== null
  let winner_squares = []
  for(let row of rows){
    if (!check(...row)) continue
    winner_squares = row
  }
  if (gameOver()) {
    setTimeout(() => {
      initializeGame()
    }, 2000);
  }
  if (winner_squares.length) {
    stop = true
    handleWin(winner_squares)
  }
} 

function handleWin(winner_squares) {
  let winner = squares[winner_squares[0]] === player ? "player" : "robot";
  for (let s of winner_squares) {
    document.querySelector("#" + s).style.color = "yellow"
  }
  let score = document.querySelector("." + winner + " .score")
  score.innerText = +score.innerText + 1
  setTimeout(() => {
    initializeGame()
  }, 2000)
}


function initializeGame() {

 
  turn = player
  stop = false
  let i = 0
  counter = 0
  stop = false
  document.querySelectorAll(".square").forEach(e => {
    e.innerText = ""
    e.style.color = "white"
    squares["s" + ++i] = null
    e.onclick = handlePlayerPlay
  })
}


function gameOver(){
 return counter === 9 || stop
}

function robotPlay() {
  if (gameOver()) return

  // intermadiate
  var position;
  if (mode > 1) {
    if (getPlaces(player).length === 1) {
      if (mode<4) {
        positions = ["s1","s3",'s7',"s9"]
        position = positions[Math.floor(Math.random() * positions.length)]
      }else{
        if (getPlaces(player)[0]==="s5") {
          positions = ["s1","s3",'s7',"s9"]
          position = positions[Math.floor(Math.random() * positions.length)]
        }else {
          position = "s5"
        }
      }
    }else if (getPlaces(player).length === 2 && mode === 4) {
      positions = ["s1","s3",'s7',"s9"]
      if (positions.includes(getPlaces(player)[0]) && positions.includes(getPlaces(player)[1])) {
        positions = ["s2","s4",'s6',"s8"]
        position = positions[Math.floor(Math.random() * positions.length)]
      }else if(!check_possibility(player)){
        positions = ["s1","s3",'s7',"s9"].filter(p=>squares[p]===null)
        position = positions[Math.floor(Math.random() * positions.length)]
      }
    }


      // check robot
    if (!position && mode > 2) {
      position = check_possibility(robot)
      if (!position) {
        // check player can win
        position = check_possibility(player)
      }
    }
  }
    
  
  if (!position) {
    positions = positions_id.filter(p=>squares[p]===null)
    position = positions[Math.floor(Math.random() * positions.length)]
  }

  squares[position] = robot
  document.querySelector("#"+position).innerText = robot
  checkWinner()
  changeTurn()
  }

function getPlaces(player){
  return Object.keys(squares).filter((sq) => {
    return squares[sq] === player;
  });
}


function check_possibility(player){
  const rows = [
    ["s1", "s2", "s3"],
    ["s4", "s5", "s6"],
    ["s7", "s8", "s9"],
    ["s1", "s4", "s7"],
    ["s2", "s5", "s8"],
    ["s3", "s6", "s9"],
    ["s1", "s5", "s9"],
    ["s3", "s5", "s7"]
  ]

  let places = getPlaces(player)

  if (places.length===1) return false
  
  for (let p1 of places) {
    for (let p2 of places) {
      if (p1===p2) continue
      for (let row of rows) {
        if ( row.includes(p1) && row.includes(p2)) {
          const s = row.filter(p=>p!==p1&&p!==p2)[0]
          if (squares[s]===null) {
            return s
          }
          break;
        }
      }
    }
  }
  return false;
}


// start game
initializeGame()


