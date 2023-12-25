import { Cron } from '../entity/cron.entity';
import { User } from '../entity/user.entity';

interface CreateCronInterface {
  datetime: string;
  title: string;
  image: string;
  description: string;
  active: boolean;
  deleted: boolean;
  public: boolean;
  slug: string;
}

export async function deleteCron(id: number, userId: number) {
  return await Cron.query(`UPDATE Crons SET deleted = 1 WHERE id = ${id} AND userId = ${userId}`);
}

export async function createCron(cron: CreateCronInterface, user: User) {
  return await Cron.create({
    ...cron,
    createdAt: new Date(),
    active: true,
    deleted: false,
    public: true,
    user: user
  }).save();
}

export async function getCronBySlug(slug: string, userId: number, isPublic: boolean = true) {
  const results = await Cron.query(`SELECT * FROM Crons WHERE slug = '${slug}' AND public = ${isPublic} AND userId = ${userId}`);

  if (results.length === 0) {
    return null;
  }
  return results[0];
}

export async function getCronsByUserId(userId: number) {
  const results = await Cron.query(`SELECT * FROM Crons WHERE userId = ${userId} AND deleted = 0 ORDER BY createdAt DESC`);

  if (results.length === 0) {
    return [];
  }
  return results;
}