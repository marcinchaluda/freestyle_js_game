CELL_SIZE = [7, 10, 11, 12];
NUMBER_OF_CELLS = 15;
const VIRUSES = [];
FIELD_WIDTH = 768;
FIELD_HEIGHT = 250;

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
        const virusImage = document.createElement("img");
        virusImage.src = 'static/img/virus_default.png'
        virusImage.style.width = '100%';
        cellContainer.appendChild(virusImage);
        cellContainer.classList.add('cell');
        cellContainer.style.left = `${VIRUSES[i].left - distanceFromStartPosition}px`;
        cellContainer.style.top = `${VIRUSES[i].top}px`;
        cellContainer.style.width = `${CELL_SIZE[Math.floor(Math.random() * CELL_SIZE.length)]}%`;
        distanceFromStartPosition += cellContainer.style.width;
        document.querySelector('.game_field').appendChild(cellContainer);
    }

}
