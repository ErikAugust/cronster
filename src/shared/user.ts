import moment from "moment";
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

export async function getById(id: number, properties: any) {
  return await User.findOne({
    select: properties,
    where: { id }
  });
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

export async function getProfile(username: string) {
  const user = await User.findOne({
    relations: { crons: true },
    where: { username: username }
  });

  // Filter out private crons:
  if (!user) return null;

  if (user.crons && user.crons.length > 0) {
    user.crons = user.crons.filter(cron => cron.public === true && cron.deleted === false);
    user.crons.forEach(cron => {
      cron.date = moment(cron.datetime).format('MMMM Do YYYY');
    });
  }

  return user;
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