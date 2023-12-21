require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

export function generateToken(payload: any, expiresIn: string|boolean = false) {
  if (!payload) throw new Error('No payload to generate JWT token.');

  const options = expiresIn ? { expiresIn: expiresIn } : {};
  return jwt.sign(payload, secret, options);
}