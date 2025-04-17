module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>\\components\\$1',
    '^@/contexts/(.*)$': '<rootDir>\\contexts\\$1',
    '^@/lib/(.*)$': '<rootDir>\\lib\\$1',
    '^@/services/(.*)$': '<rootDir>\\services\\$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  testMatch: ['**/*.test.{ts,tsx,js,jsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}; 