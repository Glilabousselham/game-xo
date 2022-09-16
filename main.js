
var squares = {}
const player = "X"
const robot = "O"
var turn;
var stop;
var counter;
var positions
var who_played_first = robot;

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


function playerPlay(e) {

  if (e.target.innerText !== "" || !(turn === player) || gameOver()) return
  const position = e.target.id
  game_data += position.replace("s","p")+"-"
  squares[position] = player
  e.target.innerText = player
  counter++
  checkWinner()
  changeTurn()
  robotPlay()
}

function robotPlay() {
  if (gameOver())  return
  counter++
  setTimeout(handleRobotPlay, 700);
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

  changeWhoPlayedFirst()

  turn = who_played_first
  stop = false
  let i = 0
  counter = 0
  stop = false
  document.querySelectorAll(".square").forEach(e => {
    e.innerText = ""
    e.style.color = "white"
    squares["s" + ++i] = null
    e.onclick = playerPlay
  })

  if (turn === robot) {
    robotPlay()
  }
}

function changeWhoPlayedFirst(){
  if(who_played_first === null) {
    who_played_first = player
  }else{
    who_played_first = who_played_first===player?robot:player;
  }
}

function gameOver(){return counter === 9 || stop}


async function handleRobotPlay() {
  // intermadiate
  let position;
  
  if (who_played_first===robot) {
    position = await robotAttack()
  }else{
    position = await robotDefense()
  }

  if (!position) {
    positions = getPlaces(null)
    position = positions[Math.floor(Math.random() * positions.length)]
  }

  game_data += position.replace("s","r")+"-"
  squares[position] = robot
  document.querySelector("#"+position).innerText = robot
  checkWinner()
  changeTurn()
}

async function robotAttack(){
  let position;

  positions = ["s1","s3","s5",'s7',"s9"]
  if (getPlaces(robot).length<=1) {
    positions = positions.filter(p=>squares[p]===null)
    position = positions[Math.floor(Math.random() * positions.length)]
    return position
  }

  position = checkAllPossibilities()
  
  
  return position
}

async function robotDefense(){
  let position;
  if (getPlaces(player).length === 1) {
    if (getPlaces(player)[0]==="s5") {
      positions = ["s1","s3",'s7',"s9"]
      position = positions[Math.floor(Math.random() * positions.length)]
    }else {
      position = "s5"
    }
    return position
  }

  position = checkAllPossibilities()

  return position
}


function getPlaces(player){return Object.keys(squares).filter((sq) => squares[sq] === player)}


function check_possibility(target,place=null,place_to_fill=null){
  // const rows = [
  //   ["s1", "s2", "s3"],
  //   ["s4", "s5", "s6"],
  //   ["s7", "s8", "s9"],
  //   ["s1", "s4", "s7"],
  //   ["s2", "s5", "s8"],
  //   ["s3", "s6", "s9"],
  //   ["s1", "s5", "s9"],
  //   ["s3", "s5", "s7"]
  // ]

  const copySquares = {...squares}

  let places = getPlaces(target)

  if (place) places.push(place)

  if (place_to_fill) {
    const enime = target === player?robot:player;
    copySquares[place_to_fill] = enime 
  }

  if (places.length===1) return false
  
  for (let p1 of places) {
    for (let p2 of places) {
      if (p1===p2) continue
      for (let row of rows) {
        if ( row.includes(p1) && row.includes(p2)) {
          const s = row.filter(p=>p!==p1&&p!==p2)[0]
          if (copySquares[s]===null) {
            return s
          }
          break;
        }
      }
    }
  }
  return false;
}

function checkPlaceCanMakeTwePossibilies(target,place_to_avoid=null){
  let emptyPlaces = getPlaces(null)

  if (place_to_avoid!== null) {
    emptyPlaces = emptyPlaces.filter(p=>p!==place_to_avoid)
  }

  for (place of emptyPlaces) {
    
    const check1 = check_possibility(target,place)
    if (check1) {
      const check2 = check_possibility(target,place,check1)
      if (check2) {
        return place
      }
    }
  }

  return false

}

function checkPlaceCanMakeOnePossibility(target){
  let emptyPlaces = getPlaces(null)
  for (place of emptyPlaces) {
    const check = check_possibility(target,place)
    if (check) {
      return place
    }
  }

  return false

}

function checkTwePlacesCanMakeTwePossibilies(target) {
  let position1 = false;
  
  position1  = checkPlaceCanMakeTwePossibilies(target)
  
  if (position1) {
    let position2 = false;
    position2 = checkPlaceCanMakeTwePossibilies(target,position1)
    if (position2) {
      if (+position1.split("")[1]%2===1 && +position2.split("")[1]%2===1) {
        const emptyPlaces = getPlaces(null).filter(p=>![position1,position2].includes(p))
        return emptyPlaces[Math.floor(Math.random()*emptyPlaces.length)]
      }
      if (+position1.split("")[1]%2===1) {
        return position1
      }
      return position2
    }
  }
  return position1
}

function checkAllPossibilities() {
  let position = false
  // if i can win
  position = check_possibility(robot)
  // console.log("check_possibility(robot)",position);
  if (position) return position

  // if player can win
  position = check_possibility(player)
  // console.log("check_possibility(player)",position);
  if (position) return position

  // if i can mak to possibility of win
  position = checkTwePlacesCanMakeTwePossibilies(robot)
  // console.log("checkTwePlacesCanMakeTwePossibilies(robot)",position);
  if (position) return position

  // if player can mak to possibility of win
  position = checkTwePlacesCanMakeTwePossibilies(player)
  // console.log("checkTwePlacesCanMakeTwePossibilies(player)",position);
  if (position) return position

  return position
}

// start game
initializeGame()


