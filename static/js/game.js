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
const GROWTH_RATE = 450; //millisecond growth interval
let enemyColor;
//SOUND EFFECTS
const gameStart = new Sound('static/audio/game_start.mp3');
const GROWTHS = generateSoundsArray('growth', 4);
const POPS = generateSoundsArray('pop', 5);
const cursor = document.querySelector('.cursor');
// document.addEventListener('mousemove', moveMouse);

function generateSoundsArray(type, howMany) {
    let sounds =[];
    for(let i = 1; i < howMany + 1; i++) {
        sounds.push(new Sound(`static/audio/${type}${i}.mp3`));
    }
    return sounds
}

const cellHandlers = {
    dragStart: function (e) {
        e.stopPropagation();
        setStartEvent(e);
        console.log('dragstart');
        pickRandomFrom(POPS).play();
    },
    drag: function (e) {
        moveMouse(e);
        e.dataTransfer.effectAllowed = 'none';
    },
    dragEnd: function (e) {
        cursor.style='none';
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
        pickRandomFrom(GROWTHS).play()
        cursor.style.display='none';
        setDropEvent(e);
        addPlayerListeners(e.target);
    }
}

function setStartEvent(e) {
    if (Number(e.target.textContent) < 5) e.preventDefault();
        e.dataTransfer.setData('text/plain', e.target.innerText);
        e.target.id = Date.now().toString();
        e.dataTransfer.setData('text/elementid', e.target.id)
        e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
        document.addEventListener('drag', moveMouse);
        cursor.textContent = (Number(e.target.textContent) * 0.35 | 0).toString();
}

function setDropEvent(e) {
    let draggedElement = document.getElementById(e.dataTransfer.getData('text/elementid'));

    if ((e.target).isSameNode(draggedElement) || draggedElement == null) {
        return;
    }
    if (!e.target.classList.contains('default')){
        fight(draggedElement, e.target);
        return;
    }
    setAvatarParametersOnDropEvent(e, draggedElement);
}

function setAvatarParametersOnDropEvent(e, draggedElement) {
    const population = Number(e.dataTransfer.getData('text/plain'));
    // add 35% population to target and take 38% from source (lose 3%):
    e.target.textContent = (Number(e.target.textContent) + population * 0.35 | 0).toString();
    draggedElement.textContent = (population * 0.62 | 0).toString();
    e.target.className = 'cell pulse';
    if (PLAYER_COLOR) e.target.classList.add(PLAYER_COLOR);
    e.target.setAttribute('draggable', 'true');
}

initGame();
const attack = setInterval(enemyMove, 5000);
gameStart.play();

function initGame() {
    cellArrange();
    selectEnemy();
    insertVirusesOnGameField();
    animateCursor();
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
            y += OFFSET_Y + pickRandomFrom(RANDOM_MARGIN_ARRAY)();
            VIRUSES.push(cell);
        }
        x += OFFSET_X + pickRandomFrom(RANDOM_MARGIN_ARRAY)();
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
    cellContainer.classList.add('pulse');
    cellContainer.style.borderRadius = '50%';
    cellContainer.style.left = `${VIRUSES[index].left}px`;
    cellContainer.style.top = `${VIRUSES[index].top}px`;
    cellContainer.style.width = `${pickRandomFrom(CELL_SIZE)}%`;
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
    setInterval(breed, GROWTH_RATE + (Math.random() * 300) | 0);
}

function selectEnemy() {
    const enemy = VIRUSES[VIRUSES.length-1];
    do {
        enemyColor = pickRandomFrom(AVATAR_COLORS);
    } while (enemyColor === PLAYER_COLOR);
    enemy.avatar = enemyColor;
}

function enemyMove() {
    const enemies = document.getElementsByClassName('cell');
    const enemy = pickRandomFrom(enemies);
    const opponent = getRandomCellGrow();
    const sourceCell = opponent[1];
    if (enemy.classList.contains(PLAYER_COLOR)){
        fight(sourceCell, enemy);
    }
    setEnemyParameters(enemy, opponent[0]);
}

function setEnemyParameters(enemy, randomGrowth) {
    enemy.classList.add(enemyColor);
    enemy.classList.remove(PLAYER_COLOR);
    enemy.classList.remove('default');
    enemy.setAttribute('draggable', 'false');
    enemy.innerHTML = (randomGrowth * 0.35 | 0).toString();
}

function getRandomCellGrow() {
    const sourceCell = []
    const enemies = document.getElementsByClassName(enemyColor);
    const enemy = pickRandomFrom(enemies);
    const enemyGrowth = enemy.innerHTML;
    sourceCell.push(enemyGrowth);
    sourceCell.push(enemy);
    enemy.innerHTML = (enemyGrowth * 0.62 | 0).toString();
    return sourceCell;
}

function fight (sourceCell, targetCell) {
    const attackers = Number(sourceCell.textContent) * 0.35 | 0;
    const defenders = Number(targetCell.textContent);

    if (targetCell.classList.contains(PLAYER_COLOR)) {
        targetCell.textContent = (Number(targetCell.textContent) + attackers).toString();
        return;
    }
    getFightScore(attackers, defenders, sourceCell, targetCell);
    setTimeout(winOrLoose, 500);
}

function getFightScore(attackers, defenders, sourceCell, targetCell) {
    const winner = {};
    let attackersColor = getAttackerColor(sourceCell);
     if (attackers > defenders) {
        winner.population = attackers - defenders;
        winner.cell = sourceCell;
        targetCell.className = `cell ${attackersColor} pulse`;
        if (attackersColor === PLAYER_COLOR) targetCell.setAttribute('draggable', 'true');
    } else {
        winner.population = defenders - attackers;
        winner.cell = targetCell;
    }
     sourceCell.textContent = (Number(sourceCell.textContent) * 0.62 | 0).toString();
     targetCell.textContent = winner.population.toString();
     setDefaultValueOnFightDraw(winner, targetCell);
}

function setDefaultValueOnFightDraw(winner, targetCell) {
    if (winner.population === 0) {
        targetCell.className = 'cell default pulse';
        targetCell.textContent = '';
    }
}

function getAttackerColor(sourceCell) {
    let attackersColor;
    for (let color of AVATAR_COLORS) {
        sourceCell.classList.contains(color) ? attackersColor = color : null;
    }
    return attackersColor;
}

function winOrLoose() {
    let loose = false, virus, isEnemy = false;
    const enemies = document.getElementsByClassName('cell');
    for (virus of enemies) {
        if (virus.classList.contains(enemyColor)) {
            isEnemy = true;
        }
        else if (virus.classList.contains(PLAYER_COLOR)) {
            loose = true;
        }
    }
    if (!isEnemy || !loose) {
        clearInterval(attack);
        endScreen('winer');
    }
    else if (!loose) {
        clearInterval(attack);
        endScreen('loser');
    }
}

function endScreen(background) {
    const info = document.createElement('div');
    const button = document.createElement('a');
    let linkText = document.createTextNode("Play again?");
    button.appendChild(linkText);
    button.href = '/';
    document.querySelector('.stats').appendChild(button);
    info.setAttribute('id','endScreen');
    info.style.background = `url(static/img/${background}.png)`;
    info.style.backgroundSize = 'cover';
    document.querySelector('.game_field').appendChild(info);

}

function pickRandomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function Sound(src, maxStreams = 3) {
    this.streamNum = 0;
    this.streams = [];
    for (let i = 0; i < maxStreams; i++) {
        this.streams.push(new Audio(src));
    }
    this.play = function() {
        this.streamNum = (this.streamNum + 1) % maxStreams;
        this.streams[this.streamNum].play();
    }
}

function moveMouse(e) {
    cursor.style.display = 'block';
    const x = e.clientX;
    const y = e.clientY;
    cursor.style.transform = `translate(${x + 11}px, ${y + 25}px)`;
}

function animateCursor() {
    setInterval(function () {
        cursor.classList.add(`cursor_${PLAYER_COLOR}`);
        cursor.classList.toggle(`cursor_bounce`);
        cursor.classList.toggle(`cursor_${PLAYER_COLOR}_bounce`);
        // requestAnimationFrame(animateCursor);
    }, 600)
}

