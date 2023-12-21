import express, { Request, Response } from 'express';
export const signupRouter = express.Router();

signupRouter.get('/', async (req: Request, res: Response): Promise<void> => {

  res.render('signup', { title: 'Signup' });
});