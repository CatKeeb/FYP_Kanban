module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/testSetup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  moduleDirectories: ["node_modules", "__tests__/__mocks__"],
  testPathIgnorePatterns: ["/node_modules/", "/__mocks__/"],
};
