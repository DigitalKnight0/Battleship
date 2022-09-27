import battleShip from "./battleship"
// const battleShip = require("./battleship")
const gameBoard = () => {

    const board = {}
    const ships = []

    const Cells = {
        hit: "hit",
        miss: "miss",
        empty: "empty",
        ship: "ship"
    }

    const init = ((x, y) => {
        for(let i = 0; i < x; i++){
            for(let j=1; j <= y; j++){
                const column = String.fromCharCode(65 + i)
                const cell = column + j
                board[cell] = Cells.empty
            }
        }
    })(10, 10)

    const canPlaceShip = (cords) => {
        return cords.reduce((state, cord) => {
            return state != false && board[cord] === "empty" ? true : false
        }, true)
    }

    const placeShip = (cords) => {
        if(!canPlaceShip(cords)) return false;
        const ship = battleShip(cords, cords.length)
        cords.forEach(cord => {
            board[cord] = Cells.ship
        })
        ships.push(ship)
        return true
    }

    const availableToAttack = (cord) => {
        return board[cord] === Cells.empty || board[cord] === Cells.ship
    }

    const receiveAttack = (cord) => {
        if(!availableToAttack(cord)) return false;
        let isMiss = true
        ships.forEach(ship => {
            if(ship.hitIfPossible(cord)){
                isMiss = false
            }
        })
        board[cord] = isMiss ? Cells.miss : Cells.hit
    }

    const checkForGameOver = () => {
        return ships.every(ship => {
            return ship.isSunk()
        })
    }

    const reset = () => {
        Object.keys(board).forEach(cord => {
            board[cord] = Cells.empty
        })
        while(ships.length){
            ships.pop()
        }
    }

    const getBoard = () => {
        return board
    }

    const getShips = () => {
        return ships
    }

    return {
        placeShip,
        receiveAttack,
        checkForGameOver,
        reset,
        getBoard,
        getShips,
        availableToAttack
    }
}

// module.exports = gameBoard

export default gameBoard