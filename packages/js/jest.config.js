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
    '!types/**/*.d.ts',
    '!src/**/index.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    // 0-100% coverage
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
