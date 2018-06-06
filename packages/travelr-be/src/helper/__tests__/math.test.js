const { getRandomInt, getRandomDouble } = require('../math');

describe('getRandomInt', () => {
  it('returns int', () => {
    for (let i = 0; i < 1000; i += 1) {
      expect(getRandomInt(100) % 1).toBe(0);
    }
  });

  it('returns values in correct range', () => {
    for (let i = 0; i < 1000; i += 1) {
      expect(getRandomInt(100)).toBeGreaterThanOrEqual(0);
      expect(getRandomInt(100)).toBeLessThanOrEqual(100);

      expect(getRandomInt(90, 10)).toBeGreaterThanOrEqual(10);
      expect(getRandomInt(90, 10)).toBeLessThanOrEqual(90);
    }
  });
});

describe('getRandomDouble', () => {
  it('returns double', () => {
    for (let i = 0; i < 1000; i += 1) {
      expect(getRandomDouble(100) % 1).toBeGreaterThan(0);
    }
  });

  it('returns values is correct range', () => {
    for (let i = 0; i < 1000; i += 1) {
      expect(getRandomDouble(100)).toBeGreaterThan(0);
      expect(getRandomDouble(100)).toBeLessThan(100);

      expect(getRandomDouble(90, 10)).toBeGreaterThan(10);
      expect(getRandomDouble(90, 10)).toBeLessThan(90);
    }
  });
});
