import Gameboard from './gameboard';

export default function Player(playerName) {
    const gameboard = Gameboard();
    const alreadyShot = [];
    
    function computerPlay() {
        let randCoord;
        do {
            randCoord = [
                Math.floor(Math.random() * 10), 
                Math.floor(Math.random() * 10)
            ];
        } while (alreadyShot.includes(randCoord));
        gameboard.recieveAttack(randCoord);
        alreadyShot.push(randCoord);
    }

    return {
        computerPlay
    };
};
