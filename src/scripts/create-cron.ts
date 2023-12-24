require('dotenv').config({ path: '.env.production' });

import { AppDataSource } from '../app-data-source';

import { Cron } from "../entity/cron.entity";
import { User } from "../entity/user.entity";

void async function () {

  await AppDataSource.initialize();

  const user = await User.findOne({ where: { id: 1 } });

  if (!user) throw new Error('User not found');

  const cron = Cron.create({
    title: 'Christmas 2023',
    createdAt: new Date(),
    datetime: '2023-12-25 03:00:00',
    image: 'https://res.cloudinary.com/dlbanxk4a/image/upload/v1703423148/mm4akgwb8ltrfzcmenwq.png',
    description: `A count down to Christmas (on the West Coast)!`,
    active: true,
    deleted: false,
    public: true,
    slug: 'christmas-2023',
    user: user
  });

  await cron.save();

  process.exit(0);
}();