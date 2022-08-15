import { merge } from "webpack-merge";
import { commonConfig } from "./config.common";

// todo: do we need any optimizations at all?
//  because of we download app once to mobile and install it
const prodConfig = merge(commonConfig("production"), {
  stats: {
    builtAt: true,
    errors: true,
    errorDetails: true,
    errorStack: true,
  },
  optimization: {
    minimize: true,
    chunkIds: "named",
  },
});

export { prodConfig };
export default prodConfig;
