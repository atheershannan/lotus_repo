module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(axios)/)',
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/src/__mocks__/axios.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};

