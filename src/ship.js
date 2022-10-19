export default function Ship(length) {
    let hitCount = 0;
    let isSunken = false;

    function hit() {
        hitCount += 1;
    }
    
    function isSunk() {
        if (hitCount >= length) {
            isSunken = true;
        }
        return isSunken;
    }

    return {
        hit,
        isSunk
    };
}