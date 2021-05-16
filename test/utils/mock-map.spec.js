
const mockMap = require("../../src/utils/mock-map");

describe('[Test mock-map.js] integer => Random.integer', () => {
    it('[integer] typeof returns should be number', () => {
        expect(typeof mockMap.integer()).toBe('number');
    });

    it('[integer] should return a integer value', () => {
        const res = mockMap.integer() + '';
        expect(/\./g.test(res)).toBeFalsy();
    });
});

describe('[Test mock-map.js] enum => Random.oneOf', () => {
    it(`[enum] enum([1, 2, 3, 4]) should return one of [1, 2, 3, 4]`, () => {
        const arr = [1, 2, 3, 4];
        let times = 10, result = true;
        while (times--) {
            result = result && arr.includes(mockMap.enum(arr));
        }
        expect(result).toBeTruthy();
    });

    it(`[enum] enum([1]) should return 1`, () => {
        const arr = [1];
        expect(mockMap.enum(arr)).toBe(1);
    });

    it(`[enum] enum([1, 2, 3, 4], 5) should return 5`, () => {
        const arr = [1, 2, 3, 4];
        expect(mockMap.enum(arr, 5)).toBe(5);
    });
});