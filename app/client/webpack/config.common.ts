import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, container, ProgressPlugin } from 'webpack';
import { merge } from 'webpack-merge';
// import { ImportReplacePlugin } from 'import-replace-plugin';

import { paths } from './paths';
import { cssRule, fontRule, svgRule, tsRule } from './rules';

const { ModuleFederationPlugin } = container;

const commonConfig = (mode: Configuration['mode']): Configuration => {
  return merge<Configuration>(
    {
      mode,
      target: 'web',
      output: {
        path: paths.dist,
        publicPath: '/',
      },

      entry: path.join(paths.application, 'src', 'index.tsx'),
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        // alias: {
        //   '~': [
        //     //
        //     paths.join(paths.libs, 'components', 'src'),
        //     paths.join(paths.libs, 'core', 'src'),
        //   ],
        //   // '~': paths.join(paths.libs, 'components', 'src'),
        // },
        modules: [
          // paths.join(paths.libs, 'components', 'src'),
          // paths.join(paths.libs, 'core', 'src'),
          paths.nodeModules,
          paths.rootNodeModules,
        ],
        plugins: [
          // new ImportReplacePlugin(),
          new TsconfigPathsPlugin({
            configFile: path.join(paths.libs, 'components', 'tsconfig.json'),
            logLevel: 'INFO',
            mainFields: ['browser', 'module', 'main'],
          }),
          new TsconfigPathsPlugin({
            configFile: path.join(paths.libs, 'core', 'tsconfig.json'),
            logLevel: 'INFO',
            mainFields: ['browser', 'module', 'main'],
          }),
        ],
      },

      plugins: [
        new ProgressPlugin(),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: paths.public,
              to: paths.dist,
              filter: (filepath) => !filepath.endsWith('index.html'),
            },
          ],
        }),
        new ModuleFederationPlugin({
          name: 'client',
          shared: [
            {
              react: {
                import: 'react',
                requiredVersion: false,
              },
            },
            {
              'react-dom': {
                import: 'react-dom',
                requiredVersion: false,
              },
            },
            {
              '@libs/utils': {
                import: '@libs/utils',
                // requiredVersion: require('../../../libs/utils/package.json').version,
                requiredVersion: false,
              },
            },
            {
              '@libs/core': {
                import: '@libs/core',
                // requiredVersion: require('../../../libs/core/package.json').version,
                requiredVersion: false,
              },
            },
            {
              '@libs/components': {
                import: '@libs/components',
                // requiredVersion: require('../../../libs/components/package.json').version,
                requiredVersion: false,
              },
            },
            {
              '@libs/import-replace-plugin': {
                import: '@libs/import-replace-plugin',
                // requiredVersion: require('../../../libs/components/package.json').version,
                requiredVersion: false,
              },
            },
          ],
        }),
        new HtmlWebpackPlugin({
          template: paths.join(paths.public, 'index.html'),
          filename: paths.join(paths.dist, 'index.html'),
          inject: 'body',
        }),
      ],

      stats: {
        colors: true,
      },

      optimization: {
        runtimeChunk: false,
        splitChunks: false,
        usedExports: true,
      },
    },
    fontRule(),
    cssRule(mode),
    svgRule(),
    tsRule(mode)
  );
};

export { commonConfig };
