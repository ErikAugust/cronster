import express, { Request, Response } from 'express';
export const loginRouter = express.Router();

loginRouter.get('/', async (req: Request, res: Response): Promise<void> => {

  res.render('login', { title: 'Login' });
});