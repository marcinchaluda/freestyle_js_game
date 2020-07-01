CELL_SIZE = [7, 10, 11, 12];
NUMBER_OF_CELLS = 12;
const VIRUSES = [];
FIELD_WIDTH = 768;
FIELD_HEIGHT = 250;
FIELD_RATIO = 1.778
START_POSITION = 20;
OFFSET_X = 100;
OFFSET_Y = 80;
RANDOM_MARGIN_ARRAY = [() => Math.floor(Math.random() * 75 | 0),
        () => Math.floor(Math.random() * 95 | 0),
        () => Math.floor(Math.random() * 85 | 0),
        () => Math.floor(Math.random() * 100 | 0)];
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
            const population = Number(e.dataTransfer.getData('text/plain'));
            // add 35% population to target and take 38% from source (lose 3%):
            e.target.textContent = (Number(e.target.textContent) + population * 0.35 | 0).toString();
            draggedElement.textContent = (population * 0.62 | 0).toString();
            console.log('drop');
        }
    }
}

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    // generateCells();
    cellArrange();
    insertVirusesOnGameField();
}

function cellArrange() {
    let x = START_POSITION, y=START_POSITION;

    for (let i=0; i < 5; i++) {
        y = START_POSITION;
        for (let j=0; j<3; j++) {
            let cell = {
                left: x + offsetPosition(),
                top: y + offsetPosition(),
                avatar: 'default'
            }
            y += OFFSET_Y + RANDOM_MARGIN_ARRAY[Math.floor(Math.random() * RANDOM_MARGIN_ARRAY.length)]();
            VIRUSES.push(cell);
        }
        x += OFFSET_X + RANDOM_MARGIN_ARRAY[Math.floor(Math.random() * RANDOM_MARGIN_ARRAY.length)]();
    }
}

function offsetPosition() {
    let randomNumber = Math.floor(Math.random() * START_POSITION);
    if (randomNumber <= (START_POSITION/2)) {
        return -randomNumber;
    }
    return randomNumber;
}

function insertVirusesOnGameField () {
    for (let i = 0; i < VIRUSES.length; i++) {
        const cellContainer = document.createElement('div');
        cellContainer.style.background = "url('static/img/virus_default.png')";
        cellContainer.style.backgroundSize = 'cover';
        cellContainer.classList.add('cell');
        cellContainer.style.left = `${VIRUSES[i].left}px`;
        cellContainer.style.top = `${VIRUSES[i].top}px`;
        cellContainer.style.width = `${CELL_SIZE[Math.floor(Math.random() * CELL_SIZE.length)]}%`;
        cellContainer.style.height = Number(cellContainer.style.width.replace('%', ''))
            * FIELD_RATIO + '%';
        addCellListeners(cellContainer);
        // Add test content to the first cell
        (i===0) ? cellContainer.textContent = '50' : cellContainer.innerHTML = '&nbsp;';
        grow(cellContainer);
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

function grow(cell) {
    const breed = function () {
        let population = Number(cell.textContent);
        const populationCap = Number(cell.style.width.replace('%', '')) * 10 | 0;
        if (population > 0) {
            let brood = (population * (Math.random() * 3 + 3 | 0) * 0.01) | 0; // generates integer 3-5% population
            population += (brood > 0) ? brood : 1;
            (cell.textContent <= populationCap) ?
                cell.textContent = population.toString() : cell.textContent = populationCap;
        }
    }
    setInterval(breed, 300 + (Math.random() * 300) | 0);
}
