
var squares = {}
const player = "X"
const robot = "O"
var turn;
var squares_elements = document.querySelectorAll(".square")
var player_positions ;
var stop;
var robot_positions ;
var counter;
var mode = 0;

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
  player_positions.push(position)
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
  if (check("s1", "s2", "s3")) {
    winner_squares = ["s1", "s2", "s3"]
  }
  else if (check("s4", "s5", "s6")) {
    winner_squares = ["s4", "s5", "s6"]
  }
  else if (check("s7", "s8", "s9")) {
    winner_squares = ["s7", "s8", "s9"]
  }
  else if (check("s1", "s4", "s7")) {
    winner_squares = ["s1", "s4", "s7"]
  }
  else if (check("s2", "s5", "s8")) {
    winner_squares = ["s2", "s5", "s8"]
  }
  else if (check("s3", "s6", "s9")) {
    winner_squares = ["s3", "s6", "s9"]
  }
  else if (check("s1", "s5", "s9")) {
    winner_squares = ["s1", "s5", "s9"]
  }
  else if (check("s3", "s5", "s7")) {
    winner_squares = ["s3", "s5", "s7"]
  } else {
    if (gameOver()) {
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
  player_positions=[]
  robot_positions=[]
  squares_elements.forEach(e => {
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
    
    if (player_positions.length === 1) {
      const positions = ["s1","s3",'s7',"s9","s5"].filter(p=>squares[p]===null)
      position = positions[Math.floor(Math.random() * positions.length)]
    }else if( player_positions.length<4){
      position = check_if_can_win(...robot_positions)
      if (!position) {
        // if player can win
        position = check_if_can_win(...player_positions)
        // random position
      }
    }else{
      // hard mode 
      // if robot can winn
      if (mode === 3) {
          position = check_if_can_win(...robot_positions)
          if (!position) {
            // check player can win
            position = check_if_can_win(...player_positions)
          }
      }
    }
  }

  // eseay

  if (!position) {
    const positions = positions_id.filter(p=>!(player_positions.includes(p) || robot_positions.includes(p)))
    position = positions[Math.floor(Math.random() * positions.length)]
  }
 
  // const random_square = remainingSquares[randomKey]
  squares[position] = robot
  document.querySelector("#"+position).innerText = robot
  robot_positions.push(position)
  checkWinner()
  changeTurn()
  }




function check_if_can_win(s1,s2,s3=null,s4=null){

  let position = false
  for (let row of rows) {
    if ( row.includes(s1) && row.includes(s2)) {
      const s = row.filter(p=>p!==s1&&p!==s2)[0]
      if (squares[s]===null) {
        position = s
        break
      }
    }
    if (s3===null) {
      continue
    }
    if ( row.includes(s1) && row.includes(s3)) {
      const s = row.filter(p=>p!==s1&&p!==s3)[0]
      if (squares[s]===null) {
        position = s
        break
      }
    }
    if ( row.includes(s2) && row.includes(s3)) {
      const s = row.filter(p=>p!==s2&&p!==s3)[0]
      if (squares[s]===null) {
        position = s
        break
      }
    }
    if (s4===null) {
      continue
    }
    if ( row.includes(s1) && row.includes(s4)) {
      const s = row.filter(p=> p !== s1 && p !== s4)[0]
      if (squares[s]===null) {
        position = s
        break
      }
    }
    if ( row.includes(s2) && row.includes(s4)) {
      const s = row.filter(p=>p!==s2&&p!==s4)[0]
      if (squares[s]===null) {
        position = s
        break
      }
    }
    if ( row.includes(s3) && row.includes(s4)) {
      const s = row.filter(p=>p!==s3&&p!==s4)[0]
      if (squares[s]===null) {
        position = s
        break
      }
    }
  }

  return position;
  
}

// start game
initializeGame()


