import { User } from "../entity/user.entity";
import { passwordStrength } from 'check-password-strength';

const bcrypt = require('bcrypt');

const reservedUsernames = [
  'test',
  'fuck',
  'shit'
];

export async function verifyPassword(password: string | undefined, hash: string | undefined) {
  return await bcrypt.compare(password, hash);
}


export function checkPasswordStrength(password: string) {
  return passwordStrength(password).id;
}

export async function hashPassword(password: string) {
  const rounds = 10;
  return await bcrypt.hash(password, rounds);
}

/**
 * Formats to spec: no spaces, all lowercase
 */
export function formatUsername(username: string) {
  if (!username) return '';
  if (typeof username !== 'string') return '';
  return username
      .toLowerCase()
      .replace(/\s/g,'')
      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}

export async function getByEmailOrUsername(emailOrUsername: string) {
  if (require('is-email')(emailOrUsername)) {
    return await User.findOne({
      where: { email: emailOrUsername }
    });
  } else {
    return await User.findOne({
      where: { username: formatUsername(emailOrUsername) }
    });
  }
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