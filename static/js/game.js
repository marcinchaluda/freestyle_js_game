CELL_SIZE = [7, 10, 11, 12];
NUMBER_OF_CELLS = 10;
const VIRUSES = [];
const gameField = document.querySelector('game-field');

// event handler functions
const cellHandlers = {
    dragStart: function (e) {
        e.dataTransfer.setData('text/plain', e.target.innerText);
        e.target.id = Date.now().toString();
        e.dataTransfer.setData('text/elementid', e.target.id)
        console.log('dragstart');
    },
    dragEnd: function (e) {
        console.log('dragend');
    },
    dragEnter : function (e) {
        e.preventDefault();
        e.target.classList.add(/* state change of drop target class */);
        console.log('dragenter');
    },
    dragOver: function (e) {
        e.preventDefault();
        console.log('dragover');
    },
    dragLeave: function (e) {
        console.log('dragleave');
    },
    drop: function (e) {
        e.preventDefault();
        let draggedElement = document.getElementById(e.dataTransfer.getData('text/elementid'));
        if (!(e.target).isSameNode(draggedElement)) {
            const population = e.dataTransfer.getData('text/plain');
            e.target.textContent = population;
            console.log('drop');
        }
    }

}

const addCellListeners = function (element) {
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', cellHandlers.dragStart);
    element.addEventListener('dragend', cellHandlers.dragEnd);
    element.addEventListener('dragenter', cellHandlers.dragEnter);
    element.addEventListener('dragover', cellHandlers.dragOver);
    element.addEventListener('dragleave', cellHandlers.dragLeave );
    element.addEventListener('drop', cellHandlers.drop);
}

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    generateCells();
    insertVirusesOnGameField();
}

function generateCells () {
    const percentRandomizer = (distance) => ((Math.random() * distance) | 0) + '%';
    for (let i = 0; i < NUMBER_OF_CELLS; i++) {
        let cell = {
            left: percentRandomizer(3),
            top: percentRandomizer(60),
            // centerX: this.offset.left + this.width / 2,
            // centerY: this.offset.top + this.height / 2,
        };
        VIRUSES.push(cell)
    }
    console.log(VIRUSES)
}

function insertVirusesOnGameField () {
    for (let i = 0; i < VIRUSES.length; i++) {
        const cellContainer = document.createElement('div');
        cellContainer.style.background = "url('static/img/virus_default.png')";
        cellContainer.style.backgroundSize = 'cover';
        cellContainer.classList.add('cell');
        cellContainer.style.left = VIRUSES[i].left;
        cellContainer.style.top = VIRUSES[i].top;
        cellContainer.style.width = `${CELL_SIZE[Math.floor(Math.random() * CELL_SIZE.length)]}%`;
        cellContainer.style.height = Number(cellContainer.style.width.replace('%', ''))
            * 1.778 + '%';
        addCellListeners(cellContainer);
        document.querySelector('.game_field').appendChild(cellContainer);
    }

}
