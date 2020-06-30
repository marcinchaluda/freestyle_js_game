CELL_SIZE = [7, 10, 11, 12];
NUMBER_OF_CELLS = 10;
const VIRUSES = [];
const gameField = document.querySelector('game-field')

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
        // const virusImage = document.createElement("img");
        // virusImage.src = 'static/img/virus_default.png'
        // virusImage.style.width = '100%';
        // cellContainer.appendChild(virusImage);
        cellContainer.style.backgroundImage = "url('static/img/virus_default.png')";
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
