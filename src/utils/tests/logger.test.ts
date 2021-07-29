import { createLogger, logger } from '../logger';

describe('Tests logger', () => {
    it('tests default logger', () => {
        expect(typeof logger.info === 'function').toBe(true);
        expect(typeof logger.debug === 'function').toBe(true);
        expect(typeof logger.error === 'function').toBe(true);
        expect(typeof logger.warn === 'function').toBe(true);
    });
    it('tests createLogger', () => {
        expect(typeof createLogger({}).info === 'function').toBe(true);
        expect(typeof createLogger({}).debug === 'function').toBe(true);
        expect(typeof createLogger({}).error === 'function').toBe(true);
        expect(typeof createLogger({}).warn === 'function').toBe(true);
    });
});
