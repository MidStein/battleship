function importAll(r) {
    const imagesMap = {};
    r.keys().forEach((item) => {
        imagesMap[item.slice(2, item.search('.png'))] = r(item);
    });
    return imagesMap;
}

const imagesMap = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
const Dom = (function () {
    const occupiedCells = [];
    const userBoard = document.querySelector('.user-board');

    const playerShipsLeft = {
        'Carrier': 1,
        'Battleship': 2,
        'Destroyer': 2,
        'Submarine': 1,
        'Patrol Boat': 4,
    }

    const computerShipsLeft = {
        'Carrier': 1,
        'Battleship': 2,
        'Destroyer': 2,
        'Submarine': 1,
        'Patrol Boat': 4,
    }

    function sentenceToKebab(sentence) {
        let kebab = sentence[0].toLowerCase();
        for (let i = 1; i < sentence.length; i += 1) {
            if (sentence[i] === ' ') {
                kebab += '-' + sentence[i + 1].toLowerCase();
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
        let temp = this.width;
        this.width = this.height;
        this.height = temp;
    }

    function dragstartHandler(ev) {
        ev.dataTransfer.setDragImage(this, 10, 20);
        ev.dataTransfer.setData('data', [
            ev.target.src,
            ev.target.alt,
            ev.target.width,
            ev.target.height
        ]);
    }

    function dragoverHandler(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy';
    }

    function getCoordinates(cell) {
        let row = 0, column = 0;
        let currRow = cell.parentElement.parentElement.querySelector('.row');
        while (currRow !== cell.parentElement) {
            row += 1;
            currRow = currRow.nextElementSibling;
        }
        let currCell = cell.parentElement.querySelector('.cell');
        while (currCell !== cell) {
            column++;
            currCell = currCell.nextElementSibling;
        }
        return {
            x: row,
            y: column,
        };
    }

    function beginBattle() {
        const userBanner = document.querySelector('.user-banner');
        userBanner.classList.remove('user-banner');
        userBanner.classList.add('turn-user-banner');
        document.querySelectorAll('.cell').forEach((cell) => {
            cell.classList.remove('cell');
            cell.classList.add('turn-cell');
        });
        document.querySelector('.user-board').disabled = true;
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

    function dropHandler(ev, cell, user, computer) {
        ev.preventDefault();
        let oceanShip = new Image();
        [oceanShip.src, oceanShip.alt, oceanShip.width, oceanShip.height] = ev.dataTransfer.getData('data').split(',');
        const coordinates = getCoordinates(cell);
        let length;
        let whichBoard = cell.parentElement.parentElement;
        if (oceanShip.width !== 30) {
            length = parseInt(oceanShip.width / 35);
            if ((10 - coordinates.y ) < length) return;
            for (let i = 0; i < length; i += 1) {
                if (occupiedCells.includes(getCell(whichBoard, coordinates.x, coordinates.y + i))) return;
            }
        } else {
            length = parseInt(oceanShip.height / 35);
            if ((10 - coordinates.x) < length) return;
            for (let i = 0; i < length; i += 1) {
                if (occupiedCells.includes(getCell(whichBoard, coordinates.x + i, coordinates.y))) return;
            }
        }
        let whoseBoard;
        if (cell.parentElement.parentElement === userBoard) {
            whoseBoard = user;
            if (--playerShipsLeft[oceanShip.alt] === 0) {
                document.body.firstElementChild.querySelector(`[alt='${oceanShip.alt}']`).remove();
                console.log(document.body.firstElementChild.firstElementChild);
                if (!document.body.firstElementChild.firstElementChild && !document.body.lastElementChild.firstElementChild) {
                    beginBattle();
                }
            }
        } else {
            whoseBoard = computer;
            if (--computerShipsLeft[oceanShip.alt] === 0) {
                document.body.lastElementChild.querySelector(`[alt='${oceanShip.alt}']`).remove();
                if (!document.body.lastElementChild.firstElementChild && !document.body.firstElementChild.firstElementChild) {
                    beginBattle();
                }
            }
        }
        if (oceanShip.width !== 30) {
            whoseBoard.recordShipPlaced([coordinates.x, coordinates.y], length, true);
            let loopCell = cell;
            for (let i = 0; i < length; i++) {
                occupiedCells.push(loopCell);
                loopCell = loopCell.nextElementSibling;
            }
        } else {
            whoseBoard.recordShipPlaced([coordinates.x, coordinates.y], length, false);
            let loopCell = cell;
            for (let i = 0; i < length - 1; i++) {
                occupiedCells.push(loopCell);
                loopCell = getCell(cell.parentElement.parentElement, coordinates.x + 1, coordinates.y);
            }
        }
        ev.target.appendChild(oceanShip);
    }

    function initialize(user, computer) {
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
            cell.addEventListener('drop', (ev) => {
                dropHandler(ev, cell, user, computer);
            });
        });
    }

    return { initialize };
}());

export default Dom;
