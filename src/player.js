import Gameboard from './gameboard';

export default function Player() {
    const gameboard = Gameboard();

    function recordShipPlaced(origin, length, isHoriz) {
        gameboard.recordShipPlaced(origin, length, isHoriz);
    }
    
    function validateUserAttempt(coordinates) {
        return gameboard.recieveAttack(coordinates);
    }

    function computerPlay() {
        let shootCoord;
        do {
            shootCoord = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
        } while (!gameboard.recieveAttack(shootCoord));
        return shootCoord;
    }

    function checkLoss() {
        return gameboard.allSunk();
    }

    return {
        recordShipPlaced,
        validateUserAttempt,
        computerPlay,
        checkLoss,
    };
}
