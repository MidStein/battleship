export default function Ship(length) {
    let hitCount = 0;
    let isSunken = false;

    function getLength() { return length; }
    function getHitCount() { return hitCount; }
    function getSunkStatus() { return isSunk; }
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
        getLength,
        getHitCount,
        getSunkStatus,
        hit,
        isSunk
    };
};