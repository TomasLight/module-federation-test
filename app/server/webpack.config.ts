import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { Configuration, container } from 'webpack';

const { ModuleFederationPlugin } = container;

const serverPath = path.join(__dirname);
const paths = {
  index: path.join(serverPath, 'src', 'index.ts'),
  dist: path.join(serverPath, '..', 'dist'),
  nodeModules: path.join(serverPath, 'node_modules'),
  rootNodeModules: path.join(serverPath, '..', '..', 'node_modules'),
};

const config: Configuration = {
  mode: 'production',
  devtool: false,
  target: 'node',
  context: serverPath,
  entry: {
    server: paths.index,
  },
  output: {
    path: paths.dist,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: [paths.nodeModules, paths.rootNodeModules],
  },
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'server',
      shared: [
        {
          '@libs/utils': {
            import: '@libs/utils',
            // requiredVersion: require('../../../libs/utils/package.json').version,
            requiredVersion: false,
          },
        },
      ],
    }),
  ],
  stats: {
    builtAt: true,
    errorDetails: false,
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        options: {
          // disable type checker, see fork-ts-checker-webpack-plugin readme
          transpileOnly: true,
        },
        test: /\.ts$/,
        type: 'javascript/auto',
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
