module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
        
    },
    testMatch: [
        '<rootDir>/compiled/**/*.test.js'
    ],
};
