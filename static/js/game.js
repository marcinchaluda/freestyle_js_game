CELL_SIZE = [6, 9, 10, 11];
NUMBER_OF_CELLS = 12;
const VIRUSES = [];
FIELD_WIDTH = 768;
FIELD_HEIGHT = 280;
REQIURED_DISTANCE = (100/2);
FIELD_RATIO = 1.778;
const PLAYER_COLOR = localStorage.getItem("playerColor"); //Variable with selected color by player

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

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    generateCells();
    insertVirusesOnGameField();
}

function generateCells () {
    while(VIRUSES.length < NUMBER_OF_CELLS) {
        let cell = {
            left: Math.floor(Math.random() * (FIELD_WIDTH/1.5)),
            top: Math.floor(Math.random() * (FIELD_HEIGHT)),
            avatar: 'virus_default',
            width: CELL_SIZE[Math.floor(Math.random() * CELL_SIZE.length)],
        };
        calculateDistance(cell);
    }
}

function calculateDistance(currentCell) {
     let overlapping = false;
     for (let j = 0; j < VIRUSES.length; j++){
            let other_cell = VIRUSES[j];
            let distance = Math.floor(Math.sqrt(Math.pow(Math.abs(currentCell.left - other_cell.left), 2) +
            Math.pow(Math.abs(currentCell.top - other_cell.top), 2)));

             if (distance <= Math.abs(currentCell.left - other_cell.left) || distance <= Math.abs(currentCell.top - other_cell.top)){
                 overlapping = true;
                 break;
             }
         }
     if (!overlapping) {
         VIRUSES.push(currentCell);
     }
}

function insertVirusesOnGameField () {
    let distanceFromStartPosition = 0;
    for (let i = 0; i < VIRUSES.length; i++) {
        const cellContainer = document.createElement('div');
        cellContainer.style.background = `url('static/img/${VIRUSES[i].avatar}.png')`;
        cellContainer.style.backgroundSize = 'cover';
        cellContainer.classList.add('cell');
        cellContainer.style.left = `${VIRUSES[i].left - distanceFromStartPosition}px`;
        cellContainer.style.top = `${VIRUSES[i].top}px`;
        cellContainer.style.width = `${VIRUSES[i].width}%`;
        cellContainer.style.height = Number(cellContainer.style.width.replace('%', ''))
            * FIELD_RATIO + '%';
        addCellListeners(cellContainer);
        distanceFromStartPosition += cellContainer.style.width;
        // Add test content to first cell
        if (i===0) cellContainer.textContent='50';
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
