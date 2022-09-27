/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/battleship.js":
/*!***************************!*\
  !*** ./src/battleship.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const battleShip = (cords, length) => {
    const blocks = {}
    let alive = true

    const hit = (cords) => {
        blocks[cords] = 0
    }

    const hitIfPossible = (cords) => {
        if(Object.keys(blocks).includes(cords) && blocks[cords] == 1){
            hit(cords)
            return true
        }
        return false
    }

    const isSunk = () => {
        return Object.values(blocks).every(item => item === 0)
    }

    ((cords) => {
        cords.forEach(cord => {
            blocks[cord] = 1
        })
    })(cords)

    const getCords = () => {
        return Object.keys(blocks)
    }

    const getCordsStatus = () => {
        return Object.values(blocks)
    }

    return {
        hitIfPossible,
        isSunk,
        getCords,
        getCordsStatus,
        length
    }
}

// module.exports = battleShip

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (battleShip);

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _battleship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./battleship */ "./src/battleship.js");

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
        const ship = (0,_battleship__WEBPACK_IMPORTED_MODULE_0__["default"])(cords, cords.length)
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameBoard);

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bot": () => (/* binding */ Bot),
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
// const gameBoard = require("./gameboard")


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

const Bot = (playerBoard) => {
    const {board, shipsLeft} = Player(playerBoard)
    const playedCells = []
    let lockMadeAt = ''
    let adjacentCellsToPlay = []
    let sequence = []

    const generateAdjacentCells = (cord) => {
        const adjacents = []
        const row = cord.slice(1)
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
            const difference = Number(second.slice(1)) - Number(first.slice(1))
            return `${second[0]}${Number(second.slice(1)) + difference}`
        } else {
            const difference = second[0].charCodeAt(0) - first[0].charCodeAt(0)
            return `${String.fromCharCode(second[0].charCodeAt(0) + difference)}${second.slice(1)}`
        }
    }

    const nextInSequence = (opponentBoard) => {
        if(sequence.length < 2){
            return adjacentCellsToPlay.pop()
        } else {
            let cord
            if(lastHitOrMiss(opponentBoard) === 'hit'){
                cord = isPlayableCell(tryAndFormSequence('up'), opponentBoard) ? tryAndFormSequence('up') : tryAndFormSequence('down')
            } else {
                cord = tryAndFormSequence('down')
            }
            if(!isPlayableCell(cord, opponentBoard)){
                sequence = [lockMadeAt]
                return adjacentCellsToPlay.length ? adjacentCellsToPlay.pop() : getRandomMove(opponentBoard)
            }
            return cord
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
        const curship = opponentShips.find(ship => {
            return ship.getCords().includes(lockMadeAt)
        })
        return curship ? curship.isSunk() : -1
    }

    const getRandomMove = (opponentBoard) => {
        const availableBlocks = Object.keys(opponentBoard).filter(cord => {
            return !playedCells.includes(cord)
        })
        return sample(availableBlocks)
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

    const sample = (array) => {
        return array[Math.floor((Math.random()*array.length))]
    } 

    const placeShips = () => {
        const ships = [5, 4, 3, 3, 2]
        const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        const alignments = [[1, 0], [0, 1]]
        ships.forEach(ship => {
            let row = sample(rows)
            let column = sample(columns)
            let cord = `${column}${row}`
            let alignment = sample(alignments)
            let ranges = generateRange(cord, alignment, ship)
            while(ranges.length != ship || !board.placeShip(ranges)){
                row = sample(rows)
                column = sample(columns)
                cord = `${column}${row}`
                ranges = generateRange(cord, alignment, ship)
            }
        })
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
        return range.filter(cord => Object.keys(board.getBoard()).includes(cord))
    }


    return {makeMove, board, shipsLeft, debugMakeMove, placeShips}
}



 

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

const View = () => {
    const renderInitialBoard = (board, node) => {
        node.textContent = ""
        const cells = Object.keys(board)
        cells.forEach(cell => {
            const box = document.createElement("div")
            box.dataset.cord = cell
            box.classList.add("cell")
            node.appendChild(box)
        })
    }

    const renderGameBoard = (board, node, visible, event, fn) => {
        node.textContent = ""
        let shipCords = []
        const colors = {
            empty: "aqua",
            hit: "red",
            miss: "aquamarine",
            ship: "aqua"
        }
        if(visible){
            shipCords = Object.keys(board).filter(cord => {
                return board[cord] === "ship"
            })
        }
        const cells = Object.keys(board)
        cells.forEach(cell => {
            const box = document.createElement("div")
            box.dataset.cord = cell
            box.classList.add("cell")
            box.style.backgroundColor = colors[board[cell]]
            if(visible && shipCords.includes(cell)){
                box.style.backgroundColor = "blue"
            }
            if(event){
                attachListener(event, box, fn)
            }
            node.appendChild(box)
        })
    }

    const attachListener = (event, node, fn) => {
        node.addEventListener(event, fn)
    }

    const removeListeners = (event, node, fn) => {
        node.removeEventListener(event, fn)
    }

    return {
        renderInitialBoard,
        attachListener,
        renderGameBoard,
        removeListeners
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view */ "./src/view.js");




const gameContoller = (() => {
    const playerGrid = document.querySelector('.userBox')
    const botGrid = document.querySelector('.botBox')
    const player = (0,_player__WEBPACK_IMPORTED_MODULE_1__.Player)((0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])())
    const bot = (0,_player__WEBPACK_IMPORTED_MODULE_1__.Bot)((0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])())
    let alignment = 'horizontal'
    let currentShip = "carrier"
    let highlightRemover = 5
    const view = (0,_view__WEBPACK_IMPORTED_MODULE_2__["default"])()
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


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUVBQXFFLFlBQVk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsWUFBWTtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsZ0JBQWdCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsT0FBTyxFQUFFLElBQUk7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsS0FBSztBQUNsRTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELEtBQUs7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBEQUEwRCxRQUFRO0FBQ2xFO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9iYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBiYXR0bGVTaGlwID0gKGNvcmRzLCBsZW5ndGgpID0+IHtcbiAgICBjb25zdCBibG9ja3MgPSB7fVxuICAgIGxldCBhbGl2ZSA9IHRydWVcblxuICAgIGNvbnN0IGhpdCA9IChjb3JkcykgPT4ge1xuICAgICAgICBibG9ja3NbY29yZHNdID0gMFxuICAgIH1cblxuICAgIGNvbnN0IGhpdElmUG9zc2libGUgPSAoY29yZHMpID0+IHtcbiAgICAgICAgaWYoT2JqZWN0LmtleXMoYmxvY2tzKS5pbmNsdWRlcyhjb3JkcykgJiYgYmxvY2tzW2NvcmRzXSA9PSAxKXtcbiAgICAgICAgICAgIGhpdChjb3JkcylcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhibG9ja3MpLmV2ZXJ5KGl0ZW0gPT4gaXRlbSA9PT0gMClcbiAgICB9XG5cbiAgICAoKGNvcmRzKSA9PiB7XG4gICAgICAgIGNvcmRzLmZvckVhY2goY29yZCA9PiB7XG4gICAgICAgICAgICBibG9ja3NbY29yZF0gPSAxXG4gICAgICAgIH0pXG4gICAgfSkoY29yZHMpXG5cbiAgICBjb25zdCBnZXRDb3JkcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGJsb2NrcylcbiAgICB9XG5cbiAgICBjb25zdCBnZXRDb3Jkc1N0YXR1cyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYmxvY2tzKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGhpdElmUG9zc2libGUsXG4gICAgICAgIGlzU3VuayxcbiAgICAgICAgZ2V0Q29yZHMsXG4gICAgICAgIGdldENvcmRzU3RhdHVzLFxuICAgICAgICBsZW5ndGhcbiAgICB9XG59XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gYmF0dGxlU2hpcFxuXG5leHBvcnQgZGVmYXVsdCBiYXR0bGVTaGlwIiwiaW1wb3J0IGJhdHRsZVNoaXAgZnJvbSBcIi4vYmF0dGxlc2hpcFwiXG4vLyBjb25zdCBiYXR0bGVTaGlwID0gcmVxdWlyZShcIi4vYmF0dGxlc2hpcFwiKVxuY29uc3QgZ2FtZUJvYXJkID0gKCkgPT4ge1xuXG4gICAgY29uc3QgYm9hcmQgPSB7fVxuICAgIGNvbnN0IHNoaXBzID0gW11cblxuICAgIGNvbnN0IENlbGxzID0ge1xuICAgICAgICBoaXQ6IFwiaGl0XCIsXG4gICAgICAgIG1pc3M6IFwibWlzc1wiLFxuICAgICAgICBlbXB0eTogXCJlbXB0eVwiLFxuICAgICAgICBzaGlwOiBcInNoaXBcIlxuICAgIH1cblxuICAgIGNvbnN0IGluaXQgPSAoKHgsIHkpID0+IHtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHg7IGkrKyl7XG4gICAgICAgICAgICBmb3IobGV0IGo9MTsgaiA8PSB5OyBqKyspe1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjUgKyBpKVxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBjb2x1bW4gKyBqXG4gICAgICAgICAgICAgICAgYm9hcmRbY2VsbF0gPSBDZWxscy5lbXB0eVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSkoMTAsIDEwKVxuXG4gICAgY29uc3QgY2FuUGxhY2VTaGlwID0gKGNvcmRzKSA9PiB7XG4gICAgICAgIHJldHVybiBjb3Jkcy5yZWR1Y2UoKHN0YXRlLCBjb3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgIT0gZmFsc2UgJiYgYm9hcmRbY29yZF0gPT09IFwiZW1wdHlcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICB9LCB0cnVlKVxuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlU2hpcCA9IChjb3JkcykgPT4ge1xuICAgICAgICBpZighY2FuUGxhY2VTaGlwKGNvcmRzKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBzaGlwID0gYmF0dGxlU2hpcChjb3JkcywgY29yZHMubGVuZ3RoKVxuICAgICAgICBjb3Jkcy5mb3JFYWNoKGNvcmQgPT4ge1xuICAgICAgICAgICAgYm9hcmRbY29yZF0gPSBDZWxscy5zaGlwXG4gICAgICAgIH0pXG4gICAgICAgIHNoaXBzLnB1c2goc2hpcClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjb25zdCBhdmFpbGFibGVUb0F0dGFjayA9IChjb3JkKSA9PiB7XG4gICAgICAgIHJldHVybiBib2FyZFtjb3JkXSA9PT0gQ2VsbHMuZW1wdHkgfHwgYm9hcmRbY29yZF0gPT09IENlbGxzLnNoaXBcbiAgICB9XG5cbiAgICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvcmQpID0+IHtcbiAgICAgICAgaWYoIWF2YWlsYWJsZVRvQXR0YWNrKGNvcmQpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGxldCBpc01pc3MgPSB0cnVlXG4gICAgICAgIHNoaXBzLmZvckVhY2goc2hpcCA9PiB7XG4gICAgICAgICAgICBpZihzaGlwLmhpdElmUG9zc2libGUoY29yZCkpe1xuICAgICAgICAgICAgICAgIGlzTWlzcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGJvYXJkW2NvcmRdID0gaXNNaXNzID8gQ2VsbHMubWlzcyA6IENlbGxzLmhpdFxuICAgIH1cblxuICAgIGNvbnN0IGNoZWNrRm9yR2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBzaGlwcy5ldmVyeShzaGlwID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzaGlwLmlzU3VuaygpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKGJvYXJkKS5mb3JFYWNoKGNvcmQgPT4ge1xuICAgICAgICAgICAgYm9hcmRbY29yZF0gPSBDZWxscy5lbXB0eVxuICAgICAgICB9KVxuICAgICAgICB3aGlsZShzaGlwcy5sZW5ndGgpe1xuICAgICAgICAgICAgc2hpcHMucG9wKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGdldEJvYXJkID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gYm9hcmRcbiAgICB9XG5cbiAgICBjb25zdCBnZXRTaGlwcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHNoaXBzXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGxhY2VTaGlwLFxuICAgICAgICByZWNlaXZlQXR0YWNrLFxuICAgICAgICBjaGVja0ZvckdhbWVPdmVyLFxuICAgICAgICByZXNldCxcbiAgICAgICAgZ2V0Qm9hcmQsXG4gICAgICAgIGdldFNoaXBzLFxuICAgICAgICBhdmFpbGFibGVUb0F0dGFja1xuICAgIH1cbn1cblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBnYW1lQm9hcmRcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUJvYXJkIiwiLy8gY29uc3QgZ2FtZUJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZWJvYXJkXCIpXG5pbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiXG5cbmNvbnN0IFBsYXllciA9IChib2FyZCkgPT4ge1xuICAgIGNvbnN0IHNoaXBzTGVmdCA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2hpcHMgPSBib2FyZC5nZXRTaGlwcygpXG4gICAgICAgIHJldHVybiBzaGlwcy5maWx0ZXIoc2hpcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXNoaXAuaXNTdW5rKClcbiAgICAgICAgfSkubGVuZ3RoXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGJvYXJkLFxuICAgICAgICBzaGlwc0xlZnRcbiAgICB9XG59XG5cbmNvbnN0IEJvdCA9IChwbGF5ZXJCb2FyZCkgPT4ge1xuICAgIGNvbnN0IHtib2FyZCwgc2hpcHNMZWZ0fSA9IFBsYXllcihwbGF5ZXJCb2FyZClcbiAgICBjb25zdCBwbGF5ZWRDZWxscyA9IFtdXG4gICAgbGV0IGxvY2tNYWRlQXQgPSAnJ1xuICAgIGxldCBhZGphY2VudENlbGxzVG9QbGF5ID0gW11cbiAgICBsZXQgc2VxdWVuY2UgPSBbXVxuXG4gICAgY29uc3QgZ2VuZXJhdGVBZGphY2VudENlbGxzID0gKGNvcmQpID0+IHtcbiAgICAgICAgY29uc3QgYWRqYWNlbnRzID0gW11cbiAgICAgICAgY29uc3Qgcm93ID0gY29yZC5zbGljZSgxKVxuICAgICAgICBjb25zdCBjb2x1bW4gPSBjb3JkWzBdXG4gICAgICAgIGFkamFjZW50cy5wdXNoKGAke2NvbHVtbn0ke051bWJlcihyb3cpICsgMX1gKVxuICAgICAgICBhZGphY2VudHMucHVzaChgJHtjb2x1bW59JHtOdW1iZXIocm93KSAtIDF9YClcbiAgICAgICAgYWRqYWNlbnRzLnB1c2goYCR7U3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW4uY2hhckNvZGVBdCgwKSArIDEpfSR7cm93fWApXG4gICAgICAgIGFkamFjZW50cy5wdXNoKGAke1N0cmluZy5mcm9tQ2hhckNvZGUoY29sdW1uLmNoYXJDb2RlQXQoMCkgLSAxKX0ke3Jvd31gKVxuICAgICAgICByZXR1cm4gYWRqYWNlbnRzXG4gICAgfVxuXG4gICAgY29uc3QgaXNQbGF5YWJsZUNlbGwgPSAoY29yZCwgb3Bwb25lbnRCb2FyZCkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob3Bwb25lbnRCb2FyZCkuaW5jbHVkZXMoY29yZCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKG9wcG9uZW50Qm9hcmRbY29yZF0gPT09ICdlbXB0eScgfHwgb3Bwb25lbnRCb2FyZFtjb3JkXSA9PT0gJ3NoaXAnKSBcbiAgICB9XG5cbiAgICBjb25zdCBnZXRBZGphY2VudENlbGxzID0gKG9wcG9uZW50Qm9hcmQpID0+IHtcbiAgICAgICAgY29uc3QgbGFzdE1vdmUgPSBsb2NrTWFkZUF0XG4gICAgICAgIGNvbnN0IGFkamFjZW50Q2VsbHMgPSBnZW5lcmF0ZUFkamFjZW50Q2VsbHMobGFzdE1vdmUpXG4gICAgICAgIHJldHVybiBhZGphY2VudENlbGxzLmZpbHRlcihjb3JkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpc1BsYXlhYmxlQ2VsbChjb3JkLCBvcHBvbmVudEJvYXJkKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHRyeUFuZEZvcm1TZXF1ZW5jZSA9IChkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgbGV0IGZpcnN0LCBzZWNvbmRcbiAgICAgICAgaWYoZGlyZWN0aW9uID09PSAndXAnKXtcbiAgICAgICAgICAgIGZpcnN0ID0gc2VxdWVuY2Vbc2VxdWVuY2UubGVuZ3RoIC0gMl1cbiAgICAgICAgICAgIHNlY29uZCA9IHNlcXVlbmNlW3NlcXVlbmNlLmxlbmd0aCAtIDFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXF1ZW5jZS5yZXZlcnNlKClcbiAgICAgICAgICAgIGZpcnN0ID0gc2VxdWVuY2Vbc2VxdWVuY2UubGVuZ3RoIC0gMl1cbiAgICAgICAgICAgIHNlY29uZCA9IHNlcXVlbmNlW3NlcXVlbmNlLmxlbmd0aCAtIDFdXG4gICAgICAgIH1cbiAgICAgICAgaWYoZmlyc3RbMF0gPT09IHNlY29uZFswXSl7XG4gICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlID0gTnVtYmVyKHNlY29uZC5zbGljZSgxKSkgLSBOdW1iZXIoZmlyc3Quc2xpY2UoMSkpXG4gICAgICAgICAgICByZXR1cm4gYCR7c2Vjb25kWzBdfSR7TnVtYmVyKHNlY29uZC5zbGljZSgxKSkgKyBkaWZmZXJlbmNlfWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBzZWNvbmRbMF0uY2hhckNvZGVBdCgwKSAtIGZpcnN0WzBdLmNoYXJDb2RlQXQoMClcbiAgICAgICAgICAgIHJldHVybiBgJHtTdHJpbmcuZnJvbUNoYXJDb2RlKHNlY29uZFswXS5jaGFyQ29kZUF0KDApICsgZGlmZmVyZW5jZSl9JHtzZWNvbmQuc2xpY2UoMSl9YFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dEluU2VxdWVuY2UgPSAob3Bwb25lbnRCb2FyZCkgPT4ge1xuICAgICAgICBpZihzZXF1ZW5jZS5sZW5ndGggPCAyKXtcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzVG9QbGF5LnBvcCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgY29yZFxuICAgICAgICAgICAgaWYobGFzdEhpdE9yTWlzcyhvcHBvbmVudEJvYXJkKSA9PT0gJ2hpdCcpe1xuICAgICAgICAgICAgICAgIGNvcmQgPSBpc1BsYXlhYmxlQ2VsbCh0cnlBbmRGb3JtU2VxdWVuY2UoJ3VwJyksIG9wcG9uZW50Qm9hcmQpID8gdHJ5QW5kRm9ybVNlcXVlbmNlKCd1cCcpIDogdHJ5QW5kRm9ybVNlcXVlbmNlKCdkb3duJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29yZCA9IHRyeUFuZEZvcm1TZXF1ZW5jZSgnZG93bicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighaXNQbGF5YWJsZUNlbGwoY29yZCwgb3Bwb25lbnRCb2FyZCkpe1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlID0gW2xvY2tNYWRlQXRdXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHNUb1BsYXkubGVuZ3RoID8gYWRqYWNlbnRDZWxsc1RvUGxheS5wb3AoKSA6IGdldFJhbmRvbU1vdmUob3Bwb25lbnRCb2FyZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb3JkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjbGVhckxvY2sgPSAoKSA9PiB7XG4gICAgICAgIGxvY2tNYWRlQXQgPSAnJ1xuICAgICAgICB3aGlsZShzZXF1ZW5jZS5sZW5ndGgpe1xuICAgICAgICAgICAgc2VxdWVuY2UucG9wKClcbiAgICAgICAgfVxuICAgICAgICB3aGlsZShhZGphY2VudENlbGxzVG9QbGF5Lmxlbmd0aCl7XG4gICAgICAgICAgICBhZGphY2VudENlbGxzVG9QbGF5LnBvcCgpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGNvbnN0IG1hbmFnZVNlcXVlbmNlID0gKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50U2hpcHMpID0+IHtcbiAgICAgICAgaWYobG9ja01hZGVBdCAhPT0gJycpe1xuICAgICAgICAgICAgaWYocHJldlNoaXBTdW5rKG9wcG9uZW50U2hpcHMpKXtcbiAgICAgICAgICAgICAgICBjbGVhckxvY2soKVxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Nb3ZlKG9wcG9uZW50Qm9hcmQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKGxhc3RIaXRPck1pc3Mob3Bwb25lbnRCb2FyZCkgPT09ICdoaXQnKXtcbiAgICAgICAgICAgICAgICAgICAgc2VxdWVuY2UucHVzaChwbGF5ZWRDZWxsc1twbGF5ZWRDZWxscy5sZW5ndGggLSAxXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHRJblNlcXVlbmNlKG9wcG9uZW50Qm9hcmQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKGxhc3RIaXRPck1pc3Mob3Bwb25lbnRCb2FyZCkgPT09ICdoaXQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxvY2tNYWRlQXQgPSBwbGF5ZWRDZWxsc1twbGF5ZWRDZWxscy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIHNlcXVlbmNlLnB1c2gobG9ja01hZGVBdClcbiAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzVG9QbGF5ID0gZ2V0QWRqYWNlbnRDZWxscyhvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0SW5TZXF1ZW5jZShvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UmFuZG9tTW92ZShvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdEhpdE9yTWlzcyA9IChvcHBvbmVudEJvYXJkKSA9PiB7XG4gICAgICAgIGlmKCFwbGF5ZWRDZWxscy5sZW5ndGgpIHJldHVyblxuICAgICAgICByZXR1cm4gb3Bwb25lbnRCb2FyZFtwbGF5ZWRDZWxsc1twbGF5ZWRDZWxscy5sZW5ndGggLSAxXV1cbiAgICB9XG5cbiAgICBjb25zdCBwcmV2U2hpcFN1bmsgPSAob3Bwb25lbnRTaGlwcykgPT4ge1xuICAgICAgICBjb25zdCBjdXJzaGlwID0gb3Bwb25lbnRTaGlwcy5maW5kKHNoaXAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNoaXAuZ2V0Q29yZHMoKS5pbmNsdWRlcyhsb2NrTWFkZUF0KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY3Vyc2hpcCA/IGN1cnNoaXAuaXNTdW5rKCkgOiAtMVxuICAgIH1cblxuICAgIGNvbnN0IGdldFJhbmRvbU1vdmUgPSAob3Bwb25lbnRCb2FyZCkgPT4ge1xuICAgICAgICBjb25zdCBhdmFpbGFibGVCbG9ja3MgPSBPYmplY3Qua2V5cyhvcHBvbmVudEJvYXJkKS5maWx0ZXIoY29yZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXBsYXllZENlbGxzLmluY2x1ZGVzKGNvcmQpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzYW1wbGUoYXZhaWxhYmxlQmxvY2tzKVxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VNb3ZlID0gKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50U2hpcHMsIGlzU21hcnQpID0+IHtcbiAgICAgICAgaWYoaXNTbWFydCl7XG4gICAgICAgICAgICBsZXQgY29yZCA9IG1hbmFnZVNlcXVlbmNlKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50U2hpcHMpXG4gICAgICAgICAgICBwbGF5ZWRDZWxscy5wdXNoKGNvcmQpXG4gICAgICAgICAgICByZXR1cm4gY29yZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGNvcmQgPSBnZXRSYW5kb21Nb3ZlKG9wcG9uZW50Qm9hcmQpXG4gICAgICAgICAgICBwbGF5ZWRDZWxscy5wdXNoKGNvcmQpXG4gICAgICAgICAgICByZXR1cm4gY29yZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZGVidWdNYWtlTW92ZSA9IChjb3JkKSA9PiB7XG4gICAgICAgIHBsYXllZENlbGxzLnB1c2goY29yZClcbiAgICB9XG5cbiAgICBjb25zdCBzYW1wbGUgPSAoYXJyYXkpID0+IHtcbiAgICAgICAgcmV0dXJuIGFycmF5W01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkqYXJyYXkubGVuZ3RoKSldXG4gICAgfSBcblxuICAgIGNvbnN0IHBsYWNlU2hpcHMgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNoaXBzID0gWzUsIDQsIDMsIDMsIDJdXG4gICAgICAgIGNvbnN0IHJvd3MgPSBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onXVxuICAgICAgICBjb25zdCBhbGlnbm1lbnRzID0gW1sxLCAwXSwgWzAsIDFdXVxuICAgICAgICBzaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgICAgICAgbGV0IHJvdyA9IHNhbXBsZShyb3dzKVxuICAgICAgICAgICAgbGV0IGNvbHVtbiA9IHNhbXBsZShjb2x1bW5zKVxuICAgICAgICAgICAgbGV0IGNvcmQgPSBgJHtjb2x1bW59JHtyb3d9YFxuICAgICAgICAgICAgbGV0IGFsaWdubWVudCA9IHNhbXBsZShhbGlnbm1lbnRzKVxuICAgICAgICAgICAgbGV0IHJhbmdlcyA9IGdlbmVyYXRlUmFuZ2UoY29yZCwgYWxpZ25tZW50LCBzaGlwKVxuICAgICAgICAgICAgd2hpbGUocmFuZ2VzLmxlbmd0aCAhPSBzaGlwIHx8ICFib2FyZC5wbGFjZVNoaXAocmFuZ2VzKSl7XG4gICAgICAgICAgICAgICAgcm93ID0gc2FtcGxlKHJvd3MpXG4gICAgICAgICAgICAgICAgY29sdW1uID0gc2FtcGxlKGNvbHVtbnMpXG4gICAgICAgICAgICAgICAgY29yZCA9IGAke2NvbHVtbn0ke3Jvd31gXG4gICAgICAgICAgICAgICAgcmFuZ2VzID0gZ2VuZXJhdGVSYW5nZShjb3JkLCBhbGlnbm1lbnQsIHNoaXApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZ2VuZXJhdGVSYW5nZSA9IChjb3JkLCBhbGlnbm1lbnQsIGxlbmd0aCkgPT4ge1xuICAgICAgICBjb25zdCByYW5nZSA9IFtjb3JkXVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKXtcbiAgICAgICAgICAgIGxldCBsYXN0Q29yZCA9IHJhbmdlW3JhbmdlLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgcm93ID0gbGFzdENvcmQuc2xpY2UoMSlcbiAgICAgICAgICAgIGxldCBjb2x1bW4gPSBsYXN0Q29yZC5jaGFyQ29kZUF0KDApXG4gICAgICAgICAgICByb3cgPSBOdW1iZXIocm93KSArIGFsaWdubWVudFsxXVxuICAgICAgICAgICAgY29sdW1uID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW4gKyBhbGlnbm1lbnRbMF0pXG4gICAgICAgICAgICByYW5nZS5wdXNoKGAke2NvbHVtbn0ke3Jvd31gKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYW5nZS5maWx0ZXIoY29yZCA9PiBPYmplY3Qua2V5cyhib2FyZC5nZXRCb2FyZCgpKS5pbmNsdWRlcyhjb3JkKSlcbiAgICB9XG5cblxuICAgIHJldHVybiB7bWFrZU1vdmUsIGJvYXJkLCBzaGlwc0xlZnQsIGRlYnVnTWFrZU1vdmUsIHBsYWNlU2hpcHN9XG59XG5cblxuXG4gZXhwb3J0ICB7UGxheWVyLCBCb3R9IiwiXG5jb25zdCBWaWV3ID0gKCkgPT4ge1xuICAgIGNvbnN0IHJlbmRlckluaXRpYWxCb2FyZCA9IChib2FyZCwgbm9kZSkgPT4ge1xuICAgICAgICBub2RlLnRleHRDb250ZW50ID0gXCJcIlxuICAgICAgICBjb25zdCBjZWxscyA9IE9iamVjdC5rZXlzKGJvYXJkKVxuICAgICAgICBjZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICAgICAgYm94LmRhdGFzZXQuY29yZCA9IGNlbGxcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKVxuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChib3gpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgcmVuZGVyR2FtZUJvYXJkID0gKGJvYXJkLCBub2RlLCB2aXNpYmxlLCBldmVudCwgZm4pID0+IHtcbiAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IFwiXCJcbiAgICAgICAgbGV0IHNoaXBDb3JkcyA9IFtdXG4gICAgICAgIGNvbnN0IGNvbG9ycyA9IHtcbiAgICAgICAgICAgIGVtcHR5OiBcImFxdWFcIixcbiAgICAgICAgICAgIGhpdDogXCJyZWRcIixcbiAgICAgICAgICAgIG1pc3M6IFwiYXF1YW1hcmluZVwiLFxuICAgICAgICAgICAgc2hpcDogXCJhcXVhXCJcbiAgICAgICAgfVxuICAgICAgICBpZih2aXNpYmxlKXtcbiAgICAgICAgICAgIHNoaXBDb3JkcyA9IE9iamVjdC5rZXlzKGJvYXJkKS5maWx0ZXIoY29yZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJvYXJkW2NvcmRdID09PSBcInNoaXBcIlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjZWxscyA9IE9iamVjdC5rZXlzKGJvYXJkKVxuICAgICAgICBjZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICAgICAgYm94LmRhdGFzZXQuY29yZCA9IGNlbGxcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKVxuICAgICAgICAgICAgYm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yc1tib2FyZFtjZWxsXV1cbiAgICAgICAgICAgIGlmKHZpc2libGUgJiYgc2hpcENvcmRzLmluY2x1ZGVzKGNlbGwpKXtcbiAgICAgICAgICAgICAgICBib3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibHVlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBhdHRhY2hMaXN0ZW5lcihldmVudCwgYm94LCBmbilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoYm94KVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGF0dGFjaExpc3RlbmVyID0gKGV2ZW50LCBub2RlLCBmbikgPT4ge1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuKVxuICAgIH1cblxuICAgIGNvbnN0IHJlbW92ZUxpc3RlbmVycyA9IChldmVudCwgbm9kZSwgZm4pID0+IHtcbiAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBmbilcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZW5kZXJJbml0aWFsQm9hcmQsXG4gICAgICAgIGF0dGFjaExpc3RlbmVyLFxuICAgICAgICByZW5kZXJHYW1lQm9hcmQsXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyc1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlldyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IFBsYXllciwgQm90IH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCI7XG5cbmNvbnN0IGdhbWVDb250b2xsZXIgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHBsYXllckdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXNlckJveCcpXG4gICAgY29uc3QgYm90R3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib3RCb3gnKVxuICAgIGNvbnN0IHBsYXllciA9IFBsYXllcihnYW1lQm9hcmQoKSlcbiAgICBjb25zdCBib3QgPSBCb3QoZ2FtZUJvYXJkKCkpXG4gICAgbGV0IGFsaWdubWVudCA9ICdob3Jpem9udGFsJ1xuICAgIGxldCBjdXJyZW50U2hpcCA9IFwiY2FycmllclwiXG4gICAgbGV0IGhpZ2hsaWdodFJlbW92ZXIgPSA1XG4gICAgY29uc3QgdmlldyA9IFZpZXcoKVxuICAgIGNvbnN0IHNoaXBzID0ge1xuICAgICAgICBjYXJyaWVyOiA1LFxuICAgICAgICBiYXR0bGVzaGlwOiA0LFxuICAgICAgICBkZXN0cm95ZXI6IDMsXG4gICAgICAgIHN1Ym1hcmluZTogMyxcbiAgICAgICAgcGF0cm9sQm9hdDogMlxuICAgIH1cbiAgICBjb25zdCBzaGlwc09yZGVyID0gT2JqZWN0LmtleXMoc2hpcHMpXG4gICAgT2JqZWN0LmZyZWV6ZShzaGlwc09yZGVyKVxuICAgIE9iamVjdC5mcmVlemUoc2hpcHMpXG5cbiAgICBjb25zdCBzdGFydFNlbGVjdGlvbnMgPSAoKSA9PiB7XG4gICAgICAgIHZpZXcuYXR0YWNoTGlzdGVuZXIoJ2NsaWNrJywgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZScpLCBzd2l0Y2hBbGlnbm1lbnQpXG4gICAgICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZCcpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtjdXJyZW50U2hpcH1gXG4gICAgICAgIHZpZXcucmVuZGVySW5pdGlhbEJvYXJkKHBsYXllci5ib2FyZC5nZXRCb2FyZCgpLCBncmlkKVxuICAgICAgICBncmlkLmNoaWxkTm9kZXMuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIHZpZXcuYXR0YWNoTGlzdGVuZXIoJ21vdXNlZW50ZXInLCBjZWxsLCBoaWdobGlnaHRDZWxscylcbiAgICAgICAgICAgIHZpZXcuYXR0YWNoTGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBjZWxsLCByZW1vdmVoaWdobGlnaHRzKVxuICAgICAgICAgICAgdmlldy5hdHRhY2hMaXN0ZW5lcignY2xpY2snLCBjZWxsLCBwbGFjZVNoaXApXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBjb25zdCBhdHRhY2hSZXNldExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzZXRcIilcbiAgICAgICAgdmlldy5hdHRhY2hMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0QnRuLCByZXNldClcbiAgICB9XG5cbiAgICBjb25zdCBzd2l0Y2hBbGlnbm1lbnQgPSAoKSA9PiB7XG4gICAgICAgIGFsaWdubWVudCA9IGFsaWdubWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJ1xuICAgIH1cblxuICAgIGNvbnN0IHBsYWNlU2hpcCA9IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGluY3JlbWVudHMgPSB7XG4gICAgICAgICAgICBcImhvcml6b250YWxcIjogWzEsIDBdLFxuICAgICAgICAgICAgXCJ2ZXJ0aWNhbFwiOiBbMCwgMV1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VycmVudENlbGwgPSBlLnRhcmdldC5kYXRhc2V0LmNvcmRcbiAgICAgICAgbGV0IHJhbmdlID0gZ2VuZXJhdGVSYW5nZShjdXJyZW50Q2VsbCwgaW5jcmVtZW50c1thbGlnbm1lbnRdLCBzaGlwc1tjdXJyZW50U2hpcF0pXG4gICAgICAgIGlmKHJhbmdlLmxlbmd0aCA8IHNoaXBzW2N1cnJlbnRTaGlwXSkgcmV0dXJuXG4gICAgICAgIGlmKCFwbGF5ZXIuYm9hcmQucGxhY2VTaGlwKHJhbmdlKSkgcmV0dXJuXG4gICAgICAgIGhpZ2hsaWdodENlbGxzKGUsIHRydWUpXG4gICAgICAgIGlmKGN1cnJlbnRTaGlwID09PSAncGF0cm9sQm9hdCcpe1xuICAgICAgICAgICAgc3RhcnRHYW1lKClcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50U2hpcCA9IHNoaXBzT3JkZXJbc2hpcHNPcmRlci5pbmRleE9mKGN1cnJlbnRTaGlwKSArIDFdXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLnRleHRDb250ZW50ID0gYFBsYWNlIHlvdXIgJHtjdXJyZW50U2hpcH1gXG4gICAgICAgIGhpZ2hsaWdodFJlbW92ZXIgPSBzaGlwc1tjdXJyZW50U2hpcF0gKyAxICAgICAgICBcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gICAgICAgIGJvdC5wbGFjZVNoaXBzKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3Rpb24nKVxuICAgICAgICBncmlkLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIilcbiAgICAgICAgdmlldy5yZW5kZXJHYW1lQm9hcmQocGxheWVyLmJvYXJkLmdldEJvYXJkKCksIHBsYXllckdyaWQsIHRydWUpXG4gICAgICAgIHZpZXcucmVuZGVyR2FtZUJvYXJkKGJvdC5ib2FyZC5nZXRCb2FyZCgpLCBib3RHcmlkLCBmYWxzZSwgXCJjbGlja1wiLCBmaXJlQm94KVxuICAgIH1cblxuICAgIGNvbnN0IGZpcmVCb3ggPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBjb3JkID0gZS50YXJnZXQuZGF0YXNldC5jb3JkXG4gICAgICAgIGlmKCFib3QuYm9hcmQuYXZhaWxhYmxlVG9BdHRhY2soY29yZCkpIHJldHVyblxuICAgICAgICBib3QuYm9hcmQucmVjZWl2ZUF0dGFjayhjb3JkKVxuICAgICAgICBjb25zdCBhdHRhY2tDZWxsID0gYm90Lm1ha2VNb3ZlKHBsYXllci5ib2FyZC5nZXRCb2FyZCgpLCBwbGF5ZXIuYm9hcmQuZ2V0U2hpcHMoKSwgdHJ1ZSlcbiAgICAgICAgcGxheWVyLmJvYXJkLnJlY2VpdmVBdHRhY2soYXR0YWNrQ2VsbClcbiAgICAgICAgdmlldy5yZW5kZXJHYW1lQm9hcmQocGxheWVyLmJvYXJkLmdldEJvYXJkKCksIHBsYXllckdyaWQsIHRydWUpXG4gICAgICAgIHZpZXcucmVuZGVyR2FtZUJvYXJkKGJvdC5ib2FyZC5nZXRCb2FyZCgpLCBib3RHcmlkLCBmYWxzZSwgXCJjbGlja1wiLCBmaXJlQm94KVxuICAgICAgICBjaGVja0ZvckdhbWVPdmVyKClcbiAgICB9XG5cbiAgICBjb25zdCBnZW5lcmF0ZVJhbmdlID0gKGNvcmQsIGFsaWdubWVudCwgbGVuZ3RoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gW2NvcmRdXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspe1xuICAgICAgICAgICAgbGV0IGxhc3RDb3JkID0gcmFuZ2VbcmFuZ2UubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIGxldCByb3cgPSBsYXN0Q29yZC5zbGljZSgxKVxuICAgICAgICAgICAgbGV0IGNvbHVtbiA9IGxhc3RDb3JkLmNoYXJDb2RlQXQoMClcbiAgICAgICAgICAgIHJvdyA9IE51bWJlcihyb3cpICsgYWxpZ25tZW50WzFdXG4gICAgICAgICAgICBjb2x1bW4gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbiArIGFsaWdubWVudFswXSlcbiAgICAgICAgICAgIHJhbmdlLnB1c2goYCR7Y29sdW1ufSR7cm93fWApXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJhbmdlLmZpbHRlcihjb3JkID0+IE9iamVjdC5rZXlzKHBsYXllci5ib2FyZC5nZXRCb2FyZCgpKS5pbmNsdWRlcyhjb3JkKSlcbiAgICB9XG5cbiAgICBjb25zdCByZW1vdmVoaWdobGlnaHRzID0gKGUpID0+IHtcbiAgICAgICAgY29uc3QgaW5jcmVtZW50cyA9IHtcbiAgICAgICAgICAgIFwiaG9yaXpvbnRhbFwiOiBbMSwgMF0sXG4gICAgICAgICAgICBcInZlcnRpY2FsXCI6IFswLCAxXVxuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IGUudGFyZ2V0LmRhdGFzZXQuY29yZFxuICAgICAgICBsZXQgcmFuZ2UgPSBnZW5lcmF0ZVJhbmdlKGN1cnJlbnRDZWxsLCBpbmNyZW1lbnRzW2FsaWdubWVudF0sIGhpZ2hsaWdodFJlbW92ZXIpXG4gICAgICAgIHJhbmdlLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb3JkPSR7Y2VsbH1dYClcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdobGlnaHRlZCcpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgaGlnaGxpZ2h0Q2VsbHMgPSAoZSwgcGVybWFuZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGluY3JlbWVudHMgPSB7XG4gICAgICAgICAgICBcImhvcml6b250YWxcIjogWzEsIDBdLFxuICAgICAgICAgICAgXCJ2ZXJ0aWNhbFwiOiBbMCwgMV1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VycmVudENlbGwgPSBlLnRhcmdldC5kYXRhc2V0LmNvcmRcbiAgICAgICAgbGV0IHJhbmdlID0gZ2VuZXJhdGVSYW5nZShjdXJyZW50Q2VsbCwgaW5jcmVtZW50c1thbGlnbm1lbnRdLCBzaGlwc1tjdXJyZW50U2hpcF0pXG4gICAgICAgIHJhbmdlLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb3JkPSR7Y2VsbH1dYClcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHRlZCcpXG4gICAgICAgICAgICBpZihwZXJtYW5lbnQpe1xuICAgICAgICAgICAgICAgIGJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnYmx1ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja0ZvckdhbWVPdmVyID0gKCkgPT4ge1xuICAgICAgICBpZihib3QuYm9hcmQuY2hlY2tGb3JHYW1lT3ZlcigpKXtcbiAgICAgICAgICAgIGdhbWVPdmVyKFwiWW91XCIpXG4gICAgICAgIH0gZWxzZSBpZihwbGF5ZXIuYm9hcmQuY2hlY2tGb3JHYW1lT3ZlcigpKXtcbiAgICAgICAgICAgIGdhbWVPdmVyKFwiRW5lbXlcIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGdhbWVPdmVyID0gKHdpbm5lcikgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm9yZGVyXCIpLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSBIYXMgV29uIWBcbiAgICAgICAgYm90R3JpZC5jaGlsZE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICB2aWV3LnJlbW92ZUxpc3RlbmVycyhcImNsaWNrXCIsIG5vZGUsIGZpcmVCb3gpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3Rpb24nKS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcicpLnRleHRDb250ZW50ID0gXCJGaXJlIEFkbWlyYWwhXCJcbiAgICAgICAgcGxheWVyLmJvYXJkLnJlc2V0KClcbiAgICAgICAgYm90LmJvYXJkLnJlc2V0KClcbiAgICAgICAgYWxpZ25tZW50ID0gJ2hvcml6b250YWwnXG4gICAgICAgIGN1cnJlbnRTaGlwID0gXCJjYXJyaWVyXCJcbiAgICAgICAgaGlnaGxpZ2h0UmVtb3ZlciA9IDVcbiAgICAgICAgc3RhcnRTZWxlY3Rpb25zKClcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydFNlbGVjdGlvbnMsXG4gICAgICAgIGF0dGFjaFJlc2V0TGlzdGVuZXJcbiAgICB9XG5cbn0pKClcblxuZ2FtZUNvbnRvbGxlci5zdGFydFNlbGVjdGlvbnMoKVxuZ2FtZUNvbnRvbGxlci5hdHRhY2hSZXNldExpc3RlbmVyKClcblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9