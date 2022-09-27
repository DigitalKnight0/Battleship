
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

export default View