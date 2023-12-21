require('dotenv').config();

import { DataSource } from 'typeorm';
import { Subscription } from './entity/subscription.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Subscription],
    logging: true,
    synchronize: true,
});