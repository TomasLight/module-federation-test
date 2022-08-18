import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import ConfigApi from './api/env/config';
import { handleSpaRoutes } from './handleSpaRoutes';

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());

const httpServer = http.createServer(app);

const hostPort = 3000;
const host = 'localhost';
httpServer.listen(hostPort, host, () => {
  console.log(`Host http://${host}:${hostPort}`);
});

app.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.url.includes('/api/env/config')) {
    return next();
  }

  new ConfigApi(request, response).use();
});

if (process.env.NODE_ENV === 'development') {
  const { devConfig } = require('../../client/webpack/config.dev') as { devConfig: WebpackConfiguration };
  const compiler = webpack(devConfig);

  app.use(
    webpackMiddleware(compiler, {
      publicPath: devConfig.output.publicPath,
    })
  );

  app.use(
    hotMiddleware(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    })
  );
} else {
  const distPathWhenCompiled = path.join(__dirname, '..', '..');
  const uiPath = path.join(distPathWhenCompiled, 'client');

  app.use(express.static(uiPath));
  handleSpaRoutes(app, uiPath);
}
