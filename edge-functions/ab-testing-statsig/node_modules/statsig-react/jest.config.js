module.exports = {
  roots: ['./'],
  testMatch: ['**/__tests__/**/*.(ts|tsx)', '**/?(*.)+test.(ts|tsx)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  preset: 'ts-jest',
};
