import { Configuration } from 'webpack';

function fontRule(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.(ttf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[ext]',
          },
        },
      ],
    },
  };
}

export { fontRule };
