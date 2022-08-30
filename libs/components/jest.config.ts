import { InitialOptionsTsJest, pathsToModuleNameMapper } from 'ts-jest';
import { join } from 'path';
const tsConfig = require('./tsconfig.json');
const coreTsConfig = require('../core/tsconfig.json');
const utilsTsConfig = require('../utils/tsconfig.json');

const libsPath = join(__dirname, '..');
const corePath = join(libsPath, 'core');
const utilsPath = join(libsPath, 'utils');

const config: InitialOptionsTsJest = {
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
    ...pathsToModuleNameMapper(coreTsConfig.compilerOptions.paths, {
      prefix: corePath,
    }),
    ...pathsToModuleNameMapper(utilsTsConfig.compilerOptions.paths, {
      prefix: utilsPath,
    }),
    '\\.(scss)$': 'identity-obj-proxy',
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  globals: {
    'ts-jest': {
      tsconfig: `<rootDir>/tsconfig.json`,
      diagnostics: false, // disable error about path aliases in dependencies
    },
  },
};

export default config;
