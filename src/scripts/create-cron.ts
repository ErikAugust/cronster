require('dotenv').config({ path: '.env.production' });

import { AppDataSource } from '../app-data-source';

import { Cron } from "../entity/cron.entity";
import { User } from "../entity/user.entity";

void async function () {

  await AppDataSource.initialize();

  const user = await User.findOne({ where: { id: 1 } });

  if (!user) throw new Error('User not found');

  const cron = Cron.create({
    title: '2015 Vermont 50K',
    createdAt: new Date(),
    datetime: '2015-09-27 07:00:00',
    image: 'https://pbs.twimg.com/profile_images/1680597835492782081/6DJ_twnf_400x400.jpg',
    description: `1st Place Overall with a time of 4:37:22.`,
    active: true,
    deleted: false,
    public: true,
    slug: '2015-vermont-50',
    user: user
  });

  await cron.save();

  process.exit(0);
}();