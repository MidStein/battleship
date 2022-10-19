import Player from './player';

let instance;
beforeEach(() => {
    instance = Player();
});

test('computerPlay() happy path', () => {
    instance.computerPlay();
    expect(instance.alreadyShot.length).toBe(1);
});
