import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  passWithNoTests: true,
  testEnvironment: './jest.setup.ts',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          'next/babel',
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
    '@/(.*)': '<rootDir>/src/$1', // For TypeScript custom module resolutions
  },
  roots: [
    'src/',
  ],
  testMatch: [
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
  ],
  coveragePathIgnorePatterns: [
    'src/pages',
    'src/helpers/types.ts',
    'src/helpers/constants.ts',
  ],
};

export default config;
