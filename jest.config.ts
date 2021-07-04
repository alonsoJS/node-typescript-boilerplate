import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/__test__/*'],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 39.5,
      functions: 30,
      lines: 50,
    },
  },
}

export default config
