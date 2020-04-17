module.exports = {
  roots: ['<rootDir>/packages'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  globals: {
    __DEV__: true,
  },
  testMatch: [
    '<rootDir>/packages/**/__tests__/**/*.js',
    '<rootDir>/packages/**/*.{spec,test}.js',
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
    '<rootDir>/packages/**/*.js',
    '!packages/**/*.d.ts',
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
