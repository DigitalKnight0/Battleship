import gameBoard from "./gameboard";
import { Player, Bot } from "./player";
import View from "./view";

const gameContoller = (() => {
    const player = Player(gameBoard())
    const bot = Bot(gameBoard())
    const alignment = 'horizontal'
    let currentShip = "carrier"
    let highlightRemover = 5
    const view = View()
    const ships = {
        carrier: 5,
        battleship: 4,
        destroyer: 3,
        submarine: 3,
        patrolBoat: 2
    }
    const shipsOrder = Object.keys(ships)
    Object.freeze(shipsOrder)
    Object.freeze(ships)

    const startSelections = () => {
        const grid = document.querySelector('.grid')
        document.querySelector('.title').textContent = `Place your ${currentShip}`
        view.renderInitialBoard(player.board.getBoard(), grid)
        grid.childNodes.forEach(cell => {
            view.attachListener('mouseenter', cell, highlightCells)
            view.attachListener('mouseleave', cell, removehighlights)
            view.attachListener('click', cell, placeShip)
        })
    }

    const placeShip = (e) => {
        const increments = {
            "horizontal": [1, 0],
            "veritical": [0, 1]
        }
        let currentCell = e.target.dataset.cord
        let range = generateRange(currentCell, increments[alignment], ships[currentShip])
        if(range.length < ships[currentShip]) return
        if(!player.board.placeShip(range)) return
        highlightCells(e, true)
        currentShip = shipsOrder[shipsOrder.indexOf(currentShip) + 1]
        document.querySelector('.title').textContent = `Place your ${currentShip}`
        highlightRemover = ships[currentShip] + 1 
        if(currentShip === 'patrolBoard')
        startGame()
    }

    const startGame = () => {
        
    }

    const generateRange = (cord, alignment, length) => {
        const range = [cord]
        for(let i = 0; i < length - 1; i++){
            let lastCord = range[range.length - 1]
            let row = lastCord.slice(1)
            let column = lastCord.charCodeAt(0)
            row = Number(row) + alignment[1]
            column = String.fromCharCode(column + alignment[0])
            range.push(`${column}${row}`)
        }
        return range.filter(cord => Object.keys(player.board.getBoard()).includes(cord))
    }

    const removehighlights = (e) => {
        const increments = {
            "horizontal": [1, 0],
            "veritical": [0, 1]
        }
        let currentCell = e.target.dataset.cord
        let range = generateRange(currentCell, increments[alignment], highlightRemover)
        range.forEach(cell => {
            const box = document.querySelector(`[data-cord=${cell}]`)
            box.classList.remove('highlighted')
        })
    }

    const highlightCells = (e, permanent) => {
        const increments = {
            "horizontal": [1, 0],
            "veritical": [0, 1]
        }
        let currentCell = e.target.dataset.cord
        let range = generateRange(currentCell, increments[alignment], ships[currentShip])
        range.forEach(cell => {
            const box = document.querySelector(`[data-cord=${cell}]`)
            box.classList.add('highlighted')
            if(permanent){
                box.style.backgroundColor = 'blue'
            }
        })
    }

    return {
        startSelections
    }

})()

gameContoller.startSelections()

