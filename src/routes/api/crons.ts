import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import createError from 'http-errors';

import { createCron, createCronPost, getCronsByUserId, deleteCron, getCronById } from '../../shared/cron';
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

apiCronsRouter.post('/:id/posts', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(400, 'User is not set'));

    const cronId = req.params.id;
    if (!cronId) return next(createError(400, 'Cron ID is not set'));

    const cron = await getCronById(parseInt(cronId), userId);
    if (!cron) return next(createError(404, 'Cron not found'));

    const post = req.body.post;
    if (!post) return next(createError(400, 'Post is not set'));

    if (post.image) {
      post.image = (await uploadDataUrl(post.image)).secure_url;
    } else {
      // Fallback to default background image:
      post.image = 'https://res.cloudinary.com/dlbanxk4a/image/upload/v1704056637/uhpqo74n5pfawj78gxlx.png';
    }

    const metadata = await createCronPost(post, cron);
    delete metadata.cron;

    res.json({
      post: {
        ...metadata,
        ...post,
      },
      success: true
    });

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

    if (cron.image) {
      cron.image = (await uploadDataUrl(cron.image)).secure_url;
    } else {
      // Fallback to default background image:
      cron.image = 'https://res.cloudinary.com/dlbanxk4a/image/upload/v1704056637/uhpqo74n5pfawj78gxlx.png';
    }

    // TODO: Check if slug exists, if so, append a number to the end of it:
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