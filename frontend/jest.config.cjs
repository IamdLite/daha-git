module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',  // use babel-jest for ts, tsx, js, jsx files
  },
  moduleNameMapper: {
    // Optionally mock static assets like images if you import them in your components
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    "^react-router-dom$": "<rootDir>/node_modules/react-router-dom",
  },
    transformIgnorePatterns: [
    'node_modules/(?!(axios)/)', // <-- transform axios package
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // <-- Remove the trailing slash
  testEnvironment: 'jsdom',
};
