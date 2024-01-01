import { Cron } from '../entity/cron.entity';
import { User } from '../entity/user.entity';
import moment from 'moment';

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


  if (results) {
    results.sharedImage = constructCronImageUrl(results.image, results.datetime);
  }

  return results || null;
}

export async function getCronsByUserId(userId: number): Promise<Cron[]> {
  const results = await Cron.find({ where: { user: { id: userId }, deleted: false }});
  return results || [];
}

export function constructCronImageUrl(image: string | undefined, datetime: string | undefined) {

  if (!image) return '';
  if (!datetime) return '';


  const timeDifference = calculateTimeDifference(datetime);
  const text = encodeURIComponent(`${timeDifference.days} days ${timeDifference.hours} hours ${timeDifference.minutes} minutes`);
  const fontSize = '72';
  const color = 'FFFFFF';
  const transformation = `e_brightness:-50/l_text:Arial_${fontSize}_bold:${text},co_rgb:${color}`;

  const parts = image.split('upload/');
  return parts[0] + 'upload/' + transformation + '/' + parts[1];

}

export function calculateTimeDifference(date: string) {

  const given = moment(date).add(5, 'hours');
  const current = moment();

  const duration = moment.duration(current.diff(given));
  const days = Math.trunc(duration.asDays());

  return {
    date,
    days: Math.abs(days),
    hours: Math.abs(duration.hours()),
    minutes: Math.abs(duration.minutes()),
    seconds: Math.abs(duration.seconds())
  }
}