import { InitialOptionsTsJest } from "ts-jest";

const config: InitialOptionsTsJest = {
  moduleDirectories: ["node_modules"],
  moduleNameMapper: {
    "^~/(.*)$": `<rootDir>/src/$1`,
  },
  modulePaths: [`<rootDir>/src/`],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // testEnvironment: "node",

  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/tsconfig.json`,
    },
  },
};

export default config;
