import Player from './player';

let instance;
beforeEach(() => {
    instance = Player();
});

test('computer can only make moves inside its board', () => {
    let [shootCoordX, shootCoordY] = instance.computerPlay();
    expect(shootCoordX).toBeGreaterThanOrEqual(-1);
    expect(shootCoordX).toBeLessThan(10);
    expect(shootCoordY).toBeGreaterThanOrEqual(-1);
    expect(shootCoordY).toBeLessThan(10);
    [shootCoordX, shootCoordY] = instance.computerPlay();
    expect(shootCoordX).toBeGreaterThanOrEqual(0);
    expect(shootCoordX).toBeLessThan(10);
    expect(shootCoordY).toBeGreaterThanOrEqual(0);
    expect(shootCoordY).toBeLessThan(10);
})
