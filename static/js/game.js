//TEMPORARY GLOBAL DATA
let cellsCount = 8;
const game_field = document.querySelector('.game_field');

initGame();

function initGame() {
    initLevel(cellsCount)
}

function initLevel(cellsCount) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    let i;
    const percentRandomizer = (distance) => ((Math.random() * distance) | 0) + '%';
    for (i = 0; i < cellsCount; i++) {
        cell.style.left = percentRandomizer(10);
        cell.style.top = percentRandomizer(75);
        game_field.appendChild(cell.cloneNode());
    }
}
