import battleShip from "../src/battleship";

describe("initialization tests", () => {
    test("Sets the blocks correctly", () => {
        const cords = ['A1', 'A2', 'A3']
        const myShip = battleShip(cords, 3)
        expect(myShip.getCords()).toEqual(cords)
    })
})

describe("Hiting mechanism", () => {
    const cords = ['A1', 'A2', 'A3']
    const myShip = battleShip(cords, 3)
    
    test("Hits the ship properly", () => {
        const hitCord = 'A2'
        myShip.hitIfPossible(hitCord)
        expect(myShip.getCordsStatus()).toEqual([1, 0, 1])
    })

    test("Returns true if hit", () => {
        const hitCord = 'A1'
        const result = myShip.hitIfPossible(hitCord)
        expect(result).toBe(true)
    })

    test("Returns false if cannot hit", () => {
        const hitCord = 'A6'
        const result = myShip.hitIfPossible(hitCord)
        expect(result).toBe(false)
    })

    test("Returns false if block is already hit", () => {
        const hitCord = 'A1'
        const result = myShip.hitIfPossible(hitCord)
        expect(result).toBe(false)
    })
})

describe("shows sink status", () => {
    test("returns true if the ship has sunk", () => {
        const cords = ['A1']
        const myShip = battleShip(cords, 1)
        const hitCord = 'A1'
        const result = myShip.hitIfPossible(hitCord)
        expect(myShip.isSunk()).toBe(true)
    })

    test("returns false if the ship has sunk", () => {
        const cords = ['A1']
        const myShip = battleShip(cords, 1)
        expect(myShip.isSunk()).toBe(false)
    })
})