import { Configuration } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import tsNameOf from 'ts-nameof';

function tsRule(mode: Configuration['mode']): Configuration {
  return {
    plugins: [new ForkTsCheckerWebpackPlugin()],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                getCustomTransformers: () => ({ before: [tsNameOf] }),
              },
            },
            'import-replace-plugin',
          ],
          exclude: /\.test\.tsx?$/,
        },
      ],
    },
  };
}

export { tsRule };
