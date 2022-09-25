
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

export default View