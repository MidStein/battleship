import Gameboard from './gameboard';

export default function Player() {
    const gameboard = Gameboard();
    const alreadyShot = [];

    function computerPlay() {
        let shootCoord;
        do {
            shootCoord = [
                Math.floor(Math.random() * 10), 
                Math.floor(Math.random() * 10)
            ];
        } while (alreadyShot.includes(shootCoord));
        gameboard.recieveAttack(shootCoord);
        alreadyShot.push(shootCoord);
    }

    function recordShipPlaced(origin, length, isHoriz) {
        gameboard.recordShipPlaced(origin, length, isHoriz);
    }

    return {
        computerPlay,
        recordShipPlaced,
    };
}
