import Ship from './ship';

let instance;
beforeEach(() => {
    instance = Ship(3);
});

test('isSunk() works', () => {
    instance.hit();
    instance.hit();
    expect(instance.isSunk()).toBeFalsy();
    instance.hit();
    expect(instance.isSunk()).toBeTruthy();
});
