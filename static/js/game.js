//TEMPORARY GLOBAL DATA
let cellsCount = 8;
const game_field = document.querySelector('.game_field');

initGame();

function initGame() {
    initLevel(cellsCount)
}

function initLevel(cellsCount) {
    // Drag handlers
    const dragstart_handler = function (e) {
        e.dataTransfer.setData('text/plain', e.target.innerText)
    }
    const dragover_handler = function (e) {
        e.preventDefault();
    }
    const drop_handler = function (e) {
        e.preventDefault();
        const strength = e.dataTransfer.getData('text/plain');
        e.target.textContent = strength;
    }
    const dragenter_handler = function (e) {
        e.target.classList.add('cell_drop');
    }
    // Init cell
    const cell = document.createElement('div');
    game_field.addEventListener('dragstart', dragstart_handler);
    cell.className = 'cell';
    cell.setAttribute('draggable', 'true')
    let i;
    const percentRandomizer = (distance) => ((Math.random() * distance) | 0) + '%';
    for (i = 0; i < cellsCount; i++) {
        let cellClone = cell.cloneNode();
        // Init level
        cellClone.addEventListener('dragover', dragover_handler);
        cellClone.addEventListener('drop', drop_handler);
        cellClone.addEventListener('dragenter', dragenter_handler);
        cellClone.style.left = percentRandomizer(10);
        cellClone.style.top = percentRandomizer(75);
        (i === 0) ? cellClone.textContent = '50' : null;
        game_field.appendChild(cellClone);
    }
}
