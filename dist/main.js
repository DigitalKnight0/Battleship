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
        getShips
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

const Bot = (board) => {
    const {playerBoard, shipsLeft} = Player(board)
    const playedCells = []
    let lockMadeAt = ''
    let adjacentCellsToPlay = []
    const sequence = []

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
            const difference = Number(second.slice(1)) - Number(firstslice(1))
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
        const cells = Object.keys(board)
        cells.forEach(cell => {
            const box = document.createElement("div")
            box.dataset.cord = cell
            box.classList.add("cell")
            node.appendChild(box)
        })
    }

    const attachListener = (event, node, fn) => {
        node.addEventListener(event, fn)
    }

    return {
        renderInitialBoard,
        attachListener
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
    const player = (0,_player__WEBPACK_IMPORTED_MODULE_1__.Player)((0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])())
    const bot = (0,_player__WEBPACK_IMPORTED_MODULE_1__.Bot)((0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])())
    const alignment = 'horizontal'
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


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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U0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsS0FBSztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRCIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYmF0dGxlc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3ZpZXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYmF0dGxlU2hpcCA9IChjb3JkcywgbGVuZ3RoKSA9PiB7XG4gICAgY29uc3QgYmxvY2tzID0ge31cbiAgICBsZXQgYWxpdmUgPSB0cnVlXG5cbiAgICBjb25zdCBoaXQgPSAoY29yZHMpID0+IHtcbiAgICAgICAgYmxvY2tzW2NvcmRzXSA9IDBcbiAgICB9XG5cbiAgICBjb25zdCBoaXRJZlBvc3NpYmxlID0gKGNvcmRzKSA9PiB7XG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGJsb2NrcykuaW5jbHVkZXMoY29yZHMpICYmIGJsb2Nrc1tjb3Jkc10gPT0gMSl7XG4gICAgICAgICAgICBoaXQoY29yZHMpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IGlzU3VuayA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYmxvY2tzKS5ldmVyeShpdGVtID0+IGl0ZW0gPT09IDApXG4gICAgfVxuXG4gICAgKChjb3JkcykgPT4ge1xuICAgICAgICBjb3Jkcy5mb3JFYWNoKGNvcmQgPT4ge1xuICAgICAgICAgICAgYmxvY2tzW2NvcmRdID0gMVxuICAgICAgICB9KVxuICAgIH0pKGNvcmRzKVxuXG4gICAgY29uc3QgZ2V0Q29yZHMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhibG9ja3MpXG4gICAgfVxuXG4gICAgY29uc3QgZ2V0Q29yZHNTdGF0dXMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKGJsb2NrcylcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBoaXRJZlBvc3NpYmxlLFxuICAgICAgICBpc1N1bmssXG4gICAgICAgIGdldENvcmRzLFxuICAgICAgICBnZXRDb3Jkc1N0YXR1cyxcbiAgICAgICAgbGVuZ3RoXG4gICAgfVxufVxuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IGJhdHRsZVNoaXBcblxuZXhwb3J0IGRlZmF1bHQgYmF0dGxlU2hpcCIsImltcG9ydCBiYXR0bGVTaGlwIGZyb20gXCIuL2JhdHRsZXNoaXBcIlxuLy8gY29uc3QgYmF0dGxlU2hpcCA9IHJlcXVpcmUoXCIuL2JhdHRsZXNoaXBcIilcbmNvbnN0IGdhbWVCb2FyZCA9ICgpID0+IHtcblxuICAgIGNvbnN0IGJvYXJkID0ge31cbiAgICBjb25zdCBzaGlwcyA9IFtdXG5cbiAgICBjb25zdCBDZWxscyA9IHtcbiAgICAgICAgaGl0OiBcImhpdFwiLFxuICAgICAgICBtaXNzOiBcIm1pc3NcIixcbiAgICAgICAgZW1wdHk6IFwiZW1wdHlcIixcbiAgICAgICAgc2hpcDogXCJzaGlwXCJcbiAgICB9XG5cbiAgICBjb25zdCBpbml0ID0gKCh4LCB5KSA9PiB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB4OyBpKyspe1xuICAgICAgICAgICAgZm9yKGxldCBqPTE7IGogPD0geTsgaisrKXtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW4gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSlcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gY29sdW1uICsgalxuICAgICAgICAgICAgICAgIGJvYXJkW2NlbGxdID0gQ2VsbHMuZW1wdHlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pKDEwLCAxMClcblxuICAgIGNvbnN0IGNhblBsYWNlU2hpcCA9IChjb3JkcykgPT4ge1xuICAgICAgICByZXR1cm4gY29yZHMucmVkdWNlKChzdGF0ZSwgY29yZCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlICE9IGZhbHNlICYmIGJvYXJkW2NvcmRdID09PSBcImVtcHR5XCIgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgfSwgdHJ1ZSlcbiAgICB9XG5cbiAgICBjb25zdCBwbGFjZVNoaXAgPSAoY29yZHMpID0+IHtcbiAgICAgICAgaWYoIWNhblBsYWNlU2hpcChjb3JkcykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2hpcCA9IGJhdHRsZVNoaXAoY29yZHMsIGNvcmRzLmxlbmd0aClcbiAgICAgICAgY29yZHMuZm9yRWFjaChjb3JkID0+IHtcbiAgICAgICAgICAgIGJvYXJkW2NvcmRdID0gQ2VsbHMuc2hpcFxuICAgICAgICB9KVxuICAgICAgICBzaGlwcy5wdXNoKHNoaXApXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY29uc3QgYXZhaWxhYmxlVG9BdHRhY2sgPSAoY29yZCkgPT4ge1xuICAgICAgICByZXR1cm4gYm9hcmRbY29yZF0gPT09IENlbGxzLmVtcHR5IHx8IGJvYXJkW2NvcmRdID09PSBDZWxscy5zaGlwXG4gICAgfVxuXG4gICAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb3JkKSA9PiB7XG4gICAgICAgIGlmKCFhdmFpbGFibGVUb0F0dGFjayhjb3JkKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgaXNNaXNzID0gdHJ1ZVxuICAgICAgICBzaGlwcy5mb3JFYWNoKHNoaXAgPT4ge1xuICAgICAgICAgICAgaWYoc2hpcC5oaXRJZlBvc3NpYmxlKGNvcmQpKXtcbiAgICAgICAgICAgICAgICBpc01pc3MgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBib2FyZFtjb3JkXSA9IGlzTWlzcyA/IENlbGxzLm1pc3MgOiBDZWxscy5oaXRcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja0ZvckdhbWVPdmVyID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gc2hpcHMuZXZlcnkoc2hpcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gc2hpcC5pc1N1bmsoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHJlc2V0ID0gKCkgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhib2FyZCkuZm9yRWFjaChjb3JkID0+IHtcbiAgICAgICAgICAgIGJvYXJkW2NvcmRdID0gQ2VsbHMuZW1wdHlcbiAgICAgICAgfSlcbiAgICAgICAgd2hpbGUoc2hpcHMubGVuZ3RoKXtcbiAgICAgICAgICAgIHNoaXBzLnBvcCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBnZXRCb2FyZCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGJvYXJkXG4gICAgfVxuXG4gICAgY29uc3QgZ2V0U2hpcHMgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBzaGlwc1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHBsYWNlU2hpcCxcbiAgICAgICAgcmVjZWl2ZUF0dGFjayxcbiAgICAgICAgY2hlY2tGb3JHYW1lT3ZlcixcbiAgICAgICAgcmVzZXQsXG4gICAgICAgIGdldEJvYXJkLFxuICAgICAgICBnZXRTaGlwc1xuICAgIH1cbn1cblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBnYW1lQm9hcmRcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUJvYXJkIiwiLy8gY29uc3QgZ2FtZUJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZWJvYXJkXCIpXG5pbXBvcnQgZ2FtZUJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiXG5cbmNvbnN0IFBsYXllciA9IChib2FyZCkgPT4ge1xuICAgIGNvbnN0IHNoaXBzTGVmdCA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2hpcHMgPSBib2FyZC5nZXRTaGlwcygpXG4gICAgICAgIHJldHVybiBzaGlwcy5maWx0ZXIoc2hpcCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIXNoaXAuaXNTdW5rKClcbiAgICAgICAgfSkubGVuZ3RoXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGJvYXJkLFxuICAgICAgICBzaGlwc0xlZnRcbiAgICB9XG59XG5cbmNvbnN0IEJvdCA9IChib2FyZCkgPT4ge1xuICAgIGNvbnN0IHtwbGF5ZXJCb2FyZCwgc2hpcHNMZWZ0fSA9IFBsYXllcihib2FyZClcbiAgICBjb25zdCBwbGF5ZWRDZWxscyA9IFtdXG4gICAgbGV0IGxvY2tNYWRlQXQgPSAnJ1xuICAgIGxldCBhZGphY2VudENlbGxzVG9QbGF5ID0gW11cbiAgICBjb25zdCBzZXF1ZW5jZSA9IFtdXG5cbiAgICBjb25zdCBnZW5lcmF0ZUFkamFjZW50Q2VsbHMgPSAoY29yZCkgPT4ge1xuICAgICAgICBjb25zdCBhZGphY2VudHMgPSBbXVxuICAgICAgICBjb25zdCByb3cgPSBjb3JkLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IGNvcmRbMF1cbiAgICAgICAgYWRqYWNlbnRzLnB1c2goYCR7Y29sdW1ufSR7TnVtYmVyKHJvdykgKyAxfWApXG4gICAgICAgIGFkamFjZW50cy5wdXNoKGAke2NvbHVtbn0ke051bWJlcihyb3cpIC0gMX1gKVxuICAgICAgICBhZGphY2VudHMucHVzaChgJHtTdHJpbmcuZnJvbUNoYXJDb2RlKGNvbHVtbi5jaGFyQ29kZUF0KDApICsgMSl9JHtyb3d9YClcbiAgICAgICAgYWRqYWNlbnRzLnB1c2goYCR7U3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW4uY2hhckNvZGVBdCgwKSAtIDEpfSR7cm93fWApXG4gICAgICAgIHJldHVybiBhZGphY2VudHNcbiAgICB9XG5cbiAgICBjb25zdCBpc1BsYXlhYmxlQ2VsbCA9IChjb3JkLCBvcHBvbmVudEJvYXJkKSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvcHBvbmVudEJvYXJkKS5pbmNsdWRlcyhjb3JkKSAmJlxuICAgICAgICAgICAgICAgICAgICAob3Bwb25lbnRCb2FyZFtjb3JkXSA9PT0gJ2VtcHR5JyB8fCBvcHBvbmVudEJvYXJkW2NvcmRdID09PSAnc2hpcCcpIFxuICAgIH1cblxuICAgIGNvbnN0IGdldEFkamFjZW50Q2VsbHMgPSAob3Bwb25lbnRCb2FyZCkgPT4ge1xuICAgICAgICBjb25zdCBsYXN0TW92ZSA9IGxvY2tNYWRlQXRcbiAgICAgICAgY29uc3QgYWRqYWNlbnRDZWxscyA9IGdlbmVyYXRlQWRqYWNlbnRDZWxscyhsYXN0TW92ZSlcbiAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHMuZmlsdGVyKGNvcmQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGlzUGxheWFibGVDZWxsKGNvcmQsIG9wcG9uZW50Qm9hcmQpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdHJ5QW5kRm9ybVNlcXVlbmNlID0gKGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBsZXQgZmlyc3QsIHNlY29uZFxuICAgICAgICBpZihkaXJlY3Rpb24gPT09ICd1cCcpe1xuICAgICAgICAgICAgZmlyc3QgPSBzZXF1ZW5jZVtzZXF1ZW5jZS5sZW5ndGggLSAyXVxuICAgICAgICAgICAgc2Vjb25kID0gc2VxdWVuY2Vbc2VxdWVuY2UubGVuZ3RoIC0gMV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcXVlbmNlLnJldmVyc2UoKVxuICAgICAgICAgICAgZmlyc3QgPSBzZXF1ZW5jZVtzZXF1ZW5jZS5sZW5ndGggLSAyXVxuICAgICAgICAgICAgc2Vjb25kID0gc2VxdWVuY2Vbc2VxdWVuY2UubGVuZ3RoIC0gMV1cbiAgICAgICAgfVxuICAgICAgICBpZihmaXJzdFswXSA9PT0gc2Vjb25kWzBdKXtcbiAgICAgICAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBOdW1iZXIoc2Vjb25kLnNsaWNlKDEpKSAtIE51bWJlcihmaXJzdHNsaWNlKDEpKVxuICAgICAgICAgICAgcmV0dXJuIGAke3NlY29uZFswXX0ke051bWJlcihzZWNvbmQuc2xpY2UoMSkpICsgZGlmZmVyZW5jZX1gXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlID0gc2Vjb25kWzBdLmNoYXJDb2RlQXQoMCkgLSBmaXJzdFswXS5jaGFyQ29kZUF0KDApXG4gICAgICAgICAgICByZXR1cm4gYCR7U3RyaW5nLmZyb21DaGFyQ29kZShzZWNvbmRbMF0uY2hhckNvZGVBdCgwKSArIGRpZmZlcmVuY2UpfSR7c2Vjb25kLnNsaWNlKDEpfWBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG5leHRJblNlcXVlbmNlID0gKG9wcG9uZW50Qm9hcmQpID0+IHtcbiAgICAgICAgaWYoc2VxdWVuY2UubGVuZ3RoIDwgMil7XG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxsc1RvUGxheS5wb3AoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYobGFzdEhpdE9yTWlzcyhvcHBvbmVudEJvYXJkKSA9PT0gJ2hpdCcpe1xuICAgICAgICAgICAgICAgIHJldHVybiBpc1BsYXlhYmxlQ2VsbCh0cnlBbmRGb3JtU2VxdWVuY2UoJ3VwJyksIG9wcG9uZW50Qm9hcmQpID8gdHJ5QW5kRm9ybVNlcXVlbmNlKCd1cCcpIDogdHJ5QW5kRm9ybVNlcXVlbmNlKCdkb3duJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyeUFuZEZvcm1TZXF1ZW5jZSgnZG93bicpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjbGVhckxvY2sgPSAoKSA9PiB7XG4gICAgICAgIGxvY2tNYWRlQXQgPSAnJ1xuICAgICAgICB3aGlsZShzZXF1ZW5jZS5sZW5ndGgpe1xuICAgICAgICAgICAgc2VxdWVuY2UucG9wKClcbiAgICAgICAgfVxuICAgICAgICB3aGlsZShhZGphY2VudENlbGxzVG9QbGF5Lmxlbmd0aCl7XG4gICAgICAgICAgICBhZGphY2VudENlbGxzVG9QbGF5LnBvcCgpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGNvbnN0IG1hbmFnZVNlcXVlbmNlID0gKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50U2hpcHMpID0+IHtcbiAgICAgICAgaWYobG9ja01hZGVBdCAhPT0gJycpe1xuICAgICAgICAgICAgaWYocHJldlNoaXBTdW5rKG9wcG9uZW50U2hpcHMpKXtcbiAgICAgICAgICAgICAgICBjbGVhckxvY2soKVxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Nb3ZlKG9wcG9uZW50Qm9hcmQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKGxhc3RIaXRPck1pc3Mob3Bwb25lbnRCb2FyZCkgPT09ICdoaXQnKXtcbiAgICAgICAgICAgICAgICAgICAgc2VxdWVuY2UucHVzaChwbGF5ZWRDZWxsc1twbGF5ZWRDZWxscy5sZW5ndGggLSAxXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHRJblNlcXVlbmNlKG9wcG9uZW50Qm9hcmQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKGxhc3RIaXRPck1pc3Mob3Bwb25lbnRCb2FyZCkgPT09ICdoaXQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxvY2tNYWRlQXQgPSBwbGF5ZWRDZWxsc1twbGF5ZWRDZWxscy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgICAgIHNlcXVlbmNlLnB1c2gobG9ja01hZGVBdClcbiAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzVG9QbGF5ID0gZ2V0QWRqYWNlbnRDZWxscyhvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0SW5TZXF1ZW5jZShvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0UmFuZG9tTW92ZShvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdEhpdE9yTWlzcyA9IChvcHBvbmVudEJvYXJkKSA9PiB7XG4gICAgICAgIGlmKCFwbGF5ZWRDZWxscy5sZW5ndGgpIHJldHVyblxuICAgICAgICByZXR1cm4gb3Bwb25lbnRCb2FyZFtwbGF5ZWRDZWxsc1twbGF5ZWRDZWxscy5sZW5ndGggLSAxXV1cbiAgICB9XG5cbiAgICBjb25zdCBwcmV2U2hpcFN1bmsgPSAob3Bwb25lbnRTaGlwcykgPT4ge1xuICAgICAgICBjb25zdCBsYXN0UGxheSA9IGxvY2tNYWRlQXRcbiAgICAgICAgY29uc3QgY3Vyc2hpcCA9IG9wcG9uZW50U2hpcHMucmVkdWNlKChzaGlwLCBjX3NoaXApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBDb3JkcyA9IGNfc2hpcC5nZXRDb3JkcygpXG4gICAgICAgICAgICByZXR1cm4gc2hpcENvcmRzLmluY2x1ZGVzKGxhc3RQbGF5KSA/IGNfc2hpcCA6IC0xXG4gICAgICAgIH0sIC0xKVxuICAgICAgICByZXR1cm4gY3Vyc2hpcCAhPT0gLTEgPyBjdXJzaGlwLmlzU3VuaygpIDogLTFcbiAgICB9XG5cbiAgICBjb25zdCBnZXRSYW5kb21Nb3ZlID0gKG9wcG9uZW50Qm9hcmQpID0+IHtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQmxvY2tzID0gT2JqZWN0LmtleXMob3Bwb25lbnRCb2FyZCkuZmlsdGVyKGNvcmQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICFwbGF5ZWRDZWxscy5pbmNsdWRlcyhjb3JkKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlQmxvY2tzW01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkqYXZhaWxhYmxlQmxvY2tzLmxlbmd0aCkpXTtcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlTW92ZSA9IChvcHBvbmVudEJvYXJkLCBvcHBvbmVudFNoaXBzLCBpc1NtYXJ0KSA9PiB7XG4gICAgICAgIGlmKGlzU21hcnQpe1xuICAgICAgICAgICAgbGV0IGNvcmQgPSBtYW5hZ2VTZXF1ZW5jZShvcHBvbmVudEJvYXJkLCBvcHBvbmVudFNoaXBzKVxuICAgICAgICAgICAgcGxheWVkQ2VsbHMucHVzaChjb3JkKVxuICAgICAgICAgICAgcmV0dXJuIGNvcmRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjb3JkID0gZ2V0UmFuZG9tTW92ZShvcHBvbmVudEJvYXJkKVxuICAgICAgICAgICAgcGxheWVkQ2VsbHMucHVzaChjb3JkKVxuICAgICAgICAgICAgcmV0dXJuIGNvcmRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRlYnVnTWFrZU1vdmUgPSAoY29yZCkgPT4ge1xuICAgICAgICBwbGF5ZWRDZWxscy5wdXNoKGNvcmQpXG4gICAgfVxuXG5cbiAgICByZXR1cm4ge21ha2VNb3ZlLCBwbGF5ZXJCb2FyZCwgc2hpcHNMZWZ0LCBkZWJ1Z01ha2VNb3ZlfVxufVxuXG4vKlxuY29uc3QgbXlCb2FyZCA9IGdhbWVCb2FyZCgpXG5jb25zdCBvcHBvbmVudEJvYXJkQ29udHJvbGxlciA9IGdhbWVCb2FyZCgpXG5jb25zdCBvcHBvbmVudEJvYXJkID0gb3Bwb25lbnRCb2FyZENvbnRyb2xsZXIuZ2V0Qm9hcmQoKVxuY29uc3Qgb3Bwb25lbnRTaGlwcyA9IG9wcG9uZW50Qm9hcmRDb250cm9sbGVyLmdldFNoaXBzKClcbmNvbnN0IGJvdCA9IEJvdChteUJvYXJkKVxub3Bwb25lbnRCb2FyZENvbnRyb2xsZXIucGxhY2VTaGlwKFsnQTEnLCAnQTInLCAnQTMnXSlcbm9wcG9uZW50Qm9hcmRDb250cm9sbGVyLnJlY2VpdmVBdHRhY2soJ0ExJylcbmJvdC5kZWJ1Z01ha2VNb3ZlKCdBMScpXG5jb25zdCBwb3NzaWJsZU1vdmVzID0gWydBMicsICdCMSddXG5sZXQgbW92ZSA9IGJvdC5tYWtlTW92ZShvcHBvbmVudEJvYXJkLCBvcHBvbmVudFNoaXBzLCB0cnVlKVxuY29uc29sZS5sb2cobW92ZSlcbm9wcG9uZW50Qm9hcmRDb250cm9sbGVyLnJlY2VpdmVBdHRhY2soJ0IxJylcbmNvbnNvbGUubG9nKG9wcG9uZW50U2hpcHMpXG5tb3ZlID0gYm90Lm1ha2VNb3ZlKG9wcG9uZW50Qm9hcmQsIG9wcG9uZW50U2hpcHMsIHRydWUpXG5jb25zb2xlLmxvZyhtb3ZlKVxub3Bwb25lbnRCb2FyZENvbnRyb2xsZXIucmVjZWl2ZUF0dGFjaygnQTInKVxubW92ZSA9IGJvdC5tYWtlTW92ZShvcHBvbmVudEJvYXJkLCBvcHBvbmVudFNoaXBzLCB0cnVlKVxuY29uc29sZS5sb2cobW92ZSlcbiovXG5cblxuZXhwb3J0ICB7UGxheWVyLCBCb3R9IiwiXG5jb25zdCBWaWV3ID0gKCkgPT4ge1xuICAgIGNvbnN0IHJlbmRlckluaXRpYWxCb2FyZCA9IChib2FyZCwgbm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBjZWxscyA9IE9iamVjdC5rZXlzKGJvYXJkKVxuICAgICAgICBjZWxscy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgY29uc3QgYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICAgICAgYm94LmRhdGFzZXQuY29yZCA9IGNlbGxcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKVxuICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChib3gpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgYXR0YWNoTGlzdGVuZXIgPSAoZXZlbnQsIG5vZGUsIGZuKSA9PiB7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4pXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVySW5pdGlhbEJvYXJkLFxuICAgICAgICBhdHRhY2hMaXN0ZW5lclxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlldyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCB7IFBsYXllciwgQm90IH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCI7XG5cbmNvbnN0IGdhbWVDb250b2xsZXIgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHBsYXllciA9IFBsYXllcihnYW1lQm9hcmQoKSlcbiAgICBjb25zdCBib3QgPSBCb3QoZ2FtZUJvYXJkKCkpXG4gICAgY29uc3QgYWxpZ25tZW50ID0gJ2hvcml6b250YWwnXG4gICAgbGV0IGN1cnJlbnRTaGlwID0gXCJjYXJyaWVyXCJcbiAgICBsZXQgaGlnaGxpZ2h0UmVtb3ZlciA9IDVcbiAgICBjb25zdCB2aWV3ID0gVmlldygpXG4gICAgY29uc3Qgc2hpcHMgPSB7XG4gICAgICAgIGNhcnJpZXI6IDUsXG4gICAgICAgIGJhdHRsZXNoaXA6IDQsXG4gICAgICAgIGRlc3Ryb3llcjogMyxcbiAgICAgICAgc3VibWFyaW5lOiAzLFxuICAgICAgICBwYXRyb2xCb2F0OiAyXG4gICAgfVxuICAgIGNvbnN0IHNoaXBzT3JkZXIgPSBPYmplY3Qua2V5cyhzaGlwcylcbiAgICBPYmplY3QuZnJlZXplKHNoaXBzT3JkZXIpXG4gICAgT2JqZWN0LmZyZWV6ZShzaGlwcylcblxuICAgIGNvbnN0IHN0YXJ0U2VsZWN0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkJylcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQgPSBgUGxhY2UgeW91ciAke2N1cnJlbnRTaGlwfWBcbiAgICAgICAgdmlldy5yZW5kZXJJbml0aWFsQm9hcmQocGxheWVyLmJvYXJkLmdldEJvYXJkKCksIGdyaWQpXG4gICAgICAgIGdyaWQuY2hpbGROb2Rlcy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgICAgICAgdmlldy5hdHRhY2hMaXN0ZW5lcignbW91c2VlbnRlcicsIGNlbGwsIGhpZ2hsaWdodENlbGxzKVxuICAgICAgICAgICAgdmlldy5hdHRhY2hMaXN0ZW5lcignbW91c2VsZWF2ZScsIGNlbGwsIHJlbW92ZWhpZ2hsaWdodHMpXG4gICAgICAgICAgICB2aWV3LmF0dGFjaExpc3RlbmVyKCdjbGljaycsIGNlbGwsIHBsYWNlU2hpcClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBwbGFjZVNoaXAgPSAoZSkgPT4ge1xuICAgICAgICBjb25zdCBpbmNyZW1lbnRzID0ge1xuICAgICAgICAgICAgXCJob3Jpem9udGFsXCI6IFsxLCAwXSxcbiAgICAgICAgICAgIFwidmVyaXRpY2FsXCI6IFswLCAxXVxuICAgICAgICB9XG4gICAgICAgIGxldCBjdXJyZW50Q2VsbCA9IGUudGFyZ2V0LmRhdGFzZXQuY29yZFxuICAgICAgICBsZXQgcmFuZ2UgPSBnZW5lcmF0ZVJhbmdlKGN1cnJlbnRDZWxsLCBpbmNyZW1lbnRzW2FsaWdubWVudF0sIHNoaXBzW2N1cnJlbnRTaGlwXSlcbiAgICAgICAgaWYocmFuZ2UubGVuZ3RoIDwgc2hpcHNbY3VycmVudFNoaXBdKSByZXR1cm5cbiAgICAgICAgaWYoIXBsYXllci5ib2FyZC5wbGFjZVNoaXAocmFuZ2UpKSByZXR1cm5cbiAgICAgICAgaGlnaGxpZ2h0Q2VsbHMoZSwgdHJ1ZSlcbiAgICAgICAgY3VycmVudFNoaXAgPSBzaGlwc09yZGVyW3NoaXBzT3JkZXIuaW5kZXhPZihjdXJyZW50U2hpcCkgKyAxXVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCA9IGBQbGFjZSB5b3VyICR7Y3VycmVudFNoaXB9YFxuICAgICAgICBoaWdobGlnaHRSZW1vdmVyID0gc2hpcHNbY3VycmVudFNoaXBdICsgMSBcbiAgICAgICAgaWYoY3VycmVudFNoaXAgPT09ICdwYXRyb2xCb2FyZCcpXG4gICAgICAgIHN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuXG4gICAgfVxuXG4gICAgY29uc3QgZ2VuZXJhdGVSYW5nZSA9IChjb3JkLCBhbGlnbm1lbnQsIGxlbmd0aCkgPT4ge1xuICAgICAgICBjb25zdCByYW5nZSA9IFtjb3JkXVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGVuZ3RoIC0gMTsgaSsrKXtcbiAgICAgICAgICAgIGxldCBsYXN0Q29yZCA9IHJhbmdlW3JhbmdlLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBsZXQgcm93ID0gbGFzdENvcmQuc2xpY2UoMSlcbiAgICAgICAgICAgIGxldCBjb2x1bW4gPSBsYXN0Q29yZC5jaGFyQ29kZUF0KDApXG4gICAgICAgICAgICByb3cgPSBOdW1iZXIocm93KSArIGFsaWdubWVudFsxXVxuICAgICAgICAgICAgY29sdW1uID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2x1bW4gKyBhbGlnbm1lbnRbMF0pXG4gICAgICAgICAgICByYW5nZS5wdXNoKGAke2NvbHVtbn0ke3Jvd31gKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYW5nZS5maWx0ZXIoY29yZCA9PiBPYmplY3Qua2V5cyhwbGF5ZXIuYm9hcmQuZ2V0Qm9hcmQoKSkuaW5jbHVkZXMoY29yZCkpXG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3ZlaGlnaGxpZ2h0cyA9IChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGluY3JlbWVudHMgPSB7XG4gICAgICAgICAgICBcImhvcml6b250YWxcIjogWzEsIDBdLFxuICAgICAgICAgICAgXCJ2ZXJpdGljYWxcIjogWzAsIDFdXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN1cnJlbnRDZWxsID0gZS50YXJnZXQuZGF0YXNldC5jb3JkXG4gICAgICAgIGxldCByYW5nZSA9IGdlbmVyYXRlUmFuZ2UoY3VycmVudENlbGwsIGluY3JlbWVudHNbYWxpZ25tZW50XSwgaGlnaGxpZ2h0UmVtb3ZlcilcbiAgICAgICAgcmFuZ2UuZm9yRWFjaChjZWxsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvcmQ9JHtjZWxsfV1gKVxuICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2hsaWdodGVkJylcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBoaWdobGlnaHRDZWxscyA9IChlLCBwZXJtYW5lbnQpID0+IHtcbiAgICAgICAgY29uc3QgaW5jcmVtZW50cyA9IHtcbiAgICAgICAgICAgIFwiaG9yaXpvbnRhbFwiOiBbMSwgMF0sXG4gICAgICAgICAgICBcInZlcml0aWNhbFwiOiBbMCwgMV1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VycmVudENlbGwgPSBlLnRhcmdldC5kYXRhc2V0LmNvcmRcbiAgICAgICAgbGV0IHJhbmdlID0gZ2VuZXJhdGVSYW5nZShjdXJyZW50Q2VsbCwgaW5jcmVtZW50c1thbGlnbm1lbnRdLCBzaGlwc1tjdXJyZW50U2hpcF0pXG4gICAgICAgIHJhbmdlLmZvckVhY2goY2VsbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb3JkPSR7Y2VsbH1dYClcbiAgICAgICAgICAgIGJveC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHRlZCcpXG4gICAgICAgICAgICBpZihwZXJtYW5lbnQpe1xuICAgICAgICAgICAgICAgIGJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnYmx1ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydFNlbGVjdGlvbnNcbiAgICB9XG5cbn0pKClcblxuZ2FtZUNvbnRvbGxlci5zdGFydFNlbGVjdGlvbnMoKVxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=