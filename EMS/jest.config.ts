    // jest.config.ts
    export default {
      preset: 'ts-jest',
      collectCoverage: true,
      testEnvironment: 'jest-fixed-jsdom',
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      // Optional: If using MSW v2+, add this for JSDOM compatibility
      testEnvironmentOptions: {
        customExportConditions: [''],
      },
       moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js", // The global stub for weird files
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // The mock for style related files
    "^@/(.*)$": "<rootDir>/src/$1", // [optional] Are you using aliases?
  }
    };