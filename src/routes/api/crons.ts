import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import createError from 'http-errors';

import { createCron, getCronsByUserId } from '../../shared/cron';
import { uploadDataUrl } from '../../shared/image';
import { User } from '../../entity/user.entity';

export interface UserRequest extends Request {
  user?: {
    id?: number;
  };
}

export const apiCronsRouter = express.Router();

apiCronsRouter.get('/me', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(400, 'User is not set'));

    res.json({
      success: true,
      crons: await getCronsByUserId(userId)
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

apiCronsRouter.post('/', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(400, 'User is not set'));

    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const cron = req.body.cron;
    if (!cron) return next(createError(400, 'Cron is not set'));

    cron.image = (await uploadDataUrl(cron.image)).secure_url;

    const slug = require('slug');
    cron.slug = slug(cron.title);

    const saved = await createCron(cron, user);

    res.json({
      cron: saved,
      success: true
    });

  } catch (error: any) {
    console.log(error);
    return next(createError(500, error.message));
  }
});