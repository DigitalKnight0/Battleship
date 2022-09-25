import gameBoard from "../src/gameboard";

const checkRangeHelper = (board, ranges, signature) => {
    return ranges.reduce((state, cord) => {
        return state != false && board[cord] === signature ? true : false
    }, true)
}

describe("Placing Ships", () => {
    const myBoard = gameBoard()
    test("It places a new ship", () => {
        const ranges = ['A1', 'A2', 'A3']
        myBoard.placeShip(ranges)
        const board = myBoard.getBoard()
        expect(checkRangeHelper(board, ranges, "ship")).toBe(true)
    })

    test("Does not place a new ship if not empty", () => {
        const ranges = ['A3', 'A4', 'A5']
        myBoard.placeShip(ranges)
        const ships = myBoard.getShips().length
        expect(ships).toBe(1)
    })
})

describe("Receive Attacks", () => {
    const myBoard = gameBoard()
    test("marks an attacked spot as miss if no ship", () => {
        myBoard.receiveAttack('A1')
        const board = myBoard.getBoard()
        expect(board['A1']).toBe('miss')
    })

    test("marks an attacked spot as hit if ship", () => {
        myBoard.placeShip(['A2'])
        myBoard.receiveAttack('A2')
        const board = myBoard.getBoard()
        expect(board['A2']).toBe('hit')
    })

    test('does not remark miss or hit spots', () => {
        expect(myBoard.receiveAttack('A2')).toBe(false)
    })
})

describe("Game Over", () => {
    const myBoard = gameBoard()
    test("returns true when all ships have sunk", () => {
        myBoard.placeShip(['B1', 'B2'])
        myBoard.placeShip(['A3', 'A4', 'A5']);
        ['B1', 'B2', 'A3', 'A4', 'A5'].forEach(cord => {
            myBoard.receiveAttack(cord)
        });
        expect(myBoard.checkForGameOver()).toBe(true)
    })

    test("returns false when some ships available", () => {
        myBoard.placeShip(['C1', 'C2'])
        myBoard.placeShip(['D3', 'D4', 'D5']);
        ['C1', 'C2', 'D3', 'D4'].forEach(cord => {
            myBoard.receiveAttack(cord)
        });
        expect(myBoard.checkForGameOver()).toBe(false)
    })
})

test("Clears the Board", () => {
    const myBoard = gameBoard()
    myBoard.placeShip(['C1', 'C2'])
    myBoard.placeShip(['D3', 'D4', 'D5'])
    myBoard.reset()
    const board = myBoard.getBoard()
    const ships = myBoard.getShips()
    const allEmpty = Object.values(board).every(cell => cell === "empty")
    expect(allEmpty).toBe(true)
    expect(ships.length).toBe(0)
})