import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1'
  },
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  moduleDirectories: ['node_modules', 'src'],
  automock: false,
  resetMocks: false,
  globals: {
    'ts-jest': {
      useESM: true
    },
    'import.meta': {
      env: {
        VITE_SUPABASE_URL: 'http://localhost:3000',
        VITE_SUPABASE_ANON_KEY: 'test-key'
      }
    }
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};

export default config; 