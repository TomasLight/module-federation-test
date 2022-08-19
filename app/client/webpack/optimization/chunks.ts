import { Configuration } from 'webpack';

function chunks(): Configuration {
  function makeLibGroup(name: string) {
    return {
      [name]: {
        name: `libs-${name}`,
        test: new RegExp(`/libs/${name}/`),
      },
    };
  }

  return {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        minSize: 1000,
        cacheGroups: {
          ...makeLibGroup('components'),
          ...makeLibGroup('core'),
          ...makeLibGroup('utils'),
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            minSize: 0,
          },
        },
      },
    },
  };
}

export { chunks };
