process.env.NO_LOG = 'true';

module.exports = {
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
    coverageReporters: ['html', 'text', 'text-summary'],
    setupFiles: ['dotenv/config'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
