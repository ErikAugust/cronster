import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import passport from 'passport';
import { User } from '../../entity/user.entity';

import {
  checkPasswordStrength,
  emailExists,
  usernameExists,
  hashPassword,
  formatUsername,
  getById,
  getAllById
} from '../../shared/user';

import { generateToken } from '../../shared/jwt';
import { uploadDataUrl } from '../../shared/image';

export interface UserRequest extends Request {
  user?: {
    id?: number;
  };
}

export const apiUsersRouter = express.Router();

apiUsersRouter.get('/me', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(400, 'User is not set'));

    // Get user from database: 
    const user = await getById(userId, { username: true, email: true, createdAt: true, bio: true, image: true });

    res.json({
      success: true,
      user: {
        ...user,
        token: req.headers.authorization?.replace('Bearer ', '')
      } 
    
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

apiUsersRouter.put('/', passport.authenticate('jwt', { session: false }), async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createError(400, 'User is not set'));

    // Get user from database: 
    const user = await getAllById(userId);

    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    // Update user:
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.bio = req.body.bio;
    
    if (!req.body.image) {
      delete req.body.image;
    } else {
      user.image = (await uploadDataUrl(req.body.image)).secure_url;
    }
    
    await user.save();

    res.json({
      success: true,
      user: {
        ...user,
        token: req.headers.authorization?.replace('Bearer ', '')
      } 
    
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

});

/**
 * POST /api/users
 * @author Erik August Johnson <erik@cronster.app>
 */
apiUsersRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { email, password, username } = req.body.user;

    if (!email) return next(createError(400, 'Email is not set.'));
    if (!username) return next(createError(400, 'Username is not set.'));
    if (!password) return next(createError(400, 'Password is not set.'));

    // Password cannot be over 100 characters:
    if (password.length > 100) return next(createError(400, 'Password cannot be over 100 characters.'));

    // Check email format:
    if (!require('is-email')(email)) return next(createError(400, 'Email is not valid.'));

    // Check password strength:
    if (checkPasswordStrength(password) < 1) return next(createError(400, 'Password is not strong enough.'));

    // Check email availability:
    const emailAlreadyExists = await emailExists(email);
    if (emailAlreadyExists) return next(createError(400, 'Email already exists in system.'));

    // Check username availability:
    const usernameAlreadyExists = await usernameExists(username);
    if (usernameAlreadyExists) return next(createError(400, 'Username already exists in system.'));

    /// Hash password:
    const hashedPassword = await hashPassword(password);
    
    // Create user:
    const user = new User();
    user.email = email;
    user.username = formatUsername(username);
    user.password = hashedPassword;
    user.createdAt = new Date();
    user.image = user.image || 'https://res.cloudinary.com/dlbanxk4a/image/upload/v1704059789/user-default_xkfhfh.png';
    await user.save();

    // Generate JWT:
    const token = generateToken({ id: user.id, email: user.email }, '60d');

    res.json({ message: 'User created successfully!', user: {
      id: user.id,
      email: user.email,
      username: user.username,
      token
    } });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
