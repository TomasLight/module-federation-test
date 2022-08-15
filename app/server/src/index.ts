import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import path from 'path';
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import { handleSpaRoutes } from "./handleSpaRoutes";
import { apiMiddleware } from "./middleware/apiMiddleware";
import { getApiByRequest } from "./middleware/getApiByRequest";


const app = express();
app.disable('x-powered-by');

if (process.env.NODE_ENV === 'development') {
  const devWebpack = require('../../client/webpack/config.dev');
  const compiler = webpack(devWebpack);
  app.use(
    webpackMiddleware(compiler, {
      // webpack-dev-middleware options
    })
  );
}

app.use(compression());
const uiPath = path.join(__dirname, '..', '..', 'dist');

app.use(express.static(uiPath));
app.use(cookieParser());

const httpServer = http.createServer(app);

const hostPort = 8080;
const host = 'localhost';
httpServer.listen(hostPort, host, () => {
  console.log(`Host https://${host}:${hostPort}`);
});

app.use(apiMiddleware(getApiByRequest));
handleSpaRoutes(app, uiPath);