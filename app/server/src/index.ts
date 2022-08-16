import { logger } from '@libs/utils';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import ConfigApi from './api/env/config';
import { handleSpaRoutes } from './handleSpaRoutes';
import { configDev as devWebpackConfig } from '../../client/webpack/config.dev';

const uiPath = path.join(__dirname, '..', '..', 'dist');

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());

app.use((request, response, next) => {
  logger(request.url);
  next();
});

if (process.env.NODE_ENV === 'development') {
  console.log('attach webpack middleware to the server');
  const compiler = webpack(devWebpackConfig);
  app.use(
    webpackMiddleware(compiler, {
      publicPath: devWebpackConfig.output.publicPath,
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
  app.use(express.static(uiPath));
}

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

if (process.env.NODE_ENV !== 'development') {
  handleSpaRoutes(app, uiPath);
}
