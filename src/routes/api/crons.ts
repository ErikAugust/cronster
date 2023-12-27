import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import createError from 'http-errors';

import { createCron, getCronsByUserId, deleteCron, getCronById } from '../../shared/cron';
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


apiCronsRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(401));

    const id = parseInt(req.params.id);
    if (!id) return next(createError(400));

    const cron = await getCronById(id, userId);
    if (!cron) return next(createError(404));
    
    const updated = req.body.cron;
    if (!updated) return next(createError(400, 'Cron is not set'));

    if (!updated.image) {
      delete updated.image;
    } else {
      updated.image = (await uploadDataUrl(updated.image)).secure_url;
    }

    Object.assign(cron, updated);
    await cron.save();

    res.json({ cron: cron, success: true });

  } catch (error: any) {
    console.log(error);
    return next(createError(500, error.message));
  }
});

apiCronsRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(401));

    const id = parseInt(req.params.id);
    if (!id) return next(createError(400));

    const result = await deleteCron(id, userId);
    if (result.affectedRows === 0) return next(createError(404));

    if (result.affectedRows >= 1) {
      res.json({
        success: true,
        message: 'Cron deleted successfully.'
      });
    }

  } catch (error: any) {
    console.log(error);
    return next(createError(500, error.message));
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