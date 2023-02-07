module.exports = {
  roots: ['./'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js'],
  testMatch: ['**/__tests__/**/*test.(j|t)s', '**/?(*.)+test.(j|t)s'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/__tests__/jest.setup.js',
    '<rootDir>/dist/',
  ],
  testEnvironment: 'node',
};
