import { merge } from 'webpack-merge';
import { commonConfig } from './config.common';
import { chunks } from './optimization';
import { paths } from './paths';

const prodConfig = merge(
  commonConfig('production'),
  {
    entry: paths.entryPoint,
    stats: {
      builtAt: true,
      errors: true,
      errorDetails: true,
      errorStack: true,
    },
    optimization: {
      minimize: true,
    },
  },
  chunks()
);

export default prodConfig;
