import Gameboard from "./gameboard";

let instance;
beforeEach(() => {
    instance = Gameboard();
});


test('gameboard does not recieve attacks outside its limits', () => {
expect(instance.recieveAttack([-5, 2])).toBeFalsy();
expect(instance.recieveAttack([-2, -1])).toBeFalsy();
expect(instance.recieveAttack([10, 10])).toBeFalsy();
expect(instance.recieveAttack([15, -15])).toBeFalsy();
})
test('gameboard rejects repeated value', () => {
expect(instance.recieveAttack([5, 3])).toBeTruthy();
expect(instance.recieveAttack([5, 3])).toBeFalsy();
expect(instance.recieveAttack([0, 0])).toBeTruthy();
expect(instance.recieveAttack([0, 0])).toBeFalsy();
expect(instance.recieveAttack([0, 0])).toBeFalsy();
})
test('gameboard accepts both hit and miss values', () => {
    instance.recordShipPlaced([0, 0], 5, true);
    expect(instance.recieveAttack([0, 0])).toBeTruthy();
    expect(instance.recieveAttack([0, 1])).toBeTruthy();
    expect(instance.recieveAttack([1, 0])).toBeTruthy();
    expect(instance.recieveAttack([5, 0])).toBeTruthy();
})

test('allSunk() works', () => {
    instance.recordShipPlaced([2, 0], 4, false);
    instance.recieveAttack([2, 0]);
    instance.recieveAttack([3, 0]);
    instance.recieveAttack([4, 0]);
    expect(instance.allSunk()).toBeFalsy();
    instance.recieveAttack([5, 0]);
    expect(instance.allSunk()).toBeTruthy();
    instance.recordShipPlaced([8, 6], 3, true);
    expect(instance.allSunk()).toBeFalsy();
});

