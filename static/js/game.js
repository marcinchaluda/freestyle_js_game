CELL_SIZE = [7, 10, 11, 12];
NUMBER_OF_CELLS = 12;
const VIRUSES = [];
FIELD_WIDTH = 768;
FIELD_HEIGHT = 250;
FIELD_RATIO = 1.778

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

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    generateCells();
    insertVirusesOnGameField();
}

function generateCells () {
    for (let i = 0; i < NUMBER_OF_CELLS; i++) {
        let cell = {
            left: Math.floor(Math.random() * FIELD_HEIGHT),
            top: Math.floor(Math.random() * FIELD_HEIGHT),
            centerX: 0,
            centerY: 0,
        };
        VIRUSES.push(cell)
    }
    console.log(VIRUSES)
}

function insertVirusesOnGameField () {
    let distanceFromStartPosition = 0;
    for (let i = 0; i < VIRUSES.length; i++) {
        const cellContainer = document.createElement('div');
        cellContainer.style.background = "url('static/img/virus_default.png')";
        cellContainer.style.backgroundSize = 'cover';
        cellContainer.classList.add('cell');
        cellContainer.style.left = `${VIRUSES[i].left - distanceFromStartPosition}px`;
        cellContainer.style.top = `${VIRUSES[i].top}px`;
        cellContainer.style.width = `${CELL_SIZE[Math.floor(Math.random() * CELL_SIZE.length)]}%`;
        cellContainer.style.height = Number(cellContainer.style.width.replace('%', ''))
            * FIELD_RATIO + '%';
        addCellListeners(cellContainer);
        distanceFromStartPosition += cellContainer.style.width;
        // Add test content to the first cell
        (i===0) ? cellContainer.textContent = '50' : cellContainer.innerHTML = '&nbsp;';
        document.querySelector('.game_field').appendChild(cellContainer);
    }

}

function addCellListeners(element) {
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', cellHandlers.dragStart);
    element.addEventListener('dragend', cellHandlers.dragEnd);
    element.addEventListener('dragenter', cellHandlers.dragEnter);
    element.addEventListener('dragover', cellHandlers.dragOver);
    element.addEventListener('dragleave', cellHandlers.dragLeave );
    element.addEventListener('drop', cellHandlers.drop);
}
