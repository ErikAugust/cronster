import { User } from "../entity/user.entity";
import { passwordStrength } from 'check-password-strength';

const reservedUsernames = [
  'test'
];

export function checkPasswordStrength(password: string) {
  return passwordStrength(password).id;
}

export async function hashPassword(password: string) {
  const bcrypt = require('bcrypt');
  const rounds = 10;
  return await bcrypt.hash(password, rounds);
}

export async function emailExists(email: string) {
  if (!email) throw new Error('Email is not set');

  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  return !!user;
}

/**
 * Returns true if user with username exists
 * @param {string} username
 */
export async function usernameExists(username: string) {
  if (!username) throw new Error('No username provided.');

  // Do not allow registration of reserved usernames:
  if (reservedUsernames.includes(username)) {
      return true;
  }

  const user = await User.findOne({
      where: { username: username }
  });
  return user ? true : false;
}