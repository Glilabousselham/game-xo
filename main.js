
var squares = {}
const player = "X"
const robot = "O"
var turn;
var stop;
var counter;
var positions
var who_played_first = robot;
// var game_data = ""

// document.querySelector("#mode").onchange=(e)=>{
//   const v = e.target.value
//   if (v === 0) {
//     return window.alert("please select an other option")
//   }
//   mode = +v
//   e.target.setAttribute("disabled","")
// }


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

  // try {
  //   // send game to the server
  //   postData(winner,game_data)
  // } catch (error) {
  //   console.log(error);
  // }


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

  changeWHoPlayedFirst()

  turn = who_played_first
  stop = false
  let i = 0
  counter = 0
  stop = false
  game_data = ""
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

function changeWHoPlayedFirst(){
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
  


  // if (getPlaces(robot).length>=2) {
  //   position = check_possibility(robot)
  //   // console.log("robot possibility",position);
  //   if (position) return position

  //   position = check_possibility(player)
  //   // console.log("player posibility",position);
  //   if (position) return position
  // }

  // // check history
  // try {
  //   let data = game_data.replace("r","s")
  //   data = data.replace("p","r")
  //   data = data.replace("s","p")
  //   // console.log("game data",game_data);
  //   // console.log("data",data);
  //   let game = (await getData("player",data)).games.game
  //   if (game) {
  //    game = game.split("-").filter(p=>p.startsWith("p")).map(p=>p.replace("p","s"))
  //    position = game[getPlaces(robot).length] 
  //    console.log("history",position);
  //   }
  // } catch (error) {
  //   // console.log(error);
  // }


  
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




      // check hestoies
      // try {
      //   game = (await getData("player",game_data)).games.game // never mind about games but the resolt is 1 game or none
      //   // console.log(game);
      //   if (game) {
      //     let player_positions_history =  game.split("-").filter(p=>p.startsWith("p")).map(p=>p.replace("p","s"))
      //     position =player_positions_history[ getPlaces(player).length]
      //     // console.log("player history win",position);
      //   }
      // } catch (error) {
      //   // console.log(error);
      // }
      // // check robot
      // if (!position) {
      //   position = check_possibility(robot)
      //   if (!position) {
      //     // check player can win
      //     position = check_possibility(player)
      //   }
      // }
  
  return position
}



function getPlaces(player){return Object.keys(squares).filter((sq) => squares[sq] === player)}


function check_possibility(target,place=null,place_to_fill=null){
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

  for (place of emptyPlaces) {
    if (place === place_to_avoid) continue
    

    const check1 = check_possibility(target,place)
    if (check1) {
      // position = place
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
      // avoid the twe
      // and return 
      let enime = target===player?robot:player
      if (squares["s5"] === enime) {
        const emptyPlaces = getPlaces(null).filter(p=>![position1,position2].includes(p))
        return emptyPlaces[Math.floor(Math.random()*emptyPlaces.length)]
      }
      return position1
      

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
  // console.log("checkPlaceCanMakeTwePossibilies(robot)",position);
  if (position) return position

  // if player can mak to possibility of win
  position = checkTwePlacesCanMakeTwePossibilies(player)
  // console.log("checkTwePlacesCanMakeTwePossibilies(player)",position);
  if (position) return position

  return position
}



// const host = window.location.host.split(":")[0]

// function postData(winner,game) {
//   game = game.split("-")
//   game.splice(-1)
//   game = game.join("-")
//   console.log(game);
//   fetch(`http://${host}:8000/api/game`, {
      
//       // Adding method type
//       method: "POST",
      
//       // Adding body or contents to send
//       body: JSON.stringify({
//           winner,game
//       }),
      
//       // Adding headers to the request
//       headers: {
//           "Content-type": "application/json; charset=UTF-8"
//       }
//   }).then(res=>res.json())
//   .then(res=>{console.log(res);})
// }

// function getData(winner,game) {

//   const query = `winner=${winner}&game=${game}`
//   return new Promise((resolve,reject)=>{
//     fetch(`http://${host}:8000/api/game?`+query, {
        
//         // Adding method type
//         method: "GET",
        
//         // Adding headers to the request
//         headers: {
//             "Content-type": "application/json; charset=UTF-8"
//         }
//     })
//     .then(res=>res.json())
//     .then(res=>{resolve(res)})
//     .catch(err=>{reject(err)})
//   })
// }



// start game
initializeGame()


