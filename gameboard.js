import Ship from './ship';

export default function Gameboard() {
    const missed = [];

    function recieveAttack(coordinates) {
        for (let i = 0; i < 10; i += 1) {
            if (shipAreas[i].includes(coordinates)) {
                ship[i].hit();
                return;
            }
            missedCoord.push(coordinates);
        }
    }
    function allSunk() {
        for (let i = 0; i < 10; i += 1) {
            if (!ship[i].isSunk()) return false;
        }
        return true;
    }

    return {
        
        recieveAttack,
        allSunk
    };
};
