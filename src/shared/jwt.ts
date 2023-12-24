require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const passportJWT = require('passport-jwt');
const createError = require('http-errors');

interface User {
  id?: number;
}

export const strategy = new passportJWT.Strategy({
  secretOrKey: secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken() },
   async (payload: User, next: any) => {

  const userId = payload.id;
  if (!userId) return next(createError(401));

  return next(null, payload);
});

export function generateToken(payload: any, expiresIn: string|boolean = false) {
  if (!payload) throw new Error('No payload to generate JWT token.');

  const options = expiresIn ? { expiresIn: expiresIn } : {};
  return jwt.sign(payload, secret, options);
}