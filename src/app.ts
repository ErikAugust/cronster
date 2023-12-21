import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import hbs from 'express-handlebars';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import 'reflect-metadata';

import { indexRouter } from './routes/index';
import { apiSubscriptionsRouter } from './routes/api/subscriptions';

import { AppDataSource } from './app-data-source';

dotenv.config();

async function startServer() {
  await AppDataSource.initialize();
  const app: Express = express();
  const port = process.env.PORT || 3000;

  // view engine setup
  app.engine('hbs', hbs({
    partialsDir  : [
      //  path to your partials
      path.join(__dirname, '../views/partials'),
    ],
    extname: 'hbs',
    defaultLayout: 'default',
    helpers: {
      ifEquals: function(arg1: string, arg2: string, options: any) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      }
    }
  }));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'hbs');
  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.use('/', indexRouter);
  app.use('/api/subscriptions', apiSubscriptionsRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  app.use(async (error: any, request: Request, response: Response, next: NextFunction) => {
    console.log('An error has occurred: ', error.message);
  
    response.status(error.status || 500);
  
    if (request.originalUrl.startsWith('/api')) {
      return response.json({ message: error.message });
    } else {
      return response.render('error', { ...error });
    }
  });
  
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

startServer();