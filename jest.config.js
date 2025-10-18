module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/node_modules/**',
    '!server/test-*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '!**/tests/ui/**',
    '!**/tests/seo/**',
    '!**/tests/accessibility/**',
    '!**/tests/compatibility/**',
    '!**/tests/content/**'
  ],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
