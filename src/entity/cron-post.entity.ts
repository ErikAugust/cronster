import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Cron } from './cron.entity';

@Entity('CronPosts')
export class CronPost extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('datetime')
    createdAt?: Date;

    @Column('longtext')
    body?: string;

    @Column()
    image?: string;

    @Column({ default: true })
    active?: boolean;

    @Column({ default: false })
    deleted?: boolean;

    @Column({ default: true })
    public?: boolean;

    @ManyToOne(() => Cron, (cron) => cron.posts)
    cron?: Cron

}