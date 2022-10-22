function importAll(r) {
    const imagesMap = {};
    r.keys().forEach((item) => {
        imagesMap[item.slice(2, item.search('.png'))] = r(item);
    });
    return imagesMap;
}

const imagesMap = importAll(require.context('./images/ship-images', false, /\.(png|jpe?g|svg)$/));
const Dom = (function () {
    let userPlayer;
    let compPlayer;
    const compBeforeShot = {
        lastHit: false,
        lastToLastHit: false,
    };
    const occupiedCells = [];
    const userBoard = document.querySelector('.user-board');

    const playerShipsLeft = {
        Carrier: 1,
        Battleship: 2,
        Destroyer: 2,
        Submarine: 1,
        'Patrol Boat': 4,
    };

    const computerShipsLeft = {
        Carrier: 1,
        Battleship: 2,
        Destroyer: 2,
        Submarine: 1,
        'Patrol Boat': 4,
    };

    function sentenceToKebab(sentence) {
        let kebab = sentence[0].toLowerCase();
        for (let i = 1; i < sentence.length; i += 1) {
            if (sentence[i] === ' ') {
                kebab += `-${sentence[i + 1].toLowerCase()}`;
                i += 1;
            } else {
                kebab += sentence[i];
            }
        }
        return kebab;
    }

    function rotateShip() {
        if (this.width > this.height) {
            this.src = imagesMap[`${sentenceToKebab(this.alt)}-vertical`];
        } else {
            this.src = imagesMap[`${sentenceToKebab(this.alt)}-horizontal`];
        }
        const temp = this.width;
        this.width = this.height;
        this.height = temp;
    }

    function dragstartHandler(ev) {
        ev.dataTransfer.setDragImage(this, 10, 20);
        ev.dataTransfer.setData('data', [
            ev.target.src,
            ev.target.alt,
            ev.target.width,
            ev.target.height,
        ]);
    }

    function dragoverHandler(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy';
    }

    function getCoordinates(cell) {
        let row = 0;
        let column = 0;
        let currRow = cell.parentElement.parentElement.querySelector('.row');
        while (currRow !== cell.parentElement) {
            row += 1;
            currRow = currRow.nextElementSibling;
        }
        let currCell = cell.parentElement.firstElementChild;
        while (currCell !== cell) {
            column += 1;
            currCell = currCell.nextElementSibling;
        }
        return {
            x: row,
            y: column,
        };
    }

    function getCell(whichBoard, xCoord, yCoord) {
        let currRow = whichBoard.querySelector('.row');
        for (let i = 0; i < xCoord; i += 1) {
            currRow = currRow.nextElementSibling;
        }
        let currCell = currRow.firstElementChild;
        for (let j = 0; j < yCoord; j += 1) {
            currCell = currCell.nextElementSibling;
        }
        return currCell;
    }

    function doAttack() {
        if (!compPlayer.validateUserAttempt([
            getCoordinates(this).x,
            getCoordinates(this).y,
        ])) return;
        this.classList.remove('turn-cell');
        this.classList.add('cell');
        if (occupiedCells.includes(this)) {
            this.classList.add('hit');
        } else {
            this.classList.add('miss');
        }
        if (compPlayer.checkLoss()) {
            document.querySelectorAll('.turn-cell').forEach((compCell) => {
                compCell.removeEventListener('click', doAttack);
                compCell.classList.remove('turn-cell');
                compCell.classList.add('cell');
            });
            document.querySelector('.game-end').textContent = 'You-Win';
            document.querySelector('.game-end').style.color = '#4f46eb';
            return;
        }
        let shotCell;
        if (!compBeforeShot.lastHit && !compBeforeShot.lastToLastHit) {
            shotCell = getCell(userBoard, ...userPlayer.computerPlay());
        } else {
            if (compBeforeShot.lastHit) {
                compBeforeShot.lastToLastHit = true;
            }
            const lastShotCoordX = compBeforeShot.coordinates[0];
            const lastShotCoordY = compBeforeShot.coordinates[1];
            if (userPlayer.validateUserAttempt([lastShotCoordX, lastShotCoordY - 1])) {
                shotCell = getCell(userBoard, lastShotCoordX, lastShotCoordY - 1);
            } else if (userPlayer.validateUserAttempt([lastShotCoordX - 1, lastShotCoordY])) {
                shotCell = getCell(userBoard, lastShotCoordX - 1, lastShotCoordY);
            } else if (userPlayer.validateUserAttempt([lastShotCoordX, lastShotCoordY + 1])) {
                shotCell = getCell(userBoard, lastShotCoordX, lastShotCoordY + 1);
            } else if (userPlayer.validateUserAttempt([lastShotCoordX + 1, lastShotCoordY])) {
                shotCell = getCell(userBoard, lastShotCoordX + 1, lastShotCoordY);
            }
            if (!shotCell) {
                shotCell = getCell(userBoard, ...userPlayer.computerPlay());
            }
        }
        if (occupiedCells.includes(shotCell)) {
            shotCell.classList.add('hit');
            compBeforeShot.coordinates = [getCoordinates(shotCell).x, getCoordinates(shotCell).y];
            compBeforeShot.lastHit = true;
        } else {
            shotCell.classList.add('miss');
            compBeforeShot.lastHit = false;
        }
        if (userPlayer.checkLoss()) {
            document.querySelector('.game-end').textContent = 'You-Lost';
            document.querySelector('.game-end').style.color = '#dc2626';
        }
    }

    function beginBattle() {
        document.querySelector('.computer-board').querySelectorAll('.cell').forEach((compCell) => {
            compCell.classList.remove('cell');
            compCell.classList.add('turn-cell');
            compCell.addEventListener('click', doAttack);
        });
    }

    function dropHandler(ev) {
        ev.preventDefault();
        const oceanShip = new Image();
        [oceanShip.src, oceanShip.alt, oceanShip.width, oceanShip.height] = ev.dataTransfer.getData('data').split(',');
        const coordinates = getCoordinates(this);
        let length;
        const whichBoard = this.parentElement.parentElement;

        /**
         * assign length
         * return if ship will overflow overboard
         * return if ship will overlap other
         */
        if (oceanShip.width !== 30) {
            length = Math.floor(oceanShip.width / 35);
            if ((10 - coordinates.y) < length) return;
            for (let i = 0; i < length; i += 1) {
                if (occupiedCells.includes(getCell(
                    whichBoard,
                    coordinates.x,
                    coordinates.y + i,
                    ))) return;
            }
        } else {
            length = Math.floor(oceanShip.height / 35);
            if ((10 - coordinates.x) < length) return;
            for (let i = 0; i < length; i += 1) {
                if (occupiedCells.includes(getCell(
                    whichBoard,
                    coordinates.x + i,
                    coordinates.y,
                    ))) return;
            }
        }
        let whoseBoard;

        /**
         * assign Player()
         * remove drag & drop ship pieces after limit exceeded
         * if all such pieces removed start game
         */
        if (whichBoard === userBoard) {
            whoseBoard = userPlayer;
            playerShipsLeft[oceanShip.alt] -= 1;
            if (playerShipsLeft[oceanShip.alt] === 0) {
                document.body.firstElementChild.querySelector(`[alt='${oceanShip.alt}']`).remove();
                if (
                    !document.body.firstElementChild.firstElementChild
                    && !document.body.lastElementChild.firstElementChild
                    ) {
                    beginBattle();
                }
            } else if (playerShipsLeft[oceanShip.alt] < 0) return;
        } else {
            whoseBoard = compPlayer;
            computerShipsLeft[oceanShip.alt] -= 1;
            if (computerShipsLeft[oceanShip.alt] === 0) {
                document.body.lastElementChild.querySelector(`[alt='${oceanShip.alt}']`).remove();
                if (
                    !document.body.lastElementChild.firstElementChild
                    && !document.body.firstElementChild.firstElementChild
                    ) {
                    beginBattle();
                }
            } else if (computerShipsLeft[oceanShip.alt] < 0) return;
        }

        /**
         * notify modules about placement of ships
         * register occupied spaces by a ship
         */
        if (oceanShip.width !== 30) {
            whoseBoard.recordShipPlaced([coordinates.x, coordinates.y], length, true);
            let loopCell = this;
            for (let i = 0; i < length; i += 1) {
                occupiedCells.push(loopCell);
                loopCell = loopCell.nextElementSibling;
            }
        } else {
            whoseBoard.recordShipPlaced([coordinates.x, coordinates.y], length, false);
            let loopCell = this;
            occupiedCells.push(loopCell);
            for (let i = 1; i < length; i += 1) {
                loopCell = getCell(whichBoard, coordinates.x + i, coordinates.y);
                occupiedCells.push(loopCell);
            }
        }
        ev.target.appendChild(oceanShip);
    }

    function initialize(user, computer) {
        userPlayer = user;
        compPlayer = computer;
        const fleets = document.querySelectorAll('.fleet');
        const cells = document.querySelectorAll('.cell');
        fleets.forEach((fleet) => {
            fleet.querySelectorAll('img').forEach((ship) => {
                ship.addEventListener('click', rotateShip);
                ship.addEventListener('dragstart', dragstartHandler);
            });
        });
        cells.forEach((cell) => {
            cell.addEventListener('dragover', dragoverHandler);
            cell.addEventListener('drop', dropHandler);
        });
    }

    return { initialize };
}());

export default Dom;
