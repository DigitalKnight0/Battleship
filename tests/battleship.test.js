import battleShip from "../src/battleship";

describe("initialization tests", () => {
    test("Sets the blocks correctly", () => {
        const cords = ['1, 1', '1, 2', '1, 3']
        const myShip = battleShip(cords, 'vertical')
        expect(myShip.getCords()).toEqual(cords)
    })
})

describe("Hiting mechanism", () => {
    const cords = ['1, 1', '1, 2', '1, 3']
    const myShip = battleShip(cords, 'vertical')
    
    test("Hits the ship properly", () => {
        const hitCord = '1, 2'
        myShip.hitIfPossible(hitCord)
        expect(myShip.getCordsStatus()).toEqual([1, 0, 1])
    })

    test("Returns true if hit", () => {
        const hitCord = '1, 1'
        const result = myShip.hitIfPossible(hitCord)
        expect(result).toBe(true)
    })

    test("Returns false if cannot hit", () => {
        const hitCord = '1, 6'
        const result = myShip.hitIfPossible(hitCord)
        expect(result).toBe(false)
    })

    test("Returns false if block is already hit", () => {
        const hitCord = '1, 1'
        const result = myShip.hitIfPossible(hitCord)
        expect(result).toBe(false)
    })
})

describe("shows sink status", () => {
    test("returns true if the ship has sunk", () => {
        const cords = ['1, 1']
        const myShip = battleShip(cords, 'vertical')
        const hitCord = '1, 1'
        const result = myShip.hitIfPossible(hitCord)
        expect(myShip.isSunk()).toBe(true)
    })

    test("returns false if the ship has sunk", () => {
        const cords = ['1, 1']
        const myShip = battleShip(cords, 'vertical')
        expect(myShip.isSunk()).toBe(false)
    })
})