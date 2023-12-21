import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { User } from '../../entity/user.entity';

import {
  checkPasswordStrength,
  emailExists,
  usernameExists,
  hashPassword,
} from '../../shared/user';

import { generateToken } from '../../shared/jwt';

export const apiUsersRouter = express.Router();

/**
 * POST /api/users
 * @author Erik August Johnson <erik@cronster.app>
 */
apiUsersRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { email, password, username } = req.body;

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
    user.username = username;
    user.password = hashedPassword;
    user.createdAt = new Date();
    await user.save();

    // Generate JWT:
    const token = generateToken({ id: user.id, email: user.email }, '60d');

    res.json({ message: 'User created successfully!', token });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
