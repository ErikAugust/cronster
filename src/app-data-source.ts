import { DataSource } from 'typeorm';
import { Subscription } from './entity/subscription.entity';
import { User } from './entity/user.entity';
import { Cron } from './entity/cron.entity';
import { CronPost } from './entity/cron-post.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Subscription, User, Cron, CronPost],
    logging: true,
    synchronize: true,
});