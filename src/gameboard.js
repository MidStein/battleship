import Ship from './ship';

export default function Gameboard() {
    const ships = [];
    const shipAreas = [];
    const missed = [];
    const nailed = [];
    
    function recordShipPlaced(origin, length, isHoriz) {
        ships.push(Ship(length));
        shipAreas.push([]);
        for (let i = 0; i < length; i += 1) {
            if (isHoriz) {
                shipAreas[shipAreas.length - 1].push(10 * origin[0] + origin[1] + i);
            } else {
                shipAreas[shipAreas.length - 1].push(10 * (origin[0] + i) + origin[1]);
            }
        }
    }

    function recieveAttack(coordinates) {
        if (
            coordinates[0] < 0
            || coordinates[0] > 9
            || coordinates[1] < 0
            || coordinates[1] > 9
        ) return false;
        const offset = 10 * coordinates[0] + coordinates[1];
        if (missed.includes(offset) || nailed.includes(offset)) return false;
        for (let i = 0; i < shipAreas.length; i += 1) {
            if (shipAreas[i].includes(offset)) {
                ships[i].hit();
                nailed.push(offset);
                return true;
            }
        }
        missed.push(offset);
        return true;
    }

    function allSunk() {
        for (let i = 0; i < ships.length; i += 1) {
            if (!ships[i].isSunk()) return false;
        }
        return true;
    }

    return {
        recordShipPlaced,
        recieveAttack,
        allSunk,
    };
}
