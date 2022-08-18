import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, container, ProgressPlugin, ResolvePluginInstance } from 'webpack';
import { merge } from 'webpack-merge';
import { paths } from './paths';
import { cssRule, fontRule, svgRule, tsRule } from './rules';

const { ModuleFederationPlugin } = container;

type ModuleFederationOptions = ConstructorParameters<typeof ModuleFederationPlugin>[0];
type InferArray<T> = T extends Array<infer Item> ? Item : never;
type TsLib = {
  resolvePlugin: ResolvePluginInstance;
  options: InferArray<ModuleFederationOptions['shared']>;
};

function makeTsLib(name: string): TsLib {
  return {
    resolvePlugin: new TsconfigPathsPlugin({
      configFile: path.join(paths.libs, name, 'tsconfig.json'),
      logLevel: 'INFO',
      mainFields: ['browser', 'module', 'main'],
    }),

    options: {
      [`@libs/${name}`]: {
        import: `@libs/${name}`,
        requiredVersion: false,
      },
    },
  };
}

const tsLibs = [
  //
  makeTsLib('components'),
  makeTsLib('core'),
  makeTsLib('utils'),
];

const commonConfig = (mode: Configuration['mode']): Configuration => {
  return merge<Configuration>(
    {
      mode,
      target: 'web',
      output: {
        path: paths.clientDist,
        publicPath: '/',
      },

      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: [...tsLibs.map((lib) => lib.resolvePlugin)],
      },

      plugins: [
        new ProgressPlugin(),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: paths.public,
              to: paths.clientDist,
              filter: (filepath) => !filepath.endsWith('index.html'),
            },
          ],
        }),
        new HtmlWebpackPlugin({
          template: paths.join(paths.public, 'index.html'),
          filename: paths.join(paths.clientDist, 'index.html'),
          inject: 'body',
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
            ...tsLibs.map((lib) => lib.options),
          ],
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
