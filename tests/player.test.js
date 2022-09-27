import {Player, Bot} from "../src/player";
import gameBoard from "../src/gameboard";

describe("ships left", () => {
    const myBoard = gameBoard()
    const player = Player(myBoard)

    test("returns correct number of ships 1", () => {
        player.board.placeShip(['A1', 'A2'])
        player.board.placeShip(['B1', 'B2'])
        player.board.receiveAttack('A1')
        player.board.receiveAttack('B1')
        expect(player.shipsLeft()).toBe(2)
    })

    test("returns correct number of ships 1", () => {
        player.board.receiveAttack('A2')
        expect(player.shipsLeft()).toBe(1)
    })
})

describe("Makes correct Moves in forward direction", () => {
    const myBoard = gameBoard()
    const opponentBoardController = gameBoard()
    const opponentBoard = opponentBoardController.getBoard()
    const opponentShips = opponentBoardController.getShips()
    const bot = Bot(myBoard)

    test("Returns random move first", () => {
        expect(typeof bot.makeMove(opponentBoard, opponentShips, false)).toBe('string')
    })

    test("gives one of the adjacent cells after locking", () => {
        opponentBoardController.placeShip(['A1', 'A2', 'A3'])
        opponentBoardController.receiveAttack('A1')
        bot.debugMakeMove('A1')
        const possibleMoves = ['A2', 'B1']
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(possibleMoves.includes(move)).toBe(true)
    })

    test("gives one of the adjacent cells after locking 2", () => {
        opponentBoardController.receiveAttack('B1')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('A2')
    })

    test("Forms a perfect sequence after two hits", () => {
        opponentBoardController.receiveAttack('A2')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('A3')
    })

    test("Makes a new random move next", () => {
        opponentBoardController.receiveAttack('A3')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        let result = !(['A1', 'A2', 'A3', 'B1'].includes(move)) && typeof move === 'string'
        expect(result).toBe(true)
    })

})

describe("Makes correct Moves in forwards direction (row)", () => {
    const myBoard = gameBoard()
    const opponentBoardController = gameBoard()
    const opponentBoard = opponentBoardController.getBoard()
    const opponentShips = opponentBoardController.getShips()
    const bot = Bot(myBoard)

    test("Returns random move first", () => {
        expect(typeof bot.makeMove(opponentBoard, opponentShips, false)).toBe('string')
    })

    test("gives one of the adjacent cells after locking", () => {
        opponentBoardController.placeShip(['A1', 'B1', 'C1'])
        opponentBoardController.receiveAttack('A1')
        bot.debugMakeMove('A1')
        const possibleMoves = ['A2', 'B1']
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(possibleMoves.includes(move)).toBe(true)
    })


    test("Forms a perfect sequence after two hits", () => {
        opponentBoardController.receiveAttack('B1')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('C1')
    })

    test("Makes a new random move next", () => {
        opponentBoardController.receiveAttack('C1')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        let result = !(['A1', 'B1', 'C1'].includes(move)) && typeof move === 'string'
        expect(result).toBe(true)
    })

})

describe("Makes correct Moves in Backwards direction", () => {
    const myBoard = gameBoard()
    const opponentBoardController = gameBoard()
    const opponentBoard = opponentBoardController.getBoard()
    const opponentShips = opponentBoardController.getShips()
    const bot = Bot(myBoard)

    test("Returns random move first", () => {
        expect(typeof bot.makeMove(opponentBoard, opponentShips, false)).toBe('string')
    })

    test("gives one of the adjacent cells after locking", () => {
        opponentBoardController.placeShip(['A1', 'A2', 'A3'])
        opponentBoardController.receiveAttack('A3')
        bot.debugMakeMove('A3')
        const possibleMoves = ['A2', 'B3', 'A4']
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(possibleMoves.includes(move)).toBe(true)
    })

    test("gives one of the adjacent cells after locking 2", () => {
        opponentBoardController.receiveAttack('B3')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('A2')
    })

    test("Forms a perfect sequence after two hits", () => {
        opponentBoardController.receiveAttack('A2')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('A1')
    })

    test("Makes a new random move next", () => {
        opponentBoardController.receiveAttack('A3')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        let result = !(['A1', 'A2', 'A3', 'B3'].includes(move)) && typeof move === 'string'
        expect(result).toBe(true)
    })

})

describe("Makes correct Moves in Both directions", () => {
    const myBoard = gameBoard()
    const opponentBoardController = gameBoard()
    const opponentBoard = opponentBoardController.getBoard()
    const opponentShips = opponentBoardController.getShips()
    const bot = Bot(myBoard)

    test("Returns random move first", () => {
        expect(typeof bot.makeMove(opponentBoard, opponentShips, false)).toBe('string')
    })

    test("gives one of the adjacent cells after locking", () => {
        opponentBoardController.placeShip(['B2', 'C2', 'D2', 'E2'])
        opponentBoardController.receiveAttack('D2')
        bot.debugMakeMove('D2')
        const possibleMoves = ['B2', 'C2', 'E2']
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(possibleMoves.includes(move)).toBe(true)
    })


    test("Forms a perfect sequence after two hits", () => {
        opponentBoardController.receiveAttack('C2')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('B2')
    })

    test("Hits an empty tile after Three hits", () => {
        opponentBoardController.receiveAttack('B2')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('A2')
    })

    test("Reverses the Order if the ship is alive", () => {
        opponentBoardController.receiveAttack('A2')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        expect(move).toBe('E2')
    })


    test("Makes a new random move next", () => {
        opponentBoardController.receiveAttack('E2')
        let move = bot.makeMove(opponentBoard, opponentShips, true)
        let result = !(['A2', 'B2', 'C2', 'D2', 'E2'].includes(move)) && typeof move === 'string'
        expect(result).toBe(true)
    })

})

describe("Places all ships randomly", () => {

    test("places all 5 ships randomly", () => {
        const myBoard = gameBoard()
        const bot = Bot(myBoard)
        bot.placeShips()
        let ships = bot.board.getShips()
        expect(ships.length).toBe(5)
    })

    test("places all 5 ships randomly with proper lengths", () => {
        const myBoard = gameBoard()
        const bot = Bot(myBoard)
        bot.placeShips()
        let ships = bot.board.getShips()
        const lengths = ships.map(ship => ship.length)
        expect(lengths).toEqual([5, 4, 3, 3, 2])
    })
})