import Gameboard from "./gameboard";

let instance;
beforeEach(() => {
    instance = Gameboard();
});

test('recieveAttack() gets hits on ships', () => {
    instance.recieveAttack([5, 0]);
    expect(instance.ship[0].getHitsCount()).toBe(1);
});
test('recieveAttack() tracks missed attacks', () => {
    instance.recieveAttack([0, 0]);
    expect(instance.missed).toContain([0, 0]);
});

test('allSunk() works', () => {
    instance.recieveAttack([2, 0]);
    instance.recieveAttack([3, 0]);
    instance.recieveAttack([4, 0]);
    instance.recieveAttack([5, 0]);
    instance.recieveAttack([6, 0]);
    expect(instance.allSunk()).toBeFalsy();
});
