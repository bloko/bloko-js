module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  globals: {
    __DEV__: true,
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/src/**/*.{spec,test}.js',
  ],
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '.*\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.js$'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!src/**/index.js',
    '!src/utils/noop.js',
    '!src/utils/identity.js',
    '!type/**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    // 0-100% coverage
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
