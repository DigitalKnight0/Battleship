import gameBoard from "./gameboard";
import { Player, Bot } from "./player";
import View from "./view";

const gameContoller = (() => {
    const playerGrid = document.querySelector('.userBox')
    const botGrid = document.querySelector('.botBox')
    const player = Player(gameBoard())
    const bot = Bot(gameBoard())
    let alignment = 'horizontal'
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
        view.attachListener('click', document.querySelector('.rotate'), switchAlignment)
        const grid = document.querySelector('.grid')
        document.querySelector('.title').textContent = `Place your ${currentShip}`
        view.renderInitialBoard(player.board.getBoard(), grid)
        grid.childNodes.forEach(cell => {
            view.attachListener('mouseenter', cell, highlightCells)
            view.attachListener('mouseleave', cell, removehighlights)
            view.attachListener('click', cell, placeShip)
        })
    }


    const attachResetListener = () => {
        const resetBtn = document.querySelector(".reset")
        view.attachListener("click", resetBtn, reset)
    }

    const switchAlignment = () => {
        alignment = alignment === 'horizontal' ? 'vertical' : 'horizontal'
    }

    const placeShip = (e) => {
        const increments = {
            "horizontal": [1, 0],
            "vertical": [0, 1]
        }
        let currentCell = e.target.dataset.cord
        let range = generateRange(currentCell, increments[alignment], ships[currentShip])
        if(range.length < ships[currentShip]) return
        if(!player.board.placeShip(range)) return
        highlightCells(e, true)
        if(currentShip === 'patrolBoat'){
            startGame()
        }
        currentShip = shipsOrder[shipsOrder.indexOf(currentShip) + 1]
        document.querySelector('.title').textContent = `Place your ${currentShip}`
        highlightRemover = ships[currentShip] + 1        
    }

    const startGame = () => {
        bot.placeShips()
        const grid = document.querySelector('.selection')
        grid.classList.add("hidden")
        view.renderGameBoard(player.board.getBoard(), playerGrid, true)
        view.renderGameBoard(bot.board.getBoard(), botGrid, false, "click", fireBox)
    }

    const fireBox = (e) => {
        const cord = e.target.dataset.cord
        if(!bot.board.availableToAttack(cord)) return
        bot.board.receiveAttack(cord)
        const attackCell = bot.makeMove(player.board.getBoard(), player.board.getShips(), true)
        player.board.receiveAttack(attackCell)
        view.renderGameBoard(player.board.getBoard(), playerGrid, true)
        view.renderGameBoard(bot.board.getBoard(), botGrid, false, "click", fireBox)
        checkForGameOver()
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
            "vertical": [0, 1]
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
            "vertical": [0, 1]
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

    const checkForGameOver = () => {
        if(bot.board.checkForGameOver()){
            gameOver("You")
        } else if(player.board.checkForGameOver()){
            gameOver("Enemy")
        }
    }

    const gameOver = (winner) => {
        document.querySelector(".order").textContent = `${winner} Has Won!`
        botGrid.childNodes.forEach(node => {
            view.removeListeners("click", node, fireBox)
        })
    }

    const reset = () => {
        document.querySelector('.selection').classList.remove("hidden")
        document.querySelector('.order').textContent = "Fire Admiral!"
        player.board.reset()
        bot.board.reset()
        alignment = 'horizontal'
        currentShip = "carrier"
        highlightRemover = 5
        startSelections()
    }

    return {
        startSelections,
        attachResetListener
    }

})()

gameContoller.startSelections()
gameContoller.attachResetListener()

