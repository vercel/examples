module.exports = {
  roots: ['./'],
  testMatch: ['**/__tests__/**/*.test.(j|t)s', '**/?(*.)+test.(j|t)s'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
};
