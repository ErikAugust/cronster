import express, { NextFunction, Request, Response } from 'express';
import { User } from '../entity/user.entity';
import { getByEmailOrUsername, getProfile} from '../shared/user';
import createError from 'http-errors';
import { getCronBySlug } from '../shared/cron';
import moment from 'moment';

export const indexRouter = express.Router();

indexRouter.get('/', async (req: Request, res: Response): Promise<void> => {

  res.render('index', { title: 'For life\'s events', layout: 'splash.hbs' });
});


indexRouter.get('/@:username', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params = req.params;
  const username = params.username;

  const user = await getProfile(username);
  if (!user) {
    return next(createError(404, 'No user found'));
  }

  res.render('profile', { 
    ...user,
    title: `Profile for @${username}`, 
    username,
    layout: 'default.hbs'
   });
});


indexRouter.get('/@:username/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params = req.params;
  const username = params.username;
  const slug = params.slug;

  try {
    const user = await getByEmailOrUsername(username);

    if (!user) {
      return next(createError(404, 'No user found'));
    }
  
    if (user.id) {
      const cron = await getCronBySlug(slug, user.id, true);
  
      if (!cron) {
        return next(createError(404, 'No cron found'));
      }
  
      const datetime = moment(cron.datetime).format('YYYY/MM/DD HH:mm:ss');
  
      res.render('cron', { 
        ...cron,
        datetime,
        layout: 'splash.hbs',
        cron: true
       });
    }
  } catch (error: any) {
    console.log(error);
    return next(createError(500, error.message));
  }
});

