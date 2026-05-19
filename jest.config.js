module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  // Babel transforms ES module import/export to CommonJS for Jest
  transform: {
    '\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [],
};
