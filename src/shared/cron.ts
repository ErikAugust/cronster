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

export async function getCronById(id: number, userId: number): Promise<Cron | null> {
  const cron = await Cron.findOne({ where: { id, user: { id: userId } }});
  return cron || null;
}

export async function getCronBySlug(slug: string, userId: number, isPublic: boolean = true) {
  const results = await Cron.findOne({ relations: { user: true }, where: { slug, user: { id: userId }, public: isPublic, deleted: false }});

  return results || null;
}

export async function getCronsByUserId(userId: number): Promise<Cron[]> {
  const results = await Cron.find({ where: { user: { id: userId }, deleted: false }});
  return results || [];
}