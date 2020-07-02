CELL_SIZE = [6, 7, 11, 13];
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
AVATAR_COLORS = ['blue', 'green', 'purple', 'yellow'];
const PLAYER_COLOR = localStorage.getItem("playerColor"); //Variable with selected color by player
let enemyColor;

const cellHandlers = {
    dragStart: function (e) {
        e.stopPropagation();
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
        if ((e.target).isSameNode(draggedElement) || draggedElement == null) {
            return
        }
        const population = Number(e.dataTransfer.getData('text/plain'));
        // add 35% population to target and take 38% from source (lose 3%):
        e.target.textContent = (Number(e.target.textContent) + population * 0.35 | 0).toString();
        draggedElement.textContent = (population * 0.62 | 0).toString();
        // set infected cell color
        let sourceColor;
        AVATAR_COLORS.forEach(color => {
            if (draggedElement.classList.contains(color)){
                sourceColor = color;
            }
        });
        e.target.className = 'cell';
        if (sourceColor) e.target.classList.add(sourceColor);
        e.target.setAttribute('draggable', 'true');
        addPlayerListeners(e.target);

    }
}

initGame();

function initGame() {

    // Your game can start here, but define separate functions, don't write everything in here :)
    // generateCells();
    cellArrange();
    selectEnemy();
    insertVirusesOnGameField();
    setInterval(enemyMove, 1000);
}

function cellArrange() {
    let x = START_POSITION, y = START_POSITION;

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
        styleCellContainer(cellContainer, i);
        grow(cellContainer);
        setStrengthParameters(cellContainer, i);
        addCellListeners(cellContainer);
        grow(cellContainer);
        document.querySelector('.game_field').appendChild(cellContainer);
    }
}

function styleCellContainer(cellContainer, index) {
    cellContainer.classList.add(VIRUSES[index].avatar);
    cellContainer.style.backgroundSize = 'cover';
    cellContainer.classList.add('cell');
    cellContainer.style.left = `${VIRUSES[index].left}px`;
    cellContainer.style.top = `${VIRUSES[index].top}px`;
    cellContainer.style.width = `${CELL_SIZE[Math.floor(Math.random() * CELL_SIZE.length)]}%`;
    cellContainer.style.height = Number(cellContainer.style.width.replace('%', ''))
        * FIELD_RATIO + '%';
}

function setStrengthParameters(cellContainer, index) {
    switch (index) {
            case 0:
                cellContainer.textContent = '50';
                cellContainer.classList.add(PLAYER_COLOR);
                cellContainer.style.backgroundSize = 'cover';
                cellContainer.setAttribute('draggable', 'true');
                break;
            case (VIRUSES.length - 1):
                cellContainer.textContent = '50';
                break;
            default:
                // cellContainer.innerHTML = '&nbsp;';
        }
}

function addCellListeners(element) {
    element.addEventListener('drop', cellHandlers.drop);
    element.addEventListener('dragenter', cellHandlers.dragEnter);
    element.addEventListener('dragover', cellHandlers.dragOver);
    element.addEventListener('dragleave', cellHandlers.dragLeave );
    addPlayerListeners(element);
}

function addPlayerListeners(element) {
     if (element.classList.contains(PLAYER_COLOR)){
        element.addEventListener('dragstart', cellHandlers.dragStart, false);
        element.addEventListener('dragend', cellHandlers.dragEnd);
    }
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

function selectEnemy() {
    const enemy = VIRUSES[VIRUSES.length-1];
    do {
        enemyColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    } while (enemyColor === PLAYER_COLOR);
    enemy.avatar = enemyColor;
}

function enemyMove() {
    const enemies = document.getElementsByClassName('cell');
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const randomGrowth = getRandomCellGrow();
    enemy.classList.add(enemyColor);
    enemy.innerHTML = (randomGrowth * 0.35 | 0).toString();
}

function getRandomCellGrow() {
    const enemies = document.getElementsByClassName(enemyColor);
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const enemyGrowth = enemy.innerHTML;
    enemy.innerHTML = (enemyGrowth * 0.62 | 0).toString();
    return enemyGrowth;
}


// function winCondition() {
//     let isWin = 'False';
//     VIRUSES.forEach(cell => {
//         if ( cell.avatar != PLAYER_COLOR ){
//             a
//         }
//     })
// }