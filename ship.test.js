import Ship from './ship';

let instance;
beforeEach(() => {
    instance = Ship(3);
});

test("get functions don't mutate variables", () => {
    let returnedVal = instance.getLength();
    returnedVal += 1;
    expect(returnedVal - 1).toBe(instance.getLength());
});

test('hit() works', () => {
    const hitCountBefore = instance.getHitCount();
    instance.hit();
    instance.hit();
    expect(instance.getHitCount()).toBe(hitCountBefore + 2);
});

test('isSunk() works', () => {
    instance.hit();
    instance.hit();
    expect(instance.isSunk()).toBeFalsy();
    instance.hit();
    expect(instance.isSunk()).toBeTruthy();
});
