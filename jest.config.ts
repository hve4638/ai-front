module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^context/(.*)$': '<rootDir>/src/context/$1',
    '^data/(.*)$': '<rootDir>/src/data/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^libs/(.*)$': '<rootDir>/src/libs/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  };
  