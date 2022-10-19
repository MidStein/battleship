/* eslint-disable no-undef */
import Ship from './ship';

let instance;
beforeEach(() => {
    instance = Ship(3);
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
