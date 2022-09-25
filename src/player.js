// const gameBoard = require("./gameboard")
import gameBoard from "./gameboard"

const Player = (board) => {
    const shipsLeft = () => {
        const ships = board.getShips()
        return ships.filter(ship => {
            return !ship.isSunk()
        }).length
    }
    return {
        board,
        shipsLeft
    }
}

const Bot = (board) => {
    const {playerBoard, shipsLeft} = Player(board)
    const playedCells = []
    let lockMadeAt = ''
    let adjacentCellsToPlay = []
    const sequence = []

    const generateAdjacentCells = (cord) => {
        const adjacents = []
        const row = cord[1]
        const column = cord[0]
        adjacents.push(`${column}${Number(row) + 1}`)
        adjacents.push(`${column}${Number(row) - 1}`)
        adjacents.push(`${String.fromCharCode(column.charCodeAt(0) + 1)}${row}`)
        adjacents.push(`${String.fromCharCode(column.charCodeAt(0) - 1)}${row}`)
        return adjacents
    }

    const isPlayableCell = (cord, opponentBoard) => {
        return Object.keys(opponentBoard).includes(cord) &&
                    (opponentBoard[cord] === 'empty' || opponentBoard[cord] === 'ship') 
    }

    const getAdjacentCells = (opponentBoard) => {
        const lastMove = lockMadeAt
        const adjacentCells = generateAdjacentCells(lastMove)
        return adjacentCells.filter(cord => {
            return isPlayableCell(cord, opponentBoard)
        })
    }

    const tryAndFormSequence = (direction) => {
        let first, second
        if(direction === 'up'){
            first = sequence[sequence.length - 2]
            second = sequence[sequence.length - 1]
        } else {
            sequence.reverse()
            first = sequence[sequence.length - 2]
            second = sequence[sequence.length - 1]
        }
        if(first[0] === second[0]){
            const difference = Number(second[1]) - Number(first[1])
            return `${second[0]}${Number(second[1]) + difference}`
        } else {
            const difference = second[0].charCodeAt(0) - first[0].charCodeAt(0)
            return `${String.fromCharCode(second[0].charCodeAt(0) + difference)}${second[1]}`
        }
    }

    const nextInSequence = (opponentBoard) => {
        if(sequence.length < 2){
            return adjacentCellsToPlay.pop()
        } else {
            if(lastHitOrMiss(opponentBoard) === 'hit'){
                return isPlayableCell(tryAndFormSequence('up'), opponentBoard) ? tryAndFormSequence('up') : tryAndFormSequence('down')
            } else {
                return tryAndFormSequence('down')
            }
        }
    }

    const clearLock = () => {
        lockMadeAt = ''
        while(sequence.length){
            sequence.pop()
        }
        while(adjacentCellsToPlay.length){
            adjacentCellsToPlay.pop()
        }
    }


    const manageSequence = (opponentBoard, opponentShips) => {
        if(lockMadeAt !== ''){
            if(prevShipSunk(opponentShips)){
                clearLock()
                return getRandomMove(opponentBoard)
            } else {
                if(lastHitOrMiss(opponentBoard) === 'hit'){
                    sequence.push(playedCells[playedCells.length - 1])
                }
                return nextInSequence(opponentBoard)
            }

        } else {
            if(lastHitOrMiss(opponentBoard) === 'hit')
            {
                lockMadeAt = playedCells[playedCells.length - 1]
                sequence.push(lockMadeAt)
                adjacentCellsToPlay = getAdjacentCells(opponentBoard)
                return nextInSequence(opponentBoard)
            } else {
                return getRandomMove(opponentBoard)
            }
        }
    }

    const lastHitOrMiss = (opponentBoard) => {
        if(!playedCells.length) return
        return opponentBoard[playedCells[playedCells.length - 1]]
    }

    const prevShipSunk = (opponentShips) => {
        const lastPlay = lockMadeAt
        const curship = opponentShips.reduce((ship, c_ship) => {
            const shipCords = c_ship.getCords()
            return shipCords.includes(lastPlay) ? c_ship : -1
        }, -1)
        return curship !== -1 ? curship.isSunk() : -1
    }

    const getRandomMove = (opponentBoard) => {
        const availableBlocks = Object.keys(opponentBoard).filter(cord => {
            return !playedCells.includes(cord)
        })
        return availableBlocks[Math.floor((Math.random()*availableBlocks.length))];
    }

    const makeMove = (opponentBoard, opponentShips, isSmart) => {
        if(isSmart){
            let cord = manageSequence(opponentBoard, opponentShips)
            playedCells.push(cord)
            return cord
        } else {
            let cord = getRandomMove(opponentBoard)
            playedCells.push(cord)
            return cord
        }
    }

    const debugMakeMove = (cord) => {
        playedCells.push(cord)
    }


    return {makeMove, playerBoard, shipsLeft, debugMakeMove}
}

/*
const myBoard = gameBoard()
const opponentBoardController = gameBoard()
const opponentBoard = opponentBoardController.getBoard()
const opponentShips = opponentBoardController.getShips()
const bot = Bot(myBoard)
opponentBoardController.placeShip(['A1', 'A2', 'A3'])
opponentBoardController.receiveAttack('A1')
bot.debugMakeMove('A1')
const possibleMoves = ['A2', 'B1']
let move = bot.makeMove(opponentBoard, opponentShips, true)
console.log(move)
opponentBoardController.receiveAttack('B1')
console.log(opponentShips)
move = bot.makeMove(opponentBoard, opponentShips, true)
console.log(move)
opponentBoardController.receiveAttack('A2')
move = bot.makeMove(opponentBoard, opponentShips, true)
console.log(move)
*/


export  {Player, Bot}