module.exports = {
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/__mocks__/style.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/stories/',
    '<rootDir>/lib/',
    '<rootDir>/storybook-static/',
  ],
}
