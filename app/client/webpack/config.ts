import { merge } from 'webpack-merge';
import { commonConfig } from './config.common';
import { paths } from './paths';

const prodConfig = merge(commonConfig('production'), {
  entry: paths.entryPoint,
  stats: {
    builtAt: true,
    errors: true,
    errorDetails: true,
    errorStack: true,
  },
  optimization: {
    minimize: true,
    chunkIds: 'named',
  },
});

export default prodConfig;
