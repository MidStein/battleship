import Ship from './ship';

export default function Gameboard() {
    const ships = [];
    const shipAreas = [];
    const missed = [];

    function recieveAttack(coordinates) {
        for (let i = 0; i < 10; i += 1) {
            if (shipAreas[i].includes(coordinates)) {
                ships[i].hit();
                return;
            }
            missed.push(coordinates);
        }
    }
    
    function allSunk() {
        for (let i = 0; i < 10; i += 1) {
            if (!ships[i].isSunk()) return false;
        }
        return true;
    }

    function recordShipPlaced(origin, length, isHoriz) {
        ships.push(Ship(length));
        shipAreas.push([]);
        for (let i = 0; i < length; i++) {
            if (isHoriz) {
                shipAreas[shipAreas.length - 1].push([origin[0], origin[1] + i])
            } else {
                shipAreas[shipAreas.length - 1].push([origin[0] + i, origin[1]]);
            }
        }
    }

    return {
        recieveAttack,
        allSunk,
        recordShipPlaced
    };
}
