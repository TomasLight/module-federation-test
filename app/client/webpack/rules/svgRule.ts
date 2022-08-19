import { Configuration } from 'webpack';

function svgRule(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.svg/,
          type: 'asset/inline',
        },
      ],
    },
  };
}

export { svgRule };
