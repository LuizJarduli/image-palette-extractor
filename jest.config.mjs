/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/app/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'src/index.ts'],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: ['**/src/**/(*.)spec.ts'],
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  setupFiles: ['jest-canvas-mock'],
};
