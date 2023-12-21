import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { Subscription } from '../../entity/subscription.entity';

export const apiSubscriptionsRouter = express.Router();

/**
 * API endpoint for subscribing to the Cronster newsletter.
 * POST /api/subscriptions
 * @author Erik August Johnson <erik@cronster.app>
 */
apiSubscriptionsRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const email = req.body.email;
    if (!email) return next(createError(400, 'Email is not set.'));

    // Create subscription:
    const subscription = new Subscription();
    subscription.email = email;
    subscription.createdAt = new Date();
    subscription.ipAddress = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await subscription.save();

    res.json({ message: 'You have successfully subscribed!', sendStatus: 1 });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message, sendStatus: 0 });
  }
});