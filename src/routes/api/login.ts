import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { generateToken } from '../../shared/jwt';
import { getByEmailOrUsername, verifyPassword } from '../../shared/user';

export const apiLoginRouter = express.Router();

/**
 * POST /api/login
 * @author Erik August Johnson <erik@cronster.app>
 */
apiLoginRouter.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { emailOrUsername, password } = req.body.user;

    let user = await getByEmailOrUsername(emailOrUsername);
    if (!user) return next(createError(400, 'User not found.'));
    if (!password) return next(createError(400, 'Password is not set.'));

    // Check password:
    if (await verifyPassword(password, user.password)) { 
      // Generate JWT:
      const token = generateToken({ id: user.id, email: user.email }, '60d');

      res.json({ 
        message: 'User logged in successfully.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          token
        }
    });
    } else {
      return next(createError(404, 'Incorrect username/email and/or password.'));
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
