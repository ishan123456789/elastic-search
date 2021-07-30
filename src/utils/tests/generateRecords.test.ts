import { getCurrentId, randomIntegerToStartIdsWith } from '../generateRecords';

describe('It tests getCurrentId', () => {
    it('Tests various combination for getCurrentIds', () => {
        const t1 = getCurrentId(0, 1);
        expect(t1).toBe(randomIntegerToStartIdsWith + 1);

        const t2 = getCurrentId(10 ** 6, 1);
        expect(t2).toBe(randomIntegerToStartIdsWith + 2);

        const t3 = getCurrentId(10 * 10 ** 6, 1);
        expect(t3).toBe(randomIntegerToStartIdsWith + 11);
    });
    it('Tests various combination for getCurrentIds for  max count 10', () => {
        const t1 = getCurrentId(0, 10);
        expect(t1).toBe(randomIntegerToStartIdsWith + 10);

        const t2 = getCurrentId(10 ** 6, 10);
        expect(t2).toBe(randomIntegerToStartIdsWith + 20);

        const t3 = getCurrentId(10 * 10 ** 6, 10);
        expect(t3).toBe(randomIntegerToStartIdsWith + 110);
    });
});
