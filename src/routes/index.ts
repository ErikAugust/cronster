import express, { Request, Response } from 'express';
export const indexRouter = express.Router();

indexRouter.get('/', async (req: Request, res: Response): Promise<void> => {

  res.render('index', { title: 'For life\'s events', layout: 'splash.hbs' });
});