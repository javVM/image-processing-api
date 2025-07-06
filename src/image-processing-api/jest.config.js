module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src", "./test"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
