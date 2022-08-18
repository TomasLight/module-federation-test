import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import { commonConfig } from './config.common';
// import { generateCertificate } from "./generateCertificate"; // implement for https
import { paths } from './paths';

// const certificate = generateCertificate();

const devConfig = merge<Configuration & { devServer?: DevServerConfiguration }>(commonConfig('development'), {
  devtool: 'source-map',

  entry: [
    // connects to the server to receive notifications when the bundle rebuilds and then updates your client bundle accordingly.
    'webpack-hot-middleware/client',

    paths.entryPoint,
  ],
  devServer: {
    static: paths.clientDist,
    historyApiFallback: true,

    // Dev server client for web socket transport, hot and live reload logic
    // disabled, because we configured them manually (in 'entry' above)
    hot: false,
    client: false,

    // server: {
    //   type: "https",
    //   options: {
    //     key: certificate.privateKey,
    //     cert: certificate.certPEM,
    //   },
    // },
  },
  plugins: [new HotModuleReplacementPlugin()],

  stats: {
    builtAt: true,
    errorDetails: true,
    modules: false,

    assets: false,
    dependentModules: false,
    entrypoints: false,
    moduleAssets: false,
    orphanModules: false,
    runtimeModules: false,
    chunks: false,
    relatedAssets: false,
    runtime: false,
  },
});

export { devConfig };
