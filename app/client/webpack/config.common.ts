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
type SharedModule = {
  sharedConfig: InferArray<ModuleFederationOptions['shared']>;

  // if module has "paths" in its tsconfig.json, so you should add plugin to support them
  typescriptPathAliasesResolvePlugin?: ResolvePluginInstance;
};

const makeLibsModule = (name: string) =>
  makeSharedModule({
    parentFolderName: 'libs',
    name: name,
    hasPathsInTsConfig: true,
  });

const makePagesModule = (name: string) =>
  makeSharedModule({
    parentFolderName: 'pages',
    name: name,
    hasPathsInTsConfig: false,
  });

function makeSharedModule(params: {
  parentFolderName: string;
  name: string;
  hasPathsInTsConfig: boolean;
}): SharedModule {
  const { parentFolderName, name, hasPathsInTsConfig } = params;

  // assumption, that all modules called in @<folder>/<name> pattern
  // '@libs/core' or '@pages/welcome' etc..
  const moduleNameInPackageJson = `@${parentFolderName}/${name}`;

  const sharedModule: SharedModule = {
    sharedConfig: {
      [moduleNameInPackageJson]: {
        import: moduleNameInPackageJson,
        requiredVersion: false, // check or not the package version
      },
    },
  };

  if (hasPathsInTsConfig) {
    sharedModule.typescriptPathAliasesResolvePlugin = new TsconfigPathsPlugin({
      configFile: path.join(paths.repoRoot, parentFolderName, name, 'tsconfig.json'),
      logLevel: 'INFO',
      mainFields: ['browser', 'module', 'main'],
    });
  }

  return sharedModule;
}

const sharedModules = [
  makeLibsModule('components'),
  makeLibsModule('core'),
  makeLibsModule('utils'),
  //
  makePagesModule('about'),
  makePagesModule('welcome'),
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
        plugins: [...sharedModules.map((module) => module.typescriptPathAliasesResolvePlugin).filter(Boolean)],
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
                singleton: true, // only a single version of the shared module is allowed
              },
            },
            {
              'react-dom': {
                import: 'react-dom',
                requiredVersion: false,
                singleton: true, // only a single version of the shared module is allowed
              },
            },
            ...sharedModules.map((module) => module.sharedConfig),
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
