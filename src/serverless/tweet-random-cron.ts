import { Handler } from 'aws-lambda';
import { Rettiwt } from 'rettiwt-api';
import mysql from 'mysql2/promise';

export const handler: Handler = async (event, context) => {

  try {
    const twitter = new Rettiwt({ apiKey: process.env.TWITTER_API_KEY });
    const database = await mysql.createConnection({
      host: process.env.CRONSTER_DB_HOST,
      user: process.env.CRONSTER_DB_USERNAME,
      password: process.env.CRONSTER_DB_PASSWORD,
      database: process.env.CRONSTER_DB_NAME
    });

    const results = await database.query('SELECT * FROM Crons WHERE deleted = 0');
    const cron = getRandomCron(results[0] as any[]);
  
    console.log(cron);
  
    const title = cron.title;
    const slug = cron.slug;
  
    const tweet = `${title} \n\nhttps://cronster.app/@erik/${slug}`;

    const result = await twitter.tweet.tweet(tweet); 
    if (!result) {
      console.error('Tweet failed!');
      return { message: 'Tweet failed for unknown reason' };
    }
    console.log('Tweet succeeded...');
    const { list } = await twitter.user.timeline('211721484');
    console.log(list[0]);

    return {
      tweet
    }
  } catch (error: any) {
    console.error(error);
    return {
      message: error.message
    }
  }
};

function getRandomCron(crons: any[]) {
  return crons[Math.floor(Math.random() * crons.length)];
}