import * as path from "path";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { merge } from "webpack-merge";
import { commonConfig } from "./config.common";
// import { generateCertificate } from "./generateCertificate";
import { paths } from "./paths";

// const certificate = generateCertificate();

const configDev = merge<Configuration & { devServer?: DevServerConfiguration }>(
  commonConfig("development"),
  {
    devtool: "source-map",

    devServer: {
      static: paths.dist,

      host: "localhost",
      port: 3000,
      historyApiFallback: true,

      // server: {
      //   type: "https",
      //   options: {
      //     key: certificate.privateKey,
      //     cert: certificate.certPEM,
      //   },
      // },
    },

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
  }
);

export { configDev };
export default configDev;
