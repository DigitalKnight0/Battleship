const battleShip = (cords, alignment) => {
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
        alignment
    }
}

export default battleShip