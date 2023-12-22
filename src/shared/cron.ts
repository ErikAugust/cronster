import { Cron } from '../entity/cron.entity';
import { User } from '../entity/user.entity';


export async function getCronBySlug(slug: string, userId: number, isPublic: boolean = true) {
  const results = await Cron.query(`SELECT * FROM Crons WHERE slug = '${slug}' AND public = ${isPublic} AND userId = ${userId}`);

  if (results.length === 0) {
    return null;
  }
  return results[0];
}